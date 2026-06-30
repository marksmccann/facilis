import {
    defineFormat,
    resolveSelectionForCharacterMatch,
    type FormatInstance,
} from 'facilis';

/**
 * Creates a formatter for a 10-digit domestic phone number in the
 * `(###) ###-####` format.
 */
export function domesticPhoneNumber(): FormatInstance {
    return defineFormat({
        name: 'domesticPhoneNumber',
        normalizeValue({ rawValue }) {
            return rawValue.replace(/[^\d]/g, '').slice(0, 10);
        },
        formatValue({ normalizedValue }) {
            if (normalizedValue === '') return '';

            const areaCode = normalizedValue.slice(0, 3);
            const prefix = normalizedValue.slice(3, 6);
            const lineNumber = normalizedValue.slice(6, 10);

            if (normalizedValue.length <= 3) {
                return `(${areaCode}`;
            }

            if (normalizedValue.length <= 6) {
                return `(${areaCode}) ${prefix}`;
            }

            return `(${areaCode}) ${prefix}-${lineNumber}`;
        },
        resolveSelection(context) {
            return resolveSelectionForCharacterMatch(context, /\d/);
        },
    })();
}
