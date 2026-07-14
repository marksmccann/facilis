import type { InputDetails, TextState } from 'facilis';
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type FocusEventHandler,
    type InputEventHandler,
} from 'react';
import type { FormatFactory, UseFormatOptions, UseFormatResult } from './types';

/**
 * Reads the current input value and selection.
 *
 * @private
 */
function readTextState(input: HTMLInputElement): TextState {
    return {
        value: input.value,
        selectionStart: input.selectionStart,
        selectionEnd: input.selectionEnd,
    };
}

/**
 * Writes one Facilis selection result back to the input element.
 *
 * @private
 */
function writeSelection(input: HTMLInputElement, state: TextState) {
    if (state.selectionStart !== null && state.selectionEnd !== null) {
        input.setSelectionRange(state.selectionStart, state.selectionEnd);
    }
}

/**
 * Reads the native input details React exposes through `nativeEvent`.
 *
 * @private
 */
function readInputDetails(event: Event): InputDetails {
    const inputEvent = event as InputEvent;

    return {
        inputType: inputEvent.inputType ?? null,
        data: inputEvent.data ?? null,
    };
}

/**
 * Creates props for a React-managed input backed by a Facilis format.
 *
 * The hook accepts a format factory, passes the initial non-reserved options to
 * it, and keeps the input value synchronized through Facilis' `onMount`,
 * `onInput`, and `onBlur` runtime hooks.
 *
 * @since 0.1.0
 */
export function useFormat<FormatOptions extends object = object>(
    createFormat: FormatFactory<FormatOptions>,
    options: UseFormatOptions<FormatOptions> = {} as UseFormatOptions<FormatOptions>
): UseFormatResult {
    const {
        defaultValue: _defaultValue = '',
        onInput,
        onBlur,
        onValueChange,
        ...formatOptions
    } = options;
    const { current: defaultValue } = useRef(_defaultValue);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [format] = useState(() =>
        createFormat(formatOptions as FormatOptions)
    );
    const [textState, setTextState] = useState(() => {
        return format.onMount({
            value: defaultValue,
            selectionStart: null,
            selectionEnd: null,
        });
    });

    const notifyValueChange = useCallback(
        (previous: TextState, current: TextState) => {
            if (current.value !== previous.value) {
                onValueChange?.(current.value);
            }
        },
        [onValueChange]
    );

    const onSelectionChange = useCallback(() => {
        const input = inputRef.current;
        if (input === null) return;

        setTextState((current) => ({
            ...current,
            selectionStart: input.selectionStart,
            selectionEnd: input.selectionEnd,
        }));
    }, []);

    const handleInput = useCallback<InputEventHandler<HTMLInputElement>>(
        (event) => {
            const input = event.currentTarget;
            const previous = textState;
            const current = readTextState(input);
            const inputDetails = readInputDetails(event.nativeEvent);
            const next = format.onInput(inputDetails, previous, current);

            onInput?.(event);
            setTextState(next);
            notifyValueChange(previous, next);
        },
        [format, notifyValueChange, onInput, textState]
    );

    const handleBlur = useCallback<FocusEventHandler<HTMLInputElement>>(
        (event) => {
            const input = event.currentTarget;
            const previous = textState;
            const next = format.onBlur(readTextState(input));

            onBlur?.(event);
            setTextState(next);
            notifyValueChange(previous, next);
        },
        [format, notifyValueChange, onBlur, textState]
    );

    useEffect(() => {
        document.addEventListener('selectionchange', onSelectionChange);

        return () => {
            document.removeEventListener('selectionchange', onSelectionChange);
        };
    }, [onSelectionChange]);

    useLayoutEffect(() => {
        const input = inputRef.current;
        if (input === null) return;
        writeSelection(input, textState);
    }, [textState]);

    return {
        inputRef,
        inputProps: {
            ref: inputRef,
            value: textState.value,
            onInput: handleInput,
            onBlur: handleBlur,
        },
    };
}
