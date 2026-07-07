import { reporter } from './reporter';
import type {
    FormatDefinition,
    InputSnapshot,
    EditState,
    EditKind,
} from './types';

/**
 * The output of one shared normalize-and-format value resolution run.
 *
 * @private
 */
export type ResolveValueResult = {
    /** The normalized value produced from the current input. */
    normalizedValue: string;

    /** The visible formatted value produced from the normalized input. */
    formattedValue: string;

    /** The resolved edit transition exposed during normalization. */
    edit: EditState;

    /** Maps raw boundaries to normalized boundaries. */
    rawToNormalized: number[];

    /** Maps normalized boundaries to formatted boundaries. */
    normalizedToFormatted: number[];
};

/**
 * Resolves the edit transition that should be exposed while normalizing the
 * current snapshot.
 *
 * @private
 */
function resolveEditState(
    inputType: string | null,
    previous: InputSnapshot,
    current: InputSnapshot
): EditState {
    let kind: EditKind = 'unknown';

    if (inputType === 'deleteContentBackward') {
        kind = 'delete-backward';
    } else if (inputType === 'deleteContentForward') {
        kind = 'delete-forward';
    } else if (previous.selectionStart !== previous.selectionEnd) {
        kind = 'replace';
    } else if (inputType?.startsWith('insert')) {
        kind = 'insert';
    }

    return { kind, inputType, previous, current };
}

/**
 * Resolves the normalized and formatted value data used by live input and blur.
 *
 * @private
 */
export default function resolveValue(
    definition: FormatDefinition,
    inputType: string | null,
    previous: InputSnapshot,
    current: InputSnapshot
): ResolveValueResult {
    let normalizedValue = '';
    const rawToNormalized = [0];
    const edit = resolveEditState(inputType, previous, current);

    for (const [index, character] of Array.from(current.value).entries()) {
        definition.normalize(character, {
            index,
            rawValue: current.value,
            edit,
            get normalized() {
                return normalizedValue;
            },
            append(text) {
                normalizedValue += text;
            },
            set(text) {
                normalizedValue = text;
            },
        });

        rawToNormalized.push(normalizedValue.length);
    }

    let formattedValue = '';
    let normalizedPosition = 0;
    const normalizedToFormatted = [0];

    for (const [index, character] of Array.from(normalizedValue).entries()) {
        let nextNormalizedPosition = normalizedPosition;

        definition.format(character, {
            index,
            normalized: normalizedValue,
            get formatted() {
                return formattedValue;
            },
            get normalizedPosition() {
                return nextNormalizedPosition;
            },
            append(text) {
                formattedValue += text;
            },
            advance(amount = 1) {
                if (amount < 0) reporter.fail('ERR01', { amount });
                nextNormalizedPosition += amount;
            },
        });

        while (normalizedToFormatted.length <= nextNormalizedPosition) {
            normalizedToFormatted.push(formattedValue.length);
        }

        normalizedPosition = nextNormalizedPosition;
    }

    while (normalizedToFormatted.length <= normalizedValue.length) {
        normalizedToFormatted.push(formattedValue.length);
    }

    return {
        normalizedValue,
        formattedValue,
        edit,
        rawToNormalized,
        normalizedToFormatted,
    };
}
