import { createReporter } from 'runtime-reporter';

const messages = {
    ERR01: 'Pattern formats require a non-empty pattern string.',
    ERR02: 'Pattern formats require at least one token definition.',
    ERR03: 'Pattern format token keys must be a single character each.',
    ERR04: 'Pattern formats require the pattern string to include at least one token.',
} as const;

export const reporter = createReporter(
    process.env.NODE_ENV === 'production' ? ({} as typeof messages) : messages,
    {
        formatMessage(message, code) {
            return `[facilis] ${code}: ${message}`;
        },
    }
);
