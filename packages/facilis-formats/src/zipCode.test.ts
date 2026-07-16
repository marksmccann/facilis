import { setupInput, textState } from 'facilis-testing';
import { describe, expect, it } from 'vitest';
import { zipCode } from './zipCode';

describe('zipCode', () => {
    it('keeps the default ZIP code layout to five digits', () => {
        const input = setupInput(zipCode());

        expect(input.type('12345')).toEqual(textState('12345', 5));
    });

    it('caps the default ZIP code layout at five digits', () => {
        const input = setupInput(zipCode());

        expect(input.append('12345', '6')).toEqual(textState('12345', 5));
    });

    it('groups nine digits into the ZIP+4 layout when configured', () => {
        const input = setupInput(
            zipCode({
                includePlusFour: true,
            })
        );

        expect(input.type('123456789')).toEqual(textState('12345-6789', 10));
    });

    it('accepts the plus-four separator when it is typed at the group boundary', () => {
        const input = setupInput(
            zipCode({
                includePlusFour: true,
            })
        );

        expect(input.append('12345', '-')).toEqual(textState('12345-', 6));
    });

    it('rejects a duplicate plus-four separator', () => {
        const input = setupInput(
            zipCode({
                includePlusFour: true,
            })
        );

        expect(input.append('12345-', '-')).toEqual(textState('12345-', 6));
    });

    it('rejects a middle digit insertion when the ZIP+4 is already full', () => {
        const input = setupInput(
            zipCode({
                includePlusFour: true,
            })
        );

        expect(input.insert('12345-6789', '9', 2)).toEqual(
            textState('12345-6789', 2)
        );
    });

    it('moves backward over formatting instead of deleting it', () => {
        const input = setupInput(
            zipCode({
                includePlusFour: true,
            })
        );

        expect(input.delete('12345-6789', 6)).toEqual(
            textState('12345-6789', 5)
        );
    });
});
