# Importing Modules

PyObject \*PyImport\_ImportModule(const char \*name)
:   *Return value: New reference.* *Part of the Stable ABI.*

    This is a wrapper around `PyImport_Import()` which takes a
    const char\* as an argument instead of a PyObject\*.

PyObject \*PyImport\_ImportModuleEx(const char \*name, PyObject \*globals, PyObject \*locals, PyObject \*fromlist)
:   *Return value: New reference.*

    Import a module. This is best described by referring to the built-in Python
    function `__import__()`.

    The return value is a new reference to the imported module or top-level
    package, or `NULL` with an exception set on failure. Like for
    `__import__()`, the return value when a submodule of a package was
    requested is normally the top-level package, unless a non-empty *fromlist*
    was given.

    Failing imports remove incomplete module objects, like with
    `PyImport_ImportModule()`.

PyObject \*PyImport\_ImportModuleLevelObject(PyObject \*name, PyObject \*globals, PyObject \*locals, PyObject \*fromlist, int level)
:   *Return value: New reference.* *Part of the Stable ABI since version 3.7.*

    Import a module. This is best described by referring to the built-in Python
    function `__import__()`, as the standard `__import__()` function calls
    this function directly.

    The return value is a new reference to the imported module or top-level package,
    or `NULL` with an exception set on failure. Like for `__import__()`,
    the return value when a submodule of a package was requested is normally the
    top-level package, unless a non-empty *fromlist* was given.

PyObject \*PyImport\_ImportModuleLevel(const char \*name, PyObject \*globals, PyObject \*locals, PyObject \*fromlist, int level)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Similar to `PyImport_ImportModuleLevelObject()`, but the name is a
    UTF-8 encoded string instead of a Unicode object.

    Changed in version 3.3: Negative values for *level* are no longer accepted.

PyObject \*PyImport\_Import(PyObject \*name)
:   *Return value: New reference.* *Part of the Stable ABI.*

    This is a higher-level interface that calls the current “import hook
    function” (with an explicit *level* of 0, meaning absolute import). It
    invokes the `__import__()` function from the `__builtins__` of the
    current globals. This means that the import is done using whatever import
    hooks are installed in the current environment.

    This function always uses absolute imports.

PyObject \*PyImport\_ReloadModule(PyObject \*m)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Reload a module. Return a new reference to the reloaded module, or `NULL` with
    an exception set on failure (the module still exists in this case).

PyObject \*PyImport\_AddModuleRef(const char \*name)
:   *Return value: New reference.* *Part of the Stable ABI since version 3.13.*

    Return the module object corresponding to a module name.

    The *name* argument may be of the form `package.module`. First check the
    modules dictionary if there’s one there, and if not, create a new one and
    insert it in the modules dictionary.

    Return a strong reference to the module on success. Return `NULL`
    with an exception set on failure.

    The module name *name* is decoded from UTF-8.

    This function does not load or import the module; if the module wasn’t
    already loaded, you will get an empty module object. Use
    `PyImport_ImportModule()` or one of its variants to import a module.
    Package structures implied by a dotted name for *name* are not created if
    not already present.

PyObject \*PyImport\_AddModuleObject(PyObject \*name)
:   *Return value: Borrowed reference.* *Part of the Stable ABI since version 3.7.*

    Similar to `PyImport_AddModuleRef()`, but return a [borrowed
    reference](../glossary.md#term-borrowed-reference) and *name* is a Python `str` object.

PyObject \*PyImport\_AddModule(const char \*name)
:   *Return value: Borrowed reference.* *Part of the Stable ABI.*

    Similar to `PyImport_AddModuleRef()`, but return a [borrowed
    reference](../glossary.md#term-borrowed-reference).

PyObject \*PyImport\_ExecCodeModule(const char \*name, PyObject \*co)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Given a module name (possibly of the form `package.module`) and a code object
    read from a Python bytecode file or obtained from the built-in function
    `compile()`, load the module. Return a new reference to the module object,
    or `NULL` with an exception set if an error occurred. *name*
    is removed from `sys.modules` in error cases, even if *name* was already
    in `sys.modules` on entry to `PyImport_ExecCodeModule()`. Leaving
    incompletely initialized modules in `sys.modules` is dangerous, as imports of
    such modules have no way to know that the module object is an unknown (and
    probably damaged with respect to the module author’s intents) state.

    The module’s `__spec__` and `__loader__` will be
    set, if not set already, with the appropriate values. The spec’s loader
    will be set to the module’s `__loader__` (if set) and to an instance
    of `SourceFileLoader` otherwise.

    The module’s `__file__` attribute will be set to the code
    object’s `co_filename`.

    This function will reload the module if it was already imported. See
    `PyImport_ReloadModule()` for the intended way to reload a module.

    If *name* points to a dotted name of the form `package.module`, any package
    structures not already created will still not be created.

    See also `PyImport_ExecCodeModuleEx()` and
    `PyImport_ExecCodeModuleWithPathnames()`.

    Changed in version 3.12: The setting of `__cached__` and `__loader__`
    is deprecated. See `ModuleSpec` for
    alternatives.

    Changed in version 3.15: The `__cached__` attribute is no longer set.

PyObject \*PyImport\_ExecCodeModuleEx(const char \*name, PyObject \*co, const char \*pathname)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Like `PyImport_ExecCodeModule()`, but the `__file__`
    attribute of the module object is set to *pathname* if it is non-`NULL`.

    See also `PyImport_ExecCodeModuleWithPathnames()`.

PyObject \*PyImport\_ExecCodeModuleObject(PyObject \*name, PyObject \*co, PyObject \*pathname, PyObject \*cpathname)
:   *Return value: New reference.* *Part of the Stable ABI since version 3.7.*

    Like `PyImport_ExecCodeModuleEx()`, but the path to any compiled file
    via *cpathname* is used appropriately when non-`NULL`. Of the three
    functions, this is the preferred one to use.

    Changed in version 3.12: Setting `__cached__` is deprecated. See
    `ModuleSpec` for alternatives.

    Changed in version 3.15: The `__cached__` attribute no longer set.

PyObject \*PyImport\_ExecCodeModuleWithPathnames(const char \*name, PyObject \*co, const char \*pathname, const char \*cpathname)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Like `PyImport_ExecCodeModuleObject()`, but *name*, *pathname* and
    *cpathname* are UTF-8 encoded strings. Attempts are also made to figure out
    what the value for *pathname* should be from *cpathname* if the former is
    set to `NULL`.

    Changed in version 3.12: No longer uses the removed `imp` module.

long PyImport\_GetMagicNumber()
:   *Part of the Stable ABI.*

    Return the magic number for Python bytecode files (a.k.a. `.pyc` file).
    The magic number should be present in the first four bytes of the bytecode
    file, in little-endian byte order. Returns `-1` on error.

const char \*PyImport\_GetMagicTag()
:   *Part of the Stable ABI.*

    Return the magic tag string for **PEP 3147** format Python bytecode file
    names. Keep in mind that the value at `sys.implementation.cache_tag` is
    authoritative and should be used instead of this function.

PyObject \*PyImport\_GetModuleDict()
:   *Return value: Borrowed reference.* *Part of the Stable ABI.*

    Return the dictionary used for the module administration (a.k.a.
    `sys.modules`). Note that this is a per-interpreter variable.

PyObject \*PyImport\_GetModule(PyObject \*name)
:   *Return value: New reference.* *Part of the Stable ABI since version 3.8.*

    Return the already imported module with the given name. If the
    module has not been imported yet then returns `NULL` but does not set
    an error. Returns `NULL` and sets an error if the lookup failed.

PyObject \*PyImport\_GetImporter(PyObject \*path)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return a finder object for a `sys.path`/`pkg.__path__` item
    *path*, possibly by fetching it from the `sys.path_importer_cache`
    dict. If it wasn’t yet cached, traverse `sys.path_hooks` until a hook
    is found that can handle the path item. Return `None` if no hook could;
    this tells our caller that the path based finder could not find a
    finder for this path item. Cache the result in `sys.path_importer_cache`.
    Return a new reference to the finder object.

int PyImport\_ImportFrozenModuleObject(PyObject \*name)
:   *Part of the Stable ABI since version 3.7.*

    Load a frozen module named *name*. Return `1` for success, `0` if the
    module is not found, and `-1` with an exception set if the initialization
    failed. To access the imported module on a successful load, use
    `PyImport_ImportModule()`. (Note the misnomer — this function would
    reload the module if it was already imported.)

    Changed in version 3.4: The `__file__` attribute is no longer set on the module.

int PyImport\_ImportFrozenModule(const char \*name)
:   *Part of the Stable ABI.*

    Similar to `PyImport_ImportFrozenModuleObject()`, but the name is a
    UTF-8 encoded string instead of a Unicode object.

struct \_frozen
:   This is the structure type definition for frozen module descriptors, as
    generated by the **freeze** utility (see `Tools/freeze/` in the
    Python source distribution). Its definition, found in `Include/import.h`,
    is:

    ```
    struct _frozen {
        const char *name;                 /* ASCII encoded string */
        const unsigned char *code;
        int size;
        int is_package;
    };
    ```

const struct \_frozen \*PyImport\_FrozenModules
:   This pointer is initialized to point to an array of `_frozen`
    records, terminated by one whose members are all `NULL` or zero. When a frozen
    module is imported, it is searched in this table. Third-party code could play
    tricks with this to provide a dynamically created collection of frozen modules.

int PyImport\_AppendInittab(const char \*name, PyObject \*(\*initfunc)(void))
:   *Part of the Stable ABI.*

    Add a single module to the existing table of built-in modules. This is a
    convenience wrapper around `PyImport_ExtendInittab()`, returning `-1` if
    the table could not be extended. The new module can be imported by the name
    *name*, and uses the function *initfunc* as the initialization function called
    on the first attempted import. This should be called before
    `Py_Initialize()`.

struct \_inittab
:   Structure describing a single entry in the list of built-in modules.
    Programs which
    embed Python may use an array of these structures in conjunction with
    `PyImport_ExtendInittab()` to provide additional built-in modules.
    The structure consists of two members:

    const char \*name
    :   The module name, as an ASCII encoded string.

    PyObject \*(\*initfunc)(void)
    :   Initialization function for a module built into the interpreter.

        Note that the inittab uses “`PyInit`”
        initialization functions;
        there is currently no way to include “`PyModExport_`”
        export hooks.

int PyImport\_ExtendInittab(struct \_inittab \*newtab)
:   Add a collection of modules to the table of built-in modules. The *newtab*
    array must end with a sentinel entry which contains `NULL` for the `name`
    field; failure to provide the sentinel value can result in a memory fault.
    Returns `0` on success or `-1` if insufficient memory could be allocated to
    extend the internal table. In the event of failure, no modules are added to the
    internal table. This must be called before `Py_Initialize()`.

    If Python is initialized multiple times, `PyImport_AppendInittab()` or
    `PyImport_ExtendInittab()` must be called before each Python
    initialization.

struct \_inittab \*PyImport\_Inittab
:   The table of built-in modules used by Python initialization. Do not use this directly;
    use `PyImport_AppendInittab()` and `PyImport_ExtendInittab()`
    instead.

PyObject \*PyImport\_ImportModuleAttr(PyObject \*mod\_name, PyObject \*attr\_name)
:   *Return value: New reference.*

    Import the module *mod\_name* and get its attribute *attr\_name*.

    Names must be Python `str` objects.

    Helper function combining `PyImport_Import()` and
    `PyObject_GetAttr()`. For example, it can raise `ImportError` if
    the module is not found, and `AttributeError` if the attribute doesn’t
    exist.

PyObject \*PyImport\_ImportModuleAttrString(const char \*mod\_name, const char \*attr\_name)
:   *Return value: New reference.*

    Similar to `PyImport_ImportModuleAttr()`, but names are UTF-8 encoded
    strings instead of Python `str` objects.

PyImport\_LazyImportsMode PyImport\_GetLazyImportsMode()
:   Gets the current lazy imports mode.

    Added in version 3.15.

PyObject \*PyImport\_GetLazyImportsFilter()
:   Return a strong reference to the current lazy imports filter,
    or `NULL` if none exists. This function always succeeds.

    Added in version 3.15.

int PyImport\_SetLazyImportsMode(PyImport\_LazyImportsMode mode)
:   Sets the current lazy imports mode.

    This function always returns `0`.

    Added in version 3.15.

int PyImport\_SetLazyImportsFilter(PyObject \*filter)
:   Sets the current lazy imports filter. The *filter* should be a callable that
    will receive `(importing_module_name, imported_module_name, [fromlist])`
    when an import can potentially be lazy. The `imported_module_name` value
    is the resolved module name, so `lazy from .spam import eggs` passes
    `package.spam`. The callable must return `True` if the import should be
    lazy and `False` otherwise.

    Return `0` on success and `-1` with an exception set otherwise.

    Added in version 3.15.

type PyImport\_LazyImportsMode
:   Enumeration of possible lazy import modes.

    enumerator PyImport\_LAZY\_NORMAL
    :   Respect the `lazy` keyword in source code. This is the default mode.

    enumerator PyImport\_LAZY\_ALL
    :   Make all imports lazy by default.

    Added in version 3.15.

PyObject \*PyImport\_CreateModuleFromInitfunc(PyObject \*spec, PyObject \*(\*initfunc)(void))
:   This function is a building block that enables embedders to implement
    the `create_module()` step of custom
    static extension importers (e.g. of statically-linked extensions).

    *spec* must be a `ModuleSpec` object.

    *initfunc* must be an initialization function,
    the same as for `PyImport_AppendInittab()`.

    On success, create and return a module object.
    This module will not be initialized; call `PyModule_Exec()`
    to initialize it.
    (Custom importers should do this in their
    `exec_module()` method.)

    On error, return NULL with an exception set.

    For modules using legacy single-phase initialization,
    most of the import process is done in this function, rather than in
    extra steps that importers typically take after
    `create_module()`.
    Specifically:

    - The module is added to `sys.modules` under the *spec*’s
      `name` as part of initialization.
    - If a single-phase module was previously imported under the
      same `name` by this function
      or as a built-in module (for example, one registered with
      `PyImport_AppendInittab()`), Python may reuse the previous module’s
      contents instead of calling *initfunc* again.
    - The module will be fully initialized by *initfunc*.
      Calling `PyModule_Exec()` on it will have no effect, though it is
      still recommended, in case the module later switches to
      multi-phase initialization.
    - Also, if the *spec*’s `name` contains dots, this name is used
      for prepending a parent package to the new module’s
      `__name__`.

    Added in version 3.15.
