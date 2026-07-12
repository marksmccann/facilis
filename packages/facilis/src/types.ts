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
     * Extracts the semantic value from any display value using the active format
     * definition.
     */
    normalize: FormatDefinition['normalize'];

    /**
     * The normalized values that correspond to the display text in this edit.
     */
    normalized: NormalizedEditContext;

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
 * Describes the normalized values shared by every edit hook.
 *
 * @since 0.1.0
 */
export type NormalizedEditContext = {
    /**
     * The semantic value before the edit.
     */
    previous: string;

    /**
     * The semantic value the field attempted to become.
     */
    attempted: string;
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

    /**
     * The normalized values that correspond to this append edit.
     */
    normalized: NormalizedEditContext & {
        /**
         * The semantic value represented by the appended text.
         */
        appended: string;
    };
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

    /**
     * The normalized values that correspond to this insert edit.
     */
    normalized: NormalizedEditContext & {
        /**
         * The semantic value represented by the inserted text.
         */
        inserted: string;
    };
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

    /**
     * The normalized values that correspond to this backward-delete edit.
     */
    normalized: NormalizedEditContext & {
        /**
         * The semantic value represented by the deleted text.
         */
        deleted: string;
    };
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
 * Describes the shared internal context passed to edit-hook runners.
 *
 * @private
 */
export type RunEditContext = {
    /**
     * The format definition that owns the edit hook being run.
     */
    definition: FormatDefinition;

    /**
     * The value and selection snapshot before the edit.
     */
    previous: TextState;

    /**
     * The value and selection snapshot after the raw edit attempt.
     */
    current: TextState;

    /**
     * The semantic value produced by normalizing the current text.
     */
    normalized: string;

    /**
     * The default formatted text produced from the normalized value.
     */
    formatted: string;
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
