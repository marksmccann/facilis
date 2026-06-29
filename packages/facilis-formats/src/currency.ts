import {
    defineFormat,
    resolveSelectionByCharacterMatch,
    type Facilis,
} from 'facilis';

/**
 * Creates a formatter for currency values with comma-separated thousands and
 * up to two decimal places.
 */
export function currency(): Facilis.FormatInstance {
    return defineFormat({
        name: 'currency',
        normalizeValue({ rawValue }) {
            const cleaned = rawValue.replace(/[^\d.]/g, '');
            const firstDecimalIndex = cleaned.indexOf('.');

            if (firstDecimalIndex === -1) return cleaned;

            const integerPart = cleaned.slice(0, firstDecimalIndex);
            const afterFirstDecimal = cleaned.slice(firstDecimalIndex + 1);
            const fractionalPart = afterFirstDecimal.replace(/\./g, '');

            return `${integerPart}.${fractionalPart.slice(0, 2)}`;
        },
        formatValue({ normalizedValue }) {
            if (normalizedValue === '') return '';

            const hasDecimal = normalizedValue.includes('.');
            const parts = normalizedValue.split('.');
            const [integerPart = '', fractionalPart = ''] = parts;
            const commasRegex = /\B(?=(\d{3})+(?!\d))/g;
            const formattedInteger = integerPart.replace(commasRegex, ',');

            if (!hasDecimal) return `$${formattedInteger}`;

            return `$${formattedInteger}.${fractionalPart}`;
        },
        formatBlurValue({ formattedValue }) {
            if (formattedValue === '') return '';
            if (!formattedValue.includes('.')) return `${formattedValue}.00`;

            const parts = formattedValue.split('.');
            const [integerPart = '', fractionalPart = ''] = parts;

            return `${integerPart}.${fractionalPart.padEnd(2, '0').slice(0, 2)}`;
        },
        resolveSelection(context) {
            return resolveSelectionByCharacterMatch(/[\d.]/, context);
        },
    })();
}
