import { defineFormat } from 'facilis';
import { describe, expect, it } from 'vitest';
import { setupInput } from './setupInput';
import { textState } from './textState';

const testFormat = defineFormat({
    normalize(raw) {
        return raw.replace(/[^a-z]/gi, '').toUpperCase();
    },
    format(normalized) {
        return Array.from(normalized)
            .map((character) => `[${character}]`)
            .join('');
    },
    blur(formatted) {
        return `${formatted}!`;
    },
    delete(_next, context) {
        if (context.deleted === ']') {
            return {
                value: context.previous.slice(0, context.cursor - 3),
                selectionStart: context.cursor - 3,
                selectionEnd: context.cursor - 3,
            };
        }
    },
});

describe('textState', () => {
    it('creates a selected text snapshot', () => {
        expect(textState('abc', 1, 2)).toEqual({
            value: 'abc',
            selectionStart: 1,
            selectionEnd: 2,
        });
    });

    it('defaults the selection to the end of the value', () => {
        expect(textState('abc')).toEqual({
            value: 'abc',
            selectionStart: 3,
            selectionEnd: 3,
        });
    });
});

describe('setupInput', () => {
    const input = setupInput(testFormat);

    it('mounts an initial value through the format', () => {
        expect(input.mount('ab', 2)).toEqual(textState('[A][B]', 5));
    });

    it('applies blur-time formatting', () => {
        expect(input.blur('[A][B]')).toEqual(textState('[A][B]!', null));
    });

    it('appends text at the end of a value', () => {
        expect(input.append('[A]', 'b')).toEqual(textState('[A][B]', 5));
    });

    it('inserts text at a collapsed selection', () => {
        expect(input.insert('[A][C]', 'b', 3)).toEqual(
            textState('[A][B][C]', 7)
        );
    });

    it('replaces the selected range when inserting text', () => {
        expect(input.insert('[A][Z][C]', 'b', 3, 6)).toEqual(
            textState('[A][B][C]', 7)
        );
    });

    it('deletes backward from one cursor position', () => {
        expect(input.delete('[A][B]', 6)).toEqual(textState('[A]', 3));
    });

    it('types a sequence from an empty value', () => {
        expect(input.type('ab')).toEqual(textState('[A][B]', 5));
    });
});
