import type { FormatEditResult, RunEditContext } from '../types';

/**
 * Runs the append edit hook with a context built from the current edit.
 *
 * @private
 */
export default function runAppend(context: RunEditContext): FormatEditResult {
    const { definition, previous, current, normalized, formatted, resolved } =
        context;
    const { edit, normalize } = definition;
    let result: FormatEditResult;

    if (edit?.append) {
        const cursor = previous.value.length;
        const appended = current.value.slice(cursor);

        result = edit.append({
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
