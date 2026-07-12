import type { DeleteBackwardEditContext } from './types';

/**
 * Determines whether a backward delete removed semantic text immediately
 * before known formatting text.
 *
 * @since 0.1.0
 */
export default function isDeleteBackwardBeforeFormatting(
    context: DeleteBackwardEditContext,
    formatting: string
): boolean {
    const { normalized, previous, cursor } = context;

    return (
        formatting !== '' &&
        normalized.deleted !== '' &&
        previous.slice(cursor, cursor + formatting.length) === formatting
    );
}
