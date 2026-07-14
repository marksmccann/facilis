import isAppendFormatting from './isAppendFormatting';
import type { AppendEditContext } from '../types';

/**
 * Determines whether an append added formatting text already present at the
 * end of the previous display value.
 *
 * @since 0.1.0
 */
export default function isAppendDuplicateFormatting(
    context: AppendEditContext
): boolean {
    return (
        isAppendFormatting(context) &&
        context.previous.endsWith(context.appended)
    );
}
