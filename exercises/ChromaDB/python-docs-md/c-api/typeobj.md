---
page: c-api/typeobj.html
title: Type Object Structures
area: c-api
kind: guide
---

<!-- anchor: type-object-structures | type: section -->
# Type Object Structures

Perhaps one of the most important structures of the Python object system is the structure that defines a new type: the `PyTypeObject` structure. Type objects can be handled using any of the `PyObject_*` or `PyType_*` functions, but do not offer much that’s interesting to most Python applications. These objects are fundamental to how objects behave, so they are very important to the interpreter itself and to any extension module that implements new types.

Type objects are fairly large compared to most of the standard types. The reason for the size is that each type object stores a large number of values, mostly C function pointers, each of which implements a small part of the type’s functionality. The fields of the type object are examined in detail in this section. The fields will be described in the order in which they occur in the structure.

In addition to the following quick reference, the Examples section provides at-a-glance insight into the meaning and use of `PyTypeObject`.

<!-- anchor: quick-reference | type: section -->
## Quick Reference

<!-- anchor: tp-slots | type: section -->
### “tp slots”

- PyTypeObject Slot [1] | Type | special methods/attrs | Info [2]
- O | T | D | I
- <R> `tp_name` | const char * | __name__ | X | X |  | 
- `tp_basicsize` | `Py_ssize_t` |  | X | X |  | X
- `tp_itemsize` | `Py_ssize_t` |  |  | X |  | X
- `tp_dealloc` | `destructor` |  | X | X |  | X
- `tp_vectorcall_offset` | `Py_ssize_t` |  |  | X |  | X
- (`tp_getattr`) | `getattrfunc` | __getattribute__, __getattr__ |  |  |  | G
- (`tp_setattr`) | `setattrfunc` | __setattr__, __delattr__ |  |  |  | G
- `tp_as_async` | `PyAsyncMethods` * | sub-slots |  |  |  | %
- `tp_repr` | `reprfunc` | __repr__ | X | X |  | X
- `tp_as_number` | `PyNumberMethods` * | sub-slots |  |  |  | %
- `tp_as_sequence` | `PySequenceMethods` * | sub-slots |  |  |  | %
- `tp_as_mapping` | `PyMappingMethods` * | sub-slots |  |  |  | %
- `tp_hash` | `hashfunc` | __hash__ | X |  |  | G
- `tp_call` | `ternaryfunc` | __call__ |  | X |  | X
- `tp_str` | `reprfunc` | __str__ | X |  |  | X
- `tp_getattro` | `getattrofunc` | __getattribute__, __getattr__ | X | X |  | G
- `tp_setattro` | `setattrofunc` | __setattr__, __delattr__ | X | X |  | G
- `tp_as_buffer` | `PyBufferProcs` * | sub-slots |  |  |  | %
- `tp_flags` | unsigned long |  | X | X |  | ?
- `tp_doc` | const char * | __doc__ | X | X |  | 
- `tp_traverse` | `traverseproc` |  |  | X |  | G
- `tp_clear` | `inquiry` |  |  | X |  | G
- `tp_richcompare` | `richcmpfunc` | __lt__, __le__, __eq__, __ne__, __gt__, __ge__ | X |  |  | G
- (`tp_weaklistoffset`) | `Py_ssize_t` |  |  | X |  | ?
- `tp_iter` | `getiterfunc` | __iter__ |  |  |  | X
- `tp_iternext` | `iternextfunc` | __next__ |  |  |  | X
- `tp_methods` | `PyMethodDef` [] |  | X | X |  | 
- `tp_members` | `PyMemberDef` [] |  |  | X |  | 
- `tp_getset` | `PyGetSetDef` [] |  | X | X |  | 
- `tp_base` | `PyTypeObject` * | __base__ |  |  | X | 
- `tp_dict` | `PyObject` * | __dict__ |  |  | ? | 
- `tp_descr_get` | `descrgetfunc` | __get__ |  |  |  | X
- `tp_descr_set` | `descrsetfunc` | __set__, __delete__ |  |  |  | X
- (`tp_dictoffset`) | `Py_ssize_t` |  |  | X |  | ?
- `tp_init` | `initproc` | __init__ | X | X |  | X
- `tp_alloc` | `allocfunc` |  | X |  | ? | ?
- `tp_new` | `newfunc` | __new__ | X | X | ? | ?
- `tp_free` | `freefunc` |  | X | X | ? | ?
- `tp_is_gc` | `inquiry` |  |  | X |  | X
- <`tp_bases`> | `PyObject` * | __bases__ |  |  | ~ | 
- <`tp_mro`> | `PyObject` * | __mro__ |  |  | ~ | 
- [`tp_cache`] | `PyObject` * |  |  |  | 
- [`tp_subclasses`] | void * | __subclasses__ |  |  | 
- [`tp_weaklist`] | `PyObject` * |  |  |  | 
- (`tp_del`) | `destructor` |  |  |  |  | 
- [`tp_version_tag`] | unsigned int |  |  |  | 
- `tp_finalize` | `destructor` | __del__ |  |  |  | X
- `tp_vectorcall` | `vectorcallfunc` |  |  |  |  | 
- [`tp_watched`] | unsigned char |  |  |  |  | 

[1]

**()**: A slot name in parentheses indicates it is (effectively) deprecated.

**<>**: Names in angle brackets should be initially set to `NULL` and treated as read-only.

**[]**: Names in square brackets are for internal use only.

**<R>** (as a prefix) means the field is required (must be non-`NULL`).

[2]

Columns:

**“O”**: set on `PyBaseObject_Type`

**“T”**: set on `PyType_Type`

**“D”**: default (if slot is set to `NULL`)

```
X - PyType_Ready sets this value if it is NULL
~ - PyType_Ready always sets this value (it should be NULL)
? - PyType_Ready may set this value depending on other slots

Also see the inheritance column ("I").
```

**“I”**: inheritance

```
X - type slot is inherited via *PyType_Ready* if defined with a *NULL* value
% - the slots of the sub-struct are inherited individually
G - inherited, but only in combination with other slots; see the slot's description
? - it's complicated; see the slot's description
```

Note that some slots are effectively inherited through the normal attribute lookup chain.

<!-- anchor: sub-slots | type: section -->
### sub-slots

- Slot | Type | special methods
- `am_await` | `unaryfunc` | __await__
- `am_aiter` | `unaryfunc` | __aiter__
- `am_anext` | `unaryfunc` | __anext__
- `am_send` | `sendfunc` | 
- 
- `nb_add` | `binaryfunc` | __add__ __radd__
- `nb_inplace_add` | `binaryfunc` | __iadd__
- `nb_subtract` | `binaryfunc` | __sub__ __rsub__
- `nb_inplace_subtract` | `binaryfunc` | __isub__
- `nb_multiply` | `binaryfunc` | __mul__ __rmul__
- `nb_inplace_multiply` | `binaryfunc` | __imul__
- `nb_remainder` | `binaryfunc` | __mod__ __rmod__
- `nb_inplace_remainder` | `binaryfunc` | __imod__
- `nb_divmod` | `binaryfunc` | __divmod__ __rdivmod__
- `nb_power` | `ternaryfunc` | __pow__ __rpow__
- `nb_inplace_power` | `ternaryfunc` | __ipow__
- `nb_negative` | `unaryfunc` | __neg__
- `nb_positive` | `unaryfunc` | __pos__
- `nb_absolute` | `unaryfunc` | __abs__
- `nb_bool` | `inquiry` | __bool__
- `nb_invert` | `unaryfunc` | __invert__
- `nb_lshift` | `binaryfunc` | __lshift__ __rlshift__
- `nb_inplace_lshift` | `binaryfunc` | __ilshift__
- `nb_rshift` | `binaryfunc` | __rshift__ __rrshift__
- `nb_inplace_rshift` | `binaryfunc` | __irshift__
- `nb_and` | `binaryfunc` | __and__ __rand__
- `nb_inplace_and` | `binaryfunc` | __iand__
- `nb_xor` | `binaryfunc` | __xor__ __rxor__
- `nb_inplace_xor` | `binaryfunc` | __ixor__
- `nb_or` | `binaryfunc` | __or__ __ror__
- `nb_inplace_or` | `binaryfunc` | __ior__
- `nb_int` | `unaryfunc` | __int__
- `nb_reserved` | void * | 
- `nb_float` | `unaryfunc` | __float__
- `nb_floor_divide` | `binaryfunc` | __floordiv__
- `nb_inplace_floor_divide` | `binaryfunc` | __ifloordiv__
- `nb_true_divide` | `binaryfunc` | __truediv__
- `nb_inplace_true_divide` | `binaryfunc` | __itruediv__
- `nb_index` | `unaryfunc` | __index__
- `nb_matrix_multiply` | `binaryfunc` | __matmul__ __rmatmul__
- `nb_inplace_matrix_multiply` | `binaryfunc` | __imatmul__
- 
- `mp_length` | `lenfunc` | __len__
- `mp_subscript` | `binaryfunc` | __getitem__
- `mp_ass_subscript` | `objobjargproc` | __setitem__, __delitem__
- 
- `sq_length` | `lenfunc` | __len__
- `sq_concat` | `binaryfunc` | __add__
- `sq_repeat` | `ssizeargfunc` | __mul__
- `sq_item` | `ssizeargfunc` | __getitem__
- `sq_ass_item` | `ssizeobjargproc` | __setitem__ __delitem__
- `sq_contains` | `objobjproc` | __contains__
- `sq_inplace_concat` | `binaryfunc` | __iadd__
- `sq_inplace_repeat` | `ssizeargfunc` | __imul__
- 
- `bf_getbuffer` | `getbufferproc()` | __buffer__
- `bf_releasebuffer` | `releasebufferproc()` | __release_buffer__

<!-- anchor: slot-typedefs | type: section -->
### slot typedefs

| typedef | Parameter Types | Return Type |
| --- | --- | --- |
| `allocfunc` | `PyTypeObject` * `Py_ssize_t` | `PyObject` * |
| `destructor` | `PyObject` * | void |
| `freefunc` | void * | void |
| `traverseproc` | `PyObject` * `visitproc` void * | int |
| `newfunc` | `PyTypeObject` * `PyObject` * `PyObject` * | `PyObject` * |
| `initproc` | `PyObject` * `PyObject` * `PyObject` * | int |
| `reprfunc` | `PyObject` * | `PyObject` * |
| `getattrfunc` | `PyObject` * const char * | `PyObject` * |
| `setattrfunc` | `PyObject` * const char * `PyObject` * | int |
| `getattrofunc` | `PyObject` * `PyObject` * | `PyObject` * |
| `setattrofunc` | `PyObject` * `PyObject` * `PyObject` * | int |
| `descrgetfunc` | `PyObject` * `PyObject` * `PyObject` * | `PyObject` * |
| `descrsetfunc` | `PyObject` * `PyObject` * `PyObject` * | int |
| `hashfunc` | `PyObject` * | Py_hash_t |
| `richcmpfunc` | `PyObject` * `PyObject` * int | `PyObject` * |
| `getiterfunc` | `PyObject` * | `PyObject` * |
| `iternextfunc` | `PyObject` * | `PyObject` * |
| `lenfunc` | `PyObject` * | `Py_ssize_t` |
| `getbufferproc` | `PyObject` * `Py_buffer` * int | int |
| `releasebufferproc` | `PyObject` * `Py_buffer` * | void |
| `inquiry` | `PyObject` * | int |
| `unaryfunc` | `PyObject` * | `PyObject` * |
| `binaryfunc` | `PyObject` * `PyObject` * | `PyObject` * |
| `ternaryfunc` | `PyObject` * `PyObject` * `PyObject` * | `PyObject` * |
| `ssizeargfunc` | `PyObject` * `Py_ssize_t` | `PyObject` * |
| `ssizeobjargproc` | `PyObject` * `Py_ssize_t` `PyObject` * | int |
| `objobjproc` | `PyObject` * `PyObject` * | int |
| `objobjargproc` | `PyObject` * `PyObject` * `PyObject` * | int |

See Slot Type typedefs below for more detail.

<!-- anchor: pytypeobject-definition | type: section -->
## PyTypeObject Definition

The structure definition for `PyTypeObject` can be found in `Include/cpython/object.h`. For convenience of reference, this repeats the definition found there:

```c
typedef struct _typeobject {
    PyObject_VAR_HEAD
    const char *tp_name; /* For printing, in format "<module>.<name>" */
    Py_ssize_t tp_basicsize, tp_itemsize; /* For allocation */

    /* Methods to implement standard operations */

    destructor tp_dealloc;
    Py_ssize_t tp_vectorcall_offset;
    getattrfunc tp_getattr;
    setattrfunc tp_setattr;
    PyAsyncMethods *tp_as_async; /* formerly known as tp_compare (Python 2)
                                    or tp_reserved (Python 3) */
    reprfunc tp_repr;

    /* Method suites for standard classes */

    PyNumberMethods *tp_as_number;
    PySequenceMethods *tp_as_sequence;
    PyMappingMethods *tp_as_mapping;

    /* More standard operations (here for binary compatibility) */

    hashfunc tp_hash;
    ternaryfunc tp_call;
    reprfunc tp_str;
    getattrofunc tp_getattro;
    setattrofunc tp_setattro;

    /* Functions to access object as input/output buffer */
    PyBufferProcs *tp_as_buffer;

    /* Flags to define presence of optional/expanded features */
    unsigned long tp_flags;

    const char *tp_doc; /* Documentation string */

    /* Assigned meaning in release 2.0 */
    /* call function for all accessible objects */
    traverseproc tp_traverse;

    /* delete references to contained objects */
    inquiry tp_clear;

    /* Assigned meaning in release 2.1 */
    /* rich comparisons */
    richcmpfunc tp_richcompare;

    /* weak reference enabler */
    Py_ssize_t tp_weaklistoffset;

    /* Iterators */
    getiterfunc tp_iter;
    iternextfunc tp_iternext;

    /* Attribute descriptor and subclassing stuff */
    PyMethodDef *tp_methods;
    PyMemberDef *tp_members;
    PyGetSetDef *tp_getset;
    // Strong reference on a heap type, borrowed reference on a static type
    PyTypeObject *tp_base;
    PyObject *tp_dict;
    descrgetfunc tp_descr_get;
    descrsetfunc tp_descr_set;
    Py_ssize_t tp_dictoffset;
    initproc tp_init;
    allocfunc tp_alloc;
    newfunc tp_new;
    freefunc tp_free; /* Low-level free-memory routine */
    inquiry tp_is_gc; /* For PyObject_IS_GC */
    PyObject *tp_bases;
    PyObject *tp_mro; /* method resolution order */
    PyObject *tp_cache; /* no longer used */
    void *tp_subclasses;  /* for static builtin types this is an index */
    PyObject *tp_weaklist; /* not used for static builtin types */
    destructor tp_del;

    /* Type attribute cache version tag. Added in version 2.6.
     * If zero, the cache is invalid and must be initialized.
     */
    unsigned int tp_version_tag;

    destructor tp_finalize;
    vectorcallfunc tp_vectorcall;

    /* bitset of which type-watchers care about this type */
    unsigned char tp_watched;

    /* Number of tp_version_tag values used.
     * Set to _Py_ATTR_CACHE_UNUSED if the attribute cache is
     * disabled for this type (e.g. due to custom MRO entries).
     * Otherwise, limited to MAX_VERSIONS_PER_CLASS (defined elsewhere).
     */
    uint16_t tp_versions_used;
} PyTypeObject;
```

<!-- anchor: pyobject-slots | type: section -->
## PyObject Slots

The type object structure extends the `PyVarObject` structure. The `ob_size` field is used for dynamic types (created by `type_new()`, usually called from a class statement). Note that `PyType_Type` (the metatype) initializes `tp_itemsize`, which means that its instances (i.e. type objects) *must* have the `ob_size` field.

`PyObject.ob_refcnt`

The type object’s reference count is initialized to `1` by the `PyObject_HEAD_INIT` macro. Note that for statically allocated type objects, the type’s instances (objects whose `ob_type` points back to the type) do *not* count as references. But for dynamically allocated type objects, the instances *do* count as references.

**Inheritance:**

This field is not inherited by subtypes.

`PyObject.ob_type`

This is the type’s type, in other words its metatype. It is initialized by the argument to the `PyObject_HEAD_INIT` macro, and its value should normally be `&PyType_Type`. However, for dynamically loadable extension modules that must be usable on Windows (at least), the compiler complains that this is not a valid initializer. Therefore, the convention is to pass `NULL` to the `PyObject_HEAD_INIT` macro and to initialize this field explicitly at the start of the module’s initialization function, before doing anything else. This is typically done like this:

```c
Foo_Type.ob_type = &PyType_Type;
```

This should be done before any instances of the type are created. `PyType_Ready()` checks if `ob_type` is `NULL`, and if so, initializes it to the `ob_type` field of the base class. `PyType_Ready()` will not change this field if it is non-zero.

**Inheritance:**

This field is inherited by subtypes.

<!-- anchor: pyvarobject-slots | type: section -->
## PyVarObject Slots

`PyVarObject.ob_size`

For statically allocated type objects, this should be initialized to zero. For dynamically allocated type objects, this field has a special internal meaning.

This field should be accessed using the `Py_SIZE()` macro.

**Inheritance:**

This field is not inherited by subtypes.

<!-- anchor: pytypeobject-slots | type: section -->
## PyTypeObject Slots

Each slot has a section describing inheritance. If `PyType_Ready()` may set a value when the field is set to `NULL` then there will also be a “Default” section. (Note that many fields set on `PyBaseObject_Type` and `PyType_Type` effectively act as defaults.)

<!-- anchor: c.PyTypeObject.tp_name | type: c member -->
### `const char *PyTypeObject.tp_name`

See `Py_tp_name` for the corresponding `Slot ID`.

Pointer to a NUL-terminated string containing the name of the type. For types that are accessible as module globals, the string should be the full module name, followed by a dot, followed by the type name; for built-in types, it should be just the type name. If the module is a submodule of a package, the full package name is part of the full module name. For example, a type named `T` defined in module `M` in subpackage `Q` in package `P` should have the `tp_name` initializer `"P.Q.M.T"`.

For dynamically allocated type objects, this should just be the type name, and the module name explicitly stored in the type dict as the value for key `'__module__'`.

For statically allocated type objects, the *tp_name* field should contain a dot. Everything before the last dot is made accessible as the `__module__` attribute, and everything after the last dot is made accessible as the `__name__` attribute.

If no dot is present, the entire `tp_name` field is made accessible as the `__name__` attribute, and the `__module__` attribute is undefined (unless explicitly set in the dictionary, as explained above). This means your type will be impossible to pickle. Additionally, it will not be listed in module documentations created with pydoc.

This field must not be `NULL`. It is the only required field in `PyTypeObject()` (other than potentially `tp_itemsize`).

**Inheritance:**

This field is not inherited by subtypes.

<!-- anchor: c.PyTypeObject.tp_basicsize | type: c member -->
### `Py_ssize_t PyTypeObject.tp_basicsize`

`Py_ssize_t PyTypeObject.tp_itemsize`

These fields allow calculating the size in bytes of instances of the type.

See `Py_tp_basicsize`, `Py_tp_extra_basicsize` and `Py_tp_itemsize` for the corresponding `Slot IDs`.

There are two kinds of types: types with fixed-length instances have a zero `tp_itemsize` field, types with variable-length instances have a non-zero `tp_itemsize` field. For a type with fixed-length instances, all instances have the same size, given in `tp_basicsize`. (Exceptions to this rule can be made using `PyUnstable_Object_GC_NewWithExtraData()`.)

For a type with variable-length instances, the instances must have an `ob_size` field, and the instance size is `tp_basicsize` plus N times `tp_itemsize`, where N is the “length” of the object.

Functions like `PyObject_NewVar()` will take the value of N as an argument, and store in the instance’s `ob_size` field. Note that the `ob_size` field may later be used for other purposes. For example, `int` instances use the bits of `ob_size` in an implementation-defined way; the underlying storage and its size should be accessed using `PyLong_Export()`.

**Note:**

The `ob_size` field should be accessed using the `Py_SIZE()` and `Py_SET_SIZE()` macros.

Also, the presence of an `ob_size` field in the instance layout doesn’t mean that the instance structure is variable-length. For example, the `list` type has fixed-length instances, yet those instances have a `ob_size` field. (As with `int`, avoid reading lists’ `ob_size` directly. Call `PyList_Size()` instead.)

The `tp_basicsize` includes size needed for data of the type’s `tp_base`, plus any extra data needed by each instance.

The correct way to set `tp_basicsize` is to use the `sizeof` operator on the struct used to declare the instance layout. This struct must include the struct used to declare the base type. In other words, `tp_basicsize` must be greater than or equal to the base’s `tp_basicsize`.

Since every type is a subtype of `object`, this struct must include `PyObject` or `PyVarObject` (depending on whether `ob_size` should be included). These are usually defined by the macro `PyObject_HEAD` or `PyObject_VAR_HEAD`, respectively.

The basic size does not include the GC header size, as that header is not part of `PyObject_HEAD`.

For cases where struct used to declare the base type is unknown, see `PyType_Spec.basicsize` and `PyType_FromMetaclass()`.

Notes about alignment:

- `tp_basicsize` must be a multiple of `_Alignof(PyObject)`. When using `sizeof` on a `struct` that includes `PyObject_HEAD`, as recommended, the compiler ensures this. When not using a C `struct`, or when using compiler extensions like `__attribute__((packed))`, it is up to you.

- If the variable items require a particular alignment, `tp_basicsize` and `tp_itemsize` must each be a multiple of that alignment. For example, if a type’s variable part stores a `double`, it is your responsibility that both fields are a multiple of `_Alignof(double)`.

**Inheritance:**

These fields are inherited separately by subtypes. (That is, if the field is set to zero, `PyType_Ready()` will copy the value from the base type, indicating that the instances do not need additional storage.)

If the base type has a non-zero `tp_itemsize`, it is generally not safe to set `tp_itemsize` to a different non-zero value in a subtype (though this depends on the implementation of the base type).

<!-- anchor: c.PyTypeObject.tp_dealloc | type: c member -->
### `destructor PyTypeObject.tp_dealloc`

*The corresponding slot ID `Py_tp_dealloc` is part of the Stable ABI.*

A pointer to the instance destructor function. The function signature is:

```c
void tp_dealloc(PyObject *self);
```

The destructor function should remove all references which the instance owns (e.g., call `Py_CLEAR()`), free all memory buffers owned by the instance, and call the type’s `tp_free` function to free the object itself.

If you may call functions that may set the error indicator, you must use `PyErr_GetRaisedException()` and `PyErr_SetRaisedException()` to ensure you don’t clobber a preexisting error indicator (the deallocation could have occurred while processing a different error):

```c
static void
foo_dealloc(foo_object *self)
{
    PyObject *et, *ev, *etb;
    PyObject *exc = PyErr_GetRaisedException();
    ...
    PyErr_SetRaisedException(exc);
}
```

The dealloc handler itself must not raise an exception; if it hits an error case it should call `PyErr_FormatUnraisable()` to log (and clear) an unraisable exception.

No guarantees are made about when an object is destroyed, except:

- Python will destroy an object immediately or some time after the final reference to the object is deleted, unless its finalizer (`tp_finalize`) subsequently resurrects the object.

- An object will not be destroyed while it is being automatically finalized (`tp_finalize`) or automatically cleared (`tp_clear`).

CPython currently destroys an object immediately from `Py_DECREF()` when the new reference count is zero, but this may change in a future version.

It is recommended to call `PyObject_CallFinalizerFromDealloc()` at the beginning of `tp_dealloc` to guarantee that the object is always finalized before destruction.

If the type supports garbage collection (the `Py_TPFLAGS_HAVE_GC` flag is set), the destructor should call `PyObject_GC_UnTrack()` before clearing any member fields.

It is permissible to call `tp_clear` from `tp_dealloc` to reduce code duplication and to guarantee that the object is always cleared before destruction. Beware that `tp_clear` might have already been called.

If the type is heap allocated (`Py_TPFLAGS_HEAPTYPE`), the deallocator should release the owned reference to its type object (via `Py_DECREF()`) after calling the type deallocator. See the example code below.:

```c
static void
foo_dealloc(PyObject *op)
{
   foo_object *self = (foo_object *) op;
   PyObject_GC_UnTrack(self);
   Py_CLEAR(self->ref);
   Py_TYPE(self)->tp_free(self);
}
```

`tp_dealloc` must leave the exception status unchanged. If it needs to call something that might raise an exception, the exception state must be backed up first and restored later (after logging any exceptions with `PyErr_WriteUnraisable()`).

Example:

```c
static void
foo_dealloc(PyObject *self)
{
    PyObject *exc = PyErr_GetRaisedException();

    if (PyObject_CallFinalizerFromDealloc(self) < 0) {
        // self was resurrected.
        goto done;
    }

    PyTypeObject *tp = Py_TYPE(self);

    if (tp->tp_flags & Py_TPFLAGS_HAVE_GC) {
        PyObject_GC_UnTrack(self);
    }

    // Optional, but convenient to avoid code duplication.
    if (tp->tp_clear && tp->tp_clear(self) < 0) {
        PyErr_WriteUnraisable(self);
    }

    // Any additional destruction goes here.

    tp->tp_free(self);
    self = NULL;  // In case PyErr_WriteUnraisable() is called below.

    if (tp->tp_flags & Py_TPFLAGS_HEAPTYPE) {
        Py_CLEAR(tp);
    }

done:
    // Optional, if something was called that might have raised an
    // exception.
    if (PyErr_Occurred()) {
        PyErr_WriteUnraisable(self);
    }
    PyErr_SetRaisedException(exc);
}
```

`tp_dealloc` may be called from any Python thread, not just the thread which created the object (if the object becomes part of a refcount cycle, that cycle might be collected by a garbage collection on any thread). This is not a problem for Python API calls, since the thread on which `tp_dealloc` is called with an attached thread state. However, if the object being destroyed in turn destroys objects from some other C library, care should be taken to ensure that destroying those objects on the thread which called `tp_dealloc` will not violate any assumptions of the library.

**Inheritance:**

This field is inherited by subtypes.

**See also:**

Object Life Cycle for details about how this slot relates to other slots.

<!-- anchor: c.PyTypeObject.tp_vectorcall_offset | type: c member -->
### `Py_ssize_t PyTypeObject.tp_vectorcall_offset`

An optional offset to a per-instance function that implements calling the object using the vectorcall protocol, a more efficient alternative of the simpler `tp_call`.

This field is only used if the flag `Py_TPFLAGS_HAVE_VECTORCALL` is set. If so, this must be a positive integer containing the offset in the instance of a `vectorcallfunc` pointer.

The *vectorcallfunc* pointer may be `NULL`, in which case the instance behaves as if `Py_TPFLAGS_HAVE_VECTORCALL` was not set: calling the instance falls back to `tp_call`.

Any class that sets `Py_TPFLAGS_HAVE_VECTORCALL` must also set `tp_call` and make sure its behaviour is consistent with the *vectorcallfunc* function. This can be done by setting *tp_call* to `PyVectorcall_Call()`.

Changed in version 3.8: Before version 3.8, this slot was named `tp_print`. In Python 2.x, it was used for printing to a file. In Python 3.0 to 3.7, it was unused.

Changed in version 3.12: Before version 3.12, it was not recommended for mutable heap types to implement the vectorcall protocol. When a user sets `__call__` in Python code, only *tp_call* is updated, likely making it inconsistent with the vectorcall function. Since 3.12, setting `__call__` will disable vectorcall optimization by clearing the `Py_TPFLAGS_HAVE_VECTORCALL` flag.

**Inheritance:**

This field is always inherited. However, the `Py_TPFLAGS_HAVE_VECTORCALL` flag is not always inherited. If it’s not set, then the subclass won’t use vectorcall, except when `PyVectorcall_Call()` is explicitly called.

<!-- anchor: c.PyTypeObject.tp_getattr | type: c member -->
### `getattrfunc PyTypeObject.tp_getattr`

*The corresponding slot ID `Py_tp_getattr` is part of the Stable ABI.*

An optional pointer to the get-attribute-string function.

This field is deprecated. When it is defined, it should point to a function that acts the same as the `tp_getattro` function, but taking a C string instead of a Python string object to give the attribute name.

**Inheritance:**

Group: `tp_getattr`, `tp_getattro`

This field is inherited by subtypes together with `tp_getattro`: a subtype inherits both `tp_getattr` and `tp_getattro` from its base type when the subtype’s `tp_getattr` and `tp_getattro` are both `NULL`.

<!-- anchor: c.PyTypeObject.tp_setattr | type: c member -->
### `setattrfunc PyTypeObject.tp_setattr`

*The corresponding slot ID `Py_tp_setattr` is part of the Stable ABI.*

An optional pointer to the function for setting and deleting attributes.

This field is deprecated. When it is defined, it should point to a function that acts the same as the `tp_setattro` function, but taking a C string instead of a Python string object to give the attribute name.

**Inheritance:**

Group: `tp_setattr`, `tp_setattro`

This field is inherited by subtypes together with `tp_setattro`: a subtype inherits both `tp_setattr` and `tp_setattro` from its base type when the subtype’s `tp_setattr` and `tp_setattro` are both `NULL`.

<!-- anchor: c.PyTypeObject.tp_as_async | type: c member -->
### `PyAsyncMethods *PyTypeObject.tp_as_async`

Pointer to an additional structure that contains fields relevant only to objects which implement awaitable and asynchronous iterator protocols at the C-level. See Async Object Structures for details.

Added in version 3.5: Formerly known as `tp_compare` and `tp_reserved`.

**Inheritance:**

The `tp_as_async` field is not inherited, but the contained fields are inherited individually.

<!-- anchor: c.PyTypeObject.tp_repr | type: c member -->
### `reprfunc PyTypeObject.tp_repr`

*The corresponding slot ID `Py_tp_repr` is part of the Stable ABI.*

An optional pointer to a function that implements the built-in function `repr()`.

The signature is the same as for `PyObject_Repr()`:

```c
PyObject *tp_repr(PyObject *self);
```

The function must return a string or a Unicode object. Ideally, this function should return a string that, when passed to `eval()`, given a suitable environment, returns an object with the same value. If this is not feasible, it should return a string starting with `'<'` and ending with `'>'` from which both the type and the value of the object can be deduced.

**Inheritance:**

This field is inherited by subtypes.

**Default:**

When this field is not set, a string of the form `<%s object at %p>` is returned, where `%s` is replaced by the type name, and `%p` by the object’s memory address.

<!-- anchor: c.PyTypeObject.tp_as_number | type: c member -->
### `PyNumberMethods *PyTypeObject.tp_as_number`

Pointer to an additional structure that contains fields relevant only to objects which implement the number protocol. These fields are documented in Number Object Structures.

**Inheritance:**

The `tp_as_number` field is not inherited, but the contained fields are inherited individually.

<!-- anchor: c.PyTypeObject.tp_as_sequence | type: c member -->
### `PySequenceMethods *PyTypeObject.tp_as_sequence`

Pointer to an additional structure that contains fields relevant only to objects which implement the sequence protocol. These fields are documented in Sequence Object Structures.

**Inheritance:**

The `tp_as_sequence` field is not inherited, but the contained fields are inherited individually.

<!-- anchor: c.PyTypeObject.tp_as_mapping | type: c member -->
### `PyMappingMethods *PyTypeObject.tp_as_mapping`

Pointer to an additional structure that contains fields relevant only to objects which implement the mapping protocol. These fields are documented in Mapping Object Structures.

**Inheritance:**

The `tp_as_mapping` field is not inherited, but the contained fields are inherited individually.

<!-- anchor: c.PyTypeObject.tp_hash | type: c member -->
### `hashfunc PyTypeObject.tp_hash`

*The corresponding slot ID `Py_tp_hash` is part of the Stable ABI.*

An optional pointer to a function that implements the built-in function `hash()`.

The signature is the same as for `PyObject_Hash()`:

```c
Py_hash_t tp_hash(PyObject *);
```

The value `-1` should not be returned as a normal return value; when an error occurs during the computation of the hash value, the function should set an exception and return `-1`.

When this field is not set (*and* `tp_richcompare` is not set), an attempt to take the hash of the object raises `TypeError`. This is the same as setting it to `PyObject_HashNotImplemented()`.

This field can be set explicitly to `PyObject_HashNotImplemented()` to block inheritance of the hash method from a parent type. This is interpreted as the equivalent of `__hash__ = None` at the Python level, causing `isinstance(o, collections.Hashable)` to correctly return `False`. Note that the converse is also true - setting `__hash__ = None` on a class at the Python level will result in the `tp_hash` slot being set to `PyObject_HashNotImplemented()`.

**Inheritance:**

Group: `tp_hash`, `tp_richcompare`

This field is inherited by subtypes together with `tp_richcompare`: a subtype inherits both of `tp_richcompare` and `tp_hash`, when the subtype’s `tp_richcompare` and `tp_hash` are both `NULL`.

**Default:**

`PyBaseObject_Type` uses `PyObject_GenericHash()`.

<!-- anchor: c.PyTypeObject.tp_call | type: c member -->
### `ternaryfunc PyTypeObject.tp_call`

*The corresponding slot ID `Py_tp_call` is part of the Stable ABI.*

An optional pointer to a function that implements calling the object. This should be `NULL` if the object is not callable. The signature is the same as for `PyObject_Call()`:

```c
PyObject *tp_call(PyObject *self, PyObject *args, PyObject *kwargs);
```

**Inheritance:**

This field is inherited by subtypes.

<!-- anchor: c.PyTypeObject.tp_str | type: c member -->
### `reprfunc PyTypeObject.tp_str`

*The corresponding slot ID `Py_tp_str` is part of the Stable ABI.*

An optional pointer to a function that implements the built-in operation `str()`. (Note that `str` is a type now, and `str()` calls the constructor for that type. This constructor calls `PyObject_Str()` to do the actual work, and `PyObject_Str()` will call this handler.)

The signature is the same as for `PyObject_Str()`:

```c
PyObject *tp_str(PyObject *self);
```

The function must return a string or a Unicode object. It should be a “friendly” string representation of the object, as this is the representation that will be used, among other things, by the `print()` function.

**Inheritance:**

This field is inherited by subtypes.

**Default:**

When this field is not set, `PyObject_Repr()` is called to return a string representation.

<!-- anchor: c.PyTypeObject.tp_getattro | type: c member -->
### `getattrofunc PyTypeObject.tp_getattro`

*The corresponding slot ID `Py_tp_getattro` is part of the Stable ABI.*

An optional pointer to the get-attribute function.

The signature is the same as for `PyObject_GetAttr()`:

```c
PyObject *tp_getattro(PyObject *self, PyObject *attr);
```

It is usually convenient to set this field to `PyObject_GenericGetAttr()`, which implements the normal way of looking for object attributes.

**Inheritance:**

Group: `tp_getattr`, `tp_getattro`

This field is inherited by subtypes together with `tp_getattr`: a subtype inherits both `tp_getattr` and `tp_getattro` from its base type when the subtype’s `tp_getattr` and `tp_getattro` are both `NULL`.

**Default:**

`PyBaseObject_Type` uses `PyObject_GenericGetAttr()`.

<!-- anchor: c.PyTypeObject.tp_setattro | type: c member -->
### `setattrofunc PyTypeObject.tp_setattro`

*The corresponding slot ID `Py_tp_setattro` is part of the Stable ABI.*

An optional pointer to the function for setting and deleting attributes.

The signature is the same as for `PyObject_SetAttr()`:

```c
int tp_setattro(PyObject *self, PyObject *attr, PyObject *value);
```

In addition, setting *value* to `NULL` to delete an attribute must be supported. It is usually convenient to set this field to `PyObject_GenericSetAttr()`, which implements the normal way of setting object attributes.

**Inheritance:**

Group: `tp_setattr`, `tp_setattro`

This field is inherited by subtypes together with `tp_setattr`: a subtype inherits both `tp_setattr` and `tp_setattro` from its base type when the subtype’s `tp_setattr` and `tp_setattro` are both `NULL`.

**Default:**

`PyBaseObject_Type` uses `PyObject_GenericSetAttr()`.

<!-- anchor: c.PyTypeObject.tp_as_buffer | type: c member -->
### `PyBufferProcs *PyTypeObject.tp_as_buffer`

Pointer to an additional structure that contains fields relevant only to objects which implement the buffer interface. These fields are documented in Buffer Object Structures.

**Inheritance:**

The `tp_as_buffer` field is not inherited, but the contained fields are inherited individually.

<!-- anchor: c.PyTypeObject.tp_flags | type: c member -->
### `unsigned long PyTypeObject.tp_flags`

See `Py_tp_flags` for the corresponding `Slot ID`.

This field is a bit mask of various flags. Some flags indicate variant semantics for certain situations; others are used to indicate that certain fields in the type object (or in the extension structures referenced via `tp_as_number`, `tp_as_sequence`, `tp_as_mapping`, and `tp_as_buffer`) that were historically not always present are valid; if such a flag bit is clear, the type fields it guards must not be accessed and must be considered to have a zero or `NULL` value instead.

**Inheritance:**

Inheritance of this field is complicated. Most flag bits are inherited individually, i.e. if the base type has a flag bit set, the subtype inherits this flag bit. The flag bits that pertain to extension structures are strictly inherited if the extension structure is inherited, i.e. the base type’s value of the flag bit is copied into the subtype together with a pointer to the extension structure. The `Py_TPFLAGS_HAVE_GC` flag bit is inherited together with the `tp_traverse` and `tp_clear` fields, i.e. if the `Py_TPFLAGS_HAVE_GC` flag bit is clear in the subtype and the `tp_traverse` and `tp_clear` fields in the subtype exist and have `NULL` values.

**Default:**

`PyBaseObject_Type` uses `Py_TPFLAGS_DEFAULT | Py_TPFLAGS_BASETYPE`.

**Bit Masks:**

The following bit masks are currently defined; these can be ORed together using the `|` operator to form the value of the `tp_flags` field. The macro `PyType_HasFeature()` takes a type and a flags value, *tp* and *f*, and checks whether `tp->tp_flags & f` is non-zero.

<!-- anchor: c.Py_TPFLAGS_HEAPTYPE | type: c macro -->
#### `Py_TPFLAGS_HEAPTYPE`

This bit is set when the type object itself is allocated on the heap, for example, types created dynamically using `PyType_FromSpec()`. In this case, the `ob_type` field of its instances is considered a reference to the type, and the type object is INCREF’ed when a new instance is created, and DECREF’ed when an instance is destroyed (this does not apply to instances of subtypes; only the type referenced by the instance’s ob_type gets INCREF’ed or DECREF’ed). Heap types should also support garbage collection as they can form a reference cycle with their own module object.

**Inheritance:**

???

<!-- anchor: c.Py_TPFLAGS_BASETYPE | type: c macro -->
#### `Py_TPFLAGS_BASETYPE`

*Part of the Stable ABI.*

This bit is set when the type can be used as the base type of another type. If this bit is clear, the type cannot be subtyped (similar to a “final” class in Java).

**Inheritance:**

???

<!-- anchor: c.Py_TPFLAGS_READY | type: c macro -->
#### `Py_TPFLAGS_READY`

This bit is set when the type object has been fully initialized by `PyType_Ready()`.

**Inheritance:**

???

<!-- anchor: c.Py_TPFLAGS_READYING | type: c macro -->
#### `Py_TPFLAGS_READYING`

This bit is set while `PyType_Ready()` is in the process of initializing the type object.

**Inheritance:**

???

<!-- anchor: c.Py_TPFLAGS_HAVE_GC | type: c macro -->
#### `Py_TPFLAGS_HAVE_GC`

*Part of the Stable ABI.*

This bit is set when the object supports garbage collection. If this bit is set, memory for new instances (see `tp_alloc`) must be allocated using `PyObject_GC_New` or `PyType_GenericAlloc()` and deallocated (see `tp_free`) using `PyObject_GC_Del()`. More information in section Supporting Cyclic Garbage Collection.

**Inheritance:**

Group: `Py_TPFLAGS_HAVE_GC`, `tp_traverse`, `tp_clear`

The `Py_TPFLAGS_HAVE_GC` flag bit is inherited together with the `tp_traverse` and `tp_clear` fields, i.e. if the `Py_TPFLAGS_HAVE_GC` flag bit is clear in the subtype and the `tp_traverse` and `tp_clear` fields in the subtype exist and have `NULL` values.

<!-- anchor: c.Py_TPFLAGS_DEFAULT | type: c macro -->
#### `Py_TPFLAGS_DEFAULT`

*Part of the Stable ABI.*

This is a bitmask of all the bits that pertain to the existence of certain fields in the type object and its extension structures. Currently, it includes the following bits: `Py_TPFLAGS_HAVE_STACKLESS_EXTENSION`.

**Inheritance:**

???

<!-- anchor: c.Py_TPFLAGS_METHOD_DESCRIPTOR | type: c macro -->
#### `Py_TPFLAGS_METHOD_DESCRIPTOR`

*Part of the Stable ABI since version 3.8.*

This bit indicates that objects behave like unbound methods.

If this flag is set for `type(meth)`, then:

- `meth.__get__(obj, cls)(*args, **kwds)` (with `obj` not None) must be equivalent to `meth(obj, *args, **kwds)`.

- `meth.__get__(None, cls)(*args, **kwds)` must be equivalent to `meth(*args, **kwds)`.

This flag enables an optimization for typical method calls like `obj.meth()`: it avoids creating a temporary “bound method” object for `obj.meth`.

Added in version 3.8.

**Inheritance:**

This flag is never inherited by types without the `Py_TPFLAGS_IMMUTABLETYPE` flag set. For extension types, it is inherited whenever `tp_descr_get` is inherited.

<!-- anchor: c.Py_TPFLAGS_MANAGED_DICT | type: c macro -->
#### `Py_TPFLAGS_MANAGED_DICT`

This bit indicates that instances of the class have a `__dict__` attribute, and that the space for the dictionary is managed by the VM.

If this flag is set, `Py_TPFLAGS_HAVE_GC` must also be set.

The type traverse function must call `PyObject_VisitManagedDict()` and its clear function must call `PyObject_ClearManagedDict()`.

Added in version 3.12.

**Inheritance:**

This flag is inherited unless the `tp_dictoffset` field is set in a superclass.

<!-- anchor: c.Py_TPFLAGS_MANAGED_WEAKREF | type: c macro -->
#### `Py_TPFLAGS_MANAGED_WEAKREF`

This bit indicates that instances of the class should be weakly referenceable.

If this flag is set, `Py_TPFLAGS_HAVE_GC` must also be set.

Added in version 3.12.

**Inheritance:**

This flag is inherited unless the `tp_weaklistoffset` field is set in a superclass.

<!-- anchor: c.Py_TPFLAGS_PREHEADER | type: c macro -->
#### `Py_TPFLAGS_PREHEADER`

These bits indicate that the VM will manage some fields by storing them before the object. Currently, this macro is equivalent to Py_TPFLAGS_MANAGED_DICT | Py_TPFLAGS_MANAGED_WEAKREF.

This macro value relies on the implementation of the VM, so its value is not stable and may change in a future version. Prefer using individual flags instead.

Added in version 3.12.

<!-- anchor: c.Py_TPFLAGS_ITEMS_AT_END | type: c macro -->
#### `Py_TPFLAGS_ITEMS_AT_END`

*Part of the Stable ABI since version 3.12.*

Only usable with variable-size types, i.e. ones with non-zero `tp_itemsize`.

Indicates that the variable-sized portion of an instance of this type is at the end of the instance’s memory area, at an offset of `Py_TYPE(obj)->tp_basicsize` (which may be different in each subclass).

When setting this flag, be sure that all superclasses either use this memory layout, or are not variable-sized. Python does not check this.

Added in version 3.12.

**Inheritance:**

This flag is inherited.

<!-- anchor: c.Py_TPFLAGS_LONG_SUBCLASS | type: c macro -->
#### `Py_TPFLAGS_LONG_SUBCLASS`

<!-- anchor: c.Py_TPFLAGS_LIST_SUBCLASS | type: c macro -->
#### `Py_TPFLAGS_LIST_SUBCLASS`

<!-- anchor: c.Py_TPFLAGS_TUPLE_SUBCLASS | type: c macro -->
#### `Py_TPFLAGS_TUPLE_SUBCLASS`

<!-- anchor: c.Py_TPFLAGS_BYTES_SUBCLASS | type: c macro -->
#### `Py_TPFLAGS_BYTES_SUBCLASS`

<!-- anchor: c.Py_TPFLAGS_UNICODE_SUBCLASS | type: c macro -->
#### `Py_TPFLAGS_UNICODE_SUBCLASS`

<!-- anchor: c.Py_TPFLAGS_DICT_SUBCLASS | type: c macro -->
#### `Py_TPFLAGS_DICT_SUBCLASS`

<!-- anchor: c.Py_TPFLAGS_BASE_EXC_SUBCLASS | type: c macro -->
#### `Py_TPFLAGS_BASE_EXC_SUBCLASS`

<!-- anchor: c.Py_TPFLAGS_TYPE_SUBCLASS | type: c macro -->
#### `Py_TPFLAGS_TYPE_SUBCLASS`

Functions such as `PyLong_Check()` will call `PyType_FastSubclass()` with one of these flags to quickly determine if a type is a subclass of a built-in type; such specific checks are faster than a generic check, like `PyObject_IsInstance()`. Custom types that inherit from built-ins should have their `tp_flags` set appropriately, or the code that interacts with such types will behave differently depending on what kind of check is used.

<!-- anchor: c.Py_TPFLAGS_HAVE_FINALIZE | type: c macro -->
#### `Py_TPFLAGS_HAVE_FINALIZE`

This bit is set when the `tp_finalize` slot is present in the type structure.

Added in version 3.4.

Deprecated since version 3.8: This flag isn’t necessary anymore, as the interpreter assumes the `tp_finalize` slot is always present in the type structure.

<!-- anchor: c.Py_TPFLAGS_HAVE_VECTORCALL | type: c macro -->
#### `Py_TPFLAGS_HAVE_VECTORCALL`

*Part of the Stable ABI since version 3.12.*

This bit is set when the class implements the vectorcall protocol. See `tp_vectorcall_offset` for details.

**Inheritance:**

This bit is inherited if `tp_call` is also inherited.

Added in version 3.8: as `_Py_TPFLAGS_HAVE_VECTORCALL`

Changed in version 3.9: Renamed to the current name, without the leading underscore. The old provisional name is soft deprecated.

Changed in version 3.12: This flag is now removed from a class when the class’s `__call__()` method is reassigned.

This flag can now be inherited by mutable classes.

<!-- anchor: c.Py_TPFLAGS_IMMUTABLETYPE | type: c macro -->
#### `Py_TPFLAGS_IMMUTABLETYPE`

This bit is set for type objects that are immutable: type attributes cannot be set nor deleted.

`PyType_Ready()` automatically applies this flag to static types.

**Inheritance:**

This flag is not inherited.

Added in version 3.10.

<!-- anchor: c.Py_TPFLAGS_DISALLOW_INSTANTIATION | type: c macro -->
#### `Py_TPFLAGS_DISALLOW_INSTANTIATION`

Disallow creating instances of the type: set `tp_new` to NULL and don’t create the `__new__` key in the type dictionary.

The flag must be set before creating the type, not after. For example, it must be set before `PyType_Ready()` is called on the type.

The flag is set automatically on static types if `tp_base` is NULL or `&PyBaseObject_Type` and `tp_new` is NULL.

**Inheritance:**

This flag is not inherited. However, subclasses will not be instantiable unless they provide a non-NULL `tp_new` (which is only possible via the C API).

**Note:**

To disallow instantiating a class directly but allow instantiating its subclasses (e.g. for an abstract base class), do not use this flag. Instead, make `tp_new` only succeed for subclasses.

Added in version 3.10.

<!-- anchor: c.Py_TPFLAGS_MAPPING | type: c macro -->
#### `Py_TPFLAGS_MAPPING`

This bit indicates that instances of the class may match mapping patterns when used as the subject of a `match` block. It is automatically set when registering or subclassing `collections.abc.Mapping`, and unset when registering `collections.abc.Sequence`.

**Note:**

`Py_TPFLAGS_MAPPING` and `Py_TPFLAGS_SEQUENCE` are mutually exclusive; it is an error to enable both flags simultaneously.

**Inheritance:**

This flag is inherited by types that do not already set `Py_TPFLAGS_SEQUENCE`.

**See also:**

**PEP 634** – Structural Pattern Matching: Specification

Added in version 3.10.

<!-- anchor: c.Py_TPFLAGS_SEQUENCE | type: c macro -->
#### `Py_TPFLAGS_SEQUENCE`

This bit indicates that instances of the class may match sequence patterns when used as the subject of a `match` block. It is automatically set when registering or subclassing `collections.abc.Sequence`, and unset when registering `collections.abc.Mapping`.

**Note:**

`Py_TPFLAGS_MAPPING` and `Py_TPFLAGS_SEQUENCE` are mutually exclusive; it is an error to enable both flags simultaneously.

**Inheritance:**

This flag is inherited by types that do not already set `Py_TPFLAGS_MAPPING`.

**See also:**

**PEP 634** – Structural Pattern Matching: Specification

Added in version 3.10.

<!-- anchor: c.Py_TPFLAGS_VALID_VERSION_TAG | type: c macro -->
#### `Py_TPFLAGS_VALID_VERSION_TAG`

Internal. Do not set or unset this flag. To indicate that a class has changed call `PyType_Modified()`

**Warning:**

This flag is present in header files, but is not be used. It will be removed in a future version of CPython

<!-- anchor: c.Py_TPFLAGS_HAVE_VERSION_TAG | type: c macro -->
#### `Py_TPFLAGS_HAVE_VERSION_TAG`

This macro does nothing. Historically, this would indicate that the `tp_version_tag` field was available and initialized.

Soft deprecated since version 3.13.

<!-- anchor: c.Py_TPFLAGS_INLINE_VALUES | type: c macro -->
#### `Py_TPFLAGS_INLINE_VALUES`

This bit indicates that instances of this type will have an “inline values” array (containing the object’s attributes) placed directly after the end of the object.

This requires that `Py_TPFLAGS_HAVE_GC` is set.

**Inheritance:**

This flag is not inherited.

Added in version 3.13.

<!-- anchor: c.Py_TPFLAGS_IS_ABSTRACT | type: c macro -->
#### `Py_TPFLAGS_IS_ABSTRACT`

This bit indicates that this is an abstract type and therefore cannot be instantiated.

**Inheritance:**

This flag is not inherited.

**See also:**

`abc`

<!-- anchor: c.Py_TPFLAGS_HAVE_STACKLESS_EXTENSION | type: c macro -->
#### `Py_TPFLAGS_HAVE_STACKLESS_EXTENSION`

Internal. Do not set or unset this flag. Historically, this was a reserved flag for use in Stackless Python.

**Warning:**

This flag is present in header files, but is not be used. This may be removed in a future version of CPython.

<!-- anchor: c.PyTypeObject.tp_doc | type: c member -->
### `const char *PyTypeObject.tp_doc`

*The corresponding slot ID `Py_tp_doc` is part of the Stable ABI.*

An optional pointer to a NUL-terminated C string giving the docstring for this type object. This is exposed as the `__doc__` attribute on the type and instances of the type.

**Inheritance:**

This field is *not* inherited by subtypes.

<!-- anchor: c.PyTypeObject.tp_traverse | type: c member -->
### `traverseproc PyTypeObject.tp_traverse`

*The corresponding slot ID `Py_tp_traverse` is part of the Stable ABI.*

An optional pointer to a traversal function for the garbage collector. This is only used if the `Py_TPFLAGS_HAVE_GC` flag bit is set.

See Traversal for documentation.

**Inheritance:**

Group: `Py_TPFLAGS_HAVE_GC`, `tp_traverse`, `tp_clear`

This field is inherited by subtypes together with `tp_clear` and the `Py_TPFLAGS_HAVE_GC` flag bit: the flag bit, `tp_traverse`, and `tp_clear` are all inherited from the base type if they are all zero in the subtype.

<!-- anchor: c.PyTypeObject.tp_clear | type: c member -->
### `inquiry PyTypeObject.tp_clear`

*The corresponding slot ID `Py_tp_clear` is part of the Stable ABI.*

An optional pointer to a clear function. The signature is:

```c
int tp_clear(PyObject *);
```

The purpose of this function is to break reference cycles that are causing a cyclic isolate so that the objects can be safely destroyed. A cleared object is a partially destroyed object; the object is not obligated to satisfy design invariants held during normal use.

`tp_clear` does not need to delete references to objects that can’t participate in reference cycles, such as Python strings or Python integers. However, it may be convenient to clear all references, and write the type’s `tp_dealloc` function to invoke `tp_clear` to avoid code duplication. (Beware that `tp_clear` might have already been called. Prefer calling idempotent functions like `Py_CLEAR()`.)

Any non-trivial cleanup should be performed in `tp_finalize` instead of `tp_clear`.

**Note:**

If `tp_clear` fails to break a reference cycle then the objects in the cyclic isolate may remain indefinitely uncollectable (“leak”). See `gc.garbage`.

**Note:**

Referents (direct and indirect) might have already been cleared; they are not guaranteed to be in a consistent state.

**Note:**

The `tp_clear` function can be called from any thread.

**Note:**

An object is not guaranteed to be automatically cleared before its destructor (`tp_dealloc`) is called.

This function differs from the destructor (`tp_dealloc`) in the following ways:

- The purpose of clearing an object is to remove references to other objects that might participate in a reference cycle. The purpose of the destructor, on the other hand, is a superset: it must release *all* resources it owns, including references to objects that cannot participate in a reference cycle (e.g., integers) as well as the object’s own memory (by calling `tp_free`).

- When `tp_clear` is called, other objects might still hold references to the object being cleared. Because of this, `tp_clear` must not deallocate the object’s own memory (`tp_free`). The destructor, on the other hand, is only called when no (strong) references exist, and as such, must safely destroy the object itself by deallocating it.

- `tp_clear` might never be automatically called. An object’s destructor, on the other hand, will be automatically called some time after the object becomes unreachable (i.e., either there are no references to the object or the object is a member of a cyclic isolate).

No guarantees are made about when, if, or how often Python automatically clears an object, except:

- Python will not automatically clear an object if it is reachable, i.e., there is a reference to it and it is not a member of a cyclic isolate.

- Python will not automatically clear an object if it has not been automatically finalized (see `tp_finalize`). (If the finalizer resurrected the object, the object may or may not be automatically finalized again before it is cleared.)

- If an object is a member of a cyclic isolate, Python will not automatically clear it if any member of the cyclic isolate has not yet been automatically finalized (`tp_finalize`).

- Python will not destroy an object until after any automatic calls to its `tp_clear` function have returned. This ensures that the act of breaking a reference cycle does not invalidate the `self` pointer while `tp_clear` is still executing.

- Python will not automatically call `tp_clear` multiple times concurrently.

CPython currently only automatically clears objects as needed to break reference cycles in a cyclic isolate, but future versions might clear objects regularly before their destruction.

Taken together, all `tp_clear` functions in the system must combine to break all reference cycles. This is subtle, and if in any doubt supply a `tp_clear` function. For example, the tuple type does not implement a `tp_clear` function, because it’s possible to prove that no reference cycle can be composed entirely of tuples. Therefore the `tp_clear` functions of other types are responsible for breaking any cycle containing a tuple. This isn’t immediately obvious, and there’s rarely a good reason to avoid implementing `tp_clear`.

Implementations of `tp_clear` should drop the instance’s references to those of its members that may be Python objects, and set its pointers to those members to `NULL`, as in the following example:

```c
static int
local_clear(PyObject *op)
{
    localobject *self = (localobject *) op;
    Py_CLEAR(self->key);
    Py_CLEAR(self->args);
    Py_CLEAR(self->kw);
    Py_CLEAR(self->dict);
    return 0;
}
```

The `Py_CLEAR()` macro should be used, because clearing references is delicate: the reference to the contained object must not be released (via `Py_DECREF()`) until after the pointer to the contained object is set to `NULL`. This is because releasing the reference may cause the contained object to become trash, triggering a chain of reclamation activity that may include invoking arbitrary Python code (due to finalizers, or weakref callbacks, associated with the contained object). If it’s possible for such code to reference *self* again, it’s important that the pointer to the contained object be `NULL` at that time, so that *self* knows the contained object can no longer be used. The `Py_CLEAR()` macro performs the operations in a safe order.

If the `Py_TPFLAGS_MANAGED_DICT` bit is set in the `tp_flags` field, the clear function must call `PyObject_ClearManagedDict()` like this:

```c
PyObject_ClearManagedDict((PyObject*)self);
```

More information about Python’s garbage collection scheme can be found in section Supporting Cyclic Garbage Collection.

**Inheritance:**

Group: `Py_TPFLAGS_HAVE_GC`, `tp_traverse`, `tp_clear`

This field is inherited by subtypes together with `tp_traverse` and the `Py_TPFLAGS_HAVE_GC` flag bit: the flag bit, `tp_traverse`, and `tp_clear` are all inherited from the base type if they are all zero in the subtype.

**See also:**

Object Life Cycle for details about how this slot relates to other slots.

<!-- anchor: c.PyTypeObject.tp_richcompare | type: c member -->
### `richcmpfunc PyTypeObject.tp_richcompare`

*The corresponding slot ID `Py_tp_richcompare` is part of the Stable ABI.*

An optional pointer to the rich comparison function, whose signature is:

```c
PyObject *tp_richcompare(PyObject *self, PyObject *other, int op);
```

The first parameter is guaranteed to be an instance of the type that is defined by `PyTypeObject`.

The function should return the result of the comparison (usually `Py_True` or `Py_False`). If the comparison is undefined, it must return `Py_NotImplemented`, if another error occurred it must return `NULL` and set an exception condition.

The following constants are defined to be used as the third argument for `tp_richcompare` and for `PyObject_RichCompare()`:

| Constant | Comparison |
| --- | --- |
| `Py_LT` | `<` |
| `Py_LE` | `<=` |
| `Py_EQ` | `==` |
| `Py_NE` | `!=` |
| `Py_GT` | `>` |
| `Py_GE` | `>=` |

The following macro is defined to ease writing rich comparison functions:

<!-- anchor: c.Py_RETURN_RICHCOMPARE | type: c macro -->
#### `Py_RETURN_RICHCOMPARE(VAL_A, VAL_B, op)`

Return `Py_True` or `Py_False` from the function, depending on the result of a comparison. VAL_A and VAL_B must be orderable by C comparison operators (for example, they may be C ints or floats). The third argument specifies the requested operation, as for `PyObject_RichCompare()`.

The returned value is a new strong reference.

On error, sets an exception and returns `NULL` from the function.

Added in version 3.7.

**Inheritance:**

Group: `tp_hash`, `tp_richcompare`

This field is inherited by subtypes together with `tp_hash`: a subtype inherits `tp_richcompare` and `tp_hash` when the subtype’s `tp_richcompare` and `tp_hash` are both `NULL`.

**Default:**

`PyBaseObject_Type` provides a `tp_richcompare` implementation, which may be inherited. However, if only `tp_hash` is defined, not even the inherited function is used and instances of the type will not be able to participate in any comparisons.

<!-- anchor: c.PyTypeObject.tp_weaklistoffset | type: c member -->
### `Py_ssize_t PyTypeObject.tp_weaklistoffset`

While this field is still supported, `Py_TPFLAGS_MANAGED_WEAKREF` should be used instead, if at all possible.

If the instances of this type are weakly referenceable, this field is greater than zero and contains the offset in the instance structure of the weak reference list head (ignoring the GC header, if present); this offset is used by `PyObject_ClearWeakRefs()` and the `PyWeakref_*` functions. The instance structure needs to include a field of type PyObject* which is initialized to `NULL`.

Do not confuse this field with `tp_weaklist`; that is the list head for weak references to the type object itself.

It is an error to set both the `Py_TPFLAGS_MANAGED_WEAKREF` bit and `tp_weaklistoffset`.

**Inheritance:**

This field is inherited by subtypes, but see the rules listed below. A subtype may override this offset; this means that the subtype uses a different weak reference list head than the base type. Since the list head is always found via `tp_weaklistoffset`, this should not be a problem.

**Default:**

If the `Py_TPFLAGS_MANAGED_WEAKREF` bit is set in the `tp_flags` field, then `tp_weaklistoffset` will be set to a negative value, to indicate that it is unsafe to use this field.

<!-- anchor: c.PyTypeObject.tp_iter | type: c member -->
### `getiterfunc PyTypeObject.tp_iter`

*The corresponding slot ID `Py_tp_iter` is part of the Stable ABI.*

An optional pointer to a function that returns an iterator for the object. Its presence normally signals that the instances of this type are iterable (although sequences may be iterable without this function).

This function has the same signature as `PyObject_GetIter()`:

```c
PyObject *tp_iter(PyObject *self);
```

**Inheritance:**

This field is inherited by subtypes.

<!-- anchor: c.PyTypeObject.tp_iternext | type: c member -->
### `iternextfunc PyTypeObject.tp_iternext`

*The corresponding slot ID `Py_tp_iternext` is part of the Stable ABI.*

An optional pointer to a function that returns the next item in an iterator. The signature is:

```c
PyObject *tp_iternext(PyObject *self);
```

When the iterator is exhausted, the `tp_iternext` function must return `NULL`; a `StopIteration` exception may or may not be set. When another error occurs, it must return `NULL` too. The presence of `tp_iternext` signals that the instances of this type are iterators.

Iterator types should also define the `tp_iter` function, and that function should return the iterator instance itself (not a new iterator instance).

This function has the same signature as `PyIter_Next()`.

**Inheritance:**

This field is inherited by subtypes.

<!-- anchor: c.PyTypeObject.tp_methods | type: c member -->
### `struct PyMethodDef *PyTypeObject.tp_methods`

*The corresponding slot ID `Py_tp_methods` is part of the Stable ABI.*

An optional pointer to a static `NULL`-terminated array of `PyMethodDef` structures, declaring regular methods of this type.

For each entry in the array, an entry is added to the type’s dictionary (see `tp_dict` below) containing a method descriptor.

**Inheritance:**

This field is not inherited by subtypes (methods are inherited through a different mechanism).

<!-- anchor: c.PyTypeObject.tp_members | type: c member -->
### `struct PyMemberDef *PyTypeObject.tp_members`

*The corresponding slot ID `Py_tp_members` is part of the Stable ABI.*

An optional pointer to a static `NULL`-terminated array of `PyMemberDef` structures, declaring regular data members (fields or slots) of instances of this type.

For each entry in the array, an entry is added to the type’s dictionary (see `tp_dict` below) containing a member descriptor.

**Inheritance:**

This field is not inherited by subtypes (members are inherited through a different mechanism).

<!-- anchor: c.PyTypeObject.tp_getset | type: c member -->
### `struct PyGetSetDef *PyTypeObject.tp_getset`

*The corresponding slot ID `Py_tp_getset` is part of the Stable ABI.*

An optional pointer to a static `NULL`-terminated array of `PyGetSetDef` structures, declaring computed attributes of instances of this type.

For each entry in the array, an entry is added to the type’s dictionary (see `tp_dict` below) containing a getset descriptor.

**Inheritance:**

This field is not inherited by subtypes (computed attributes are inherited through a different mechanism).

<!-- anchor: c.PyTypeObject.tp_base | type: c member -->
### `PyTypeObject *PyTypeObject.tp_base`

An optional pointer to a base type from which type properties are inherited. At this level, only single inheritance is supported; multiple inheritance require dynamically creating a type object by calling the metatype.

For the corresponding slot ID, see `Py_tp_base`.

**Note:**

Slot initialization is subject to the rules of initializing globals. C99 requires the initializers to be “address constants”. Function designators like `PyType_GenericNew()`, with implicit conversion to a pointer, are valid C99 address constants.

However, the unary ‘&’ operator applied to a non-static variable like `PyBaseObject_Type` is not required to produce an address constant. Compilers may support this (gcc does), MSVC does not. Both compilers are strictly standard conforming in this particular behavior.

Consequently, `tp_base` should be set in the extension module’s init function.

**Inheritance:**

This field is not inherited by subtypes (obviously).

**Default:**

This field defaults to `&PyBaseObject_Type` (which to Python programmers is known as the type `object`).

<!-- anchor: c.PyTypeObject.tp_dict | type: c member -->
### `PyObject *PyTypeObject.tp_dict`

The type’s dictionary is stored here by `PyType_Ready()`.

This field should normally be initialized to `NULL` before PyType_Ready is called; it may also be initialized to a dictionary containing initial attributes for the type. Once `PyType_Ready()` has initialized the type, extra attributes for the type may be added to this dictionary only if they don’t correspond to overloaded operations (like `__add__()`). Once initialization for the type has finished, this field should be treated as read-only.

Some types may not store their dictionary in this slot. Use `PyType_GetDict()` to retrieve the dictionary for an arbitrary type.

Changed in version 3.12: Internals detail: For static builtin types, this is always `NULL`. Instead, the dict for such types is stored on `PyInterpreterState`. Use `PyType_GetDict()` to get the dict for an arbitrary type.

**Inheritance:**

This field is not inherited by subtypes (though the attributes defined in here are inherited through a different mechanism).

**Default:**

If this field is `NULL`, `PyType_Ready()` will assign a new dictionary to it.

**Warning:**

It is not safe to use `PyDict_SetItem()` on or otherwise modify `tp_dict` with the dictionary C-API.

<!-- anchor: c.PyTypeObject.tp_descr_get | type: c member -->
### `descrgetfunc PyTypeObject.tp_descr_get`

*The corresponding slot ID `Py_tp_descr_get` is part of the Stable ABI.*

An optional pointer to a “descriptor get” function.

The function signature is:

```c
PyObject * tp_descr_get(PyObject *self, PyObject *obj, PyObject *type);
```

**Inheritance:**

This field is inherited by subtypes.

<!-- anchor: c.PyTypeObject.tp_descr_set | type: c member -->
### `descrsetfunc PyTypeObject.tp_descr_set`

*The corresponding slot ID `Py_tp_descr_set` is part of the Stable ABI.*

An optional pointer to a function for setting and deleting a descriptor’s value.

The function signature is:

```c
int tp_descr_set(PyObject *self, PyObject *obj, PyObject *value);
```

The *value* argument is set to `NULL` to delete the value.

**Inheritance:**

This field is inherited by subtypes.

<!-- anchor: c.PyTypeObject.tp_dictoffset | type: c member -->
### `Py_ssize_t PyTypeObject.tp_dictoffset`

While this field is still supported, `Py_TPFLAGS_MANAGED_DICT` should be used instead, if at all possible.

If the instances of this type have a dictionary containing instance variables, this field is non-zero and contains the offset in the instances of the type of the instance variable dictionary; this offset is used by `PyObject_GenericGetAttr()`.

Do not confuse this field with `tp_dict`; that is the dictionary for attributes of the type object itself.

The value specifies the offset of the dictionary from the start of the instance structure.

The `tp_dictoffset` should be regarded as write-only. To get the pointer to the dictionary call `PyObject_GenericGetDict()`. Calling `PyObject_GenericGetDict()` may need to allocate memory for the dictionary, so it is may be more efficient to call `PyObject_GetAttr()` when accessing an attribute on the object.

It is an error to set both the `Py_TPFLAGS_MANAGED_DICT` bit and `tp_dictoffset`.

**Inheritance:**

This field is inherited by subtypes. A subtype should not override this offset; doing so could be unsafe, if C code tries to access the dictionary at the previous offset. To properly support inheritance, use `Py_TPFLAGS_MANAGED_DICT`.

**Default:**

This slot has no default. For static types, if the field is `NULL` then no `__dict__` gets created for instances.

If the `Py_TPFLAGS_MANAGED_DICT` bit is set in the `tp_flags` field, then `tp_dictoffset` will be set to `-1`, to indicate that it is unsafe to use this field.

<!-- anchor: c.PyTypeObject.tp_init | type: c member -->
### `initproc PyTypeObject.tp_init`

*The corresponding slot ID `Py_tp_init` is part of the Stable ABI.*

An optional pointer to an instance initialization function.

This function corresponds to the `__init__()` method of classes. Like `__init__()`, it is possible to create an instance without calling `__init__()`, and it is possible to reinitialize an instance by calling its `__init__()` method again.

The function signature is:

```c
int tp_init(PyObject *self, PyObject *args, PyObject *kwds);
```

The self argument is the instance to be initialized; the *args* and *kwds* arguments represent positional and keyword arguments of the call to `__init__()`.

The `tp_init` function, if not `NULL`, is called when an instance is created normally by calling its type, after the type’s `tp_new` function has returned an instance of the type. If the `tp_new` function returns an instance of some other type that is not a subtype of the original type, no `tp_init` function is called; if `tp_new` returns an instance of a subtype of the original type, the subtype’s `tp_init` is called.

Returns `0` on success, `-1` and sets an exception on error.

**Inheritance:**

This field is inherited by subtypes.

**Default:**

For static types this field does not have a default.

<!-- anchor: c.PyTypeObject.tp_alloc | type: c member -->
### `allocfunc PyTypeObject.tp_alloc`

*The corresponding slot ID `Py_tp_alloc` is part of the Stable ABI.*

An optional pointer to an instance allocation function.

The function signature is:

```c
PyObject *tp_alloc(PyTypeObject *self, Py_ssize_t nitems);
```

**Inheritance:**

Static subtypes inherit this slot, which will be `PyType_GenericAlloc()` if inherited from `object`.

Heap subtypes do not inherit this slot.

**Default:**

For heap subtypes, this field is always set to `PyType_GenericAlloc()`.

For static subtypes, this slot is inherited (see above).

<!-- anchor: c.PyTypeObject.tp_new | type: c member -->
### `newfunc PyTypeObject.tp_new`

*The corresponding slot ID `Py_tp_new` is part of the Stable ABI.*

An optional pointer to an instance creation function.

The function signature is:

```c
PyObject *tp_new(PyTypeObject *subtype, PyObject *args, PyObject *kwds);
```

The *subtype* argument is the type of the object being created; the *args* and *kwds* arguments represent positional and keyword arguments of the call to the type. Note that *subtype* doesn’t have to equal the type whose `tp_new` function is called; it may be a subtype of that type (but not an unrelated type).

The `tp_new` function should call `subtype->tp_alloc(subtype, nitems)` to allocate space for the object, and then do only as much further initialization as is absolutely necessary. Initialization that can safely be ignored or repeated should be placed in the `tp_init` handler. A good rule of thumb is that for immutable types, all initialization should take place in `tp_new`, while for mutable types, most initialization should be deferred to `tp_init`.

Set the `Py_TPFLAGS_DISALLOW_INSTANTIATION` flag to disallow creating instances of the type in Python.

**Inheritance:**

This field is inherited by subtypes, except it is not inherited by static types whose `tp_base` is `NULL` or `&PyBaseObject_Type`.

**Default:**

For static types this field has no default. This means if the slot is defined as `NULL`, the type cannot be called to create new instances; presumably there is some other way to create instances, like a factory function.

<!-- anchor: c.PyTypeObject.tp_free | type: c member -->
### `freefunc PyTypeObject.tp_free`

*The corresponding slot ID `Py_tp_free` is part of the Stable ABI.*

An optional pointer to an instance deallocation function. Its signature is:

```c
void tp_free(void *self);
```

This function must free the memory allocated by `tp_alloc`.

**Inheritance:**

Static subtypes inherit this slot, which will be `PyObject_Free()` if inherited from `object`. Exception: If the type supports garbage collection (i.e., the `Py_TPFLAGS_HAVE_GC` flag is set in `tp_flags`) and it would inherit `PyObject_Free()`, then this slot is not inherited but instead defaults to `PyObject_GC_Del()`.

Heap subtypes do not inherit this slot.

**Default:**

For heap subtypes, this slot defaults to a deallocator suitable to match `PyType_GenericAlloc()` and the value of the `Py_TPFLAGS_HAVE_GC` flag.

For static subtypes, this slot is inherited (see above).

<!-- anchor: c.PyTypeObject.tp_is_gc | type: c member -->
### `inquiry PyTypeObject.tp_is_gc`

*The corresponding slot ID `Py_tp_is_gc` is part of the Stable ABI.*

An optional pointer to a function called by the garbage collector.

The garbage collector needs to know whether a particular object is collectible or not. Normally, it is sufficient to look at the object’s type’s `tp_flags` field, and check the `Py_TPFLAGS_HAVE_GC` flag bit. But some types have a mixture of statically and dynamically allocated instances, and the statically allocated instances are not collectible. Such types should define this function; it should return `1` for a collectible instance, and `0` for a non-collectible instance. The signature is:

```c
int tp_is_gc(PyObject *self);
```

(The only example of this are types themselves. The metatype, `PyType_Type`, defines this function to distinguish between statically and dynamically allocated types.)

**Inheritance:**

This field is inherited by subtypes.

**Default:**

This slot has no default. If this field is `NULL`, `Py_TPFLAGS_HAVE_GC` is used as the functional equivalent.

<!-- anchor: c.PyTypeObject.tp_bases | type: c member -->
### `PyObject *PyTypeObject.tp_bases`

Tuple of base types.

This field should be set to `NULL` and treated as read-only. Python will fill it in when the type is `initialized`.

For the corresponding slot ID, see `Py_tp_bases`.

**Warning:**

Multiple inheritance does not work well for statically defined types. If you set `tp_bases` to a tuple, Python will not raise an error, but some slots will only be inherited from the first base.

**Inheritance:**

This field is not inherited.

<!-- anchor: c.PyTypeObject.tp_mro | type: c member -->
### `PyObject *PyTypeObject.tp_mro`

Tuple containing the expanded set of base types, starting with the type itself and ending with `object`, in Method Resolution Order.

This field should be set to `NULL` and treated as read-only. Python will fill it in when the type is `initialized`.

**Inheritance:**

This field is not inherited; it is calculated fresh by `PyType_Ready()`.

<!-- anchor: c.PyTypeObject.tp_cache | type: c member -->
### `PyObject *PyTypeObject.tp_cache`

Unused. Internal use only.

**Inheritance:**

This field is not inherited.

<!-- anchor: c.PyTypeObject.tp_subclasses | type: c member -->
### `void *PyTypeObject.tp_subclasses`

A collection of subclasses. Internal use only. May be an invalid pointer.

To get a list of subclasses, call the Python method `__subclasses__()`.

Changed in version 3.12: For some types, this field does not hold a valid PyObject*. The type was changed to void* to indicate this.

**Inheritance:**

This field is not inherited.

<!-- anchor: c.PyTypeObject.tp_weaklist | type: c member -->
### `PyObject *PyTypeObject.tp_weaklist`

Weak reference list head, for weak references to this type object. Not inherited. Internal use only.

Changed in version 3.12: Internals detail: For the static builtin types this is always `NULL`, even if weakrefs are added. Instead, the weakrefs for each are stored on `PyInterpreterState`. Use the public C-API or the internal `_PyObject_GET_WEAKREFS_LISTPTR()` macro to avoid the distinction.

**Inheritance:**

This field is not inherited.

<!-- anchor: c.PyTypeObject.tp_del | type: c member -->
### `destructor PyTypeObject.tp_del`

*The corresponding slot ID `Py_tp_del` is part of the Stable ABI.*

This field is deprecated. Use `tp_finalize` instead.

<!-- anchor: c.PyTypeObject.tp_version_tag | type: c member -->
### `unsigned int PyTypeObject.tp_version_tag`

Used to index into the method cache. Internal use only.

**Inheritance:**

This field is not inherited.

<!-- anchor: c.PyTypeObject.tp_finalize | type: c member -->
### `destructor PyTypeObject.tp_finalize`

*The corresponding slot ID `Py_tp_finalize` is part of the Stable ABI since version 3.5.*

An optional pointer to an instance finalization function. This is the C implementation of the `__del__()` special method. Its signature is:

```c
void tp_finalize(PyObject *self);
```

The primary purpose of finalization is to perform any non-trivial cleanup that must be performed before the object is destroyed, while the object and any other objects it directly or indirectly references are still in a consistent state. The finalizer is allowed to execute arbitrary Python code.

Before Python automatically finalizes an object, some of the object’s direct or indirect referents might have themselves been automatically finalized. However, none of the referents will have been automatically cleared (`tp_clear`) yet.

Other non-finalized objects might still be using a finalized object, so the finalizer must leave the object in a sane state (e.g., invariants are still met).

**Note:**

After Python automatically finalizes an object, Python might start automatically clearing (`tp_clear`) the object and its referents (direct and indirect). Cleared objects are not guaranteed to be in a consistent state; a finalized object must be able to tolerate cleared referents.

**Note:**

An object is not guaranteed to be automatically finalized before its destructor (`tp_dealloc`) is called. It is recommended to call `PyObject_CallFinalizerFromDealloc()` at the beginning of `tp_dealloc` to guarantee that the object is always finalized before destruction.

**Note:**

The `tp_finalize` function can be called from any thread, although the GIL will be held.

**Note:**

The `tp_finalize` function can be called during shutdown, after some global variables have been deleted. See the documentation of the `__del__()` method for details.

When Python finalizes an object, it behaves like the following algorithm:

1. Python might mark the object as *finalized*. Currently, Python always marks objects whose type supports garbage collection (i.e., the `Py_TPFLAGS_HAVE_GC` flag is set in `tp_flags`) and never marks other types of objects; this might change in a future version.

2. If the object is not marked as *finalized* and its `tp_finalize` finalizer function is non-`NULL`, the finalizer function is called.

3. If the finalizer function was called and the finalizer made the object reachable (i.e., there is a reference to the object and it is not a member of a cyclic isolate), then the finalizer is said to have *resurrected* the object. It is unspecified whether the finalizer can also resurrect the object by adding a new reference to the object that does not make it reachable, i.e., the object is (still) a member of a cyclic isolate.

4. If the finalizer resurrected the object, the object’s pending destruction is canceled and the object’s *finalized* mark might be removed if present. Currently, Python never removes the *finalized* mark; this might change in a future version.

*Automatic finalization* refers to any finalization performed by Python except via calls to `PyObject_CallFinalizer()` or `PyObject_CallFinalizerFromDealloc()`. No guarantees are made about when, if, or how often an object is automatically finalized, except:

- Python will not automatically finalize an object if it is reachable, i.e., there is a reference to it and it is not a member of a cyclic isolate.

- Python will not automatically finalize an object if finalizing it would not mark the object as *finalized*. Currently, this applies to objects whose type does not support garbage collection, i.e., the `Py_TPFLAGS_HAVE_GC` flag is not set. Such objects can still be manually finalized by calling `PyObject_CallFinalizer()` or `PyObject_CallFinalizerFromDealloc()`.

- Python will not automatically finalize any two members of a cyclic isolate concurrently.

- Python will not automatically finalize an object after it has automatically cleared (`tp_clear`) the object.

- If an object is a member of a cyclic isolate, Python will not automatically finalize it after automatically clearing (see `tp_clear`) any other member.

- Python will automatically finalize every member of a cyclic isolate before it automatically clears (see `tp_clear`) any of them.

- If Python is going to automatically clear an object (`tp_clear`), it will automatically finalize the object first.

Python currently only automatically finalizes objects that are members of a cyclic isolate, but future versions might finalize objects regularly before their destruction.

To manually finalize an object, do not call this function directly; call `PyObject_CallFinalizer()` or `PyObject_CallFinalizerFromDealloc()` instead.

`tp_finalize` should leave the current exception status unchanged. The recommended way to write a non-trivial finalizer is to back up the exception at the beginning by calling `PyErr_GetRaisedException()` and restore the exception at the end by calling `PyErr_SetRaisedException()`. If an exception is encountered in the middle of the finalizer, log and clear it with `PyErr_WriteUnraisable()` or `PyErr_FormatUnraisable()`. For example:

```c
static void
foo_finalize(PyObject *self)
{
    // Save the current exception, if any.
    PyObject *exc = PyErr_GetRaisedException();

    // ...

    if (do_something_that_might_raise() != success_indicator) {
        PyErr_WriteUnraisable(self);
        goto done;
    }

done:
    // Restore the saved exception.  This silently discards any exception
    // raised above, so be sure to call PyErr_WriteUnraisable first if
    // necessary.
    PyErr_SetRaisedException(exc);
}
```

**Inheritance:**

This field is inherited by subtypes.

Added in version 3.4.

Changed in version 3.8: Before version 3.8 it was necessary to set the `Py_TPFLAGS_HAVE_FINALIZE` flags bit in order for this field to be used. This is no longer required.

**See also:**

- **PEP 442**: “Safe object finalization”

- Object Life Cycle for details about how this slot relates to other slots.

- `PyObject_CallFinalizer()`

- `PyObject_CallFinalizerFromDealloc()`

<!-- anchor: c.PyTypeObject.tp_vectorcall | type: c member -->
### `vectorcallfunc PyTypeObject.tp_vectorcall`

*The corresponding slot ID `Py_tp_vectorcall` is part of the Stable ABI since version 3.14.*

A vectorcall function to use for calls of this type object (rather than instances). In other words, `tp_vectorcall` can be used to optimize `type.__call__`, which typically returns a new instance of *type*.

As with any vectorcall function, if `tp_vectorcall` is `NULL`, the *tp_call* protocol (`Py_TYPE(type)->tp_call`) is used instead.

**Note:**

The vectorcall protocol requires that the vectorcall function has the same behavior as the corresponding `tp_call`. This means that `type->tp_vectorcall` must match the behavior of `Py_TYPE(type)->tp_call`.

Specifically, if *type* uses the default metaclass, `type->tp_vectorcall` must behave the same as PyType_Type->tp_call, which:

- calls `type->tp_new`,

- if the result is a subclass of *type*, calls `type->tp_init` on the result of `tp_new`, and

- returns the result of `tp_new`.

Typically, `tp_vectorcall` is overridden to optimize this process for specific `tp_new` and `tp_init`. When doing this for user-subclassable types, note that both can be overridden (using `__new__()` and `__init__()`, respectively).

**Inheritance:**

This field is never inherited.

Added in version 3.9: (the field exists since 3.8 but it’s only used since 3.9)

<!-- anchor: c.PyTypeObject.tp_watched | type: c member -->
### `unsigned char PyTypeObject.tp_watched`

Internal. Do not use.

Added in version 3.12.

<!-- anchor: static-types | type: section -->
## Static Types

Traditionally, types defined in C code are *static*, that is, a static `PyTypeObject` structure is defined directly in code and initialized using `PyType_Ready()`.

This results in types that are limited relative to types defined in Python:

- Static types are limited to one base, i.e. they cannot use multiple inheritance.

- Static type objects (but not necessarily their instances) are immutable. It is not possible to add or modify the type object’s attributes from Python.

- Static type objects are shared across sub-interpreters, so they should not include any subinterpreter-specific state.

Also, since `PyTypeObject` is only part of the Limited API as an opaque struct, any extension modules using static types must be compiled for a specific Python minor version.

<!-- anchor: heap-types | type: section -->
## Heap Types

An alternative to static types is *heap-allocated types*, or *heap types* for short, which correspond closely to classes created by Python’s `class` statement. Heap types have the `Py_TPFLAGS_HEAPTYPE` flag set.

This is done by filling a `PyType_Spec` structure and calling `PyType_FromSpec()`, `PyType_FromSpecWithBases()`, `PyType_FromModuleAndSpec()`, or `PyType_FromMetaclass()`.

<!-- anchor: number-object-structures | type: section -->
## Number Object Structures

<!-- anchor: c.PyNumberMethods | type: c type -->
### `type PyNumberMethods`

This structure holds pointers to the functions which an object uses to implement the number protocol. Each function is used by the function of similar name documented in the Number Protocol section.

Here is the structure definition:

```c
typedef struct {
     binaryfunc nb_add;
     binaryfunc nb_subtract;
     binaryfunc nb_multiply;
     binaryfunc nb_remainder;
     binaryfunc nb_divmod;
     ternaryfunc nb_power;
     unaryfunc nb_negative;
     unaryfunc nb_positive;
     unaryfunc nb_absolute;
     inquiry nb_bool;
     unaryfunc nb_invert;
     binaryfunc nb_lshift;
     binaryfunc nb_rshift;
     binaryfunc nb_and;
     binaryfunc nb_xor;
     binaryfunc nb_or;
     unaryfunc nb_int;
     void *nb_reserved;
     unaryfunc nb_float;

     binaryfunc nb_inplace_add;
     binaryfunc nb_inplace_subtract;
     binaryfunc nb_inplace_multiply;
     binaryfunc nb_inplace_remainder;
     ternaryfunc nb_inplace_power;
     binaryfunc nb_inplace_lshift;
     binaryfunc nb_inplace_rshift;
     binaryfunc nb_inplace_and;
     binaryfunc nb_inplace_xor;
     binaryfunc nb_inplace_or;

     binaryfunc nb_floor_divide;
     binaryfunc nb_true_divide;
     binaryfunc nb_inplace_floor_divide;
     binaryfunc nb_inplace_true_divide;

     unaryfunc nb_index;

     binaryfunc nb_matrix_multiply;
     binaryfunc nb_inplace_matrix_multiply;
} PyNumberMethods;
```

**Note:**

Binary and ternary functions must check the type of all their operands, and implement the necessary conversions (at least one of the operands is an instance of the defined type). If the operation is not defined for the given operands, binary and ternary functions must return `Py_NotImplemented`, if another error occurred they must return `NULL` and set an exception.

**Note:**

The `nb_reserved` field should always be `NULL`. It was previously called `nb_long`, and was renamed in Python 3.0.1.

<!-- anchor: c.PyNumberMethods.nb_add | type: c member -->
### `binaryfunc PyNumberMethods.nb_add`

*The corresponding slot ID `Py_nb_add` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_subtract | type: c member -->
### `binaryfunc PyNumberMethods.nb_subtract`

*The corresponding slot ID `Py_nb_subtract` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_multiply | type: c member -->
### `binaryfunc PyNumberMethods.nb_multiply`

*The corresponding slot ID `Py_nb_multiply` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_remainder | type: c member -->
### `binaryfunc PyNumberMethods.nb_remainder`

*The corresponding slot ID `Py_nb_remainder` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_divmod | type: c member -->
### `binaryfunc PyNumberMethods.nb_divmod`

*The corresponding slot ID `Py_nb_divmod` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_power | type: c member -->
### `ternaryfunc PyNumberMethods.nb_power`

*The corresponding slot ID `Py_nb_power` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_negative | type: c member -->
### `unaryfunc PyNumberMethods.nb_negative`

*The corresponding slot ID `Py_nb_negative` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_positive | type: c member -->
### `unaryfunc PyNumberMethods.nb_positive`

*The corresponding slot ID `Py_nb_positive` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_absolute | type: c member -->
### `unaryfunc PyNumberMethods.nb_absolute`

*The corresponding slot ID `Py_nb_absolute` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_bool | type: c member -->
### `inquiry PyNumberMethods.nb_bool`

*The corresponding slot ID `Py_nb_bool` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_invert | type: c member -->
### `unaryfunc PyNumberMethods.nb_invert`

*The corresponding slot ID `Py_nb_invert` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_lshift | type: c member -->
### `binaryfunc PyNumberMethods.nb_lshift`

*The corresponding slot ID `Py_nb_lshift` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_rshift | type: c member -->
### `binaryfunc PyNumberMethods.nb_rshift`

*The corresponding slot ID `Py_nb_rshift` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_and | type: c member -->
### `binaryfunc PyNumberMethods.nb_and`

*The corresponding slot ID `Py_nb_and` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_xor | type: c member -->
### `binaryfunc PyNumberMethods.nb_xor`

*The corresponding slot ID `Py_nb_xor` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_or | type: c member -->
### `binaryfunc PyNumberMethods.nb_or`

*The corresponding slot ID `Py_nb_or` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_int | type: c member -->
### `unaryfunc PyNumberMethods.nb_int`

*The corresponding slot ID `Py_nb_int` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_reserved | type: c member -->
### `void *PyNumberMethods.nb_reserved`

<!-- anchor: c.PyNumberMethods.nb_float | type: c member -->
### `unaryfunc PyNumberMethods.nb_float`

*The corresponding slot ID `Py_nb_float` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_inplace_add | type: c member -->
### `binaryfunc PyNumberMethods.nb_inplace_add`

*The corresponding slot ID `Py_nb_inplace_add` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_inplace_subtract | type: c member -->
### `binaryfunc PyNumberMethods.nb_inplace_subtract`

*The corresponding slot ID `Py_nb_inplace_subtract` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_inplace_multiply | type: c member -->
### `binaryfunc PyNumberMethods.nb_inplace_multiply`

*The corresponding slot ID `Py_nb_inplace_multiply` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_inplace_remainder | type: c member -->
### `binaryfunc PyNumberMethods.nb_inplace_remainder`

*The corresponding slot ID `Py_nb_inplace_remainder` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_inplace_power | type: c member -->
### `ternaryfunc PyNumberMethods.nb_inplace_power`

*The corresponding slot ID `Py_nb_inplace_power` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_inplace_lshift | type: c member -->
### `binaryfunc PyNumberMethods.nb_inplace_lshift`

*The corresponding slot ID `Py_nb_inplace_lshift` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_inplace_rshift | type: c member -->
### `binaryfunc PyNumberMethods.nb_inplace_rshift`

*The corresponding slot ID `Py_nb_inplace_rshift` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_inplace_and | type: c member -->
### `binaryfunc PyNumberMethods.nb_inplace_and`

*The corresponding slot ID `Py_nb_inplace_and` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_inplace_xor | type: c member -->
### `binaryfunc PyNumberMethods.nb_inplace_xor`

*The corresponding slot ID `Py_nb_inplace_xor` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_inplace_or | type: c member -->
### `binaryfunc PyNumberMethods.nb_inplace_or`

*The corresponding slot ID `Py_nb_inplace_or` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_floor_divide | type: c member -->
### `binaryfunc PyNumberMethods.nb_floor_divide`

*The corresponding slot ID `Py_nb_floor_divide` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_true_divide | type: c member -->
### `binaryfunc PyNumberMethods.nb_true_divide`

*The corresponding slot ID `Py_nb_true_divide` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_inplace_floor_divide | type: c member -->
### `binaryfunc PyNumberMethods.nb_inplace_floor_divide`

*The corresponding slot ID `Py_nb_inplace_floor_divide` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_inplace_true_divide | type: c member -->
### `binaryfunc PyNumberMethods.nb_inplace_true_divide`

*The corresponding slot ID `Py_nb_inplace_true_divide` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_index | type: c member -->
### `unaryfunc PyNumberMethods.nb_index`

*The corresponding slot ID `Py_nb_index` is part of the Stable ABI.*

<!-- anchor: c.PyNumberMethods.nb_matrix_multiply | type: c member -->
### `binaryfunc PyNumberMethods.nb_matrix_multiply`

*The corresponding slot ID `Py_nb_matrix_multiply` is part of the Stable ABI since version 3.5.*

<!-- anchor: c.PyNumberMethods.nb_inplace_matrix_multiply | type: c member -->
### `binaryfunc PyNumberMethods.nb_inplace_matrix_multiply`

*The corresponding slot ID `Py_nb_inplace_matrix_multiply` is part of the Stable ABI since version 3.5.*

<!-- anchor: mapping-object-structures | type: section -->
## Mapping Object Structures

<!-- anchor: c.PyMappingMethods | type: c type -->
### `type PyMappingMethods`

This structure holds pointers to the functions which an object uses to implement the mapping protocol. It has three members:

<!-- anchor: c.PyMappingMethods.mp_length | type: c member -->
### `lenfunc PyMappingMethods.mp_length`

*The corresponding slot ID `Py_mp_length` is part of the Stable ABI.*

This function is used by `PyMapping_Size()` and `PyObject_Size()`, and has the same signature. This slot may be set to `NULL` if the object has no defined length.

<!-- anchor: c.PyMappingMethods.mp_subscript | type: c member -->
### `binaryfunc PyMappingMethods.mp_subscript`

*The corresponding slot ID `Py_mp_subscript` is part of the Stable ABI.*

This function is used by `PyObject_GetItem()` and `PySequence_GetSlice()`, and has the same signature as `PyObject_GetItem()`. This slot must be filled for the `PyMapping_Check()` function to return `1`, it can be `NULL` otherwise.

<!-- anchor: c.PyMappingMethods.mp_ass_subscript | type: c member -->
### `objobjargproc PyMappingMethods.mp_ass_subscript`

*The corresponding slot ID `Py_mp_ass_subscript` is part of the Stable ABI.*

This function is used by `PyObject_SetItem()`, `PyObject_DelItem()`, `PySequence_SetSlice()` and `PySequence_DelSlice()`. It has the same signature as `PyObject_SetItem()`, but *v* can also be set to `NULL` to delete an item. If this slot is `NULL`, the object does not support item assignment and deletion.

<!-- anchor: sequence-object-structures | type: section -->
## Sequence Object Structures

<!-- anchor: c.PySequenceMethods | type: c type -->
### `type PySequenceMethods`

This structure holds pointers to the functions which an object uses to implement the sequence protocol.

<!-- anchor: c.PySequenceMethods.sq_length | type: c member -->
### `lenfunc PySequenceMethods.sq_length`

*The corresponding slot ID `Py_sq_length` is part of the Stable ABI.*

This function is used by `PySequence_Size()` and `PyObject_Size()`, and has the same signature. It is also used for handling negative indices via the `sq_item` and the `sq_ass_item` slots.

<!-- anchor: c.PySequenceMethods.sq_concat | type: c member -->
### `binaryfunc PySequenceMethods.sq_concat`

*The corresponding slot ID `Py_sq_concat` is part of the Stable ABI.*

This function is used by `PySequence_Concat()` and has the same signature. It is also used by the `+` operator, after trying the numeric addition via the `nb_add` slot.

<!-- anchor: c.PySequenceMethods.sq_repeat | type: c member -->
### `ssizeargfunc PySequenceMethods.sq_repeat`

*The corresponding slot ID `Py_sq_repeat` is part of the Stable ABI.*

This function is used by `PySequence_Repeat()` and has the same signature. It is also used by the `*` operator, after trying numeric multiplication via the `nb_multiply` slot.

<!-- anchor: c.PySequenceMethods.sq_item | type: c member -->
### `ssizeargfunc PySequenceMethods.sq_item`

*The corresponding slot ID `Py_sq_item` is part of the Stable ABI.*

This function is used by `PySequence_GetItem()` and has the same signature. It is also used by `PyObject_GetItem()`, after trying the subscription via the `mp_subscript` slot. This slot must be filled for the `PySequence_Check()` function to return `1`, it can be `NULL` otherwise.

Negative indexes are handled as follows: if the `sq_length` slot is filled, it is called and the sequence length is used to compute a positive index which is passed to `sq_item`. If `sq_length` is `NULL`, the index is passed as is to the function.

<!-- anchor: c.PySequenceMethods.sq_ass_item | type: c member -->
### `ssizeobjargproc PySequenceMethods.sq_ass_item`

*The corresponding slot ID `Py_sq_ass_item` is part of the Stable ABI.*

This function is used by `PySequence_SetItem()` and has the same signature. It is also used by `PyObject_SetItem()` and `PyObject_DelItem()`, after trying the item assignment and deletion via the `mp_ass_subscript` slot. This slot may be left to `NULL` if the object does not support item assignment and deletion.

<!-- anchor: c.PySequenceMethods.sq_contains | type: c member -->
### `objobjproc PySequenceMethods.sq_contains`

*The corresponding slot ID `Py_sq_contains` is part of the Stable ABI.*

This function may be used by `PySequence_Contains()` and has the same signature. This slot may be left to `NULL`, in this case `PySequence_Contains()` simply traverses the sequence until it finds a match.

<!-- anchor: c.PySequenceMethods.sq_inplace_concat | type: c member -->
### `binaryfunc PySequenceMethods.sq_inplace_concat`

*The corresponding slot ID `Py_sq_inplace_concat` is part of the Stable ABI.*

This function is used by `PySequence_InPlaceConcat()` and has the same signature. It should modify its first operand, and return it. This slot may be left to `NULL`, in this case `PySequence_InPlaceConcat()` will fall back to `PySequence_Concat()`. It is also used by the augmented assignment `+=`, after trying numeric in-place addition via the `nb_inplace_add` slot.

<!-- anchor: c.PySequenceMethods.sq_inplace_repeat | type: c member -->
### `ssizeargfunc PySequenceMethods.sq_inplace_repeat`

*The corresponding slot ID `Py_sq_inplace_repeat` is part of the Stable ABI.*

This function is used by `PySequence_InPlaceRepeat()` and has the same signature. It should modify its first operand, and return it. This slot may be left to `NULL`, in this case `PySequence_InPlaceRepeat()` will fall back to `PySequence_Repeat()`. It is also used by the augmented assignment `*=`, after trying numeric in-place multiplication via the `nb_inplace_multiply` slot.

<!-- anchor: buffer-object-structures | type: section -->
## Buffer Object Structures

<!-- anchor: c.PyBufferProcs | type: c type -->
### `type PyBufferProcs`

This structure holds pointers to the functions required by the Buffer protocol. The protocol defines how an exporter object can expose its internal data to consumer objects.

<!-- anchor: c.PyBufferProcs.bf_getbuffer | type: c member -->
### `getbufferproc PyBufferProcs.bf_getbuffer`

*The corresponding slot ID `Py_bf_getbuffer` is part of the Stable ABI since version 3.11.*

The signature of this function is:

```c
int (PyObject *exporter, Py_buffer *view, int flags);
```

Handle a request to *exporter* to fill in *view* as specified by *flags*. Except for point (3), an implementation of this function MUST take these steps:

1. Check if the request can be met. If not, raise `BufferError`, set `view->obj` to `NULL` and return `-1`.

2. Fill in the requested fields.

3. Increment an internal counter for the number of exports.

4. Set `view->obj` to *exporter* and increment `view->obj`.

5. Return `0`.

**Thread safety:**

In the free-threaded build, implementations must ensure:

- The export counter increment in step (3) is atomic.

- The underlying buffer data remains valid and at a stable memory location for the lifetime of all exports.

- For objects that support resizing or reallocation (such as `bytearray`), the export counter is checked atomically before such operations, and `BufferError` is raised if exports exist.

- The function is safe to call concurrently from multiple threads.

See also Thread safety for memoryview objects for the Python-level thread safety guarantees of `memoryview` objects.

If *exporter* is part of a chain or tree of buffer providers, two main schemes can be used:

- Re-export: Each member of the tree acts as the exporting object and sets `view->obj` to a new reference to itself.

- Redirect: The buffer request is redirected to the root object of the tree. Here, `view->obj` will be a new reference to the root object.

The individual fields of *view* are described in section Buffer structure, the rules how an exporter must react to specific requests are in section Buffer request types.

All memory pointed to in the `Py_buffer` structure belongs to the exporter and must remain valid until there are no consumers left. `format`, `shape`, `strides`, `suboffsets` and `internal` are read-only for the consumer.

`PyBuffer_FillInfo()` provides an easy way of exposing a simple bytes buffer while dealing correctly with all request types.

`PyObject_GetBuffer()` is the interface for the consumer that wraps this function.

<!-- anchor: c.PyBufferProcs.bf_releasebuffer | type: c member -->
### `releasebufferproc PyBufferProcs.bf_releasebuffer`

*The corresponding slot ID `Py_bf_releasebuffer` is part of the Stable ABI since version 3.11.*

The signature of this function is:

```c
void (PyObject *exporter, Py_buffer *view);
```

Handle a request to release the resources of the buffer. If no resources need to be released, `PyBufferProcs.bf_releasebuffer` may be `NULL`. Otherwise, a standard implementation of this function will take these optional steps:

1. Decrement an internal counter for the number of exports.

2. If the counter is `0`, free all memory associated with *view*.

**Thread safety:**

In the free-threaded build:

- The export counter decrement in step (1) must be atomic.

- Resource cleanup when the counter reaches zero must be done atomically, as the final release may race with concurrent releases from other threads and deallocation must only happen once.

The exporter MUST use the `internal` field to keep track of buffer-specific resources. This field is guaranteed to remain constant, while a consumer MAY pass a copy of the original buffer as the *view* argument.

This function MUST NOT decrement `view->obj`, since that is done automatically in `PyBuffer_Release()` (this scheme is useful for breaking reference cycles).

`PyBuffer_Release()` is the interface for the consumer that wraps this function.

<!-- anchor: async-object-structures | type: section -->
## Async Object Structures

Added in version 3.5.

<!-- anchor: c.PyAsyncMethods | type: c type -->
### `type PyAsyncMethods`

This structure holds pointers to the functions required to implement awaitable and asynchronous iterator objects.

Here is the structure definition:

```c
typedef struct {
    unaryfunc am_await;
    unaryfunc am_aiter;
    unaryfunc am_anext;
    sendfunc am_send;
} PyAsyncMethods;
```

<!-- anchor: c.PyAsyncMethods.am_await | type: c member -->
### `unaryfunc PyAsyncMethods.am_await`

*The corresponding slot ID `Py_am_await` is part of the Stable ABI since version 3.5.*

The signature of this function is:

```c
PyObject *am_await(PyObject *self);
```

The returned object must be an iterator, i.e. `PyIter_Check()` must return `1` for it.

This slot may be set to `NULL` if an object is not an awaitable.

<!-- anchor: c.PyAsyncMethods.am_aiter | type: c member -->
### `unaryfunc PyAsyncMethods.am_aiter`

*The corresponding slot ID `Py_am_aiter` is part of the Stable ABI since version 3.5.*

The signature of this function is:

```c
PyObject *am_aiter(PyObject *self);
```

Must return an asynchronous iterator object. See `__anext__()` for details.

This slot may be set to `NULL` if an object does not implement asynchronous iteration protocol.

<!-- anchor: c.PyAsyncMethods.am_anext | type: c member -->
### `unaryfunc PyAsyncMethods.am_anext`

*The corresponding slot ID `Py_am_anext` is part of the Stable ABI since version 3.5.*

The signature of this function is:

```c
PyObject *am_anext(PyObject *self);
```

Must return an awaitable object. See `__anext__()` for details. This slot may be set to `NULL`.

<!-- anchor: c.PyAsyncMethods.am_send | type: c member -->
### `sendfunc PyAsyncMethods.am_send`

*The corresponding slot ID `Py_am_send` is part of the Stable ABI since version 3.10.*

The signature of this function is:

```c
PySendResult am_send(PyObject *self, PyObject *arg, PyObject **result);
```

See `PyIter_Send()` for details. This slot may be set to `NULL`.

Added in version 3.10.

<!-- anchor: slot-type-typedefs | type: section -->
## Slot Type typedefs

<!-- anchor: c.allocfunc | type: c type -->
### `typedef PyObject *(*allocfunc)(PyTypeObject *cls, Py_ssize_t nitems)`

*Part of the Stable ABI.*

The purpose of this function is to separate memory allocation from memory initialization. It should return a pointer to a block of memory of adequate length for the instance, suitably aligned, and initialized to zeros, but with `ob_refcnt` set to `1` and `ob_type` set to the type argument. If the type’s `tp_itemsize` is non-zero, the object’s `ob_size` field should be initialized to *nitems* and the length of the allocated memory block should be `tp_basicsize + nitems*tp_itemsize`, rounded up to a multiple of `sizeof(void*)`; otherwise, *nitems* is not used and the length of the block should be `tp_basicsize`.

This function should not do any other instance initialization, not even to allocate additional memory; that should be done by `tp_new`.

<!-- anchor: c.destructor | type: c type -->
### `typedef void (*destructor)(PyObject*)`

*Part of the Stable ABI.*

<!-- anchor: c.freefunc | type: c type -->
### `typedef void (*freefunc)(void*)`

See `tp_free`.

<!-- anchor: c.newfunc | type: c type -->
### `typedef PyObject *(*newfunc)(PyTypeObject*, PyObject*, PyObject*)`

*Part of the Stable ABI.*

See `tp_new`.

<!-- anchor: c.initproc | type: c type -->
### `typedef int (*initproc)(PyObject*, PyObject*, PyObject*)`

*Part of the Stable ABI.*

See `tp_init`.

<!-- anchor: c.reprfunc | type: c type -->
### `typedef PyObject *(*reprfunc)(PyObject*)`

*Part of the Stable ABI.*

See `tp_repr`.

<!-- anchor: c.getattrfunc | type: c type -->
### `typedef PyObject *(*getattrfunc)(PyObject *self, char *attr)`

*Part of the Stable ABI.*

Return the value of the named attribute for the object.

<!-- anchor: c.setattrfunc | type: c type -->
### `typedef int (*setattrfunc)(PyObject *self, char *attr, PyObject *value)`

*Part of the Stable ABI.*

Set the value of the named attribute for the object. The value argument is set to `NULL` to delete the attribute.

<!-- anchor: c.getattrofunc | type: c type -->
### `typedef PyObject *(*getattrofunc)(PyObject *self, PyObject *attr)`

*Part of the Stable ABI.*

Return the value of the named attribute for the object.

See `tp_getattro`.

<!-- anchor: c.setattrofunc | type: c type -->
### `typedef int (*setattrofunc)(PyObject *self, PyObject *attr, PyObject *value)`

*Part of the Stable ABI.*

Set the value of the named attribute for the object. The value argument is set to `NULL` to delete the attribute.

See `tp_setattro`.

<!-- anchor: c.descrgetfunc | type: c type -->
### `typedef PyObject *(*descrgetfunc)(PyObject*, PyObject*, PyObject*)`

*Part of the Stable ABI.*

See `tp_descr_get`.

<!-- anchor: c.descrsetfunc | type: c type -->
### `typedef int (*descrsetfunc)(PyObject*, PyObject*, PyObject*)`

*Part of the Stable ABI.*

See `tp_descr_set`.

<!-- anchor: c.hashfunc | type: c type -->
### `typedef Py_hash_t (*hashfunc)(PyObject*)`

*Part of the Stable ABI.*

See `tp_hash`.

<!-- anchor: c.richcmpfunc | type: c type -->
### `typedef PyObject *(*richcmpfunc)(PyObject*, PyObject*, int)`

*Part of the Stable ABI.*

See `tp_richcompare`.

<!-- anchor: c.getiterfunc | type: c type -->
### `typedef PyObject *(*getiterfunc)(PyObject*)`

*Part of the Stable ABI.*

See `tp_iter`.

<!-- anchor: c.iternextfunc | type: c type -->
### `typedef PyObject *(*iternextfunc)(PyObject*)`

*Part of the Stable ABI.*

See `tp_iternext`.

<!-- anchor: c.lenfunc | type: c type -->
### `typedef Py_ssize_t (*lenfunc)(PyObject*)`

*Part of the Stable ABI.*

<!-- anchor: c.getbufferproc | type: c type -->
### `typedef int (*getbufferproc)(PyObject*, Py_buffer*, int)`

*Part of the Stable ABI since version 3.12.*

<!-- anchor: c.releasebufferproc | type: c type -->
### `typedef void (*releasebufferproc)(PyObject*, Py_buffer*)`

*Part of the Stable ABI since version 3.12.*

<!-- anchor: c.unaryfunc | type: c type -->
### `typedef PyObject *(*unaryfunc)(PyObject*)`

*Part of the Stable ABI.*

<!-- anchor: c.binaryfunc | type: c type -->
### `typedef PyObject *(*binaryfunc)(PyObject*, PyObject*)`

*Part of the Stable ABI.*

<!-- anchor: c.sendfunc | type: c type -->
### `typedef PySendResult (*sendfunc)(PyObject*, PyObject*, PyObject**)`

See `am_send`.

<!-- anchor: c.ternaryfunc | type: c type -->
### `typedef PyObject *(*ternaryfunc)(PyObject*, PyObject*, PyObject*)`

*Part of the Stable ABI.*

<!-- anchor: c.ssizeargfunc | type: c type -->
### `typedef PyObject *(*ssizeargfunc)(PyObject*, Py_ssize_t)`

*Part of the Stable ABI.*

<!-- anchor: c.ssizeobjargproc | type: c type -->
### `typedef int (*ssizeobjargproc)(PyObject*, Py_ssize_t, PyObject*)`

*Part of the Stable ABI.*

<!-- anchor: c.objobjproc | type: c type -->
### `typedef int (*objobjproc)(PyObject*, PyObject*)`

*Part of the Stable ABI.*

<!-- anchor: c.objobjargproc | type: c type -->
### `typedef int (*objobjargproc)(PyObject*, PyObject*, PyObject*)`

*Part of the Stable ABI.*

<!-- anchor: examples | type: section -->
## Examples

The following are simple examples of Python type definitions. They include common usage you may encounter. Some demonstrate tricky corner cases. For more examples, practical info, and a tutorial, see Defining Extension Types: Tutorial and Defining Extension Types: Assorted Topics.

A basic static type:

```c
typedef struct {
    PyObject_HEAD
    const char *data;
} MyObject;

static PyTypeObject MyObject_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    .tp_name = "mymod.MyObject",
    .tp_basicsize = sizeof(MyObject),
    .tp_doc = PyDoc_STR("My objects"),
    .tp_new = myobj_new,
    .tp_dealloc = (destructor)myobj_dealloc,
    .tp_repr = (reprfunc)myobj_repr,
};
```

You may also find older code (especially in the CPython code base) with a more verbose initializer:

```c
static PyTypeObject MyObject_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    "mymod.MyObject",               /* tp_name */
    sizeof(MyObject),               /* tp_basicsize */
    0,                              /* tp_itemsize */
    (destructor)myobj_dealloc,      /* tp_dealloc */
    0,                              /* tp_vectorcall_offset */
    0,                              /* tp_getattr */
    0,                              /* tp_setattr */
    0,                              /* tp_as_async */
    (reprfunc)myobj_repr,           /* tp_repr */
    0,                              /* tp_as_number */
    0,                              /* tp_as_sequence */
    0,                              /* tp_as_mapping */
    0,                              /* tp_hash */
    0,                              /* tp_call */
    0,                              /* tp_str */
    0,                              /* tp_getattro */
    0,                              /* tp_setattro */
    0,                              /* tp_as_buffer */
    0,                              /* tp_flags */
    PyDoc_STR("My objects"),        /* tp_doc */
    0,                              /* tp_traverse */
    0,                              /* tp_clear */
    0,                              /* tp_richcompare */
    0,                              /* tp_weaklistoffset */
    0,                              /* tp_iter */
    0,                              /* tp_iternext */
    0,                              /* tp_methods */
    0,                              /* tp_members */
    0,                              /* tp_getset */
    0,                              /* tp_base */
    0,                              /* tp_dict */
    0,                              /* tp_descr_get */
    0,                              /* tp_descr_set */
    0,                              /* tp_dictoffset */
    0,                              /* tp_init */
    0,                              /* tp_alloc */
    myobj_new,                      /* tp_new */
};
```

A type that supports weakrefs, instance dicts, and hashing:

```c
typedef struct {
    PyObject_HEAD
    const char *data;
} MyObject;

static PyTypeObject MyObject_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    .tp_name = "mymod.MyObject",
    .tp_basicsize = sizeof(MyObject),
    .tp_doc = PyDoc_STR("My objects"),
    .tp_flags = Py_TPFLAGS_DEFAULT | Py_TPFLAGS_BASETYPE |
         Py_TPFLAGS_HAVE_GC | Py_TPFLAGS_MANAGED_DICT |
         Py_TPFLAGS_MANAGED_WEAKREF,
    .tp_new = myobj_new,
    .tp_traverse = (traverseproc)myobj_traverse,
    .tp_clear = (inquiry)myobj_clear,
    .tp_alloc = PyType_GenericNew,
    .tp_dealloc = (destructor)myobj_dealloc,
    .tp_repr = (reprfunc)myobj_repr,
    .tp_hash = (hashfunc)myobj_hash,
    .tp_richcompare = PyBaseObject_Type.tp_richcompare,
};
```

A str subclass that cannot be subclassed and cannot be called to create instances (e.g. uses a separate factory func) using `Py_TPFLAGS_DISALLOW_INSTANTIATION` flag:

```c
typedef struct {
    PyUnicodeObject raw;
    char *extra;
} MyStr;

static PyTypeObject MyStr_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    .tp_name = "mymod.MyStr",
    .tp_basicsize = sizeof(MyStr),
    .tp_base = NULL,  // set to &PyUnicode_Type in module init
    .tp_doc = PyDoc_STR("my custom str"),
    .tp_flags = Py_TPFLAGS_DEFAULT | Py_TPFLAGS_DISALLOW_INSTANTIATION,
    .tp_repr = (reprfunc)myobj_repr,
};
```

The simplest static type with fixed-length instances:

```c
typedef struct {
    PyObject_HEAD
} MyObject;

static PyTypeObject MyObject_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    .tp_name = "mymod.MyObject",
};
```

The simplest static type with variable-length instances:

```c
typedef struct {
    PyObject_VAR_HEAD
    const char *data[1];
} MyObject;

static PyTypeObject MyObject_Type = {
    PyVarObject_HEAD_INIT(NULL, 0)
    .tp_name = "mymod.MyObject",
    .tp_basicsize = sizeof(MyObject) - sizeof(char *),
    .tp_itemsize = sizeof(char *),
};
```
