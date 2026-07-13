import {
    defineFormat,
    isAppendDuplicateFormattingAt,
    isAppendExpectedFormattingAt,
    isAppendFormatting,
    isDeleteBackwardOverFormatting,
    isInsertAtMaxLength,
    type Format,
} from 'facilis';
import { reporter } from './reporter';

/**
 * The canonical date patterns supported by the date format. Patterns always
 * use `/` as their separator, regardless of the rendered separator.
 *
 * @since 0.1.0
 */
const DatePatterns = [
    'MM/DD/YY',
    'MM/DD/YYYY',
    'DD/MM/YY',
    'DD/MM/YYYY',
    'YY/MM/DD',
    'YYYY/MM/DD',
    'MM/YY',
    'MM/YYYY',
    'YY/MM',
    'YYYY/MM',
] as const;

/**
 * The separators supported when rendering formatted date values.
 *
 * @since 0.1.0
 */
const DateSeparators = ['/', '-', '.'] as const;

/**
 * A canonical date pattern.
 *
 * @since 0.1.0
 */
export type DatePattern = (typeof DatePatterns)[number];

/**
 * A rendered date separator.
 *
 * @since 0.1.0
 */
export type DateSeparator = (typeof DateSeparators)[number];

/**
 * The configuration options for a date format.
 *
 * @since 0.1.0
 */
export type DateOptions = {
    /**
     * The canonical pattern that defines the date parts to format.
     */
    pattern: DatePattern;

    /**
     * The separator to render between date parts. The default is `/`.
     */
    separator?: DateSeparator;
};

/**
 * The complete date-format options after defaults have been applied.
 *
 * @private
 */
type NormalizedDateOptions = Required<DateOptions>;

/**
 * Applies date-format defaults and validates the supported option values.
 *
 * @private
 */
function normalizeDateOptions(options: DateOptions): NormalizedDateOptions {
    if (!options || !Object.hasOwn(options, 'pattern')) {
        reporter.fail('ERR05');
    }

    const separator = options.separator ?? '/';

    if (!DatePatterns.includes(options.pattern)) {
        reporter.fail('ERR07');
    }

    if (!DateSeparators.includes(separator)) {
        reporter.fail('ERR08');
    }

    return {
        pattern: options.pattern,
        separator,
    };
}

/**
 * Creates a date format for numeric date input.
 *
 * @since 0.1.0
 */
export function date(options: DateOptions): Format {
    const { pattern, separator } = normalizeDateOptions(options);
    const segments = pattern.split('/');
    const segmentLengths = segments.map((segment) => segment.length);
    const maxDigits = segmentLengths.reduce(
        (total, length) => total + length,
        0
    );

    return defineFormat({
        normalize(raw) {
            return raw.replace(/\D/g, '').slice(0, maxDigits);
        },
        format(normalized) {
            const parts: string[] = [];
            let index = 0;

            for (const length of segmentLengths) {
                const part = normalized.slice(index, index + length);

                if (part) {
                    parts.push(part);
                }

                index += length;
            }

            return parts.join(separator);
        },
        edit: {
            append(context) {
                const { attempted } = context;

                if (!isAppendFormatting(context)) {
                    return;
                }

                let position = 0;

                for (const length of segmentLengths.slice(0, -1)) {
                    position += length + separator.length;

                    if (
                        isAppendExpectedFormattingAt(
                            context,
                            separator,
                            position - separator.length
                        )
                    ) {
                        return attempted;
                    }

                    if (
                        isAppendDuplicateFormattingAt(
                            context,
                            separator,
                            position - separator.length
                        )
                    ) {
                        return null;
                    }
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
