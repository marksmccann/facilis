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

/**
 * Describes the shared context available to format edit hooks.
 *
 * @since 0.1.0
 */
export type EditContext = {
    /**
     * The full resolved text before the edit.
     */
    previous: string;

    /**
     * The full raw text the field attempted to become.
     */
    attempted: string;

    /**
     * The full text produced by formatting the attempted text.
     */
    formatted: string;

    /**
     * The cursor position before the edit.
     */
    cursor: number;

    /**
     * The start of the changed range in the previous text.
     */
    start: number;

    /**
     * The end of the changed range in the previous text.
     */
    end: number;
};

/**
 * Describes one append edit transaction passed to an edit hook.
 *
 * @since 0.1.0
 */
export type AppendEditContext = EditContext & {
    /**
     * Identifies an append edit intent.
     */
    intent: 'append';

    /**
     * The raw text appended at the end.
     */
    appended: string;
};

/**
 * Describes one middle insertion passed to an edit hook.
 *
 * @since 0.1.0
 */
export type InsertEditContext = EditContext & {
    /**
     * Identifies an insert edit intent.
     */
    intent: 'insert';

    /**
     * The raw text inserted in the middle.
     */
    inserted: string;
};

/**
 * Describes one backward deletion passed to an edit hook.
 *
 * @since 0.1.0
 */
export type DeleteBackwardEditContext = EditContext & {
    /**
     * Identifies a backward-delete edit intent.
     */
    intent: 'deleteBackward';

    /**
     * The resolved text deleted from the previous text.
     */
    deleted: string;
};

/**
 * Describes the value returned by an optional edit hook. The return value
 * will dictate how Facilis handles the edit:
 * - `string`: override the default formatted text
 * - `TextState`: replace the formatted text and control the next selection
 * - `null`: reject the edit and preserve the previous input snapshot
 * - `undefined`: continue with the incoming default formatting
 *
 * @since 0.1.0
 */
export type FormatEditResult = string | TextState | null | undefined;

/**
 * Optional edit hooks for exceptional editing behavior. Each hook receives a
 * context object for one edit intent and can return a `FormatEditResult` to
 * override, reject, or defer to the default formatted result.
 *
 * @since 0.1.0
 */
export type FormatEditHooks = {
    /**
     * Handles text appended to the end of the value.
     */
    append?: (context: AppendEditContext) => FormatEditResult;

    /**
     * Handles text inserted before the end of the value.
     */
    insert?: (context: InsertEditContext) => FormatEditResult;

    /**
     * Handles backward deletion.
     */
    deleteBackward?: (context: DeleteBackwardEditContext) => FormatEditResult;
};

/**
 * Defines the behavior for a reusable format.
 *
 * @since 0.1.0
 */
export type FormatDefinition = {
    /**
     * Extracts the semantic value from any display value.
     */
    normalize: (raw: string) => string;

    /**
     * Builds the default display value from a semantic value.
     */
    format?: (normalized: string) => string;

    /**
     * Adjusts the formatted display value when the field blurs.
     */
    blur?: (formatted: string) => string;

    /**
     * Intercepts specific editing intentions.
     */
    edit?: FormatEditHooks;
};

/**
 * A reusable format driven by adapters/plugins.
 *
 * @since 0.1.0
 */
export type Format = {
    /**
     * Synchronizes the initial mounted value with the format.
     */
    onMount(current: TextState): TextState;

    /**
     * Handles live input formatting.
     */
    onInput(
        details: InputDetails,
        previous: TextState,
        current: TextState
    ): TextState;

    /**
     * Handles formatting that should occur on blur.
     */
    onBlur(current: TextState): TextState;
};
