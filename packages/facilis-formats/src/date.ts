import {
    defineFormat,
    formatValueForDate,
    normalizeValueForDate,
    parseDateOptions,
    resolveSelectionForDate,
    type FormatInstance,
    type ParseDateOptions,
} from 'facilis';

/**
 * The configuration options for a date format.
 *
 * @since 0.0.1
 */
export type DateOptions = ParseDateOptions & {
    /**
     * Whether to reject impossible month and day values while typing.
     */
    strictMonthAndDay?: boolean;
    /**
     * Whether to insert a leading zero for safe single-digit month and day
     * values while typing.
     */
    insertLeadingZero?: boolean;
};

/**
 * Creates a formatter for numeric date input using one approved canonical
 * pattern and an optional rendered separator override.
 *
 * @since 0.0.1
 */
export function date(options: DateOptions): FormatInstance {
    const dateOptions = parseDateOptions(options);
    const patternSegments = dateOptions.pattern.split('/');
    const { strictMonthAndDay = false, insertLeadingZero = false } = options;
    const { separator } = dateOptions;

    return defineFormat({
        name: 'date',
        normalizeValue({ rawValue }) {
            return normalizeValueForDate(rawValue, {
                strictMonthAndDay,
                insertLeadingZero,
                patternSegments,
            });
        },
        formatValue({ normalizedValue }) {
            return formatValueForDate(normalizedValue, {
                insertLeadingZero,
                patternSegments,
                separator,
            });
        },
        resolveSelection(context) {
            return resolveSelectionForDate(context, {
                insertLeadingZero,
                patternSegments,
                separator,
            });
        },
    })();
}
