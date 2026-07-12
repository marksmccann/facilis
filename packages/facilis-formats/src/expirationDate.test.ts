import { setupInput, textState } from 'facilis-testing';
import { describe, expect, it } from 'vitest';
import { expirationDate } from './expirationDate';

describe('expirationDate', () => {
    it('groups four digits into the standard expiration-date layout', () => {
        const input = setupInput(expirationDate());

        expect(input.type('1234')).toEqual(textState('12/34', 5));
    });

    it('keeps the expiration date to four digits', () => {
        const input = setupInput(expirationDate());

        expect(input.append('12/34', '5')).toEqual(textState('12/34', 5));
    });

    it('accepts the separator when it is typed at the group boundary', () => {
        const input = setupInput(expirationDate());

        expect(input.append('12', '/')).toEqual(textState('12/', 3));
    });

    it('rejects a duplicate separator', () => {
        const input = setupInput(expirationDate());

        expect(input.append('12/', '/')).toEqual(textState('12/', 3));
    });

    it('cleans pasted text into the expiration-date layout', () => {
        const input = setupInput(expirationDate());

        expect(input.type('12 / 34 ext. 5')).toEqual(textState('12/34', 5));
    });

    it('rejects a middle digit insertion when the expiration date is already full', () => {
        const input = setupInput(expirationDate());

        expect(input.insert('12/34', '9', 1)).toEqual(textState('12/34', 1));
    });

    it('moves backward over formatting instead of deleting it', () => {
        const input = setupInput(expirationDate());

        expect(input.deleteBackward('12/34', 3)).toEqual(textState('12/34', 2));
    });
});
