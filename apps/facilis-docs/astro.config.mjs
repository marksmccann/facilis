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
                    label: 'Start Here',
                    items: [
                        { label: 'Overview', slug: '' },
                        { label: 'Quick Start', slug: 'quick-start' },
                        { label: 'Core Ideas', slug: 'core-ideas' },
                        { label: 'Why Facilis', slug: 'vision' },
                    ],
                },
                {
                    label: 'Guides',
                    items: [
                        {
                            label: 'Choose a Format',
                            slug: 'guides/choose-a-format',
                        },
                        { label: 'Test a Format', slug: 'guides/test-a-format' },
                    ],
                },
                {
                    label: 'Create a Format',
                    items: [
                        { label: 'Overview', slug: 'create-a-format' },
                        {
                            label: 'Define a Format',
                            slug: 'create-a-format/define-a-format',
                        },
                        { label: 'Guards', slug: 'create-a-format/guards' },
                        {
                            label: 'Transforms',
                            slug: 'create-a-format/transforms',
                        },
                        { label: 'Selection', slug: 'create-a-format/selection' },
                    ],
                },
                {
                    label: 'Adapters',
                    items: [
                        { label: 'Adapters Overview', slug: 'adapters' },
                        { label: 'DOM', slug: 'adapters/dom' },
                        { label: 'React', slug: 'adapters/react' },
                    ],
                },
                {
                    label: 'Formats',
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
                        { label: 'percent', slug: 'reference/formats/percent' },
                        {
                            label: 'phoneNumber',
                            slug: 'reference/formats/phone-number',
                        },
                        {
                            label: 'socialSecurityNumber',
                            slug: 'reference/formats/social-security-number',
                        },
                        { label: 'text', slug: 'reference/formats/text' },
                        { label: 'time', slug: 'reference/formats/time' },
                        {
                            label: 'zipCode',
                            slug: 'reference/formats/zip-code',
                        },
                    ],
                },
                {
                    label: 'API Reference',
                    items: [
                        { label: 'Reference Overview', slug: 'reference' },
                        { label: 'Core', slug: 'reference/core' },
                        { label: 'Adapters', slug: 'reference/adapters' },
                        {
                            label: 'First-Party Formats',
                            slug: 'reference/first-party-formats',
                        },
                        { label: 'Testing', slug: 'reference/testing' },
                    ],
                },
                {
                    label: 'Demos',
                    items: [{ label: 'Demos Overview', slug: 'demos' }],
                },
                {
                    label: 'Project',
                    items: [{ label: 'Packages', slug: 'packages' }],
                },
            ],
        }),
        mdx(),
    ],
});
