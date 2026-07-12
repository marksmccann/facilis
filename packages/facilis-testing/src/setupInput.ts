import type { Format } from 'facilis';
import { textState } from './textState';
import type { TestInput } from './types';

/**
 * Replaces one text range with new text.
 *
 * @param value The text value to update.
 * @param text The text to insert into the range.
 * @param selectionStart The start of the replacement range.
 * @param selectionEnd The end of the replacement range.
 * @private
 */
function replaceText(
    value: string,
    text: string,
    selectionStart: number,
    selectionEnd = selectionStart
) {
    return value.slice(0, selectionStart) + text + value.slice(selectionEnd);
}

/**
 * Creates a stateless test input for one Facilis format.
 *
 * @param format The Facilis format to drive through input-like interactions.
 * @since 0.0.1
 */
export function setupInput(format: Format): TestInput {
    const input: TestInput = {
        mount(value, selectionStart, selectionEnd) {
            return format.onMount(
                textState(value, selectionStart, selectionEnd)
            );
        },
        blur(value, selectionStart, selectionEnd) {
            return format.onBlur(
                textState(value, selectionStart, selectionEnd)
            );
        },
        append(previous, text) {
            const previousState = textState(previous);
            const current = previous + text;
            const cursor = current.length;

            return format.onInput(
                {
                    inputType: 'insertText',
                    data: text,
                },
                previousState,
                textState(current, cursor)
            );
        },
        insert(previous, text, selectionStart, selectionEnd) {
            const end = selectionEnd ?? selectionStart;
            const current = replaceText(previous, text, selectionStart, end);
            const cursor = selectionStart + text.length;

            return format.onInput(
                {
                    inputType: 'insertText',
                    data: text,
                },
                textState(previous, selectionStart, end),
                textState(current, cursor)
            );
        },
        deleteBackward(previous, cursor = previous.length) {
            const start = Math.max(cursor - 1, 0);
            const current = replaceText(previous, '', start, cursor);

            return format.onInput(
                {
                    inputType: 'deleteContentBackward',
                    data: null,
                },
                textState(previous, cursor),
                textState(current, start)
            );
        },
        type(text) {
            let current = textState('');

            for (const character of text) {
                const previous = current;
                const value = previous.value + character;
                const cursor = value.length;

                current = format.onInput(
                    {
                        inputType: 'insertText',
                        data: character,
                    },
                    previous,
                    textState(value, cursor)
                );
            }

            return current;
        },
    };

    return input;
}
