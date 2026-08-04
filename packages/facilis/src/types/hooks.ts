import type { TextState } from './input';

/**
 * Describes the normalized values shared by every edit hook.
 *
 * @private
 */
type FormatEditHookNormalizedValues = {
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
 * Describes the shared context available to format edit hooks.
 *
 * @private
 */
type FormatEditHookContext = {
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
    normalize: (raw: string) => string;

    /**
     * The normalized values that correspond to the display text in this edit.
     */
    normalized: FormatEditHookNormalizedValues;

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
 * @since 0.2.0
 */
export type FormatAppendHookContext = FormatEditHookContext & {
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
    normalized: FormatEditHookNormalizedValues & {
        /**
         * The semantic value represented by the appended text.
         */
        appended: string;
    };
};

/**
 * Describes one middle insertion passed to an edit hook.
 *
 * @since 0.2.0
 */
export type FormatInsertHookContext = FormatEditHookContext & {
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
    normalized: FormatEditHookNormalizedValues & {
        /**
         * The semantic value represented by the inserted text.
         */
        inserted: string;
    };
};

/**
 * Describes one deletion passed to an edit hook.
 *
 * @since 0.2.0
 */
export type FormatDeleteHookContext = FormatEditHookContext & {
    /**
     * Identifies a delete edit intent.
     */
    intent: 'delete';

    /**
     * The resolved text deleted from the previous text.
     */
    deleted: string;

    /**
     * The normalized values that correspond to this delete edit.
     */
    normalized: FormatEditHookNormalizedValues & {
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
 * @since 0.2.0
 */
export type FormatEditHookResult = string | TextState | null | undefined;
