---
page: c-api/bytes.html
title: Bytes Objects
area: c-api
kind: guide
---

<!-- anchor: bytes-objects | type: section -->
# Bytes Objects

These functions raise `TypeError` when expecting a bytes parameter and called with a non-bytes parameter.

**CPython implementation detail:** The internal buffer of `PyBytesObject` always includes an extra trailing null byte for compatibility with null terminated C strings. This extra byte is not counted in `PyBytes_Size()` nor in the various *length* and *size* arguments of the functions below.

<!-- anchor: c.PyBytesObject | type: c type -->
## `type PyBytesObject`

This subtype of `PyObject` represents a Python bytes object.

<!-- anchor: c.PyBytes_Type | type: c var -->
## `PyTypeObject PyBytes_Type`

*Part of the Stable ABI.*

This instance of `PyTypeObject` represents the Python bytes type; it is the same object as `bytes` in the Python layer.

<!-- anchor: c.PyBytes_Check | type: c function -->
## `int PyBytes_Check(PyObject *o)`

Return true if the object *o* is a bytes object or an instance of a subtype of the bytes type. This function always succeeds.

<!-- anchor: c.PyBytes_CheckExact | type: c function -->
## `int PyBytes_CheckExact(PyObject *o)`

Return true if the object *o* is a bytes object, but not an instance of a subtype of the bytes type. This function always succeeds.

<!-- anchor: c.PyBytes_FromString | type: c function -->
## `PyObject *PyBytes_FromString(const char *v)`

*Return value: New reference.**Part of the Stable ABI.**Thread safety: Atomic.*

Return a new bytes object with a copy of the string *v* as value on success, and `NULL` on failure. The parameter *v* must not be `NULL`; it will not be checked.

<!-- anchor: c.PyBytes_FromStringAndSize | type: c function -->
## `PyObject *PyBytes_FromStringAndSize(const char *v, Py_ssize_t len)`

*Return value: New reference.**Part of the Stable ABI.**Thread safety: Atomic.*

Return a new bytes object with a copy of the string *v* as value and length *len* on success, and `NULL` on failure. If *v* is `NULL`, the contents of the bytes object are uninitialized.

Soft deprecated since version 3.15: Use the `PyBytesWriter` API instead of `PyBytes_FromStringAndSize(NULL, len)`.

<!-- anchor: c.PyBytes_FromFormat | type: c function -->
## `PyObject *PyBytes_FromFormat(const char *format, ...)`

*Return value: New reference.**Part of the Stable ABI.**Thread safety: Atomic.*

Take a C `printf()`-style *format* string and a variable number of arguments, calculate the size of the resulting Python bytes object and return a bytes object with the values formatted into it. The variable arguments must be C types and must correspond exactly to the format characters in the *format* string. The following format characters are allowed:

| Format Characters | Type | Comment |
| --- | --- | --- |
| `%%` | *n/a* | The literal % character. |
| `%c` | int | A single byte, represented as a C int. |
| `%d` | int | Equivalent to `printf("%d")`. [1] |
| `%u` | unsigned int | Equivalent to `printf("%u")`. [1] |
| `%ld` | long | Equivalent to `printf("%ld")`. [1] |
| `%lu` | unsigned long | Equivalent to `printf("%lu")`. [1] |
| `%zd` | `Py_ssize_t` | Equivalent to `printf("%zd")`. [1] |
| `%zu` | size_t | Equivalent to `printf("%zu")`. [1] |
| `%i` | int | Equivalent to `printf("%i")`. [1] |
| `%x` | int | Equivalent to `printf("%x")`. [1] |
| `%s` | const char* | A null-terminated C character array. |
| `%p` | const void* | The hex representation of a C pointer. Mostly equivalent to `printf("%p")` except that it is guaranteed to start with the literal `0x` regardless of what the platform’s `printf` yields. |

An unrecognized format character causes all the rest of the format string to be copied as-is to the result object, and any extra arguments discarded.

[1] (1,2,3,4,5,6,7,8)

For integer specifiers (d, u, ld, lu, zd, zu, i, x): the 0-conversion flag has effect even when a precision is given.

<!-- anchor: c.PyBytes_FromFormatV | type: c function -->
## `PyObject *PyBytes_FromFormatV(const char *format, va_list vargs)`

*Return value: New reference.**Part of the Stable ABI.**Thread safety: Atomic.*

Identical to `PyBytes_FromFormat()` except that it takes exactly two arguments.

<!-- anchor: c.PyBytes_FromObject | type: c function -->
## `PyObject *PyBytes_FromObject(PyObject *o)`

*Return value: New reference.**Part of the Stable ABI.**Thread safety: Safe for concurrent use on the same object.*

Return the bytes representation of object *o* that implements the buffer protocol.

**Note:**

If the object implements the buffer protocol, then the buffer must not be mutated while the bytes object is being created.

<!-- anchor: c.PyBytes_Size | type: c function -->
## `Py_ssize_t PyBytes_Size(PyObject *o)`

*Part of the Stable ABI.**Thread safety: Atomic.*

Return the length of the bytes in bytes object *o*.

<!-- anchor: c.PyBytes_GET_SIZE | type: c function -->
## `Py_ssize_t PyBytes_GET_SIZE(PyObject *o)`

*Thread safety: Atomic.*

Similar to `PyBytes_Size()`, but without error checking.

<!-- anchor: c.PyBytes_AsString | type: c function -->
## `char *PyBytes_AsString(PyObject *o)`

*Part of the Stable ABI.**Thread safety: Safe to call from multiple threads with external synchronization only.*

Return a pointer to the contents of *o*. The pointer refers to the internal buffer of *o*, which consists of `len(o) + 1` bytes. The last byte in the buffer is always null, regardless of whether there are any other null bytes. The data must not be modified in any way, unless the object was just created using `PyBytes_FromStringAndSize(NULL, size)`. It must not be deallocated. If *o* is not a bytes object at all, `PyBytes_AsString()` returns `NULL` and raises `TypeError`.

<!-- anchor: c.PyBytes_AS_STRING | type: c function -->
## `char *PyBytes_AS_STRING(PyObject *string)`

*Thread safety: Safe to call from multiple threads with external synchronization only.*

Similar to `PyBytes_AsString()`, but without error checking.

<!-- anchor: c.PyBytes_AsStringAndSize | type: c function -->
## `int PyBytes_AsStringAndSize(PyObject *obj, char **buffer, Py_ssize_t *length)`

*Part of the Stable ABI.**Thread safety: Safe to call from multiple threads with external synchronization only.*

Return the null-terminated contents of the object *obj* through the output variables *buffer* and *length*. Returns `0` on success.

If *length* is `NULL`, the bytes object may not contain embedded null bytes; if it does, the function returns `-1` and a `ValueError` is raised.

The buffer refers to an internal buffer of *obj*, which includes an additional null byte at the end (not counted in *length*). The data must not be modified in any way, unless the object was just created using `PyBytes_FromStringAndSize(NULL, size)`. It must not be deallocated. If *obj* is not a bytes object at all, `PyBytes_AsStringAndSize()` returns `-1` and raises `TypeError`.

Changed in version 3.5: Previously, `TypeError` was raised when embedded null bytes were encountered in the bytes object.

<!-- anchor: c.PyBytes_Concat | type: c function -->
## `void PyBytes_Concat(PyObject **bytes, PyObject *newpart)`

*Part of the Stable ABI.**Thread safety: Safe for concurrent use on the same object.*

Create a new bytes object in **bytes* containing the contents of *newpart* appended to *bytes*; the caller will own the new reference. The reference to the old value of *bytes* will be “stolen”. If the new object cannot be created, the old reference to *bytes* will still be “stolen”, the value of **bytes* will be set to `NULL`, and the appropriate exception will be set.

**Note:**

If *newpart* implements the buffer protocol, then the buffer must not be mutated while the new bytes object is being created.

<!-- anchor: c.PyBytes_ConcatAndDel | type: c function -->
## `void PyBytes_ConcatAndDel(PyObject **bytes, PyObject *newpart)`

*Part of the Stable ABI.**Thread safety: Safe for concurrent use on the same object.*

Create a new bytes object in **bytes* containing the contents of *newpart* appended to *bytes*. This version releases the strong reference to *newpart* (i.e. decrements its reference count).

**Note:**

If *newpart* implements the buffer protocol, then the buffer must not be mutated while the new bytes object is being created.

<!-- anchor: c.PyBytes_Join | type: c function -->
## `PyObject *PyBytes_Join(PyObject *sep, PyObject *iterable)`

*Thread safety: Safe for concurrent use on the same object.*

Similar to `sep.join(iterable)` in Python.

*sep* must be Python `bytes` object. (Note that `PyUnicode_Join()` accepts `NULL` separator and treats it as a space, whereas `PyBytes_Join()` doesn’t accept `NULL` separator.)

*iterable* must be an iterable object yielding objects that implement the buffer protocol.

On success, return a new `bytes` object. On error, set an exception and return `NULL`.

Added in version 3.14.

**Note:**

If *iterable* objects implement the buffer protocol, then the buffers must not be mutated while the new bytes object is being created.

<!-- anchor: c._PyBytes_Resize | type: c function -->
## `int _PyBytes_Resize(PyObject **bytes, Py_ssize_t newsize)`

*Thread safety: Safe to call without external synchronization on distinct objects.*

Resize a bytes object. *newsize* will be the new length of the bytes object. You can think of it as creating a new bytes object and destroying the old one, only more efficiently. Pass the address of an existing bytes object as an lvalue (it may be written into), and the new size desired. On success, **bytes* holds the resized bytes object and `0` is returned; the address in **bytes* may differ from its input value. If the reallocation fails, the original bytes object at **bytes* is deallocated, **bytes* is set to `NULL`, `MemoryError` is set, and `-1` is returned.

Soft deprecated since version 3.15: Use the `PyBytesWriter` API instead.

<!-- anchor: c.PyBytes_Repr | type: c function -->
## `PyObject *PyBytes_Repr(PyObject *bytes, int smartquotes)`

*Part of the Stable ABI.**Thread safety: Atomic.*

Get the string representation of *bytes*. This function is currently used to implement `bytes.__repr__()` in Python.

This function does not do type checking; it is undefined behavior to pass *bytes* as a non-bytes object or `NULL`.

If *smartquotes* is true, the representation will use a double-quoted string instead of single-quoted string when single-quotes are present in *bytes*. For example, the byte string `'Python'` would be represented as `b"'Python'"` when *smartquotes* is true, or `b'\'Python\''` when it is false.

On success, this function returns a strong reference to a `str` object containing the representation. On failure, this returns `NULL` with an exception set.

<!-- anchor: c.PyBytes_DecodeEscape | type: c function -->
## `PyObject *PyBytes_DecodeEscape(const char *s, Py_ssize_t len, const char *errors, Py_ssize_t unicode, const char *recode_encoding)`

*Part of the Stable ABI.**Thread safety: Atomic.*

Unescape a backslash-escaped string *s*. *s* must not be `NULL`. *len* must be the size of *s*.

*errors* must be one of `"strict"`, `"replace"`, or `"ignore"`. If *errors* is `NULL`, then `"strict"` is used by default.

On success, this function returns a strong reference to a Python `bytes` object containing the unescaped string. On failure, this function returns `NULL` with an exception set.

Changed in version 3.9: *unicode* and *recode_encoding* are now unused.

<!-- anchor: pybyteswriter | type: section -->
# PyBytesWriter

The `PyBytesWriter` API can be used to create a Python `bytes` object.

Added in version 3.15.

<!-- anchor: c.PyBytesWriter | type: c type -->
## `type PyBytesWriter`

A bytes writer instance.

The API is **not thread safe**: a writer should only be used by a single thread at the same time.

The instance must be destroyed by `PyBytesWriter_Finish()` on success, or `PyBytesWriter_Discard()` on error.

<!-- anchor: create-finish-discard | type: section -->
## Create, Finish, Discard

<!-- anchor: c.PyBytesWriter_Create | type: c function -->
### `PyBytesWriter *PyBytesWriter_Create(Py_ssize_t size)`

Create a `PyBytesWriter` to write *size* bytes.

If *size* is greater than zero, allocate *size* bytes, and set the writer size to *size*. The caller is responsible to write *size* bytes using `PyBytesWriter_GetData()`. This function does not overallocate.

On error, set an exception and return `NULL`.

*size* must be positive or zero.

<!-- anchor: c.PyBytesWriter_Finish | type: c function -->
### `PyObject *PyBytesWriter_Finish(PyBytesWriter *writer)`

Finish a `PyBytesWriter` created by `PyBytesWriter_Create()`.

On success, return a Python `bytes` object. On error, set an exception and return `NULL`.

The writer instance is invalid after the call in any case. No API can be called on the writer after `PyBytesWriter_Finish()`.

<!-- anchor: c.PyBytesWriter_FinishWithSize | type: c function -->
### `PyObject *PyBytesWriter_FinishWithSize(PyBytesWriter *writer, Py_ssize_t size)`

Similar to `PyBytesWriter_Finish()`, but resize the writer to *size* bytes before creating the `bytes` object.

<!-- anchor: c.PyBytesWriter_FinishWithPointer | type: c function -->
### `PyObject *PyBytesWriter_FinishWithPointer(PyBytesWriter *writer, void *buf)`

Similar to `PyBytesWriter_Finish()`, but resize the writer using *buf* pointer before creating the `bytes` object.

Set an exception and return `NULL` if *buf* pointer is outside the internal buffer bounds.

Function pseudo-code:

```c
Py_ssize_t size = (char*)buf - (char*)PyBytesWriter_GetData(writer);
return PyBytesWriter_FinishWithSize(writer, size);
```

<!-- anchor: c.PyBytesWriter_Discard | type: c function -->
### `void PyBytesWriter_Discard(PyBytesWriter *writer)`

Discard a `PyBytesWriter` created by `PyBytesWriter_Create()`.

Do nothing if *writer* is `NULL`.

The writer instance is invalid after the call. No API can be called on the writer after `PyBytesWriter_Discard()`.

<!-- anchor: high-level-api | type: section -->
## High-level API

<!-- anchor: c.PyBytesWriter_WriteBytes | type: c function -->
### `int PyBytesWriter_WriteBytes(PyBytesWriter *writer, const void *bytes, Py_ssize_t size)`

Grow the *writer* internal buffer by *size* bytes, write *size* bytes of *bytes* at the *writer* end, and add *size* to the *writer* size.

If *size* is equal to `-1`, call `strlen(bytes)` to get the string length.

On success, return `0`. On error, set an exception and return `-1`.

<!-- anchor: c.PyBytesWriter_Format | type: c function -->
### `int PyBytesWriter_Format(PyBytesWriter *writer, const char *format, ...)`

Similar to `PyBytes_FromFormat()`, but write the output directly at the writer end. Grow the writer internal buffer on demand. Then add the written size to the writer size.

On success, return `0`. On error, set an exception and return `-1`.

<!-- anchor: getters | type: section -->
## Getters

<!-- anchor: c.PyBytesWriter_GetSize | type: c function -->
### `Py_ssize_t PyBytesWriter_GetSize(PyBytesWriter *writer)`

Get the writer size.

The function does not invalidate pointers returned by `PyBytesWriter_GetData()`.

The function cannot fail.

<!-- anchor: c.PyBytesWriter_GetData | type: c function -->
### `void *PyBytesWriter_GetData(PyBytesWriter *writer)`

Get the writer data: start of the internal buffer.

The pointer remains valid until a `PyBytesWriter` function other than `PyBytesWriter_GetData()` or `PyBytesWriter_GetSize()` is called on *writer*.

The function cannot fail.

<!-- anchor: low-level-api | type: section -->
## Low-level API

<!-- anchor: c.PyBytesWriter_Resize | type: c function -->
### `int PyBytesWriter_Resize(PyBytesWriter *writer, Py_ssize_t size)`

Resize the writer to *size* bytes. It can be used to enlarge or to shrink the writer. This function typically overallocates to achieve amortized performance when resizing multiple times.

Newly allocated bytes are left uninitialized.

On success, return `0`. On error, set an exception and return `-1`.

*size* must be positive or zero.

<!-- anchor: c.PyBytesWriter_Grow | type: c function -->
### `int PyBytesWriter_Grow(PyBytesWriter *writer, Py_ssize_t grow)`

Resize the writer by adding *grow* bytes to the current writer size. This function typically overallocates to achieve amortized performance when resizing multiple times.

Newly allocated bytes are left uninitialized.

On success, return `0`. On error, set an exception and return `-1`.

*size* can be negative to shrink the writer.

<!-- anchor: c.PyBytesWriter_GrowAndUpdatePointer | type: c function -->
### `void *PyBytesWriter_GrowAndUpdatePointer(PyBytesWriter *writer, Py_ssize_t size, void *buf)`

Similar to `PyBytesWriter_Grow()`, but update also the *buf* pointer.

The *buf* pointer is moved if the internal buffer is moved in memory. The *buf* relative position within the internal buffer is left unchanged.

On error, set an exception and return `NULL`.

*buf* must not be `NULL`.

Function pseudo-code:

```c
Py_ssize_t pos = (char*)buf - (char*)PyBytesWriter_GetData(writer);
if (PyBytesWriter_Grow(writer, size) < 0) {
    return NULL;
}
return (char*)PyBytesWriter_GetData(writer) + pos;
```

<!-- anchor: example-creating-the-string-b-abc | type: section -->
## Example creating the string `b'abc'`

Example creating the bytes string `b"abc"`, with a fixed size of 3 bytes:

```c
PyObject* create_abc(void)
{
    PyBytesWriter *writer = PyBytesWriter_Create(3);
    if (writer == NULL) {
        return NULL;
    }

    char *str = PyBytesWriter_GetData(writer);
    memcpy(str, "abc", 3);
    return PyBytesWriter_Finish(writer);
}
```

Variant using a pointer to compute the final size:

```c
PyObject* create_abc_ptr(void)
{
    PyBytesWriter *writer = PyBytesWriter_Create(3);
    if (writer == NULL) {
        return NULL;
    }

    char *str = PyBytesWriter_GetData(writer);
    memcpy(str, "abc", 3);
    str += 1;
    return PyBytesWriter_FinishWithPointer(writer, str);
}
```

<!-- anchor: update-pybytes-fromstringandsize-code | type: section -->
## Update `PyBytes_FromStringAndSize()` code

Example of code using the soft deprecated `PyBytes_FromStringAndSize(NULL, size)` API:

```c
int copy_bytes(char *dest, const char *src, Py_ssize_t num_bytes)
{
    ...
}

PyObject* create_string(const char *start, Py_ssize_t num_bytes)
{
    PyObject *result = PyBytes_FromStringAndSize(NULL, num_bytes);
    if (result == NULL) {
        return NULL;
    }
    if (copy_bytes(PyBytes_AS_STRING(result), start, num_bytes) < 0) {
        Py_CLEAR(result);
    }
    return result;
}
```

It can now be updated to:

```c
PyObject* create_string(const char *start, Py_ssize_t num_bytes)
{
    PyBytesWriter *writer = PyBytesWriter_Create(num_bytes);
    if (writer == NULL) {
        return NULL;
    }
    if (copy_bytes(PyBytesWriter_GetData(writer), start, num_bytes) < 0) {
        PyBytesWriter_Discard(writer);
        return NULL;
    }
    return PyBytesWriter_Finish(writer);
}
```

<!-- anchor: update-pybytes-resize-code | type: section -->
## Update `_PyBytes_Resize()` code

Example of code using the soft deprecated `_PyBytes_Resize()` API:

```c
void create_string(Py_ssize_t size)
{
    PyObject *bytes = PyBytes_FromStringAndSize(NULL, size);
    if (bytes == NULL) {
        return NULL;
    }
    char *str = PyBytes_AS_STRING(bytes);

    // ... write data into str ...

    if (_PyBytes_Resize(&bytes, (str - PyBytes_AS_STRING(bytes)))) {
        return NULL;
    }
    return bytes;
}
```

It can now be updated to:

```c
void create_string(Py_ssize_t size)
{
    PyBytesWriter *writer = PyBytesWriter_Create(size);
    if (writer == NULL) {
        return NULL;
    }
    char *str = PyBytesWriter_GetData(writer);

    // ... write data into str ...

    return PyBytesWriter_FinishWithPointer(writer, str);
}
```
