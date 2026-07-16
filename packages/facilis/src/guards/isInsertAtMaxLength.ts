import type { FormatInsertHookContext } from '../types/hooks';

/**
 * Determines whether a middle insertion adds semantic text after the normalized
 * value has reached a maximum length.
 *
 * @since 0.1.0
 */
export default function isInsertAtMaxLength(
    context: FormatInsertHookContext,
    maxLength: number
): boolean {
    return (
        context.normalized.inserted !== '' &&
        context.normalized.previous.length >= maxLength
    );
}
