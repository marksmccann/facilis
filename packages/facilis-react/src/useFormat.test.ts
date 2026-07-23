import { defineFormat } from 'facilis';
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useFormat } from './useFormat';
import { useFormattedInput } from './useFormattedInput';
import { useFormattedValue } from './useFormattedValue';

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

function dispatchInput(
    input: HTMLInputElement,
    {
        data,
        inputType = 'insertText',
        selectionStart,
        value,
    }: {
        data: string | null;
        inputType?: string;
        selectionStart: number;
        value: string;
    }
) {
    input.value = value;
    input.setSelectionRange(selectionStart, selectionStart);
    fireEvent(
        input,
        new InputEvent('input', {
            bubbles: true,
            data,
            inputType,
        })
    );
}

describe('useFormat', () => {
    it('creates a format with factory options', () => {
        const factory = vi.fn(createTestFormat);

        function TestValue() {
            const format = useFormat<TestFormatOptions>(factory, {
                prefix: '>',
            });
            const formatted = useFormattedValue(format, 'ab');

            return React.createElement('span', null, formatted);
        }

        render(React.createElement(TestValue));

        expect(factory).toHaveBeenCalledWith({ prefix: '>' });
        expect(screen.getByText('>AB!')).toBeDefined();
    });
});

describe('useFormattedInput', () => {
    it('formats the default value', () => {
        const factory = vi.fn(createTestFormat);

        function TestInput() {
            const format = useFormat<TestFormatOptions>(factory, {
                prefix: '>',
            });
            const { inputProps } = useFormattedInput(format, {
                defaultValue: 'ab',
            });

            return React.createElement('input', inputProps);
        }

        render(React.createElement(TestInput));
        const input = screen.getByRole('textbox') as HTMLInputElement;

        expect(factory).toHaveBeenCalledWith({ prefix: '>' });
        expect(input.value).toBe('>AB');
    });

    it('formats input events and notifies value changes', () => {
        const onInput = vi.fn();
        const onValueChange = vi.fn();

        function TestInput() {
            const format = useFormat<TestFormatOptions>(createTestFormat, {
                prefix: '>',
            });
            const { inputProps } = useFormattedInput(format, {
                defaultValue: 'a',
                onInput,
                onValueChange,
            });

            return React.createElement('input', inputProps);
        }

        render(React.createElement(TestInput));
        const input = screen.getByRole('textbox') as HTMLInputElement;

        dispatchInput(input, {
            data: 'b',
            selectionStart: 3,
            value: '>Ab',
        });

        expect(onInput).toHaveBeenCalledTimes(1);
        expect(onValueChange).toHaveBeenCalledWith('>AB');
        expect(input.value).toBe('>AB');
        expect(input.selectionStart).toBe(3);
        expect(input.selectionEnd).toBe(3);
    });

    it('formats blur events and notifies value changes', () => {
        const onBlur = vi.fn();
        const onValueChange = vi.fn();

        function TestInput() {
            const format = useFormat<TestFormatOptions>(createTestFormat, {
                prefix: '>',
            });
            const { inputProps } = useFormattedInput(format, {
                defaultValue: 'ab',
                onBlur,
                onValueChange,
            });

            return React.createElement('input', inputProps);
        }

        render(React.createElement(TestInput));
        const input = screen.getByRole('textbox') as HTMLInputElement;

        fireEvent.blur(input);

        expect(onBlur).toHaveBeenCalledTimes(1);
        expect(onValueChange).toHaveBeenCalledWith('>AB!');
        expect(input.value).toBe('>AB!');
    });

    it('tracks selection changes before the next input event', () => {
        const onValueChange = vi.fn();

        function TestInput() {
            const format = useFormat<TestFormatOptions>(createTestFormat, {
                prefix: '>',
            });
            const { inputProps } = useFormattedInput(format, {
                defaultValue: 'ab',
                onValueChange,
            });

            return React.createElement('input', inputProps);
        }

        render(React.createElement(TestInput));
        const input = screen.getByRole('textbox') as HTMLInputElement;

        input.setSelectionRange(2, 2);
        fireEvent(
            document,
            new Event('selectionchange', {
                bubbles: true,
            })
        );
        dispatchInput(input, {
            data: 'z',
            selectionStart: 3,
            value: '>AzB',
        });

        expect(onValueChange).toHaveBeenCalledWith('>AZB');
        expect(input.value).toBe('>AZB');
    });
});
