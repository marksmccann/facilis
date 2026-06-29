import { bindFormat } from '../../../../packages/facilis-dom/src/index.ts';
import {
    currency,
    domesticPhoneNumber,
    pattern,
} from '../../../../packages/facilis-formats/src/index.ts';

function bind(target: string, factory: () => ReturnType<typeof currency>) {
    bindFormat(target, factory());
}

export function mountCurrencyDemo() {
    bind('[data-demo-currency-default]', () => currency());
    bind('[data-demo-currency-euro]', () => currency({ symbol: '€' }));
    bind('[data-demo-currency-whole]', () => currency({ cents: 'never' }));
    bind('[data-demo-currency-bare]', () =>
        currency({ symbol: '', cents: 'never' })
    );
}

export function mountDomesticPhoneNumberDemo() {
    bind('[data-demo-phone-basic]', () => domesticPhoneNumber());
    bind('[data-demo-phone-paste]', () => domesticPhoneNumber());
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
