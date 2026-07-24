import { describe, expect, it } from 'vitest';
import { textState } from './textState';

describe('textState', () => {
    it('defaults a collapsed selection to the end of the value', () => {
        expect(textState('abc')).toEqual({
            value: 'abc',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });

    it('uses the provided selection end when it is supplied', () => {
        expect(textState('abc', 1, 2)).toEqual({
            value: 'abc',
            selectionStart: 1,
            selectionEnd: 2,
        });
    });

    it('defaults the selection end to the provided start', () => {
        expect(textState('abc', 1)).toEqual({
            value: 'abc',
            selectionStart: 1,
            selectionEnd: 1,
        });
    });
});
