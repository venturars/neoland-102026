# Instance Method Objects

An instance method is a wrapper for a `PyCFunction` and the new way
to bind a `PyCFunction` to a class object. It replaces the former call
`PyMethod_New(func, NULL, class)`.

PyTypeObject PyInstanceMethod\_Type
:   This instance of `PyTypeObject` represents the Python instance
    method type. It is not exposed to Python programs.

int PyInstanceMethod\_Check(PyObject \*o)
:   Return true if *o* is an instance method object (has type
    `PyInstanceMethod_Type`). The parameter must not be `NULL`.
    This function always succeeds.

PyObject \*PyInstanceMethod\_New(PyObject \*func)
:   *Return value: New reference.*

    Return a new instance method object, with *func* being any callable object.
    *func* is the function that will be called when the instance method is
    called.

PyObject \*PyInstanceMethod\_Function(PyObject \*im)
:   *Return value: Borrowed reference.*

    Return the function object associated with the instance method *im*.

PyObject \*PyInstanceMethod\_GET\_FUNCTION(PyObject \*im)
:   *Return value: Borrowed reference.*

    Macro version of `PyInstanceMethod_Function()` which avoids error checking.

# Method Objects

Methods are bound function objects. Methods are always bound to an instance of
a user-defined class. Unbound methods (methods bound to a class object) are
no longer available.

PyTypeObject PyMethod\_Type
:   This instance of `PyTypeObject` represents the Python method type. This
    is exposed to Python programs as `types.MethodType`.

int PyMethod\_Check(PyObject \*o)
:   Return true if *o* is a method object (has type `PyMethod_Type`). The
    parameter must not be `NULL`. This function always succeeds.

PyObject \*PyMethod\_New(PyObject \*func, PyObject \*self)
:   *Return value: New reference.*

    Return a new method object, with *func* being any callable object and *self*
    the instance the method should be bound. *func* is the function that will
    be called when the method is called. *self* must not be `NULL`.

PyObject \*PyMethod\_Function(PyObject \*meth)
:   *Return value: Borrowed reference.*

    Return the function object associated with the method *meth*.

PyObject \*PyMethod\_GET\_FUNCTION(PyObject \*meth)
:   *Return value: Borrowed reference.*

    Macro version of `PyMethod_Function()` which avoids error checking.

PyObject \*PyMethod\_Self(PyObject \*meth)
:   *Return value: Borrowed reference.*

    Return the instance associated with the method *meth*.

PyObject \*PyMethod\_GET\_SELF(PyObject \*meth)
:   *Return value: Borrowed reference.*

    Macro version of `PyMethod_Self()` which avoids error checking.
