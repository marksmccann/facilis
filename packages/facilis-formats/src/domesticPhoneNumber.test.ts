import { describe, expect, it } from 'vitest';
import { applyBlur, applyInput, typeCharacters } from 'facilis-testing';
import { domesticPhoneNumber } from './domesticPhoneNumber';

describe('domesticPhoneNumber', () => {
    it('formats a domestic phone number while keeping the cursor after each typed digit', () => {
        const format = domesticPhoneNumber();

        expect(typeCharacters(format, '1234567890')).toEqual([
            {
                formattedValue: '(1',
                selectionStart: 2,
                selectionEnd: 2,
            },
            {
                formattedValue: '(12',
                selectionStart: 3,
                selectionEnd: 3,
            },
            {
                formattedValue: '(123',
                selectionStart: 4,
                selectionEnd: 4,
            },
            {
                formattedValue: '(123) 4',
                selectionStart: 7,
                selectionEnd: 7,
            },
            {
                formattedValue: '(123) 45',
                selectionStart: 8,
                selectionEnd: 8,
            },
            {
                formattedValue: '(123) 456',
                selectionStart: 9,
                selectionEnd: 9,
            },
            {
                formattedValue: '(123) 456-7',
                selectionStart: 11,
                selectionEnd: 11,
            },
            {
                formattedValue: '(123) 456-78',
                selectionStart: 12,
                selectionEnd: 12,
            },
            {
                formattedValue: '(123) 456-789',
                selectionStart: 13,
                selectionEnd: 13,
            },
            {
                formattedValue: '(123) 456-7890',
                selectionStart: 14,
                selectionEnd: 14,
            },
        ]);
    });

    it('ignores non-digit characters from the raw input', () => {
        const format = domesticPhoneNumber();

        expect(
            applyInput(format, {
                value: '1a2b3c4d5e6f7g8h9i0',
            })
        ).toEqual({
            formattedValue: '(123) 456-7890',
            selectionStart: 14,
            selectionEnd: 14,
        });
    });

    it('limits the normalized value to 10 digits', () => {
        const format = domesticPhoneNumber();

        expect(
            applyInput(format, {
                value: '1234567890123',
            })
        ).toEqual({
            formattedValue: '(123) 456-7890',
            selectionStart: 14,
            selectionEnd: 14,
        });
    });

    it('returns the formatted value unchanged on blur', () => {
        const format = domesticPhoneNumber();

        expect(
            applyBlur(format, {
                value: '(123) 456-7890',
            })
        ).toEqual({
            formattedValue: '(123) 456-7890',
            selectionStart: null,
            selectionEnd: null,
        });
    });
});
