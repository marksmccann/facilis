import type { DeleteBackwardEditContext } from '../types';

/**
 * Determines whether a backward delete is over formatting text: display text
 * that does not contribute to the normalized value.
 *
 * @since 0.1.0
 */
export default function isDeleteBackwardOverFormatting(
    context: DeleteBackwardEditContext
): boolean {
    return (
        context.deleted !== '' &&
        context.normalized.deleted === '' &&
        context.cursor < context.previous.length
    );
}
