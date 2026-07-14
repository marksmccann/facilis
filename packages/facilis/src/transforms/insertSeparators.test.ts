import { describe, expect, it } from 'vitest';
import insertSeparators from './insertSeparators';

describe('insertSeparators', () => {
    it('inserts separators before configured positions', () => {
        expect(
            insertSeparators('123456789', {
                positions: [3, 6],
                separator: '-',
            })
        ).toBe('123-45-6789');
    });

    it('can insert a separator at the start of the value', () => {
        expect(
            insertSeparators('555', {
                positions: [0],
                separator: '(',
            })
        ).toBe('(555');
    });

    it('ignores positions at or beyond the end of the value', () => {
        expect(
            insertSeparators('123', {
                positions: [3],
                separator: '-',
            })
        ).toBe('123');
    });

    it('supports multi-character separators', () => {
        expect(
            insertSeparators('5551', {
                positions: [3],
                separator: ') ',
            })
        ).toBe('555) 1');
    });
});
