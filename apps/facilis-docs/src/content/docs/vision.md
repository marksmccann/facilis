---
title: Why Facilis
description: The product direction and API philosophy behind Facilis.
---

Facilis exists because input formatting is often useful in more places than the
input component where it first appears.

The same behavior may need to work in a plain HTML input, a React component,
a test helper, or a future adapter. Facilis keeps that behavior in reusable
format definitions and leaves DOM or framework wiring to small adapter
packages.

That split keeps the public API honest:

- formats describe how values are normalized, displayed, blurred, and edited;
- adapters translate platform events into Facilis runtime calls;
- first-party formats stay reusable instead of becoming examples locked to one
  UI stack.

The goal is not to hide the complexity of user input. The goal is to put that
complexity in a place where it can be named, tested, reused, and taught.
