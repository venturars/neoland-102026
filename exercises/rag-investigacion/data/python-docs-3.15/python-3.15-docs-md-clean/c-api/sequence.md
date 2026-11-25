# Sequence Protocol

int PySequence\_Check(PyObject \*o)
:   *Part of the Stable ABI.*

    Return `1` if the object provides the sequence protocol, and `0` otherwise.
    Note that it returns `1` for Python classes with a `__getitem__()`
    method, unless they are `dict` subclasses, since in general it
    is impossible to determine what type of keys the class supports. This
    function always succeeds.

Py\_ssize\_t PySequence\_Size(PyObject \*o)

Py\_ssize\_t PySequence\_Length(PyObject \*o)
:   *Part of the Stable ABI.*

    Returns the number of objects in sequence *o* on success, and `-1` on
    failure. This is equivalent to the Python expression `len(o)`.

PyObject \*PySequence\_Concat(PyObject \*o1, PyObject \*o2)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return the concatenation of *o1* and *o2* on success, and `NULL` on failure.
    This is the equivalent of the Python expression `o1 + o2`.

PyObject \*PySequence\_Repeat(PyObject \*o, Py\_ssize\_t count)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return the result of repeating sequence object *o* *count* times, or `NULL` on
    failure. This is the equivalent of the Python expression `o * count`.

PyObject \*PySequence\_InPlaceConcat(PyObject \*o1, PyObject \*o2)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return the concatenation of *o1* and *o2* on success, and `NULL` on failure.
    The operation is done *in-place* when *o1* supports it. This is the equivalent
    of the Python expression `o1 += o2`.

PyObject \*PySequence\_InPlaceRepeat(PyObject \*o, Py\_ssize\_t count)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return the result of repeating sequence object *o* *count* times, or `NULL` on
    failure. The operation is done *in-place* when *o* supports it. This is the
    equivalent of the Python expression `o *= count`.

PyObject \*PySequence\_GetItem(PyObject \*o, Py\_ssize\_t i)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return the *i*th element of *o*, or `NULL` on failure. This is the equivalent of
    the Python expression `o[i]`.

PyObject \*PySequence\_GetSlice(PyObject \*o, Py\_ssize\_t i1, Py\_ssize\_t i2)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return the slice of sequence object *o* between *i1* and *i2*, or `NULL` on
    failure. This is the equivalent of the Python expression `o[i1:i2]`.

int PySequence\_SetItem(PyObject \*o, Py\_ssize\_t i, PyObject \*v)
:   *Part of the Stable ABI.*

    Assign object *v* to the *i*th element of *o*. Raise an exception
    and return `-1` on failure; return `0` on success. This
    is the equivalent of the Python statement `o[i] = v`. This function *does
    not* “steal” a reference to *v*.

    If *v* is `NULL`, the element is deleted, but this feature is
    deprecated in favour of using `PySequence_DelItem()`.

int PySequence\_DelItem(PyObject \*o, Py\_ssize\_t i)
:   *Part of the Stable ABI.*

    Delete the *i*th element of object *o*. Returns `-1` on failure. This is the
    equivalent of the Python statement `del o[i]`.

int PySequence\_SetSlice(PyObject \*o, Py\_ssize\_t i1, Py\_ssize\_t i2, PyObject \*v)
:   *Part of the Stable ABI.*

    Assign the sequence object *v* to the slice in sequence object *o* from *i1* to
    *i2*. This is the equivalent of the Python statement `o[i1:i2] = v`.

int PySequence\_DelSlice(PyObject \*o, Py\_ssize\_t i1, Py\_ssize\_t i2)
:   *Part of the Stable ABI.*

    Delete the slice in sequence object *o* from *i1* to *i2*. Returns `-1` on
    failure. This is the equivalent of the Python statement `del o[i1:i2]`.

Py\_ssize\_t PySequence\_Count(PyObject \*o, PyObject \*value)
:   *Part of the Stable ABI.*

    Return the number of occurrences of *value* in *o*, that is, return the number
    of keys for which `o[key] == value`. On failure, return `-1`. This is
    equivalent to the Python expression `o.count(value)`.

int PySequence\_Contains(PyObject \*o, PyObject \*value)
:   *Part of the Stable ABI.*

    Determine if *o* contains *value*. If an item in *o* is equal to *value*,
    return `1`, otherwise return `0`. On error, return `-1`. This is
    equivalent to the Python expression `value in o`.

int PySequence\_In(PyObject \*o, PyObject \*value)
:   *Part of the Stable ABI.*

    Alias for `PySequence_Contains()`.

    Soft deprecated since version 3.14: The function should no longer be used to write new code.

Py\_ssize\_t PySequence\_Index(PyObject \*o, PyObject \*value)
:   *Part of the Stable ABI.*

    Return the first index *i* for which `o[i] == value`. On error, return
    `-1`. This is equivalent to the Python expression `o.index(value)`.

PyObject \*PySequence\_List(PyObject \*o)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return a list object with the same contents as the sequence or iterable *o*,
    or `NULL` on failure. The returned list is guaranteed to be new. This is
    equivalent to the Python expression `list(o)`.

PyObject \*PySequence\_Tuple(PyObject \*o)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return a tuple object with the same contents as the sequence or iterable *o*,
    or `NULL` on failure. If *o* is a tuple, a new reference will be returned,
    otherwise a tuple will be constructed with the appropriate contents. This is
    equivalent to the Python expression `tuple(o)`.

PyObject \*PySequence\_Fast(PyObject \*o, const char \*m)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return the sequence or iterable *o* as an object usable by the other
    `PySequence_Fast*` family of functions. If the object is not a sequence or
    iterable, raises `TypeError` with *m* as the message text. Returns
    `NULL` on failure.

    The `PySequence_Fast*` functions are thus named because they assume
    *o* is a `PyTupleObject` or a `PyListObject` and access
    the data fields of *o* directly.

    As a CPython implementation detail, if *o* is already a sequence or list, it
    will be returned.

Py\_ssize\_t PySequence\_Fast\_GET\_SIZE(PyObject \*o)
:   Returns the length of *o*, assuming that *o* was returned by
    `PySequence_Fast()` and that *o* is not `NULL`. The size can also be
    retrieved by calling `PySequence_Size()` on *o*, but
    `PySequence_Fast_GET_SIZE()` is faster because it can assume *o* is a
    list or tuple.

PyObject \*PySequence\_Fast\_GET\_ITEM(PyObject \*o, Py\_ssize\_t i)
:   *Return value: Borrowed reference.*

    Return the *i*th element of *o*, assuming that *o* was returned by
    `PySequence_Fast()`, *o* is not `NULL`, and that *i* is within bounds.

PyObject \*\*PySequence\_Fast\_ITEMS(PyObject \*o)
:   Return the underlying array of PyObject pointers. Assumes that *o* was returned
    by `PySequence_Fast()` and *o* is not `NULL`.

    Note, if a list gets resized, the reallocation may relocate the items array.
    So, only use the underlying array pointer in contexts where the sequence
    cannot change.

PyObject \*PySequence\_ITEM(PyObject \*o, Py\_ssize\_t i)
:   *Return value: New reference.*

    Return the *i*th element of *o* or `NULL` on failure. Faster form of
    `PySequence_GetItem()` but without checking that
    `PySequence_Check()` on *o* is true and without adjustment for negative
    indices.
