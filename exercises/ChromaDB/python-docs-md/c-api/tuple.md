---
page: c-api/tuple.html
title: Tuple Objects
area: c-api
kind: guide
---

<!-- anchor: tuple-objects | type: section -->
# Tuple Objects

<!-- anchor: c.PyTupleObject | type: c type -->
## `type PyTupleObject`

This subtype of `PyObject` represents a Python tuple object.

<!-- anchor: c.PyTuple_Type | type: c var -->
## `PyTypeObject PyTuple_Type`

*Part of the Stable ABI.*

This instance of `PyTypeObject` represents the Python tuple type; it is the same object as `tuple` in the Python layer.

<!-- anchor: c.PyTuple_Check | type: c function -->
## `int PyTuple_Check(PyObject *p)`

Return true if *p* is a tuple object or an instance of a subtype of the tuple type. This function always succeeds.

<!-- anchor: c.PyTuple_CheckExact | type: c function -->
## `int PyTuple_CheckExact(PyObject *p)`

Return true if *p* is a tuple object, but not an instance of a subtype of the tuple type. This function always succeeds.

<!-- anchor: c.PyTuple_New | type: c function -->
## `PyObject *PyTuple_New(Py_ssize_t len)`

*Return value: New reference.**Part of the Stable ABI.**Thread safety: Atomic.*

Return a new tuple object of size *len*, or `NULL` with an exception set on failure.

<!-- anchor: c.PyTuple_FromArray | type: c function -->
## `PyObject *PyTuple_FromArray(PyObject *const *array, Py_ssize_t size)`

*Thread safety: Atomic.*

Create a tuple of *size* items and copy references from *array* to the new tuple.

*array* can be NULL if *size* is `0`.

On success, return a new reference. On error, set an exception and return `NULL`.

Added in version 3.15.

<!-- anchor: c.PyTuple_Pack | type: c function -->
## `PyObject *PyTuple_Pack(Py_ssize_t n, ...)`

*Return value: New reference.**Part of the Stable ABI.**Thread safety: Atomic.*

Return a new tuple object of size *n*, or `NULL` with an exception set on failure. The tuple values are initialized to the subsequent *n* C arguments pointing to Python objects. `PyTuple_Pack(2, a, b)` is equivalent to `Py_BuildValue("(OO)", a, b)`.

<!-- anchor: c.PyTuple_Size | type: c function -->
## `Py_ssize_t PyTuple_Size(PyObject *p)`

*Part of the Stable ABI.**Thread safety: Atomic.*

Take a pointer to a tuple object, and return the size of that tuple. On error, return `-1` with an exception set.

<!-- anchor: c.PyTuple_GET_SIZE | type: c function -->
## `Py_ssize_t PyTuple_GET_SIZE(PyObject *p)`

*Thread safety: Atomic.*

Like `PyTuple_Size()`, but without error checking.

<!-- anchor: c.PyTuple_GetItem | type: c function -->
## `PyObject *PyTuple_GetItem(PyObject *p, Py_ssize_t pos)`

*Return value: Borrowed reference.**Part of the Stable ABI.**Thread safety: Safe to call from multiple threads with external synchronization only.*

Return the object at position *pos* in the tuple pointed to by *p*. If *pos* is negative or out of bounds, return `NULL` and set an `IndexError` exception.

The returned reference is borrowed from the tuple *p* (that is: it is only valid as long as you hold a reference to *p*). To get a strong reference, use `Py_NewRef(PyTuple_GetItem(...))` or `PySequence_GetItem()`.

<!-- anchor: c.PyTuple_GET_ITEM | type: c function -->
## `PyObject *PyTuple_GET_ITEM(PyObject *p, Py_ssize_t pos)`

*Return value: Borrowed reference.**Thread safety: Safe to call from multiple threads with external synchronization only.*

Like `PyTuple_GetItem()`, but does no checking of its arguments.

<!-- anchor: c.PyTuple_GetSlice | type: c function -->
## `PyObject *PyTuple_GetSlice(PyObject *p, Py_ssize_t low, Py_ssize_t high)`

*Return value: New reference.**Part of the Stable ABI.**Thread safety: Atomic.*

Return the slice of the tuple pointed to by *p* between *low* and *high*, or `NULL` with an exception set on failure.

This is the equivalent of the Python expression `p[low:high]`. Indexing from the end of the tuple is not supported.

<!-- anchor: c.PyTuple_SetItem | type: c function -->
## `int PyTuple_SetItem(PyObject *p, Py_ssize_t pos, PyObject *o)`

*Part of the Stable ABI.**Thread safety: Safe to call from multiple threads with external synchronization only.*

Insert a reference to object *o* at position *pos* of the tuple pointed to by *p*. Return `0` on success. If *pos* is out of bounds, return `-1` and set an `IndexError` exception. This function should only be used to fill in brand new tuples; using it on an existing tuple is thread-unsafe.

**Note:**

This function “steals” a reference to *o* and discards a reference to an item already in the tuple at the affected position (unless it was NULL).

<!-- anchor: c.PyTuple_SET_ITEM | type: c function -->
## `void PyTuple_SET_ITEM(PyObject *p, Py_ssize_t pos, PyObject *o)`

*Thread safety: Safe to call from multiple threads with external synchronization only.*

Like `PyTuple_SetItem()`, but does no error checking, and should *only* be used to fill in brand new tuples, using it on an existing tuple is thread-unsafe.

Bounds checking is performed as an assertion if Python is built in debug mode or `with assertions`.

**Note:**

This function “steals” a reference to *o*, and, unlike `PyTuple_SetItem()`, does *not* discard a reference to any item that is being replaced; any reference in the tuple at position *pos* will be leaked.

**Warning:**

This macro should *only* be used on tuples that are newly created. Using this macro on a tuple that is already in use (or in other words, has a refcount > 1) could lead to undefined behavior.

<!-- anchor: c._PyTuple_Resize | type: c function -->
## `int _PyTuple_Resize(PyObject **p, Py_ssize_t newsize)`

*Thread safety: Safe to call from multiple threads with external synchronization only.*

Can be used to resize a tuple. *newsize* will be the new length of the tuple. Because tuples are *supposed* to be immutable, this should only be used if there is only one reference to the object. Do *not* use this if the tuple may already be known to some other part of the code. The tuple will always grow or shrink at the end. Think of this as destroying the old tuple and creating a new one, only more efficiently. Returns `0` on success. Client code should never assume that the resulting value of `*p` will be the same as before calling this function. If the object referenced by `*p` is replaced, the original `*p` is destroyed. On failure, returns `-1` and sets `*p` to `NULL`, and raises `MemoryError` or `SystemError`.

<!-- anchor: struct-sequence-objects | type: section -->
# Struct Sequence Objects

A struct sequence object is a named tuple, that is, a sequence whose items can also be accessed through attributes. It is similar to `collections.namedtuple()`, but provides a slightly different interface.

To create a struct sequence, you first have to create a specific struct sequence type.

<!-- anchor: c.PyStructSequence_NewType | type: c function -->
## `PyTypeObject *PyStructSequence_NewType(PyStructSequence_Desc *desc)`

*Return value: New reference.**Part of the Stable ABI.**Thread safety: Atomic.*

Create a new struct sequence type from the data in *desc*, described below. Instances of the resulting type can be created with `PyStructSequence_New()`.

Return `NULL` with an exception set on failure.

<!-- anchor: c.PyStructSequence_InitType | type: c function -->
## `void PyStructSequence_InitType(PyTypeObject *type, PyStructSequence_Desc *desc)`

*Thread safety: Safe to call without external synchronization on distinct objects.*

Initializes a struct sequence type *type* from *desc* in place.

<!-- anchor: c.PyStructSequence_InitType2 | type: c function -->
## `int PyStructSequence_InitType2(PyTypeObject *type, PyStructSequence_Desc *desc)`

*Thread safety: Safe to call without external synchronization on distinct objects.*

Like `PyStructSequence_InitType()`, but returns `0` on success and `-1` with an exception set on failure.

Added in version 3.4.

<!-- anchor: c.PyStructSequence_Desc | type: c type -->
## `type PyStructSequence_Desc`

*Part of the Stable ABI (including all members).*

Contains the meta information of a struct sequence type to create.

<!-- anchor: c.PyStructSequence_Desc.name | type: c member -->
### `const char *name`

Fully qualified name of the type; null-terminated UTF-8 encoded. The name must contain the module name.

<!-- anchor: c.PyStructSequence_Desc.doc | type: c member -->
### `const char *doc`

Pointer to docstring for the type or `NULL` to omit.

<!-- anchor: c.PyStructSequence_Desc.fields | type: c member -->
### `PyStructSequence_Field *fields`

Pointer to `NULL`-terminated array with field names of the new type.

<!-- anchor: c.PyStructSequence_Desc.n_in_sequence | type: c member -->
### `int n_in_sequence`

Number of fields visible to the Python side (if used as tuple).

<!-- anchor: c.PyStructSequence_Field | type: c type -->
## `type PyStructSequence_Field`

*Part of the Stable ABI (including all members).*

Describes a field of a struct sequence. As a struct sequence is modeled as a tuple, all fields are typed as PyObject*. The index in the `fields` array of the `PyStructSequence_Desc` determines which field of the struct sequence is described.

<!-- anchor: c.PyStructSequence_Field.name | type: c member -->
### `const char *name`

Name for the field or `NULL` to end the list of named fields, set to `PyStructSequence_UnnamedField` to leave unnamed.

<!-- anchor: c.PyStructSequence_Field.doc | type: c member -->
### `const char *doc`

Field docstring or `NULL` to omit.

<!-- anchor: c.PyStructSequence_UnnamedField | type: c var -->
## `const char *const PyStructSequence_UnnamedField`

*Part of the Stable ABI since version 3.11.*

Special value for a field name to leave it unnamed.

Changed in version 3.9: The type was changed from `char *`.

<!-- anchor: c.PyStructSequence_New | type: c function -->
## `PyObject *PyStructSequence_New(PyTypeObject *type)`

*Return value: New reference.**Part of the Stable ABI.**Thread safety: Atomic.*

Creates an instance of *type*, which must have been created with `PyStructSequence_NewType()`.

Return `NULL` with an exception set on failure.

<!-- anchor: c.PyStructSequence_GetItem | type: c function -->
## `PyObject *PyStructSequence_GetItem(PyObject *p, Py_ssize_t pos)`

*Return value: Borrowed reference.**Part of the Stable ABI.**Thread safety: Safe to call from multiple threads with external synchronization only.*

Return the object at position *pos* in the struct sequence pointed to by *p*. The returned reference is borrowed from the struct sequence *p* (that is: it is only valid as long as you hold a reference to *p*).

Bounds checking is performed as an assertion if Python is built in debug mode or `with assertions`.

<!-- anchor: c.PyStructSequence_GET_ITEM | type: c function -->
## `PyObject *PyStructSequence_GET_ITEM(PyObject *p, Py_ssize_t pos)`

*Return value: Borrowed reference.**Thread safety: Safe to call from multiple threads with external synchronization only.*

Alias to `PyStructSequence_GetItem()`.

Changed in version 3.13: Now implemented as an alias to `PyStructSequence_GetItem()`.

<!-- anchor: c.PyStructSequence_SetItem | type: c function -->
## `void PyStructSequence_SetItem(PyObject *p, Py_ssize_t pos, PyObject *o)`

*Part of the Stable ABI.**Thread safety: Safe to call from multiple threads with external synchronization only.*

Sets the field at index *pos* of the struct sequence *p* to value *o*. Like `PyTuple_SET_ITEM()`, this should only be used to fill in brand new instances.

Bounds checking is performed as an assertion if Python is built in debug mode or `with assertions`.

**Note:**

This function “steals” a reference to *o*.

<!-- anchor: c.PyStructSequence_SET_ITEM | type: c function -->
## `void PyStructSequence_SET_ITEM(PyObject *p, Py_ssize_t *pos, PyObject *o)`

*Thread safety: Safe to call from multiple threads with external synchronization only.*

Alias to `PyStructSequence_SetItem()`.

Changed in version 3.13: Now implemented as an alias to `PyStructSequence_SetItem()`.
