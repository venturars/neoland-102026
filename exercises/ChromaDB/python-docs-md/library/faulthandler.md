---
page: library/faulthandler.html
title: faulthandler — Dump the Python traceback
area: library
kind: guide
module: faulthandler
---

<!-- anchor: module-faulthandler | type: section -->
# `faulthandler` — Dump the Python traceback

Added in version 3.3.

This module contains functions to dump Python tracebacks explicitly, on a fault, after a timeout, or on a user signal. Call `faulthandler.enable()` to install fault handlers for the `SIGSEGV`, `SIGFPE`, `SIGABRT`, `SIGBUS`, and `SIGILL` signals. You can also enable them at startup by setting the `PYTHONFAULTHANDLER` environment variable or by using the `-X` `faulthandler` command line option.

The fault handler is compatible with system fault handlers like Apport or the Windows fault handler. The module uses an alternative stack for signal handlers if the `sigaltstack()` function is available. This allows it to dump the traceback even on a stack overflow.

The fault handler is called on catastrophic cases and therefore can only use signal-safe functions (e.g. it cannot allocate memory on the heap). Because of this limitation traceback dumping is minimal compared to normal Python tracebacks:

- Only ASCII is supported. The `backslashreplace` error handler is used on encoding.

- Each string is limited to 500 characters.

- Only the filename, the function name and the line number are displayed. (no source code)

- It is limited to 100 frames per thread, and 100 threads (configurable via *max_threads*).

- The order is reversed: the most recent call is shown first.

By default, the Python traceback is written to `sys.stderr`. To see tracebacks, applications must be run in the terminal. A log file can alternatively be passed to `faulthandler.enable()`.

The module is implemented in C, so tracebacks can be dumped on a crash or when Python is deadlocked.

The Python Development Mode calls `faulthandler.enable()` at Python startup.

**See also:**

**Module `pdb`**

Interactive source code debugger for Python programs.

**Module `traceback`**

Standard interface to extract, format and print stack traces of Python programs.

<!-- anchor: dumping-the-traceback | type: section -->
## Dumping the traceback

<!-- anchor: faulthandler.dump_traceback | type: py function -->
### `faulthandler.dump_traceback(file=sys.stderr, all_threads=True, *, max_threads=100)`

Dump the tracebacks of all threads into *file*. If *all_threads* is `False`, dump only the current thread. *max_threads* caps the number of threads dumped.

**See also:**

`traceback.print_tb()`, which can be used to print a traceback object.

Changed in version 3.5: Added support for passing file descriptor to this function.

Changed in version 3.15: Added the *max_threads* keyword argument.

<!-- anchor: dumping-the-c-stack | type: section -->
## Dumping the C stack

Added in version 3.14.

<!-- anchor: faulthandler.dump_c_stack | type: py function -->
### `faulthandler.dump_c_stack(file=sys.stderr)`

Dump the C stack trace of the current thread into *file*.

If the Python build does not support it or the operating system does not provide a stack trace, then this prints an error in place of a dumped C stack.

<!-- anchor: c-stack-compatibility | type: section -->
### C Stack Compatibility

If the system does not support the C-level *backtrace(3)* or *dladdr1(3)*, then C stack dumps will not work. An error will be printed instead of the stack.

Additionally, some compilers do not support CPython’s implementation of C stack dumps. As a result, a different error may be printed instead of the stack, even if the operating system supports dumping stacks.

**Note:**

Dumping C stacks can be arbitrarily slow, depending on the DWARF level of the binaries in the call stack.

<!-- anchor: fault-handler-state | type: section -->
## Fault handler state

<!-- anchor: faulthandler.enable | type: py function -->
### `faulthandler.enable(file=sys.stderr, all_threads=True, c_stack=True, *, max_threads=100)`

Enable the fault handler: install handlers for the `SIGSEGV`, `SIGFPE`, `SIGABRT`, `SIGBUS` and `SIGILL` signals to dump the Python traceback. If *all_threads* is `True`, produce tracebacks for every running thread. Otherwise, dump only the current thread.

The *file* must be kept open until the fault handler is disabled: see issue with file descriptors.

If *c_stack* is `True`, then the C stack trace is printed after the Python traceback, unless the system does not support it. See `dump_c_stack()` for more information on compatibility.

*max_threads* caps the number of threads dumped when a fatal signal fires.

Changed in version 3.5: Added support for passing file descriptor to this function.

Changed in version 3.6: On Windows, a handler for Windows exception is also installed.

Changed in version 3.10: The dump now mentions if a garbage collector collection is running if *all_threads* is true.

Changed in version 3.14: Only the current thread is dumped if the GIL is disabled to prevent the risk of data races.

Changed in version 3.14: The dump now displays the C stack trace if *c_stack* is true.

Changed in version 3.15: Added the *max_threads* keyword argument.

<!-- anchor: faulthandler.disable | type: py function -->
### `faulthandler.disable()`

Disable the fault handler: uninstall the signal handlers installed by `enable()`.

<!-- anchor: faulthandler.is_enabled | type: py function -->
### `faulthandler.is_enabled()`

Check if the fault handler is enabled.

<!-- anchor: dumping-the-tracebacks-after-a-timeout | type: section -->
## Dumping the tracebacks after a timeout

<!-- anchor: faulthandler.dump_traceback_later | type: py function -->
### `faulthandler.dump_traceback_later(timeout, repeat=False, file=sys.stderr, exit=False, *, max_threads=100)`

Dump the tracebacks of all threads, after a timeout of *timeout* seconds, or every *timeout* seconds if *repeat* is `True`. If *exit* is `True`, call `_exit()` with status=1 after dumping the tracebacks. (Note `_exit()` exits the process immediately, which means it doesn’t do any cleanup like flushing file buffers.) If the function is called twice, the new call replaces previous parameters and resets the timeout. The timer has a sub-second resolution. *max_threads* caps the number of threads dumped.

The *file* must be kept open until the traceback is dumped or `cancel_dump_traceback_later()` is called: see issue with file descriptors.

This function is implemented using a watchdog thread.

Changed in version 3.5: Added support for passing file descriptor to this function.

Changed in version 3.7: This function is now always available.

Changed in version 3.15: Added the *max_threads* keyword argument.

<!-- anchor: faulthandler.cancel_dump_traceback_later | type: py function -->
### `faulthandler.cancel_dump_traceback_later()`

Cancel the last call to `dump_traceback_later()`.

<!-- anchor: dumping-the-traceback-on-a-user-signal | type: section -->
## Dumping the traceback on a user signal

<!-- anchor: faulthandler.register | type: py function -->
### `faulthandler.register(signum, file=sys.stderr, all_threads=True, chain=False, *, max_threads=100)`

Register a user signal: install a handler for the *signum* signal to dump the traceback of all threads, or of the current thread if *all_threads* is `False`, into *file*. Call the previous handler if chain is `True`. *max_threads* caps the number of threads dumped.

The *file* must be kept open until the signal is unregistered by `unregister()`: see issue with file descriptors.

Not available on Windows.

Changed in version 3.5: Added support for passing file descriptor to this function.

Changed in version 3.15: Added the *max_threads* keyword argument.

<!-- anchor: faulthandler.unregister | type: py function -->
### `faulthandler.unregister(signum)`

Unregister a user signal: uninstall the handler of the *signum* signal installed by `register()`. Return `True` if the signal was registered, `False` otherwise.

Not available on Windows.

<!-- anchor: issue-with-file-descriptors | type: section -->
## Issue with file descriptors

`enable()`, `dump_traceback_later()` and `register()` keep the file descriptor of their *file* argument. If the file is closed and its file descriptor is reused by a new file, or if `os.dup2()` is used to replace the file descriptor, the traceback will be written into a different file. Call these functions again each time that the file is replaced.

<!-- anchor: example | type: section -->
## Example

Example of a segmentation fault on Linux with and without enabling the fault handler:

```shell-session
$ python -c "import ctypes; ctypes.string_at(0)"
Segmentation fault

$ python -q -X faulthandler
>>> import ctypes
>>> ctypes.string_at(0)
Fatal Python error: Segmentation fault

Current thread 0x00007fb899f39700 (most recent call first):
  File "/opt/python/Lib/ctypes/__init__.py", line 486 in string_at
  File "<stdin>", line 1 in <module>

Current thread's C stack trace (most recent call first):
  Binary file "/opt/python/python", at _Py_DumpStack+0x42 [0x5b27f7d7147e]
  Binary file "/opt/python/python", at +0x32dcbd [0x5b27f7d85cbd]
  Binary file "/opt/python/python", at +0x32df8a [0x5b27f7d85f8a]
  Binary file "/usr/lib/libc.so.6", at +0x3def0 [0x77b73226bef0]
  Binary file "/usr/lib/libc.so.6", at +0x17ef9c [0x77b7323acf9c]
  Binary file "/opt/python/build/lib.linux-x86_64-3.15/_ctypes.cpython-315d-x86_64-linux-gnu.so", at +0xcdf6 [0x77b7315dddf6]
  Binary file "/usr/lib/libffi.so.8", at +0x7976 [0x77b73158f976]
  Binary file "/usr/lib/libffi.so.8", at +0x413c [0x77b73158c13c]
  Binary file "/usr/lib/libffi.so.8", at ffi_call+0x12e [0x77b73158ef0e]
  Binary file "/opt/python/build/lib.linux-x86_64-3.15/_ctypes.cpython-315d-x86_64-linux-gnu.so", at +0x15a33 [0x77b7315e6a33]
  Binary file "/opt/python/build/lib.linux-x86_64-3.15/_ctypes.cpython-315d-x86_64-linux-gnu.so", at +0x164fa [0x77b7315e74fa]
  Binary file "/opt/python/build/lib.linux-x86_64-3.15/_ctypes.cpython-315d-x86_64-linux-gnu.so", at +0xc624 [0x77b7315dd624]
  Binary file "/opt/python/python", at _PyObject_MakeTpCall+0xce [0x5b27f7b73883]
  Binary file "/opt/python/python", at +0x11bab6 [0x5b27f7b73ab6]
  Binary file "/opt/python/python", at PyObject_Vectorcall+0x23 [0x5b27f7b73b04]
  Binary file "/opt/python/python", at _PyEval_EvalFrameDefault+0x490c [0x5b27f7cbb302]
  Binary file "/opt/python/python", at +0x2818e6 [0x5b27f7cd98e6]
  Binary file "/opt/python/python", at +0x281aab [0x5b27f7cd9aab]
  Binary file "/opt/python/python", at PyEval_EvalCode+0xc5 [0x5b27f7cd9ba3]
  Binary file "/opt/python/python", at +0x255957 [0x5b27f7cad957]
  Binary file "/opt/python/python", at +0x255ab4 [0x5b27f7cadab4]
  Binary file "/opt/python/python", at _PyEval_EvalFrameDefault+0x6c3e [0x5b27f7cbd634]
  Binary file "/opt/python/python", at +0x2818e6 [0x5b27f7cd98e6]
  Binary file "/opt/python/python", at +0x281aab [0x5b27f7cd9aab]
  Binary file "/opt/python/python", at +0x11b6e1 [0x5b27f7b736e1]
  Binary file "/opt/python/python", at +0x11d348 [0x5b27f7b75348]
  Binary file "/opt/python/python", at +0x11d626 [0x5b27f7b75626]
  Binary file "/opt/python/python", at PyObject_Call+0x20 [0x5b27f7b7565e]
  Binary file "/opt/python/python", at +0x32a67a [0x5b27f7d8267a]
  Binary file "/opt/python/python", at +0x32a7f8 [0x5b27f7d827f8]
  Binary file "/opt/python/python", at +0x32ac1b [0x5b27f7d82c1b]
  Binary file "/opt/python/python", at Py_RunMain+0x31 [0x5b27f7d82ebe]
  <truncated rest of calls>
Segmentation fault
```
