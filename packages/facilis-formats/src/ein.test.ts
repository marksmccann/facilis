import { setupInput, textState } from 'facilis-testing';
import { describe, expect, it } from 'vitest';
import { ein } from './ein';

describe('ein', () => {
    it('groups nine digits into the standard EIN layout', () => {
        const input = setupInput(ein());

        expect(input.type('123456789')).toEqual(textState('12-3456789', 10));
    });

    it('accepts the separator when it is typed at the group boundary', () => {
        const input = setupInput(ein());

        expect(input.append('12', '-')).toEqual(textState('12-', 3));
    });

    it('rejects a middle digit insertion when the EIN is already full', () => {
        const input = setupInput(ein());

        expect(input.insert('12-3456789', '9', 2)).toEqual(
            textState('12-3456789', 2)
        );
    });

    it('moves backward over formatting instead of deleting it', () => {
        const input = setupInput(ein());

        expect(input.deleteBackward('12-3456789', 3)).toEqual(
            textState('12-3456789', 2)
        );
    });
});
