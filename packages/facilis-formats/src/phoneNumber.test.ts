import { setupInput, textState } from 'facilis-testing';
import { describe, expect, it } from 'vitest';
import { phoneNumber } from './phoneNumber';

describe('phoneNumber', () => {
    it('groups ten digits into the standard phone-number layout', () => {
        const input = setupInput(phoneNumber());

        expect(input.type('5551234567')).toEqual(
            textState('(555) 123-4567', 14)
        );
    });

    it('uses a custom separator before the line-number group', () => {
        const input = setupInput(phoneNumber({ separator: '.' }));

        expect(input.type('5551234567')).toEqual(
            textState('(555) 123.4567', 14)
        );
    });

    it('formats the area code as a plain group when parens are omitted', () => {
        const input = setupInput(phoneNumber({ includeAreaCodeParens: false }));

        expect(input.type('5551234567')).toEqual(textState('555-123-4567', 12));
    });

    it('uses the custom separator between every group without parens', () => {
        const input = setupInput(
            phoneNumber({ includeAreaCodeParens: false, separator: '.' })
        );

        expect(input.type('5551234567')).toEqual(textState('555.123.4567', 12));
    });

    it('accepts formatting when it is typed at a group boundary', () => {
        const input = setupInput(phoneNumber());

        expect(input.append('(555', ') ')).toEqual(textState('(555) ', 6));
    });

    it('rejects a middle digit insertion when the phone number is already full', () => {
        const input = setupInput(phoneNumber());

        expect(input.insert('(555) 123-4567', '9', 2)).toEqual(
            textState('(555) 123-4567', 2)
        );
    });

    it('moves backward over formatting instead of deleting it', () => {
        const input = setupInput(phoneNumber());

        expect(input.delete('(555) 123-4567', 6)).toEqual(
            textState('(555) 123-4567', 5)
        );
    });
});
