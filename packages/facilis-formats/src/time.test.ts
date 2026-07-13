import { setupInput, textState } from 'facilis-testing';
import { describe, expect, it } from 'vitest';
import { time } from './time';

describe('time', () => {
    it('groups digits into a 24-hour hour-minute layout', () => {
        const input = setupInput(
            time({
                pattern: 'HH:mm',
            })
        );

        expect(input.type('1430')).toEqual(textState('14:30', 5));
    });

    it('supports seconds', () => {
        const input = setupInput(
            time({
                pattern: 'HH:mm:ss',
            })
        );

        expect(input.type('143005')).toEqual(textState('14:30:05', 8));
    });

    it('supports 12-hour layouts', () => {
        const input = setupInput(
            time({
                pattern: 'hh:mm',
            })
        );

        expect(input.type('0930')).toEqual(textState('09:30', 5));
    });

    it('renders a configured separator', () => {
        const input = setupInput(
            time({
                pattern: 'HH:mm',
                separator: '.',
            })
        );

        expect(input.type('1430')).toEqual(textState('14.30', 5));
    });

    it('does not insert leading zeros by default', () => {
        const input = setupInput(
            time({
                pattern: 'HH:mm',
            })
        );

        expect(input.type('930')).toEqual(textState('93:0', 4));
    });

    it('inserts a leading zero for a safe 24-hour hour', () => {
        const input = setupInput(
            time({
                insertLeadingZero: true,
                pattern: 'HH:mm',
            })
        );

        expect(input.type('930')).toEqual(textState('09:30', 5));
    });

    it('inserts a leading zero for a safe 12-hour hour', () => {
        const input = setupInput(
            time({
                insertLeadingZero: true,
                pattern: 'hh:mm',
            })
        );

        expect(input.type('930')).toEqual(textState('09:30', 5));
    });

    it('inserts a leading zero for a safe minute', () => {
        const input = setupInput(
            time({
                insertLeadingZero: true,
                pattern: 'HH:mm',
            })
        );

        expect(input.type('126')).toEqual(textState('12:06', 5));
    });

    it('uses the configured separator when leading zeros are inserted', () => {
        const input = setupInput(
            time({
                insertLeadingZero: true,
                pattern: 'HH:mm',
                separator: '.',
            })
        );

        expect(input.type('930')).toEqual(textState('09.30', 5));
    });

    it('preserves impossible 24-hour values by default', () => {
        const input = setupInput(
            time({
                pattern: 'HH:mm',
            })
        );

        expect(input.type('2930')).toEqual(textState('29:30', 5));
    });

    it('rejects an attempted impossible 24-hour hour when time parts are strict', () => {
        const input = setupInput(
            time({
                pattern: 'HH:mm',
                strictTimeParts: true,
            })
        );

        expect(input.append('2', '9')).toEqual(textState('2', 1));
    });

    it('rejects an attempted impossible 12-hour hour when time parts are strict', () => {
        const input = setupInput(
            time({
                pattern: 'hh:mm',
                strictTimeParts: true,
            })
        );

        expect(input.append('1', '3')).toEqual(textState('1', 1));
    });

    it('rejects an attempted zero 12-hour hour when time parts are strict', () => {
        const input = setupInput(
            time({
                pattern: 'hh:mm',
                strictTimeParts: true,
            })
        );

        expect(input.append('0', '0')).toEqual(textState('0', 1));
    });

    it('rejects an attempted impossible minute when time parts are strict', () => {
        const input = setupInput(
            time({
                pattern: 'HH:mm',
                strictTimeParts: true,
            })
        );

        expect(input.append('12', '6')).toEqual(textState('12', 2));
    });

    it('allows leading-zero insertion before applying strict time parts', () => {
        const input = setupInput(
            time({
                insertLeadingZero: true,
                pattern: 'HH:mm',
                strictTimeParts: true,
            })
        );

        expect(input.type('306')).toEqual(textState('03:06', 5));
    });

    it('keeps the time to the configured pattern length', () => {
        const input = setupInput(
            time({
                pattern: 'HH:mm',
            })
        );

        expect(input.append('14:30', '5')).toEqual(textState('14:30', 5));
    });

    it('cleans pasted text into the configured time layout', () => {
        const input = setupInput(
            time({
                pattern: 'HH:mm:ss',
            })
        );

        expect(input.type('14 : 30 : 05 ext. 9')).toEqual(
            textState('14:30:05', 8)
        );
    });

    it('accepts the separator when it is typed at a segment boundary', () => {
        const input = setupInput(
            time({
                pattern: 'HH:mm',
            })
        );

        expect(input.append('14', ':')).toEqual(textState('14:', 3));
    });

    it('accepts a configured separator when it is typed at a segment boundary', () => {
        const input = setupInput(
            time({
                pattern: 'HH:mm',
                separator: '.',
            })
        );

        expect(input.append('14', '.')).toEqual(textState('14.', 3));
    });

    it('rejects a duplicate separator', () => {
        const input = setupInput(
            time({
                pattern: 'HH:mm',
            })
        );

        expect(input.append('14:', ':')).toEqual(textState('14:', 3));
    });

    it('rejects a middle digit insertion when the time is already full', () => {
        const input = setupInput(
            time({
                pattern: 'HH:mm',
            })
        );

        expect(input.insert('14:30', '9', 1)).toEqual(textState('14:30', 1));
    });

    it('moves backward over formatting instead of deleting it', () => {
        const input = setupInput(
            time({
                pattern: 'HH:mm',
            })
        );

        expect(input.deleteBackward('14:30', 3)).toEqual(textState('14:30', 2));
    });
});
