/**
 * Describes one selection snapshot.
 *
 * @since 0.1.0
 */
export type Selection = {
    /**
     * The start of the current text selection.
     */
    selectionStart: number | null;

    /**
     * The end of the current text selection.
     */
    selectionEnd: number | null;
};

/**
 * Describes one value and selection snapshot at a point in time.
 *
 * @since 0.1.0
 */
export type TextState = Selection & {
    /**
     * The full text value.
     */
    value: string;
};

/**
 * Describes the input event details available to the format runtime.
 *
 * @since 0.1.0
 */
export type InputDetails = {
    /**
     * The input event type, such as `insertText` or `deleteContentBackward`.
     */
    inputType: string | null;

    /**
     * The text data supplied by the input event, when available.
     */
    data: string | null;
};
