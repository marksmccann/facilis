import type { Format, InputSnapshot } from 'facilis';
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
 * Binds a format instance to an input element or selector and applies
 * formatting on `input` and `blur`.
 *
 * @since 0.0.1
 */
export function bindFormat(
    target: Element | string,
    format: Format
): () => void {
    const input = resolveInput(target);
    let inputSnapshot: InputSnapshot = format.onMount({
        value: input.value,
        selectionStart: input.selectionStart,
        selectionEnd: input.selectionEnd,
    });

    const handleInput = (event: InputEvent) => {
        const inputType = event.inputType ?? null;

        inputSnapshot = format.onInput(inputType, inputSnapshot, {
            value: input.value,
            selectionStart: input.selectionStart,
            selectionEnd: input.selectionEnd,
        });

        updateInput(input, inputSnapshot);
    };

    const handleBlur = () => {
        inputSnapshot = format.onBlur({
            value: input.value,
            selectionStart: input.selectionStart,
            selectionEnd: input.selectionEnd,
        });

        updateInput(input, inputSnapshot);
    };

    updateInput(input, inputSnapshot);

    input.addEventListener('input', handleInput);
    input.addEventListener('blur', handleBlur);

    return () => {
        input.removeEventListener('input', handleInput);
        input.removeEventListener('blur', handleBlur);
    };
}
