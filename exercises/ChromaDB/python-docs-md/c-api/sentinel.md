---
page: c-api/sentinel.html
title: Sentinel objects
area: c-api
kind: guide
---

<!-- anchor: sentinel-objects | type: section -->
# Sentinel objects

<!-- anchor: c.PySentinel_Type | type: c var -->
## `PyTypeObject PySentinel_Type`

This instance of `PyTypeObject` represents the Python `sentinel` type. This is the same object as `sentinel`.

Added in version 3.15.

<!-- anchor: c.PySentinel_Check | type: c function -->
## `int PySentinel_Check(PyObject *o)`

Return true if *o* is a `sentinel` object or a subtype. The `sentinel` type does not currently allow subclasses, so this check is exact. Future Python versions may choose to allow subtyping. This function always succeeds.

Added in version 3.15.

<!-- anchor: c.PySentinel_CheckExact | type: c function -->
## `int PySentinel_CheckExact(PyObject *o)`

Return true if *o* is a `sentinel` object, but not a subtype. The `sentinel` type does not currently allow subclasses. Future Python versions may choose to allow subtyping. This function always succeeds.

Added in version 3.15.

<!-- anchor: c.PySentinel_New | type: c function -->
## `PyObject *PySentinel_New(const char *name, const char *module_name, const char *repr)`

*Return value: New reference.*

Return a new `sentinel` object with `__name__` set to *name* and `__module__` set to *module_name*. *name* must not be `NULL`. If *module_name* is `NULL`, `__module__` is set to `None`. If *repr* is `NULL`, `repr()` returns `__name__`. Return `NULL` with an exception set on failure.

For pickling to work, *module_name* must be the name of an importable module, and the sentinel must be accessible from that module under a path matching *name*. Pickle treats *name* as a global variable name in *module_name* (see `object.__reduce__()`).

Added in version 3.15.
