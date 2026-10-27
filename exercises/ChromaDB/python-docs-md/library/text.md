---
page: library/text.html
title: Text Processing Services
area: library
kind: guide
---

<!-- anchor: text-processing-services | type: section -->
# Text Processing Services

The modules described in this chapter provide a wide range of string manipulation operations and other text processing services.

The `codecs` module described under Binary Data Services is also highly relevant to text processing. In addition, see the documentation for Python’s built-in string type in Text Sequence Type — str.

- `string` — Common string operations

  - String constants

  - Custom string formatting

  - Format string syntax

    - Format specification mini-language

    - Format examples

  - Template strings ($-strings)

  - Helper functions

- `string.templatelib` — Support for template string literals

  - Template strings

  - Types

  - Helper functions

- `re` — Regular expression operations

  - Regular expression syntax

  - Module contents

    - Flags

    - Functions

    - Exceptions

  - Regular expression objects

  - Match objects

  - Regular expression examples

    - Checking for a pair

    - Simulating scanf()

    - search() vs. prefixmatch()

    - prefixmatch() vs. match()

    - Making a phonebook

    - Text munging

    - Finding all adverbs

    - Finding all adverbs and their positions

    - Raw string notation

    - Writing a tokenizer

- `difflib` — Helpers for computing deltas

  - Junk heuristic

  - The `difflib` algorithm

  - Diff generation

  - Junk definition functions

  - SequenceMatcher objects

  - Examples

    - SequenceMatcher examples

    - Differ example

    - A command-line interface to difflib

    - ndiff example

- `textwrap` — Text wrapping and filling

- `unicodedata` — Unicode Database

- `stringprep` — Internet String Preparation

- `readline` — GNU readline interface

  - Init file

  - Line buffer

  - History file

  - History list

  - Startup hooks

  - Completion

  - Example

- `rlcompleter` — Completion function for GNU readline
