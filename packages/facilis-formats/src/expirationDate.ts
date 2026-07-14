import { defineFormat, type Format } from 'facilis';
import {
    isAppendDuplicateFormattingAt,
    isAppendExpectedFormattingAt,
    isAppendFormatting,
    isDeleteBackwardOverFormatting,
    isInsertAtMaxLength,
} from 'facilis/guards';
import { insertSeparators } from 'facilis/transforms';

/**
 * The number of digits supported by the default expiration-date layout.
 *
 * @private
 */
const DIGIT_LIMIT = 4;

/**
 * Creates an expiration-date format for the common MM/YY card layout.
 *
 * @since 0.1.0
 */
export function expirationDate(): Format {
    return defineFormat({
        normalize(raw) {
            return raw.replace(/\D/g, '').slice(0, DIGIT_LIMIT);
        },
        format(normalized) {
            return insertSeparators(normalized, {
                positions: [2],
                separator: '/',
            });
        },
        edit: {
            append(context) {
                const { attempted } = context;

                if (!isAppendFormatting(context)) {
                    return;
                }

                if (isAppendExpectedFormattingAt(context, '/', 2)) {
                    return attempted;
                }

                if (isAppendDuplicateFormattingAt(context, '/', 2)) {
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
