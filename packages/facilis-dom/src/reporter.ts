import { createReporter } from 'runtime-reporter';

const messages = {
    ERR01: 'Could not find an input element to `bind` to for the selector "{{ selector }}".',
    ERR02: 'Bind requires the direct target to be an `HTMLInputElement`, but received <{{ tagName }}> instead.',
    ERR03: 'Selector "{{ selector }}" resolved to <{{ tagName }}>, but `bind` requires an `HTMLInputElement`.',
    WARN01: 'Selector "{{ selector }}" matched {{ count }} elements. Binding the first match.',
} as const;

export const reporter = createReporter(
    process.env.NODE_ENV === 'production' ? ({} as typeof messages) : messages,
    {
        formatMessage(message, code) {
            return `[facilis-dom] ${code}: ${message}`;
        },
    }
);
