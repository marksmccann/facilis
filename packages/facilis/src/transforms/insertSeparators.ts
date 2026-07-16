/**
 * Options for inserting separators into a string.
 *
 * @private
 */
type InsertSeparatorsOptions = {
    /**
     * The formatted indexes before which the separator should be inserted.
     * Positions are resolved against the output value as it is built.
     */
    positions: number[];

    /**
     * The separator to insert.
     */
    separator: string;
};

/**
 * Inserts one separator before each configured position in a string.
 *
 * @since 0.1.0
 */
export default function insertSeparators(
    value: string,
    options: InsertSeparatorsOptions
) {
    const { positions, separator } = options;
    let formatted = '';

    value.split('').forEach((character) => {
        if (positions.includes(formatted.length)) {
            formatted += separator;
        }

        formatted += character;
    });

    return formatted;
}
