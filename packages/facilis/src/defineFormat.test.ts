import { describe, expect, it } from 'vitest';
import { applyBlur, applyInput } from 'facilis-testing';
import { defineFormat } from './defineFormat';

function createPhoneLikeFormat() {
    return defineFormat({
        name: 'phone-like',
        isMeaningfulCharacter({ character }) {
            return /\d/.test(character);
        },
        normalizeValue({ rawValue }) {
            return rawValue.replace(/[^\d]/g, '').slice(0, 6);
        },
        formatValue({ normalizedValue }) {
            const area = normalizedValue.slice(0, 3);
            const local = normalizedValue.slice(3, 6);

            if (normalizedValue.length === 0) {
                return '';
            }

            if (normalizedValue.length <= 3) {
                return `(${area}`;
            }

            return `(${area}) ${local}`;
        },
        formatBlurValue({ formattedValue }) {
            return formattedValue === '' ? '' : `${formattedValue}!`;
        },
    })();
}

describe('defineFormat', () => {
    it('formats input and keeps the cursor after the corresponding meaningful character', () => {
        const format = createPhoneLikeFormat();

        expect(
            applyInput(format, {
                value: '(123) 4',
                selectionStart: 7,
                selectionEnd: 7,
            })
        ).toEqual({
            formattedValue: '(123) 4',
            selectionStart: 7,
            selectionEnd: 7,
        });
    });

    it('normalizes pasted raw input before formatting', () => {
        const format = createPhoneLikeFormat();

        expect(
            applyInput(format, {
                value: '1a2b3c4',
                selectionStart: 7,
                selectionEnd: 7,
            })
        ).toEqual({
            formattedValue: '(123) 4',
            selectionStart: 7,
            selectionEnd: 7,
        });
    });

    it('clamps the selection to the normalized value length', () => {
        const format = createPhoneLikeFormat();

        expect(
            applyInput(format, {
                value: '(123) 456999',
                selectionStart: 12,
                selectionEnd: 12,
            })
        ).toEqual({
            formattedValue: '(123) 456',
            selectionStart: 9,
            selectionEnd: 9,
        });
    });

    it('returns zeroed selections when no meaningful characters precede the cursor', () => {
        const format = createPhoneLikeFormat();

        expect(
            applyInput(format, {
                value: '(',
                selectionStart: 1,
                selectionEnd: 1,
            })
        ).toEqual({
            formattedValue: '',
            selectionStart: 0,
            selectionEnd: 0,
        });
    });

    it('applies blur formatting and clears the selection', () => {
        const format = createPhoneLikeFormat();

        expect(
            applyBlur(format, {
                value: '1234',
            })
        ).toEqual({
            formattedValue: '(123) 4!',
            selectionStart: null,
            selectionEnd: null,
        });
    });

    it('creates isolated instances from the same factory', () => {
        const createFormat = defineFormat({
            name: 'identity',
            isMeaningfulCharacter({ character }) {
                return /[a-z]/i.test(character);
            },
            normalizeValue({ rawValue }) {
                return rawValue.toUpperCase();
            },
            formatValue({ normalizedValue }) {
                return normalizedValue;
            },
        });

        const first = createFormat();
        const second = createFormat();

        expect(first).not.toBe(second);
        expect(first.name).toBe('identity');
        expect(second.name).toBe('identity');
        expect(
            applyInput(first, {
                value: 'ab',
            })
        ).toEqual({
            formattedValue: 'AB',
            selectionStart: 2,
            selectionEnd: 2,
        });
    });
});
