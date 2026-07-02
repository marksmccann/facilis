/**
 * Determines whether the current normalized value is complete enough to clamp.
 *
 * @private
 */
export default function shouldClampNumberValue(
    value: string,
    decimalPlaces: number,
    decimalSeparator: string
) {
    const shouldClampInteger = decimalPlaces === 0;
    const shouldClampDecimal =
        decimalPlaces > 0 &&
        value.includes(decimalSeparator) &&
        !value.endsWith(decimalSeparator);

    return shouldClampInteger || shouldClampDecimal;
}
