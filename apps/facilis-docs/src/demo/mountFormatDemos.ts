import { bindFormat } from '../../../../packages/facilis-dom/src/index.ts';
import {
    creditCard,
    currency,
    date,
    ein,
    expirationDate,
    number,
    pattern,
    percent,
    phoneNumber,
    socialSecurityNumber,
    text,
    time,
    zipCode,
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
    bind('[data-demo-currency-whole]', () => currency({ includeCents: false }));
    bind('[data-demo-currency-plain-groups]', () =>
        currency({
            thousandsSeparator: '',
        })
    );
    bind('[data-demo-currency-bare]', () =>
        currency({ includeCents: false, symbol: '' })
    );
}

export function mountCreditCardDemo() {
    bind('[data-demo-credit-card-default]', () => creditCard());
    bind('[data-demo-credit-card-amex]', () => creditCard());
}

export function mountDateDemo() {
    bind('[data-demo-date-default]', () => date({ pattern: 'MM/DD/YYYY' }));
    bind('[data-demo-date-dashed]', () =>
        date({ pattern: 'MM/DD/YYYY', separator: '-' })
    );
    bind('[data-demo-date-year-month]', () => date({ pattern: 'YYYY/MM' }));
    bind('[data-demo-date-leading-zero]', () =>
        date({ insertLeadingZero: true, pattern: 'MM/DD/YYYY' })
    );
    bind('[data-demo-date-strict-date-segments]', () =>
        date({ pattern: 'MM/DD/YYYY', strictDateSegments: true })
    );
    bind('[data-demo-date-paste]', () => date({ pattern: 'MM/DD/YYYY' }));
}

export function mountEinDemo() {
    bind('[data-demo-ein-default]', () => ein());
    bind('[data-demo-ein-paste]', () => ein());
}

export function mountExpirationDateDemo() {
    bind('[data-demo-expiration-date-default]', () => expirationDate());
    bind('[data-demo-expiration-date-paste]', () => expirationDate());
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
    bind('[data-demo-pattern-alpha]', () => pattern('aa-####'));
    bind('[data-demo-pattern-wildcard]', () => pattern('**-##'));
}

export function mountPercentDemo() {
    bind('[data-demo-percent-default]', () => percent());
    bind('[data-demo-percent-bare]', () => percent({ includeSymbol: false }));
    bind('[data-demo-percent-decimal]', () =>
        percent({
            decimalPlaces: 2,
        })
    );
    bind('[data-demo-percent-padded]', () =>
        percent({
            decimalPlaces: 2,
            padDecimalPlaces: 2,
        })
    );
    bind('[data-demo-percent-decimal-separator]', () =>
        percent({
            decimalPlaces: 2,
            decimalSeparator: ',',
        })
    );
    bind('[data-demo-percent-negative]', () =>
        percent({
            allowNegative: true,
            decimalPlaces: 2,
        })
    );
    bind('[data-demo-percent-max]', () =>
        percent({
            max: 100,
        })
    );
}

export function mountPhoneNumberDemo() {
    bind('[data-demo-phone-number-default]', () => phoneNumber());
    bind('[data-demo-phone-number-paste]', () => phoneNumber());
}

export function mountSocialSecurityNumberDemo() {
    bind('[data-demo-social-security-number-default]', () =>
        socialSecurityNumber()
    );
    bind('[data-demo-social-security-number-paste]', () =>
        socialSecurityNumber()
    );
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

export function mountTimeDemo() {
    bind('[data-demo-time-default]', () => time({ pattern: 'HH:mm' }));
    bind('[data-demo-time-seconds]', () => time({ pattern: 'HH:mm:ss' }));
    bind('[data-demo-time-twelve-hour]', () => time({ pattern: 'hh:mm' }));
    bind('[data-demo-time-dotted]', () =>
        time({ pattern: 'HH:mm', separator: '.' })
    );
    bind('[data-demo-time-leading-zero]', () =>
        time({ insertLeadingZero: true, pattern: 'HH:mm' })
    );
    bind('[data-demo-time-strict-twenty-four]', () =>
        time({ pattern: 'HH:mm', strictTimeParts: true })
    );
    bind('[data-demo-time-strict-twelve]', () =>
        time({ pattern: 'hh:mm', strictTimeParts: true })
    );
    bind('[data-demo-time-paste]', () => time({ pattern: 'HH:mm:ss' }));
}

export function mountZipCodeDemo() {
    bind('[data-demo-zip-code-default]', () => zipCode());
    bind('[data-demo-zip-code-plus-four]', () =>
        zipCode({ includePlusFour: true })
    );
    bind('[data-demo-zip-code-paste]', () =>
        zipCode({ includePlusFour: true })
    );
}
