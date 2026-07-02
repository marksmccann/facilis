/**
 * Clamps a complete numeric value to the configured numeric bounds.
 *
 * @private
 */
export default function clampCompleteNumberValue(
    value: string,
    decimalSeparator: string,
    min?: number,
    max?: number
) {
    if (
        value.length === 0 ||
        value === '-' ||
        value.endsWith(decimalSeparator)
    ) {
        return value;
    }

    const numericValue = Number(value.replace(decimalSeparator, '.'));

    if (!Number.isFinite(numericValue)) {
        return value;
    }

    if (min !== undefined && numericValue < min) {
        return String(min);
    }

    if (max !== undefined && numericValue > max) {
        return String(max);
    }

    return value;
}
