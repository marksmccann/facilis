import type { Format } from 'facilis';
import { useMemo } from 'react';

/**
 * Formats a standalone string value with a Facilis format.
 *
 * @since 0.1.0
 */
export function useFormattedValue(format: Format, value: string): string {
    return useMemo(() => format.formatValue(value), [format, value]);
}
