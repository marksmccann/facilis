/** Describes one selection snapshot. */
export type Selection = {
    selectionStart: number | null;
    selectionEnd: number | null;
};

/** Describes one value and selection snapshot at a point in time. */
export type InputSnapshot = Selection & {
    value: string;
};

/** Describes one display-value range. */
export type FormatRange = {
    start: number;
    end: number;
};

/** Describes the shared data available to format edit hooks. */
export type FormatBaseEdit = {
    previousDisplay: string;
    previousValue: string;
    attemptedDisplay: string;
    attemptedValue: string;
    formattedNextDisplay: string;
};

/** Describes one append edit transaction passed to a format hook. */
export type FormatAppendEdit = FormatBaseEdit & {
    intent: 'append';
    text: string;
    rawText: string;
    at: number;
    range: FormatRange;
};

/** Describes one middle insertion passed to a format hook. */
export type FormatInsertEdit = FormatBaseEdit & {
    intent: 'insert';
    text: string;
    rawText: string;
    at: number;
    range: FormatRange;
};

/** Describes one backward deletion passed to a format hook. */
export type FormatDeleteBackwardEdit = FormatBaseEdit & {
    intent: 'deleteBackward';
    at: number;
    range: FormatRange;
};

/** Describes the value returned by an optional format hook. */
export type FormatHookResult = string | InputSnapshot | null | undefined;

/** Optional hooks for exceptional editing behavior. */
export type FormatHooks = {
    append?: (edit: FormatAppendEdit) => FormatHookResult;
    insert?: (edit: FormatInsertEdit) => FormatHookResult;
    deleteBackward?: (edit: FormatDeleteBackwardEdit) => FormatHookResult;
};

/** Defines the behavior for a reusable format. */
export type FormatDefinition = {
    /** Extracts the semantic value from any display value. */
    normalize: (input: string) => string;
    /** Builds the default display value from a semantic value. */
    format?: (value: string) => string;
    /** Adjusts the formatted display value when the field blurs. */
    blur?: (formattedValue: string) => string;
    /** Intercepts specific editing intentions. */
    on?: FormatHooks;
};

/** A reusable format driven by adapters/plugins. */
export type Format = {
    /** Synchronizes the initial mounted value with the format. */
    onMount(data: InputSnapshot): InputSnapshot;
    /** Handles live input formatting. */
    onInput(
        type: string | null,
        previous: InputSnapshot,
        current: InputSnapshot,
        rawText?: string | null
    ): InputSnapshot;
    /** Handles formatting that should occur on blur. */
    onBlur(data: InputSnapshot): InputSnapshot;
};
