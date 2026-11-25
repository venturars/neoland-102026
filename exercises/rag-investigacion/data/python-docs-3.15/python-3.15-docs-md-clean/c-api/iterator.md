# Iterator Objects

Python provides two general-purpose iterator objects. The first, a sequence
iterator, works with an arbitrary sequence supporting the `__getitem__()`
method. The second works with a callable object and a sentinel value, calling
the callable for each item in the sequence, and ending the iteration when the
sentinel value is returned.

PyTypeObject PySeqIter\_Type
:   *Part of the Stable ABI.*

    Type object for iterator objects returned by `PySeqIter_New()` and the
    one-argument form of the `iter()` built-in function for built-in sequence
    types.

int PySeqIter\_Check(PyObject \*op)
:   Return true if the type of *op* is `PySeqIter_Type`. This function
    always succeeds.

PyObject \*PySeqIter\_New(PyObject \*seq)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return an iterator that works with a general sequence object, *seq*. The
    iteration ends when the sequence raises `IndexError` for the subscripting
    operation.

PyTypeObject PyCallIter\_Type
:   *Part of the Stable ABI.*

    Type object for iterator objects returned by `PyCallIter_New()` and the
    two-argument form of the `iter()` built-in function.

int PyCallIter\_Check(PyObject \*op)
:   Return true if the type of *op* is `PyCallIter_Type`. This
    function always succeeds.

PyObject \*PyCallIter\_New(PyObject \*callable, PyObject \*sentinel)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return a new iterator. The first parameter, *callable*, can be any Python
    callable object that can be called with no parameters; each call to it should
    return the next item in the iteration. When *callable* returns a value equal to
    *sentinel*, the iteration will be terminated.

## Range Objects

PyTypeObject PyRange\_Type
:   *Part of the Stable ABI.*

    The type object for `range` objects.

int PyRange\_Check(PyObject \*o)
:   Return true if the object *o* is an instance of a `range` object.
    This function always succeeds.

## Builtin Iterator Types

These are built-in iteration types that are included in Python’s C API, but
provide no additional functions. They are here for completeness.

These pointers are part of the Stable ABI.

| C type | Python type |
| --- | --- |
| PyTypeObject PyEnum\_Type | `enumerate` |
| PyTypeObject PyFilter\_Type | `filter` |
| PyTypeObject PyMap\_Type | `map` |
| PyTypeObject PyReversed\_Type | `reversed` |
| PyTypeObject PyZip\_Type | `zip` |

## Other Iterator Objects

PyTypeObject PyByteArrayIter\_Type
:   *Part of the Stable ABI.*

PyTypeObject PyBytesIter\_Type
:   *Part of the Stable ABI.*

PyTypeObject PyListIter\_Type
:   *Part of the Stable ABI.*

PyTypeObject PyListRevIter\_Type
:   *Part of the Stable ABI.*

PyTypeObject PySetIter\_Type
:   *Part of the Stable ABI.*

PyTypeObject PyTupleIter\_Type
:   *Part of the Stable ABI.*

PyTypeObject PyRangeIter\_Type
:   *Part of the Stable ABI.*

PyTypeObject PyLongRangeIter\_Type
:   *Part of the Stable ABI.*

PyTypeObject PyDictIterKey\_Type
:   *Part of the Stable ABI.*

PyTypeObject PyDictRevIterKey\_Type
:   *Part of the Stable ABI since version 3.8.*

PyTypeObject PyDictIterValue\_Type
:   *Part of the Stable ABI.*

PyTypeObject PyDictRevIterValue\_Type
:   *Part of the Stable ABI since version 3.8.*

PyTypeObject PyDictIterItem\_Type
:   *Part of the Stable ABI.*

PyTypeObject PyDictRevIterItem\_Type
:   *Part of the Stable ABI since version 3.8.*

PyTypeObject PyODictIter\_Type
:   Type objects for iterators of various built-in objects.

    Do not create instances of these directly; prefer calling
    `PyObject_GetIter()` instead.

    Note that there is no guarantee that a given built-in type uses a given iterator
    type. For example, iterating over `range` will use one of two iterator
    types depending on the size of the range. Other types may start using a
    similar scheme in the future, without warning.
