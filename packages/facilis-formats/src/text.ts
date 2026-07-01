import { defineFormat, type FormatInstance } from 'facilis';
import { resolveSelectionForText } from 'facilis';

/**
 * The configuration options for a text format.
 *
 * @since 0.0.1
 */
export type TextOptions = {
    /**
     * The regular expression that determines which characters are permitted
     * in the text value.
     */
    matches: RegExp;
};

/**
 * Produces the normalized text value by retaining only characters that satisfy
 * the configured regular expression.
 */
function normalizeTextValue(rawValue: string, matches: RegExp) {
    const characters = rawValue.split('');
    const filteredCharacters = characters.filter((character) => {
        matches.lastIndex = 0;
        return matches.test(character);
    });

    return filteredCharacters.join('');
}

/**
 * Creates a text format instance that preserves only the characters matched by
 * the provided regular expression.
 *
 * @since 0.0.1
 */
export function text(options: TextOptions): FormatInstance {
    const { matches } = options;

    return defineFormat({
        name: 'text',
        normalizeValue({ rawValue }) {
            return normalizeTextValue(rawValue, matches);
        },
        formatValue({ normalizedValue }) {
            return normalizedValue;
        },
        resolveSelection(context) {
            return resolveSelectionForText(context, {
                characterMatches: matches,
            });
        },
    })();
}
