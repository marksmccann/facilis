/**
 * Options for normalizing negative signs in a number-like string.
 *
 * @since 0.1.0
 */
export type NormalizeNegativeSignOptions = {
    /**
     * Whether the normalized value should preserve one leading minus sign.
     */
    allowNegative?: boolean;
};

/**
 * Removes unsupported minus signs. When negatives are supported, keeps one
 * leading minus sign and removes the rest.
 *
 * @since 0.1.0
 */
export default function normalizeNegativeSign(
    value: string,
    options: NormalizeNegativeSignOptions = {}
) {
    const { allowNegative = false } = options;
    const withoutSigns = value.replaceAll('-', '');

    if (!allowNegative || !value.startsWith('-')) {
        return withoutSigns;
    }

    return `-${withoutSigns}`;
}
