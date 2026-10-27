---
page: c-api/none.html
title: The None Object
area: c-api
kind: guide
---

<!-- anchor: the-none-object | type: section -->
# The `None` Object

Note that the `PyTypeObject` for `None` is not directly exposed in the Python/C API. Since `None` is a singleton, testing for object identity (using `==` in C) is sufficient. There is no `PyNone_Check()` function for the same reason.

<!-- anchor: c.Py_None | type: c var -->
## `PyObject *Py_None`

The Python `None` object, denoting lack of value. This object has no methods and is immortal.

Changed in version 3.12: `Py_None` is immortal.

<!-- anchor: c.Py_RETURN_NONE | type: c macro -->
## `Py_RETURN_NONE`

Return `Py_None` from a function.
