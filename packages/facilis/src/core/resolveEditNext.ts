import type {
    FormatAppendHookContext,
    FormatDeleteHookContext,
    FormatEditHookResult,
    FormatInsertHookContext,
} from '../types/hooks';
import type { TextState } from '../types/input';

type EditNextContext =
    | FormatAppendHookContext
    | FormatInsertHookContext
    | FormatDeleteHookContext;

/**
 * Resolves an edit hook result into the next text state passed to factory hooks.
 *
 * @private
 */
export default function resolveEditNext(
    result: FormatEditHookResult,
    fallback: TextState,
    context: EditNextContext
): TextState {
    if (result === null) {
        return {
            value: context.previous,
            selectionStart: context.cursor,
            selectionEnd: context.cursor,
        };
    }

    if (typeof result === 'string') {
        return {
            value: result,
            selectionStart: result.length,
            selectionEnd: result.length,
        };
    }

    if (result !== undefined) return result;

    return fallback;
}
