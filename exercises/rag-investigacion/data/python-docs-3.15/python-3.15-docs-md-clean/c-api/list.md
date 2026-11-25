# List Objects

type PyListObject
:   This subtype of `PyObject` represents a Python list object.

PyTypeObject PyList\_Type
:   *Part of the Stable ABI.*

    This instance of `PyTypeObject` represents the Python list type.
    This is the same object as `list` in the Python layer.

int PyList\_Check(PyObject \*p)
:   *Thread safety: Atomic.*

    Return true if *p* is a list object or an instance of a subtype of the list
    type. This function always succeeds.

int PyList\_CheckExact(PyObject \*p)
:   *Thread safety: Atomic.*

    Return true if *p* is a list object, but not an instance of a subtype of
    the list type. This function always succeeds.

PyObject \*PyList\_New(Py\_ssize\_t len)
:   *Return value: New reference.* *Part of the Stable ABI.* *Thread safety: Atomic.*

    Return a new list of length *len* on success, or `NULL` on failure.

    Note

    If *len* is greater than zero, the returned list object’s items are
    set to `NULL`. Thus you cannot use abstract API functions such as
    `PySequence_SetItem()` or expose the object to Python code before
    setting all items to a real object with `PyList_SetItem()` or
    `PyList_SET_ITEM()`. The following APIs are safe APIs before
    the list is fully initialized: `PyList_SetItem()` and `PyList_SET_ITEM()`.

Py\_ssize\_t PyList\_Size(PyObject \*list)
:   *Part of the Stable ABI.* *Thread safety: Atomic.*

    Return the length of the list object in *list*; this is equivalent to
    `len(list)` on a list object.

Py\_ssize\_t PyList\_GET\_SIZE(PyObject \*list)
:   *Thread safety: Atomic.*

    Similar to `PyList_Size()`, but without error checking.

PyObject \*PyList\_GetItemRef(PyObject \*list, Py\_ssize\_t index)
:   *Return value: New reference.* *Part of the Stable ABI since version 3.13.* *Thread safety: Atomic.*

    Return the object at position *index* in the list pointed to by *list*. The
    position must be non-negative; indexing from the end of the list is not
    supported. If *index* is out of bounds (`<0 or >=len(list)`),
    return `NULL` and set an `IndexError` exception.

PyObject \*PyList\_GetItem(PyObject \*list, Py\_ssize\_t index)
:   *Return value: Borrowed reference.* *Part of the Stable ABI.* *Thread safety: Safe to call from multiple threads with external synchronization only.*

    Like `PyList_GetItemRef()`, but returns a
    borrowed reference instead of a strong reference.

    Note

    In the free-threaded build, the returned
    borrowed reference may become invalid if another thread modifies
    the list concurrently. Prefer `PyList_GetItemRef()`, which returns
    a strong reference.

PyObject \*PyList\_GET\_ITEM(PyObject \*list, Py\_ssize\_t i)
:   *Return value: Borrowed reference.* *Thread safety: Safe to call from multiple threads with external synchronization only.*

    Similar to `PyList_GetItem()`, but without error checking.

    Note

    In the free-threaded build, the returned
    borrowed reference may become invalid if another thread modifies
    the list concurrently. Prefer `PyList_GetItemRef()`, which returns
    a strong reference.

int PyList\_SetItem(PyObject \*list, Py\_ssize\_t index, PyObject \*item)
:   *Part of the Stable ABI.* *Thread safety: Atomic.*

    Set the item at index *index* in list to *item*. Return `0` on success.
    If *index* is out of bounds, return `-1` and set an `IndexError`
    exception.

    Note

    This function “steals” a reference to *item*,
    even on error.
    On success, it discards a reference to an item already in the list
    at the affected position (unless it was `NULL`).

void PyList\_SET\_ITEM(PyObject \*list, Py\_ssize\_t i, PyObject \*o)
:   *Thread safety: Safe to call from multiple threads with external synchronization only.*

    Macro form of `PyList_SetItem()` without error checking. This is
    normally only used to fill in new lists where there is no previous content.

    Bounds checking is performed as an assertion if Python is built in
    debug mode or `with assertions`.

    Note

    This macro “steals” a reference to *item*, and, unlike
    `PyList_SetItem()`, does *not* discard a reference to any item that
    is being replaced; any reference in *list* at position *i* will be
    leaked.

    Note

    In the free-threaded build, this macro has no internal
    synchronization. It is normally only used to fill in new lists where no
    other thread has a reference to the list. If the list may be shared,
    use `PyList_SetItem()` instead, which uses a [per-object
    lock](../glossary.md#term-per-object-lock).

int PyList\_Insert(PyObject \*list, Py\_ssize\_t index, PyObject \*item)
:   *Part of the Stable ABI.* *Thread safety: Safe for concurrent use on the same object.*

    Insert the item *item* into list *list* in front of index *index*. Return
    `0` if successful; return `-1` and set an exception if unsuccessful.
    Analogous to `list.insert(index, item)`.

int PyList\_Append(PyObject \*list, PyObject \*item)
:   *Part of the Stable ABI.* *Thread safety: Atomic.*

    Append the object *item* at the end of list *list*. Return `0` if
    successful; return `-1` and set an exception if unsuccessful. Analogous
    to `list.append(item)`.

PyObject \*PyList\_GetSlice(PyObject \*list, Py\_ssize\_t low, Py\_ssize\_t high)
:   *Return value: New reference.* *Part of the Stable ABI.* *Thread safety: Atomic.*

    Return a list of the objects in *list* containing the objects *between* *low*
    and *high*. Return `NULL` and set an exception if unsuccessful. Analogous
    to `list[low:high]`. Indexing from the end of the list is not supported.

int PyList\_SetSlice(PyObject \*list, Py\_ssize\_t low, Py\_ssize\_t high, PyObject \*itemlist)
:   *Part of the Stable ABI.* *Thread safety: Safe for concurrent use on the same object.*

    Set the slice of *list* between *low* and *high* to the contents of
    *itemlist*. Analogous to `list[low:high] = itemlist`. The *itemlist* may
    be `NULL`, indicating the assignment of an empty list (slice deletion).
    Return `0` on success, `-1` on failure. Indexing from the end of the
    list is not supported.

    Note

    In the free-threaded build, when *itemlist* is a `list`,
    both *list* and *itemlist* are locked for the duration of the operation.
    For other iterables (or `NULL`), only *list* is locked.

int PyList\_Extend(PyObject \*list, PyObject \*iterable)
:   *Thread safety: Safe for concurrent use on the same object.*

    Extend *list* with the contents of *iterable*. This is the same as
    `PyList_SetSlice(list, PY_SSIZE_T_MAX, PY_SSIZE_T_MAX, iterable)`
    and analogous to `list.extend(iterable)` or `list += iterable`.

    Raise an exception and return `-1` if *list* is not a `list`
    object. Return 0 on success.

    Note

    In the free-threaded build, when *iterable* is a `list`,
    `set`, `dict`, or dict view, both *list* and *iterable*
    (or its underlying dict) are locked for the duration of the operation.
    For other iterables, only *list* is locked; *iterable* may be
    concurrently modified by another thread.

int PyList\_Clear(PyObject \*list)
:   *Thread safety: Atomic.*

    Remove all items from *list*. This is the same as
    `PyList_SetSlice(list, 0, PY_SSIZE_T_MAX, NULL)` and analogous to
    `list.clear()` or `del list[:]`.

    Raise an exception and return `-1` if *list* is not a `list`
    object. Return 0 on success.

int PyList\_Sort(PyObject \*list)
:   *Part of the Stable ABI.* *Thread safety: Safe for concurrent use on the same object.*

    Sort the items of *list* in place. Return `0` on success, `-1` on
    failure. This is equivalent to `list.sort()`.

    Note

    In the free-threaded build, element comparison via
    `__lt__()` can execute arbitrary Python code, during which
    the per-object lock may be temporarily released. For built-in
    types (`str`, `int`, `float`), the lock is not
    released during comparison.

int PyList\_Reverse(PyObject \*list)
:   *Part of the Stable ABI.* *Thread safety: Safe for concurrent use on the same object.*

    Reverse the items of *list* in place. Return `0` on success, `-1` on
    failure. This is the equivalent of `list.reverse()`.

PyObject \*PyList\_AsTuple(PyObject \*list)
:   *Return value: New reference.* *Part of the Stable ABI.* *Thread safety: Atomic.*

    Return a new tuple object containing the contents of *list*; equivalent to
    `tuple(list)`.
