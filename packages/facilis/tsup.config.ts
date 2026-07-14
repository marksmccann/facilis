import { defineConfig } from 'tsup';

const EXTERNAL_PACKAGES = ['runtime-reporter'];

export default defineConfig({
    entry: {
        index: 'src/index.ts',
        guards: 'src/guards/index.ts',
        selection: 'src/selection/index.ts',
        transforms: 'src/transforms/index.ts',
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
