import type { Facilis } from 'facilis';
import { reporter } from './reporter';

/**
 * Resolves either a direct DOM target or a selector string to the single input
 * element that `bind` should attach to.
 */
function resolveInput(target: Element | string): HTMLInputElement {
    if (typeof target !== 'string') {
        if (!(target instanceof HTMLInputElement)) {
            reporter.fail('ERR02', {
                tagName: target.tagName.toLowerCase(),
            });
        }

        return target as HTMLInputElement;
    }

    const elements = document.querySelectorAll(target);

    if (elements.length === 0) {
        reporter.fail('ERR01', {
            selector: target,
        });
    }

    if (elements.length > 1) {
        reporter.warn('WARN01', {
            selector: target,
            count: elements.length,
        });
    }

    const input = elements[0];

    if (!(input instanceof HTMLInputElement)) {
        reporter.fail('ERR03', {
            selector: target,
            tagName: input.tagName.toLowerCase(),
        });
    }

    return input as HTMLInputElement;
}

/**
 * Binds a format instance to an input element or selector and applies
 * formatting on `input` and `blur`.
 * @since 0.0.1
 */
export function bind(
    target: Element | string,
    format: Facilis.FormatInstance
): void {
    const input = resolveInput(target);

    input.addEventListener('input', () => {
        const result = format.onInput({
            value: input.value,
            selectionStart: input.selectionStart,
            selectionEnd: input.selectionEnd,
        });

        input.value = result.formattedValue;

        if (result.selectionStart !== null && result.selectionEnd !== null) {
            input.setSelectionRange(result.selectionStart, result.selectionEnd);
        }
    });

    input.addEventListener('blur', () => {
        const result = format.onBlur({
            value: input.value,
            selectionStart: input.selectionStart,
            selectionEnd: input.selectionEnd,
        });

        input.value = result.formattedValue;

        if (result.selectionStart !== null && result.selectionEnd !== null) {
            input.setSelectionRange(result.selectionStart, result.selectionEnd);
        }
    });
}
