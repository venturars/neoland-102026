---
page: c-api/bytearray.html
title: Byte Array Objects
area: c-api
kind: guide
---

<!-- anchor: byte-array-objects | type: section -->
# Byte Array Objects

<!-- anchor: c.PyByteArrayObject | type: c type -->
## `type PyByteArrayObject`

This subtype of `PyObject` represents a Python bytearray object.

**CPython implementation detail:** The internal buffer of `PyByteArrayObject` always includes an extra trailing null byte for compatibility with null terminated C strings. This extra byte is not counted in `PyByteArray_Size()` nor in the *len* arguments of the functions below.

<!-- anchor: c.PyByteArray_Type | type: c var -->
## `PyTypeObject PyByteArray_Type`

*Part of the Stable ABI.*

This instance of `PyTypeObject` represents the Python bytearray type; it is the same object as `bytearray` in the Python layer.

<!-- anchor: type-check-macros | type: section -->
## Type check macros

<!-- anchor: c.PyByteArray_Check | type: c function -->
### `int PyByteArray_Check(PyObject *o)`

Return true if the object *o* is a bytearray object or an instance of a subtype of the bytearray type. This function always succeeds.

<!-- anchor: c.PyByteArray_CheckExact | type: c function -->
### `int PyByteArray_CheckExact(PyObject *o)`

Return true if the object *o* is a bytearray object, but not an instance of a subtype of the bytearray type. This function always succeeds.

<!-- anchor: direct-api-functions | type: section -->
## Direct API functions

<!-- anchor: c.PyByteArray_FromObject | type: c function -->
### `PyObject *PyByteArray_FromObject(PyObject *o)`

*Return value: New reference.**Part of the Stable ABI.**Thread safety: Safe for concurrent use on the same object.*

Return a new bytearray object from any object, *o*, that implements the buffer protocol.

On failure, return `NULL` with an exception set.

**Note:**

If the object implements the buffer protocol, then the buffer must not be mutated while the bytearray object is being created.

<!-- anchor: c.PyByteArray_FromStringAndSize | type: c function -->
### `PyObject *PyByteArray_FromStringAndSize(const char *string, Py_ssize_t len)`

*Return value: New reference.**Part of the Stable ABI.**Thread safety: Atomic.*

Create a new bytearray object from *string* and its length, *len*.

On failure, return `NULL` with an exception set.

<!-- anchor: c.PyByteArray_Concat | type: c function -->
### `PyObject *PyByteArray_Concat(PyObject *a, PyObject *b)`

*Return value: New reference.**Part of the Stable ABI.**Thread safety: Safe for concurrent use on the same object.*

Concat bytearrays *a* and *b* and return a new bytearray with the result.

On failure, return `NULL` with an exception set.

**Note:**

If the object implements the buffer protocol, then the buffer must not be mutated while the bytearray object is being created.

<!-- anchor: c.PyByteArray_Size | type: c function -->
### `Py_ssize_t PyByteArray_Size(PyObject *bytearray)`

*Part of the Stable ABI.**Thread safety: Atomic.*

Return the size of *bytearray* after checking for a `NULL` pointer.

<!-- anchor: c.PyByteArray_AsString | type: c function -->
### `char *PyByteArray_AsString(PyObject *bytearray)`

*Part of the Stable ABI.**Thread safety: Safe to call from multiple threads with external synchronization only.*

Return the contents of *bytearray* as a char array after checking for a `NULL` pointer. The returned array always has an extra null byte appended.

**Note:**

It is not thread-safe to mutate the bytearray object while using the returned char array.

<!-- anchor: c.PyByteArray_Resize | type: c function -->
### `int PyByteArray_Resize(PyObject *bytearray, Py_ssize_t len)`

*Part of the Stable ABI.*

Resize the internal buffer of *bytearray* to *len*. Failure is a `-1` return with an exception set.

Changed in version 3.14: A negative *len* will now result in an exception being set and -1 returned.

<!-- anchor: macros | type: section -->
## Macros

These macros trade safety for speed and they don’t check pointers.

<!-- anchor: c.PyByteArray_AS_STRING | type: c function -->
### `char *PyByteArray_AS_STRING(PyObject *bytearray)`

*Thread safety: Safe to call from multiple threads with external synchronization only.*

Similar to `PyByteArray_AsString()`, but without error checking.

**Note:**

It is not thread-safe to mutate the bytearray object while using the returned char array.

<!-- anchor: c.PyByteArray_GET_SIZE | type: c function -->
### `Py_ssize_t PyByteArray_GET_SIZE(PyObject *bytearray)`

*Thread safety: Atomic.*

Similar to `PyByteArray_Size()`, but without error checking.
