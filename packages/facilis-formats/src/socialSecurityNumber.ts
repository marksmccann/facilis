import {
    defineFormat,
    isAppendDuplicateFormattingAt,
    isAppendExpectedFormattingAt,
    isAppendFormatting,
    isDeleteBackwardOverFormatting,
    isInsertAtMaxLength,
    insertSeparators,
    type Format,
} from 'facilis';

/**
 * The number of digits supported by the default Social Security number layout.
 *
 * @private
 */
const DIGIT_LIMIT = 9;

/**
 * Creates a Social Security number format.
 *
 * @since 0.1.0
 */
export function socialSecurityNumber(): Format {
    return defineFormat({
        normalize(raw) {
            return raw.replace(/\D/g, '').slice(0, DIGIT_LIMIT);
        },
        format(normalized) {
            return insertSeparators(normalized, {
                positions: [3, 6],
                separator: '-',
            });
        },
        edit: {
            append(context) {
                const { attempted } = context;

                if (!isAppendFormatting(context)) {
                    return;
                }

                if (
                    isAppendExpectedFormattingAt(context, '-', 3) ||
                    isAppendExpectedFormattingAt(context, '-', 6)
                ) {
                    return attempted;
                }

                if (
                    isAppendDuplicateFormattingAt(context, '-', 3) ||
                    isAppendDuplicateFormattingAt(context, '-', 6)
                ) {
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
