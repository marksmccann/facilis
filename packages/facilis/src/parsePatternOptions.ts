import { reporter } from './reporter';

/**
 * Defines the matching rule for a single token symbol in a pattern format.
 *
 * @since 0.0.1
 */
export type PatternTokenDefinition = {
    /**
     * Determines whether a raw character can fill this token slot.
     */
    matches: RegExp;
};

/**
 * Maps each token symbol used in a pattern string to the rule that determines
 * which raw characters can fill that token slot.
 *
 * @since 0.0.1
 */
export type PatternTokenDefinitions = Record<string, PatternTokenDefinition>;

/**
 * The explicit configuration object for one parsed pattern definition.
 *
 * @since 0.0.1
 */
export type ParsePatternOptions = {
    /**
     * The pattern string that defines literal characters and token slots.
     */
    pattern: string;
    /**
     * The token definitions keyed by the wildcard characters used in the pattern.
     */
    tokens: PatternTokenDefinitions;
};

/**
 * Represents one token character entry from the parsed pattern.
 */
type PatternTokenPart = {
    /** Identifies this parsed part as a token entry. */
    kind: 'token';
    /** The token symbol used in the original pattern string. */
    symbol: string;
    /** The token definition that should consume one normalized character. */
    definition: PatternTokenDefinition;
};

/**
 * Represents one literal character entry from the parsed pattern.
 */
type PatternLiteralPart = {
    /** Identifies this parsed part as a literal entry. */
    kind: 'literal';
    /** The literal character that should appear in the formatted value. */
    character: string;
};

/**
 * Describes one ordered part of a parsed pattern, either a token character or
 * a literal character from the original pattern string.
 */
export type PatternPart = PatternTokenPart | PatternLiteralPart;

/**
 * Parses a pattern string into one ordered array of parts, where each entry
 * describes either a token character or a literal character from the pattern.
 *
 * @since 0.0.1
 */
export function parsePatternOptions(
    options: ParsePatternOptions
): PatternPart[] {
    const { pattern, tokens } = options;

    // Make sure a pattern exists
    if (pattern === '') {
        reporter.fail('ERR01');
    }

    const patternParts: PatternPart[] = [];
    const tokenSymbols = Object.keys(tokens);

    if (tokenSymbols.length === 0) {
        reporter.fail('ERR02');
    }

    for (const symbol of tokenSymbols) {
        if (symbol.length !== 1) {
            reporter.fail('ERR03');
        }
    }

    for (const character of pattern) {
        const definition = tokens[character];
        const isToken = Boolean(definition);

        if (isToken) {
            patternParts.push({
                kind: 'token',
                symbol: character,
                definition,
            });
        } else {
            patternParts.push({
                kind: 'literal',
                character,
            });
        }
    }

    if (!patternParts.some((part) => part.kind === 'token')) {
        reporter.fail('ERR04');
    }

    return patternParts;
}
