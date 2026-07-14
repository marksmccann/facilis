import isAppendFormatting from './isAppendFormatting';
import type { AppendEditContext } from '../types';

/**
 * Determines whether an append added formatting while the previous display
 * already contains expected formatting text at one display position.
 *
 * @since 0.1.0
 */
export default function isAppendDuplicateFormattingAt(
    context: AppendEditContext,
    expectedFormatting: string,
    position: number
): boolean {
    const pending = context.previous.slice(context.formatted.length);
    const offset = context.formatted.length - position;

    return (
        isAppendFormatting(context) &&
        context.previous !== context.formatted &&
        context.previous.startsWith(context.formatted) &&
        pending !== '' &&
        offset >= 0 &&
        offset < expectedFormatting.length &&
        expectedFormatting.slice(offset).startsWith(pending)
    );
}
