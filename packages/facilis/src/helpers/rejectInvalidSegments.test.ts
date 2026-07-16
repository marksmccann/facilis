import { describe, expect, it } from 'vitest';
import rejectInvalidSegments from './rejectInvalidSegments';

describe('rejectInvalidSegments', () => {
    it('returns the valid prefix before the first invalid segment candidate', () => {
        expect(
            rejectInvalidSegments(
                '1239',
                ['MM', 'DD', 'YYYY'],
                (segment, candidate) => {
                    if (segment === 'MM') {
                        if (candidate.length === 1)
                            return /^[0-1]$/.test(candidate);
                        return /^(0[1-9]|1[0-2])$/.test(candidate);
                    }

                    if (segment === 'DD') {
                        if (candidate.length === 1)
                            return /^[0-3]$/.test(candidate);
                        return /^(0[1-9]|[1-2]\d|3[0-1])$/.test(candidate);
                    }

                    return true;
                }
            )
        ).toBe('123');
    });

    it('passes the previous accepted segment value to the callback', () => {
        const previousValues: string[] = [];

        rejectInvalidSegments(
            '29',
            ['HH'],
            (_segment, _candidate, previous) => {
                previousValues.push(previous);
                return true;
            }
        );

        expect(previousValues).toEqual(['', '2']);
    });

    it('preserves values when every segment candidate is accepted', () => {
        expect(
            rejectInvalidSegments('123456', ['AA', 'BB', 'CC'], () => true)
        ).toBe('123456');
    });
});
