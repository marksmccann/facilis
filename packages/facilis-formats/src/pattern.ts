import type { Facilis } from 'facilis';
import { reporter } from './reporter';

export type PatternTokenDefinition = {
    /**
     * Determines whether a raw character can fill this token slot.
     */
    matches: RegExp;
    /**
     * Normalizes a matched character before it is stored in the formatted value.
     */
    transform?: (context: { character: string }) => string;
};

export type PatternTokenDefinitions = Record<string, PatternTokenDefinition>;

export type PatternOptions = {
    /**
     * The pattern string that defines literal characters and token slots.
     */
    pattern: string;
    /**
     * The token definitions keyed by the wildcard characters used in the pattern.
     */
    tokens: PatternTokenDefinitions;
};

export type PatternInput = string | PatternOptions;

type PatternPart =
    | {
          literal: string;
          tokenCountBefore: number;
      }
    | {
          definition: PatternTokenDefinition;
      };

type PatternTokenSlot = Extract<PatternPart, { definition: PatternTokenDefinition }>;

const presetTokens = {
    '#': {
        matches: /\d/,
    },
    '*': {
        matches: /./,
    },
} satisfies PatternTokenDefinitions;

function toPatternOptions(input: PatternInput): PatternOptions {
    return typeof input === 'string'
        ? {
              pattern: input,
              tokens: presetTokens,
          }
        : input;
}

function getTokenDefinition(
    character: string,
    tokens: PatternTokenDefinitions
) {
    return tokens[character];
}

function parsePattern(pattern: string, tokens: PatternTokenDefinitions) {
    const parts: PatternPart[] = [];
    const tokenSlots: PatternTokenSlot[] = [];
    let literal = '';
    let tokenCountBefore = 0;

    for (const character of pattern) {
        const definition = getTokenDefinition(character, tokens);

        if (!definition) {
            literal += character;
            continue;
        }

        if (literal !== '') {
            parts.push({
                literal,
                tokenCountBefore,
            });
            literal = '';
        }

        const tokenSlot: PatternTokenSlot = {
            definition,
        };
        parts.push(tokenSlot);
        tokenSlots.push(tokenSlot);
        tokenCountBefore += 1;
    }

    if (literal !== '') {
        parts.push({
            literal,
            tokenCountBefore,
        });
    }

    return { parts, tokenSlots };
}

function assertValidPattern(options: PatternOptions) {
    if (options.pattern === '') {
        reporter.fail('ERR01');
    }

    const tokenSymbols = Object.keys(options.tokens);

    if (tokenSymbols.length === 0) {
        reporter.fail('ERR02');
    }

    for (const symbol of tokenSymbols) {
        if (symbol.length !== 1) {
            reporter.fail('ERR03');
        }
    }
}

function testCharacter(expression: RegExp, character: string) {
    expression.lastIndex = 0;

    return expression.test(character);
}

function normalizeValue(
    rawValue: string,
    tokenSlots: PatternTokenSlot[]
) {
    let tokenIndex = 0;
    let normalizedValue = '';

    for (const character of rawValue) {
        const slot = tokenSlots[tokenIndex];

        if (!slot) {
            break;
        }

        if (!testCharacter(slot.definition.matches, character)) {
            continue;
        }

        normalizedValue +=
            slot.definition.transform?.({ character }) ?? character;
        tokenIndex += 1;
    }

    return normalizedValue;
}

function shouldIncludeLiteral(
    normalizedLength: number,
    tokenCountBefore: number
) {
    return tokenCountBefore === 0
        ? normalizedLength > 0
        : normalizedLength > tokenCountBefore;
}

function formatValue(normalizedValue: string, parts: PatternPart[]) {
    if (normalizedValue === '') {
        return '';
    }

    let formattedValue = '';
    let tokenIndex = 0;

    for (const part of parts) {
        if ('literal' in part) {
            if (
                shouldIncludeLiteral(
                    normalizedValue.length,
                    part.tokenCountBefore
                )
            ) {
                formattedValue += part.literal;
            }

            continue;
        }

        const character = normalizedValue[tokenIndex];

        if (!character) {
            break;
        }

        formattedValue += character;
        tokenIndex += 1;
    }

    return formattedValue;
}

function getNormalizedSelectionPosition(
    rawValue: string,
    rawSelectionPosition: number,
    tokenSlots: PatternTokenSlot[]
) {
    let tokenIndex = 0;
    let normalizedSelectionPosition = 0;

    for (const character of rawValue.slice(0, rawSelectionPosition)) {
        const slot = tokenSlots[tokenIndex];

        if (!slot) {
            break;
        }

        if (!testCharacter(slot.definition.matches, character)) {
            continue;
        }

        normalizedSelectionPosition += 1;
        tokenIndex += 1;
    }

    return normalizedSelectionPosition;
}

function getSelectionPosition(
    rawValue: string,
    rawSelectionPosition: number,
    normalizedValue: string,
    parts: PatternPart[],
    tokenSlots: PatternTokenSlot[]
) {
    const targetCount = Math.min(
        getNormalizedSelectionPosition(
            rawValue,
            rawSelectionPosition,
            tokenSlots
        ),
        normalizedValue.length
    );

    if (targetCount <= 0) {
        return 0;
    }

    let selectionPosition = 0;
    let tokenCount = 0;

    for (const part of parts) {
        if ('literal' in part) {
            if (
                shouldIncludeLiteral(
                    normalizedValue.length,
                    part.tokenCountBefore
                )
            ) {
                selectionPosition += part.literal.length;
            }

            continue;
        }

        if (tokenCount === targetCount) {
            break;
        }

        selectionPosition += 1;
        tokenCount += 1;

        if (tokenCount === targetCount) {
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
    const options = toPatternOptions(input);
    assertValidPattern(options);
    const { parts, tokenSlots } = parsePattern(options.pattern, options.tokens);

    if (tokenSlots.length === 0) {
        reporter.fail('ERR04');
    }

    return {
        name: 'pattern',
        onInput(options) {
            const normalizedValue = normalizeValue(options.value, tokenSlots);
            const formattedValue = formatValue(normalizedValue, parts);

            return {
                formattedValue,
                selectionStart: getSelectionPosition(
                    options.value,
                    options.selectionStart ?? 0,
                    normalizedValue,
                    parts,
                    tokenSlots
                ),
                selectionEnd: getSelectionPosition(
                    options.value,
                    options.selectionEnd ?? 0,
                    normalizedValue,
                    parts,
                    tokenSlots
                ),
            };
        },
        onBlur(options) {
            const normalizedValue = normalizeValue(options.value, tokenSlots);

            return {
                formattedValue: formatValue(normalizedValue, parts),
                selectionStart: null,
                selectionEnd: null,
            };
        },
    };
}
