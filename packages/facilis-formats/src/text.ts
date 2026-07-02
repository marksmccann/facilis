import {
    defineFormat,
    matchesText,
    type FormatInstance,
    type FormatState,
    type NormalizeState,
} from 'facilis';

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
 * Creates a text format instance that preserves only the characters matched by
 * the provided regular expression.
 *
 * @since 0.0.1
 */
export function text(options: TextOptions): FormatInstance {
    const { matches } = options;

    return defineFormat({
        name: 'text',
        normalize(character: string, state: NormalizeState) {
            if (matchesText(character, matches)) {
                state.append(character);
            }
        },
        format(character: string, state: FormatState) {
            state.append(character);
            state.consume();
        },
    })();
}
