import type { Format } from 'facilis';
import { useMemo } from 'react';
import type { FormatFactory } from './types';

/**
 * Creates one Facilis format instance from a format factory.
 *
 * @since 0.1.0
 */
export function useFormat<FormatOptions extends object = object>(
    factory: FormatFactory<FormatOptions>,
    options?: FormatOptions
): Format {
    const resolvedOptions = options ?? ({} as FormatOptions);

    return useMemo(() => factory(resolvedOptions), [factory, resolvedOptions]);
}
