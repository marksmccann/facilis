import type { FormatEditHookResult } from '../types/hooks';
import type { TextState } from '../types/input';

/**
 * Resolves an edit hook result into the next text state.
 *
 * Undefined results fall back to the default formatted state, null results
 * reject the edit by restoring the previous state, string results replace the
 * value and move the cursor to the end, and explicit text states pass through.
 *
 * @private
 */
export default function resolveEditResult(
    result: FormatEditHookResult,
    previous: TextState,
    fallback: TextState
): TextState {
    if (result === undefined) return fallback;
    if (result === null) return previous;

    if (typeof result === 'string') {
        return {
            value: result,
            selectionStart: result.length,
            selectionEnd: result.length,
        };
    }

    return result;
}
