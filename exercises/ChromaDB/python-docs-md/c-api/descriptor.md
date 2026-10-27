---
page: c-api/descriptor.html
title: Descriptor Objects
area: c-api
kind: guide
---

<!-- anchor: descriptor-objects | type: section -->
# Descriptor Objects

“Descriptors” are objects that describe some attribute of an object. They are found in the dictionary of type objects.

<!-- anchor: c.PyDescr_NewGetSet | type: c function -->
## `PyObject *PyDescr_NewGetSet(PyTypeObject *type, struct PyGetSetDef *getset)`

*Return value: New reference.**Part of the Stable ABI.*

Create a new get-set descriptor for extension type *type* from the `PyGetSetDef` structure *getset*.

Get-set descriptors expose attributes implemented by C getter and setter functions rather than stored directly in the instance. This is the same kind of descriptor created for entries in `tp_getset`, and it appears in Python as a `types.GetSetDescriptorType` object.

On success, return a strong reference to the descriptor. Return `NULL` with an exception set on failure.

<!-- anchor: c.PyDescr_NewMember | type: c function -->
## `PyObject *PyDescr_NewMember(PyTypeObject *type, struct PyMemberDef *member)`

*Return value: New reference.**Part of the Stable ABI.*

Create a new member descriptor for extension type *type* from the `PyMemberDef` structure *member*.

Member descriptors expose fields in the type’s C struct as Python attributes. This is the same kind of descriptor created for entries in `tp_members`, and it appears in Python as a `types.MemberDescriptorType` object.

On success, return a strong reference to the descriptor. Return `NULL` with an exception set on failure.

<!-- anchor: c.PyMemberDescr_Type | type: c var -->
## `PyTypeObject PyMemberDescr_Type`

*Part of the Stable ABI.*

The type object for member descriptor objects created from `PyMemberDef` structures. These descriptors expose fields of a C struct as attributes on a type, and correspond to `types.MemberDescriptorType` objects in Python.

<!-- anchor: c.PyGetSetDescr_Type | type: c var -->
## `PyTypeObject PyGetSetDescr_Type`

*Part of the Stable ABI.*

The type object for get/set descriptor objects created from `PyGetSetDef` structures. These descriptors implement attributes whose value is computed by C getter and setter functions, and are used for many built-in type attributes. They correspond to `types.GetSetDescriptorType` objects in Python.

<!-- anchor: c.PyDescr_NewMethod | type: c function -->
## `PyObject *PyDescr_NewMethod(PyTypeObject *type, struct PyMethodDef *meth)`

*Return value: New reference.**Part of the Stable ABI.*

Create a new method descriptor for extension type *type* from the `PyMethodDef` structure *meth*.

Method descriptors expose C functions as methods on a type. This is the same kind of descriptor created for entries in `tp_methods`, and it appears in Python as a `types.MethodDescriptorType` object.

On success, return a strong reference to the descriptor. Return `NULL` with an exception set on failure.

<!-- anchor: c.PyMethodDescr_Type | type: c var -->
## `PyTypeObject PyMethodDescr_Type`

*Part of the Stable ABI.*

The type object for method descriptor objects created from `PyMethodDef` structures. These descriptors expose C functions as methods on a type, and correspond to `types.MethodDescriptorType` objects in Python.

<!-- anchor: c.wrapperbase | type: c struct -->
## `struct wrapperbase`

Describes a slot wrapper used by `PyDescr_NewWrapper()`.

Each `wrapperbase` record stores the Python-visible name and metadata for a special method implemented by a type slot, together with the wrapper function used to adapt that slot to Python’s calling convention.

<!-- anchor: c.PyDescr_NewWrapper | type: c function -->
## `PyObject *PyDescr_NewWrapper(PyTypeObject *type, struct wrapperbase *base, void *wrapped)`

*Return value: New reference.*

Create a new wrapper descriptor for extension type *type* from the `wrapperbase` structure *base* and the wrapped slot function pointer *wrapped*.

Wrapper descriptors expose special methods implemented by type slots. This is the same kind of descriptor that CPython creates for slot-based special methods such as `__repr__` or `__add__`, and it appears in Python as a `types.WrapperDescriptorType` object.

On success, return a strong reference to the descriptor. Return `NULL` with an exception set on failure.

<!-- anchor: c.PyWrapperDescr_Type | type: c var -->
## `PyTypeObject PyWrapperDescr_Type`

*Part of the Stable ABI.*

The type object for wrapper descriptor objects created by `PyDescr_NewWrapper()` and `PyWrapper_New()`. Wrapper descriptors are used internally to expose special methods implemented via wrapper structures, and appear in Python as `types.WrapperDescriptorType` objects.

<!-- anchor: c.PyDescr_NewClassMethod | type: c function -->
## `PyObject *PyDescr_NewClassMethod(PyTypeObject *type, PyMethodDef *method)`

*Return value: New reference.**Part of the Stable ABI.*

Create a new class method descriptor for extension type *type* from the `PyMethodDef` structure *method*.

Class method descriptors expose C methods that receive the class rather than an instance when accessed. This is the same kind of descriptor created for `METH_CLASS` entries in `tp_methods`, and it appears in Python as a `types.ClassMethodDescriptorType` object.

On success, return a strong reference to the descriptor. Return `NULL` with an exception set on failure.

<!-- anchor: c.PyDescr_IsData | type: c function -->
## `int PyDescr_IsData(PyObject *descr)`

Return non-zero if the descriptor object *descr* describes a data attribute, or `0` if it describes a method. *descr* must be a descriptor object; there is no error checking.

<!-- anchor: c.PyWrapper_New | type: c function -->
## `PyObject *PyWrapper_New(PyObject *d, PyObject *self)`

*Return value: New reference.**Part of the Stable ABI.*

Create a new bound wrapper object from the wrapper descriptor *d* and the instance *self*.

This is the bound form of a wrapper descriptor created by `PyDescr_NewWrapper()`. CPython creates these objects when a slot wrapper is accessed through an instance, and they appear in Python as `types.MethodWrapperType` objects.

On success, return a strong reference to the wrapper object. Return `NULL` with an exception set on failure.

<!-- anchor: c.PyDescr_COMMON | type: c macro -->
## `PyDescr_COMMON`

This is a macro including the common fields for a descriptor object.

This was included in Python’s C API by mistake; do not use it in extensions. For creating custom descriptor objects, create a class implementing the descriptor protocol (`tp_descr_get` and `tp_descr_set`).

Soft deprecated since version 3.15.

<!-- anchor: built-in-descriptors | type: section -->
## Built-in descriptors

<!-- anchor: c.PyProperty_Type | type: c var -->
### `PyTypeObject PyProperty_Type`

*Part of the Stable ABI.*

The type object for property objects. This is the same object as `property` in the Python layer.

<!-- anchor: c.PySuper_Type | type: c var -->
### `PyTypeObject PySuper_Type`

*Part of the Stable ABI.*

The type object for super objects. This is the same object as `super` in the Python layer.

<!-- anchor: c.PyClassMethod_Type | type: c var -->
### `PyTypeObject PyClassMethod_Type`

The type of class method objects. This is the same object as `classmethod` in the Python layer.

<!-- anchor: c.PyClassMethodDescr_Type | type: c var -->
### `PyTypeObject PyClassMethodDescr_Type`

*Part of the Stable ABI.*

The type object for C-level class method descriptor objects. This is the type of the descriptors created for `classmethod()` defined in C extension types, and corresponds to `types.ClassMethodDescriptorType` objects in Python.

<!-- anchor: c.PyClassMethod_New | type: c function -->
### `PyObject *PyClassMethod_New(PyObject *callable)`

Create a new `classmethod` object wrapping *callable*. *callable* must be a callable object and must not be `NULL`.

On success, this function returns a strong reference to a new class method descriptor. On failure, this function returns `NULL` with an exception set.

<!-- anchor: c.PyStaticMethod_Type | type: c var -->
### `PyTypeObject PyStaticMethod_Type`

The type of static method objects. This is the same object as `staticmethod` in the Python layer.

<!-- anchor: c.PyStaticMethod_New | type: c function -->
### `PyObject *PyStaticMethod_New(PyObject *callable)`

Create a new `staticmethod` object wrapping *callable*. *callable* must be a callable object and must not be `NULL`.

On success, this function returns a strong reference to a new static method descriptor. On failure, this function returns `NULL` with an exception set.
