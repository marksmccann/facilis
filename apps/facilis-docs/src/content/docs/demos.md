---
title: Demo App
description: Deployment notes for the Facilis demo surface.
slug: demo-app
---

Facilis ships its demo surface from the docs app so guides, examples, and live
experiments can share the same deployment target.

## Route

The current demo entrypoint is available at `/facilis/demos/`.

## Why this setup

- It matches the deployment shape already used in `ornata`.
- It gives the project a stable public URL for future interactive examples.
- It keeps demo hosting concerns out of the core package workspace.
