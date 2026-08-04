import type { FormatEditHookResult } from '../types/hooks';
import type { RunEditContext } from '../types/internal';

/**
 * Runs the delete edit hook with a context built from the current edit.
 *
 * @private
 */
export default function runDelete(
    context: RunEditContext
): FormatEditHookResult {
    const { definition, previous, current, normalized, formatted, resolved } =
        context;
    const cursor = previous.selectionStart;
    const { delete: deleteHook, normalize } = definition;
    let result: FormatEditHookResult;

    if (cursor !== null && deleteHook) {
        const start = Math.max(0, cursor - 1);
        const end = cursor;
        const deleted = previous.value.slice(start, end);

        result = deleteHook(resolved, {
            intent: 'delete',
            previous: previous.value,
            attempted: current.value,
            formatted,
            normalize,
            cursor,
            start,
            end,
            deleted,
            normalized: {
                previous: normalize(previous.value),
                attempted: normalized,
                deleted: normalize(deleted),
            },
        });
    }

    return result;
}
