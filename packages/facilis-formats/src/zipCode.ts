import { defineSegmentedFormat, type Format } from 'facilis';

/**
 * Describes ZIP code format options.
 *
 * @since 0.1.0
 */
export type ZipCodeOptions = {
    /**
     * Whether the format should include the ZIP+4 extension.
     */
    includePlusFour?: boolean;
};

/**
 * Creates a ZIP code format.
 *
 * @since 0.1.0
 */
export function zipCode(options: ZipCodeOptions = {}): Format {
    const { includePlusFour = false } = options;

    return defineSegmentedFormat({
        characters: 'digits',
        segments: includePlusFour ? [5, '-', 4] : [5],
    });
}
