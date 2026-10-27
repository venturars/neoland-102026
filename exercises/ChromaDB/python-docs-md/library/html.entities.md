---
page: library/html.entities.html
title: html.entities — Definitions of HTML general entities
area: library
kind: guide
module: html.entities
---

<!-- anchor: module-html.entities | type: section -->
# `html.entities` — Definitions of HTML general entities

**Source code:** Lib/html/entities.py

This module defines four dictionaries, `html5`, `name2codepoint`, `codepoint2name`, and `entitydefs`.

<!-- anchor: html.entities.html5 | type: py data -->
## `html.entities.html5`

A dictionary that maps HTML5 named character references [1] to the equivalent Unicode character(s), e.g. `html5['gt;'] == '>'`. Note that the trailing semicolon is included in the name (e.g. `'gt;'`), however some of the names are accepted by the standard even without the semicolon: in this case the name is present with and without the `';'`. See also `html.unescape()`.

Added in version 3.3.

<!-- anchor: html.entities.entitydefs | type: py data -->
## `html.entities.entitydefs`

A dictionary mapping XHTML 1.0 entity definitions to their replacement text in ISO Latin-1.

<!-- anchor: html.entities.name2codepoint | type: py data -->
## `html.entities.name2codepoint`

A dictionary that maps HTML4 entity names to the Unicode code points.

<!-- anchor: html.entities.codepoint2name | type: py data -->
## `html.entities.codepoint2name`

A dictionary that maps Unicode code points to HTML4 entity names.

**Footnotes**

[1]

See https://html.spec.whatwg.org/multipage/named-characters.html#named-character-references
