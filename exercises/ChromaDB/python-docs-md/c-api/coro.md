---
page: c-api/coro.html
title: Coroutine Objects
area: c-api
kind: guide
---

<!-- anchor: coroutine-objects | type: section -->
# Coroutine Objects

Added in version 3.5.

Coroutine objects are what functions declared with an `async` keyword return.

<!-- anchor: c.PyCoroObject | type: c type -->
## `type PyCoroObject`

The C structure used for coroutine objects.

<!-- anchor: c.PyCoro_Type | type: c var -->
## `PyTypeObject PyCoro_Type`

The type object corresponding to coroutine objects.

<!-- anchor: c.PyCoro_CheckExact | type: c function -->
## `int PyCoro_CheckExact(PyObject *ob)`

Return true if *ob*’s type is `PyCoro_Type`; *ob* must not be `NULL`. This function always succeeds.

<!-- anchor: c.PyCoro_New | type: c function -->
## `PyObject *PyCoro_New(PyFrameObject *frame, PyObject *name, PyObject *qualname)`

*Return value: New reference.*

Create and return a new coroutine object based on the *frame* object, with `__name__` and `__qualname__` set to *name* and *qualname*. A reference to *frame* is stolen by this function. The *frame* argument must not be `NULL`.
