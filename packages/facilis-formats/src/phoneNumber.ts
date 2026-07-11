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
 * The number of digits supported by the default North American
 * phone-number layout.
 *
 * @private
 */
const DIGIT_LIMIT = 10;

/**
 * Creates a phone-number format for 10-digit North American phone numbers.
 *
 * @since 0.1.0
 */
export function phoneNumber(): Format {
    return defineFormat({
        normalize(raw) {
            return raw.replace(/\D/g, '').slice(0, DIGIT_LIMIT);
        },
        format(normalized) {
            const areaCode = normalized.slice(0, 3);
            const prefix = normalized.slice(3, 6);
            const lineNumber = normalized.slice(6);
            let formatted = '';

            if (areaCode) formatted += `(${areaCode}`;
            if (prefix) formatted += `) ${prefix}`;
            if (lineNumber) formatted += `-${lineNumber}`;

            return formatted;
        },
        edit: {
            append(context) {
                const { attempted, previous } = context;

                if (!isAppendFormatting(context)) {
                    return;
                }

                if (
                    isAppendExpectedFormattingAt(context, '(', 0) ||
                    isAppendExpectedFormattingAt(context, ') ', 4) ||
                    isAppendExpectedFormattingAt(context, '-', 9)
                ) {
                    return attempted;
                }

                if (
                    isAppendDuplicateFormattingAt(context, '(', 0) ||
                    isAppendDuplicateFormattingAt(context, ') ', 4) ||
                    isAppendDuplicateFormattingAt(context, '-', 9)
                ) {
                    return previous;
                }
            },
            insert(context) {
                if (isInsertAtMaxLength(context, DIGIT_LIMIT)) {
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
