# Set Objects

This section details the public API for `set` and `frozenset`
objects. Any functionality not listed below is best accessed using either
the abstract object protocol (including `PyObject_CallMethod()`,
`PyObject_RichCompareBool()`, `PyObject_Hash()`,
`PyObject_Repr()`, `PyObject_IsTrue()`, `PyObject_Print()`, and
`PyObject_GetIter()`) or the abstract number protocol (including
`PyNumber_And()`, `PyNumber_Subtract()`, `PyNumber_Or()`,
`PyNumber_Xor()`, `PyNumber_InPlaceAnd()`,
`PyNumber_InPlaceSubtract()`, `PyNumber_InPlaceOr()`, and
`PyNumber_InPlaceXor()`).

type PySetObject
:   This subtype of `PyObject` is used to hold the internal data for both
    `set` and `frozenset` objects. It is like a `PyDictObject`
    in that it is a fixed size for small sets (much like tuple storage) and will
    point to a separate, variable sized block of memory for medium and large sized
    sets (much like list storage). None of the fields of this structure should be
    considered public and all are subject to change. All access should be done through
    the documented API rather than by manipulating the values in the structure.

PyTypeObject PySet\_Type
:   *Part of the Stable ABI.*

    This is an instance of `PyTypeObject` representing the Python
    `set` type.

PyTypeObject PyFrozenSet\_Type
:   *Part of the Stable ABI.*

    This is an instance of `PyTypeObject` representing the Python
    `frozenset` type.

The following type check macros work on pointers to any Python object. Likewise,
the constructor functions work with any iterable Python object.

int PySet\_Check(PyObject \*p)
:   Return true if *p* is a `set` object or an instance of a subtype.
    This function always succeeds.

int PyFrozenSet\_Check(PyObject \*p)
:   Return true if *p* is a `frozenset` object or an instance of a
    subtype. This function always succeeds.

int PyAnySet\_Check(PyObject \*p)
:   Return true if *p* is a `set` object, a `frozenset` object, or an
    instance of a subtype. This function always succeeds.

int PySet\_CheckExact(PyObject \*p)
:   Return true if *p* is a `set` object but not an instance of a
    subtype. This function always succeeds.

int PyAnySet\_CheckExact(PyObject \*p)
:   Return true if *p* is a `set` object or a `frozenset` object but
    not an instance of a subtype. This function always succeeds.

int PyFrozenSet\_CheckExact(PyObject \*p)
:   Return true if *p* is a `frozenset` object but not an instance of a
    subtype. This function always succeeds.

PyObject \*PySet\_New(PyObject \*iterable)
:   *Return value: New reference.* *Part of the Stable ABI.* *Thread safety: Safe for concurrent use on the same object.*

    Return a new `set` containing objects returned by the *iterable*. The
    *iterable* may be `NULL` to create a new empty set. Return the new set on
    success or `NULL` on failure. Raise `TypeError` if *iterable* is not
    actually iterable. The constructor is also useful for copying a set
    (`c=set(s)`).

    Note

    The operation is atomic on free threading
    when *iterable* is a `set`, `frozenset`, `dict` or `frozendict`.

PyObject \*PyFrozenSet\_New(PyObject \*iterable)
:   *Return value: New reference.* *Part of the Stable ABI.* *Thread safety: Safe for concurrent use on the same object.*

    Return a new `frozenset` containing objects returned by the *iterable*.
    The *iterable* may be `NULL` to create a new empty frozenset. Return the new
    set on success or `NULL` on failure. Raise `TypeError` if *iterable* is
    not actually iterable.

    Note

    The operation is atomic on free threading
    when *iterable* is a `set`, `frozenset`, `dict` or `frozendict`.

The following functions and macros are available for instances of `set`
or `frozenset` or instances of their subtypes.

Py\_ssize\_t PySet\_Size(PyObject \*anyset)
:   *Part of the Stable ABI.* *Thread safety: Atomic.*

    Return the length of a `set` or `frozenset` object. Equivalent to
    `len(anyset)`. Raises a `SystemError` if *anyset* is not a
    `set`, `frozenset`, or an instance of a subtype.

Py\_ssize\_t PySet\_GET\_SIZE(PyObject \*anyset)
:   *Thread safety: Atomic.*

    Macro form of `PySet_Size()` without error checking.

int PySet\_Contains(PyObject \*anyset, PyObject \*key)
:   *Part of the Stable ABI.* *Thread safety: Safe for concurrent use on the same object.*

    Return `1` if found, `0` if not found, and `-1` if an error is encountered. Unlike
    the Python `__contains__()` method, this function does not automatically
    convert unhashable sets into temporary frozensets. Raise a `TypeError` if
    the *key* is unhashable. Raise `SystemError` if *anyset* is not a
    `set`, `frozenset`, or an instance of a subtype.

    Note

    The operation is atomic on free threading
    when *key* is `str`, `int`, `float`, `bool` or `bytes`.

int PySet\_Add(PyObject \*set, PyObject \*key)
:   *Part of the Stable ABI.* *Thread safety: Safe for concurrent use on the same object.*

    Add *key* to a `set` instance. Also works with `frozenset`
    instances (like `PyTuple_SetItem()` it can be used to fill in the values
    of brand new frozensets before they are exposed to other code). Return `0` on
    success or `-1` on failure. Raise a `TypeError` if the *key* is
    unhashable. Raise a `MemoryError` if there is no room to grow. Raise a
    `SystemError` if *set* is not an instance of `set` or its
    subtype.

    Note

    The operation is atomic on free threading
    when *key* is `str`, `int`, `float`, `bool` or `bytes`.

The following functions are available for instances of `set` or its
subtypes but not for instances of `frozenset` or its subtypes.

int PySet\_Discard(PyObject \*set, PyObject \*key)
:   *Part of the Stable ABI.* *Thread safety: Safe for concurrent use on the same object.*

    Return `1` if found and removed, `0` if not found (no action taken), and `-1` if an
    error is encountered. Does not raise `KeyError` for missing keys. Raise a
    `TypeError` if the *key* is unhashable. Unlike the Python `discard()`
    method, this function does not automatically convert unhashable sets into
    temporary frozensets. Raise `SystemError` if *set* is not an
    instance of `set` or its subtype.

    Note

    The operation is atomic on free threading
    when *key* is `str`, `int`, `float`, `bool` or `bytes`.

PyObject \*PySet\_Pop(PyObject \*set)
:   *Return value: New reference.* *Part of the Stable ABI.* *Thread safety: Atomic.*

    Return a new reference to an arbitrary object in the *set*, and removes the
    object from the *set*. Return `NULL` on failure. Raise `KeyError` if the
    set is empty. Raise a `SystemError` if *set* is not an instance of
    `set` or its subtype.

int PySet\_Clear(PyObject \*set)
:   *Part of the Stable ABI.* *Thread safety: Atomic.*

    Empty an existing set of all elements. Return `0` on
    success. Return `-1` and raise `SystemError` if *set* is not an instance of
    `set` or its subtype.

    Note

    In the free-threaded build, the set is emptied before its entries
    are cleared, so other threads will observe an empty set rather than
    intermediate states.

## Deprecated API

PySet\_MINSIZE
:   A constant representing the size of an internal
    preallocated table inside `PySetObject` instances.

    This is documented solely for completeness, as there are no guarantees
    that a given version of CPython uses preallocated tables with a fixed
    size.
    In code that does not deal with unstable set internals,
    `PySet_MINSIZE` can be replaced with a small constant like `8`.

    If looking for the size of a set, use `PySet_Size()` instead.

    Soft deprecated since version 3.14.
