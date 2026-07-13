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

        expect(input.deleteBackward('01/02/2026', 3)).toEqual(
            textState('01/02/2026', 2)
        );
    });
});
