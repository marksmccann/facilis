import type { TextState } from 'facilis';

/**
 * Describes a stateless test input for one Facilis format.
 *
 * @since 0.1.0
 */
export type TestInput = {
    /**
     * Synchronizes an initial mounted value with the format.
     *
     * @param value The text value to mount with the format.
     * @param selectionStart The start of the mounted selection. Defaults to the end of the value.
     * @param selectionEnd The end of the mounted selection. Defaults to `selectionStart`.
     * @since 0.1.0
     */
    mount(
        value: string,
        selectionStart?: number | null,
        selectionEnd?: number | null
    ): TextState;

    /**
     * Applies blur-time formatting to one value.
     *
     * @param value The text value to blur with the format.
     * @param selectionStart The start of the blurred selection. Defaults to the end of the value.
     * @param selectionEnd The end of the blurred selection. Defaults to `selectionStart`.
     * @since 0.1.0
     */
    blur(
        value: string,
        selectionStart?: number | null,
        selectionEnd?: number | null
    ): TextState;

    /**
     * Appends text to the end of one value.
     *
     * @param previous The text value before the append.
     * @param text The text to append.
     * @since 0.1.0
     */
    append(previous: string, text: string): TextState;

    /**
     * Inserts text at one position in a value.
     *
     * @param previous The text value before the insertion.
     * @param text The text to insert.
     * @param selectionStart The start of the replacement range.
     * @param selectionEnd The end of the replacement range. Defaults to `selectionStart`.
     * @since 0.1.0
     */
    insert(
        previous: string,
        text: string,
        selectionStart: number,
        selectionEnd?: number
    ): TextState;

    /**
     * Deletes backward from one cursor position.
     *
     * @param previous The text value before the backward delete.
     * @param cursor The cursor position to delete backward from. Defaults to the end of the value.
     * @since 0.1.0
     */
    deleteBackward(previous: string, cursor?: number): TextState;

    /**
     * Types a sequence of characters from an empty value and returns the final
     * text state.
     *
     * @param text The text sequence to type.
     * @since 0.1.0
     */
    type(text: string): TextState;
};
