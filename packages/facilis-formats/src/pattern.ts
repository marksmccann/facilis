import { defineFormat, type Facilis } from 'facilis';
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
 * The internal normalized pattern options shape after defaults have been
 * applied.
 */
type NormalizedPatternOptions = {
    pattern: string;
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
type PatternPart = PatternTokenPart | PatternLiteralPart;

/**
 * Normalizes the pattern input into the explicit object form, applying the
 * built-in preset tokens when the shorthand string form is used.
 */
function normalizePatternOptions(
    input: PatternInput
): NormalizedPatternOptions {
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
 */
function parsePattern(options: NormalizedPatternOptions): PatternPart[] {
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
            const tokenPart: PatternTokenPart = {
                kind: 'token',
                symbol: character,
                definition,
            };

            patternParts.push(tokenPart);
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

/**
 * Returns only the token parts from the parsed pattern.
 */
function getTokenParts(patternParts: PatternPart[]): PatternTokenPart[] {
    return patternParts.filter(
        (part): part is PatternTokenPart => part.kind === 'token'
    );
}

/**
 * Tests whether a raw character satisfies a token part's matching rule.
 */
function characterMatchesToken(tokenPart: PatternTokenPart, character: string) {
    const { matches } = tokenPart.definition;

    matches.lastIndex = 0;

    return matches.test(character);
}

/**
 * Normalizes the raw value by scanning characters left to right and filling
 * token parts in order with the first matching characters that appear.
 */
function normalizeValue(rawValue: string, patternParts: PatternPart[]) {
    const tokenParts = getTokenParts(patternParts);
    let tokenIndex = 0;
    let normalizedValue = '';

    for (const character of rawValue) {
        const tokenPart = tokenParts[tokenIndex];

        if (!tokenPart) break;

        if (!characterMatchesToken(tokenPart, character)) {
            continue;
        }

        normalizedValue += character;
        tokenIndex += 1;
    }

    return normalizedValue;
}

/**
 * Builds the formatted value by filling token parts from the normalized value
 * and including literal parts only after their preceding token count has been reached.
 */
function formatValue(normalizedValue: string, patternParts: PatternPart[]) {
    if (normalizedValue === '') return '';

    let formattedValue = '';
    let tokenCount = 0;

    for (const part of patternParts) {
        if (part.kind === 'literal') {
            // Show a literal only after the user has filled enough
            // token parts to reach it in the pattern.
            if (normalizedValue.length > tokenCount) {
                formattedValue += part.character;
            }

            continue;
        }

        const character = normalizedValue[tokenCount];

        if (!character) break;

        formattedValue += character;
        tokenCount += 1;
    }

    return formattedValue;
}

/**
 * Counts how many token parts are matched before the raw selection position,
 * clamped to the normalized value length.
 */
function countTokensBeforeSelection(
    rawValue: string,
    rawSelectionPosition: number,
    normalizedValue: string,
    patternParts: PatternPart[]
) {
    const tokenParts = getTokenParts(patternParts);
    const rawCharacters = rawValue.slice(0, rawSelectionPosition).split('');
    let tokenCount = 0;

    for (const character of rawCharacters) {
        const tokenPart = tokenParts[tokenCount];

        if (!tokenPart) {
            break;
        }

        if (!characterMatchesToken(tokenPart, character)) {
            continue;
        }

        tokenCount += 1;
    }

    return Math.min(tokenCount, normalizedValue.length);
}

/**
 * Maps the raw selection position to the corresponding position in the
 * formatted value by counting matched token parts before the selection.
 */
function getSelectionPosition(
    normalizedValue: string,
    rawValue: string,
    rawSelectionPosition: number,
    patternParts: PatternPart[]
) {
    const tokensBeforeSelection = countTokensBeforeSelection(
        rawValue,
        rawSelectionPosition,
        normalizedValue,
        patternParts
    );

    if (tokensBeforeSelection <= 0) return 0;

    let selectionPosition = 0;
    let tokenCount = 0;

    for (const part of patternParts) {
        if (part.kind === 'literal') {
            // Count a visible literal toward the formatted selection position
            // once the filled token count has progressed past it.
            if (normalizedValue.length > tokenCount) {
                selectionPosition += 1;
            }

            continue;
        }

        if (tokenCount === tokensBeforeSelection) break;

        selectionPosition += 1;
        tokenCount += 1;

        if (tokenCount === tokensBeforeSelection) {
            return selectionPosition;
        }
    }

    return selectionPosition;
}

/**
 * Creates a pattern format instance from a tokenized pattern string.
 *
 * @since 0.0.1
 */
export function pattern(input: string): Facilis.FormatInstance;
export function pattern(input: PatternOptions): Facilis.FormatInstance;
export function pattern(input: PatternInput): Facilis.FormatInstance {
    const patternOptions = normalizePatternOptions(input);
    const patternParts = parsePattern(patternOptions);

    return defineFormat({
        name: 'pattern',
        normalizeValue({ rawValue }) {
            return normalizeValue(rawValue, patternParts);
        },
        formatValue({ normalizedValue }) {
            return formatValue(normalizedValue, patternParts);
        },
        resolveSelection(context) {
            return {
                selectionStart: getSelectionPosition(
                    context.normalizedValue,
                    context.rawValue,
                    context.rawSelectionStart,
                    patternParts
                ),
                selectionEnd: getSelectionPosition(
                    context.normalizedValue,
                    context.rawValue,
                    context.rawSelectionEnd,
                    patternParts
                ),
            };
        },
    })();
}
