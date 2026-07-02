import type {
    CharacterStagedFormatDefinition,
    FormatDefinition,
    FormatFactory,
    FormatInstance,
    FormatResult,
    FormatSelectionResult,
    StagedFormatDefinition,
    StructuredStagedFormatDefinition,
} from './types';

function isStagedFormatDefinition<FormatItem>(
    definition: FormatDefinition<FormatItem>
): definition is StagedFormatDefinition<FormatItem> {
    return 'normalize' in definition && 'format' in definition;
}

function isStructuredStagedFormatDefinition<FormatItem>(
    definition: StagedFormatDefinition<FormatItem>
): definition is StructuredStagedFormatDefinition<FormatItem> {
    return definition.formatItems !== undefined;
}

function normalizeRawValue(
    rawValue: string,
    normalize: StagedFormatDefinition['normalize']
) {
    let normalized = '';
    const rawToNormalized = [0];

    for (let index = 0; index < rawValue.length; index += 1) {
        normalize(rawValue[index], {
            index,
            rawValue,
            normalized,
            append(text: string) {
                normalized += text;
            },
            replace(text: string) {
                normalized = text;
            },
        });
        rawToNormalized.push(normalized.length);
    }

    return {
        normalized,
        rawToNormalized,
    };
}

function formatNormalizedValue<FormatItem>(
    normalized: string,
    definition: StagedFormatDefinition<FormatItem>
) {
    let formatted = '';
    let normalizedPosition = 0;
    const normalizedToFormatted = [0];

    if (isStructuredStagedFormatDefinition(definition)) {
        for (let index = 0; index < definition.formatItems.length; index += 1) {
            definition.format(
                definition.formatItems[index],
                {
                    index,
                    normalized,
                    formatted,
                    normalizedPosition,
                    append(text: string) {
                        formatted += text;
                    },
                    consume(amount = 1) {
                        for (let step = 0; step < amount; step += 1) {
                            normalizedPosition += 1;
                            normalizedToFormatted[normalizedPosition] =
                                formatted.length;
                        }
                    },
                },
            );
        }
    } else {
        const characterDefinition: CharacterStagedFormatDefinition = definition;

        for (let index = 0; index < normalized.length; index += 1) {
            characterDefinition.format(
                normalized[index],
                {
                    index,
                    normalized,
                    formatted,
                    normalizedPosition,
                    append(text: string) {
                        formatted += text;
                    },
                    consume(amount = 1) {
                        for (let step = 0; step < amount; step += 1) {
                            normalizedPosition += 1;
                            normalizedToFormatted[normalizedPosition] =
                                formatted.length;
                        }
                    },
                },
            );
        }
    }

    while (normalizedToFormatted.length <= normalized.length) {
        normalizedToFormatted.push(formatted.length);
    }

    return {
        formatted,
        normalizedToFormatted,
    };
}

function resolveSelectionFromMaps(
    rawSelectionStart: number,
    rawSelectionEnd: number,
    rawToNormalized: number[],
    normalizedToFormatted: number[]
): FormatSelectionResult {
    const normalizedSelectionStart =
        rawToNormalized[rawSelectionStart] ?? rawToNormalized.at(-1) ?? 0;
    const normalizedSelectionEnd =
        rawToNormalized[rawSelectionEnd] ?? rawToNormalized.at(-1) ?? 0;

    return {
        selectionStart:
            normalizedToFormatted[normalizedSelectionStart] ??
            normalizedToFormatted.at(-1) ??
            0,
        selectionEnd:
            normalizedToFormatted[normalizedSelectionEnd] ??
            normalizedToFormatted.at(-1) ??
            0,
    };
}

/**
 * Creates a reusable format factory from a format definition.
 *
 * @since 0.0.1
 */
export function defineFormat<FormatItem>(
    definition: FormatDefinition<FormatItem>
): FormatFactory {
    return function createFormatInstance(): FormatInstance {
        const { name } = definition;

        return {
            name,
            onInput(options) {
                if (isStagedFormatDefinition(definition)) {
                    const rawValue = options.value;
                    const rawSelectionStart = options.selectionStart ?? 0;
                    const rawSelectionEnd = options.selectionEnd ?? 0;
                    const { normalized, rawToNormalized } = normalizeRawValue(
                        rawValue,
                        definition.normalize
                    );
                    const { formatted, normalizedToFormatted } =
                        formatNormalizedValue(normalized, definition);
                    const selection = definition.resolve
                        ? definition.resolve({
                              rawValue,
                              rawSelectionStart,
                              rawSelectionEnd,
                              normalizedValue: normalized,
                              formattedValue: formatted,
                          })
                        : resolveSelectionFromMaps(
                              rawSelectionStart,
                              rawSelectionEnd,
                              rawToNormalized,
                              normalizedToFormatted
                          );

                    return {
                        formattedValue: formatted,
                        selectionStart: selection.selectionStart,
                        selectionEnd: selection.selectionEnd,
                    };
                }

                const {
                    normalizeValue,
                    formatValue,
                    formatBlurValue = ({ formattedValue }) => formattedValue,
                    resolveSelection,
                } = definition;
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

                const result: FormatResult = {
                    formattedValue,
                    selectionStart: selection.selectionStart,
                    selectionEnd: selection.selectionEnd,
                };

                return result;
            },
            onBlur(options) {
                if (isStagedFormatDefinition(definition)) {
                    const rawValue = options.value;
                    const { normalized } = normalizeRawValue(
                        rawValue,
                        definition.normalize
                    );
                    const { formatted } = formatNormalizedValue(
                        normalized,
                        definition
                    );
                    const finalizedValue = definition.finalize
                        ? definition.finalize({
                              formattedValue: formatted,
                          })
                        : formatted;

                    return {
                        formattedValue: finalizedValue,
                        selectionStart: null,
                        selectionEnd: null,
                    };
                }

                const {
                    normalizeValue,
                    formatValue,
                    formatBlurValue = ({ formattedValue }) => formattedValue,
                } = definition;
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
