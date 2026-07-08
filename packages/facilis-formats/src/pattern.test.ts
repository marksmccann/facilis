import { describe, expect, it } from 'vitest';
import { pattern } from './pattern';

describe('pattern', () => {
    it('fills token slots in order and inserts literals', () => {
        const format = pattern('###-##');

        expect(
            format.onInput(
                null,
                {
                    value: '1234',
                    selectionStart: 4,
                    selectionEnd: 4,
                },
                {
                    value: '12345',
                    selectionStart: 5,
                    selectionEnd: 5,
                }
            )
        ).toEqual({
            value: '123-45',
            selectionStart: 6,
            selectionEnd: 6,
        });
    });

    it('ignores raw characters that do not match the next token slot', () => {
        const format = pattern('###-##');

        expect(
            format.onInput(
                null,
                {
                    value: '12a3',
                    selectionStart: 4,
                    selectionEnd: 4,
                },
                {
                    value: '12a34',
                    selectionStart: 5,
                    selectionEnd: 5,
                }
            )
        ).toEqual({
            value: '123-4',
            selectionStart: 5,
            selectionEnd: 5,
        });
    });

    it('supports explicit token definitions for mixed token types', () => {
        const format = pattern({
            pattern: '##-AA',
            tokens: {
                '#': { matches: /\d/ },
                A: { matches: /[A-Z]/i },
            },
        });

        expect(
            format.onInput(
                null,
                {
                    value: '1a2B',
                    selectionStart: 4,
                    selectionEnd: 4,
                },
                {
                    value: '1a2Bc',
                    selectionStart: 5,
                    selectionEnd: 5,
                }
            ).value
        ).toBe('12-Bc');
    });

    it('uses the same value pipeline on blur and clears selection', () => {
        const format = pattern('###-##');

        expect(
            format.onBlur({
                value: '12a34',
                selectionStart: 1,
                selectionEnd: 4,
            })
        ).toEqual({
            value: '123-4',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('inserts a literal run when any character is typed at its boundary', () => {
        const format = pattern('##/##');

        expect(
            format.onInput(
                null,
                {
                    value: '12',
                    selectionStart: 2,
                    selectionEnd: 2,
                },
                {
                    value: '12x',
                    selectionStart: 3,
                    selectionEnd: 3,
                }
            )
        ).toEqual({
            value: '12/',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });

    it('inserts the next token too when the typed character matches it', () => {
        const format = pattern('##/##');

        expect(
            format.onInput(
                null,
                {
                    value: '12',
                    selectionStart: 2,
                    selectionEnd: 2,
                },
                {
                    value: '123',
                    selectionStart: 3,
                    selectionEnd: 3,
                }
            )
        ).toEqual({
            value: '12/3',
            selectionStart: 4,
            selectionEnd: 4,
        });
    });

    it('rejects a middle token insertion when the pattern is already full', () => {
        const format = pattern('##/##');

        expect(
            format.onInput(
                'insertText',
                {
                    value: '12/34',
                    selectionStart: 2,
                    selectionEnd: 2,
                },
                {
                    value: '129/34',
                    selectionStart: 3,
                    selectionEnd: 3,
                }
            )
        ).toEqual({
            value: '12/34',
            selectionStart: 2,
            selectionEnd: 2,
        });
    });

    it('rejects a middle token insertion even when the previous selection was stale', () => {
        const format = pattern('##/##');

        expect(
            format.onInput(
                'insertText',
                {
                    value: '12/34',
                    selectionStart: 5,
                    selectionEnd: 5,
                },
                {
                    value: '129/34',
                    selectionStart: 3,
                    selectionEnd: 3,
                }
            )
        ).toEqual({
            value: '12/34',
            selectionStart: 2,
            selectionEnd: 2,
        });
    });

    it('deletes a trailing literal run on backward delete at the end', () => {
        const format = pattern('(###) ###-####');

        expect(
            format.onInput(
                'deleteContentBackward',
                {
                    value: '(123) ',
                    selectionStart: 6,
                    selectionEnd: 6,
                },
                {
                    value: '(123)',
                    selectionStart: 5,
                    selectionEnd: 5,
                }
            )
        ).toEqual({
            value: '(123',
            selectionStart: 4,
            selectionEnd: 4,
        });
    });

    it('moves backward-delete selection before a middle literal run', () => {
        const format = pattern('(###) ###-####');

        expect(
            format.onInput(
                'deleteContentBackward',
                {
                    value: '(123) 456-7890',
                    selectionStart: 6,
                    selectionEnd: 6,
                },
                {
                    value: '(123)456-7890',
                    selectionStart: 5,
                    selectionEnd: 5,
                }
            )
        ).toEqual({
            value: '(123) 456-7890',
            selectionStart: 4,
            selectionEnd: 4,
        });
    });

    it('trims trailing literals left behind after deleting the last token', () => {
        const format = pattern('(###) ###-####');

        expect(
            format.onInput(
                'deleteContentBackward',
                {
                    value: '(555) 5',
                    selectionStart: 7,
                    selectionEnd: 7,
                },
                {
                    value: '(555) ',
                    selectionStart: 6,
                    selectionEnd: 6,
                }
            )
        ).toEqual({
            value: '(555',
            selectionStart: 4,
            selectionEnd: 4,
        });
    });
});
