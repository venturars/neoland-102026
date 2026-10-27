---
page: whatsnew/changelog.html
title: Changelog
area: whatsnew
kind: changelog
---

# Changelog

<!-- anchor: python-next | type: section -->
## Python next

*Release date: XXXX-XX-XX*

<!-- anchor: security | type: section -->
### Security

- gh-159428: `mimetypes` no longer reads the files listed in `mimetypes.knownfiles` by default on Windows, and uses only the registry.

<!-- anchor: core-and-builtins | type: section -->
### Core and Builtins

- gh-159430: Report the correct exception if looking up `__bytes__()` raises an exception while performing %-formatting of `bytes`.

- gh-159320: Add dynamic detection of stack sizes on Android, allowing safer deep recursion.

- gh-159288: Fix a crash when walking a very long chain of lazy import placeholders, as created by an aliased dotted import such as `lazy import a.b.c as d`. `RecursionError` is now raised instead.

- gh-159285: Fix a crash in a debug build when copying an empty `dict` fails with `MemoryError`. Patch by Christian Aurich Zanettini Martins.

- gh-158918: Reduce C stack usage of `_PyModule_IsPossiblyShadowing`, which could potentially cause stack overflows during module attribute access while deeply recursing in agressively optimized builds.

- gh-158803: Fix a crash in `bytes.join()` and `bytearray.join()` in the free-threaded build when another thread concurrently mutates the list being joined. Patch by Christian Aurich Zanettini Martins.

- gh-158824: Fix module-level `__getattr__()` being called before a module’s own lazy imports were resolved, which allowed it to shadow them.

- gh-158820: Fix a crash when a lazy import is declared or resolved by a finalizer running during interpreter shutdown.

- gh-158592: Skip the array reallocation when shrinking a small `list`. Patch by Donghee Na.

- gh-158583: `bytes.fromhex()` and `bytearray.fromhex()`: Fix uninitialized memory read. Patch by Victor Stinner.

- gh-158592: `del list[index]` now triggers shrinking the list’s internal array.

- gh-158486: Fix the PowerSort mask calculation in `list.sort()` for very large lists.

- gh-158219: Fix `bytearray` constructor: do not use a bytes object if its hash value is already computed. Patch by Cody Maloney and Victor Stinner.

- gh-158072: Fix a JIT crash when a class is instantiated with their default arguments

- gh-157468: Fix the JIT optimizer folding a builtin name to a constant taken from the interpreter’s builtins dictionary even when the running function uses a different `__builtins__` mapping, such as one created with `vars(builtins).copy()`. The optimizer now only folds when the function’s builtins is the interpreter’s, and the folded constant is guarded at runtime so that another function sharing the same code object but a different builtins mapping does not use it.

- gh-157242: If `bytearray.resize()` or `bytearray.take_bytes()` fails, leave the `bytearray` unchanged, instead of clearing it. Patch by Victor Stinner.

- gh-156091: Fix a crash when compiling deeply nested inlined list, set, or dict comprehensions. A `SyntaxError` is now raised when the nesting exceeds the compiler’s static block limit.

- gh-156459: Fix cleanup on error in `compiler_set_qualname`. Previously it was called in `_PyCompile_EnterScope`, after the scope had been entered, and this was not reversed in case of an error.

- gh-156371: Fix missing `PyRefTracer_DESTROY` events for trashcan deferred objects. Patch by Donghee Na.

- gh-156204: Fix a crash in `PyErr_GivenExceptionMatches()` when evaluating deeply nested exception tuples. The recursion is now bounded, and exceeding the limit is reported as an unraisable exception.

- gh-155823: Fix a JIT bug where the side exit taken when a virtual iterator is exhausted left a stale value on the stack, so the tier one interpreter resumed with corrupted state and `yield from` raised `AttributeError` instead of finishing normally.

- gh-155504: Fix a crash when thread state creation fails before the thread state is fully initialized.

- gh-155315: Fix `marshal` so that a `frozendict` referenced more than once in the serialized data round-trips correctly, instead of failing to load with `ValueError`. Patch by tonghuaroot.

- gh-154937: Fix a data race on thread handle identifiers when `_thread._shutdown()` runs concurrently with the startup of non-daemon threads in the free-threaded build.

- gh-152075: Reduced lock contention during LOAD_GLOBAL bytecode specialization under free threading.

- gh-153578: Fix an out-of-bounds write in `bytearray.extend()` when the bytearray is resized while the argument’s `__buffer__()` is being acquired, for example by another thread. Patch by tonghuaroot.

- gh-151895: Fixed a crash in `marshal.loads()` when an allocation failed while loading a reference-tracked dictionary; it now raises `MemoryError`.

- gh-151518: Fix a free-threaded stop-the-world fairness issue that could starve a thread reattaching after being suspended while detached.

- gh-149816: Fix a Use-After-Free race condition in `subtype_getweakref()` during concurrent weakref creation and destruction in the free-threading build.

- gh-149816: Fix race conditions in `invoke_gc_callback` iterating `gc.callbacks` in free-threading mode.

<!-- anchor: library | type: section -->
### Library

- gh-159430: Report the correct exception if looking up `__name__` raises an exception when calling `repr()` on a `weakref.ref`.

- gh-159225: Prevent `input` calls in PyREPL from modifying readline history.

- gh-159044: Restore the previous behaviour of `http.client.HTTPConnection.set_tunnel()` where header values that are not strings (such as `None`, `int` or other objects) are converted with `str` instead of raising `AttributeError` when the request is sent.

- gh-159184: Fix `marshal.dumps()` raising `MemoryError` for a set or frozenset containing several complex NaNs, which also made it impossible to write a `.pyc` file for source code containing such a constant.

- gh-159185: Fix a crash in `marshal.dumps()` and `marshal.dump()` when a set is modified while its elements are serialized, for example by the `__buffer__()` method of one of its elements. `RuntimeError` is now raised.

- gh-87720: Fixed error in `email` new policies where header folding failed to detect the need to re-quote text obtained from encoded words in certain cases.

- gh-158929: Fix crash when calling `syslog.syslog()` while a subinterpreter in another thread calls `syslog.openlog()` or `syslog.closelog()`.

- gh-158936: `dataclass()` no longer fails when a string annotation names a lazy import that cannot be resolved, matching the behavior for non-string annotations.

- gh-158893: Make `os.strerror()` thread-safe: use the reentrant `strerror_r()` function if available. Patch by Victor Stinner.

- gh-158539: Fix macOS runtime section lookup for remote debugging when virtual memory region sizes differ from Mach-O segment file sizes.

- gh-156545: Fix deep flamegraph exports on platforms with small C stacks by falling back to the Python JSON encoder when the C encoder runs out of stack space.

- gh-158552: Wait for Windows threads to finish suspending before reading target memory in the sampling profiler’s blocking mode. Resume the target if waiting for suspension fails.

- gh-156321: Fix `asyncio.shield()` reporting an exception from the inner future through the loop exception handler as soon as it completes after the shield was cancelled, even when the exception is retrieved afterwards. The exception is now reported only if it is never retrieved, as with any other future.

- gh-158539: Fix `profiling.sampling` exception mode discarding samples for code running inside an `except` block in a generator or coroutine. The remote debugger now follows `tstate->exc_info` and its `previous_item` chain instead of only reading the embedded `exc_state`, matching the exception that `sys.exception()` reports.

- gh-158563: Fix `turtle.undo()` after `turtle.teleport()` and after an exception in `turtle.circle()`, `turtle.dot()` or `turtle.write()`. Fix `turtle.stamp()`, `turtle.clearstamp()`, `turtle.clear()` and `turtle.reset()` when the undo buffer is disabled.

- gh-158540: Fix `profiling.sampling` not adding the directory containing the profiled script to `sys.path`, which prevented the script from importing modules placed next to it. The script’s directory is now added, matching the behavior of `python script.py`.

- gh-158522: Fix `profiling.sampling` showing a single frame for a task whose coroutine recurses. Patch by Timofei Ivankov.

- gh-158169: Fix `zlib.Decompress.unconsumed_tail` duplicating `unused_data` after end of stream when *max_length* was used.

- gh-153888: Fix `unittest.mock.patch()` with `autospec`, `spec`, or `spec_set` when used with lazy-imported objects.

- gh-157672: Fix `tkinter` on macOS: creating a `Tk` instance no longer replaces the Python handlers of SIGINT, SIGHUP and SIGTERM with Tk’s handler which exits the process, so Ctrl-C raises `KeyboardInterrupt` again.

- gh-157621: Fix a crash when a weak-reference callback is attached to a `typing.ParamSpecArgs` or `typing.ParamSpecKwargs` instance.

- gh-69919: `code.InteractiveInterpreter.runsource()` and the REPL now report any exception raised by compiling the source, such as `MemoryError` or `RecursionError` for too deeply nested source, instead of propagating it or printing a traceback of the REPL internals.

- gh-157451: Fix `gettext` plural form selection when the `Plural-Forms` expression combines the unary `!` operator with a binary operator, for example `!n + 1` or `2 * !n`. The latter raised `SyntaxError`.

- gh-157406: Fix the Python implementation of `xml.etree.ElementTree.XMLParser`: the `doctype()` method of the target is now called for a document type declaration without an external identifier, like `<!DOCTYPE html>`, as in the C implementation.

- gh-157242: `io.BytesIO` is no longer closed on `write()` and `truncate()` failure (`MemoryError`). Patch by Victor Stinner.

- gh-157325: Fix an out-of-bounds read in the `hz` incremental decoder when the input ends with `~`.

- gh-123018: Fix `readline.write_history_file()` and `readline.append_history_file()` producing a history file that `readline.read_history_file()` could not load when a limit was set with `readline.set_history_length()` and Python was built against `libedit`. This works around NetBSD PR 60322.

- gh-157146: `linecache` can now read the source of a module that was imported from a zip archive on `sys.path` when given only the file name, as `pdb`, `warnings` and `doctest` do.

- gh-157048: Preserve the position and contents of `io.BytesIO` when `BytesIO.__init__()` fails because a buffer is exported.

- gh-156961: Fix `tkinter.font.nametofont()` and the `tkinter.font.Font` constructor for a font name returned by Tk as a Tcl object, for example by `ttk.Style.lookup()`.

- gh-156946: Fix a crash in `curses.panel` when the finalizer of a panel’s user pointer runs while the panel is being deallocated. The panel is now taken off the panel stack before its user pointer is dropped.

- gh-156920: Fix `asyncio` on Windows: closing a `DatagramTransport` under `ProactorEventLoop` while datagrams were still queued, or while an in-flight write failed right as `close()` was draining the buffer, could strand the queued data and never call `connection_lost()`, hanging the close indefinitely.

- gh-156810: Fix a `UnicodeEncodeError` crash in the sampling profiler’s collapsed-stack export (`--collapsed`) when a sampled frame’s function or file name contains non-ASCII or surrogate-escaped characters. The output file is now written as UTF-8.

- gh-156797: Fix `xml.sax.saxutils.XMLGenerator`: the namespace URI is now escaped in the namespace declaration. Previously a URI containing `&`, `<` or a quote character produced a document which cannot be parsed.

- gh-83895: `xml.etree.ElementTree` now accepts input larger than 2 GiB in the C implementation. The data is fed to Expat in chunks, as `xml.parsers.expat` already did, instead of raising `OverflowError`.

- gh-99064: Fix `xml.etree.ElementTree.parse()` with a text file or other source of `str` data in the C implementation. The encoding declared in the document was applied to the already decoded text, which produced mojibake. It is now ignored, as when parsing with `XMLParser.feed()` or `fromstring()`.

- gh-156713: Fix `nturl2path.pathname2url()` and `nturl2path.url2pathname()`: the filesystem encoding and error handler are now used for percent-encoding and decoding, as in `urllib.request`. Previously paths containing surrogate characters raised `UnicodeEncodeError`.

- gh-156698: Fix `asyncio.ProactorEventLoop` UDP transports so that a write error no longer strands a paused protocol: the write loop is now rescheduled when data remains buffered, and the protocol is resumed when the buffer has drained.

- gh-156658: `xml.dom` and `xml.etree.ElementTree` no longer treat characters which are not white space in XML (such as U+00A0) as white space. Previously they could be lost in `indent()`, `canonicalize()` with `strip_text=True`, and when parsing with the `whitespace-in-element-content` feature turned off.

- gh-156568: `zipapp.create_archive()` now correctly sets the executable bit on the target archive when copying a zipapp where the target is a path-like object.

- gh-156545: Fix the sampling profiler’s flamegraph export so that profiling a deeply recursive program no longer fails with `RecursionError` instead of producing a flamegraph. Patch by tonghuaroot.

- gh-156476: The pure Python implementation of `queue.SimpleQueue.get()` now ignores *timeout* when *block* is false, matching the documented behavior and the C implementation. It previously raised `ValueError`.

- gh-156444: Fix matching of a negated character set in a bytes pattern compiled with both `re.IGNORECASE` and `re.LOCALE`. The case closure is now applied to the members of the set, so that `[^bc]` no longer matches `b'B'`.

- gh-156180: `zlib.adler32_combine()` and `zlib.crc32_combine()` now raise `ValueError` if the *len2* argument is negative, instead of returning rubbish or hanging indefinitely, respectively.

- gh-156166: `ssl`: A failed assignment or deletion of the `_msg_callback` attribute of `ssl.SSLContext` no longer removes the current callback. Deleting it now raises `AttributeError` instead of `TypeError`.

- gh-156173: Calling `zlib.Decompress.flush()` on invalid compressed data now raises `zlib.error` instead of being silently ignored.

- gh-152817: `sqlite3`: Disallow removing the `row_factory` attribute of a cursor to prevent a crash on a query.

- gh-156124: Fix a crash in the free-threaded build when deleting the `contents` attribute of a `ctypes` pointer.

- gh-156101: Fix `sqlite3.Cursor.arraysize` being set to 0 if the assigned value is too large. The attribute is now left unchanged if the assignment fails.

- gh-156100: Fix crashes in `sqlite3.Connection` when deleting the `autocommit` attribute or setting it to an integer which does not fit in C long. Both now raise an exception.

- gh-156099: Fix a crash when deleting the `keylog_filename` attribute of `ssl.SSLContext`. It now raises `AttributeError`.

- gh-156067: Fix error handling in the `zoneinfo` accelerator module when a transition index is `-1` or a TZ string’s `__bool__` raises.

- gh-155997: Fix `concurrent.interpreters.list_all()`. It failed if an interpreter was destroyed during the call, in particular by a garbage collection which finalized the object owning the last reference to it.

- gh-155941: Fix `asyncio.start_server()` when a plain-function *client_connected_cb* raises: the error is now reported like the coroutine case and the transport is closed, instead of leaving the connection open forever (which also made `asyncio.Server.wait_closed()` hang).

- gh-155843: `hmac`: ensure that HMAC objects are properly initialized to prevent rare crashes on allocation failures. Patch by Bénédikt Tran.

- gh-155835: `hashlib`: Fix data races when accessing `digest_size` and `block_size` on SHA-3 objects. Patch by Bénédikt Tran.

- gh-155811: Add a sequence counter to GC statistics to prevent `_remote_debugging` returning inconsistent snapshots caused by non-atomic reads. Patch by Maurycy Pawłowski-Wieroński.

- gh-155717: `multiprocessing`’s default start method is now “spawn” instead of `"forkserver"` when there is no writable temporary directory, such as on a read-only file system. Previously starting a process failed with an `OSError` there. Patch by Bénédikt Tran.

- gh-155775: Fix a regression in `imaplib` introduced in the fix for gh-63121: refreshing the capabilities after a successful `login()` or `authenticate()` consumed the `CAPABILITY` response, so it could no longer be read with `response()`.

- gh-113318: Fix crashes when deleting an attribute whose setter is generated by Argument Clinic and is not prepared for deletion, among them `frame.f_trace_opcodes` and the `context`, `owner` and `session` attributes of `_ssl._SSLSocket`. Deleting such attribute now raises `AttributeError`.

- gh-150449: Fix `sqlite3.Blob` slices with a negative step. Reading or writing such a slice raised `SystemError`. It now raises `ValueError`.

- gh-155336: Fix error handling in `socket.gethostbyaddr()` and `socket.gethostbyname_ex()` when hostname resolution fails.

- gh-102475: Fix `os.path.realpath()` on Windows: the unresolved part of the path is now appended, not joined, so a file name which looks like a drive (e.g. `spam:eggs`) no longer discards the resolved part. A path relative to another drive is now resolved against the root directory of that drive.

- gh-89760: Fix `os.path.realpath()` on Windows: the `\\?\` prefix is no longer stripped from a volume GUID path, which made the result invalid.

- gh-84419: Fix `os.stat()` on Windows: trailing dots and spaces, which are ignored by the operating system, are no longer taken into account when the execute permissions are guessed from the file extension.

- gh-155319: `warnings.warn_explicit()` now displays the source line taken from the loader of the module whose globals are passed as *module_globals*. It also no longer raises `IndexError` if *lineno* is out of the range of the module source.

- gh-123011: `warnings.warn_explicit()` no longer emits a spurious `DeprecationWarning` or raises `ImportError` when it is called with the globals of the `__main__` module.

- gh-69370: **python -m inspect --details** no longer fails with `UnicodeEncodeError` if the path of the module contains characters unencodable in the encoding of `sys.stdout`. Such characters are now escaped with backslashes.

- gh-69371: Fix `pydoc` for modules whose path contains undecodable bytes. `pydoc.writedoc()` and the pydoc HTTP server no longer fail with `UnicodeEncodeError`: the file URL is now percent-encoded using the filesystem encoding, and characters unencodable in the generated HTML page are escaped with backslashes.

- gh-154855: Fix `curses.window.instr()` returning one character too few when the `curses` module is built against a curses library that counts the terminator in the requested length, such as the NetBSD one.

- gh-154594: Fix `copy.deepcopy()` so that an object whose deep copy is `None` is still memoized. Patch by tonghuaroot.

- gh-135683: `logging.FileHandler` and `logging.handlers.WatchedFileHandler` now honor `logging.raiseExceptions` for errors that occur while opening the file, like for other errors during logging.

- gh-82535: `logging.handlers.SysLogHandler` no longer fails if the address cannot be resolved when the handler is created. The address is resolved again when a record is emitted.

- gh-153970: Calling `str()` on a `subprocess.CalledProcessError` no longer raises `TypeError` when its `returncode` is not an integer, such as `None`.

- gh-154194: Fix the sampling profiler dropping entire samples when a non-fatal read fails; frames now keep any readable metadata, and long funcnames and filenames are truncated instead. Patch by Maurycy Pawłowski-Wieroński.

- gh-153005: `concurrent.interpreters.Queue.get()` and `concurrent.interpreters.Queue.put()` now compute their `timeout` deadline from `time.monotonic()` instead of the wall clock, so adjusting the system clock during the call no longer makes them over- or under-wait.

- gh-154062: Stop normalizing differential flamegraph baselines to the duration of the current profile.

- gh-81241: Fix `OSError` when importing `ctypes` from a statically linked interpreter.

- gh-153838: Skip non-regular files in the `profiling.sampling` heatmap exporter instead of reading them unconditionally. Patch by tonghuaroot.

- gh-153603: Fix a crash in the ISO-2022 decoders when decoding a byte after an unknown charset designation is set via the decoder’s `setstate` method. Patch by tonghuaroot.

- gh-153539: Fix a crash in the C implementation of `io.TextIOWrapper.tell()` when the decoder’s `getstate` method triggers a reentrant seek, or when another thread seeks the same stream concurrently. Patch by tonghuaroot.

- gh-152754: Fix a crash when the same `os.scandir()` iterator is used concurrently from multiple threads. It no longer releases the directory handle while another thread is reading from it. Sharing an iterator between threads remains subject to race conditions: which entries each thread receives is unspecified.

- gh-153364: Make frame, coroutine and task-waiter walks iterative and bounded, avoiding potential hangs and stack overflows. Fix asyncio task inspection when awaited-by sets contain removed entries. Patch by Maurycy Pawłowski-Wieroński.

- gh-151292: Fix `profiling.sampling --binary` leaving unreadable profile files when the binary format reaches a size limit. Preserve collected samples when the writer can still finalize safely. Patch by Maurycy Pawłowski-Wieroński.

- gh-152721: Fix quadratic replay time in the `profiling.sampling` binary reader when a profile’s run-length-encoded samples alternate thread status.

- gh-151126: Fix a crash caused by failing to set `MemoryError` on allocation failure when passing `ctypes.Structure` or `ctypes.Union` instances by value to ctypes foreign functions.

- gh-152692: Fix `annotationlib.type_repr()` returning a string such as `None.list.append` for bound built-in methods, whose `__module__` is `None`. It now returns the qualified name, as it already did for other builtins.

- gh-152204: Fix the pure-Python implementations of `datetime.date.fromisoformat()`, `datetime.time.fromisoformat()` and `datetime.datetime.fromisoformat()` silently accepting some malformed ISO 8601 strings, such as non-ASCII digits or a sign in a fixed-width field (for example `'2020+12'` or `'20201212T0102٣٤'`). Each field is now required to be exactly *N* ASCII digits, matching the C implementation.

- gh-133998: Fix `tarfile.open()` in streaming write mode (`w|gz`) raising `struct.error` when given an *mtime* outside the range of the gzip header’s 32-bit timestamp field. Out-of-range values are now stored as `0`, matching `gzip`.

- gh-117807: Fix `mimetypes` initialization from MIME map files containing invalid UTF-8 bytes.

- gh-145856: Fix `plistlib.dumps()` and `plistlib.dump()` so that `skipkeys=True` together with `sort_keys=True` correctly drops non-string keys when the dictionary contains a mix of string and non-string keys. Previously the sort ran before the filter and raised `TypeError`.

- gh-102967: A bug in `doctest._SpoofOut.truncate()` was causing None to be passed to `StringIO.seek()` when no size was given. A simple fix skips the seek call when no size is given so the buffer can be truncated from the current position.

- gh-82039: `http.cookiejar.FileCookieJar.load()` now checks the first, format signature line in a case-insensitive manner. Patch by Ashley Harvey.

- gh-70758: Creating a new `turtle` screen after the previous one was closed no longer raises `turtle.Terminator` on the first turtle command.

- bpo-44012: The `exploded` attribute of `ipaddress.IPv6Address` and `ipaddress.IPv6Interface` now supports addresses with a scope ID (link-local addresses). Previously the former raised `AddressValueError` and the latter omitted the scope ID.

- gh-83869: Fix `tarfile` reading an archive with a GNU sparse 1.0 member whose size is set in the pax extended header. The offset of the next header was computed from the offset of the data, which is already past the sparse map, and from the size of the member, which can be the apparent size of the sparse file. All following members were unreachable.

- gh-61366: `http.cookiejar.MozillaCookieJar` now reads session cookies written by curl and Wget, which use `0` in the expiration time field. Contributed by Jérémie Detrey.

<!-- anchor: documentation | type: section -->
### Documentation

- gh-142083: Document the `'w'` type code in the `array.array` docstring, so that it lists the same type codes as `array.typecodes` and the `array` module documentation.

<!-- anchor: tests | type: section -->
### Tests

- gh-159293: Restore the recursion limit after the free-threading recursion-limit race test to avoid failures in subsequent tests run in the same process.

- gh-159211: The iOS testbed no longer gathers simulator diagnostics when a test run fails.

- gh-157628: In regrtest, only consider that a test leaks if all test runs leak at least one file descriptor. For example, ignore “[0, 1, -1] file descriptors, sum=0” deltas, instead of reporting a leak. Patch by Victor Stinner.

- gh-140550: Enable limited C API tests on Free Threading in test_cext and test_cppext: test the `Py_TARGET_ABI3T` macro. Patch by Victor Stinner.

- gh-75876: A test decorated with `bigmemtest()` now runs in a subprocess if it really allocates the memory it asks for (that is, if the `-M` option is used), so that the memory it uses and the address space it fragments are released when it ends. A dummy run stays in the process. The separate memory watchdog process is no longer needed: the parent process watches the memory usage of the subprocess.

- gh-155411: Fix `test.support.subTests()` for asynchronous test methods. They were wrapped in a synchronous function, which discarded the coroutine without awaiting it, so the test silently did not run at all.

- gh-132581: The list of tests which altered the execution environment now includes the reasons why the environment was considered altered, for example an unraisable exception or a modified `sys.path`. The final result no longer repeats the same state twice (like `ENV CHANGED then ENV CHANGED`).

- gh-155109: Add `test.support.run_with_limited_c_stack()` and use it in tests that exhaust the C stack with a fixed number of recursive calls, so that their outcome no longer depends on the C stack size.

<!-- anchor: build | type: section -->
### Build

- gh-159440: The version string reported by `sys.version` no longer carries a spurious `-dirty` suffix when CPython is built out-of-tree from a clean git checkout: the build stamp now checks the source tree instead of the build directory.

- gh-158683: Fix the `Modules/Setup` entry for the `_zstd` module by adding missing source files.

- gh-157142: Fix the link of `Programs/_freeze_module` when extension modules are built in (`MODULE_BUILDTYPE=static`) and the test modules are enabled: `Modules/getpath_noop.c` now defines `_Py_Get_Getpath_CodeObject()`, which `_testinternalcapi` uses.

- gh-155911: Fix curses detection when a curses library is already in `LIBS`. Patch by Shamil Abdulaev.

<!-- anchor: windows | type: section -->
### Windows

- gh-157789: Use compiler option `-Og` in case of clang-cl debug builds on Windows to reduce stack usage. Patch by Chris Eibl.

- gh-72353: Reading from the console on Windows now continues if the read was cancelled by Ctrl+C, but the `SIGINT` handler did not raise an exception. Previously the read ended as if at end of file.

- gh-86427: Fix the encoding of the standard streams in the legacy Windows stdio mode (`PYTHONLEGACYWINDOWSSTDIO`). It is now the code page of the console, as in Python 3.7, not the ANSI code page.

- gh-87587: `os.device_encoding()` on Windows now returns the code page of any console file descriptor, not only 0, 1 and 2, and returns `None` for other character devices like `NUL`. The UTF-8 code page is now reported as `"utf-8"` instead of `"cp65001"`.

<!-- anchor: idle | type: section -->
### IDLE

- gh-56596: Make IDLE keyboard shortcuts with ascii letters work when Caps Lock is on even when only one of the upper and lowercase versions are defined.

- gh-64007: IDLE no longer applies syntax coloring to the text entered for `input()` in the Shell.

- gh-85560: Fix IDLE failing to find the opening parenthesis when a continuation line inside the parentheses starts with `else` of a conditional expression or with `yield`.

- gh-75487: Fix saving a truncated number when an integer entry in the IDLE Settings dialog is blanked with the Backspace key.

- gh-74112: Ctrl-C in the IDLE Shell now interrupts blocking calls such as `time.sleep()` and `socket.recv`.

- gh-151471: Colorize the soft keyword `type` in IDLE.

- gh-103089: IDLE no longer hangs when opening a file with very long lines. Only the first 2,000 characters of a line are colorized.

- gh-70331: IDLE no longer fails to start with `python -m idlelib`, and its user process no longer fails to start, when the current directory contains user files with the same names as standard library modules that IDLE imports, such as `random.py` or `tkinter.py`.

- gh-93016: Fix parsing of command line arguments in the IDLE “Run… Customized” dialog on Windows: backslashes are no longer treated as escape characters. Fix also display of the previous arguments in the dialog.

- gh-69365: The IDLE search dialogs now show a regular expression error below the entry instead of in a message box.

- gh-105689: Fix calltips, parenthesis matching and auto-indent in the IDLE Shell after output containing unbalanced quotes or parentheses.

- gh-60402: In IDLE, Tab in a string that is not the start of a file name inserts a tab instead of opening the completion list.

- gh-68453: Fix running IDLE with the -s option together with -c, -r or -: the command or script now runs after the startup file, without an error dialog and without restarting the shell.

- gh-69919: IDLE now reports any exception raised by compiling the source, such as `MemoryError` for too deeply nested source, instead of hanging the Shell.

- gh-91398: Remove the border around the IDLE Shell sidebar, which was drawn in the window background color and stood out with dark themes.

- gh-71136: Fix a hang of the IDLE Shell when code run under the debugger raises `KeyboardInterrupt`.

- gh-154511: Consolidate IDLE’s mouse wheel handling in `idlelib.util`. `wheel_event` moves there from `idlelib.tree` and joins `x11_buttons`, which tells whether Tk reports wheel rotations to a widget as `<Button-4>`/`<Button-5>` events, and `bind_wheel`, which binds whichever events Tk sends.

- gh-156896: Stop deleting tkinter submodules when idlelib.run is imported.

- gh-153480: Fix IDLE failing to start when opening a file which does not exist yet. Fix a traceback when a file open in the IDLE editor is deleted by another program; IDLE now asks whether to close the window, save the file elsewhere, or ignore it.

- gh-66172: IDLE no longer fails to start when a user configuration file is corrupt. The unparsable file is renamed with a “.bad” suffix, default settings are used instead, and a warning lists the affected files.

- gh-90304: Prevent IDLE from failing to start when a font reports a zero width for the `'0'` character. Such a broken font caused a `ZeroDivisionError`; the editor now falls back to the configured width.

- gh-135511: Fix display of `NameError` and `AttributeError` with multi-line message.

<!-- anchor: tools-demos | type: section -->
### Tools/Demos

- gh-158451: `python-gdb.py` is now able to format an invalid Unicode string: render invalid characters as `\Uhhhhhhhh` instead of raising an exception. Patch by Victor Stinner.

- gh-156219: Fix Argument Clinic generating code which reads an optional positional argument which was not passed, if the function has a `**kwds` parameter.

- gh-113318: Fix Argument Clinic for `@getter` and `@setter` in a preprocessor conditional block. It failed with an internal error. Argument Clinic now also rejects the accessors of the same attribute with different C basenames, and the same accessor defined twice, which silently generated invalid or duplicated entries of `PyGetSetDef`.

- gh-155218: Fix Argument Clinic generating the flags of the optional groups in different order on 32-bit and 64-bit platforms.

- gh-155207: Argument Clinic now supports the `--dry-run` and `--diff` options. They list the files which would be changed, or write a unified diff of the changes to the standard output, without modifying any file.

- gh-64502: Fix Argument Clinic support of parameters with a default value used together with optional groups. Such parameters were always required in the generated parsing code.

<!-- anchor: c-api | type: section -->
### C API

- gh-149044: Fix the `PySlot_END` macro for C++: initialize all members to avoid compiler warnings. Patch by Victor Stinner.

- gh-158810: Fix `Py_ARRAY_LENGTH()` macro on C++: do not use `__builtin_types_compatible_p()` on C++. Patch by Victor Stinner.

- gh-157649: Fix `Py_CLEAR` and `Py_SETREF` macros on C++: implement them using `auto` instead of `decltype()`. Using `decltype()` produced invalid code when clearing/setting an array item. Patch by Victor Stinner.

- gh-142217: Add tests on the undocumented and deprecated `_Py_Identifier` C API. Patch by Victor Stinner.

- gh-157384: `PyImport_CreateModuleFromInitfunc()` now sets the package context while calling *initfunc*, so that a single-phase init submodule created with only the last component of its name gets the full name from the spec.

- gh-157242: Fix `PyBytesWriter_Resize()` to handle properly memory allocation failure. Leave the writer unchanged on error, instead of leaving it in an inconsistent state. Patch by Victor Stinner.

- gh-156101: Don’t set the result in error in `PyLong_AsInt32()`, `PyLong_AsUInt32()`, `PyLong_AsInt64()` and `PyLong_AsUInt64()`. Leave the result unchanged in this case. Patch by Victor Stinner.

<!-- anchor: python-3-15-0-final | type: section -->
## Python 3.15.0 final

*Release date: 2026-10-09*

There were no new changes in version 3.15.0.

<!-- anchor: python-3-15-0-release-candidate-3 | type: section -->
## Python 3.15.0 release candidate 3

*Release date: 2026-10-02*

<!-- anchor: id2 | type: section -->
### Security

- gh-158446: Fix a crash or incorrect output that could occur when formatting a `float` or `complex` with a precision close to the platform’s `INT_MAX`. `PyOS_double_to_string()` now raises `ValueError` for any precision of that magnitude, regardless of presentation type or value, as the format string parsers already did for precisions above `INT_MAX`.

- gh-156793: `asyncio`: `loop.start_tls()` and `loop.create_connection()` now validate the *server_hostname* argument if an `ssl.SSLContext` is passed with *check_hostname* set to `True`.

- gh-156793: `ssl.SSLContext.wrap_bio()` now validates its *server_side*, *server_hostname* and *session* arguments similar to `ssl.SSLContext.wrap_socket()`.

  In particular, a context with `check_hostname` enabled and no *server_hostname* passed to `wrap_bio()` now raises `ValueError` instead of completing a handshake that verified the certificate chain without verifying the peer’s identity, with no indication that the check had been skipped.

- gh-157265: In `tarfile`, when extracting a link falls back to extracting a member of the archive, skip the member when the filter function returns None when called with the extracted member’s name replaced with the link’s.

- gh-157953: Update bundled libexpat to version 2.8.5.

- gh-157579: Fix a race condition in the cleanup of `tempfile.TemporaryDirectory`. When working around file system permission errors, files are now removed relative to open directory file descriptors instead of resolving their path again, so that replacing a directory of the tree with a symbolic link can no longer make the cleanup delete files outside of the temporary directory. This addresses **CVE 2026-12345**.

- gh-156293: Fix a crash in `ssl` when an `sni_callback` switches a connection to another `SSLContext` and the context that carries the callback is no longer referenced by the application. Servers that keep their `sni_callback` context alive (the usual case when it wraps the listening socket or is stored on the server object) were not affected. This addresses **CVE 2026-19445**.

<!-- anchor: id3 | type: section -->
### Core and Builtins

- gh-158140: Resolve lazily imported sibling submodules independently, so accessing one does not import another merely because its declaration came last.

- gh-158364: Fix crash when `sys._current_frames()` or `sys._current_exceptions()` is called while another interpreter is running.

- gh-158254: Reverse iterators over a `dict` and its views now raise `RuntimeError` if the dictionary’s keys change during iteration, like forward iterators, instead of yielding entries for the new keys.

- gh-157914: Revert gh-146064. The linked PyMutex change was causing a significant performance regression in some cases.

- gh-157838: Merge biased reference counts on behalf of threads that are detached instead of waiting for them to attach again, in the free-threaded build.

- gh-157778: Include the line number of the opening brace in the `SyntaxError` for an unclosed f-string or t-string replacement field when a matching quote on a later line is interpreted as the start of an unterminated string.

- gh-157757: Fix a lazy `import a.b as c` reading `b` off `a` instead of importing the module `a.b`. It now binds the submodule, and raises `ModuleNotFoundError` when no module backs the name.

- gh-155695: Resolved names are now removed from `sys.lazy_modules` more consistently: a lazy import of an already loaded module is no longer recorded, and reifying `lazy from pkg import attr` now discards the `pkg.attr` entry.

- gh-157378: Fix `SyntaxError.offset` and `SyntaxError.end_offset` for the “Non-UTF-8 code starting with …” error when a non-ASCII character precedes the invalid byte on the same line. Patch by Shamil Abdulaev.

- gh-156762: Fix undefined behaviour in `operator.methodcaller`: its `tp_clear` slot function returned `void` instead of `int`, so the garbage collector called it through an incompatible function type. Patched by Shamil Abdulaev.

- gh-157377: Fix `gc.get_count()` on the free-threaded build resetting the thread-local allocation counter that schedules automatic garbage collection. A thread that called it while allocating could prevent cyclic garbage from ever being collected.

- gh-157247: Fix `sys.activate_stack_trampoline()` allowing activation from a subinterpreter while the JIT is enabled in the main interpreter.

- gh-156995: Fix `bytearray` sharing its buffer with the single-byte `bytes` object of the same value, so that writing to the bytearray modified that `bytes` object. This happened with `bytearray.take_bytes()` when exactly one byte remained, and on the free-threaded build when a bytearray was shrunk to one byte from another thread.

- gh-156910: Fix a deadlock in the free threaded build when setting `__abstractmethods__` on a type while another thread holds the type lock.

- gh-156894: Fix the position of syntax errors which cover a range if the line contains non-ASCII characters before the error.

- gh-155525: Fix quadratic-time tokenization of modules containing many f-strings or t-strings.

- gh-156689: Fix an out-of-bounds read in `compile()` and `ast.parse()` when an AST object is passed with `mode='func_type'`.

- gh-156114: Fix a crash in the perf trampoline when a code object has a name or filename that cannot be encoded to UTF-8. Patched by Shamil Abdulaev.

- gh-156126: Fix a crash when importing a module whose name contains characters that cannot be encoded to UTF-8 (such as lone surrogates) while `-X importtime` is enabled.

- gh-155526: Fix spurious `OverflowError` for `abs(nanj)` in case `errno` was previously set to `ERANGE` by some library call. Patch by Sergey B Kirpichev.

- gh-151464: Exclude invalid token `<>` from `tokenize` output. `SyntaxError` for `<>` now suggests `!=`.

- gh-154719: Trailing whitespace in a t-string interpolation expression is now preserved in `string.templatelib.Interpolation.expression`, up to the closing `}` or the conversion (`!`), format (`:`), or debug (`=`) delimiter. Explicit line continuations following a debug `=` remain part of the debug text and are excluded from `expression`.

- gh-152708: Fix AST generation asymmetry where unary positive `+` was implicitly dropped in pattern match expressions, restoring parsing parity with unary negative `-`.

<!-- anchor: id4 | type: section -->
### Library

- gh-157788: Fix `python -m asyncio ps` failing on a process that has a task with a name longer than 255 characters.

- gh-157660: Fix `profiling.sampling` reporting errors or incorrect line numbers in free-threaded builds when a thread-local bytecode array grows or gains entries after being cached.

- gh-157639: Fix a crash in `cProfile` when an external timer re-enters the profiler. Profiling events raised while the external timer runs are now ignored.

- gh-157335: Fix out-of-bounds write in `mmap.mmap.__setitem__` that could occur when converting the index or the assigned value (via `__index__()` for a single item, or via the buffer protocol for a slice) resized or closed the mmap object during the assignment.

- gh-128509: `marshal.load()` and `marshal.loads()` can now get 1-byte string singletons. Patch by Victor Stinner.

- gh-157301: Fix `asyncio.Task` hanging the event loop when an eager start fails to enter the task’s context.

- gh-157213: Fix `asyncio.gather()` leaving stale await-graph edges on children that outlive it.

- gh-156002: `zipfile` again reads members through a third-party decompressor installed by monkey-patching the private `_get_decompressor()` to return an object that only implements old BZ2Decompressor API from Python 3.3. Note that decompressors without `needs_input` and two-argument `decompress()` are vulnerable to **CVE 2026-15310**.

- gh-157159: The usage message printed by `python -m tabnanny` when no arguments are given now suggests `python -m` instead of the source file.

- gh-157058: `asyncio.wait_for()` with a non-positive timeout now records the waiter in the call graph.

- gh-156933: Fix incorrect integer return values from `ctypes` callbacks on some platforms, such as s390x.

- gh-156988: `asyncio.print_call_graph()` no longer truncates the call stack at a synchronous generator.

- gh-156970: Set the docstring of `unittest.mock.Mock.return_value`.

- gh-156924: `annotationlib.ForwardRef.evaluate()` now resolves lazy import proxies found in the namespace. With `FORWARDREF`, a lazy import that fails to resolve now results in a `ForwardRef` instead of the `lazy import proxy`, and with `VALUE` the underlying exception is propagated.

- gh-127057: Fix `asyncio.ProactorEventLoop` UDP transports so that a `ConnectionResetError` raised by `WSARecvFrom` no longer stops the read loop.

- gh-156512: Fix `asyncio` losing a connection twice when `resume_writing()` closes the transport.

- gh-155596: Fix `pprint.pprint()` and `pprint.pformat()` with `expand=True` not honouring *width* for nested values. The width of the `'key':` prefix was not counted when deciding whether a value fitted on the current line, so values under long keys could overflow *width* instead of being expanded.

- gh-155433: Fix `asyncio.TaskGroup` losing outside cancellation after `cancel()`.

- gh-155418: Fix `asyncio.TaskGroup` hang when a task created by `asyncio.eager_task_factory()` cancels the group before suspending.

- gh-155143: Fix `asyncio.shield()` leaking the calling task via the await-graph and callbacks when called on a future that never resolves.

- gh-154470: Fixed a spurious `^J` printed at the end of every source line by the `list` command of `pdb` when the output is colorized (for example when attaching to a running process). The source line is now stripped before it is colorized, like the `where` command already did.

- gh-154335: The `profiling.sampling` profiler now respects `NO_COLOR`, `FORCE_COLOR`, and `PYTHON_COLORS` and avoids colored output when not writing to a terminal.

- gh-154090: Record the profiling mode in Tachyon binary profiles and reject differential comparisons whose known modes do not match.

- gh-152907: Restore cooked-mode terminal output flags around `PyOS_InputHook` callbacks in the new REPL (`_pyrepl`), so that output written by an input hook (for example a GUI toolkit event loop) is no longer emitted with `OPOST` disabled and keeps its carriage returns.

- gh-151179: Fix a pidfd leak in `_PidfdChildWatcher` on Linux: the watcher no longer leaks the process file descriptor when `waitpid()` fails with an error other than `ChildProcessError`.

<!-- anchor: id5 | type: section -->
### Documentation

- gh-57491: Reduce the depth of the table of contents in the EPUB documentation from three levels to two, making it much shorter and easier to navigate in e-book readers.

<!-- anchor: id6 | type: section -->
### Tests

- gh-158051: The iOS testbed has been updated for compatibilty with Xcode 27.

<!-- anchor: id7 | type: section -->
### Build

- gh-158010: Update Android and iOS build scripts to use OpenSSL 3.5.9.

- gh-157549: Use `sysconf(_SC_PAGESIZE)` instead of `getpagesize()` in `remote_debug.h` so `_remote_debugging` builds on Darwin with `-Werror=implicit-function-declaration`.

- gh-152023: Update Android builds to SQLite 3.53.4. Additionally, enable the `median()` and `percentile()` functions.

<!-- anchor: id8 | type: section -->
### Windows

- gh-158010: Updated Windows builds to use OpenSSL 3.5.9.

- gh-157368: Fix truncated `sys.version` in the case of clang-cl versions 22 or newer on Windows. Also fixes the Windows on Arm case, where the Microsoft compiler was reported instead of clang. Patch by Chris Eibl.

- gh-157212: Fix `_Py_ThreadId()` compilation on Windows ARM64 with MinGW toolchains, where `__getReg()` is unavailable. The TEB address is now read directly from `x18`. Patch by Christian Aurich.

- gh-152023: Update Windows builds to SQLite 3.53.4. Additionally, enable the `median()` and `percentile()` functions.

<!-- anchor: macos | type: section -->
### macOS

- gh-158010: Update macOS installer to use OpenSSL 3.5.9.

- gh-152023: Update macOS installer builds to SQLite 3.53.4.

<!-- anchor: id9 | type: section -->
### IDLE

- gh-158067: Fix the IDLE File Open dialog listing text files before Python files when opened from the Shell or an Output window.

- gh-75512: Output from a thread printed in the IDLE Shell while a statement is being entered no longer takes over the prompt of the statement.

- gh-89544: Fix IDLE hanging after Restart Shell while receiving a large output from the user process.

- gh-59568: Fix “Save As” and “Open” dialogs in IDLE for a file whose name starts with `~` on Windows and X11 with Tcl/Tk older than 9.

- gh-69004: The Debugger item of the IDLE Debug menu is now disabled while user code runs, like Stack Viewer.

- gh-93966: The highlighting of a syntax error in the IDLE Shell is now removed when the next statement is entered, not only when the next syntax error occurs.

- gh-75234: Fix editing help sources and key bindings in the IDLE Settings dialog after selecting them with the keyboard.

- gh-55646: Fix IDLE crash at startup when the user configuration contains an invalid key binding, such as `<Alt-Key-up>` instead of `<Alt-Key-Up>`. The invalid binding is now ignored with a warning.

<!-- anchor: id10 | type: section -->
### C API

- gh-156939: Fix `PyBytesWriter_FinishWithSize()` to return an empty bytearray when `_PyBytesWriter_CreateByteArray()` is used, instead of returning an empty bytes string. Patch by Victor Stinner.

- gh-156939: Fix `PyBytesWriter_Format()` error handling: restore the writer to its previous state on error. Patch by Victor Stinner.

- gh-140550: Fix the `PyABIInfo_VAR` macro: remove redundant `;`. Before, `PyABIInfo_VAR(abi_info);` code added two `;;` which is illegal in C++03. Patch by Victor Stinner.

<!-- anchor: python-3-15-0-release-candidate-2 | type: section -->
## Python 3.15.0 release candidate 2

*Release date: 2026-09-01*

<!-- anchor: id11 | type: section -->
### Security

- gh-156723: Update bundled libexpat to version 2.8.4.

- gh-156002: Bound the amount of data `zipfile` decompresses per read for members compressed with bzip2, LZMA, or Zstandard, matching the existing limit for deflate. A small archive member could previously expand into an unbounded allocation even when read in small chunks.

- gh-155999: Fix the `tarfile` `tar` and `data` extraction filters creating directories outside the destination for members whose name leaves the destination and returns to it, such as `../evil/../dest/sub/file`. The containment check used the resolved path, but intermediate directories were created from the name as given.

- gh-155292: Change the `stringprep` module and `encodings.idna` codec to not consider Unicode codepoint attributes beyond those defined in **RFC 3454**.

- gh-155694: Fix **CVE 2026-15806** by scoping `HTTPPasswordMgr` credentials to the URL scheme, preventing credentials stored for an HTTPS URL from being used for a matching HTTP URL, while URIs without a scheme continue to match any scheme.

<!-- anchor: id13 | type: section -->
### Core and Builtins

- gh-155725: `tracemalloc` no longer acquires the GIL nor creates a temporary thread state to trace memory allocations: traceback frames now store plain UTF-8 strings instead of Python str objects, and tracebacks are captured using the Python thread state already associated with the calling thread, even if it is not attached. Threads without a Python thread state record the traceback as `<unknown>`.

- gh-148750: `encodings` is no longer frozen, due to issues importing submodules when using a zipped standard library.

- gh-155254: Avoid warning about missing standard library when using _pth files.

- gh-155978: Fix a memory leak in the free-threaded build when setting or deleting a special method (such as `__repr__`) on a class that has many subclasses.

- gh-155752: Fix a crash when a `types.GenericAlias` argument gains a `__typing_subst__` hook after the alias parameters have been cached.

- gh-129752: Don’t update adaptive counters in the free-threaded build when thread-local bytecode is disabled (`-X tlbc=0`). Patch by Donghee Na.

- gh-155515: Track the internal HAMT iterators, which back iteration over a `contextvars.Context`, with the garbage collector. A reference cycle running through such an iterator was never collected, leaking the whole context it iterated over.

- gh-155400: Fix a deadlock in the free-threaded build between two threads assigning to a special method of the same class. While applying the type slot updates with the world stopped, only the type lock was prevented from being released; the type dict mutex could still be released and re-acquired, in the wrong order, if the thread blocked on the stop-the-world mutex.

- gh-155363: Fix a leak in the free-threaded build when creating a thread state fails after an internal QSBR slot has been reserved for it. The slot could never be reclaimed, so the QSBR array grew without bound across repeated failures.

- gh-154701: Fix an infinite loop in JIT when a `FOR_ITER` side exit links an executor back to itself.

- gh-154196: Improve `AttributeError` messages from unresolved lazy imports. Patch by Bartosz Sławecki.

- gh-151377: Fix races in free-threaded builds when updating type slots for newly created classes and when removing entries from a base type’s subclasses dictionary.

- gh-148817: Fold large constant list and set literals used as the iterable of a `for` loop or `in`/`not in` test into a constant `tuple` or `frozenset`, restoring an optimization previously done by the AST optimizer that was lost when constant folding moved to the CFG.

- gh-85260: `compile()` now raises `ValueError` instead of crashing on a debug build if an identifier field of an AST node (such as the name of a function, a class, an imported module or a caught exception) is `"None"`, `"True"` or `"False"`.

<!-- anchor: id14 | type: section -->
### Library

- gh-156523: Fix `asyncio.as_completed()` not recording the awaiting task in the call graph.

- gh-156408: Fix `asyncio.print_call_graph()` raising `AttributeError` when called on a task that has already finished.

- gh-156404: Restore compatibility with `.pth` files generated before Python 3.15 in the `site` module. Inject the `fullname` variable in the frame which executes pth code.

- gh-156353: Fix `configparser` parsing when using whitespace in *delimiters*.

- gh-156112: `_ios_support` no longer fails to import when `ctypes.util.find_library()` cannot resolve the ObjC runtime through the dyld shared cache, as is the case on iOS 13. The runtime is now loaded by name, which dyld resolves against the cache directly.

- gh-155974: Fix a regression in Python 3.15: `addstr()`, `addnstr()`, `insstr()` and `insnstr()` again restore the window attributes when the write fails, instead of leaving the temporary *attr* applied.

- gh-155952: Fix the signatures of `sqlite3.Connection.execute()`, `warnings.warn()` and `locale.setlocale()` which rendered `<unrepresentable>` instead of the correct defaults for parameters.

- gh-155888: Fix `asyncio.WriteTransport.writelines()` hanging the transport when the last data chunk is empty.

- gh-155869: Fix `reorganize()` in `dbm.dumb` failing to persist updated value offsets, which could cause data loss after reopening the database.

- gh-155781: Fix a possible crash in free-threaded builds when the `sqlite3` converter registry is modified concurrently while a cursor builds its row cast map.

- gh-155702: Fix `sqlite3.Blob` slice assignment with a step. It patched the bytes object read from the blob, which for a single byte is an immortal singleton, so that the value of that byte was changed in the whole process.

- gh-155468: Fix `netrc` to distinguish empty quoted tokens from end-of-file, so malformed files no longer cause the remaining content to be silently ignored.

- gh-155519: Avoid a data-race in free-threaded builds when reading and writing context variables from different threads.

- gh-155009: Fix `argparse.ArgumentParser` to preserve the program name from `sys.argv[0]` when a named module is executed as the main program without replacing `sys.argv[0]`.

- gh-155063: Bump the version of pip bundled in ensurepip to version 26.2.1

- gh-153711: On macOS, add run-time checks around the syscalls *pipe2 (2)* and *dup3 (2)*, in addition to the existing build-time checks. This means that Python built on macOS 27 (where these calls are available) can run on macOS 26 (where they aren’t).

- gh-154871: Fixed a crash in `asyncio.Task.get_context()` when called on an uninitialized task.

- gh-154568: Fix `array` unpickling of little-endian float16.

- gh-154566: Fix `array.array.byteswap()` corrupting data for `'Zd'` (complex double) arrays with more than one element: the 16-byte item loop advanced the buffer pointer by only 8 bytes per iteration, causing items after the first to be scrambled.

- gh-154467: Fixed `pdb` remote attaching (`python -m pdb -p PID`) sending an empty prompt to the client instead of `(Pdb)` when the target process has an interactive terminal.

- gh-153772: `isinstance()` checks against `collections.abc` classes such as `Mapping` no longer raise `AttributeError` when the instance has no `__class__`. The abstract base class machinery now falls back to the object’s type in that case, matching the behaviour of the built-in `isinstance()`.

- gh-154086: Store per-thread sample counts in Tachyon flamegraphs so filtering a thread updates frame widths and totals.

- gh-154060: Store measured duration and sampling rate in Tachyon binary profiles so they remain available in replayed flamegraphs.

- gh-154085: Prevent differential flamegraphs from duplicating self time across line nodes for the same function.

- gh-154088: Make Tachyon count and render elided stacks consistently in differential flamegraphs.

- gh-154089: Do not show unavailable sampling efficiency statistics in replayed Tachyon flamegraphs.

- gh-153158: Remove the erroneous *width* argument of `calendar.HTMLCalendar.formatmonthpage()`, which could drop the year from the heading.

- gh-113329: Fix `OSError` being raised when trying to run doctests on a class objects in the REPL. Patch by Sten Wessel.

<!-- anchor: id15 | type: section -->
### Build

- gh-156369: Update Android and iOS build scripts to use OpenSSL 3.5.8.

- gh-156115: iOS simulator builds are now configured with `-mios-simulator-version-min` instead of the device’s `-mios-version-min`. The device flag made the linker reject libraries resolved from the simulator SDK, so library detection silently failed.

<!-- anchor: id16 | type: section -->
### Windows

- gh-156369: Updated Windows builds to use OpenSSL 3.5.8.

<!-- anchor: id17 | type: section -->
### macOS

- gh-156369: Update macOS installer to use OpenSSL 3.5.8.

<!-- anchor: id18 | type: section -->
### Tools/Demos

- gh-154059: Fix the time units in Tachyon flame graph tooltips by accounting for the sampling interval when converting samples to milliseconds.

<!-- anchor: id19 | type: section -->
### C API

- gh-131740: On the free-threaded build, `PyUnstable_GC_VisitObjects()` now also visits frozen objects (objects moved to the permanent generation by `gc.freeze()`), matching the behavior of the default build.

<!-- anchor: python-3-15-0-release-candidate-1 | type: section -->
## Python 3.15.0 release candidate 1

*Release date: 2026-08-04*

<!-- anchor: id20 | type: section -->
### Security

- gh-152674: The `xml.etree.ElementTree.Element` methods `findall()`, `iterfind()` and `find()` avoid quadratic behavior when using XPath index predicates (`[1]`, `[last()]`, `[last()-N]`) on XML documents with many same-tag siblings.

<!-- anchor: id21 | type: section -->
### Core and Builtins

- gh-154902: Fix a crash when `__conditional_annotations__` is rebound to a non-set object.

- gh-133931: Fix data races when setting attributes of function objects on the free threaded build.

- gh-154775: When matching a complex literal in `case` statements, an extraneous `+` sign (for example, `1++1j` or `1-+1j`) is no longer allowed.

- gh-154709: Fix an out-of-bounds access in reverse dictionary iterators when the underlying dictionary is cleared and modified after the iterator is created.

- gh-154695: Fix `asyncio.Task` raising `AttributeError` when created with `eager_start=True` and no explicit *loop* argument.

- gh-153809: Fix interpreter crash while deallocating objects of `asyncio.Task` on free-threaded builds. Contributed by Sergey Miryanov.

- gh-154275: Fix a crash when getting deeply nested `__parameters__` from a `types.GenericAlias` objects.

- gh-154014: Fix a JIT assertion during interpreter shutdown by initializing `vm_data` fields for cold executors that bypass `_Py_ExecutorInit()`.

- gh-153932: Fix thread safety issue in the `__reduce__` method of `enumerate`.

- gh-153881: Fix potential data race when calling `__getstate__()` under the free-threaded build.

- gh-153570: Fix a use-after-free in `bytearray.take_bytes()` when the argument’s `__index__()` method resizes the bytearray. Patch by tonghuaroot.

- gh-153419: Fix multiple `bytearray` crashes and reference leaks caused by skipping `__init__()` and broken state setup code.

- gh-153236: Propagate exceptions raised while importing lazy submodules instead of reporting them as missing attributes.

- gh-148874: Ignore interrupts immediately after calling the `__enter__` method of a context menager in a `with` statement. This ensures that the `__exit__` method is always called in a `with` statement.

- gh-150208: Avoid double-quoting string values from `pyconfig.h` in `sysconfigdata` variables.

<!-- anchor: id22 | type: section -->
### Library

- gh-155063: Bump the version of pip bundled in ensurepip to version 26.2

- gh-154936: Fix the pure Python `json` decoder to report the correct position for invalid literal control characters in JSON strings.

- gh-154892: Fix a bug in the C accelerator for `zoneinfo` where `datetime.datetime` subclasses returning `-1` for `hour`, `minute`, or `second` could incorrectly raise a `SystemError`.

- gh-154848: The `pickle` C accelerator now enforces frame boundaries when unpickling, as the pure Python implementation already did. An argument that straddles a frame boundary, or a frame that begins before the previous one has ended, now raises `pickle.UnpicklingError` instead of being silently read across the boundary. This prevents the loaded data from diverging from the `pickletools` disassembly of the same pickle.

- gh-154885: `os.get_terminal_size()` now checks `isatty` before calling `ioctl`, which reduces log noise on Android.

- gh-109638: Fix exponential time in `csv.Sniffer.sniff()` for a sample which contains many quote characters. A doubled quote character is now also detected in a field which contains the delimiter or a line break.

- gh-98820: Fix quadratic time in `csv.Sniffer.sniff()` for a sample which contains quoted fields, in particular for a single column of quoted fields.

- gh-154738: Fix `ExternalEntityParserCreate()` not propagating the reparse-deferral setting to the subparser, which left `GetReparseDeferralEnabled()` returning an uninitialized value. Patch by tonghuaroot.

- gh-93251: Fix `UnicodeDecodeError` in `socket` functions (such as `getaddrinfo()` and `gethostbyaddr()`) when the localized error message of the C library is not UTF-8: decode it from the locale encoding.

- gh-148468: Fix a regression in `argparse` where colorized argument help containing format specifiers did not accept string-like proxy objects.

- gh-142035: Fix incorrect wrapping of `argparse` help text when color is enabled.

- gh-135736: Fix :`asyncio.TaskGroup` to not wrap a `GeneratorExit` into a `BaseExceptionGroup` if it was raised by the body of the task group and none of the tasks in the group raised exceptions.

- gh-154551: Fix `ctypes.util.find_library()` returning `None` in non-UTF-8 locales.

- gh-79366: Fixed a race condition in `logging`: if a handler was removed while a record was being emitted, the following handlers of the same logger could be skipped.

- gh-154189: Fixed a potential use-after-free when calling `functools.partial()`. Now, when invoking a `partial()` object, the stored function, positional arguments, and keyword arguments are preserved for the duration of the call in case of reentrancy.

- gh-73458: Fix `logging.config.listen()`: it left the caller waiting for the `ready` event forever if the server could not be started, for example if the port was invalid or already in use. It now also binds to an IPv6 address if the host has no IPv4 address, for example if `localhost` is only aliased to `::1`.

- gh-154460: Fix `time.strftime()` and `datetime.datetime.strftime()` returning a wrong ISO 8601 week number (`%V`) on OpenBSD.

- gh-154435: Fix `os.posix_fadvise()` and `os.posix_fallocate()` on DragonFly BSD: they raised `OSError` with a meaningless error code, because these functions return -1 and set `errno` there.

- gh-154399: Fix `venv` activation in a non-interactive csh: `activate.csh` no longer fails when the `prompt` variable is not set.

- gh-154389: Fix `uuid.uuid1()` on OpenBSD: it returned a version 4 UUID, because `uuid_create()` generates random UUIDs on this platform.

- gh-154324: Fix `os.sendfile()` on illumos: it no longer reports a successful transfer when the underlying system call failed without writing any data.

- gh-154307: Fix `tempfile.TemporaryDirectory.cleanup()` on DragonFly BSD, where removing a file with the `UF_NOUNLINK` flag failed with `EISDIR` instead of `EPERM`.

- gh-154291: Fix `socket.has_dualstack_ipv6()` to return `False` on platforms such as DragonFly BSD where setting `IPV6_V6ONLY` to 0 silently has no effect.

- gh-154283: On DragonFly BSD, `threading.get_native_id()` now returns a value that is unique across processes, matching the other platforms.

- gh-154258: Fix a crash in `mmap.mmap.resize()` on NetBSD when growing a shared anonymous mapping. `resize()` now raises `ValueError` in this case, as it already did on Linux.

- gh-131565: `ctypes.util.dllist()` now works on NetBSD. It is implemented in the `_ctypes` extension module so that `dl_iterate_phdr()` reports all loaded shared libraries: on NetBSD it only reports the link-map group of the calling object, which excluded them when called through ctypes.

- gh-154225: Fix `os.openpty()` on Solaris and illumos: it no longer leaves the pseudo-terminal as the controlling terminal of the calling process.

- gh-154227: Fix `os.posix_openpt()` on OpenBSD, where it rejected the `O_CLOEXEC` flag.

- gh-145030: Fix `asyncio` write pipe transports for named FIFOs on macOS and Solaris. Unread data sitting in the FIFO made the transport misinterpret a poll event as the reader disconnecting, wrongly closing the transport.

- gh-154176: Fix a crash in `locale.strxfrm()` on DragonFly BSD, whose `wcsxfrm()` does not support the zero size.

- gh-154836: Fix `subprocess.Popen.wait()` raising `TypeError` (macOS and other BSDs) or `OverflowError` (Linux) for very large *timeout* values such as `float('inf')`, a 3.15 regression in the new event-driven wait. Also fix `select.kqueue.control()` masking `OverflowError` for out-of-range timeouts as `TypeError`.

- gh-154053: Fix compilation of the `ssl` module against LibreSSL, which does not provide `SSL_CTX_set1_sigalgs_list()` and `SSL_CTX_set1_client_sigalgs_list()`. The `set_server_sigalgs()` and `set_client_sigalgs()` methods of `ssl.SSLContext` now raise `NotImplementedError` on LibreSSL.

- gh-154001: Fix `random.binomialvariate()` raising `ZeroDivisionError` when `random.random()` returns zero.

- gh-153908: Fix data race when calling `repr()` on `itertools.count` under the free-threaded build.

- gh-153896: Deduplicate unhashable args in `typing.Literal`.

- gh-153864: On a wide `curses` build, `curses.window.insch()` now inserts a non-ASCII byte as the character it encodes in the window’s encoding, consistently with `addch()`, instead of its code point.

- gh-153862: On a wide `curses` build, `curses.window.inch()` now returns the locale-encoded byte of a non-ASCII character, matching `instr()`, instead of the low byte of its code point.

- gh-146011: Fix a heap-use-after-free in the C implementation of `decimal` when calling `repr()` after deleting the `Context`.

- gh-153761: Fix cancelling `asyncio.loop.sock_accept()` dropping a pending connection.

- gh-127049: Fix a race condition in `asyncio` on Unix where `asyncio.subprocess.Process.send_signal()`, `terminate()` or `kill()` could signal an unrelated process that was recycled onto the PID of the already-reaped child when ThreadedChildWatcher is used. Patch by Kumar Aditya.

- gh-153404: `urllib.robotparser.RobotFileParser` now silently ignores a `Crawl-delay` or `Request-rate` value written with non-decimal digits (such as `U+00B2 SUPERSCRIPT TWO`) instead of raising `ValueError` and aborting the parse of the whole `robots.txt` file.

- gh-153291: Fix a data race in `readline.get_completer()` and `readline.get_pre_input_hook()` on the free-threaded build: the getters read the stored hook without the critical section that the corresponding setters hold.

- gh-153133: Fix a socket leak in `asyncio.loop.create_connection()` when the transport cannot be created.

- gh-152431: Fix `asyncio.StreamWriter.start_tls()` to keep the linked `StreamReader` transport in sync with the upgraded transport.

- gh-151955: Allow more types to be used in the `bound` argument to `typing.ParamSpec` and `typing.TypeVarTuple`.

- gh-119710: Fix `asyncio` subprocess `wait()` hanging when the process has exited but one of its pipes is kept open by an inherited child process (so the pipe never reaches EOF). `wait()` now returns as soon as the process exits, regardless of the pipes’ state.

- gh-151022: Fix `_remote_debugging` stack traces for code objects with large line tables.

- gh-149319: The `asyncio` REPL now ignores `PYTHONSTARTUP` and `PYTHON_BASIC_REPL` when `-E` or `-I` is used. Patch by Jonathan Dung.

- gh-148665: socket.shutdown function is now enabled for Emscripten builds. However, if the runtime does not implement the shutdown syscall, it will show “Function not implemented” error.

- gh-140326: Fix the `asyncio` REPL namespace so that relative imports no longer resolve against the `asyncio` package and `__file__` is no longer set.

- gh-103925: Fix `csv.Sniffer.sniff()` for a sample with `\r\n` line endings in which a quoted field ends a line: a letter could be detected as the delimiter.

<!-- anchor: id23 | type: section -->
### Documentation

- gh-118150: Clarify in the `difflib` documentation what *junk* actually does, its drawbacks, and how to control it.

<!-- anchor: id24 | type: section -->
### Tests

- gh-76595: Add C API tests for `PyCapsule_Import()`.

- gh-154211: Add `test.support.skip_if_huge_c_stack()` and use it to skip tests that exhaust the C stack if the stack limit is very large (e.g. on DragonFly BSD or with `ulimit -s unlimited`).

- gh-154167: The test runner (regrtest) now restores the default SIGINT handler if it was inherited as ignored, so the test suite no longer hangs when run as a shell background job.

- gh-154144: Fix building the `_testcapi` module on NetBSD.

- gh-152548: Add the `test.support.isolation.runInSubprocess()` decorator to run a test method or `TestCase` subclass in a fresh interpreter subprocess, isolated from the rest of the test run.

<!-- anchor: id25 | type: section -->
### Build

- gh-154070: Build the `curses` module against a wide-character capable ncurses even when it is not named `ncursesw` – for example the pkgsrc ncurses on NetBSD and illumos, or the system ncurses on macOS. Such a library previously produced a narrow build.

- gh-138800: Fix library name in python3.pc on Android.

<!-- anchor: id26 | type: section -->
### Windows

- gh-124111: Updated Windows builds to use Tcl/Tk 9.0.4.

<!-- anchor: id27 | type: section -->
### Tools/Demos

- gh-154580: Fix `python-gdb.py` raising `UnicodeEncodeError` when pretty-printing a non-ASCII `str` in a locale whose host charset cannot encode it, such as any non-ASCII string in the C locale.

- gh-152384: The CPython Pixi packages are now all accessible at the same `Tools/pixi-packages` subdirectory, rather than at `Tools/pixi-packages/{variant}` as before. Variants are now selected not via subdirectory but via `flags`; see https://pixi.prefix.dev/latest/concepts/package_specifications/#extras-and-flags for usage instructions. The `tsan-freethreading` variant has been renamed to `tsan_freethreading`, while the `default`, `asan`, and `freethreading` variants retain their previous names.

<!-- anchor: id28 | type: section -->
### C API

- gh-122931: Allow importing stable ABI C extensions that include a multiarch tuple in their filename, e.g. `foo.abi3-x86-64-linux-gnu.so`.

<!-- anchor: python-3-15-0-beta-4 | type: section -->
## Python 3.15.0 beta 4

*Release date: 2026-07-18*

<!-- anchor: id29 | type: section -->
### Security

- gh-153030: Fixed quadratic complexity in incremental parsing of long unterminated constructs (such as tags or comments) in `html.parser.HTMLParser`, which could be exploited for a denial of service.

- gh-152216: Update bundled libexpat to version 2.8.2.

- gh-151987: The `tarfile.TarFile.extract()` method now applies the given filter when it extracts a link target from the archive as a fallback.

- gh-151981: In `tarfile`, seeking a stream now stops when end of the stream is reached.

- gh-151558: Fixed an vulnerability in the `tarfile` `data` and `tar` extraction filters where crafted archives could create a symlink pointing outside the destination directory. This was a bypass of **CVE 2025-4330**.

- gh-150743: `http.client` now limits the number of chunked-response trailer lines it will read to `max_response_headers` (100 by default), and the number of interim (1xx) responses it will skip to 100. A malicious or broken server could previously stream trailer lines or `100 Continue` responses forever, hanging the client even when a socket timeout was in use. Reported by `@YLChen-007` via GHSA-w4q2-g22w-6fr4.

- gh-143927: Normalize all line endings (CR, CRLF, and LF) to LF+TAB when writing multi-line configparser values.

<!-- anchor: id31 | type: section -->
### Core and Builtins

- gh-153298: Fixes a data race in `types.GenericAlias` `__parameters__` initialization on free-threading builds.

- gh-153205: Fix a potential `SystemError` during vector calls when memory allocation fails. A `MemoryError` is now raised instead.

- gh-152682: Fix NULL pointer dereference in `compile()` when a reserved name (e.g. `__classdict__`) is used as a type parameter name and memory allocation fails while formatting the error message.

- gh-152635: Fix a crash caused when running out of memory creating a `_interpchannels` channel. Now a `MemoryError` is correctly raised.

- gh-152405: Do not expose the internal mapping of `types.MappingProxyType` when performing rich-compare operations with non-stdlib types. Previously, it was possible to mutate the internal mapping of a proxy there. Now we pass not the original `dict` instance, but its copy, when dealing with custom types.

- gh-152492: `collections.OrderedDict` `update` method can now accept `frozendict` as an argument.

- gh-152375: Fix undefined behaviour when a `sys.monitoring` callback raised an exception while the program was following a branch or loop.

- gh-152235: Defer GC tracking of `set.intersection()`, `set.difference()`, `set.symmetric_difference()`, `set.union()` and `set.__sub__`. Patch by Donghee Na.

- gh-152235: Defer GC tracking of a `set` or `frozenset` to the end of its construction from iterable. Patch by Donghee Na.

- gh-152228: Fix an assertion failure when python is built in a debug mode that happened in `str.replace()` under a limited memory situation.

- gh-151722: `frozendict.fromkeys()` now only tracks the `frozendict` in the garbage collector once the dictionary is fully initialized. Patch by Donghee Na and Victor Stinner.

- gh-151763: Fixes possible crash on `types.CodeType` deallocation.

- gh-152020: On the free-threaded build, `asyncio.all_tasks()` no longer loses eager-started tasks when called from a thread other than the one running the event loop.

- gh-151763: Fix a potential crash in `compile()`, `exec()`, `eval()` and `ast.parse()` when an allocation fails: the parser or compiler could return without setting an exception.

- gh-151912: Fixed a crash in `type()` when selecting a metaclass whose `tp_new` slot is `NULL`. Such metaclasses are now rejected with `TypeError` instead of causing a NULL pointer dereference.

- gh-151773: Fix a crash in `contextvars.ContextVar.set()` when memory allocation fails.

- gh-151672: Fix an inconsistency where calling `__lazy_import__` with a string `fromlist` would return a `types.LazyImportType` that resolves to the named member, rather than the module being imported.

- gh-151619: Fix an issue where using non-module global or builtin namespaces (such as dictionaries passed to `exec()`) could cause cached global loads to produce unresolved lazy imports.

- gh-151126: Fix a crash when sharing `memoryview` objects between interpreters fails due to running out of memory. It now raises a proper `MemoryError`.

- gh-151644: Fix a data race in `sys.setdlopenflags()` and `sys.getdlopenflags()` when called concurrently in the free-threaded build. The underlying `_PyImport_GetDLOpenFlags` and `_PyImport_SetDLOpenFlags` functions now use atomic load/store operations.

- gh-151126: Avoid possible crash in `_winapi.c` where a device has no memory left. Now it properly raises a `MemoryError`. Patch by Ivy Xu.

- gh-151029: On Linux, fix `sys.remote_exec()` unable to find remote writable memory when `libpython` replaced on disk.

- gh-150459: Fix `SyntaxError` error message for `from x lazy import y`. Raise `SyntaxWarning` on `from . lazy import x` (with whitespace between the dots and a module named `lazy`).

- gh-150858: Fix a data race while changing `__qualname__` of a type concurrently on free-threaded builds.

- gh-144774: Fix data race in `BaseException` when an exception is copied while being mutated.

- gh-150411: Fix a data race in the free-threaded build when `gc.get_count()` reads the young generation allocation count while another thread updates it.

- gh-149689: Fix missing error propagation in parser action helpers when memory allocation fails. Patch by Thomas Kowalski.

- gh-149162: Fix a potential deadlock in `PyUnicode_InternFromString()` and other interning functions in the free-threaded build when called from C++ static local initializers.

- gh-148825: Fix build error if specialization is disabled.

<!-- anchor: id32 | type: section -->
### Library

- gh-153695: Hashing a `sqlite3.Row` that contains an unhashable value now raises `TypeError` instead of `SystemError`. Patch by tonghuaroot.

- gh-153658: Fix `sqlite3.Connection.iterdump()` raising `sqlite3.OperationalError` when a table name contains a single quote. Patch by tonghuaroot.

- gh-85943: Fix `struct` functions raising `BytesWarning` under the `-bb` command line option when a `str` format is used after an equal `bytes` format (or vice versa). The internal format cache no longer mixes `str` and `bytes` keys.

- gh-151292: Store the sample count in `profiling.sampling` binary format, as a 64-bit integer, widening from previously used 32-bit integer. This breaks the existing recordings. Long or thread-heavy profiling sessions will no longer fail because of `OverflowError`. Patch by Maurycy Pawłowski-Wieroński.

- gh-153417: Error messages from `imaplib.IMAP4.select()` and `imaplib.IMAP4.uid()` no longer raise `BytesWarning` under `-bb` when the mailbox or command argument is `bytes`.

- gh-153406: `email.utils.parsedate_to_datetime()` now raises `ValueError` instead of `OverflowError` when the parsed year or timezone offset is out of range, matching its documented behavior.

- gh-153333: The `readprofile` method of `tkinter.Tk` now reads the user’s profile scripts using the encoding declared in the file, instead of the locale encoding.

- gh-153083: Defer GC tracking of an `array.array` to the end of its construction. Patch by Donghee Na.

- gh-153292: Fix data race in repr of `threading.RLock` in free-threading build.

- gh-153293: Fix the live sampling profiler TUI keeping stale aggregated opcode statistics after a stats reset.

- gh-143990: A `tkinter.font.Font` created from a named font, including by `copy()`, now copies its configured options rather than the options resolved by Tcl’s `font actual`, preserving a size specified in pixels (a negative size).

- gh-148286: Fix undefined behavior in `compression.zstd.ZstdDecompressor.unused_data` when a complete frame was decompressed in a single call.

- gh-153210: Fix crash on `array` import under a memory pressure.

- gh-153200: Fix `math.isqrt()` returning an incorrect result for arguments not less than 2**64 that are instances of an `int` subclass with an overridden comparison operator.

- gh-153068: Fix `cProfile.Profile.enable()` to no longer overwrite errors from `sys.monitoring`.

- gh-153062: Fix a crash when concurrently iterating an `itertools.tee()` iterator on the free-threaded build.

- gh-153056: Fix `string.Template` raising a spurious `ValueError` when the *pattern* attribute is a compiled regular expression object, which the documentation allows. On the free-threaded build this also occurred as a data race on the first concurrent use.

- gh-143921: Narrow the control character check in `imaplib` commands: only NUL, CR and LF are now rejected. Other control characters are valid in quoted strings and can occur in mailbox names returned by the server, so they are now accepted and sent quoted.

- gh-153037: Fix `ZstdFile` raising `AttributeError` instead of `io.UnsupportedOperation` when iterating over a file that is not open for reading.

- gh-135661: Fix `html.parser.HTMLParser`: an abruptly closed empty comment (`<!-->` or `<!--->`) no longer extends up to a later `-->` in the same `feed()` call.

- gh-152851: Prevent a crash when allocation fails while copying a `BLAKE-2s/2b` object. Patch by Bénédikt Tran.

- gh-54930: Error responses of `http.server.BaseHTTPRequestHandler` to malformed request lines now include a status line and headers instead of being sent in the bare HTTP/0.9 style. Only a valid HTTP/0.9 request (a two-word `GET` request line) now receives an HTTP/0.9 style response.

- gh-119592: Fix `concurrent.futures.ProcessPoolExecutor` stranding submitted work forever when a worker process exited upon reaching its *max_tasks_per_child* limit after `shutdown()` was called with `wait=False`: a replacement worker is now spawned and the remaining work executed as documented. If the executor has instead been garbage collected without `shutdown()` (gh-152967), or a replacement worker cannot be started, the remaining futures now fail with `BrokenProcessPool` instead of never resolving. A worker exit racing `shutdown(wait=False)` can also no longer crash the executor management thread.

- gh-150579: `concurrent.futures` now uses lazy imports for its executor submodules instead of a module `__getattr__` hook.

- gh-152951: `collections.deque` prevent rare crash when calling `extend` under high memory pressure conditions.

- gh-150880: Normalize non-extended Windows paths before appending the wildcard used by `os.listdir()` and `os.scandir()`, making paths with trailing spaces behave consistently with other filesystem APIs.

- gh-152068: Fixes a bug when a line was split (particularly on macOS Terminal.app) in the middle of a colorized keyword, causing the ANSI Color Reset sequence (ESC0m) to not be properly printed, causing the output to be colored when it shouldn’t

- gh-152849: Out-of-range float and integer timestamps now raise `OverflowError` with the same message. Patch by tonghuaroot.

- gh-152847: Reject a POSIX TZ transition rule with non-digit characters in the day-of-year field in the pure-Python `zoneinfo` parser. Patch by tonghuaroot.

- gh-152718: Fix unbounded memory allocation in the `profiling.sampling` binary profile reader when a file declares more string or frame entries than it contains.

- gh-108280: Connecting `imaplib` to a server that does not send a valid IMAP4 greeting (for example a POP3 server answering on the IMAP port) now raises an error reporting the server’s response instead of `imaplib.IMAP4.error: None`.

- gh-63121: `imaplib` now refreshes the cached capability list after a successful `login()` or `authenticate()`, using the `CAPABILITY` response sent by the server or, if none was sent, by querying it, so that capabilities that become available only after authentication (such as `ENABLE` on Gmail) are recognized. Capabilities advertised in the server greeting are now also used, avoiding a redundant `CAPABILITY` command.

- gh-88574: `imaplib` no longer fails when a server sends a spurious blank line after the counted data of a literal, including after a literal that terminates a response (such as a mailbox name returned by `LIST`). Such blank lines are now skipped without swallowing the following line.

- gh-152502: Detect the `curses` mouse interface (`getmouse()`, the `BUTTON*` constants, and others) with a configure capability probe or library macros instead of gating it on ncurses-specific macros. It is now also available with other curses implementations that provide it, such as NetBSD curses and PDCurses (the latter underpins `windows-curses`).

- gh-151842: Fix a crash in `_interpreters.capture_exception()` when `MemoryError` happens. Patch by Amrutha Modela.

- gh-40038: `imaplib` now again quotes command arguments when necessary, for example mailbox names containing a space. Such quoting was inadvertently disabled when the module was ported to Python 3, and the arguments are now quoted according to the **RFC 3501** grammar. For backward compatibility, an argument already enclosed in double quotes is left unchanged, so code that quotes arguments itself keeps working.

- gh-50966: Fix unbounded recursion in `turtle` when a mouse event handler that moves the turtle is reentered while the screen is being redrawn, for example with `screen.ondrag(turtle.goto)`. This could previously crash the interpreter.

- gh-152569: Fix `asyncio.wait()` leaking waiting tasks via the await-graph when racing a future that never resolves. The waiting task is now discarded from every future’s `awaited_by` set once `wait()` returns, even for pending futures.

- gh-110357: Importing `hashlib` no longer logs an error to stderr when a normally guaranteed hash algorithm is unavailable in the current runtime (for example under an OpenSSL FIPS configuration or a build using `--without-builtin-hashlib-hashes`). Code that actually uses the missing algorithm still gets a clear `ValueError`.

- gh-152356: Fix a hang in `profiling.sampling run --blocking` on Windows when the target process exits. The profiler now finalizes binary profiles instead of continuing to sample the exited process.

- gh-78335: Update the docstrings of `tkinter` and `tkinter.ttk` widget classes to list all supported widget options, including options added in Tk 9.0 and 9.1. `tkinter.Menubutton` and `tkinter.Message` previously had no option list at all.

- gh-151126: Fix two crashes in `tkinter` and `socket` modules initialization under a memory pressure. Sets missing `MemoryError`.

- gh-133031: `curses.textpad.Textbox` now enters and reads back the non-ASCII characters of an 8-bit locale encoding, instead of mangling them with a 7-bit mask.

- gh-71880: `curses.textpad.Textbox` now lets the lower-right cell of the window be edited. Writing it with `addch()` would move the cursor past the end of the window, raising an error and scrolling a scrollable window, so it is now written with `insch()`, which keeps the cursor in place.

- gh-83274: Deallocating a `tkinter` application from a thread other than the one it was created in no longer crashes the interpreter. The underlying Tcl interpreter is leaked instead, and a `RuntimeWarning` is reported.

- gh-152305: Fix the pure-Python `datetime.time.strftime()` implementation raising `AttributeError` for the year directives. Patch by tonghuaroot.

- gh-88758: `tkinter.Misc.focus_get()`, `focus_displayof()`, `focus_lastfor()` and `winfo_containing()` now return `None` instead of raising `KeyError` when the widget was not created by `tkinter` (for example a torn-off menu).

- gh-38464: `tkinter.Misc.nametowidget()` now resolves the auto-generated names of cloned menus (a menu used as a menubar or a cascade) back to the original widget.

- gh-152248: Make the C and pure-Python `zoneinfo` parsers validate POSIX TZ abbreviations consistently, rejecting unquoted abbreviations with non-letter characters and empty quoted abbreviations. Patch by tonghuaroot.

- gh-80937: Fix a memory leak in `tkinter` when a Tcl command created with `createcommand` was not explicitly removed before the interpreter was deleted. The command no longer keeps the interpreter alive through a reference cycle.

- gh-152246: Fix the pure-Python `zoneinfo` parser accepting an invalid POSIX TZ transition rule with a non-period separator. Patch by tonghuaroot.

- gh-151496: Fixed `profiling.sampling --gecko` with `--async-aware` by flattening async task stacks before generating Gecko samples. `--binary` now rejects `--async-aware` until the binary format supports async task data.

- gh-139816: Fix a hang in `tkinter` on interactive Python built without `readline`. An exception raised in a callback no longer causes the event loop to stop and wait for the user to press Enter; pending callbacks now keep running until input is actually available on stdin.

- gh-139145: Fix a busy loop in `tkinter` on interactive Python. When a Tcl command running its own event loop (such as `vwait` or `wait_variable()`) was active and input arrived on stdin, the event loop kept spinning at 100% CPU. The stdin file handler is now removed as soon as input is available. Based on a patch by Michiel de Hoon.

- gh-152212: Fix the pure-Python `zoneinfo` parser accepting a POSIX TZ string with a `std` abbreviation but no offset. This is invalid per POSIX and now raises `ValueError`, matching the C accelerator. Patch by tonghuaroot.

- gh-152156: Fix a possible crash in `concurrent.interpreters.create()` under limited memory conditions.

- gh-152157: The C implementations of `fromisoformat()` and `fromisoformat()` now reject a decimal separator that is not followed by any fractional digit before a timezone designator.

- gh-151763: Fix crash in `_interpqueues.create()` whe `MemoryError` happens on queue creation.

- gh-151669: On Windows, when populating tar archives from filesystem content, to conform to the tar format standard, backslashes in symlink targets are be replaced by slashes.

- gh-105895: Add `match` and `case` to the list of supported topics by `help()`.

- gh-151378: Fix a bug in the binary collector in Tachyon that caused unbounded memory growth while profiling a thread that stayed asleep. Patch by Maurycy Pawłowski-Wieroński.

- gh-152079: Fix `datetime.datetime.fromisoformat()` in the C implementation dropping the sub-second part of a UTC offset whose whole-second part is zero, matching the pure-Python implementation.

- gh-152052: The `json` C accelerator now correctly reports an unterminated string for a `\uXXXX` escape at the end of the input.

- gh-152060: Fix `datetime.datetime.fromisoformat()` raising `AssertionError` instead of `ValueError` for some malformed strings in the pure-Python implementation, matching the C implementation.

- gh-127802: The deprecated `tkinter.Variable` methods `trace_variable()`, `trace()`, `trace_vdelete()` and `trace_vinfo()` are now scheduled for removal in Python 3.17.

- gh-126219: Fixed a crash in `tkinter.Tk` when *className* contains a non-BMP character and tkinter is built against Tcl/Tk 8.x. Such a name is now rejected with a `ValueError`.

- gh-86165: Fix `imaplib.Time2Internaldate()` to use the local timezone offset for `time.struct_time` values with `tm_gmtoff` set to `None`, as returned by `datetime.datetime.timetuple()`. Contributed by Xiao Yuan.

- gh-151814: Fix unbounded memory growth in `io.TextIOWrapper` when repeatedly writing an empty string.

- gh-151596: Add missing `size` positional argument to the pure-Python implementation of `io.TextIOBase.readline()`.

- gh-151640: Fix a data race in `io.BytesIO` in free-threaded builds when whole-buffer reads or peeks, or `getvalue()`, share the internal buffer with concurrent writes.

- gh-151613: Fix another way the Tachyon profiler frame cache could produce impossible mixed stack traces when `_PyInterpreterFrame` addresses are reused, by validating cached frame anchors with a sequence counter.

- gh-148660: Fix a crash in `collections.OrderedDict.copy()` when a key’s `__eq__` or a subclass method mutates the dict during the copy. Now raises `RuntimeError` instead, as iteration does.

- gh-151497: Opening a `tarfile` archive no longer attempts to pre-allocate a huge buffer when a crafted or truncated member claims an oversized extended header (a GNU long name/link or a pax header). The extended header is now read in bounded chunks, so its size field can no longer trigger memory exhaustion.

- gh-151416: Fix a crash in `os.spawnv()` and `os.spawnve()` when an *argv* item’s `__fspath__()` method mutates the *argv* list during argument conversion. `os.spawnv()` argument conversion errors other than `TypeError`, such as the `ValueError` for an embedded null, are no longer replaced with a generic `TypeError`.

- gh-150994: Make the type annotations in the private `_colorize` module resolvable.

- gh-150583: Correctly set the default compression level in `compression.zstd` when passing a digested dictionary during compression.

- gh-150641: Fix bug where `typing.evaluate_forward_ref()` with the `STRING` format could leak internal names used by the annotation machinery.

- gh-149816: Fix a potential use after free condition in `pickle.dumps()` in free-threaded mode when serializing lists.

- gh-47005: Fix `urllib.request.AbstractHTTPHandler.do_open()` to give regular headers set via `add_header()` priority over unredirected headers, consistent with `get_header()` and `header_items()`.

- gh-140729: Fix a pickling error in the `cProfile` module when profiling a script that uses `multiprocessing.Process` with the `spawn` and `forkserver` start methods.

- gh-115634: Fix a deadlock in `concurrent.futures.ProcessPoolExecutor` when using `max_tasks_per_child`, present since the feature was introduced in Python 3.11. The executor stopped scheduling queued tasks after a worker process exited upon reaching its task limit. Based on a fix proposed by Tabrez Mohammed.

- gh-79638: Disallow all access in `urllib.robotparser` if the `robots.txt` file is unreachable due to server or network errors.

- gh-105708: Accept an uppercase V prefix in IPvFuture addresses in `urllib.parse.urlsplit()`.

<!-- anchor: id33 | type: section -->
### Tests

- gh-151626: Fix several tests in `test.test_inspect`, `test.test_import`, `test.test_importlib`, `test.test_py_compile` and `test.test_compileall` that failed when the test suite was run with `PYTHONPYCACHEPREFIX` set. These tests now neutralize the pycache prefix where they assume the default `__pycache__` bytecode layout.

- gh-151096: Fix `test_embed` failing when CPython is configured with a split exec prefix (`--exec-prefix` differing from `--prefix`).

<!-- anchor: id34 | type: section -->
### Build

- gh-126877: Fix the **configure** check for Tcl/Tk which could wrongly succeed with optimizing compilers when the libraries are missing.

- gh-153438: Update Windows build and installer tooling and documentation to use the current download URL for `nuget.exe`.

- gh-152870: Fix a compilation error in the `decimal` C extension (`_decimal`) when it is built with `EXTRA_FUNCTIONALITY`. `Context.apply()` called the internal `_apply` helper using its pre-Argument-Clinic signature; the call is now made through the generated `_impl` function.

- gh-152769: Enable the perf profiler trampoline on Alpine Linux with the musl C library on `x86_64` and `aarch64`. The trampoline is architecture-specific and does not depend on the C library, so the same assembly trampoline used for glibc is reused for musl.

- gh-152502: The `curses` module now detects `set_escdelay()`, `set_tabsize()` and the `ESCDELAY` and `TABSIZE` variables with **configure** capability probes instead of the ncurses-specific `NCURSES_EXT_FUNCS` macro, so they are exposed when building against other curses implementations such as NetBSD curses that provide them.

<!-- anchor: id35 | type: section -->
### Windows

- gh-140146: Prevent `tkinter` from hanging on Windows if stdin is redirected to a pipe in an interactive session. This is helpful for testing interactive usage of tkinter from a script, for example as part of the cpython test suite.

<!-- anchor: id36 | type: section -->
### macOS

- gh-124111: Update macOS installer to use Tcl/Tk 9.0.4.

- gh-152023: Update macOS installer builds to SQLite 3.53.3. Enable median() and percentile() functions.

<!-- anchor: id37 | type: section -->
### IDLE

- gh-82183: When the shell is busy running code, using “Run… Customized” with “Restart shell” unchecked now reports that the shell is executing instead of restarting it anyway.

- gh-83653: Blanking an integer entry in IDLE’s Settings dialog, such as “Auto squeeze min lines”, no longer saves an empty string as an invalid configuration value.

- gh-65339: Saving the IDLE Shell or an Output window now defaults to a `.txt` extension and lists text files before Python files, since their content is not Python source.

- gh-80504: The “In files:” field of IDLE’s Find in Files dialog now always contains a full directory path, even for an unsaved editor or the Shell. This shows in the grep output which directory was searched.

- gh-134300: Do not add the `idlelib` directory to the path of the IDLE user process. User code run in IDLE can no longer import `idlelib` submodules as top-level modules, such as `import help`.

- gh-89360: Fix a rare crash in the IDLE editor when the completion window is closed: deleting a key binding for a sequence that is not bound to the virtual event is now ignored instead of raising a `ValueError`.

- gh-71956: Fix Replace All in the IDLE editor’s Replace dialog when the search direction is “Up” and “Wrap around” is off: it now replaces all matches above the current position instead of only the first one.

- gh-152728: Move functions run.fix_scaling, editor.fixwordbreaks (as fix_word_breaks) and pyshell.fix_x11_paste to idlelib.util.

- gh-66331: Set the `WM_CLASS` window property of IDLE’s windows to `Idle` on X11, so that window managers group and label them correctly instead of using the default `Toplevel`.

- gh-85320: IDLE now reads and writes its configuration files and the breakpoints file using UTF-8 instead of the locale encoding. This keeps non-ASCII data (such as non-ASCII paths) from being corrupted and makes the files portable between environments.

<!-- anchor: id38 | type: section -->
### C API

- gh-152132: Fix `Py_RunMain()` to return an exit code, rather than calling `Py_Exit()`, when running a script, a command, or the REPL. Patch by Victor Stinner.

- gh-145633: `PyFloat_Pack8()` and `PyFloat_Unpack*` functions are no longer guaranteed to always succeed on CPython.

- gh-153300: `PyConfig_Set()` now also set global configuration variables. For example, `PyConfig_Set("inspect", value)` now also sets `Py_InspectFlag`. Patch by Victor Stinner.

<!-- anchor: python-3-15-0-beta-3 | type: section -->
## Python 3.15.0 beta 3

*Release date: 2026-06-23*

<!-- anchor: id39 | type: section -->
### Security

- gh-151544: `Modules/Setup.local` is no longer used as a landmark to discover whether Python is running in a source tree, as it could potentially affect actual installs. The `pybuilddir.txt` file is now the sole indicator of running in a source tree.

- gh-151159: Update macOS installer to use OpenSSL 3.5.7.

- gh-151159: Update Android and iOS installers to use OpenSSL 3.5.7.

- gh-150599: Fix a possible stack buffer overflow in `bz2` when a `bz2.BZ2Decompressor` is reused after a decompression error. The decompressor now becomes unusable after libbz2 reports an error.

- gh-149835: `shutil.move()` now resolves symlinks via `os.path.realpath()` when checking whether the destination is inside the source directory, preventing a symlink-based bypass of that guard.

<!-- anchor: id40 | type: section -->
### Core and Builtins

- gh-151905: Fix OOM error handling in `PyFrame_GetBack()` to propagate exceptions instead of masking them as None.

- gh-151722: Defer GC tracking of `frozendict` to end of construction. Patch by Donghee Na.

- gh-151546: Fix the stack limit check if Python is linked to musl (ex: Alpine Linux). Use the stack size set by the linker to compute the stack limits. Patch by Victor Stinner.

- gh-151510: Fix a crash in `__lazy_import__()` when called without an explicit `globals` argument and without a current Python frame.

- gh-151461: Fix direct execution of files with invalid source encodings to report the underlying codec lookup or decoding error instead of the generic `SyntaxError: encoding problem` message. Patch by Bartosz Sławecki.

- gh-151218: `PyConfig_Set()` and `sys.set_int_max_str_digits()` now replace `sys.flags` (create a new object), instead of modifying `sys.flags` in-place. Patch by Victor Stinner.

- gh-151297: Fix an invalid pointer dereference that could occur when calling `PyObject_Realloc()` with a NULL pointer in free-threaded builds or with `PYTHONMALLOC` set to `mimalloc`.

- gh-151253: If `import encodings` (first import) fails at Python startup, dump the Python path configuration to help users debugging their configuration. Patch by Victor Stinner.

- gh-151238: Fix a crash when compiling a concatenated f-string or t-string if an error occurs when processing one of it’s parts.

- gh-151112: Fix a crash in the compiler that could occur when running out of memory.

- gh-151126: Fix a crash, when there’s no memory left on a device, which happened in: code compilation, `_interpchannels` module, `_winapi.CreateProcess()` function.

  Now these places raise proper `MemoryError` errors.

- gh-150902: Apply an existing optimization of PyCriticalSection (single mutex) to PyCriticalSection2: avoid acquiring the same locks that the current CS has already acquired.

- gh-151065: Fix memory leak when using the mimalloc memory allocator.

- gh-150988: Fix a reference leak in `OSError` when attributes are set before `super().__init__()`.

- gh-150723: Fix perf jitdump timestamps on macOS. Events were stamped using `CLOCK_MONOTONIC`, but macOS profilers timestamp their samples with `mach_absolute_time()`. The mismatch prevented the JIT code mappings from lining up with the samples, so no Python frame could be resolved.

- gh-150723: Fix malformed perf jitdump thread ids on macOS. The `thread_id` field of the `JR_CODE_LOAD` record was written as a 64-bit value instead of the 32-bit value required by the jitdump format, which shifted every following field and prevented profilers from resolving Python frames.

- gh-150700: Fix a `SystemError` when compiling a class-scope comprehension containing a `lambda` that references `__class__`, `__classdict__`, or `__conditional_annotations__`. Patch by Bartosz Sławecki.

- gh-150633: Fix the frozen importer accepting module names with embedded null bytes, which caused it to bypass the `sys.modules` cache and create duplicate module objects.

- gh-148613: Fix a data race in the free-threaded build between `gc.set_threshold()` and garbage collection scheduling during object allocation.

- gh-150207: Fix a crash when a memory allocation fails during tokenizer initialization. A proper `MemoryError` is now raised instead.

- gh-149805: Fix a `SystemError` when compiling a compiling `__classdict__` class annotation. Found by OSS-Fuzz in #512907042.

- gh-149321: Do not support `none` as a lazy imports mode.

<!-- anchor: id41 | type: section -->
### Library

- gh-75666: Fix a reference leak in `tkinter`: the Tcl commands created for event callbacks are now deleted when a binding is replaced or unbound.

- gh-151770: Fix `datetime.datetime.fromisoformat()` raising `AssertionError` instead of `ValueError` for an out-of-range month combined with a `24:00` time.

- gh-151665: `inspect.signature()` now works on the lazy evaluators of type aliases and type parameters instead of raising `ValueError`.

- gh-151695: Fix a use-after-free in the `curses` module. The encoding of the initial screen, used by `curses.unctrl()` and `curses.ungetch()` to encode non-ASCII characters, is now kept as a private copy instead of a borrowed pointer to a window object that may be deallocated.

- gh-151436: Fix skewed stack trackes in the Tachyon profiler when caching is enabled and when generators and coroutines are profiled, by updating `tstate->last_profiled_frame` at every frame-removal site. The issue resulted in total erasure of some callers. Patch by Maurycy Pawłowski-Wieroński.

- gh-151426: Fix impossible stack traces (callers and callees cross called, orphans and incorrect lines) in the Tachyon profiler when caching frames, by snapshotting the stack chunks before walking the frame chain on a cache miss. Patch by Maurycy Pawłowski-Wieroński.

- gh-151403: Fixed a crash in `subprocess.Popen` (and `_posixsubprocess.fork_exec`) when an `argv` item’s `__fspath__()` concurrently mutates the `args` sequence being converted.

- gh-151390: Colorize `match` in the REPL when followed by a unary `+` or `-` operator. Patch by Bartosz Sławecki.

- gh-151126: Fix crash on unset `MemoryError` on allocation failure in `ctypes.get_errno()`.

- gh-151337: Avoid possible memory leak in `tkinter.c` on Windows.

- gh-151126: Fix a crash when `MemoryError` in `os._path_splitroot()` was not set properly.

- gh-149671: Restore compatibility with setuptools `-nspkg.pth` files in the `site` module. Inject `sitedir` variable in the frame which executes pth code. Patch by Victor Stinner.

- gh-151295: Fixed a crash (use-after-free) in `bytes.join()` and `bytearray.join()` that could occur if an item’s `__buffer__()` concurrently mutates the sequence being joined. The mutation is now reported as a `RuntimeError` instead.

- gh-109940: Fix Windows `venv` activation in `cmd.exe` to respect `VIRTUAL_ENV_DISABLE_PROMPT`.

- gh-150771: Fix `email` messages created with `shift_jis` or `euc-jp` charsets. `set_content()` now stores the payload using the output charset (`iso-2022-jp`) so printing the message no longer raises `UnicodeEncodeError`.

- gh-151039: Fix a crash when static `datetime` types outlive the `_datetime` module.

- gh-151021: Fix `mmap.mmap.find()` and `rfind()` to return `-1` when searching for an empty subsequence with a start position past the end of the mapping.

- gh-62825: Encodings “KS_C_5601-1987”, “KS X 1001”, etc are now aliases of “CP949” instead of “EUC-KR”.

- gh-150913: Fix `sqlite3.Blob` slice assignment to raise `TypeError` and `IndexError` for type and size mismatches respectively, even when the target slice is empty.

- gh-143008: Fix race conditions when re-initializing a `io.TextIOWrapper` object.

- gh-150662: Fix the `--gecko` collector in `profiling.sampling` that kept every sample in memory. It now writes sample and marker data to temporary files and reads them back, ultimately building the output file at the end. Patch by Pablo Galindo and Maurycy Pawłowski-Wieroński.

- gh-150750: Fix a race condition in `collections.deque.index()` with free-threading.

- gh-148932: Fix `profiling.sampling` on Windows virtual environments to resolve the actual Python PID from a virtual environment shim.

- gh-149816: Fix race condition in `ssl.SSLContext.sni_callback`

- gh-53144: The `email` package now supports all aliases of Python codecs and uses MIME/IANA names for all IANA registered charsets.

- gh-149891: Add support for more encoding aliases officially registered in IANA.

- gh-149473: Calling `os.environ.clear()` now emits `os._clearenv` auditing event. Patch by Victor Stinner.

- gh-148954: Fix XML injection vulnerability in `xmlrpc.client.dumps()` where the `methodname` was not being escaped before interpolation into the XML body.

- gh-143988: Fixed crashes in `socket.socket.sendmsg()` and `socket.socket.recvmsg_into()` that could occur if buffer sequences are concurrently mutated.

- gh-120665: Fixed an issue where `unittest` loaders would load and instantiate `unittest.TestCase`-derived subclasses that are also abstract base classes, which can’t be instantiated.

- gh-91099: `imaplib.IMAP4.login()` now raises exceptions with `str` instead of `bytes`. Patch by Florian Best.

- gh-101267: When a worker process terminates unexpectedly, `concurrent.futures.ProcessPoolExecutor` now sets a separate `BrokenProcessPool` exception on each pending future instead of sharing a single instance among them all. Sharing one exception produced malformed tracebacks: each `Future.result()` call re-raised the same object, appending another copy of the traceback to it.

<!-- anchor: id42 | type: section -->
### Documentation

- gh-86726: Greatly expand the `tkinter` documentation to cover the full public API of the package and its submodules. The descriptions are oriented towards Python rather than Tcl/Tk, with corrected return types and `versionadded`/`versionchanged` information.

- gh-150319: Generic builtin and standard library types now document the meaning of their type parameters.

- gh-109503: Fix documentation for `shutil.move()` on usage of `os.rename()` since nonatomic move might be used even if the files are on the same filesystem. Patch by Fang Li

<!-- anchor: id43 | type: section -->
### Tests

- gh-151130: Add more tests for `PyWeakref_*` C API.

- gh-150966: Avoid prematurely terminating failing live sampling profiler test targets, which made stderr assertions flaky on ASAN buildbots.

- gh-148853: Fix tests failing on FreeBSD in test.support’s in_systemd_nspawn_sync_suppressed() due to unreadable /run directory.

<!-- anchor: id44 | type: section -->
### Build

- gh-151163: Updated Android build to include SQLite version 3.53.2.

<!-- anchor: id45 | type: section -->
### Windows

- gh-151163: Updated Windows builds to include SQLite version 3.53.2.

- gh-151159: Updated bundled version of OpenSSL to 3.5.7.

- gh-150836: Make installed tkinter work with Tcl/Tk 9 builds that embed the Tk script library in the Tk DLL on Windows.

<!-- anchor: id46 | type: section -->
### macOS

- gh-151163: Updated macOS installer to include SQLite version 3.53.2.

<!-- anchor: id47 | type: section -->
### IDLE

- bpo-6699: Warn the user if a file will be overwritten when saving.

<!-- anchor: id48 | type: section -->
### C API

- gh-141510: Add `frozendict` to the fast paths of `PyMapping_GetOptionalItem()`, `PyMapping_Keys()`, `PyMapping_Values()`, and `PyMapping_Items()`.

- gh-123619: `PyUnstable_Object_EnableDeferredRefcount()` now returns `0` if the object is not tracked by the garbage collector: if `gc.is_tracked()` is false. Patch by Victor Stinner.

- gh-149044: Improved error message when specifying non-type base classes in `Py_tp_bases`, `Py_tp_base`, and *bases* argument to `PyType_FromMetaclass()` and other `PyType_From*` functions.

- gh-150907: Fix `dynamic_annotations.h` header file when built with C++ and Valgrind: add `extern "C++" scope` for the C++ template. Patch by Victor Stinner.

<!-- anchor: python-3-15-0-beta-2 | type: section -->
## Python 3.15.0 beta 2

*Release date: 2026-06-02*

<!-- anchor: id49 | type: section -->
### Security

- gh-149698: Update bundled libexpat to version 2.8.1 for the fix for **CVE 2026-45186**.

- gh-87451: The `ftplib` module’s undocumented `ftpcp` function no longer trusts the IPv4 address value returned from the source server in response to the `PASV` command by default, completing the fix for CVE-2021-4189. As with `ftplib.FTP`, the former behavior can be re-enabled by setting the `trust_server_pasv_ipv4_address` attribute on the source `ftplib.FTP` instance to `True`. Thanks to Qi Deng at Aurascape AI for the report.

- gh-149474: Fix the binary writer in `profiling.sampling` not firing the audit (**PEP 578**) when creating the output file. The writer and the reader now accept any path-like object. Patch by Maurycy Pawłowski-Wieroński.

- gh-149486: `tarfile.data_filter()` now validates link targets using the same normalised value that is written to disk, strips trailing separators from the member name when resolving a symlink’s directory, and rejects link members that would replace the destination directory itself. This closes several path-traversal bypasses of the `data` extraction filter.

- gh-149079: Fix a potential denial of service in `unicodedata.normalize()`. The canonical ordering step of Unicode normalization used a quadratic-time insertion sort for reordering combining characters, which could be exploited with crafted input containing many combining characters in non-canonical order. Replaced with a linear-time counting sort for long runs.

- gh-149018: Improved protection against XML hash-flooding attacks in `xml.parsers.expat` and `xml.etree.ElementTree` when Python is compiled with libExpat 2.8.0 or later.

<!-- anchor: id51 | type: section -->
### Core and Builtins

- gh-150374: Fix double release of the import lock on lazy import reification errors.

- gh-149156: Fix an intermittent crash after `os.fork()` when perf trampoline profiling is enabled and the child returns through trampoline frames inherited from the parent process.

- gh-149449: Fix a use-after-free crash when the `unicodedata` module was removed from `sys.modules` and garbage-collected between calls that decode `\N{...}` escapes or use the `namereplace` codec error handler.

- gh-150107: `asyncio`: `sendfile()` and `sock_sendfile()` event loop methods now call `file.seek(offset)` if *file* has a `seek()` method, even if *offset* is `0` (default value).

- gh-150146: Fix a crash on a complex type variable substitution.

  `from typing import TypeVar; memoryview[TypeVar("")][*typing.Mapping[..., ...]]` used to fail due to missing `NULL` check on `_unpack_args` C function call.

- gh-148587: `sys.lazy_modules` is now a set instead of a dict as initially spelled out in PEP 810.

- gh-150042: Fix refleak in queue.SimpleQueue.put if memory allocation fails.

- gh-149590: Fix crash when faulthandler is imported more than once.

- gh-149816: Fix a race condition in `_PyBytes_FromList` in free-threading mode.

- gh-149816: Fix a race condition in `memoryview` with free-threading.

- gh-149807: Fix `hash(frozendict)`: compute the hash of each `(key, value)` pair correctly. Patch by Victor Stinner.

- gh-149738: `sqlite3`: Disallow removing `row_factory` and `text_factory` attributes of a connection to prevent a crash on a query.

- gh-139808: Add branch protections for AArch64 (BTI/PAC) in assembly code used by `-X perf_jit` (Linux perf profiler integration).

- gh-149676: Fix `frozendict | frozendict` hash.

- gh-148829: `sentinel` objects now support a `repr=` argument and their `__module__` attribute is writable.

- gh-149642: Allow imports inside `exec()` calls within functions under `PYTHON_LAZY_IMPORTS=all`.

- gh-144957: Fix lazy `from` imports of module attributes provided by module-level `__getattr__`.

- gh-149459: Fix a crash in the JIT optimizer when a specialized `LOAD_SPECIAL` guard deoptimized after inserting the synthetic `NULL` stack entry.

- gh-148450: Fix `abc.register()` so it invalidates type version tags for registered classes.

<!-- anchor: id52 | type: section -->
### Library

- gh-150685: Update bundled pip to 26.1.2

- gh-150228: The new `site.StartupState` class lets callers batch-process **PEP 829** startup configuration files across multiple site directories before any startup code runs, with public `addsitedir()`, `addusersitepackages()`, `addsitepackages()`, and `process()` methods. The signature of `site.addsitedir()` is unchanged from Python 3.14. The `defer_processing_start_files` argument and the `process_startup_files()` function added earlier in the 3.15 cycle have been removed; use `site.StartupState` instead.

- gh-150406: Fix a possible crash occurring during `socket` module initialization when the system is out of memory on platforms without a reentrant `gethostbyname`.

- gh-150372: `readline`: Fix a potential crash during tab completion caused by an out-of-memory error during module initialization.

- gh-150157: Fix a crash in free-threaded builds that occurs when pickling by name objects without a `__module__` attribute while `sys.modules` is concurrently being modified.

- gh-150175: Fix race condition in `unittest.mock.ThreadingMock` where concurrent calls could lose increments to `call_count` and other attributes due to a missing lock in `_increment_mock_call`.

- gh-84353: Preserve non-UTF-8 encoded filenames when appending to a `zipfile.ZipFile`. Previously, non-ASCII names stored in a legacy encoding (without the UTF-8 flag bit set) could be corrupted when the central directory was rewritten: they were decoded as cp437 and then re-stored as UTF-8.

- gh-149189: Revert the changes to `pprint` defaults. Patch by Hugo van Kemenade.

- gh-149995: Update various docstrings in `typing`.

- gh-88726: The `email` package now uses standard MIME charset names “gb2312” and “big5” instead of non-standard names “eucgb2312_cn” and “big5_tw”.

- gh-149571: Fix the C implementation of `xml.etree.ElementTree.Element.itertext()`: it no longer emits text for comments and processing instructions.

- gh-149921: Fix reference leaks in error paths of the `_interpchannels` and `_interpqueues` extension modules.

- gh-142349: Add `lazy` to the list of support topic by `help()`.

- gh-149819: Fix regression in `site.addsitedir()` where `.pth` files were no longer processed in Python subprocesses. This happened because `site.main()` seeded `known_paths` with entries inherited from the parent process, causing `addsitedir` to skip `.pth` processing.

- gh-149816: Fix a race condition in `_random.Random.__init__` method in free-threading mode.

- gh-149801: Add IANA registered names and aliases with leading zeros before number (like IBM00858, CP00858, IBM01140, CP01140) for corresponding codecs.

- gh-149718: Coalesce consecutive identical stack frames in Tachyon, so aggregating collectors (pstats, collapsed, flamegraph, gecko) receive one collect. Improves sample rate 3x, error rate and missed rate drop by 70%. Patch by Maurycy Pawłowski-Wieroński.

- gh-149701: Fix bad return code from Lib/venv/bin/activate if hashing is disabled

- gh-149504: Fix `site.addsitedir()` to allow re-entrant calls from within startup files. Previously, a `.pth` file containing an `import` line that called `site.addsitedir()` (or a `.start` entry point doing the same) could crash with `RuntimeError: dictionary changed size during iteration` during site initialization, breaking tools such as `uv run --with`.

- gh-149584: Fix excessive overhead in the Tachyon profiler when inspecting a remote process by avoiding repeated remote page-cache scans, batching predicted remote reads, and reusing cached profiler result objects. Patch by Pablo Galindo and Maurycy Pawłowski-Wieroński.

- gh-139489: Add `xml.is_valid_text()` to `xml.__all__`.

- gh-149614: Fix a regression that broke the ability to deepcopy `argparse.ArgumentParser` instances.

- gh-112821: In the REPL, autocompletion might run arbitrary code in the getter of a descriptor. If that getter raised an exception, autocompletion would fail to present any options for the entire object. Autocompletion now works as expected for these objects.

- gh-149534: Fix merging of `collections.defaultdict` and `frozendict`.

- gh-149388: Make `asyncio.windows_utils.PipeHandle` closing idempotent.

- gh-149489: Fix `ElementTree` serialization to HTML. The content of comments, processing instructions and elements “xmp”, “iframe”, “noembed”, “noframes”, and “plaintext” is no longer escaped. The “plaintext” element no longer have the closing tag. Add support of empty attributes (with value `None`).

- gh-149056: Fix `json.load()` not forwarding the *array_hook* argument to `json.loads()`. Patch by Thomas Kowalski.

- gh-149046: `io`: Fix `io.StringIO` serialization: no longer call `str(obj)` on `str` subclasses. Patch by Thomas Kowalski.

- gh-148441: `xml.parsers.expat`: prevent a crash in `CharacterDataHandler()` when the character data size exceeds the parser’s `buffer size`.

- gh-146452: Fix segfault in `pickle` when pickling a dictionary concurrently mutated by another thread in the free-threaded build.

- gh-86533: The `os.makedirs()` function and `pathlib.Path.mkdir()` method now have a *parent_mode* parameter to specify the mode for intermediate directories when creating parent directories. This allows one to match the behavior from Python 3.6 and earlier for `os.makedirs()`.

- gh-134261: zip: On reproducible builds, ZipFile uses UTC instead of the local time when writing file datetimes to avoid underflows.

- gh-133998: Fix `struct.error` exception when creating a file with `gzip.GzipFile` or compressing data with `gzip.compress()` if the system time is outside the range 00:00:00 UTC, January 1, 1970 through 06:28:15 UTC, February 7, 2106, or explicitly passed *mtime* argument is outside the range `0` to `2**32-1`.

- gh-128110: Fix bug in the parsing of `email` address headers that could result in extraneous spaces in the decoded text when using a modern email policy. Space between pairs of adjacent **RFC 2047** encoded-words is now ignored, per section 6.2 (and consistent with existing parsing of unstructured headers like *Subject*).

- gh-107398: Fix `tarfile` stream mode exception when process the file with the gzip extra field.

- gh-121109: Fix `tarfile` performance issue when reading archives in streaming mode (e.g. `r|*`).

- bpo-45509: Gzip headers are now checked for corrupted NAME, COMMENT and HCRC fields.

<!-- anchor: id53 | type: section -->
### Tests

- gh-150387: Fix hang in `test.test_profiling.test_sampling_profiler.test_live_collector_ui.TestLiveModeErrors.test_run_failed_script_live` on slow buildbots. The test now always queues a final `q` keystroke so the live TUI loop exits even when the profiler collects enough samples to enter the post-finished input loop.

- gh-149776: Fix test_socket on Linux kernel 7.1 and newer: skip UDP Lite tests if it’s not supported. Patch by Victor Stinner.

<!-- anchor: id54 | type: section -->
### Build

- gh-148294: Corrected the use of `AC_PATH_TOOL` in `configure.ac` to allow a C++ compiler to be found on `PATH`.

- gh-148260: On Linux when Python is linked to the musl C library, use a thread stack size of at least 1 MiB instead of musl default which is 128 kiB. Patch by Victor Stinner.

<!-- anchor: id55 | type: section -->
### Windows

- gh-149786: Fixes virtual environment launchers on Windows free-threaded builds.

- gh-124111: Updated Windows builds to use Tcl/Tk 9.0.3.

- gh-138489: Windows distributions now include a `build-details.json` file (see **PEP 739**). The legacy installer does not install it, but all other distributions from python.org and all preset configurations in the `PC\layout` script will include one.

- gh-149029: Update Windows installer to ship with SQLite 3.53.1.

<!-- anchor: id56 | type: section -->
### macOS

- gh-150644: When system logging is enabled (with `config.use_system_logger`, messages are now tagged as public. This allows the macOS 26 system logger to view messages without special configuration.

- gh-149029: Update macOS installer to ship with SQLite version 3.53.1.

<!-- anchor: id57 | type: section -->
### Tools/Demos

- gh-150258: Update the tooltip on the Tachyon flame graph to show both absolute and relative percentages.

<!-- anchor: id58 | type: section -->
### C API

- gh-149725: Add `PySentinel_CheckExact()` for exact `sentinel` type tests to accompany the existing `PySentinel_Check()`.

- gh-145235: Made `PyDict_AddWatcher()`, `PyDict_ClearWatcher()`, `PyDict_Watch()`, and `PyDict_Unwatch()` thread-safe on the free threaded build.

<!-- anchor: python-3-15-0-beta-1 | type: section -->
## Python 3.15.0 beta 1

*Release date: 2026-05-07*

<!-- anchor: id59 | type: section -->
### Security

- gh-149254: Update Android and iOS installer to use OpenSSL 3.5.6.

- gh-149017: Update bundled libexpat to version 2.8.0.

- gh-148252: Fixed string table and sample record bounds checks in `_remote_debugging` when decoding certain `.pyb` inputs on 32-bit builds. Patch by Maurycy Pawłowski-Wieroński.

- gh-90309: Base64-encode values when embedding cookies to JavaScript using the `http.cookies.BaseCookie.js_output()` method to avoid injection and escaping.

- gh-148808: Added buffer boundary check when using `nbytes` parameter with `asyncio.AbstractEventLoop.sock_recvfrom_into()`. Only relevant for Windows and the `asyncio.ProactorEventLoop`.

- gh-148395: Fix a dangling input pointer in `lzma.LZMADecompressor`, `bz2.BZ2Decompressor`, and internal `zlib._ZlibDecompressor` when memory allocation fails with `MemoryError`, which could let a subsequent `decompress()` call read or write through a stale pointer to the already-released caller buffer.

- gh-148252: Fixed stack depth calculation in `_remote_debugging` when decoding certain `.pyb` inputs on 32-bit builds. Issue originally identified and diagnosed by Tristan Madani (@TristanInSec on GitHub).

- gh-148178: Hardened `_remote_debugging` by validating remote debug offset tables before using them to size memory reads or interpret remote layouts.

- gh-148169: A bypass in `webbrowser` allowed URLs prefixed with `%action` to pass the dash-prefix safety check.

- gh-146581: Fix vulnerability in `shutil.unpack_archive()` for ZIP files on Windows which allowed to write files outside of the destination tree if the patch in the archive contains a Windows drive prefix. Now such invalid paths will be skipped. Files containing “..” in the name (like “foo..bar”) are no longer skipped.

- gh-137586: Fix a PATH-injection vulnerability in `webbrowser` on macOS where `osascript` was invoked without an absolute path. The new `MacOS` class uses `/usr/bin/open` directly, eliminating the dependency on `osascript` entirely.

- gh-146333: Fix quadratic backtracking in `configparser.RawConfigParser` option parsing regexes (`OPTCRE` and `OPTCRE_NV`). A crafted configuration line with many whitespace characters could cause excessive CPU usage.

- gh-146211: Reject CR/LF characters in tunnel request headers for the HTTPConnection.set_tunnel() method.

<!-- anchor: id61 | type: section -->
### Core and Builtins

- gh-148940: Revert the process size based deferral of garbage collection (gh-133464). The performance issue this change resolves is also fixed by gh-142562. This approach has the problem that process size as seen by the OS (e.g. the resident size or RSS) does not immediately decrease after cyclic garbage is freed since mimalloc defers returning memory of the OS. This change applies to the free-threaded GC only.

- gh-149243: Check for recursion limits in `CALL_ALLOC_AND_ENTER_INIT` opcode.

- gh-126910: Add support for unwinding JIT frames using GNU backtrace. Patch by Diego Russo and Pablo Galindo

- gh-149171: Allow assignment to the `__module__` attribute of `typing.TypeAliasType` instances.

- gh-149122: Fix a crash in optimized calls to `all()`, `any()`, `tuple()`, `list()`, and `set()` with an async generator expression argument (for example, `tuple(await x for x in y)`). These calls now correctly raise `TypeError` instead of crashing.

- gh-149049: Fix stack underflow for `BINARY_OP` in tier 2.

- gh-83065: Fix a deadlock that could occur when one thread is importing a submodule (for example `import pkg.sub.mod`) while another thread is importing one of its parent packages (for example `import pkg.sub`) and that parent’s `__init__.py` itself imports the submodule. The import system now acquires module locks in hierarchical (parent-before-child) order so the two threads serialise instead of raising `_DeadlockError`.

- gh-113956: Fix a data race in `sys.intern()` in the free-threaded build when interning a string owned by another thread. An interned copy owned by the current thread is used instead when it is not safe to immortalize the original.

- gh-148850: Fix the memory sanitizer false positive in `os.getrandom()`.

- gh-148820: Fix a race in `_PyRawMutex` on the free-threaded build where a `Py_PARK_INTR` return from `_PySemaphore_Wait` could let the waiter destroy its semaphore before the unlocking thread’s `_PySemaphore_Wakeup` completed, causing a fatal `ReleaseSemaphore` error.

- gh-148829: Add `sentinel`, implementing **PEP 661**. PEP by Tal Einat; patch by Jelle Zijlstra.

- gh-146270: Fix a sequential consistency bug in `structmember.c`.

- gh-148766: The interpreter help (such as `python --help`) is now in color. Patch by Hugo van Kemenade.

- gh-148571: Fix a crash in the JIT optimizer when specialized opcode families inherited incompatible recorded operand layouts.

- gh-148653: Forbid `marshalling` recursive code objects, `slice` and `frozendict` objects which cannot be correctly unmarshalled.

- gh-142516: Forward-port the generational cycle garbage collector to the default 3.15 build, replacing the incremental collector while leaving the free-threaded collector unchanged.

- gh-146462: Added `PyTypeObject.tp_basicsize`, `PyTypeObject.tp_dictoffset`, and `PyHeapTypeObject.ht_cached_keys` offsets to `_Py_DebugOffsets` to support version-independent read-only dict introspection tools.

- gh-145239: Unary plus is now accepted in `match` literal patterns, mirroring the existing support for unary minus. Patch by Bartosz Sławecki.

- gh-148515: Fix a bug in the JIT optimizer reading operands for uops with multiple caches.

- gh-148390: Fix an undefined behavior in `memoryview` when using the native boolean format (`?`) in `cast()`. Previously, on some common platforms, calling `memoryview(b).cast("?").tolist()` incorrectly returned `[False]` instead of `[True]` for any even byte *b*. Patch by Bénédikt Tran.

- gh-148418: Fix a possible reference leak in a corrupted `TYPE_CODE` marshal stream.

- gh-148393: Fix data races between `PyDict_Watch()` / `PyDict_Unwatch()` and concurrent dict mutation in the free-threaded build.

- gh-148398: Fix a bug in the JIT optimizer where class attribute loads were not invalidated after type mutation.

- gh-146527: Add a `GCMonitor` class with a `get_gc_stats` method to the `_remote_debugging` module to allow reading GC statistics from an external Python process without requiring the full `RemoteUnwinder` functionality. Patch by Sergey Miryanov and Pablo Galindo.

- gh-148284: Fix high stack consumption in Python’s interpreter loop on Clang 22 by setting function limits for inlining when building with computed gotos.

- gh-148037: Remove critical section from `PyCode_Addr2Line()` in free-threading.

- gh-115802: Improve JIT code generation on Linux AArch64 by reducing the indirect call to external symbols. Patch by Diego Russo.

- gh-148189: Repaired undercount of bytes in type-specific free lists reported by sys._debugmallocstats(). For types that participate in cyclic garbage collection, it was missing two pointers used by GC.

- gh-148222: Fix vectorcall support in `types.GenericAlias` when the underlying type does not support the vectorcall protocol. Fix possible leaks in `types.GenericAlias` and `types.UnionType` in case of memory error.

- gh-148208: Fix recursion depth leak in `PyObject_Print()`

- gh-95004: The specializing interpreter now specializes for `enum.Enum` improving performance and scaling in free-threading. Patch by Kumar Aditya.

- gh-149202: Enable frame pointers by default for GCC-compatible CPython builds, including `-mno-omit-leaf-frame-pointer`, `-marm` on 32-bit ARM, and/or `-mbackchain` on s390x platforms when the compiler supports them, so profilers and debuggers can unwind native interpreter frames more reliably. Users can pass `--without-frame-pointers` to `./configure` to opt out.

- gh-148014: Accept a function name in `-X presite` command line option and `PYTHON_PRESITE` environment variable. Patch by Victor Stinner.

- gh-147998: Fixed a memory leak in interpreter helper calls so cleanup works when an operation falls across interpreter boundaries. Patch by Maurycy Pawłowski-Wieroński.

- gh-146455: Fix O(N²) compile-time regression in constant folding after it was moved from AST to CFG optimizer.

- gh-146306: Specialize float true division in the tier 2 optimizer with inplace mutation for uniquely-referenced operands.

- gh-142186: Global `sys.monitoring` events can now be turned on and disabled on a per code object basis. Returning `DISABLE` from a callback disables the event for the entire code object (for the current tool).

- gh-126910: Add support for unwinding JIT frames using GDB. Patch by Diego Russo and Pablo Galindo.

- gh-146031: The unstable API _PyInterpreterState_SetEvalFrameFunc has a companion function _PyInterpreterState_SetEvalFrameAllowSpecialization to specify if specialization should be allowed. When this option is set to 1 the specializer will turn Python -> Python calls into specialized opcodes which the replacement interpreter loop can choose to respect and perform inlined dispatch.

- gh-145278: The `encodings` is now partially frozen, including the `aliases` and `utf_8` submodules.

  The `linecache` is now frozen.

- gh-134584: Optimize and eliminate redundant ref-counting for `MAKE_FUNCTION` in the JIT.

- gh-143886: Reorder function annotations so positional-only arguments are returned before other arguments. This fixes how `functools.singledispatch()` registers functions with positional-only arguments.

- gh-98894: Restore `function__entry` and `function__return` DTrace/SystemTap probes that were broken since Python 3.11.

- gh-116021: Support for creating instances of abstract AST nodes from the `ast` module is deprecated and scheduled for removal in Python 3.20. Patch by Brian Schubert.

- gh-137814: Fix the `__qualname__` attribute of `__annotate__` functions on functions.

- gh-137600: `ast`: The constructors of AST nodes now raise a `TypeError` when a required argument is omitted or when a keyword argument that does not map to a field on the AST node is passed. These cases had previously raised a `DeprecationWarning` since Python 3.13. Patch by Brian Schubert.

- gh-137293: Fix `SystemError` when searching ELF Files in `sys.remote_exec()`.

- gh-135357: Add support for `socket.SO_PASSRIGHTS` on Linux.

- gh-134690: Removed deprecated in **PEP 626** since Python 3.12 `codeobject.co_lnotab` from `types.CodeType`.

- gh-100239: Specialize `BINARY_OP` for concatenation of lists and tuples, and propagate the result type through `_BINARY_OP_EXTEND` in the tier 2 optimizer so that follow-up type guards can be eliminated.

<!-- anchor: id62 | type: section -->
### Library

- gh-148823: Defer the import of `_colorize` in `argparse` until needed for coloring output.

- gh-141560: Add an *annotation_format* parameter to `inspect.getfullargspec()`.

- gh-139489: Add the `xml.is_valid_text()` function, which allows to check whether a string can be used in the XML document.

- gh-142389: Add backticks to stdlib argparse help to display in colour. Patch by Hugo van Kemenade.

- gh-149377: Update bundled pip to 26.1.1

- gh-142389: Add backtick markup support in `argparse` option help text to highlight inline code when color output is enabled. Patch by Hugo van Kemenade.

- gh-148675: Remove `F` and `D` formats from `array` and `memoryview`. Patch by Victor Stinner.

- gh-149342: Fix `_remote_debugging` binary writing so that sampling a thread whose Python frame stack is empty (for example while it is in a C call or mid-syscall) no longer raises `RuntimeError("Invalid stack encoding type")`, and so that `BinaryWriter.total_samples` after `finalize()` or context-manager exit includes samples flushed from the RLE buffer. Patch by Maurycy Pawłowski-Wieroński.

- gh-149010: The `inspect` module CLI now reports as much information as it has available for non-source modules when `--details` is specified, and provides an error message rather than a traceback when `--details` is omitted. It also reports improved information when the given target location is not the target’s defining location and when the given target is a data value rather than a class or function definition.

- gh-146609: Use `argparse` for colour help `timeit` CLI. Patch by Hugo van Kemenade.

- gh-142389: Add backticks for colour to regrtest and pdb’s help description. Patch by Hugo van Kemenade.

- gh-144384: Lazily import `_colorize`. Patch by Hugo van Kemenade.

- gh-149321: Fix import cycles exposed by running standard library modules with `-X lazy_imports=none`.

- gh-145378: Generate consistent colors for `pdb` commands in `pdb` REPL.

- gh-149296: Add a `dump` subcommand to `profiling.sampling` that prints a single traceback-style snapshot of a running process’s Python stack, including per-thread status, source line highlighting, optional bytecode opcode names, and async-aware task reconstruction. Patch by Pablo Galindo.

- gh-143231: A *module* attribute has been added to `warnings.WarningMessage`.

- gh-148675: `ctypes`: Change the `_type_` of `c_float_complex`, `c_double_complex` and `c_longdouble_complex` from `F`, `D` and `G` to `Zf`, `Zd` and `Zg` for compatibility with numpy. Patch by Victor Stinner.

- gh-148675: The `array.typecodes` type changed from `str` to `tuple` to support type codes longer than 1 character (`Zf` and `Zd`). Patch by Victor Stinner.

- gh-149221: Catch rare math domain error for `random.binomialvariate()`.

- gh-149231: In `tomllib`, the number of parts in TOML keys is now limited.

- gh-143231: `unittest.TestCase.assertWarns()` and `unittest.TestCase.assertWarnsRegex()` no longer swallow warnings that do not match the specified category or regex. Nested context managers are now supported.

- gh-149214: Fix `_remote_debugging` misreading non-ASCII Unicode strings (Latin-1, BMP and non-BMP) from a remote process. Filenames and function names that contain non-ASCII characters are now reported correctly in stack traces, the sampling profiler, and `asyncio` task introspection.

- gh-149189: `pprint` now uses modern defaults: `indent=4` and `width=88`, and the default `compact=False` output is now formatted similar to pretty-printed `json.dumps()`, with opening parentheses and brackets followed by a newline and the contents indented by one level. The *expand* parameter, added in 3.15.0a8, has been removed; `compact=False` (the default) now produces the former `expand=True` layout. Patch by Hugo van Kemenade.

- gh-149173: Fix inverted `PYTHON_BASIC_REPL` environment check in `pdb._pyrepl_available`.

- gh-149117: Fix `runpy.run_module()` and `runpy.run_path()` to set the `name` attribute on the `ImportError` they raise.

- gh-149148: `ensurepip`: Upgrade bundled pip to 26.1. This version fixes the **CVE 2026-3219** vulnerability. Patch by Victor Stinner.

- gh-149009: Validate that `profiling.sampling` binary profiles do not contain more unique (thread, interpreter) pairs than declared in the header. Patch by Maurycy Pawłowski-Wieroński.

- gh-148292: `ssl`: Update `ssl.SSLSocket` and `ssl.SSLObject` for OpenSSL 4. The classes now remember if they get a `ssl.SSLEOFError`. In this case, following `read()`, `sendfile()`, `write()`, and `do_handshake()` calls raise `ssl.SSLEOFError` without calling the underlying OpenSSL function. Thanks to that, `ssl.SSLSocket` behaves the same on all OpenSSL versions on EOF. Patch by Victor Stinner.

- gh-149085: Add a *max_threads* keyword argument to `faulthandler.dump_traceback()`, `faulthandler.dump_traceback_later()`, `faulthandler.enable()`, and `faulthandler.register()`.

- gh-148641: `pkgutil.resolve_name()` gets a new optional, keyword-only argument called `strict`. The default is `False` for backward compatibility.

- gh-148093: Fix an out-of-bounds read of one byte in `binascii.a2b_uu()`. Raise `binascii.Error`, instead of reading past the buffer end.

- gh-149083: `dataclasses.MISSING` and `dataclasses.KW_ONLY` are now instances of `sentinel`.

- gh-148914: Fix memoization of in-band `PickleBuffer` in the Python implementation of `pickle`. Previously, identical `PickleBuffer`s did not preserve identity, and empty writable `PickleBuffer` memoized an empty bytearray object in place of `b''`, so the following references to `b''` were unpickled as an empty bytearray object.

- gh-149026: Add colour to `pickletools` CLI output. Patch by Hugo van Kemenade.

- gh-148991: Add colour to `tokenize` CLI output. Patch by Hugo van Kemenade.

- gh-138907: Support **RFC 9309** in `urllib.robotparser`.

- gh-148981: Add *color* parameter to `ast.dump()`.

- gh-148849: Deprecate `http.cookies.Morsel.js_output()` and `http.cookies.BaseCookie.js_output()`, which will be removed in Python 3.19. Use `http.cookies.Morsel.output()` or `http.cookies.BaseCookie.output()` instead.

- gh-146311: Add a *canonical* keyword-only parameter to the base32, base64, base85, ascii85, and Z85 decoders in `base64` and `binascii`. When true, encodings with non-zero padding bits (base32/64) or non-canonical encodings (base85/ascii85) are rejected. Single-character final groups in `binascii.a2b_ascii85()` and `binascii.a2b_base85()` are now always rejected as encoding violations, regardless of *canonical*; previously they were silently ignored and produced no output bytes.

- gh-148947: Fix crash in `@dataclasses.dataclass` with `slots=True` that occurred when a function found within the class had an empty `__class__` cell.

- gh-148680: `ForwardRef` objects that contain internal names to represent known objects now show the `type_repr` of the known object rather than the internal `__annotationlib_name_x__` name when evaluated as strings.

- gh-124397: The threading module added tooling to support concurrent iterator access: `threading.serialize_iterator`, `threading.synchronized_iterator()`, and `threading.concurrent_tee()`.

- gh-148801: `xml.etree.ElementTree`: Fix a crash in `Element.__deepcopy__` on deeply nested trees.

- gh-148735: `xml.etree.ElementTree`: Fix a use-after-free in `Element.findtext` when the element tree is mutated concurrently during the search.

- gh-148740: Fix usage for `uuid` command-line interface to support a custom namespace be provided for uuid3 and uuid5.

- gh-148688: `bz2`, `compression.zstd`, `lzma`, `zlib`: Fix a double free on memory allocation failure. Patch by Victor Stinner.

- gh-148675: `array`, `struct`: Add support for `Zd` and `Zf` formats for double complex and float complex. Patch by Victor Stinner.

- gh-148651: Fix reference leak in `compression.zstd.ZstdDecompressor` when an invalid option key is passed.

- gh-148641: **PEP 829** (package startup configuration files) implements a new format `<name>.start` parallel to `<name>.pth` files, to replace `import` lines in the latter.

- gh-148639: Implement **PEP 800**, adding the `@typing.disjoint_base` decorator. Patch by Jelle Zijlstra.

- gh-148615: Fix `pdb` to accept standard – end of options separator. Reported by haampie. Patched by Shrey Naithani.

- gh-146553: Fix infinite loop in `typing.get_type_hints()` when `__wrapped__` forms a cycle. Patch by Shamil Abdulaev.

- gh-148599: Update the `socket` module’s WSA error messages to match official documentation.

- gh-148508: An intermittent timing error when running SSL tests on iOS has been resolved.

- gh-144881: `asyncio` debugging tools (`python -m asyncio ps` and `pstree`) now retry automatically on transient errors that can occur when attaching to a process under active thread delegation. The number of retries can be controlled with the `--retries` flag. Patch by Bartosz Sławecki.

- gh-148518: If an email containing an address header that ended in an open double quote was parsed with a non-`compat32` policy, accessing the `username` attribute of the mailbox accessed through that header object would result in an `IndexError`. It now correctly returns an empty string as the result.

- gh-148464: Add missing `__ctype_le/be__` attributes for `c_float_complex` and `c_double_complex`. Patch by Sergey B Kirpichev.

- gh-148370: `configparser`: prevent quadratic behavior when a `ParsingError` is raised after a parser fails to parse multiple lines. Patch by Bénédikt Tran.

- gh-121190: `importlib.resources.files()` now emits a more meaningful error message when module spec is None (as found in some `__main__` modules).

- gh-127012: `importlib.abc.Traversable.read_text` now allows/solicits an `errors` parameter.

- gh-137855: Improve import time of `dataclasses` module by lazy importing `re` and `copy` modules.

- gh-148352: Add more color to `calendar`’s CLI output. Patch by Hugo van Kemenade.

- gh-148254: Use singular “sec” instead of “secs” in `timeit` verbose output for consistency with other time units.

- gh-130472: Integrate fancycompleter with import completions.

- gh-148241: `json`: Fix serialization: no longer call `str(obj)` on `str` subclasses. Patch by Victor Stinner.

- gh-148225: The `profiling.sampling` `replay` command now rejects non-binary profile files with a clear error explaining that replay only accepts files created with `--binary`.

- gh-148192: `email.generator.Generator._make_boundary` could fail to detect a duplicate boundary string if linesep was not n. It now correctly detects boundary strings when linesep is rn as well.

- gh-148207: `typing.TypeVarTuple` now accepts `bound`, `covariant`, `contravariant`, and `infer_variance` parameters, matching the interface of `typing.TypeVar` and `typing.ParamSpec`.

- gh-148100: Soft deprecate `re.match()` and `re.Pattern.match()` in favour of `re.prefixmatch()` and `re.Pattern.prefixmatch()`. Patch by Hugo van Kemenade.

- gh-147991: Improve `tomllib` import time (up to 10x faster). Patch by Victor Stinner.

- gh-147957: Guarantees that `collections.UserDict.popitem()` will pop in the same order as the wrapped dictionary rather than an arbitrary order.

- gh-146256: The `profiling.sampling` module now supports JSONL output format via `--jsonl`. Each run emits a newline-delimited JSON file that is sequentially parseable by external tools, scripts, and programmatic consumers. Patch by Maurycy Pawłowski-Wieroński.

- gh-146609: Add colour to `timeit` CLI output. Patch by Hugo van Kemenade.

- gh-146563: `xml.parsers.expat`: add an exception note when a custom Expat handler return value cannot be properly interpreted. Patch by Bénédikt Tran.

- gh-137586: Add `MacOS` to `webbrowser` for macOS, which opens URLs via `/usr/bin/open` instead of piping AppleScript to `osascript`. Deprecate `MacOSXOSAScript` in favour of `MacOS`.

- gh-146406: Cross-language method suggestions are now shown for `AttributeError` on builtin types and their subclasses. For example, `[].push()` suggests `append`, `(1,2).append(3)` suggests using a `list`, `None.keys()` suggests expecting a `dict`, and `1.0.__or__` suggests using an `int`.

- gh-146313: Fix a deadlock in `multiprocessing`’s resource tracker where the parent process could hang indefinitely in `os.waitpid()` during interpreter shutdown if a child created via `os.fork()` still held the resource tracker’s pipe open.

- gh-146292: Add colour to `BaseHTTPRequestHandler` logs, as used by the `http.server` CLI. Patch by Hugo van Kemenade.

- gh-145917: Add MIME types for TTC and Haptics formats to `mimetypes`. (Contributed by Charlie Lin in gh-145918.)

- gh-145846: Fix memory leak in `_lsprof` when `clear()` is called during active profiling with nested calls. `clearEntries()` now walks the entire `currentProfilerContext` linked list instead of only freeing the top context.

- gh-145831: Fix `email.quoprimime.decode()` leaving a stray `\r` when `eol='\r\n'` by stripping the full *eol* string instead of one character.

- gh-145378: Use `PyREPL` as the default input console for `pdb`

- gh-145244: Fixed a use-after-free in `json` encoder when a `default` callback mutates the dictionary being serialized.

- gh-117716: Fix `wave` writing of odd-sized `data` chunks by appending the required RIFF pad byte and correcting the RIFF chunk size field accordingly.

- gh-145200: `hashlib`: fix a memory leak when allocating or initializing an OpenSSL HMAC context fails.

- gh-145056: Add support for `frozendict` in `dataclasses.asdict()` and `dataclasses.astuple()`.

- gh-145105: Fix crash in `csv` reader when iterating with a re-entrant iterator that calls `next()` on the same reader from within `__next__`.

- gh-130750: Restore quoting of choices in `argparse` error messages for improved clarity and consistency with documentation.

- gh-137855: Reduce the import time of `dataclasses` module by ~20%.

- gh-70647: `strptime()` now raises `ValueError` when the format string contains `%d` without a year directive. Using `%e` without a year now emits a `DeprecationWarning`.

- gh-105936: Attempting to mutate non-field attributes of `dataclasses` with both *frozen* and *slots* being `True` now raises `FrozenInstanceError` instead of `TypeError`. Their non-dataclass subclasses can now freely mutate non-field attributes, and the original non-slotted class can be garbage collected.

- gh-142831: Fix a crash in the `json` module where a use-after-free could occur if the object being encoded is modified during serialization.

- gh-108411: `typing.IO` and `typing.BinaryIO` method arguments are now positional-only.

- gh-130273: Fix traceback color output with Unicode characters.

- gh-142307: `imaplib`: deprecate support for `IMAP4.file`. This attribute was never meant to be part of the public interface and altering its value may result in unclosed files or other synchronization issues with the underlying socket. Patch by Bénédikt Tran.

- gh-141449: Improve tests and documentation for non-function callables as annotate functions.

- gh-140287: The `asyncio` REPL now handles exceptions when executing `PYTHONSTARTUP` scripts. Patch by Bartosz Sławecki.

- gh-139489: Add the `xml.is_valid_name()` function, which allows to check whether a string can be used as an element or attribute name in XML.

- gh-75707: Add optional `mtime` argument to `tarfile.open()`, for setting the `mtime` header field in `.tar.gz` archives.

- gh-125862: The `contextlib.contextmanager()` and `contextlib.asynccontextmanager()` decorators now work correctly with generators, coroutine functions, and async generators when the wrapped callables are used as decorators.

- gh-135528: `http.cookiejar`: add “tv”, “or”, “nom”, “sch”, and “web” to the default list of supported country code second-level domains.

- gh-135056: Add a `-H` or `--header` CLI option to **python -m http.server**. Contributed by Anton I. Sipos.

- gh-134551: Add t-strings support to pprint functions

- gh-133956: Fix bug where `@dataclass` wouldn’t detect `ClassVar` fields if `ClassVar` was re-exported from a module other than `typing`.

- gh-132631: Fix “I/O operation on closed file” when parsing JSON Lines file with `JSON CLI`.

- gh-108951: `asyncio`: Add `TaskGroup.cancel` which cancels unfinished tasks and exits the group without raising `asyncio.CancelledError`.

- gh-123853: Update the table of Windows language code identifiers (LCIDs) used by `locale.getdefaultlocale()` on Windows to protocol version 16.0 (2024-04-23).

- gh-122476: The `email` module no longer incorrectly uses **RFC 2047** encoding for a mailbox with non-ASCII characters in its local-part. Under a policy with `utf8` set `False`, attempting to serialize such a message will now raise an `HeaderWriteError`. There is no valid 7-bit encoding for an internationalized local-part. Use `email.policy.SMTPUTF8` (or another policy with `utf8=True`) to correctly pass through the local-part as Unicode characters.

- gh-83938: The `email` module no longer incorrectly uses **RFC 2047** encoding for a mailbox with non-ASCII characters in its domain. Under a policy with `utf8` set `False`, attempting to serialize such a message will now raise an `HeaderWriteError`. Either apply an appropriate IDNA encoding to convert the domain to ASCII before serialization, or use `email.policy.SMTPUTF8` (or another policy with `utf8=True`) to correctly pass through the internationalized domain name as Unicode characters.

- gh-81074: The `email` module no longer treats email addresses with non-ASCII characters as defects when parsing a Unicode string or in the `addr_spec` parameter to `email.headerregistry.Address`. **RFC 5322** permits such addresses, and they were already supported when parsing bytes and in the Address `username` parameter.

  The (undocumented) `email.errors.NonASCIILocalPartDefect` is no longer used and should be considered deprecated.

- gh-70039: Fixed bug where `smtplib.SMTP.starttls()` could fail if `smtplib.SMTP.connect()` is called explicitly rather than implicitly.

- gh-113471: Allow `http.server` to set a default content-type when serving files with an unknown or missing extension.

- gh-83281: `email`: improve handling trailing garbage in address lists to avoid throwing AttributeError in certain edge cases

- gh-96894: Do not turn echo off for subsequent commands in batch activators (`activate.bat` and `deactivate.bat`) of `venv`.

<!-- anchor: id63 | type: section -->
### Documentation

- gh-148663: Document that `calendar.IllegalMonthError` is a subclass of both `ValueError` and `IndexError` since Python 3.12.

- gh-146646: Document that `glob.glob()`, `glob.iglob()`, `pathlib.Path.glob()`, and `pathlib.Path.rglob()` silently suppress `OSError` exceptions raised from scanning the filesystem.

<!-- anchor: id64 | type: section -->
### Tests

- gh-149425: Increase time delta in `test.test_zipfile.test_core.OtherTests.test_write_without_source_date_epoch`

- gh-148600: Add OpenSSL 4.0.0 support to test configurations.

<!-- anchor: id65 | type: section -->
### Build

- gh-149353: Avoid unnecessary JIT-related rebuilds during `make install` after `--enable-optimizations` builds.

- gh-149351: Avoid possible broken macOS framework install names when DESTDIR is specified during builds.

- gh-149252: Update to WASI SDK 33.

- gh-148690: Windows free-threaded builds now output to a different default path with default filenames, for example, `PCbuild/amd64t/python.exe` rather than `PCbuild/amd64/python3.15t.exe`. The `PC/layout` script has been updated to ensure compatibility of generated layouts.

- gh-146475: Block Apple Clang from being used to build the JIT as it ships without required LLVM tools.

- gh-148644: Errors during the PGO training job on Windows are no longer ignored, and a non-zero return code will cause the build to fail.

- gh-148535: No longer use the `gcc -fprofile-update=atomic` flag on i686. The flag has been added to fix a random GCC internal error on PGO build (gh-145801) caused by corruption of profile data (.gcda files). The problem is that it makes the PGO build way slower (up to 47x slower) on i686. Since the GCC internal error was not seen on i686 so far, don’t use `-fprofile-update=atomic` on i686 anymore. Patch by Victor Stinner.

- gh-148483: Use `Py_GCC_ATTRIBUTE(unused)` for stop_tracing label.

- gh-148474: Fixed compilation of `Python/pystrhex.c` with older clang versions.

- gh-146445: The Android build tools have been moved to the Platforms folder.

- gh-146264: Fix static module builds on non-WASI targets by linking HACL dependencies as static libraries when `MODULE_BUILDTYPE=static`, preventing duplicate `_Py_LibHacl_*` symbol errors at link time.

- gh-138451: Allow for custom LLVM path using `LLVM_TOOLS_INSTALL_DIR` during JIT build.

- gh-133312: Add a new `./configure` option `--enable-static-libpython-for-interpreter` which, when used with `--enable-shared`, continues to build the shared library but does not use it for the interpreter. Instead, libpython is statically linked into the interpreter, as if `--enable-shared` had not been used. This allows you to do a single build and get a Python interpreter binary that does not use a shared library but also get a shared library for use by other programs.

<!-- anchor: id66 | type: section -->
### Windows

- gh-149254: Updated bundled version of OpenSSL to 3.5.6.

- gh-148690: Non-freethreaded builds on Windows now support extensions linked to `python3t.dll`, and will include a copy of that library in normal installs that references the non-freethreaded runtime.

- gh-146458: Fix incorrect REPL height and width tracking on console window resize on Windows.

<!-- anchor: id67 | type: section -->
### macOS

- gh-142295: For Python macOS framework builds, update Info.plist files to be more compliant with current Apple guidelines. Original patch contributed by Martinus Verburg.

- gh-149254: Update macOS installer to use OpenSSL 3.5.6.

<!-- anchor: id68 | type: section -->
### IDLE

- gh-94523: Detect file if modified at local disk and prompt to ask refresh. Patch by Shixian Li.

- gh-139551: Support rendering `BaseExceptionGroup` in IDLE.

- gh-89520: Make IDLE extension configuration look at user config files, allowing user-installed extensions to have settings and key bindings defined in ~/.idlerc.

<!-- anchor: id69 | type: section -->
### C API

- gh-149225: `PyCriticalSection` and related functions are added to the Stable ABI.

- gh-149216: `PyType_WatchCallback` callbacks registered via `PyType_AddWatcher()` are now also invoked when a watched heap type is deallocated. Previously, type watchers were only notified of modifications, which could cause stale references when a type was freed and its address was reused.

- gh-149101: Implement **PEP 788**.

- gh-149044: Implement **PEP 820**: Unified slot system for the C API.

- gh-148267: Using `Py_LIMITED_API` on a non-Windows free-threaded build no longer needs an extra `Py_GIL_DISABLED`.

- gh-145559: Rename `_Py_DumpTraceback` and `_Py_DumpTracebackThreads` to `PyUnstable_DumpTraceback()` and `PyUnstable_DumpTracebackThreads()`.

- gh-146636: Implement **PEP 803** – `abi3t`: Stable ABI for Free-Threaded Builds.

- gh-146302: `Py_IsInitialized()` no longer returns true until initialization has fully completed, including import of the `site` module. The underlying runtime flags now use atomic operations.

- gh-146063: Add `PyObject_CallFinalizerFromDealloc()` function to the limited C API. Patch by Victor Stinner.

- gh-145921: Add functions that are guaranteed to be safe for use in `tp_traverse` handlers: `PyObject_GetTypeData_DuringGC()`, `PyObject_GetItemData_DuringGC()`, `PyType_GetModuleState_DuringGC()`, `PyModule_GetState_DuringGC()`, `PyModule_GetToken_DuringGC()`, `PyType_GetBaseByToken_DuringGC()`, `PyType_GetModule_DuringGC()`, `PyType_GetModuleByToken_DuringGC()`.

<!-- anchor: python-3-15-0-alpha-8 | type: section -->
## Python 3.15.0 alpha 8

*Release date: 2026-04-07*

<!-- anchor: id70 | type: section -->
### Security

- gh-145986: `xml.parsers.expat`: Fixed a crash caused by unbounded C recursion when converting deeply nested XML content models with `ElementDeclHandler()`. This addresses **CVE 2026-4224**.

- gh-145599: Reject control characters in `http.cookies.Morsel` `update()` and `js_output()`. This addresses **CVE 2026-3644**.

- gh-143930: Reject leading dashes in URLs passed to `webbrowser.open()`.

<!-- anchor: id71 | type: section -->
### Core and Builtins

- gh-148157: Fix an unlikely crash when parsing an invalid type comments for function parameters. Found by OSS Fuzz in #492782951.

- gh-100239: Propagate result type and uniqueness information through `_BINARY_OP_EXTEND` in the tier 2 optimizer, enabling elimination of downstream type guards and selection of inplace float operations.

- gh-148144: Initialize `_PyInterpreterFrame.visited` when copying interpreter frames so incremental GC does not read an uninitialized byte from generator and frame-object copies.

- gh-148072: Cache `pickle.dumps` and `pickle.loads` per interpreter in the XIData framework, avoiding repeated module lookups on every cross-interpreter data transfer. This speeds up `InterpreterPoolExecutor` for mutable types (`list`, `dict`) by 1.7x–3.3x.

- gh-148110: Fix `sys.set_lazy_imports_filter()` so relative lazy imports pass the resolved imported module name to the filter callback. Patch by Pablo Galindo.

- gh-148083: Constant-fold `_CONTAINS_OP_SET` for `frozenset`. Patch by Donghee Na.

- gh-144319: Fix a bug that could cause applications with specific allocation patterns to leak memory via Huge Pages if compiled with Huge Page support. Patch by Pablo Galindo

- gh-147985: Make `PySet_Contains()` attempt a lock-free lookup, similar to `set.__contains__()`. This avoids acquiring the set object mutex in the normal case.

- gh-147856: Allow the *count* argument of `bytes.replace()` to be a keyword.

- gh-146615: Fix a crash in `__get__()` for METH_METHOD descriptors when an invalid (non-type) object is passed as the second argument. Patch by Steven Sun.

- gh-146306: Optimize compact integer arithmetic in the JIT by mutating uniquely-referenced operands in place, avoiding allocation of a new int object. Speeds up the pyperformance `spectral_norm` benchmark by ~10%.

- gh-146587: Fix type slot assignment incase of multiple slots for same name in type object implementation. Patch by Kumar Aditya.

- gh-126910: Set frame pointers in `aarch64-unknown-linux-gnu` JIT code, allowing most native profilers and debuggers to unwind through them. Patch by Diego Russo

- gh-146388: Adds a null check to handle when the JIT optimizer runs out of space when dealing with contradictions in `make_bottom`.

- gh-146308: Fixed multiple error handling issues in the `_remote_debugging` module including a double-free in code object caching, memory leaks on allocation failure, missing exception checks in binary format varint decoding, reference leaks on error paths in frame chain processing, and inconsistent thread status error reporting across platforms. Patch by Pablo Galindo.

- gh-146306: Optimize float arithmetic in the JIT by mutating uniquely-referenced operands in place, avoiding allocation of a new float object. Speeds up the pyperformance `nbody` benchmark by ~19%.

- gh-146128: Fix a bug which could cause constant values to be partially corrupted in AArch64 JIT code. This issue is theoretical, and hasn’t actually been observed in unmodified Python interpreters.

- gh-146250: Fixed a memory leak in `SyntaxError` when re-initializing it.

- gh-146245: Fixed reference leaks in `socket` when audit hooks raise exceptions in `socket.getaddrinfo()` and `socket.sendto()`.

- gh-146151: `memoryview` now supports the float complex and double complex C types: formatting characters `'F'` and `'D'` respectively. Patch by Sergey B Kirpichev.

- gh-146196: Fix potential Undefined Behavior in `PyUnicodeWriter_WriteASCII()` by adding a zero-length check. Patch by Shamil Abdulaev.

- gh-146227: Fix wrong type in `_Py_atomic_load_uint16` in the C11 atomics backend (`pyatomic_std.h`), which used a 32-bit atomic load instead of 16-bit. Found by Mohammed Zuhaib.

- gh-146205: Fixed a bug where `select.epoll.close()`, `select.kqueue.close()`, and `select.devpoll.close()` silently ignored errors.

- gh-146199: Comparison of code objects now handles errors correctly.

- gh-145667: Remove the `GET_ITER_YIELD_FROM` instruction, modifying `SEND` to pair with `GET_ITER` when compiling `yield from` expressions.

- gh-146192: Add Base32 support to `binascii` and improve the performance of the Base32 converters in `base64`. Patch by James Seo.

- gh-135871: Improve multithreaded scaling of PyMutex in low-contention scenarios by reloading the lock’s internal state, without slowing down high-contention scenarios.

- gh-146096: Fixed segmentation fault when called repr for BaseExceptionGroup with empty or 1-size tuple args.

- gh-146056: Fix `repr()` for lists and tuples containing `NULL`s.

- gh-145059: Fixed `sys.lazy_modules` to include lazy modules without submodules. Patch by Bartosz Sławecki.

- gh-146041: Fix free-threading scaling bottleneck in `sys.intern()` and `PyObject_SetAttr()` by avoiding the interpreter-wide lock when the string is already interned and immortalized.

- gh-145990: `python --help-env` sections are now sorted by environment variable name.

- gh-145990: `python --help-xoptions` is now sorted by `-X` option name.

- gh-145876: `AttributeError`s and `KeyError`s raised in `keys()` or `__getitem__()` during dictionary unpacking (`{**mymapping}` or `func(**mymapping)`) are no longer masked by `TypeError`.

- gh-127958: Support tracing from function entrypoints in the JIT. Patch by Ken Jin.

- gh-145376: Fix GC tracking in `structseq.__replace__()`.

- gh-145792: Fix out-of-bounds access when invoking faulthandler on a CPython build compiled without support for VLAs.

- gh-142183: Avoid a pathological case where repeated calls at a specific stack depth could be significantly slower.

- gh-145779: Improve scaling of `classmethod()` and `staticmethod()` calls in the free-threaded build by avoiding the descriptor `__get__` call.

- gh-145783: Fix an unlikely crash in the parser when certain errors were erroneously not propagated. Found by OSS Fuzz in #491369109.

- gh-145685: Improve scaling of type attribute lookups in the free-threaded build by avoiding contention on the internal type lock.

- gh-145713: Make `bytearray.resize()` thread-safe in the free-threaded build by using a critical section and calling the lock-held variant of the resize function.

- gh-145036: In free-threaded build, fix race condition when calling `__sizeof__()` on a `list`

- gh-134584: Eliminate redundant refcounting for `MATCH_CLASS` in the JIT.

- gh-69605: Add `math.integer` to REPL auto-completion of imports.

- gh-131798: Optimize `_ITER_CHECK_RANGE` and `_ITER_CHECK_LIST` in the JIT

- gh-143414: Add tracking to the JIT optimizer to determine whether a reference is uniquely owned or shared

- gh-143636: Fix a crash when calling `SimpleNamespace.__replace__()` on non-namespace instances. Patch by Bénédikt Tran.

- gh-126910: Set frame pointers in `x86_64-unknown-linux-gnu` JIT code, allowing most native profilers and debuggers to unwind through them.

- gh-140594: Fix an out of bounds read when a single NUL character is read from the standard input. Patch by Shamil Abdulaev.

- gh-140870: Add support for module attributes in the REPL auto-completion of imports.

<!-- anchor: id72 | type: section -->
### Library

- gh-144503: Fix a regression introduced in 3.14.3 and 3.13.12 where the `multiprocessing` `forkserver` start method would fail with `BrokenPipeError` when the parent process had a very large `sys.argv`. The argv is now passed to the forkserver as separate command-line arguments rather than being embedded in the `-c` command string, avoiding the operating system’s per-argument length limit.

- gh-148153: `base64.b32encode()` now always raises `ValueError` instead of `AssertionError` for the value of *map01* with invalid length.

- gh-73613: Add the *padded* parameter in functions related to Base32 and Base64 codecs in the `binascii` and `base64` modules. In the encoding functions it controls whether the pad character can be added in the output, in the decoding functions it controls whether padding is required in input. Padding of input no longer required in `base64.urlsafe_b64decode()` by default.

- gh-146613: `itertools`: Fix a crash in `itertools.groupby()` when the grouper iterator is concurrently mutated.

- gh-147944: Accepted range for the *bytes_per_sep* argument of `bytes.hex()`, `bytearray.hex()`, `memoryview.hex()`, and `binascii.b2a_hex()` is now increased, so passing `sys.maxsize` and `-sys.maxsize` is now valid.

- gh-146080: `ssl`: fix a crash when an SNI callback tries to use an SSL object that has already been garbage-collected. Patch by Bénédikt Tran.

- gh-146556: Fix `annotationlib.get_annotations()` hanging indefinitely when called with `eval_str=True` on a callable that has a circular `__wrapped__` chain (e.g. `f.__wrapped__ = f`). Cycle detection using an id-based visited set now stops the traversal and falls back to the globals found so far, mirroring the approach of `inspect.unwrap()`.

- gh-146090: `sqlite3`: fix a crash when `sqlite3.Connection.create_collation()` fails with SQLITE_BUSY. Patch by Bénédikt Tran.

- gh-146090: `sqlite3`: properly raise `MemoryError` instead of `SystemError` when a context callback fails to be allocated. Patch by Bénédikt Tran.

- gh-146507: Make `asyncio.SelectorEventLoop()` stream transport’s `get_write_buffer_size()` O(1) by maintaining a running byte counter instead of iterating the buffer on every call.

- gh-145056: Fix merging of `collections.OrderedDict` and `frozendict`.

- gh-145056: Add support for merging `collections.UserDict` and `frozendict`.

- gh-145633: Fix `struct.pack('f', float)`: use `PyFloat_Pack4()` to raise `OverflowError`. Patch by Sergey B Kirpichev and Victor Stinner.

- gh-146440: `json`: Add the *array_hook* parameter to `load()` and `loads()` functions: allow a callback for JSON literal array types to customize Python lists in the resulting decoded object. Passing combined `frozendict` to *object_pairs_hook* param and `tuple` to `array_hook` will yield a deeply nested immutable Python structure representing the JSON data.

- gh-146431: Add the *wrapcol* parameter to `base64` functions `b16encode()`, `b32encode()`, `b32hexencode()`, `b85encode()` and `z85encode()`, and `binascii` functions `b2a_base32()` and `b2a_base85()`. Add the *ignorechars* parameter to `base64` functions `b16decode()`, `b32decode()`, `b32hexdecode()`, `b85decode()` and `z85decode()`, and `binascii` functions `a2b_hex()`, `unhexlify()`, `a2b_base32()` and `a2b_base85()`.

- gh-146310: The `ensurepip` module no longer looks for `pip-*.whl` wheel packages in the current directory.

- gh-141510: Support `frozendict` in `plistlib`, for serialization only. Patch by Hugo van Kemenade.

- gh-146238: Support half-floats (type code `'e'` of the `struct` module) in the `array` module. Patch by Sergey B Kirpichev.

- gh-140947: Fix incorrect contextvars handling in server tasks created by `asyncio`. Patch by Kumar Aditya.

- gh-146151: Support the float complex and double complex C types in the `array` module: formatting characters `'F'` and `'D'` respectively. Patch by Sergey B Kirpichev.

- gh-143387: In importlib.metadata, when a distribution file is corrupt and there is no metadata file, calls to `Distribution.metadata()` (including implicit calls from other properties like `.name` and `.requires`) will now raise a `MetadataNotFound` Exception. This allows callers to distinguish between missing metadata and a degenerate (empty) metadata. Previously, if the file was missing, an empty `PackageMetadata` would be returned and would be indistinguishable from the presence of an empty file.

- gh-146228: Cached FastPath objects in importlib.metadata are now cleared on fork, avoiding broken references to zip files during fork.

- gh-146171: Nested `AttributeError` suggestions now include property-backed attributes on nested objects without executing the property getter.

- gh-145410: On Windows, `sysconfig.get_platform()` now gets the platform from the `_sysconfig` module instead of parsing `sys.version` string. Patch by Victor Stinner.

- gh-146091: Fix a bug in `termios.tcsetwinsize()` where passing a sequence that raises an exception in `__getitem__` would cause a `SystemError` instead of propagating the original exception.

- gh-146083: Update bundled libexpat to version 2.7.5.

- gh-146076: `zoneinfo`: fix crashes when deleting `_weak_cache` from a `zoneinfo.ZoneInfo` subclass.

- gh-123471: Make concurrent iteration over `itertools.zip_longest` safe under free-threading.

- gh-146075: Errors when calling `functools.partial()` with a malformed keyword will no longer crash the interpreter.

- gh-146054: Limit the size of `encodings.search_function()` cache. Found by OSS Fuzz in #493449985.

- gh-146004: All `-X` options from the Python command line are now propagated to child processes spawned by `multiprocessing`, not just a hard-coded subset. This makes the behavior consistent between default “spawn” and “forkserver” start methods and the old “fork” start method. The options that were previously not propagated are: `context_aware_warnings`, `cpu_count`, `disable-remote-debug`, `int_max_str_digits`, `lazy_imports`, `no_debug_ranges`, `pathconfig_warnings`, `perf`, `perf_jit`, `presite`, `pycache_prefix`, `thread_inherit_context`, and `warn_default_encoding`.

- gh-145980: Added the *alphabet* parameter in `b2a_base64()`, `a2b_base64()`, `b2a_base85()` and `a2b_base85()` and a number of `*_ALPHABET` constants in the `binascii` module. Removed `b2a_z85()` and `a2b_z85()`.

- gh-145968: Fix translation in `base64.b64decode()` when altchars overlaps with the standard ones.

- gh-145966: Non-`AttributeError` exceptions raised during dialect attribute lookup in `csv` are no longer silently suppressed.

- gh-145883: `zoneinfo`: Fix heap buffer overflow reads from malformed TZif data. Found by OSS Fuzz, issues #492245058 and #492230068.

- gh-145850: Changed some implementation details in `struct.Struct`: calling it with non-ASCII string format will now raise a `ValueError` instead of `UnicodeEncodeError`, calling it with non-ASCII bytes format will now raise a `ValueError` instead of `struct.error`, getting the `format` attribute of uninitialized object will now raise an `AttributeError` instead of `RuntimeError`.

- gh-123720: asyncio: Fix `asyncio.Server.serve_forever()` shutdown regression. Since 3.12, cancelling `serve_forever()` could hang waiting for a handler blocked on a read from a client that never closed (effectively requiring two interrupts to stop); the shutdown sequence now ensures client streams are closed so `serve_forever()` exits promptly and handlers observe EOF.

- gh-138122: The `profiling.sampling` module now supports differential flamegraph visualization via `--diff-flamegraph` to compare two profiling runs. Functions are colored red (regressions), blue (improvements), gray (neutral), or purple (new). Elided stacks show code paths that disappeared between runs.

- gh-145754: Request signature during mock autospec with `FORWARDREF` annotation format. This prevents runtime errors when an annotation uses a name that is not defined at runtime.

- gh-145750: Avoid undefined behaviour from signed integer overflow when parsing format strings in the `struct` module. Found by OSS Fuzz in #488466741.

- gh-145719: Add `application/efi` MIME type to `mimetypes`.

- gh-145717: Add a few Microsoft-specific MIME types.

- gh-145703: `asyncio`: Make sure that `loop.call_at` and `loop.call_later` trigger scheduled events on time when the clock resolution becomes too small.

- gh-145697: Add `application/sql` and `application/vnd.sqlite3` into `mimetypes`.

- gh-145492: Fix infinite recursion in `collections.defaultdict` `__repr__` when a `defaultdict` contains itself. Based on analysis by KowalskiThomas in gh-145492.

- gh-145650: Add `__repr__()` support to `logging.Formatter` and `logging.Filter`, showing the format string and filter name respectively.

- gh-145587: Resolved a performance regression in `multiprocessing.connection.wait` on Windows that caused infinite busy loops when called with no objects. The function now properly yields control to the OS to conserve CPU resources. Patch By Shrey Naithani

- gh-145616: Detect Android sysconfig ABI correctly on 32-bit ARM Android on 64-bit ARM kernel

- gh-145546: Fix `unittest.util.sorted_list_difference()` to deduplicate remaining elements when one input list is exhausted before the other.

- gh-145446: Now `functools` is safer in free-threaded build when using keywords in `functools.partial()`

- gh-145264: Base64 decoder (see `binascii.a2b_base64()`, `base64.b64decode()`, etc) no longer ignores excess data after the first padded quad in non-strict (default) mode. Instead, in conformance with **RFC 4648**, section 3.3, it now ignores the pad character, “=”, if it is present before the end of the encoded data.

- gh-145035: Allows omitting the internal library `_pyrepl` with limited loss of functionality. This allows complete removal of the modern REPL, which is an unsupported configuration, but still desirable for some distributions.

- gh-144270: Made the *tag* parameter of `xml.etree.ElementTree.Element` and the *parent* and *tag* parameters of `xml.etree.ElementTree.SubElement()` positional-only, matching the behavior of the C accelerator.

- gh-144984: Fix crash in `xml.parsers.expat.xmlparser.ExternalEntityParserCreate()` when an allocation fails. The error paths could dereference NULL `handlers` and double-decrement the parent parser’s reference count.

- gh-144975: `wave.Wave_write.setframerate()` now validates the frame rate after rounding to an integer, preventing values like `0.5` from being accepted and causing confusing errors later. Patch by Michiel Beijen.

- gh-140715: Add `%n` and `%t` support to `strptime()`.

- gh-144259: Fix inconsistent display of long multiline pasted content in the REPL.

- gh-140814: `multiprocessing.freeze_support()` no longer sets the default start method as a side effect, which previously caused a subsequent `multiprocessing.set_start_method()` call to raise `RuntimeError`.

- gh-123471: Make concurrent iteration over `itertools.accumulate` safe under free-threading.

- gh-143715: Calling the `Struct.__new__()` without required argument now is deprecated. Calling `__init__()` method on initialized `Struct` objects is deprecated.

- gh-142763: Fix a race condition between `zoneinfo.ZoneInfo` creation and `zoneinfo.ZoneInfo.clear_cache()` that could raise `KeyError`.

- gh-141707: Don’t change `tarfile.TarInfo` type from `AREGTYPE` to `DIRTYPE` when parsing GNU long name or link headers.

- gh-138577: `getpass.getpass()` with non-empty `echo_char` now handles keyboard shortcuts including Ctrl+A/E (cursor movement), Ctrl+K/U (kill line), Ctrl+W (erase word), and Ctrl+V (literal next) by reading the terminal’s control character settings and processing them appropriately in non-canonical mode. Patch by Sanyam Khurana.

- gh-140049: `traceback.format_exception_only()` now colorizes exception notes.

- gh-139933: Improve `AttributeError` suggestions for classes with a custom `__dir__()` method returning a list of unsortable values. Patch by Bénédikt Tran.

- gh-139633: The `netrc` security check is now run once per parse rather than once per entry.

- gh-130472: Add fancycompleter and enable it by default when using pyrepl. This gives colored tab completion.

- gh-112632: Add an *expand* keyword argument for `pprint.pprint()`, `pprint.pformat()`, `pprint.pp()` by passing on all *kwargs* and `pprint.PrettyPrinter`. Contributed by Stefan Todoran and Semyon Moroz.

- gh-66419: Optional argument with nargs equals to `argparse.REMAINDER` now consumes all remaining arguments including `'--'`.

- gh-60729: Add support for floating point audio wave files in `wave`.

- bpo-36461: Make the target time of `timeit.Timer.autorange()` configurable and add `--target-time` option to the command-line interface of `timeit`.

<!-- anchor: id74 | type: section -->
### Documentation

- gh-126676: Expand `argparse` documentation for `type=bool` with a demonstration of the surprising behavior and pointers to common alternatives.

- gh-145649: Fix text wrapping and formatting of `-X` option descriptions in the *python(1)* man page by using proper roff markup.

<!-- anchor: id75 | type: section -->
### Tests

- gh-144418: The Android testbed’s emulator RAM has been increased from 2 GB to 4 GB.

- gh-146202: Fix a race condition in regrtest: make sure that the temporary directory is created in the worker process. Previously, temp_cwd() could fail on Windows if the “build” directory was not created. Patch by Victor Stinner.

<!-- anchor: id76 | type: section -->
### Build

- gh-146541: The Android testbed can now be built for 32-bit ARM and x86 targets.

- gh-146498: The iOS XCframework build script now ensures libpython isn’t included in installed app content, and is more robust in identifying standard library binary content that requires processing.

- gh-146450: The Android build script was modified to improve parity with other platform build scripts.

- gh-146446: The clean target for the Apple/iOS XCframework build script is now more selective when targeting a single architecture.

- gh-146444: The Apple/iOS build script has been moved to the Platforms directory.

- gh-146210: Fix building the jit stencils on Windows when the interpreter is built with a different clang version. Patch by Chris Eibl.

- gh-145844: Update to WASI SDK 32.

- gh-145801: When Python build is optimized with GCC using PGO, use `-fprofile-update=atomic` option to use atomic operations when updating profile information. This option reduces the risk of gcov Data Files (.gcda) corruption which can cause random GCC crashes. Patch by Victor Stinner.

- gh-138850: Add `--disable-epoll` to `configure`

- gh-145633: Remove support for ancient ARM platforms (ARMv4L and ARMv5L OABI boards), using mixed-endian representation for doubles. Patch by Sergey B Kirpichev.

- gh-85277: Fix building without `stropts.h` or empty `stropts.h`

<!-- anchor: id77 | type: section -->
### Windows

- gh-140131: Fix REPL cursor position on Windows when module completion suggestion line hits console width.

<!-- anchor: id78 | type: section -->
### macOS

- gh-137586: Invoke **osascript** with absolute path in `webbrowser` and `turtledemo`.

<!-- anchor: id79 | type: section -->
### Tools/Demos

- gh-135953: Properly identify the main thread in the Gecko profiler collector by using a status flag from the interpreter state instead of relying on `threading.main_thread()` in the collector process.

- gh-145976: Remove `Misc/indent.pro`, a configuration file for GNU *indent(1)*.

- gh-145976: Remove `Misc/vgrindefs` and `Misc/Porting`.

<!-- anchor: id80 | type: section -->
### C API

- gh-146636: The `Py_mod_abi` slot is now mandatory for modules created from a slots array (using `PyModule_FromSlotsAndSpec()` or the `PyModExport_*` export hook).

- gh-146175: The following macros are soft deprecated: `Py_ALIGNED`, `PY_FORMAT_SIZE_T`, `Py_LL`, `Py_ULL`, `PY_LONG_LONG`, `PY_LLONG_MIN`, `PY_LLONG_MAX`, `PY_ULLONG_MAX`, `PY_INT32_T`, `PY_UINT32_T`, `PY_INT64_T`, `PY_UINT64_T`, `PY_SIZE_MAX`, `Py_UNICODE_SIZE`, `Py_VA_COPY`.

  The macro `Py_UNICODE_WIDE`, which was scheduled for removal, is soft deprecated instead.

- gh-146143: `PyUnicodeWriter_WriteUCS4()` now accepts a pointer to a constant buffer of `Py_UCS4`.

- gh-146056: `PyUnicodeWriter_WriteRepr()` now supports `NULL` argument.

- gh-145010: Use GCC dialect alternatives for inline assembly in `object.h` so that the Python headers compile correctly with `-masm=intel`.

<!-- anchor: python-3-15-0-alpha-7 | type: section -->
## Python 3.15.0 alpha 7

*Release date: 2026-03-10*

<!-- anchor: id81 | type: section -->
### Windows

- gh-145731: Fix negative timestamp during DST on Windows. Patch by Hugo van Kemenade.

- gh-145307: Defers loading of the `psapi.dll` module until it is used by `ctypes.util.dllist()`.

- gh-144551: Updated bundled version of OpenSSL to 3.5.5.

<!-- anchor: id82 | type: section -->
### Tests

- gh-144741: Fix `test_frame_pointer_unwind` when Python is built with `--enable-shared`. Classify also libpython frames as `"python"`. Patch by Victor Stinner.

- gh-144739: When Python was compiled with system expat older then 2.7.2 but tests run with newer expat, still skip `test.test_pyexpat.MemoryProtectionTest`.

<!-- anchor: id83 | type: section -->
### Security

- gh-145506: Fixes **CVE 2026-2297** by ensuring that `SourcelessFileLoader` uses `io.open_code()` when opening `.pyc` files.

- gh-144370: Disallow usage of control characters in status in `wsgiref.handlers` to prevent HTTP header injections. Patch by Benedikt Johannes.

<!-- anchor: id84 | type: section -->
### Library

- gh-145623: Fix crash in `struct` when calling `repr()` or `__sizeof__()` on an uninitialized `struct.Struct` object created via `Struct.__new__()` without calling `__init__()`.

- gh-145551: Fix InvalidStateError when cancelling process created by `asyncio.create_subprocess_exec()` or `asyncio.create_subprocess_shell()`. Patch by Daan De Meyer.

- gh-141510: `marshal` now supports `frozendict` objects. The marshal format version was increased to 6. Patch by Victor Stinner.

- gh-145417: `venv`: Prevent incorrect preservation of SELinux context when copying the `Activate.ps1` script. The script inherited the SELinux security context of the system template directory, rather than the destination project directory.

- gh-145335: `os.listdir(-1)` and `os.scandir(-1)` now fail with `OSError(errno.EBADF)` rather than listing the current directory. `os.listxattr(-1)` now fails with `OSError(errno.EBADF)` rather than listing extended attributes of the current directory. Patch by Victor Stinner.

- gh-145376: Fix double free and null pointer dereference in unusual error scenarios in `hashlib` and `hmac` modules.

- gh-145301: `hmac`: fix a crash when the initialization of the underlying C extension module fails.

- gh-145301: `hashlib`: fix a crash when the initialization of the underlying C extension module fails.

- gh-76007: The `version` attribute of the `tarfile` module is deprecated and slated for removal in Python 3.20.

- gh-145158: Avoid undefined behaviour from signed integer overflow when parsing format strings in the `struct` module.

- gh-123853: Removed Windows 95 compatibility for `locale.getdefaultlocale()`.

- gh-66802: Add `unicodedata.block()` function to return the Unicode block of a character.

- gh-145033: Add `typing.TypeForm`, implementing **PEP 747**. Patch by Jelle Zijlstra.

- gh-141510: `dataclasses.field()`: if *metadata* is `None`, use an empty `frozendict`, instead of a `MappingProxyType()` of an empty `dict`. Patch by Victor Stinner.

- gh-145006: Add `ModuleNotFoundError` hints when a module for a different ABI exists.

- gh-141510: `ParameterizedMIMEHeader.params` of `email.headerregistry` is now a `frozendict` instead of a `types.MappingProxyType`. Patch by Victor Stinner.

- gh-134872: Add valid import name suggestions on `ModuleNotFoundError`.

- gh-88091: Fix `unicodedata.decomposition()` for Hangul characters.

- gh-144986: Fix a memory leak in `atexit.register()`. Patch by Shamil Abdulaev.

- gh-144777: Fix data races in `io.IncrementalNewlineDecoder` in the free-threaded build.

- gh-144809: Make `collections.deque` copy atomic in the free-threaded build.

- gh-141510: The `copy` module now supports the `frozendict` type. Patch by Pieter Eendebak based on work by Victor Stinner.

- gh-141510: The `json` module now supports the `frozendict` type. Patch by Victor Stinner.

- gh-144835: Added missing explanations for some parameters in `glob.glob()` and `glob.iglob()`.

- gh-144833: Fixed a use-after-free in `ssl` when `SSL_new()` returns NULL in `newPySSLSocket()`. The error was reported via a dangling pointer after the object had already been freed.

- gh-140715: Add `'%D'` support to `strptime()`.

- gh-144782: Fix `argparse.ArgumentParser` to be `pickleable`.

- gh-144763: Fix a race condition in `tracemalloc`: it no longer detaches the attached thread state to acquire its internal lock. Patch by Victor Stinner.

- gh-142224: `unicodedata.bidirectional()` now return the correct default bidi class for unassigned code points.

- gh-117865: Reduce the import time of `inspect` module by ~20%.

- gh-144156: Fix the folding of headers by the `email` library when **RFC 2047** encoded words are used. Now whitespace is correctly preserved and also correctly added between adjacent encoded words. The latter property was broken by the fix for gh-92081, which mostly fixed previous failures to preserve whitespace.

- gh-66305: Fixed a hang on Windows in the `tempfile` module when trying to create a temporary file or subdirectory in a non-writable directory.

- gh-144615: Methods directly decorated with `@functools.singledispatchmethod` now dispatch on the second argument when called after being accessed as class attributes. Patch by Bartosz Sławecki.

- gh-144321: The functional syntax for creating `typing.NamedTuple` classes now supports passing any iterable of fields and types. Previously, only sequences were supported.

- gh-144475: Calling `repr()` on `functools.partial()` is now safer when the partial object’s internal attributes are replaced while the string representation is being generated.

- gh-144285: Attribute suggestions in `AttributeError` tracebacks are now formatted differently to make them easier to understand, for example: `Did you mean '.datetime.now' instead of '.now'`. Contributed by Bartosz Sławecki.

- gh-144316: Fix crash in `_remote_debugging` that caused `test_external_inspection` to intermittently fail. Patch by Taegyun Kim.

- gh-143637: Fixed a crash in socket.sendmsg() that could occur if ancillary data is mutated re-entrantly during argument parsing.

- gh-140652: Fix a crash in `_interpchannels.list_all()` after closing a channel.

- gh-143698: Allow *scheduler* and *setpgroup* arguments to be explicitly `None` when calling `os.posix_spawn()` or `os.posix_spawnp()`. Patch by Bénédikt Tran.

- gh-143698: Raise `TypeError` instead of `SystemError` when the *scheduler* in `os.posix_spawn()` or `os.posix_spawnp()` is not a tuple. Patch by Bénédikt Tran.

- gh-142516: `ssl`: fix reference leaks in `ssl.SSLContext` objects. Patch by Bénédikt Tran.

- gh-85809: Added path-like object support for `shutil.make_archive()`.

- gh-143304: Fix `ctypes.CDLL` to honor the `handle` parameter on POSIX systems.

- gh-142781: `zoneinfo`: fix a crash when instantiating `ZoneInfo` objects for which the internal class-level cache is inconsistent.

- gh-142787: Fix assertion failure in `sqlite3` blob subscript when slicing with indices that result in an empty slice.

- gh-142352: Fix `asyncio.StreamWriter.start_tls()` to transfer buffered data from `StreamReader` to the SSL layer, preventing data loss when upgrading a connection to TLS mid-stream (e.g., when implementing PROXY protocol support).

- gh-139899: Introduced `importlib.abc.MetaPathFinder.discover()` and `importlib.abc.PathEntryFinder.discover()` to allow module and submodule name discovery without assuming the use of traditional filesystem based imports.

- gh-137335: Get rid of any possibility of a name conflict for named pipes in `multiprocessing` and `asyncio` on Windows, no matter how small.

- gh-135883: Fix `sqlite3`’s interactive shell keeping part of previous commands when scrolling history.

- gh-124748: Improve `TypeError` error message when `weakref.WeakKeyDictionary.update()` is used with keyword-only parameters.

- gh-80667: Add support for Tangut Ideographs names in `unicodedata`.

- bpo-42353: The `re` module gains a new `re.prefixmatch()` function as an explicit spelling of what has to date always been known as `re.match()`. `re.Pattern` similary gains a `re.Pattern.prefixmatch()` method.

  Why? Explicit is better than implicit. Other widely used languages all use the term “match” to mean what Python uses the term “search” for. The unadorened “match” name in Python has been a frequent case of confusion and coding bugs due to the inconsistency with the rest if the software industry.

  We do not plan to deprecate and remove the older `match` name.

- bpo-40243: Fix `unicodedata.ucd_3_2_0.numeric()` for non-decimal values.

- bpo-40212: Re-enable `os.posix_fallocate()` and `os.posix_fadvise()` on AIX.

- bpo-3405: Add support for user data of Tk virtual events and detail for `Enter`, `Leave`, `FocusIn`, `FocusOut`, and `ConfigureRequest` events to `tkinter`.

- bpo-32234: `mailbox.Mailbox` instances can now be used as a context manager. The Mailbox is locked on context entry and unlocked and closed at context exit.

<!-- anchor: id85 | type: section -->
### Documentation

- gh-145450: Document missing public `wave.Wave_write` getter methods.

- gh-110937: Document rest of full public `importlib.metadata.Distribution` API. Also add the (already documented) `PackagePath` to `__all__`.

- gh-136246: A new “Improve this page” link is available in the left-hand sidebar of the docs, offering links to create GitHub issues, discussion forum posts, or pull requests.

<!-- anchor: id86 | type: section -->
### Core and Builtins

- gh-145701: Fix `SystemError` when `__classdict__` or `__conditional_annotations__` is in a class-scope inlined comprehension. Found by OSS Fuzz in #491105000.

- gh-145615: Fixed a memory leak in the free-threaded build where mimalloc pages could become permanently unreclaimable until the owning thread exited.

- gh-116738: Make `mmap.mmap.set_name()` thread-safe on the free threaded build.

- gh-145566: In the free threading build, skip the stop-the-world pause when reassigning `__class__` on a newly created object.

- gh-143055: Fix crash in AST unparser when unparsing dict comprehension unpacking. Found by OSS Fuzz in #489790200.

- gh-145335: Fix a crash in `os.pathconf()` when called with `-1` as the path argument.

- gh-145376: Fix reference leaks in various unusual error scenarios.

- gh-145234: Fixed a `SystemError` in the parser when an encoding cookie (for example, UTF-7) decodes to carriage returns (`\r`). Newlines are now normalized after decoding in the string tokenizer.

  Patch by Pablo Galindo.

- gh-145275: Added the `-X pathconfig_warnings` and `PYTHON_PATHCONFIG_WARNINGS` options, allowing to disable warnings from The initialization of the sys.path module search path.

- gh-145273: A warning is now shown during The initialization of the sys.path module search path if it can’t find a valid standard library.

- gh-145241: Specialized the parser error for when `with` items are followed by a trailing comma (for example, `with item,:`), raising a clearer `SyntaxError` message. Patch by Pablo Galindo and Bartosz Sławecki.

- gh-130555: Fix use-after-free in `dict.clear()` when the dictionary values are embedded in an object and a destructor causes re-entrant mutation of the dictionary.

- gh-145197: Fix JIT trace crash when recording function from cleared generator frame.

- gh-145187: Fix compiler assertion fail when a type parameter bound contains an invalid expression in a conditional block.

- gh-145142: Fix a crash in the free-threaded build when the dictionary argument to `str.maketrans()` is concurrently modified.

- gh-145118: `str.maketrans()` now accepts `frozendict`.

- gh-144015: Speed up `bytes.hex()`, `bytearray.hex()`, `binascii.hexlify()`, and `hashlib` `.hexdigest()` operations with SIMD on x86-64, ARM64, and ARM32 with NEON when built with gcc (version 12 or higher) or clang (version 3 or higher) compilers. Around 1.1-3x faster for common 16-64 byte inputs such as hashlib hex digests, and up to 8x faster for larger data.

- gh-145118: `type()` now accepts `frozendict` as an argument.

- gh-145064: Fix JIT optimizer assertion failure during `CALL_ALLOC_AND_ENTER_INIT` side exit.

- gh-145055: `exec()` and `eval()` now accept `frozendict` for *globals*. Patch by Victor Stinner.

- gh-145058: Fix a crash when `__lazy_import__()` is passed a non-string argument, by raising an `TypeError` instead.

- gh-144995: Optimize `memoryview` comparison: a `memoryview` is equal to itself, there is no need to compare values. Patch by Victor Stinner.

- gh-141510: Update specializer to support frozendict. Patch by Donghee Na.

- gh-141510: Optimize `frozendict.fromkeys()` to avoid unnecessary thread-safety operations in frozendict cases. Patch by Donghee Na.

- gh-100239: Speedup `BINARY_OP_EXTEND` for exact floats and medium-size integers by up to 15%. Patch by Chris Eibl.

- gh-144914: Use `mimalloc` for raw memory allocations such as via `PyMem_RawMalloc()` for better performance on free-threaded builds. Patch by Kumar Aditya.

- gh-144872: Fix heap buffer overflow in the parser found by OSS-Fuzz.

- gh-144766: Fix a crash in fork child process when perf support is enabled.

- gh-144759: Fix undefined behavior in the lexer when `start` and `multi_line_start` pointers are `NULL` in `_PyLexer_remember_fstring_buffers()` and `_PyLexer_restore_fstring_buffers()`. The `NULL` pointer arithmetic (`NULL - valid_pointer`) is now guarded with explicit `NULL` checks.

- gh-141510: Add built-in `frozendict` type. Patch by Victor Stinner.

- gh-144681: Fix a JIT assertion failure when a conditional branch jumps to the same target as the fallthrough path.

- gh-143300: Add `PyUnstable_SetImmortal()` C-API function to mark objects as immortal.

- gh-144702: Clarify the error message raised when a class pattern is used to match on a non-class object.

- gh-144569: Optimize `BINARY_SLICE` for list, tuple, and unicode by avoiding temporary `slice` object creation.

- gh-144438: Align the QSBR thread state array to a 64-byte cache line boundary to avoid false sharing in the free-threaded build.

- gh-142349: Implement **PEP 810**. Patch by Pablo Galindo and Dino Viehland.

- gh-141226: Deprecate **PEP 456** support for providing an external definition of the string hashing scheme. Removal is scheduled for Python 3.19. Patch by Bénédikt Tran.

- gh-138912: Improve `MATCH_CLASS` performance by up to 52% in certain cases. Patch by Marc Mueller.

- gh-130327: Fix erroneous clearing of an object’s `__dict__` if overwritten at runtime.

- gh-80667: Literals using the `\N{name}` escape syntax can now construct CJK ideographs and Hangul syllables using case-insensitive names.

<!-- anchor: id87 | type: section -->
### C API

- gh-142417: Restore private provisional `_Py_InitializeMain()` function removed in Python 3.14. Patch by Victor Stinner.

- gh-144748: `PyErr_CheckSignals()` now raises the exception scheduled by `PyThreadState_SetAsyncExc()`, if any.

- gh-144981: Made `PyUnstable_Code_SetExtra()`, `PyUnstable_Code_GetExtra()`, and `PyUnstable_Eval_RequestCodeExtraIndex()` thread-safe on the free threaded build.

- gh-141510: Add the following functions for the new `frozendict` type:

  - `PyAnyDict_Check()`

  - `PyAnyDict_CheckExact()`

  - `PyFrozenDict_Check()`

  - `PyFrozenDict_CheckExact()`

  - `PyFrozenDict_New()`

  Patch by Victor Stinner.

- gh-121617: `Python.h` now also includes `<string.h>` in the limited C API version 3.11 and newer to fix the `Py_CLEAR` macro which uses `memcpy()`. Patch by Victor Stinner.

- gh-144175: Add `PyArg_ParseArray()` and `PyArg_ParseArrayAndKeywords()` functions to parse arguments of functions using the `METH_FASTCALL` calling convention. Patch by Victor Stinner.

<!-- anchor: id88 | type: section -->
### Build

- gh-144533: Use wasmtime’s `--argv0` to auto-discover sysconfig in WASI builds

- gh-145110: Fix targets “Clean” and “CLeanAll” in case of PGO builds on Windows. Patch by Chris Eibl.

- gh-144679: When building with Visual Studio 2026 (Version 18), use PlatformToolSet v145 by default. Patch by Chris Eibl.

- gh-144675: Update to WASI SDK 30.

- gh-136677: Introduce executable specific linker flags to `./configure`.

<!-- anchor: python-3-15-0-alpha-6 | type: section -->
## Python 3.15.0 alpha 6

*Release date: 2026-02-11*

<!-- anchor: id89 | type: section -->
### macOS

- gh-144648: Allowed _remote_debugging to build on more OS versions by using proc_listpids() rather than proc_listallpids().

- gh-124111: Update macOS installer to use Tcl/Tk 9.0.3.

- gh-144551: Update macOS installer to use OpenSSL 3.5.5.

<!-- anchor: id90 | type: section -->
### Windows

- gh-80620: Support negative timestamps in `time.gmtime()`, `time.localtime()`, and various `datetime` functions.

<!-- anchor: id91 | type: section -->
### Tests

- gh-144415: The Android testbed now distinguishes between stdout/stderr messages which were triggered by a newline, and those triggered by a manual call to `flush`. This fixes logging of progress indicators and similar content.

- gh-65784: Add support for parametrized resource `wantobjects` in regrtests, which allows to run Tkinter tests with the specified value of `tkinter.wantobjects`, for example `-u wantobjects=0`.

<!-- anchor: id92 | type: section -->
### Security

- gh-144125: `BytesGenerator` will now refuse to serialize (write) headers that are unsafely folded or delimited; see `verify_generated_headers`. (Contributed by Bas Bloemsaat and Petr Viktorin in gh-121650).

- gh-143935: Fixed a bug in the folding of comments when flattening an email message using a modern email policy. Comments consisting of a very long sequence of non-foldable characters could trigger a forced line wrap that omitted the required leading space on the continuation line, causing the remainder of the comment to be interpreted as a new header field. This enabled header injection with carefully crafted inputs.

- gh-143925: Reject control characters in `data:` URL media types.

- gh-143923: Reject control characters in POP3 commands.

- gh-143921: Reject control characters in IMAP commands.

- gh-143919: Reject control characters in `http.cookies.Morsel` fields and values.

- gh-143916: Reject C0 control characters within wsgiref.headers.Headers fields, values, and parameters.

<!-- anchor: id93 | type: section -->
### Library

- gh-144538: Bump the version of pip bundled in ensurepip to version 26.0.1

- gh-144493: Improve an exception error message in `_overlapped.BindLocal()` that is raised when `asyncio.loop.sock_connect()` is called on a `asyncio.ProactorEventLoop` with a socket that has an invalid address family.

- gh-144386: Add support for arbitrary descriptors `__enter__()`, `__exit__()`, `__aenter__()`, and `__aexit__()` in `contextlib.ExitStack` and `contextlib.AsyncExitStack`, for consistency with the `with` and `async with` statements.

- gh-123471: Make concurrent iteration over `itertools.combinations_with_replacement` and `itertools.permutations` safe under free-threading.

- gh-74453: Deprecate `os.path.commonprefix()` in favor of `os.path.commonpath()` for path segment prefixes.

  The `os.path.commonprefix()` function is being deprecated due to having a misleading name and module. The function is not safe to use for path prefixes despite being included in a module about path manipulation, meaning it is easy to accidentally introduce path traversal vulnerabilities into Python programs by using this function.

- gh-144380: Improve performance of `io.BufferedReader` line iteration by ~49%.

- gh-144363: Update bundled libexpat to 2.7.4

- gh-140824: When `faulthandler` dumps the list of third-party extension modules, ignore sub-modules of stdlib packages. Patch by Victor Stinner.

- gh-144206: Improve error messages for buffer overflow in `fcntl.fcntl()` and `fcntl.ioctl()`.

- gh-144264: Speed up Base64 decoding of data containing ignored characters (both in non-strict mode and with an explicit *ignorechars* argument). It is now up to 2 times faster for multiline Base64 data.

- gh-144249: Add filename context to `OSError` exceptions raised by `ssl.SSLContext.load_cert_chain()`, allowing users to have more context.

- gh-132888: Fix incorrect use of `ctypes.GetLastError()` and add missing error checks for Windows API calls in `_pyrepl.windows_console`.

- gh-142956: Updated `tomllib` to parse TOML 1.1.0.

- gh-144217: `mimetypes`: Add support for DICOM files (for medical imaging) with the official MIME type `application/dicom`. Patch by Benedikt Johannes.

- gh-144212: Mime type `image/jxl` is now supported by `mimetypes`.

- gh-143594: Add `symtable.Function.get_cells()` and `symtable.Symbol.is_cell()` methods.

- gh-144169: Fix three crashes when non-string keyword arguments are supplied to objects in the `ast` module.

- gh-144128: Fix a crash in `array.array.fromlist()` when an element’s `__index__()` method mutates the input list during conversion.

- gh-144100: Fixed a crash in ctypes when using a deprecated `POINTER(str)` type in `argtypes`. Instead of aborting, ctypes now raises a proper Python exception when the pointer target type is unresolved.

- gh-143658: `importlib.metadata`: Use `str.lower()` and `str.replace()` to further improve performance of `importlib.metadata.Prepared.normalize()`. Patch by Hugo van Kemenade and Henry Schreiner.

- gh-144050: Fix `stat.filemode()` in the pure-Python implementation to avoid misclassifying invalid mode values as block devices.

- gh-83069: `subprocess.Popen.wait()`: when `timeout` is not `None`, an efficient event-driven mechanism now waits for process termination, if available. Linux >= 5.3 uses `os.pidfd_open()` + `select.poll()`. macOS and other BSD variants use `select.kqueue()` + `KQ_FILTER_PROC` + `KQ_NOTE_EXIT`. Windows keeps using `WaitForSingleObject` (unchanged). If none of these mechanisms are available, the function falls back to the traditional busy loop (non-blocking call and short sleeps). Patch by Giampaolo Rodola.

- gh-144030: The Python implementation of `functools.lru_cache()` differed from the default C implementation in that it did not check that its argument is callable. This discrepancy is now fixed and both raise a `TypeError`.

- gh-144001: Added the *ignorechars* parameter in `binascii.a2b_base64()` and `base64.b64decode()`.

- gh-144023: Fixed validation of file descriptor 0 in posix functions when used with follow_symlinks parameter.

- gh-143999: Fix an issue where `inspect.getgeneratorstate()` and `inspect.getcoroutinestate()` could fail for generators wrapped by `types.coroutine()` in the suspended state.

- gh-143952: Fixed `asyncio` debugging tools to work with new remote debugging API. Patch by Bartosz Sławecki.

- gh-143904: `struct.pack_into()` now raises OverflowError instead of IndexError for too large *offset* argument.

- gh-143897: Remove the `isxidstart()` and `isxidcontinue()` methods of `unicodedata.ucd_3_2_0`. They are now only exposed as `unicodedata.isxidstart()` and `unicodedata.isxidcontinue()`.

- gh-143831: `annotationlib.ForwardRef` objects are now hashable when created from annotation scopes with closures. Previously, hashing such objects would throw an exception. Patch by Bartosz Sławecki.

- gh-143874: Fixed a bug in `pdb` where expression results were not sent back to remote client.

- gh-143754: Add new `tkinter` widget methods `pack_content()`, `place_content()` and `grid_content()` which are alternative spelling of old `*_slaves()` methods.

- gh-143756: Fix potential thread safety issues in `ssl` module.

- gh-132604: Previously, `Protocol` classes that were not decorated with `@~typing.runtime_checkable`, but that inherited from another `Protocol` class that did have this decorator, could be used in `isinstance()` and `issubclass()` checks. This behavior is now deprecated and such checks will throw a `TypeError` in Python 3.20. Patch by Bartosz Sławecki.

- gh-143543: Fix a crash in itertools.groupby that could occur when a user-defined `__eq__()` method re-enters the iterator during key comparison.

- gh-143689: Fix `io.BufferedReader.read1()` state cleanup on buffer allocation failure.

- gh-143602: Fix a inconsistency issue in `write()` that leads to unexpected buffer overwrite by deduplicating the buffer exports.

- gh-142434: Use `ppoll()` if available in `select.poll()` to have a timeout resolution of 1 nanosecond, instead of a resolution of 1 ms. Patch by Victor Stinner.

- gh-140557: `array.array` buffers now have the same alignment when empty as when allocated. Unaligned buffers can still be created by slicing.

- gh-143423: Fix free-threaded build detection in the sampling profiler when Py_GIL_DISABLED is set to 0.

- gh-101178: Add Ascii85, Base85, and Z85 support to `binascii` and improve the performance of the base-85 converters in `base64`.

- gh-142966: Fix `ctypes.POINTER.set_type()` not updating the format string to match the type.

- gh-142555: `array`: fix a crash in `a[i] = v` when converting *i* to an index via `i.__index__` or `i.__float__` mutates the array.

- gh-142438: Fix _decimal builds configured with EXTRA_FUNCTIONALITY by correcting the Context.apply wrapper to pass the right argument.

- gh-141860: Add an `on_error` keyword-only parameter to `multiprocessing.set_forkserver_preload()` to control how import failures during module preloading are handled. Accepts `'ignore'` (default, silent), `'warn'` (emit `ImportWarning`), or `'fail'` (raise exception). Contributed by Nick Neumann and Gregory P. Smith.

- gh-125346: Accepting `+` and `/` characters with an alternative alphabet in `base64.b64decode()` and `base64.urlsafe_b64decode()` is now deprecated. In future Python versions they will be errors in the strict mode and discarded in the non-strict mode.

- gh-140715: Add `'%F'` support to `strptime()`.

- gh-67041: Add the *missing_as_none* parameter to `urlparse()`, `urlsplit()` and `urldefrag()` functions. Add the *keep_empty* parameter to `urlunparse()` and `urlunsplit()` functions. This allows to distinguish between empty and not defined URI components and preserve empty components.

- gh-77188: The `pickle` module now properly handles name-mangled private methods.

<!-- anchor: id95 | type: section -->
### IDLE

- gh-143774: Better explain the operation of Format / Format Paragraph.

<!-- anchor: id96 | type: section -->
### Core and Builtins

- gh-134584: Optimize and eliminate ref-counting in `_BINARY_OP_SUBSCR_LIST_SLICE`

- gh-144563: Fix interaction of the Tachyon profiler and `ctypes` and other modules that load the Python shared library (if present) in an independent map as this was causing the mechanism that loads the binary information to be confused. Patch by Pablo Galindo

- gh-144601: Fix crash when importing a module whose `PyInit` function raises an exception from a subinterpreter.

- gh-144549: Fix building the tail calling interpreter on Visual Studio 2026 with free-threading.

- gh-144513: Fix potential deadlock when using critical sections during stop-the-world pauses in the free-threaded build.

- gh-131798: Optimise `_GUARD_TOS_SLICE` in the JIT.

- gh-144330: Move `classmethod` and `staticmethod` initialization from `__init__()` to `__new__()`. Patch by Victor Stinner.

- gh-144446: Fix data races in the free-threaded build when reading frame object attributes while another thread is executing the frame.

- gh-120321: Add `gi_state`, `cr_state`, and `ag_state` attributes to generators, coroutines, and async generators that return the current state as a string (e.g., `GEN_RUNNING`). The `inspect` module functions `getgeneratorstate()`, `getcoroutinestate()`, and `getasyncgenstate()` now return these attributes directly.

- gh-141563: Fix thread safety of `PyDateTime_IMPORT`.

- gh-144280: Fix a bug in JIT where the predicate symbol had no truthiness

- gh-140550: In `PyModuleDef.m_slots`, allow slots that repeat information present in `PyModuleDef`.

- gh-139103: Improve scaling of `namedtuple()` instantiation in the free-threaded build.

- gh-144307: Prevent a reference leak in module teardown at interpreter finalization.

- gh-144319: Add huge pages support for the pymalloc allocator. Patch by Pablo Galindo

- gh-120321: Made `gi_yieldfrom` thread-safe in the free-threading build by using a lightweight lock on the frame state.

- gh-144194: Fix error handling in perf jitdump initialization on memory allocation failure.

- gh-143962: Name suggestion for not normalized name suggests now the normalized name or the closest name to the normalized name. If the suggested name is not ASCII, include also its ASCII representation.

- gh-144157: `bytes.translate()` now allows the compiler to unroll its loop more usefully for a 2x speedup in the common no-deletions specified case.

- gh-144068: Fix JIT tracer memory leak, ensure the JIT tracer state is freed when daemon threads are cleaned up during interpreter shutdown.

- gh-144012: Check if the result is `NULL` in `BINARY_OP_EXTENT` opcode.

- gh-144007: Eliminate redundant refcounting in the JIT for `BINARY_OP`.

- gh-144005: Eliminate redundant refcounting from `BINARY_OP_EXTEND`.

- gh-143939: Fix erroneous “cannot reuse already awaited coroutine” error that could occur when a generator was run during the process of clearing a coroutine’s frame.

- gh-141805: Fix crash in `set` when objects with the same hash are concurrently added to the set after removing an element with the same hash while the set still contains elements with the same hash.

- gh-143670: Fixes a crash in `ga_repr_items_list` function.

- gh-143650: Fix race condition in `importlib` where a thread could receive a stale module reference when another thread’s import fails.

- gh-143569: Generator expressions in 3.15 now conform to the documented behavior when the iterable does not support iteration. This matches the behavior in 3.14 and earlier

- gh-143192: Improve performance of bitwise operations on multi-digit ints.

- gh-132657: If we are specializing to `LOAD_GLOBAL_MODULE` or `LOAD_ATTR_MODULE`, try to enable deferred reference counting for the value, if the object is owned by a different thread. This applies to the free-threaded build only and should improve scaling of multi-threaded programs. Note that when deferred reference counting is enabled, the object will be deallocated by the GC, rather than by `Py_DECREF()`.

- gh-143055: Implement **PEP 798** (Unpacking in Comprehensions). Patch by Adam Hartz.

- gh-142037: Improve error messages for printf-style formatting. For errors in the format string, always include the position of the start of the format unit. For errors related to the formatted arguments, always include the number or the name of the argument. Raise more specific errors and include more information (type and number of arguments, most probable causes of error).

- gh-140557: `bytearray` buffers now have the same alignment when empty as when allocated. Unaligned buffers can still be created by slicing.

- gh-140232: Frozenset objects with immutable elements are no longer tracked by the garbage collector.

- gh-115231: Setup `__module__` attribute for built-in static methods. Patch by Sergey B Kirpichev.

<!-- anchor: id97 | type: section -->
### C API

- gh-143869: Added `PyLong_GetNativeLayout()`, `PyLongLayout`, `PyLongExport`, `PyLong_Export()`, `PyLong_FreeExport()`, `PyLongWriter`, `PyLongWriter_Create()`, `PyLongWriter_Finish()` and `PyLongWriter_Discard()` to the limited API.

- gh-141070: Renamed `PyUnstable_Object_Dump()` to `PyObject_Dump()`.

<!-- anchor: id98 | type: section -->
### Build

- gh-140421: Disable the perf trampoline on older macOS versions where it cannot be built.

- gh-144309: Build Python with POSIX 2024, instead of POSIX 2008. Patch by Victor Stinner.

- gh-144278: Enables defining the `_PY_IMPL_NAME` and `_PY_IMPL_CACHE_TAG` preprocessor definitions to override `sys.implementation` at build time. Definitions need to include quotes when setting to a string literal. Setting the cache tag to `NULL` has the effect of completely disabling automatic creation and use of `.pyc` files.

- gh-143960: Add support for OpenSSL 3.6, drop EOL 3.2. Patch by Hugo van Kemenade.

- gh-143941: Move WASI-related files to `Platforms/WASI`. Along the way, leave a deprecated `Tools/wasm/wasi/__main__.py` behind for backwards-compatibility.

- gh-143842: Prevent static builds from clashing with curses by making the optimizer COLORS table static.

<!-- anchor: python-3-15-0-alpha-5 | type: section -->
## Python 3.15.0 alpha 5

*Release date: 2026-01-14*

<!-- anchor: id99 | type: section -->
### Windows

- gh-143082: Fix `pdb` arrow key history not working when `stdin` is `sys.stdin`.

- gh-128067: Fix a bug in PyREPL on Windows where output without a trailing newline was overwritten by the next prompt.

<!-- anchor: id100 | type: section -->
### Tools/Demos

- gh-142095: Make gdb ‘py-bt’ command use frame from thread local state when available. Patch by Sam Gross and Victor Stinner.

<!-- anchor: id101 | type: section -->
### Tests

- gh-143460: Skip tests relying on infinite recusion if stack size is unlimited.

- gh-143553: Add support for parametrized resources, such as `-u xpickle=2.7`.

- bpo-31391: Forward-port test_xpickle from Python 2 to Python 3 and add the resource back to test’s command line.

<!-- anchor: id102 | type: section -->
### Library

- gh-143706: Fix `multiprocessing` forkserver so that `sys.argv` is correctly set before `__main__` is preloaded. Previously, `sys.argv` was empty during main module import in forkserver child processes. This fixes a regression introduced in 3.13.8 and 3.14.1. Root caused by Aaron Wieczorek, test provided by Thomas Watson, thanks!

- gh-143638: Forbid reentrant calls of the `pickle.Pickler` and `pickle.Unpickler` methods for the C implementation. Previously, this could cause crash or data corruption, now concurrent calls of methods of the same object raise `RuntimeError`.

- gh-143658: `importlib.metadata`: Use `str.translate()` to improve performance of `importlib.metadata.Prepared.normalize()`. Patch by Hugo van Kemenade and Henry Schreiner.

- gh-78724: Raise `RuntimeError`’s when user attempts to call methods on half-initialized `Struct` objects, For example, created by `Struct.__new__(Struct)`. Patch by Sergey B Kirpichev.

- gh-143196: Fix crash when the internal encoder object returned by undocumented function `json.encoder.c_make_encoder()` was called with non-zero second (*_current_indent_level*) argument.

- gh-143191: `_thread.stack_size()` now raises `ValueError` if the stack size is too small. Patch by Victor Stinner.

- gh-143547: Fix `sys.unraisablehook()` when the hook raises an exception and changes `sys.unraisablehook()`: hold a strong reference to the old hook. Patch by Victor Stinner.

- gh-139686: Revert 0a97941245f1dda6d838f9aaf0512104e5253929 and 57db12514ac686f0a752ec8fe1c08b6daa0c6219 which made importlib.reload a no-op for lazy modules; caused Buildbot failures.

- gh-143517: `annotationlib.get_annotations()` no longer raises a `SyntaxError` when evaluating a stringified starred annotation that starts with one or more whitespace characters followed by a `*`. Patch by Bartosz Sławecki.

- gh-143474: Add `os.RWF_ATOMIC` constant for Linux 6.11+.

- gh-143445: Speed up `copy.deepcopy()` by 1.04x.

- gh-143378: Fix use-after-free crashes when a `BytesIO` object is concurrently mutated during `write()` or `writelines()`.

- gh-143368: Fix endless retry loop in `profiling.sampling` blocking mode when threads cannot be seized due to `EPERM`. Such threads are now skipped instead of causing repeated error messages. Patch by Pablo Galindo.

- gh-143346: Fix incorrect wrapping of the Base64 data in `plistlib._PlistWriter` when the indent contains a mix of tabs and spaces.

- gh-140025: `queue`: Fix `SimpleQueue.__sizeof__()` computation.

- gh-143310: `tkinter`: fix a crash when a Python `list` is mutated during the conversion to a Tcl object (e.g., when setting a Tcl variable). Patch by Bénédikt Tran.

- gh-143309: Fix a crash in `os.execve()` on non-Windows platforms when given a custom environment mapping which is then mutated during parsing. Patch by Bénédikt Tran.

- gh-143308: `pickle`: fix use-after-free crashes when a `PickleBuffer` is concurrently mutated by a custom buffer callback during pickling. Patch by Bénédikt Tran and Aaron Wieczorek.

- gh-142939: Performance optimisations for `difflib.get_close_matches()`

- gh-124951: The base64 implementation behind the `binascii`, `base64`, and related codec has been optimized for modern pipelined CPU architectures and now performs 2-3x faster across all platforms.

- gh-143237: Fix support of named pipes in the rotating `logging` handlers.

- gh-143249: Fix possible buffer leaks in Windows overlapped I/O on error handling.

- gh-143241: `zoneinfo`: fix infinite loop in `ZoneInfo.from_file` when parsing a malformed TZif file. Patch by Fatih Celik.

- gh-142830: `sqlite3`: fix use-after-free crashes when the connection’s callbacks are mutated during a callback execution. Patch by Bénédikt Tran.

- gh-143200: `xml.etree.ElementTree`: fix use-after-free crashes in `__getitem__()` and `__setitem__()` methods of `Element` when the element is concurrently mutated. Patch by Bénédikt Tran.

- gh-143214: Add the *wrapcol* parameter in `binascii.b2a_base64()` and `base64.b64encode()`.

- gh-142195: Updated timeout evaluation logic in `subprocess` to be compatible with deterministic environments like Shadow where time moves exactly as requested.

- gh-140739: Fix several crashes due to reading invalid memory in the new Tachyon sampling profiler. Patch by Pablo Galindo.

- gh-142164: Fix the ctypes bitfield overflow error message to report the correct offset and size calculation.

- gh-143145: Fixed a possible reference leak in ctypes when constructing results with multiple output parameters on error.

- gh-143103: Add padding support to `base64.z85encode()` via the `pad` parameter.

- gh-130796: Undeprecate the `locale.getdefaultlocale()` function. Patch by Victor Stinner.

- gh-74902: Add the `iter_graphemes()` function in the `unicodedata` module to iterate over grapheme clusters according to rules defined in Unicode Standard Annex #29, “Unicode Text Segmentation”. Add `grapheme_cluster_break()`, `indic_conjunct_break()` and `extended_pictographic()` functions to get the properties of the character which are related to the above algorithm.

- gh-143004: Fix a potential use-after-free in `collections.Counter.update()` when user code mutates the Counter during an update.

- gh-140648: The `asyncio` REPL now respects the `-I` flag (isolated mode). Previously, it would load and execute `PYTHONSTARTUP` even if the flag was set. Contributed by Bartosz Sławecki.

- gh-142991: Fixed socket operations such as recvfrom() and sendto() for FreeBSD divert(4) socket.

- gh-116738: Make the attributes in `lzma` thread-safe on the free threaded build.

- gh-142950: Fix regression in `argparse` where format specifiers in help strings raised `ValueError`.

- gh-142881: Fix concurrent and reentrant call of `atexit.unregister()`.

- gh-142615: Fix possible crashes when initializing `asyncio.Task` or `asyncio.Future` multiple times. These classes can now be initialized only once and any subsequent initialization attempt will raise a RuntimeError. Patch by Kumar Aditya.

- gh-142517: The non-`compat32` `email` policies now correctly handle refolding encoded words that contain bytes that can not be decoded in their specified character set. Previously this resulted in an encoding exception during folding.

- gh-138122: The Tachyon profiler’s live TUI now integrates with the experimental `_colorize` theming system. Users can customize colors via `_colorize.set_theme()` (experimental API, subject to change). A `LiveProfilerLight` theme is provided for light terminal backgrounds. Patch by Pablo Galindo.

- gh-142306: Improve errors for `Element.remove`.

- gh-63016: Add a `flags` parameter to `mmap.mmap.flush()` to control synchronization behavior.

- gh-139262: Some keystrokes can be swallowed in the new `PyREPL` on Windows, especially when used together with the ALT key. Fix by Chris Eibl.

- gh-138897: Improved `license`/`copyright`/`credits` display in the REPL: now uses a pager.

- gh-135852: Add `_winapi.RegisterEventSource()`, `_winapi.DeregisterEventSource()` and `_winapi.ReportEvent()`. Using these functions in `NTEventLogHandler` to replace `pywin32`.

- gh-109263: Starting a process from spawn context in `multiprocessing` no longer sets the start method globally.

- gh-132715: Skip writing objects during marshalling once a failure has occurred.

<!-- anchor: id103 | type: section -->
### Documentation

- gh-140806: Add documentation for `enum.bin()`.

<!-- anchor: id104 | type: section -->
### Core and Builtins

- gh-134584: Eliminate redundant refcounting from `_CONTAINS_OP`, `_CONTAINS_OP_SET` and `_CONTAINS_OP_DICT`.

- gh-143604: Fix a reference counting issue in the JIT tracer where the current executor could be prematurely freed during tracing.

- gh-143469: Enable `LOAD_ATTR_MODULE` specialization even if `__getattr__()` is defined in module.

- gh-134584: Eliminate redundant refcounting from `TO_BOOL_STR`.

- gh-143377: Fix a crash in `_interpreters.capture_exception()` when the exception is incorrectly formatted. Patch by Bénédikt Tran.

- gh-139757: Add `BINARY_OP_SUBSCR_USTR_INT` to specialize reading an ASCII character from any string. Patch by Chris Eibl.

- gh-141504: Factor out tracing and optimization heuristics into a single object. Patch by Donghee Na.

- gh-142982: Specialize `CALL_FUNCTION_EX` for Python and non-Python callables.

- gh-136924: The interactive help mode in the REPL no longer incorrectly syntax highlights text input as Python code. Contributed by Olga Matoula.

- gh-139757: Fix unintended bytecode specialization for non-ascii string. Patch by Donghee Na, Ken Jin and Chris Eibl.

- gh-143361: Add `PY_VECTORCALL_ARGUMENTS_OFFSET` to `_Py_CallBuiltinClass_StackRefSteal` to avoid redundant allocations

- gh-131798: The JIT optimizer now understands more generator instructions.

- gh-134584: Eliminate redundant refcounting from `_LOAD_ATTR_SLOT`.

- gh-143189: Fix crash when inserting a non-`str` key into a split table dictionary when the key matches an existing key in the split table but has no corresponding value in the dict.

- gh-143228: Fix use-after-free in perf trampoline when toggling profiling while threads are running or during interpreter finalization with daemon threads active. The fix uses reference counting to ensure trampolines are not freed while any code object could still reference them. Pach by Pablo Galindo

- gh-142664: Fix a use-after-free crash in `memoryview.__hash__` when the `__hash__` method of the referenced object mutates that object or the view. Patch by Bénédikt Tran.

- gh-142557: Fix a use-after-free crash in bytearray.__mod__ when the `bytearray` is mutated while formatting the `%`-style arguments. Patch by Bénédikt Tran.

- gh-143195: Fix use-after-free crashes in `bytearray.hex()` and `memoryview.hex()` when the separator’s `__len__()` mutates the original object. Patch by Bénédikt Tran.

- gh-143183: Fix a bug in the JIT when dealing with unsupported control-flow or operations.

- gh-142975: Fix crash after unfreezing all objects tracked by the garbage collector on the free threaded build.

- gh-143135: Set `sys.flags.inspect` to `1` when `PYTHONINSPECT` is `0`. Previously, it was set to `0` in this case.

- gh-143123: Protect the JIT against recursive tracing.

- gh-143092: Fix a crash in the JIT when dealing with `list.append(x)` style code.

- gh-143003: Fix an overflow of the shared empty buffer in `bytearray.extend()` when `__length_hint__()` returns 0 for non-empty iterator.

- gh-143006: Fix a possible assertion error when comparing negative non-integer `float` and `int` with the same number of bits in the integer part.

- gh-116738: Fix thread safety of `contextvars.Context.run()`.

- gh-142829: Fix a use-after-free crash in `contextvars.Context` comparison when a custom `__eq__` method modifies the context via `set()`.

- gh-142863: Generate optimized bytecode when calling `list` or `set` with generator expression.

- gh-41779: Allowed defining any __slots__ for a class derived from `tuple` (including classes created by `collections.namedtuple()`).

- gh-69605: Fix edge-cases around already imported modules in the REPL auto-completion of imports.

- gh-138568: Adjusted the built-in `help()` function so that empty inputs are ignored in interactive mode.

- gh-131798: Remove bounds check when indexing into tuples with a constant index.

- gh-134584: Eliminate redundant refcounting from `_CALL_TYPE_1`. Patch by Tomas Roun

- gh-132108: Speed up `int.from_bytes()` when passed object supports buffer protocol, like `bytearray` by ~1.2x.

- gh-128334: Make the `slice` class subscriptable at runtime to be consistent with typing implementation.

<!-- anchor: id105 | type: section -->
### C API

- gh-141671: `PyMODINIT_FUNC` (and the new `PyMODEXPORT_FUNC`) now adds a linkage declaration (`__declspec(dllexport)`) on Windows.

<!-- anchor: python-3-15-0-alpha-4 | type: section -->
## Python 3.15.0 alpha 4

*Release date: 2026-01-13*

<!-- anchor: id106 | type: section -->
### Tests

- gh-142836: Accommodated Solaris in `test_pdb.test_script_target_anonymous_pipe`.

<!-- anchor: id107 | type: section -->
### Library

- gh-122431: Corrected the error message in `readline.append_history_file()` to state that `nelements` must be non-negative instead of positive.

- gh-143046: The `asyncio` REPL no longer prints copyright and version messages in the quiet mode (`-q`). Patch by Bartosz Sławecki.

- gh-80744: Fix issue where `pdb` would read a `.pdbrc` twice if launched from the home directory

- gh-138122: Add blocking mode to Tachyon for accurate stack traces in applications with many generators or fast-changing call stacks. Patch by Pablo Galindo.

- gh-143010: Fixed a bug in `mailbox` where the precise timing of an external event could result in the library opening an existing file instead of a file it expected to create.

- gh-112127: Fix possible use-after-free in `atexit.unregister()` when the callback is unregistered during comparison.

- gh-138122: Fix incomplete stack traces in the Tachyon profiler’s frame cache when profiling code with deeply nested generators. The frame cache now validates that stack traces reach the base frame before caching, preventing broken flamegraphs. Patch by Pablo Galindo.

- gh-142834: Change the `pdb` `commands` command to use the last available breakpoint instead of failing when the most recently created breakpoint was deleted.

- gh-142783: Fix zoneinfo use-after-free with descriptor _weak_cache. a descriptor as _weak_cache could cause crashes during object creation. The fix ensures proper reference counting for descriptor-provided objects.

- gh-76007: Deprecate `VERSION` from `xml.etree.ElementTree` and `version` from `xml.sax.expatreader` and `xml.sax.handler`. Patch by Hugo van Kemenade.

- gh-142784: The `asyncio` REPL now properly closes the loop upon the end of interactive session. Previously, it could cause surprising warnings. Contributed by Bartosz Sławecki.

- gh-138122: Add binary output format to `profiling.sampling` for compact storage of profiling data. The new `--binary` option captures samples to a file that can be converted to other formats using the `replay` command. Patch by Pablo Galindo

- gh-142495: `collections.defaultdict` now prioritizes `__setitem__()` when inserting default values from `default_factory`. This prevents race conditions where a default value would overwrite a value set before `default_factory` returns.

- gh-142654: Show the clearer error message when using `profiling.sampling` on an unknown PID.

- gh-142560: Fix use-after-free in `bytearray` search-like methods (`find()`, `count()`, `index()`, `rindex()`, and `rfind()`) by marking the storage as exported which causes reallocation attempts to raise `BufferError`. For `contains()`, `split()`, and `rsplit()` the buffer protocol is used for this.

- gh-142419: `mmap.mmap.set_name()` method added to annotate an anonymous memory map if Linux kernel supports `PR_SET_VMA_ANON_NAME` (Linux 5.17 or newer). Patch by Donghee Na.

- gh-139971: `pydoc`: Ensure that the link to the online documentation of a stdlib module is correct.

- gh-124098: Fix issue where methods in handlers that lacked the protocol name but matched a valid base handler method (e.g., `_open()` or `error()`) were incorrectly added to `urllib.request.OpenerDirector`’s handlers. Contributed by Andrea Mattei.

- gh-136282: Add support for `UNNAMED_SECTION` when creating a section via the mapping protocol access

<!-- anchor: id108 | type: section -->
### Core and Builtins

- gh-143057: Avoid locking in `PyTraceMalloc_Track()` and `PyTraceMalloc_Untrack()` when `tracemalloc` is not enabled.

- gh-139109: Add missing terminator in certain cases when tracing in the new JIT compiler.

- gh-142961: Fix a segfault in the JIT when constant folding `len(tuple)`.

- gh-142776: Fix a file descriptor leak in import.c

- gh-139757: Fix building JIT stencils on free-threaded builds.

- gh-129068: Make concurrent iteration over the same range iterator thread-safe in the free threading build.

- gh-142543: Fix a stack overflow on Clang JIT build configurations with full LTO.

- gh-142448: Fix a bug when using monitoring with the JIT.

- gh-142766: Clear the frame of a generator when `generator.close()` is called.

- gh-134584: Eliminate redundant refcounting from `_LOAD_ATTR_INSTANCE_VALUE`.

- gh-134584: Eliminate redundant refcounting from `_STORE_ATTR_WITH_HINT`.

- gh-142476: Fix a memory leak in the experimental Tier 2 optimizer when creating executors. Patched by Shamil Abdulaev.

- gh-100964: Fix reference cycle in exhausted generator frames. Patch by Savannah Ostrowski.

- gh-139922: Allow building CPython with the tail calling interpreter on Visual Studio 2026 MSVC. This provides a performance gain over the prior interpreter for MSVC. Patch by Ken Jin, Brandt Bucher, and Chris Eibl. With help from the MSVC team including Hulon Jenkins.

<!-- anchor: python-3-15-0-alpha-3 | type: section -->
## Python 3.15.0 alpha 3

*Release date: 2025-12-16*

<!-- anchor: id109 | type: section -->
### Tools/Demos

- gh-141692: Each slice of an iOS XCframework now contains a `lib` folder that contains a symlink to the libpython dylib. This allows binary modules to be compiled for iOS using dynamic libreary linking, rather than Framework linking.

<!-- anchor: id110 | type: section -->
### Tests

- gh-140381: Fix flaky test_profiling tests on i686 and s390x architectures by increasing slow_fibonacci call frequency from every 5th iteration to every 2nd iteration.

- gh-140210: Make `test_sysconfig.test_parse_makefile_renamed_vars` less fragile by clearing the environment variables before parsing the Makefile.

<!-- anchor: id111 | type: section -->
### Security

- gh-142145: Remove quadratic behavior in `xml.minidom` node ID cache clearing.

- gh-42400: Fix buffer overflow in `_Py_wrealpath()` for paths exceeding `MAXPATHLEN` bytes by using dynamic memory allocation instead of fixed-size buffer. Patch by Shamil Abdulaev.

- gh-119451: Fix a potential memory denial of service in the `http.client` module. When connecting to a malicious server, it could cause an arbitrary amount of memory to be allocated. This could have led to symptoms including a `MemoryError`, swapping, out of memory (OOM) killed processes or containers, or even system crashes.

- gh-119342: Fix a potential memory denial of service in the `plistlib` module. When reading a Plist file received from untrusted source, it could cause an arbitrary amount of memory to be allocated. This could have led to symptoms including a `MemoryError`, swapping, out of memory (OOM) killed processes or containers, or even system crashes.

<!-- anchor: id112 | type: section -->
### Library

- gh-142754: Add the *ownerDocument* attribute to `xml.dom.minidom` elements and attributes created by directly instantiating the `Element` or `Attr` class. Note that this way of creating nodes is not supported; creator functions like `xml.dom.Document.documentElement()` should be used instead.

- gh-142594: Fix crash in `TextIOWrapper.close()` when the underlying buffer’s `closed` property calls `detach()`.

- gh-76007: Deprecate `__version__` from `ctypes`. Patch by Hugo van Kemenade.

- gh-76007: Deprecate `__version__` from `wsgiref.simple_server`. Patch by Hugo van Kemenade.

- gh-142651: `unittest.mock`: fix a thread safety issue where `Mock.call_count` may return inaccurate values when the mock is called concurrently from multiple threads.

- gh-76007: Deprecate `__version__` from `http.server`. Patch by Hugo van Kemenade.

- gh-138122: Add `--subprocesses` flag to `profiling.sampling` CLI to automatically profile subprocesses spawned by the target. When enabled, the profiler monitors for new Python subprocesses and profiles each one separately, writing results to individual output files. This is useful for profiling applications that use `multiprocessing`, `ProcessPoolExecutor`, or other subprocess-based parallelism. Patch by Pablo Galindo.

- gh-142595: Added type check during initialization of the `decimal` module to prevent a crash in case of broken stdlib. Patch by Sergey B Kirpichev.

- gh-142556: Fix crash when a task gets re-registered during finalization in `asyncio`. Patch by Kumar Aditya.

- gh-138122: Add `--mode=exception` to the sampling profiler to capture samples only from threads with an active exception, useful for analyzing exception handling overhead. Patch by Pablo Galindo.

- gh-142539: `traceback`: Fix location of carets in `SyntaxError`s when the source contains wide characters.

- gh-123241: Avoid reference count operations in garbage collection of `ctypes` objects.

- gh-142451: `hmac`: correctly copy `HMAC` attributes for objects copied through `HMAC.copy()`. Patch by Bénédikt Tran.

- gh-138122: The `profiling.sampling` flamegraph profiler now supports inverted flamegraph view that aggregates all leaf nodes. In a standard flamegraph, if a hot function is called from multiple locations, it appears multiple times as separate leaf nodes. In the inverted flamegraph, all occurrences of the same leaf function are merged into a single aggregated node at the root, showing the total hotness of that function in one place. The children of each aggregated node represent its callers, making it easier to identify which functions consume the most CPU time and where they are called from.

- gh-112527: The help text for required options in `argparse` no longer extended with “ (default: None)”.

- gh-142438: Fixed a possible leaked GIL in _PySSL_keylog_callback.

- gh-138122: Add bytecode-level instruction profiling to the sampling profiler via the new `--opcodes` flag. When enabled, the profiler captures which bytecode opcode is executing at each sample, including Python 3.11+ adaptive specializations, and visualizes this data in the heatmap, flamegraph, gecko, and live output formats. Patch by Pablo Galindo

- gh-142389: Add backtick markup support in `argparse` description and epilog text to highlight inline code when color output is enabled.

- gh-142346: Fix usage formatting for mutually exclusive groups in `argparse` when they are preceded by positional arguments or followed or intermixed with other optional arguments.

- gh-142374: Fix cumulative percentage calculation for recursive functions in the new sampling profiler. When profiling recursive functions, cumulative statistics (cumul%, cumtime) could exceed 100% because each recursive frame in a stack was counted separately. For example, a function recursing 500 times in every sample would show 50000% cumulative presence. The fix deduplicates locations within each sample so cumulative stats correctly represent “percentage of samples where this function was on the stack”. Patch by Pablo Galindo.

- gh-142315: Pdb can now run scripts from anonymous pipes used in process substitution. Patch by Bartosz Sławecki.

- gh-64532: Subparser help now includes required optional arguments from the parent parser in the usage, making it clearer what arguments are needed to run a subcommand. Patch by Savannah Ostrowski.

- gh-142207: Fix: profiling.sampling may cause assertion `!(has_gil && gil_requested)`

- gh-142332: Fix usage formatting for positional arguments in mutually exclusive groups in `argparse`. in `argparse`.

- gh-142282: Fix `winreg.QueryValueEx()` to not accidentally read garbage buffer under race condition.

- gh-142318: Fix typing `'q'` at the help of the interactive tachyon profiler exiting the profiler.

- gh-75949: Fix `argparse` to preserve `|` separators in mutually exclusive groups when the usage line wraps due to length.

- gh-142267: Improve `argparse` performance by caching the formatter used for argument validation.

- gh-139862: Remove `color` parameter from `argparse.HelpFormatter` constructor. Color is controlled by `ArgumentParser`.

- gh-68552: `MisplacedEnvelopeHeaderDefect` and `Missing header name` defects are now correctly passed to the `handle_defect` method of `policy` in `FeedParser`.

- gh-142206: The resource tracker in the `multiprocessing` module can now understand messages from older versions of itself. This avoids issues with upgrading Python while it is running. (Note that such ‘in-place’ upgrades are not tested.)

- gh-142214: Fix two regressions in `dataclasses` in Python 3.14.1 related to annotations.

  - An exception is no longer raised if `slots=True` is used and the `__init__` method does not have an `__annotate__` attribute (likely because `init=False` was used).

  - An exception is no longer raised if annotations are requested on the `__init__` method and one of the fields is not present in the class annotations. This can occur in certain dynamic scenarios.

  Patch by Jelle Zijlstra.

- gh-142203: Remove the *debug_override* parameter from `importlib.util.cache_from_source()` which has been deprecated since Python 3.5.

- gh-138122: The `_remote_debugging` module now implements frame caching in the `RemoteUnwinder` class to reduce memory reads when profiling remote processes. When `cache_frames=True`, unchanged portions of the call stack are reused from previous samples, significantly improving profiling performance for deep call stacks.

- gh-116738: Fix `cmath` data race when initializing trigonometric tables with subinterpreters.

- gh-141982: Allow `pdb` to set breakpoints on async functions with function names.

- gh-74389: When the stdin being used by a `subprocess.Popen` instance is closed, this is now ignored in `subprocess.Popen.communicate()` instead of leaving the class in an inconsistent state.

- gh-87512: Fix `subprocess.Popen.communicate()` timeout handling on Windows when writing large input. Previously, the timeout was ignored during stdin writing, causing the method to block indefinitely if the child process did not consume input quickly. The stdin write is now performed in a background thread, allowing the timeout to be properly enforced.

- gh-141939: Add color to all interpolated values in `argparse` help, like `%(default)s` or `%(choices)s`. Patch by Alex Prengère.

- gh-141473: When `subprocess.Popen.communicate()` was called with *input* and a *timeout* and is called for a second time after a `TimeoutExpired` exception before the process has died, it should no longer hang.

- gh-141999: Correctly allow `KeyboardInterrupt` to stop the process when using `profiling.sampling`.

- gh-142006: Fix a bug in the `email.policy.default` folding algorithm which incorrectly resulted in a doubled newline when a line ending at exactly max_line_length was followed by an unfoldable token.

- gh-141968: Remove data copy from `re` compilation of regexes with large charsets by using `bytearray.take_bytes()`.

- gh-141968: Remove data copy from `encodings.idna` `encode()` and `encode()` by using `bytearray.take_bytes()`.

- gh-141968: Remove data copy from `codecs` `punycode` encoding by using `bytearray.take_bytes()`.

- gh-141968: Remove data copy from `wave.Wave_read.readframes()` and `wave.Wave_write.writeframes()` by using `bytearray.take_bytes()`.

- gh-141968: Remove a data copy from `base64.b32decode()` and `base64.b32encode()` by using `bytearray.take_bytes()`.

- gh-59000: Fix `pdb` breakpoint resolution for class methods when the module defining the class is not imported.

- gh-116738: Fix thread safety issue with `re` scanner objects in free-threaded builds.

- gh-138122: The `profiling.sampling` flamegraph profiler now displays thread status statistics showing the percentage of time threads spend holding the GIL, running without the GIL, waiting for the GIL, and performing garbage collection. These statistics help identify GIL contention and thread behavior patterns. When filtering by thread, the display shows per-thread metrics.

- gh-141781: Fixed an issue where pdb.line_prefix assignment was ignored if assigned after the module was imported.

- gh-141863: Update Streams to use `bytearray.take_bytes()` for a over 10% performance improvement on pyperformance asyncio_tcp benchmark.

- gh-141817: Add `socket.IPV6_HDRINCL` constant.

- gh-105836: Fix `asyncio.run_coroutine_threadsafe()` leaving underlying cancelled asyncio task running.

- gh-141570: Support file-like object raising `OSError` from `fileno()` in color detection (`_colorize.can_colorize()`). This can occur when `sys.stdout` is redirected.

- gh-141679: Add colour to defaults in `argparse` help. Patch by Hugo van Kemenade.

- gh-141686: Break reference cycles created by each call to `json.dump()` or `json.JSONEncoder.iterencode()`.

- gh-141659: Fix bad file descriptor errors from `_posixsubprocess` on AIX.

- gh-141645: Add a new `--live` mode to the tachyon profiler in `profiling.sampling` module. This mode consist of a live TUI that displays real-time profiling statistics as the target application runs, similar to `top`. Patch by Pablo Galindo

- gh-141615: Check `stdin` instead of `stdout` for `use_rawinput` in `pdb`.

- gh-69113: Fix `doctest` to correctly report line numbers for doctests in `__test__` dictionary when formatted as triple-quoted strings by finding unique lines in the string and matching them in the source file.

- gh-141600: Fix musl version detection on Void Linux.

- gh-48752: Add `readline.get_pre_input_hook()` function to retrieve the current pre-input hook. This allows applications to save and restore the hook without overwriting user settings. Patch by Sanyam Khurana.

- gh-141565: Add async-aware profiling to the Tachyon sampling profiler. The profiler now reconstructs and displays async task hierarchies in flamegraphs, making the output more actionable for users. Patch by Savannah Ostrowski and Pablo Galindo Salgado.

- gh-60107: Remove a copy from `io.RawIOBase.read()`. If the underlying I/O class keeps a reference to the mutable memory, raise a `BufferError`.

- gh-116738: Make csv module thread-safe on the free threaded build.

- gh-140911: `collections`: Ensure that the methods `UserString.rindex()` and `UserString.index()` accept `collections.UserString` instances as the sub argument.

- gh-140875: Fix handling of unclosed character references (named and numerical) followed by the end of file in `html.parser.HTMLParser` with `convert_charrefs=False`.

- gh-140677: Add heatmap visualization mode to the Tachyon sampling profiler. The new `--heatmap` output format provides a line-by-line view showing execution intensity with color-coded samples, inline statistics, and interactive call graph navigation between callers and callees.

- gh-139946: Distinguish stdout and stderr when colorizing output in argparse module.

- gh-76007: `pydoc`: Fix `DeprecationWarning` being raised when generating doc for stdlib modules.

- gh-138697: Fix inferring *dest* from a single-dash long option in `argparse`. If a short option and a single-dash long option are passed to `add_argument()`, *dest* is now inferred from the single-dash long option.

- gh-138525: Add support for single-dash long options and alternate prefix characters in `argparse.BooleanOptionalAction`.

- gh-79986: Add parsing for `References` and `In-Reply-To` headers to the `email` library that parses the header content as lists of message id tokens. This prevents them from being folded incorrectly.

- gh-135559: Flag: a `dir()` on a `Flag` enumeration now shows non-canonical members. (i.e. aliases).

- gh-134453: Fixed `subprocess.Popen.communicate()` `input=` handling of `memoryview` instances that were non-byte shaped on POSIX platforms. Those are now properly cast to a byte shaped view instead of truncating the input. Windows platforms did not have this bug.

- gh-127930: Add `__all__` to `tkinter.simpledialog`.

- gh-115952: Fix a potential memory denial of service in the `pickle` module. When reading a pickled data received from untrusted source, it could cause an arbitrary amount of memory to be allocated, even if the code that is allowed to execute is restricted by overriding the `find_class()` method. This could have led to symptoms including a `MemoryError`, swapping, out of memory (OOM) killed processes or containers, or even system crashes.

- bpo-40350: Fix support for namespace packages in `modulefinder`.

<!-- anchor: id113 | type: section -->
### Documentation

- gh-141994: `xml.sax.handler`: Make Documentation of `xml.sax.handler.feature_external_ges` warn of opening up to external entity attacks. Patch by Sebastian Pipping.

<!-- anchor: id114 | type: section -->
### Core and Builtins

- gh-134584: Eliminate redundant refcounting from `_STORE_ATTR_INSTANCE_VALUE`.

- gh-142718: JIT: Fix segfault caused by not flushing the stack to memory at side exits.

- gh-142737: Tracebacks will be displayed in fallback mode even if `io.open()` is lost. Previously, this would crash the interpreter. Patch by Bartosz Sławecki.

- gh-116738: Make the attributes in `bz2` thread-safe on the free threaded build.

- gh-134584: Eliminate redundant refcounting from `_CALL_LIST_APPEND`.

- gh-142554: Fix a crash in `divmod()` when `_pylong.int_divmod()` does not return a tuple of length two exactly. Patch by Bénédikt Tran.

- gh-142531: Fix a free-threaded GC performance regression. If there are many untracked tuples, the GC will run too often, resulting in poor performance. The fix is to include untracked tuples in the “long lived” object count. The number of frozen objects is also now included since the free-threaded GC must scan those too.

- gh-142402: Fix reference counting when adjacent literal parts are merged while constructing `string.templatelib.Template`, preventing the displaced string object from leaking.

- gh-116738: Make the attributes in `zlib` thread-safe on the free threaded build.

- gh-142343: Fix SIGILL crash on m68k due to incorrect assembly constraint.

- gh-142236: Improve the “Perhaps you forgot a comma?” syntax error for multi-line string concatenations to point to the last string instead of the first, making it easier to locate where the comma is missing. Patch by Pablo Galindo.

- gh-142236: Fix incorrect keyword suggestions for syntax errors in `traceback`. The keyword typo suggestion mechanism would incorrectly suggest replacements when the extracted source code was incomplete rather than containing an actual typo. Patch by Pablo Galindo.

- gh-142305: Decrease the size of the generated stencils and the runtime JIT code. Patch by Diego Russo.

- gh-135379: Implement a limited form of register allocation known as “top of stack caching” in the JIT. It works by keeping 0-3 of the top items in the stack in registers. The code generator generates multiple versions of those uops that do not escape and are relatively small. During JIT compilation, the copy that produces the least memory traffic is selected, spilling or reloading values when needed.

- gh-142276: Fix missing type watcher when promoting attribute loads to constants in the JIT. Patch by Ken Jin. Reproducer by Yuancheng Jiang.

- gh-142218: Fix crash when inserting into a split table dictionary with a non `str` key that matches an existing key.

- gh-141976: Check against abstract stack overflow in the JIT optimizer.

- gh-97850: Remove all `*.load_module()` usage and definitions from the import system and importlib. The method has been deprecated in favor of `importlib.abc.Loader.exec_module()` since Python 3.4.

- gh-142048: Fix quadratically increasing garbage collection delays in free-threaded build.

- gh-65961: Stop setting `__cached__` on modules.

- gh-141770: Annotate anonymous mmap usage only when supported by the Linux kernel and if `-X dev` is used or Python is built in debug mode. Patch by Donghee Na.

- gh-142029: Raise `ModuleNotFoundError` instead of crashing when a nonexistent module is used as a name in `_imp.create_builtin()`.

- gh-142029: Raise `ValueError` instead of crashing when empty string is used as a name in `_imp.create_builtin()`.

- gh-141976: Protect against specialization failures in the tracing JIT compiler for performance reasons.

- gh-141861: Fix invalid memory read in the `ENTER_EXECUTOR` instruction.

- gh-141930: When importing a module, use Python’s regular file object to ensure that writes to `.pyc` files are complete or an appropriate error is raised.

- gh-138122: Add incomplete sample detection to prevent corrupted profiling data. Each thread state now contains an embedded base frame (sentinel at the bottom of the frame stack) with owner type `FRAME_OWNED_BY_INTERPRETER`. The profiler validates that stack unwinding terminates at this sentinel frame. Samples that fail to reach the base frame (due to race conditions, memory corruption, or other errors) are now rejected rather than being included as spurious data.

- gh-120158: Fix inconsistent state when enabling or disabling monitoring events too many times.

- gh-140638: Expose a `"candidates"` stat in `gc.get_stats()` and `gc.callbacks`.

- gh-141780: Fix `Py_mod_gil` with API added in **PEP 793**: `PyModule_FromSlotsAndSpec()` and `PyModExport` hooks

- gh-141732: Ensure the `__repr__()` for `ExceptionGroup` and `BaseExceptionGroup` does not change when the exception sequence that was original passed in to its constructor is subsequently mutated.

- gh-140638: Expose a `"duration"` stat in `gc.get_stats()` and `gc.callbacks`.

- gh-139653: Only raise a `RecursionError` or trigger a fatal error if the stack pointer is both below the limit pointer *and* above the stack base. If outside of these bounds assume that it is OK. This prevents false positives when user-space threads swap stacks.

- gh-41779: Allowed defining the *__dict__* and *__weakref__* __slots__ for any class.

- gh-139103: Improve multithreaded scaling of dataclasses on the free-threaded build.

- gh-141589: Change `backoff counter` to use prime numbers instead of powers of 2. Use only 3 bits for `counter` and 13 bits for `value`. This allows to support values up to 8191. Patch by Mikhail Efimov.

- gh-137007: Fix a bug during JIT compilation failure which caused garbage collection debug assertions to fail.

- gh-132657: For the free-threaded build, avoid locking the `set` object for the `__contains__` method.

- gh-134584: Eliminate redundant refcounting from `_CALL_STR_1`.

- gh-134584: Eliminate redundant refcounting from `_CALL_BUILTIN_O`.

- gh-134584: Eliminate redundant refcounting from `_CALL_TUPLE_1`. Patch by Noam Cohen

<!-- anchor: id115 | type: section -->
### C API

- gh-142589: Fix `PyUnstable_Object_IsUniqueReferencedTemporary()` handling of tagged ints on the interpreter stack.

- gh-142571: `PyUnstable_CopyPerfMapFile()` now checks that opening the file succeeded before flushing.

- gh-142225: Fixed the `PyABIInfo_VAR` macro.

- gh-141049: `_PyObject_CallMethodId()`, `_PyObject_GetAttrId()` and `_PyUnicode_FromId()` are deprecated since 3.15 and will be removed in 3.20. Instead, use `PyUnicode_InternFromString()` and cache the result in the module state, then call `PyObject_CallMethod()` or `PyObject_GetAttr()`. Patch by Victor Stinner.

- gh-142163: Fix the `HAVE_THREAD_LOCAL` macro being defined without the `Py_BUILD_CORE` macro set after including `Python.h`.

- gh-137422: Fix free threading race condition in `PyImport_AddModuleRef()`. It was previously possible for two calls to the function return two different objects, only one of which was stored in `sys.modules`.

- gh-141726: Add `PyDict_SetDefaultRef()` to the Stable ABI.

- gh-140042: Removed the sqlite3_shutdown call that could cause closing connections for sqlite when used with multiple sub interpreters.

- gh-141070: Add `PyUnstable_Object_Dump()` to dump an object to `stderr`. It should only be used for debugging. Patch by Victor Stinner.

- gh-139165: Expose the functions `Py_SIZE()`, `Py_IS_TYPE()` and `Py_SET_SIZE()` in the Stable ABI.

<!-- anchor: id116 | type: section -->
### Build

- gh-131372: Add `LDVERSION` and `EXE` to the `base_interpreter` value of `build-details.json`.

- gh-142454: When calculating the digest of the JIT stencils input, sort the hashed files by filenames before adding their content to the hasher. This ensures deterministic hash input and hence deterministic hash, independent on filesystem order.

- gh-131372: `build-details.py` will only be installed as part of the main install (`make install`). `make altinstall` will no longer include it.

- gh-142234: Allow `--enable-wasm-dynamic-linking` for WASI. While CPython doesn’t directly support it so external/downstream users do not have to patch in support for the flag.

- gh-142050: Fixed a bug where JIT stencils produced on Windows contained debug data. Patch by Chris Eibl.

- gh-141808: Do not generate the jit stencils twice in case of PGO builds on Windows.

- gh-141926: `RUNSHARED` is no longer cleared when cross-compiling. Previously, `RUNSHARED` was cleared when cross-compiling, which breaks PGO when using `--enabled-shared` on systems where the cross-compiled CPython is otherwise executable (e.g., via transparent emulation).

- gh-141808: When running `make clean-retain-profile`, keep the generated JIT stencils. That way, the stencils are not generated twice when Profile-guided optimization (PGO) is used. It also allows distributors to supply their own pre-built JIT stencils.

- gh-141784: Fix `_remote_debugging_module.c` compilation on 32-bit Linux. Include Python.h before system headers to make sure that `_remote_debugging_module.c` uses the same types (ABI) than Python. Patch by Victor Stinner.

- gh-141172: Update to WASI SDK 29.

- gh-139707: Add configure option `--with-missing-stdlib-config=FILE` allows which distributors to pass a JSON configuration file containing custom error messages for missing standard library modules.

- gh-108819: Honor `--with-platlibdir` in the pure-Python standard library installation path, if `PLATLIBDIR` doesn’t match the value used in `LIBDIR`.

<!-- anchor: python-3-15-0-alpha-2 | type: section -->
## Python 3.15.0 alpha 2

*Release date: 2025-11-18*

<!-- anchor: id117 | type: section -->
### Windows

- gh-140849: Update bundled liblzma to version 5.8.1.

<!-- anchor: id118 | type: section -->
### Tools/Demos

- gh-141442: The iOS testbed now correctly handles test arguments that contain spaces.

- gh-140702: The iOS testbed app will now expose the `GITHUB_ACTIONS` environment variable to iOS apps being tested.

- gh-139198: Remove `Tools/scripts/checkpip.py` script.

- gh-139188: Remove `Tools/tz/zdump.py` script.

<!-- anchor: id119 | type: section -->
### Tests

- gh-140482: Preserve and restore the state of `stty echo` as part of the test environment.

- gh-140082: Update `python -m test` to set `FORCE_COLOR=1` when being run with color enabled so that `unittest` which is run by it with redirected output will output in color.

- gh-136442: Use exitcode `1` instead of `5` if `unittest.TestCase.setUpClass()` raises an exception

<!-- anchor: id120 | type: section -->
### Security

- gh-137836: Add support of the “plaintext” element, RAWTEXT elements “xmp”, “iframe”, “noembed” and “noframes”, and optionally RAWTEXT element “noscript” in `html.parser.HTMLParser`.

- gh-136063: `email.message`: ensure linear complexity for legacy HTTP parameters parsing. Patch by Bénédikt Tran.

- gh-136065: Fix quadratic complexity in `os.path.expandvars()`.

<!-- anchor: id121 | type: section -->
### Library

- gh-141497: `ipaddress`: ensure that the methods `IPv4Network.hosts()` and `IPv6Network.hosts()` always return an iterator.

- gh-140938: The `statistics.stdev()` and `statistics.pstdev()` functions now raise a `ValueError` when the input contains an infinity or a NaN.

- gh-124111: Updated Tcl threading configuration in `_tkinter` to assume that threads are always available in Tcl 9 and later.

- gh-137109: The `os.fork` and related forking APIs will no longer warn in the common case where Linux or macOS platform APIs return the number of threads in a process and find the answer to be 1 even when a `os.register_at_fork()` `after_in_parent=` callback (re)starts a thread.

- gh-141314: Fix assertion failure in `io.TextIOWrapper.tell()` when reading files with standalone carriage return (`\r`) line endings.

- gh-141311: Fix assertion failure in `io.BytesIO.readinto()` and undefined behavior arising when read position is above capcity in `io.BytesIO`.

- gh-87710: `mimetypes`: Update mime type for `.ai` files to `application/pdf`.

- gh-85524: Update `io.FileIO.readall`, an implementation of `io.RawIOBase.readall()`, to follow `io.IOBase` guidelines and raise `io.UnsupportedOperation` when a file is in “w” mode rather than `OSError`

- gh-141141: Fix a thread safety issue with `base64.b85decode()`. Contributed by Benel Tayar.

- gh-141018: `mimetypes`: Update `.exe`, `.dll`, `.rtf` and (when `strict=False`) `.jpg` to their correct IANA mime type.

- gh-137969: Fix `annotationlib.ForwardRef.evaluate()` returning `ForwardRef` objects which don’t update with new globals.

- gh-75593: Add support of path-like objects and bytes-like objects in `wave.open()`.

- gh-140797: The undocumented `re.Scanner` class now forbids regular expressions containing capturing groups in its lexicon patterns. Patterns using capturing groups could previously lead to crashes with segmentation fault. Use non-capturing groups (?:…) instead.

- gh-125115: Refactor the `pdb` parsing issue so positional arguments can pass through intuitively.

- gh-140815: `faulthandler` now detects if a frame or a code object is invalid or freed. Patch by Victor Stinner.

- gh-100218: Correctly set `errno` when `socket.if_nametoindex()` or `socket.if_indextoname()` raise an `OSError`. Patch by Bénédikt Tran.

- gh-140734: `multiprocessing`: fix off-by-one error when checking the length of a temporary socket file path. Patch by Bénédikt Tran.

- gh-140873: Add support of non-descriptor callables in `functools.singledispatchmethod()`.

- gh-140874: Bump the version of pip bundled in ensurepip to version 25.3

- gh-140826: Now `winreg.HKEYType` objects are compared by their underlying Windows registry handle value instead of their object identity.

- gh-140808: The internal class `mailbox._ProxyFile` is no longer a parameterized generic.

- gh-140691: In `urllib.request`, when opening a FTP URL fails because a data connection cannot be made, the control connection’s socket is now closed to avoid a `ResourceWarning`.

- gh-103847: Fix hang when cancelling process created by `asyncio.create_subprocess_exec()` or `asyncio.create_subprocess_shell()`. Patch by Kumar Aditya.

- gh-137821: Convert `_json` module to use Argument Clinic. Patched by Yoonho Hann.

- gh-140790: Initialize all Pdb’s instance variables in `__init__`, remove some hasattr/getattr

- gh-140766: Add `enum.show_flag_values()` and `enum.bin` to `enum.__all__`.

- gh-120057: Add `os.reload_environ()` to `os.__all__`.

- gh-140741: Fix `profiling.sampling.sample()` incorrectly handling a `FileNotFoundError` or `PermissionError`.

- gh-140228: Avoid making unnecessary filesystem calls for frozen modules in `linecache` when the global module cache is not present.

- gh-139946: Error and warning keywords in `argparse.ArgumentParser` messages are now colorized when color output is enabled, fixing a visual inconsistency in which they remained plain text while other output was colorized.

- gh-140590: Fix arguments checking for the `functools.partial.__setstate__()` that may lead to internal state corruption and crash. Patch by Sergey Miryanov.

- gh-125434: Display thread name in `faulthandler` on Windows. Patch by Victor Stinner.

- gh-140634: Fix a reference counting bug in `os.sched_param.__reduce__()`.

- gh-140650: Fix an issue where closing `io.BufferedWriter` could crash if the closed attribute raised an exception on access or could not be converted to a boolean.

- gh-140633: Ignore `AttributeError` when setting a module’s `__file__` attribute when loading an extension module packaged as Apple Framework.

- gh-140601: `xml.etree.ElementTree.iterparse()` now emits a `ResourceWarning` when the iterator is not explicitly closed and was opened with a filename. This helps developers identify and fix resource leaks. Patch by Osama Abdelkader.

- gh-140593: `xml.parsers.expat`: Fix a memory leak that could affect users with `ElementDeclHandler()` set to a custom element declaration handler. Patch by Sebastian Pipping.

- gh-140607: Inside `io.RawIOBase.read()`, validate that the count of bytes returned by `io.RawIOBase.readinto()` is valid (inside the provided buffer).

- gh-138162: Fix `logging.LoggerAdapter` with `merge_extra=True` and without the *extra* argument.

- gh-140481: Improve error message when trying to iterate a Tk widget, image or font.

- gh-138774: `ast.unparse()` now generates full source code when handling `ast.Interpolation` nodes that do not have a specified source.

- gh-140474: Fix memory leak in `array.array` when creating arrays from an empty `str` and the `u` type code.

- gh-140448: Change the default of `suggest_on_error` to `True` in `argparse.ArgumentParser`.

- gh-137530: `dataclasses` Fix annotations for generated `__init__` methods by replacing the annotations that were in-line in the generated source code with `__annotate__` functions attached to the methods.

- gh-140348: Fix regression in Python 3.14.0 where using the `|` operator on a `typing.Union` object combined with an object that is not a type would raise an error.

- gh-76007: `decimal`: Deprecate `__version__` and replace with `decimal.SPEC_VERSION`.

- gh-76007: Deprecate `__version__` from `imaplib`. Patch by Hugo van Kemenade.

- gh-140272: Fix memory leak in the `clear()` method of the `dbm.gnu` database.

- gh-129117: `unicodedata`: Add `isxidstart()` and `isxidcontinue()` functions to check whether a character can start or continue a Unicode Standard Annex #31 identifier.

- gh-140251: Colorize the default import statement `import asyncio` in asyncio REPL.

- gh-140212: Calendar’s HTML formatting now accepts year and month as options. Previously, running `python -m calendar -t html 2025 10` would result in an error message. It now generates an HTML document displaying the calendar for the specified month. Contributed by Pål Grønås Drange.

- gh-135801: Improve filtering by module in `warnings.warn_explicit()` if no *module* argument is passed. It now tests the module regular expression in the warnings filter not only against the filename with `.py` stripped, but also against module names constructed starting from different parent directories of the filename (with `/__init__.py`, `.py` and, on Windows, `.pyw` stripped).

- gh-139707: Improve `ModuleNotFoundError` error message when a standard library module is missing.

- gh-140041: Fix import of `ctypes` on Android and Cygwin when ABI flags are present.

- gh-140120: Fixed a memory leak in `hmac` when it was using the hacl-star backend. Discovered by `@ashm-dev` using AddressSanitizer.

- gh-140141: The `importlib.metadata.PackageNotFoundError` traceback raised when `importlib.metadata.Distribution.from_name` cannot discover a distribution no longer includes a transient `StopIteration` exception trace.

  Contributed by Bartosz Sławecki in gh-140142.

- gh-140166: `mimetypes`: Per the IANA assignment, update the MIME type for the `.texi` and `.texinfo` file formats to `application/texinfo`, instead of `application/x-texinfo`.

- gh-140135: Speed up `io.RawIOBase.readall()` by using PyBytesWriter API (about 4x faster)

- gh-76007: `zlib`: Deprecate `__version__` and schedule for removal in Python 3.20.

- gh-136702: `encodings`: Deprecate passing a non-ascii *encoding* name to `encodings.normalize_encoding()` and schedule removal of support for Python 3.17.

- gh-139940: Print clearer error message when using `pdb` to attach to a non-existing process.

- gh-139462: When a child process in a `concurrent.futures.ProcessPoolExecutor` terminates abruptly, the resulting traceback will now tell you the PID and exit code of the terminated process. Contributed by Jonathan Berg.

- gh-63161: Fix `tokenize.detect_encoding()`. Support non-UTF-8 shebang and comments if non-UTF-8 encoding is specified. Detect decoding error for non-UTF-8 encoding. Detect null bytes in source code.

- gh-101828: Fix `'shift_jisx0213'`, `'shift_jis_2004'`, `'euc_jisx0213'` and `'euc_jis_2004'` codecs truncating null chars as they were treated as part of multi-character sequences.

- gh-139246: fix: paste zero-width in default repl width is wrong.

- gh-83714: Implement `os.statx()` on Linux kernel versions 4.11 and later with glibc versions 2.28 and later. Contributed by Jeffrey Bosboom and Victor Stinner.

- gh-138891: Fix `SyntaxError` when `inspect.get_annotations(f, eval_str=True)` is called on a function annotated with a **PEP 646** `star_expression`

- gh-138859: Fix generic type parameterization raising a `TypeError` when omitting a `ParamSpec` that has a default which is not a list of types.

- gh-138764: Prevent `annotationlib.call_annotate_function()` from calling `__annotate__` functions that don’t support `VALUE_WITH_FAKE_GLOBALS` in a fake globals namespace with empty globals.

  Make `FORWARDREF` and `STRING` annotations fall back to using `VALUE` annotations in the case that neither their own format, nor `VALUE_WITH_FAKE_GLOBALS` are supported.

- gh-138775: Use of `python -m` with `base64` has been fixed to detect input from a terminal so that it properly notices EOF.

- gh-98896: Fix a failure in multiprocessing resource_tracker when SharedMemory names contain colons. Patch by Rani Pinchuk.

- gh-138425: Fix partial evaluation of `annotationlib.ForwardRef` objects which rely on names defined as globals.

- gh-138151: In `annotationlib`, improve evaluation of forward references to nonlocal variables that are not yet defined when the annotations are initially evaluated.

- gh-69528: The `mode` attribute of files opened in the `'wb+'` mode is now `'wb+'` instead of `'rb+'`.

- gh-137627: Speed up `csv.Sniffer.sniff()` delimiter detection by up to 1.6x.

- gh-55531: `encodings`: Improve `normalize_encoding()` performance by implementing the function in C using the private `_Py_normalize_encoding` which has been modified to make lowercase conversion optional.

- gh-136057: Fixed the bug in `pdb` and `bdb` where `next` and `step` can’t go over the line if a loop exists in the line.

- gh-133390: Support table, index, trigger, view, column, function, and schema completion for `sqlite3`’s command-line interface.

- gh-135307: `email`: Fix exception in `set_content()` when encoding text and max_line_length is set to `0` or `None` (unlimited).

- gh-133789: Fix unpickling of `pathlib` objects that were pickled in Python 3.13.

- gh-133601: Remove deprecated `typing.no_type_check_decorator()`.

- gh-132686: Add parameters *inherit_class_doc* and *fallback_to_class_doc* for `inspect.getdoc()`.

- gh-131116: `inspect.getdoc()` now correctly returns an inherited docstring on `cached_property` objects if none is given in a subclass.

- gh-130693: Add support for `-nolinestop`, and `-strictlimits` options to `tkinter.Text.search()`. Also add the `tkinter.Text.search_all()` method for `-all` and `-overlap` options.

- gh-122255: In the `linecache` module and in the Python implementation of the `warnings` module, a `DeprecationWarning` is issued when `mod.__loader__` differs from `mod.__spec__.loader` (like in the C implementation of the `warnings` module).

- gh-121011: `math.log()` now supports arbitrary large integer-like arguments in the same way as arbitrary large integer arguments.

- gh-119668: Publicly expose and document `importlib.machinery.NamespacePath`.

- gh-102431: Clarify constraints for “logical” arguments in methods of `decimal.Context`.

- gh-81313: Add the `math.integer` module (**PEP 791**).

<!-- anchor: id122 | type: section -->
### Core and Builtins

- gh-141579: Fix `sys.activate_stack_trampoline()` to properly support the `perf_jit` backend. Patch by Pablo Galindo.

- gh-114203: Skip locking if object is already locked by two-mutex critical section.

- gh-141528: Suggest using `concurrent.interpreters.Interpreter.close()` instead of the private `_interpreters.destroy` function when warning about remaining subinterpreters. Patch by Sergey Miryanov.

- gh-141367: Specialize `CALL_LIST_APPEND` instruction only for lists, not for list subclasses, to avoid unnecessary deopt. Patch by Mikhail Efimov.

- gh-141312: Fix the assertion failure in the `__setstate__` method of the range iterator when a non-integer argument is passed. Patch by Sergey Miryanov.

- gh-140643: Add support for `<GC>` and `<native>` frames to `profiling.sampling` output to denote active garbage collection and calls to native code.

<!-- anchor: id123 | type: section -->
### Library

- gh-140942: Add `.cjs` to `mimetypes` to give CommonJS modules a MIME type of `application/node`.

<!-- anchor: id124 | type: section -->
### Core and Builtins

- gh-140479: Update JIT compilation to use LLVM 21 at build time.

- gh-140939: Fix memory leak when `bytearray` or `bytes` is formated with the `%*b` format with a large width that results in a `MemoryError`.

<!-- anchor: id125 | type: section -->
### Library

- gh-140260: Fix `struct` data race in endian table initialization with subinterpreters. Patch by Shamil Abdulaev.

<!-- anchor: id126 | type: section -->
### Core and Builtins

- gh-140530: Fix a reference leak when `raise exc from cause` fails. Patch by Bénédikt Tran.

<!-- anchor: id127 | type: section -->
### Library

- gh-90344: Replace `io.IncrementalNewlineDecoder` with non incremental newline decoders in codebase where `io.IncrementalNewlineDecoder.decode()` was being called once.

<!-- anchor: id128 | type: section -->
### Core and Builtins

- gh-140373: Correctly emit `PY_UNWIND` event when generator object is closed. Patch by Mikhail Efimov.

- gh-140729: Fix pickling error in the sampling profiler when using `concurrent.futures.ProcessPoolExecutor` script can not be properly pickled and executed in worker processes.

- gh-131527: Dynamic borrow checking for stackrefs is added to `Py_STACKREF_DEBUG` mode. Patch by Mikhail Efimov.

- gh-140576: Fixed crash in `tokenize.generate_tokens()` in case of specific incorrect input. Patch by Mikhail Efimov.

- gh-140544: Speed up accessing interpreter state by caching it in a thread local variable. Patch by Kumar Aditya.

- gh-140551: Fixed crash in `dict` if `dict.clear()` is called at the lookup stage. Patch by Mikhail Efimov and Inada Naoki.

- gh-140517: Fixed a reference leak when iterating over the result of `map()` with `strict=True` when the input iterables have different lengths. Patch by Mikhail Efimov.

- gh-133467: Fix race when updating `type.__bases__` that could allow a read of `type.__base__` to observe an inconsistent value on the free threaded build.

- gh-140471: Fix potential buffer overflow in `ast.AST` node initialization when encountering malformed `_fields` containing non-`str`.

<!-- anchor: id129 | type: section -->
### Library

- gh-140443: The logarithm functions (such as `math.log10()` and `math.log()`) may now produce slightly different results for extremely large integers that cannot be converted to floats without overflow. These results are generally more accurate, with reduced worst-case error and a tighter overall error distribution.

<!-- anchor: id130 | type: section -->
### Core and Builtins

- gh-140431: Fix a crash in Python’s garbage collector due to partially initialized coroutine objects when coroutine origin tracking depth is enabled (`sys.set_coroutine_origin_tracking_depth()`).

- gh-140476: Optimize `PySet_Add()` for `frozenset` in free threaded build.

- gh-135904: Add special labels to the assembly created during stencil creation to support relocations that the native object file format does not support. Specifically, 19 bit branches for AArch64 in Mach-O object files.

<!-- anchor: id131 | type: section -->
### Library

- gh-140398: Fix memory leaks in `readline` functions `read_init_file()`, `read_history_file()`, `write_history_file()`, and `append_history_file()` when `PySys_Audit()` fails.

<!-- anchor: id132 | type: section -->
### Core and Builtins

- gh-140406: Fix memory leak when an object’s `__hash__()` method returns an object that isn’t an `int`.

- gh-140358: Restore elapsed time and unreachable object count in GC debug output. These were inadvertently removed during a refactor of `gc.c`. The debug log now again reports elapsed collection time and the number of unreachable objects. Contributed by Pål Grønås Drange.

- gh-136895: Update JIT compilation to use LLVM 20 at build time.

- gh-139109: A new tracing frontend for the JIT compiler has been implemented. Patch by Ken Jin. Design for CPython by Ken Jin, Mark Shannon and Brandt Bucher.

- gh-140306: Fix memory leaks in cross-interpreter channel operations and shared namespace handling.

- gh-116738: Make _suggestions module thread-safe on the free threaded build.

- gh-140301: Fix memory leak of `PyConfig` in subinterpreters.

- gh-140257: Fix data race between interpreter_clear() and take_gil() on eval_breaker during finalization with daemon threads.

- gh-139951: Fixes a regression in GC performance for a growing heap composed mostly of small tuples.

  - Counts number of actually tracked objects, instead of trackable objects. This ensures that untracking tuples has the desired effect of reducing GC overhead.

  - Does not track most untrackable tuples during creation. This prevents large numbers of small tuples causing excessive GCs.

- gh-140253: Wrong placement of a double-star pattern inside a mapping pattern now throws a specialized syntax error. Contributed by Bartosz Sławecki in gh-140253.

- gh-140104: Fix a bug with exception handling in the JIT. Patch by Ken Jin. Bug reported by Daniel Diniz.

- gh-140149: Speed up parsing bytes literals concatenation by using PyBytesWriter API and a single memory allocation (about 3x faster).

- gh-140061: Fixing the checking of whether an object is uniquely referenced to ensure free-threaded compatibility. Patch by Sergey Miryanov.

- gh-140080: Fix hang during finalization when attempting to call `atexit` handlers under no memory.

- gh-139871: Update `bytearray` to use a `bytes` under the hood as its buffer and add `bytearray.take_bytes()` to take it out.

- gh-140067: Fix memory leak in sub-interpreter creation.

- gh-139914: Restore support for HP PA-RISC, which has an upwards-growing stack.

- gh-139817: Attribute `__qualname__` is added to `typing.TypeAliasType`. Patch by Mikhail Efimov.

- gh-135801: Many functions related to compiling or parsing Python code, such as `compile()`, `ast.parse()`, `symtable.symtable()`, and `importlib.abc.InspectLoader.source_to_code()` now allow to specify the module name. It is needed to unambiguous filter syntax warnings by module name.

- gh-139640: `ast.parse()` no longer emits syntax warnings for `return`/`break`/`continue` in `finally` (see **PEP 765**) – they are only emitted during compilation.

- gh-139640: Fix swallowing some syntax warnings in different modules if they accidentally have the same message and are emitted from the same line. Fix duplicated warnings in the `finally` block.

- gh-139475: Changes in stackref debugging mode when `Py_STACKREF_DEBUG` is set. We use the same pattern of refcounting for stackrefs as in production build.

- gh-139269: Fix undefined behavior when using unaligned store in JIT’s `patch_*` functions.

- gh-138944: Fix `SyntaxError` message when invalid syntax appears on the same line as a valid `import ... as ...` or `from ... import ... as ...` statement. Patch by Brian Schubert.

- gh-138857: Improve `SyntaxError` message for `case` keyword placed outside `match` body.

- gh-131253: Support the `--enable-pystats` build option for the free-threaded build.

- gh-136327: Errors when calling functions with invalid values after `*` and `**` now do not include the function name. Patch by Ilia Solin.

- gh-134786: If `Py_TPFLAGS_MANAGED_DICT` and `Py_TPFLAGS_MANAGED_WEAKREF` are used, then `Py_TPFLAGS_HAVE_GC` must be used as well.

<!-- anchor: id133 | type: section -->
### C API

- gh-141341: On Windows, rename the `COMPILER` macro to `_Py_COMPILER` to avoid name conflicts. Patch by Victor Stinner.

- gh-116146: Add a new `PyImport_CreateModuleFromInitfunc()` C-API for creating a module from a *spec* and *initfunc*. Patch by Itamar Oren.

- gh-141042: Make qNaN in `PyFloat_Pack2()` and `PyFloat_Pack4()`, if while conversion to a narrower precision floating-point format — the remaining after truncation payload will be zero. Patch by Sergey B Kirpichev.

- gh-141004: `Py_MATH_El` and `Py_MATH_PIl` are deprecated.

- gh-141004: The `Py_INFINITY` macro is soft deprecated.

- gh-140556: **PEP 793**: Add a new entry point for C extension modules, `PyModExport_<modulename>`.

- gh-140487: Fix `Py_RETURN_NOTIMPLEMENTED` in limited C API 3.11 and older: don’t treat `Py_NotImplemented` as immortal. Patch by Victor Stinner.

- gh-140153: Fix `Py_REFCNT()` definition on limited C API 3.11-3.13. Patch by Victor Stinner.

- gh-139653: Add `PyUnstable_ThreadState_SetStackProtection()` and `PyUnstable_ThreadState_ResetStackProtection()` functions to set the stack protection base address and stack protection size of a Python thread state. Patch by Victor Stinner.

<!-- anchor: id134 | type: section -->
### Build

- gh-140454: When building the JIT, match the jit_stencils filename expectations in Makefile with the generator script. This avoid needless JIT recompilation during `make install`.

- gh-140768: Warn when the WASI SDK version doesn’t match what’s supported.

- gh-140513: Generate a clear compilation error when `_Py_TAIL_CALL_INTERP` is enabled but either `preserve_none` or `musttail` is not supported.

- gh-140475: Support WASI SDK 25.

- gh-140239: Check `statx` availability only on Linux (including Android).

- gh-140189: iOS builds were added to CI.

- gh-137618: `PYTHON_FOR_REGEN` now requires Python 3.10 to Python 3.15. Patch by Adam Turner.

<!-- anchor: python-3-15-0-alpha-1 | type: section -->
## Python 3.15.0 alpha 1

*Release date: 2025-10-14*

<!-- anchor: id135 | type: section -->
### macOS

- gh-115119: Update macOS installer to use libmpdecimal 4.0.1.

- gh-124111: Update macOS installer to use Tcl/Tk 9.0.2.

- gh-132339: Update macOS installer version of OpenSSL to 3.5.4.

- gh-137450: macOS installer shell path management improvements: separate the installer `Shell profile updater` postinstall script from the `Update Shell Profile.command` to enable more robust error handling.

- gh-137134: Update macOS installer to ship with SQLite version 3.50.4.

<!-- anchor: id136 | type: section -->
### Windows

- gh-139810: Installing with `py install 3[.x]-dev` will now select final versions as well as prereleases.

- gh-139573: Updated bundled version of OpenSSL to 3.0.18.

- gh-138896: Fix error installing C runtime on non-updated Windows machines

- gh-138314: Add `winreg.DeleteTree()`.

- gh-137136: Suppress build warnings when build on Windows with `--experimental-jit-interpreter`.

- gh-137134: Update Windows installer to ship with SQLite 3.50.4.

- gh-135099: Fix a crash that could occur on Windows when a background thread waits on a `PyMutex` while the main thread is shutting down the interpreter.

- gh-130727: Fix a race in internal calls into WMI that can result in an “invalid handle” exception under high load. Patch by Chris Eibl.

- gh-76023: Make `os.path.realpath()` ignore Windows error 1005 when in non-strict mode.

- gh-133779: Reverts the change to generate different `pyconfig.h` files based on compiler settings, as it was frequently causing extension builds to break. In particular, the `Py_GIL_DISABLED` preprocessor variable must now always be defined explicitly when compiling for the experimental free-threaded runtime. The `sysconfig.get_config_var()` function can be used to determine whether the current runtime was compiled with that flag or not.

- gh-133626: Ensures packages are not accidentally bundled into the traditional installer.

- gh-133580: Fix `sys.getwindowsversion()` failing without setting an exception when called on some WinAPI partitions.

- gh-133572: Avoid LsaNtStatus to WinError conversion on unsupported WinAPI partitions.

- gh-133568: Fix compile error when using a WinAPI partition that doesn’t support the RPC runtime library.

- gh-133562: Disable handling of security descriptors by `os.mkdir()` with mode `0o700` on WinAPI partitions that do not support it. This only affects custom builds for specialized targets.

- gh-133537: Avoid using console I/O in WinAPI partitions that don’t support it

- gh-131942: Use the Python-specific `Py_DEBUG` macro rather than `_DEBUG` in Windows-related C code. Patch by Xuehai Pan.

<!-- anchor: id137 | type: section -->
### Tools/Demos

- gh-139330: SBOM generation tool didn’t cross-check the version and checksum values against the `Modules/expat/refresh.sh` script, leading to the values becoming out-of-date during routine updates.

- gh-132006: XCframeworks now include privacy manifests to satisfy Apple App Store submission requirements.

- gh-138171: A script for building an iOS XCframework was added. As part of this change, the top level `iOS` folder has been moved to be a subdirectory of the `Apple` folder.

- gh-137873: The iOS test runner has been simplified, resolving some issues that have been observed using the runner in GitHub Actions and Azure Pipelines test environments.

- gh-137484: Have `Tools/wasm/wasi` put the build Python into a directory named after the build triple instead of “build”.

- gh-137025: The `wasm_build.py` script has been removed. `Tools/wasm/emscripten` and `Tools/wasm/wasi` should be used instead, as described in the Dev Guide.

- gh-137248: Add a `--logdir` option to `Tools/wasm/wasi` for specifying where to write log files.

- gh-137243: Have Tools/wasm/wasi detect a WASI SDK install in /opt when it was directly extracted from a release tarball.

- gh-136251: Fixes and usability improvements for `Tools/wasm/emscripten/web_example`

- gh-135968: Stubs for `strip` are now provided as part of an iOS install.

- gh-135379: The cases generator no longer accepts type annotations on stack items. Conversions to non-default types are now done explicitly in bytecodes.c and optimizer_bytecodes.c. This will simplify code generation for top-of-stack caching and other future features.

- gh-134215: REPL import autocomplete only suggests private modules when explicitly specified.

<!-- anchor: id138 | type: section -->
### Tests

- gh-139208: Fix regrtest `--fast-ci --verbose`: don’t ignore the `--verbose` option anymore. Patch by Victor Stinner.

- gh-138313: Restore skipped test and add janky workaround to prevent select buildbots from failing with a ResourceWarning.

- gh-135966: The iOS testbed now handles the `app_packages` folder as a site directory.

- gh-135494: Fix regrtest to support excluding tests from `--pgo` tests. Patch by Victor Stinner.

- gh-132815: Fix test__opcode: add `JUMP_BACKWARD` to specialization stats.

- gh-135489: Show verbose output for failing tests during PGO profiling step with –enable-optimizations.

- gh-135401: Add a new GitHub CI job to test the `ssl` module with AWS-LC as the backing cryptography and TLS library.

- gh-135120: Add `test.support.subTests()`.

- gh-134567: Expose log formatter to users in TestCase.assertLogs. `unittest.TestCase.assertLogs()` will now optionally accept a formatter that will be used to format the strings in output if provided.

- gh-133744: Fix multiprocessing interrupt test. Add an event to synchronize the parent process with the child process: wait until the child process starts sleeping. Patch by Victor Stinner.

- gh-133682: Fixed test case `test.test_annotationlib.TestStringFormat.test_displays` which ensures proper handling of complex data structures (lists, sets, dictionaries, and tuples) in string annotations.

- gh-133639: Fix `TestPyReplAutoindent.test_auto_indent_default()` doesn’t run `input_code`.

<!-- anchor: id139 | type: section -->
### Security

- gh-139700: Check consistency of the zip64 end of central directory record. Support records with “zip64 extensible data” if there are no bytes prepended to the ZIP file.

- gh-139400: `xml.parsers.expat`: Make sure that parent Expat parsers are only garbage-collected once they are no longer referenced by subparsers created by `ExternalEntityParserCreate()`. Patch by Sebastian Pipping.

- gh-139283: `sqlite3`: correctly handle maximum number of rows to fetch in `Cursor.fetchmany` and reject negative values for `Cursor.arraysize`. Patch by Bénédikt Tran.

- gh-136053: `marshal`: fix a possible crash when deserializing `slice` objects.

- gh-135661: Fix parsing start and end tags in `html.parser.HTMLParser` according to the HTML5 standard.

  - Whitespaces no longer accepted between `</` and the tag name. E.g. `</ script>` does not end the script section.

  - Vertical tabulation (`\v`) and non-ASCII whitespaces no longer recognized as whitespaces. The only whitespaces are `\t\n\r\f` and space.

  - Null character (U+0000) no longer ends the tag name.

  - Attributes and slashes after the tag name in end tags are now ignored, instead of terminating after the first `>` in quoted attribute value. E.g. `</script/foo=">"/>`.

  - Multiple slashes and whitespaces between the last attribute and closing `>` are now ignored in both start and end tags. E.g. `<a foo=bar/ //>`.

  - Multiple `=` between attribute name and value are no longer collapsed. E.g. `<a foo==bar>` produces attribute “foo” with value “=bar”.

- gh-135661: Fix CDATA section parsing in `html.parser.HTMLParser` according to the HTML5 standard: `] ]>` and `]] >` no longer end the CDATA section. Add private method `_set_support_cdata()` which can be used to specify how to parse `<[CDATA[` — as a CDATA section in foreign content (SVG or MathML) or as a bogus comment in the HTML namespace.

- gh-102555: Fix comment parsing in `html.parser.HTMLParser` according to the HTML5 standard. `--!>` now ends the comment. `-- >` no longer ends the comment. Support abnormally ended empty comments `<-->` and `<--->`.

- gh-135462: Fix quadratic complexity in processing specially crafted input in `html.parser.HTMLParser`. End-of-file errors are now handled according to the HTML5 specs – comments and declarations are automatically closed, tags are ignored.

- gh-118350: Fix support of escapable raw text mode (elements “textarea” and “title”) in `html.parser.HTMLParser`.

- gh-135034: Fixes multiple issues that allowed `tarfile` extraction filters (`filter="data"` and `filter="tar"`) to be bypassed using crafted symlinks and hard links.

  Addresses **CVE 2024-12718**, **CVE 2025-4138**, **CVE 2025-4330**, and **CVE 2025-4517**.

- gh-133767: Fix use-after-free in the “unicode-escape” decoder with a non-“strict” error handler.

- gh-133623: Indicate through `ssl.HAS_PSK_TLS13` whether the `ssl` module supports “External PSKs” in TLSv1.3, as described in RFC 9258. Patch by Will Childs-Klein.

- gh-128840: Short-circuit the processing of long IPv6 addresses early in `ipaddress` to prevent excessive memory consumption and a minor denial-of-service.

<!-- anchor: id140 | type: section -->
### Library

- gh-139482: Optimize `os.environ.clear()` by calling *clearenv(3)* when this function is available. Patch by Victor Stinner.

- gh-139958: The `application/toml` mime type is now supported by `mimetypes`. Patch by Gil Forcada.

- gh-139823: `ensurepip` now fails with a nicer error message when the `zlib` module is not available.

- gh-139905: Add suggestion to error message for `typing.Generic` subclasses when `cls.__parameters__` is missing due to a parent class failing to call `super().__init_subclass__()` in its `__init_subclass__`.

- gh-139894: Fix incorrect sharing of current task with the child process while forking in `asyncio`. Patch by Kumar Aditya.

- gh-139845: Fix to not print KeyboardInterrupt twice in default asyncio REPL.

- gh-139783: Fix `inspect.getsourcelines()` for the case when a decorator is followed by a comment or an empty line.

- gh-139809: Prevent premature colorization of subparser `prog` in `argparse.ArgumentParser.add_subparsers()` to respect color environment variable changes after parser creation.

- gh-139736: Fix excessive indentation in the default `argparse` `HelpFormatter`. Patch by Alexander Edland.

- gh-70765: `http.server`: fix default handling of HTTP/0.9 requests in `BaseHTTPRequestHandler`. Previously, `BaseHTTPRequestHandler.parse_request()` incorrectly waited for headers in the request although those are not supported in HTTP/0.9. Patch by Bénédikt Tran.

- gh-139322: Fix `os.getlogin()` error handling: fix the error number. Patch by Victor Stinner.

- gh-135953: Add a Gecko format output to the tachyon profiler via `--gecko`.

- gh-139184: `os.forkpty()` does now make the returned file descriptor non-inheritable.

- gh-139391: Fix an issue when, on non-Windows platforms, it was not possible to gracefully exit a `python -m asyncio` process suspended by Ctrl+Z and later resumed by *fg* other than with *kill*.

- gh-139374: `timeit`: Add color to error tracebacks.

- gh-90949: Add `SetBillionLaughsAttackProtectionActivationThreshold()` and `SetBillionLaughsAttackProtectionMaximumAmplification()` to xmlparser objects to tune protections against billion laughs attacks. Patch by Bénédikt Tran.

- gh-139312: Upgrade bundled libexpat to 2.7.3

- gh-139289: Do a real lazy-import on `rlcompleter` in `pdb` and restore the existing completer after importing `rlcompleter`.

- gh-90949: Add `SetAllocTrackerActivationThreshold()` and `SetAllocTrackerMaximumAmplification()` to xmlparser objects to tune protections against disproportional amounts of dynamic memory usage from within an Expat parser. Patch by Bénédikt Tran.

- gh-67795: Functions that take timestamp or timeout arguments now accept any real numbers (such as `Decimal` and `Fraction`), not only integers or floats, although this does not improve precision.

- gh-95953: A CSS class, `diff_changed`, was added to the changed lines in the `make_table` output of `difflib.HtmlDiff`. Patch by Katie Gardner.

- gh-139210: Fix use-after-free when reporting unknown event in `xml.etree.ElementTree.iterparse()`. Patch by Ken Jin.

- gh-138860: Lazy import `rlcompleter` in `pdb` to avoid deadlock in subprocess.

- gh-112729: Fix crash when calling `concurrent.interpreters.create()` when the process is out of memory.

- gh-126016: Fix an assertion failure when sending `KeyboardInterrupt` to a Python process running a subinterpreter in a separate thread.

- gh-118803: `collections.abc.ByteString` has been removed from `collections.abc.__all__`, and `typing.ByteString` has been removed from `typing.__all__`. The former has been deprecated since Python 3.12, and the latter has been deprecated since Python 3.9. Both classes are scheduled for removal in Python 3.17.

  Additionally, the following statements now cause `DeprecationWarning`s to be emitted at runtime: `from collections.abc import ByteString`, `from typing import ByteString`, `import collections.abc; collections.abc.ByteString` and `import typing; typing.ByteString`. Both classes already caused `DeprecationWarning`s to be emitted if they were subclassed or used as the second argument to `isinstance()` or `issubclass()`, but they did not previously lead to `DeprecationWarning`s if they were merely imported or accessed from their respective modules.

- gh-135729: Fix unraisable exception during finalization when using `concurrent.interpreters` in the REPL.

- gh-139076: Fix a bug in the `pydoc` module that was hiding functions in a Python module if they were implemented in an extension module and the module did not have `__all__`.

- gh-139090: Add `os.RWF_DONTCACHE` constant for Linux 6.14+.

- gh-139065: Fix trailing space before a wrapped long word if the line length is exactly *width* in `textwrap`.

- gh-139001: Fix race condition in `pathlib.Path` on the internal `_raw_paths` field.

- gh-138813: `multiprocessing.BaseProcess` defaults `kwargs` to `None` instead of a shared dictionary.

- gh-138998: Update bundled libexpat to 2.7.2

- gh-138993: Dedent `credits` text.

- gh-118803: Add back `collections.abc.ByteString` and `typing.ByteString`. Both had been removed in prior alpha, beta and release candidates for Python 3.14, but their removal has now been postponed to Python 3.17.

- gh-130567: Fix possible crash in `locale.strxfrm()` due to a platform bug on macOS.

- gh-137226: Fix `typing.get_type_hints()` calls on generic `typing.TypedDict` classes defined with string annotations.

- gh-138899: Executing `quit` command in `pdb` will raise `bdb.BdbQuit` when `pdb` is started from an asyncio console using `breakpoint()` or `pdb.set_trace()`.

- gh-138804: Raise `TypeError` instead of `AttributeError` when an argument of incorrect type is passed to `shlex.quote()`. This restores the behavior of the function prior to 3.14.

- gh-138779: Support device numbers larger than `2**63-1` for the `st_rdev` field of the `os.stat_result` structure.

- gh-138682: Added symmetric difference support to `collections.Counter` objects.

- gh-138712: Add `os.NODEV`.

- gh-128636: Fix crash in PyREPL when os.environ is overwritten with an invalid value for mac

- gh-138720: Fix an issue where `io.BufferedWriter` and `io.BufferedRandom` had different definitions of “closed” for `close()` and `flush()` which resulted in an exception when close called flush but flush thought the file was already closed.

- gh-138706: Update `unicodedata` database to Unicode 17.0.0.

- gh-76007: Deprecate `__version__` from a number of standard library modules. Patch by Hugo van Kemenade.

- gh-138535: Speed up `os.stat()` for files with reasonable timestamps. Contributed by Jeffrey Bosboom.

- gh-116946: `curses.panel`: the type of `curses.panel.new_panel()` is now immutable. Patch by Bénédikt Tran.

- gh-116946: `zlib`: the types of `zlib.compressobj()` and `zlib.decompressobj()` are now immutable. Patch by Bénédikt Tran.

- gh-116946: `os`: the `os.DirEntry` type and the type of `os.scandir()` are now immutable. Patch by Bénédikt Tran.

- gh-116946: `tkinter`: the types `_tkinter.Tcl_Obj` (wrapper for Tcl objects), `_tkinter.tktimertoken` (obtained by calling `createtimerhandler()` on a `Tk` application) and `_tkinter.tkapp` (the runtime type of Tk applications) are now immutable. Patch by Bénédikt Tran.

- gh-138514: Raise `ValueError` when a multi-character string is passed to the *echo_char* parameter of `getpass.getpass()`. Patch by Benjamin Johnson.

- gh-137706: Fix the partial evaluation of annotations that use `typing.Annotated[T, x]` where `T` is a forward reference.

- gh-88375: Fix normalization of the `robots.txt` rules and URLs in the `urllib.robotparser` module. No longer ignore trailing `?`. Distinguish raw special characters `?`, `=` and `&` from the percent-encoded ones.

- gh-138515: `email` is added to Emscripten build.

- gh-99948: `ctypes.util.find_library()` now works in Emscripten build.

- gh-111788: Fix parsing errors in the `urllib.robotparser` module. Don’t fail trying to parse weird paths. Don’t fail trying to decode non-UTF-8 `robots.txt` files.

- gh-138432: `zoneinfo.reset_tzpath()` will now convert any `os.PathLike` objects it receives into strings before adding them to `TZPATH`. It will raise `TypeError` if anything other than a string is found after this conversion. If given an `os.PathLike` object that represents a relative path, it will now raise `ValueError` instead of `TypeError`, and present a more informative error message.

- gh-132657: Improve the scaling of `copy.copy()` and `copy.deepcopy()` in the free-threading build.

- gh-116946: The types of `select.poll()` and `select.epoll()` objects are now immutable. Patch by Bénédikt Tran.

- gh-116946: The `_random.Random` C type is now immutable. Patch by Bénédikt Tran.

- gh-57911: When extracting tar files on Windows, slashes in symlink targets will be replaced by backslashes to prevent corrupted links.

- gh-138205: Removed the `resize()` method on platforms that don’t support the underlying syscall, instead of raising a `SystemError`.

- gh-138008: Fix segmentation faults in the `ctypes` module due to invalid `argtypes`. Patch by Dung Nguyen.

- gh-138252: `ssl`: `SSLContext` objects can now set client and server TLS signature algorithms. If Python has been built with OpenSSL 3.5 or later, `SSLSocket` objects can return the signature algorithms selected on a connection.

- gh-138253: Add the *block* parameter in the `put()` and `get()` methods of the `concurrent.interpreters` queues for compatibility with the `queue.Queue` interface.

- gh-60462: Fix `locale.strxfrm()` on Solaris (and possibly other platforms).

- gh-138239: The REPL now highlights `type` as a soft keyword in type statements.

- gh-78502: `mmap.mmap` now has a *trackfd* parameter on Windows; if it is `False`, the file handle corresponding to *fileno* will not be duplicated.

- gh-138204: Forbid expansion of shared anonymous `memory maps` on Linux, which caused a bus error.

- gh-138010: Fix an issue where defining a class with a `@warnings.deprecated`-decorated base class may not invoke the correct `__init_subclass__()` method in cases involving multiple inheritance. Patch by Brian Schubert.

- gh-134716: Add support of regular expressions in the `-W` option and the `PYTHONWARNINGS` environment variable.

- gh-138133: Prevent infinite traceback loop when sending CTRL^C to Python through `strace`.

- gh-138122: Implement **PEP 799** – A dedicated profiling package for organizing Python profiling tools. Patch by Pablo Galindo.

- gh-138092: Fixed a bug in `mmap.mmap.flush()` where calling with only an offset parameter would fail.

- gh-138044: Remove compatibility shim for deprecated parameter *package* in `importlib.resources.files()`. Patch by Semyon Moroz.

- gh-86819: `socket`: Add missing constants for ISO-TP sockets.

- gh-137884: Add `threading.get_native_id()` support for Illumos/Solaris. Patch by Yüce Tekol.

- gh-134869: Fix an issue where pressing Ctrl+C during tab completion in the REPL would leave the autocompletion menu in a corrupted state.

- gh-137840: `typing.TypedDict` now supports the `closed` and `extra_items` keyword arguments (as described in **PEP 728**) to control whether additional non-required keys are allowed and to specify their value type.

- gh-132947: Applied changes to `importlib.metadata` from importlib_metadata 8.7, including `dist` now disallowed for `EntryPoints.select`; deferred imports for faster import times; added support for metadata with newlines (python/cpython#119650); and `metadata()` function now returns `None` when a metadata directory is present but no metadata is present.

- gh-90548: Fix `musl` detection for `platform.libc_ver()` on Alpine Linux if compiled with –strip-all.

- gh-137317: `inspect.signature()` now correctly handles classes that use a descriptor on a wrapped `__init__()` or `__new__()` method. Contributed by Yongyu Yan.

- gh-137754: Fix import of the `zoneinfo` module if the C implementation of the `datetime` module is not available.

- gh-125854: Improve error messages for invalid category in `warnings.warn()`.

- gh-137729: `locale.setlocale()` now supports language codes with `@`-modifiers. `@`-modifier are no longer silently removed in `locale.getlocale()`, but included in the language code.

- gh-73487: Speedup processing arguments (up to 1.5x) in the `decimal` module methods, that now using `METH_FASTCALL` calling convention. Patch by Sergey B Kirpichev.

- gh-137634: Calendar pages generated by the `calendar.HTMLCalendar` class now support dark mode and have been migrated to the HTML5 standard for improved accessibility.

- gh-137630: The `_interpreters` module now uses Argument Clinic to parse arguments. Patch by Adam Turner.

- gh-137583: Fix a deadlock introduced in 3.13.6 when a call to `ssl.SSLSocket.recv` was blocked in one thread, and then another method on the object (such as `ssl.SSLSocket.send`) was subsequently called in another thread.

- gh-92936: Update regex used by `http.cookies.SimpleCookie` to handle values containing double quotes.

- gh-137426: Remove the code deprecation of `importlib.abc.ResourceLoader`. It is documented as deprecated, but left for backwards compatibility with other classes in `importlib.abc`.

- gh-137490: Handle `ECANCELED` in the same way as `EINTR` in `signal.sigwaitinfo()` on NetBSD.

- gh-137512: Add new constants in the `resource` module: `RLIMIT_NTHR`, `RLIMIT_UMTXP`, `RLIMIT_PIPEBUF`, `RLIMIT_THREADS`, `RLIM_SAVED_CUR`, and `RLIM_SAVED_MAX`.

- gh-137044: `resource.RLIM_INFINITY` is now always a positive integer. On all supported platforms, it is larger than any limited resource value, which simplifies comparison of the resource values. Previously, it could be negative, such as -1 or -3, depending on platform.

- gh-137477: Fix `inspect.getblock()`, `inspect.getsourcelines()` and `inspect.getsource()` for generator expressions.

- gh-137481: Calendar uses the lengths of the locale’s weekdays to decide if the width requires abbreviation.

- gh-137466: Remove undocumented `glob.glob0()` and `glob.glob1()` functions, which have been deprecated since Python 3.13. Use `glob.glob()` and pass a directory to its *root_dir* argument instead.

- gh-137044: Return large limit values as positive integers instead of negative integers in `resource.getrlimit()`. Accept large values and reject negative values (except `RLIM_INFINITY`) for limits in `resource.setrlimit()`.

- gh-115766: Fix `ipaddress.IPv4Interface.is_unspecified`.

- gh-75989: `tarfile.TarFile.extractall()` and `tarfile.TarFile.extract()` now overwrite symlinks when extracting hardlinks. (Contributed by Alexander Enrique Urieles Nieto in gh-75989.)

- gh-137017: Fix `threading.Thread.is_alive` to remain `True` until the underlying OS thread is fully cleaned up. This avoids false negatives in edge cases involving thread monitoring or premature `threading.Thread.is_alive` calls.

- gh-137273: Fix debug assertion failure in `locale.setlocale()` on Windows.

- gh-137191: Fix how type parameters are collected, when `typing.Protocol` are specified with explicit parameters. Now, `typing.Generic` and `typing.Protocol` always dictate the parameter number and parameter ordering of types. Previous behavior was a bug.

- gh-137282: Fix tab completion and `dir()` on `concurrent.futures`.

- gh-137257: Bump the version of pip bundled in ensurepip to version 25.2

- gh-137239: `heapq`: Update `heapq.__all__` with `*_max` functions.

- gh-124503: `ast.literal_eval()` is 10-20% faster for small inputs.

- gh-137226: Fix behavior of `annotationlib.ForwardRef.evaluate()` when the *type_params* parameter is passed and the name of a type param is also present in an enclosing scope.

- gh-137197: `SSLContext` objects can now set TLS 1.3 cipher suites via `set_ciphersuites()`.

- gh-81325: `tarfile.TarFile` now accepts a path-like when working on a tar archive. (Contributed by Alexander Enrique Urieles Nieto in gh-81325.)

- gh-137185: Fix a potential async-signal-safety issue in `faulthandler` when printing C stack traces.

- gh-133951: Remove lib64-lib symlink creation when creating new virtual environments in `venv` module

- gh-130522: Fix unraisable `TypeError` raised during interpreter shutdown in the `threading` module.

- gh-137059: Fix handling of file URLs with a Windows drive letter in the URL authority by `urllib.request.url2pathname()`. This fixes a regression in earlier pre-releases of Python 3.14.

- gh-136980: Remove unused C tracing code in bdb for event type `c_call`, `c_return` and `c_exception`

- gh-130577: `tarfile` now validates archives to ensure member offsets are non-negative. (Contributed by Alexander Enrique Urieles Nieto in gh-130577.)

- gh-136170: Removed the unreleased `zipfile.ZipFile.data_offset` property added in 3.14.0a7 as it wasn’t fully clear which behavior it should have in some situations so the result was not always what a user might expect.

- gh-121237: Support `%:z` directive for `datetime.datetime.strptime()`, `datetime.time.strptime()` and `time.strptime()`. Patch by Lucas Esposito and Semyon Moroz.

- gh-136929: Ensure that hash functions guaranteed to be always *available* exist as attributes of `hashlib` even if they will not work at runtime due to missing backend implementations. For instance, `hashlib.md5` will no longer raise `AttributeError` if OpenSSL is not available and Python has been built without MD5 support. Patch by Bénédikt Tran.

- gh-124621: pyrepl now works in Emscripten.

- gh-136914: Fix retrieval of `doctest.DocTest.lineno` for objects decorated with `functools.cache()` or `functools.cached_property`.

- gh-136912: `hmac.digest()` now properly handles large keys and messages by falling back to the pure Python implementation when necessary. Patch by Bénédikt Tran.

- gh-83424: Allows creating a `ctypes.CDLL` without name when passing a handle as an argument.

- gh-135228: When `dataclasses` replaces a class with a slotted dataclass, the original class can now be garbage collected again. Earlier changes in Python 3.14 caused this class to always remain in existence together with the replacement class synthesized by `dataclasses`.

- gh-136874: Discard URL query and fragment in `urllib.request.url2pathname()`.

- gh-136787: `hashlib`: improve exception messages when a hash algorithm is not recognized, blocked by the current security policy or incompatible with the desired operation (for instance, using HMAC with SHAKE). Patch by Bénédikt Tran.

- gh-130645: Enable color help by default in `argparse`.

- gh-131724: In `http.client`, a new *max_response_headers* keyword-only parameter has been added to `HTTPConnection` and `HTTPSConnection` constructors. This parameter sets the maximum number of allowed response headers, helping to prevent denial-of-service attacks.

- gh-135427: With `-Werror`, the DeprecationWarning emitted by `os.fork()` and `os.forkpty()` in mutli-threaded processes is now raised as an exception. Previously it was silently ignored. Patch by Rani Pinchuk.

- gh-136234: Fix `asyncio.WriteTransport.writelines()` to be robust to connection failure, by using the same behavior as `write()`.

- gh-53144: `encodings.aliases`: Add `latin_N` aliases

- gh-136669: `_asyncio` is now statically linked for improved performance.

- gh-136134: `SMTP.auth_cram_md5()` now raises an `SMTPException` instead of a `ValueError` if Python has been built without MD5 support. In particular, `SMTP` clients will not attempt to use this method even if the remote server is assumed to support it. Patch by Bénédikt Tran.

- gh-136134: `IMAP4.login_cram_md5` now raises an `IMAP4.error` if CRAM-MD5 authentication is not supported. Patch by Bénédikt Tran.

- gh-136591: `_hashlib`: avoid using deprecated functions *ERR_func_error_string* and *EVP_MD_CTX_md* when using OpenSSL 3.0 and later. Patch by Bénédikt Tran.

- gh-136571: `datetime.date.fromisocalendar()` can now raise OverflowError for out of range arguments.

- gh-136549: Fix signature of `threading.excepthook()`.

- gh-136492: Expose **PEP 667**’s `FrameLocalsProxyType` in the `types` module.

- gh-83336: `utf8_sig` is now aliased to `encodings.utf_8_sig`

- gh-136523: Fix `wave.Wave_write` emitting an unraisable when open raises.

- gh-136507: Fix mimetypes CLI to handle multiple file parameters.

- gh-52876: Add missing `keepends` (default `True`) parameter to `codecs.StreamReaderWriter.readline()` and `codecs.StreamReaderWriter.readlines()`.

- gh-136470: Correct `concurrent.futures.InterpreterPoolExecutor`’s default thread name.

- gh-136476: Fix a bug that was causing the `get_async_stack_trace` function to miss some frames in the stack trace.

- gh-136434: Fix docs generation of `UnboundItem` in `concurrent.interpreters` when running with `-OO`.

- gh-136380: Raises `AttributeError` when accessing `concurrent.futures.InterpreterPoolExecutor` and subinterpreters are not available.

- gh-72327: Suggest using the system command prompt when `pip install` is typed into the REPL. Patch by Tom Viner, Richard Si, and Brian Schubert.

- gh-135953: Implement a new high-frequency runtime profiler that leverages the existing remote debugging functionality to collect detailed execution statistics from running Python processes. This tool is exposed in the `profile.sample` module and enables non-intrusive observation of production applications by attaching to already-running processes without requiring any code modifications, restarts, or special startup flags. The observer can perform extremely high-frequency sampling of stack traces and interpreter state, providing detailed runtime execution analysis of live applications.

- gh-136021: Make `type_params` parameter required in `typing._eval_type()` after a deprecation period for not providing this parameter. Also remove the `DeprecationWarning` for the old behavior.

- gh-136286: Fix pickling failures for protocols 0 and 1 for many objects related to subinterpreters.

- gh-136047: Fix issues with `typing` when the C implementation of `abc` is not available.

- gh-136316: Improve support for evaluating nested forward references in `typing.evaluate_forward_ref()`.

- gh-136306: `ssl` can now get and set groups used for key agreement.

- gh-136156: `tempfile.TemporaryFile()` no longer uses `os.O_EXCL` with `os.O_TMPFILE`, so it’s possible to use `linkat()` on the file descriptor. Patch by Victor Stinner.

- gh-133982: Update Python implementation of `io.BytesIO` to be thread safe.

- gh-136193: Improve `TypeError` error message, when richcomparing two `types.SimpleNamespace` objects.

- gh-136097: Fix potential infinite recursion and KeyError in `sysconfig --generate-posix-vars`.

- gh-85702: If `zoneinfo._common.load_tzdata` is given a package without a resource a `zoneinfo.ZoneInfoNotFoundError` is raised rather than a `PermissionError`. Patch by Victor Stinner.

- gh-90733: Improve error messages when reporting invalid parameters in `hashlib.scrypt()`. Patch by Bénédikt Tran.

- gh-134759: Fix `UnboundLocalError` in `email.message.Message.get_payload()` when the payload to decode is a `bytes` object. Patch by Kliment Lamonov.

- gh-136028: Fix parsing month names containing “İ” (U+0130, LATIN CAPITAL LETTER I WITH DOT ABOVE) in `time.strptime()`. This affects locales az_AZ, ber_DZ, ber_MA and crh_UA.

- gh-87135: Acquiring a `threading.Lock` or `threading.RLock` at interpreter shutdown will raise `PythonFinalizationError` if Python can determine that it would otherwise deadlock.

- gh-135995: In the palmos encoding, make byte `0x9b` decode to `›` (U+203A - SINGLE RIGHT-POINTING ANGLE QUOTATION MARK).

- gh-105456: Removed `sre_compile`, `sre_constants` and `sre_parse` modules.

- gh-53203: Fix `time.strptime()` for `%c` and `%x` formats on locales byn_ER, wal_ET and lzh_TW, and for `%X` format on locales ar_SA, bg_BG and lzh_TW.

- gh-135878: Fixes a crash of `types.SimpleNamespace` on free threading builds, when several threads were calling its `__repr__()` method at the same time.

- gh-135853: Add `math.fmax()` and `math.fmin()` to get the larger and smaller of two floating-point values. Patch by Bénédikt Tran.

- gh-135836: Fix `IndexError` in `asyncio.loop.create_connection()` that could occur when non-`OSError` exception is raised during connection and socket’s `close()` raises `OSError`.

- gh-135853: `math`: expose C99 `signbit()` function to determine whether the sign bit of a floating-point value is set. Patch by Bénédikt Tran.

- gh-134531: `hmac`: use the *EVP_MAC(3ssl)* interface for HMAC when Python is built with OpenSSL 3.0 and later instead of the deprecated *HMAC_CTX(3ssl)* interface. Patch by Bénédikt Tran.

- gh-135836: Fix `IndexError` in `asyncio.loop.create_connection()` that could occur when the Happy Eyeballs algorithm resulted in an empty exceptions list during connection attempts.

- gh-135855: Raise `TypeError` instead of `SystemError` when `_interpreters.set___main___attrs()` is passed a non-dict object. Patch by Brian Schubert.

- gh-135823: `netrc`: improve the error message when the security check for the ownership of the default configuration file `~/.netrc` fails. Patch by Bénédikt Tran.

- gh-135815: `netrc`: skip security checks if `os.getuid()` is missing. Patch by Bénédikt Tran.

- gh-135640: Address bug where it was possible to call `xml.etree.ElementTree.ElementTree.write()` on an ElementTree object with an invalid root element. This behavior blanked the file passed to `write` if it already existed.

- gh-90117: Speed up `pprint` for `list` and `tuple`.

- gh-135759: `hashlib`: reject negative digest lengths in OpenSSL-based SHAKE objects by raising a `ValueError`. Previously, negative lengths were implicitly rejected by raising a `MemoryError` or a `SystemError`. Patch by Bénédikt Tran.

- gh-123471: Make concurrent iterations over `itertools.chain` safe under free threading.

- gh-135645: Added `supports_isolated_interpreters` field to `sys.implementation`.

- gh-135646: Raise consistent `NameError` exceptions in `annotationlib.ForwardRef.evaluate()`

- gh-135557: Fix races on `heapq` updates and `list` reads on the free threaded build.

- gh-119180: Only fetch globals and locals if necessary in `annotationlib.get_annotations()`

- gh-135561: Fix a crash on DEBUG builds when an HACL* HMAC routine fails. Patch by Bénédikt Tran.

- gh-135386: Fix opening a `dbm.sqlite3` database for reading from read-only file or directory.

- gh-135444: Fix `asyncio.DatagramTransport.sendto()` to account for datagram header size when data cannot be sent.

- gh-65697: `configparser`’s error message when attempting to write an invalid key is now more helpful.

- gh-135497: Fix `os.getlogin()` failing for longer usernames on BSD-based platforms.

- gh-135487: Fix `reprlib.Repr.repr_int()` when given integers with more than `sys.get_int_max_str_digits()` digits. Patch by Bénédikt Tran.

- gh-135429: Fix the argument mismatch in `_lsprof` for `PY_THROW` event.

- gh-135368: Fix `unittest.mock.Mock` generation on `dataclasses.dataclass()` objects. Now all special attributes are set as it was before gh-124429.

- gh-135336: `json` now encodes strings up to 2.2x faster if they consist solely of characters that don’t require escaping.

- gh-135335: `multiprocessing`: Flush `stdout` and `stderr` after preloading modules in the `forkserver`.

- gh-126631: Fix `multiprocessing` `forkserver` bug which prevented `__main__` from being preloaded.

- gh-133967: Do not normalize `locale` name ‘C.UTF-8’ to ‘en_US.UTF-8’.

- gh-130870: Preserve `types.GenericAlias` subclasses in `typing.get_type_hints()`

- gh-135321: Raise a correct exception for values greater than 0x7fffffff for the `BINSTRING` opcode in the C implementation of `pickle`.

- gh-121914: Changed the names of the symbol tables for lambda expressions and generator expressions to “<lambda>” and “<genexpr>” respectively to avoid conflicts with user-defined names.

- gh-135276: Synchronized zipfile.Path with zipp 3.23, including improved performance of `zipfile.Path.open()` for non-reading modes, rely on `functools.cached_property()` to cache values on the instance. Rely on `save_method_args` to save the initialization method arguments. Fixed `.name`, `.stem` and other basename-based properties on Windows when working with a zipfile on disk.

- gh-135234: `hashlib`: improve exception messages when an OpenSSL function failed. When memory allocation fails on OpenSSL’s side, a `MemoryError` is raised instead of a `ValueError`. Patch by Bénédikt Tran.

- gh-135244: `uuid`: when the MAC address cannot be determined, the 48-bit node ID is now generated with a cryptographically-secure pseudo-random number generator (CSPRNG) as per **RFC 9562, §6.10.3**. This affects `uuid1()` and `uuid6()`.

- gh-135241: The `INT` opcode of the C accelerator `_pickle` module was updated to look only for “00” and “01” to push booleans onto the stack, aligning with the Python `pickle` module.

- gh-133934: Improve `sqlite3` CLI’s `.help` message.

- gh-135069: Fix the “Invalid error handling” exception in `encodings.idna.IncrementalDecoder` to correctly replace the ‘errors’ parameter.

- gh-130662: +Accept leading zeros in precision and width fields for +:class:`Decimal` formatting, for example `format(Decimal(1.25), '.016f')`.

- gh-130662: Accept leading zeros in precision and width fields for `Fraction` formatting, for example `format(Fraction(1, 3), '.016f')`.

- gh-135004: Rewrite and cleanup the internal `_blake2` module. Some exception messages were changed but their types were left untouched. Patch by Bénédikt Tran.

- gh-134953: Expand `_colorize` theme with `keyword_constant` and implement in repl.

- gh-134978: `hashlib`: Supporting the `string` keyword parameter in hash function constructors such as `new()` or the direct hash-named constructors such as `md5()` and `sha256()` is now deprecated and slated for removal in Python 3.19. Prefer passing the initial data as a positional argument for maximum backwards compatibility. Patch by Bénédikt Tran.

- gh-134970: Fix the “unknown action” exception in `argparse.ArgumentParser.add_argument_group()` to correctly replace the action class.

- gh-134718: By default, omit optional `Load()` values in `ast.dump()`.

- gh-134718: `ast.dump()` now only omits `None` and `[]` values if they are default values.

- gh-134939: Add the `concurrent.interpreters` module. See **PEP 734**.

- gh-108885: Run each example as a subtest in unit tests synthesized by `doctest.DocFileSuite()` and `doctest.DocTestSuite()`. Add the `doctest.DocTestRunner.report_skip()` method.

- gh-134885: Fix possible crash in the `compression.zstd` module related to setting parameter types. Patch by Jelle Zijlstra.

- gh-134857: Improve error report for `doctest`s run with `unittest`. Remove `doctest` module frames from tracebacks and redundant newline character from a failure message.

- gh-128840: Fix parsing long IPv6 addresses with embedded IPv4 address.

- gh-133579: `curses`: Consistently report failures of curses C API calls in module-level methods by raising a `curses.error`. This affects `assume_default_colors()`, `baudrate()`, `cbreak()`, `echo()`, `longname()`, `initscr()`, `nl()`, `raw()`, `termattrs()`, `termname()` and `unctrl()`. Patch by Bénédikt Tran.

- gh-133579: `curses.window.refresh()` and `curses.window.noutrefresh()` now raise a `TypeError` instead of `curses.error` when called with an incorrect number of arguments for pads. Patch by Bénédikt Tran.

- gh-133579: curses.window: Consistently report failures of curses C API calls in Window methods by raising a `curses.error`. This affects `addch()`, `addnstr()`, `addstr()`, `border()`, `box()`, `chgat()`, `getbkgd()`, `inch()`, `insstr()` and `insnstr()`. Patch by Bénédikt Tran.

- gh-134771: The `time_clockid_converter()` function now selects correct type for `clockid_t` on Cygwin which fixes a build error.

- gh-134637: Fix performance regression in calling a `ctypes` function pointer in free threading.

- gh-134696: Built-in HACL* and OpenSSL implementations of hash function constructors now correctly accept the same *documented* named arguments. For instance, `md5()` could be previously invoked as `md5(data=data)` or `md5(string=string)` depending on the underlying implementation but these calls were not compatible. Patch by Bénédikt Tran.

- gh-132710: If possible, ensure that `uuid.getnode()` returns the same result even across different processes. Previously, the result was constant only within the same process. Patch by Bénédikt Tran.

- gh-134531: `_hashlib`: Rename internal C functions for `_hashlib.HASH` and `_hashlib.HASHXOF` objects. Patch by Bénédikt Tran.

- gh-134698: Fix a crash when calling methods of `ssl.SSLContext` or `ssl.SSLSocket` across multiple threads.

- gh-134151: `email`: Fix `TypeError` in `email.utils.decode_params()` when sorting **RFC 2231** continuations that contain an unnumbered section.

- gh-134635: `zlib`: Allow to combine Adler-32 and CRC-32 checksums via `adler32_combine()` and `crc32_combine()`. Patch by Callum Attryde and Bénédikt Tran.

- gh-134657: `asyncio`: Remove some private names from `asyncio.__all__`.

- gh-134210: `curses.window.getch()` now correctly handles signals. Patch by Bénédikt Tran.

- gh-80334: `multiprocessing.freeze_support()` now checks for work on any “spawn” start method platform rather than only on Windows.

- gh-134582: Fix tokenize.untokenize() round-trip errors related to t-strings braces escaping

- gh-134580: Improved the styling of HTML diff pages generated by the `difflib.HtmlDiff` class, and migrated the output to the HTML5 standard.

- gh-134565: `unittest.doModuleCleanups()` no longer swallows all but first exception raised in the cleanup code, but raises a `ExceptionGroup` if multiple errors occurred.

- gh-134546: Ensure `pdb` remote debugging script is readable by remote Python process.

- gh-134451: Converted `asyncio.tools.CycleFoundException` from dataclass to a regular exception type.

- gh-114177: Fix `asyncio` to not close subprocess pipes which would otherwise error out when the event loop is already closed.

- gh-90871: Fixed an off by one error concerning the backlog parameter in `create_unix_server()`. Contributed by Christian Harries.

- gh-134323: Fix the `threading.RLock.locked()` method.

- gh-86802: Fixed asyncio memory leak in cancelled shield tasks. For shielded tasks where the shield was cancelled, log potential exceptions through the exception handler. Contributed by Christian Harries.

- gh-71189: Add support of the all-but-last mode in `os.path.realpath()`.

- gh-72902: Improve speed (x1.1-1.8) of the `Fraction` constructor for typical inputs (`float`’s, `Decimal`’s or strings).

- gh-134209: `curses`: The `curses.window.instr()` and `curses.window.getstr()` methods now allocate their internal buffer on the heap instead of the stack; in addition, the max buffer size is increased from 1023 to 2047.

- gh-88994: Change `datetime.datetime.now()` to half-even rounding for consistency with `datetime.datetime.fromtimestamp()`. Patch by John Keith Hohm.

- gh-80184: The default queue size is now `socket.SOMAXCONN` for `socketserver.TCPServer`.

- gh-132983: Add `compression.zstd` version information to `test.pythoninfo`.

- gh-134235: Updated tab completion on REPL to include builtin modules. Contributed by Tom Wang, Hunter Young

- gh-134152: Fixed `UnboundLocalError` that could occur during `email` header parsing if an expected trailing delimiter is missing in some contexts.

- gh-134152: `email`: Fix parsing of email message ID with invalid domain.

- gh-134168: `http.server`: Fix IPv6 address binding and `--directory` handling when using HTTPS.

- gh-62184: Remove import of C implementation of `io.FileIO` from Python implementation which has its own implementation

- gh-134087: Remove support for arbitrary positional or keyword arguments in the C implementation of `threading.RLock` objects. This was deprecated since Python 3.14. Patch by Bénédikt Tran.

- gh-134173: Speed up `asyncio` performance of transferring state from thread pool `concurrent.futures.Future` by up to 4.4x. Patch by J. Nick Koston.

- gh-133982: Emit `RuntimeWarning` in the Python implementation of `io` when the file-like object is not closed explicitly in the presence of multiple I/O layers.

- gh-133890: The `tarfile` module now handles `UnicodeEncodeError` in the same way as `OSError` when cannot extract a member.

- gh-134097: Fix interaction of the new REPL and `-X showrefcount` command line option.

- gh-133889: The generated directory listing page in `http.server.SimpleHTTPRequestHandler` now only shows the decoded path component of the requested URL, and not the query and fragment.

- gh-134098: Fix handling paths that end with a percent-encoded slash (`%2f` or `%2F`) in `http.server.SimpleHTTPRequestHandler`.

- gh-132124: On POSIX-compliant systems, `multiprocessing.util.get_temp_dir()` now ignores `TMPDIR` (and similar environment variables) if the path length of `AF_UNIX` socket files exceeds the platform-specific maximum length when using the forkserver start method. Patch by Bénédikt Tran.

- gh-134062: `ipaddress`: fix collisions in `__hash__()` for `IPv4Network` and `IPv6Network` objects.

- gh-134004: `shelve` as well as underlying `dbm.dumb` and `dbm.sqlite` now have `reorganize()` methods to recover unused free space previously occupied by deleted entries.

- gh-133970: Make `string.templatelib.Template` and `string.templatelib.Interpolation` generic.

- gh-71253: Raise `ValueError` in `open()` if *opener* returns a negative file-descriptor in the Python implementation of `io` to match the C implementation.

- gh-133960: Simplify and improve `typing.evaluate_forward_ref()`. It now no longer raises errors on certain invalid types. In several situations, it is now able to evaluate forward references that were previously unsupported.

- gh-133925: Make the private class `typing._UnionGenericAlias` hashable.

- gh-133604: Remove `platform.java_ver()` which was deprecated since Python 3.13.

- gh-133875: Removed deprecated `pathlib.PurePath.is_reserved()`. Use `os.path.isreserved()` to detect reserved paths on Windows.

- gh-133873: Remove the deprecated `getmark()`, `setmark()` and `getmarkers()` methods of the `Wave_read` and `Wave_write` classes, which were deprecated since Python 3.13. Patch by Bénédikt Tran.

- gh-133866: Remove the undocumented function `ctypes.SetPointerType()`, which has been deprecated since Python 3.13. Patch by Bénédikt Tran.

- gh-133823: Remove support for `TD = TypedDict("TD")` and `TD = TypedDict("TD", None)` calls for constructing `typing.TypedDict` objects with zero field. Patch by Bénédikt Tran.

- gh-125996: Fix thread safety of `collections.OrderedDict`. Patch by Kumar Aditya.

- gh-133817: Remove support for creating `NamedTuple` classes via the undocumented keyword argument syntax. Patch by Bénédikt Tran.

- gh-133653: Fix `argparse.ArgumentParser` with the *formatter_class* argument. Fix TypeError when *formatter_class* is a custom subclass of `HelpFormatter`. Fix TypeError when *formatter_class* is not a subclass of `HelpFormatter` and non-standard *prefix_char* is used. Fix support of colorizing when *formatter_class* is not a subclass of `HelpFormatter`.

- gh-133810: Remove `http.server.CGIHTTPRequestHandler` and `--cgi` flag from the **python -m http.server** command-line interface. They were deprecated in Python 3.13. Patch by Bénédikt Tran.

- gh-132641: Fixed a race in `functools.lru_cache()` under free-threading.

- gh-133783: Fix bug with applying `copy.replace()` to `ast` objects. Attributes that default to `None` were incorrectly treated as required for manually created AST nodes.

- gh-133684: Fix bug where `annotationlib.get_annotations()` would return the wrong result for certain classes that are part of a class hierarchy where `from __future__ import annotations` is used.

- gh-77057: Fix handling of invalid markup declarations in `html.parser.HTMLParser`.

- gh-130328: Speedup pasting in `PyREPL` on Windows in a legacy console. Patch by Chris Eibl.

- gh-133701: Fix bug where `typing.TypedDict` classes defined under `from __future__ import annotations` and inheriting from another `TypedDict` had an incorrect `__annotations__` attribute.

- gh-133656: Remove deprecated `zipimport.zipimporter.load_module()`. Use `zipimport.zipimporter.exec_module()` instead.

- gh-133722: Added a *color* option to `difflib.unified_diff()` that colors output similar to **git diff**.

- gh-133489: `random.getrandbits()` can now generate more that 231 bits. `random.randbytes()` can now generate more that 256 MiB.

- gh-133595: Clean up `sqlite3.Connection` APIs. All parameters of `sqlite3.connect()` except *database* are now keyword-only. The first three parameters of methods `create_function()` and `create_aggregate()` are now positional-only. The first parameter of methods `set_authorizer()`, `set_progress_handler()` and `set_trace_callback()` is now positional-only.

- gh-133581: Improve unparsing of t-strings in `ast.unparse()` and `from __future__ import annotations`. Empty t-strings now round-trip correctly and formatting in interpolations is preserved. Patch by Jelle Zijlstra.

- gh-133577: Add parameter `formatter` to `logging.basicConfig()`.

- gh-92897: Removed the `check_home` parameter from `sysconfig.is_python_build()`, deprecated since Python 3.12.

- gh-133551: Support t-strings (**PEP 750**) in `annotationlib`. Patch by Jelle Zijlstra.

- gh-133517: Remove `os.listdrives()`, `os.listvolumes()` and `os.listmounts()` in non Windows desktop builds since the underlying functionality is missing.

- gh-133439: Fix dot commands with trailing spaces are mistaken for multi-line SQL statements in the sqlite3 command-line interface.

- gh-133447: Add basic color to `sqlite3` CLI interface.

- gh-133253: Fix thread-safety issues in `linecache`.

- gh-133390: Support keyword completion in the `sqlite3` command-line interface and add `sqlite3.SQLITE_KEYWORDS` constant.

- gh-132493: Avoid accessing `__annotations__` unnecessarily in `inspect.signature()`.

- gh-133017: Improve the error message of `multiprocessing.sharedctypes.Array()`, `multiprocessing.sharedctypes.RawArray()`, `multiprocessing.sharedctypes.Value()` and `multiprocessing.sharedctypes.RawValue()` when an invalid typecode is passed. Patch by Tomas Roun

- gh-132813: Improve error messages for incorrect types and values of `csv.Dialect` attributes.

- gh-132969: Prevent the `ProcessPoolExecutor` executor thread, which remains running when `shutdown(wait=False)`, from attempting to adjust the pool’s worker processes after the object state has already been reset during shutdown. A combination of conditions, including a worker process having terminated abormally, resulted in an exception and a potential hang when the still-running executor thread attempted to replace dead workers within the pool.

- gh-132876: `ldexp()` on Windows doesn’t round subnormal results before Windows 11, but should. Python’s `math.ldexp()` wrapper now does round them, so results may change slightly, in rare cases of very small results, on Windows versions before 11.

- gh-133009: `xml.etree.ElementTree`: Fix a crash in `Element.__deepcopy__` when the element is concurrently mutated. Patch by Bénédikt Tran.

- gh-132908: Add `math.isnormal()` and `math.issubnormal()` functions. Patch by Sergey B Kirpichev.

- gh-95380: `fcntl.fcntl()` and `fcntl.ioctl()`: Remove the 1024 bytes limit on the size of not mutated bytes-like argument.

- gh-122781: Fix `%z` directive in `datetime.datetime.strptime()` to allow for no provided offset as was documented.

- gh-123471: Make concurrent iterations over `itertools.combinations` and `itertools.product` safe under free-threading.

- gh-127081: Fix libc thread safety issues with `dbm` by performing stateful operations in critical sections.

- gh-127081: Fix libc thread safety issues with `os` by replacing `getlogin` with `getlogin_r` re-entrant version.

- gh-127081: Fix libc thread safety issues with `pwd` by locking access to `getpwall`.

- gh-132551: Make `io.BytesIO` safe in free-threaded build.

- gh-107583: Fix `Flag` inversion when flag set has missing values (`IntFlag` still flips all bits); fix negative assigned values during flag creation (both `Flag` and `IntFlag` ignore missing values).

- gh-87790: Support underscore and comma as thousands separators in the fractional part for `Fraction`’s formatting. Patch by Sergey B Kirpichev.

- gh-87790: Support underscore and comma as thousands separators in the fractional part for `Decimal`’s formatting. Patch by Sergey B Kirpichev.

- gh-131884: Fix formatting issues in `json.dump()` when both *indent* and *skipkeys* are used.

- gh-131788: Make `ResourceTracker.send` from `multiprocessing` re-entrant safe

- gh-91349: Adjust default `compressionlevel=` to 6 (down from 9) in `gzip` and `tarfile`. It is the default level used by most compression tools and a better tradeoff between speed and performance.

- gh-131146: Fix `calendar.TextCalendar`, `calendar.HTMLCalendar`, and the `calendar` CLI to display month names in the nominative case by adding `calendar.standalone_month_name` and `calendar.standalone_month_abbr`, which provide month names and abbreviations in the grammatical form used when a month name stands by itself, if the locale supports it.

- gh-123471: Make concurrent iterations over `itertools.cycle` safe under free-threading.

- gh-130664: Handle corner-case for `Fraction`’s formatting: treat zero-padding (preceding the width field by a zero (`'0'`) character) as an equivalent to a fill character of `'0'` with an alignment type of `'='`, just as in case of `float`’s.

- gh-130999: Avoid exiting the new REPL and offer suggestions even if there are non-string candidates when errors occur.

- gh-88473: Implement a fast path for `datetime.date` objects in `datetime.date.today()` which results in a 5x performance gain while proper subclasses retain their previous performance.

- gh-126883: Add check that timezone fields are in range for `datetime.datetime.fromisoformat()` and `datetime.time.fromisoformat()`. Patch by Semyon Moroz.

- gh-125028: `functools.Placeholder` cannot be passed to `functools.partial()` as a keyword argument.

- gh-125843: If possible, indicate which `curses` C function or macro is responsible for raising a `curses.error` exception. Patch by Bénédikt Tran.

- gh-119109: `functools.partial()` calls are now faster when keyword arguments are used.

- gh-124033: `SimplePath` is now presented in `importlib.metadata.__all__`.

- gh-91216: `importlib.metadata` now raises a `KeyError` instead of returning `None` when a key is missing from the metadata.

- gh-120492: `importlib.metadata` now prioritizes valid dists to invalid dists when retrieving by name.

- gh-99631: The `shelve` module now accepts custom serialization and deserialization functions.

- gh-119186: Slightly speed up `os.walk()` by calling `os.path.join()` less often.

- gh-120170: Fix an issue in the `_pickle` extension module in which importing `multiprocessing` could change how pickle identifies which module an object belongs to, potentially breaking the unpickling of those objects.

- gh-118981: Fix potential hang in `multiprocessing.popen_spawn_posix` that can happen when the child proc dies early by closing the child fds right away.

- gh-105497: Fix flag mask inversion when unnamed flags exist.

- gh-99813: `ssl` now uses `SSL_sendfile` internally when it is possible (see `OP_ENABLE_KTLS`). The function sends a file more efficiently because it performs TLS encryption in the kernel to avoid additional context switches. Patch by Illia Volochii.

- gh-62824: Fix aliases for `iso8859_8` encoding. Patch by Dave Goncalves.

- gh-86155: `html.parser.HTMLParser.close()` no longer loses data when the `<script>` tag is not closed. Patch by Waylan Limberg.

- gh-78319: UTF8 support for the IMAP APPEND command has been made RFC compliant.

- gh-93334: Reraise `KeyError` as `ModuleNotFoundError` when `importlib.machinery.PathFinder.find_spec()` is called on a submodule without importing the parent (and without a `path` argument).

- gh-69426: Fix `html.parser.HTMLParser` to not unescape character entities in attribute values if they are followed by an ASCII alphanumeric or an equals sign.

- bpo-38735: Fix failure when importing a module from the root directory on unix-like platforms with sys.pycache_prefix set.

- bpo-45959: `pprint` can now pretty-print dict views.

- gh-84683: `zoneinfo`: Check in `<prefix>/share/zoneinfo` for data files on Windows

- bpo-43429: The `size()` method of the `mmap.mmap` class now returns the size of an anonymous mapping on both Unix and Windows. Previously, the size would be returned on Windows and an `OSError` would be raised on Unix. `ValueError` is now raised instead of `OSError` when `trackfd=False`.

- bpo-41839: Allow negative priority values from `os.sched_get_priority_min()` and `os.sched_get_priority_max()` functions.

- bpo-28494: Improve Zip file validation false positive rate in `zipfile.is_zipfile()`.

<!-- anchor: id141 | type: section -->
### IDLE

- gh-96491: Deduplicate version number in IDLE shell title bar after saving to a file.

- gh-139742: Colorize t-string prefixes for template strings in IDLE, as done for f-string prefixes.

<!-- anchor: id142 | type: section -->
### Documentation

- gh-136155: We are now checking for fatal errors in EPUB builds in CI.

- gh-135171: Document that the iterator for the leftmost `for` clause in the generator expression is created immediately.

- bpo-45210: Document that error indicator may be set in tp_dealloc, and how to avoid clobbering it.

<!-- anchor: id143 | type: section -->
### Core and Builtins

- gh-140000: Fix potential memory leak when a reference cycle exists between an instance of `typing.TypeAliasType`, `typing.TypeVar`, `typing.ParamSpec`, or `typing.TypeVarTuple` and its `__name__` attribute. Patch by Mikhail Efimov.

- gh-140009: Improve performance of list extension by dictionary items.

- gh-139988: Fix a memory leak when failing to create a `Union` type. Patch by Bénédikt Tran.

- gh-139748: Fix reference leaks in error branches of functions accepting path strings or bytes such as `compile()` and `os.system()`. Patch by Bénédikt Tran.

- gh-139516: Fix lambda colon erroneously start format spec in f-string in tokenizer.

- gh-63161: Support non-UTF-8 shebang and comments in Python source files if non-UTF-8 encoding is specified. Detect decoding error in comments for default (UTF-8) encoding. Show the line and position of decoding error for default encoding in a traceback. Show the line containing the coding cookie when it conflicts with the BOM in a traceback.

- gh-139116: Prevent a deadlock when multiple threads start, stop and use `tracemalloc` simultaneously.

- gh-139275: Fix compilation problems in `_remote_debugging_module.c` when the system doesn’t have `process_vm_readv`. Patch by Pablo Galindo

- gh-133059: Increased the number of cached small positive integers from 256 to 1024.

- gh-74857: **PEP 538**: Coerce the POSIX locale to a UTF-8 based locale. Patch by Victor Stinner.

<!-- anchor: id144 | type: section -->
### Library

- gh-116738: Make `mmap` thread-safe on the free threaded build.

<!-- anchor: id145 | type: section -->
### Core and Builtins

- gh-138558: Fix handling of unusual t-string annotations in annotationlib. Patch by Dave Peck.

- gh-134466: Don’t run PyREPL in a degraded environment where setting termios attributes is not allowed.

- gh-138794: When a new tracing function is registered with `PyRefTracer_SetTracer()`, replacing the current a call to the trace function will be made with the object set to **NULL** and **event** set to `PyRefTracer_TRACKER_REMOVED`. This will happen just before the new function is registered. Patch by Pablo Galindo

- gh-71810: Raise `OverflowError` for `(-1).to_bytes()` for signed conversions when bytes count is zero. Patch by Sergey B Kirpichev.

- gh-138716: Improve `SyntaxError` message for `assert` in cases like `assert a := b`.

- gh-105487: Remove non-existent `__copy__()`, `__deepcopy__()`, and `__bases__` from the `__dir__()` entries of `types.GenericAlias`.

- gh-138192: Fix `contextvars` initialization so that all subinterpreters are assigned the `MISSING` value.

- gh-138479: Fix a crash when a generic object’s `__typing_subst__` returns an object that isn’t a `tuple`.

- gh-138431: Fix a bug in the JIT optimizer when round-tripping strings and tuples.

- gh-138378: Move the globals-to-const JIT optimizer pass into to the main JIT optimizer pass

<!-- anchor: id146 | type: section -->
### Library

- gh-138401: Add missing validation of argument `count` in `os.sendfile()` to be non-negative.

<!-- anchor: id147 | type: section -->
### Core and Builtins

- gh-138372: Fix `SyntaxWarning` emitted for erroneous subscript expressions involving template string literals. Patch by Brian Schubert.

- gh-138302: `BINARY_OP` now specializes to `BINARY_OP_ADD_INT`, `BINARY_OP_SUBTRACT_INT` or `BINARY_OP_MULTIPLY_INT` if operands are compact ints.

- gh-138318: The default REPL now avoids highlighting built-in names (for instance `set` or `format()`) when they are used as attribute names (for instance in `value.set` or `text.format`).

- gh-138349: Fix crash in certain cases where a module contains both a module-level annotation and a comprehension.

- gh-69605: Fix some standard library submodules missing from the REPL auto-completion of imports.

- gh-61206: `zipimport` now supports zstandard compressed zip file entries.

<!-- anchor: id148 | type: section -->
### Library

- gh-116738: Make `cProfile` thread-safe on the free threaded build.

<!-- anchor: id149 | type: section -->
### Core and Builtins

- gh-137838: Fix JIT trace buffer overrun by increasing possible exit stubs. Patch by Donghee Na.

- gh-71679: Use the same quoting algorithm for the repr of bytearrays as for bytes objects and strings – use double quotes for quoting if the bytearray contains single quotes and does not contain double quotes.

- gh-137384: Fix a crash when using the `warnings` module in a finalizer at shutdown. Patch by Kumar Aditya.

<!-- anchor: id150 | type: section -->
### Library

- gh-138004: On Solaris/Illumos platforms, thread names are now encoded as ASCII to avoid errors on systems (e.g. OpenIndiana) that don’t support non-ASCII names.

- gh-137976: Removed `localtime` from the list of reported system timezones.

<!-- anchor: id151 | type: section -->
### Core and Builtins

- gh-137992: Ensure that `PyRefTracer_SetTracer()` sync with all existing threads when called to avoid races in the free threaded build. Patch by Pablo Galindo

- gh-137967: Show error suggestions on nested attribute access. Patch by Pablo Galindo

- gh-137959: Replace the shim code added to every piece of jitted code with a single trampoline function.

- gh-137883: Fix runaway recursion when calling a function with keyword arguments.

- gh-137079: Fix keyword typo recognition when parsing files. Patch by Pablo Galindo.

- gh-137728: Fix the JIT’s handling of many local variables. This previously caused a segfault.

- gh-137716: Fix double period in `AttributeError` message for invalid mock assertions

- gh-137433: Fix a potential deadlock in the free threading build when daemon threads enable or disable profiling or tracing while the main thread is shutting down the interpreter.

- gh-137576: Fix for incorrect source code being shown in tracebacks from the Basic REPL when `PYTHONSTARTUP` is given. Patch by Adam Hartz.

- gh-37817: Allow assignment to `__bases__` of direct subclasses of builtin classes.

- gh-132732: Optimize `_COMPARE_OP`, `_CONTAINS_OP`, `_UNARY_NEGATIVE`, `_UNARY_NOT`, and `_UNARY_INVERT` in JIT builds with constant-loading uops (`_POP_TWO_LOAD_CONST_INLINE_BORROW` and `_POP_TOP_LOAD_CONST_INLINE_BORROW`), and then remove both to reduce instruction count.

- gh-137400: Fix a crash in the free threading build when disabling profiling or tracing across all threads with `PyEval_SetProfileAllThreads()` or `PyEval_SetTraceAllThreads()` or their Python equivalents `threading.settrace_all_threads()` and `threading.setprofile_all_threads()`.

- gh-133143: Add `sys.abi_info` object to make ABI information more easily accessible.

- gh-137400: Fix a crash in the free threading build when disabling profiling or tracing across all threads with `PyEval_SetProfileAllThreads()` or `PyEval_SetTraceAllThreads()` or their Python equivalents `threading.settrace_all_threads()` and `threading.setprofile_all_threads()`.

- gh-120037: Disable user site packages directory when a `._pth` file is used, even if it contains `import site`.

- gh-58124: Fix name of the Python encoding in Unicode errors of the code page codec: use “cp65000” and “cp65001” instead of “CP_UTF7” and “CP_UTF8” which are not valid Python code names. Patch by Victor Stinner.

- gh-136966: The `object.__dict__` and `__weakref__` descriptors now use a single descriptor instance per interpreter, shared across all types that need them. This speeds up class creation, and helps avoid reference cycles.

- gh-137314: Fixed a regression where raw f-strings incorrectly interpreted escape sequences in format specifications. Raw f-strings now properly preserve literal backslashes in format specs, matching the behavior from Python 3.11. For example, `rf"{obj:\xFF}"` now correctly produces `'\\xFF'` instead of `'ÿ'`. Patch by Pablo Galindo.

- gh-137308: A standalone docstring in a node body is optimized as a `pass` statement to ensure that the node’s body is never empty. There was a `ValueError` in `compile()` otherwise.

- gh-137288: Fix bug where some bytecode instructions of a boolean expression are not associated with the correct exception handler.

- gh-137291: The perf profiler can now be used if a previous frame evaluation API has been provided.

- gh-134291: Remove some newer macOS API usage from the JIT compiler in order to restore compatibility with older OSX 10.15 deployment targets.

- gh-88886: The codecs lookup function now again performs only minimal normalization of the encoding name before passing it to the search functions: all ASCII letters are converted to lower case, spaces are replaced with hyphens. This restores the pre-Python 3.9 behavior.

- gh-131338: Disable computed stack limit checks on non-glibc linux platforms to fix crashes on deep recursion.

- gh-136870: Fix data races while de-instrumenting bytecode of code objects running concurrently in threads.

- gh-132732: Optimize constant comparison for `_COMPARE_OP_INT`, `_COMPARE_OP_FLOAT` and `_COMPARE_OP_STR` in JIT builds

- gh-127598: Improve `ModuleNotFoundError` by adding flavour text to the exception when the `-S` option is passed. Patch by Andrea Mattei.

- gh-136801: Fix PyREPL syntax highlighting on match cases after multi-line case. Contributed by Olga Matoula.

- gh-74185: The `__repr__()` of `ImportError` and `ModuleNotFoundError` now shows “name” and “path” as `name=<name>` and `path=<path>` if they were given as keyword arguments at construction time. Patch by Serhiy Storchaka, Oleg Iarygin, and Yoav Nir

<!-- anchor: id152 | type: section -->
### Library

- gh-116738: Make functions in `syslog` thread-safe on the free threaded build.

- gh-116738: Make functions in `pwd` thread-safe on the free threaded build.

<!-- anchor: id153 | type: section -->
### Core and Builtins

- gh-136616: Improve `SyntaxError` error messages for invalid `assert` usages.

- gh-136599: Improve performance of `int` hash calculations.

<!-- anchor: id154 | type: section -->
### Library

- gh-136421: Fix crash when initializing `datetime` concurrently.

<!-- anchor: id155 | type: section -->
### Core and Builtins

- gh-136541: Fix some issues with the perf trampolines on x86-64 and aarch64. The trampolines were not being generated correctly for some cases, which could lead to the perf integration not working correctly. Patch by Pablo Galindo.

<!-- anchor: id156 | type: section -->
### Library

- gh-107545: Improve the error messages that may be raised by `setsockopt()`.

<!-- anchor: id157 | type: section -->
### Core and Builtins

- gh-136517: Fixed a typo that prevented printing of uncollectable objects when the `gc.DEBUG_UNCOLLECTABLE` mode was set.

- gh-136525: Fix issue where per-thread bytecode was not instrumented for newly created threads.

- gh-132657: Improve performance of `frozenset` by removing locks in the free-threading build.

- gh-136459: Add support for perf trampoline on macOS, to allow profilers wit JIT map support to read Python calls. While profiling, `PYTHONPERFSUPPORT=1` can be appended to enable the trampoline.

- gh-132661: `Interpolation.expression` now has a default, the empty string.

- gh-132661: Reflect recent **PEP 750** change.

  Disallow concatenation of `string.templatelib.Template` and `str`. Also, disallow implicit concatenation of t-string literals with string or f-string literals.

- gh-91636: While performing garbage collection, clear weakrefs to unreachable objects that are created during running of finalizers. If those weakrefs were are not cleared, they could reveal unreachable objects.

- gh-136355: Deprecate `-b` and `-bb` command line options and schedule them to become no-op in Python 3.17.

- gh-109700: Fix memory error handling in `PyDict_SetDefault()`.

- gh-135552: Fix a bug caused by the garbage collector clearing weakrefs too early. The weakrefs in the `tp_subclasses` dictionary are needed in order to correctly invalidate type caches (for example, by calling `PyType_Modified()`). Clearing weakrefs before calling finalizers causes the caches to not be correctly invalidated. That can cause crashes since the caches can refer to invalid objects. Defer the clearing of weakrefs without callbacks until after finalizers are executed.

- gh-136203: Improve `TypeError` error message, when richcomparing two `types.MappingProxyType` objects.

- gh-136003: Fix `threading.Thread` objects becoming incorrectly daemon when created from an `atexit` callback or a pending call (`Py_AddPendingCall()`).

- gh-78465: Fix error message for `cls.__new__(cls, ...)` where `cls` is not instantiable builtin or extension type (with `tp_new` set to `NULL`).

- gh-135904: Perform more aggressive control-flow optimizations on the machine code templates emitted by the experimental JIT compiler.

- gh-129958: Differentiate between t-strings and f-strings in syntax error for newlines in format specifiers of single-quoted interpolated strings.

- gh-135871: Non-blocking mutex lock attempts now return immediately when the lock is busy instead of briefly spinning in the free threading build.

- gh-134584: Specialize `POP_TOP` in the JIT compiler by specializing for reference lifetime and type. This will also enable easier top of stack caching in the JIT compiler.

- gh-135106: Restrict the trashcan mechanism to GC’ed objects and untrack them while in the trashcan to prevent the GC and trashcan mechanisms conflicting.

- gh-135379: Changes specialization of `BINARY_OP` for ints to only specialize for “compact” ints. This streamlines the fast path at the cost of fewer specializations when very large integers are used.

- gh-135607: Fix potential `weakref` races in an object’s destructor on the free threaded build.

- gh-135608: Fix a crash in the JIT involving attributes of modules.

- gh-82088: Improve performance of `PyLongObject` conversion functions `PyLong_AsLongAndOverflow()`, `PyLong_AsSsize_t()`, `PyLong_AsUnsignedLong()`, `PyLong_AsSize_t()`, `PyLong_AsUnsignedLongMask()`, `PyLong_AsUnsignedLongLongMask()`, `PyLong_AsLongLongAndOverflow()` for integers larger than 2**30 up to 30%.

- gh-135551: Sorting randomly ordered lists will often run a bit faster, thanks to a new scheme for picking minimum run lengths from Stefan Pochmann, which arranges for the merge tree to be as evenly balanced as is possible.

- gh-135543: Emit `sys.remote_exec` audit event when `sys.remote_exec()` is called and migrate `remote_debugger_script` to `cpython.remote_debugger_script`.

- gh-135496: Fix typo in the f-string conversion type error (“exclamanation” -> “exclamation”).

- gh-135474: Specialize integer operations only on compact integers. This is a CPython internal change.

- gh-135371: Fixed `asyncio` debugging tools to properly display internal coroutine call stacks alongside external task dependencies. The `python -m asyncio ps` and `python -m asyncio pstree` commands now show complete execution context. Patch by Pablo Galindo.

- gh-135422: Fix regression in `SyntaxError` messages after gh-134036.

<!-- anchor: id158 | type: section -->
### Library

- gh-116738: Make functions in `grp` thread-safe on the free threaded build.

- gh-127319: Set the `allow_reuse_port` class variable to `False` on the XMLRPC, logging, and HTTP servers. This matches the behavior in prior Python releases, which is to not allow port reuse.

<!-- anchor: id159 | type: section -->
### Core and Builtins

- gh-130077: Properly raise custom syntax errors when incorrect syntax containing names that are prefixes of soft keywords is encountered. Patch by Pablo Galindo.

- gh-131798: Optimize _CALL_LEN in the JIT when the length is known. Patch by Tomas Roun

- gh-131798: Optimize `_UNARY_NEGATIVE` in JIT-compiled code.

- gh-135148: Fixed a bug where f-string debug expressions (using =) would incorrectly strip out parts of strings containing escaped quotes and # characters. Patch by Pablo Galindo.

- gh-131798: Optimize `_UNARY_INVERT` in JIT-compiled code.

- gh-131798: Optimize away `_CALL_TYPE_1` in the JIT when the return type is known. Patch by Tomas Roun

- gh-133136: Limit excess memory usage in the free threading build when a large dictionary or list is resized and accessed by multiple threads.

- gh-131798: Optimize `_CHECK_METHOD_VERSION` into `_CHECK_FUNCTION_VERSION_INLINE` in JIT-compiled code.

<!-- anchor: id160 | type: section -->
### Library

- gh-116738: Make methods in `heapq` thread-safe on the free threaded build.

<!-- anchor: id161 | type: section -->
### Core and Builtins

- gh-134280: Disable constant folding for `~` with a boolean argument. This moves the deprecation warning from compile time to runtime.

- gh-134876: Add support to **PEP 768** remote debugging for Linux kernels which don’t have CONFIG_CROSS_MEMORY_ATTACH configured.

- gh-134889: Fix handling of a few opcodes that leave operands on the stack when optimizing `LOAD_FAST`.

<!-- anchor: id162 | type: section -->
### Library

- gh-134908: Fix crash when iterating over lines in a text file on the free threaded build.

<!-- anchor: id163 | type: section -->
### Core and Builtins

- gh-117852: Fix argument checking of `athrow()`.

- gh-132617: Fix `dict.update()` modification check that could incorrectly raise a “dict mutated during update” error when a different dictionary was modified that happens to share the same underlying keys object.

- gh-131798: Allow the JIT to remove unnecessary `_ITER_CHECK_TUPLE` ops.

- gh-134679: Fix crash in the free threading build’s QSBR code that could occur when changing an object’s `__dict__` attribute.

- gh-133912: Fix the C API function `PyObject_GenericSetDict` to handle extension classes with inline values.

- gh-131798: Make the JIT optimizer understand that slicing a string/list/tuple returns the same type.

- gh-134584: Add a reference count elimination pass to the JIT compiler. Patch by Ken Jin.

- gh-131798: Optimize `_POP_CALL_TWO_LOAD_CONST_INLINE_BORROW`.

<!-- anchor: id164 | type: section -->
### Library

- gh-134381: Fix `RuntimeError` when using a not-started `threading.Thread` after calling `os.fork()`

<!-- anchor: id165 | type: section -->
### Core and Builtins

- gh-127960: PyREPL interactive shell no longer starts with `__package__` and `__file__` global names set to `_pyrepl` package internals. Contributed by Yuichiro Tachibana.

- gh-130397: Remove special-casing for C stack depth limits for WASI. Due to WebAssembly’s built-in stack protection this does not pose a security concern.

- gh-131798: JIT: replace `_LOAD_SMALL_INT` with `_LOAD_CONST_INLINE_BORROW`

- gh-131798: Improve the JIT’s ability to optimize away cached class attribute and method loads.

- gh-128066: Fixes an edge case where PyREPL improperly threw an error when Python is invoked on a read only filesystem while trying to write history file entries.

- gh-131798: Improve the JIT’s ability to narrow unknown classes to constant values.

- gh-134268: Add `_POP_CALL_TWO_LOAD_CONST_INLINE_BORROW` and use it to further optimize `CALL_ISINSTANCE`.

- gh-131798: Split `CALL_LIST_APPEND` into several uops. Patch by Diego Russo.

- gh-69605: When auto-completing an import in the REPL, finding no candidates now issues no suggestion, rather than suggestions from the current namespace.

- gh-134170: Add colorization to `sys.unraisablehook()` by default.

- gh-91153: Fix a crash when a `bytearray` is concurrently mutated during item assignment.

- gh-134158: Fix coloring of double braces in f-strings and t-strings in the REPL.

- gh-134119: Fix crash when calling `next()` on an exhausted template string iterator. Patch by Jelle Zijlstra.

- gh-134100: Fix a use-after-free bug that occurs when an imported module isn’t in `sys.modules` after its initial import. Patch by Nico-Posada.

- gh-134036: Improve `SyntaxError` message when using invalid `raise` statements.

- gh-133999: Fix `SyntaxError` regression in `except` parsing after gh-123440.

- gh-133886: Fix `sys.remote_exec()` for non-ASCII paths in non-UTF-8 locales and non-UTF-8 paths in UTF-8 locales.

- gh-133400: Fixed Ctrl+D (^D) behavior in _pyrepl module to match old pre-3.13 REPL behavior.

- gh-133703: Fix hashtable in dict can be bigger than intended in some situations.

- gh-133778: Fix bug where assigning to the `__annotations__` attributes of classes defined under `from __future__ import annotations` had no effect.

- gh-133711: Implement **PEP 686**: Enable Python UTF-8 Mode by default. Patch by Adam Turner.

- gh-132762: `fromkeys()` no longer loops forever when adding a small set of keys to a large base dict. Patch by Angela Liss.

- gh-133541: Inconsistent indentation in user input crashed the new REPL when syntax highlighting was active. This is now fixed.

- gh-133516: Raise `ValueError` when constants `True`, `False` or `None` are used as an identifier after NFKC normalization.

- gh-131798: Allow the JIT to remove int guards after `_GET_LEN` by setting the return type to int.

- gh-131798: Split `CALL_ISINSTANCE` into several uops, allowing the JIT to remove some of them.

- gh-132554: Change iteration to use “virtual iterators” for sequences. Instead of creating an iterator, a tagged integer representing the next index is pushed to the stack above the iterable. For non-sequence iterators, `NULL` is pushed.

- gh-130821: Enhance wrong type error messages and make them more consistent. Patch by Semyon Moroz.

- gh-131798: Narrow the return type and constant-evaluate `CALL_ISINSTANCE` for a subset of known values in the JIT. Patch by Tomas Roun

- gh-132542: Update `Thread.native_id` after *fork(2)* to ensure accuracy. Patch by Noam Cohen.

<!-- anchor: id166 | type: section -->
### Library

- gh-132732: Automatically constant evaluate bytecode operations marked as pure in the JIT optimizer.

<!-- anchor: id167 | type: section -->
### Core and Builtins

- gh-127971: Fix off-by-one read beyond the end of a string in string search.

- gh-132042: Improve class creation times by up to 12% by pre-computing type slots just once. Patch by Sergey Miryanov.

- gh-133379: Correct usage of *arguments* in error messages.

- gh-127266: In the free-threaded build, avoid data races caused by updating type slots or type flags after the type was initially created. For those (typically rare) cases, use the stop-the-world mechanism. Remove the use of atomics when reading or writing type flags. The use of atomics is not sufficient to avoid races (since flags are sometimes read without a lock and without atomics) and are no longer required.

- gh-130425: Add `"Did you mean: 'attr'?"` suggestion when using `del obj.attr` if `attr` does not exist.

- gh-128640: Fix a crash when using threads inside of a subinterpreter.

<!-- anchor: id168 | type: section -->
### Library

- gh-116738: Make the module `json` safe to use under the free-threading build.

<!-- anchor: id169 | type: section -->
### Core and Builtins

- gh-119494: Exception text when trying to delete attributes of types was clarified.

<!-- anchor: id170 | type: section -->
### C API

- gh-139924: Function watchers can now receive a PyFunction_PYFUNC_EVENT_MODIFY_QUALNAME event when a watched functions qualname is changed.

- gh-111489: Add `PyTuple_FromArray()` to create a `tuple` from an array. Patch by Victor Stinner.

- gh-136355: Deprecate `PyConfig.bytes_warning` field and schedule its removal in 3.17.

- gh-138886: Remove deprecated `PySys_ResetWarnOptions()` C-API function.

- gh-129813: Implement **PEP 782**, the `PyBytesWriter` API. Add functions:

  - `PyBytesWriter_Create()`

  - `PyBytesWriter_Discard()`

  - `PyBytesWriter_FinishWithPointer()`

  - `PyBytesWriter_FinishWithSize()`

  - `PyBytesWriter_Finish()`

  - `PyBytesWriter_Format()`

  - `PyBytesWriter_GetData()`

  - `PyBytesWriter_GetSize()`

  - `PyBytesWriter_GrowAndUpdatePointer()`

  - `PyBytesWriter_Grow()`

  - `PyBytesWriter_Resize()`

  - `PyBytesWriter_WriteBytes()`

  Patch by Victor Stinner.

- gh-137956: Display and raise an exception if an extension compiled for non-free-threaded Python is loaded in a free-threaded interpreter.

- gh-137573: Mark `_PyOptimizer_Optimize` as `Py_NO_INLINE` to prevent stack overflow crashes on macOS.

- gh-128813: Functions `_Py_c_sum()`, `_Py_c_diff()`, `_Py_c_neg()`, `_Py_c_prod()`, `_Py_c_quot()`, `_Py_c_pow()` and previously undocumented `_Py_c_abs()` are soft deprecated. Deprecate also `cval` field of the `PyComplexObject` type. Patch by Sergey B Kirpichev.

- gh-137210: Add API for checking an extension module’s ABI compatibility: `Py_mod_abi`, `PyABIInfo_Check()`, `PyABIInfo_VAR` and `Py_mod_abi`.

- gh-136759: Rename `lock.h` to `pylock.h` to avoid potential include conflicts.

- gh-112068: Revert support of nullable arguments in `PyArg_Parse()`.

- gh-136006: On Solaris, the `Py_NAN` macro now expands to a `double` instead of a function address. Patch by Bénédikt Tran.

- gh-135075: Make `PyObject_SetAttr()` and `PyObject_SetAttrString()` fail if called with `NULL` value and an exception set. Patch by Victor Stinner.

- gh-135906: Fix compilation errors when compiling the internal headers with a C++ compiler.

- gh-133296: New variants for the critical section API that accept one or two `PyMutex` pointers rather than `PyObject` instances are now public in the non-limited C API.

- gh-133157: Remove the private, undocumented macro `_Py_NO_SANITIZE_UNDEFINED`.

- gh-134989: Fix `Py_RETURN_NONE`, `Py_RETURN_TRUE` and `Py_RETURN_FALSE` macros in the limited C API 3.11 and older: don’t treat `Py_None`, `Py_True` and `Py_False` as immortal. Patch by Victor Stinner.

- gh-134989: Implement `PyObject_DelAttr()` and `PyObject_DelAttrString()` as macros in the limited C API 3.12 and older. Patch by Victor Stinner.

- gh-134745: Change `PyThread_allocate_lock()` implementation to `PyMutex`. On Windows, `PyThread_acquire_lock_timed()` now supports the *intr_flag* parameter: it can be interrupted. Patch by Victor Stinner.

- gh-134891: Add `PyUnstable_Unicode_GET_CACHED_HASH` to get the cached hash of a string.

- gh-134009: Expose `PyMutex_IsLocked()` as part of the public C API.

- gh-134144: Fix crash when calling `Py_EndInterpreter()` with a thread state that isn’t the initial thread for the interpreter.

- gh-133968: Add `PyUnicodeWriter_WriteASCII()` function to write an ASCII string into a `PyUnicodeWriter`. The function is faster than `PyUnicodeWriter_WriteUTF8()`, but has an undefined behavior if the input string contains non-ASCII characters. Patch by Victor Stinner.

- gh-133644: Remove deprecated Python initialization getter functions `Py_Get*`. Patch by Bénédikt Tran.

- gh-133644: Remove deprecated function `PyWeakref_GetObject()` and macro `PyWeakref_GET_OBJECT`. Use `PyWeakref_GetRef()` instead. Patch by Bénédikt Tran.

- gh-133644: Remove deprecated alias `PyImport_ImportModuleNoBlock()` of `PyImport_ImportModule()`. Patch by Bénédikt Tran.

- gh-133610: Remove deprecated functions `PyUnicode_AsDecodedObject()`, `PyUnicode_AsDecodedUnicode()`, `PyUnicode_AsEncodedObject()`, and `PyUnicode_AsEncodedUnicode()`.

- gh-132629: For unsigned integer formats in `PyArg_ParseTuple()`, accepting Python integers with value that is larger than the maximal value for the C type or less than the minimal value for the corresponding signed integer type of the same size is now deprecated.

- gh-131185: `PyGILState_Ensure()` no longer crashes when called after interpreter finalization.

- gh-108512: Add functions `PySys_GetAttr()`, `PySys_GetAttrString()`, `PySys_GetOptionalAttr()` and `PySys_GetOptionalAttrString()`.

<!-- anchor: id171 | type: section -->
### Build

- gh-138489: When cross-compiling for WASI by `build_wasm` or `build_emscripten`, the `build-details.json` step is now included in the build process, just like with native builds.

  This fixes the `libinstall` task which requires the `build-details.json` file during the process.

- gh-138497: The LLVM version used by the JIT at build time can now be modified using the `LLVM_VERSION` environment variable. Use this at your own risk, as there is only one officially supported LLVM version. For more information, please check `Tools/jit/README.md`.

- gh-95952: When cross-compiling for WASI, require that the HOSTRUNNER environment variable be explicitly set.

  This was needed as macOS lacks the appropriate CLI tools to set a reasonable default.

- gh-138061: Ensure reproducible builds by making JIT stencil header generation deterministic.

- gh-128042: `./configure` now warns when `--enable-optimizations` and `CFLAGS=-O0` are both set, suggesting removing `-O0` from `CFLAGS` for optimal performance. Patch by Taegyun Kim.

- gh-132339: Add support for OpenSSL 3.5.

- gh-135621: PyREPL no longer depends on the `curses` standard library. Contributed by Łukasz Langa.

- gh-135927: Fix building with MSVC when passing option `/std:clatest`.

- gh-119132: Remove “experimental” tag from the CPython free-threading build.

- gh-135497: Fix the detection of `MAXLOGNAME` in the `configure.ac` script.

- gh-134923: Windows builds with profile-guided optimization enabled now use `/GENPROFILE` and `/USEPROFILE` instead of deprecated `/LTCG:` options.

- gh-134632: Fixed `build-details.json` generation to use `INCLUDEPY`, in order to reference the `pythonX.Y` subdirectory of the include directory, as required in **PEP 739**, instead of the top-level include directory.

- gh-134486: The `ctypes` module now performs a more portable test for the definition of *alloca(3)*, fixing a compilation failure on NetBSD.

- gh-134455: Fixed `build-details.json` generation to use the correct `c_api.headers` as defined in **PEP 739**, instead of `c_api.include`.

- gh-134273: Add support for configuring compiler flags for the JIT with `CFLAGS_JIT`

- gh-115119: Removed implicit fallback to the bundled copy of the `libmpdec` library. Now this should be explicitly enabled via `--with-system-libmpdec` set to `no` or `--without-system-libmpdec`. Patch by Sergey B Kirpichev.

- gh-131769: Fix detecting when the build Python in a cross-build is a pydebug build.

- gh-117088: AIX linker don’t support -h option, so avoid it through platform check

- gh-123681: Check the `strftime()` behavior at runtime instead of at the compile time to support cross-compiling. Remove the internal macro `_Py_NORMALIZE_CENTURY`.

- gh-127545: Fix crash when building on Linux/m68k.
