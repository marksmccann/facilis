import { describe, expect, it } from 'vitest';
import { defineFormat } from '../../facilis/src/defineFormat';
import { pattern } from '../../facilis-formats/src/pattern';
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

function bindToFakeInput(
    input: FakeInputElement,
    format: Parameters<typeof bindFormat>[1]
) {
    return bindFormat(input as unknown as Element, format);
}

function dispatchInputMutation(
    input: FakeInputElement,
    {
        inputType,
        nextSelectionEnd,
        nextSelectionStart,
        nextValue,
    }: {
        inputType?: string;
        nextSelectionEnd: number;
        nextSelectionStart: number;
        nextValue: string;
    }
) {
    input.value = nextValue;
    input.setSelectionRange(nextSelectionStart, nextSelectionEnd);
    input.dispatchEvent(
        Object.assign(new Event('input'), {
            inputType,
        })
    );
}

describe('bindFormat', () => {
    it('formats the initial mounted value and stores the committed result', () => {
        const input = new FakeInputElement();
        input.value = 'ab';
        input.setSelectionRange(2, 2);

        const format = defineFormat({
            name: 'mount-test',
            normalize(character, state) {
                state.append(character.toUpperCase());
            },
            format(character, state) {
                state.append(`[${character}]`);
                state.advance();
            },
        });

        bindToFakeInput(input, format);

        expect(input.value).toBe('[A][B]');
        expect(input.selectionStart).toBe(6);
        expect(input.selectionEnd).toBe(6);
    });

    it('passes the previous committed snapshot into live input formatting', () => {
        const input = new FakeInputElement();
        input.value = 'ab';
        input.setSelectionRange(2, 2);

        let previousValueSeen: string | null = null;
        let previousSelectionStartSeen: number | null = null;
        let previousSelectionEndSeen: number | null = null;

        const format = defineFormat({
            name: 'previous-snapshot',
            normalize(character, state) {
                if (state.index === 0) {
                    previousValueSeen = state.edit.previous.value;
                    previousSelectionStartSeen =
                        state.edit.previous.selectionStart;
                    previousSelectionEndSeen = state.edit.previous.selectionEnd;
                }

                state.append(character.toUpperCase());
            },
            format(character, state) {
                state.append(character);
                state.advance();
            },
        });

        bindToFakeInput(input, format);

        dispatchInputMutation(input, {
            nextSelectionEnd: 3,
            nextSelectionStart: 3,
            nextValue: 'ABc',
        });

        expect(previousValueSeen).toBe('AB');
        expect(previousSelectionStartSeen).toBe(2);
        expect(previousSelectionEndSeen).toBe(2);
        expect(input.value).toBe('ABC');
        expect(input.selectionStart).toBe(3);
        expect(input.selectionEnd).toBe(3);
    });

    it('deletes trailing pattern literals on backward delete at the end', () => {
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

    it('trims orphaned trailing pattern literals after deleting the last token', () => {
        const input = new FakeInputElement();
        input.value = '(555) 5';
        input.setSelectionRange(7, 7);

        bindToFakeInput(input, pattern('(###) ###-####'));

        dispatchInputMutation(input, {
            inputType: 'deleteContentBackward',
            nextSelectionEnd: 6,
            nextSelectionStart: 6,
            nextValue: '(555) ',
        });

        expect(input.value).toBe('(555');
        expect(input.selectionStart).toBe(4);
        expect(input.selectionEnd).toBe(4);
    });
});
