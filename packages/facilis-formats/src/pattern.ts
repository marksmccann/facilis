import { defineFormat, type Format } from 'facilis';
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
 * Describes one token-driven part in a parsed pattern definition.
 *
 * @private
 */
type PatternTokenPart = {
    kind: 'token';
    symbol: string;
    definition: PatternTokenDefinition;
};

/**
 * Describes one literal part in a parsed pattern definition.
 *
 * @private
 */
type PatternLiteralPart = {
    kind: 'literal';
    character: string;
};

/**
 * Describes one ordered part of a parsed pattern, either a token character or
 * a literal character from the original pattern string.
 *
 * @since 0.0.1
 */
export type PatternPart = PatternTokenPart | PatternLiteralPart;

/**
 * The built-in token definitions shared by the shorthand string syntax and the
 * explicit object form when `tokens` is omitted.
 *
 * @private
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
 * Normalizes the accepted pattern input forms into the explicit parse options
 * shape used by the parser.
 *
 * @private
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
 * Parses a pattern string into one ordered array of parts, where each entry
 * describes either a token character or a literal character from the pattern.
 *
 * @private
 */
function parsePatternOptions(options: ParsePatternOptions): PatternPart[] {
    const { pattern, tokens } = options;

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

        if (definition) {
            patternParts.push({
                kind: 'token',
                symbol: character,
                definition,
            });
            continue;
        }

        patternParts.push({
            kind: 'literal',
            character,
        });
    }

    if (!patternParts.some((part) => part.kind === 'token')) {
        reporter.fail('ERR04');
    }

    return patternParts;
}

/**
 * Tests whether one raw character can fill one token slot.
 *
 * @private
 */
function matchesPatternToken(
    definition: PatternTokenDefinition,
    character: string
): boolean {
    definition.matches.lastIndex = 0;
    return definition.matches.test(character);
}

/**
 * Groups the parsed pattern literals into the strings that should appear
 * before each token slot, plus any trailing literals that should appear after
 * the final token slot.
 *
 * @private
 */
function resolvePatternLiterals(patternParts: PatternPart[]): {
    literalsBeforeTokens: string[];
    trailingLiterals: string;
} {
    const literalsBeforeTokens: string[] = [];
    let pendingLiterals = '';

    for (const part of patternParts) {
        if (part.kind === 'literal') {
            pendingLiterals += part.character;
            continue;
        }

        literalsBeforeTokens.push(pendingLiterals);
        pendingLiterals = '';
    }

    return {
        literalsBeforeTokens,
        trailingLiterals: pendingLiterals,
    };
}

/**
 * Creates a pattern format instance from a tokenized pattern string.
 *
 * @since 0.0.1
 */
export function pattern(input: string): Format;
export function pattern(input: PatternOptions): Format;
export function pattern(input: PatternInput): Format {
    const patternOptions = normalizePatternOptions(input);
    const patternParts = parsePatternOptions(patternOptions);
    const tokenParts = patternParts.filter(
        (part): part is PatternTokenPart => part.kind === 'token'
    );
    const { literalsBeforeTokens, trailingLiterals } =
        resolvePatternLiterals(patternParts);

    return defineFormat({
        name: 'pattern',
        normalize(character, state) {
            const tokenPart = tokenParts[state.normalized.length];

            if (!tokenPart) return;

            if (matchesPatternToken(tokenPart.definition, character)) {
                state.append(character);
            }
        },
        format(character, state) {
            state.append(literalsBeforeTokens[state.index] ?? '');
            state.append(character);
            state.advance();

            // Append the trailing literals after the last tokens has been filled
            if (state.index === tokenParts.length - 1) {
                state.append(trailingLiterals);
            }
        },
    });
}
