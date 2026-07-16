import type { FormatEditHookResult } from '../types/hooks';
import type { RunEditContext } from '../types/internal';

/**
 * Runs the insert edit hook with a context built from the current edit.
 *
 * @private
 */
export default function runInsert(
    context: RunEditContext
): FormatEditHookResult {
    const { definition, previous, current, normalized, formatted, resolved } =
        context;
    const { insert, normalize } = definition;
    const cursor = previous.selectionStart;
    let result: FormatEditHookResult;

    if (cursor !== null && insert) {
        const suffixLength = previous.value.length - cursor;
        const insertedEnd = current.value.length - suffixLength;
        const inserted = current.value.slice(cursor, insertedEnd);

        result = insert({
            intent: 'insert',
            previous: previous.value,
            attempted: current.value,
            formatted,
            resolved,
            normalize,
            cursor,
            start: cursor,
            end: cursor,
            inserted,
            normalized: {
                previous: normalize(previous.value),
                attempted: normalized,
                inserted: normalize(inserted),
            },
        });
    }

    return result;
}
