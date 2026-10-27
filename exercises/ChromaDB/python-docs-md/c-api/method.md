---
page: c-api/method.html
title: Instance Method Objects
area: c-api
kind: guide
---

<!-- anchor: instance-method-objects | type: section -->
# Instance Method Objects

An instance method is a wrapper for a `PyCFunction` and the new way to bind a `PyCFunction` to a class object. It replaces the former call `PyMethod_New(func, NULL, class)`.

<!-- anchor: c.PyInstanceMethod_Type | type: c var -->
## `PyTypeObject PyInstanceMethod_Type`

This instance of `PyTypeObject` represents the Python instance method type. It is not exposed to Python programs.

<!-- anchor: c.PyInstanceMethod_Check | type: c function -->
## `int PyInstanceMethod_Check(PyObject *o)`

Return true if *o* is an instance method object (has type `PyInstanceMethod_Type`). The parameter must not be `NULL`. This function always succeeds.

<!-- anchor: c.PyInstanceMethod_New | type: c function -->
## `PyObject *PyInstanceMethod_New(PyObject *func)`

*Return value: New reference.*

Return a new instance method object, with *func* being any callable object. *func* is the function that will be called when the instance method is called.

<!-- anchor: c.PyInstanceMethod_Function | type: c function -->
## `PyObject *PyInstanceMethod_Function(PyObject *im)`

*Return value: Borrowed reference.*

Return the function object associated with the instance method *im*.

<!-- anchor: c.PyInstanceMethod_GET_FUNCTION | type: c function -->
## `PyObject *PyInstanceMethod_GET_FUNCTION(PyObject *im)`

*Return value: Borrowed reference.*

Macro version of `PyInstanceMethod_Function()` which avoids error checking.

<!-- anchor: method-objects | type: section -->
# Method Objects

Methods are bound function objects. Methods are always bound to an instance of a user-defined class. Unbound methods (methods bound to a class object) are no longer available.

<!-- anchor: c.PyMethod_Type | type: c var -->
## `PyTypeObject PyMethod_Type`

This instance of `PyTypeObject` represents the Python method type. This is exposed to Python programs as `types.MethodType`.

<!-- anchor: c.PyMethod_Check | type: c function -->
## `int PyMethod_Check(PyObject *o)`

Return true if *o* is a method object (has type `PyMethod_Type`). The parameter must not be `NULL`. This function always succeeds.

<!-- anchor: c.PyMethod_New | type: c function -->
## `PyObject *PyMethod_New(PyObject *func, PyObject *self)`

*Return value: New reference.*

Return a new method object, with *func* being any callable object and *self* the instance the method should be bound. *func* is the function that will be called when the method is called. *self* must not be `NULL`.

<!-- anchor: c.PyMethod_Function | type: c function -->
## `PyObject *PyMethod_Function(PyObject *meth)`

*Return value: Borrowed reference.*

Return the function object associated with the method *meth*.

<!-- anchor: c.PyMethod_GET_FUNCTION | type: c function -->
## `PyObject *PyMethod_GET_FUNCTION(PyObject *meth)`

*Return value: Borrowed reference.*

Macro version of `PyMethod_Function()` which avoids error checking.

<!-- anchor: c.PyMethod_Self | type: c function -->
## `PyObject *PyMethod_Self(PyObject *meth)`

*Return value: Borrowed reference.*

Return the instance associated with the method *meth*.

<!-- anchor: c.PyMethod_GET_SELF | type: c function -->
## `PyObject *PyMethod_GET_SELF(PyObject *meth)`

*Return value: Borrowed reference.*

Macro version of `PyMethod_Self()` which avoids error checking.
