import type { Format, FormatEditResult } from './types';

export default function resolveEditResult(
    result: FormatEditResult,
    fallback: ReturnType<Format['onInput']>
): ReturnType<Format['onInput']> | undefined {
    if (result === undefined) return undefined;
    if (result === null) return fallback;

    if (typeof result === 'string') {
        return {
            value: result,
            selectionStart: result.length,
            selectionEnd: result.length,
        };
    }

    return result;
}
