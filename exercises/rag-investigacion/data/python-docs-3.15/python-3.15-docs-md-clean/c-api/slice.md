# Slice Objects

PyTypeObject PySlice\_Type
:   *Part of the Stable ABI.*

    The type object for slice objects. This is the same as `slice` in the
    Python layer.

int PySlice\_Check(PyObject \*ob)
:   Return true if *ob* is a slice object; *ob* must not be `NULL`. This
    function always succeeds.

PyObject \*PySlice\_New(PyObject \*start, PyObject \*stop, PyObject \*step)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return a new slice object with the given values. The *start*, *stop*, and
    *step* parameters are used as the values of the slice object attributes of
    the same names. Any of the values may be `NULL`, in which case the
    `None` will be used for the corresponding attribute.

    Return `NULL` with an exception set if
    the new object could not be allocated.

int PySlice\_GetIndices(PyObject \*slice, Py\_ssize\_t length, Py\_ssize\_t \*start, Py\_ssize\_t \*stop, Py\_ssize\_t \*step)
:   *Part of the Stable ABI.*

    Retrieve the start, stop and step indices from the slice object *slice*,
    assuming a sequence of length *length*. Treats indices greater than
    *length* as errors.

    Returns `0` on success and `-1` on error with no exception set (unless one of
    the indices was not `None` and failed to be converted to an integer,
    in which case `-1` is returned with an exception set).

    You probably do not want to use this function.

int PySlice\_GetIndicesEx(PyObject \*slice, Py\_ssize\_t length, Py\_ssize\_t \*start, Py\_ssize\_t \*stop, Py\_ssize\_t \*step, Py\_ssize\_t \*slicelength)
:   *Part of the Stable ABI.*

    Usable replacement for `PySlice_GetIndices()`. Retrieve the start,
    stop, and step indices from the slice object *slice* assuming a sequence of
    length *length*, and store the length of the slice in *slicelength*. Out
    of bounds indices are clipped in a manner consistent with the handling of
    normal slices.
    *length* must not be negative.

    Return `0` on success and `-1` on error with an exception set.

    Note

    This function is considered not safe for resizable sequences.
    Its invocation should be replaced by a combination of
    `PySlice_Unpack()` and `PySlice_AdjustIndices()` where

    ```
    if (PySlice_GetIndicesEx(slice, length, &start, &stop, &step, &slicelength) < 0) {
        // return error
    }
    ```

    is replaced by

    ```
    if (PySlice_Unpack(slice, &start, &stop, &step) < 0) {
        // return error
    }
    slicelength = PySlice_AdjustIndices(length, &start, &stop, step);
    ```

    Deprecated since version 3.6.1: If `Py_LIMITED_API` is set to the value less than `0x03050400` or
    between `0x03060000` and `0x03060100` (not including)
    `PySlice_GetIndicesEx()` is a deprecated function.

int PySlice\_Unpack(PyObject \*slice, Py\_ssize\_t \*start, Py\_ssize\_t \*stop, Py\_ssize\_t \*step)
:   *Part of the Stable ABI since version 3.7.*

    Extract the start, stop and step data members from a slice object as
    C integers. Silently reduce values larger than `PY_SSIZE_T_MAX` to
    `PY_SSIZE_T_MAX`, silently boost the start and stop values less than
    `PY_SSIZE_T_MIN` to `PY_SSIZE_T_MIN`, and silently boost the step
    values less than `-PY_SSIZE_T_MAX` to `-PY_SSIZE_T_MAX`.

    Return `-1` with an exception set on error, `0` on success.

Py\_ssize\_t PySlice\_AdjustIndices(Py\_ssize\_t length, Py\_ssize\_t \*start, Py\_ssize\_t \*stop, Py\_ssize\_t step)
:   *Part of the Stable ABI since version 3.7.*

    Adjust start/end slice indices assuming a sequence of the specified length.
    Out of bounds indices are clipped in a manner consistent with the handling
    of normal slices.

    *length* must not be negative.
    *step* must not be zero and must not be less than `-PY_SSIZE_T_MAX`,
    as guaranteed by `PySlice_Unpack()`.

    Return the length of the slice. Always successful. Doesn’t call Python
    code.

## Ellipsis Object

PyTypeObject PyEllipsis\_Type
:   *Part of the Stable ABI.*

    The type of Python `Ellipsis` object. Same as `types.EllipsisType`
    in the Python layer.

PyObject \*Py\_Ellipsis
:   The Python `Ellipsis` object. This object has no methods. Like
    `Py_None`, it is an immortal singleton object.
