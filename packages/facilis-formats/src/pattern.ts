import {
    defineFormat,
    matchesText,
    parsePatternOptions,
    type FormatState,
    type FormatInstance,
    type NormalizeState,
    type ParsePatternOptions,
    type PatternTokenDefinitions,
} from 'facilis';

/**
 * The built-in token definitions shared by the shorthand string syntax and the
 * explicit object form when `tokens` is omitted.
 */
const DefaultPatternTokens = {
    '#': { matches: /\d/ },
    '*': { matches: /./ },
};

/**
 * The explicit configuration object for a pattern format.
 *
 * @since 0.0.1
 */
export type PatternOptions = {
    /**
     * The pattern string that defines literal characters and token slots.
     */
    pattern: string;

    /**
     * The token definitions keyed by the wildcard characters used in the pattern.
     */
    tokens?: PatternTokenDefinitions;
};

/**
 * The accepted input shape for creating a pattern format, either the shorthand
 * pattern string form or the explicit object form.
 *
 * @since 0.0.1
 */
export type PatternInput = string | PatternOptions;

/**
 * Normalizes the pattern input into the explicit object form, applying the
 * built-in preset tokens when the shorthand string form is used.
 */
function normalizePatternOptions(input: PatternInput): ParsePatternOptions {
    if (typeof input === 'string') {
        return {
            pattern: input,
            tokens: DefaultPatternTokens,
        };
    }

    return {
        pattern: input.pattern,
        tokens: input.tokens ?? DefaultPatternTokens,
    };
}

/**
 * Creates a pattern format instance from a tokenized pattern string.
 *
 * @since 0.0.1
 */
export function pattern(input: string): FormatInstance;
export function pattern(input: PatternOptions): FormatInstance;
export function pattern(input: PatternInput): FormatInstance {
    const patternOptions = normalizePatternOptions(input);
    const patternParts = parsePatternOptions(patternOptions);
    const tokenParts = patternParts.filter((part) => part.kind === 'token');
    const insertionsByNormalizedIndex: string[] = [];
    const tokenPartsByNormalizedIndex: typeof tokenParts = [];
    let normalizedIndex = 0;

    for (const part of patternParts) {
        if (part.kind === 'literal') {
            insertionsByNormalizedIndex[normalizedIndex] =
                (insertionsByNormalizedIndex[normalizedIndex] ?? '') +
                part.character;
            continue;
        }

        tokenPartsByNormalizedIndex[normalizedIndex] = part;
        normalizedIndex += 1;
    }

    return defineFormat({
        name: 'pattern',
        normalize(character, state: NormalizeState) {
            const tokenPart = tokenParts[state.normalized.length];

            if (!tokenPart) {
                return;
            }

            if (matchesText(character, tokenPart.definition.matches)) {
                state.append(character);
            }
        },
        format(character: string, state: FormatState) {
            const tokenPart =
                tokenPartsByNormalizedIndex[state.normalizedPosition];
            const insertion =
                insertionsByNormalizedIndex[state.normalizedPosition] ?? '';

            if (insertion !== '') {
                state.append(insertion);
            }

            if (!tokenPart) {
                return;
            }

            state.append(character);
            state.consume();
        },
    })();
}

// Part 1:
// resolveNormalizedSelection(...)
// countCharacters(value, predicate): number
// countCharacters(values, predicate): number[]
