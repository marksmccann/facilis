import type { Format } from 'facilis';
import { useMemo } from 'react';
import type { FormatFactory } from './types';

const DEFAULT_FORMAT_OPTIONS = {};

/**
 * Creates one Facilis format instance from a format factory.
 *
 * @since 0.1.0
 */
export function useFormat<FormatOptions extends object = object>(
    factory: FormatFactory<FormatOptions>,
    options?: FormatOptions
): Format {
    const resolvedOptions =
        options ?? (DEFAULT_FORMAT_OPTIONS as FormatOptions);

    return useMemo(() => factory(resolvedOptions), [factory, resolvedOptions]);
}
