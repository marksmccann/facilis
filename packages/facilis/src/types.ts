/**
 * Describes one selection snapshot.
 *
 * @since 0.0.1
 */
export type Selection = {
    /** The start of the current selection, if one exists. */
    selectionStart: number | null;
    /** The end of the current selection, if one exists. */
    selectionEnd: number | null;
};

/**
 * Describes one value and selection snapshot at a point in time.
 *
 * @since 0.0.1
 */
export type InputSnapshot = Selection & {
    /** The current value being processed. */
    value: string;
};

/**
 * Describes the semantic kind of edit that produced the current input state.
 *
 * @since 0.0.1
 */
export type EditKind =
    | 'insert'
    | 'delete-backward'
    | 'delete-forward'
    | 'replace'
    | 'unknown';

/**
 * Describes the current edit transition, including the previous committed
 * snapshot and the current browser snapshot.
 *
 * @since 0.0.1
 */
export type EditState = {
    /** The normalized semantic kind of edit that occurred. */
    kind: EditKind;
    /** The platform-specific native input action, if known. */
    inputType: string | null;
    /** The previous committed snapshot. */
    previous: InputSnapshot;
    /** The current browser snapshot. */
    current: InputSnapshot;
};

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
    /** The current edit transition being normalized. */
    edit: EditState;
    /** The normalized value built so far. */
    normalized: string;
    /** Appends text to the normalized value being built. */
    append: (text: string) => void;
    /** Sets the normalized value built so far to the provided text. */
    set: (text: string) => void;
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
 * The context available while resolving the final live-input selection.
 *
 * @since 0.0.1
 */
export type SelectContext = {
    /** The current edit transition. */
    edit: EditState;
    /** The previous committed snapshot. */
    previous: InputSnapshot;
    /** The current browser snapshot. */
    current: InputSnapshot;
    /** The normalized value produced during input formatting. */
    normalizedValue: string;
    /** The formatted value produced during input formatting. */
    formattedValue: string;
    /** The default selection resolved by the core pipeline. */
    resolvedSelection: Selection;
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
    /** Resolves the final selection to apply after live input formatting. */
    select?: (context: SelectContext) => Selection | undefined;
};

/**
 * A reusable format driven by adapters/plugins.
 *
 * @since 0.0.1
 */
export type Format = {
    /** The name of the format */
    name: string;
    /** Synchronizes the initial mounted value with the format. */
    onMount(data: InputSnapshot): InputSnapshot;
    /** Handles live input formatting. */
    onInput(
        type: string | null,
        previous: InputSnapshot,
        current: InputSnapshot
    ): InputSnapshot;
    /** Handles formatting that should occur on blur. */
    onBlur(data: InputSnapshot): InputSnapshot;
};
