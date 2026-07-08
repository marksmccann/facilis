import { describe, expect, it } from 'vitest';
import { creditCard } from './creditCard';

describe('creditCard', () => {
    it('groups standard card numbers into blocks of four digits', () => {
        const format = creditCard();

        expect(
            format.onInput(
                null,
                {
                    value: '411111111111111',
                    selectionStart: 15,
                    selectionEnd: 15,
                },
                {
                    value: '4111111111111111',
                    selectionStart: 16,
                    selectionEnd: 16,
                }
            )
        ).toEqual({
            value: '4111 1111 1111 1111',
            selectionStart: 19,
            selectionEnd: 19,
        });
    });

    it('switches to the American Express grouping automatically', () => {
        const format = creditCard();

        expect(
            format.onInput(
                null,
                {
                    value: '37144963539843',
                    selectionStart: 14,
                    selectionEnd: 14,
                },
                {
                    value: '371449635398431',
                    selectionStart: 15,
                    selectionEnd: 15,
                }
            )
        ).toEqual({
            value: '3714 496353 98431',
            selectionStart: 17,
            selectionEnd: 17,
        });
    });

    it('adds the next separator when a space is typed at a group boundary', () => {
        const format = creditCard();

        expect(
            format.onInput(
                null,
                {
                    value: '4111',
                    selectionStart: 4,
                    selectionEnd: 4,
                },
                {
                    value: '4111 ',
                    selectionStart: 5,
                    selectionEnd: 5,
                }
            )
        ).toEqual({
            value: '4111 ',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('adds the next separator when a non-digit is typed at a group boundary', () => {
        const format = creditCard();

        expect(
            format.onInput(
                null,
                {
                    value: '4111',
                    selectionStart: 4,
                    selectionEnd: 4,
                },
                {
                    value: '4111x',
                    selectionStart: 5,
                    selectionEnd: 5,
                }
            )
        ).toEqual({
            value: '4111 ',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('moves across an existing middle separator when a space is typed before it', () => {
        const format = creditCard();

        expect(
            format.onInput(
                null,
                {
                    value: '4111 1111',
                    selectionStart: 4,
                    selectionEnd: 4,
                },
                {
                    value: '4111  1111',
                    selectionStart: 5,
                    selectionEnd: 5,
                }
            )
        ).toEqual({
            value: '4111 1111',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('moves across an existing middle separator when a non-digit is typed before it', () => {
        const format = creditCard();

        expect(
            format.onInput(
                null,
                {
                    value: '4111 1111',
                    selectionStart: 4,
                    selectionEnd: 4,
                },
                {
                    value: '4111x 1111',
                    selectionStart: 5,
                    selectionEnd: 5,
                }
            )
        ).toEqual({
            value: '4111 1111',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('keeps the cursor after the separator on repeated ignored input', () => {
        const format = creditCard();

        expect(
            format.onInput(
                null,
                {
                    value: '4111 1111',
                    selectionStart: 5,
                    selectionEnd: 5,
                },
                {
                    value: '4111 x1111',
                    selectionStart: 6,
                    selectionEnd: 6,
                }
            )
        ).toEqual({
            value: '4111 1111',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('ignores non-digit characters away from a group boundary', () => {
        const format = creditCard();

        expect(
            format.onInput(
                null,
                {
                    value: '4111 111',
                    selectionStart: 8,
                    selectionEnd: 8,
                },
                {
                    value: '4111 111x',
                    selectionStart: 9,
                    selectionEnd: 9,
                }
            )
        ).toEqual({
            value: '4111 111',
            selectionStart: 8,
            selectionEnd: 8,
        });
    });

    it('caps American Express numbers at fifteen digits', () => {
        const format = creditCard();

        expect(
            format.onInput(
                null,
                {
                    value: '371449635398431',
                    selectionStart: 15,
                    selectionEnd: 15,
                },
                {
                    value: '3714496353984312',
                    selectionStart: 16,
                    selectionEnd: 16,
                }
            )
        ).toEqual({
            value: '3714 496353 98431',
            selectionStart: 17,
            selectionEnd: 17,
        });
    });

    it('rejects a middle digit insertion when the card number is already full', () => {
        const format = creditCard();

        expect(
            format.onInput(
                'insertText',
                {
                    value: '4111 1111 1111 1111',
                    selectionStart: 2,
                    selectionEnd: 2,
                },
                {
                    value: '41911 1111 1111 1111',
                    selectionStart: 3,
                    selectionEnd: 3,
                }
            )
        ).toEqual({
            value: '4111 1111 1111 1111',
            selectionStart: 2,
            selectionEnd: 2,
        });
    });

    it('rejects a middle digit insertion even when the previous selection was stale', () => {
        const format = creditCard();

        expect(
            format.onInput(
                'insertText',
                {
                    value: '4111 1111 1111 1111',
                    selectionStart: 19,
                    selectionEnd: 19,
                },
                {
                    value: '41911 1111 1111 1111',
                    selectionStart: 3,
                    selectionEnd: 3,
                }
            )
        ).toEqual({
            value: '4111 1111 1111 1111',
            selectionStart: 2,
            selectionEnd: 2,
        });
    });

    it('does not preserve a trailing separator after deleting the next digit', () => {
        const format = creditCard();

        expect(
            format.onInput(
                'deleteContentBackward',
                {
                    value: '4111 1',
                    selectionStart: 6,
                    selectionEnd: 6,
                },
                {
                    value: '4111 ',
                    selectionStart: 5,
                    selectionEnd: 5,
                }
            )
        ).toEqual({
            value: '4111',
            selectionStart: 4,
            selectionEnd: 4,
        });
    });
});
