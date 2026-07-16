import {
    definePatternFormat,
    type Format,
    type PatternFormatOptions,
    type PatternFormatTokenDefinitions,
} from 'facilis';

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
export type PatternOptions = Pick<PatternFormatOptions, 'pattern'> & {
    /**
     * The token definitions keyed by the wildcard characters used in the pattern.
     */
    tokens?: PatternFormatTokenDefinitions;
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
function normalizePatternOptions(input: PatternInput): PatternFormatOptions {
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
