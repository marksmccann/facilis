---
title: Mental Model
description: A short legacy overview of the foundational Facilis concepts.
---

The main concept page now lives at [Core Ideas](/facilis/core-ideas/).

Facilis treats **format** as the primary mental model.

A format is a reusable definition that can create live instances. Those
instances receive semantic operations like updates, inserts, replacements, and
deletions rather than raw browser events.

That separation lets the core focus on formatting logic while adapters handle
integration details.
