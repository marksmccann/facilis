import { defineFormat, type Format } from 'facilis';

/**
 * The configuration options for a text format.
 *
 * @since 0.1.0
 */
export type TextOptions = {
    /**
     * The regular expression that determines which characters are permitted
     * in the text value.
     */
    matches: RegExp;
};

/**
 * Creates a text format instance.
 *
 * @since 0.1.0
 */
export function text(options: TextOptions): Format {
    return defineFormat({
        normalize(raw) {
            const characters = Array.from(raw);
            const matching = characters.filter((character) => {
                options.matches.lastIndex = 0;
                return options.matches.test(character);
            });

            return matching.join('');
        },
    });
}
