import { describe, expect, it } from 'vitest';
import { applyBlur, applyInput, typeCharacters } from 'facilis-testing';
import { currency } from './currency';

describe('currency', () => {
    it('formats currency with the default symbol while keeping the cursor after each typed digit', () => {
        const format = currency();

        expect(typeCharacters(format, '1234567')).toEqual([
            {
                formattedValue: '$1',
                selectionStart: 2,
                selectionEnd: 2,
            },
            {
                formattedValue: '$12',
                selectionStart: 3,
                selectionEnd: 3,
            },
            {
                formattedValue: '$123',
                selectionStart: 4,
                selectionEnd: 4,
            },
            {
                formattedValue: '$1,234',
                selectionStart: 6,
                selectionEnd: 6,
            },
            {
                formattedValue: '$12,345',
                selectionStart: 7,
                selectionEnd: 7,
            },
            {
                formattedValue: '$123,456',
                selectionStart: 8,
                selectionEnd: 8,
            },
            {
                formattedValue: '$1,234,567',
                selectionStart: 10,
                selectionEnd: 10,
            },
        ]);
    });

    it('supports decimals and limits the fractional part to two digits', () => {
        const format = currency();

        expect(
            applyInput(format, {
                value: '1234.567',
            })
        ).toEqual({
            formattedValue: '$1,234.56',
            selectionStart: 9,
            selectionEnd: 9,
        });
    });

    it('ignores non-numeric characters from the raw input', () => {
        const format = currency();

        expect(
            applyInput(format, {
                value: '$1a2b3c4.5d6',
            })
        ).toEqual({
            formattedValue: '$1,234.56',
            selectionStart: 9,
            selectionEnd: 9,
        });
    });

    it('pads the fractional part on blur', () => {
        const format = currency();

        expect(
            applyBlur(format, {
                value: '$1,234.5',
            })
        ).toEqual({
            formattedValue: '$1,234.50',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('supports custom decimal and thousands separators', () => {
        const format = currency({
            decimalSeparator: ',',
            symbol: '€',
            thousandsSeparator: '.',
        });

        expect(
            applyInput(format, {
                value: '1234,56',
            })
        ).toEqual({
            formattedValue: '€1.234,56',
            selectionStart: 9,
            selectionEnd: 9,
        });
    });

    it('pads the fractional part on blur with a custom decimal separator', () => {
        const format = currency({
            decimalSeparator: ',',
            symbol: '€',
            thousandsSeparator: '.',
        });

        expect(
            applyBlur(format, {
                value: '€1.234,5',
            })
        ).toEqual({
            formattedValue: '€1.234,50',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('supports a custom symbol', () => {
        const format = currency({
            symbol: '€',
        });

        expect(
            applyInput(format, {
                value: '1234.5',
            })
        ).toEqual({
            formattedValue: '€1,234.5',
            selectionStart: 8,
            selectionEnd: 8,
        });
    });

    it('supports omitting the symbol', () => {
        const format = currency({
            symbol: '',
        });

        expect(
            applyInput(format, {
                value: '1234.5',
            })
        ).toEqual({
            formattedValue: '1,234.5',
            selectionStart: 7,
            selectionEnd: 7,
        });
    });

    it('ignores decimal separators when includeCents is false', () => {
        const format = currency({
            includeCents: false,
        });

        expect(
            applyInput(format, {
                value: '1234.56',
            })
        ).toEqual({
            formattedValue: '$123,456',
            selectionStart: 8,
            selectionEnd: 8,
        });
    });
});
