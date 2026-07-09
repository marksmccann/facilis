import { defineFormat, type Format } from 'facilis';

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

function matchesCharacter(character: string, expression: RegExp): boolean {
    expression.lastIndex = 0;
    return expression.test(character);
}

/**
 * Creates a text format instance.
 *
 * @since 0.0.1
 */
export function text(options: TextOptions): Format {
    return defineFormat({
        normalize(input) {
            return Array.from(input)
                .filter((character) =>
                    matchesCharacter(character, options.matches)
                )
                .join('');
        },
    });
}
