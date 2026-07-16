import { setupInput, textState } from 'facilis-testing';
import { describe, expect, it } from 'vitest';
import { creditCard } from './creditCard';

describe('creditCard', () => {
    it('groups standard card numbers into blocks of four digits', () => {
        const input = setupInput(creditCard());

        expect(input.type('4111111111111111')).toEqual(
            textState('4111 1111 1111 1111', 19)
        );
    });

    it('switches to the American Express grouping automatically', () => {
        const input = setupInput(creditCard());

        expect(input.type('371449635398431')).toEqual(
            textState('3714 496353 98431', 17)
        );
    });

    it('adds the next separator when a space is typed at a group boundary', () => {
        const input = setupInput(creditCard());

        expect(input.append('4111', ' ')).toEqual(textState('4111 ', 5));
    });

    it('adds the next separator when a non-digit is typed at a group boundary', () => {
        const input = setupInput(creditCard());

        expect(input.append('4111', 'x')).toEqual(textState('4111 ', 5));
    });

    it('moves across an existing middle separator when a space is typed before it', () => {
        const input = setupInput(creditCard());

        expect(input.insert('4111 1111', ' ', 4)).toEqual(
            textState('4111 1111', 5)
        );
    });

    it('moves across an existing middle separator when a non-digit is typed before it', () => {
        const input = setupInput(creditCard());

        expect(input.insert('4111 1111', 'x', 4)).toEqual(
            textState('4111 1111', 5)
        );
    });

    it('keeps the cursor after the separator on repeated ignored input', () => {
        const input = setupInput(creditCard());

        expect(input.insert('4111 1111', 'x', 5)).toEqual(
            textState('4111 1111', 5)
        );
    });

    it('ignores non-digit characters away from a group boundary', () => {
        const input = setupInput(creditCard());

        expect(input.append('4111 111', 'x')).toEqual(textState('4111 111', 8));
    });

    it('caps American Express numbers at fifteen digits', () => {
        const input = setupInput(creditCard());

        expect(input.append('371449635398431', '2')).toEqual(
            textState('3714 496353 98431', 17)
        );
    });

    it('rejects a middle digit insertion when the card number is already full', () => {
        const input = setupInput(creditCard());

        expect(input.insert('4111 1111 1111 1111', '9', 2)).toEqual(
            textState('4111 1111 1111 1111', 2)
        );
    });

    it('does not preserve a trailing separator after deleting the next digit', () => {
        const input = setupInput(creditCard());

        expect(input.delete('4111 1')).toEqual(textState('4111', 4));
    });
});
