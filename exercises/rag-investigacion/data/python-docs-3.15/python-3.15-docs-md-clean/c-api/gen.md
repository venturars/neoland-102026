# Generator Objects

Generator objects are what Python uses to implement generator iterators. They
are normally created by calling a generator function, rather than explicitly
calling `PyGen_New()` or `PyGen_NewWithQualName()`.

type PyGenObject
:   The C structure used for generator objects.

PyTypeObject PyGen\_Type
:   The type object corresponding to generator objects.

int PyGen\_Check(PyObject \*ob)
:   Return true if *ob* is a generator object; *ob* must not be `NULL`. This
    function always succeeds.

int PyGen\_CheckExact(PyObject \*ob)
:   Return true if *ob*’s type is `PyGen_Type`; *ob* must not be
    `NULL`. This function always succeeds.

PyObject \*PyGen\_New(PyFrameObject \*frame)
:   *Return value: New reference.*

    Create and return a new generator object based on the *frame* object.
    A reference to *frame* is “stolen” by this function (even
    on error). The argument must not be `NULL`.

PyObject \*PyGen\_NewWithQualName(PyFrameObject \*frame, PyObject \*name, PyObject \*qualname)
:   *Return value: New reference.*

    Create and return a new generator object based on the *frame* object,
    with `__name__` and `__qualname__` set to *name* and *qualname*.
    A reference to *frame* is “stolen” by this function (even
    on error). The *frame* argument must not be `NULL`.

PyCodeObject \*PyGen\_GetCode(PyGenObject \*gen)
:   Return a new strong reference to the code object wrapped by *gen*.
    This function always succeeds.

## Asynchronous Generator Objects

See also

**PEP 525**

PyTypeObject PyAsyncGen\_Type
:   The type object corresponding to asynchronous generator objects. This is
    available as `types.AsyncGeneratorType` in the Python layer.

PyObject \*PyAsyncGen\_New(PyFrameObject \*frame, PyObject \*name, PyObject \*qualname)
:   Create a new asynchronous generator wrapping *frame*, with `__name__` and
    `__qualname__` set to *name* and *qualname*.
    *frame* is “stolen” by this function (even on error) and
    must not be `NULL`.

    On success, this function returns a strong reference to the
    new asynchronous generator. On failure, this function returns `NULL`
    with an exception set.

int PyAsyncGen\_CheckExact(PyObject \*op)
:   Return true if *op* is an asynchronous generator object, false otherwise.
    This function always succeeds.

## Deprecated API

PyAsyncGenASend\_CheckExact(op)
:   This is an API that was included in Python’s C API
    by mistake.

    It is solely here for completeness; do not use this API.

    Soft deprecated since version 3.14.
