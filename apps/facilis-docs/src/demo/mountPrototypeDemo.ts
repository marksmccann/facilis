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
    const patternInput = document.querySelector(
        '[data-facilis-pattern-input]'
    ) as HTMLInputElement | null;
    const domesticPhoneNumberInput = document.querySelector(
        '[data-facilis-domestic-phone-number-input]'
    ) as HTMLInputElement | null;
    const numericInput = document.querySelector(
        '[data-facilis-numeric-input]'
    ) as HTMLInputElement | null;
    const dateInput = document.querySelector(
        '[data-facilis-date-input]'
    ) as HTMLInputElement | null;

    if (
        !patternInput ||
        !domesticPhoneNumberInput ||
        !numericInput ||
        !dateInput
    ) {
        return;
    }

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

    bind(patternInput, pattern('(###) ###-####'));
    bind(domesticPhoneNumberInput, domesticPhoneNumber());
    bind(numericInput, currency());
    bind(dateInput, dateFormat());
}

// if (change.kind === 'insert') {
//     const { at, inserted, prefix, suffix } = change;

//     // A single number was added to end
//     if (/^\d$/.test(inserted) && suffix === '') {
//         if (at === 0) {
//             return `(${inserted}`;
//         } else if (at === 4) {
//             return `${prefix}) ${inserted}`;
//         } else if (at === 9) {
//             return `${prefix}-${inserted}`;
//         } else if (at === 14) {
//             return before.value;
//         }
//     } else {
//         //
//     }
// } else if (change.kind === 'delete') {
//     const { at, removed, prefix, suffix } = change;

//     // A single number was remove from end
//     if (/^\d$/.test(removed) && suffix === '') {
//         if (at === 10) {
//             return prefix.slice(0, -1);
//         } else if (at === 6) {
//             return prefix.slice(0, -2);
//         } else if (at === 1) {
//             return prefix.slice(0, -1);
//         }
//     } else {

//     }
// }
