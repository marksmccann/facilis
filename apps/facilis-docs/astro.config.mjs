import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';

export default defineConfig({
    site: 'https://example.com',
    base: '/facilis',
    integrations: [
        starlight({
            title: 'Facilis',
            description:
                'Framework-agnostic input formatting built around reusable formats and thin adapters.',
            sidebar: [
                {
                    label: 'Introduction',
                    items: [
                        { label: 'Overview', slug: '' },
                        { label: 'Vision', slug: 'vision' },
                        { label: 'Mental Model', slug: 'mental-model' },
                    ],
                },
                {
                    label: 'Packages',
                    items: [
                        { label: 'Core Package', slug: 'packages/core' },
                        { label: 'Docs App', slug: 'packages/docs' },
                    ],
                },
            ],
        }),
        mdx(),
    ],
});
