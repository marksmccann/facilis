import { setupInput, textState } from 'facilis-testing';
import { describe, expect, it } from 'vitest';
import { vin } from './vin';

describe('vin', () => {
    it('converts VIN text to uppercase', () => {
        const input = setupInput(vin());

        expect(input.type('1hgcm82633a004352')).toEqual(
            textState('1HGCM82633A004352', 17)
        );
    });

    it('removes characters that are not valid in a VIN', () => {
        const input = setupInput(vin());

        expect(input.type('ioq123')).toEqual(textState('123', 3));
    });

    it('caps VIN text at 17 characters', () => {
        const input = setupInput(vin());

        expect(input.append('1HGCM82633A004352', '9')).toEqual(
            textState('1HGCM82633A004352', 17)
        );
    });
});
