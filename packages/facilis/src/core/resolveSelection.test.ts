import { describe, expect, it } from 'vitest';
import resolveSelection from './resolveSelection';

const digitFormat = {
    normalize(raw: string) {
        return raw.replace(/\D/g, '');
    },
    format(normalized: string) {
        return `(${normalized})`;
    },
};

describe('resolveSelection', () => {
    it('preserves the selection when formatting does not change the value', () => {
        expect(
            resolveSelection(
                { normalize: (raw) => raw },
                { value: 'abc', selectionStart: 1, selectionEnd: 2 }
            )
        ).toEqual({ selectionStart: 1, selectionEnd: 2 });
    });

    it('maps raw boundaries through normalized and formatted text', () => {
        expect(
            resolveSelection(digitFormat, {
                value: '12',
                selectionStart: 0,
                selectionEnd: 1,
            })
        ).toEqual({ selectionStart: 1, selectionEnd: 2 });
    });

    it('keeps null selections null and clamps out-of-range selections', () => {
        expect(
            resolveSelection(digitFormat, {
                value: '123',
                selectionStart: 99,
                selectionEnd: null,
            })
        ).toEqual({ selectionStart: 4, selectionEnd: null });
    });
});
