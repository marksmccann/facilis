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
 * Extracts the token characters from one display value.
 *
 * @private
 */
function normalizeValueForPattern(patternParts: PatternPart[], input: string) {
    let value = '';
    let partIndex = 0;

    for (const character of input) {
        while (patternParts[partIndex]?.kind === 'literal') {
            partIndex += 1;
        }

        const part = patternParts[partIndex];

        if (!part || part.kind !== 'token') {
            break;
        }

        if (!matchesPatternToken(part.definition, character)) {
            continue;
        }

        value += character;
        partIndex += 1;
    }

    return value;
}

/**
 * Builds the display value for one normalized pattern value.
 *
 * @private
 */
function formatValueForPattern(patternParts: PatternPart[], value: string) {
    let displayValue = '';
    let valueIndex = 0;

    for (const part of patternParts) {
        if (part.kind === 'literal') {
            if (valueIndex < value.length) {
                displayValue += part.character;
            }

            continue;
        }

        const character = value[valueIndex];

        if (!character) {
            break;
        }

        displayValue += character;
        valueIndex += 1;
    }

    return displayValue;
}

/**
 * Resolves the literal run at one visible pattern position.
 *
 * @private
 */
function getPatternLiteralRun(patternParts: PatternPart[], position: number) {
    let literalRun = '';

    for (let index = position; index < patternParts.length; index += 1) {
        const part = patternParts[index];

        if (!part || part.kind !== 'literal') {
            break;
        }

        literalRun += part.character;
    }

    return literalRun;
}

/**
 * Tests whether typed text matches the next visible literal characters.
 *
 * @private
 */
function matchesNextPatternLiteral(
    patternParts: PatternPart[],
    position: number,
    text: string
) {
    if (text === '') {
        return false;
    }

    return getPatternLiteralRun(patternParts, position).startsWith(text);
}

/**
 * Tests whether the current display is holding typed literals beyond the
 * default formatted value.
 *
 * @private
 */
function hasPendingPatternLiteral(
    patternParts: PatternPart[],
    displayValue: string,
    value: string
) {
    const formattedValue = formatValueForPattern(patternParts, value);

    if (displayValue === formattedValue) {
        return false;
    }

    if (!displayValue.startsWith(formattedValue)) {
        return false;
    }

    return matchesNextPatternLiteral(
        patternParts,
        formattedValue.length,
        displayValue.slice(formattedValue.length)
    );
}

/**
 * Resolves the start of the literal run immediately before the caret.
 *
 * @private
 */
function getPreviousPatternLiteralRunStart(
    patternParts: PatternPart[],
    displayValue: string,
    position: number
) {
    if (position <= 0) {
        return null;
    }

    let literalStart = position - 1;
    const part = patternParts[literalStart];

    if (
        !part ||
        part.kind !== 'literal' ||
        part.character !== displayValue[literalStart]
    ) {
        return null;
    }

    while (literalStart > 0) {
        const previousPart = patternParts[literalStart - 1];

        if (
            !previousPart ||
            previousPart.kind !== 'literal' ||
            previousPart.character !== displayValue[literalStart - 1]
        ) {
            break;
        }

        literalStart -= 1;
    }

    return literalStart;
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

    return defineFormat({
        normalize(raw) {
            return normalizeValueForPattern(patternParts, raw);
        },
        format(normalized) {
            return formatValueForPattern(patternParts, normalized);
        },
        edit: {
            append(context) {
                const appended = normalizeValueForPattern(
                    patternParts,
                    context.appended
                );
                const attempted = normalizeValueForPattern(
                    patternParts,
                    context.attempted
                );
                const previous = normalizeValueForPattern(
                    patternParts,
                    context.previous
                );

                if (appended !== '' || attempted !== previous) {
                    return;
                }

                if (
                    matchesNextPatternLiteral(
                        patternParts,
                        context.previous.length,
                        context.appended
                    )
                ) {
                    return context.attempted;
                }

                if (
                    hasPendingPatternLiteral(
                        patternParts,
                        context.previous,
                        previous
                    )
                ) {
                    return null;
                }
            },
            deleteBackward(context) {
                const literalStart = getPreviousPatternLiteralRunStart(
                    patternParts,
                    context.previous,
                    context.cursor
                );

                if (
                    literalStart !== null &&
                    context.cursor < context.previous.length
                ) {
                    return {
                        value: context.previous,
                        selectionStart: literalStart,
                        selectionEnd: literalStart,
                    };
                }
            },
        },
    });
}
