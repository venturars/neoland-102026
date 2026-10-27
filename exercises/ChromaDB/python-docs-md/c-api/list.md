---
page: c-api/list.html
title: List Objects
area: c-api
kind: guide
---

<!-- anchor: list-objects | type: section -->
# List Objects

<!-- anchor: c.PyListObject | type: c type -->
## `type PyListObject`

This subtype of `PyObject` represents a Python list object.

<!-- anchor: c.PyList_Type | type: c var -->
## `PyTypeObject PyList_Type`

*Part of the Stable ABI.*

This instance of `PyTypeObject` represents the Python list type. This is the same object as `list` in the Python layer.

<!-- anchor: c.PyList_Check | type: c function -->
## `int PyList_Check(PyObject *p)`

*Thread safety: Atomic.*

Return true if *p* is a list object or an instance of a subtype of the list type. This function always succeeds.

<!-- anchor: c.PyList_CheckExact | type: c function -->
## `int PyList_CheckExact(PyObject *p)`

*Thread safety: Atomic.*

Return true if *p* is a list object, but not an instance of a subtype of the list type. This function always succeeds.

<!-- anchor: c.PyList_New | type: c function -->
## `PyObject *PyList_New(Py_ssize_t len)`

*Return value: New reference.**Part of the Stable ABI.**Thread safety: Atomic.*

Return a new list of length *len* on success, or `NULL` on failure.

**Note:**

If *len* is greater than zero, the returned list object’s items are set to `NULL`. Thus you cannot use abstract API functions such as `PySequence_SetItem()` or expose the object to Python code before setting all items to a real object with `PyList_SetItem()` or `PyList_SET_ITEM()`. The following APIs are safe APIs before the list is fully initialized: `PyList_SetItem()` and `PyList_SET_ITEM()`.

<!-- anchor: c.PyList_Size | type: c function -->
## `Py_ssize_t PyList_Size(PyObject *list)`

*Part of the Stable ABI.**Thread safety: Atomic.*

Return the length of the list object in *list*; this is equivalent to `len(list)` on a list object.

<!-- anchor: c.PyList_GET_SIZE | type: c function -->
## `Py_ssize_t PyList_GET_SIZE(PyObject *list)`

*Thread safety: Atomic.*

Similar to `PyList_Size()`, but without error checking.

<!-- anchor: c.PyList_GetItemRef | type: c function -->
## `PyObject *PyList_GetItemRef(PyObject *list, Py_ssize_t index)`

*Return value: New reference.**Part of the Stable ABI since version 3.13.**Thread safety: Atomic.*

Return the object at position *index* in the list pointed to by *list*. The position must be non-negative; indexing from the end of the list is not supported. If *index* is out of bounds (`<0 or >=len(list)`), return `NULL` and set an `IndexError` exception.

Added in version 3.13.

<!-- anchor: c.PyList_GetItem | type: c function -->
## `PyObject *PyList_GetItem(PyObject *list, Py_ssize_t index)`

*Return value: Borrowed reference.**Part of the Stable ABI.**Thread safety: Safe to call from multiple threads with external synchronization only.*

Like `PyList_GetItemRef()`, but returns a borrowed reference instead of a strong reference.

**Note:**

In the free-threaded build, the returned borrowed reference may become invalid if another thread modifies the list concurrently. Prefer `PyList_GetItemRef()`, which returns a strong reference.

<!-- anchor: c.PyList_GET_ITEM | type: c function -->
## `PyObject *PyList_GET_ITEM(PyObject *list, Py_ssize_t i)`

*Return value: Borrowed reference.**Thread safety: Safe to call from multiple threads with external synchronization only.*

Similar to `PyList_GetItem()`, but without error checking.

**Note:**

In the free-threaded build, the returned borrowed reference may become invalid if another thread modifies the list concurrently. Prefer `PyList_GetItemRef()`, which returns a strong reference.

<!-- anchor: c.PyList_SetItem | type: c function -->
## `int PyList_SetItem(PyObject *list, Py_ssize_t index, PyObject *item)`

*Part of the Stable ABI.**Thread safety: Atomic.*

Set the item at index *index* in list to *item*. Return `0` on success. If *index* is out of bounds, return `-1` and set an `IndexError` exception.

**Note:**

This function “steals” a reference to *item*, even on error. On success, it discards a reference to an item already in the list at the affected position (unless it was `NULL`).

<!-- anchor: c.PyList_SET_ITEM | type: c function -->
## `void PyList_SET_ITEM(PyObject *list, Py_ssize_t i, PyObject *o)`

*Thread safety: Safe to call from multiple threads with external synchronization only.*

Macro form of `PyList_SetItem()` without error checking. This is normally only used to fill in new lists where there is no previous content.

Bounds checking is performed as an assertion if Python is built in debug mode or `with assertions`.

**Note:**

This macro “steals” a reference to *item*, and, unlike `PyList_SetItem()`, does *not* discard a reference to any item that is being replaced; any reference in *list* at position *i* will be leaked.

**Note:**

In the free-threaded build, this macro has no internal synchronization. It is normally only used to fill in new lists where no other thread has a reference to the list. If the list may be shared, use `PyList_SetItem()` instead, which uses a per-object lock.

<!-- anchor: c.PyList_Insert | type: c function -->
## `int PyList_Insert(PyObject *list, Py_ssize_t index, PyObject *item)`

*Part of the Stable ABI.**Thread safety: Safe for concurrent use on the same object.*

Insert the item *item* into list *list* in front of index *index*. Return `0` if successful; return `-1` and set an exception if unsuccessful. Analogous to `list.insert(index, item)`.

<!-- anchor: c.PyList_Append | type: c function -->
## `int PyList_Append(PyObject *list, PyObject *item)`

*Part of the Stable ABI.**Thread safety: Atomic.*

Append the object *item* at the end of list *list*. Return `0` if successful; return `-1` and set an exception if unsuccessful. Analogous to `list.append(item)`.

<!-- anchor: c.PyList_GetSlice | type: c function -->
## `PyObject *PyList_GetSlice(PyObject *list, Py_ssize_t low, Py_ssize_t high)`

*Return value: New reference.**Part of the Stable ABI.**Thread safety: Atomic.*

Return a list of the objects in *list* containing the objects *between* *low* and *high*. Return `NULL` and set an exception if unsuccessful. Analogous to `list[low:high]`. Indexing from the end of the list is not supported.

<!-- anchor: c.PyList_SetSlice | type: c function -->
## `int PyList_SetSlice(PyObject *list, Py_ssize_t low, Py_ssize_t high, PyObject *itemlist)`

*Part of the Stable ABI.**Thread safety: Safe for concurrent use on the same object.*

Set the slice of *list* between *low* and *high* to the contents of *itemlist*. Analogous to `list[low:high] = itemlist`. The *itemlist* may be `NULL`, indicating the assignment of an empty list (slice deletion). Return `0` on success, `-1` on failure. Indexing from the end of the list is not supported.

**Note:**

In the free-threaded build, when *itemlist* is a `list`, both *list* and *itemlist* are locked for the duration of the operation. For other iterables (or `NULL`), only *list* is locked.

<!-- anchor: c.PyList_Extend | type: c function -->
## `int PyList_Extend(PyObject *list, PyObject *iterable)`

*Thread safety: Safe for concurrent use on the same object.*

Extend *list* with the contents of *iterable*. This is the same as `PyList_SetSlice(list, PY_SSIZE_T_MAX, PY_SSIZE_T_MAX, iterable)` and analogous to `list.extend(iterable)` or `list += iterable`.

Raise an exception and return `-1` if *list* is not a `list` object. Return 0 on success.

Added in version 3.13.

**Note:**

In the free-threaded build, when *iterable* is a `list`, `set`, `dict`, or dict view, both *list* and *iterable* (or its underlying dict) are locked for the duration of the operation. For other iterables, only *list* is locked; *iterable* may be concurrently modified by another thread.

<!-- anchor: c.PyList_Clear | type: c function -->
## `int PyList_Clear(PyObject *list)`

*Thread safety: Atomic.*

Remove all items from *list*. This is the same as `PyList_SetSlice(list, 0, PY_SSIZE_T_MAX, NULL)` and analogous to `list.clear()` or `del list[:]`.

Raise an exception and return `-1` if *list* is not a `list` object. Return 0 on success.

Added in version 3.13.

<!-- anchor: c.PyList_Sort | type: c function -->
## `int PyList_Sort(PyObject *list)`

*Part of the Stable ABI.**Thread safety: Safe for concurrent use on the same object.*

Sort the items of *list* in place. Return `0` on success, `-1` on failure. This is equivalent to `list.sort()`.

**Note:**

In the free-threaded build, element comparison via `__lt__()` can execute arbitrary Python code, during which the per-object lock may be temporarily released. For built-in types (`str`, `int`, `float`), the lock is not released during comparison.

<!-- anchor: c.PyList_Reverse | type: c function -->
## `int PyList_Reverse(PyObject *list)`

*Part of the Stable ABI.**Thread safety: Safe for concurrent use on the same object.*

Reverse the items of *list* in place. Return `0` on success, `-1` on failure. This is the equivalent of `list.reverse()`.

<!-- anchor: c.PyList_AsTuple | type: c function -->
## `PyObject *PyList_AsTuple(PyObject *list)`

*Return value: New reference.**Part of the Stable ABI.**Thread safety: Atomic.*

Return a new tuple object containing the contents of *list*; equivalent to `tuple(list)`.
