/**
 * The full state available while normalizing one raw character.
 *
 * @since 0.0.1
 */
export type NormalizeState = {
    /** The current raw character position being processed. */
    index: number;
    /** The full raw input value. */
    rawValue: string;
    /** The normalized value built so far. */
    normalized: string;
    /** Appends text to the normalized value being built. */
    append: (text: string) => void;
    /** Replaces the normalized value built so far. */
    replace: (text: string) => void;
};

/**
 * The full state available while formatting one normalized character.
 *
 * @since 0.0.1
 */
export type FormatState = {
    /** The current formatting item position being processed. */
    index: number;
    /** The full normalized value being formatted. */
    normalized: string;
    /** The formatted value built so far. */
    formatted: string;
    /** The current normalized cursor position while formatting. */
    normalizedPosition: number;
    /** Appends visible text to the formatted value being built. */
    append: (text: string) => void;
    /** Advances the normalized cursor position by the provided amount. */
    advance: (amount?: number) => void;
};

/**
 * The context available while producing a blur-time formatted value.
 *
 * @since 0.0.1
 */
export type BlurContext = {
    /** The formatted value produced during live input formatting. */
    formattedValue: string;
};

/**
 * Describes the current input value and selection being processed.
 *
 * @since 0.0.1
 */
export type FormatInput = {
    /** The current value being processed. */
    value: string;
    /** The start of the current selection, if one exists. */
    selectionStart: number | null;
    /** The end of the current selection, if one exists. */
    selectionEnd: number | null;
};

/**
 * The minimal result returned after applying a format transition.
 *
 * @since 0.0.1
 */
export type FormatResult = {
    /** The value that should be written back to the input. */
    formattedValue: string;
    /** The next selection start that should be applied to the input. */
    selectionStart: number | null;
    /** The next selection end that should be applied to the input. */
    selectionEnd: number | null;
};

/**
 * Defines the behavior for a single reusable format.
 *
 * @since 0.0.1
 */
export type FormatDefinition = {
    /** The unique name of the format. */
    name: string;
    /** Produces the normalized value while processing one raw character. */
    normalize: (character: string, state: NormalizeState) => void;
    /** Contributes visible text while formatting one normalized character. */
    format: (character: string, state: FormatState) => void;
    /** Produces the formatted value that should be applied on blur. */
    blur?: (context: BlurContext) => string;
};

/**
 * A reusable format driven by adapters/plugins.
 *
 * @since 0.0.1
 */
export type Format = {
    /** The name of the format */
    name: string;
    /** Handles live input formatting. */
    onInput(input: FormatInput): FormatResult;
    /** Handles formatting that should occur on blur. */
    onBlur(input: FormatInput): FormatResult;
};
