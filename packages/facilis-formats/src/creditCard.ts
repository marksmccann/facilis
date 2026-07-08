import { defineFormat, type Format } from 'facilis';

const AmericanExpressPrefixes = new Set(['34', '37']);
const DefaultCardDigitLimit = 16;
const AmericanExpressDigitLimit = 15;

/**
 * Tests whether the current digit position sits at one visible separator
 * boundary for the active card layout.
 *
 * @private
 */
function isCreditCardSeparatorBoundary(value: string, position: number) {
    if (position === 0) {
        return false;
    }

    if (isAmericanExpressCardNumber(value)) {
        return position === 4 || position === 10;
    }

    return position % 4 === 0;
}

/**
 * Tests whether the current normalized digits should use the American Express
 * grouping and maximum length.
 *
 * @private
 */
function isAmericanExpressCardNumber(value: string) {
    return AmericanExpressPrefixes.has(value.slice(0, 2));
}

/**
 * Resolves the maximum number of digits allowed for the current card number.
 *
 * @private
 */
function resolveCreditCardDigitLimit(value: string) {
    return isAmericanExpressCardNumber(value)
        ? AmericanExpressDigitLimit
        : DefaultCardDigitLimit;
}

/**
 * Tests whether the current digit position should begin a new visible group.
 *
 * @private
 */
function shouldInsertCreditCardSeparator(
    value: string,
    normalizedPosition: number
) {
    return isCreditCardSeparatorBoundary(value, normalizedPosition);
}

/**
 * Resolves the selection to preserve when one ignorable character is inserted
 * at or just after an existing separator in the middle of the formatted value.
 *
 * @private
 */
function resolveIgnoredSeparatorSelection(
    previousValue: string,
    currentValue: string,
    previousSelectionStart: number | null,
    previousSelectionEnd: number | null,
    currentSelectionStart: number | null,
    currentSelectionEnd: number | null
): number | null {
    if (
        previousSelectionStart === null ||
        previousSelectionEnd === null ||
        currentSelectionStart === null ||
        currentSelectionEnd === null
    ) {
        return null;
    }

    if (
        previousSelectionStart !== previousSelectionEnd ||
        currentSelectionStart !== currentSelectionEnd
    ) {
        return null;
    }

    if (currentValue.length !== previousValue.length + 1) {
        return null;
    }

    if (currentSelectionStart !== previousSelectionStart + 1) {
        return null;
    }

    const insertedCharacter = currentValue[previousSelectionStart];

    if (insertedCharacter === undefined || /\d/.test(insertedCharacter)) {
        return null;
    }

    if (previousValue[previousSelectionStart] === ' ') {
        return previousSelectionStart + 1;
    }

    if (
        previousSelectionStart > 0 &&
        previousValue[previousSelectionStart - 1] === ' '
    ) {
        return previousSelectionStart;
    }

    return null;
}

/**
 * Creates a credit-card number format that automatically switches to the
 * American Express grouping when the entered digits begin with `34` or `37`.
 *
 * @since 0.0.1
 */
export function creditCard(): Format {
    let shouldShowTrailingSeparator = false;

    return defineFormat({
        name: 'creditCard',
        normalize(character, state) {
            if (state.index === 0) {
                shouldShowTrailingSeparator = false;
            }

            if (!/\d/.test(character)) {
                if (
                    state.edit.kind !== 'delete-backward' &&
                    state.edit.kind !== 'delete-forward' &&
                    state.index === state.rawValue.length - 1 &&
                    isCreditCardSeparatorBoundary(
                        state.normalized,
                        state.normalized.length
                    ) &&
                    state.normalized.length <
                        resolveCreditCardDigitLimit(state.normalized)
                ) {
                    shouldShowTrailingSeparator = true;
                }

                return;
            }

            if (
                state.normalized.length >=
                resolveCreditCardDigitLimit(state.normalized)
            ) {
                return;
            }

            state.append(character);
        },
        format(character, state) {
            if (
                shouldInsertCreditCardSeparator(
                    state.normalized,
                    state.normalizedPosition
                )
            ) {
                state.append(' ');
            }

            state.append(character);
            state.advance();

            if (
                shouldShowTrailingSeparator &&
                state.index === state.normalized.length - 1
            ) {
                state.append(' ');
            }
        },
        select(context) {
            const nextSelection = resolveIgnoredSeparatorSelection(
                context.previous.value,
                context.current.value,
                context.previous.selectionStart,
                context.previous.selectionEnd,
                context.current.selectionStart,
                context.current.selectionEnd
            );

            if (nextSelection !== null) {
                return {
                    selectionStart: nextSelection,
                    selectionEnd: nextSelection,
                };
            }
        },
    });
}
