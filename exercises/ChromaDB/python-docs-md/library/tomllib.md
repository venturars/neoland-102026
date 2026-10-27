---
page: library/tomllib.html
title: tomllib — Parse TOML files
area: library
kind: guide
module: tomllib
---

<!-- anchor: module-tomllib | type: section -->
# `tomllib` — Parse TOML files

**Source code:** Lib/tomllib

This module provides an interface for parsing TOML 1.1.0 (Tom’s Obvious Minimal Language, https://toml.io). This module does not support writing TOML.

Added in version 3.11: The module was added with support for TOML 1.0.0.

Changed in version 3.15: Added TOML 1.1.0 support. See the What’s New for details.

**Warning:**

Be cautious when parsing data from untrusted sources. A malicious TOML string may cause the decoder to consume considerable CPU and memory resources. Limiting the size of data to be parsed is recommended.

**See also:**

The Tomli-W package is a TOML writer that can be used in conjunction with this module, providing a write API familiar to users of the standard library `marshal` and `pickle` modules.

**See also:**

The TOML Kit package is a style-preserving TOML library with both read and write capability. It is a recommended replacement for this module for editing already existing TOML files.

This module defines the following functions:

<!-- anchor: tomllib.load | type: py function -->
## `tomllib.load(fp, /, *, parse_float=float)`

Read a TOML file. The first argument should be a readable and binary file object. Return a `dict`. Convert TOML types to Python using this conversion table.

*parse_float* will be called with the string of every TOML float to be decoded. By default, this is equivalent to `float(num_str)`. This can be used to use another datatype or parser for TOML floats (e.g. `decimal.Decimal`). The callable must not return a `dict` or a `list`, else a `ValueError` is raised.

A `TOMLDecodeError` will be raised on an invalid TOML document.

<!-- anchor: tomllib.loads | type: py function -->
## `tomllib.loads(s, /, *, parse_float=float)`

Load TOML from a `str` object. Return a `dict`. Convert TOML types to Python using this conversion table. The *parse_float* argument has the same meaning as in `load()`.

A `TOMLDecodeError` will be raised on an invalid TOML document.

The following exceptions are available:

<!-- anchor: tomllib.TOMLDecodeError | type: py exception -->
## `exception tomllib.TOMLDecodeError(msg, doc, pos)`

Subclass of `ValueError` with the following additional attributes:

<!-- anchor: tomllib.TOMLDecodeError.msg | type: py attribute -->
### `msg`

The unformatted error message.

<!-- anchor: tomllib.TOMLDecodeError.doc | type: py attribute -->
### `doc`

The TOML document being parsed.

<!-- anchor: tomllib.TOMLDecodeError.pos | type: py attribute -->
### `pos`

The index of *doc* where parsing failed.

<!-- anchor: tomllib.TOMLDecodeError.lineno | type: py attribute -->
### `lineno`

The line corresponding to *pos*.

<!-- anchor: tomllib.TOMLDecodeError.colno | type: py attribute -->
### `colno`

The column corresponding to *pos*.

Changed in version 3.14: Added the *msg*, *doc* and *pos* parameters. Added the `msg`, `doc`, `pos`, `lineno` and `colno` attributes.

Deprecated since version 3.14: Passing free-form positional arguments is deprecated.

<!-- anchor: examples | type: section -->
## Examples

Parsing a TOML file:

```python
import tomllib

with open("pyproject.toml", "rb") as f:
    data = tomllib.load(f)
```

Parsing a TOML string:

```python
import tomllib

toml_str = """
python-version = "3.11.0"
python-implementation = "CPython"
"""

data = tomllib.loads(toml_str)
```

<!-- anchor: conversion-table | type: section -->
## Conversion Table

| TOML | Python |
| --- | --- |
| TOML document | dict |
| string | str |
| integer | int |
| float | float (configurable with *parse_float*) |
| boolean | bool |
| offset date-time | datetime.datetime (`tzinfo` attribute set to an instance of `datetime.timezone`) |
| local date-time | datetime.datetime (`tzinfo` attribute set to `None`) |
| local date | datetime.date |
| local time | datetime.time |
| array | list |
| table | dict |
| inline table | dict |
| array of tables | list of dicts |

<!-- anchor: limits-and-interoperability-considerations | type: section -->
## Limits and interoperability considerations

`tomllib` places some limits on the documents it can handle, and it preserves details that other TOML parsers are allowed to ignore. When writing portable TOML files, only use features that are guaranteed or recommended by the standard.

The implementation details listed here may change in future versions of Python.

**Tables/dicts**

The TOML spec does not guarantee key/value pairs in TOML documents and tables to be in any specific order.

**CPython implementation detail:** `tomllib` loads dictionary entries in the order they appear in the source.

**Integers**

TOML recommends supporting integers in `range(−2**63, 2**63)`.

**CPython implementation detail:** `tomllib` uses Python’s limit on integer string conversion (4300 digits by default).

**Floats**

TOML recommends supporting at least IEEE 754 binary64 values, which means that numbers with more than 15 significant decimal digits are likely to be rounded.

**CPython implementation detail:** `tomllib` uses Python `float` by default; on many common platforms this is the recommended binary64. See `sys.float_info` for details.

**Nesting limit**

TOML 1.1.0 does not recommend a limit on how deeply arrays and tables may be nested inside one another. (A limit of 100 has been proposed for a future version of TOML.)

**CPython implementation detail:** In `tomllib`, the nesting level is mainly limited by Python’s `recursion limit`. Note that code that calls `tomllib` may contribute to the limit.
