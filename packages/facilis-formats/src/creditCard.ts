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

/**
 * Creates a credit-card number format.
 *
 * @since 0.0.1
 */
export function creditCard(): Format {
    return defineFormat({
        normalize(input) {
            const value = input.replace(/\D/g, '');

            return value.slice(0, resolveDigitLimit(value));
        },
        format(value) {
            return isAmericanExpress(value)
                ? formatGroups(value, [4, 6, 5])
                : formatGroups(value, [4, 4, 4, 4]);
        },
        on: {
            append(edit) {
                const appendedTrailingSpace =
                    edit.text === '' && edit.rawText.endsWith(' ');

                if (
                    appendedTrailingSpace &&
                    edit.previousDisplay.endsWith(' ')
                ) {
                    return edit.previousDisplay;
                }

                if (
                    appendedTrailingSpace &&
                    edit.attemptedValue === edit.previousValue &&
                    edit.previousValue.length > 0 &&
                    edit.previousValue.length <
                        resolveDigitLimit(edit.previousValue) &&
                    isSeparatorBoundary(
                        edit.previousValue,
                        edit.previousValue.length
                    ) &&
                    !edit.previousDisplay.endsWith(' ')
                ) {
                    return edit.attemptedDisplay;
                }
            },
            insert(edit) {
                if (
                    edit.text !== '' &&
                    edit.previousValue.length >=
                        resolveDigitLimit(edit.previousValue)
                ) {
                    return null;
                }
            },
            deleteBackward(edit) {
                const deletedCharacter = edit.previousDisplay[edit.at - 1];

                if (
                    deletedCharacter === ' ' &&
                    edit.at < edit.previousDisplay.length
                ) {
                    return {
                        value: edit.previousDisplay,
                        selectionStart: edit.at - 1,
                        selectionEnd: edit.at - 1,
                    };
                }
            },
        },
    });
}
