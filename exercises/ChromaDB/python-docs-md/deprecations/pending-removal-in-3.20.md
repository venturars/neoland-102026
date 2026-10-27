---
page: deprecations/pending-removal-in-3.20.html
title: Pending removal in Python 3.20
area: deprecations
kind: deprecation
removal_version: 3.20
---

<!-- anchor: pending-removal-in-python-3-20 | type: section -->
# Pending removal in Python 3.20

- Calling the `__new__()` method of `struct.Struct` without the *format* argument is deprecated and will be removed in Python 3.20. Calling `__init__()` method on initialized `Struct` objects is deprecated and will be removed in Python 3.20.

  (Contributed by Sergey B Kirpichev and Serhiy Storchaka in gh-143715.)

- The `__version__`, `version` and `VERSION` attributes have been deprecated in these standard library modules and will be removed in Python 3.20. Use `sys.version_info` instead.

  - `argparse`

  - `csv`

  - `ctypes`

  - `ctypes.macholib`

  - `decimal` (use `decimal.SPEC_VERSION` instead)

  - `http.server`

  - `imaplib`

  - `ipaddress`

  - `json`

  - `logging` (`__date__` also deprecated)

  - `optparse`

  - `pickle`

  - `platform`

  - `re`

  - `socketserver`

  - `tabnanny`

  - `tarfile`

  - `tkinter.font`

  - `tkinter.ttk`

  - `wsgiref.simple_server`

  - `xml.etree.ElementTree`

  - `xml.sax.expatreader`

  - `xml.sax.handler`

  - `zlib`

  (Contributed by Hugo van Kemenade and Stan Ulbrych in gh-76007.)

- Deprecations defined by **PEP 829**:

  - Warnings are produced for `import` lines found in `name.pth` files.

  - `name.pth` files are no longer decoded in the locale encoding by default. They **MUST** be encoded in `utf-8-sig`.

  (Contributed by Barry Warsaw in gh-148641.)

- `ast`:

  - Creating instances of abstract AST nodes (such as `ast.AST` or `ast.expr`) is deprecated and will raise an error in Python 3.20.

- `typing`:

  - It is deprecated to call `isinstance()` and `issubclass()` checks on protocol classes that were not explicitly decorated with `runtime_checkable()` but that inherit from a runtime-checkable protocol class. This will raise a `TypeError` in Python 3.20.

    (Contributed by Bartosz Sławecki in gh-132604.)
