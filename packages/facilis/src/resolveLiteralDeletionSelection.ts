import type { FormatInput } from './types';

/**
 * Determines whether one formatted character is likely to be a structural
 * literal rather than user-entered content.
 *
 * @private
 */
function isLikelyLiteralCharacter(character: string | undefined): boolean {
    if (!character) {
        return false;
    }

    return !/[A-Za-z0-9]/.test(character);
}

/**
 * The override that should be applied when a delete operation targets a
 * structural literal run that the formatter immediately re-inserts.
 *
 * @private
 */
type LiteralDeletionResult = {
    formattedValue: string;
    selectionEnd: number;
    selectionStart: number;
};

/**
 * Resolves the contiguous literal run that should be removed for the current
 * delete action.
 *
 * @private
 */
export default function resolveLiteralDeletionSelection(
    input: FormatInput,
    formattedValue: string
): LiteralDeletionResult | null {
    if (
        input.previousSelectionStart === undefined ||
        input.previousSelectionEnd === undefined ||
        input.previousValue === undefined
    ) {
        return null;
    }

    if (
        input.previousSelectionStart === null ||
        input.previousSelectionEnd === null ||
        input.previousSelectionStart !== input.previousSelectionEnd
    ) {
        return null;
    }

    if (
        input.inputType !== 'deleteContentBackward' &&
        input.inputType !== 'deleteContentForward'
    ) {
        return null;
    }

    if (
        formattedValue !== input.previousValue ||
        input.value === input.previousValue
    ) {
        return null;
    }

    if (input.inputType === 'deleteContentBackward') {
        let selectionStart = input.previousSelectionStart;

        while (
            selectionStart > 0 &&
            isLikelyLiteralCharacter(formattedValue[selectionStart - 1])
        ) {
            selectionStart -= 1;
        }

        if (selectionStart === input.previousSelectionStart) {
            return null;
        }

        return {
            formattedValue:
                formattedValue.slice(0, selectionStart) +
                formattedValue.slice(input.previousSelectionStart),
            selectionEnd: selectionStart,
            selectionStart,
        };
    }

    let selectionEnd = input.previousSelectionStart;

    while (
        selectionEnd < formattedValue.length &&
        isLikelyLiteralCharacter(formattedValue[selectionEnd])
    ) {
        selectionEnd += 1;
    }

    if (selectionEnd === input.previousSelectionStart) {
        return null;
    }

    return {
        formattedValue:
            formattedValue.slice(0, input.previousSelectionStart) +
            formattedValue.slice(selectionEnd),
        selectionEnd: input.previousSelectionStart,
        selectionStart: input.previousSelectionStart,
    };
}
