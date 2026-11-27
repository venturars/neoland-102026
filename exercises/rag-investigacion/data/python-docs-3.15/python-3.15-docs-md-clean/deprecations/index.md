# Deprecations

## Pending removal in Python 3.16

- The import system:

  - Setting `__loader__` on a module while
    failing to set `__spec__.loader`
    is deprecated. In Python 3.16, `__loader__` will cease to be set or
    taken into consideration by the import system or the standard library.
- `array`:

  - The `'u'` format code (`wchar_t`)
    has been deprecated in documentation since Python 3.3
    and at runtime since Python 3.13.
    Use the `'w'` format code (`Py_UCS4`)
    for Unicode characters instead.
- `asyncio`:

  - `asyncio.iscoroutinefunction()` is deprecated
    and will be removed in Python 3.16;
    use `inspect.iscoroutinefunction()` instead.
    (Contributed by Jiahao Li and Kumar Aditya in gh-122875.)
  - `asyncio` policy system is deprecated and will be removed in Python 3.16.
    In particular, the following classes and functions are deprecated:

    - `asyncio.AbstractEventLoopPolicy`
    - `asyncio.DefaultEventLoopPolicy`
    - `asyncio.WindowsSelectorEventLoopPolicy`
    - `asyncio.WindowsProactorEventLoopPolicy`
    - `asyncio.get_event_loop_policy()`
    - `asyncio.set_event_loop_policy()`

    Users should use `asyncio.run()` or `asyncio.Runner` with
    *loop\_factory* to use the desired event loop implementation.

    For example, to use `asyncio.SelectorEventLoop` on Windows:

    ```
    import asyncio

    async def main():
        ...

    asyncio.run(main(), loop_factory=asyncio.SelectorEventLoop)
    ```

    (Contributed by Kumar Aditya in gh-127949.)
- `builtins`:

  - Bitwise inversion on boolean types, `~True` or `~False`
    has been deprecated since Python 3.12,
    as it produces surprising and unintuitive results (`-2` and `-1`).
    Use `not x` instead for the logical negation of a Boolean.
    In the rare case that you need the bitwise inversion of
    the underlying integer, convert to `int` explicitly (`~int(x)`).
- `functools`:

  - Calling the Python implementation of `functools.reduce()` with *function*
    or *sequence* as keyword arguments has been deprecated since Python 3.14.
- `logging`:

  - Support for custom logging handlers with the *strm* argument is deprecated
    and scheduled for removal in Python 3.16. Define handlers with the *stream*
    argument instead. (Contributed by Mariusz Felisiak in gh-115032.)
- `mimetypes`:

  - Valid extensions start with a ‘.’ or are empty for
    `mimetypes.MimeTypes.add_type()`.
    Undotted extensions are deprecated and will
    raise a `ValueError` in Python 3.16.
    (Contributed by Hugo van Kemenade in gh-75223.)
- `shutil`:

  - The `ExecError` exception
    has been deprecated since Python 3.14.
    It has not been used by any function in `shutil` since Python 3.4,
    and is now an alias of `RuntimeError`.
- `symtable`:

  - The `Class.get_methods` method
    has been deprecated since Python 3.14.
- `sys`:

  - The `_enablelegacywindowsfsencoding()` function
    has been deprecated since Python 3.13.
    Use the `PYTHONLEGACYWINDOWSFSENCODING` environment variable instead.
- `sysconfig`:

  - The `sysconfig.expand_makefile_vars()` function
    has been deprecated since Python 3.14.
    Use the `vars` argument of `sysconfig.get_paths()` instead.
- `tarfile`:

  - The undocumented and unused `TarFile.tarfile` attribute
    has been deprecated since Python 3.13.

## Pending removal in Python 3.17

- `datetime`:

  - `strptime()` calls using a format string containing
    `%e` (day of month) without a year.
    This has been deprecated since Python 3.15.
    (Contributed by Stan Ulbrych in gh-70647.)
- `collections.abc`:

  - `collections.abc.ByteString` is scheduled for removal in Python 3.17.

    Use `isinstance(obj, collections.abc.Buffer)` to test if `obj`
    implements the buffer protocol at runtime. For use
    in type annotations, either use `Buffer` or a union
    that explicitly specifies the types your code supports (e.g.,
    `bytes | bytearray | memoryview`).

    `ByteString` was originally intended to be an abstract class that
    would serve as a supertype of both `bytes` and `bytearray`.
    However, since the ABC never had any methods, knowing that an object was an
    instance of `ByteString` never actually told you anything useful
    about the object. Other common buffer types such as `memoryview`
    were also never understood as subtypes of `ByteString` (either at
    runtime or by static type checkers).

    See **PEP 688** for more details.
    (Contributed by Shantanu Jain in gh-91896.)
- `encodings`:

  - Passing non-ascii *encoding* names to `encodings.normalize_encoding()`
    is deprecated and scheduled for removal in Python 3.17.
    (Contributed by Stan Ulbrych in gh-136702.)
- `profile`:

  - The `profile` module is deprecated and will be removed in
    Python 3.17. Use `profiling.tracing` instead, which provides a
    compatible API. See **PEP 799** for details.
    (Contributed by Pablo Galindo and László Kiss Kollár in gh-138122.)
- `webbrowser`:

  - `webbrowser.MacOSXOSAScript` is deprecated in favour of
    `webbrowser.MacOS`. (gh-137586)
- `typing`:

  - Before Python 3.14, old-style unions were implemented using the private class
    `typing._UnionGenericAlias`. This class is no longer needed for the implementation,
    but it has been retained for backward compatibility, with removal scheduled for Python
    3.17. Users should use documented introspection helpers like `typing.get_origin()`
    and `typing.get_args()` instead of relying on private implementation details.
  - `typing.ByteString`, deprecated since Python 3.9, is scheduled for removal in
    Python 3.17.

    Use `isinstance(obj, collections.abc.Buffer)` to test if `obj`
    implements the buffer protocol at runtime. For use
    in type annotations, either use `Buffer` or a union
    that explicitly specifies the types your code supports (e.g.,
    `bytes | bytearray | memoryview`).

    `ByteString` was originally intended to be an abstract class that
    would serve as a supertype of both `bytes` and `bytearray`.
    However, since the ABC never had any methods, knowing that an object was an
    instance of `ByteString` never actually told you anything useful
    about the object. Other common buffer types such as `memoryview`
    were also never understood as subtypes of `ByteString` (either at
    runtime or by static type checkers).

    See **PEP 688** for more details.
    (Contributed by Shantanu Jain in gh-91896.)
- `tkinter`:

  - The `tkinter.Variable` methods `trace_variable()`,
    `trace()` (an alias of `trace_variable()`),
    `trace_vdelete()` and `trace_vinfo()`, deprecated since
    Python 3.14, are scheduled for removal in Python 3.17.
    Use `trace_add()`, `trace_remove()` and `trace_info()`
    instead.
    (Contributed by Serhiy Storchaka in gh-120220.)

## Pending removal in Python 3.18

- No longer accept a boolean value when a file descriptor is expected.
  (Contributed by Serhiy Storchaka in gh-82626.)
- `decimal`:

  - The non-standard and undocumented `Decimal` format
    specifier `'N'`, which is only supported in the `decimal` module’s
    C implementation, has been deprecated since Python 3.13.
    (Contributed by Serhiy Storchaka in gh-89902.)
- Deprecations defined by **PEP 829**:

  - `import` lines in `name.pth` files are silently ignored.

  (Contributed by Barry Warsaw in gh-148641.)

## Pending removal in Python 3.19

- `ctypes`:

  - Implicitly switching to the MSVC-compatible struct layout by setting
    `_pack_` but not `_layout_`
    on non-Windows platforms.
- `hashlib`:

  - In hash function constructors such as `new()` or the
    direct hash-named constructors such as `md5()` and
    `sha256()`, their optional initial data parameter could
    also be passed a keyword argument named `data=` or `string=` in
    various `hashlib` implementations.

    Support for the `string` keyword argument name is now deprecated
    and slated for removal in Python 3.19.

    Before Python 3.13, the `string` keyword parameter was not correctly
    supported depending on the backend implementation of hash functions.
    Prefer passing the initial data as a positional argument for maximum
    backwards compatibility.
- `http.cookies`:

  - `http.cookies.Morsel.js_output()` is deprecated and will be
    removed in Python 3.19.
  - `http.cookies.BaseCookie.js_output()` is deprecated and will be
    removed in Python 3.19.
- `imaplib`:

  - Altering `IMAP4.file` is now deprecated
    and slated for removal in Python 3.19. This property is now unused
    and changing its value does not automatically close the current file.

    Before Python 3.14, this property was used to implement the corresponding
    `read()` and `readline()` methods for `IMAP4` but this
    is no longer the case since then.

## Pending removal in Python 3.20

- Calling the `__new__()` method of `struct.Struct` without the
  *format* argument is deprecated and will be removed in Python 3.20. Calling
  `__init__()` method on initialized `Struct`
  objects is deprecated and will be removed in Python 3.20.

  (Contributed by Sergey B Kirpichev and Serhiy Storchaka in gh-143715.)
- The `__version__`, `version` and `VERSION` attributes have been
  deprecated in these standard library modules and will be removed in
  Python 3.20. Use `sys.version_info` instead.

  - `argparse`
  - `csv`
  - `ctypes`
  - `ctypes.macholib`
  - `decimal` (use `decimal.SPEC_VERSION` instead)
  - `http.server`
  - `imaplib`
  - `ipaddress`
  - `json`
  - `logging` (`__date__` also deprecated)
  - `optparse`
  - `pickle`
  - `platform`
  - `re`
  - `socketserver`
  - `tabnanny`
  - `tarfile`
  - `tkinter.font`
  - `tkinter.ttk`
  - `wsgiref.simple_server`
  - `xml.etree.ElementTree`
  - `xml.sax.expatreader`
  - `xml.sax.handler`
  - `zlib`

  (Contributed by Hugo van Kemenade and Stan Ulbrych in gh-76007.)
- Deprecations defined by **PEP 829**:

  - Warnings are produced for `import` lines found in `name.pth`
    files.
  - `name.pth` files are no longer decoded in the locale encoding by
    default. They **MUST** be encoded in `utf-8-sig`.

  (Contributed by Barry Warsaw in gh-148641.)
- `ast`:

  - Creating instances of abstract AST nodes (such as `ast.AST`
    or `ast.expr`) is deprecated and will raise an error in Python 3.20.
- `typing`:

  - It is deprecated to call `isinstance()` and `issubclass()` checks on
    protocol classes that were not explicitly decorated with `runtime_checkable()`
    but that inherit from a runtime-checkable protocol class.
    This will raise a `TypeError` in Python 3.20.

    (Contributed by Bartosz Sławecki in gh-132604.)

## Pending removal in future versions

The following APIs will be removed in the future,
although there is currently no date scheduled for their removal.

- `argparse`:

  - Nesting argument groups and nesting mutually exclusive
    groups are deprecated.
  - Passing the undocumented keyword argument *prefix\_chars* to
    `add_argument_group()` is now
    deprecated.
  - The `argparse.FileType` type converter is deprecated.
- `builtins`:

  - Generators: `throw(type, exc, tb)` and `athrow(type, exc, tb)`
    signature is deprecated: use `throw(exc)` and `athrow(exc)` instead,
    the single argument signature.
  - Currently Python accepts numeric literals immediately followed by keywords,
    for example `0in x`, `1or x`, `0if 1else 2`. It allows confusing and
    ambiguous expressions like `[0x1for x in y]` (which can be interpreted as
    `[0x1 for x in y]` or `[0x1f or x in y]`). A syntax warning is raised
    if the numeric literal is immediately followed by one of keywords
    `and`, `else`, `for`, `if`,
    `in`, `is` and `or`. In a future release it
    will be changed to a syntax error. (gh-87999)
  - Support for `__index__()` and `__int__()` method returning non-int type:
    these methods will be required to return an instance of a strict subclass of
    `int`.
  - Support for `__float__()` method returning a strict subclass of
    `float`: these methods will be required to return an instance of
    `float`.
  - Support for `__complex__()` method returning a strict subclass of
    `complex`: these methods will be required to return an instance of
    `complex`.
  - Passing a complex number as the *real* or *imag* argument in the
    `complex()` constructor is now deprecated; it should only be passed
    as a single positional argument.
    (Contributed by Serhiy Storchaka in gh-109218.)
- `calendar`: `calendar.January` and `calendar.February` constants are
  deprecated and replaced by `calendar.JANUARY` and
  `calendar.FEBRUARY`.
  (Contributed by Prince Roshan in gh-103636.)
- `codecs`: use `open()` instead of `codecs.open()`. (gh-133038)
- `codeobject.co_lnotab`: use the `codeobject.co_lines()` method
  instead.
- `datetime`:

  - `utcnow()`:
    use `datetime.datetime.now(tz=datetime.UTC)`.
  - `utcfromtimestamp()`:
    use `datetime.datetime.fromtimestamp(timestamp, tz=datetime.UTC)`.
- `gettext`: Plural value must be an integer.
- `importlib`:

  - `cache_from_source()` *debug\_override* parameter is
    deprecated: use the *optimization* parameter instead.
- `importlib.metadata`:

  - `EntryPoints` tuple interface.
  - Implicit `None` on return values.
- `logging`: the `warn()` method has been deprecated
  since Python 3.3, use `warning()` instead.
- `mailbox`: Use of StringIO input and text mode is deprecated, use
  BytesIO and binary mode instead.
- `os`: Calling `os.register_at_fork()` in a multi-threaded process.
- `os.path`: `os.path.commonprefix()` is deprecated, use
  `os.path.commonpath()` for path prefixes. The `os.path.commonprefix()`
  function is being deprecated due to having a misleading name and module.
  The function is not safe to use for path prefixes despite being included in a
  module about path manipulation, meaning it is easy to accidentally
  introduce path traversal vulnerabilities into Python programs by using this
  function.
- `pydoc.ErrorDuringImport`: A tuple value for *exc\_info* parameter is
  deprecated, use an exception instance.
- `re`: More strict rules are now applied for numerical group references
  and group names in regular expressions. Only sequence of ASCII digits is now
  accepted as a numerical reference. The group name in bytes patterns and
  replacement strings can now only contain ASCII letters and digits and
  underscore.
  (Contributed by Serhiy Storchaka in gh-91760.)
- `shutil`: `rmtree()`’s *onerror* parameter is deprecated in
  Python 3.12; use the *onexc* parameter instead.
- `ssl` options and protocols:

  - `ssl.SSLContext` without protocol argument is deprecated.
  - `ssl.SSLContext`: `set_npn_protocols()` and
    `selected_npn_protocol()` are deprecated: use ALPN
    instead.
  - `ssl.OP_NO_SSL*` options
  - `ssl.OP_NO_TLS*` options
  - `ssl.PROTOCOL_SSLv3`
  - `ssl.PROTOCOL_TLS`
  - `ssl.PROTOCOL_TLSv1`
  - `ssl.PROTOCOL_TLSv1_1`
  - `ssl.PROTOCOL_TLSv1_2`
  - `ssl.TLSVersion.SSLv3`
  - `ssl.TLSVersion.TLSv1`
  - `ssl.TLSVersion.TLSv1_1`
- `threading` methods:

  - `threading.Condition.notifyAll()`: use `notify_all()`.
  - `threading.Event.isSet()`: use `is_set()`.
  - `threading.Thread.isDaemon()`, `threading.Thread.setDaemon()`:
    use `threading.Thread.daemon` attribute.
  - `threading.Thread.getName()`, `threading.Thread.setName()`:
    use `threading.Thread.name` attribute.
  - `threading.currentThread()`: use `threading.current_thread()`.
  - `threading.activeCount()`: use `threading.active_count()`.
- `typing.Text` (gh-92332).
- The internal class `typing._UnionGenericAlias` is no longer used to implement
  `typing.Union`. To preserve compatibility with users using this private
  class, a compatibility shim will be provided until at least Python 3.17. (Contributed by
  Jelle Zijlstra in gh-105499.)
- `unittest.IsolatedAsyncioTestCase`: it is deprecated to return a value
  that is not `None` from a test case.
- `urllib.parse` deprecated functions: `urlparse()` instead

  - `splitattr()`
  - `splithost()`
  - `splitnport()`
  - `splitpasswd()`
  - `splitport()`
  - `splitquery()`
  - `splittag()`
  - `splittype()`
  - `splituser()`
  - `splitvalue()`
  - `to_bytes()`
- `wsgiref`: `SimpleHandler.stdout.write()` should not do partial
  writes.
- `xml.etree.ElementTree`: Testing the truth value of an
  `Element` is deprecated. In a future release it
  will always return `True`. Prefer explicit `len(elem)` or
  `elem is not None` tests instead.
- `sys._clear_type_cache()` is deprecated:
  use `sys._clear_internal_caches()` instead.

## Soft deprecations

There are no plans to remove soft deprecated APIs.

- `re.match()` and `re.Pattern.match()` are now
  soft deprecated in favor of the new `re.prefixmatch()` and
  `re.Pattern.prefixmatch()` APIs, which have been added as alternate,
  more explicit names. These are intended to be used to alleviate confusion
  around what *match* means by following the Zen of Python’s *“Explicit is
  better than implicit”* mantra. Most other language regular expression
  libraries use an API named *match* to mean what Python has always called
  *search*.

  We **do not** plan to remove the older `match()` name, as it has been
  used in code for over 30 years. Code supporting older versions of Python
  should continue to use `match()`, while new code should prefer
  `prefixmatch()`. See prefixmatch() vs. match().

  (Contributed by Gregory P. Smith in gh-86519 and
  Hugo van Kemenade in gh-148100.)
- Using `'F'` and `'D'` format type codes of the `struct` module
  now are soft deprecated in favor of two-letter forms `'Zf'`
  and `'Zd'`.
  (Contributed by Sergey B Kirpichev in gh-121249.)

## C API deprecations

### Pending removal in Python 3.15

- The `PyImport_ImportModuleNoBlock()`:
  Use `PyImport_ImportModule()` instead.
- `PyWeakref_GetObject()` and `PyWeakref_GET_OBJECT()`:
  Use `PyWeakref_GetRef()` instead. The pythoncapi-compat project can be used to get
  `PyWeakref_GetRef()` on Python 3.12 and older.
- `PyUnicode_AsDecodedObject()`:
  Use `PyCodec_Decode()` instead.
- `PyUnicode_AsDecodedUnicode()`:
  Use `PyCodec_Decode()` instead; Note that some codecs (for example, “base64”)
  may return a type other than `str`, such as `bytes`.
- `PyUnicode_AsEncodedObject()`:
  Use `PyCodec_Encode()` instead.
- `PyUnicode_AsEncodedUnicode()`:
  Use `PyCodec_Encode()` instead; Note that some codecs (for example, “base64”)
  may return a type other than `bytes`, such as `str`.
- Python initialization functions, deprecated in Python 3.13:

  - `Py_GetPath()`:
    Use `PyConfig_Get("module_search_paths")`
    (`sys.path`) instead.
  - `Py_GetPrefix()`:
    Use `PyConfig_Get("base_prefix")`
    (`sys.base_prefix`) instead. Use `PyConfig_Get("prefix")` (`sys.prefix`) if virtual environments need to be handled.
  - `Py_GetExecPrefix()`:
    Use `PyConfig_Get("base_exec_prefix")`
    (`sys.base_exec_prefix`) instead. Use
    `PyConfig_Get("exec_prefix")`
    (`sys.exec_prefix`) if virtual environments need to
    be handled.
  - `Py_GetProgramFullPath()`:
    Use `PyConfig_Get("executable")`
    (`sys.executable`) instead.
  - `Py_GetProgramName()`:
    Use `PyConfig_Get("executable")`
    (`sys.executable`) instead.
  - `Py_GetPythonHome()`:
    Use `PyConfig_Get("home")` or the
    `PYTHONHOME` environment variable instead.

  The pythoncapi-compat project can be used to get
  `PyConfig_Get()` on Python 3.13 and older.
- Functions to configure Python’s initialization, deprecated in Python 3.11:

  - `PySys_SetArgvEx()`:
    Set `PyConfig.argv` instead.
  - `PySys_SetArgv()`:
    Set `PyConfig.argv` instead.
  - `Py_SetProgramName()`:
    Set `PyConfig.program_name` instead.
  - `Py_SetPythonHome()`:
    Set `PyConfig.home` instead.
  - `PySys_ResetWarnOptions()`:
    Clear `sys.warnoptions` and `warnings.filters` instead.

  The `Py_InitializeFromConfig()` API should be used with
  `PyConfig` instead.
- Global configuration variables:

  - `Py_DebugFlag`:
    Use `PyConfig.parser_debug` or
    `PyConfig_Get("parser_debug")` instead.
  - `Py_VerboseFlag`:
    Use `PyConfig.verbose` or
    `PyConfig_Get("verbose")` instead.
  - `Py_QuietFlag`:
    Use `PyConfig.quiet` or
    `PyConfig_Get("quiet")` instead.
  - `Py_InteractiveFlag`:
    Use `PyConfig.interactive` or
    `PyConfig_Get("interactive")` instead.
  - `Py_InspectFlag`:
    Use `PyConfig.inspect` or
    `PyConfig_Get("inspect")` instead.
  - `Py_OptimizeFlag`:
    Use `PyConfig.optimization_level` or
    `PyConfig_Get("optimization_level")` instead.
  - `Py_NoSiteFlag`:
    Use `PyConfig.site_import` or
    `PyConfig_Get("site_import")` instead.
  - `Py_BytesWarningFlag`:
    Use `PyConfig.bytes_warning` or
    `PyConfig_Get("bytes_warning")` instead.
  - `Py_FrozenFlag`:
    Use `PyConfig.pathconfig_warnings` or
    `PyConfig_Get("pathconfig_warnings")` instead.
  - `Py_IgnoreEnvironmentFlag`:
    Use `PyConfig.use_environment` or
    `PyConfig_Get("use_environment")` instead.
  - `Py_DontWriteBytecodeFlag`:
    Use `PyConfig.write_bytecode` or
    `PyConfig_Get("write_bytecode")` instead.
  - `Py_NoUserSiteDirectory`:
    Use `PyConfig.user_site_directory` or
    `PyConfig_Get("user_site_directory")` instead.
  - `Py_UnbufferedStdioFlag`:
    Use `PyConfig.buffered_stdio` or
    `PyConfig_Get("buffered_stdio")` instead.
  - `Py_HashRandomizationFlag`:
    Use `PyConfig.use_hash_seed`
    and `PyConfig.hash_seed` or
    `PyConfig_Get("hash_seed")` instead.
  - `Py_IsolatedFlag`:
    Use `PyConfig.isolated` or
    `PyConfig_Get("isolated")` instead.
  - `Py_LegacyWindowsFSEncodingFlag`:
    Use `PyPreConfig.legacy_windows_fs_encoding` or
    `PyConfig_Get("legacy_windows_fs_encoding")` instead.
  - `Py_LegacyWindowsStdioFlag`:
    Use `PyConfig.legacy_windows_stdio` or
    `PyConfig_Get("legacy_windows_stdio")` instead.
  - `Py_FileSystemDefaultEncoding`, `Py_HasFileSystemDefaultEncoding`:
    Use `PyConfig.filesystem_encoding` or
    `PyConfig_Get("filesystem_encoding")` instead.
  - `Py_FileSystemDefaultEncodeErrors`:
    Use `PyConfig.filesystem_errors` or
    `PyConfig_Get("filesystem_errors")` instead.
  - `Py_UTF8Mode`:
    Use `PyPreConfig.utf8_mode` or
    `PyConfig_Get("utf8_mode")` instead.
    (see `Py_PreInitialize()`)

  The `Py_InitializeFromConfig()` API should be used with
  `PyConfig` to set these options. Or `PyConfig_Get()` can be
  used to get these options at runtime.

### Pending removal in Python 3.16

- The bundled copy of `libmpdec`.

### Pending removal in Python 3.18

- The following private functions are deprecated
  and planned for removal in Python 3.18:

  - `_PyBytes_Join()`: use `PyBytes_Join()`.
  - `_PyDict_GetItemStringWithError()`: use `PyDict_GetItemStringRef()`.
  - `_PyDict_Pop()`: use `PyDict_Pop()`.
  - `_PyLong_Sign()`: use `PyLong_GetSign()`.
  - `_PyLong_FromDigits()` and `_PyLong_New()`:
    use `PyLongWriter_Create()`.
  - `_PyThreadState_UncheckedGet()`: use `PyThreadState_GetUnchecked()`.
  - `_PyUnicode_AsString()`: use `PyUnicode_AsUTF8()`.
  - `_PyUnicodeWriter_Init()`:
    replace `_PyUnicodeWriter_Init(&writer)` with
    `writer = PyUnicodeWriter_Create(0)`.
  - `_PyUnicodeWriter_Finish()`:
    replace `_PyUnicodeWriter_Finish(&writer)` with
    `PyUnicodeWriter_Finish(writer)`.
  - `_PyUnicodeWriter_Dealloc()`:
    replace `_PyUnicodeWriter_Dealloc(&writer)` with
    `PyUnicodeWriter_Discard(writer)`.
  - `_PyUnicodeWriter_WriteChar()`:
    replace `_PyUnicodeWriter_WriteChar(&writer, ch)` with
    `PyUnicodeWriter_WriteChar(writer, ch)`.
  - `_PyUnicodeWriter_WriteStr()`:
    replace `_PyUnicodeWriter_WriteStr(&writer, str)` with
    `PyUnicodeWriter_WriteStr(writer, str)`.
  - `_PyUnicodeWriter_WriteSubstring()`:
    replace `_PyUnicodeWriter_WriteSubstring(&writer, str, start, end)` with
    `PyUnicodeWriter_WriteSubstring(writer, str, start, end)`.
  - `_PyUnicodeWriter_WriteASCIIString()`:
    replace `_PyUnicodeWriter_WriteASCIIString(&writer, str, size)` with
    `PyUnicodeWriter_WriteASCII(writer, str, size)`.
  - `_PyUnicodeWriter_WriteLatin1String()`:
    replace `_PyUnicodeWriter_WriteLatin1String(&writer, str, size)` by
    decoding the string with `PyUnicode_DecodeLatin1()`, writing the
    result with `PyUnicodeWriter_WriteStr()`, and releasing the result
    with `Py_DECREF()`.
  - `_PyUnicodeWriter_Prepare()`: (no replacement).
  - `_PyUnicodeWriter_PrepareKind()`: (no replacement).
  - `_Py_HashPointer()`: use `Py_HashPointer()`.
  - `_Py_fopen_obj()`: use `Py_fopen()`.

  The pythoncapi-compat project can be used to get
  these new public functions on Python 3.13 and older.
  (Contributed by Victor Stinner in gh-128863.)

### Pending removal in Python 3.19

- **PEP 456** embedders support for the string hashing scheme definition.

### Pending removal in Python 3.20

- `_PyObject_CallMethodId()`, `_PyObject_GetAttrId()` and
  `_PyUnicode_FromId()` are deprecated since 3.15 and will be removed in
  3.20. Instead, use `PyUnicode_InternFromString()` and cache the result in
  the module state, then call `PyObject_CallMethod()` or
  `PyObject_GetAttr()`.
  (Contributed by Victor Stinner in gh-141049.)
- The `cval` field in `PyComplexObject` (gh-128813).
  Use `PyComplex_AsCComplex()` and `PyComplex_FromCComplex()`
  to convert a Python complex number to/from the C `Py_complex`
  representation.
- Macros `Py_MATH_PIl` and `Py_MATH_El`.

### Pending removal in future versions

The following APIs are deprecated and will be removed,
although there is currently no date scheduled for their removal.

- `Py_TPFLAGS_HAVE_FINALIZE`:
  Unneeded since Python 3.8.
- `PyErr_Fetch()`:
  Use `PyErr_GetRaisedException()` instead.
- `PyErr_NormalizeException()`:
  Use `PyErr_GetRaisedException()` instead.
- `PyErr_Restore()`:
  Use `PyErr_SetRaisedException()` instead.
- `PyModule_GetFilename()`:
  Use `PyModule_GetFilenameObject()` instead.
- `PyOS_AfterFork()`:
  Use `PyOS_AfterFork_Child()` instead.
- `PySlice_GetIndicesEx()`:
  Use `PySlice_Unpack()` and `PySlice_AdjustIndices()` instead.
- `PyUnicode_READY()`:
  Unneeded since Python 3.12
- `PyErr_Display()`:
  Use `PyErr_DisplayException()` instead.
- `_PyErr_ChainExceptions()`:
  Use `_PyErr_ChainExceptions1()` instead.
- `PyBytesObject.ob_shash` member:
  call `PyObject_Hash()` instead.
- Thread Local Storage (TLS) API:

  - `PyThread_create_key()`:
    Use `PyThread_tss_alloc()` instead.
  - `PyThread_delete_key()`:
    Use `PyThread_tss_free()` instead.
  - `PyThread_set_key_value()`:
    Use `PyThread_tss_set()` instead.
  - `PyThread_get_key_value()`:
    Use `PyThread_tss_get()` instead.
  - `PyThread_delete_key_value()`:
    Use `PyThread_tss_delete()` instead.
  - `PyThread_ReInitTLS()`:
    Unneeded since Python 3.7.
