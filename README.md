# facilis

`facilis` is a framework-agnostic input formatting library centered on reusable,
shareable formats and thin integration adapters.

This repository is organized as a monorepo so the core package, adapters,
first-party formats, testing helpers, documentation, and demos can evolve
together.

## Deployment

- Docs and demos: `https://marksmccann.github.io/facilis/`

## Workspace

- `packages/facilis`: the framework-agnostic formatting runtime
- `packages/facilis-dom`: DOM adapter for binding formats to inputs
- `packages/facilis-react`: React adapter for formatted input props
- `packages/facilis-formats`: first-party reusable format definitions
- `packages/facilis-testing`: test helpers for formats and adapters
- `apps/facilis-docs`: the documentation app

## Status

Facilis is early, but the core package split is in place: reusable formats live
outside adapters, adapters own platform wiring, and the docs app hosts both
reference pages and live demos.
