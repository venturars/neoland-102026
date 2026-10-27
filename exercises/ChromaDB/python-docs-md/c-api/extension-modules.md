---
page: c-api/extension-modules.html
title: Defining extension modules
area: c-api
kind: guide
---

<!-- anchor: defining-extension-modules | type: section -->
# Defining extension modules

A C extension for CPython is a shared library (for example, a `.so` file on Linux, `.pyd` DLL on Windows), which is loadable into the Python process (for example, it is compiled with compatible compiler settings), and which exports an *export hook* function (or an old-style initialization function).

To be importable by default (that is, by `importlib.machinery.ExtensionFileLoader`), the shared library must be available on `sys.path`, and must be named after the module name plus an extension listed in `importlib.machinery.EXTENSION_SUFFIXES`.

**Note:**

Building, packaging and distributing extension modules is best done with third-party tools, and is out of scope of this document. One suitable tool is Setuptools, whose documentation can be found at https://setuptools.pypa.io/en/latest/setuptools.html.

<!-- anchor: extension-export-hook | type: section -->
## Extension export hook

Added in version 3.15: Support for the `PyModExport_<name>` export hook was added in Python 3.15. The older way of defining modules is still available: consult either the PyInit function section or earlier versions of this documentation if you plan to support earlier Python versions.

The export hook must be an exported function with the following signature:

<!-- anchor: c.PyModExport_modulename | type: c function -->
### `PySlot *PyModExport_modulename(void)`

For modules with ASCII-only names, the export hook must be named `PyModExport_<name>`, with `<name>` replaced by the module’s name.

For non-ASCII module names, the export hook must instead be named `PyModExportU_<name>` (note the `U`), with `<name>` encoded using Python’s *punycode* encoding with hyphens replaced by underscores. In Python:

```python
def hook_name(name):
    try:
        suffix = b'_' + name.encode('ascii')
    except UnicodeEncodeError:
        suffix = b'U_' + name.encode('punycode').replace(b'-', b'_')
    return b'PyModExport' + suffix
```

The export hook returns an array of `PySlot` entries, terminated by an entry with a slot ID of `0`. These slots describe how the module should be created and initialized.

This array must remain valid and constant until interpreter shutdown. Typically, it should use `static` storage. Prefer using the `Py_mod_create` and `Py_mod_exec` slots for any dynamic behavior.

The export hook may return `NULL` with an exception set to signal failure.

It is recommended to define the export hook function using a helper macro:

<!-- anchor: c.PyMODEXPORT_FUNC | type: c macro -->
### `PyMODEXPORT_FUNC`

*This macro is available when compiling for the Stable ABI since version 3.15.*

Declare an extension module export hook. This macro:

- specifies the PySlot* return type,

- adds any special linkage declarations required by the platform, and

- for C++, declares the function as `extern "C"`.

For example, a module called `spam` would be defined like this:

```c
PyABIInfo_VAR(abi_info);

static PySlot spam_slots[] = {
    PySlot_STATIC_DATA(Py_mod_abi, &abi_info),
    PySlot_STATIC_DATA(Py_mod_name, "spam"),
    PySlot_FUNC(Py_mod_init, spam_init_function),
    ...
    PySlot_END
};

PyMODEXPORT_FUNC
PyModExport_spam(void)
{
    return spam_slots;
}
```

The export hook is typically the only non-`static` item defined in the module’s C source.

The hook should be kept short. If it does more than `return` a static array, several caveats apply:

- If you need to use any Python C API, it is recommended to call `PyABIInfo_Check()` first to raise an exception, rather than crash, in common cases of ABI mismatch.

- Code in the export hook must never rely on the GIL: free-threaded builds of Python can only check the `Py_mod_gil` slot (or the lack of it) after the hook returns,

- Similarly, the hook may be called in any subinterpreter, since the `Py_mod_multiple_interpreters` slot (or lack of it) is only checked after the hook returns.

For example:

```c
PyMODEXPORT_FUNC
PyModExport_modulename(void)
{
   if (PyABIInfo_Check(&abi_info, "modulename") < 0) {
      /* ABI mismatch. It's not safe to examine the raised exception. */
      return NULL;
   }

   /* use Python API (as little as possible); don't rely on GIL */

   return modulename_slots;
}
```

**Note:**

It is possible to export multiple modules from a single shared library by defining multiple export hooks. However, importing them requires a custom importer or suitably named copies/links of the extension file, because Python’s import machinery only finds the function corresponding to the filename. See the Multiple modules in one library section in **PEP 489** for details.

<!-- anchor: multi-phase-initialization | type: section -->
## Multi-phase initialization

The process of creating an extension module follows several phases:

- Python finds and calls the export hook to get information on how to create the module.

- Before any substantial code is executed, Python can determine which capabilities the module supports, and it can adjust the environment or refuse loading an incompatible extension. Slots like `Py_mod_abi`, `Py_mod_gil` and `Py_mod_multiple_interpreters` influence this step.

- By default, Python itself then creates the module object – that is, it does the equivalent of calling `__new__()` when creating an object. This step can be overridden using the `Py_mod_create` slot.

- Python sets initial module attributes like `__package__` and `__loader__`, and inserts the module object into `sys.modules`.

- Afterwards, the module object is initialized in an extension-specific way – the equivalent of `__init__()` when creating an object, or of executing top-level code in a Python-language module. The behavior is specified using the `Py_mod_exec` slot.

This is called *multi-phase initialization* to distinguish it from the legacy (but still supported) single-phase initialization, where an initialization function returns a fully constructed module.

Changed in version 3.5: Added support for multi-phase initialization (**PEP 489**).

<!-- anchor: multiple-module-instances | type: section -->
## Multiple module instances

By default, extension modules are not singletons. For example, if the `sys.modules` entry is removed and the module is re-imported, a new module object is created and, typically, populated with fresh method and type objects. The old module is subject to normal garbage collection. This mirrors the behavior of pure-Python modules.

Additional module instances may be created in sub-interpreters or after Python runtime reinitialization (`Py_Finalize()` and `Py_Initialize()`). In these cases, sharing Python objects between module instances would likely cause crashes or undefined behavior.

To avoid such issues, each instance of an extension module should be *isolated*: changes to one instance should not implicitly affect the others, and all state owned by the module, including references to Python objects, should be specific to a particular module instance. See Isolating Extension Modules for more details and a practical guide.

A simpler way to avoid these issues is raising an error on repeated initialization.

All modules are expected to support sub-interpreters, or otherwise explicitly signal a lack of support. This is usually achieved by isolation or blocking repeated initialization, as above. A module may also be limited to the main interpreter using the `Py_mod_multiple_interpreters` slot.

<!-- anchor: pyinit-function | type: section -->
## `PyInit` function

Soft deprecated since version 3.15: This functionality will not get new features, but there are no plans to remove it.

Instead of `PyModExport_modulename()`, an extension module can define an older-style *initialization function* with the signature:

<!-- anchor: c.PyInit_modulename | type: c function -->
### `PyObject *PyInit_modulename(void)`

Its name should be `PyInit_<name>`, with `<name>` replaced by the name of the module. For non-ASCII module names, use `PyInitU_<name>` instead, with `<name>` encoded in the same way as for the export hook (that is, using Punycode with underscores).

If a module exports both `PyInit_<name>` and `PyModExport_<name>`, the `PyInit_<name>` function is ignored.

Like with `PyMODEXPORT_FUNC`, it is recommended to define the initialization function using a helper macro:

<!-- anchor: c.PyMODINIT_FUNC | type: c macro -->
### `PyMODINIT_FUNC`

Declare an extension module initialization function. This macro:

- specifies the PyObject* return type,

- adds any special linkage declarations required by the platform, and

- for C++, declares the function as `extern "C"`.

Normally, the initialization function (`PyInit_modulename`) returns a `PyModuleDef` instance with non-`NULL` `m_slots`. This allows Python to use multi-phase initialization.

Before it is returned, the `PyModuleDef` instance must be initialized using the following function:

<!-- anchor: c.PyModuleDef_Init | type: c function -->
### `PyObject *PyModuleDef_Init(PyModuleDef *def)`

*Part of the Stable ABI since version 3.5.*

Ensure a module definition is a properly initialized Python object that correctly reports its type and a reference count.

Return *def* cast to `PyObject*`, or `NULL` if an error occurred.

Calling this function is required before returning a `PyModuleDef` from a module initialization function. It should not be used in other contexts.

Note that Python assumes that `PyModuleDef` structures are statically allocated. This function may return either a new reference or a borrowed one; this reference must not be released.

Added in version 3.5.

For example, a module called `spam` would be defined like this:

```c
static struct PyModuleDef spam_module = {
    .m_base = PyModuleDef_HEAD_INIT,
    .m_name = "spam",
    ...
};

PyMODINIT_FUNC
PyInit_spam(void)
{
    return PyModuleDef_Init(&spam_module);
}
```

<!-- anchor: legacy-single-phase-initialization | type: section -->
### Legacy single-phase initialization

Soft deprecated since version 3.15: Single-phase initialization is a legacy mechanism to initialize extension modules, with known drawbacks and design flaws. Extension module authors are encouraged to use multi-phase initialization instead.

However, there are no plans to remove support for it.

In single-phase initialization, the old-style initialization function (`PyInit_modulename`) should create, populate and return a module object. This is typically done using `PyModule_Create()` and functions like `PyModule_AddObjectRef()`.

Single-phase initialization differs from the default in the following ways:

- Single-phase modules are, or rather *contain*, “singletons”.

  When the module is first initialized, Python saves the contents of the module’s `__dict__` (that is, typically, the module’s functions and types).

  For subsequent imports, Python does not call the initialization function again. Instead, it creates a new module object with a new `__dict__`, and copies the saved contents to it. For example, given a single-phase module `_testsinglephase` [1] that defines a function `sum` and an exception class `error`:

  ```python
  >>> import sys
  >>> import _testsinglephase as one
  >>> del sys.modules['_testsinglephase']
  >>> import _testsinglephase as two
  >>> one is two
  False
  >>> one.__dict__ is two.__dict__
  False
  >>> one.sum is two.sum
  True
  >>> one.error is two.error
  True
  ```

  The exact behavior should be considered a CPython implementation detail.

- To work around the fact that `PyInit_modulename` does not take a *spec* argument, some state of the import machinery is saved and applied to the first suitable module created during the `PyInit_modulename` call. Specifically, when a sub-module is imported, this mechanism prepends the parent package name to the name of the module.

  A single-phase `PyInit_modulename` function should create “its” module object as soon as possible, before any other module objects can be created.

- Non-ASCII module names (`PyInitU_modulename`) are not supported.

- Single-phase modules support module lookup functions like `PyState_FindModule()`.

- The module’s `PyModuleDef.m_slots` must be NULL.

[1]

`_testsinglephase` is an internal module used in CPython’s self-test suite; your installation may or may not include it.
