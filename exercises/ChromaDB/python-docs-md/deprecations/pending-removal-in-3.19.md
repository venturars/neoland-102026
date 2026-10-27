---
page: deprecations/pending-removal-in-3.19.html
title: Pending removal in Python 3.19
area: deprecations
kind: deprecation
removal_version: 3.19
---

<!-- anchor: pending-removal-in-python-3-19 | type: section -->
# Pending removal in Python 3.19

- `ctypes`:

  - Implicitly switching to the MSVC-compatible struct layout by setting `_pack_` but not `_layout_` on non-Windows platforms.

- `hashlib`:

  - In hash function constructors such as `new()` or the direct hash-named constructors such as `md5()` and `sha256()`, their optional initial data parameter could also be passed a keyword argument named `data=` or `string=` in various `hashlib` implementations.

    Support for the `string` keyword argument name is now deprecated and slated for removal in Python 3.19.

    Before Python 3.13, the `string` keyword parameter was not correctly supported depending on the backend implementation of hash functions. Prefer passing the initial data as a positional argument for maximum backwards compatibility.

- `http.cookies`:

  - `http.cookies.Morsel.js_output()` is deprecated and will be removed in Python 3.19.

  - `http.cookies.BaseCookie.js_output()` is deprecated and will be removed in Python 3.19.

- `imaplib`:

  - Altering `IMAP4.file` is now deprecated and slated for removal in Python 3.19. This property is now unused and changing its value does not automatically close the current file.

    Before Python 3.14, this property was used to implement the corresponding `read()` and `readline()` methods for `IMAP4` but this is no longer the case since then.
