import type { Facilis } from './types';

/**
 * Creates a reusable format factory from a format definition.
 *
 * @since 0.0.1
 */
export function defineFormat(
    definition: Facilis.FormatDefinition
): Facilis.FormatFactory {
    return function createFormatInstance(): Facilis.FormatInstance {
        const {
            name,
            normalizeValue,
            formatValue,
            formatBlurValue = ({ formattedValue }) => formattedValue,
            resolveSelection,
        } = definition;

        return {
            name,
            onInput(options) {
                const rawValue = options.value;
                const normalizedValue = normalizeValue({ rawValue });
                const formattedValue = formatValue({ normalizedValue });
                const selection = resolveSelection({
                    rawValue,
                    rawSelectionStart: options.selectionStart ?? 0,
                    rawSelectionEnd: options.selectionEnd ?? 0,
                    normalizedValue,
                    formattedValue,
                });

                const result: Facilis.FormatResult = {
                    formattedValue,
                    selectionStart: selection.selectionStart,
                    selectionEnd: selection.selectionEnd,
                };

                return result;
            },
            onBlur(options) {
                const rawValue = options.value;
                const normalizedValue = normalizeValue({ rawValue });
                const formattedValue = formatValue({ normalizedValue });
                const finalizedValue = formatBlurValue({
                    formattedValue,
                });

                return {
                    formattedValue: finalizedValue,
                    selectionStart: null,
                    selectionEnd: null,
                };
            },
        };
    };
}
