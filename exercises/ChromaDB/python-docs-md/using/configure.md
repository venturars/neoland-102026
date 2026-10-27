---
page: using/configure.html
title: 3. Configure Python
area: using
kind: guide
---

<!-- anchor: configure-python | type: section -->
# 3. Configure Python

<!-- anchor: build-requirements | type: section -->
## 3.1. Build Requirements

To build CPython, you will need:

- A C11 compiler. Optional C11 features are not required.

- On Windows, Microsoft Visual Studio 2017 or later is required.

- Support for IEEE 754 floating-point numbers and floating-point Not-a-Number (NaN).

- Support for threads.

Changed in version 3.5: On Windows, Visual Studio 2015 or later is now required.

Changed in version 3.6: Selected C99 features, like `<stdint.h>` and `static inline` functions, are now required.

Changed in version 3.7: Thread support is now required.

Changed in version 3.11: C11 compiler, IEEE 754 and NaN support are now required. On Windows, Visual Studio 2017 or later is required.

See also **PEP 7** “Style Guide for C Code” and **PEP 11** “CPython platform support”.

<!-- anchor: requirements-for-optional-modules | type: section -->
### 3.1.1. Requirements for optional modules

Some optional modules of the standard library require third-party libraries installed for development (for example, header files must be available).

Missing requirements are reported in the `configure` output. Modules that are missing due to missing dependencies are listed near the end of the `make` output, sometimes using an internal name, for example, `_ctypes` for `ctypes` module.

If you distribute a CPython interpreter without optional modules, it’s best practice to advise users, who generally expect that standard library modules are available.

Dependencies to build optional modules are:

| Dependency | Minimum version | Python module |
| --- | --- | --- |
| libbz2 |  | `bz2` |
| libffi | 3.3.0 recommended | `ctypes` |
| liblzma |  | `lzma` |
| libmpdec | 2.5.0 | `decimal` [1] |
| libreadline or libedit [2] |  | `readline` |
| libuuid |  | `_uuid` [3] |
| ncurses [4] |  | `curses` |
| OpenSSL | [6] | `ssl`, `hashlib` [5] |
| SQLite | 3.15.2 | `sqlite3` |
| Tcl/Tk | 8.5.12 | `tkinter`, IDLE, `turtle` |
| zlib | 1.2.2.1 | `zlib`, `gzip`, `ensurepip` |
| zstd | 1.4.5 | `compression.zstd` |

[1]

If *libmpdec* is not available, the `decimal` module will use a pure-Python implementation. See `--with-system-libmpdec` for details.

[2]

See `--with-readline` for choosing the backend for the `readline` module.

[3]

The `uuid` module uses `_uuid` to generate “safe” UUIDs. See the module documentation for details.

[4]

The `curses` module requires the `libncurses` or `libncursesw` library. The `curses.panel` module additionally requires the `libpanel` or `libpanelw` library.

[5]

If OpenSSL is not available, the `hashlib` module will use bundled implementations of several hash functions. See `--with-builtin-hashlib-hashes` for *forcing* usage of OpenSSL.

[6]

OpenSSL 1.1.1 is the minimum possible version to build against, but the series is end-of-life and no longer receives public security fixes. Use the latest patch release of a currently supported LTS release series (see the OpenSSL Roadmap), or the package provided by your operating system if available. Other libraries that offer an API compatible with OpenSSL 1.1.1 or later may work, but are not officially supported.

Note that the table does not include all optional modules; in particular, platform-specific modules like `winreg` are not listed here.

**See also:**

- The devguide includes a full list of dependencies required to build all modules and instructions on how to install them on common platforms.

- `--with-system-expat` allows building with an external libexpat library.

- Options for third-party dependencies

Changed in version 3.1: Tcl/Tk version 8.3.1 is now required for `tkinter`.

Changed in version 3.5: Tcl/Tk version 8.4 is now required for `tkinter`.

Changed in version 3.7: OpenSSL 1.0.2 is now required for `hashlib` and `ssl`.

Changed in version 3.10: OpenSSL 1.1.1 is now required for `hashlib` and `ssl`. SQLite 3.7.15 is now required for `sqlite3`.

Changed in version 3.11: Tcl/Tk version 8.5.12 is now required for `tkinter`.

Changed in version 3.13: SQLite 3.15.2 is now required for `sqlite3`.

<!-- anchor: generated-files | type: section -->
## 3.2. Generated files

To reduce build dependencies, Python source code contains multiple generated files. Commands to regenerate all generated files:

```sh
make regen-all
make regen-stdlib-module-names
make regen-limited-abi
make regen-configure
```

The `Makefile.pre.in` file documents generated files, their inputs, and tools used to regenerate them. Search for `regen-*` make targets.

<!-- anchor: configure-script | type: section -->
### 3.2.1. configure script

The `make regen-configure` command regenerates the `aclocal.m4` file and the `configure` script using the `Tools/build/regen-configure.sh` shell script which uses an Ubuntu container to get the same tools versions and have a reproducible output.

The container is optional, the following command can be run locally:

```sh
autoreconf -ivf -Werror
```

The generated files can change depending on the exact versions of the tools used. The container that CPython uses has Autoconf 2.72, `aclocal` from Automake 1.16.5, and pkg-config 1.8.1.

Changed in version 3.13: Autoconf 2.71 and aclocal 1.16.5 and are now used to regenerate `configure`.

Changed in version 3.14: Autoconf 2.72 is now used to regenerate `configure`.

<!-- anchor: configure-options | type: section -->
## 3.3. Configure Options

List all `configure` script options using:

```sh
./configure --help
```

See also the `Misc/SpecialBuilds.txt` in the Python source distribution.

<!-- anchor: general-options | type: section -->
### 3.3.1. General Options

<!-- anchor: cmdoption-enable-loadable-sqlite-extensions | type: std option -->
#### `--enable-loadable-sqlite-extensions`

Support loadable extensions in the `_sqlite` extension module (default is no) of the `sqlite3` module.

See the `sqlite3.Connection.enable_load_extension()` method of the `sqlite3` module.

Added in version 3.6.

<!-- anchor: cmdoption-disable-ipv6 | type: std option -->
#### `--disable-ipv6`

Disable IPv6 support (enabled by default if supported), see the `socket` module.

<!-- anchor: cmdoption-enable-big-digits | type: std option -->
#### `--enable-big-digits=[15|30]`

Define the size in bits of Python `int` digits: 15 or 30 bits.

By default, the digit size is 30.

Define the `PYLONG_BITS_IN_DIGIT` to `15` or `30`.

See `sys.int_info.bits_per_digit`.

<!-- anchor: cmdoption-with-suffix | type: std option -->
#### `--with-suffix=SUFFIX`

Set the Python executable suffix to *SUFFIX*.

The default suffix is `.exe` on Windows and macOS (`python.exe` executable), `.js` on Emscripten node, `.html` on Emscripten browser, `.wasm` on WASI, and an empty string on other platforms (`python` executable).

Changed in version 3.11: The default suffix on WASM platform is one of `.js`, `.html` or `.wasm`.

<!-- anchor: cmdoption-with-tzpath | type: std option -->
#### `--with-tzpath=<list of absolute paths separated by pathsep>`

Select the default time zone search path for `zoneinfo.TZPATH`. See the Compile-time configuration of the `zoneinfo` module.

Default: `/usr/share/zoneinfo:/usr/lib/zoneinfo:/usr/share/lib/zoneinfo:/etc/zoneinfo`.

See `os.pathsep` path separator.

Added in version 3.9.

<!-- anchor: cmdoption-without-decimal-contextvar | type: std option -->
#### `--without-decimal-contextvar`

Build the `_decimal` extension module using a thread-local context rather than a coroutine-local context (default), see the `decimal` module.

See `decimal.HAVE_CONTEXTVAR` and the `contextvars` module.

Added in version 3.9.

<!-- anchor: cmdoption-with-dbmliborder | type: std option -->
#### `--with-dbmliborder=<list of backend names>`

Override order to check db backends for the `dbm` module

A valid value is a colon (`:`) separated string with the backend names:

- `ndbm`;

- `gdbm`;

- `bdb`.

<!-- anchor: cmdoption-without-c-locale-coercion | type: std option -->
#### `--without-c-locale-coercion`

Disable C locale coercion to a UTF-8 based locale (enabled by default).

Don’t define the `PY_COERCE_C_LOCALE` macro.

See `PYTHONCOERCECLOCALE` and the **PEP 538**.

<!-- anchor: cmdoption-with-platlibdir | type: std option -->
#### `--with-platlibdir=DIRNAME`

Python library directory name (default is `lib`).

Fedora and SuSE use `lib64` on 64-bit platforms.

See `sys.platlibdir`.

Added in version 3.9.

<!-- anchor: cmdoption-with-wheel-pkg-dir | type: std option -->
#### `--with-wheel-pkg-dir=PATH`

Directory of wheel packages used by the `ensurepip` module (none by default).

Some Linux distribution packaging policies recommend against bundling dependencies. For example, Fedora installs wheel packages in the `/usr/share/python-wheels/` directory and don’t install the `ensurepip._bundled` package.

Added in version 3.10.

<!-- anchor: cmdoption-with-pkg-config | type: std option -->
#### `--with-pkg-config=[check|yes|no]`

Whether configure should use **pkg-config** to detect build dependencies.

- `check` (default): **pkg-config** is optional

- `yes`: **pkg-config** is mandatory

- `no`: configure does not use **pkg-config** even when present

Added in version 3.11.

<!-- anchor: cmdoption-with-missing-stdlib-config | type: std option -->
#### `--with-missing-stdlib-config=FILE`

Path to a JSON configuration file containing custom error messages for missing standard library modules.

This option is intended for Python distributors who wish to provide distribution-specific guidance when users encounter standard library modules that are missing or packaged separately.

The JSON file should map missing module names to custom error message strings. For example, if your distribution packages `tkinter` and `_tkinter` separately and excludes `_gdbm` for legal reasons, the configuration could contain:

```json
{
    "_gdbm": "The '_gdbm' module is not available in this distribution",
    "tkinter": "Install the python-tk package to use tkinter",
    "_tkinter": "Install the python-tk package to use tkinter",
}
```

Added in version 3.15.

<!-- anchor: cmdoption-enable-pystats | type: std option -->
#### `--enable-pystats`

Turn on internal Python performance statistics gathering.

By default, statistics gathering is off. Use `python3 -X pystats` command or set `PYTHONSTATS=1` environment variable to turn on statistics gathering at Python startup.

At Python exit, dump statistics if statistics gathering was on and not cleared.

Effects:

- Add `-X pystats` command line option.

- Add `PYTHONSTATS` environment variable.

- Define the `Py_STATS` macro.

- Add functions to the `sys` module:

  - `sys._stats_on()`: Turns on statistics gathering.

  - `sys._stats_off()`: Turns off statistics gathering.

  - `sys._stats_clear()`: Clears the statistics.

  - `sys._stats_dump()`: Dump statistics to file, and clears the statistics.

The statistics will be dumped to a arbitrary (probably unique) file in `/tmp/py_stats/` (Unix) or `C:\temp\py_stats\` (Windows). If that directory does not exist, results will be printed on stderr.

Use `Tools/scripts/summarize_stats.py` to read the stats.

Statistics:

- Opcode:

  - Specialization: success, failure, hit, deferred, miss, deopt, failures;

  - Execution count;

  - Pair count.

- Call:

  - Inlined Python calls;

  - PyEval calls;

  - Frames pushed;

  - Frame object created;

  - Eval calls: vector, generator, legacy, function VECTORCALL, build class, slot, function “ex”, API, method.

- Object:

  - incref and decref;

  - interpreter incref and decref;

  - allocations: all, 512 bytes, 4 kiB, big;

  - free;

  - to/from free lists;

  - dictionary materialized/dematerialized;

  - type cache;

  - optimization attempts;

  - optimization traces created/executed;

  - uops executed.

- Garbage collector:

  - Garbage collections;

  - Objects visited;

  - Objects collected.

Added in version 3.11.

<!-- anchor: cmdoption-disable-gil | type: std option -->
#### `--disable-gil`

Enables support for running Python without the global interpreter lock (GIL): free-threaded build.

Defines the `Py_GIL_DISABLED` macro and adds `"t"` to `sys.abiflags`.

See Free-threaded CPython for more detail.

Added in version 3.13.

<!-- anchor: cmdoption-enable-experimental-jit | type: std option -->
#### `--enable-experimental-jit=[no|yes|yes-off|interpreter]`

Indicate how to integrate the experimental just-in-time compiler.

- `no`: Don’t build the JIT.

- `yes`: Enable the JIT. To disable it at runtime, set the environment variable `PYTHON_JIT=0`.

- `yes-off`: Build the JIT, but disable it by default. To enable it at runtime, set the environment variable `PYTHON_JIT=1`.

- `interpreter`: Enable the “JIT interpreter” (only useful for those debugging the JIT itself). To disable it at runtime, set the environment variable `PYTHON_JIT=0`.

`--enable-experimental-jit=no` is the default behavior if the option is not provided, and `--enable-experimental-jit` is shorthand for `--enable-experimental-jit=yes`. See `Tools/jit/README.md` for more information, including how to install the necessary build-time dependencies.

**Note:**

When building CPython with JIT enabled, ensure that your system has Python 3.11 or later installed.

Added in version 3.13.

<!-- anchor: cmdoption-arg-PKG_CONFIG | type: std option -->
#### `PKG_CONFIG`

Path to `pkg-config` utility.

<!-- anchor: cmdoption-arg-PKG_CONFIG_LIBDIR | type: std option -->
#### `PKG_CONFIG_LIBDIR`

<!-- anchor: cmdoption-arg-PKG_CONFIG_PATH | type: std option -->
#### `PKG_CONFIG_PATH`

`pkg-config` options.

<!-- anchor: cmdoption-disable-epoll | type: std option -->
#### `--disable-epoll`

Build without `epoll`, meaning that `select.epoll()` will not be present even if the system provides an *epoll_create* function. This may be used on systems where *epoll_create* or *epoll_create1* is available but incompatible with Linux semantics.

Added in version 3.15.

<!-- anchor: c-compiler-options | type: section -->
### 3.3.2. C compiler options

<!-- anchor: cmdoption-arg-CC | type: std option -->
#### `CC`

C compiler command.

<!-- anchor: cmdoption-arg-CFLAGS | type: std option -->
#### `CFLAGS`

C compiler flags.

<!-- anchor: cmdoption-arg-CPP | type: std option -->
#### `CPP`

C preprocessor command.

<!-- anchor: cmdoption-arg-CPPFLAGS | type: std option -->
#### `CPPFLAGS`

C preprocessor flags, e.g. `-Iinclude_dir`.

<!-- anchor: linker-options | type: section -->
### 3.3.3. Linker options

<!-- anchor: cmdoption-arg-LDFLAGS | type: std option -->
#### `LDFLAGS`

Linker flags, e.g. `-Llibrary_directory`.

<!-- anchor: cmdoption-arg-LIBS | type: std option -->
#### `LIBS`

Libraries to pass to the linker, e.g. `-llibrary`.

<!-- anchor: cmdoption-arg-MACHDEP | type: std option -->
#### `MACHDEP`

Name for machine-dependent library files.

<!-- anchor: options-for-third-party-dependencies | type: section -->
### 3.3.4. Options for third-party dependencies

Added in version 3.11.

<!-- anchor: cmdoption-arg-BZIP2_CFLAGS | type: std option -->
#### `BZIP2_CFLAGS`

<!-- anchor: cmdoption-arg-BZIP2_LIBS | type: std option -->
#### `BZIP2_LIBS`

C compiler and linker flags to link Python to `libbz2`, used by `bz2` module, overriding `pkg-config`.

<!-- anchor: cmdoption-arg-CURSES_CFLAGS | type: std option -->
#### `CURSES_CFLAGS`

<!-- anchor: cmdoption-arg-CURSES_LIBS | type: std option -->
#### `CURSES_LIBS`

C compiler and linker flags for `libncurses` or `libncursesw`, used by `curses` module, overriding `pkg-config`.

<!-- anchor: cmdoption-arg-GDBM_CFLAGS | type: std option -->
#### `GDBM_CFLAGS`

<!-- anchor: cmdoption-arg-GDBM_LIBS | type: std option -->
#### `GDBM_LIBS`

C compiler and linker flags for `gdbm`.

<!-- anchor: cmdoption-arg-LIBEDIT_CFLAGS | type: std option -->
#### `LIBEDIT_CFLAGS`

<!-- anchor: cmdoption-arg-LIBEDIT_LIBS | type: std option -->
#### `LIBEDIT_LIBS`

C compiler and linker flags for `libedit`, used by `readline` module, overriding `pkg-config`.

<!-- anchor: cmdoption-arg-LIBFFI_CFLAGS | type: std option -->
#### `LIBFFI_CFLAGS`

<!-- anchor: cmdoption-arg-LIBFFI_LIBS | type: std option -->
#### `LIBFFI_LIBS`

C compiler and linker flags for `libffi`, used by `ctypes` module, overriding `pkg-config`.

<!-- anchor: cmdoption-arg-LIBMPDEC_CFLAGS | type: std option -->
#### `LIBMPDEC_CFLAGS`

<!-- anchor: cmdoption-arg-LIBMPDEC_LIBS | type: std option -->
#### `LIBMPDEC_LIBS`

C compiler and linker flags for `libmpdec`, used by `decimal` module, overriding `pkg-config`.

**Note:**

These environment variables have no effect unless `--with-system-libmpdec` is specified.

<!-- anchor: cmdoption-arg-LIBLZMA_CFLAGS | type: std option -->
#### `LIBLZMA_CFLAGS`

<!-- anchor: cmdoption-arg-LIBLZMA_LIBS | type: std option -->
#### `LIBLZMA_LIBS`

C compiler and linker flags for `liblzma`, used by `lzma` module, overriding `pkg-config`.

<!-- anchor: cmdoption-arg-LIBREADLINE_CFLAGS | type: std option -->
#### `LIBREADLINE_CFLAGS`

<!-- anchor: cmdoption-arg-LIBREADLINE_LIBS | type: std option -->
#### `LIBREADLINE_LIBS`

C compiler and linker flags for `libreadline`, used by `readline` module, overriding `pkg-config`.

<!-- anchor: cmdoption-arg-LIBSQLITE3_CFLAGS | type: std option -->
#### `LIBSQLITE3_CFLAGS`

<!-- anchor: cmdoption-arg-LIBSQLITE3_LIBS | type: std option -->
#### `LIBSQLITE3_LIBS`

C compiler and linker flags for `libsqlite3`, used by `sqlite3` module, overriding `pkg-config`.

<!-- anchor: cmdoption-arg-LIBUUID_CFLAGS | type: std option -->
#### `LIBUUID_CFLAGS`

<!-- anchor: cmdoption-arg-LIBUUID_LIBS | type: std option -->
#### `LIBUUID_LIBS`

C compiler and linker flags for `libuuid`, used by `uuid` module, overriding `pkg-config`.

<!-- anchor: cmdoption-arg-LIBZSTD_CFLAGS | type: std option -->
#### `LIBZSTD_CFLAGS`

<!-- anchor: cmdoption-arg-LIBZSTD_LIBS | type: std option -->
#### `LIBZSTD_LIBS`

C compiler and linker flags for `libzstd`, used by `compression.zstd` module, overriding `pkg-config`.

Added in version 3.14.

<!-- anchor: cmdoption-arg-PANEL_CFLAGS | type: std option -->
#### `PANEL_CFLAGS`

<!-- anchor: cmdoption-arg-PANEL_LIBS | type: std option -->
#### `PANEL_LIBS`

C compiler and linker flags for PANEL, overriding `pkg-config`.

C compiler and linker flags for `libpanel` or `libpanelw`, used by `curses.panel` module, overriding `pkg-config`.

<!-- anchor: cmdoption-arg-TCLTK_CFLAGS | type: std option -->
#### `TCLTK_CFLAGS`

<!-- anchor: cmdoption-arg-TCLTK_LIBS | type: std option -->
#### `TCLTK_LIBS`

C compiler and linker flags for TCLTK, overriding `pkg-config`.

<!-- anchor: cmdoption-arg-ZLIB_CFLAGS | type: std option -->
#### `ZLIB_CFLAGS`

<!-- anchor: cmdoption-arg-ZLIB_LIBS | type: std option -->
#### `ZLIB_LIBS`

C compiler and linker flags for `libzlib`, used by `gzip` module, overriding `pkg-config`.

<!-- anchor: webassembly-options | type: section -->
### 3.3.5. WebAssembly Options

<!-- anchor: cmdoption-enable-wasm-dynamic-linking | type: std option -->
#### `--enable-wasm-dynamic-linking`

Turn on dynamic linking support for WASM.

Dynamic linking enables `dlopen`. File size of the executable increases due to limited dead code elimination and additional features.

Added in version 3.11.

<!-- anchor: cmdoption-enable-wasm-pthreads | type: std option -->
#### `--enable-wasm-pthreads`

Turn on pthreads support for WASM.

Added in version 3.11.

<!-- anchor: install-options | type: section -->
### 3.3.6. Install Options

<!-- anchor: cmdoption-prefix | type: std option -->
#### `--prefix=PREFIX`

Install architecture-independent files in PREFIX. On Unix, it defaults to `/usr/local`.

This value can be retrieved at runtime using `sys.prefix`.

As an example, one can use `--prefix="$HOME/.local/"` to install a Python in its home directory.

<!-- anchor: cmdoption-exec-prefix | type: std option -->
#### `--exec-prefix=EPREFIX`

Install architecture-dependent files in EPREFIX, defaults to `--prefix`.

This value can be retrieved at runtime using `sys.exec_prefix`.

<!-- anchor: cmdoption-disable-test-modules | type: std option -->
#### `--disable-test-modules`

Don’t build nor install test modules, like the `test` package or the `_testcapi` extension module (built and installed by default).

Added in version 3.10.

<!-- anchor: cmdoption-with-ensurepip | type: std option -->
#### `--with-ensurepip=[upgrade|install|no]`

Select the `ensurepip` command run on Python installation:

- `upgrade` (default): run `python -m ensurepip --altinstall --upgrade` command.

- `install`: run `python -m ensurepip --altinstall` command;

- `no`: don’t run ensurepip;

Added in version 3.6.

<!-- anchor: performance-options | type: section -->
### 3.3.7. Performance options

Configuring Python using `--enable-optimizations --with-lto` (PGO + LTO) is recommended for best performance. The experimental `--enable-bolt` flag can also be used to improve performance.

<!-- anchor: cmdoption-enable-optimizations | type: std option -->
#### `--enable-optimizations`

Enable Profile Guided Optimization (PGO) using `PROFILE_TASK` (disabled by default).

The C compiler Clang requires `llvm-profdata` program for PGO. On macOS, GCC also requires it: GCC is just an alias to Clang on macOS.

Disable also semantic interposition in libpython if `--enable-shared` and GCC is used: add `-fno-semantic-interposition` to the compiler and linker flags.

**Note:**

During the build, you may encounter compiler warnings about profile data not being available for some source files. These warnings are harmless, as only a subset of the code is exercised during profile data acquisition. To disable these warnings on Clang, manually suppress them by adding `-Wno-profile-instr-unprofiled` to `CFLAGS`.

Added in version 3.6.

Changed in version 3.10: Use `-fno-semantic-interposition` on GCC.

<!-- anchor: envvar-PROFILE_TASK | type: std envvar -->
#### `PROFILE_TASK`

Environment variable used in the Makefile: Python command line arguments for the PGO generation task.

Default: `-m test --pgo --timeout=$(TESTTIMEOUT)`.

Added in version 3.8.

Changed in version 3.13: Task failure is no longer ignored silently.

<!-- anchor: cmdoption-with-lto | type: std option -->
#### `--with-lto=[full|thin|no|yes]`

Enable Link Time Optimization (LTO) in any build (disabled by default).

The C compiler Clang requires `llvm-ar` for LTO (`ar` on macOS), as well as an LTO-aware linker (`ld.gold` or `lld`).

Added in version 3.6.

Added in version 3.11: To use ThinLTO feature, use `--with-lto=thin` on Clang.

Changed in version 3.12: Use ThinLTO as the default optimization policy on Clang if the compiler accepts the flag.

<!-- anchor: cmdoption-enable-bolt | type: std option -->
#### `--enable-bolt`

Enable usage of the BOLT post-link binary optimizer (disabled by default).

BOLT is part of the LLVM project but is not always included in their binary distributions. This flag requires that `llvm-bolt` and `merge-fdata` are available.

BOLT is still a fairly new project so this flag should be considered experimental for now. Because this tool operates on machine code its success is dependent on a combination of the build environment + the other optimization configure args + the CPU architecture, and not all combinations are supported. BOLT versions before LLVM 16 are known to crash BOLT under some scenarios. Use of LLVM 16 or newer for BOLT optimization is strongly encouraged.

The `BOLT_INSTRUMENT_FLAGS` and `BOLT_APPLY_FLAGS` **configure** variables can be defined to override the default set of arguments for **llvm-bolt** to instrument and apply BOLT data to binaries, respectively.

Added in version 3.12.

<!-- anchor: cmdoption-arg-BOLT_APPLY_FLAGS | type: std option -->
#### `BOLT_APPLY_FLAGS`

Arguments to `llvm-bolt` when creating a BOLT optimized binary.

Added in version 3.12.

<!-- anchor: cmdoption-arg-BOLT_INSTRUMENT_FLAGS | type: std option -->
#### `BOLT_INSTRUMENT_FLAGS`

Arguments to `llvm-bolt` when instrumenting binaries.

Added in version 3.12.

<!-- anchor: cmdoption-with-computed-gotos | type: std option -->
#### `--with-computed-gotos`

Enable computed gotos in evaluation loop (enabled by default on supported compilers).

<!-- anchor: cmdoption-with-tail-call-interp | type: std option -->
#### `--with-tail-call-interp`

Enable interpreters using tail calls in CPython. If enabled, enabling PGO (`--enable-optimizations`) is highly recommended. This option specifically requires a C compiler with proper tail call support, and the preserve_none calling convention. For example, Clang 19 and newer supports this feature.

Added in version 3.14.

<!-- anchor: cmdoption-without-frame-pointers | type: std option -->
#### `--without-frame-pointers`

Disable frame pointers, which are enabled by default (see **PEP 831**).

By default, the build appends flags to generate frame or backchain pointers to `BASECFLAGS`:

- `-fno-omit-frame-pointer` and/or `-mno-omit-leaf-frame-pointer` are added when the compiler supports them.

- `-marm` and/or `-mno-thumb` is added on 32-bit ARM when supported,

- on s390x platforms, when supported, `-mbackchain` is added *instead*. of the above frame pointer flags.

- on ppc64le platforms, no compiler flags is needed since the power ABI requires that compilers maintain a back chain by default.

Frame pointers enable profilers, debuggers, and system tracing tools (`perf`, `eBPF`, `dtrace`, `gdb`) to walk the C call stack without DWARF metadata. The flags propagate to third-party C extensions through `sysconfig`. On compilers that do not understand them, the build silently skips them.

Downstream packagers and authors of native libraries built with custom build systems should set the same flags so the unwind chain stays unbroken across all native frames.

Added in version 3.15.

<!-- anchor: cmdoption-without-mimalloc | type: std option -->
#### `--without-mimalloc`

Disable the fast mimalloc allocator (enabled by default).

This option cannot be used together with `--disable-gil` because the free-threaded build requires mimalloc.

See also `PYTHONMALLOC` environment variable.

<!-- anchor: cmdoption-without-pymalloc | type: std option -->
#### `--without-pymalloc`

Disable the specialized Python memory allocator pymalloc (enabled by default).

See also `PYTHONMALLOC` environment variable.

<!-- anchor: cmdoption-with-pymalloc-hugepages | type: std option -->
#### `--with-pymalloc-hugepages`

Enable huge page support for pymalloc arenas (disabled by default). When enabled, the arena size on 64-bit platforms is increased to 2 MiB and arena allocation uses `MAP_HUGETLB` (Linux) or `MEM_LARGE_PAGES` (Windows) with automatic fallback to regular pages.

Even when compiled with this option, huge pages are **not** used at runtime unless the `PYTHON_PYMALLOC_HUGEPAGES` environment variable is set to `1`. This opt-in is required because huge pages

- carry risks on Linux: if the huge-page pool is exhausted, page faults (including copy-on-write faults after `os.fork()`) deliver `SIGBUS` and kill the process.

- need a special privilege on Windows. See the Windows documentation for large pages for details. Python will fail on startup if the required privilege SeLockMemoryPrivilege is not held by the user.

The configure script checks that the platform supports `MAP_HUGETLB` and emits a warning if it is not available.

On Windows, use the `--pymalloc-hugepages` flag with `build.bat` or set the `UsePymallocHugepages` MSBuild property.

Added in version 3.15.

<!-- anchor: cmdoption-without-doc-strings | type: std option -->
#### `--without-doc-strings`

Disable static documentation strings to reduce the memory footprint (enabled by default). Documentation strings defined in Python are not affected.

Don’t define the `WITH_DOC_STRINGS` macro.

See the `PyDoc_STRVAR()` macro.

<!-- anchor: cmdoption-enable-profiling | type: std option -->
#### `--enable-profiling`

Enable C-level code profiling with `gprof` (disabled by default).

<!-- anchor: cmdoption-with-strict-overflow | type: std option -->
#### `--with-strict-overflow`

Add `-fstrict-overflow` to the C compiler flags (by default we add `-fno-strict-overflow` instead).

<!-- anchor: cmdoption-without-remote-debug | type: std option -->
#### `--without-remote-debug`

Deactivate remote debugging support described in **PEP 768** (enabled by default). When this flag is provided the code that allows the interpreter to schedule the execution of a Python file in a separate process as described in **PEP 768** is not compiled. This includes both the functionality to schedule code to be executed and the functionality to receive code to be executed.

<!-- anchor: c.Py_REMOTE_DEBUG | type: c macro -->
##### `Py_REMOTE_DEBUG`

This macro is defined by default, unless Python is configured with `--without-remote-debug`.

Note that even if the macro is defined, remote debugging may not be available (for example, on an incompatible platform).

Added in version 3.14.

<!-- anchor: python-debug-build | type: section -->
### 3.3.8. Python Debug Build

A debug build is Python built with the `--with-pydebug` configure option.

Effects of a debug build:

- Display all warnings by default: the list of default warning filters is empty in the `warnings` module.

- Add `d` to `sys.abiflags`.

- Add `sys.gettotalrefcount()` function.

- Add `-X showrefcount` command line option.

- Add `-d` command line option and `PYTHONDEBUG` environment variable to debug the parser.

- Add support for the `__lltrace__` variable: enable low-level tracing in the bytecode evaluation loop if the variable is defined.

- Install debug hooks on memory allocators to detect buffer overflow and other memory errors.

- Define `Py_DEBUG` and `Py_REF_DEBUG` macros.

- Add runtime checks: code surrounded by `#ifdef Py_DEBUG` and `#endif`. Enable `assert(...)` and `_PyObject_ASSERT(...)` assertions: don’t set the `NDEBUG` macro (see also the `--with-assertions` configure option). Main runtime checks:

  - Add sanity checks on the function arguments.

  - Unicode and int objects are created with their memory filled with a pattern to detect usage of uninitialized objects.

  - Ensure that functions which can clear or replace the current exception are not called with an exception raised.

  - Check that deallocator functions don’t change the current exception.

  - The garbage collector (`gc.collect()` function) runs some basic checks on objects consistency.

  - The `Py_SAFE_DOWNCAST()` macro checks for integer underflow and overflow when downcasting from wide types to narrow types.

See also the Python Development Mode and the `--with-trace-refs` configure option.

Changed in version 3.8: Release builds are now ABI compatible with debug builds: defining the `Py_DEBUG` macro no longer implies the `Py_TRACE_REFS` macro (see the `--with-trace-refs` option). However, debug builds still expose more symbols than release builds and code built against a debug build is not necessarily compatible with a release build.

<!-- anchor: debug-options | type: section -->
### 3.3.9. Debug options

<!-- anchor: cmdoption-with-pydebug | type: std option -->
#### `--with-pydebug`

Build Python in debug mode: define the `Py_DEBUG` macro (disabled by default).

<!-- anchor: cmdoption-with-trace-refs | type: std option -->
#### `--with-trace-refs`

Enable tracing references for debugging purpose (disabled by default).

Effects:

- Define the `Py_TRACE_REFS` macro.

- Add `sys.getobjects()` function.

- Add `PYTHONDUMPREFS` environment variable.

The `PYTHONDUMPREFS` environment variable can be used to dump objects and reference counts still alive at Python exit.

Statically allocated objects are not traced.

Added in version 3.8.

Changed in version 3.13: This build is now ABI compatible with release build and debug build.

<!-- anchor: cmdoption-with-assertions | type: std option -->
#### `--with-assertions`

Build with C assertions enabled (default is no): `assert(...);` and `_PyObject_ASSERT(...);`.

If set, the `NDEBUG` macro is not defined in the `OPT` compiler variable.

See also the `--with-pydebug` option (debug build) which also enables assertions.

Added in version 3.6.

<!-- anchor: cmdoption-with-valgrind | type: std option -->
#### `--with-valgrind`

Enable Valgrind support (default is no).

<!-- anchor: cmdoption-with-dtrace | type: std option -->
#### `--with-dtrace`

Enable DTrace support (default is no).

See Instrumenting CPython with DTrace and SystemTap.

Added in version 3.6.

<!-- anchor: cmdoption-with-address-sanitizer | type: std option -->
#### `--with-address-sanitizer`

Enable AddressSanitizer memory error detector, `asan` (default is no). To improve ASan detection capabilities you may also want to combine this with `--without-pymalloc` to disable the specialized small-object allocator whose allocations are not tracked by ASan.

Added in version 3.6.

<!-- anchor: cmdoption-with-memory-sanitizer | type: std option -->
#### `--with-memory-sanitizer`

Enable MemorySanitizer allocation error detector, `msan` (default is no).

MSan reports false positives for memory initialized by libraries that are not built with MSan, so either build all dependencies with MSan or disable the extension modules that use them in `Modules/Setup.local`.

Added in version 3.6.

<!-- anchor: cmdoption-with-undefined-behavior-sanitizer | type: std option -->
#### `--with-undefined-behavior-sanitizer`

Enable UndefinedBehaviorSanitizer undefined behaviour detector, `ubsan` (default is no).

Added in version 3.6.

<!-- anchor: cmdoption-with-thread-sanitizer | type: std option -->
#### `--with-thread-sanitizer`

Enable ThreadSanitizer data race detector, `tsan` (default is no).

Added in version 3.13.

<!-- anchor: id15 | type: section -->
### 3.3.10. Linker options

<!-- anchor: cmdoption-enable-shared | type: std option -->
#### `--enable-shared`

Enable building a shared Python library: `libpython` (default is no).

<!-- anchor: cmdoption-without-static-libpython | type: std option -->
#### `--without-static-libpython`

Do not build `libpythonMAJOR.MINOR.a` and do not install `python.o` (built and enabled by default).

Added in version 3.10.

<!-- anchor: cmdoption-enable-static-libpython-for-interpreter | type: std option -->
#### `--enable-static-libpython-for-interpreter`

Do not link the Python interpreter binary (`python3`) against the shared Python library; instead, statically link the interpreter against `libpython` as if `--enable-shared` had not been used, but continue to build the shared `libpython` (for use by other programs).

This option does nothing if `--enable-shared` is not used.

The default (when `-enable-shared` is used) is to link the Python interpreter against the built shared library.

Added in version 3.15.

<!-- anchor: libraries-options | type: section -->
### 3.3.11. Libraries options

<!-- anchor: cmdoption-with-libs | type: std option -->
#### `--with-libs='lib1 ...'`

Link against additional libraries (default is no).

<!-- anchor: cmdoption-with-system-expat | type: std option -->
#### `--with-system-expat`

Build the `pyexpat` module using an installed `expat` library (default is no).

<!-- anchor: cmdoption-with-system-libmpdec | type: std option -->
#### `--with-system-libmpdec`

Build the `_decimal` extension module using an installed `mpdecimal` library, see the `decimal` module (default is yes).

Added in version 3.3.

Changed in version 3.13: Default to using the installed `mpdecimal` library.

Changed in version 3.15: A bundled copy of the library will no longer be selected implicitly if an installed `mpdecimal` library is not found. In Python 3.15 only, it can still be selected explicitly using `--with-system-libmpdec=no` or `--without-system-libmpdec`.

Deprecated since version 3.13, will be removed in version 3.16: A copy of the `mpdecimal` library sources will no longer be distributed with Python 3.16.

**See also:**

`LIBMPDEC_CFLAGS` and `LIBMPDEC_LIBS`.

<!-- anchor: cmdoption-with-readline | type: std option -->
#### `--with-readline=readline|editline`

Designate a backend library for the `readline` module.

- readline: Use readline as the backend.

- editline: Use editline as the backend.

Added in version 3.10.

<!-- anchor: cmdoption-without-readline | type: std option -->
#### `--without-readline`

Don’t build the `readline` module (built by default).

Don’t define the `HAVE_LIBREADLINE` macro.

Added in version 3.10.

<!-- anchor: cmdoption-with-libm | type: std option -->
#### `--with-libm=STRING`

Override `libm` math library to *STRING* (default is system-dependent).

<!-- anchor: cmdoption-with-libc | type: std option -->
#### `--with-libc=STRING`

Override `libc` C library to *STRING* (default is system-dependent).

<!-- anchor: cmdoption-with-openssl | type: std option -->
#### `--with-openssl=DIR`

Root of the OpenSSL directory.

Added in version 3.7.

<!-- anchor: cmdoption-with-openssl-rpath | type: std option -->
#### `--with-openssl-rpath=[no|auto|DIR]`

Set runtime library directory (rpath) for OpenSSL libraries:

- `no` (default): don’t set rpath;

- `auto`: auto-detect rpath from `--with-openssl` and `pkg-config`;

- *DIR*: set an explicit rpath.

Added in version 3.10.

<!-- anchor: security-options | type: section -->
### 3.3.12. Security Options

<!-- anchor: cmdoption-with-hash-algorithm | type: std option -->
#### `--with-hash-algorithm=[fnv|siphash13|siphash24]`

Select hash algorithm for use in `Python/pyhash.c`:

- `siphash13` (default);

- `siphash24`;

- `fnv`.

Added in version 3.4.

Added in version 3.11: `siphash13` is added and it is the new default.

<!-- anchor: cmdoption-with-builtin-hashlib-hashes | type: std option -->
#### `--with-builtin-hashlib-hashes=md5,sha1,sha256,sha512,sha3,blake2`

Built-in hash modules:

- `md5`;

- `sha1`;

- `sha256`;

- `sha512`;

- `sha3` (with shake);

- `blake2`.

Added in version 3.9.

<!-- anchor: cmdoption-with-ssl-default-suites | type: std option -->
#### `--with-ssl-default-suites=[python|openssl|STRING]`

Override the OpenSSL default cipher suites string:

- `python` (default): use Python’s preferred selection;

- `openssl`: leave OpenSSL’s defaults untouched;

- *STRING*: use a custom string

See the `ssl` module.

Added in version 3.7.

Changed in version 3.10: The settings `python` and *STRING* also set TLS 1.2 as minimum protocol version.

<!-- anchor: cmdoption-disable-safety | type: std option -->
#### `--disable-safety`

Disable compiler options that are recommended by OpenSSF for security reasons with no performance overhead. If this option is not enabled, CPython will be built based on safety compiler options with no slow down. When this option is enabled, CPython will not be built with the compiler options listed below.

The following compiler options are disabled with `--disable-safety`:

- -fstack-protector-strong: Enable run-time checks for stack-based buffer overflows.

- -Wtrampolines: Enable warnings about trampolines that require executable stacks.

Added in version 3.14.

<!-- anchor: cmdoption-enable-slower-safety | type: std option -->
#### `--enable-slower-safety`

Enable compiler options that are recommended by OpenSSF for security reasons which require overhead. If this option is not enabled, CPython will not be built based on safety compiler options which performance impact. When this option is enabled, CPython will be built with the compiler options listed below.

The following compiler options are enabled with `--enable-slower-safety`:

- -D_FORTIFY_SOURCE=3: Fortify sources with compile- and run-time checks for unsafe libc usage and buffer overflows.

Added in version 3.14.

<!-- anchor: macos-options | type: section -->
### 3.3.13. macOS Options

See Mac/README.rst.

<!-- anchor: cmdoption-enable-universalsdk | type: std option -->
#### `--enable-universalsdk`

<!-- anchor: cmdoption-0 | type: std option -->
#### `--enable-universalsdk=SDKDIR`

Create a universal binary build. *SDKDIR* specifies which macOS SDK should be used to perform the build (default is no).

<!-- anchor: cmdoption-enable-framework | type: std option -->
#### `--enable-framework`

<!-- anchor: cmdoption-1 | type: std option -->
#### `--enable-framework=INSTALLDIR`

Create a Python.framework rather than a traditional Unix install. Optional *INSTALLDIR* specifies the installation path (default is no).

<!-- anchor: cmdoption-with-universal-archs | type: std option -->
#### `--with-universal-archs=ARCH`

Specify the kind of universal binary that should be created. This option is only valid when `--enable-universalsdk` is set.

Options:

- `universal2` (x86-64 and arm64);

- `32-bit` (PPC and i386);

- `64-bit` (PPC64 and x86-64);

- `3-way` (i386, PPC and x86-64);

- `intel` (i386 and x86-64);

- `intel-32` (i386);

- `intel-64` (x86-64);

- `all` (PPC, i386, PPC64 and x86-64).

Note that values for this configuration item are *not* the same as the identifiers used for universal binary wheels on macOS. See the Python Packaging User Guide for details on the packaging platform compatibility tags used on macOS

<!-- anchor: cmdoption-with-framework-name | type: std option -->
#### `--with-framework-name=FRAMEWORK`

Specify the name for the python framework on macOS only valid when `--enable-framework` is set (default: `Python`).

<!-- anchor: cmdoption-with-app-store-compliance | type: std option -->
#### `--with-app-store-compliance`

<!-- anchor: cmdoption-2 | type: std option -->
#### `--with-app-store-compliance=PATCH-FILE`

The Python standard library contains strings that are known to trigger automated inspection tool errors when submitted for distribution by the macOS and iOS App Stores. If enabled, this option will apply the list of patches that are known to correct app store compliance. A custom patch file can also be specified. This option is disabled by default.

Added in version 3.13.

<!-- anchor: ios-options | type: section -->
### 3.3.14. iOS Options

See Platforms/Apple/iOS/README.md.

<!-- anchor: cmdoption-3 | type: std option -->
#### `--enable-framework=INSTALLDIR`

Create a Python.framework. Unlike macOS, the *INSTALLDIR* argument specifying the installation path is mandatory.

<!-- anchor: cmdoption-4 | type: std option -->
#### `--with-framework-name=FRAMEWORK`

Specify the name for the framework (default: `Python`).

<!-- anchor: cross-compiling-options | type: section -->
### 3.3.15. Cross Compiling Options

Cross compiling, also known as cross building, can be used to build Python for another CPU architecture or platform. Cross compiling requires a Python interpreter for the build platform. The version of the build Python must match the version of the cross compiled host Python.

<!-- anchor: cmdoption-build | type: std option -->
#### `--build=BUILD`

configure for building on BUILD, usually guessed by **config.guess**.

<!-- anchor: cmdoption-host | type: std option -->
#### `--host=HOST`

cross-compile to build programs to run on HOST (target platform)

<!-- anchor: cmdoption-with-build-python | type: std option -->
#### `--with-build-python=path/to/python`

path to build `python` binary for cross compiling

Added in version 3.11.

<!-- anchor: cmdoption-arg-CONFIG_SITE | type: std option -->
#### `CONFIG_SITE=file`

An environment variable that points to a file with configure overrides.

Example *config.site* file:

```ini
# config.site-aarch64
ac_cv_buggy_getaddrinfo=no
ac_cv_file__dev_ptmx=yes
ac_cv_file__dev_ptc=no
```

<!-- anchor: cmdoption-arg-HOSTRUNNER | type: std option -->
#### `HOSTRUNNER`

Program to run CPython for the host platform for cross-compilation.

Added in version 3.11.

Cross compiling example:

```sh
CONFIG_SITE=config.site-aarch64 ../configure \
    --build=x86_64-pc-linux-gnu \
    --host=aarch64-unknown-linux-gnu \
    --with-build-python=../x86_64/python
```

<!-- anchor: python-build-system | type: section -->
## 3.4. Python Build System

<!-- anchor: main-files-of-the-build-system | type: section -->
### 3.4.1. Main files of the build system

- `configure.ac` => `configure`;

- `Makefile.pre.in` => `Makefile` (created by `configure`);

- `pyconfig.h` (created by `configure`);

- `Modules/Setup`: C extensions built by the Makefile using `Module/makesetup` shell script;

<!-- anchor: main-build-steps | type: section -->
### 3.4.2. Main build steps

- C files (`.c`) are built as object files (`.o`).

- A static `libpython` library (`.a`) is created from objects files.

- `python.o` and the static `libpython` library are linked into the final `python` program.

- C extensions are built by the Makefile (see `Modules/Setup`).

<!-- anchor: main-makefile-targets | type: section -->
### 3.4.3. Main Makefile targets

<!-- anchor: make | type: section -->
#### 3.4.3.1. make

For the most part, when rebuilding after editing some code or refreshing your checkout from upstream, all you need to do is execute `make`, which (per Make’s semantics) builds the default target, the first one defined in the Makefile. By tradition (including in the CPython project) this is usually the `all` target. The `configure` script expands an `autoconf` variable, `@DEF_MAKE_ALL_RULE@` to describe precisely which targets `make all` will build. The three choices are:

- `profile-opt` (configured with `--enable-optimizations`)

- `build_wasm` (chosen if the host platform matches `wasm32-wasi*` or `wasm32-emscripten`)

- `build_all` (configured without explicitly using either of the others)

Depending on the most recent source file changes, Make will rebuild any targets (object files and executables) deemed out-of-date, including running `configure` again if necessary. Source/target dependencies are many and maintained manually however, so Make sometimes doesn’t have all the information necessary to correctly detect all targets which need to be rebuilt. Depending on which targets aren’t rebuilt, you might experience a number of problems. If you have build or test problems which you can’t otherwise explain, `make clean && make` should work around most dependency problems, at the expense of longer build times.

<!-- anchor: make-platform | type: section -->
#### 3.4.3.2. make platform

Build the `python` program, but don’t build the standard library extension modules. This generates a file named `platform` which contains a single line describing the details of the build platform, e.g., `macosx-14.3-arm64-3.12` or `linux-x86_64-3.13`.

<!-- anchor: make-profile-opt | type: section -->
#### 3.4.3.3. make profile-opt

Build Python using profile-guided optimization (PGO). You can use the configure `--enable-optimizations` option to make this the default target of the `make` command (`make all` or just `make`).

<!-- anchor: make-clean | type: section -->
#### 3.4.3.4. make clean

Remove built files.

<!-- anchor: make-distclean | type: section -->
#### 3.4.3.5. make distclean

In addition to the work done by `make clean`, remove files created by the configure script. `configure` will have to be run before building again. [7]

<!-- anchor: make-install | type: section -->
#### 3.4.3.6. make install

Build the `all` target and install Python.

<!-- anchor: make-test | type: section -->
#### 3.4.3.7. make test

Build the `all` target and run the Python test suite with the `--fast-ci` option without GUI tests. Variables:

- `TESTOPTS`: additional regrtest command-line options.

- `TESTPYTHONOPTS`: additional Python command-line options.

- `TESTTIMEOUT`: timeout in seconds (default: 10 minutes).

<!-- anchor: make-ci | type: section -->
#### 3.4.3.8. make ci

This is similar to `make test`, but uses the `-ugui` to also run GUI tests.

Added in version 3.14.

<!-- anchor: make-buildbottest | type: section -->
#### 3.4.3.9. make buildbottest

This is similar to `make test`, but uses the `--slow-ci` option and default timeout of 20 minutes, instead of `--fast-ci` option.

<!-- anchor: make-regen-all | type: section -->
#### 3.4.3.10. make regen-all

Regenerate (almost) all generated files. These include (but are not limited to) bytecode cases, and parser generator file. `make regen-stdlib-module-names` and `autoconf` must be run separately for the remaining generated files.

<!-- anchor: c-extensions | type: section -->
### 3.4.4. C extensions

Some C extensions are built as built-in modules, like the `sys` module. They are built with the `Py_BUILD_CORE_BUILTIN` macro defined. Built-in modules have no `__file__` attribute:

```pycon
>>> import sys
>>> sys
<module 'sys' (built-in)>
>>> sys.__file__
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: module 'sys' has no attribute '__file__'
```

Other C extensions are built as dynamic libraries, like the `_asyncio` module. They are built with the `Py_BUILD_CORE_MODULE` macro defined. Example on Linux x86-64:

```pycon
>>> import _asyncio
>>> _asyncio
<module '_asyncio' from '/usr/lib64/python3.9/lib-dynload/_asyncio.cpython-39-x86_64-linux-gnu.so'>
>>> _asyncio.__file__
'/usr/lib64/python3.9/lib-dynload/_asyncio.cpython-39-x86_64-linux-gnu.so'
```

`Modules/Setup` is used to generate Makefile targets to build C extensions. At the beginning of the files, C extensions are built as built-in modules. Extensions defined after the `*shared*` marker are built as dynamic libraries.

The `PyAPI_FUNC()`, `PyAPI_DATA()` and `PyMODINIT_FUNC` macros of `Include/exports.h` are defined differently depending if the `Py_BUILD_CORE_MODULE` macro is defined:

- Use `Py_EXPORTED_SYMBOL` if the `Py_BUILD_CORE_MODULE` is defined

- Use `Py_IMPORTED_SYMBOL` otherwise.

If the `Py_BUILD_CORE_BUILTIN` macro is used by mistake on a C extension built as a shared library, its `PyInit_xxx()` function is not exported, causing an `ImportError` on import.

<!-- anchor: compiler-and-linker-flags | type: section -->
## 3.5. Compiler and linker flags

Options set by the `./configure` script and environment variables and used by `Makefile`.

<!-- anchor: preprocessor-flags | type: section -->
### 3.5.1. Preprocessor flags

<!-- anchor: envvar-CONFIGURE_CPPFLAGS | type: std envvar -->
#### `CONFIGURE_CPPFLAGS`

Value of `CPPFLAGS` variable passed to the `./configure` script.

Added in version 3.6.

<!-- anchor: envvar-CPPFLAGS | type: std envvar -->
#### `CPPFLAGS`

(Objective) C/C++ preprocessor flags, e.g. `-Iinclude_dir` if you have headers in a nonstandard directory *include_dir*.

Both `CPPFLAGS` and `LDFLAGS` need to contain the shell’s value to be able to build extension modules using the directories specified in the environment variables.

<!-- anchor: envvar-BASECPPFLAGS | type: std envvar -->
#### `BASECPPFLAGS`

Added in version 3.4.

<!-- anchor: envvar-PY_CPPFLAGS | type: std envvar -->
#### `PY_CPPFLAGS`

Extra preprocessor flags added for building the interpreter object files.

Default: `$(BASECPPFLAGS) -I. -I$(srcdir)/Include $(CONFIGURE_CPPFLAGS) $(CPPFLAGS)`.

Added in version 3.2.

<!-- anchor: compiler-flags | type: section -->
### 3.5.2. Compiler flags

<!-- anchor: envvar-CC | type: std envvar -->
#### `CC`

C compiler command.

Example: `gcc -pthread`.

<!-- anchor: envvar-CXX | type: std envvar -->
#### `CXX`

C++ compiler command.

Example: `g++ -pthread`.

<!-- anchor: envvar-CFLAGS | type: std envvar -->
#### `CFLAGS`

C compiler flags.

<!-- anchor: envvar-CFLAGS_NODIST | type: std envvar -->
#### `CFLAGS_NODIST`

`CFLAGS_NODIST` is used for building the interpreter and stdlib C extensions. Use it when a compiler flag should *not* be part of `CFLAGS` once Python is installed (gh-65320).

In particular, `CFLAGS` should not contain:

- the compiler flag `-I` (for setting the search path for include files). The `-I` flags are processed from left to right, and any flags in `CFLAGS` would take precedence over user- and package-supplied `-I` flags.

- hardening flags such as `-Werror` because distributions cannot control whether packages installed by users conform to such heightened standards.

Added in version 3.5.

<!-- anchor: envvar-COMPILEALL_OPTS | type: std envvar -->
#### `COMPILEALL_OPTS`

Options passed to the `compileall` command line when building PYC files in `make install`. Default: `-j0`.

Added in version 3.12.

<!-- anchor: envvar-EXTRA_CFLAGS | type: std envvar -->
#### `EXTRA_CFLAGS`

Extra C compiler flags.

<!-- anchor: envvar-CONFIGURE_CFLAGS | type: std envvar -->
#### `CONFIGURE_CFLAGS`

Value of `CFLAGS` variable passed to the `./configure` script.

Added in version 3.2.

<!-- anchor: envvar-CONFIGURE_CFLAGS_NODIST | type: std envvar -->
#### `CONFIGURE_CFLAGS_NODIST`

Value of `CFLAGS_NODIST` variable passed to the `./configure` script.

Added in version 3.5.

<!-- anchor: envvar-BASECFLAGS | type: std envvar -->
#### `BASECFLAGS`

Base compiler flags.

<!-- anchor: envvar-OPT | type: std envvar -->
#### `OPT`

Optimization flags.

<!-- anchor: envvar-CFLAGS_ALIASING | type: std envvar -->
#### `CFLAGS_ALIASING`

Strict or non-strict aliasing flags used to compile `Python/dtoa.c`.

Added in version 3.7.

<!-- anchor: envvar-CFLAGS_CEVAL | type: std envvar -->
#### `CFLAGS_CEVAL`

Flags used to compile `Python/ceval.c`.

Added in version 3.14.5.

<!-- anchor: envvar-CCSHARED | type: std envvar -->
#### `CCSHARED`

Compiler flags used to build a shared library.

For example, `-fPIC` is used on Linux and on BSD.

<!-- anchor: envvar-CFLAGSFORSHARED | type: std envvar -->
#### `CFLAGSFORSHARED`

Extra C flags added for building the interpreter object files.

Default: `$(CCSHARED)` when `--enable-shared` is used, or an empty string otherwise.

<!-- anchor: envvar-PY_CFLAGS | type: std envvar -->
#### `PY_CFLAGS`

Default: `$(BASECFLAGS) $(OPT) $(CONFIGURE_CFLAGS) $(CFLAGS) $(EXTRA_CFLAGS)`.

<!-- anchor: envvar-PY_CFLAGS_NODIST | type: std envvar -->
#### `PY_CFLAGS_NODIST`

Default: `$(CONFIGURE_CFLAGS_NODIST) $(CFLAGS_NODIST) -I$(srcdir)/Include/internal`.

Added in version 3.5.

<!-- anchor: envvar-PY_STDMODULE_CFLAGS | type: std envvar -->
#### `PY_STDMODULE_CFLAGS`

C flags used for building the interpreter object files.

Default: `$(PY_CFLAGS) $(PY_CFLAGS_NODIST) $(PY_CPPFLAGS) $(CFLAGSFORSHARED)`.

Added in version 3.7.

<!-- anchor: envvar-PY_CORE_CFLAGS | type: std envvar -->
#### `PY_CORE_CFLAGS`

Default: `$(PY_STDMODULE_CFLAGS) -DPy_BUILD_CORE`.

Added in version 3.2.

<!-- anchor: envvar-PY_BUILTIN_MODULE_CFLAGS | type: std envvar -->
#### `PY_BUILTIN_MODULE_CFLAGS`

Compiler flags to build a standard library extension module as a built-in module, like the `posix` module.

Default: `$(PY_STDMODULE_CFLAGS) -DPy_BUILD_CORE_BUILTIN`.

Added in version 3.8.

<!-- anchor: envvar-PURIFY | type: std envvar -->
#### `PURIFY`

Purify command. Purify is a memory debugger program.

Default: empty string (not used).

<!-- anchor: linker-flags | type: section -->
### 3.5.3. Linker flags

<!-- anchor: envvar-LINKCC | type: std envvar -->
#### `LINKCC`

Linker command used to build programs like `python` and `_testembed`.

Default: `$(PURIFY) $(CC)`.

<!-- anchor: envvar-CONFIGURE_LDFLAGS | type: std envvar -->
#### `CONFIGURE_LDFLAGS`

Value of `LDFLAGS` variable passed to the `./configure` script.

Avoid assigning `CFLAGS`, `LDFLAGS`, etc. so users can use them on the command line to append to these values without stomping the pre-set values.

Added in version 3.2.

<!-- anchor: envvar-LDFLAGS_NODIST | type: std envvar -->
#### `LDFLAGS_NODIST`

`LDFLAGS_NODIST` is used in the same manner as `CFLAGS_NODIST`. Use it when a linker flag should *not* be part of `LDFLAGS` once Python is installed (gh-65320).

In particular, `LDFLAGS` should not contain:

- the compiler flag `-L` (for setting the search path for libraries). The `-L` flags are processed from left to right, and any flags in `LDFLAGS` would take precedence over user- and package-supplied `-L` flags.

<!-- anchor: envvar-CONFIGURE_LDFLAGS_NODIST | type: std envvar -->
#### `CONFIGURE_LDFLAGS_NODIST`

Value of `LDFLAGS_NODIST` variable passed to the `./configure` script.

Added in version 3.8.

<!-- anchor: envvar-LDFLAGS | type: std envvar -->
#### `LDFLAGS`

Linker flags, e.g. `-Llib_dir` if you have libraries in a nonstandard directory *lib_dir*.

Both `CPPFLAGS` and `LDFLAGS` need to contain the shell’s value to be able to build extension modules using the directories specified in the environment variables.

Please consider using `EXE_LDFLAGS` if the supplied linker flags are executable specific, e.g. GCC’s `-pie` flag.

<!-- anchor: envvar-LIBS | type: std envvar -->
#### `LIBS`

Linker flags to pass libraries to the linker when linking the Python executable.

Example: `-lrt`.

<!-- anchor: envvar-LDSHARED | type: std envvar -->
#### `LDSHARED`

Command to build a shared library.

Default: `@LDSHARED@ $(PY_LDFLAGS)`.

<!-- anchor: envvar-BLDSHARED | type: std envvar -->
#### `BLDSHARED`

Command to build `libpython` shared library.

Default: `@BLDSHARED@ $(PY_CORE_LDFLAGS)`.

<!-- anchor: envvar-PY_LDFLAGS | type: std envvar -->
#### `PY_LDFLAGS`

Default: `$(CONFIGURE_LDFLAGS) $(LDFLAGS)`.

<!-- anchor: envvar-PY_LDFLAGS_NODIST | type: std envvar -->
#### `PY_LDFLAGS_NODIST`

Default: `$(CONFIGURE_LDFLAGS_NODIST) $(LDFLAGS_NODIST)`.

Added in version 3.8.

<!-- anchor: envvar-PY_CORE_LDFLAGS | type: std envvar -->
#### `PY_CORE_LDFLAGS`

Linker flags used for building the interpreter object files.

Added in version 3.8.

<!-- anchor: envvar-EXE_LDFLAGS | type: std envvar -->
#### `EXE_LDFLAGS`

Linker flags used for building executable targets such as the interpreter. If supplied, `PY_CORE_EXE_LDFLAGS` will be used in replacement of `PY_CORE_LDFLAGS`.

Added in version 3.15.

<!-- anchor: envvar-CONFIGURE_EXE_LDFLAGS | type: std envvar -->
#### `CONFIGURE_EXE_LDFLAGS`

Value of `EXE_LDFLAGS` variable passed to the `./configure` script.

Added in version 3.15.

<!-- anchor: envvar-PY_CORE_EXE_LDFLAGS | type: std envvar -->
#### `PY_CORE_EXE_LDFLAGS`

Linker flags used for building the interpreter and executable targets.

Default: `$(PY_CORE_LDFLAGS)`

Added in version 3.15.

**Footnotes**

[7]

`git clean -fdx` is an even more extreme way to “clean” your checkout. It removes all files not known to Git. When bug hunting using `git bisect`, this is recommended between probes to guarantee a completely clean build. **Use with care**, as it will delete all files not checked into Git, including your new, uncommitted work.
