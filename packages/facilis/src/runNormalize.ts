import type {
    FormatDefinition,
    InputSnapshot,
    EditState,
    EditKind,
} from './types';

/**
 * The output of one normalize stage run, including the normalized value and a
 * boundary map from every raw input boundary to its corresponding normalized
 * boundary.
 *
 * @private
 */
type RunNormalizeResult = {
    /** The normalized value produced from the raw input. */
    normalizedValue: string;

    /**
     * Maps each raw boundary index, including the start and end of the raw
     * value, to the normalized boundary index it lands on after normalization.
     * For example, when `"a1b"` normalizes to `"ab"`, this becomes `[0, 1, 1, 2]`.
     */
    rawToNormalized: number[];
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
 * Runs one format definition's normalize stage across the raw input value and
 * returns the normalized result plus a raw-to-normalized boundary map.
 *
 * @private
 */
export default function runNormalize(
    definition: FormatDefinition,
    inputType: string | null,
    previous: InputSnapshot,
    current: InputSnapshot
): RunNormalizeResult {
    let normalized = '';
    const rawToNormalized = [0];
    const edit = resolveEditState(inputType, previous, current);

    for (const [index, character] of Array.from(current.value).entries()) {
        definition.normalize(character, {
            index,
            rawValue: current.value,
            edit,
            get normalized() {
                return normalized;
            },
            append(text) {
                normalized += text;
            },
            set(text) {
                normalized = text;
            },
        });

        rawToNormalized.push(normalized.length);
    }

    return {
        normalizedValue: normalized,
        rawToNormalized,
    };
}
