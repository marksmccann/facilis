import { describe, expect, it } from 'vitest';
import { pattern } from '../../facilis-formats/src/pattern';
import { creditCard } from '../../facilis-formats/src/credit-card';
import { bindFormat } from './bindFormat';

class FakeInputElement extends EventTarget {
    selectionEnd: number | null = null;
    selectionStart: number | null = null;
    tagName = 'INPUT';
    value = '';

    setSelectionRange(start: number, end: number) {
        this.selectionStart = start;
        this.selectionEnd = end;
    }
}

globalThis.HTMLInputElement = FakeInputElement as typeof HTMLInputElement;

function bindToFakeInput(input: FakeInputElement, format: Parameters<typeof bindFormat>[1]) {
    return bindFormat(input as unknown as Element, format);
}

function dispatchInputMutation(
    input: FakeInputElement,
    {
        nextSelectionEnd,
        nextSelectionStart,
        nextValue,
        inputType,
    }: {
        inputType: string;
        nextSelectionEnd: number;
        nextSelectionStart: number;
        nextValue: string;
    }
) {
    const beforeInputEvent = Object.assign(new Event('beforeinput'), {
        inputType,
    });
    input.dispatchEvent(beforeInputEvent);

    input.value = nextValue;
    input.setSelectionRange(nextSelectionStart, nextSelectionEnd);
    const inputEvent = Object.assign(new Event('input'), {
        inputType,
    });
    input.dispatchEvent(inputEvent);
}

describe('bindFormat', () => {
    it('removes a pattern literal on backspace', () => {
        const input = new FakeInputElement();
        input.value = '12/34';
        input.setSelectionRange(3, 3);

        bindToFakeInput(input, pattern('##/##'));

        dispatchInputMutation(input, {
            inputType: 'deleteContentBackward',
            nextSelectionEnd: 2,
            nextSelectionStart: 2,
            nextValue: '1234',
        });

        expect(input.value).toBe('1234');
        expect(input.selectionStart).toBe(2);
        expect(input.selectionEnd).toBe(2);
    });

    it('removes a pattern literal on forward delete', () => {
        const input = new FakeInputElement();
        input.value = '12/34';
        input.setSelectionRange(2, 2);

        bindToFakeInput(input, pattern('##/##'));

        dispatchInputMutation(input, {
            inputType: 'deleteContentForward',
            nextSelectionEnd: 2,
            nextSelectionStart: 2,
            nextValue: '1234',
        });

        expect(input.value).toBe('1234');
        expect(input.selectionStart).toBe(2);
        expect(input.selectionEnd).toBe(2);
    });

    it('removes a credit-card separator on backspace', () => {
        const input = new FakeInputElement();
        input.value = '4111 1111 ';
        input.setSelectionRange(5, 5);

        bindToFakeInput(input, creditCard());

        dispatchInputMutation(input, {
            inputType: 'deleteContentBackward',
            nextSelectionEnd: 4,
            nextSelectionStart: 4,
            nextValue: '41111111 ',
        });

        expect(input.value).toBe('41111111 ');
        expect(input.selectionStart).toBe(4);
        expect(input.selectionEnd).toBe(4);
    });

    it('still lets a typed literal settle at a pattern boundary', () => {
        const input = new FakeInputElement();
        input.value = '12';
        input.setSelectionRange(2, 2);

        bindToFakeInput(input, pattern('##/##'));

        dispatchInputMutation(input, {
            inputType: 'insertText',
            nextSelectionEnd: 3,
            nextSelectionStart: 3,
            nextValue: '12/',
        });

        expect(input.value).toBe('12/');
        expect(input.selectionStart).toBe(3);
        expect(input.selectionEnd).toBe(3);
    });

    it('accepts a leading pattern literal from an empty value', () => {
        const input = new FakeInputElement();
        input.value = '';
        input.setSelectionRange(0, 0);

        bindToFakeInput(input, pattern('(###) ###-####'));

        dispatchInputMutation(input, {
            inputType: 'insertText',
            nextSelectionEnd: 1,
            nextSelectionStart: 1,
            nextValue: '(',
        });

        expect(input.value).toBe('(');
        expect(input.selectionStart).toBe(1);
        expect(input.selectionEnd).toBe(1);
    });

    it('removes a pattern literal run on backspace', () => {
        const input = new FakeInputElement();
        input.value = '(123) ';
        input.setSelectionRange(6, 6);

        bindToFakeInput(input, pattern('(###) ###-####'));

        dispatchInputMutation(input, {
            inputType: 'deleteContentBackward',
            nextSelectionEnd: 5,
            nextSelectionStart: 5,
            nextValue: '(123)',
        });

        expect(input.value).toBe('(123');
        expect(input.selectionStart).toBe(4);
        expect(input.selectionEnd).toBe(4);
    });
});
