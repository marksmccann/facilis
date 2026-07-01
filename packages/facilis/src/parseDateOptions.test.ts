import { describe, expect, it } from 'vitest';
import { parseDateOptions } from './parseDateOptions';

describe('parseDateOptions', () => {
    it('returns the supported date pattern option with the default separator', () => {
        expect(
            parseDateOptions({
                pattern: 'MM/YY',
            })
        ).toEqual({
            pattern: 'MM/YY',
            separator: '/',
        });
    });

    it('returns a custom approved separator', () => {
        expect(
            parseDateOptions({
                pattern: 'MM/YY',
                separator: '-',
            })
        ).toEqual({
            pattern: 'MM/YY',
            separator: '-',
        });
    });

    it('fails when the pattern property is missing', () => {
        expect(() =>
            parseDateOptions({} as never)
        ).toThrowError(
            '[facilis] ERR05: Date formats require a `pattern` property.'
        );
    });

    it('ignores additional properties for now', () => {
        expect(
            parseDateOptions({
                pattern: 'MM/YY',
                separator: '/',
            } as never)
        ).toEqual({
            pattern: 'MM/YY',
            separator: '/',
        });
    });

    it('fails when the pattern is not approved', () => {
        expect(() =>
            parseDateOptions({
                pattern: 'MM-YY',
            })
        ).toThrowError(
            '[facilis] ERR07: Date formats require one of the approved patterns.'
        );
    });

    it('fails when the separator is not approved', () => {
        expect(() =>
            parseDateOptions({
                pattern: 'MM/YY',
                separator: '*' as never,
            })
        ).toThrowError(
            '[facilis] ERR08: Date formats require one of the approved separators.'
        );
    });
});
