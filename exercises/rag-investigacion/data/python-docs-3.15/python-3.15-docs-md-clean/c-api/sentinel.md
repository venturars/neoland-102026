# Sentinel objects

PyTypeObject PySentinel\_Type
:   This instance of `PyTypeObject` represents the Python
    `sentinel` type. This is the same object as `sentinel`.

    Added in version 3.15.

int PySentinel\_Check(PyObject \*o)
:   Return true if *o* is a `sentinel` object or a subtype.
    The `sentinel` type does not currently allow subclasses,
    so this check is exact.
    Future Python versions may choose to allow subtyping.
    This function always succeeds.

    Added in version 3.15.

int PySentinel\_CheckExact(PyObject \*o)
:   Return true if *o* is a `sentinel` object, but not a subtype.
    The `sentinel` type does not currently allow subclasses.
    Future Python versions may choose to allow subtyping.
    This function always succeeds.

    Added in version 3.15.

PyObject \*PySentinel\_New(const char \*name, const char \*module\_name, const char \*repr)
:   *Return value: New reference.*

    Return a new `sentinel` object with `__name__` set to
    *name* and `__module__` set to *module\_name*.
    *name* must not be `NULL`. If *module\_name* is `NULL`, `__module__`
    is set to `None`. If *repr* is `NULL`, `repr()` returns `__name__`.
    Return `NULL` with an exception set on failure.

    For pickling to work, *module\_name* must be the name of an importable
    module, and the sentinel must be accessible from that module under a
    path matching *name*. Pickle treats *name* as a global variable name
    in *module\_name* (see `object.__reduce__()`).

    Added in version 3.15.
