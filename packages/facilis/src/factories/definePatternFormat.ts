import defineFormat from './defineFormat';
import {
    resolveFormatFactoryEditHookContext,
    resolveFormatFactoryEditResult,
} from './resolveFormatFactoryEdit';
import isAppendDuplicateFormattingAt from '../guards/isAppendDuplicateFormattingAt';
import isAppendExpectedFormattingAt from '../guards/isAppendExpectedFormattingAt';
import isAppendFormatting from '../guards/isAppendFormatting';
import isDeleteOverFormatting from '../guards/isDeleteOverFormatting';
import isInsertAtMaxLength from '../guards/isInsertAtMaxLength';
import { reporter } from '../reporter';
import type { FormatEditHookResult } from '../types/hooks';
import type { FormatFactoryOptions } from '../types/factory';
import type { Format } from '../types/format';

/**
 * Defines the matching rule for a single token symbol in a pattern format.
 *
 * @since 0.1.0
 */
export type PatternFormatTokenDefinition = {
    /** Determines whether a raw character can fill this token slot. */
    matches: RegExp;
};

/**
 * Maps each token symbol used in a pattern string to the rule that determines
 * which raw characters can fill that token slot.
 *
 * @since 0.1.0
 */
export type PatternFormatTokenDefinitions = Record<
    string,
    PatternFormatTokenDefinition
>;

/**
 * The pattern-format options before defaults have been applied.
 *
 * @private
 */
type PatternFormatBaseOptions = {
    /** The pattern string that defines literal characters and token slots. */
    pattern: string;

    /** The token definitions keyed by the wildcard characters used in the pattern. */
    tokens: PatternFormatTokenDefinitions;
};

/**
 * The complete pattern-format options after defaults have been applied.
 *
 * @private
 */
type NormalizedPatternFormatOptions = PatternFormatBaseOptions;

/**
 * The explicit configuration object for one parsed pattern definition.
 *
 * @since 0.1.0
 */
export type PatternFormatOptions = FormatFactoryOptions<
    PatternFormatBaseOptions,
    NormalizedPatternFormatOptions
>;

function normalizePatternFormatOptions(
    options: PatternFormatOptions
): NormalizedPatternFormatOptions {
    return {
        pattern: options.pattern,
        tokens: options.tokens,
    };
}

/**
 * Describes one token-driven part in a parsed pattern definition.
 *
 * @private
 */
type PatternFormatTokenPart = {
    /** Identifies this parsed part as a token slot. */
    kind: 'token';

    /** The token symbol from the source pattern string. */
    symbol: string;

    /** The matching rule for this token slot. */
    definition: PatternFormatTokenDefinition;
};

/**
 * Describes one literal part in a parsed pattern definition.
 *
 * @private
 */
type PatternFormatLiteralPart = {
    /** Identifies this parsed part as literal formatting text. */
    kind: 'literal';

    /** The literal character from the source pattern string. */
    character: string;
};

/**
 * Describes one ordered part of a parsed pattern, either a token character or
 * a literal character from the original pattern string.
 *
 * @since 0.1.0
 */
export type PatternFormatPart =
    | PatternFormatTokenPart
    | PatternFormatLiteralPart;

/**
 * Parses a pattern string into one ordered array of parts, where each entry
 * describes either a token character or a literal character from the pattern.
 *
 * @private
 */
function parsePatternFormatOptions(
    options: NormalizedPatternFormatOptions
): PatternFormatPart[] {
    const { pattern, tokens } = options;

    if (pattern === '') {
        reporter.fail('ERR01');
    }

    const patternParts: PatternFormatPart[] = [];
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
    definition: PatternFormatTokenDefinition,
    character: string
): boolean {
    definition.matches.lastIndex = 0;
    return definition.matches.test(character);
}

/**
 * Counts the token slots in one parsed pattern.
 *
 * @private
 */
function countPatternTokens(patternParts: PatternFormatPart[]) {
    return patternParts.filter((part) => part.kind === 'token').length;
}

/**
 * Resolves the literal run at one visible pattern position.
 *
 * @private
 */
function getPatternLiteralRun(
    patternParts: PatternFormatPart[],
    position: number
) {
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
 * Resolves the start of the literal run immediately before the caret.
 *
 * @private
 */
function getPreviousPatternLiteralRunStart(
    patternParts: PatternFormatPart[],
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
 * Creates a pattern format from explicit token definitions.
 *
 * @since 0.1.0
 */
export default function definePatternFormat(
    options: PatternFormatOptions
): Format {
    const normalizedOptions = normalizePatternFormatOptions(options);
    const patternParts = parsePatternFormatOptions(normalizedOptions);
    const maxLength = countPatternTokens(patternParts);

    return defineFormat({
        normalize(raw) {
            let value = '';
            let partIndex = 0;

            for (const character of raw) {
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

            if (options.normalize) {
                return options.normalize(value, {
                    ...normalizedOptions,
                    raw,
                });
            }

            return value;
        },
        format(normalized) {
            let displayValue = '';
            let valueIndex = 0;

            for (const part of patternParts) {
                if (part.kind === 'literal') {
                    if (valueIndex < normalized.length) {
                        displayValue += part.character;
                    }

                    continue;
                }

                const character = normalized[valueIndex];

                if (!character) {
                    break;
                }

                displayValue += character;
                valueIndex += 1;
            }

            if (options.format) {
                return options.format(displayValue, {
                    ...normalizedOptions,
                    normalized,
                });
            }

            return displayValue;
        },
        blur(formatted) {
            if (options.blur) {
                return options.blur(formatted, {
                    ...normalizedOptions,
                    formatted,
                });
            }

            return formatted;
        },
        append(context) {
            let result: FormatEditHookResult;

            if (isAppendFormatting(context)) {
                const pendingLiteralRun = getPatternLiteralRun(
                    patternParts,
                    context.formatted.length
                );

                if (
                    isAppendDuplicateFormattingAt(
                        context,
                        pendingLiteralRun,
                        context.formatted.length
                    )
                ) {
                    result = null;
                } else {
                    const literalRun = getPatternLiteralRun(
                        patternParts,
                        context.previous.length
                    );

                    if (literalRun !== '') {
                        if (
                            isAppendExpectedFormattingAt(
                                context,
                                literalRun,
                                context.previous.length
                            )
                        ) {
                            result = context.attempted;
                        } else {
                            result = `${context.previous}${literalRun}`;
                        }
                    }
                }
            }

            if (options.append) {
                return options.append(
                    resolveFormatFactoryEditResult(result, context),
                    {
                        ...resolveFormatFactoryEditHookContext(
                            context,
                            normalizedOptions
                        ),
                    }
                );
            }

            return result;
        },
        insert(context) {
            let result: FormatEditHookResult;

            if (isInsertAtMaxLength(context, maxLength)) {
                result = null;
            }

            if (options.insert) {
                return options.insert(
                    resolveFormatFactoryEditResult(result, context),
                    {
                        ...resolveFormatFactoryEditHookContext(
                            context,
                            normalizedOptions
                        ),
                    }
                );
            }

            return result;
        },
        delete(context) {
            let result: FormatEditHookResult;

            if (isDeleteOverFormatting(context)) {
                const literalStart = getPreviousPatternLiteralRunStart(
                    patternParts,
                    context.previous,
                    context.cursor
                );

                if (literalStart !== null) {
                    result = {
                        value: context.previous,
                        selectionStart: literalStart,
                        selectionEnd: literalStart,
                    };
                }
            }

            if (options.delete) {
                return options.delete(
                    resolveFormatFactoryEditResult(result, context),
                    {
                        ...resolveFormatFactoryEditHookContext(
                            context,
                            normalizedOptions
                        ),
                    }
                );
            }

            return result;
        },
    });
}
