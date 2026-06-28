import type { Facilis } from 'facilis';

/**
 * Binds a format instance to an input element and applies formatting on
 * `input` and `blur`.
 * @since 0.0.1
 */
export function bind(
    input: HTMLInputElement,
    format: Facilis.FormatInstance
): void {
    input.addEventListener('input', () => {
        const result = format.onInput({
            value: input.value,
            selectionStart: input.selectionStart,
            selectionEnd: input.selectionEnd,
        });

        input.value = result.formattedValue;

        if (result.selectionStart !== null && result.selectionEnd !== null) {
            input.setSelectionRange(result.selectionStart, result.selectionEnd);
        }
    });

    input.addEventListener('blur', () => {
        const result = format.onBlur({
            value: input.value,
            selectionStart: input.selectionStart,
            selectionEnd: input.selectionEnd,
        });

        input.value = result.formattedValue;

        if (result.selectionStart !== null && result.selectionEnd !== null) {
            input.setSelectionRange(result.selectionStart, result.selectionEnd);
        }
    });
}
