import { bindFormat } from '../../../../packages/facilis-dom/src/index.ts';
import {
    currency,
    number,
    pattern,
    text,
} from '../../../../packages/facilis-formats/src/index.ts';

function bind(target: string, factory: () => ReturnType<typeof currency>) {
    bindFormat(target, factory());
}

export function mountCurrencyDemo() {
    bind('[data-demo-currency-default]', () => currency());
    bind('[data-demo-currency-euro]', () => currency({ symbol: '€' }));
    bind('[data-demo-currency-separators]', () =>
        currency({
            decimalSeparator: ',',
            symbol: '€',
            thousandsSeparator: '.',
        })
    );
    bind('[data-demo-currency-whole]', () =>
        currency({ includeCents: false })
    );
    bind('[data-demo-currency-plain-groups]', () =>
        currency({
            thousandsSeparator: '',
        })
    );
    bind('[data-demo-currency-bare]', () =>
        currency({ includeCents: false, symbol: '' })
    );
}

export function mountNumberDemo() {
    bind('[data-demo-number-default]', () => number());
    bind('[data-demo-number-padded]', () =>
        number({
            decimalPlaces: 0,
            padDecimalPlaces: 2,
        })
    );
    bind('[data-demo-number-grouped]', () =>
        number({
            decimalPlaces: 2,
            thousandsSeparator: ',',
        })
    );
    bind('[data-demo-number-separators]', () =>
        number({
            decimalPlaces: 2,
            decimalSeparator: ',',
            thousandsSeparator: '.',
        })
    );
    bind('[data-demo-number-plain-groups]', () =>
        number({
            decimalPlaces: 2,
            thousandsSeparator: '',
        })
    );
    bind('[data-demo-number-negative]', () =>
        number({
            allowNegative: true,
            decimalPlaces: 2,
            thousandsSeparator: ',',
        })
    );
    bind('[data-demo-number-leading-zero]', () =>
        number({
            decimalPlaces: 2,
            insertLeadingZero: true,
        })
    );
    bind('[data-demo-number-trim-zeros]', () =>
        number({
            trimLeadingZeros: true,
        })
    );
    bind('[data-demo-number-max]', () =>
        number({
            max: 100,
        })
    );
    bind('[data-demo-number-min]', () =>
        number({
            allowNegative: true,
            min: 0,
        })
    );
    bind('[data-demo-number-decimal-max]', () =>
        number({
            decimalPlaces: 2,
            max: 10,
        })
    );
}

export function mountPatternDemo() {
    bind('[data-demo-pattern-phone]', () => pattern('(###) ###-####'));
    bind('[data-demo-pattern-custom]', () =>
        pattern({
            pattern: 'AA-####',
            tokens: {
                A: { matches: /[A-Z]/ },
                '#': { matches: /\d/ },
            },
        })
    );
    bind('[data-demo-pattern-wildcard]', () => pattern('**-##'));
}

export function mountTextDemo() {
    bind('[data-demo-text-letters]', () =>
        text({
            matches: /[a-z]/i,
        })
    );
    bind('[data-demo-text-digits]', () =>
        text({
            matches: /\d/,
        })
    );
    bind('[data-demo-text-hex]', () =>
        text({
            matches: /[a-f0-9]/i,
        })
    );
}
