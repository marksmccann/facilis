import type { Selection } from '../types/input';

/**
 * Options for resolving a collapsed selection before known formatting text.
 *
 * @private
 */
type ResolveSelectionBeforeFormattingOptions = {
    /**
     * The display value that contains the formatting text.
     */
    value: string;

    /**
     * The display position immediately after the possible formatting text.
     */
    position: number;

    /**
     * The formatting text to resolve before.
     */
    formatting: string;
};

/**
 * Resolves a collapsed selection to the start of formatting text immediately
 * before a display position.
 *
 * @since 0.1.0
 */
export default function resolveSelectionBeforeFormatting(
    options: ResolveSelectionBeforeFormattingOptions
): Selection | undefined {
    const { value, position, formatting } = options;

    if (formatting === '' || position <= 0) {
        return;
    }

    const start = position - formatting.length;

    if (start < 0) {
        return;
    }

    if (value.slice(start, position) !== formatting) {
        return;
    }

    return {
        selectionStart: start,
        selectionEnd: start,
    };
}
