import { describe, expect, it } from 'vitest';
import { currency } from './currency';

describe('currency', () => {
    it('prefixes the default symbol and groups the whole portion', () => {
        const format = currency();

        expect(
            format.onInput({
                value: '12345.6',
                selectionStart: 7,
                selectionEnd: 7,
            })
        ).toEqual({
            value: '$12,345.6',
            selectionStart: 9,
            selectionEnd: 9,
        });
    });

    it('pads cents to two digits on blur', () => {
        const format = currency();

        expect(
            format.onBlur({
                value: '12345.6',
                selectionStart: 7,
                selectionEnd: 7,
            })
        ).toEqual({
            value: '$12,345.60',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('supports a custom symbol', () => {
        const format = currency({
            symbol: '€',
        });

        expect(
            format.onInput({
                value: '12345',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            value: '€12,345',
            selectionStart: 7,
            selectionEnd: 7,
        });
    });

    it('supports custom separators', () => {
        const format = currency({
            symbol: '€',
            decimalSeparator: ',',
            thousandsSeparator: '.',
        });

        expect(
            format.onInput({
                value: '12345,6',
                selectionStart: 7,
                selectionEnd: 7,
            })
        ).toEqual({
            value: '€12.345,6',
            selectionStart: 9,
            selectionEnd: 9,
        });
    });

    it('pads custom-separator cents on blur', () => {
        const format = currency({
            symbol: '€',
            decimalSeparator: ',',
            thousandsSeparator: '.',
        });

        expect(
            format.onBlur({
                value: '12345,6',
                selectionStart: 7,
                selectionEnd: 7,
            })
        ).toEqual({
            value: '€12.345,60',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('ignores decimal separators when cents are disabled', () => {
        const format = currency({
            includeCents: false,
        });

        expect(
            format.onInput({
                value: '12345.6',
                selectionStart: 7,
                selectionEnd: 7,
            })
        ).toEqual({
            value: '$123,456',
            selectionStart: 8,
            selectionEnd: 8,
        });
    });

    it('supports disabling thousands separators', () => {
        const format = currency({
            thousandsSeparator: '',
        });

        expect(
            format.onInput({
                value: '12345.6',
                selectionStart: 7,
                selectionEnd: 7,
            })
        ).toEqual({
            value: '$12345.6',
            selectionStart: 8,
            selectionEnd: 8,
        });
    });

    it('supports omitting the symbol entirely', () => {
        const format = currency({
            symbol: '',
            includeCents: false,
        });

        expect(
            format.onInput({
                value: '12345.6',
                selectionStart: 7,
                selectionEnd: 7,
            })
        ).toEqual({
            value: '123,456',
            selectionStart: 7,
            selectionEnd: 7,
        });
    });

    it('inserts a leading zero on blur for decimal-only values', () => {
        const format = currency();

        expect(
            format.onBlur({
                value: '.5',
                selectionStart: 2,
                selectionEnd: 2,
            })
        ).toEqual({
            value: '$0.50',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('trims unnecessary leading zeros while typing', () => {
        const format = currency();

        expect(
            format.onInput({
                value: '00012',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            value: '$12',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });
});
