---
page: c-api/iterator.html
title: Iterator Objects
area: c-api
kind: guide
---

<!-- anchor: iterator-objects | type: section -->
# Iterator Objects

Python provides two general-purpose iterator objects. The first, a sequence iterator, works with an arbitrary sequence supporting the `__getitem__()` method. The second works with a callable object and a sentinel value, calling the callable for each item in the sequence, and ending the iteration when the sentinel value is returned.

<!-- anchor: c.PySeqIter_Type | type: c var -->
## `PyTypeObject PySeqIter_Type`

*Part of the Stable ABI.*

Type object for iterator objects returned by `PySeqIter_New()` and the one-argument form of the `iter()` built-in function for built-in sequence types.

<!-- anchor: c.PySeqIter_Check | type: c function -->
## `int PySeqIter_Check(PyObject *op)`

Return true if the type of *op* is `PySeqIter_Type`. This function always succeeds.

<!-- anchor: c.PySeqIter_New | type: c function -->
## `PyObject *PySeqIter_New(PyObject *seq)`

*Return value: New reference.**Part of the Stable ABI.*

Return an iterator that works with a general sequence object, *seq*. The iteration ends when the sequence raises `IndexError` for the subscripting operation.

<!-- anchor: c.PyCallIter_Type | type: c var -->
## `PyTypeObject PyCallIter_Type`

*Part of the Stable ABI.*

Type object for iterator objects returned by `PyCallIter_New()` and the two-argument form of the `iter()` built-in function.

<!-- anchor: c.PyCallIter_Check | type: c function -->
## `int PyCallIter_Check(PyObject *op)`

Return true if the type of *op* is `PyCallIter_Type`. This function always succeeds.

<!-- anchor: c.PyCallIter_New | type: c function -->
## `PyObject *PyCallIter_New(PyObject *callable, PyObject *sentinel)`

*Return value: New reference.**Part of the Stable ABI.*

Return a new iterator. The first parameter, *callable*, can be any Python callable object that can be called with no parameters; each call to it should return the next item in the iteration. When *callable* returns a value equal to *sentinel*, the iteration will be terminated.

<!-- anchor: range-objects | type: section -->
## Range Objects

<!-- anchor: c.PyRange_Type | type: c var -->
### `PyTypeObject PyRange_Type`

*Part of the Stable ABI.*

The type object for `range` objects.

<!-- anchor: c.PyRange_Check | type: c function -->
### `int PyRange_Check(PyObject *o)`

Return true if the object *o* is an instance of a `range` object. This function always succeeds.

<!-- anchor: builtin-iterator-types | type: section -->
## Builtin Iterator Types

These are built-in iteration types that are included in Python’s C API, but provide no additional functions. They are here for completeness.

| C type | Python type |
| --- | --- |
| `PyTypeObject PyEnum_Type` *Part of the Stable ABI.* | `enumerate` |
| `PyTypeObject PyFilter_Type` *Part of the Stable ABI.* | `filter` |
| `PyTypeObject PyMap_Type` *Part of the Stable ABI.* | `map` |
| `PyTypeObject PyReversed_Type` *Part of the Stable ABI.* | `reversed` |
| `PyTypeObject PyZip_Type` *Part of the Stable ABI.* | `zip` |

<!-- anchor: other-iterator-objects | type: section -->
## Other Iterator Objects

<!-- anchor: c.PyByteArrayIter_Type | type: c var -->
### `PyTypeObject PyByteArrayIter_Type`

*Part of the Stable ABI.*

<!-- anchor: c.PyBytesIter_Type | type: c var -->
### `PyTypeObject PyBytesIter_Type`

*Part of the Stable ABI.*

<!-- anchor: c.PyListIter_Type | type: c var -->
### `PyTypeObject PyListIter_Type`

*Part of the Stable ABI.*

<!-- anchor: c.PyListRevIter_Type | type: c var -->
### `PyTypeObject PyListRevIter_Type`

*Part of the Stable ABI.*

<!-- anchor: c.PySetIter_Type | type: c var -->
### `PyTypeObject PySetIter_Type`

*Part of the Stable ABI.*

<!-- anchor: c.PyTupleIter_Type | type: c var -->
### `PyTypeObject PyTupleIter_Type`

*Part of the Stable ABI.*

<!-- anchor: c.PyRangeIter_Type | type: c var -->
### `PyTypeObject PyRangeIter_Type`

*Part of the Stable ABI.*

<!-- anchor: c.PyLongRangeIter_Type | type: c var -->
### `PyTypeObject PyLongRangeIter_Type`

*Part of the Stable ABI.*

<!-- anchor: c.PyDictIterKey_Type | type: c var -->
### `PyTypeObject PyDictIterKey_Type`

*Part of the Stable ABI.*

<!-- anchor: c.PyDictRevIterKey_Type | type: c var -->
### `PyTypeObject PyDictRevIterKey_Type`

*Part of the Stable ABI since version 3.8.*

<!-- anchor: c.PyDictIterValue_Type | type: c var -->
### `PyTypeObject PyDictIterValue_Type`

*Part of the Stable ABI.*

<!-- anchor: c.PyDictRevIterValue_Type | type: c var -->
### `PyTypeObject PyDictRevIterValue_Type`

*Part of the Stable ABI since version 3.8.*

<!-- anchor: c.PyDictIterItem_Type | type: c var -->
### `PyTypeObject PyDictIterItem_Type`

*Part of the Stable ABI.*

<!-- anchor: c.PyDictRevIterItem_Type | type: c var -->
### `PyTypeObject PyDictRevIterItem_Type`

*Part of the Stable ABI since version 3.8.*

<!-- anchor: c.PyODictIter_Type | type: c var -->
### `PyTypeObject PyODictIter_Type`

Type objects for iterators of various built-in objects.

Do not create instances of these directly; prefer calling `PyObject_GetIter()` instead.

Note that there is no guarantee that a given built-in type uses a given iterator type. For example, iterating over `range` will use one of two iterator types depending on the size of the range. Other types may start using a similar scheme in the future, without warning.
