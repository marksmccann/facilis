import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';

export default defineConfig({
    site: 'https://marksmccann.github.io',
    base: '/facilis',
    integrations: [
        starlight({
            title: 'Facilis',
            description:
                'Framework-agnostic input formatting built around reusable formats and thin adapters.',
            social: [
                {
                    icon: 'github',
                    label: 'GitHub',
                    href: 'https://github.com/marksmccann/facilis',
                },
            ],
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
                    label: 'Demos',
                    items: [{ label: 'Demo App', slug: 'demo-app' }],
                },
                {
                    label: 'Packages',
                    items: [
                        { label: 'Core Package', slug: 'packages/core' },
                        { label: 'Docs App', slug: 'packages/docs' },
                    ],
                },
                {
                    label: 'API Reference',
                    items: [
                        {
                            label: 'Formats Overview',
                            slug: 'reference/formats',
                        },
                        {
                            label: 'creditCard',
                            slug: 'reference/formats/credit-card',
                        },
                        {
                            label: 'currency',
                            slug: 'reference/formats/currency',
                        },
                        { label: 'date', slug: 'reference/formats/date' },
                        { label: 'ein', slug: 'reference/formats/ein' },
                        {
                            label: 'expirationDate',
                            slug: 'reference/formats/expiration-date',
                        },
                        { label: 'number', slug: 'reference/formats/number' },
                        { label: 'pattern', slug: 'reference/formats/pattern' },
                        {
                            label: 'phoneNumber',
                            slug: 'reference/formats/phone-number',
                        },
                        {
                            label: 'socialSecurityNumber',
                            slug: 'reference/formats/social-security-number',
                        },
                        { label: 'text', slug: 'reference/formats/text' },
                        {
                            label: 'zipCode',
                            slug: 'reference/formats/zip-code',
                        },
                    ],
                },
            ],
        }),
        mdx(),
    ],
});
