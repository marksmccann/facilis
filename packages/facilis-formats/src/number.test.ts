import { describe, expect, it } from 'vitest';
import { applyBlur, applyInput, typeCharacters } from 'facilis-testing';
import { number } from './number';

describe('number', () => {
    it('formats integer input by default', () => {
        const format = number();

        expect(typeCharacters(format, '1234')).toEqual([
            {
                formattedValue: '1',
                selectionStart: 1,
                selectionEnd: 1,
            },
            {
                formattedValue: '12',
                selectionStart: 2,
                selectionEnd: 2,
            },
            {
                formattedValue: '123',
                selectionStart: 3,
                selectionEnd: 3,
            },
            {
                formattedValue: '1234',
                selectionStart: 4,
                selectionEnd: 4,
            },
        ]);
    });

    it('ignores non-digit characters from the raw input', () => {
        const format = number();

        expect(
            applyInput(format, {
                value: '1a2b3c4',
            })
        ).toEqual({
            formattedValue: '1234',
            selectionStart: 4,
            selectionEnd: 4,
        });
    });

    it('supports decimal precision when configured', () => {
        const format = number({
            decimalPlaces: 2,
        });

        expect(
            applyInput(format, {
                value: '1234.567',
            })
        ).toEqual({
            formattedValue: '1234.56',
            selectionStart: 7,
            selectionEnd: 7,
        });
    });

    it('supports thousands separators for integer values', () => {
        const format = number({
            thousandsSeparator: ',',
        });

        expect(typeCharacters(format, '1234')).toEqual([
            {
                formattedValue: '1',
                selectionStart: 1,
                selectionEnd: 1,
            },
            {
                formattedValue: '12',
                selectionStart: 2,
                selectionEnd: 2,
            },
            {
                formattedValue: '123',
                selectionStart: 3,
                selectionEnd: 3,
            },
            {
                formattedValue: '1,234',
                selectionStart: 5,
                selectionEnd: 5,
            },
        ]);
    });

    it('supports thousands separators for decimal values', () => {
        const format = number({
            decimalPlaces: 2,
            thousandsSeparator: ',',
        });

        expect(
            applyInput(format, {
                value: '1234.56',
            })
        ).toEqual({
            formattedValue: '1,234.56',
            selectionStart: 8,
            selectionEnd: 8,
        });
    });

    it('supports a custom decimal separator', () => {
        const format = number({
            decimalPlaces: 2,
            decimalSeparator: ',',
        });

        expect(
            applyInput(format, {
                value: '1234,56',
            })
        ).toEqual({
            formattedValue: '1234,56',
            selectionStart: 7,
            selectionEnd: 7,
        });
    });

    it('supports grouped custom separators without moving the cursor before the decimal', () => {
        const format = number({
            decimalPlaces: 2,
            decimalSeparator: ',',
            thousandsSeparator: '.',
        });

        expect(
            applyInput(format, {
                value: '1234,56',
            })
        ).toEqual({
            formattedValue: '1.234,56',
            selectionStart: 8,
            selectionEnd: 8,
        });
    });

    it('keeps only the first decimal point when decimals are enabled', () => {
        const format = number({
            decimalPlaces: 2,
        });

        expect(
            applyInput(format, {
                value: '12.3.4',
            })
        ).toEqual({
            formattedValue: '12.34',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('preserves a leading minus sign when negative values are allowed', () => {
        const format = number({
            allowNegative: true,
        });

        expect(
            applyInput(format, {
                value: '-1234',
            })
        ).toEqual({
            formattedValue: '-1234',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('ignores a minus sign when negative values are not allowed', () => {
        const format = number();

        expect(
            applyInput(format, {
                value: '-1234',
            })
        ).toEqual({
            formattedValue: '1234',
            selectionStart: 4,
            selectionEnd: 4,
        });
    });

    it('preserves a negative decimal when enabled', () => {
        const format = number({
            allowNegative: true,
            decimalPlaces: 2,
        });

        expect(
            applyInput(format, {
                value: '-1234.567',
            })
        ).toEqual({
            formattedValue: '-1234.56',
            selectionStart: 8,
            selectionEnd: 8,
        });
    });

    it('preserves a lone minus sign as an in-progress value', () => {
        const format = number({
            allowNegative: true,
        });

        expect(
            applyInput(format, {
                value: '-',
            })
        ).toEqual({
            formattedValue: '-',
            selectionStart: 1,
            selectionEnd: 1,
        });
    });

    it('preserves a negative partial decimal as an in-progress value', () => {
        const format = number({
            allowNegative: true,
            decimalPlaces: 2,
        });

        expect(
            applyInput(format, {
                value: '-.',
            })
        ).toEqual({
            formattedValue: '-.',
            selectionStart: 2,
            selectionEnd: 2,
        });
    });

    it('returns the formatted value unchanged on blur', () => {
        const format = number();

        expect(
            applyBlur(format, {
                value: '1234',
            })
        ).toEqual({
            formattedValue: '1234',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('returns the decimal-formatted value unchanged on blur', () => {
        const format = number({
            decimalPlaces: 2,
        });

        expect(
            applyBlur(format, {
                value: '1234.56',
            })
        ).toEqual({
            formattedValue: '1234.56',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('returns the grouped formatted value unchanged on blur', () => {
        const format = number({
            decimalPlaces: 2,
            thousandsSeparator: ',',
        });

        expect(
            applyBlur(format, {
                value: '1,234.56',
            })
        ).toEqual({
            formattedValue: '1,234.56',
            selectionStart: null,
            selectionEnd: null,
        });
    });
});
