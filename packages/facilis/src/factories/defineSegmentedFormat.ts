import defineFormat from '../core/defineFormat';
import {
    resolveFormatFactoryEditHookContext,
    resolveFormatFactoryEditResult,
} from './resolveFormatFactoryEdit';
import type { FormatEditHookResult } from '../types/hooks';
import type { FormatFactoryOptions } from '../types/factory';
import type { Format } from '../types/format';

/**
 * Defines which raw characters are allowed into a segmented format.
 *
 * @since 0.1.0
 */
export type SegmentedFormatMatches = RegExp;

/**
 * Defines one piece of a segmented display layout.
 *
 * @since 0.1.0
 */
export type SegmentedFormatSegment = number | string;

/**
 * Defines the segmented display layout or resolves it from a normalized value.
 *
 * @since 0.1.0
 */
export type SegmentedFormatSegments =
    | SegmentedFormatSegment[]
    | ((normalized: string) => SegmentedFormatSegment[]);

/**
 * The segmented-format configuration without factory hooks.
 *
 * @private
 */
type SegmentedFormatConfig = {
    /** The raw character pattern allowed into the normalized value. */
    matches: SegmentedFormatMatches;

    /** The semantic character groups and literal formatting text to display. */
    segments: SegmentedFormatSegments;
};

/**
 * The public segmented-format options, including configuration and hooks.
 *
 * @since 0.1.0
 */
export type SegmentedFormatOptions = FormatFactoryOptions<
    SegmentedFormatConfig,
    SegmentedFormatConfig
>;

/**
 * Tests whether one raw character is allowed into the normalized value.
 *
 * @private
 */
function matchesSegmentedCharacter(
    matches: SegmentedFormatMatches,
    character: string
) {
    matches.lastIndex = 0;
    return matches.test(character);
}

/**
 * Tests whether text contains at least one character allowed into the
 * normalized value.
 *
 * @private
 */
function hasSegmentedCharacter(matches: SegmentedFormatMatches, text: string) {
    return Array.from(text).some((character) =>
        matchesSegmentedCharacter(matches, character)
    );
}

/**
 * Counts the semantic character slots represented by one segment layout.
 *
 * @private
 */
function resolveSegmentedMaxLength(segments: SegmentedFormatSegment[]) {
    return segments.reduce<number>((total, segment) => {
        if (typeof segment === 'number') {
            return total + segment;
        }

        return total;
    }, 0);
}

/**
 * Resolves the active segment layout for one normalized value.
 *
 * @private
 */
function resolveSegmentedSegments(
    normalized: string,
    options: SegmentedFormatConfig
) {
    if (typeof options.segments === 'function') {
        return options.segments(normalized);
    }

    return options.segments;
}

/**
 * Filters, normalizes, and length-limits one raw value.
 *
 * @private
 */
function normalizeSegmentedValue(raw: string, options: SegmentedFormatConfig) {
    const characters = Array.from(raw);
    const matchedCharacters = characters.filter((character) =>
        matchesSegmentedCharacter(options.matches, character)
    );
    const value = matchedCharacters.join('');
    const segments = resolveSegmentedSegments(value, options);
    const maxLength = resolveSegmentedMaxLength(segments);

    return value.slice(0, maxLength);
}

/**
 * Inserts literal segment text into one normalized value.
 *
 * @private
 */
function formatSegmentedValue(
    normalized: string,
    segments: SegmentedFormatSegment[]
) {
    let formatted = '';
    let cursor = 0;

    for (const segment of segments) {
        if (typeof segment === 'string') {
            if (cursor < normalized.length) {
                formatted += segment;
            }

            continue;
        }

        const take = segment;
        const value = normalized.slice(cursor, cursor + take);

        if (value === '') {
            break;
        }

        formatted += value;
        cursor += value.length;
    }

    return formatted;
}

/**
 * Resolves the literal formatting text at one visible position.
 *
 * @private
 */
function resolveFormattingAt(
    position: number,
    segments: SegmentedFormatSegment[]
) {
    let displayPosition = 0;

    for (const segment of segments) {
        if (typeof segment === 'string') {
            const offset = position - displayPosition;

            if (offset >= 0 && offset < segment.length) {
                return { offset, position: displayPosition, text: segment };
            }

            displayPosition += segment.length;
            continue;
        }

        const take = segment;
        displayPosition += take;
    }
}

/**
 * Determines whether an append attempted to type formatting text only.
 *
 * @private
 */
function isAppendFormatting(
    context: {
        appended: string;
        normalized: { appended: string; attempted: string; previous: string };
    },
    options: SegmentedFormatConfig
) {
    return (
        context.appended !== '' &&
        !hasSegmentedCharacter(options.matches, context.appended) &&
        context.normalized.appended === '' &&
        context.normalized.attempted === context.normalized.previous
    );
}

/**
 * Creates a reusable format from segmented display rules.
 *
 * @since 0.1.0
 */
export default function defineSegmentedFormat(
    options: SegmentedFormatOptions
): Format {
    const config: SegmentedFormatConfig = {
        matches: options.matches,
        segments: options.segments,
    };

    return defineFormat({
        normalize(raw) {
            const resolved = normalizeSegmentedValue(raw, config);

            if (options.normalize) {
                return options.normalize(resolved, {
                    ...config,
                    raw,
                });
            }

            return resolved;
        },
        format(normalized) {
            const segments = resolveSegmentedSegments(normalized, config);
            const resolved = formatSegmentedValue(normalized, segments);

            if (options.format) {
                return options.format(resolved, {
                    ...config,
                    normalized,
                });
            }

            return resolved;
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

            if (isAppendFormatting(context, config)) {
                const segments = resolveSegmentedSegments(
                    context.normalized.previous,
                    config
                );
                const expectedFormatting = resolveFormattingAt(
                    context.previous.length,
                    segments
                );

                if (expectedFormatting) {
                    const pendingFormatting = expectedFormatting.text.slice(
                        expectedFormatting.offset
                    );

                    if (pendingFormatting.startsWith(context.appended)) {
                        result = context.attempted;
                    } else {
                        result = `${context.previous}${pendingFormatting}`;
                    }
                } else {
                    const pendingFormatting = context.previous.slice(
                        context.formatted.length
                    );
                    const duplicateFormatting = resolveFormattingAt(
                        context.formatted.length,
                        segments
                    );

                    if (
                        context.previous !== context.formatted &&
                        context.previous.startsWith(context.formatted) &&
                        pendingFormatting !== '' &&
                        duplicateFormatting &&
                        duplicateFormatting.text
                            .slice(duplicateFormatting.offset)
                            .startsWith(pendingFormatting)
                    ) {
                        result = null;
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
            const segments = resolveSegmentedSegments(
                context.normalized.previous,
                config
            );
            const maxLength = resolveSegmentedMaxLength(segments);

            if (
                context.inserted !== '' &&
                !hasSegmentedCharacter(options.matches, context.inserted) &&
                context.normalized.inserted === '' &&
                context.normalized.attempted === context.normalized.previous
            ) {
                const formatting = resolveFormattingAt(
                    context.cursor,
                    segments
                );

                if (formatting) {
                    const cursor = formatting.position + formatting.text.length;

                    result = {
                        value: context.previous,
                        selectionStart: cursor,
                        selectionEnd: cursor,
                    };
                }
            }

            if (
                context.normalized.previous.length >= maxLength &&
                context.normalized.inserted !== ''
            ) {
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

            if (
                context.deleted !== '' &&
                context.normalized.deleted === '' &&
                context.cursor < context.previous.length
            ) {
                result = {
                    value: context.previous,
                    selectionStart: context.start,
                    selectionEnd: context.start,
                };
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
