---
page: c-api/object.html
title: Object Protocol
area: c-api
kind: guide
---

<!-- anchor: object-protocol | type: section -->
# Object Protocol

<!-- anchor: c.Py_GetConstant | type: c function -->
## `PyObject *Py_GetConstant(unsigned int constant_id)`

*Part of the Stable ABI since version 3.13.*

Get a strong reference to a constant.

Set an exception and return `NULL` if *constant_id* is invalid.

*constant_id* must be one of these constant identifiers:

| Constant Identifier | Value | Returned object |
| --- | --- | --- |
| `Py_CONSTANT_NONE` | `0` | `None` |
| `Py_CONSTANT_FALSE` | `1` | `False` |
| `Py_CONSTANT_TRUE` | `2` | `True` |
| `Py_CONSTANT_ELLIPSIS` | `3` | `Ellipsis` |
| `Py_CONSTANT_NOT_IMPLEMENTED` | `4` | `NotImplemented` |
| `Py_CONSTANT_ZERO` | `5` | `0` |
| `Py_CONSTANT_ONE` | `6` | `1` |
| `Py_CONSTANT_EMPTY_STR` | `7` | `''` |
| `Py_CONSTANT_EMPTY_BYTES` | `8` | `b''` |
| `Py_CONSTANT_EMPTY_TUPLE` | `9` | `()` |

Numeric values are only given for projects which cannot use the constant identifiers.

Added in version 3.13.

**CPython implementation detail:** In CPython, all of these constants are immortal.

<!-- anchor: c.Py_GetConstantBorrowed | type: c function -->
## `PyObject *Py_GetConstantBorrowed(unsigned int constant_id)`

*Part of the Stable ABI since version 3.13.*

Similar to `Py_GetConstant()`, but return a borrowed reference.

This function is primarily intended for backwards compatibility: using `Py_GetConstant()` is recommended for new code.

The reference is borrowed from the interpreter, and is valid until the interpreter finalization.

Added in version 3.13.

<!-- anchor: c.Py_NotImplemented | type: c var -->
## `PyObject *Py_NotImplemented`

The `NotImplemented` singleton, used to signal that an operation is not implemented for the given type combination.

<!-- anchor: c.Py_RETURN_NOTIMPLEMENTED | type: c macro -->
## `Py_RETURN_NOTIMPLEMENTED`

Properly handle returning `Py_NotImplemented` from within a C function (that is, create a new strong reference to `NotImplemented` and return it).

<!-- anchor: c.Py_PRINT_RAW | type: c macro -->
## `Py_PRINT_RAW`

Flag to be used with multiple functions that print the object (like `PyObject_Print()` and `PyFile_WriteObject()`). If passed, these functions use the `str()` of the object instead of the `repr()`.

<!-- anchor: c.PyObject_Print | type: c function -->
## `int PyObject_Print(PyObject *o, FILE *fp, int flags)`

Print an object *o*, on file *fp*. Returns `-1` on error. The flags argument is used to enable certain printing options. The only option currently supported is `Py_PRINT_RAW`; if given, the `str()` of the object is written instead of the `repr()`.

<!-- anchor: c.PyObject_Dump | type: c function -->
## `void PyObject_Dump(PyObject *op)`

Dump an object *op* to `stderr`. This should only be used for debugging.

The output is intended to try dumping objects even after memory corruption:

- Information is written starting with fields that are the least likely to crash when accessed.

- This function can be called without an attached thread state, but it’s not recommended to do so: it can cause deadlocks.

- An object that does not belong to the current interpreter may be dumped, but this may also cause crashes or unintended behavior.

- Implement a heuristic to detect if the object memory has been freed. Don’t display the object contents in this case, only its memory address.

- The output format may change at any time.

Example of output:

```output
object address  : 0x7f80124702c0
object refcount : 2
object type     : 0x9902e0
object type name: str
object repr     : 'abcdef'
```

Added in version 3.15.

<!-- anchor: c.PyObject_HasAttrWithError | type: c function -->
## `int PyObject_HasAttrWithError(PyObject *o, PyObject *attr_name)`

*Part of the Stable ABI since version 3.13.*

Returns `1` if *o* has the attribute *attr_name*, and `0` otherwise. This is equivalent to the Python expression `hasattr(o, attr_name)`. On failure, return `-1`.

Added in version 3.13.

<!-- anchor: c.PyObject_HasAttrStringWithError | type: c function -->
## `int PyObject_HasAttrStringWithError(PyObject *o, const char *attr_name)`

*Part of the Stable ABI since version 3.13.*

This is the same as `PyObject_HasAttrWithError()`, but *attr_name* is specified as a const char* UTF-8 encoded bytes string, rather than a PyObject*.

Added in version 3.13.

<!-- anchor: c.PyObject_HasAttr | type: c function -->
## `int PyObject_HasAttr(PyObject *o, PyObject *attr_name)`

*Part of the Stable ABI.*

Returns `1` if *o* has the attribute *attr_name*, and `0` otherwise. This function always succeeds.

**Note:**

Exceptions that occur when this calls `__getattr__()` and `__getattribute__()` methods aren’t propagated, but instead given to `sys.unraisablehook()`. For proper error handling, use `PyObject_HasAttrWithError()`, `PyObject_GetOptionalAttr()` or `PyObject_GetAttr()` instead.

<!-- anchor: c.PyObject_HasAttrString | type: c function -->
## `int PyObject_HasAttrString(PyObject *o, const char *attr_name)`

*Part of the Stable ABI.*

This is the same as `PyObject_HasAttr()`, but *attr_name* is specified as a const char* UTF-8 encoded bytes string, rather than a PyObject*.

**Note:**

Exceptions that occur when this calls `__getattr__()` and `__getattribute__()` methods or while creating the temporary `str` object are silently ignored. For proper error handling, use `PyObject_HasAttrStringWithError()`, `PyObject_GetOptionalAttrString()` or `PyObject_GetAttrString()` instead.

<!-- anchor: c.PyObject_GetAttr | type: c function -->
## `PyObject *PyObject_GetAttr(PyObject *o, PyObject *attr_name)`

*Return value: New reference.**Part of the Stable ABI.*

Retrieve an attribute named *attr_name* from object *o*. Returns the attribute value on success, or `NULL` on failure. This is the equivalent of the Python expression `o.attr_name`.

If the missing attribute should not be treated as a failure, you can use `PyObject_GetOptionalAttr()` instead.

<!-- anchor: c.PyObject_GetAttrString | type: c function -->
## `PyObject *PyObject_GetAttrString(PyObject *o, const char *attr_name)`

*Return value: New reference.**Part of the Stable ABI.*

This is the same as `PyObject_GetAttr()`, but *attr_name* is specified as a const char* UTF-8 encoded bytes string, rather than a PyObject*.

If the missing attribute should not be treated as a failure, you can use `PyObject_GetOptionalAttrString()` instead.

<!-- anchor: c.PyObject_GetOptionalAttr | type: c function -->
## `int PyObject_GetOptionalAttr(PyObject *obj, PyObject *attr_name, PyObject **result);`

*Part of the Stable ABI since version 3.13.*

Variant of `PyObject_GetAttr()` which doesn’t raise `AttributeError` if the attribute is not found.

If the attribute is found, return `1` and set **result* to a new strong reference to the attribute. If the attribute is not found, return `0` and set **result* to `NULL`; the `AttributeError` is silenced. If an error other than `AttributeError` is raised, return `-1` and set **result* to `NULL`.

Added in version 3.13.

<!-- anchor: c.PyObject_GetOptionalAttrString | type: c function -->
## `int PyObject_GetOptionalAttrString(PyObject *obj, const char *attr_name, PyObject **result);`

*Part of the Stable ABI since version 3.13.*

This is the same as `PyObject_GetOptionalAttr()`, but *attr_name* is specified as a const char* UTF-8 encoded bytes string, rather than a PyObject*.

Added in version 3.13.

<!-- anchor: c.PyObject_GenericGetAttr | type: c function -->
## `PyObject *PyObject_GenericGetAttr(PyObject *o, PyObject *name)`

*Return value: New reference.**Part of the Stable ABI.*

Generic attribute getter function that is meant to be put into a type object’s `tp_getattro` slot. It looks for a descriptor in the dictionary of classes in the object’s MRO as well as an attribute in the object’s `__dict__` (if present). As outlined in Implementing Descriptors, data descriptors take preference over instance attributes, while non-data descriptors don’t. Otherwise, an `AttributeError` is raised.

<!-- anchor: c.PyObject_SetAttr | type: c function -->
## `int PyObject_SetAttr(PyObject *o, PyObject *attr_name, PyObject *v)`

*Part of the Stable ABI.*

Set the value of the attribute named *attr_name*, for object *o*, to the value *v*. Raise an exception and return `-1` on failure; return `0` on success. This is the equivalent of the Python statement `o.attr_name = v`.

If *v* is `NULL`, the attribute is deleted. This behaviour is deprecated in favour of using `PyObject_DelAttr()`, but there are currently no plans to remove it.

The function must not be called with a `NULL` *v* and an exception set. This case can arise from forgetting `NULL` checks and would delete the attribute.

Changed in version 3.15: Must not be called with NULL value if an exception is set.

<!-- anchor: c.PyObject_SetAttrString | type: c function -->
## `int PyObject_SetAttrString(PyObject *o, const char *attr_name, PyObject *v)`

*Part of the Stable ABI.*

This is the same as `PyObject_SetAttr()`, but *attr_name* is specified as a const char* UTF-8 encoded bytes string, rather than a PyObject*.

If *v* is `NULL`, the attribute is deleted, but this feature is deprecated in favour of using `PyObject_DelAttrString()`.

The function must not be called with a `NULL` *v* and an exception set. This case can arise from forgetting `NULL` checks and would delete the attribute.

The number of different attribute names passed to this function should be kept small, usually by using a statically allocated string as *attr_name*. For attribute names that aren’t known at compile time, prefer calling `PyUnicode_FromString()` and `PyObject_SetAttr()` directly. For more details, see `PyUnicode_InternFromString()`, which may be used internally to create a key object.

Changed in version 3.15: Must not be called with NULL value if an exception is set.

<!-- anchor: c.PyObject_GenericSetAttr | type: c function -->
## `int PyObject_GenericSetAttr(PyObject *o, PyObject *name, PyObject *value)`

*Part of the Stable ABI.*

Generic attribute setter and deleter function that is meant to be put into a type object’s `tp_setattro` slot. It looks for a data descriptor in the dictionary of classes in the object’s MRO, and if found it takes preference over setting or deleting the attribute in the instance dictionary. Otherwise, the attribute is set or deleted in the object’s `__dict__` (if present). On success, `0` is returned, otherwise an `AttributeError` is raised and `-1` is returned.

<!-- anchor: c.PyObject_DelAttr | type: c function -->
## `int PyObject_DelAttr(PyObject *o, PyObject *attr_name)`

*Part of the Stable ABI since version 3.13.*

Delete attribute named *attr_name*, for object *o*. Returns `-1` on failure. This is the equivalent of the Python statement `del o.attr_name`.

<!-- anchor: c.PyObject_DelAttrString | type: c function -->
## `int PyObject_DelAttrString(PyObject *o, const char *attr_name)`

*Part of the Stable ABI since version 3.13.*

This is the same as `PyObject_DelAttr()`, but *attr_name* is specified as a const char* UTF-8 encoded bytes string, rather than a PyObject*.

The number of different attribute names passed to this function should be kept small, usually by using a statically allocated string as *attr_name*. For attribute names that aren’t known at compile time, prefer calling `PyUnicode_FromString()` and `PyObject_DelAttr()` directly. For more details, see `PyUnicode_InternFromString()`, which may be used internally to create a key object for lookup.

<!-- anchor: c.PyObject_GenericGetDict | type: c function -->
## `PyObject *PyObject_GenericGetDict(PyObject *o, void *context)`

*Return value: New reference.**Part of the Stable ABI since version 3.10.*

A generic implementation for the getter of a `__dict__` descriptor. It creates the dictionary if necessary.

This function may also be called to get the `__dict__` of the object *o*. Pass `NULL` for *context* when calling it. Since this function may need to allocate memory for the dictionary, it may be more efficient to call `PyObject_GetAttr()` when accessing an attribute on the object.

On failure, returns `NULL` with an exception set.

Added in version 3.3.

<!-- anchor: c.PyObject_GenericSetDict | type: c function -->
## `int PyObject_GenericSetDict(PyObject *o, PyObject *value, void *context)`

*Part of the Stable ABI since version 3.7.*

A generic implementation for the setter of a `__dict__` descriptor. This implementation does not allow the dictionary to be deleted.

Added in version 3.3.

<!-- anchor: c._PyObject_GetDictPtr | type: c function -->
## `PyObject **_PyObject_GetDictPtr(PyObject *obj)`

Return a pointer to `__dict__` of the object *obj*. If there is no `__dict__`, return `NULL` without setting an exception.

This function may need to allocate memory for the dictionary, so it may be more efficient to call `PyObject_GetAttr()` when accessing an attribute on the object.

<!-- anchor: c.PyObject_RichCompare | type: c function -->
## `PyObject *PyObject_RichCompare(PyObject *o1, PyObject *o2, int opid)`

*Return value: New reference.**Part of the Stable ABI.*

Compare the values of *o1* and *o2* using the operation specified by *opid*, which must be one of `Py_LT`, `Py_LE`, `Py_EQ`, `Py_NE`, `Py_GT`, or `Py_GE`, corresponding to `<`, `<=`, `==`, `!=`, `>`, or `>=` respectively. This is the equivalent of the Python expression `o1 op o2`, where `op` is the operator corresponding to *opid*. Returns the value of the comparison on success, or `NULL` on failure.

<!-- anchor: c.PyObject_RichCompareBool | type: c function -->
## `int PyObject_RichCompareBool(PyObject *o1, PyObject *o2, int opid)`

*Part of the Stable ABI.*

Compare the values of *o1* and *o2* using the operation specified by *opid*, like `PyObject_RichCompare()`, but returns `-1` on error, `0` if the result is false, `1` otherwise.

**Note:**

If *o1* and *o2* are the same object, `PyObject_RichCompareBool()` will always return `1` for `Py_EQ` and `0` for `Py_NE`.

<!-- anchor: c.PyObject_Format | type: c function -->
## `PyObject *PyObject_Format(PyObject *obj, PyObject *format_spec)`

*Part of the Stable ABI.*

Format *obj* using *format_spec*. This is equivalent to the Python expression `format(obj, format_spec)`.

*format_spec* may be `NULL`. In this case the call is equivalent to `format(obj)`. Returns the formatted string on success, `NULL` on failure.

<!-- anchor: c.PyObject_Repr | type: c function -->
## `PyObject *PyObject_Repr(PyObject *o)`

*Return value: New reference.**Part of the Stable ABI.*

Compute a string representation of object *o*. Returns the string representation on success, `NULL` on failure. This is the equivalent of the Python expression `repr(o)`. Called by the `repr()` built-in function.

If argument is `NULL`, return the string `'<NULL>'`.

Changed in version 3.4: This function now includes a debug assertion to help ensure that it does not silently discard an active exception.

<!-- anchor: c.PyObject_ASCII | type: c function -->
## `PyObject *PyObject_ASCII(PyObject *o)`

*Return value: New reference.**Part of the Stable ABI.*

As `PyObject_Repr()`, compute a string representation of object *o*, but escape the non-ASCII characters in the string returned by `PyObject_Repr()` with `\x`, `\u` or `\U` escapes. This generates a string similar to that returned by `PyObject_Repr()` in Python 2. Called by the `ascii()` built-in function.

If argument is `NULL`, return the string `'<NULL>'`.

<!-- anchor: c.PyObject_Str | type: c function -->
## `PyObject *PyObject_Str(PyObject *o)`

*Return value: New reference.**Part of the Stable ABI.*

Compute a string representation of object *o*. Returns the string representation on success, `NULL` on failure. This is the equivalent of the Python expression `str(o)`. Called by the `str()` built-in function and, therefore, by the `print()` function.

If argument is `NULL`, return the string `'<NULL>'`.

Changed in version 3.4: This function now includes a debug assertion to help ensure that it does not silently discard an active exception.

<!-- anchor: c.PyObject_Bytes | type: c function -->
## `PyObject *PyObject_Bytes(PyObject *o)`

*Return value: New reference.**Part of the Stable ABI.*

Compute a bytes representation of object *o*. `NULL` is returned on failure and a bytes object on success. This is equivalent to the Python expression `bytes(o)`, when *o* is not an integer. Unlike `bytes(o)`, a TypeError is raised when *o* is an integer instead of a zero-initialized bytes object.

If argument is `NULL`, return the `bytes` object `b'<NULL>'`.

<!-- anchor: c.PyObject_IsSubclass | type: c function -->
## `int PyObject_IsSubclass(PyObject *derived, PyObject *cls)`

*Part of the Stable ABI.*

Return `1` if the class *derived* is identical to or derived from the class *cls*, otherwise return `0`. In case of an error, return `-1`.

If *cls* is a tuple, the check will be done against every entry in *cls*. The result will be `1` when at least one of the checks returns `1`, otherwise it will be `0`.

If *cls* has a `__subclasscheck__()` method, it will be called to determine the subclass status as described in **PEP 3119**. Otherwise, *derived* is a subclass of *cls* if it is a direct or indirect subclass, i.e. contained in `cls.__mro__`.

Normally only class objects, i.e. instances of `type` or a derived class, are considered classes. However, objects can override this by having a `__bases__` attribute (which must be a tuple of base classes).

<!-- anchor: c.PyObject_IsInstance | type: c function -->
## `int PyObject_IsInstance(PyObject *inst, PyObject *cls)`

*Part of the Stable ABI.*

Return `1` if *inst* is an instance of the class *cls* or a subclass of *cls*, or `0` if not. On error, returns `-1` and sets an exception.

If *cls* is a tuple, the check will be done against every entry in *cls*. The result will be `1` when at least one of the checks returns `1`, otherwise it will be `0`.

If *cls* has a `__instancecheck__()` method, it will be called to determine the subclass status as described in **PEP 3119**. Otherwise, *inst* is an instance of *cls* if its class is a subclass of *cls*.

An instance *inst* can override what is considered its class by having a `__class__` attribute.

An object *cls* can override if it is considered a class, and what its base classes are, by having a `__bases__` attribute (which must be a tuple of base classes).

<!-- anchor: c.PyObject_Hash | type: c function -->
## `Py_hash_t PyObject_Hash(PyObject *o)`

*Part of the Stable ABI.*

Compute and return the hash value of an object *o*. On failure, return `-1`. This is the equivalent of the Python expression `hash(o)`.

Changed in version 3.2: The return type is now Py_hash_t. This is a signed integer the same size as `Py_ssize_t`.

<!-- anchor: c.PyObject_HashNotImplemented | type: c function -->
## `Py_hash_t PyObject_HashNotImplemented(PyObject *o)`

*Part of the Stable ABI.*

Set a `TypeError` indicating that `type(o)` is not hashable and return `-1`. This function receives special treatment when stored in a `tp_hash` slot, allowing a type to explicitly indicate to the interpreter that it is not hashable.

<!-- anchor: c.PyObject_IsTrue | type: c function -->
## `int PyObject_IsTrue(PyObject *o)`

*Part of the Stable ABI.*

Returns `1` if the object *o* is considered to be true, and `0` otherwise. This is equivalent to the Python expression `not not o`. On failure, return `-1`.

<!-- anchor: c.PyObject_Not | type: c function -->
## `int PyObject_Not(PyObject *o)`

*Part of the Stable ABI.*

Returns `0` if the object *o* is considered to be true, and `1` otherwise. This is equivalent to the Python expression `not o`. On failure, return `-1`.

<!-- anchor: c.PyObject_Type | type: c function -->
## `PyObject *PyObject_Type(PyObject *o)`

*Return value: New reference.**Part of the Stable ABI.*

When *o* is non-`NULL`, returns a type object corresponding to the object type of object *o*. On failure, raises `SystemError` and returns `NULL`. This is equivalent to the Python expression `type(o)`. This function creates a new strong reference to the return value. There’s really no reason to use this function instead of the `Py_TYPE()` function, which returns a pointer of type PyTypeObject*, except when a new strong reference is needed.

<!-- anchor: c.PyObject_TypeCheck | type: c function -->
## `int PyObject_TypeCheck(PyObject *o, PyTypeObject *type)`

Return non-zero if the object *o* is of type *type* or a subtype of *type*, and `0` otherwise. Both parameters must be non-`NULL`.

<!-- anchor: c.PyObject_Size | type: c function -->
## `Py_ssize_t PyObject_Size(PyObject *o)`

`Py_ssize_t PyObject_Length(PyObject *o)`

*Part of the Stable ABI.*

Return the length of object *o*. If the object *o* provides either the sequence and mapping protocols, the sequence length is returned. On error, `-1` is returned. This is the equivalent to the Python expression `len(o)`.

<!-- anchor: c.PyObject_LengthHint | type: c function -->
## `Py_ssize_t PyObject_LengthHint(PyObject *o, Py_ssize_t defaultvalue)`

Return an estimated length for the object *o*. First try to return its actual length, then an estimate using `__length_hint__()`, and finally return the default value. On error return `-1`. This is the equivalent to the Python expression `operator.length_hint(o, defaultvalue)`.

Added in version 3.4.

<!-- anchor: c.PyObject_GetItem | type: c function -->
## `PyObject *PyObject_GetItem(PyObject *o, PyObject *key)`

*Return value: New reference.**Part of the Stable ABI.*

Return element of *o* corresponding to the object *key* or `NULL` on failure. This is the equivalent of the Python expression `o[key]`.

<!-- anchor: c.PyObject_SetItem | type: c function -->
## `int PyObject_SetItem(PyObject *o, PyObject *key, PyObject *v)`

*Part of the Stable ABI.*

Map the object *key* to the value *v*. Raise an exception and return `-1` on failure; return `0` on success. This is the equivalent of the Python statement `o[key] = v`. This function *does not* steal a reference to *v*.

<!-- anchor: c.PyObject_DelItem | type: c function -->
## `int PyObject_DelItem(PyObject *o, PyObject *key)`

*Part of the Stable ABI.*

Remove the mapping for the object *key* from the object *o*. Return `-1` on failure. This is equivalent to the Python statement `del o[key]`.

<!-- anchor: c.PyObject_DelItemString | type: c function -->
## `int PyObject_DelItemString(PyObject *o, const char *key)`

*Part of the Stable ABI.*

This is the same as `PyObject_DelItem()`, but *key* is specified as a const char* UTF-8 encoded bytes string, rather than a PyObject*.

<!-- anchor: c.PyObject_Dir | type: c function -->
## `PyObject *PyObject_Dir(PyObject *o)`

*Return value: New reference.**Part of the Stable ABI.*

This is equivalent to the Python expression `dir(o)`, returning a (possibly empty) list of strings appropriate for the object argument, or `NULL` if there was an error. If the argument is `NULL`, this is like the Python `dir()`, returning the names of the current locals; in this case, if no execution frame is active then `NULL` is returned but `PyErr_Occurred()` will return false.

<!-- anchor: c.PyObject_GetIter | type: c function -->
## `PyObject *PyObject_GetIter(PyObject *o)`

*Return value: New reference.**Part of the Stable ABI.*

This is equivalent to the Python expression `iter(o)`. It returns a new iterator for the object argument, or the object itself if the object is already an iterator. Raises `TypeError` and returns `NULL` if the object cannot be iterated.

<!-- anchor: c.PyObject_SelfIter | type: c function -->
## `PyObject *PyObject_SelfIter(PyObject *obj)`

*Return value: New reference.**Part of the Stable ABI.*

This is equivalent to the Python `__iter__(self): return self` method. It is intended for iterator types, to be used in the `PyTypeObject.tp_iter` slot.

<!-- anchor: c.PyObject_GetAIter | type: c function -->
## `PyObject *PyObject_GetAIter(PyObject *o)`

*Return value: New reference.**Part of the Stable ABI since version 3.10.*

This is the equivalent to the Python expression `aiter(o)`. Takes an `AsyncIterable` object and returns an `AsyncIterator` for it. This is typically a new iterator but if the argument is an `AsyncIterator`, this returns itself. Raises `TypeError` and returns `NULL` if the object cannot be iterated.

Added in version 3.10.

<!-- anchor: c.PyObject_GetTypeData | type: c function -->
## `void *PyObject_GetTypeData(PyObject *o, PyTypeObject *cls)`

*Part of the Stable ABI since version 3.12.*

Get a pointer to subclass-specific data reserved for *cls*.

The object *o* must be an instance of *cls*, and *cls* must have been created using negative `PyType_Spec.basicsize`. Python does not check this.

On error, set an exception and return `NULL`.

Added in version 3.12.

<!-- anchor: c.PyType_GetTypeDataSize | type: c function -->
## `Py_ssize_t PyType_GetTypeDataSize(PyTypeObject *cls)`

*Part of the Stable ABI since version 3.12.*

Return the size of the instance memory space reserved for *cls*, i.e. the size of the memory `PyObject_GetTypeData()` returns.

This may be larger than requested using `-PyType_Spec.basicsize`; it is safe to use this larger size (e.g. with `memset()`).

The type *cls* **must** have been created using negative `PyType_Spec.basicsize`. Python does not check this.

On error, set an exception and return a negative value.

Added in version 3.12.

<!-- anchor: c.PyObject_GetItemData | type: c function -->
## `void *PyObject_GetItemData(PyObject *o)`

Get a pointer to per-item data for a class with `Py_TPFLAGS_ITEMS_AT_END`.

On error, set an exception and return `NULL`. `TypeError` is raised if *o* does not have `Py_TPFLAGS_ITEMS_AT_END` set.

Added in version 3.12.

<!-- anchor: c.PyObject_VisitManagedDict | type: c function -->
## `int PyObject_VisitManagedDict(PyObject *obj, visitproc visit, void *arg)`

Visit the managed dictionary of *obj*.

This function must only be called in a traverse function of the type which has the `Py_TPFLAGS_MANAGED_DICT` flag set.

Added in version 3.13.

<!-- anchor: c.PyObject_ClearManagedDict | type: c function -->
## `void PyObject_ClearManagedDict(PyObject *obj)`

Clear the managed dictionary of *obj*.

This function must only be called in a clear function of the type which has the `Py_TPFLAGS_MANAGED_DICT` flag set.

Added in version 3.13.

<!-- anchor: c.PyUnstable_Object_EnableDeferredRefcount | type: c function -->
## `int PyUnstable_Object_EnableDeferredRefcount(PyObject *obj)`

*This is Unstable API. It may change without warning in minor releases.*

Enable deferred reference counting on *obj*, if supported by the runtime. In the free-threaded build, this allows the interpreter to avoid reference count adjustments to *obj*, which may improve multi-threaded performance. The tradeoff is that *obj* will only be deallocated by the tracing garbage collector, and not when the interpreter no longer has any references to it.

This function returns `1` if deferred reference counting is enabled on *obj*, and `0` if deferred reference counting is not supported or if the hint was ignored by the interpreter, such as when deferred reference counting is already enabled on *obj*. This function is thread-safe, and cannot fail.

This function does nothing on builds with the GIL enabled, which do not support deferred reference counting. This also does nothing if *obj* is not an object tracked by the garbage collector (see `gc.is_tracked()` and `PyObject_GC_IsTracked()`).

This function is intended to be used soon after *obj* is created, by the code that creates it, such as in the object’s `tp_new` slot.

Added in version 3.14.

<!-- anchor: c.PyUnstable_Object_IsUniqueReferencedTemporary | type: c function -->
## `int PyUnstable_Object_IsUniqueReferencedTemporary(PyObject *obj)`

*This is Unstable API. It may change without warning in minor releases.*

Check if *obj* is a unique temporary object. Returns `1` if *obj* is known to be a unique temporary object, and `0` otherwise. This function cannot fail, but the check is conservative, and may return `0` in some cases even if *obj* is a unique temporary object.

If an object is a unique temporary, it is guaranteed that the current code has the only reference to the object. For arguments to C functions, this should be used instead of checking if the reference count is `1`. Starting with Python 3.14, the interpreter internally avoids some reference count modifications when loading objects onto the operands stack by borrowing references when possible, which means that a reference count of `1` by itself does not guarantee that a function argument uniquely referenced.

In the example below, `my_func` is called with a unique temporary object as its argument:

```c
my_func([1, 2, 3])
```

In the example below, `my_func` is **not** called with a unique temporary object as its argument, even if its refcount is `1`:

```c
my_list = [1, 2, 3]
my_func(my_list)
```

See also the function `Py_REFCNT()`.

Added in version 3.14.

<!-- anchor: c.PyUnstable_IsImmortal | type: c function -->
## `int PyUnstable_IsImmortal(PyObject *obj)`

*This is Unstable API. It may change without warning in minor releases.*

This function returns non-zero if *obj* is immortal, and zero otherwise. This function cannot fail.

**Note:**

Objects that are immortal in one CPython version are not guaranteed to be immortal in another.

Added in version 3.14.

<!-- anchor: c.PyUnstable_TryIncRef | type: c function -->
## `int PyUnstable_TryIncRef(PyObject *obj)`

*This is Unstable API. It may change without warning in minor releases.*

Increments the reference count of *obj* if it is not zero. Returns `1` if the object’s reference count was successfully incremented. Otherwise, this function returns `0`.

`PyUnstable_EnableTryIncRef()` must have been called earlier on *obj* or this function may spuriously return `0` in the free-threaded build.

This function is logically equivalent to the following C code, except that it behaves atomically in the free-threaded build:

```c
if (Py_REFCNT(op) > 0) {
   Py_INCREF(op);
   return 1;
}
return 0;
```

This is intended as a building block for managing weak references without the overhead of a Python weak reference object.

Typically, correct use of this function requires support from *obj*’s deallocator (`tp_dealloc`). For example, the following sketch could be adapted to implement a “weakmap” that works like a `WeakValueDictionary` for a specific type:

```c
PyMutex mutex;

PyObject *
add_entry(weakmap_key_type *key, PyObject *value)
{
    PyUnstable_EnableTryIncRef(value);
    weakmap_type weakmap = ...;
    PyMutex_Lock(&mutex);
    weakmap_add_entry(weakmap, key, value);
    PyMutex_Unlock(&mutex);
    Py_RETURN_NONE;
}

PyObject *
get_value(weakmap_key_type *key)
{
    weakmap_type weakmap = ...;
    PyMutex_Lock(&mutex);
    PyObject *result = weakmap_find(weakmap, key);
    if (PyUnstable_TryIncRef(result)) {
        // `result` is safe to use
        PyMutex_Unlock(&mutex);
        return result;
    }
    // if we get here, `result` is starting to be garbage-collected,
    // but has not been removed from the weakmap yet
    PyMutex_Unlock(&mutex);
    return NULL;
}

// tp_dealloc function for weakmap values
void
value_dealloc(PyObject *value)
{
    weakmap_type weakmap = ...;
    PyMutex_Lock(&mutex);
    weakmap_remove_value(weakmap, value);

    ...
    PyMutex_Unlock(&mutex);
}
```

Added in version 3.14.

<!-- anchor: c.PyUnstable_EnableTryIncRef | type: c function -->
## `void PyUnstable_EnableTryIncRef(PyObject *obj)`

*This is Unstable API. It may change without warning in minor releases.*

Enables subsequent uses of `PyUnstable_TryIncRef()` on *obj*. The caller must hold a strong reference to *obj* when calling this.

Added in version 3.14.

<!-- anchor: c.PyUnstable_Object_IsUniquelyReferenced | type: c function -->
## `int PyUnstable_Object_IsUniquelyReferenced(PyObject *op)`

*This is Unstable API. It may change without warning in minor releases.*

Determine if *op* only has one reference.

On GIL-enabled builds, this function is equivalent to Py_REFCNT(op) == 1.

On a free-threaded build, this checks if *op*’s reference count is equal to one and additionally checks if *op* is only used by this thread. Py_REFCNT(op) == 1 is **not** thread-safe on free-threaded builds; prefer this function.

The caller must hold an attached thread state, despite the fact that this function doesn’t call into the Python interpreter. This function cannot fail.

Added in version 3.14.

<!-- anchor: c.PyUnstable_SetImmortal | type: c function -->
## `int PyUnstable_SetImmortal(PyObject *op)`

*This is Unstable API. It may change without warning in minor releases.*

Marks the object *op* immortal. The argument should be uniquely referenced by the calling thread. This is intended to be used for reducing reference counting contention in the free-threaded build for objects which are shared across threads.

This is a one-way process: objects can only be made immortal; they cannot be made mortal once again. Immortal objects do not participate in reference counting and will never be garbage collected. If the object is GC-tracked, it is untracked.

This function is intended to be used soon after *op* is created, by the code that creates it, such as in the object’s `tp_new` slot. Returns 1 if the object was made immortal and returns 0 if it was not. This function cannot fail.

Added in version 3.15.
