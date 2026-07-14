import type { FormatDefinition } from '../types';

/**
 * Builds the formatted text for a normalized value.
 *
 * @private
 */
export default function runFormat(
    definition: FormatDefinition,
    normalized: string
): string {
    if (!definition.format) return normalized;
    return definition.format(normalized);
}
