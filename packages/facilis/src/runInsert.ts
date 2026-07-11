import type { FormatEditResult, RunEditContext } from './types';

/**
 * Runs the insert edit hook with a context built from the current edit.
 *
 * @private
 */
export default function runInsert(context: RunEditContext): FormatEditResult {
    const { definition, previous, current, normalized, formatted } = context;
    const { edit, normalize } = definition;
    const cursor = previous.selectionStart;
    let result: FormatEditResult;

    if (cursor !== null && edit?.insert) {
        const suffixLength = previous.value.length - cursor;
        const insertedEnd = current.value.length - suffixLength;
        const inserted = current.value.slice(cursor, insertedEnd);

        result = edit.insert({
            intent: 'insert',
            previous: previous.value,
            attempted: current.value,
            formatted,
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
