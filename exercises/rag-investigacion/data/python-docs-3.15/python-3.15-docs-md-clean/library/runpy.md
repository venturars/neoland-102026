# `runpy` — Locating and executing Python modules

The `runpy` module is used to locate and run Python modules without
importing them first. Its main use is to implement the `-m` command
line switch that allows scripts to be located using the Python module
namespace rather than the filesystem.

Note that this is *not* a sandbox module - all code is executed in the
current process, and any side effects (such as cached imports of other
modules) will remain in place after the functions have returned.

Furthermore, any functions and classes defined by the executed code are not
guaranteed to work correctly after a `runpy` function has returned.
If that limitation is not acceptable for a given use case, `importlib`
is likely to be a more suitable choice than this module.

The `runpy` module provides two functions:

runpy.run\_module(*mod\_name*, *init\_globals=None*, *run\_name=None*, *alter\_sys=False*)
:   Execute the code of the specified module and return the resulting module’s
    globals dictionary. The module’s code is first located using the standard
    import mechanism (refer to **PEP 302** for details) and then executed in a
    fresh module namespace.

    The *mod\_name* argument should be an absolute module name.
    If the module name refers to a package rather than a normal
    module, then that package is imported and the `__main__` submodule within
    that package is then executed and the resulting module globals dictionary
    returned.

    The optional dictionary argument *init\_globals* may be used to pre-populate
    the module’s globals dictionary before the code is executed.
    *init\_globals* will not be modified. If any of the special global variables
    below are defined in *init\_globals*, those definitions are
    overridden by `run_module()`.

    The special global variables `__name__`, `__spec__`, `__file__`,
    `__loader__` and `__package__` are set in the globals dictionary before
    the module code is executed. (Note that this is a minimal set of variables -
    other variables may be set implicitly as an interpreter implementation
    detail.)

    `__name__` is set to *run\_name* if this optional argument is not
    `None`, to `mod_name + '.__main__'` if the named module is a
    package and to the *mod\_name* argument otherwise.

    `__spec__` will be set appropriately for the *actually* imported
    module (that is, `__spec__.name` will always be *mod\_name* or
    `mod_name + '.__main__'`, never *run\_name*).

    `__file__`, `__loader__` and `__package__` are
    set as normal based on the module spec.

    If the argument *alter\_sys* is supplied and evaluates to `True`,
    then `sys.argv[0]` is updated with the value of `__file__` and
    `sys.modules[__name__]` is updated with a temporary module object for the
    module being executed. Both `sys.argv[0]` and `sys.modules[__name__]`
    are restored to their original values before the function returns.

    Note that this manipulation of `sys` is not thread-safe. Other threads
    may see the partially initialised module, as well as the altered list of
    arguments. It is recommended that the `sys` module be left alone when
    invoking this function from threaded code.

    See also

    The `-m` option offering equivalent functionality from the
    command line.

    Changed in version 3.12: The setting of `__cached__`, `__loader__`, and
    `__package__` are deprecated. See
    `ModuleSpec` for alternatives.

    Changed in version 3.15: The global variable `__cached__` is no longer set.

runpy.run\_path(*path\_name*, *init\_globals=None*, *run\_name=None*)
:   Execute the code at the named filesystem location and return the resulting
    module’s globals dictionary. As with a script name supplied to the CPython
    command line, *file\_path* may refer to a Python source file, a
    compiled bytecode file or a valid `sys.path` entry containing a
    `__main__` module
    (e.g. a zipfile containing a top-level `__main__.py` file).

    For a simple script, the specified code is simply executed in a fresh
    module namespace. For a valid `sys.path` entry (typically a zipfile or
    directory), the entry is first added to the beginning of `sys.path`. The
    function then looks for and executes a `__main__` module using the
    updated path. Note that there is no special protection against invoking
    an existing `__main__` entry located elsewhere on `sys.path` if
    there is no such module at the specified location.

    The optional dictionary argument *init\_globals* may be used to pre-populate
    the module’s globals dictionary before the code is executed.
    *init\_globals* will not be modified. If any of the special global variables
    below are defined in *init\_globals*, those definitions are
    overridden by `run_path()`.

    The special global variables `__name__`, `__spec__`, `__file__`,
    `__loader__` and `__package__` are set in the globals dictionary before
    the module code is executed. (Note that this is a minimal set of variables -
    other variables may be set implicitly as an interpreter implementation
    detail.)

    `__name__` is set to *run\_name* if this optional argument is not
    `None` and to `'<run_path>'` otherwise.

    If *file\_path* directly references a script file (whether as source
    or as precompiled byte code), then `__file__` will be set to
    *file\_path*, and `__spec__`, `__loader__` and
    `__package__` will all be set to `None`.

    If *file\_path* is a reference to a valid `sys.path` entry, then
    `__spec__` will be set appropriately for the imported `__main__`
    module (that is, `__spec__.name` will always be `__main__`).
    `__file__`, `__loader__` and `__package__` will be
    set as normal based on the module spec.

    A number of alterations are also made to the `sys` module. Firstly,
    `sys.path` may be altered as described above. `sys.argv[0]` is updated
    with the value of *file\_path* and `sys.modules[__name__]` is updated
    with a temporary module object for the module being executed. All
    modifications to items in `sys` are reverted before the function
    returns.

    Note that, unlike `run_module()`, the alterations made to `sys`
    are not optional in this function as these adjustments are essential to
    allowing the execution of `sys.path` entries. As the thread-safety
    limitations still apply, use of this function in threaded code should be
    either serialised with the import lock or delegated to a separate process.

    See also

    Interface options for equivalent functionality on the
    command line (`python path/to/script`).

    Changed in version 3.12: The setting of `__cached__`, `__loader__`, and
    `__package__` are deprecated.

    Changed in version 3.15: The global variable `__cached__` is no longer set.

See also

**PEP 338** – Executing modules as scripts
:   PEP written and implemented by Nick Coghlan.

**PEP 366** – Main module explicit relative imports
:   PEP written and implemented by Nick Coghlan.

**PEP 451** – A ModuleSpec Type for the Import System
:   PEP written and implemented by Eric Snow

Command line and environment - CPython command line details

The `importlib.import_module()` function
