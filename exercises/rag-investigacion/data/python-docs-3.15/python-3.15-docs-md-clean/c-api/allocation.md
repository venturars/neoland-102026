# Allocating objects on the heap

PyObject \*\_PyObject\_New(PyTypeObject \*type)
:   *Return value: New reference.*

PyVarObject \*\_PyObject\_NewVar(PyTypeObject \*type, Py\_ssize\_t size)
:   *Return value: New reference.*

PyObject \*PyObject\_Init(PyObject \*op, PyTypeObject \*type)
:   *Return value: Borrowed reference.* *Part of the Stable ABI.*

    Initialize a newly allocated object *op* with its type and initial
    reference. Returns the initialized object. Other fields of the object are
    not initialized. Despite its name, this function is unrelated to the
    object’s `__init__()` method (`tp_init`
    slot). Specifically, this function does **not** call the object’s
    `__init__()` method.

    In general, consider this function to be a low-level routine. Use
    `tp_alloc` where possible.
    For implementing `tp_alloc` for your type, prefer
    `PyType_GenericAlloc()` or `PyObject_New()`.

    Note

    This function only initializes the object’s memory corresponding to the
    initial `PyObject` structure. It does not zero the rest.

PyVarObject \*PyObject\_InitVar(PyVarObject \*op, PyTypeObject \*type, Py\_ssize\_t size)
:   *Return value: Borrowed reference.* *Part of the Stable ABI.*

    This does everything `PyObject_Init()` does, and also initializes the
    length information for a variable-size object.

    Note

    This function only initializes some of the object’s memory. It does not
    zero the rest.

PyObject\_New(TYPE, typeobj)
:   Allocates a new Python object using the C structure type *TYPE* and the
    Python type object *typeobj* (`PyTypeObject*`) by calling
    `PyObject_Malloc()` to allocate memory and initializing it like
    `PyObject_Init()`. The caller will own the only reference to the
    object (i.e. its reference count will be one).

    Avoid calling this directly to allocate memory for an object; call the type’s
    `tp_alloc` slot instead.

    When populating a type’s `tp_alloc` slot,
    `PyType_GenericAlloc()` is preferred over a custom function that
    simply calls this macro.

    This macro does not call `tp_alloc`,
    `tp_new` (`__new__()`), or
    `tp_init` (`__init__()`).

    This cannot be used for objects with `Py_TPFLAGS_HAVE_GC` set in
    `tp_flags`; use `PyObject_GC_New` instead.

    Memory allocated by this macro must be freed with `PyObject_Free()`
    (usually called via the object’s `tp_free` slot).

    Note

    The returned memory is not guaranteed to have been completely zeroed
    before it was initialized.

    Note

    This macro does not construct a fully initialized object of the given
    type; it merely allocates memory and prepares it for further
    initialization by `tp_init`. To construct a
    fully initialized object, call *typeobj* instead. For example:

    ```
    PyObject *foo = PyObject_CallNoArgs((PyObject *)&PyFoo_Type);
    ```

    See also

    - `PyObject_Free()`
    - `PyObject_GC_New`
    - `PyType_GenericAlloc()`
    - `tp_alloc`

PyObject\_NewVar(TYPE, typeobj, size)
:   Like `PyObject_New` except:

    - It allocates enough memory for the *TYPE* structure plus *size*
      (`Py_ssize_t`) fields of the size given by the
      `tp_itemsize` field of *typeobj*.
    - The memory is initialized like `PyObject_InitVar()`.

    This is useful for implementing objects like tuples, which are able to
    determine their size at construction time. Embedding the array of fields
    into the same allocation decreases the number of allocations, improving the
    memory management efficiency.

    Avoid calling this directly to allocate memory for an object; call the type’s
    `tp_alloc` slot instead.

    When populating a type’s `tp_alloc` slot,
    `PyType_GenericAlloc()` is preferred over a custom function that
    simply calls this macro.

    This cannot be used for objects with `Py_TPFLAGS_HAVE_GC` set in
    `tp_flags`; use `PyObject_GC_NewVar`
    instead.

    Memory allocated by this function must be freed with `PyObject_Free()`
    (usually called via the object’s `tp_free` slot).

    Note

    The returned memory is not guaranteed to have been completely zeroed
    before it was initialized.

    Note

    This macro does not construct a fully initialized object of the given
    type; it merely allocates memory and prepares it for further
    initialization by `tp_init`. To construct a
    fully initialized object, call *typeobj* instead. For example:

    ```
    PyObject *list_instance = PyObject_CallNoArgs((PyObject *)&PyList_Type);
    ```

    See also

    - `PyObject_Free()`
    - `PyObject_GC_NewVar`
    - `PyType_GenericAlloc()`
    - `tp_alloc`

PyObject \_Py\_NoneStruct
:   Object which is visible in Python as `None`. This should only be accessed
    using the `Py_None` macro, which evaluates to a pointer to this
    object.

See also

Module Objects
:   To allocate and create extension modules.

## Soft-deprecated aliases

Soft deprecated since version 3.15.

These are aliases to existing functions and macros.
They exist solely for backwards compatibility.

| Soft-deprecated alias | Function |
| --- | --- |
| PyObject\_NEW(type, typeobj) | `PyObject_New` |
| PyObject\_NEW\_VAR(type, typeobj, n) | `PyObject_NewVar` |
| PyObject\_INIT(op, typeobj) | `PyObject_Init()` |
| PyObject\_INIT\_VAR(op, typeobj, n) | `PyObject_InitVar()` |
| PyObject\_MALLOC(n) | `PyObject_Malloc()` |
| PyObject\_REALLOC(p, n) | `PyObject_Realloc()` |
| PyObject\_FREE(p) | `PyObject_Free()` |
| PyObject\_DEL(p) | `PyObject_Free()` |
| PyObject\_Del(p) | `PyObject_Free()` |
