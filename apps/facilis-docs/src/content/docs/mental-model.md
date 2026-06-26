---
title: Mental Model
description: The foundational concepts behind Facilis.
---

Facilis treats **format** as the primary mental model.

A format is a reusable definition that can create live instances. Those
instances receive semantic operations like updates, inserts, replacements, and
deletions rather than raw browser events.

That separation lets the core focus on formatting logic while adapters handle
integration details.
