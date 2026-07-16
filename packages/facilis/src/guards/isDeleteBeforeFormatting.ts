import type { FormatDeleteHookContext } from '../types/hooks';

/**
 * Determines whether a delete removed semantic text immediately before known
 * formatting text.
 *
 * @since 0.1.0
 */
export default function isDeleteBeforeFormatting(
    context: FormatDeleteHookContext,
    formatting: string
): boolean {
    const { normalized, previous, cursor } = context;

    return (
        formatting !== '' &&
        normalized.deleted !== '' &&
        previous.slice(cursor, cursor + formatting.length) === formatting
    );
}
