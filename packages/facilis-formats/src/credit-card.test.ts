import { describe, expect, it } from 'vitest';
import { creditCard } from './credit-card';

describe('creditCard', () => {
    it('formats most cards as four-digit groups', () => {
        const format = creditCard();

        expect(
            format.onInput({
                value: '4111111111111111',
                selectionStart: 16,
                selectionEnd: 16,
            })
        ).toEqual({
            formattedValue: '4111 1111 1111 1111',
            selectionStart: 19,
            selectionEnd: 19,
        });
    });

    it('formats American Express numbers with a 4-6-5 layout', () => {
        const format = creditCard();

        expect(
            format.onInput({
                value: '378282246310005',
                selectionStart: 15,
                selectionEnd: 15,
            })
        ).toEqual({
            formattedValue: '3782 822463 10005',
            selectionStart: 17,
            selectionEnd: 17,
        });
    });

    it('removes non-digit characters before formatting', () => {
        const format = creditCard();

        expect(
            format.onInput({
                value: '4111-1111 1111abcd1111',
                selectionStart: 21,
                selectionEnd: 21,
            })
        ).toEqual({
            formattedValue: '4111 1111 1111 1111',
            selectionStart: 18,
            selectionEnd: 18,
        });
    });

    it('ignores extra digits beyond the default maximum length', () => {
        const format = creditCard();

        expect(
            format.onInput({
                value: '41111111111111112222',
                selectionStart: 20,
                selectionEnd: 20,
            })
        ).toEqual({
            formattedValue: '4111 1111 1111 1111',
            selectionStart: 19,
            selectionEnd: 19,
        });
    });

    it('ignores extra digits beyond the AmEx maximum length', () => {
        const format = creditCard();

        expect(
            format.onInput({
                value: '3782822463100059',
                selectionStart: 16,
                selectionEnd: 16,
            })
        ).toEqual({
            formattedValue: '3782 822463 10005',
            selectionStart: 17,
            selectionEnd: 17,
        });
    });

    it('maps selection through inserted group separators', () => {
        const format = creditCard();

        expect(
            format.onInput({
                value: '4111111111111111',
                selectionStart: 4,
                selectionEnd: 8,
            })
        ).toEqual({
            formattedValue: '4111 1111 1111 1111',
            selectionStart: 5,
            selectionEnd: 10,
        });
    });

    it('uses the same output on blur while clearing selection', () => {
        const format = creditCard();

        expect(
            format.onBlur({
                value: '378282246310005',
                selectionStart: 2,
                selectionEnd: 10,
            })
        ).toEqual({
            formattedValue: '3782 822463 10005',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('shows the next group separator as soon as a group is filled', () => {
        const format = creditCard();

        expect(
            format.onInput({
                value: '4111',
                selectionStart: 4,
                selectionEnd: 4,
            })
        ).toEqual({
            formattedValue: '4111 ',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('lets users type into a group-separator boundary without losing progress', () => {
        const format = creditCard();

        expect(
            format.onInput({
                value: '4111 ',
                selectionStart: 5,
                selectionEnd: 5,
            })
        ).toEqual({
            formattedValue: '4111 ',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });
});
