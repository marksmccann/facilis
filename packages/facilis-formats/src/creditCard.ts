import { defineFormat, type Format } from 'facilis';

const AmericanExpressPrefixes = new Set(['34', '37']);
const DefaultDigitLimit = 16;
const AmericanExpressDigitLimit = 15;

/**
 * Tests whether the normalized value starts with an American Express prefix.
 *
 * @private
 */
function isAmericanExpress(value: string) {
    return AmericanExpressPrefixes.has(value.slice(0, 2));
}

/**
 * Resolves the maximum number of digits allowed for the active card layout.
 *
 * @private
 */
function resolveDigitLimit(value: string) {
    return isAmericanExpress(value)
        ? AmericanExpressDigitLimit
        : DefaultDigitLimit;
}

/**
 * Tests whether one normalized digit position should be followed by a separator.
 *
 * @private
 */
function isSeparatorBoundary(value: string, position: number) {
    if (position === 0) return false;

    if (!isAmericanExpress(value)) {
        return position === 4 || position === 10;
    }

    return position % 4 === 0;
}

/**
 * Builds a space-separated display value by slicing the normalized digits into
 * the requested group shape, such as `4-4-4-4` or `4-6-5`. For example,
 * `formatGroups('378282246310005', [4, 6, 5])` returns `'3782 822463 10005'`.
 *
 * @private
 */
function formatGroups(value: string, groups: number[]) {
    const parts: string[] = [];
    let index = 0;

    for (const size of groups) {
        const part = value.slice(index, index + size);
        if (part.length > 0) parts.push(part);
        index += size;
    }

    return parts.join(' ');
}

/**
 * Extracts credit-card digits from a raw value and clamps them to the active
 * card layout.
 *
 * @private
 */
function normalizeValue(raw: string) {
    const value = raw.replace(/\D/g, '');
    return value.slice(0, resolveDigitLimit(value));
}

/**
 * Creates a credit-card number format.
 *
 * @since 0.0.1
 */
export function creditCard(): Format {
    return defineFormat({
        normalize(raw) {
            return normalizeValue(raw);
        },
        format(normalized) {
            let groups = [4, 4, 4, 4];
            if (isAmericanExpress(normalized)) groups = [4, 6, 5];
            return formatGroups(normalized, groups);
        },
        edit: {
            append(context) {
                const { normalized, appended, previous, attempted } = context;
                const semanticAppend = normalized.appended !== '';
                const appendIsTrailingSpace = appended.endsWith(' ');
                const alreadyHasTrailingSpace = previous.endsWith(' ');

                // Ignore appended trailing space if there already is one.
                if (
                    !semanticAppend &&
                    appendIsTrailingSpace &&
                    alreadyHasTrailingSpace
                ) {
                    return null;
                }

                const value = normalized.previous;
                const unchangedValue = normalized.attempted === value;
                const hasValue = value.length > 0;
                const maxDigits = resolveDigitLimit(value);
                const hasRoomForMoreDigits = value.length < maxDigits;
                const atSeparator = isSeparatorBoundary(value, value.length);

                // Insert the attempted trailing space if it qualifies.
                if (
                    !semanticAppend &&
                    appendIsTrailingSpace &&
                    unchangedValue &&
                    hasValue &&
                    hasRoomForMoreDigits &&
                    atSeparator &&
                    !alreadyHasTrailingSpace
                ) {
                    return attempted;
                }
            },
            insert(context) {
                const { normalized } = context;
                const value = normalized.previous;
                const maxDigits = resolveDigitLimit(value);
                const semanticInsert = normalized.inserted !== '';
                const noMoreRoomForDigits = value.length >= maxDigits;

                // Reject inserted digits when value is full.
                if (semanticInsert && noMoreRoomForDigits) {
                    return null;
                }
            },
            deleteBackward(context) {
                const { deleted, cursor, previous } = context;

                // Move the cursor instead of a deleting separator.
                if (deleted === ' ' && cursor < previous.length) {
                    return {
                        value: previous,
                        selectionStart: cursor - 1,
                        selectionEnd: cursor - 1,
                    };
                }
            },
        },
    });
}
