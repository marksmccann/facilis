import defineFormat from '../core/defineFormat';
import { resolveFormatFactoryEditHookContext } from './resolveFormatFactoryEdit';
import type { FormatFactoryOptions } from '../types/factory';
import type { Format } from '../types/format';

/**
 * Defines the canonical text transform applied after character filtering.
 *
 * @since 0.1.0
 */
export type TextFormatTransform = 'uppercase' | 'lowercase';

/**
 * The text-format configuration without factory hooks.
 *
 * @private
 */
type TextFormatConfig = {
    /**
     * The regular expression that determines which characters are permitted
     * in the text value.
     */
    matches?: RegExp;

    /**
     * The maximum number of normalized characters to preserve.
     */
    maxLength?: number;

    /**
     * The canonical transform to apply to the normalized text.
     */
    transform?: TextFormatTransform;
};

/**
 * The public text-format options, including configuration and hooks.
 *
 * @since 0.1.0
 */
export type TextFormatOptions = FormatFactoryOptions<
    TextFormatConfig,
    TextFormatConfig
>;

/**
 * Tests whether one raw character is allowed into the normalized value.
 *
 * @private
 */
function matchesTextCharacter(matches: RegExp, character: string) {
    matches.lastIndex = 0;
    return matches.test(character);
}

/**
 * Creates a reusable format from text normalization rules.
 *
 * @since 0.1.0
 */
export default function defineTextFormat(
    options: TextFormatOptions = {}
): Format {
    const {
        append,
        blur,
        delete: deleteHook,
        format,
        insert,
        matches,
        maxLength,
        normalize,
        transform,
    } = options;
    const config: TextFormatConfig = {
        matches,
        maxLength,
        transform,
    };

    return defineFormat({
        normalize(raw) {
            let normalized = raw;

            if (config.matches) {
                const { matches } = config;
                const matching = Array.from(raw).filter((character) =>
                    matchesTextCharacter(matches, character)
                );

                normalized = matching.join('');
            }

            if (config.transform === 'uppercase') {
                normalized = normalized.toUpperCase();
            } else if (config.transform === 'lowercase') {
                normalized = normalized.toLowerCase();
            }

            if (config.maxLength !== undefined) {
                normalized = normalized.slice(0, Math.max(0, config.maxLength));
            }

            if (normalize) {
                return normalize(normalized, {
                    ...config,
                    raw,
                });
            }

            return normalized;
        },
        format(normalized) {
            if (format) {
                return format(normalized, {
                    ...config,
                    normalized,
                });
            }

            return normalized;
        },
        blur(formatted) {
            if (blur) {
                return blur(formatted, {
                    ...config,
                    formatted,
                });
            }

            return formatted;
        },
        append(context) {
            if (append) {
                return append(context.resolved, {
                    ...resolveFormatFactoryEditHookContext(context, config),
                });
            }
        },
        insert(context) {
            if (insert) {
                return insert(context.resolved, {
                    ...resolveFormatFactoryEditHookContext(context, config),
                });
            }
        },
        delete(context) {
            if (deleteHook) {
                return deleteHook(context.resolved, {
                    ...resolveFormatFactoryEditHookContext(context, config),
                });
            }
        },
    });
}
