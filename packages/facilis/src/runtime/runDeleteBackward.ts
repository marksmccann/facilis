import type { FormatEditResult, RunEditContext } from '../types';

/**
 * Runs the backward-delete edit hook with a context built from the current edit.
 *
 * @private
 */
export default function runDeleteBackward(
    context: RunEditContext
): FormatEditResult {
    const { definition, previous, current, normalized, formatted } = context;
    const cursor = previous.selectionStart;
    const { edit, normalize } = definition;
    let result: FormatEditResult;

    if (cursor !== null && edit?.deleteBackward) {
        const start = Math.max(0, cursor - 1);
        const end = cursor;
        const deleted = previous.value.slice(start, end);

        result = edit.deleteBackward({
            intent: 'deleteBackward',
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
