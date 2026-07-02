import reporter from './reporter';

/**
 * Resolves either a direct DOM target or a selector string to the single input
 * element that `bindFormat` should attach to.
 */
export default function resolveInput(
    target: Element | string
): HTMLInputElement {
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
