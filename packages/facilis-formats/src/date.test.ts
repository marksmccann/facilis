import { setupInput, textState } from 'facilis-testing';
import { describe, expect, it } from 'vitest';
import { date } from './date';

describe('date', () => {
    it('groups digits into a month-day-year layout', () => {
        const input = setupInput(
            date({
                pattern: 'MM/DD/YYYY',
            })
        );

        expect(input.type('01022026')).toEqual(textState('01/02/2026', 10));
    });

    it('supports day-month-year layouts', () => {
        const input = setupInput(
            date({
                pattern: 'DD/MM/YY',
            })
        );

        expect(input.type('020126')).toEqual(textState('02/01/26', 8));
    });

    it('supports year-month layouts', () => {
        const input = setupInput(
            date({
                pattern: 'YYYY/MM',
            })
        );

        expect(input.type('202601')).toEqual(textState('2026/01', 7));
    });

    it('renders a configured separator', () => {
        const input = setupInput(
            date({
                pattern: 'MM/DD/YYYY',
                separator: '-',
            })
        );

        expect(input.type('01022026')).toEqual(textState('01-02-2026', 10));
    });

    it('does not insert leading zeros by default', () => {
        const input = setupInput(
            date({
                pattern: 'MM/DD/YYYY',
            })
        );

        expect(input.type('23')).toEqual(textState('23', 2));
    });

    it('inserts a leading zero for a safe single-digit month', () => {
        const input = setupInput(
            date({
                insertLeadingZero: true,
                pattern: 'MM/DD/YYYY',
            })
        );

        expect(input.type('2')).toEqual(textState('02', 2));
    });

    it('preserves the next digit for the following segment when padding a month', () => {
        const input = setupInput(
            date({
                insertLeadingZero: true,
                pattern: 'MM/DD/YYYY',
            })
        );

        expect(input.type('23')).toEqual(textState('02/3', 4));
    });

    it('inserts a leading zero for a safe single-digit day', () => {
        const input = setupInput(
            date({
                insertLeadingZero: true,
                pattern: 'MM/DD/YYYY',
            })
        );

        expect(input.type('124')).toEqual(textState('12/04', 5));
    });

    it('inserts a leading zero for a safe leading day segment', () => {
        const input = setupInput(
            date({
                insertLeadingZero: true,
                pattern: 'DD/MM/YYYY',
            })
        );

        expect(input.type('4')).toEqual(textState('04', 2));
    });

    it('uses the configured separator when leading zeros are inserted', () => {
        const input = setupInput(
            date({
                insertLeadingZero: true,
                pattern: 'MM/DD/YYYY',
                separator: '-',
            })
        );

        expect(input.type('24')).toEqual(textState('02-04', 5));
    });

    it('preserves impossible month values by default', () => {
        const input = setupInput(
            date({
                pattern: 'MM/DD/YYYY',
            })
        );

        expect(input.type('13')).toEqual(textState('13', 2));
    });

    it('rejects an impossible month when month and day values are strict', () => {
        const input = setupInput(
            date({
                pattern: 'MM/DD/YYYY',
                strictSegments: true,
            })
        );

        expect(input.type('13')).toEqual(textState('1', 1));
    });

    it('rejects an impossible day when month and day values are strict', () => {
        const input = setupInput(
            date({
                pattern: 'MM/DD/YYYY',
                strictSegments: true,
            })
        );

        expect(input.type('1239')).toEqual(textState('12/3', 4));
    });

    it('rejects an impossible leading day when month and day values are strict', () => {
        const input = setupInput(
            date({
                pattern: 'DD/MM/YYYY',
                strictSegments: true,
            })
        );

        expect(input.type('4')).toEqual(textState('', 0));
    });

    it('allows leading-zero insertion before applying strict month and day segments', () => {
        const input = setupInput(
            date({
                insertLeadingZero: true,
                pattern: 'MM/DD/YYYY',
                strictSegments: true,
            })
        );

        expect(input.type('24')).toEqual(textState('02/04', 5));
    });

    it('keeps the date to the configured pattern length', () => {
        const input = setupInput(
            date({
                pattern: 'MM/DD/YY',
            })
        );

        expect(input.append('01/02/26', '7')).toEqual(textState('01/02/26', 8));
    });

    it('cleans pasted text into the configured date layout', () => {
        const input = setupInput(
            date({
                pattern: 'MM/DD/YYYY',
            })
        );

        expect(input.type('01 / 02 / 2026 ext. 9')).toEqual(
            textState('01/02/2026', 10)
        );
    });

    it('accepts the separator when it is typed at a segment boundary', () => {
        const input = setupInput(
            date({
                pattern: 'MM/DD/YYYY',
            })
        );

        expect(input.append('01', '/')).toEqual(textState('01/', 3));
    });

    it('accepts a configured separator when it is typed at a segment boundary', () => {
        const input = setupInput(
            date({
                pattern: 'MM/DD/YYYY',
                separator: '.',
            })
        );

        expect(input.append('01', '.')).toEqual(textState('01.', 3));
    });

    it('rejects a duplicate separator', () => {
        const input = setupInput(
            date({
                pattern: 'MM/DD/YYYY',
            })
        );

        expect(input.append('01/', '/')).toEqual(textState('01/', 3));
    });

    it('rejects a middle digit insertion when the date is already full', () => {
        const input = setupInput(
            date({
                pattern: 'MM/DD/YYYY',
            })
        );

        expect(input.insert('01/02/2026', '9', 1)).toEqual(
            textState('01/02/2026', 1)
        );
    });

    it('moves backward over formatting instead of deleting it', () => {
        const input = setupInput(
            date({
                pattern: 'MM/DD/YYYY',
            })
        );

        expect(input.delete('01/02/2026', 3)).toEqual(
            textState('01/02/2026', 2)
        );
    });
});
