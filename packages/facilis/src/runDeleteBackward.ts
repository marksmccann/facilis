import type { FormatDefinition, FormatEditResult, TextState } from './types';

type RunDeleteBackwardContext = {
    definition: FormatDefinition;
    previous: TextState;
    current: TextState;
    formatted: string;
};

/**
 * Runs the backward-delete edit hook with a context built from the current edit.
 *
 * @private
 */
export default function runDeleteBackward(
    context: RunDeleteBackwardContext
): FormatEditResult {
    const { definition, previous, current, formatted } = context;
    const cursor = previous.selectionStart;

    if (cursor === null) return undefined;

    const start = Math.max(0, cursor - 1);
    const end = cursor;
    const deleted = previous.value.slice(start, end);

    return definition.edit?.deleteBackward?.({
        intent: 'deleteBackward',
        previous: previous.value,
        attempted: current.value,
        formatted,
        cursor,
        start,
        end,
        deleted,
    });
}
