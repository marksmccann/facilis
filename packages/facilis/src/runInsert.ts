import type { FormatDefinition, FormatEditResult, TextState } from './types';

type RunInsertContext = {
    definition: FormatDefinition;
    previous: TextState;
    current: TextState;
    formatted: string;
};

/**
 * Runs the insert edit hook with a context built from the current edit.
 *
 * @private
 */
export default function runInsert(
    context: RunInsertContext
): FormatEditResult {
    const { definition, previous, current, formatted } = context;
    const cursor = previous.selectionStart;

    if (cursor === null) return undefined;

    const inserted = current.value.slice(
        cursor,
        current.value.length - (previous.value.length - cursor)
    );

    return definition.edit?.insert?.({
        intent: 'insert',
        previous: previous.value,
        attempted: current.value,
        formatted,
        cursor,
        start: cursor,
        end: cursor,
        inserted,
    });
}
