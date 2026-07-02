import { createReporter } from 'runtime-reporter';

const messages = {
    ERR01: 'Format state `advance` requires a non-negative amount, but received {{ amount }}.',
} as const;

export const reporter = createReporter(
    process.env.NODE_ENV === 'production' ? ({} as typeof messages) : messages,
    {
        formatMessage(message, code) {
            return `[facilis] ${code}: ${message}`;
        },
    }
);
