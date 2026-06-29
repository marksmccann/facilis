import {
    defineFormat,
    resolveSelectionByCharacterMatch,
} from '../../../../packages/facilis/src/index.ts';
import { bind } from '../../../../packages/facilis-dom/src/index.ts';
import {
    currency,
    domesticPhoneNumber,
    pattern,
} from '../../../../packages/facilis-formats/src/index.ts';

export function mountPrototypeDemo() {
    const dateFormat = defineFormat({
        name: 'date',
        normalizeValue({ rawValue }) {
            const digits = rawValue.replace(/[^\d]/g, '').slice(0, 8);

            if (digits === '') return '';

            let index = 0;

            const monthFirst = digits[index] ?? '';
            let month = '';

            if (monthFirst >= '2' && monthFirst <= '9') {
                month = `0${monthFirst}`;
                index += 1;
            } else {
                month = monthFirst;
                index += monthFirst === '' ? 0 : 1;

                const monthSecond = digits[index] ?? '';

                if (monthFirst !== '' && monthSecond !== '') {
                    const monthCandidate = `${monthFirst}${monthSecond}`;
                    const monthNumber = Number(monthCandidate);

                    if (monthNumber >= 1 && monthNumber <= 12) {
                        month = monthCandidate;
                        index += 1;
                    } else if (monthFirst === '1') {
                        month = '01';
                    }
                }
            }

            const dayFirst = digits[index] ?? '';
            let day = '';

            if (dayFirst >= '4' && dayFirst <= '9') {
                day = `0${dayFirst}`;
                index += 1;
            } else {
                day = dayFirst;
                index += dayFirst === '' ? 0 : 1;

                const daySecond = digits[index] ?? '';

                if (dayFirst !== '' && daySecond !== '') {
                    const dayCandidate = `${dayFirst}${daySecond}`;
                    const dayNumber = Number(dayCandidate);

                    if (dayNumber >= 1 && dayNumber <= 31) {
                        day = dayCandidate;
                        index += 1;
                    } else if (dayFirst >= '1' && dayFirst <= '3') {
                        day = `0${dayFirst}`;
                    }
                }
            }

            const year = digits.slice(index, index + 4);

            if (day === '') return month;
            if (year === '') return `${month}/${day}`;

            return `${month}/${day}/${year}`;
        },
        formatValue({ normalizedValue }) {
            return normalizedValue;
        },
        resolveSelection(context) {
            return resolveSelectionByCharacterMatch(/\d/, context);
        },
    });

    bind('[data-facilis-pattern-input]', pattern('(###) ###-####'));
    bind('[data-facilis-domestic-phone-number-input]', domesticPhoneNumber());
    bind(
        '[data-facilis-currency-input]',
        currency({
            symbol: '$',
            cents: 'always',
        })
    );
    bind('[data-facilis-date-input]', dateFormat());
}
