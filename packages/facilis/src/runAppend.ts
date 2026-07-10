import type { FormatDefinition, FormatEditResult, TextState } from './types';

type RunAppendContext = {
    definition: FormatDefinition;
    previous: TextState;
    current: TextState;
    formatted: string;
};

/**
 * Runs the append edit hook with a context built from the current edit.
 *
 * @private
 */
export default function runAppend(
    context: RunAppendContext
): FormatEditResult {
    const { definition, previous, current, formatted } = context;
    const cursor = previous.value.length;
    const appended = current.value.slice(cursor);

    return definition.edit?.append?.({
        intent: 'append',
        previous: previous.value,
        attempted: current.value,
        formatted,
        cursor,
        start: cursor,
        end: cursor,
        appended,
    });
}
