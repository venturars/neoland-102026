# Boolean Objects

Booleans in Python are implemented as a subclass of integers. There are only
two booleans, `Py_False` and `Py_True`. As such, the normal
creation and deletion functions don’t apply to booleans. The following macros
are available, however.

PyTypeObject PyBool\_Type
:   *Part of the Stable ABI.*

    This instance of `PyTypeObject` represents the Python boolean type; it
    is the same object as `bool` in the Python layer.

int PyBool\_Check(PyObject \*o)
:   Return true if *o* is of type `PyBool_Type`. This function always
    succeeds.

PyObject \*Py\_False
:   The Python `False` object. This object is immortal.

PyObject \*Py\_True
:   The Python `True` object. This object is immortal.

Py\_RETURN\_FALSE
:   Return `Py_False` from a function.

Py\_RETURN\_TRUE
:   Return `Py_True` from a function.

PyObject \*PyBool\_FromLong(long v)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return `Py_True` or `Py_False`, depending on the truth value of *v*.
