import type { FormatDeleteHookContext } from '../types/hooks';

/**
 * Determines whether a delete is over formatting text: display text that does
 * not contribute to the normalized value.
 *
 * @since 0.1.0
 */
export default function isDeleteOverFormatting(
    context: FormatDeleteHookContext
): boolean {
    return (
        context.deleted !== '' &&
        context.normalized.deleted === '' &&
        context.cursor < context.previous.length
    );
}
