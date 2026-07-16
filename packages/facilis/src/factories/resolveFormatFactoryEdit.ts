import resolveEditResult from '../core/resolveEditResult';
import type {
    FormatAppendHookContext,
    FormatDeleteHookContext,
    FormatEditHookResult,
    FormatInsertHookContext,
} from '../types/hooks';
import type { FormatFactoryEditHookContext } from '../types/factory';
import type { TextState } from '../types/input';

type FormatFactoryEditSourceContext =
    | FormatAppendHookContext
    | FormatInsertHookContext
    | FormatDeleteHookContext;

export function resolveFormatFactoryEditHookContext<
    TContext extends FormatFactoryEditSourceContext,
    TOptions,
>(
    context: TContext,
    options: TOptions
): FormatFactoryEditHookContext<TContext, TOptions> {
    const { resolved, ...editContext } = context;
    void resolved;

    return {
        ...editContext,
        ...options,
    } as FormatFactoryEditHookContext<TContext, TOptions>;
}

export function resolveFormatFactoryEditResult(
    result: FormatEditHookResult,
    context: FormatFactoryEditSourceContext
): TextState {
    const previous = {
        value: context.previous,
        selectionStart: context.cursor,
        selectionEnd: context.cursor,
    };

    return resolveEditResult(result, previous, context.resolved);
}
