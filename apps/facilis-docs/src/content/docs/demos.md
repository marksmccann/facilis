---
title: Demo App
description: Deployment notes for the Facilis demo surface.
slug: demo-app
---

Facilis ships its demo surface from the docs app so guides, examples, and live
experiments can share the same deployment target.

## Routes

Dedicated format demos live at:

- `/facilis/demos/formats/currency/`
- `/facilis/demos/formats/number/`
- `/facilis/demos/formats/pattern/`
- `/facilis/demos/formats/text/`

## Current focus

The docs app now hosts dedicated demo pages per format so the same routes can
support documentation, regression testing, and format exploration.

## Why this setup

- It matches the deployment shape already used in `ornata`.
- It gives the project a stable public URL for future interactive examples.
- It keeps demo hosting concerns out of the core package workspace.
