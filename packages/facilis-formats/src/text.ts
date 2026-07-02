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

/**
 * Creates a text format instance.
 *
 * @since 0.0.1
 */
export function text(options: TextOptions): Format {
    return defineFormat({
        name: 'text',
        normalize(character, state) {
            if (options.matches.test(character)) {
                state.append(character);
            }
        },
        format(character, state) {
            state.append(character);
            state.advance();
        },
    });
}
