import type { ResolveValueResult } from './resolveValue';
import type { BlurContext, FormatDefinition } from './types';

/**
 * Resolves the blur-time value from one fully resolved value result.
 *
 * @private
 */
export default function resolveBlur(
    definition: FormatDefinition,
    value: ResolveValueResult
): string {
    const { formattedValue } = value;

    if (!definition.blur) return formattedValue;

    const blurContext: BlurContext = { formattedValue };

    return definition.blur(blurContext);
}
