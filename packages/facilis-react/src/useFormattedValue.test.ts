import { defineFormat } from 'facilis';
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useFormat } from './useFormat';
import { useFormattedValue } from './useFormattedValue';

afterEach(cleanup);

function createTestFormat() {
    return defineFormat({
        normalize(raw) {
            return raw.replace(/[^a-z]/gi, '').toUpperCase();
        },
        format(normalized) {
            return `>${normalized}`;
        },
        blur(formatted) {
            return `${formatted}!`;
        },
    });
}

describe('useFormattedValue', () => {
    it('formats a standalone value', () => {
        function TestValue() {
            const format = useFormat(createTestFormat);
            const formatted = useFormattedValue(format, 'ab');

            return React.createElement('span', null, formatted);
        }

        render(React.createElement(TestValue));

        expect(screen.getByText('>AB!')).toBeDefined();
    });
});
