import { defineFormat } from '../../../../../packages/facilis/src/index.ts';

export const accessCode = () =>
    defineFormat({
        normalize(raw) {
            return raw.replace(/\D/g, '').slice(0, 6);
        },
        format(normalized) {
            return normalized.replace(/(\d{3})(?=\d)/, '$1-');
        },
    });
