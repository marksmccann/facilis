import {
    defineFormat,
    isAppendDuplicateFormattingAt,
    isAppendExpectedFormattingAt,
    isAppendFormatting,
    isDeleteBackwardOverFormatting,
    isInsertAtMaxLength,
    type Format,
} from 'facilis';

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
 * The number of digits supported by the default ZIP code layout.
 *
 * @private
 */
const DIGIT_LIMIT = 5;

/**
 * The number of digits supported by the ZIP+4 layout.
 *
 * @private
 */
const PLUS_FOUR_DIGIT_LIMIT = 9;

/**
 * Creates a ZIP code format.
 *
 * @since 0.1.0
 */
export function zipCode(options: ZipCodeOptions = {}): Format {
    const { includePlusFour = false } = options;
    const maxDigits = includePlusFour ? PLUS_FOUR_DIGIT_LIMIT : DIGIT_LIMIT;

    return defineFormat({
        normalize(raw) {
            return raw.replace(/\D/g, '').slice(0, maxDigits);
        },
        format(normalized) {
            if (!includePlusFour) {
                return normalized;
            }

            const zip = normalized.slice(0, DIGIT_LIMIT);
            const plusFour = normalized.slice(DIGIT_LIMIT);
            let formatted = '';

            if (zip) formatted += zip;
            if (plusFour) formatted += `-${plusFour}`;

            return formatted;
        },
        edit: {
            append(context) {
                const { attempted, previous } = context;

                if (!includePlusFour || !isAppendFormatting(context)) {
                    return;
                }

                if (isAppendExpectedFormattingAt(context, '-', DIGIT_LIMIT)) {
                    return attempted;
                }

                if (isAppendDuplicateFormattingAt(context, '-', DIGIT_LIMIT)) {
                    return previous;
                }
            },
            insert(context) {
                if (isInsertAtMaxLength(context, maxDigits)) {
                    return null;
                }
            },
            deleteBackward(context) {
                const { cursor, previous } = context;

                if (isDeleteBackwardOverFormatting(context)) {
                    return {
                        value: previous,
                        selectionStart: cursor - 1,
                        selectionEnd: cursor - 1,
                    };
                }
            },
        },
    });
}
