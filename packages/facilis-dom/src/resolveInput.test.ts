import { beforeEach, describe, expect, it, vi } from 'vitest';
import resolveInput from './resolveInput';

class FakeInputElement extends EventTarget {
    tagName = 'INPUT';
}

class FakeDivElement extends EventTarget {
    tagName = 'DIV';
}

globalThis.HTMLInputElement = FakeInputElement as typeof HTMLInputElement;

describe('resolveInput', () => {
    beforeEach(() => {
        vi.unstubAllGlobals();
    });

    it('returns a direct input target', () => {
        const input = new FakeInputElement();

        expect(resolveInput(input as unknown as Element)).toBe(input);
    });

    it('returns the first selector match', () => {
        const first = new FakeInputElement();
        const second = new FakeInputElement();

        vi.stubGlobal('document', {
            querySelectorAll() {
                return [first, second];
            },
        });

        expect(resolveInput('input')).toBe(first);
    });

    it('throws when a selector resolves to a non-input element', () => {
        vi.stubGlobal('document', {
            querySelectorAll() {
                return [new FakeDivElement()];
            },
        });

        expect(() => resolveInput('div')).toThrow(/ERR03/);
    });
});
