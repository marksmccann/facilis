import type { AppendEditContext } from '../types';

/**
 * Determines whether an append happened after the normalized value reached a
 * maximum length.
 *
 * @since 0.1.0
 */
export default function isAppendAtMaxLength(
    context: AppendEditContext,
    maxLength: number
): boolean {
    return context.normalized.previous.length >= maxLength;
}
