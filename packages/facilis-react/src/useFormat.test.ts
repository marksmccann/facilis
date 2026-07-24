import { defineFormat } from 'facilis';
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useFormat } from './useFormat';

afterEach(cleanup);

type TestFormatOptions = {
    prefix?: string;
};

function createTestFormat(options: TestFormatOptions = {}) {
    const prefix = options.prefix ?? '';

    return defineFormat({
        normalize(raw) {
            return raw.replace(/[^a-z]/gi, '').toUpperCase();
        },
        format(normalized) {
            return `${prefix}${normalized}`;
        },
        blur(formatted) {
            return `${formatted}!`;
        },
    });
}

describe('useFormat', () => {
    it('creates a format with factory options', () => {
        const factory = vi.fn(createTestFormat);

        function TestValue() {
            const format = useFormat<TestFormatOptions>(factory, {
                prefix: '>',
            });

            return React.createElement('span', null, format.formatValue('ab'));
        }

        render(React.createElement(TestValue));

        expect(factory).toHaveBeenCalledWith({ prefix: '>' });
        expect(screen.getByText('>AB!')).toBeDefined();
    });
});
