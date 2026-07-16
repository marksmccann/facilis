/**
 * Options for clamping a number-like string to numeric bounds.
 *
 * @private
 */
type ClampNumberOptions = {
    /**
     * The decimal separator used by the number-like string.
     */
    decimalSeparator?: string;

    /**
     * The minimum numeric value to allow.
     */
    min?: number;

    /**
     * The maximum numeric value to allow.
     */
    max?: number;
};

/**
 * Clamps a number-like string to numeric bounds. Incomplete values such as
 * `-`, `.`, `-.`, and `12.` are returned unchanged.
 *
 * @since 0.1.0
 */
export default function clampNumber(
    value: string,
    options: ClampNumberOptions = {}
) {
    const { decimalSeparator = '.', max, min } = options;

    if (
        value === '' ||
        value === '-' ||
        value === decimalSeparator ||
        value === `-${decimalSeparator}` ||
        value.endsWith(decimalSeparator)
    ) {
        return value;
    }

    const numericValue = Number(value.replace(decimalSeparator, '.'));

    if (!Number.isFinite(numericValue)) {
        return value;
    }

    if (min !== undefined && numericValue < min) {
        return String(min).replace('.', decimalSeparator);
    }

    if (max !== undefined && numericValue > max) {
        return String(max).replace('.', decimalSeparator);
    }

    return value;
}
