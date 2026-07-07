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
 * Resolves the next visible pattern prefix after one raw character is
 * processed.
 *
 * When a literal run is next, any typed character advances through it. If that
 * same character also matches the next token slot, the token is accepted too.
 *
 * @private
 */
function resolvePatternPrefix(
    patternParts: PatternPart[],
    currentValue: string,
    character: string
) {
    let nextValue = currentValue;
    let partIndex = currentValue.length;
    const nextPart = patternParts[partIndex];

    if (!nextPart) {
        return currentValue;
    }

    while (patternParts[partIndex]?.kind === 'literal') {
        const literalPart = patternParts[partIndex] as PatternLiteralPart;
        nextValue += literalPart.character;
        partIndex += 1;
    }

    const tokenPart = patternParts[partIndex];

    if (!tokenPart || tokenPart.kind !== 'token') {
        return nextValue;
    }

    if (matchesPatternToken(tokenPart.definition, character)) {
        nextValue += character;
    }

    return nextValue;
}

/**
 * Resolves the start of the literal run immediately before one collapsed
 * selection boundary, if one exists.
 *
 * @private
 */
function resolvePatternLiteralRunStart(
    patternParts: PatternPart[],
    selectionStart: number | null,
    selectionEnd: number | null
) {
    if (
        selectionStart === null ||
        selectionEnd === null ||
        selectionStart !== selectionEnd
    ) {
        return null;
    }

    let literalStart = selectionStart;

    while (
        literalStart > 0 &&
        patternParts[literalStart - 1]?.kind === 'literal'
    ) {
        literalStart -= 1;
    }

    return literalStart === selectionStart ? null : literalStart;
}

/**
 * Resolves the visible prefix that should remain when a backward delete targets
 * a trailing literal run at the end of the current pattern value.
 *
 * @private
 */
function resolvePatternTrailingLiteralDeletionValue(
    patternParts: PatternPart[],
    previousValue: string,
    selectionStart: number | null,
    selectionEnd: number | null
) {
    if (
        selectionStart === null ||
        selectionEnd === null ||
        selectionStart !== selectionEnd ||
        selectionStart !== previousValue.length
    ) {
        return null;
    }

    const literalStart = resolvePatternLiteralRunStart(
        patternParts,
        selectionStart,
        selectionEnd
    );

    return literalStart === null ? null : previousValue.slice(0, literalStart);
}

/**
 * Resolves the visible prefix that should remain when a backward delete leaves
 * an orphaned trailing literal run at the end of the current pattern value.
 *
 * @private
 */
function resolvePatternTrailingLiteralTrimValue(
    patternParts: PatternPart[],
    currentValue: string,
    selectionStart: number | null,
    selectionEnd: number | null
) {
    if (
        selectionStart === null ||
        selectionEnd === null ||
        selectionStart !== selectionEnd ||
        selectionStart !== currentValue.length
    ) {
        return null;
    }

    const literalStart = resolvePatternLiteralRunStart(
        patternParts,
        selectionStart,
        selectionEnd
    );

    return literalStart === null ? null : currentValue.slice(0, literalStart);
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
        name: 'pattern',
        normalize(character, state) {
            if (state.edit.kind === 'delete-backward') {
                const trailingDeletionValue =
                    resolvePatternTrailingLiteralDeletionValue(
                        patternParts,
                        state.edit.previous.value,
                        state.edit.previous.selectionStart,
                        state.edit.previous.selectionEnd
                    );

                if (trailingDeletionValue !== null) {
                    state.set(trailingDeletionValue);
                    return;
                }

                const trailingTrimValue =
                    resolvePatternTrailingLiteralTrimValue(
                        patternParts,
                        state.edit.current.value,
                        state.edit.current.selectionStart,
                        state.edit.current.selectionEnd
                    );

                if (trailingTrimValue !== null) {
                    state.set(trailingTrimValue);
                    return;
                }
            }

            const prefix = resolvePatternPrefix(
                patternParts,
                state.normalized,
                character
            );

            state.set(prefix);
        },
        format(character, state) {
            state.append(character);
            state.advance();
        },
        select(context) {
            if (context.edit.kind !== 'delete-backward') {
                return undefined;
            }

            const trailingDeletionValue =
                resolvePatternTrailingLiteralDeletionValue(
                    patternParts,
                    context.previous.value,
                    context.previous.selectionStart,
                    context.previous.selectionEnd
                );

            if (trailingDeletionValue !== null) {
                return undefined;
            }

            const literalStart = resolvePatternLiteralRunStart(
                patternParts,
                context.resolvedSelection.selectionStart,
                context.resolvedSelection.selectionEnd
            );

            if (literalStart === null) {
                return undefined;
            }

            return {
                selectionStart: literalStart,
                selectionEnd: literalStart,
            };
        },
    });
}
