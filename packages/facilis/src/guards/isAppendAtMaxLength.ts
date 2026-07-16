import type { FormatAppendHookContext } from '../types/hooks';

/**
 * Determines whether an append happened after the normalized value reached a
 * maximum length.
 *
 * @since 0.1.0
 */
export default function isAppendAtMaxLength(
    context: FormatAppendHookContext,
    maxLength: number
): boolean {
    return context.normalized.previous.length >= maxLength;
}
