---
page: library/site.html
title: site — Site-specific configuration hook
area: library
kind: guide
module: site
---

<!-- anchor: module-site | type: section -->
# `site` — Site-specific configuration hook

**Source code:** Lib/site.py

**This module is automatically imported during initialization.** The automatic import can be suppressed using the interpreter’s `-S` option.

Importing this module normally appends site-specific paths to the module search path and adds callables, including `help()` to the built-in namespace. However, Python startup option `-S` blocks this, and this module can be safely imported with no automatic modifications to the module search path or additions to the builtins. To explicitly trigger the usual site-specific additions, call the `main()` function.

Changed in version 3.3: Importing the module used to trigger paths manipulation even when using `-S`.

It starts by constructing up to four directories from a head and a tail part. For the head part, it uses `sys.prefix` and `sys.exec_prefix`; empty heads are skipped. For the tail part, it uses the empty string and then `lib/site-packages` (on Windows) or `lib/pythonX.Y[t]/site-packages` (on Unix and macOS). (The optional suffix “t” indicates the free-threaded build, and is appended if `"t"` is present in the `sys.abiflags` constant.) For each of the distinct head-tail combinations, it sees if it refers to an existing directory, and if so, adds it to `sys.path` and also inspects the newly added path for configuration files.

Changed in version 3.5: Support for the “site-python” directory has been removed.

Changed in version 3.13: On Unix, Free threading Python installations are identified by the “t” suffix in the version-specific directory name, such as `lib/python3.13t/`.

Changed in version 3.14: `site` is no longer responsible for updating `sys.prefix` and `sys.exec_prefix` on Virtual Environments. This is now done during the path initialization. As a result, under Virtual Environments, `sys.prefix` and `sys.exec_prefix` no longer depend on the `site` initialization, and are therefore unaffected by `-S`.

When running under a virtual environment, the `pyvenv.cfg` file in `sys.prefix` is checked for site-specific configurations. If the `include-system-site-packages` key exists and is set to `true` (case-insensitive), the system-level prefixes will be searched for site-packages, otherwise they won’t. If the system-level prefixes are not searched then the user site prefixes are also implicitly not searched for site-packages.

The `site` module recognizes two startup configuration files of the form `name.pth` for path configurations, and `name.start` for pre-first-line code execution. Both files can exist in one of the four directories mentioned above. Within each directory, these files are sorted alphabetically by filename, then parsed in sorted order.

<!-- anchor: path-extensions-pth-files | type: section -->
## Path extensions (`.pth` files)

`name.pth` contains additional items (one per line) to be appended to `sys.path`. Items that name non-existing directories are never added to `sys.path`, and no check is made that the item refers to a directory rather than a file. No item is added to `sys.path` more than once. Blank lines and lines beginning with `#` are skipped.

For backward compatibility, lines starting with `import` (followed by space or tab) are executed with `exec()`.

Changed in version 3.13: The `.pth` files are now decoded by UTF-8 at first and then by the locale encoding if it fails.

Changed in version 3.15: `.pth` file lines starting with `import` are deprecated. During the deprecation period, such lines are still executed (except in the case below), but a diagnostic message is emitted only when the `-v` flag is given.

`import` lines in `name.pth` are silently ignored when a matching `name.start` file exists.

Errors on individual lines no longer abort processing of the rest of the file. Each error is reported and the remaining lines continue to be processed.

Deprecated since version 3.15, will be removed in version 3.20: Decoding `name.pth` files in any encoding other than `utf-8-sig` is deprecated in Python 3.15, and support for decoding from the locale encoding will be removed in Python 3.20.

`import` lines in `name.pth` files are deprecated and will be silently ignored in Python 3.18 and 3.19. In Python 3.20 a warning will be produced for `import` lines in `name.pth` files.

<!-- anchor: startup-entry-points-start-files | type: section -->
## Startup entry points (`.start` files)

Added in version 3.15.

A startup entry point file is a file whose name has the form `name.start` and exists in one of the site-packages directories described above. Each file specifies entry points to be called during interpreter startup, using the `pkg.mod:callable` syntax understood by `pkgutil.resolve_name()`.

Each non-blank line that does not begin with `#` must contain an entry point reference in the form `pkg.mod:callable`. The colon and callable portion are mandatory. Each callable is invoked with no arguments, and any return value is discarded.

`.start` files are processed after all `.pth` path extensions have been applied to `sys.path`, ensuring that paths are available before any startup code runs.

Unlike `sys.path` extensions from `.pth` files, duplicate entry points are **not** de-duplicated — if an entry point appears more than once, it will be called more than once.

If an exception occurs during resolution or invocation of an entry point, a traceback is printed to `sys.stderr` and processing continues with the remaining entry points.

`.start` files must be encoded in UTF-8.

**PEP 829** defined the original specification for these features.

**Note:**

If a `name.start` file exists alongside a `name.pth` file with the same base name, any `import` lines in the `.pth` file are ignored in favor of the entry points in the `.start` file.

**Note:**

Executable lines (`import` lines in `name.pth` files and `name.start` file entry points) are always run at Python startup (unless `-S` is given to disable the `site.py` module entirely), regardless of whether a particular module is actually going to be used.

**Note:**

`name.start` files invoke `pkgutil.resolve_name()` with `strict=True`, which requires the full `pkg.mod:callable` form.

<!-- anchor: startup-file-examples | type: section -->
## Startup file examples

For example, suppose `sys.prefix` and `sys.exec_prefix` are set to `/usr/local`. The Python X.Y library is then installed in `/usr/local/lib/pythonX.Y`. Suppose this has a subdirectory `/usr/local/lib/pythonX.Y/site-packages` with three sub-subdirectories, `foo`, `bar` and `spam`, and two path configuration files, `foo.pth` and `bar.pth`. Assume `foo.pth` contains the following:

```
# foo package configuration

foo
bar
bletch
```

and `bar.pth` contains:

```
# bar package configuration

bar
```

Then the following version-specific directories are added to `sys.path`, in this order:

```
/usr/local/lib/pythonX.Y/site-packages/bar
/usr/local/lib/pythonX.Y/site-packages/foo
```

Note that `bletch` is omitted because it doesn’t exist; the `bar` directory precedes the `foo` directory because `bar.pth` comes alphabetically before `foo.pth`; and `spam` is omitted because it is not mentioned in either path configuration file.

Let’s say that there is also a `foo.start` file containing the following:

```
# foo package startup code

foo.submod:initialize
```

Now, after `sys.path` has been extended as above, and before Python turns control over to user code, the `foo.submod` module is imported and the `initialize()` function from that module is called.

<!-- anchor: migrating-from-import-lines-in-pth-files-to-start-files | type: section -->
## Migrating from `import` lines in `.pth` files to `.start` files

If your package currently ships a `name.pth` file, you can keep all `sys.path` extension lines unchanged. Only `import` lines need to be migrated.

To migrate, create a callable (taking zero arguments) within an importable module in your package. Reference it as a `pkg.mod:callable` entry point in a matching `name.start` file. Move everything on your `import` line after the first semi-colon into the `callable()` function.

If your package must straddle older Pythons that do not support **PEP 829** and newer Pythons that do, change the `import` lines in your `name.pth` to use the following form:

```python
import pkg.mod; pkg.mod.callable()
```

Older Pythons will execute these `import` lines, while newer Pythons will ignore them in favor of the `name.start` file. After the straddling period, remove all `import` lines from your `.pth` files.

<!-- anchor: module-sitecustomize | type: section -->
## `sitecustomize`

After these path manipulations, an attempt is made to import a module named `sitecustomize`, which can perform arbitrary site-specific customizations. It is typically created by a system administrator in the site-packages directory. If this import fails with an `ImportError` or its subclass exception, and the exception’s `name` attribute equals `'sitecustomize'`, it is silently ignored. If Python is started without output streams available, as with `pythonw.exe` on Windows (which is used by default to start IDLE), attempted output from `sitecustomize` is ignored. Any other exception causes a silent and perhaps mysterious failure of the process.

<!-- anchor: module-usercustomize | type: section -->
## `usercustomize`

After this, an attempt is made to import a module named `usercustomize`, which can perform arbitrary user-specific customizations, if `ENABLE_USER_SITE` is true. This file is intended to be created in the user site-packages directory (see below), which is part of `sys.path` unless disabled by `-s`. If this import fails with an `ImportError` or its subclass exception, and the exception’s `name` attribute equals `'usercustomize'`, it is silently ignored.

Note that for some non-Unix systems, `sys.prefix` and `sys.exec_prefix` are empty, and the path manipulations are skipped; however the import of `sitecustomize` and `usercustomize` is still attempted.

<!-- anchor: readline-configuration | type: section -->
## Readline configuration

On systems that support `readline`, this module will also import and configure the `rlcompleter` module, if Python is started in interactive mode and without the `-S` option. The default behavior is to enable tab completion and to use `~/.python_history` as the history save file. To disable it, delete (or override) the `sys.__interactivehook__` attribute in your `sitecustomize` or `usercustomize` module or your `PYTHONSTARTUP` file.

Changed in version 3.4: Activation of rlcompleter and history was made automatic.

<!-- anchor: module-contents | type: section -->
## Module contents

<!-- anchor: site.PREFIXES | type: py data -->
### `site.PREFIXES`

A list of prefixes for site-packages directories.

<!-- anchor: site.ENABLE_USER_SITE | type: py data -->
### `site.ENABLE_USER_SITE`

Flag showing the status of the user site-packages directory. `True` means that it is enabled and was added to `sys.path`. `False` means that it was disabled by user request (with `-s` or `PYTHONNOUSERSITE`). `None` means it was disabled for security reasons (mismatch between user or group id and effective id) or by an administrator.

<!-- anchor: site.USER_SITE | type: py data -->
### `site.USER_SITE`

Path to the user site-packages for the running Python. Can be `None` if `getusersitepackages()` hasn’t been called yet. Default value is `~/.local/lib/pythonX.Y[t]/site-packages` for UNIX and non-framework macOS builds, `~/Library/Python/X.Y/lib/python/site-packages` for macOS framework builds, and `%APPDATA%\Python\PythonXY\site-packages` on Windows. The optional “t” indicates the free-threaded build. This directory is a site directory, which means that `.pth` files in it will be processed.

<!-- anchor: site.USER_BASE | type: py data -->
### `site.USER_BASE`

Path to the base directory for the user site-packages. Can be `None` if `getuserbase()` hasn’t been called yet. Default value is `~/.local` for UNIX and macOS non-framework builds, `~/Library/Python/X.Y` for macOS framework builds, and `%APPDATA%\Python` for Windows. This value is used to compute the installation directories for scripts, data files, Python modules, etc. for the user installation scheme. See also `PYTHONUSERBASE`.

<!-- anchor: site.main | type: py function -->
### `site.main()`

Adds all the standard site-specific directories to the module search path. This function is called automatically when this module is imported, unless the Python interpreter was started with the `-S` flag.

Changed in version 3.3: This function used to be called unconditionally.

<!-- anchor: site.makepath | type: py function -->
### `site.makepath(*paths)`

Join *paths* with `os.path.join()`, attempt to make the result absolute with `os.path.abspath()`, and return a 2-tuple containing the absolute path and its case-normalized form as produced by `os.path.normcase()`. If `os.path.abspath()` raises `OSError`, the joined path is used unchanged for the case-normalization step.

The second element of the returned tuple is the form used throughout the `site` module to compare paths on case-insensitive file systems, and is what populates the `known_paths` sets that prevent duplicate `sys.path` entries in various APIs within this module.

<!-- anchor: site.StartupState | type: py class -->
### `class site.StartupState(known_paths=None)`

Instances of this class accumulate interpreter startup configuration data from one or more site directories. They are the preferred interface for batching the processing of `.pth` and `.start` files across multiple site directories, so that every `sys.path` extension is visible before any startup code runs.

The optional *known_paths* argument is a set of case-normalized paths (which can be produced by `makepath()`) used to prevent duplicate `sys.path` entries. When `None` (the default), the set is built from the current `sys.path`. `main()` implicitly uses an instance of this class.

Typical use:

```python
state = site.StartupState()
for sitedir in site_dirs:
    state.addsitedir(sitedir)
state.process()
```

Added in version 3.15.

<!-- anchor: site.StartupState.addsitedir | type: py method -->
#### `addsitedir(sitedir)`

Read the `.pth` and `.start` files in *sitedir* and record their `sys.path` extensions, deprecated `.pth` `import` lines, and `.start` entry points on this state. The recorded data is not applied until `process()` is called.

<!-- anchor: site.StartupState.addusersitepackages | type: py method -->
#### `addusersitepackages()`

Add the per-user site-packages directory, if enabled and if it exists. The directory’s startup data is accumulated for later processing by `process()`.

<!-- anchor: site.StartupState.addsitepackages | type: py method -->
#### `addsitepackages(prefixes=None)`

Add global site-packages directories, computed from *prefixes* or from the global `PREFIXES` when *prefixes* is `None`. Each directory’s startup data is accumulated for later processing by `process()`.

<!-- anchor: site.StartupState.process | type: py method -->
#### `process()`

Apply the accumulated state by first adding the path extensions to `sys.path`, then executing the `.start` file entry points and `.pth` file `import` lines (deprecated).

This method is not idempotent and must not be called more than once on the same instance. Doing so will apply the accumulated state more than once, re-running entry points and `import` lines.

<!-- anchor: site.addsitedir | type: py function -->
### `site.addsitedir(sitedir, known_paths=None)`

Add a directory to sys.path and parse the `.pth` and `.start` files found in that directory. Typically used in `sitecustomize` or `usercustomize` (see above).

The *known_paths* argument is an optional set of case-normalized paths used to prevent duplicate `sys.path` entries. When `None` (the default), the set is built from the current `sys.path`.

For batched processing across multiple site directories, build a `StartupState` explicitly and call `StartupState.addsitedir()` on it; that defers `.pth` and `.start` processing until a single `StartupState.process()` call, ensuring every `sys.path` extension is visible before any startup code runs.

Changed in version 3.15: Also processes `.start` files. See Startup entry points (.start files).

<!-- anchor: site.getsitepackages | type: py function -->
### `site.getsitepackages(prefixes=None)`

Return a list containing all global site-packages directories.

For each directory given in *prefixes* (or `PREFIXES` if *prefixes* is `None`), this function will compute its site-packages subdirectory depending on the system environment, and will return a list of full paths, which are not checked for existence.

Added in version 3.2.

Changed in version 3.3: Added the optional *prefixes* parameter.

<!-- anchor: site.getuserbase | type: py function -->
### `site.getuserbase()`

Return the path of the user base directory, `USER_BASE`. If it is not initialized yet, this function will also set it, respecting `PYTHONUSERBASE`.

Added in version 3.2.

<!-- anchor: site.getusersitepackages | type: py function -->
### `site.getusersitepackages()`

Return the path of the user-specific site-packages directory, `USER_SITE`. If it is not initialized yet, this function will also set it, respecting `USER_BASE`. To determine if the user-specific site-packages was added to `sys.path` `ENABLE_USER_SITE` should be used.

Added in version 3.2.

<!-- anchor: command-line-interface | type: section -->
## Command-line interface

The `site` module also provides a way to get the user directories from the command line:

```shell-session
$ python -m site --user-site
/home/user/.local/lib/python3.11/site-packages
```

If it is called without arguments, it will print the contents of `sys.path` on the standard output, followed by the value of `USER_BASE` and whether the directory exists, then the same thing for `USER_SITE`, and finally the value of `ENABLE_USER_SITE`.

<!-- anchor: cmdoption-site-user-base | type: std option -->
### `--user-base`

Print the path to the user base directory.

<!-- anchor: cmdoption-site-user-site | type: std option -->
### `--user-site`

Print the path to the user site-packages directory.

If both options are given, user base and user site will be printed (always in this order), separated by `os.pathsep`.

If any option is given, the script will exit with one of these values: `0` if the user site-packages directory is enabled, `1` if it was disabled by the user, `2` if it is disabled for security reasons or by an administrator, and a value greater than 2 if there is an error.

**See also:**

- **PEP 370** – Per user site-packages directory

- **PEP 829** – Startup entry points and the deprecation of import lines in `.pth` files

- The initialization of the sys.path module search path – The initialization of `sys.path`.
