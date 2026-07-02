import type { Format } from 'facilis';
import { reporter } from './reporter';

/**
 * The input state captured before the browser mutates the field value.
 *
 * @private
 */
type InputSnapshot = {
    inputType: string;
    selectionEnd: number | null;
    selectionStart: number | null;
    value: string;
};

/**
 * Resolves either a direct DOM target or a selector string to the single input
 * element that `bindFormat` should attach to.
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
export function bindFormat(
    target: Element | string,
    format: Format
): () => void {
    const input = resolveInput(target);
    let pendingInputSnapshot: InputSnapshot | null = null;

    const handleBeforeInput = (event: Event) => {
        const inputEvent = event as InputEvent;

        pendingInputSnapshot = {
            inputType: inputEvent.inputType,
            selectionEnd: input.selectionEnd,
            selectionStart: input.selectionStart,
            value: input.value,
        };
    };

    const handleInput = () => {
        const result = format.onInput({
            value: input.value,
            selectionStart: input.selectionStart,
            selectionEnd: input.selectionEnd,
            inputType: pendingInputSnapshot?.inputType,
            previousValue: pendingInputSnapshot?.value,
            previousSelectionStart: pendingInputSnapshot?.selectionStart,
            previousSelectionEnd: pendingInputSnapshot?.selectionEnd,
        });

        input.value = result.formattedValue;

        if (result.selectionStart !== null && result.selectionEnd !== null) {
            input.setSelectionRange(result.selectionStart, result.selectionEnd);
        }

        pendingInputSnapshot = null;
    };
    const handleBlur = () => {
        const result = format.onBlur({
            value: input.value,
            selectionStart: input.selectionStart,
            selectionEnd: input.selectionEnd,
        });

        input.value = result.formattedValue;

        if (result.selectionStart !== null && result.selectionEnd !== null) {
            input.setSelectionRange(result.selectionStart, result.selectionEnd);
        }
    };

    input.addEventListener('beforeinput', handleBeforeInput);
    input.addEventListener('input', handleInput);
    input.addEventListener('blur', handleBlur);

    return () => {
        input.removeEventListener('beforeinput', handleBeforeInput);
        input.removeEventListener('input', handleInput);
        input.removeEventListener('blur', handleBlur);
    };
}
