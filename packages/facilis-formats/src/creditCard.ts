import { defineFormat, type Format } from 'facilis';

const AmericanExpressPrefixes = new Set(['34', '37']);
const DefaultDigitLimit = 16;
const AmericanExpressDigitLimit = 15;

function isAmericanExpress(value: string) {
    return AmericanExpressPrefixes.has(value.slice(0, 2));
}

function resolveDigitLimit(value: string) {
    return isAmericanExpress(value)
        ? AmericanExpressDigitLimit
        : DefaultDigitLimit;
}

function isSeparatorBoundary(value: string, position: number) {
    if (position === 0) return false;

    if (isAmericanExpress(value)) {
        return position === 4 || position === 10;
    }

    return position % 4 === 0;
}

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

function normalizeCreditCardValue(raw: string) {
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
            return normalizeCreditCardValue(raw);
        },
        format(normalized) {
            return isAmericanExpress(normalized)
                ? formatGroups(normalized, [4, 6, 5])
                : formatGroups(normalized, [4, 4, 4, 4]);
        },
        edit: {
            append(context) {
                const previous = normalizeCreditCardValue(context.previous);
                const attempted = normalizeCreditCardValue(context.attempted);
                const appended = normalizeCreditCardValue(context.appended);
                const appendedTrailingSpace =
                    appended === '' && context.appended.endsWith(' ');

                if (appendedTrailingSpace && context.previous.endsWith(' ')) {
                    return context.previous;
                }

                if (
                    appendedTrailingSpace &&
                    attempted === previous &&
                    previous.length > 0 &&
                    previous.length < resolveDigitLimit(previous) &&
                    isSeparatorBoundary(previous, previous.length) &&
                    !context.previous.endsWith(' ')
                ) {
                    return context.attempted;
                }
            },
            insert(context) {
                const inserted = normalizeCreditCardValue(context.inserted);
                const previous = normalizeCreditCardValue(context.previous);

                if (
                    inserted !== '' &&
                    previous.length >= resolveDigitLimit(previous)
                ) {
                    return null;
                }
            },
            deleteBackward(context) {
                if (
                    context.deleted === ' ' &&
                    context.cursor < context.previous.length
                ) {
                    return {
                        value: context.previous,
                        selectionStart: context.cursor - 1,
                        selectionEnd: context.cursor - 1,
                    };
                }
            },
        },
    });
}
