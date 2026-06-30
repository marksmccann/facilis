/**
 * The configuration options for numeric value normalization.
 *
 * @since 0.0.1
 */
export type NormalizeValueForNumberOptions = {
    /**
     * The maximum number of decimal places to preserve. The default is `0`,
     * which produces an integer-only normalized value.
     */
    decimalPlaces?: number;

    /**
     * The decimal separator to recognize in the raw input. The default is
     * `'.'`.
     */
    decimalSeparator?: string;

    /**
     * Whether to preserve a leading minus sign for negative values. The
     * default is `false`.
     */
    allowNegative?: boolean;

    /**
     * Whether to trim unnecessary leading zeros from the integer portion of
     * the normalized value, such as converting `00012` to `12`. The default
     * is `false`.
     */
    trimLeadingZeros?: boolean;

    /**
     * The minimum numeric value allowed during normalization. When the
     * normalized value resolves to a complete number below this boundary, it
     * is clamped to the minimum.
     */
    min?: number;

    /**
     * The maximum numeric value allowed during normalization. When the
     * normalized value resolves to a complete number above this boundary, it
     * is clamped to the maximum.
     */
    max?: number;
};

/**
 * Applies the default numeric-normalization options when an option is omitted.
 */
function normalizeOptions(options: NormalizeValueForNumberOptions = {}) {
    return {
        allowNegative: options.allowNegative ?? false,
        decimalSeparator: options.decimalSeparator ?? '.',
        decimalPlaces: Math.max(0, options.decimalPlaces ?? 0),
        max: options.max,
        min: options.min,
        trimLeadingZeros: options.trimLeadingZeros ?? false,
    };
}

/**
 * Creates a global regular expression that matches one literal separator.
 */
function createSeparatorExpression(value: string) {
    const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escapedValue, 'g');
}

/**
 * Normalizes the raw numeric characters by keeping only digits and the
 * configured decimal separator.
 */
function normalizeCharacters(rawValue: string, decimalSeparator: string) {
    const { source } = createSeparatorExpression(decimalSeparator);

    // Remove all non-numeric characters from string
    const numericCharacters = rawValue.replace(
        new RegExp(`[^\\d${source}]`, 'g'),
        ''
    );

    return numericCharacters;
}

/**
 * Normalizes the decimal portion by keeping only the first decimal point and
 * trimming the fractional portion to the configured precision.
 */
function normalizeDecimalValue(
    normalizedCharacters: string,
    firstDecimalIndex: number,
    decimalPlaces: number,
    decimalSeparator: string
) {
    const integerDigits = normalizedCharacters.slice(0, firstDecimalIndex);
    const fractionalDigits = normalizedCharacters.slice(firstDecimalIndex + 1);
    const separatorExpression = createSeparatorExpression(decimalSeparator);
    // prettier-ignore
    const fractionalCharacters = fractionalDigits.replace(separatorExpression, '');
    const fractionalValue = fractionalCharacters.slice(0, decimalPlaces);

    return `${integerDigits}${decimalSeparator}${fractionalValue}`;
}

/**
 * Trims unnecessary leading zeros from the integer portion while preserving a
 * single meaningful zero for values like `0`, `0.5`, and `0.`.
 */
function trimLeadingZerosFromNormalizedValue(
    normalizedValue: string,
    decimalSeparator: string
) {
    const isNegative = normalizedValue.startsWith('-');
    const unsignedValue = normalizedValue.replace(/^-?/, '');
    const firstDecimalIndex = unsignedValue.indexOf(decimalSeparator);
    const hasDecimal = firstDecimalIndex !== -1;
    let integerDigits = unsignedValue;
    let fractionalPortion = '';

    if (unsignedValue === '') {
        return normalizedValue;
    }

    if (hasDecimal) {
        integerDigits = unsignedValue.slice(0, firstDecimalIndex);
        fractionalPortion = unsignedValue.slice(firstDecimalIndex);
    }

    const trimmedIntegerDigits = integerDigits.replace(/^0+(?=\d)/u, '');
    const nextUnsignedValue = `${trimmedIntegerDigits}${fractionalPortion}`;

    return isNegative ? `-${nextUnsignedValue}` : nextUnsignedValue;
}

/**
 * Converts one normalized numeric string into a JavaScript number when it
 * has resolved to a complete value. Incomplete numeric values (e.g., partial
 * edit states) return `null`.
 */
function parseNormalizedNumber(
    normalizedValue: string,
    decimalSeparator: string
) {
    if (
        normalizedValue === '' ||
        normalizedValue === '-' ||
        normalizedValue === decimalSeparator ||
        normalizedValue === `-${decimalSeparator}` ||
        normalizedValue.endsWith(decimalSeparator)
    ) {
        return null;
    }

    const regex = createSeparatorExpression(decimalSeparator);
    const numericValue = Number(normalizedValue.replace(regex, '.'));

    if (Number.isNaN(numericValue)) return null;
    return numericValue;
}

/**
 * Converts one clamped numeric value back into the normalized string shape
 * used by the number helpers.
 */
function normalizeClampedNumber(
    numericValue: number,
    decimalPlaces: number,
    decimalSeparator: string
) {
    if (!Number.isFinite(numericValue)) return '';

    if (decimalPlaces === 0) {
        return Math.trunc(numericValue).toString();
    }

    const fixedValue = numericValue.toFixed(decimalPlaces);

    // Live clamping should keep the shortest equivalent numeric
    // string rather than preserving the zero padding introduced
    // by `toFixed` (e.g., "10.00" => "10", "10.50" => "10.5").
    const trimmedValue = fixedValue
        .replace(/(\.\d*?[1-9])0+$/u, '$1')
        .replace(/\.0+$/u, '')
        .replace(/\.$/u, '');

    return trimmedValue.replace('.', decimalSeparator);
}

/**
 * Clamps one normalized numeric value when range boundaries are configured.
 */
function clampNormalizedValue(
    normalizedValue: string,
    options: {
        decimalPlaces: number;
        decimalSeparator: string;
        max?: number;
        min?: number;
    }
) {
    const { decimalPlaces, decimalSeparator, max, min } = options;

    if (min == null && max == null) return normalizedValue;

    const numericValue = parseNormalizedNumber(
        normalizedValue,
        decimalSeparator
    );

    if (numericValue == null) return normalizedValue;

    let clampedValue = numericValue;

    if (min != null) {
        clampedValue = Math.max(clampedValue, min);
    }

    if (max != null) {
        clampedValue = Math.min(clampedValue, max);
    }

    return normalizeClampedNumber(
        clampedValue,
        decimalPlaces,
        decimalSeparator
    );
}

/**
 * Normalizes one raw input value into its semantic numeric string by removing
 * non-essential characters, keeping at most one decimal point, and truncating
 * the fractional portion to the configured precision.
 *
 * @since 0.0.1
 */
export function normalizeValueForNumber(
    rawValue: string,
    options?: NormalizeValueForNumberOptions
) {
    const {
        allowNegative,
        decimalPlaces,
        decimalSeparator,
        max,
        min,
        trimLeadingZeros,
    } = normalizeOptions(options);
    const normalizedCharacters = normalizeCharacters(
        rawValue,
        decimalSeparator
    );
    const hasLeadingNegativeSign = /^\s*-/.test(rawValue);
    const firstDecimalIndex = normalizedCharacters.indexOf(decimalSeparator);
    let normalizedValue: string;

    if (decimalPlaces === 0) {
        // decimals are not supported, remove them
        normalizedValue = normalizedCharacters.replace(
            createSeparatorExpression(decimalSeparator),
            ''
        );
    } else if (firstDecimalIndex === -1) {
        // decimals are supported, but there aren't any
        normalizedValue = normalizedCharacters;
    } else {
        // decimals are support and they exist
        normalizedValue = normalizeDecimalValue(
            normalizedCharacters,
            firstDecimalIndex,
            decimalPlaces,
            decimalSeparator
        );
    }

    if (allowNegative && hasLeadingNegativeSign) {
        normalizedValue = `-${normalizedValue}`;
    }

    if (trimLeadingZeros) {
        normalizedValue = trimLeadingZerosFromNormalizedValue(
            normalizedValue,
            decimalSeparator
        );
    }

    return clampNormalizedValue(normalizedValue, {
        decimalPlaces,
        decimalSeparator,
        max,
        min,
    });
}
