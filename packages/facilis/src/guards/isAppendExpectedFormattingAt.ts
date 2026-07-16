import isAppendFormatting from './isAppendFormatting';
import type { FormatAppendHookContext } from '../types/hooks';

/**
 * Determines whether an append added expected formatting text at one display
 * position without changing the normalized value.
 *
 * @since 0.1.0
 */
export default function isAppendExpectedFormattingAt(
    context: FormatAppendHookContext,
    expectedFormatting: string,
    position: number
): boolean {
    const offset = context.previous.length - position;

    return (
        isAppendFormatting(context) &&
        offset >= 0 &&
        offset < expectedFormatting.length &&
        expectedFormatting.slice(offset).startsWith(context.appended)
    );
}
