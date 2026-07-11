import type { AppendEditContext } from './types';

/**
 * Determines whether an append added formatting text without changing the
 * normalized value.
 *
 * @since 0.1.0
 */
export default function isAppendFormatting(
    context: AppendEditContext
): boolean {
    return (
        context.appended !== '' &&
        context.normalized.appended === '' &&
        context.normalized.attempted === context.normalized.previous
    );
}
