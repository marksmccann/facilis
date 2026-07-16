import isAppendFormatting from './isAppendFormatting';
import type { FormatAppendHookContext } from '../types/hooks';

/**
 * Determines whether an append added formatting text already present at the
 * end of the previous display value.
 *
 * @since 0.1.0
 */
export default function isAppendDuplicateFormatting(
    context: FormatAppendHookContext
): boolean {
    return (
        isAppendFormatting(context) &&
        context.previous.endsWith(context.appended)
    );
}
