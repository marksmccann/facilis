import { defineFormat, type Format } from 'facilis';
import isDigit from './internal/isDigit';

/**
 * The grouped digit layout used for a credit card value.
 *
 * @private
 */
type CreditCardGrouping = number[];

/**
 * Determines whether the current card digits should use the AmEx layout.
 *
 * @private
 */
function isAmericanExpress(value: string) {
    return value.startsWith('34') || value.startsWith('37');
}

/**
 * Resolves the active grouping for the current card digits.
 *
 * @private
 */
function resolveCreditCardGrouping(value: string): CreditCardGrouping {
    if (isAmericanExpress(value)) {
        return [4, 6, 5];
    }

    return [4, 4, 4, 4];
}

/**
 * Resolves the maximum digit length allowed for the current card digits.
 *
 * @private
 */
function resolveCreditCardMaxLength(value: string) {
    return resolveCreditCardGrouping(value).reduce(
        (total, groupSize) => total + groupSize,
        0
    );
}

/**
 * Determines whether a trailing group separator should appear after the
 * current digit.
 *
 * @private
 */
function shouldAppendTrailingGroupSeparator(
    normalizedPosition: number,
    grouping: CreditCardGrouping
) {
    let offset = 0;

    for (const groupSize of grouping.slice(0, -1)) {
        offset += groupSize;

        if (normalizedPosition === offset) {
            return true;
        }
    }

    return false;
}

/**
 * Creates a formatter for credit card values.
 *
 * @since 0.0.1
 */
export function creditCard(): Format {
    return defineFormat({
        name: 'credit-card',
        normalize(character, state) {
            if (!isDigit(character)) {
                return;
            }

            if (
                state.normalized.length >=
                resolveCreditCardMaxLength(state.normalized)
            ) {
                return;
            }

            state.append(character);
        },
        format(character, state) {
            const grouping = resolveCreditCardGrouping(state.normalized);

            state.append(character);
            state.advance();

            if (
                shouldAppendTrailingGroupSeparator(
                    state.normalizedPosition,
                    grouping
                )
            ) {
                state.append(' ');
            }
        },
    });
}
