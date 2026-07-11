import { setupInput, textState } from 'facilis-testing';
import { describe, expect, it } from 'vitest';
import { socialSecurityNumber } from './socialSecurityNumber';

describe('socialSecurityNumber', () => {
    it('groups nine digits into the standard SSN layout', () => {
        const input = setupInput(socialSecurityNumber());

        expect(input.type('123456789')).toEqual(textState('123-45-6789', 11));
    });

    it('accepts the first separator when it is typed at the group boundary', () => {
        const input = setupInput(socialSecurityNumber());

        expect(input.append('123', '-')).toEqual(textState('123-', 4));
    });

    it('accepts the second separator when it is typed at the group boundary', () => {
        const input = setupInput(socialSecurityNumber());

        expect(input.append('123-45', '-')).toEqual(
            textState('123-45-', 7)
        );
    });

    it('rejects a middle digit insertion when the SSN is already full', () => {
        const input = setupInput(socialSecurityNumber());

        expect(input.insert('123-45-6789', '9', 2)).toEqual(
            textState('123-45-6789', 2)
        );
    });

    it('moves backward over formatting instead of deleting it', () => {
        const input = setupInput(socialSecurityNumber());

        expect(input.deleteBackward('123-45-6789', 4)).toEqual(
            textState('123-45-6789', 3)
        );
    });
});
