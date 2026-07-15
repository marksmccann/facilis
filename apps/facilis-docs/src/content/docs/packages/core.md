---
title: Core Package
description: Notes about the Facilis core package workspace.
---

The `facilis` package contains the framework-agnostic runtime contract.

It exports `defineFormat`, layered format factories, and shared runtime types.
Adapter packages depend on this package, and first-party formats use it to
define portable formatting behavior.
