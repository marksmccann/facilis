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
    let textState: TextState = format.onMount({
        value: input.value,
        selectionStart: input.selectionStart,
        selectionEnd: input.selectionEnd,
    });

    const syncTextState = () => {
        textState = {
            value: input.value,
            selectionStart: input.selectionStart,
            selectionEnd: input.selectionEnd,
        };
    };

    const handleInput = (event: InputEvent) => {
        textState = format.onInput(
            {
                inputType: event.inputType ?? null,
                data: event.data ?? null,
            },
            textState,
            {
                value: input.value,
                selectionStart: input.selectionStart,
                selectionEnd: input.selectionEnd,
            }
        );

        updateInput(input, textState);
    };

    const handleBlur = () => {
        textState = format.onBlur({
            value: input.value,
            selectionStart: input.selectionStart,
            selectionEnd: input.selectionEnd,
        });

        updateInput(input, textState);
    };

    updateInput(input, textState);

    document.addEventListener('selectionchange', syncTextState);
    input.addEventListener('input', handleInput);
    input.addEventListener('blur', handleBlur);

    return () => {
        document.removeEventListener('selectionchange', syncTextState);
        input.removeEventListener('input', handleInput);
        input.removeEventListener('blur', handleBlur);
    };
}
