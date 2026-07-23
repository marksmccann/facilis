import type { FormatEditHookResult } from './hooks';
import type {
    FormatAppendHookContext,
    FormatDeleteHookContext,
    FormatInsertHookContext,
} from './hooks';
import type { InputDetails, TextState } from './input';

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
     * Handles text appended to the end of the value.
     */
    append?: (context: FormatAppendHookContext) => FormatEditHookResult;

    /**
     * Handles text inserted before the end of the value.
     */
    insert?: (context: FormatInsertHookContext) => FormatEditHookResult;

    /**
     * Handles deletion.
     */
    delete?: (context: FormatDeleteHookContext) => FormatEditHookResult;
};

/**
 * A reusable format driven by adapters/plugins.
 *
 * @since 0.1.0
 */
export type Format = {
    /**
     * Formats a standalone value for display.
     */
    formatValue(value: string): string;

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
