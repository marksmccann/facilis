import { createReporter } from 'runtime-reporter';

const messages = {} as const;

export const reporter = createReporter(
    process.env.NODE_ENV === 'production' ? ({} as typeof messages) : messages,
    {
        formatMessage(message, code) {
            return `[facilis-formats] ${code}: ${message}`;
        },
    }
);
