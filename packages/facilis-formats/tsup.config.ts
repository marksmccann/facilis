import { defineConfig } from 'tsup';

const EXTERNAL_PACKAGES = ['facilis', 'runtime-reporter'];

export default defineConfig({
    entry: {
        index: 'src/index.ts',
        creditCard: 'src/creditCard.ts',
        currency: 'src/currency.ts',
        date: 'src/date.ts',
        ein: 'src/ein.ts',
        expirationDate: 'src/expirationDate.ts',
        number: 'src/number.ts',
        pattern: 'src/pattern.ts',
        percent: 'src/percent.ts',
        phoneNumber: 'src/phoneNumber.ts',
        socialSecurityNumber: 'src/socialSecurityNumber.ts',
        text: 'src/text.ts',
        time: 'src/time.ts',
        zipCode: 'src/zipCode.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    splitting: false,
    external: EXTERNAL_PACKAGES,
    outExtension({ format }) {
        return {
            js: format === 'cjs' ? '.cjs' : '.js',
        };
    },
});
