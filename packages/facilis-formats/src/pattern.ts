import {
    definePatternFormat,
    type Format,
    type PatternFormatOptions,
    type PatternFormatPart,
    type PatternFormatTokenDefinition,
    type PatternFormatTokenDefinitions,
} from 'facilis';

/**
 * Defines the matching rule for a single token symbol in a pattern format.
 *
 * @since 0.1.0
 */
export type PatternTokenDefinition = PatternFormatTokenDefinition;

/**
 * Maps each token symbol used in a pattern string to the rule that determines
 * which raw characters can fill that token slot.
 *
 * @since 0.1.0
 */
export type PatternTokenDefinitions = PatternFormatTokenDefinitions;

/**
 * The explicit configuration object for one parsed pattern definition.
 *
 * @since 0.1.0
 */
export type ParsePatternOptions = PatternFormatOptions;

/**
 * Describes one ordered part of a parsed pattern, either a token character or
 * a literal character from the original pattern string.
 *
 * @since 0.1.0
 */
export type PatternPart = PatternFormatPart;

/**
 * The built-in token definitions shared by the shorthand string syntax and the
 * explicit object form when `tokens` is omitted.
 *
 * @private
 */
const DEFAULT_PATTERN_TOKENS = {
    '#': { matches: /\d/ },
    a: { matches: /[A-Za-z]/ },
    '*': { matches: /./ },
};

/**
 * The explicit configuration object for a pattern format.
 *
 * @since 0.1.0
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
 * @since 0.1.0
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
            tokens: DEFAULT_PATTERN_TOKENS,
        };
    }

    return {
        pattern: input.pattern,
        tokens: input.tokens ?? DEFAULT_PATTERN_TOKENS,
    };
}

/**
 * Creates a pattern format instance from a tokenized pattern string.
 *
 * @since 0.1.0
 */
export function pattern(input: string): Format;
export function pattern(input: PatternOptions): Format;
export function pattern(input: PatternInput): Format {
    return definePatternFormat(normalizePatternOptions(input));
}
