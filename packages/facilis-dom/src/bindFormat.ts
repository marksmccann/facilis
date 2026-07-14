import type { Format, TextState } from 'facilis';
import resolveInput from './resolveInput';

/**
 * Writes one format result back to the input element.
 *
 * @private
 */
function updateInput(
    input: HTMLInputElement,
    result: ReturnType<Format['onInput']>
) {
    input.value = result.value;

    if (result.selectionStart !== null && result.selectionEnd !== null) {
        input.setSelectionRange(result.selectionStart, result.selectionEnd);
    }
}

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
 * Binds a format instance to an input element or selector and applies
 * formatting on `input` and `blur`.
 *
 * @since 0.1.0
 */
export function bindFormat(
    target: Element | string,
    format: Format
): () => void {
    const input = resolveInput(target);
    let textState: TextState = format.onMount(readTextState(input));

    const handleSelectionChange = () => {
        textState = readTextState(input);
    };

    const handleInput = (event: InputEvent) => {
        const inputDetails = {
            inputType: event.inputType ?? null,
            data: event.data ?? null,
        };

        textState = format.onInput(
            inputDetails,
            textState,
            readTextState(input)
        );

        updateInput(input, textState);
    };

    const handleBlur = () => {
        textState = format.onBlur(readTextState(input));
        updateInput(input, textState);
    };

    updateInput(input, textState);

    document.addEventListener('selectionchange', handleSelectionChange);
    input.addEventListener('input', handleInput);
    input.addEventListener('blur', handleBlur);

    return () => {
        document.removeEventListener('selectionchange', handleSelectionChange);
        input.removeEventListener('input', handleInput);
        input.removeEventListener('blur', handleBlur);
    };
}
