import type { FormatDefinition } from '../types';

/**
 * Builds the formatted text for a blurred value.
 *
 * @private
 */
export default function runBlur(
    definition: FormatDefinition,
    formatted: string
): string {
    if (!definition.blur) return formatted;
    return definition.blur(formatted);
}
