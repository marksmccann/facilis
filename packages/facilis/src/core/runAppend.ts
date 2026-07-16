import type { FormatEditHookResult } from '../types/hooks';
import type { RunEditContext } from '../types/internal';

/**
 * Runs the append edit hook with a context built from the current edit.
 *
 * @private
 */
export default function runAppend(
    context: RunEditContext
): FormatEditHookResult {
    const { definition, previous, current, normalized, formatted, resolved } =
        context;
    const { append, normalize } = definition;
    let result: FormatEditHookResult;

    if (append) {
        const cursor = previous.value.length;
        const appended = current.value.slice(cursor);

        result = append({
            intent: 'append',
            previous: previous.value,
            attempted: current.value,
            formatted,
            resolved,
            normalize,
            cursor,
            start: cursor,
            end: cursor,
            appended,
            normalized: {
                previous: normalize(previous.value),
                attempted: normalized,
                appended: normalize(appended),
            },
        });
    }
    return result;
}
