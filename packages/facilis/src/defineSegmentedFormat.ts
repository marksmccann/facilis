import defineFormat from './defineFormat';
import type { Format } from './types';

/** Defines which raw characters are allowed into a segmented format. */
export type SegmentedFormatCharacters =
    | 'digits'
    | RegExp
    | ((character: string) => boolean);

/** Defines one piece of a segmented display layout. */
export type SegmentedFormatSegment = number | string;

/** Defines the segmented display layout or resolves it from a value. */
export type SegmentedFormatSegments =
    | SegmentedFormatSegment[]
    | ((normalized: string) => SegmentedFormatSegment[]);

/** Defines a segmented format from character rules and display segments. */
export type SegmentedFormatOptions = {
    /** The characters allowed into the normalized value. */
    characters: SegmentedFormatCharacters;

    /** Adjusts the filtered semantic value before length is enforced. */
    normalize?: (normalized: string) => string;

    /** The semantic character groups and literal formatting text to display. */
    segments: SegmentedFormatSegments;
};

function matchesSegmentedCharacter(
    characters: SegmentedFormatCharacters,
    character: string
) {
    if (characters === 'digits') {
        return /\d/.test(character);
    }

    if (characters instanceof RegExp) {
        characters.lastIndex = 0;
        return characters.test(character);
    }

    return characters(character);
}

function resolveSegmentedMaxLength(segments: SegmentedFormatSegment[]) {
    return segments.reduce<number>((total, segment) => {
        if (typeof segment === 'number') {
            return total + segment;
        }

        return total;
    }, 0);
}

function resolveSegmentedSegments(
    normalized: string,
    options: SegmentedFormatOptions
) {
    if (typeof options.segments === 'function') {
        return options.segments(normalized);
    }

    return options.segments;
}

function normalizeSegmentedValue(raw: string, options: SegmentedFormatOptions) {
    const value = Array.from(raw)
        .filter((character) =>
            matchesSegmentedCharacter(options.characters, character)
        )
        .join('');
    const normalized = options.normalize ? options.normalize(value) : value;
    const segments = resolveSegmentedSegments(normalized, options);
    const maxLength = resolveSegmentedMaxLength(segments);

    return normalized.slice(0, maxLength);
}

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

function isAppendFormatting(context: {
    appended: string;
    normalized: { appended: string; attempted: string; previous: string };
}) {
    return (
        context.appended !== '' &&
        context.normalized.appended === '' &&
        context.normalized.attempted === context.normalized.previous
    );
}

/** Creates a reusable format from segmented display rules. */
export default function defineSegmentedFormat(
    options: SegmentedFormatOptions
): Format {
    return defineFormat({
        normalize(raw) {
            return normalizeSegmentedValue(raw, options);
        },
        format(normalized) {
            const segments = resolveSegmentedSegments(normalized, options);

            return formatSegmentedValue(normalized, segments);
        },
        edit: {
            append(context) {
                if (!isAppendFormatting(context)) {
                    return;
                }

                const segments = resolveSegmentedSegments(
                    context.normalized.previous,
                    options
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
                        return context.attempted;
                    }

                    return `${context.previous}${pendingFormatting}`;
                }

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
                    return null;
                }
            },
            insert(context) {
                const segments = resolveSegmentedSegments(
                    context.normalized.previous,
                    options
                );
                const maxLength = resolveSegmentedMaxLength(segments);

                if (
                    context.inserted !== '' &&
                    context.normalized.inserted === '' &&
                    context.normalized.attempted === context.normalized.previous
                ) {
                    const formatting = resolveFormattingAt(
                        context.cursor,
                        segments
                    );

                    if (formatting) {
                        const cursor =
                            formatting.position + formatting.text.length;

                        return {
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
                    return null;
                }
            },
            deleteBackward(context) {
                if (
                    context.deleted === '' ||
                    context.normalized.deleted !== '' ||
                    context.cursor >= context.previous.length
                ) {
                    return;
                }

                return {
                    value: context.previous,
                    selectionStart: context.start,
                    selectionEnd: context.start,
                };
            },
        },
    });
}
