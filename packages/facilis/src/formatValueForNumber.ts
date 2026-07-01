import type { FormatValueContext } from './types';

/**
 * The configuration options for numeric value formatting.
 *
 * @since 0.0.1
 */
export type FormatValueForNumberOptions = {
    /**
     * The thousands separator to insert into the integer portion. The default
     * is an empty string, which disables thousands separators.
     */
    thousandsSeparator?: string;

    /**
     * The decimal separator to use in the formatted value. The default is
     * `'.'`.
     */
    decimalSeparator?: string;

    /**
     * The maximum number of decimal places to preserve in the formatted
     * value. The default is `0`, which omits the fractional portion.
     */
    decimalPlaces?: number;
};

/**
 * Applies the default numeric-formatting options when an option is omitted.
 */
function normalizeOptions(options: FormatValueForNumberOptions = {}) {
    return {
        decimalSeparator: options.decimalSeparator ?? '.',
        decimalPlaces: Math.max(0, options.decimalPlaces ?? 0),
        thousandsSeparator: options.thousandsSeparator ?? '',
    };
}

/**
 * Formats the integer portion with an optional thousands separator.
 */
function formatInteger(integerDigits: string, thousandsSeparator: string) {
    if (!thousandsSeparator) return integerDigits;
    return integerDigits.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
}

/**
 * Formats a normalized numeric string for display by optionally inserting
 * thousands separators and preserving up to the configured number of decimal
 * places.
 *
 * @since 0.0.1
 */
export function formatValueForNumber(
    context: FormatValueContext,
    options?: FormatValueForNumberOptions
) {
    const { normalizedValue } = context;

    if (normalizedValue === '' || normalizedValue === '-') {
        return normalizedValue;
    }

    // prettier-ignore
    const { decimalPlaces, decimalSeparator, thousandsSeparator } = normalizeOptions(options);
    const isNegative = normalizedValue.startsWith('-');
    const unsignedValue = normalizedValue.replace(/^-/, '');
    const hasDecimalPoint = unsignedValue.includes(decimalSeparator);
    const numberParts = unsignedValue.split(decimalSeparator);
    const [integerDigits = '', fractionalDigits = ''] = numberParts;
    const formattedFraction = fractionalDigits.slice(0, decimalPlaces);
    const formattedInteger = formatInteger(integerDigits, thousandsSeparator);
    const hasTrailingDecimalPoint = !hasDecimalPoint && !formattedFraction;
    const negativeSign = isNegative ? '-' : '';

    // Exclude the fractional value if there isn't any
    if (decimalPlaces === 0 || hasTrailingDecimalPoint) {
        return `${negativeSign}${formattedInteger}`;
    }

    return [
        negativeSign,
        formattedInteger,
        decimalSeparator,
        formattedFraction,
    ].join('');
}
