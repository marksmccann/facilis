export declare namespace Facilis {
    /**
     * Defines the behavior for a single reusable format.
     *
     * @since 0.0.1
     */
    export type FormatDefinition = {
        /** The unique name of the format. */
        name: string;
        /** Produces the normalized value from the raw input value. */
        normalizeValue: (context: { rawValue: string }) => string;
        /** Produces the live formatted value from the normalized value. */
        formatValue: (context: { normalizedValue: string }) => string;
        /** Produces the formatted value that should be applied on blur. */
        formatBlurValue?: (context: { formattedValue: string }) => string;
        /** Resolves the next selection range after live formatting. */
        resolveSelection: (
            context: FormatSelectionContext
        ) => FormatSelectionResult;
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
     * The runtime values available when resolving the next selection range.
     *
     * @since 0.0.1
     */
    export type FormatSelectionContext = {
        /** The current raw input value before formatting is applied. */
        rawValue: string;
        /** The current raw selection start before formatting is applied. */
        rawSelectionStart: number;
        /** The current raw selection end before formatting is applied. */
        rawSelectionEnd: number;
        /** The normalized value produced from the raw input. */
        normalizedValue: string;
        /** The formatted value produced from the normalized value. */
        formattedValue: string;
    };

    /**
     * The resolved selection range returned by a format selection strategy.
     *
     * @since 0.0.1
     */
    export type FormatSelectionResult = {
        /** The next selection start that should be applied to the input. */
        selectionStart: number | null;
        /** The next selection end that should be applied to the input. */
        selectionEnd: number | null;
    };

    /**
     * A stateful format instance driven by adapters/plugins.
     *
     * @since 0.0.1
     */
    export type FormatInstance = {
        /** The name of the format the instance belongs to */
        name: string;
        /** Handles live input formatting. */
        onInput(options: FormatInput): FormatResult;
        /** Handles formatting that should occur on blur. */
        onBlur(options: FormatInput): FormatResult;
    };

    /**
     * Factory returned by defineFormat that creates isolated format instances.
     *
     * @since 0.0.1
     */
    export type FormatFactory = () => FormatInstance;
}
