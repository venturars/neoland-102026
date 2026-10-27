---
page: deprecations/pending-removal-in-3.18.html
title: Pending removal in Python 3.18
area: deprecations
kind: deprecation
removal_version: 3.18
---

<!-- anchor: pending-removal-in-python-3-18 | type: section -->
# Pending removal in Python 3.18

- No longer accept a boolean value when a file descriptor is expected. (Contributed by Serhiy Storchaka in gh-82626.)

- `decimal`:

  - The non-standard and undocumented `Decimal` format specifier `'N'`, which is only supported in the `decimal` module’s C implementation, has been deprecated since Python 3.13. (Contributed by Serhiy Storchaka in gh-89902.)

- Deprecations defined by **PEP 829**:

  - `import` lines in `name.pth` files are silently ignored.

  (Contributed by Barry Warsaw in gh-148641.)
