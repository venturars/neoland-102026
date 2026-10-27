---
page: howto/abi3t-migration.html
title: Migrating to Stable ABI for free threading (abi3t)
area: howto
kind: guide
module: export-hook
---

<!-- anchor: migrating-to-stable-abi-for-free-threading-abi3t | type: section -->
# Migrating to Stable ABI for free threading (`abi3t`)

Starting with the 3.15 release, CPython supports a variant of the Stable ABI that supports free-threaded Python: the Stable ABI for Free-Threaded Builds, or `abi3t` for short. This document describes how to adapt C API extensions to support free threading.

<!-- anchor: why-do-this | type: section -->
## Why do this

The typical reason to use the Stable ABI is to reduce the number of artifacts that you need to build and distribute for each version of your library.

Without the Stable ABI, you must build a separate shared library, and typically a *wheel* distribution, for each feature version of CPython you wish to support. For example, each tag in the following table represents a separate library/wheel:

| CPython version | Non-free-threaded | Free-threaded |
| --- | --- | --- |
| 3.12 | `cpython-312` | — |
| 3.13 | `cpython-313` | `cpython-313t` |
| 3.14 | `cpython-314` | `cpython-314t` |
| 3.15 | `cpython-315` | `cpython-315t` |
| 3.16 | `cpython-316` | `cpython-316t` |
| Later versions | `cpython-3XX` | `cpython-3XXt` |

That’s a lot of builds, especially when multiplied by the number of supported platforms.

With the Stable ABI (`abi3`, introduced in CPython 3.2), a single extension (per platform) can cover all *non-free-threaded* builds of CPython:

- CPython version | Non-free-threaded | Free-threaded
- 3.12 | `abi3` | —
- 3.13 | `cpython-313t`
- 3.14 | `cpython-314t`
- 3.15 | `cpython-315t`
- 3.16 | `cpython-316t`
- Later versions | `cpython-3XXt`

The Stable ABI for free-threaded builds (`abi3t`), introduced in CPython 3.15, does the same for free-threaded builds. And it’s compatible with non-free-threaded ones as well:

- CPython version | Non-free-threaded | Free-threaded
- 3.12 | `abi3` * | —
- 3.13 | `cpython-313t`
- 3.14 | `cpython-314t`
- 3.15 | `abi3t`
- 3.16
- Later versions

* (As above, the `abi3` extension is compatible with all non-free-threaded builds; even the 3.15+ ones that this table “attributes” to `abi3t`.)

<!-- anchor: why-not-do-this | type: section -->
### Why *not* do this

There are two main downsides to the Stable ABI.

First, your extension may become slower, since the Stable ABI prioritizes compatibility over performance. The difference is usually not noticeable, and often can be mitigated by using the same source to build both a Stable ABI build and a few version-specific ones for “tier 1” CPython versions.

Second, not all of the C API is available. Extensions need to be ported to build for the Stable ABI, which may be difficult or, in rare cases, impossible.

Specifically, `abi3t` requires APIs added in CPython 3.15. If you want to build your extension for older versions of CPython from the same source, you have two main options:

- Use preprocessor conditionals.

  When following this guide, use `#ifdef Py_TARGET_ABI3T` blocks whenever you are told to do a change that breaks the build on CPython versions you care about. Keep the pre-existing code in `#else` blocks.

  For hand-written C extensions, this approach is reasonable down to CPython 3.12, due to additions introduced in **PEP 697**. Keeping compatibility with 3.11 and below may be worth it for code generators (for example, Cython).

- Do not port to `abi3t`, and continue building separate extensions for each version of CPython, until you can drop support for the older versions.

  This is a valid approach. Not all extensions need to switch to `abi3t` right now.

<!-- anchor: prerequisites | type: section -->
## Prerequisites

This guide assumes that you have an extension written directly in C (or C++), which you want to port to `abi3t`.

If your extension uses a code generator (like Cython) or language binding (like PyO3), it’s best to wait until that tool has support for `abi3t`. If you maintain such a tool, you might be able to adapt the instructions here for your tool.

<!-- anchor: non-free-threaded-stable-abi | type: section -->
### Non-free-threaded Stable ABI

Your extension should support the non-free-threaded Stable ABI (`abi3`). If not, either port it first, or follow this guide but be prepared to fix issues it does not mention.

<!-- anchor: free-threading-support | type: section -->
### Free-threading support

While it’s technically not a hard prerequisite, you will most likely want to prepare your extension for free threading before you port it to `abi3t`. See C API Extension Support for Free Threading for instructions.

**See also:**

Porting Extension Modules to Support Free-Threading: A community-maintained porting guide for extension authors.

<!-- anchor: isolating-extension-modules | type: section -->
### Isolating extension modules

Your module should use multi-phase initialization, and it should either be isolated or limit itself to be loaded at most once per process. If it is not your case, follow Isolating Extension Modules first. (See the opt-out section for a shortcut.)

<!-- anchor: avoiding-variable-sized-types | type: section -->
### Avoiding variable-sized types

If your extension defines variable-sized types (using `Py_tp_itemsize` or `PyTypeObject.tp_itemsize`), it cannot be ported to `abi3t` 3.15.

<!-- anchor: setting-up-the-build | type: section -->
## Setting up the build

If you use a build tool, search its documentation for “`abi3t`”, and follow any instructions to select the ABI. For reference, here are direct links for several popular build tools:

- meson-python

- scikit-build-core

- Maturin

You may want to verify that the tool set the right flag by temporarily adding the following just after `#include <Python.h>`:

```c
#if Py_TARGET_ABI3T+0 <= 0x30f0000
#error "abi3t define is not set!"
#endif
```

This should result in a different error than “`abi3t` define is not set”.

**See also:**

Building and distributing abi3t extensions: Build configuration and wheel testing examples in the community-maintained Python Free-Threading Guide.

**Note:**

If your build tool doesn’t support `abi3t` yet, set the following macro before including `Python.h`:

```c
#define Py_TARGET_ABI3T 0x30f0000
```

or specify it as a compiler flag, for example:

```c
-DPy_TARGET_ABI3T=0x30f0000
```

Once your extension builds with this setting, it will be compatible with CPython 3.15 and above.

If you set this macro manually, you will later need to name and tag the resulting extension manually as well. This is covered in Tagging and distribution below.

This guide will ask you to make a series of changes. After each one, verify that your extension still builds in the original (non-`abi3t`) configuration, and ideally run tests on all Python versions you support. This will ensure that nothing breaks as you are porting.

<!-- anchor: module-export-hook | type: section -->
## Module export hook

Unless you’ve done this step already, your extension module defines a module initialization function named `PyInit_<modname>` (where `modname` is the name of your module). You will need to port it to a module export hook, `PyModExport_<modname>`, a feature added in CPython 3.15 in **PEP 793**.

Your existing init function should look like this (with your own names for `<modname>` and `<moddef>`):

```
PyMODINIT_FUNC
PyInit_<modname>(void)
{
    return PyModuleDef_Init(&<moddef>);
}
```

If there is some code before the `return`, move it to a `Py_mod_create` or `Py_mod_exec` slot function. See the PyInit documentation for related information.

The function references a `PyModuleDef` object (`<moddef>` in the code above). Its definition should be similar to the following, with different values and perhaps some fields unnnamed or left out:

```
static PyModuleDef <moddef> = {
    PyModuleDef_HEAD_INIT,
    .m_name = "my_module",
    .m_doc = "my docstring",
    .m_size = sizeof(my_state_struct),
    .m_methods = my_methods,
    .m_slots = my_slots,
    .m_traverse = my_traverse,
    .m_clear = my_clear,
    .m_free = my_free,
};
```

Remove this definition and the `PyInit` function (or put them in an `#ifndef Py_TARGET_ABI3T` block, to retain backwards compatibility), and replace them with the following:

```
PyABIInfo_VAR(abi_info);

static PySlot my_slot_array[] = {
    PySlot_STATIC_DATA(Py_mod_abi, &abi_info),
    PySlot_STATIC_DATA(Py_mod_name, "my_module"),
    PySlot_STATIC_DATA(Py_mod_doc, "my docstring"),
    PySlot_SIZE(Py_mod_state_size, sizeof(my_state_struct)),
    PySlot_STATIC_DATA(Py_mod_methods, my_methods),
    PySlot_STATIC_DATA(Py_mod_slots, my_slots),
    PySlot_FUNC(Py_mod_state_traverse, my_traverse),
    PySlot_FUNC(Py_mod_state_clear, my_clear),
    PySlot_FUNC(Py_mod_state_free, my_free),
    PySlot_END
};

PyMODEXPORT_FUNC
PyModExport_<modname>(void)
{
    return my_slot_array;
}
```

Leave out any fields that were missing (except the new `Py_mod_abi`), and substitute your own values.

See the `PySlot` and export hook documentation for details on this API.

As in the example, your `PyModExport_` function should *only* return a pointer to static data. If you cannot avoid additional code, refer to the caveats in PyModExport documentation.

**Note:**

When building for Windows using the Setuptools build tool, removing the `PyInit_<modname>` function may result in the linker error `LINK : error LNK2001: unresolved external symbol PyInit_<modname>`. This is caused by Setuptools passing an `/EXPORT` linker flag, which is redundant since Python 3.15 (see gh-141671). A workaround is to add a dummy `PyInit_<modname>` function to your code. Python 3.15+ will never call this function if `PyModExport_<modname>` is present, so it can always fail:

```c
// Workaround for https://github.com/pypa/distutils/issues/387
PyMODINIT_FUNC
PyInit_<modname>(void)
{
    PyErr_SetString(PyExc_SystemError,
                    "PyInit_* called for module with PyModExport_*");
    return NULL;
}
```

(This issue is present in Setuptools 84.0.0; it might be fixed in newer versions.)

<!-- anchor: existing-slots | type: section -->
### Existing slots

If you have a `Py_mod_slots` slot, check the array it refers to. It should be a `PyModuleDef_Slot` array like the following:

```
static PyObject *create_module(PyObject *spec, PyModuleDef *def) { ... }
static int my_first_module_exec(PyObject *module) { ... }
static int my_second_module_exec(PyObject *module) { ... }

static PyModuleDef_Slot my_slots[] = {
   {Py_mod_gil, Py_MOD_GIL_NOT_USED},
   {Py_mod_multiple_interpreters, Py_MOD_PER_INTERPRETER_GIL_SUPPORTED},
   {Py_mod_create, my_module_create},
   {Py_mod_exec, my_first_module_exec},
   {Py_mod_exec, my_second_module_exec},
   {0, NULL}
};
```

<!-- anchor: py-mod-create | type: section -->
#### `py_mod_create`

If you have a `Py_mod_create` entry, make sure the function can be called with `NULL` as its second argument (instead of the `PyModuleDef`, which you are removing). Often, this argument isn’t used at all; you can check by renaming it:

```
static PyObject *create_module(PyObject *spec, PyModuleDef *_unused) { ... }
```

If the argument is used, find a different way to pass in the data. Commonly, the information is static and you can refer to it directly. (If you’re reusing a single function for several different modules, consider defining several functions instead.)

<!-- anchor: multiple-py-mod-exec | type: section -->
#### Multiple `py_mod_exec`

If you have *more than one* `Py_mod_exec` entry, consolidate them: create a new function that calls the others, and replace existing slots with it.

```
static int my_module_exec(PyObject *module) {
   if (my_first_module_exec(module) < 0) return -1;
   if (my_second_module_exec(module) < 0) return -1;
}

static PyModuleDef_Slot my_slots[] = {
   ...
   /* (remove other Py_mod_exec slots) */
   ...
   {Py_mod_exec, my_module_exec},
   {0, NULL}
};
```

If the functions aren’t used elsewhere, you can combine their bodies instead.

<!-- anchor: merging-slot-arrays | type: section -->
#### Merging slot arrays

Optionally, when you break compatibility with Python 3.14, you may clean up the code by moving slots into the `PySlot` array, and converting the definitions to `PySlot_DATA` and `PySlot_FUNC`:

```
static PySlot my_slot_array[] = {
    ...
    PySlot_DATA(Py_mod_gil, Py_MOD_GIL_NOT_USED),
    PySlot_DATA(Py_mod_multiple_interpreters,
         Py_MOD_PER_INTERPRETER_GIL_SUPPORTED)
    PySlot_FUNC(Py_mod_create, my_module_create),
    PySlot_FUNC(Py_mod_exec, my_module_exec),
    PySlot_END
};
```

If you do this, delete the original `PyModuleDef_Slot` array and its `Py_mod_slots` entry.

<!-- anchor: associated-pymoduledef | type: section -->
### Associated `PyModuleDef`

Since the new API does not use a `PyModuleDef` structure, a definition will not be associated with the resulting module. This changes the behavior of the following functions:

- `PyModule_GetDef()`

- `PyType_GetModuleByDef()`

Check your code for these. If you do not use them, you can skip this section.

These functions are typically used for two purposes:

1. To get the definition the module was created with. This is no longer possible using the new API. Modules no longer keep a reference to the definition, so you will need to figure out a different way to pass the relevant data around.

1. To check if a given module object is “yours”. This use case is now served by module tokens – opaque pointers that identify a module. To use a token, declare (or reuse) a unique static variable, for example:

   ```
   static char my_token;
   ```

   and add a pointer to it in a new entry to your module’s `PySlot` array:

   ```
   static PySlot my_slot_array[] = {
      ...
      PySlot_STATIC_DATA(Py_mod_token, &my_token),
      PySlot_END
   }
   ```

   Then, switch from `PyModule_GetDef()` calls such as:

   ```
   PyModuleDef *def = PyModule_GetDef(module);
   ```

   to `PyModule_GetToken()` (which uses an output argument and may fail with an exception):

   ```
   void *token;
   if (PyModule_GetToken(module, &token) < 0) {
       /* handle error */
   }
   ```

   and from `PyType_GetModuleByDef()` calls such as:

   ```
   PyObject *module = PyType_GetModuleByDef(type, my_def);
   /* handle error; use module */
   ```

   to `PyType_GetModuleByToken()` (which returns a strong reference):

   ```
   PyObject *module = PyType_GetModuleByToken(type, my_token);
   /* handle error; use module */
   Py_XDECREF(module);
   ```

<!-- anchor: pyobject-opaqueness | type: section -->
## `PyObject` opaqueness

The `PyObject` and `PyVarObject` structures are opaque in `abi3t`.

Accessing their members is prohibited. If you do this, switch to getter/setter functions mentioned in their documentation:

- `PyObject.ob_type`

- `PyObject.ob_refcnt`

- `PyVarObject.ob_size`

Also, the *size* of the `PyObject` structures is unknown to the compiler. It can – and *does* – change between different CPython builds.

**Note:**

While the size is available at runtime (for example as `sys.getsizeof(object())` in Python code), you should resist the temptation to calculate pointer offsets from it. The object memory layout is subject to change in future `abi3t` implementations.

<!-- anchor: custom-type-definitions | type: section -->
### Custom type definitions

Since `PyObject` is opaque, the traditional way of defining custom types no longer works:

```
typedef struct {
   PyObject_HEAD  // expands to `PyObject ob_base;` which has unknown size

   int my_data;
} CustomObject;

static PyType_Spec CustomType_spec = {
   ...
   .basicsize = sizeof(CustomObject),
   ...
};
```

Most likely, all your class definitions, *and* all code that accesses your classes’ data, will need to be rewritten. This will probably be the biggest change you need to support `abi3t`.

For each such type, instead of defining a `struct` for the entire instance, define one with only the “additional” fields – ones specific to your class, not its superclasses:

```
typedef struct {
   int my_data;
} CustomObjectData;
```

Change the name. Almost all code that uses the struct will need to change (notably, pointers to the new structure cannot be cast to/from `PyObject*`), and changing the name will highlight the usages as compiler errors. (If you use `typeof`, C++ `auto`, or similar ways to avoid typing the type name, this won’t work. Be extra careful, and consider running tools to detect undefined behavior.)

Then, to create the class, use *negative* `basicsize` to indicate “extra” storage space rather than *total* instance size:

```
static PyType_Spec CustomType_spec = {
   ...
   .basicsize = -sizeof(CustomObjectData), /* note the minus sign */
   ...
};
```

If you use `Py_tp_members`, set the `Py_RELATIVE_OFFSET` flag on each member and specify the `offset` relative to your new struct.

<!-- anchor: custom-type-data-access | type: section -->
### Custom type data access

Then comes the hard part: in all code that needs to access this struct, you will need an additional `PyObject_GetTypeData()` call to retrieve a `CustomObjectData *` pointer from `PyObject *`:

```
PyObject *obj = ...;
CustomObjectData *data = PyObject_GetTypeData(obj, cls);
```

Note that this call requires the *type object* for your class (`cls`).

If your class is not subclassable (that is, it does not use the `Py_TPFLAGS_BASETYPE` flag), `cls` will be `Py_TYPE(obj)`. Otherwise, **DO NOT USE** `Py_TYPE` with `PyObject_GetTypeData()`: it might return memory reserved to an unrelated subclass! For example, if a user makes a subclass like this:

```python
class Sub(YourCustomClass):
   __slots__ = ('a', 'b')
```

then `Py_TYPE(obj)` is `Sub`, and the underlying memory may look like this:

```
╭─ PyObject *obj
│              ╭─ the pointer you want
│              │                    ╭─ PyObject_GetTypeData(obj, Py_TYPE(obj))
▼              ▼                    ▼
┌──────────┬───┬────────────────┬───┬─────────────┬───┬─────────────┐
│ PyObject │...│ CustomTypeData │...│ PyObject *a │...│ PyObject *b │
└──────────┴───┴────────────────┴───┴─────────────┴───┴─────────────┘
```

(Ellipses indicate possible padding. Note that this memory layout is not guaranteed: future versions of Python may add different padding or even switch the order of the structures.)

There are two main ways to get the right class:

- In instance methods, your implementation may use the `PyCMethod` signature (and the `METH_METHOD` bit in `PyMethodDef.ml_flags`), and get the class as the `defining_class` argument.

- Otherwise, give your class a unique static token using the `Py_tp_token` slot, and use:

  ```
  PyTypeObject cls;
  if (PyType_GetBaseByToken(Py_TYPE(obj), my_tp_token, &cls) < 0) {
      /* handle error */
  }
  CustomObjectData *data = PyObject_GetTypeData(obj, cls);
  ```

  Type tokens work similarly to module tokens covered earlier in this guide.

<!-- anchor: avoid-build-time-conditionals | type: section -->
## Avoid build-time conditionals

Check your code for API that identifies the version of Python used to *build* your extension. This no longer corresponds to the Python your extension runs on, so code that uses this information often needs changing. The macros to check for are:

- `PY_VERSION_HEX`, `PY_MAJOR_VERSION`, `PY_MINOR_VERSION`:

  - to get the run-time version, use `Py_Version`;

  - to determine what C API is available, use `Py_TARGET_ABI3T`. This macro is set to the minimum supported version.

- `Py_GIL_DISABLED`: under `abi3t`, this macro is always defined. Code that works with free-threaded Python *should* also work with the GIL enabled (since the GIL can be enabled at run time), and usually *does* (unless it, for some reason, requires more than one attached thread state at one time).

<!-- anchor: further-code-changes | type: section -->
## Further code changes

If you are still left with compiler errors or warnings, find a way to fix them. Alas, this guide is limited, and cannot cover all possible code changes extensions may need.

If you find a problem that other extension authors might run into, consider reporting an issue (or sending a pull request) for this guide.

It is possible your issue cannot be fixed for the current version of `abi3t`. In that case, reporting it may help it get prioritized for the next version of CPython.

<!-- anchor: tagging-and-distribution | type: section -->
## Tagging and distribution

If you are using a build tool with `abi3t` support, your extension is ready, but you might want to check that it was built correctly.

Extensions built with `abi3t` should have the following extension:

- On Windows: `.pyd` (like any other extension);

- Linux, macOS, and other systems that use the `.so` suffix: `.abi3t.so` (**not** `.cpython-315t.so` or `.abi3.so`). Note that both free-threaded and non-free-threaded builds will load `.abi3t.so` extensions;

- Other systems: consult your distributor, and perhaps update this guide.

If you distribute the extension as a *wheel*, use the following tags:

- Python tag: `cp3XX`, where *XX* is the minimum Python version the extension is built for. (For example, `cp315` if you set `Py_TARGET_ABI3T` to `0x30f0000`. See Compiling for Stable ABI for more values.)

- ABI tag: `abi3.abi3t`. This is a *compressed tag set* that indicates support for both non-free-threaded and free-threaded builds.

For example, the wheel filename may look like this:

```
myproject-1.0-cp315-abi3.abi3t-macosx_11_0_arm64.whl
```

**See also:**

Platform Compatibility Tags in the PyPA package distribution metadata.

If the filename or tags are incorrect, fix them.

<!-- anchor: testing | type: section -->
## Testing

Note that when you build an extension compatible with multiple versions of CPython, you should always *test* it with each version it supports (for example, 3.15, 3.16, and so on). The Stable ABI only guarantees *ABI* compatibility; there may also be behavior changes – both intentional ones (covered by **PEP 387**) and bugs.

Be sure to run tests on both free-threaded and non-free-threaded builds of CPython.

If they pass, congratulations! You have an `abi3t` extension.
