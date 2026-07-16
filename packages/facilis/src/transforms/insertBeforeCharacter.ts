/**
 * Describes one conditional insertion before a character.
 *
 * @private
 */
type InsertBeforeCharacterRule = {
    /**
     * The formatted position where the rule should be tested.
     */
    position: number;

    /**
     * The expression that the character at the configured position must match.
     */
    matches: RegExp;

    /**
     * The text to insert before the matching character.
     */
    insert: string;
};

/**
 * Inserts text before characters that match configured positional rules.
 *
 * @since 0.1.0
 */
export default function insertBeforeCharacter(
    value: string,
    rules: InsertBeforeCharacterRule[]
) {
    let formatted = '';

    value.split('').forEach((character) => {
        const rule = rules.find(({ matches, position }) => {
            matches.lastIndex = 0;
            return position === formatted.length && matches.test(character);
        });

        if (rule) {
            formatted += rule.insert;
        }

        formatted += character;
    });

    return formatted;
}
