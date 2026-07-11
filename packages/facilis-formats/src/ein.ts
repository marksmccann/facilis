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
 * The number of digits supported by the default EIN layout.
 *
 * @private
 */
const DIGIT_LIMIT = 9;

/**
 * Creates an Employer Identification Number format.
 *
 * @since 0.1.0
 */
export function ein(): Format {
    return defineFormat({
        normalize(raw) {
            return raw.replace(/\D/g, '').slice(0, DIGIT_LIMIT);
        },
        format(normalized) {
            const prefix = normalized.slice(0, 2);
            const identifier = normalized.slice(2);
            let formatted = '';

            if (prefix) formatted += prefix;
            if (identifier) formatted += `-${identifier}`;

            return formatted;
        },
        edit: {
            append(context) {
                const { attempted } = context;

                if (!isAppendFormatting(context)) {
                    return;
                }

                if (isAppendExpectedFormattingAt(context, '-', 2)) {
                    return attempted;
                }

                if (isAppendDuplicateFormattingAt(context, '-', 2)) {
                    return null;
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
