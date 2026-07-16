import { describe, expect, it } from 'vitest';
import insertBeforeCharacter from './insertBeforeCharacter';

describe('insertBeforeCharacter', () => {
    it('inserts text before a matching character at one position', () => {
        expect(
            insertBeforeCharacter('523', [
                { position: 0, matches: /^[2-9]$/, insert: '0' },
            ])
        ).toBe('0523');
    });

    it('resolves positions against the formatted value as text is inserted', () => {
        expect(
            insertBeforeCharacter('46', [
                { position: 0, matches: /^[2-9]$/, insert: '0' },
                { position: 2, matches: /^[4-9]$/, insert: '0' },
            ])
        ).toBe('0406');
    });

    it('preserves characters that do not match the configured rule', () => {
        expect(
            insertBeforeCharacter('123', [
                { position: 0, matches: /^[2-9]$/, insert: '0' },
            ])
        ).toBe('123');
    });
});
