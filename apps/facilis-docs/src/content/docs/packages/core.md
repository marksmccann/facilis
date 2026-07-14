---
title: Core Package
description: Notes about the Facilis core package workspace.
---

The `facilis` package contains the framework-agnostic runtime contract.

It exports `defineFormat`, shared runtime types, edit guards, selection helpers,
and reusable value transforms. Adapter packages depend on this package, and
first-party formats use it to define portable formatting behavior.
