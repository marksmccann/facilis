import { defineFormat } from 'facilis';
import React from 'react';
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useFormat } from './useFormat';
import { useFormattedInput } from './useFormattedInput';
import type { UseFormattedInputOptions } from './types';

afterEach(cleanup);

function expectInputOptions(options: UseFormattedInputOptions) {
    return options;
}

expectInputOptions({
    value: '',
    onValueChange() {},
});
expectInputOptions({
    defaultValue: '',
});
// @ts-expect-error Controlled inputs require onValueChange.
expectInputOptions({
    value: '',
});
// @ts-expect-error Controlled inputs cannot also use defaultValue.
expectInputOptions({
    value: '',
    defaultValue: '',
    onValueChange() {},
});

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

describe('useFormattedInput', () => {
    it('formats the uncontrolled default value', () => {
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

    it('does not notify on mount when an uncontrolled default value is already formatted', () => {
        const onValueChange = vi.fn();

        function TestInput() {
            const format = useFormat<TestFormatOptions>(createTestFormat, {
                prefix: '>',
            });
            const { inputProps } = useFormattedInput(format, {
                defaultValue: '>AB',
                onValueChange,
            });

            return React.createElement('input', inputProps);
        }

        render(React.createElement(TestInput));

        expect(onValueChange).not.toHaveBeenCalled();
    });

    it('notifies on mount when an uncontrolled default value needs formatting', async () => {
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

        await waitFor(() => {
            expect(onValueChange).toHaveBeenCalledWith('>AB');
        });
    });

    it('does not notify on mount when a controlled value is already formatted', () => {
        const onValueChange = vi.fn();

        function TestInput() {
            const format = useFormat<TestFormatOptions>(createTestFormat, {
                prefix: '>',
            });
            const { inputProps } = useFormattedInput(format, {
                value: '>AB',
                onValueChange,
            });

            return React.createElement('input', inputProps);
        }

        render(React.createElement(TestInput));

        expect(onValueChange).not.toHaveBeenCalled();
    });

    it('notifies on mount when a controlled value needs formatting', async () => {
        const onValueChange = vi.fn();

        function TestInput() {
            const [value, setValue] = React.useState('ab');
            const format = useFormat<TestFormatOptions>(createTestFormat, {
                prefix: '>',
            });
            const { inputProps } = useFormattedInput(format, {
                value,
                onValueChange(nextValue) {
                    onValueChange(nextValue);
                    setValue(nextValue);
                },
            });

            return React.createElement('input', inputProps);
        }

        render(React.createElement(TestInput));
        const input = screen.getByRole('textbox') as HTMLInputElement;

        await waitFor(() => {
            expect(onValueChange).toHaveBeenCalledWith('>AB');
        });
        expect(onValueChange).toHaveBeenCalledTimes(1);
        expect(input.value).toBe('>AB');
    });

    it('formats controlled input events through value changes', () => {
        const onInput = vi.fn();
        const onValueChange = vi.fn();

        function TestInput() {
            const [value, setValue] = React.useState('>A');
            const format = useFormat<TestFormatOptions>(createTestFormat, {
                prefix: '>',
            });
            const { inputProps } = useFormattedInput(format, {
                value,
                onInput,
                onValueChange(nextValue) {
                    onValueChange(nextValue);
                    setValue(nextValue);
                },
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

    it('keeps controlled blur values committed by the parent', () => {
        const onBlur = vi.fn();
        const onValueChange = vi.fn();

        function TestInput() {
            const [value, setValue] = React.useState('>AB');
            const format = useFormat<TestFormatOptions>(createTestFormat, {
                prefix: '>',
            });
            const { inputProps } = useFormattedInput(format, {
                value,
                onBlur,
                onValueChange(nextValue) {
                    onValueChange(nextValue);
                    setValue(nextValue);
                },
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

    it('reflects controlled value updates from the parent', () => {
        function TestInput() {
            const [value, setValue] = React.useState('>A');
            const format = useFormat<TestFormatOptions>(createTestFormat, {
                prefix: '>',
            });
            const { inputProps } = useFormattedInput(format, {
                value,
                onValueChange: setValue,
            });

            return React.createElement(
                React.Fragment,
                null,
                React.createElement('input', inputProps),
                React.createElement(
                    'button',
                    {
                        type: 'button',
                        onClick() {
                            setValue('>CD');
                        },
                    },
                    'reset'
                )
            );
        }

        render(React.createElement(TestInput));
        const input = screen.getByRole('textbox') as HTMLInputElement;

        fireEvent.click(screen.getByRole('button'));

        expect(input.value).toBe('>CD');
    });

    it('formats uncontrolled input events and notifies value changes', () => {
        const onInput = vi.fn();
        const onValueChange = vi.fn();

        function TestInput() {
            const format = useFormat<TestFormatOptions>(createTestFormat, {
                prefix: '>',
            });
            const { inputProps } = useFormattedInput(format, {
                defaultValue: '>A',
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

    it('formats uncontrolled blur events and notifies value changes', () => {
        const onBlur = vi.fn();
        const onValueChange = vi.fn();

        function TestInput() {
            const format = useFormat<TestFormatOptions>(createTestFormat, {
                prefix: '>',
            });
            const { inputProps } = useFormattedInput(format, {
                defaultValue: '>AB',
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
                defaultValue: '>AB',
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
