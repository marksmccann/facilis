import {
    defineSegmentedFormat,
    type Format,
    type SegmentedFormatSegments,
} from 'facilis';

const PHONE_NUMBER_SEPARATORS = ['-', '.', ' '] as const;

/**
 * A rendered phone-number separator.
 *
 * @since 0.1.0
 */
export type PhoneNumberSeparator = (typeof PHONE_NUMBER_SEPARATORS)[number];

/**
 * Describes phone-number format options.
 *
 * @since 0.1.0
 */
export type PhoneNumberOptions = {
    /**
     * Whether to wrap the area code in parentheses. The default is `true`.
     */
    includeAreaCodeParens?: boolean;

    /**
     * The separator to render between number groups. The default is `'-'`.
     */
    separator?: PhoneNumberSeparator;
};

/**
 * Creates a phone-number format for 10-digit North American phone numbers.
 *
 * @since 0.1.0
 */
export function phoneNumber(options: PhoneNumberOptions = {}): Format {
    const { includeAreaCodeParens = true, separator = '-' } = options;
    let segments: SegmentedFormatSegments;

    if (includeAreaCodeParens) {
        segments = ['(', 3, ') ', 3, separator, 4];
    } else {
        segments = [3, separator, 3, separator, 4];
    }

    return defineSegmentedFormat({
        matches: /\d/,
        segments,
    });
}
