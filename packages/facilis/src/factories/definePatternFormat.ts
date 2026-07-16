import defineFormat from '../core/defineFormat';
import {
    resolveFormatFactoryEditHookContext,
    resolveFormatFactoryEditResult,
} from './resolveFormatFactoryEdit';
import isDeleteOverFormatting from '../helpers/isDeleteOverFormatting';
import { reporter } from '../reporter';
import type {
    FormatAppendHookContext,
    FormatEditHookResult,
    FormatInsertHookContext,
} from '../types/hooks';
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
 * The pattern-format configuration without factory hooks.
 *
 * @private
 */
type PatternFormatConfig = {
    /** The pattern string that defines literal characters and token slots. */
    pattern: string;

    /** The token definitions keyed by the wildcard characters used in the pattern. */
    tokens: PatternFormatTokenDefinitions;
};

/**
 * The public pattern-format options, including configuration and hooks.
 *
 * @since 0.1.0
 */
export type PatternFormatOptions = FormatFactoryOptions<
    PatternFormatConfig,
    PatternFormatConfig
>;

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
    options: PatternFormatConfig
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
 * Determines whether an append added formatting text without changing the
 * normalized value.
 *
 * @private
 */
function isAppendFormatting(context: FormatAppendHookContext): boolean {
    const { appended, normalized } = context;

    return (
        appended !== '' &&
        normalized.appended === '' &&
        normalized.attempted === normalized.previous
    );
}

/**
 * Determines whether an append added formatting while the previous display
 * already contains expected formatting text at one display position.
 *
 * @private
 */
function isAppendDuplicateFormattingAt(
    context: FormatAppendHookContext,
    expectedFormatting: string,
    position: number
): boolean {
    const pending = context.previous.slice(context.formatted.length);
    const offset = context.formatted.length - position;

    return (
        isAppendFormatting(context) &&
        context.previous !== context.formatted &&
        context.previous.startsWith(context.formatted) &&
        pending !== '' &&
        offset >= 0 &&
        offset < expectedFormatting.length &&
        expectedFormatting.slice(offset).startsWith(pending)
    );
}

/**
 * Determines whether an append added expected formatting text at one display
 * position without changing the normalized value.
 *
 * @private
 */
function isAppendExpectedFormattingAt(
    context: FormatAppendHookContext,
    expectedFormatting: string,
    position: number
): boolean {
    const offset = context.previous.length - position;

    return (
        isAppendFormatting(context) &&
        offset >= 0 &&
        offset < expectedFormatting.length &&
        expectedFormatting.slice(offset).startsWith(context.appended)
    );
}

/**
 * Determines whether a middle insertion adds semantic text after the normalized
 * value has reached a maximum length.
 *
 * @private
 */
function isInsertAtMaxLength(
    context: FormatInsertHookContext,
    maxLength: number
): boolean {
    return (
        context.normalized.inserted !== '' &&
        context.normalized.previous.length >= maxLength
    );
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
    const config: PatternFormatConfig = {
        pattern: options.pattern,
        tokens: options.tokens,
    };
    const patternParts = parsePatternFormatOptions(config);
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
                    ...config,
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
                    ...config,
                    normalized,
                });
            }

            return displayValue;
        },
        blur(formatted) {
            if (options.blur) {
                return options.blur(formatted, {
                    ...config,
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
                        ...resolveFormatFactoryEditHookContext(context, config),
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
                        ...resolveFormatFactoryEditHookContext(context, config),
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
                        ...resolveFormatFactoryEditHookContext(context, config),
                    }
                );
            }

            return result;
        },
    });
}
