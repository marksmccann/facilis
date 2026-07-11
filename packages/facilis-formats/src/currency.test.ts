import { setupInput, textState } from 'facilis-testing';
import { describe, expect, it } from 'vitest';
import { currency } from './currency';

describe('currency', () => {
    it('prefixes the default symbol and groups the whole portion', () => {
        const input = setupInput(currency());

        expect(input.type('12345.6')).toEqual(textState('$12,345.6', 9));
    });

    it('pads cents to two digits on blur', () => {
        const input = setupInput(currency());

        expect(input.blur('12345.6')).toEqual(
            textState('$12,345.60', null)
        );
    });

    it('supports a custom symbol', () => {
        const input = setupInput(
            currency({
                symbol: '€',
            })
        );

        expect(input.type('12345')).toEqual(textState('€12,345', 7));
    });

    it('supports custom separators', () => {
        const input = setupInput(
            currency({
                symbol: '€',
                decimalSeparator: ',',
                thousandsSeparator: '.',
            })
        );

        expect(input.type('12345,6')).toEqual(textState('€12.345,6', 9));
    });

    it('pads custom-separator cents on blur', () => {
        const input = setupInput(
            currency({
                symbol: '€',
                decimalSeparator: ',',
                thousandsSeparator: '.',
            })
        );

        expect(input.blur('12345,6')).toEqual(
            textState('€12.345,60', null)
        );
    });

    it('ignores decimal separators when cents are disabled', () => {
        const input = setupInput(
            currency({
                includeCents: false,
            })
        );

        expect(input.type('12345.6')).toEqual(textState('$123,456', 8));
    });

    it('supports disabling thousands separators', () => {
        const input = setupInput(
            currency({
                thousandsSeparator: '',
            })
        );

        expect(input.type('12345.6')).toEqual(textState('$12345.6', 8));
    });

    it('supports omitting the symbol entirely', () => {
        const input = setupInput(
            currency({
                symbol: '',
                includeCents: false,
            })
        );

        expect(input.type('12345.6')).toEqual(textState('123,456', 7));
    });

    it('inserts a leading zero on blur for decimal-only values', () => {
        const input = setupInput(currency());

        expect(input.blur('.5')).toEqual(textState('$0.50', null));
    });

    it('trims unnecessary leading zeros while typing', () => {
        const input = setupInput(currency());

        expect(input.type('00012')).toEqual(textState('$12', 3));
    });
});
