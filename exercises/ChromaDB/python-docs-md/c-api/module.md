---
page: c-api/module.html
title: Module Objects
area: c-api
kind: guide
module: objects
---

<!-- anchor: module-objects | type: section -->
# Module Objects

<!-- anchor: c.PyModule_Type | type: c var -->
## `PyTypeObject PyModule_Type`

*Part of the Stable ABI.*

This instance of `PyTypeObject` represents the Python module type. This is exposed to Python programs as `types.ModuleType`.

<!-- anchor: c.PyModule_Check | type: c function -->
## `int PyModule_Check(PyObject *p)`

Return true if *p* is a module object, or a subtype of a module object. This function always succeeds.

<!-- anchor: c.PyModule_CheckExact | type: c function -->
## `int PyModule_CheckExact(PyObject *p)`

Return true if *p* is a module object, but not a subtype of `PyModule_Type`. This function always succeeds.

<!-- anchor: c.PyModule_NewObject | type: c function -->
## `PyObject *PyModule_NewObject(PyObject *name)`

*Return value: New reference.**Part of the Stable ABI since version 3.7.*

Return a new module object with `module.__name__` set to *name*. The module’s `__name__`, `__doc__`, `__package__` and `__loader__` attributes are filled in (all but `__name__` are set to `None`). The caller is responsible for setting a `__file__` attribute.

Return `NULL` with an exception set on error.

Added in version 3.3.

Changed in version 3.4: `__package__` and `__loader__` are now set to `None`.

<!-- anchor: c.PyModule_New | type: c function -->
## `PyObject *PyModule_New(const char *name)`

*Return value: New reference.**Part of the Stable ABI.*

Similar to `PyModule_NewObject()`, but the name is a UTF-8 encoded string instead of a Unicode object.

<!-- anchor: c.PyModule_GetDict | type: c function -->
## `PyObject *PyModule_GetDict(PyObject *module)`

*Return value: Borrowed reference.**Part of the Stable ABI.*

Return the dictionary object that implements *module*’s namespace; this object is the same as the `__dict__` attribute of the module object. If *module* is not a module object (or a subtype of a module object), `SystemError` is raised and `NULL` is returned.

It is recommended extensions use other `PyModule_*` and `PyObject_*` functions rather than directly manipulate a module’s `__dict__`.

The returned reference is borrowed from the module; it is valid until the module is destroyed.

<!-- anchor: c.PyModule_GetNameObject | type: c function -->
## `PyObject *PyModule_GetNameObject(PyObject *module)`

*Return value: New reference.**Part of the Stable ABI since version 3.7.*

Return *module*’s `__name__` value. If the module does not provide one, or if it is not a string, `SystemError` is raised and `NULL` is returned.

Added in version 3.3.

<!-- anchor: c.PyModule_GetName | type: c function -->
## `const char *PyModule_GetName(PyObject *module)`

*Part of the Stable ABI.*

Similar to `PyModule_GetNameObject()` but return the name encoded to `'utf-8'`.

The returned buffer is only valid until the module is renamed or destroyed. Note that Python code may rename a module by setting its `__name__` attribute.

<!-- anchor: c.PyModule_GetDef | type: c function -->
## `PyModuleDef *PyModule_GetDef(PyObject *module)`

*Part of the Stable ABI.*

Return a pointer to the `PyModuleDef` struct from which the module was created, or `NULL` if the module wasn’t created from a definition.

On error, return `NULL` with an exception set. Use `PyErr_Occurred()` to tell this case apart from a missing `PyModuleDef`.

<!-- anchor: c.PyModule_GetFilenameObject | type: c function -->
## `PyObject *PyModule_GetFilenameObject(PyObject *module)`

*Return value: New reference.**Part of the Stable ABI.*

Return the name of the file from which *module* was loaded using *module*’s `__file__` attribute. If this is not defined, or if it is not a string, raise `SystemError` and return `NULL`; otherwise return a reference to a Unicode object.

Added in version 3.2.

<!-- anchor: c.PyModule_GetFilename | type: c function -->
## `const char *PyModule_GetFilename(PyObject *module)`

*Part of the Stable ABI.*

Similar to `PyModule_GetFilenameObject()` but return the filename encoded to ‘utf-8’.

The returned buffer is only valid until the module’s `__file__` attribute is reassigned or the module is destroyed.

Deprecated since version 3.2: `PyModule_GetFilename()` raises `UnicodeEncodeError` on unencodable filenames, use `PyModule_GetFilenameObject()` instead.

<!-- anchor: module-definition | type: section -->
## Module definition

Modules created using the C API are typically defined using an array of `PySlot` structs, which provides a “description” of how a module should be created. See Definition slots for more information on slots in general.

Changed in version 3.15: Previously, a `PyModuleDef` struct was necessary to define modules. The older way of defining modules is still available: consult either the Module definition struct section or earlier versions of this documentation if you plan to support earlier Python versions.

The slots array is usually used to define an extension module’s “main” module object (see Defining extension modules for details). It can also be used to create extension modules dynamically.

Unless specified otherwise, the same slot ID may not be repeated in an array of slots.

<!-- anchor: metadata-slots | type: section -->
### Metadata slots

<!-- anchor: c.Py_mod_name | type: c macro -->
#### `Py_mod_name`

*Part of the Stable ABI since version 3.15.*

`Slot ID` for the name of the new module, as a NUL-terminated UTF8-encoded `const char *`.

Note that modules are typically created using a `ModuleSpec`, and when they are, the name from the spec will be used instead of `Py_mod_name`. However, it is still recommended to include this slot for introspection and debugging purposes.

Added in version 3.15: Use `PyModuleDef.m_name` instead to support previous versions.

<!-- anchor: c.Py_mod_doc | type: c macro -->
#### `Py_mod_doc`

*Part of the Stable ABI since version 3.15.*

`Slot ID` for the docstring of the new module, as a NUL-terminated UTF8-encoded `const char *`.

Usually it is set to a variable created with `PyDoc_STRVAR`.

Added in version 3.15: Use `PyModuleDef.m_doc` instead to support previous versions.

<!-- anchor: feature-slots | type: section -->
### Feature slots

<!-- anchor: c.Py_mod_abi | type: c macro -->
#### `Py_mod_abi`

*Part of the Stable ABI since version 3.15.*

`Slot ID` whose value points to a `PyABIInfo` structure describing the ABI that the extension is using.

A suitable `PyABIInfo` variable can be defined using the `PyABIInfo_VAR` macro, as in:

```c
PyABIInfo_VAR(abi_info);

static PySlot mymodule_slots[] = {
   PySlot_DATA(Py_mod_abi, &abi_info),
   ...
};
```

When creating a module, Python checks the value of this slot using `PyABIInfo_Check()`.

This slot is required, except for modules created from `PyModuleDef`.

Added in version 3.15.

<!-- anchor: c.Py_mod_multiple_interpreters | type: c macro -->
#### `Py_mod_multiple_interpreters`

*Part of the Stable ABI since version 3.12.*

`Slot ID` whose value is one of:

<!-- anchor: c.Py_MOD_MULTIPLE_INTERPRETERS_NOT_SUPPORTED | type: c macro -->
##### `Py_MOD_MULTIPLE_INTERPRETERS_NOT_SUPPORTED`

The module does not support being imported in subinterpreters.

<!-- anchor: c.Py_MOD_MULTIPLE_INTERPRETERS_SUPPORTED | type: c macro -->
##### `Py_MOD_MULTIPLE_INTERPRETERS_SUPPORTED`

The module supports being imported in subinterpreters, but only when they share the main interpreter’s GIL. (See Isolating Extension Modules.)

<!-- anchor: c.Py_MOD_PER_INTERPRETER_GIL_SUPPORTED | type: c macro -->
##### `Py_MOD_PER_INTERPRETER_GIL_SUPPORTED`

The module supports being imported in subinterpreters, even when they have their own GIL. (See Isolating Extension Modules.)

This slot determines whether or not importing this module in a subinterpreter will fail.

If `Py_mod_multiple_interpreters` is not specified, the import machinery defaults to `Py_MOD_MULTIPLE_INTERPRETERS_SUPPORTED`.

For historical reasons, the values are declared as pointers (`void *`). When using `PySlot` arrays, use `PySlot_DATA` for `Py_mod_multiple_interpreters`:

```c
PySlot_DATA(Py_mod_multiple_interpreters,
            Py_MOD_PER_INTERPRETER_GIL_SUPPORTED)
```

Added in version 3.12.

<!-- anchor: c.Py_mod_gil | type: c macro -->
#### `Py_mod_gil`

*Part of the Stable ABI since version 3.13.*

`Slot ID` whose value is one of:

<!-- anchor: c.Py_MOD_GIL_USED | type: c macro -->
##### `Py_MOD_GIL_USED`

The module depends on the presence of the global interpreter lock (GIL), and may access global state without synchronization.

<!-- anchor: c.Py_MOD_GIL_NOT_USED | type: c macro -->
##### `Py_MOD_GIL_NOT_USED`

The module is safe to run without an active GIL.

This slot is ignored by Python builds not configured with `--disable-gil`. Otherwise, it determines whether or not importing this module will cause the GIL to be automatically enabled. See Free-threaded CPython for more detail.

If `Py_mod_gil` is not specified, the import machinery defaults to `Py_MOD_GIL_USED`.

For historical reasons, the values are declared as pointers (`void *`). When using `PySlot` arrays, use `PySlot_DATA` for `Py_mod_gil`:

```c
PySlot_DATA(Py_mod_gil, Py_MOD_GIL_NOT_USED)
```

Added in version 3.13.

<!-- anchor: creation-and-initialization-slots | type: section -->
### Creation and initialization slots

<!-- anchor: c.Py_mod_create | type: c macro -->
#### `Py_mod_create`

*Part of the Stable ABI since version 3.5.*

`Slot ID` for a function that creates the module object itself. The function must have the signature:

<!-- anchor: c.Py_mod_create.create_module | type: c function -->
##### `PyObject *create_module(PyObject *spec, PyModuleDef *def)`

The function will be called with:

- *spec*: a `ModuleSpec`-like object, meaning that any attributes defined for `importlib.machinery.ModuleSpec` have matching semantics. However, any of the attributes may be missing.

- *def*: `NULL`, or the module definition if the module is created from one.

The function should return a new module object, or set an error and return `NULL`.

This function should be kept minimal. In particular, it should not call arbitrary Python code, as trying to import the same module again may result in an infinite loop.

If `Py_mod_create` is not specified, the import machinery will create a normal module object using `PyModule_New()`. The name is taken from *spec*, not the definition, to allow extension modules to dynamically adjust to their place in the module hierarchy and be imported under different names through symlinks, all while sharing a single module definition.

There is no requirement for the returned object to be an instance of `PyModule_Type`. However, some slots may only be used with `PyModule_Type` instances; in particular:

- `Py_mod_exec`,

- module state slots (`Py_mod_state_*`),

- `Py_mod_token`.

Added in version 3.5.

Changed in version 3.15: The *slots* argument may be a `ModuleSpec`-like object, rather than a true `ModuleSpec` instance. Note that previous versions of CPython did not enforce this.

The *def* argument may now be `NULL`, since modules are not necessarily made from definitions.

<!-- anchor: c.Py_mod_exec | type: c macro -->
#### `Py_mod_exec`

*Part of the Stable ABI since version 3.5.*

`Slot ID` for a function that will *execute*, or initialize, the module. This function does the equivalent to executing the code of a Python module: typically, it adds classes and constants to the module. The signature of the function is:

<!-- anchor: c.Py_mod_exec.exec_module | type: c function -->
##### `int exec_module(PyObject *module)`

See the Support functions section for some useful functions to call.

For backwards compatibility, the `PyModuleDef.m_slots` array may contain multiple `Py_mod_exec` slots; these are processed in the order they appear in the array. Elsewhere (that is, in arguments to `PyModule_FromSlotsAndSpec()` and in return values of `PyModExport_<name>`), repeating the slot is not allowed.

Added in version 3.5.

Changed in version 3.15: Repeated `Py_mod_exec` slots are disallowed, except in `PyModuleDef.m_slots`.

<!-- anchor: c.Py_mod_methods | type: c macro -->
#### `Py_mod_methods`

*Part of the Stable ABI since version 3.15.*

`Slot ID` for a table of module-level functions, as an array of `PyMethodDef` values suitable as the *functions* argument to `PyModule_AddFunctions()`.

Like other slot IDs, a slots array may only contain one `Py_mod_methods` entry. To add functions from multiple `PyMethodDef` arrays, call `PyModule_AddFunctions()` in the `Py_mod_exec` function.

The table must be statically allocated (or otherwise guaranteed to outlive the module object).

Added in version 3.15: Use `PyModuleDef.m_methods` instead to support previous versions.

<!-- anchor: module-state | type: section -->
## Module state

Extension modules can have *module state* – a piece of memory that is allocated on module creation, and freed when the module object is deallocated. The module state is specified using dedicated slots.

A typical use of module state is storing an exception type – or indeed *any* type object defined by the module –

Unlike the module’s Python attributes, Python code cannot replace or delete data stored in module state.

Keeping per-module information in attributes and module state, rather than in static globals, makes module objects *isolated* and safer for use in multiple sub-interpreters. It also helps Python do an orderly clean-up when it shuts down.

Extensions that keep references to Python objects as part of module state must implement `Py_mod_state_traverse` and `Py_mod_state_clear` functions to avoid reference leaks.

To retrieve the state from a given module, use the following functions:

<!-- anchor: c.PyModule_GetState | type: c function -->
### `void *PyModule_GetState(PyObject *module)`

*Part of the Stable ABI.*

Return the “state” of the module, that is, a pointer to the block of memory allocated at module creation time, or `NULL`. See `Py_mod_state_size`.

On error, return `NULL` with an exception set. Use `PyErr_Occurred()` to tell this case apart from missing module state.

<!-- anchor: c.PyModule_GetStateSize | type: c function -->
### `int PyModule_GetStateSize(PyObject *module, Py_ssize_t *result)`

*Part of the Stable ABI since version 3.15.*

Set **result* to the size of *module*’s state, as specified using `Py_mod_state_size` (or `PyModuleDef.m_size`), and return 0.

On error, set **result* to -1, and return -1 with an exception set.

Added in version 3.15.

<!-- anchor: slots-for-defining-module-state | type: section -->
### Slots for defining module state

The following `slot IDs` are available for defining the module state.

<!-- anchor: c.Py_mod_state_size | type: c macro -->
#### `Py_mod_state_size`

*Part of the Stable ABI since version 3.15.*

`Slot ID` for the size of the module state, in bytes.

Setting the value to a non-negative value means that the module can be re-initialized and specifies the additional amount of memory it requires for its state.

See **PEP 3121** for more details.

Use `PyModule_GetStateSize()` to retrieve the size of a given module.

Added in version 3.15: Use `PyModuleDef.m_size` instead to support previous versions.

<!-- anchor: c.Py_mod_state_traverse | type: c macro -->
#### `Py_mod_state_traverse`

*Part of the Stable ABI since version 3.15.*

`Slot ID` for a traversal function to call during GC traversal of the module object.

The signature of the function, and meanings of the arguments, is similar as for `PyTypeObject.tp_traverse`:

<!-- anchor: c.Py_mod_state_traverse.traverse_module_state | type: c function -->
##### `int traverse_module_state(PyObject *module, visitproc visit, void *arg)`

This function is not called if the module state was requested but is not allocated yet. This is the case immediately after the module is created and before the module is executed (`Py_mod_exec` function). More precisely, this function is not called if the state size (`Py_mod_state_size`) is greater than 0 and the module state (as returned by `PyModule_GetState()`) is `NULL`.

Added in version 3.15: Use `PyModuleDef.m_traverse` instead to support previous versions.

<!-- anchor: c.Py_mod_state_clear | type: c macro -->
#### `Py_mod_state_clear`

*Part of the Stable ABI since version 3.15.*

`Slot ID` for a clear function to call during GC clearing of the module object.

The signature of the function is:

<!-- anchor: c.Py_mod_state_clear.clear_module_state | type: c function -->
##### `int clear_module_state(PyObject *module)`

This function is not called if the module state was requested but is not allocated yet. This is the case immediately after the module is created and before the module is executed (`Py_mod_exec` function). More precisely, this function is not called if the state size (`Py_mod_state_size`) is greater than 0 and the module state (as returned by `PyModule_GetState()`) is `NULL`.

Like `PyTypeObject.tp_clear`, this function is not *always* called before a module is deallocated. For example, when reference counting is enough to determine that an object is no longer used, the cyclic garbage collector is not involved and the `Py_mod_state_free` function is called directly.

Added in version 3.15: Use `PyModuleDef.m_clear` instead to support previous versions.

<!-- anchor: c.Py_mod_state_free | type: c macro -->
#### `Py_mod_state_free`

*Part of the Stable ABI since version 3.15.*

`Slot ID` for a function to call during deallocation of the module object.

The signature of the function is:

<!-- anchor: c.Py_mod_state_free.free_module_state | type: c function -->
##### `int free_module_state(PyObject *module)`

This function is not called if the module state was requested but is not allocated yet. This is the case immediately after the module is created and before the module is executed (`Py_mod_exec` function). More precisely, this function is not called if the state size (`Py_mod_state_size`) is greater than 0 and the module state (as returned by `PyModule_GetState()`) is `NULL`.

Added in version 3.15: Use `PyModuleDef.m_free` instead to support previous versions.

<!-- anchor: module-token | type: section -->
### Module token

Each module may have an associated *token*: a pointer-sized value intended to identify of the module state’s memory layout. This means that if you have a module object, but you are not sure if it “belongs” to your extension, you can check using code like this:

```c
PyObject *module = <the module in question>

void *module_token;
if (PyModule_GetToken(module, &module_token) < 0) {
    return NULL;
}
if (module_token != your_token) {
    PyErr_SetString(PyExc_ValueError, "unexpected module")
    return NULL;
}

// This module's state has the expected memory layout; it's safe to cast
struct my_state state = (struct my_state*)PyModule_GetState(module)
```

A module’s token – and the *your_token* value to use in the above code – is:

- For modules created with `PyModuleDef`: the address of that `PyModuleDef`;

- For modules defined with the `Py_mod_token` slot: the value of that slot;

- For modules created from an `PyModExport_*` export hook: the slots array that the export hook returned (unless overridden with `Py_mod_token`).

<!-- anchor: c.Py_mod_token | type: c macro -->
#### `Py_mod_token`

*Part of the Stable ABI since version 3.15.*

`Slot ID` for the module token.

If you use this slot to set the module token (rather than rely on the default), you must ensure that:

- The pointer outlives the class, so it’s not reused for something else while the class exists.

- It “belongs” to the extension module where the class lives, so it will not clash with other extensions.

- If the token points to a `PyModuleDef` struct, the module should behave as if it was created from that `PyModuleDef`. In particular, the module state must have matching layout and semantics.

Modules created from `PyModuleDef` always use the address of the `PyModuleDef` as the token. This means that `Py_mod_token` cannot be used in `PyModuleDef.m_slots`.

Added in version 3.15.

<!-- anchor: c.PyModule_GetToken | type: c function -->
#### `int PyModule_GetToken(PyObject *module, void **result)`

*Part of the Stable ABI since version 3.15.*

Set **result* to the module token for *module* and return 0.

On error, set **result* to NULL, and return -1 with an exception set.

Added in version 3.15.

See also `PyType_GetModuleByToken()`.

<!-- anchor: creating-extension-modules-dynamically | type: section -->
## Creating extension modules dynamically

The following functions may be used to create an extension module dynamically, rather than from an extension’s export hook.

<!-- anchor: c.PyModule_FromSlotsAndSpec | type: c function -->
### `PyObject *PyModule_FromSlotsAndSpec(const PySlot *slots, PyObject *spec)`

*Return value: New reference.**Part of the Stable ABI since version 3.15.*

Create a new module object, given an array of slots and the `ModuleSpec` *spec*.

The *slots* argument must point to an array of `PySlot` structures, terminated by an entry with slot ID of 0 (typically written as `PySlot_END`). The array must include a `Py_mod_abi` entry.

The *spec* argument may be any `ModuleSpec`-like object, as described in `Py_mod_create` documentation. Currently, the *spec* must have a `name` attribute.

On success, return the new module. On error, return `NULL` with an exception set.

Note that this does not process the module’s execution slot (`Py_mod_exec`). Both `PyModule_FromSlotsAndSpec()` and `PyModule_Exec()` must be called to fully initialize a module. (See also Multi-phase initialization.)

Added in version 3.15.

<!-- anchor: c.PyModule_Exec | type: c function -->
### `int PyModule_Exec(PyObject *module)`

*Part of the Stable ABI since version 3.15.*

Execute the `Py_mod_exec` slot(s) of *module*.

On success, return 0. On error, return -1 with an exception set.

For clarity: If *module* has no slots, for example if it uses legacy single-phase initialization, this function does nothing and returns 0.

Added in version 3.15.

<!-- anchor: module-definition-struct | type: section -->
## Module definition struct

Traditionally, extension modules were defined using a *module definition* as the “description” of how a module should be created. Rather than using an array of slots directly, the definition has dedicated members for most common functionality, and allows additional slots as an extension mechanism.

This way of defining modules is still available and there are no plans to remove it.

<!-- anchor: c.PyModuleDef | type: c type -->
### `type PyModuleDef`

*Part of the Stable ABI (see below).*

The module definition struct, which holds information needed to create a module object.

This structure must be statically allocated (or be otherwise guaranteed to be valid while any modules created from it exist). Usually, there is only one variable of this type for each extension module defined this way.

The struct, including all members, is part of the Stable ABI for non-free-threaded builds (`abi3`). In the Stable ABI for free-threaded builds (`abi3t`), this struct is opaque, and unusable in practice; see Module definition for a replacement.

<!-- anchor: c.PyModuleDef.m_base | type: c member -->
#### `PyModuleDef_Base m_base`

Always initialize this member to `PyModuleDef_HEAD_INIT`:

<!-- anchor: c.PyModuleDef_Base | type: c type -->
##### `type PyModuleDef_Base`

*Part of the Stable ABI (see below).*

The type of `PyModuleDef.m_base`.

The struct is part of the Stable ABI for non-free-threaded builds (`abi3`). In the Stable ABI for Free-Threaded Builds (`abi3t`), this struct is opaque, and unusable in practice.

<!-- anchor: c.PyModuleDef_HEAD_INIT | type: c macro -->
##### `PyModuleDef_HEAD_INIT`

The required initial value for `PyModuleDef.m_base`.

<!-- anchor: c.PyModuleDef.m_name | type: c member -->
#### `const char *m_name`

Corresponds to the `Py_mod_name` slot.

<!-- anchor: c.PyModuleDef.m_doc | type: c member -->
#### `const char *m_doc`

These members correspond to the `Py_mod_doc` slot. Setting this to NULL is equivalent to omitting the slot.

<!-- anchor: c.PyModuleDef.m_size | type: c member -->
#### `Py_ssize_t m_size`

Corresponds to the `Py_mod_state_size` slot. Setting this to zero is equivalent to omitting the slot.

When using legacy single-phase initialization or when creating modules dynamically using `PyModule_Create()` or `PyModule_Create2()`, `m_size` may be set to -1. This indicates that the module does not support sub-interpreters, because it has global state.

<!-- anchor: c.PyModuleDef.m_methods | type: c member -->
#### `PyMethodDef *m_methods`

Corresponds to the `Py_mod_methods` slot. Setting this to NULL is equivalent to omitting the slot.

<!-- anchor: c.PyModuleDef.m_slots | type: c member -->
#### `PyModuleDef_Slot *m_slots`

An array of additional slots, terminated by a `{0, NULL}` entry. Note that the entries use the older `PyModuleDef_Slot` structure, rather than `PySlot`.

If the array contains slots corresponding to `PyModuleDef` members, the values must match. For example, if you use `Py_mod_name` in `m_slots`, `PyModuleDef.m_name` must be set to the same pointer (not just an equal string).

Changed in version 3.5: Prior to version 3.5, this member was always set to `NULL`, and was defined as:

<!-- anchor: c.PyModuleDef.m_slots.m_reload | type: c member -->
##### `inquiry m_reload`

<!-- anchor: c.PyModuleDef_Slot | type: c type -->
##### `type PyModuleDef_Slot`

*Part of the Stable ABI (including all members) since version 3.5.*

Older structure defining additional slots of a module.

Note that a `PyModuleDef_Slot` array may be included in a `PySlot` array using `Py_mod_slots`, and vice versa using `Py_slot_subslots`.

Each `PyModuleDef_Slot` structure `modslot` is interpreted as the following `PySlot` structure:

```c
(PySlot){
   .sl_id=modslot.slot,
   .sl_flags=PySlot_INTPTR | sub_static,
   .sl_ptr=modslot.value
}
```

where `sub_static` is `PySlot_STATIC` if the slot requires the flag (such as for `Py_mod_methods`), or if this flag is present on the “parent” `Py_mod_slots` slot (if any).

<!-- anchor: c.PyModuleDef_Slot.slot | type: c member -->
###### `int slot`

Corresponds to `PySlot.sl_id`.

<!-- anchor: c.PyModuleDef_Slot.value | type: c member -->
###### `void *value`

Corresponds to `PySlot.sl_ptr`.

Added in version 3.5.

<!-- anchor: c.PyModuleDef.m_traverse | type: c member -->
#### `traverseproc m_traverse`

`inquiry m_clear`

`freefunc m_free`

These members correspond to the `Py_mod_state_traverse`, `Py_mod_state_clear`, and `Py_mod_state_free` slots, respectively.

Setting these members to NULL is equivalent to omitting the corresponding slots.

Changed in version 3.9: `m_traverse`, `m_clear` and `m_free` functions are no longer called before the module state is allocated.

<!-- anchor: c.PyModuleDef_Type | type: c var -->
### `PyTypeObject PyModuleDef_Type`

*Part of the Stable ABI since version 3.5.*

The type of `PyModuleDef` objects.

<!-- anchor: c.Py_mod_slots | type: c macro -->
### `Py_mod_slots`

*Part of the Stable ABI since version 3.15.*

`Slot ID` that works like `Py_slot_subslots`, except it specifies an array of `PyModuleDef_Slot` structures.

Added in version 3.15.

The following API can be used to create modules from a `PyModuleDef` struct:

<!-- anchor: c.PyModule_Create | type: c function -->
### `PyObject *PyModule_Create(PyModuleDef *def)`

*Return value: New reference.*

Create a new module object, given the definition in *def*. This is a macro that calls `PyModule_Create2()` with *module_api_version* set to `PYTHON_API_VERSION`, or to `PYTHON_ABI_VERSION` if using the limited API.

<!-- anchor: c.PyModule_Create2 | type: c function -->
### `PyObject *PyModule_Create2(PyModuleDef *def, int module_api_version)`

*Return value: New reference.**Part of the Stable ABI.*

Create a new module object, given the definition in *def*, assuming the API version *module_api_version*. If that version does not match the version of the running interpreter, a `RuntimeWarning` is emitted.

Return `NULL` with an exception set on error.

This function does not support slots. The `m_slots` member of *def* must be `NULL`.

**Note:**

Most uses of this function should be using `PyModule_Create()` instead; only use this if you are sure you need it.

<!-- anchor: c.PyModule_FromDefAndSpec | type: c function -->
### `PyObject *PyModule_FromDefAndSpec(PyModuleDef *def, PyObject *spec)`

*Return value: New reference.*

This macro calls `PyModule_FromDefAndSpec2()` with *module_api_version* set to `PYTHON_API_VERSION`, or to `PYTHON_ABI_VERSION` if using the limited API.

Added in version 3.5.

Soft deprecated since version 3.15: Prefer `PyModule_FromSlotsAndSpec()` in new code.

<!-- anchor: c.PyModule_FromDefAndSpec2 | type: c function -->
### `PyObject *PyModule_FromDefAndSpec2(PyModuleDef *def, PyObject *spec, int module_api_version)`

*Return value: New reference.**Part of the Stable ABI since version 3.7.*

Create a new module object, given the definition in *def* and the ModuleSpec *spec*, assuming the API version *module_api_version*. If that version does not match the version of the running interpreter, a `RuntimeWarning` is emitted.

Return `NULL` with an exception set on error.

Note that this does not process execution slots (`Py_mod_exec`). Both `PyModule_FromDefAndSpec` and `PyModule_ExecDef` must be called to fully initialize a module.

**Note:**

Most uses of this function should be using `PyModule_FromDefAndSpec()` instead; only use this if you are sure you need it.

Added in version 3.5.

Soft deprecated since version 3.15: Prefer `PyModule_FromSlotsAndSpec()` in new code.

<!-- anchor: c.PyModule_ExecDef | type: c function -->
### `int PyModule_ExecDef(PyObject *module, PyModuleDef *def)`

*Part of the Stable ABI since version 3.7.*

Process any execution slots (`Py_mod_exec`) given in *def*.

Added in version 3.5.

Soft deprecated since version 3.15: To run a module’s own execution slots, prefer `PyModule_Exec()`, which works on modules that were not created from a `PyModuleDef` structure.

<!-- anchor: c.PYTHON_API_VERSION | type: c macro -->
### `PYTHON_API_VERSION`

`PYTHON_API_STRING`

The C API version, as an integer (`1013`) and string (`"1013"`), respectively. Defined for backwards compatibility.

Currently, this constant is not updated in new Python versions, and is not useful for versioning. This may change in the future.

<!-- anchor: c.PYTHON_ABI_VERSION | type: c macro -->
### `PYTHON_ABI_VERSION`

`PYTHON_ABI_STRING`

Defined as `3` and `"3"`, respectively, for backwards compatibility.

Currently, this constant is not updated in new Python versions, and is not useful for versioning. This may change in the future.

<!-- anchor: support-functions | type: section -->
## Support functions

The following functions are provided to help initialize a module object. They are intended for a module’s execution slot (`Py_mod_exec`), the initialization function for legacy single-phase initialization, or code that creates modules dynamically.

<!-- anchor: c.PyModule_AddObjectRef | type: c function -->
### `int PyModule_AddObjectRef(PyObject *module, const char *name, PyObject *value)`

*Part of the Stable ABI since version 3.10.*

Add an object to *module* as *name*. This is a convenience function which can be used from the module’s initialization function.

On success, return `0`. On error, raise an exception and return `-1`.

Example usage:

```c
static int
add_spam(PyObject *module, int value)
{
    PyObject *obj = PyLong_FromLong(value);
    if (obj == NULL) {
        return -1;
    }
    int res = PyModule_AddObjectRef(module, "spam", obj);
    Py_DECREF(obj);
    return res;
 }
```

To be convenient, the function accepts `NULL` *value* with an exception set. In this case, return `-1` and just leave the raised exception unchanged.

The example can also be written without checking explicitly if *obj* is `NULL`:

```c
static int
add_spam(PyObject *module, int value)
{
    PyObject *obj = PyLong_FromLong(value);
    int res = PyModule_AddObjectRef(module, "spam", obj);
    Py_XDECREF(obj);
    return res;
 }
```

Note that `Py_XDECREF()` should be used instead of `Py_DECREF()` in this case, since *obj* can be `NULL`.

The number of different *name* strings passed to this function should be kept small, usually by only using statically allocated strings as *name*. For names that aren’t known at compile time, prefer calling `PyUnicode_FromString()` and `PyObject_SetAttr()` directly. For more details, see `PyUnicode_InternFromString()`, which may be used internally to create a key object.

Added in version 3.10.

<!-- anchor: c.PyModule_Add | type: c function -->
### `int PyModule_Add(PyObject *module, const char *name, PyObject *value)`

*Part of the Stable ABI since version 3.13.*

Similar to `PyModule_AddObjectRef()`, but “steals” a reference to *value* (even on error). It can be called with a result of function that returns a new reference without bothering to check its result or even saving it to a variable.

Example usage:

```c
if (PyModule_Add(module, "spam", PyBytes_FromString(value)) < 0) {
    goto error;
}
```

Added in version 3.13.

<!-- anchor: c.PyModule_AddObject | type: c function -->
### `int PyModule_AddObject(PyObject *module, const char *name, PyObject *value)`

*Part of the Stable ABI.*

Similar to `PyModule_AddObjectRef()`, but steals a reference to *value* on success (if it returns `0`).

The new `PyModule_Add()` or `PyModule_AddObjectRef()` functions are recommended, since it is easy to introduce reference leaks by misusing the `PyModule_AddObject()` function.

**Note:**

Unlike other functions that steal references, `PyModule_AddObject()` only releases the reference to *value* **on success**.

This means that its return value must be checked, and calling code must `Py_XDECREF()` *value* manually on error.

Example usage:

```c
PyObject *obj = PyBytes_FromString(value);
if (PyModule_AddObject(module, "spam", obj) < 0) {
    // If 'obj' is not NULL and PyModule_AddObject() failed,
    // 'obj' strong reference must be deleted with Py_XDECREF().
    // If 'obj' is NULL, Py_XDECREF() does nothing.
    Py_XDECREF(obj);
    goto error;
}
// PyModule_AddObject() stole a reference to obj:
// Py_XDECREF(obj) is not needed here.
```

Soft deprecated since version 3.13.

<!-- anchor: c.PyModule_AddIntConstant | type: c function -->
### `int PyModule_AddIntConstant(PyObject *module, const char *name, long value)`

*Part of the Stable ABI.*

Add an integer constant to *module* as *name*. This convenience function can be used from the module’s initialization function. Return `-1` with an exception set on error, `0` on success.

This is a convenience function that calls `PyLong_FromLong()` and `PyModule_AddObjectRef()`; see their documentation for details.

<!-- anchor: c.PyModule_AddStringConstant | type: c function -->
### `int PyModule_AddStringConstant(PyObject *module, const char *name, const char *value)`

*Part of the Stable ABI.*

Add a string constant to *module* as *name*. This convenience function can be used from the module’s initialization function. The string *value* must be `NULL`-terminated. Return `-1` with an exception set on error, `0` on success.

This is a convenience function that calls `PyUnicode_InternFromString()` and `PyModule_AddObjectRef()`; see their documentation for details.

<!-- anchor: c.PyModule_AddIntMacro | type: c macro -->
### `PyModule_AddIntMacro(module, macro)`

Add an int constant to *module*. The name and the value are taken from *macro*. For example `PyModule_AddIntMacro(module, AF_INET)` adds the int constant *AF_INET* with the value of *AF_INET* to *module*. Return `-1` with an exception set on error, `0` on success.

<!-- anchor: c.PyModule_AddStringMacro | type: c macro -->
### `PyModule_AddStringMacro(module, macro)`

Add a string constant to *module*.

<!-- anchor: c.PyModule_AddType | type: c function -->
### `int PyModule_AddType(PyObject *module, PyTypeObject *type)`

*Part of the Stable ABI since version 3.10.*

Add a type object to *module*. The type object is finalized by calling internally `PyType_Ready()`. The name of the type object is taken from the last component of `tp_name` after dot. Return `-1` with an exception set on error, `0` on success.

Added in version 3.9.

<!-- anchor: c.PyModule_AddFunctions | type: c function -->
### `int PyModule_AddFunctions(PyObject *module, PyMethodDef *functions)`

*Part of the Stable ABI since version 3.7.*

Add the functions from the `NULL` terminated *functions* array to *module*. Refer to the `PyMethodDef` documentation for details on individual entries (due to the lack of a shared module namespace, module level “functions” implemented in C typically receive the module as their first parameter, making them similar to instance methods on Python classes).

This function is called automatically when creating a module from `PyModuleDef` (such as when using Multi-phase initialization, `PyModule_Create`, or `PyModule_FromDefAndSpec`). Some module authors may prefer defining functions in multiple `PyMethodDef` arrays; in that case they should call this function directly.

The *functions* array must be statically allocated (or otherwise guaranteed to outlive the module object).

Added in version 3.5.

<!-- anchor: c.PyModule_SetDocString | type: c function -->
### `int PyModule_SetDocString(PyObject *module, const char *docstring)`

*Part of the Stable ABI since version 3.7.*

Set the docstring for *module* to *docstring*. This function is called automatically when creating a module from `PyModuleDef` (such as when using Multi-phase initialization, `PyModule_Create`, or `PyModule_FromDefAndSpec`).

Return `0` on success. Return `-1` with an exception set on error.

Added in version 3.5.

<!-- anchor: c.PyUnstable_Module_SetGIL | type: c function -->
### `int PyUnstable_Module_SetGIL(PyObject *module, void *gil)`

*This is Unstable API. It may change without warning in minor releases.*

Indicate that *module* does or does not support running without the global interpreter lock (GIL), using one of the values from `Py_mod_gil`. It must be called during *module*’s initialization function when using Legacy single-phase initialization. If this function is not called during module initialization, the import machinery assumes the module does not support running without the GIL. This function is only available in Python builds configured with `--disable-gil`. Return `-1` with an exception set on error, `0` on success.

Added in version 3.13.

<!-- anchor: module-lookup-single-phase-initialization | type: section -->
### Module lookup (single-phase initialization)

The legacy single-phase initialization initialization scheme creates singleton modules that can be looked up in the context of the current interpreter. This allows the module object to be retrieved later with only a reference to the module definition.

These functions will not work on modules created using multi-phase initialization, since multiple such modules can be created from a single definition.

<!-- anchor: c.PyState_FindModule | type: c function -->
#### `PyObject *PyState_FindModule(PyModuleDef *def)`

*Return value: Borrowed reference.**Part of the Stable ABI.*

Returns the module object that was created from *def* for the current interpreter. This method requires that the module object has been attached to the interpreter state with `PyState_AddModule()` beforehand. In case the corresponding module object is not found or has not been attached to the interpreter state yet, it returns `NULL`.

<!-- anchor: c.PyState_AddModule | type: c function -->
#### `int PyState_AddModule(PyObject *module, PyModuleDef *def)`

*Part of the Stable ABI since version 3.3.*

Attaches the module object passed to the function to the interpreter state. This allows the module object to be accessible via `PyState_FindModule()`.

Only effective on modules created using single-phase initialization.

Python calls `PyState_AddModule` automatically after importing a module that uses single-phase initialization, so it is unnecessary (but harmless) to call it from module initialization code. An explicit call is needed only if the module’s own init code subsequently calls `PyState_FindModule`. The function is mainly intended for implementing alternative import mechanisms (either by calling it directly, or by referring to its implementation for details of the required state updates).

If a module was attached previously using the same *def*, it is replaced by the new *module*.

The caller must have an attached thread state.

Return `-1` with an exception set on error, `0` on success.

Added in version 3.3.

<!-- anchor: c.PyState_RemoveModule | type: c function -->
#### `int PyState_RemoveModule(PyModuleDef *def)`

*Part of the Stable ABI since version 3.3.*

Removes the module object created from *def* from the interpreter state. Return `-1` with an exception set on error, `0` on success.

The caller must have an attached thread state.

Added in version 3.3.
