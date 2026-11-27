# 1. Command line and environment

The CPython interpreter scans the command line and the environment for various
settings.

**CPython implementation detail:** Other implementations’ command line schemes may differ. See
Alternate Implementations for further resources.

## 1.1. Command line

When invoking Python, you may specify any of these options:

```
python [-bBdEhiIOPqRsSuvVWx?] [-c command | -m module-name | script | - ] [args]
```

The most common use case is, of course, a simple invocation of a script:

```
python myscript.py
```

### 1.1.1. Interface options

The interpreter interface resembles that of the UNIX shell, but provides some
additional methods of invocation:

- When called with standard input connected to a tty device, it prompts for
  commands and executes them until an EOF (an end-of-file character, you can
  produce that with `Ctrl`-`D` on UNIX or `Ctrl`-`Z,` `Enter` on Windows) is read.
  For more on interactive mode, see Interactive Mode.
- When called with a file name argument or with a file as standard input, it
  reads and executes a script from that file.
- When called with a directory name argument, it reads and executes an
  appropriately named script from that directory.
- When called with `-c command`, it executes the Python statement(s) given as
  *command*. Here *command* may contain multiple statements separated by
  newlines.
- When called with `-m module-name`, the given module is located using the standard
  import mechanism and executed as a script.

In non-interactive mode, the entire input is parsed before it is executed.

An interface option terminates the list of options consumed by the interpreter,
all consecutive arguments will end up in `sys.argv` – note that the first
element, subscript zero (`sys.argv[0]`), is a string reflecting the program’s
source.

-c <command>
:   Execute the Python code in *command*. *command* can be one or more
    statements separated by newlines, with significant leading whitespace as in
    normal module code.

    If this option is given, the first element of `sys.argv` will be
    `"-c"` and the current directory will be added to the start of
    `sys.path` (allowing modules in that directory to be imported as top
    level modules).

    Raises an auditing event `cpython.run_command` with argument `command`.

-m <module-name>
:   Locate the module using the standard import mechanism and execute its contents
    as the `__main__` module.

    Since the argument is a *module* name, you must not give a file extension
    (`.py`). The module name should be a valid absolute Python module name, but
    the implementation may not always enforce this (e.g. it may allow you to
    use a name that includes a hyphen).

    Package names (including namespace packages) are also permitted. When a
    package name is supplied instead
    of a normal module, the interpreter will execute `<pkg>.__main__` as
    the main module. This behaviour is deliberately similar to the handling
    of directories and zipfiles that are passed to the interpreter as the
    script argument.

    Note

    This option cannot be used with built-in modules and extension modules
    written in C, since they do not have Python module files. However, it
    can still be used for precompiled modules, even if the original source
    file is not available.

    If this option is given, the first element of `sys.argv` will be the
    full path to the module file (while the module file is being located, the
    first element will be set to `"-m"`). As with the `-c` option,
    the current directory will be added to the start of `sys.path`.

    `-I` option can be used to run the script in isolated mode where
    `sys.path` contains neither the current directory nor the user’s
    site-packages directory. All `PYTHON*` environment variables are
    ignored, too.

    Many standard library modules contain code that is invoked on their execution
    as a script. An example is the `timeit` module:

    ```
    python -m timeit -s "setup here" "benchmarked code here"
    python -m timeit -h # for details
    ```

    Raises an auditing event `cpython.run_module` with argument `module-name`.

    See also

    `runpy.run_module()`
    :   Equivalent functionality directly available to Python code

    **PEP 338** – Executing modules as scripts

-
:   Read commands from standard input (`sys.stdin`). If standard input is
    a terminal, `-i` is implied.

    If this option is given, the first element of `sys.argv` will be
    `"-"` and the current directory will be added to the start of
    `sys.path`.

    Raises an auditing event `cpython.run_stdin` with no arguments.

<script>
:   Execute the Python code contained in *script*, which must be a filesystem
    path (absolute or relative) referring to either a Python file, a directory
    containing a `__main__.py` file, or a zipfile containing a
    `__main__.py` file.

    If this option is given, the first element of `sys.argv` will be the
    script name as given on the command line.

    If the script name refers directly to a Python file, the directory
    containing that file is added to the start of `sys.path`, and the
    file is executed as the `__main__` module.

    If the script name refers to a directory or zipfile, the script name is
    added to the start of `sys.path` and the `__main__.py` file in
    that location is executed as the `__main__` module.

    `-I` option can be used to run the script in isolated mode where
    `sys.path` contains neither the script’s directory nor the user’s
    site-packages directory. All `PYTHON*` environment variables are
    ignored, too.

    Raises an auditing event `cpython.run_file` with argument `filename`.

    See also

    `runpy.run_path()`
    :   Equivalent functionality directly available to Python code

If no interface option is given, `-i` is implied, `sys.argv[0]` is
an empty string (`""`) and the current directory will be added to the
start of `sys.path`. Also, tab-completion and history editing is
automatically enabled, if available on your platform (see
Readline configuration).

See also

Invoking the Interpreter

### 1.1.2. Generic options

-?

-h

--help
:   Print a short description of all command line options and corresponding
    environment variables and exit.

--help-env
:   Print a short description of Python-specific environment variables
    and exit.

--help-xoptions
:   Print a description of implementation-specific `-X` options
    and exit.

--help-all
:   Print complete usage information and exit.

-V

--version
:   Print the Python version number and exit. Example output could be:

    ```
    Python 3.8.0b2+
    ```

    When given twice, print more information about the build, like:

    ```
    Python 3.8.0b2+ (3.8:0c076caaa8, Apr 20 2019, 21:55:00)
    [GCC 6.2.0 20161005]
    ```

### 1.1.3. Miscellaneous options

-b
:   Issue a warning when converting `bytes` or `bytearray` to
    `str` without specifying encoding or comparing `bytes` or
    `bytearray` with `str` or `bytes` with `int`.
    Issue an error when the option is given twice (`-bb`).

    Deprecated since version 3.15: Deprecate `-b` and `-bb` command line options
    and schedule them to become no-op in Python 3.17.
    These were primarily helpers for the Python 2 -> 3 transition.
    Starting with Python 3.17, no `BytesWarning` will be raised
    for these cases; use a type checker instead.

-B
:   If given, Python won’t try to write `.pyc` files on the
    import of source modules. See also `PYTHONDONTWRITEBYTECODE`.

--check-hash-based-pycs default|always|never
:   Control the validation behavior of hash-based `.pyc` files. See
    Cached bytecode invalidation. When set to `default`, checked and unchecked
    hash-based bytecode cache files are validated according to their default
    semantics. When set to `always`, all hash-based `.pyc` files, whether
    checked or unchecked, are validated against their corresponding source
    file. When set to `never`, hash-based `.pyc` files are not validated
    against their corresponding source files.

    The semantics of timestamp-based `.pyc` files are unaffected by this
    option.

-d
:   Turn on parser debugging output (for expert only).
    See also the `PYTHONDEBUG` environment variable.

    This option requires a debug build of Python, otherwise
    it’s ignored.

-E
:   Ignore all `PYTHON*` environment variables, e.g.
    `PYTHONPATH` and `PYTHONHOME`, that might be set.

    See also the `-P` and `-I` (isolated) options.

-i
:   Enter interactive mode after execution.

    Using the `-i` option will enter interactive mode in any of the following circumstances:

    - When a script is passed as first argument
    - When the `-c` option is used
    - When the `-m` option is used

    Interactive mode will start even when `sys.stdin` does not appear to be a terminal. The
    `PYTHONSTARTUP` file is not read.

    This can be useful to inspect global variables or a stack trace when a script
    raises an exception. See also `PYTHONINSPECT`.

-I
:   Run Python in isolated mode. This also implies `-E`, `-P`
    and `-s` options.

    In isolated mode, Python does not prepend the potentially unsafe path
    `sys._path0` to `sys.path`, and ignores all `PYTHON*`
    environment variables, e.g. `PYTHONPATH` and `PYTHONHOME`,
    that might be set.
    Further restrictions may be imposed to prevent the user from injecting
    malicious code.

-O
:   Remove assert statements and any code conditional on the value of
    `__debug__`. Augment the filename for compiled
    (bytecode) files by adding `.opt-1` before the `.pyc`
    extension (see **PEP 488**). See also `PYTHONOPTIMIZE`.

-OO
:   Do `-O` and also discard docstrings. Augment the filename
    for compiled (bytecode) files by adding `.opt-2` before the
    `.pyc` extension (see **PEP 488**).

-P
:   Don’t prepend the potentially unsafe path `sys._path0` to
    `sys.path`.

    See also the `PYTHONSAFEPATH` environment variable, and `-E`
    and `-I` (isolated) options.

-q
:   Don’t display the copyright and version messages even in interactive mode.

-R
:   Turn on hash randomization. This option only has an effect if the
    `PYTHONHASHSEED` environment variable is set to anything other
    than `random`, since hash randomization is enabled by default.

    On previous versions of Python, this option turns on hash randomization,
    so that the `__hash__()` values of str and bytes objects
    are “salted” with an unpredictable random value. Although they remain
    constant within an individual Python process, they are not predictable
    between repeated invocations of Python.

    Hash randomization is intended to provide protection against a
    denial-of-service caused by carefully chosen inputs that exploit the worst
    case performance of a dict construction, *O*(*n*2) complexity. See
    <https://ocert.org/advisories/ocert-2011-003.html> for details.

    `PYTHONHASHSEED` allows you to set a fixed value for the hash
    seed secret.

    Changed in version 3.7: The option is no longer ignored.

-s
:   Don’t add the `user site-packages directory` to
    `sys.path`.

    See also `PYTHONNOUSERSITE`.

    See also

    **PEP 370** – Per user site-packages directory

-S
:   Disable the import of the module `site` and the site-dependent
    manipulations of `sys.path` that it entails. Also disable these
    manipulations if `site` is explicitly imported later (call
    `site.main()` if you want them to be triggered).

-u
:   Force the stdout and stderr streams to be unbuffered. This option has no
    effect on the stdin stream.

    See also `PYTHONUNBUFFERED`.

-v
:   Print a message each time a module is initialized, showing the place
    (filename or built-in module) from which it is loaded. When given twice
    (`-vv`), print a message for each file that is checked for when
    searching for a module. Also provides information on module cleanup at exit.

    See also `PYTHONVERBOSE`.

-W arg
:   Warning control. Python’s warning machinery by default prints warning
    messages to `sys.stderr`.

    The simplest settings apply a particular action unconditionally to all
    warnings emitted by a process (even those that are otherwise ignored by
    default):

    ```
    -Wdefault  # Warn once per call location
    -Werror    # Convert to exceptions
    -Walways   # Warn every time
    -Wall      # Same as -Walways
    -Wmodule   # Warn once per calling module
    -Wonce     # Warn once per Python process
    -Wignore   # Never warn
    ```

    The action names can be abbreviated as desired and the interpreter will
    resolve them to the appropriate action name. For example, `-Wi` is the
    same as `-Wignore`.

    The full form of argument is:

    ```
    action:message:category:module:lineno
    ```

    Empty fields match all values; trailing empty fields may be omitted. For
    example `-W ignore::DeprecationWarning` ignores all DeprecationWarning
    warnings.

    The *action* field is as explained above but only applies to warnings that
    match the remaining fields.

    The *message* field must match the start of the warning message;
    this match is case-insensitive.
    If it starts and ends with a forward slash (`/`), it specifies
    a regular expression, otherwise it specifies a literal string.

    The *category* field matches the warning category
    (ex: `DeprecationWarning`). This must be a class name; the match test
    whether the actual warning category of the message is a subclass of the
    specified warning category.

    The *module* field matches the (fully qualified) module name; this match is
    case-sensitive.
    If it starts and ends with a forward slash (`/`), it specifies
    a regular expression that the start of the fully qualified module name
    must match, otherwise it specifies a literal string that the fully
    qualified module name must be equal to.

    The *lineno* field matches the line number, where zero matches all line
    numbers and is thus equivalent to an omitted line number.

    Multiple `-W` options can be given; when a warning matches more than
    one option, the action for the last matching option is performed. Invalid
    `-W` options are ignored (though, a warning message is printed about
    invalid options when the first warning is issued).

    Warnings can also be controlled using the `PYTHONWARNINGS`
    environment variable and from within a Python program using the
    `warnings` module. For example, the `warnings.filterwarnings()`
    function can be used to use a regular expression on the warning message.

    See The Warnings Filter and Describing Warning Filters for more
    details.

    Changed in version 3.15: Added regular expression support for *message* and *module*.

-x
:   Skip the first line of the source, allowing use of non-Unix forms of
    `#!cmd`.

    This can be used to turn a Python script into a Windows batch file.
    Similarly to adding a shebang line and setting the executable bit on Unix,
    the extension of the Python script can be changed to `.bat` and the
    following line can be added at the start of the script:

    ```
    @py -x "%~f0" %* & exit /b
    ```

    Or, to specify the path to the Python interpreter explicitly:

    ```
    @"C:\Path\to\python.exe" -x "%~f0" %* & exit /b
    ```

    Unlike a shebang line which is a Python comment, this line is not valid
    Python syntax, and the `-x` option is needed to skip it.

-X
:   Reserved for various implementation-specific options. CPython currently
    defines the following possible values:

    - `-X faulthandler` to enable `faulthandler`.
      See also `PYTHONFAULTHANDLER`.

      `-X importtime=2` enables additional output that indicates when an
      imported module has already been loaded. In such cases, the string
      `cached` will be printed in both time columns.

      See also `PYTHONPROFILEIMPORTTIME`.

      This option is only available on some platforms and will do nothing
      if is not supported on the current system. See also
      `PYTHON_DISABLE_REMOTE_DEBUG` and **PEP 768**.

      Changed in version 3.15: Accept also `module:func` entry point format.

      Added in version 3.15.
    - `-X tlbc=0,1` enables (1, the default) or disables (0) thread-local
      bytecode in builds configured with `--disable-gil`. When disabled,
      this also disables the specializing interpreter. See also
      `PYTHON_TLBC`.

      Added in version 3.15.

    It also allows passing arbitrary values and retrieving them through the
    `sys._xoptions` dictionary.

    Changed in version 3.9: Removed the `-X showalloccount` option.

    Changed in version 3.10: Removed the `-X oldparser` option.

Removed in version 3.14: `-J` is no longer reserved for use by Jython,
and now has no special meaning.

### 1.1.4. Controlling color

The Python interpreter is configured by default to use colors to highlight
output in certain situations such as when displaying tracebacks. This
behavior can be controlled by setting different environment variables.

Setting the environment variable `TERM` to `dumb` will disable color.

If the `FORCE_COLOR` environment variable is set, then color will be
enabled regardless of the value of TERM. This is useful on CI systems which
aren’t terminals but can still display ANSI escape sequences.

If the `NO_COLOR` environment variable is set, Python will disable all color
in the output. This takes precedence over `FORCE_COLOR`.

All these environment variables are used also by other tools to control color
output. To control the color output only in the Python interpreter, the
`PYTHON_COLORS` environment variable can be used. This variable takes
precedence over `NO_COLOR`, which in turn takes precedence over
`FORCE_COLOR`.

## 1.2. Environment variables

These environment variables influence Python’s behavior, they are processed
before the command-line switches other than -E or -I. It is customary that
command-line switches override environmental variables where there is a
conflict.

PYTHONHOME
:   Change the location of the standard Python libraries. By default, the
    libraries are searched in `prefix/lib/pythonversion` and
    `exec_prefix/lib/pythonversion`, where `prefix` and
    `exec_prefix` are installation-dependent directories, both defaulting
    to `/usr/local`.

    When `PYTHONHOME` is set to a single directory, its value replaces
    both `prefix` and `exec_prefix`. To specify different values
    for these, set `PYTHONHOME` to `prefix:exec_prefix`.

PYTHONPATH
:   Augment the default search path for module files. The format is the same as
    the shell’s `PATH`: one or more directory pathnames separated by
    `os.pathsep` (e.g. colons on Unix or semicolons on Windows).
    Non-existent directories are silently ignored.

    In addition to normal directories, individual `PYTHONPATH` entries
    may refer to zipfiles containing pure Python modules (in either source or
    compiled form). Extension modules cannot be imported from zipfiles.

    The default search path is installation dependent, but generally begins with
    `prefix/lib/pythonversion` (see `PYTHONHOME` above). It
    is *always* appended to `PYTHONPATH`.

    An additional directory will be inserted in the search path in front of
    `PYTHONPATH` as described above under
    Interface options. The search path can be manipulated from
    within a Python program as the variable `sys.path`.

PYTHONSAFEPATH
:   If this is set to a non-empty string, don’t prepend a potentially unsafe
    path `sys._path0` to `sys.path`.

    See also the `-P` option.

PYTHONPLATLIBDIR
:   If this is set to a non-empty string, it overrides the `sys.platlibdir`
    value.

PYTHONSTARTUP
:   If this is the name of a readable file, the Python commands in that file are
    executed before the first prompt is displayed in interactive mode. The file
    is executed in the same namespace where interactive commands are executed so
    that objects defined or imported in it can be used without qualification in
    the interactive session. You can also change the prompts `sys.ps1` and
    `sys.ps2` and the hook `sys.__interactivehook__` in this file.

    Raises an auditing event `cpython.run_startup` with
    the filename as the argument when called on startup.

PYTHONOPTIMIZE
:   If this is set to a non-empty string it is equivalent to specifying the
    `-O` option. If set to an integer, it is equivalent to specifying
    `-O` multiple times.

PYTHONBREAKPOINT
:   If this is set, it names a callable using dotted-path notation. The module
    containing the callable will be imported and then the callable will be run
    by the default implementation of `sys.breakpointhook()` which itself is
    called by built-in `breakpoint()`. If not set, or set to the empty
    string, it is equivalent to the value “pdb.set\_trace”. Setting this to the
    string “0” causes the default implementation of `sys.breakpointhook()`
    to do nothing but return immediately.

PYTHONDEBUG
:   If this is set to a non-empty string it is equivalent to specifying the
    `-d` option. If set to an integer, it is equivalent to specifying
    `-d` multiple times.

    This environment variable requires a debug build of Python, otherwise it’s ignored.

PYTHONINSPECT
:   If this is set to a non-empty string it is equivalent to specifying the
    `-i` option.

    This variable can also be modified by Python code using `os.environ`
    to force inspect mode on program termination.

    Raises an auditing event `cpython.run_stdin` with no arguments.

PYTHONUNBUFFERED
:   If this is set to a non-empty string it is equivalent to specifying the
    `-u` option.

PYTHONVERBOSE
:   If this is set to a non-empty string it is equivalent to specifying the
    `-v` option. If set to an integer, it is equivalent to specifying
    `-v` multiple times.

PYTHONCASEOK
:   If this is set, Python ignores case in `import` statements. This
    only works on Windows and macOS.

PYTHONDONTWRITEBYTECODE
:   If this is set to a non-empty string, Python won’t try to write `.pyc`
    files on the import of source modules. This is equivalent to
    specifying the `-B` option.

PYTHONPYCACHEPREFIX
:   If this is set, Python will write `.pyc` files in a mirror directory tree
    at this path, instead of in `__pycache__` directories within the source
    tree. This is equivalent to specifying the `-X`
    `pycache_prefix=PATH` option.

PYTHONHASHSEED
:   If this variable is not set or set to `random`, a random value is used
    to seed the hashes of str and bytes objects.

    If `PYTHONHASHSEED` is set to an integer value, it is used as a fixed
    seed for generating the hash() of the types covered by the hash
    randomization.

    Its purpose is to allow repeatable hashing, such as for selftests for the
    interpreter itself, or to allow a cluster of python processes to share hash
    values.

    The integer must be a decimal number in the range [0,4294967295]. Specifying
    the value 0 will disable hash randomization.

PYTHONINTMAXSTRDIGITS
:   If this variable is set to an integer, it is used to configure the
    interpreter’s global integer string conversion length limitation.

PYTHONIOENCODING
:   If this is set before running the interpreter, it overrides the encoding used
    for stdin/stdout/stderr, in the syntax `encodingname:errorhandler`. Both
    the `encodingname` and the `:errorhandler` parts are optional and have
    the same meaning as in `str.encode()`.

    For stderr, the `:errorhandler` part is ignored; the handler will always be
    `'backslashreplace'`.

PYTHONNOUSERSITE
:   This is equivalent to the `-s` option. If this is set, Python won’t
    add the `user site-packages directory` to
    `sys.path`.

    See also

    **PEP 370** – Per user site-packages directory

PYTHONUSERBASE
:   Defines the `user base directory`, which is used to
    compute the path of the `user site-packages directory`
    and installation paths for
    `python -m pip install --user`.

    To disable the user site-packages, see `PYTHONNOUSERSITE` or the `-s`
    option.

    See also

    **PEP 370** – Per user site-packages directory

PYTHONEXECUTABLE
:   If this environment variable is set, `sys.argv[0]` will be set to its
    value instead of the value got through the C runtime. Only works on
    macOS.

PYTHONWARNINGS
:   This is equivalent to the `-W` option. If set to a comma
    separated string, it is equivalent to specifying `-W` multiple
    times, with filters later in the list taking precedence over those earlier
    in the list.

    The simplest settings apply a particular action unconditionally to all
    warnings emitted by a process (even those that are otherwise ignored by
    default):

    ```
    PYTHONWARNINGS=default  # Warn once per call location
    PYTHONWARNINGS=error    # Convert to exceptions
    PYTHONWARNINGS=always   # Warn every time
    PYTHONWARNINGS=all      # Same as PYTHONWARNINGS=always
    PYTHONWARNINGS=module   # Warn once per calling module
    PYTHONWARNINGS=once     # Warn once per Python process
    PYTHONWARNINGS=ignore   # Never warn
    ```

    See The Warnings Filter and Describing Warning Filters for more
    details.

    Changed in version 3.15: Added regular expression support for *message* and *module*.

PYTHONFAULTHANDLER
:   If this environment variable is set to a non-empty string,
    `faulthandler.enable()` is called at startup: install a handler for
    `SIGSEGV`, `SIGFPE`,
    `SIGABRT`, `SIGBUS` and
    `SIGILL` signals to dump the Python traceback.
    This is equivalent to `-X` `faulthandler` option.

PYTHONTRACEMALLOC
:   If this environment variable is set to a non-empty string, start tracing
    Python memory allocations using the `tracemalloc` module. The value of
    the variable is the maximum number of frames stored in a traceback of a
    trace. For example, `PYTHONTRACEMALLOC=1` stores only the most recent
    frame.
    See the `tracemalloc.start()` function for more information.
    This is equivalent to setting the `-X` `tracemalloc` option.

PYTHONPROFILEIMPORTTIME
:   If this environment variable is set to `1`, Python will show
    how long each import takes. If set to `2`, Python will include output for
    imported modules that have already been loaded.
    This is equivalent to setting the `-X` `importtime` option.

PYTHONASYNCIODEBUG
:   If this environment variable is set to a non-empty string, enable the
    debug mode of the `asyncio` module.

PYTHONMALLOC
:   Set the Python memory allocators and/or install debug hooks.

    Set the family of memory allocators used by Python:

    - `default`: use the default memory allocators.
    - `malloc`: use the `malloc()` function of the C library
      for all domains (`PYMEM_DOMAIN_RAW`, `PYMEM_DOMAIN_MEM`,
      `PYMEM_DOMAIN_OBJ`).
    - `pymalloc`: use the pymalloc allocator for
      `PYMEM_DOMAIN_MEM` and `PYMEM_DOMAIN_OBJ` domains and use
      the `malloc()` function for the `PYMEM_DOMAIN_RAW` domain.
    - `mimalloc`: use the mimalloc allocator for
      `PYMEM_DOMAIN_MEM` and `PYMEM_DOMAIN_OBJ` domains and use
      the `malloc()` function for the `PYMEM_DOMAIN_RAW` domain.

    Install debug hooks:

    - `debug`: install debug hooks on top of the [default memory
      allocators](../c-api/memory.md#default-memory-allocators).
    - `malloc_debug`: same as `malloc` but also install debug hooks.
    - `pymalloc_debug`: same as `pymalloc` but also install debug hooks.
    - `mimalloc_debug`: same as `mimalloc` but also install debug hooks.

    Note

    In the free-threaded build, the `malloc`,
    `malloc_debug`, `pymalloc`, and `pymalloc_debug` values are not
    supported. Only `default`, `debug`, `mimalloc`, and
    `mimalloc_debug` are accepted.

PYTHONMALLOCSTATS
:   If set to a non-empty string, Python will print statistics of the
    pymalloc memory allocator or the
    mimalloc memory allocator (whichever is in use)
    every time a new object arena is created, and on shutdown.

    This variable is ignored if the `PYTHONMALLOC` environment variable
    is used to force the `malloc()` allocator of the C library, or if
    Python is configured without both `pymalloc` and `mimalloc` support.

PYTHON\_PYMALLOC\_HUGEPAGES
:   If set to a non-zero integer, enable huge page support for
    pymalloc arenas. Set to `0` or unset to disable.
    Python must be compiled with `--with-pymalloc-hugepages` for this
    variable to have any effect.

    When enabled, arena allocation uses `MAP_HUGETLB` (Linux) or
    `MEM_LARGE_PAGES` (Windows) with automatic fallback to regular pages if
    huge pages are not available.

    Warning

    On Linux, if the huge-page pool is exhausted, page faults — including
    copy-on-write faults triggered by `os.fork()` — deliver `SIGBUS`
    and kill the process. Only enable this in environments where the
    huge-page pool is properly sized and fork-safety is not a concern.

    On Windows you need a special privilege. See the
    Windows documentation for large pages
    for details. Python will fail on startup if the required privilege
    SeLockMemoryPrivilege
    is not held by the user.

    Added in version 3.15.

PYTHONLEGACYWINDOWSFSENCODING
:   If set to a non-empty string, the default [filesystem encoding and
    error handler](../glossary.md#term-filesystem-encoding-and-error-handler) mode will revert to their pre-3.6 values of ‘mbcs’ and
    ‘replace’, respectively. Otherwise, the new defaults ‘utf-8’ and
    ‘surrogatepass’ are used.

    This may also be enabled at runtime with
    `sys._enablelegacywindowsfsencoding()`.

    Availability: Windows.

PYTHONLEGACYWINDOWSSTDIO
:   If set to a non-empty string, does not use the new console reader and
    writer. This means that Unicode characters will be encoded according to
    the active console code page, rather than using utf-8.

    This variable is ignored if the standard streams are redirected (to files
    or pipes) rather than referring to console buffers.

    Availability: Windows.

PYTHONCOERCECLOCALE
:   If set to the value `0`, causes the main Python command line application
    to skip coercing the legacy ASCII-based C and POSIX locales to a more
    capable UTF-8 based alternative.

    If this variable is *not* set (or is set to a value other than `0`), the
    `LC_ALL` locale override environment variable is also not set, and the
    current locale reported for the `LC_CTYPE` category is either the default
    `C` locale, or else the explicitly ASCII-based `POSIX` locale, then the
    Python CLI will attempt to configure the following locales for the
    `LC_CTYPE` category in the order listed before loading the interpreter
    runtime:

    - `C.UTF-8`
    - `C.utf8`
    - `UTF-8`

    If setting one of these locale categories succeeds, then the `LC_CTYPE`
    environment variable will also be set accordingly in the current process
    environment before the Python runtime is initialized. This ensures that in
    addition to being seen by both the interpreter itself and other locale-aware
    components running in the same process (such as the GNU `readline`
    library), the updated setting is also seen in subprocesses (regardless of
    whether or not those processes are running a Python interpreter), as well as
    in operations that query the environment rather than the current C locale
    (such as Python’s own `locale.getdefaultlocale()`).

    Configuring one of these locales (either explicitly or via the above
    implicit locale coercion) automatically enables the `surrogateescape`
    error handler for `sys.stdin` and
    `sys.stdout` (`sys.stderr` continues to use `backslashreplace`
    as it does in any other locale). This stream handling behavior can be
    overridden using `PYTHONIOENCODING` as usual.

    For debugging purposes, setting `PYTHONCOERCECLOCALE=warn` will cause
    Python to emit warning messages on `stderr` if either the locale coercion
    activates, or else if a locale that *would* have triggered coercion is
    still active when the Python runtime is initialized.

    Also note that even when locale coercion is disabled, or when it fails to
    find a suitable target locale, `PYTHONUTF8` will still activate by
    default in legacy ASCII-based locales. Both features must be disabled in
    order to force the interpreter to use `ASCII` instead of `UTF-8` for
    system interfaces.

    Availability: Unix.

PYTHONDEVMODE
:   If this environment variable is set to a non-empty string, enable
    Python Development Mode, introducing additional runtime
    checks that are too expensive to be enabled by default.
    This is equivalent to setting the `-X` `dev` option.

PYTHONUTF8
:   If set to `1`, enable the Python UTF-8 Mode.

    If set to `0`, disable the Python UTF-8 Mode.

    Setting any other non-empty string causes an error during interpreter
    initialisation.

PYTHONWARNDEFAULTENCODING
:   If this environment variable is set to a non-empty string, issue a
    `EncodingWarning` when the locale-specific default encoding is used.

    See Opt-in EncodingWarning for details.

PYTHONNODEBUGRANGES
:   If this variable is set, it disables the inclusion of the tables mapping
    extra location information (end line, start column offset and end column
    offset) to every instruction in code objects. This is useful when smaller
    code objects and pyc files are desired as well as suppressing the extra visual
    location indicators when the interpreter displays tracebacks.

PYTHONPERFSUPPORT
:   If this variable is set to a nonzero value, it enables support for
    the Linux `perf` profiler so Python calls can be detected by it.

    If set to `0`, disable Linux `perf` profiler support.

    See also the `-X perf` command-line option
    and Python support for the perf map compatible profilers.

PYTHON\_PERF\_JIT\_SUPPORT
:   If this variable is set to a nonzero value, it enables support for
    the Linux `perf` profiler so Python calls can be detected by it
    using DWARF information.

    If set to `0`, disable Linux `perf` profiler support.

    See also the `-X perf_jit` command-line option
    and Python support for the perf map compatible profilers.

PYTHON\_DISABLE\_REMOTE\_DEBUG
:   If this variable is set to a non-empty string, it disables the remote
    debugging feature described in **PEP 768**. This includes both the functionality
    to schedule code for execution in another process and the functionality to
    receive code for execution in the current process.

    See also the `-X disable-remote-debug` command-line option.

PYTHON\_CPU\_COUNT
:   If this variable is set to a positive integer, it overrides the return
    values of `os.cpu_count()` and `os.process_cpu_count()`.

    See also the `-X cpu_count` command-line option.

PYTHON\_FROZEN\_MODULES
:   If this variable is set to `on` or `off`, it determines whether or not
    frozen modules are ignored by the import machinery. A value of `on` means
    they get imported and `off` means they are ignored. The default is `on`
    for non-debug builds (the normal case) and `off` for debug builds.
    Note that the `importlib_bootstrap` and
    `importlib_bootstrap_external` frozen modules are always used, even
    if this flag is set to `off`.

    See also the `-X frozen_modules` command-line option.

PYTHON\_COLORS
:   If this variable is set to `1`, the interpreter will colorize various kinds
    of output. Setting it to `0` deactivates this behavior.
    See also Controlling color.

PYTHON\_BASIC\_REPL
:   If this variable is set to any value, the interpreter will not attempt to
    load the Python-based REPL that requires `readline`, and will
    instead use the traditional parser-based REPL.

PYTHON\_BASIC\_COMPLETER
:   If this variable is set to any value, PyREPL will use `rlcompleter` to
    implement tab completion, instead of the default one which uses colors.

    Added in version 3.15.

PYTHON\_HISTORY
:   This environment variable can be used to set the location of a
    `.python_history` file (by default, it is `.python_history` in the
    user’s home directory).

PYTHON\_GIL
:   If this variable is set to `1`, the global interpreter lock (GIL) will be
    forced on. Setting it to `0` forces the GIL off (needs Python configured with
    the `--disable-gil` build option).

    See also the `-X gil` command-line option, which takes
    precedence over this variable, and Free-threaded CPython.

PYTHON\_THREAD\_INHERIT\_CONTEXT
:   If this variable is set to `1` then `Thread` will,
    by default, use a copy of context of the caller of `Thread.start()`
    when starting. Otherwise, new threads will start with an empty context.
    If unset, this variable defaults to `1` on free-threaded builds and to
    `0` otherwise. See also `-X thread_inherit_context`.

PYTHON\_CONTEXT\_AWARE\_WARNINGS
:   If set to `1` then the `warnings.catch_warnings` context
    manager will use a `ContextVar` to store warnings
    filter state. If unset, this variable defaults to `1` on
    free-threaded builds and to `0` otherwise. See [`-X
    context_aware_warnings`](#cmdoption-X).

PYTHON\_PATHCONFIG\_WARNINGS
:   If true (`1`) then The initialization of the sys.path module search path is allowed to log warnings into
    stderr. If false (`0`) suppress these warnings. Set to true by default.
    See also `-X pathconfig_warnings`.

    Added in version 3.15.

PYTHON\_JIT
:   On builds where experimental just-in-time compilation is available, this
    variable can force the JIT to be disabled (`0`) or enabled (`1`) at
    interpreter startup.

PYTHON\_TLBC
:   If set to `1` enables thread-local bytecode. If set to `0` thread-local
    bytecode and the specializing interpreter are disabled. Only applies to
    builds configured with `--disable-gil`.

    See also the `-X tlbc` command-line option.

PYTHON\_LAZY\_IMPORTS
:   Controls lazy import behavior. Accepts two values: `all` makes all
    imports lazy by default, and `normal` (the default) respects the
    `lazy` keyword in source code.

    See also the `-X lazy_imports` command-line option.

    Added in version 3.15.

### 1.2.1. Debug-mode variables

PYTHONDUMPREFS
:   If set, Python will dump objects and reference counts still alive after
    shutting down the interpreter.

    Needs Python configured with the `--with-trace-refs` build option.

PYTHONDUMPREFSFILE
:   If set, Python will dump objects and reference counts still alive
    after shutting down the interpreter into a file under the path given
    as the value to this environment variable.

    Needs Python configured with the `--with-trace-refs` build option.

PYTHON\_PRESITE
:   If this variable is set to a module, that module will be imported
    early in the interpreter lifecycle, before the `site` module is
    executed, and before the `__main__` module is created.
    Therefore, the imported module is not treated as `__main__`.

    This can be used to execute code early during Python initialization.

    To import a submodule, use `package.module` as the value, like in
    an import statement.

    See also the `-X presite` command-line option,
    which takes precedence over this variable.

    Needs Python configured with the `--with-pydebug` build option.

    Changed in version 3.15: Accept also `module:func` entry point format.
