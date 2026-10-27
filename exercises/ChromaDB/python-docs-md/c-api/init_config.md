---
page: c-api/init_config.html
title: Python Initialization Configuration
area: c-api
kind: guide
---

<!-- anchor: python-initialization-configuration | type: section -->
# Python Initialization Configuration

<!-- anchor: pyinitconfig-c-api | type: section -->
## PyInitConfig C API

Added in version 3.14.

Python can be initialized with `Py_InitializeFromInitConfig()`.

The `Py_RunMain()` function can be used to write a customized Python program.

See also Initialization, Finalization, and Threads.

**See also:**

**PEP 741** “Python Configuration C API”.

<!-- anchor: example | type: section -->
### Example

Example of customized Python always running with the Python Development Mode enabled; return `-1` on error:

```c
int init_python(void)
{
    PyInitConfig *config = PyInitConfig_Create();
    if (config == NULL) {
        printf("PYTHON INIT ERROR: memory allocation failed\n");
        return -1;
    }

    // Enable the Python Development Mode
    if (PyInitConfig_SetInt(config, "dev_mode", 1) < 0) {
        goto error;
    }

    // Initialize Python with the configuration
    if (Py_InitializeFromInitConfig(config) < 0) {
        goto error;
    }
    PyInitConfig_Free(config);
    return 0;

error:
    {
        // Display the error message.
        //
        // This uncommon braces style is used, because you cannot make
        // goto targets point to variable declarations.
        const char *err_msg;
        (void)PyInitConfig_GetError(config, &err_msg);
        printf("PYTHON INIT ERROR: %s\n", err_msg);
        PyInitConfig_Free(config);
        return -1;
    }
}
```

<!-- anchor: create-config | type: section -->
### Create Config

<!-- anchor: c.PyInitConfig | type: c struct -->
#### `struct PyInitConfig`

Opaque structure to configure the Python initialization.

<!-- anchor: c.PyInitConfig_Create | type: c function -->
#### `PyInitConfig *PyInitConfig_Create(void)`

Create a new initialization configuration using Isolated Configuration default values.

It must be freed by `PyInitConfig_Free()`.

Return `NULL` on memory allocation failure.

<!-- anchor: c.PyInitConfig_Free | type: c function -->
#### `void PyInitConfig_Free(PyInitConfig *config)`

Free memory of the initialization configuration *config*.

If *config* is `NULL`, no operation is performed.

<!-- anchor: error-handling | type: section -->
### Error Handling

<!-- anchor: c.PyInitConfig_GetError | type: c function -->
#### `int PyInitConfig_GetError(PyInitConfig *config, const char **err_msg)`

Get the *config* error message.

- Set **err_msg* and return `1` if an error is set.

- Set **err_msg* to `NULL` and return `0` otherwise.

An error message is a UTF-8 encoded string.

If *config* has an exit code, format the exit code as an error message.

The error message remains valid until another `PyInitConfig` function is called with *config*. The caller doesn’t have to free the error message.

<!-- anchor: c.PyInitConfig_GetExitCode | type: c function -->
#### `int PyInitConfig_GetExitCode(PyInitConfig *config, int *exitcode)`

Get the *config* exit code.

- Set **exitcode* and return `1` if *config* has an exit code set.

- Return `0` if *config* has no exit code set.

Only the `Py_InitializeFromInitConfig()` function can set an exit code if the `parse_argv` option is non-zero.

An exit code can be set when parsing the command line failed (exit code `2`) or when a command line option asks to display the command line help (exit code `0`).

<!-- anchor: get-options | type: section -->
### Get Options

The configuration option *name* parameter must be a non-NULL null-terminated UTF-8 encoded string. See Configuration Options.

<!-- anchor: c.PyInitConfig_HasOption | type: c function -->
#### `int PyInitConfig_HasOption(PyInitConfig *config, const char *name)`

Test if the configuration has an option called *name*.

Return `1` if the option exists, or return `0` otherwise.

<!-- anchor: c.PyInitConfig_GetInt | type: c function -->
#### `int PyInitConfig_GetInt(PyInitConfig *config, const char *name, int64_t *value)`

Get an integer configuration option.

- Set **value*, and return `0` on success.

- Set an error in *config* and return `-1` on error.

<!-- anchor: c.PyInitConfig_GetStr | type: c function -->
#### `int PyInitConfig_GetStr(PyInitConfig *config, const char *name, char **value)`

Get a string configuration option as a null-terminated UTF-8 encoded string.

- Set **value*, and return `0` on success.

- Set an error in *config* and return `-1` on error.

**value* can be set to `NULL` if the option is an optional string and the option is unset.

On success, the string must be released with `free(value)` if it’s not `NULL`.

<!-- anchor: c.PyInitConfig_GetStrList | type: c function -->
#### `int PyInitConfig_GetStrList(PyInitConfig *config, const char *name, size_t *length, char ***items)`

Get a string list configuration option as an array of null-terminated UTF-8 encoded strings.

- Set **length* and **value*, and return `0` on success.

- Set an error in *config* and return `-1` on error.

On success, the string list must be released with `PyInitConfig_FreeStrList(length, items)`.

<!-- anchor: c.PyInitConfig_FreeStrList | type: c function -->
#### `void PyInitConfig_FreeStrList(size_t length, char **items)`

Free memory of a string list created by `PyInitConfig_GetStrList()`.

<!-- anchor: set-options | type: section -->
### Set Options

The configuration option *name* parameter must be a non-NULL null-terminated UTF-8 encoded string. See Configuration Options.

Some configuration options have side effects on other options. This logic is only implemented when `Py_InitializeFromInitConfig()` is called, not by the “Set” functions below. For example, setting `dev_mode` to `1` does not set `faulthandler` to `1`.

<!-- anchor: c.PyInitConfig_SetInt | type: c function -->
#### `int PyInitConfig_SetInt(PyInitConfig *config, const char *name, int64_t value)`

Set an integer configuration option.

- Return `0` on success.

- Set an error in *config* and return `-1` on error.

<!-- anchor: c.PyInitConfig_SetStr | type: c function -->
#### `int PyInitConfig_SetStr(PyInitConfig *config, const char *name, const char *value)`

Set a string configuration option from a null-terminated UTF-8 encoded string. The string is copied.

- Return `0` on success.

- Set an error in *config* and return `-1` on error.

<!-- anchor: c.PyInitConfig_SetStrList | type: c function -->
#### `int PyInitConfig_SetStrList(PyInitConfig *config, const char *name, size_t length, char *const *items)`

Set a string list configuration option from an array of null-terminated UTF-8 encoded strings. The string list is copied.

- Return `0` on success.

- Set an error in *config* and return `-1` on error.

<!-- anchor: module | type: section -->
### Module

<!-- anchor: c.PyInitConfig_AddModule | type: c function -->
#### `int PyInitConfig_AddModule(PyInitConfig *config, const char *name, PyObject *(*initfunc)(void))`

Add a built-in extension module to the table of built-in modules.

The new module can be imported by the name *name*, and uses the function *initfunc* as the initialization function called on the first attempted import.

- Return `0` on success.

- Set an error in *config* and return `-1` on error.

If Python is initialized multiple times, `PyInitConfig_AddModule()` must be called at each Python initialization.

Similar to the `PyImport_AppendInittab()` function.

<!-- anchor: initialize-python | type: section -->
### Initialize Python

<!-- anchor: c.Py_InitializeFromInitConfig | type: c function -->
#### `int Py_InitializeFromInitConfig(PyInitConfig *config)`

Initialize Python from the initialization configuration.

- Return `0` on success.

- Set an error in *config* and return `-1` on error.

- Set an exit code in *config* and return `-1` if Python wants to exit.

See `PyInitConfig_GetExitcode()` for the exit code case.

<!-- anchor: configuration-options | type: section -->
## Configuration Options

| Option | PyConfig/PyPreConfig member | Type | Visibility |
| --- | --- | --- | --- |
| `"allocator"` | `allocator` | `int` | Read-only |
| `"argv"` | `argv` | `list[str]` | Public |
| `"base_exec_prefix"` | `base_exec_prefix` | `str` | Public |
| `"base_executable"` | `base_executable` | `str` | Public |
| `"base_prefix"` | `base_prefix` | `str` | Public |
| `"buffered_stdio"` | `buffered_stdio` | `bool` | Read-only |
| `"bytes_warning"` | `bytes_warning` | `int` | Public |
| `"check_hash_pycs_mode"` | `check_hash_pycs_mode` | `str` | Read-only |
| `"code_debug_ranges"` | `code_debug_ranges` | `bool` | Read-only |
| `"coerce_c_locale"` | `coerce_c_locale` | `bool` | Read-only |
| `"coerce_c_locale_warn"` | `coerce_c_locale_warn` | `bool` | Read-only |
| `"configure_c_stdio"` | `configure_c_stdio` | `bool` | Read-only |
| `"configure_locale"` | `configure_locale` | `bool` | Read-only |
| `"cpu_count"` | `cpu_count` | `int` | Public |
| `"dev_mode"` | `dev_mode` | `bool` | Read-only |
| `"dump_refs"` | `dump_refs` | `bool` | Read-only |
| `"dump_refs_file"` | `dump_refs_file` | `str` | Read-only |
| `"exec_prefix"` | `exec_prefix` | `str` | Public |
| `"executable"` | `executable` | `str` | Public |
| `"faulthandler"` | `faulthandler` | `bool` | Read-only |
| `"filesystem_encoding"` | `filesystem_encoding` | `str` | Read-only |
| `"filesystem_errors"` | `filesystem_errors` | `str` | Read-only |
| `"hash_seed"` | `hash_seed` | `int` | Read-only |
| `"home"` | `home` | `str` | Read-only |
| `"import_time"` | `import_time` | `int` | Read-only |
| `"inspect"` | `inspect` | `bool` | Public |
| `"install_signal_handlers"` | `install_signal_handlers` | `bool` | Read-only |
| `"int_max_str_digits"` | `int_max_str_digits` | `int` | Public |
| `"interactive"` | `interactive` | `bool` | Public |
| `"isolated"` | `isolated` | `bool` | Read-only |
| `"legacy_windows_fs_encoding"` | `legacy_windows_fs_encoding` | `bool` | Read-only |
| `"legacy_windows_stdio"` | `legacy_windows_stdio` | `bool` | Read-only |
| `"malloc_stats"` | `malloc_stats` | `bool` | Read-only |
| `"module_search_paths"` | `module_search_paths` | `list[str]` | Public |
| `"optimization_level"` | `optimization_level` | `int` | Public |
| `"orig_argv"` | `orig_argv` | `list[str]` | Read-only |
| `"parse_argv"` | `parse_argv` | `bool` | Read-only |
| `"parser_debug"` | `parser_debug` | `bool` | Public |
| `"pathconfig_warnings"` | `pathconfig_warnings` | `bool` | Read-only |
| `"perf_profiling"` | `perf_profiling` | `bool` | Read-only |
| `"platlibdir"` | `platlibdir` | `str` | Public |
| `"prefix"` | `prefix` | `str` | Public |
| `"program_name"` | `program_name` | `str` | Read-only |
| `"pycache_prefix"` | `pycache_prefix` | `str` | Public |
| `"quiet"` | `quiet` | `bool` | Public |
| `"run_command"` | `run_command` | `str` | Read-only |
| `"run_filename"` | `run_filename` | `str` | Read-only |
| `"run_module"` | `run_module` | `str` | Read-only |
| `"run_presite"` | `run_presite` | `str` | Read-only |
| `"safe_path"` | `safe_path` | `bool` | Read-only |
| `"show_ref_count"` | `show_ref_count` | `bool` | Read-only |
| `"site_import"` | `site_import` | `bool` | Read-only |
| `"skip_source_first_line"` | `skip_source_first_line` | `bool` | Read-only |
| `"stdio_encoding"` | `stdio_encoding` | `str` | Read-only |
| `"stdio_errors"` | `stdio_errors` | `str` | Read-only |
| `"stdlib_dir"` | `stdlib_dir` | `str` | Public |
| `"tracemalloc"` | `tracemalloc` | `int` | Read-only |
| `"use_environment"` | `use_environment` | `bool` | Public |
| `"use_frozen_modules"` | `use_frozen_modules` | `bool` | Read-only |
| `"use_hash_seed"` | `use_hash_seed` | `bool` | Read-only |
| `"use_system_logger"` | `use_system_logger` | `bool` | Read-only |
| `"user_site_directory"` | `user_site_directory` | `bool` | Read-only |
| `"utf8_mode"` | `utf8_mode` | `bool` | Read-only |
| `"verbose"` | `verbose` | `int` | Public |
| `"warn_default_encoding"` | `warn_default_encoding` | `bool` | Read-only |
| `"warnoptions"` | `warnoptions` | `list[str]` | Public |
| `"write_bytecode"` | `write_bytecode` | `bool` | Public |
| `"xoptions"` | `xoptions` | `dict[str, str]` | Public |
| `"_pystats"` | `_pystats` | `bool` | Read-only |

Visibility:

- Public: Can be retrieved by `PyConfig_Get()` and set by `PyConfig_Set()`.

- Read-only: Can be retrieved by `PyConfig_Get()`, but cannot be set by `PyConfig_Set()`.

<!-- anchor: runtime-python-configuration-api | type: section -->
## Runtime Python configuration API

At runtime, it’s possible to get and set configuration options using `PyConfig_Get()` and `PyConfig_Set()` functions.

The configuration option *name* parameter must be a non-NULL null-terminated UTF-8 encoded string. See Configuration Options.

Some options are read from the `sys` attributes. For example, the option `"argv"` is read from `sys.argv`.

<!-- anchor: c.PyConfig_Get | type: c function -->
### `PyObject *PyConfig_Get(const char *name)`

Get the current runtime value of a configuration option as a Python object.

- Return a new reference on success.

- Set an exception and return `NULL` on error.

The object type depends on the configuration option. It can be:

- `bool`

- `int`

- `str`

- `list[str]`

- `dict[str, str]`

The caller must have an attached thread state. The function cannot be called before Python initialization nor after Python finalization.

Added in version 3.14.

<!-- anchor: c.PyConfig_GetInt | type: c function -->
### `int PyConfig_GetInt(const char *name, int *value)`

Similar to `PyConfig_Get()`, but get the value as a C int.

- Return `0` on success.

- Set an exception and return `-1` on error.

Added in version 3.14.

<!-- anchor: c.PyConfig_Names | type: c function -->
### `PyObject *PyConfig_Names(void)`

Get all configuration option names as a `frozenset`.

- Return a new reference on success.

- Set an exception and return `NULL` on error.

The caller must have an attached thread state. The function cannot be called before Python initialization nor after Python finalization.

Added in version 3.14.

<!-- anchor: c.PyConfig_Set | type: c function -->
### `int PyConfig_Set(const char *name, PyObject *value)`

Set the current runtime value of a configuration option.

- Raise a `ValueError` if there is no option *name*.

- Raise a `ValueError` if *value* is an invalid value.

- Raise a `ValueError` if the option is read-only (cannot be set).

- Raise a `TypeError` if *value* has not the proper type.

The caller must have an attached thread state. The function cannot be called before Python initialization nor after Python finalization.

Raises an auditing event `cpython.PyConfig_Set` with arguments `name`, `value`.

Added in version 3.14.

Changed in version 3.15: The function now replaces `sys.flags` (create a new object), instead of modifying `sys.flags` in-place.

<!-- anchor: pyconfig-c-api | type: section -->
## PyConfig C API

Added in version 3.8.

Python can be initialized with `Py_InitializeFromConfig()` and the `PyConfig` structure. It can be preinitialized with `Py_PreInitialize()` and the `PyPreConfig` structure.

There are two kinds of configuration:

- The Python Configuration can be used to build a customized Python which behaves as the regular Python. For example, environment variables and command line arguments are used to configure Python.

- The Isolated Configuration can be used to embed Python into an application. It isolates Python from the system. For example, environment variables are ignored, the LC_CTYPE locale is left unchanged and no signal handler is registered.

The `Py_RunMain()` function can be used to write a customized Python program.

See also Initialization, Finalization, and Threads.

**See also:**

**PEP 587** “Python Initialization Configuration”.

<!-- anchor: id1 | type: section -->
### Example

Example of customized Python always running in isolated mode:

```c
int main(int argc, char **argv)
{
    PyStatus status;

    PyConfig config;
    PyConfig_InitPythonConfig(&config);
    config.isolated = 1;

    /* Decode command line arguments.
       Implicitly preinitialize Python (in isolated mode). */
    status = PyConfig_SetBytesArgv(&config, argc, argv);
    if (PyStatus_Exception(status)) {
        goto exception;
    }

    status = Py_InitializeFromConfig(&config);
    if (PyStatus_Exception(status)) {
        goto exception;
    }
    PyConfig_Clear(&config);

    return Py_RunMain();

exception:
    PyConfig_Clear(&config);
    if (PyStatus_IsExit(status)) {
        return status.exitcode;
    }
    /* Display the error message and exit the process with
       non-zero exit code */
    Py_ExitStatusException(status);
}
```

<!-- anchor: pywidestringlist | type: section -->
### PyWideStringList

<!-- anchor: c.PyWideStringList | type: c type -->
#### `type PyWideStringList`

List of `wchar_t*` strings.

If *length* is non-zero, *items* must be non-`NULL` and all strings must be non-`NULL`.

Methods:

<!-- anchor: c.PyWideStringList_Append | type: c function -->
##### `PyStatus PyWideStringList_Append(PyWideStringList *list, const wchar_t *item)`

Append *item* to *list*.

Python must be preinitialized to call this function.

<!-- anchor: c.PyWideStringList_Insert | type: c function -->
##### `PyStatus PyWideStringList_Insert(PyWideStringList *list, Py_ssize_t index, const wchar_t *item)`

Insert *item* into *list* at *index*.

If *index* is greater than or equal to *list* length, append *item* to *list*.

*index* must be greater than or equal to `0`.

Python must be preinitialized to call this function.

Structure fields:

<!-- anchor: c.PyWideStringList.length | type: c member -->
##### `Py_ssize_t length`

List length.

<!-- anchor: c.PyWideStringList.items | type: c member -->
##### `wchar_t **items`

List items.

<!-- anchor: pystatus | type: section -->
### PyStatus

<!-- anchor: c.PyStatus | type: c type -->
#### `type PyStatus`

Structure to store an initialization function status: success, error or exit.

For an error, it can store the C function name which created the error.

Structure fields:

<!-- anchor: c.PyStatus.exitcode | type: c member -->
##### `int exitcode`

Exit code. Argument passed to `exit()`.

<!-- anchor: c.PyStatus.err_msg | type: c member -->
##### `const char *err_msg`

Error message.

<!-- anchor: c.PyStatus.func | type: c member -->
##### `const char *func`

Name of the function which created an error, can be `NULL`.

Functions to create a status:

<!-- anchor: c.PyStatus_Ok | type: c function -->
##### `PyStatus PyStatus_Ok(void)`

Success.

<!-- anchor: c.PyStatus_Error | type: c function -->
##### `PyStatus PyStatus_Error(const char *err_msg)`

Initialization error with a message.

*err_msg* must not be `NULL`.

<!-- anchor: c.PyStatus_NoMemory | type: c function -->
##### `PyStatus PyStatus_NoMemory(void)`

Memory allocation failure (out of memory).

<!-- anchor: c.PyStatus_Exit | type: c function -->
##### `PyStatus PyStatus_Exit(int exitcode)`

Exit Python with the specified exit code.

Functions to handle a status:

<!-- anchor: c.PyStatus_Exception | type: c function -->
##### `int PyStatus_Exception(PyStatus status)`

Is the status an error or an exit? If true, the exception must be handled; by calling `Py_ExitStatusException()` for example.

<!-- anchor: c.PyStatus_IsError | type: c function -->
##### `int PyStatus_IsError(PyStatus status)`

Is the result an error?

<!-- anchor: c.PyStatus_IsExit | type: c function -->
##### `int PyStatus_IsExit(PyStatus status)`

Is the result an exit?

<!-- anchor: c.Py_ExitStatusException | type: c function -->
##### `void Py_ExitStatusException(PyStatus status)`

Call `exit(exitcode)` if *status* is an exit. Print the error message and exit with a non-zero exit code if *status* is an error. Must only be called if `PyStatus_Exception(status)` is non-zero.

**Note:**

Internally, Python uses macros which set `PyStatus.func`, whereas functions to create a status set `func` to `NULL`.

Example:

```c
PyStatus alloc(void **ptr, size_t size)
{
    *ptr = PyMem_RawMalloc(size);
    if (*ptr == NULL) {
        return PyStatus_NoMemory();
    }
    return PyStatus_Ok();
}

int main(int argc, char **argv)
{
    void *ptr;
    PyStatus status = alloc(&ptr, 16);
    if (PyStatus_Exception(status)) {
        Py_ExitStatusException(status);
    }
    PyMem_Free(ptr);
    return 0;
}
```

<!-- anchor: pypreconfig | type: section -->
### PyPreConfig

<!-- anchor: c.PyPreConfig | type: c type -->
#### `type PyPreConfig`

Structure used to preinitialize Python.

Function to initialize a preconfiguration:

<!-- anchor: c.PyPreConfig_InitPythonConfig | type: c function -->
##### `void PyPreConfig_InitPythonConfig(PyPreConfig *preconfig)`

Initialize the preconfiguration with Python Configuration.

<!-- anchor: c.PyPreConfig_InitIsolatedConfig | type: c function -->
##### `void PyPreConfig_InitIsolatedConfig(PyPreConfig *preconfig)`

Initialize the preconfiguration with Isolated Configuration.

Structure fields:

<!-- anchor: c.PyPreConfig.allocator | type: c member -->
##### `int allocator`

Name of the Python memory allocators:

- `PYMEM_ALLOCATOR_NOT_SET` (`0`): don’t change memory allocators (use defaults).

- `PYMEM_ALLOCATOR_DEFAULT` (`1`): default memory allocators.

- `PYMEM_ALLOCATOR_DEBUG` (`2`): default memory allocators with debug hooks.

- `PYMEM_ALLOCATOR_MALLOC` (`3`): use `malloc()` of the C library.

- `PYMEM_ALLOCATOR_MALLOC_DEBUG` (`4`): force usage of `malloc()` with debug hooks.

- `PYMEM_ALLOCATOR_PYMALLOC` (`5`): Python pymalloc memory allocator.

- `PYMEM_ALLOCATOR_PYMALLOC_DEBUG` (`6`): Python pymalloc memory allocator with debug hooks.

- `PYMEM_ALLOCATOR_MIMALLOC` (`6`): use `mimalloc`, a fast malloc replacement.

- `PYMEM_ALLOCATOR_MIMALLOC_DEBUG` (`7`): use `mimalloc`, a fast malloc replacement with debug hooks.

`PYMEM_ALLOCATOR_PYMALLOC` and `PYMEM_ALLOCATOR_PYMALLOC_DEBUG` are not supported if Python is `configured using --without-pymalloc`.

`PYMEM_ALLOCATOR_MIMALLOC` and `PYMEM_ALLOCATOR_MIMALLOC_DEBUG` are not supported if Python is `configured using --without-mimalloc` or if the underlying atomic support isn’t available.

See Memory Management.

Default: `PYMEM_ALLOCATOR_NOT_SET`.

<!-- anchor: c.PyPreConfig.configure_locale | type: c member -->
##### `int configure_locale`

Set the LC_CTYPE locale to the user preferred locale.

If equals to `0`, set `coerce_c_locale` and `coerce_c_locale_warn` members to `0`.

See the locale encoding.

Default: `1` in Python config, `0` in isolated config.

<!-- anchor: c.PyPreConfig.coerce_c_locale | type: c member -->
##### `int coerce_c_locale`

If equals to `2`, coerce the C locale.

If equals to `1`, read the LC_CTYPE locale to decide if it should be coerced.

See the locale encoding.

Default: `-1` in Python config, `0` in isolated config.

<!-- anchor: c.PyPreConfig.coerce_c_locale_warn | type: c member -->
##### `int coerce_c_locale_warn`

If non-zero, emit a warning if the C locale is coerced.

Default: `-1` in Python config, `0` in isolated config.

<!-- anchor: c.PyPreConfig.dev_mode | type: c member -->
##### `int dev_mode`

Python Development Mode: see `PyConfig.dev_mode`.

Default: `-1` in Python mode, `0` in isolated mode.

<!-- anchor: c.PyPreConfig.isolated | type: c member -->
##### `int isolated`

Isolated mode: see `PyConfig.isolated`.

Default: `0` in Python mode, `1` in isolated mode.

<!-- anchor: c.PyPreConfig.legacy_windows_fs_encoding | type: c member -->
##### `int legacy_windows_fs_encoding`

If non-zero:

- Set `PyPreConfig.utf8_mode` to `0`,

- Set `PyConfig.filesystem_encoding` to `"mbcs"`,

- Set `PyConfig.filesystem_errors` to `"replace"`.

Initialized from the `PYTHONLEGACYWINDOWSFSENCODING` environment variable value.

Only available on Windows. `#ifdef MS_WINDOWS` macro can be used for Windows specific code.

Default: `0`.

<!-- anchor: c.PyPreConfig.parse_argv | type: c member -->
##### `int parse_argv`

If non-zero, `Py_PreInitializeFromArgs()` and `Py_PreInitializeFromBytesArgs()` parse their `argv` argument the same way the regular Python parses command line arguments: see Command Line Arguments.

Default: `1` in Python config, `0` in isolated config.

<!-- anchor: c.PyPreConfig.use_environment | type: c member -->
##### `int use_environment`

Use environment variables? See `PyConfig.use_environment`.

Default: `1` in Python config and `0` in isolated config.

<!-- anchor: c.PyPreConfig.utf8_mode | type: c member -->
##### `int utf8_mode`

If non-zero, enable the Python UTF-8 Mode.

Set to `0` or `1` by the `-X utf8` command line option and the `PYTHONUTF8` environment variable.

Default: `1`.

<!-- anchor: preinitialize-python-with-pypreconfig | type: section -->
### Preinitialize Python with PyPreConfig

The preinitialization of Python:

- Set the Python memory allocators (`PyPreConfig.allocator`)

- Configure the LC_CTYPE locale (locale encoding)

- Set the Python UTF-8 Mode (`PyPreConfig.utf8_mode`)

The current preconfiguration (`PyPreConfig` type) is stored in `_PyRuntime.preconfig`.

Functions to preinitialize Python:

<!-- anchor: c.Py_PreInitialize | type: c function -->
#### `PyStatus Py_PreInitialize(const PyPreConfig *preconfig)`

Preinitialize Python from *preconfig* preconfiguration.

*preconfig* must not be `NULL`.

<!-- anchor: c.Py_PreInitializeFromBytesArgs | type: c function -->
#### `PyStatus Py_PreInitializeFromBytesArgs(const PyPreConfig *preconfig, int argc, char *const *argv)`

Preinitialize Python from *preconfig* preconfiguration.

Parse *argv* command line arguments (bytes strings) if `parse_argv` of *preconfig* is non-zero.

*preconfig* must not be `NULL`.

<!-- anchor: c.Py_PreInitializeFromArgs | type: c function -->
#### `PyStatus Py_PreInitializeFromArgs(const PyPreConfig *preconfig, int argc, wchar_t *const *argv)`

Preinitialize Python from *preconfig* preconfiguration.

Parse *argv* command line arguments (wide strings) if `parse_argv` of *preconfig* is non-zero.

*preconfig* must not be `NULL`.

The caller is responsible to handle exceptions (error or exit) using `PyStatus_Exception()` and `Py_ExitStatusException()`.

For Python Configuration (`PyPreConfig_InitPythonConfig()`), if Python is initialized with command line arguments, the command line arguments must also be passed to preinitialize Python, since they have an effect on the pre-configuration like encodings. For example, the `-X utf8` command line option enables the Python UTF-8 Mode.

`PyMem_SetAllocator()` can be called after `Py_PreInitialize()` and before `Py_InitializeFromConfig()` to install a custom memory allocator. It can be called before `Py_PreInitialize()` if `PyPreConfig.allocator` is set to `PYMEM_ALLOCATOR_NOT_SET`.

Python memory allocation functions like `PyMem_RawMalloc()` must not be used before the Python preinitialization, whereas calling directly `malloc()` and `free()` is always safe. `Py_DecodeLocale()` must not be called before the Python preinitialization.

Example using the preinitialization to enable the Python UTF-8 Mode:

```c
PyStatus status;
PyPreConfig preconfig;
PyPreConfig_InitPythonConfig(&preconfig);

preconfig.utf8_mode = 1;

status = Py_PreInitialize(&preconfig);
if (PyStatus_Exception(status)) {
    Py_ExitStatusException(status);
}

/* at this point, Python speaks UTF-8 */

Py_Initialize();
/* ... use Python API here ... */
Py_Finalize();
```

<!-- anchor: pyconfig | type: section -->
### PyConfig

<!-- anchor: c.PyConfig | type: c type -->
#### `type PyConfig`

Structure containing most parameters to configure Python.

When done, the `PyConfig_Clear()` function must be used to release the configuration memory.

Structure methods:

<!-- anchor: c.PyConfig_InitPythonConfig | type: c function -->
##### `void PyConfig_InitPythonConfig(PyConfig *config)`

Initialize configuration with the Python Configuration.

<!-- anchor: c.PyConfig_InitIsolatedConfig | type: c function -->
##### `void PyConfig_InitIsolatedConfig(PyConfig *config)`

Initialize configuration with the Isolated Configuration.

<!-- anchor: c.PyConfig_SetString | type: c function -->
##### `PyStatus PyConfig_SetString(PyConfig *config, wchar_t *const *config_str, const wchar_t *str)`

Copy the wide character string *str* into `*config_str`.

Preinitialize Python if needed.

<!-- anchor: c.PyConfig_SetBytesString | type: c function -->
##### `PyStatus PyConfig_SetBytesString(PyConfig *config, wchar_t *const *config_str, const char *str)`

Decode *str* using `Py_DecodeLocale()` and set the result into `*config_str`.

Preinitialize Python if needed.

<!-- anchor: c.PyConfig_SetArgv | type: c function -->
##### `PyStatus PyConfig_SetArgv(PyConfig *config, int argc, wchar_t *const *argv)`

Set command line arguments (`argv` member of *config*) from the *argv* list of wide character strings.

Preinitialize Python if needed.

<!-- anchor: c.PyConfig_SetBytesArgv | type: c function -->
##### `PyStatus PyConfig_SetBytesArgv(PyConfig *config, int argc, char *const *argv)`

Set command line arguments (`argv` member of *config*) from the *argv* list of bytes strings. Decode bytes using `Py_DecodeLocale()`.

Preinitialize Python if needed.

<!-- anchor: c.PyConfig_SetWideStringList | type: c function -->
##### `PyStatus PyConfig_SetWideStringList(PyConfig *config, PyWideStringList *list, Py_ssize_t length, wchar_t **items)`

Set the list of wide strings *list* to *length* and *items*.

Preinitialize Python if needed.

<!-- anchor: c.PyConfig_Read | type: c function -->
##### `PyStatus PyConfig_Read(PyConfig *config)`

Read all Python configuration.

Fields which are already initialized are left unchanged.

Fields for path configuration are no longer calculated or modified when calling this function, as of Python 3.11.

The `PyConfig_Read()` function only parses `PyConfig.argv` arguments once: `PyConfig.parse_argv` is set to `2` after arguments are parsed. Since Python arguments are stripped from `PyConfig.argv`, parsing arguments twice would parse the application options as Python options.

Preinitialize Python if needed.

Changed in version 3.10: The `PyConfig.argv` arguments are now only parsed once, `PyConfig.parse_argv` is set to `2` after arguments are parsed, and arguments are only parsed if `PyConfig.parse_argv` equals `1`.

Changed in version 3.11: `PyConfig_Read()` no longer calculates all paths, and so fields listed under Python Path Configuration may no longer be updated until `Py_InitializeFromConfig()` is called.

<!-- anchor: c.PyConfig_Clear | type: c function -->
##### `void PyConfig_Clear(PyConfig *config)`

Release configuration memory.

Most `PyConfig` methods preinitialize Python if needed. In that case, the Python preinitialization configuration (`PyPreConfig`) is based on the `PyConfig`. If configuration fields which are in common with `PyPreConfig` are tuned, they must be set before calling a `PyConfig` method:

- `PyConfig.dev_mode`

- `PyConfig.isolated`

- `PyConfig.parse_argv`

- `PyConfig.use_environment`

Moreover, if `PyConfig_SetArgv()` or `PyConfig_SetBytesArgv()` is used, this method must be called before other methods, since the preinitialization configuration depends on command line arguments (if `parse_argv` is non-zero).

The caller of these methods is responsible to handle exceptions (error or exit) using `PyStatus_Exception()` and `Py_ExitStatusException()`.

Structure fields:

<!-- anchor: c.PyConfig.argv | type: c member -->
##### `PyWideStringList argv`

Set `sys.argv` command line arguments based on `argv`. These parameters are similar to those passed to the program’s `main()` function with the difference that the first entry should refer to the script file to be executed rather than the executable hosting the Python interpreter. If there isn’t a script that will be run, the first entry in `argv` can be an empty string.

Set `parse_argv` to `1` to parse `argv` the same way the regular Python parses Python command line arguments and then to strip Python arguments from `argv`.

If `argv` is empty, an empty string is added to ensure that `sys.argv` always exists and is never empty.

Default: `NULL`.

See also the `orig_argv` member.

<!-- anchor: c.PyConfig.safe_path | type: c member -->
##### `int safe_path`

If equals to zero, `Py_RunMain()` prepends a potentially unsafe path to `sys.path` at startup:

- If `argv[0]` is equal to `L"-m"` (`python -m module`), prepend the current working directory.

- If running a script (`python script.py`), prepend the script’s directory. If it’s a symbolic link, resolve symbolic links.

- Otherwise (`python -c code` and `python`), prepend an empty string, which means the current working directory.

Set to `1` by the `-P` command line option and the `PYTHONSAFEPATH` environment variable.

Default: `0` in Python config, `1` in isolated config.

Added in version 3.11.

<!-- anchor: c.PyConfig.base_exec_prefix | type: c member -->
##### `wchar_t *base_exec_prefix`

`sys.base_exec_prefix`.

Default: `NULL`.

Part of the Python Path Configuration output.

See also `PyConfig.exec_prefix`.

<!-- anchor: c.PyConfig.base_executable | type: c member -->
##### `wchar_t *base_executable`

Python base executable: `sys._base_executable`.

Set by the `__PYVENV_LAUNCHER__` environment variable.

Set from `PyConfig.executable` if `NULL`.

Default: `NULL`.

Part of the Python Path Configuration output.

See also `PyConfig.executable`.

<!-- anchor: c.PyConfig.base_prefix | type: c member -->
##### `wchar_t *base_prefix`

`sys.base_prefix`.

Default: `NULL`.

Part of the Python Path Configuration output.

See also `PyConfig.prefix`.

<!-- anchor: c.PyConfig.buffered_stdio | type: c member -->
##### `int buffered_stdio`

If equals to `0` and `configure_c_stdio` is non-zero, disable buffering on the C streams stdout and stderr.

Set to `0` by the `-u` command line option and the `PYTHONUNBUFFERED` environment variable.

stdin is always opened in buffered mode.

Default: `1`.

<!-- anchor: c.PyConfig.bytes_warning | type: c member -->
##### `int bytes_warning`

If equals to `1`, issue a warning when comparing `bytes` or `bytearray` with `str`, or comparing `bytes` with `int`.

If equal or greater to `2`, raise a `BytesWarning` exception in these cases.

Incremented by the `-b` command line option.

Default: `0`.

Deprecated since version 3.15, will be removed in version 3.17: The `-b` and `-bb` options will become no-op in 3.17. `bytes_warning` member will be removed in 3.17.

<!-- anchor: c.PyConfig.warn_default_encoding | type: c member -->
##### `int warn_default_encoding`

If non-zero, emit a `EncodingWarning` warning when `io.TextIOWrapper` uses its default encoding. See Opt-in EncodingWarning for details.

Default: `0`.

Added in version 3.10.

<!-- anchor: c.PyConfig.code_debug_ranges | type: c member -->
##### `int code_debug_ranges`

If equals to `0`, disables the inclusion of the end line and column mappings in code objects. Also disables traceback printing carets to specific error locations.

Set to `0` by the `PYTHONNODEBUGRANGES` environment variable and by the `-X no_debug_ranges` command line option.

Default: `1`.

Added in version 3.11.

<!-- anchor: c.PyConfig.check_hash_pycs_mode | type: c member -->
##### `wchar_t *check_hash_pycs_mode`

Control the validation behavior of hash-based `.pyc` files: value of the `--check-hash-based-pycs` command line option.

Valid values:

- `L"always"`: Hash the source file for invalidation regardless of value of the ‘check_source’ flag.

- `L"never"`: Assume that hash-based pycs always are valid.

- `L"default"`: The ‘check_source’ flag in hash-based pycs determines invalidation.

Default: `L"default"`.

See also **PEP 552** “Deterministic pycs”.

<!-- anchor: c.PyConfig.configure_c_stdio | type: c member -->
##### `int configure_c_stdio`

If non-zero, configure C standard streams:

- On Windows, set the binary mode (`O_BINARY`) on stdin, stdout and stderr.

- If `buffered_stdio` equals zero, disable buffering of stdin, stdout and stderr streams.

- If `interactive` is non-zero, enable stream buffering on stdin and stdout (only stdout on Windows).

Default: `1` in Python config, `0` in isolated config.

<!-- anchor: c.PyConfig.dev_mode | type: c member -->
##### `int dev_mode`

If non-zero, enable the Python Development Mode.

Set to `1` by the `-X dev` option and the `PYTHONDEVMODE` environment variable.

Default: `-1` in Python mode, `0` in isolated mode.

<!-- anchor: c.PyConfig.dump_refs | type: c member -->
##### `int dump_refs`

Dump Python references?

If non-zero, dump all objects which are still alive at exit.

Set to `1` by the `PYTHONDUMPREFS` environment variable.

Needs a special build of Python with the `Py_TRACE_REFS` macro defined: see the `configure --with-trace-refs option`.

Default: `0`.

<!-- anchor: c.PyConfig.dump_refs_file | type: c member -->
##### `wchar_t *dump_refs_file`

Filename where to dump Python references.

Set by the `PYTHONDUMPREFSFILE` environment variable.

Default: `NULL`.

Added in version 3.11.

<!-- anchor: c.PyConfig.exec_prefix | type: c member -->
##### `wchar_t *exec_prefix`

The site-specific directory prefix where the platform-dependent Python files are installed: `sys.exec_prefix`.

Default: `NULL`.

Part of the Python Path Configuration output.

See also `PyConfig.base_exec_prefix`.

<!-- anchor: c.PyConfig.executable | type: c member -->
##### `wchar_t *executable`

The absolute path of the executable binary for the Python interpreter: `sys.executable`.

Default: `NULL`.

Part of the Python Path Configuration output.

See also `PyConfig.base_executable`.

<!-- anchor: c.PyConfig.faulthandler | type: c member -->
##### `int faulthandler`

Enable faulthandler?

If non-zero, call `faulthandler.enable()` at startup.

Set to `1` by `-X faulthandler` and the `PYTHONFAULTHANDLER` environment variable.

Default: `-1` in Python mode, `0` in isolated mode.

<!-- anchor: c.PyConfig.filesystem_encoding | type: c member -->
##### `wchar_t *filesystem_encoding`

Filesystem encoding: `sys.getfilesystemencoding()`.

On macOS, Android and VxWorks: use `"utf-8"` by default.

On Windows: use `"utf-8"` by default, or `"mbcs"` if `legacy_windows_fs_encoding` of `PyPreConfig` is non-zero.

Default encoding on other platforms:

- `"utf-8"` if `PyPreConfig.utf8_mode` is non-zero.

- `"ascii"` if Python detects that `nl_langinfo(CODESET)` announces the ASCII encoding, whereas the `mbstowcs()` function decodes from a different encoding (usually Latin1).

- `"utf-8"` if `nl_langinfo(CODESET)` returns an empty string.

- Otherwise, use the locale encoding: `nl_langinfo(CODESET)` result.

At Python startup, the encoding name is normalized to the Python codec name. For example, `"ANSI_X3.4-1968"` is replaced with `"ascii"`.

See also the `filesystem_errors` member.

<!-- anchor: c.PyConfig.filesystem_errors | type: c member -->
##### `wchar_t *filesystem_errors`

Filesystem error handler: `sys.getfilesystemencodeerrors()`.

On Windows: use `"surrogatepass"` by default, or `"replace"` if `legacy_windows_fs_encoding` of `PyPreConfig` is non-zero.

On other platforms: use `"surrogateescape"` by default.

Supported error handlers:

- `"strict"`

- `"surrogateescape"`

- `"surrogatepass"` (only supported with the UTF-8 encoding)

See also the `filesystem_encoding` member.

<!-- anchor: c.PyConfig.use_frozen_modules | type: c member -->
##### `int use_frozen_modules`

If non-zero, use frozen modules.

Set by the `PYTHON_FROZEN_MODULES` environment variable.

Default: `1` in a release build, or `0` in a debug build.

<!-- anchor: c.PyConfig.hash_seed | type: c member -->
##### `unsigned long hash_seed`

<!-- anchor: c.PyConfig.use_hash_seed | type: c member -->
##### `int use_hash_seed`

Randomized hash function seed.

If `use_hash_seed` is zero, a seed is chosen randomly at Python startup, and `hash_seed` is ignored.

Set by the `PYTHONHASHSEED` environment variable.

Default *use_hash_seed* value: `-1` in Python mode, `0` in isolated mode.

<!-- anchor: c.PyConfig.home | type: c member -->
##### `wchar_t *home`

Set the default Python “home” directory, that is, the location of the standard Python libraries (see `PYTHONHOME`).

Set by the `PYTHONHOME` environment variable.

Default: `NULL`.

Part of the Python Path Configuration input.

<!-- anchor: c.PyConfig.import_time | type: c member -->
##### `int import_time`

If `1`, profile import time. If `2`, include additional output that indicates when an imported module has already been loaded.

Set by the `-X importtime` option and the `PYTHONPROFILEIMPORTTIME` environment variable.

Default: `0`.

Changed in version 3.14: Added support for `import_time = 2`

<!-- anchor: c.PyConfig.inspect | type: c member -->
##### `int inspect`

Enter interactive mode after executing a script or a command.

If greater than `0`, enable inspect: when a script is passed as first argument or the -c option is used, enter interactive mode after executing the script or the command, even when `sys.stdin` does not appear to be a terminal.

Incremented by the `-i` command line option. Set to `1` if the `PYTHONINSPECT` environment variable is non-empty.

Default: `0`.

<!-- anchor: c.PyConfig.install_signal_handlers | type: c member -->
##### `int install_signal_handlers`

Install Python signal handlers?

Default: `1` in Python mode, `0` in isolated mode.

<!-- anchor: c.PyConfig.interactive | type: c member -->
##### `int interactive`

If greater than `0`, enable the interactive mode (REPL).

Incremented by the `-i` command line option.

Default: `0`.

<!-- anchor: c.PyConfig.int_max_str_digits | type: c member -->
##### `int int_max_str_digits`

Configures the integer string conversion length limitation. An initial value of `-1` means the value will be taken from the command line or environment or otherwise default to 4300 (`sys.int_info.default_max_str_digits`). A value of `0` disables the limitation. Values greater than zero but less than 640 (`sys.int_info.str_digits_check_threshold`) are unsupported and will produce an error.

Configured by the `-X int_max_str_digits` command line flag or the `PYTHONINTMAXSTRDIGITS` environment variable.

Default: `-1` in Python mode. 4300 (`sys.int_info.default_max_str_digits`) in isolated mode.

Added in version 3.12.

<!-- anchor: c.PyConfig.cpu_count | type: c member -->
##### `int cpu_count`

If the value of `cpu_count` is not `-1` then it will override the return values of `os.cpu_count()`, `os.process_cpu_count()`, and `multiprocessing.cpu_count()`.

Configured by the `-X cpu_count=n|default` command line flag or the `PYTHON_CPU_COUNT` environment variable.

Default: `-1`.

Added in version 3.13.

<!-- anchor: c.PyConfig.isolated | type: c member -->
##### `int isolated`

If greater than `0`, enable isolated mode:

- Set `safe_path` to `1`: don’t prepend a potentially unsafe path to `sys.path` at Python startup, such as the current directory, the script’s directory or an empty string.

- Set `use_environment` to `0`: ignore `PYTHON` environment variables.

- Set `user_site_directory` to `0`: don’t add the user site directory to `sys.path`.

- Python REPL doesn’t import `readline` nor enable default readline configuration on interactive prompts.

Set to `1` by the `-I` command line option.

Default: `0` in Python mode, `1` in isolated mode.

See also the Isolated Configuration and `PyPreConfig.isolated`.

<!-- anchor: c.PyConfig.legacy_windows_stdio | type: c member -->
##### `int legacy_windows_stdio`

If non-zero, use `io.FileIO` instead of `io._WindowsConsoleIO` for `sys.stdin`, `sys.stdout` and `sys.stderr`.

Set to `1` if the `PYTHONLEGACYWINDOWSSTDIO` environment variable is set to a non-empty string.

Only available on Windows. `#ifdef MS_WINDOWS` macro can be used for Windows specific code.

Default: `0`.

See also the **PEP 528** (Change Windows console encoding to UTF-8).

<!-- anchor: c.PyConfig.malloc_stats | type: c member -->
##### `int malloc_stats`

If non-zero, dump statistics on Python pymalloc memory allocator at exit.

Set to `1` by the `PYTHONMALLOCSTATS` environment variable.

The option is ignored if Python is `configured using the --without-pymalloc option`.

Default: `0`.

<!-- anchor: c.PyConfig.platlibdir | type: c member -->
##### `wchar_t *platlibdir`

Platform library directory name: `sys.platlibdir`.

Set by the `PYTHONPLATLIBDIR` environment variable.

Default: value of the `PLATLIBDIR` macro which is set by the `configure --with-platlibdir option` (default: `"lib"`, or `"DLLs"` on Windows).

Part of the Python Path Configuration input.

Added in version 3.9.

Changed in version 3.11: This macro is now used on Windows to locate the standard library extension modules, typically under `DLLs`. However, for compatibility, note that this value is ignored for any non-standard layouts, including in-tree builds and virtual environments.

<!-- anchor: c.PyConfig.pythonpath_env | type: c member -->
##### `wchar_t *pythonpath_env`

Module search paths (`sys.path`) as a string separated by `DELIM` (`os.pathsep`).

Set by the `PYTHONPATH` environment variable.

Default: `NULL`.

Part of the Python Path Configuration input.

<!-- anchor: c.PyConfig.module_search_paths | type: c member -->
##### `PyWideStringList module_search_paths`

<!-- anchor: c.PyConfig.module_search_paths_set | type: c member -->
##### `int module_search_paths_set`

Module search paths: `sys.path`.

If `module_search_paths_set` is equal to `0`, `Py_InitializeFromConfig()` will replace `module_search_paths` and sets `module_search_paths_set` to `1`.

Default: empty list (`module_search_paths`) and `0` (`module_search_paths_set`).

Part of the Python Path Configuration output.

<!-- anchor: c.PyConfig.optimization_level | type: c member -->
##### `int optimization_level`

Compilation optimization level:

- `0`: Peephole optimizer, set `__debug__` to `True`.

- `1`: Level 0, remove assertions, set `__debug__` to `False`.

- `2`: Level 1, strip docstrings.

Incremented by the `-O` command line option. Set to the `PYTHONOPTIMIZE` environment variable value.

Default: `0`.

<!-- anchor: c.PyConfig.orig_argv | type: c member -->
##### `PyWideStringList orig_argv`

The list of the original command line arguments passed to the Python executable: `sys.orig_argv`.

If `orig_argv` list is empty and `argv` is not a list only containing an empty string, `PyConfig_Read()` copies `argv` into `orig_argv` before modifying `argv` (if `parse_argv` is non-zero).

See also the `argv` member and the `Py_GetArgcArgv()` function.

Default: empty list.

Added in version 3.10.

<!-- anchor: c.PyConfig.parse_argv | type: c member -->
##### `int parse_argv`

Parse command line arguments?

If equals to `1`, parse `argv` the same way the regular Python parses command line arguments, and strip Python arguments from `argv`.

The `PyConfig_Read()` function only parses `PyConfig.argv` arguments once: `PyConfig.parse_argv` is set to `2` after arguments are parsed. Since Python arguments are stripped from `PyConfig.argv`, parsing arguments twice would parse the application options as Python options.

Default: `1` in Python mode, `0` in isolated mode.

Changed in version 3.10: The `PyConfig.argv` arguments are now only parsed if `PyConfig.parse_argv` equals to `1`.

<!-- anchor: c.PyConfig.parser_debug | type: c member -->
##### `int parser_debug`

Parser debug mode. If greater than `0`, turn on parser debugging output (for expert only, depending on compilation options).

Incremented by the `-d` command line option. Set to the `PYTHONDEBUG` environment variable value.

Needs a debug build of Python (the `Py_DEBUG` macro must be defined).

Default: `0`.

<!-- anchor: c.PyConfig.pathconfig_warnings | type: c member -->
##### `int pathconfig_warnings`

If non-zero, calculation of path configuration is allowed to log warnings into `stderr`. If equals to `0`, suppress these warnings.

Default: `1` in Python mode, `0` in isolated mode.

Part of the Python Path Configuration input.

Changed in version 3.11: Now also applies on Windows.

<!-- anchor: c.PyConfig.prefix | type: c member -->
##### `wchar_t *prefix`

The site-specific directory prefix where the platform independent Python files are installed: `sys.prefix`.

Default: `NULL`.

Part of the Python Path Configuration output.

See also `PyConfig.base_prefix`.

<!-- anchor: c.PyConfig.program_name | type: c member -->
##### `wchar_t *program_name`

Program name used to initialize `executable` and in early error messages during Python initialization.

- On macOS, use `PYTHONEXECUTABLE` environment variable if set.

- If the `WITH_NEXT_FRAMEWORK` macro is defined, use `__PYVENV_LAUNCHER__` environment variable if set.

- Use `argv[0]` of `argv` if available and non-empty.

- Otherwise, use `L"python"` on Windows, or `L"python3"` on other platforms.

Default: `NULL`.

Part of the Python Path Configuration input.

<!-- anchor: c.PyConfig.pycache_prefix | type: c member -->
##### `wchar_t *pycache_prefix`

Directory where cached `.pyc` files are written: `sys.pycache_prefix`.

Set by the `-X pycache_prefix=PATH` command line option and the `PYTHONPYCACHEPREFIX` environment variable. The command-line option takes precedence.

If `NULL`, `sys.pycache_prefix` is set to `None`.

Default: `NULL`.

<!-- anchor: c.PyConfig.quiet | type: c member -->
##### `int quiet`

Quiet mode. If greater than `0`, don’t display the copyright and version at Python startup in interactive mode.

Incremented by the `-q` command line option.

Default: `0`.

<!-- anchor: c.PyConfig.run_command | type: c member -->
##### `wchar_t *run_command`

Value of the `-c` command line option.

Used by `Py_RunMain()`.

Default: `NULL`.

<!-- anchor: c.PyConfig.run_filename | type: c member -->
##### `wchar_t *run_filename`

Filename passed on the command line: trailing command line argument without `-c` or `-m`. It is used by the `Py_RunMain()` function.

For example, it is set to `script.py` by the `python3 script.py arg` command line.

See also the `PyConfig.skip_source_first_line` option.

Default: `NULL`.

<!-- anchor: c.PyConfig.run_module | type: c member -->
##### `wchar_t *run_module`

Value of the `-m` command line option.

Used by `Py_RunMain()`.

Default: `NULL`.

<!-- anchor: c.PyConfig.run_presite | type: c member -->
##### `wchar_t *run_presite`

`module` or `module:func` entry point that should be executed before the `site` module is imported.

Set by the `-X presite=module:func` command-line option and the `PYTHON_PRESITE` environment variable. The command-line option takes precedence.

Needs a debug build of Python (the `Py_DEBUG` macro must be defined).

Default: `NULL`.

<!-- anchor: c.PyConfig.show_ref_count | type: c member -->
##### `int show_ref_count`

Show total reference count at exit (excluding immortal objects)?

Set to `1` by `-X showrefcount` command line option.

Needs a debug build of Python (the `Py_REF_DEBUG` macro must be defined).

Default: `0`.

<!-- anchor: c.PyConfig.site_import | type: c member -->
##### `int site_import`

Import the `site` module at startup?

If equal to zero, disable the import of the module site and the site-dependent manipulations of `sys.path` that it entails.

Also disable these manipulations if the `site` module is explicitly imported later (call `site.main()` if you want them to be triggered).

Set to `0` by the `-S` command line option.

`sys.flags.no_site` is set to the inverted value of `site_import`.

Default: `1`.

<!-- anchor: c.PyConfig.skip_source_first_line | type: c member -->
##### `int skip_source_first_line`

If non-zero, skip the first line of the `PyConfig.run_filename` source.

It allows the usage of non-Unix forms of `#!cmd`. This is intended for a DOS specific hack only.

Set to `1` by the `-x` command line option.

Default: `0`.

<!-- anchor: c.PyConfig.stdio_encoding | type: c member -->
##### `wchar_t *stdio_encoding`

<!-- anchor: c.PyConfig.stdio_errors | type: c member -->
##### `wchar_t *stdio_errors`

Encoding and encoding errors of `sys.stdin`, `sys.stdout` and `sys.stderr` (but `sys.stderr` always uses `"backslashreplace"` error handler).

Use the `PYTHONIOENCODING` environment variable if it is non-empty.

Default encoding:

- `"UTF-8"` if `PyPreConfig.utf8_mode` is non-zero.

- Otherwise, use the locale encoding.

Default error handler:

- On Windows: use `"surrogateescape"`.

- `"surrogateescape"` if `PyPreConfig.utf8_mode` is non-zero, or if the LC_CTYPE locale is “C” or “POSIX”.

- `"strict"` otherwise.

See also `PyConfig.legacy_windows_stdio`.

<!-- anchor: c.PyConfig.tracemalloc | type: c member -->
##### `int tracemalloc`

Enable tracemalloc?

If non-zero, call `tracemalloc.start()` at startup.

Set by `-X tracemalloc=N` command line option and by the `PYTHONTRACEMALLOC` environment variable.

Default: `-1` in Python mode, `0` in isolated mode.

<!-- anchor: c.PyConfig.perf_profiling | type: c member -->
##### `int perf_profiling`

Enable the Linux `perf` profiler support?

If equals to `1`, enable support for the Linux `perf` profiler.

If equals to `2`, enable support for the Linux `perf` profiler with DWARF JIT support.

Set to `1` by `-X perf` command-line option and the `PYTHONPERFSUPPORT` environment variable.

Set to `2` by the `-X perf_jit` command-line option and the `PYTHON_PERF_JIT_SUPPORT` environment variable.

Default: `-1`.

**See also:**

See Python support for the perf map compatible profilers for more information.

Added in version 3.12.

<!-- anchor: c.PyConfig.stdlib_dir | type: c member -->
##### `wchar_t *stdlib_dir`

Directory of the Python standard library.

Default: `NULL`.

Added in version 3.11.

<!-- anchor: c.PyConfig.use_environment | type: c member -->
##### `int use_environment`

Use environment variables?

If equals to zero, ignore the environment variables.

Set to `0` by the `-E` environment variable.

Default: `1` in Python config and `0` in isolated config.

<!-- anchor: c.PyConfig.use_system_logger | type: c member -->
##### `int use_system_logger`

If non-zero, `stdout` and `stderr` will be redirected to the system log.

Only available on macOS 10.12 and later, and on iOS.

Default: `0` (don’t use the system log) on macOS; `1` on iOS (use the system log).

Added in version 3.14.

<!-- anchor: c.PyConfig.user_site_directory | type: c member -->
##### `int user_site_directory`

If non-zero, add the user site directory to `sys.path`.

Set to `0` by the `-s` and `-I` command line options.

Set to `0` by the `PYTHONNOUSERSITE` environment variable.

Default: `1` in Python mode, `0` in isolated mode.

<!-- anchor: c.PyConfig.verbose | type: c member -->
##### `int verbose`

Verbose mode. If greater than `0`, print a message each time a module is imported, showing the place (filename or built-in module) from which it is loaded.

If greater than or equal to `2`, print a message for each file that is checked for when searching for a module. Also provides information on module cleanup at exit.

Incremented by the `-v` command line option.

Set by the `PYTHONVERBOSE` environment variable value.

Default: `0`.

<!-- anchor: c.PyConfig.warnoptions | type: c member -->
##### `PyWideStringList warnoptions`

Options of the `warnings` module to build warnings filters, lowest to highest priority: `sys.warnoptions`.

The `warnings` module adds `sys.warnoptions` in the reverse order: the last `PyConfig.warnoptions` item becomes the first item of `warnings.filters` which is checked first (highest priority).

The `-W` command line options adds its value to `warnoptions`, it can be used multiple times.

The `PYTHONWARNINGS` environment variable can also be used to add warning options. Multiple options can be specified, separated by commas (`,`).

Default: empty list.

<!-- anchor: c.PyConfig.write_bytecode | type: c member -->
##### `int write_bytecode`

If equal to `0`, Python won’t try to write `.pyc` files on the import of source modules.

Set to `0` by the `-B` command line option and the `PYTHONDONTWRITEBYTECODE` environment variable.

`sys.dont_write_bytecode` is initialized to the inverted value of `write_bytecode`.

Default: `1`.

<!-- anchor: c.PyConfig.xoptions | type: c member -->
##### `PyWideStringList xoptions`

Values of the `-X` command line options: `sys._xoptions`.

Default: empty list.

<!-- anchor: c.PyConfig._pystats | type: c member -->
##### `int _pystats`

If non-zero, write performance statistics at Python exit.

Need a special build with the `Py_STATS` macro: see `--enable-pystats`.

Default: `0`.

If `parse_argv` is non-zero, `argv` arguments are parsed the same way the regular Python parses command line arguments, and Python arguments are stripped from `argv`.

The `xoptions` options are parsed to set other options: see the `-X` command line option.

Changed in version 3.9: The `show_alloc_count` field has been removed.

<!-- anchor: initialization-with-pyconfig | type: section -->
### Initialization with PyConfig

Initializing the interpreter from a populated configuration struct is handled by calling `Py_InitializeFromConfig()`.

The caller is responsible to handle exceptions (error or exit) using `PyStatus_Exception()` and `Py_ExitStatusException()`.

If `PyImport_FrozenModules()`, `PyImport_AppendInittab()` or `PyImport_ExtendInittab()` are used, they must be set or called after Python preinitialization and before the Python initialization. If Python is initialized multiple times, `PyImport_AppendInittab()` or `PyImport_ExtendInittab()` must be called before each Python initialization.

The current configuration (`PyConfig` type) is stored in `PyInterpreterState.config`.

Example setting the program name:

```c
void init_python(void)
{
    PyStatus status;

    PyConfig config;
    PyConfig_InitPythonConfig(&config);

    /* Set the program name. Implicitly preinitialize Python. */
    status = PyConfig_SetString(&config, &config.program_name,
                                L"/path/to/my_program");
    if (PyStatus_Exception(status)) {
        goto exception;
    }

    status = Py_InitializeFromConfig(&config);
    if (PyStatus_Exception(status)) {
        goto exception;
    }
    PyConfig_Clear(&config);
    return;

exception:
    PyConfig_Clear(&config);
    Py_ExitStatusException(status);
}
```

More complete example modifying the default configuration, read the configuration, and then override some parameters. Note that since 3.11, many parameters are not calculated until initialization, and so values cannot be read from the configuration structure. Any values set before initialize is called will be left unchanged by initialization:

```c
PyStatus init_python(const char *program_name)
{
    PyStatus status;

    PyConfig config;
    PyConfig_InitPythonConfig(&config);

    /* Set the program name before reading the configuration
       (decode byte string from the locale encoding).

       Implicitly preinitialize Python. */
    status = PyConfig_SetBytesString(&config, &config.program_name,
                                     program_name);
    if (PyStatus_Exception(status)) {
        goto done;
    }

    /* Read all configuration at once */
    status = PyConfig_Read(&config);
    if (PyStatus_Exception(status)) {
        goto done;
    }

    /* Specify sys.path explicitly */
    /* If you want to modify the default set of paths, finish
       initialization first and then use PySys_GetAttrString("path") */
    config.module_search_paths_set = 1;
    status = PyWideStringList_Append(&config.module_search_paths,
                                     L"/path/to/stdlib");
    if (PyStatus_Exception(status)) {
        goto done;
    }
    status = PyWideStringList_Append(&config.module_search_paths,
                                     L"/path/to/more/modules");
    if (PyStatus_Exception(status)) {
        goto done;
    }

    /* Override executable computed by PyConfig_Read() */
    status = PyConfig_SetString(&config, &config.executable,
                                L"/path/to/my_executable");
    if (PyStatus_Exception(status)) {
        goto done;
    }

    status = Py_InitializeFromConfig(&config);

done:
    PyConfig_Clear(&config);
    return status;
}
```

<!-- anchor: isolated-configuration | type: section -->
### Isolated Configuration

`PyPreConfig_InitIsolatedConfig()` and `PyConfig_InitIsolatedConfig()` functions create a configuration to isolate Python from the system. For example, to embed Python into an application.

This configuration ignores global configuration variables, environment variables, command line arguments (`PyConfig.argv` is not parsed) and user site directory. The C standard streams (ex: `stdout`) and the LC_CTYPE locale are left unchanged. Signal handlers are not installed.

Configuration files are still used with this configuration to determine paths that are unspecified. Ensure `PyConfig.home` is specified to avoid computing the default path configuration.

<!-- anchor: python-configuration | type: section -->
### Python Configuration

`PyPreConfig_InitPythonConfig()` and `PyConfig_InitPythonConfig()` functions create a configuration to build a customized Python which behaves as the regular Python.

Environments variables and command line arguments are used to configure Python, whereas global configuration variables are ignored.

This function enables C locale coercion (**PEP 538**) and Python UTF-8 Mode (**PEP 540**) depending on the LC_CTYPE locale, `PYTHONUTF8` and `PYTHONCOERCECLOCALE` environment variables.

<!-- anchor: python-path-configuration | type: section -->
### Python Path Configuration

`PyConfig` contains multiple fields for the path configuration:

- Path configuration inputs:

  - `PyConfig.home`

  - `PyConfig.platlibdir`

  - `PyConfig.pathconfig_warnings`

  - `PyConfig.program_name`

  - `PyConfig.pythonpath_env`

  - current working directory: to get absolute paths

  - `PATH` environment variable to get the program full path (from `PyConfig.program_name`)

  - `__PYVENV_LAUNCHER__` environment variable

  - (Windows only) Application paths in the registry under “SoftwarePythonPythonCoreX.YPythonPath” of HKEY_CURRENT_USER and HKEY_LOCAL_MACHINE (where X.Y is the Python version).

- Path configuration output fields:

  - `PyConfig.base_exec_prefix`

  - `PyConfig.base_executable`

  - `PyConfig.base_prefix`

  - `PyConfig.exec_prefix`

  - `PyConfig.executable`

  - `PyConfig.module_search_paths_set`, `PyConfig.module_search_paths`

  - `PyConfig.prefix`

If at least one “output field” is not set, Python calculates the path configuration to fill unset fields. If `module_search_paths_set` is equal to `0`, `module_search_paths` is overridden and `module_search_paths_set` is set to `1`.

It is possible to completely ignore the function calculating the default path configuration by setting explicitly all path configuration output fields listed above. A string is considered as set even if it is non-empty. `module_search_paths` is considered as set if `module_search_paths_set` is set to `1`. In this case, `module_search_paths` will be used without modification.

Set `pathconfig_warnings` to `0` to suppress warnings when calculating the path configuration (Unix only, Windows does not log any warning).

If `base_prefix` or `base_exec_prefix` fields are not set, they inherit their value from `prefix` and `exec_prefix` respectively.

`Py_RunMain()` and `Py_Main()` modify `sys.path`:

- If `run_filename` is set and is a directory which contains a `__main__.py` script, prepend `run_filename` to `sys.path`.

- If `isolated` is zero:

  - If `run_module` is set, prepend the current directory to `sys.path`. Do nothing if the current directory cannot be read.

  - If `run_filename` is set, prepend the directory of the filename to `sys.path`.

  - Otherwise, prepend an empty string to `sys.path`.

If `site_import` is non-zero, `sys.path` can be modified by the `site` module. If `user_site_directory` is non-zero and the user’s site-package directory exists, the `site` module appends the user’s site-package directory to `sys.path`.

The following configuration files are used by the path configuration:

- `pyvenv.cfg`

- `._pth` file (ex: `python._pth`)

- `pybuilddir.txt` (Unix only)

If a `._pth` file is present:

- Set `isolated` to `1`.

- Set `use_environment` to `0`.

- Set `site_import` to `0`.

- Set `user_site_directory` to `0` (since 3.15).

- Set `safe_path` to `1`.

If `home` is not set and a `pyvenv.cfg` file is present in the same directory as `executable`, or its parent, `prefix` and `exec_prefix` are set that location. When this happens, `base_prefix` and `base_exec_prefix` still keep their value, pointing to the base installation. See Virtual Environments for more information.

The `__PYVENV_LAUNCHER__` environment variable is used to set `PyConfig.base_executable`.

Changed in version 3.14: `prefix`, and `exec_prefix`, are now set to the `pyvenv.cfg` directory. This was previously done by `site`, therefore affected by `-S`.

Changed in version 3.15: `user_site_directory` is now set to `0` when a `._pth` file is present.

<!-- anchor: py-getargcargv | type: section -->
## Py_GetArgcArgv()

<!-- anchor: c.Py_GetArgcArgv | type: c function -->
### `void Py_GetArgcArgv(int *argc, wchar_t ***argv)`

Get the original command line arguments, before Python modified them.

See also `PyConfig.orig_argv` member.

<!-- anchor: multi-phase-initialization-private-provisional-api | type: section -->
## Multi-Phase Initialization Private Provisional API

This section is a private provisional API introducing multi-phase initialization, the core feature of **PEP 432**:

- “Core” initialization phase, “bare minimum Python”:

  - Builtin types;

  - Builtin exceptions;

  - Builtin and frozen modules;

  - The `sys` module is only partially initialized (ex: `sys.path` doesn’t exist yet).

- “Main” initialization phase, Python is fully initialized:

  - Install and configure `importlib`;

  - Apply the Path Configuration;

  - Install signal handlers;

  - Finish `sys` module initialization (ex: create `sys.stdout` and `sys.path`);

  - Enable optional features like `faulthandler` and `tracemalloc`;

  - Import the `site` module;

  - etc.

Private provisional API:

<!-- anchor: c.PyConfig._init_main | type: c member -->
### `int PyConfig._init_main`

If set to `0`, `Py_InitializeFromConfig()` stops at the “Core” initialization phase.

<!-- anchor: c._Py_InitializeMain | type: c function -->
### `PyStatus _Py_InitializeMain(void)`

Move to the “Main” initialization phase, finish the Python initialization.

No module is imported during the “Core” phase and the `importlib` module is not configured: the Path Configuration is only applied during the “Main” phase. It may allow to customize Python in Python to override or tune the Path Configuration, maybe install a custom `sys.meta_path` importer or an import hook, etc.

It may become possible to calculate the Path Configuration in Python, after the Core phase and before the Main phase, which is one of the **PEP 432** motivation.

The “Core” phase is not properly defined: what should be and what should not be available at this phase is not specified yet. The API is marked as private and provisional: the API can be modified or even be removed anytime until a proper public API is designed.

Example running Python code between “Core” and “Main” initialization phases:

```c
void init_python(void)
{
    PyStatus status;

    PyConfig config;
    PyConfig_InitPythonConfig(&config);
    config._init_main = 0;

    /* ... customize 'config' configuration ... */

    status = Py_InitializeFromConfig(&config);
    PyConfig_Clear(&config);
    if (PyStatus_Exception(status)) {
        Py_ExitStatusException(status);
    }

    /* Use sys.stderr because sys.stdout is only created
       by _Py_InitializeMain() */
    int res = PyRun_SimpleString(
        "import sys; "
        "print('Run Python code before _Py_InitializeMain', "
               "file=sys.stderr)");
    if (res < 0) {
        exit(1);
    }

    /* ... put more configuration code here ... */

    status = _Py_InitializeMain();
    if (PyStatus_Exception(status)) {
        Py_ExitStatusException(status);
    }
}
```
