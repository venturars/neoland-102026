---
page: deprecations/pending-removal-in-3.17.html
title: Pending removal in Python 3.17
area: deprecations
kind: deprecation
removal_version: 3.17
---

<!-- anchor: pending-removal-in-python-3-17 | type: section -->
# Pending removal in Python 3.17

- `datetime`:

  - `strptime()` calls using a format string containing `%e` (day of month) without a year. This has been deprecated since Python 3.15. (Contributed by Stan Ulbrych in gh-70647.)

- `collections.abc`:

  - `collections.abc.ByteString` is scheduled for removal in Python 3.17.

    Use `isinstance(obj, collections.abc.Buffer)` to test if `obj` implements the buffer protocol at runtime. For use in type annotations, either use `Buffer` or a union that explicitly specifies the types your code supports (e.g., `bytes | bytearray | memoryview`).

    `ByteString` was originally intended to be an abstract class that would serve as a supertype of both `bytes` and `bytearray`. However, since the ABC never had any methods, knowing that an object was an instance of `ByteString` never actually told you anything useful about the object. Other common buffer types such as `memoryview` were also never understood as subtypes of `ByteString` (either at runtime or by static type checkers).

    See **PEP 688** for more details. (Contributed by Shantanu Jain in gh-91896.)

- `encodings`:

  - Passing non-ascii *encoding* names to `encodings.normalize_encoding()` is deprecated and scheduled for removal in Python 3.17. (Contributed by Stan Ulbrych in gh-136702.)

- `profile`:

  - The `profile` module is deprecated and will be removed in Python 3.17. Use `profiling.tracing` instead, which provides a compatible API. See **PEP 799** for details. (Contributed by Pablo Galindo and László Kiss Kollár in gh-138122.)

- `webbrowser`:

  - `webbrowser.MacOSXOSAScript` is deprecated in favour of `webbrowser.MacOS`. (gh-137586)

- `typing`:

  - Before Python 3.14, old-style unions were implemented using the private class `typing._UnionGenericAlias`. This class is no longer needed for the implementation, but it has been retained for backward compatibility, with removal scheduled for Python 3.17. Users should use documented introspection helpers like `typing.get_origin()` and `typing.get_args()` instead of relying on private implementation details.

  - `typing.ByteString`, deprecated since Python 3.9, is scheduled for removal in Python 3.17.

    Use `isinstance(obj, collections.abc.Buffer)` to test if `obj` implements the buffer protocol at runtime. For use in type annotations, either use `Buffer` or a union that explicitly specifies the types your code supports (e.g., `bytes | bytearray | memoryview`).

    `ByteString` was originally intended to be an abstract class that would serve as a supertype of both `bytes` and `bytearray`. However, since the ABC never had any methods, knowing that an object was an instance of `ByteString` never actually told you anything useful about the object. Other common buffer types such as `memoryview` were also never understood as subtypes of `ByteString` (either at runtime or by static type checkers).

    See **PEP 688** for more details. (Contributed by Shantanu Jain in gh-91896.)

- `tkinter`:

  - The `tkinter.Variable` methods `trace_variable()`, `trace()` (an alias of `trace_variable()`), `trace_vdelete()` and `trace_vinfo()`, deprecated since Python 3.14, are scheduled for removal in Python 3.17. Use `trace_add()`, `trace_remove()` and `trace_info()` instead. (Contributed by Serhiy Storchaka in gh-120220.)
