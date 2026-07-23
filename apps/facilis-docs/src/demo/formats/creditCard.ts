import { defineSegmentedFormat } from '../../../../../packages/facilis/src/index.ts';

export const creditCard = () =>
    defineSegmentedFormat({
        matches: /\d/,
        segments: [4, ' ', 4, ' ', 4, ' ', 4],
    });
