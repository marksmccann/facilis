import type {
    FormatAppendHookContext,
    FormatDeleteHookContext,
    FormatInsertHookContext,
} from './hooks';
import type { TextState } from './input';

/**
 * Describes the context passed to factory edit hooks after removing the
 * built-in resolved state from the core format hook context.
 *
 * @private
 */
export type FormatFactoryEditHookContext<
    TContext extends { resolved: TextState },
    TOptions,
> = Omit<TContext, 'resolved'> & TOptions;

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
    ) => TextState;

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
    ) => TextState;

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
    ) => TextState;
};
