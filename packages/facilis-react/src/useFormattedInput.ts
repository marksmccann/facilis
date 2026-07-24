import type { Format, InputDetails, TextState } from 'facilis';
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type FocusEventHandler,
    type InputEventHandler,
} from 'react';
import { useUncontrolledProp } from 'uncontrollable';
import type {
    UseFormattedInputOptions,
    UseFormattedInputResult,
} from './types';

/**
 * Creates props for a React-managed input backed by a Facilis format.
 *
 * The hook accepts a format instance and keeps the input value synchronized
 * through Facilis' `onMount`, `onInput`, and `onBlur` runtime hooks.
 *
 * @since 0.1.0
 */
export function useFormattedInput(
    format: Format,
    options: UseFormattedInputOptions = {}
): UseFormattedInputResult {
    const {
        onInput,
        onBlur,
        onValueChange,
        value: _value,
        defaultValue: _defaultValue = '',
    } = options;
    const { current: initialValue } = useRef(_value ?? _defaultValue);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const didResolveInitialValueRef = useRef(false);
    const [initialTextState] = useState(() => {
        return format.onMount({
            value: initialValue,
            selectionStart: null,
            selectionEnd: null,
        });
    });
    const [value, setValue] = useUncontrolledProp<string>(
        _value,
        initialTextState.value,
        onValueChange
    );
    const [selection, setSelection] = useState<
        Pick<TextState, 'selectionStart' | 'selectionEnd'>
    >({
        selectionStart: initialTextState.selectionStart,
        selectionEnd: initialTextState.selectionEnd,
    });
    const textState: TextState = {
        value,
        selectionStart: selection.selectionStart,
        selectionEnd: selection.selectionEnd,
    };

    useEffect(() => {
        if (didResolveInitialValueRef.current) return;
        didResolveInitialValueRef.current = true;

        if (initialTextState.value !== initialValue) {
            setValue(initialTextState.value);
        }
    }, [initialTextState.value, initialValue, setValue]);

    const setTextState = useCallback(
        (previous: TextState, current: TextState) => {
            setSelection({
                selectionStart: current.selectionStart,
                selectionEnd: current.selectionEnd,
            });

            if (current.value !== previous.value) {
                setValue(current.value);
            }
        },
        [setValue]
    );

    const onSelectionChange = useCallback(() => {
        const input = inputRef.current;
        if (input === null) return;

        setSelection({
            selectionStart: input.selectionStart,
            selectionEnd: input.selectionEnd,
        });
    }, []);

    const handleInput = useCallback<InputEventHandler<HTMLInputElement>>(
        (event) => {
            const input = event.currentTarget;
            const previous = textState;
            const inputEvent = event.nativeEvent as InputEvent;
            const inputDetails: InputDetails = {
                inputType: inputEvent.inputType ?? null,
                data: inputEvent.data ?? null,
            };
            const current: TextState = {
                value: input.value,
                selectionStart: input.selectionStart,
                selectionEnd: input.selectionEnd,
            };
            const next = format.onInput(inputDetails, previous, current);

            onInput?.(event);
            setTextState(previous, next);
        },
        [setTextState, format, onInput, textState]
    );

    const handleBlur = useCallback<FocusEventHandler<HTMLInputElement>>(
        (event) => {
            const input = event.currentTarget;
            const previous = textState;
            const current: TextState = {
                value: input.value,
                selectionStart: input.selectionStart,
                selectionEnd: input.selectionEnd,
            };
            const next = format.onBlur(current);

            onBlur?.(event);
            setTextState(previous, next);
        },
        [setTextState, format, onBlur, textState]
    );

    useEffect(() => {
        document.addEventListener('selectionchange', onSelectionChange);

        return () => {
            document.removeEventListener('selectionchange', onSelectionChange);
        };
    }, [onSelectionChange]);

    useLayoutEffect(() => {
        const input = inputRef.current;
        const { selectionStart, selectionEnd } = textState;

        if (input === null) return;

        if (selectionStart !== null && selectionEnd !== null) {
            input.setSelectionRange(selectionStart, selectionEnd);
        }
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
