---
page: deprecations/pending-removal-in-3.16.html
title: Pending removal in Python 3.16
area: deprecations
kind: deprecation
removal_version: 3.16
---

<!-- anchor: pending-removal-in-python-3-16 | type: section -->
# Pending removal in Python 3.16

- The import system:

  - Setting `__loader__` on a module while failing to set `__spec__.loader` is deprecated. In Python 3.16, `__loader__` will cease to be set or taken into consideration by the import system or the standard library.

- `array`:

  - The `'u'` format code (`wchar_t`) has been deprecated in documentation since Python 3.3 and at runtime since Python 3.13. Use the `'w'` format code (`Py_UCS4`) for Unicode characters instead.

- `asyncio`:

  - `asyncio.iscoroutinefunction()` is deprecated and will be removed in Python 3.16; use `inspect.iscoroutinefunction()` instead. (Contributed by Jiahao Li and Kumar Aditya in gh-122875.)

  - `asyncio` policy system is deprecated and will be removed in Python 3.16. In particular, the following classes and functions are deprecated:

    - `asyncio.AbstractEventLoopPolicy`

    - `asyncio.DefaultEventLoopPolicy`

    - `asyncio.WindowsSelectorEventLoopPolicy`

    - `asyncio.WindowsProactorEventLoopPolicy`

    - `asyncio.get_event_loop_policy()`

    - `asyncio.set_event_loop_policy()`

    Users should use `asyncio.run()` or `asyncio.Runner` with *loop_factory* to use the desired event loop implementation.

    For example, to use `asyncio.SelectorEventLoop` on Windows:

    ```python
    import asyncio

    async def main():
        ...

    asyncio.run(main(), loop_factory=asyncio.SelectorEventLoop)
    ```

    (Contributed by Kumar Aditya in gh-127949.)

- `builtins`:

  - Bitwise inversion on boolean types, `~True` or `~False` has been deprecated since Python 3.12, as it produces surprising and unintuitive results (`-2` and `-1`). Use `not x` instead for the logical negation of a Boolean. In the rare case that you need the bitwise inversion of the underlying integer, convert to `int` explicitly (`~int(x)`).

- `functools`:

  - Calling the Python implementation of `functools.reduce()` with *function* or *sequence* as keyword arguments has been deprecated since Python 3.14.

- `logging`:

  - Support for custom logging handlers with the *strm* argument is deprecated and scheduled for removal in Python 3.16. Define handlers with the *stream* argument instead. (Contributed by Mariusz Felisiak in gh-115032.)

- `mimetypes`:

  - Valid extensions start with a ‘.’ or are empty for `mimetypes.MimeTypes.add_type()`. Undotted extensions are deprecated and will raise a `ValueError` in Python 3.16. (Contributed by Hugo van Kemenade in gh-75223.)

- `shutil`:

  - The `ExecError` exception has been deprecated since Python 3.14. It has not been used by any function in `shutil` since Python 3.4, and is now an alias of `RuntimeError`.

- `symtable`:

  - The `Class.get_methods` method has been deprecated since Python 3.14.

- `sys`:

  - The `_enablelegacywindowsfsencoding()` function has been deprecated since Python 3.13. Use the `PYTHONLEGACYWINDOWSFSENCODING` environment variable instead.

- `sysconfig`:

  - The `sysconfig.expand_makefile_vars()` function has been deprecated since Python 3.14. Use the `vars` argument of `sysconfig.get_paths()` instead.

- `tarfile`:

  - The undocumented and unused `TarFile.tarfile` attribute has been deprecated since Python 3.13.
