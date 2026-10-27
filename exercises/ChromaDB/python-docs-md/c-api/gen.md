---
page: c-api/gen.html
title: Generator Objects
area: c-api
kind: guide
---

<!-- anchor: generator-objects | type: section -->
# Generator Objects

Generator objects are what Python uses to implement generator iterators. They are normally created by iterating over a function that yields values, rather than explicitly calling `PyGen_New()` or `PyGen_NewWithQualName()`.

<!-- anchor: c.PyGenObject | type: c type -->
## `type PyGenObject`

The C structure used for generator objects.

<!-- anchor: c.PyGen_Type | type: c var -->
## `PyTypeObject PyGen_Type`

The type object corresponding to generator objects.

<!-- anchor: c.PyGen_Check | type: c function -->
## `int PyGen_Check(PyObject *ob)`

Return true if *ob* is a generator object; *ob* must not be `NULL`. This function always succeeds.

<!-- anchor: c.PyGen_CheckExact | type: c function -->
## `int PyGen_CheckExact(PyObject *ob)`

Return true if *ob*’s type is `PyGen_Type`; *ob* must not be `NULL`. This function always succeeds.

<!-- anchor: c.PyGen_New | type: c function -->
## `PyObject *PyGen_New(PyFrameObject *frame)`

*Return value: New reference.*

Create and return a new generator object based on the *frame* object. A reference to *frame* is “stolen” by this function (even on error). The argument must not be `NULL`.

<!-- anchor: c.PyGen_NewWithQualName | type: c function -->
## `PyObject *PyGen_NewWithQualName(PyFrameObject *frame, PyObject *name, PyObject *qualname)`

*Return value: New reference.*

Create and return a new generator object based on the *frame* object, with `__name__` and `__qualname__` set to *name* and *qualname*. A reference to *frame* is “stolen” by this function (even on error). The *frame* argument must not be `NULL`.

<!-- anchor: c.PyGen_GetCode | type: c function -->
## `PyCodeObject *PyGen_GetCode(PyGenObject *gen)`

Return a new strong reference to the code object wrapped by *gen*. This function always succeeds.

<!-- anchor: asynchronous-generator-objects | type: section -->
## Asynchronous Generator Objects

**See also:**

**PEP 525**

<!-- anchor: c.PyAsyncGen_Type | type: c var -->
### `PyTypeObject PyAsyncGen_Type`

The type object corresponding to asynchronous generator objects. This is available as `types.AsyncGeneratorType` in the Python layer.

Added in version 3.6.

<!-- anchor: c.PyAsyncGen_New | type: c function -->
### `PyObject *PyAsyncGen_New(PyFrameObject *frame, PyObject *name, PyObject *qualname)`

Create a new asynchronous generator wrapping *frame*, with `__name__` and `__qualname__` set to *name* and *qualname*. *frame* is “stolen” by this function (even on error) and must not be `NULL`.

On success, this function returns a strong reference to the new asynchronous generator. On failure, this function returns `NULL` with an exception set.

Added in version 3.6.

<!-- anchor: c.PyAsyncGen_CheckExact | type: c function -->
### `int PyAsyncGen_CheckExact(PyObject *op)`

Return true if *op* is an asynchronous generator object, false otherwise. This function always succeeds.

Added in version 3.6.

<!-- anchor: deprecated-api | type: section -->
## Deprecated API

<!-- anchor: c.PyAsyncGenASend_CheckExact | type: c macro -->
### `PyAsyncGenASend_CheckExact(op)`

This is an API that was included in Python’s C API by mistake.

It is solely here for completeness; do not use this API.

Soft deprecated since version 3.14.
