import { createReporter } from 'runtime-reporter';

const messages = {
    ERR01: 'Pattern formats require a non-empty pattern string.',
    ERR02: 'Pattern formats require at least one token definition.',
    ERR03: 'Pattern format token keys must be a single character each.',
    ERR04: 'Pattern formats require the pattern string to include at least one token.',
    ERR05: 'Date formats require a pattern option.',
    ERR07: 'Date formats require a supported pattern.',
    ERR08: 'Date formats require a supported separator.',
    ERR09: 'Time formats require a pattern option.',
    ERR10: 'Time formats require a supported pattern.',
    ERR11: 'Time formats require a supported separator.',
} as const;

export const reporter = createReporter(
    process.env.NODE_ENV === 'production' ? ({} as typeof messages) : messages,
    {
        formatMessage(message, code) {
            return `[facilis-formats] ${code}: ${message}`;
        },
    }
);
