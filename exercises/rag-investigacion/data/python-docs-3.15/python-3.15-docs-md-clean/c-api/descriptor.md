# Descriptor Objects

“Descriptors” are objects that describe some attribute of an object. They are
found in the dictionary of type objects.

PyObject \*PyDescr\_NewGetSet(PyTypeObject \*type, struct PyGetSetDef \*getset)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Create a new get-set descriptor for extension type *type* from the
    `PyGetSetDef` structure *getset*.

    Get-set descriptors expose attributes implemented by C getter and setter
    functions rather than stored directly in the instance. This is the same kind
    of descriptor created for entries in `tp_getset`, and
    it appears in Python as a `types.GetSetDescriptorType` object.

    On success, return a strong reference to the descriptor. Return
    `NULL` with an exception set on failure.

PyObject \*PyDescr\_NewMember(PyTypeObject \*type, struct PyMemberDef \*member)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Create a new member descriptor for extension type *type* from the
    `PyMemberDef` structure *member*.

    Member descriptors expose fields in the type’s C struct as Python
    attributes. This is the same kind of descriptor created for entries in
    `tp_members`, and it appears in Python as a
    `types.MemberDescriptorType` object.

    On success, return a strong reference to the descriptor. Return
    `NULL` with an exception set on failure.

PyTypeObject PyMemberDescr\_Type
:   *Part of the Stable ABI.*

    The type object for member descriptor objects created from
    `PyMemberDef` structures. These descriptors expose fields of a
    C struct as attributes on a type, and correspond
    to `types.MemberDescriptorType` objects in Python.

PyTypeObject PyGetSetDescr\_Type
:   *Part of the Stable ABI.*

    The type object for get/set descriptor objects created from
    `PyGetSetDef` structures. These descriptors implement attributes
    whose value is computed by C getter and setter functions, and are used
    for many built-in type attributes. They correspond to
    `types.GetSetDescriptorType` objects in Python.

PyObject \*PyDescr\_NewMethod(PyTypeObject \*type, struct PyMethodDef \*meth)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Create a new method descriptor for extension type *type* from the
    `PyMethodDef` structure *meth*.

    Method descriptors expose C functions as methods on a type. This is the same
    kind of descriptor created for entries in
    `tp_methods`, and it appears in Python as a
    `types.MethodDescriptorType` object.

    On success, return a strong reference to the descriptor. Return
    `NULL` with an exception set on failure.

PyTypeObject PyMethodDescr\_Type
:   *Part of the Stable ABI.*

    The type object for method descriptor objects created from
    `PyMethodDef` structures. These descriptors expose C functions as
    methods on a type, and correspond to `types.MethodDescriptorType`
    objects in Python.

PyTypeObject PyWrapperDescr\_Type
:   *Part of the Stable ABI.*

    The type object for wrapper descriptor objects created by
    `PyDescr_NewWrapper()` and `PyWrapper_New()`.

    Wrapper descriptors are used internally to expose special methods
    such as `__repr__` or `__add__`, which are implemented by type slots.
    The type is exposed in Python as `types.WrapperDescriptorType`.

PyObject \*PyDescr\_NewWrapper(PyTypeObject \*type, struct wrapperbase \*base, void \*wrapped)
:   *Return value: New reference.*

    Create a new wrapper descriptor of type `PyWrapperDescr_Type`.

    This function is meant for internal use only; it and
    related API (`struct wrapperbase` and the `PyWrapperFlag_KEYWORDS`
    flag) are exposed publicly for backwards compatibility reasons.

    See `PyCMethod_New()` for wrapping a C function.

PyObject \*PyDescr\_NewClassMethod(PyTypeObject \*type, PyMethodDef \*method)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Create a new class method descriptor for extension type *type* from the
    `PyMethodDef` structure *method*.

    Class method descriptors expose C methods that receive the class rather than
    an instance when accessed. This is the same kind of descriptor created for
    `METH_CLASS` entries in `tp_methods`, and it
    appears in Python as a `types.ClassMethodDescriptorType` object.

    On success, return a strong reference to the descriptor. Return
    `NULL` with an exception set on failure.

int PyDescr\_IsData(PyObject \*descr)
:   Return non-zero if the descriptor object *descr* describes a data attribute, or
    `0` if it describes a method. *descr* must be a descriptor object; there is
    no error checking.

PyObject \*PyWrapper\_New(PyObject \*d, PyObject \*self)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Create a new bound wrapper object from the wrapper descriptor *d* and the
    instance *self*.

    This is the bound form of a wrapper descriptor created by
    `PyDescr_NewWrapper()`. CPython creates these objects when a slot
    wrapper is accessed through an instance, and they appear in Python as
    `types.MethodWrapperType` objects.

    On success, return a strong reference to the wrapper object. Return
    `NULL` with an exception set on failure.

PyDescr\_TYPE(descr)
:   Return a borrowed reference to the type that the descriptor
    *descr* belongs to. This is accessible as `__objclass__`
    in Python.

    *descr* must be a descriptor object created by one of the
    `PyDescr_New*` functions (an instance of
    `PyMethodDescr_Type`, `PyClassMethodDescr_Type`,
    `PyMemberDescr_Type`, `PyGetSetDescr_Type`, or
    `PyWrapperDescr_Type`). If the passed descriptor is not
    an instance of one of these types, the behavior is undefined.

PyDescr\_NAME(descr)
:   Return the name of the descriptor *descr* as a borrowed reference
    to a `str` object. This is available as `__name__`
    in Python.

    *descr* must be a descriptor object created by one of the `PyDescr_New*`
    functions. If not, the behavior is undefined.

PyDescr\_COMMON
:   This is a macro including the common fields for a
    descriptor object.

    This was included in Python’s C API by mistake; do not use it in extensions.
    For creating custom descriptor objects, create a class implementing the
    descriptor protocol (`tp_descr_get` and
    `tp_descr_set`).

    Soft deprecated since version 3.15.

## Built-in descriptors

PyTypeObject PyProperty\_Type
:   *Part of the Stable ABI.*

    The type object for property objects. This is the same object as
    `property` in the Python layer.

PyTypeObject PySuper\_Type
:   *Part of the Stable ABI.*

    The type object for super objects. This is the same object as
    `super` in the Python layer.

PyTypeObject PyClassMethod\_Type
:   The type of class method objects. This is the same object as
    `classmethod` in the Python layer.

PyTypeObject PyClassMethodDescr\_Type
:   *Part of the Stable ABI.*

    The type object for C-level class method descriptor objects.
    This is the type of the descriptors created for `classmethod()` defined
    in C extension types, and corresponds to
    `types.ClassMethodDescriptorType` objects in Python.

PyObject \*PyClassMethod\_New(PyObject \*callable)
:   Create a new `classmethod` object wrapping *callable*.
    *callable* must be a callable object and must not be `NULL`.

    On success, this function returns a strong reference to a new class
    method descriptor. On failure, this function returns `NULL` with an
    exception set.

PyTypeObject PyStaticMethod\_Type
:   The type of static method objects. This is the same object as
    `staticmethod` in the Python layer.

PyObject \*PyStaticMethod\_New(PyObject \*callable)
:   Create a new `staticmethod` object wrapping *callable*.
    *callable* must be a callable object and must not be `NULL`.

    On success, this function returns a strong reference to a new static
    method descriptor. On failure, this function returns `NULL` with an
    exception set.
