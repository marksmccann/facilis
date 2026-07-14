import { defineConfig } from 'tsup';

const EXTERNAL_PACKAGES = ['facilis', 'react'];

export default defineConfig({
    entry: {
        index: 'src/index.ts',
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
