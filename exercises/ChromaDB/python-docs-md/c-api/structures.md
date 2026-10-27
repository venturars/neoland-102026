---
page: c-api/structures.html
title: Common Object Structures
area: c-api
kind: guide
---

<!-- anchor: common-object-structures | type: section -->
# Common Object Structures

There are a large number of structures which are used in the definition of object types for Python. This section describes these structures and how they are used.

<!-- anchor: base-object-types-and-macros | type: section -->
## Base object types and macros

All Python objects ultimately share a small number of fields at the beginning of the object’s representation in memory. These are represented by the `PyObject` and `PyVarObject` types, which are defined, in turn, by the expansions of some macros also used, whether directly or indirectly, in the definition of all other Python objects. Additional macros can be found under reference counting.

<!-- anchor: c.PyObject | type: c type -->
### `type PyObject`

*Part of the Stable ABI (see below).*

All object types are extensions of this type. This is a type which contains the information Python needs to treat a pointer to an object as an object. In a normal “release” build, it contains only the object’s reference count and a pointer to the corresponding type object. Nothing is actually declared to be a `PyObject`, but every pointer to a Python object can be cast to a PyObject*.

The members must not be accessed directly; instead use macros such as `Py_REFCNT` and `Py_TYPE`.

In the Stable ABI for Free-Threaded Builds (`abi3t`), this struct is opaque; its size and layout may change between Python versions. In Stable ABI for non-free-threaded builds (`abi3`), the `ob_refcnt` and `ob_type` fields are available, but using them directly is discouraged.

<!-- anchor: c.PyObject.ob_refcnt | type: c member -->
#### `Py_ssize_t ob_refcnt`

*Part of the Stable ABI.*

The object’s reference count, as returned by `Py_REFCNT`. Do not use this field directly; instead use functions and macros such as `Py_REFCNT`, `Py_INCREF()` and `Py_DecRef()`.

The field type may be different from `Py_ssize_t`, depending on build configuration and platform.

<!-- anchor: c.PyObject.ob_type | type: c member -->
#### `PyTypeObject *ob_type`

*Part of the Stable ABI.*

The object’s type. Do not use this field directly; use `Py_TYPE` and `Py_SET_TYPE()` instead.

<!-- anchor: c.PyObject.ob_mutex | type: c member -->
#### `PyMutex ob_mutex`

A per-object lock, present only in the free-threaded build (when `Py_GIL_DISABLED` is defined).

This field is **reserved for use by the critical section API** (`Py_BEGIN_CRITICAL_SECTION` / `Py_END_CRITICAL_SECTION`). Do **not** lock it directly with `PyMutex_Lock`; doing so can cause deadlocks. If you need your own lock, add a separate `PyMutex` field to your object struct.

Added in version 3.13.

<!-- anchor: c.PyVarObject | type: c type -->
### `type PyVarObject`

*Part of the Stable ABI (see below).*

An extension of `PyObject` that adds the `ob_size` field. This is intended for objects that have some notion of *length*.

As with `PyObject`, the members must not be accessed directly; instead use macros such as `Py_SIZE`, `Py_REFCNT` and `Py_TYPE`.

In the Stable ABI for Free-Threaded Builds (`abi3t`), this struct is opaque; its size and layout may change between Python versions. In Stable ABI for non-free-threaded builds (`abi3`), the `ob_base` and `ob_size` fields are available, but using them directly is discouraged.

<!-- anchor: c.PyVarObject.ob_base | type: c member -->
#### `PyObject ob_base`

*Part of the Stable ABI.*

Common object header. Typically, this field is not accessed directly; instead `PyVarObject` can be cast to `PyObject`.

<!-- anchor: c.PyVarObject.ob_size | type: c member -->
#### `Py_ssize_t ob_size`

*Part of the Stable ABI.*

A size field, whose contents should be considered an object’s internal implementation detail.

Do not use this field directly; use `Py_SIZE` instead.

Object creation functions such as `PyObject_NewVar()` will generally set this field to the requested size (number of items). After creation, arbitrary values can be stored in `ob_size` using `Py_SET_SIZE`.

To get an object’s publicly exposed length, as returned by the Python function `len()`, use `PyObject_Length()` instead.

<!-- anchor: c.PyObject_HEAD | type: c macro -->
### `PyObject_HEAD`

This is a macro used when declaring new types which represent objects without a varying length. The PyObject_HEAD macro expands to:

```c
PyObject ob_base;
```

See documentation of `PyObject` above.

<!-- anchor: c.PyObject_VAR_HEAD | type: c macro -->
### `PyObject_VAR_HEAD`

This is a macro used when declaring new types which represent objects with a length that varies from instance to instance. The PyObject_VAR_HEAD macro expands to:

```c
PyVarObject ob_base;
```

See documentation of `PyVarObject` above.

<!-- anchor: c.PyBaseObject_Type | type: c var -->
### `PyTypeObject PyBaseObject_Type`

*Part of the Stable ABI.*

The base class of all other objects, the same as `object` in Python.

<!-- anchor: c.Py_Is | type: c function -->
### `int Py_Is(PyObject *x, PyObject *y)`

*Part of the Stable ABI since version 3.10.*

Test if the *x* object is the *y* object, the same as `x is y` in Python.

Added in version 3.10.

<!-- anchor: c.Py_IsNone | type: c function -->
### `int Py_IsNone(PyObject *x)`

*Part of the Stable ABI since version 3.10.*

Test if an object is the `None` singleton, the same as `x is None` in Python.

Added in version 3.10.

<!-- anchor: c.Py_IsTrue | type: c function -->
### `int Py_IsTrue(PyObject *x)`

*Part of the Stable ABI since version 3.10.*

Test if an object is the `True` singleton, the same as `x is True` in Python.

Added in version 3.10.

<!-- anchor: c.Py_IsFalse | type: c function -->
### `int Py_IsFalse(PyObject *x)`

*Part of the Stable ABI since version 3.10.*

Test if an object is the `False` singleton, the same as `x is False` in Python.

Added in version 3.10.

<!-- anchor: c.Py_TYPE | type: c function -->
### `PyTypeObject *Py_TYPE(PyObject *o)`

*Return value: Borrowed reference.**Part of the Stable ABI since version 3.14.*

Get the type of the Python object *o*.

The returned reference is borrowed from *o*. Do not release it with `Py_DECREF()` or similar.

Changed in version 3.11: `Py_TYPE()` is changed to an inline static function. The parameter type is no longer const PyObject*.

<!-- anchor: c.Py_IS_TYPE | type: c function -->
### `int Py_IS_TYPE(PyObject *o, PyTypeObject *type)`

*Part of the Stable ABI since version 3.15.*

Return non-zero if the object *o* type is *type*. Return zero otherwise. Equivalent to: `Py_TYPE(o) == type`.

Added in version 3.9.

<!-- anchor: c.Py_SET_TYPE | type: c function -->
### `void Py_SET_TYPE(PyObject *o, PyTypeObject *type)`

*This macro is available when compiling for the Stable ABI since version 3.9.*

Set the type of object *o* to *type*, without any checking or reference counting.

This is a very low-level operation. Consider instead setting the Python attribute `__class__` using `PyObject_SetAttrString()` or similar.

Note that assigning an incompatible type can lead to undefined behavior.

If *type* is a heap type, the caller must create a new reference to it. Similarly, if the old type of *o* is a heap type, the caller must release a reference to that type.

Added in version 3.9.

<!-- anchor: c.Py_SIZE | type: c function -->
### `Py_ssize_t Py_SIZE(PyVarObject *o)`

*Part of the Stable ABI since version 3.15.*

Get the `ob_size` field of *o*.

Changed in version 3.11: `Py_SIZE()` is changed to an inline static function. The parameter type is no longer const PyVarObject*.

<!-- anchor: c.Py_SET_SIZE | type: c function -->
### `void Py_SET_SIZE(PyVarObject *o, Py_ssize_t size)`

*Part of the Stable ABI since version 3.15.*

Set the `ob_size` field of *o* to *size*.

Added in version 3.9.

<!-- anchor: c.PyObject_HEAD_INIT | type: c macro -->
### `PyObject_HEAD_INIT(type)`

This is a macro which expands to initialization values for a new `PyObject` type. This macro expands to:

```c
_PyObject_EXTRA_INIT
1, type,
```

<!-- anchor: c.PyVarObject_HEAD_INIT | type: c macro -->
### `PyVarObject_HEAD_INIT(type, size)`

This is a macro which expands to initialization values for a new `PyVarObject` type, including the `ob_size` field. This macro expands to:

```c
_PyObject_EXTRA_INIT
1, type, size,
```

<!-- anchor: implementing-functions-and-methods | type: section -->
## Implementing functions and methods

<!-- anchor: c.PyCFunction | type: c type -->
### `type PyCFunction`

*Part of the Stable ABI.*

Type of the functions used to implement most Python callables in C. Functions of this type take two PyObject* parameters and return one such value. If the return value is `NULL`, an exception shall have been set. If not `NULL`, the return value is interpreted as the return value of the function as exposed in Python. The function must return a new reference.

The function signature is:

```c
PyObject *PyCFunction(PyObject *self,
                      PyObject *args);
```

<!-- anchor: c.PyCFunctionWithKeywords | type: c type -->
### `type PyCFunctionWithKeywords`

*Part of the Stable ABI.*

Type of the functions used to implement Python callables in C with signature METH_VARARGS | METH_KEYWORDS. The function signature is:

```c
PyObject *PyCFunctionWithKeywords(PyObject *self,
                                  PyObject *args,
                                  PyObject *kwargs);
```

<!-- anchor: c.PyCFunctionFast | type: c type -->
### `type PyCFunctionFast`

*Part of the Stable ABI since version 3.13.*

Type of the functions used to implement Python callables in C with signature `METH_FASTCALL`. The function signature is:

```c
PyObject *PyCFunctionFast(PyObject *self,
                          PyObject *const *args,
                          Py_ssize_t nargs);
```

<!-- anchor: c.PyCFunctionFastWithKeywords | type: c type -->
### `type PyCFunctionFastWithKeywords`

*Part of the Stable ABI since version 3.13.*

Type of the functions used to implement Python callables in C with signature METH_FASTCALL | METH_KEYWORDS. The function signature is:

```c
PyObject *PyCFunctionFastWithKeywords(PyObject *self,
                                      PyObject *const *args,
                                      Py_ssize_t nargs,
                                      PyObject *kwnames);
```

<!-- anchor: c.PyCMethod | type: c type -->
### `type PyCMethod`

Type of the functions used to implement Python callables in C with signature METH_METHOD | METH_FASTCALL | METH_KEYWORDS. The function signature is:

```c
PyObject *PyCMethod(PyObject *self,
                    PyTypeObject *defining_class,
                    PyObject *const *args,
                    Py_ssize_t nargs,
                    PyObject *kwnames)
```

Added in version 3.9.

<!-- anchor: c.PyMethodDef | type: c type -->
### `type PyMethodDef`

*Part of the Stable ABI (including all members).*

Structure used to describe a method of an extension type. This structure has four fields:

<!-- anchor: c.PyMethodDef.ml_name | type: c member -->
#### `const char *ml_name`

Name of the method.

A `NULL` *ml_name* marks the end of a `PyMethodDef` array.

<!-- anchor: c.PyMethodDef.ml_meth | type: c member -->
#### `PyCFunction ml_meth`

Pointer to the C implementation.

<!-- anchor: c.PyMethodDef.ml_flags | type: c member -->
#### `int ml_flags`

Flags bits indicating how the call should be constructed.

<!-- anchor: c.PyMethodDef.ml_doc | type: c member -->
#### `const char *ml_doc`

Points to the contents of the docstring.

The `ml_meth` is a C function pointer. The functions may be of different types, but they always return PyObject*. If the function is not of the `PyCFunction`, the compiler will require a cast in the method table. Even though `PyCFunction` defines the first parameter as PyObject*, it is common that the method implementation uses the specific C type of the *self* object.

The `ml_flags` field is a bitfield which can include the following flags. The individual flags indicate either a calling convention or a binding convention.

There are these calling conventions:

<!-- anchor: c.METH_VARARGS | type: c macro -->
### `METH_VARARGS`

*Part of the Stable ABI.*

This is the typical calling convention, where the methods have the type `PyCFunction`. The function expects two PyObject* values. The first one is the *self* object for methods; for module functions, it is the module object. The second parameter (often called *args*) is a tuple object representing all arguments. This parameter is typically processed using `PyArg_ParseTuple()` or `PyArg_UnpackTuple()`.

<!-- anchor: c.METH_KEYWORDS | type: c macro -->
### `METH_KEYWORDS`

Can only be used in certain combinations with other flags: METH_VARARGS | METH_KEYWORDS, METH_FASTCALL | METH_KEYWORDS and METH_METHOD | METH_FASTCALL | METH_KEYWORDS.

**METH_VARARGS | METH_KEYWORDS**

Methods with these flags must be of type `PyCFunctionWithKeywords`. The function expects three parameters: *self*, *args*, *kwargs* where *kwargs* is a dictionary of all the keyword arguments or possibly `NULL` if there are no keyword arguments. The parameters are typically processed using `PyArg_ParseTupleAndKeywords()`.

<!-- anchor: c.METH_FASTCALL | type: c macro -->
### `METH_FASTCALL`

*Part of the Stable ABI since version 3.10.*

Fast calling convention supporting only positional arguments. The methods have the type `PyCFunctionFast`. The first parameter is *self*, the second parameter is a C array of PyObject* values indicating the arguments and the third parameter is the number of arguments (the length of the array).

Added in version 3.7.

Changed in version 3.10: `METH_FASTCALL` is now part of the stable ABI.

**METH_FASTCALL | METH_KEYWORDS**

Extension of `METH_FASTCALL` supporting also keyword arguments, with methods of type `PyCFunctionFastWithKeywords`. Keyword arguments are passed the same way as in the vectorcall protocol: there is an additional fourth PyObject* parameter which is a tuple representing the names of the keyword arguments (which are guaranteed to be strings) or possibly `NULL` if there are no keywords. The values of the keyword arguments are stored in the *args* array, after the positional arguments.

Added in version 3.7.

<!-- anchor: c.METH_METHOD | type: c macro -->
### `METH_METHOD`

*Part of the Stable ABI since version 3.7.*

Can only be used in the combination with other flags: METH_METHOD | METH_FASTCALL | METH_KEYWORDS.

**METH_METHOD | METH_FASTCALL | METH_KEYWORDS**

Extension of METH_FASTCALL | METH_KEYWORDS supporting the *defining class*, that is, the class that contains the method in question. The defining class might be a superclass of `Py_TYPE(self)`.

The method needs to be of type `PyCMethod`, the same as for `METH_FASTCALL | METH_KEYWORDS` with `defining_class` argument added after `self`.

Added in version 3.9.

<!-- anchor: c.METH_NOARGS | type: c macro -->
### `METH_NOARGS`

*Part of the Stable ABI.*

Methods without parameters don’t need to check whether arguments are given if they are listed with the `METH_NOARGS` flag. They need to be of type `PyCFunction`. The first parameter is typically named *self* and will hold a reference to the module or object instance. In all cases the second parameter will be `NULL`.

The function must have 2 parameters. Since the second parameter is unused, `Py_UNUSED` can be used to prevent a compiler warning.

<!-- anchor: c.METH_O | type: c macro -->
### `METH_O`

*Part of the Stable ABI.*

Methods with a single object argument can be listed with the `METH_O` flag, instead of invoking `PyArg_ParseTuple()` with a `"O"` argument. They have the type `PyCFunction`, with the *self* parameter, and a PyObject* parameter representing the single argument.

These two constants are not used to indicate the calling convention but the binding when used with methods of classes. These may not be used for functions defined for modules. At most one of these flags may be set for any given method.

<!-- anchor: c.METH_CLASS | type: c macro -->
### `METH_CLASS`

*Part of the Stable ABI.*

The method will be passed the type object as the first parameter rather than an instance of the type. This is used to create *class methods*, similar to what is created when using the `@classmethod` built-in decorator.

<!-- anchor: c.METH_STATIC | type: c macro -->
### `METH_STATIC`

*Part of the Stable ABI.*

The method will be passed `NULL` as the first parameter rather than an instance of the type. This is used to create *static methods*, similar to what is created when using the `@staticmethod` built-in decorator.

One other constant controls whether a method is loaded in place of another definition with the same method name.

<!-- anchor: c.METH_COEXIST | type: c macro -->
### `METH_COEXIST`

*Part of the Stable ABI.*

The method will be loaded in place of existing definitions. Without *METH_COEXIST*, the default is to skip repeated definitions. Since slot wrappers are loaded before the method table, the existence of a *sq_contains* slot, for example, would generate a wrapped method named `__contains__()` and preclude the loading of a corresponding PyCFunction with the same name. With the flag defined, the PyCFunction will be loaded in place of the wrapper object and will co-exist with the slot. This is helpful because calls to PyCFunctions are optimized more than wrapper object calls.

<!-- anchor: c.PyCMethod_Type | type: c var -->
### `PyTypeObject PyCMethod_Type`

The type object corresponding to Python C method objects. This is available as `types.BuiltinMethodType` in the Python layer.

<!-- anchor: c.PyCMethod_Check | type: c function -->
### `int PyCMethod_Check(PyObject *op)`

Return true if *op* is an instance of the `PyCMethod_Type` type or a subtype of it. This function always succeeds.

<!-- anchor: c.PyCMethod_CheckExact | type: c function -->
### `int PyCMethod_CheckExact(PyObject *op)`

This is the same as `PyCMethod_Check()`, but does not account for subtypes.

<!-- anchor: c.PyCMethod_New | type: c function -->
### `PyObject *PyCMethod_New(PyMethodDef *ml, PyObject *self, PyObject *module, PyTypeObject *cls)`

*Return value: New reference.**Part of the Stable ABI since version 3.9.*

Turn *ml* into a Python callable object. The caller must ensure that *ml* outlives the callable. Typically, *ml* is defined as a static variable.

The *self* parameter will be passed as the *self* argument to the C function in `ml->ml_meth` when invoked. *self* can be `NULL`.

The callable object’s `__module__` attribute can be set from the given *module* argument. *module* should be a Python string, which will be used as name of the module the function is defined in. If unavailable, it can be set to `None` or `NULL`.

**See also:**

`function.__module__`

The *cls* parameter will be passed as the *defining_class* argument to the C function. Must be set if `METH_METHOD` is set on `ml->ml_flags`.

Added in version 3.9.

<!-- anchor: c.PyCFunction_Type | type: c var -->
### `PyTypeObject PyCFunction_Type`

*Part of the Stable ABI.*

The type object corresponding to Python C function objects. This is available as `types.BuiltinFunctionType` in the Python layer.

<!-- anchor: c.PyCFunction_Check | type: c function -->
### `int PyCFunction_Check(PyObject *op)`

Return true if *op* is an instance of the `PyCFunction_Type` type or a subtype of it. This function always succeeds.

<!-- anchor: c.PyCFunction_CheckExact | type: c function -->
### `int PyCFunction_CheckExact(PyObject *op)`

This is the same as `PyCFunction_Check()`, but does not account for subtypes.

<!-- anchor: c.PyCFunction_NewEx | type: c function -->
### `PyObject *PyCFunction_NewEx(PyMethodDef *ml, PyObject *self, PyObject *module)`

*Return value: New reference.**Part of the Stable ABI.*

Equivalent to `PyCMethod_New(ml, self, module, NULL)`.

<!-- anchor: c.PyCFunction_New | type: c function -->
### `PyObject *PyCFunction_New(PyMethodDef *ml, PyObject *self)`

*Return value: New reference.**Part of the Stable ABI since version 3.4.*

Equivalent to `PyCMethod_New(ml, self, NULL, NULL)`.

<!-- anchor: c.PyCFunction_GetFlags | type: c function -->
### `int PyCFunction_GetFlags(PyObject *func)`

*Part of the Stable ABI.*

Get the function’s flags on *func* as they were passed to `ml_flags`.

If *func* is not a C function object, this fails with an exception. *func* must not be `NULL`.

This function returns the function’s flags on success, and `-1` with an exception set on failure.

<!-- anchor: c.PyCFunction_GET_FLAGS | type: c function -->
### `int PyCFunction_GET_FLAGS(PyObject *func)`

This is the same as `PyCFunction_GetFlags()`, but without error or type checking.

<!-- anchor: c.PyCFunction_GetFunction | type: c function -->
### `PyCFunction PyCFunction_GetFunction(PyObject *func)`

*Part of the Stable ABI.*

Get the function pointer on *func* as it was passed to `ml_meth`.

If *func* is not a C function object, this fails with an exception. *func* must not be `NULL`.

This function returns the function pointer on success, and `NULL` with an exception set on failure.

<!-- anchor: c.PyCFunction_GET_FUNCTION | type: c function -->
### `int PyCFunction_GET_FUNCTION(PyObject *func)`

This is the same as `PyCFunction_GetFunction()`, but without error or type checking.

<!-- anchor: c.PyCFunction_GetSelf | type: c function -->
### `PyObject *PyCFunction_GetSelf(PyObject *func)`

*Part of the Stable ABI.*

Get the “self” object on *func*. This is the object that would be passed to the first argument of a `PyCFunction`. For C function objects created through a `PyMethodDef` on a `PyModuleDef`, this is the resulting module object.

If *func* is not a C function object, this fails with an exception. *func* must not be `NULL`.

This function returns a borrowed reference to the “self” object on success, and `NULL` with an exception set on failure.

<!-- anchor: c.PyCFunction_GET_SELF | type: c function -->
### `PyObject *PyCFunction_GET_SELF(PyObject *func)`

This is the same as `PyCFunction_GetSelf()`, but without error or type checking.

<!-- anchor: accessing-attributes-of-extension-types | type: section -->
## Accessing attributes of extension types

<!-- anchor: c.PyMemberDef | type: c type -->
### `type PyMemberDef`

*Part of the Stable ABI (including all members).*

Structure which describes an attribute of a type which corresponds to a C struct member. When defining a class, put a NULL-terminated array of these structures in the `tp_members` slot.

Its fields are, in order:

<!-- anchor: c.PyMemberDef.name | type: c member -->
#### `const char *name`

Name of the member. A NULL value marks the end of a `PyMemberDef[]` array.

The string should be static, no copy is made of it.

<!-- anchor: c.PyMemberDef.type | type: c member -->
#### `int type`

The type of the member in the C struct. See Member types for the possible values.

<!-- anchor: c.PyMemberDef.offset | type: c member -->
#### `Py_ssize_t offset`

The offset in bytes that the member is located on the type’s object struct.

<!-- anchor: c.PyMemberDef.flags | type: c member -->
#### `int flags`

Zero or more of the Member flags, combined using bitwise OR.

<!-- anchor: c.PyMemberDef.doc | type: c member -->
#### `const char *doc`

The docstring, or NULL. The string should be static, no copy is made of it. Typically, it is defined using `PyDoc_STR`.

By default (when `flags` is `0`), members allow both read and write access. Use the `Py_READONLY` flag for read-only access. Certain types, like `Py_T_STRING`, imply `Py_READONLY`. Only `Py_T_OBJECT_EX` (and legacy `T_OBJECT`) members can be deleted.

For heap-allocated types (created using `PyType_FromSpec()` or similar), `PyMemberDef` may contain a definition for the special member `"__vectorcalloffset__"`, corresponding to `tp_vectorcall_offset` in type objects. This member must be defined with `Py_T_PYSSIZET`, and either `Py_READONLY` or `Py_READONLY | Py_RELATIVE_OFFSET`. For example:

```c
static PyMemberDef spam_type_members[] = {
    {"__vectorcalloffset__", Py_T_PYSSIZET,
     offsetof(Spam_object, vectorcall), Py_READONLY},
    {NULL}  /* Sentinel */
};
```

(You may need to `#include <stddef.h>` for `offsetof()`.)

The legacy offsets `tp_dictoffset` and `tp_weaklistoffset` can be defined similarly using `"__dictoffset__"` and `"__weaklistoffset__"` members, but extensions are strongly encouraged to use `Py_TPFLAGS_MANAGED_DICT` and `Py_TPFLAGS_MANAGED_WEAKREF` instead.

Changed in version 3.12: `PyMemberDef` is always available. Previously, it required including `"structmember.h"`.

Changed in version 3.14: `Py_RELATIVE_OFFSET` is now allowed for `"__vectorcalloffset__"`, `"__dictoffset__"` and `"__weaklistoffset__"`.

<!-- anchor: c.PyMember_GetOne | type: c function -->
### `PyObject *PyMember_GetOne(const char *obj_addr, struct PyMemberDef *m)`

*Part of the Stable ABI.*

Get an attribute belonging to the object at address *obj_addr*. The attribute is described by `PyMemberDef` *m*. Returns `NULL` on error.

Changed in version 3.12: `PyMember_GetOne` is always available. Previously, it required including `"structmember.h"`.

<!-- anchor: c.PyMember_SetOne | type: c function -->
### `int PyMember_SetOne(char *obj_addr, struct PyMemberDef *m, PyObject *o)`

*Part of the Stable ABI.*

Set an attribute belonging to the object at address *obj_addr* to object *o*. The attribute to set is described by `PyMemberDef` *m*. Returns `0` if successful and a negative value on failure.

Changed in version 3.12: `PyMember_SetOne` is always available. Previously, it required including `"structmember.h"`.

<!-- anchor: member-flags | type: section -->
### Member flags

The following flags can be used with `PyMemberDef.flags`:

<!-- anchor: c.Py_READONLY | type: c macro -->
#### `Py_READONLY`

*Part of the Stable ABI since version 3.12.*

Not writable.

<!-- anchor: c.Py_AUDIT_READ | type: c macro -->
#### `Py_AUDIT_READ`

*Part of the Stable ABI since version 3.12.*

Emit an `object.__getattr__` audit event before reading.

<!-- anchor: c.Py_RELATIVE_OFFSET | type: c macro -->
#### `Py_RELATIVE_OFFSET`

*Part of the Stable ABI since version 3.12.*

Indicates that the `offset` of this `PyMemberDef` entry indicates an offset from the subclass-specific data, rather than from `PyObject`.

Can only be used as part of the `Py_tp_members` `slot` when creating a class using negative `basicsize`. It is mandatory in that case. When setting `tp_members` from the slot during class creation, Python clears the flag and sets `PyMemberDef.offset` to the offset from the `PyObject` struct.

Changed in version 3.10: The `RESTRICTED`, `READ_RESTRICTED` and `WRITE_RESTRICTED` macros available with `#include "structmember.h"` are deprecated. `READ_RESTRICTED` and `RESTRICTED` are equivalent to `Py_AUDIT_READ`; `WRITE_RESTRICTED` does nothing.

Changed in version 3.12: The `READONLY` macro was renamed to `Py_READONLY`. The `PY_AUDIT_READ` macro was renamed with the `Py_` prefix. The new names are now always available. Previously, these required `#include "structmember.h"`. The header is still available and it provides the old names.

<!-- anchor: member-types | type: section -->
### Member types

`PyMemberDef.type` can be one of the following macros corresponding to various C types. When the member is accessed in Python, it will be converted to the equivalent Python type. When it is set from Python, it will be converted back to the C type. If that is not possible, an exception such as `TypeError` or `ValueError` is raised.

Unless marked (D), attributes defined this way cannot be deleted using e.g. `del` or `delattr()`.

| Macro name | C type | Python type |
| --- | --- | --- |
| `Py_T_BYTE` *Part of the Stable ABI since version 3.12.* | char | `int` |
| `Py_T_SHORT` *Part of the Stable ABI since version 3.12.* | short | `int` |
| `Py_T_INT` *Part of the Stable ABI since version 3.12.* | int | `int` |
| `Py_T_LONG` *Part of the Stable ABI since version 3.12.* | long | `int` |
| `Py_T_LONGLONG` *Part of the Stable ABI since version 3.12.* | long long | `int` |
| `Py_T_UBYTE` *Part of the Stable ABI since version 3.12.* | unsigned char | `int` |
| `Py_T_UINT` *Part of the Stable ABI since version 3.12.* | unsigned int | `int` |
| `Py_T_USHORT` *Part of the Stable ABI since version 3.12.* | unsigned short | `int` |
| `Py_T_ULONG` *Part of the Stable ABI since version 3.12.* | unsigned long | `int` |
| `Py_T_ULONGLONG` *Part of the Stable ABI since version 3.12.* | unsigned long long | `int` |
| `Py_T_PYSSIZET` *Part of the Stable ABI since version 3.12.* | Py_ssize_t | `int` |
| `Py_T_FLOAT` *Part of the Stable ABI since version 3.12.* | float | `float` |
| `Py_T_DOUBLE` *Part of the Stable ABI since version 3.12.* | double | `float` |
| `Py_T_BOOL` *Part of the Stable ABI since version 3.12.* | char (written as 0 or 1) | `bool` |
| `Py_T_STRING` *Part of the Stable ABI since version 3.12.* | const char* (*) | `str` (RO) |
| `Py_T_STRING_INPLACE` *Part of the Stable ABI since version 3.12.* | const char[] (*) | `str` (RO) |
| `Py_T_CHAR` *Part of the Stable ABI since version 3.12.* | char (0-127) | `str` (**) |
| `Py_T_OBJECT_EX` *Part of the Stable ABI since version 3.12.* | PyObject* | `object` (D) |

(*): Zero-terminated, UTF8-encoded C string. With `Py_T_STRING` the C representation is a pointer; with `Py_T_STRING_INPLACE` the string is stored directly in the structure.

(**): String of length 1. Only ASCII is accepted.

(RO): Implies `Py_READONLY`.

(D): Can be deleted, in which case the pointer is set to `NULL`. Reading a `NULL` pointer raises `AttributeError`.

Added in version 3.12: In previous versions, the macros were only available with `#include "structmember.h"` and were named without the `Py_` prefix (e.g. as `T_INT`). The header is still available and contains the old names, along with the following deprecated types:

<!-- anchor: c.T_OBJECT | type: c macro -->
#### `T_OBJECT`

Like `Py_T_OBJECT_EX`, but `NULL` is converted to `None`. This results in surprising behavior in Python: deleting the attribute effectively sets it to `None`.

<!-- anchor: c.T_NONE | type: c macro -->
#### `T_NONE`

Always `None`. Must be used with `Py_READONLY`.

<!-- anchor: defining-getters-and-setters | type: section -->
### Defining Getters and Setters

<!-- anchor: c.PyGetSetDef | type: c type -->
#### `type PyGetSetDef`

*Part of the Stable ABI (including all members).*

Structure to define property-like access for a type. See also description of the `PyTypeObject.tp_getset` slot.

<!-- anchor: c.PyGetSetDef.name | type: c member -->
##### `const char *name`

attribute name

<!-- anchor: c.PyGetSetDef.get | type: c member -->
##### `getter get`

C function to get the attribute.

<!-- anchor: c.PyGetSetDef.set | type: c member -->
##### `setter set`

Optional C function to set or delete the attribute. If `NULL`, the attribute is read-only.

<!-- anchor: c.PyGetSetDef.doc | type: c member -->
##### `const char *doc`

optional docstring

<!-- anchor: c.PyGetSetDef.closure | type: c member -->
##### `void *closure`

Optional user data pointer, providing additional data for getter and setter.

<!-- anchor: c.getter | type: c type -->
#### `typedef PyObject *(*getter)(PyObject*, void*)`

*Part of the Stable ABI.*

The `get` function takes one PyObject* parameter (the instance) and a user data pointer (the associated `closure`):

It should return a new reference on success or `NULL` with a set exception on failure.

<!-- anchor: c.setter | type: c type -->
#### `typedef int (*setter)(PyObject*, PyObject*, void*)`

*Part of the Stable ABI.*

`set` functions take two PyObject* parameters (the instance and the value to be set) and a user data pointer (the associated `closure`):

In case the attribute should be deleted the second parameter is `NULL`. Should return `0` on success or `-1` with a set exception on failure.
