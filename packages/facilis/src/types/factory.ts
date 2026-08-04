import type {
    FormatAppendHookContext,
    FormatDeleteHookContext,
    FormatEditHookResult,
    FormatInsertHookContext,
} from './hooks';
import type { TextState } from './input';

/**
 * Describes the context passed to factory edit hooks after adding factory
 * configuration to the core format hook context.
 *
 * @private
 */
export type FormatFactoryEditHookContext<
    TContext,
    TOptions,
> = TContext & TOptions;

/**
 * Combines one factory's public options with the shared factory hook options.
 *
 * @private
 */
export type FormatFactoryOptions<
    TOptions,
    THookOptions = TOptions,
> = TOptions & {
    /**
     * Customizes the resolved normalized value.
     */
    normalize?: (
        resolved: string,
        context: THookOptions & {
            /** The raw value passed into the normalize stage. */
            raw: string;
        }
    ) => string;

    /**
     * Customizes the resolved formatted value.
     */
    format?: (
        resolved: string,
        context: THookOptions & {
            /** The normalized value passed into the format stage. */
            normalized: string;
        }
    ) => string;

    /**
     * Customizes the resolved blurred value.
     */
    blur?: (
        resolved: string,
        context: THookOptions & {
            /** The formatted value passed into the blur stage. */
            formatted: string;
        }
    ) => string;

    /**
     * Customizes append behavior after the built-in behavior has resolved the
     * next text state.
     */
    append?: (
        next: TextState,
        context: FormatFactoryEditHookContext<
            FormatAppendHookContext,
            THookOptions
        >
    ) => FormatEditHookResult;

    /**
     * Customizes insert behavior after the built-in behavior has resolved the
     * next text state.
     */
    insert?: (
        next: TextState,
        context: FormatFactoryEditHookContext<
            FormatInsertHookContext,
            THookOptions
        >
    ) => FormatEditHookResult;

    /**
     * Customizes delete behavior after the built-in behavior has resolved the
     * next text state.
     */
    delete?: (
        next: TextState,
        context: FormatFactoryEditHookContext<
            FormatDeleteHookContext,
            THookOptions
        >
    ) => FormatEditHookResult;
};
