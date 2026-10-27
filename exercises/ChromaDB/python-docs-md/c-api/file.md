---
page: c-api/file.html
title: File objects
area: c-api
kind: guide
---

<!-- anchor: file-objects | type: section -->
# File objects

These APIs are a minimal emulation of the Python 2 C API for built-in file objects, which used to rely on the buffered I/O (FILE*) support from the C standard library. In Python 3, files and streams use the new `io` module, which defines several layers over the low-level unbuffered I/O of the operating system. The functions described below are convenience C wrappers over these new APIs, and meant mostly for internal error reporting in the interpreter; third-party code is advised to access the `io` APIs instead.

<!-- anchor: c.PyFile_FromFd | type: c function -->
## `PyObject *PyFile_FromFd(int fd, const char *name, const char *mode, int buffering, const char *encoding, const char *errors, const char *newline, int closefd)`

*Return value: New reference.**Part of the Stable ABI.*

Create a Python file object from the file descriptor of an already opened file *fd*. The arguments *name*, *encoding*, *errors* and *newline* can be `NULL` to use the defaults; *buffering* can be *-1* to use the default. *name* is ignored and kept for backward compatibility. Return `NULL` on failure. For a more comprehensive description of the arguments, please refer to the `io.open()` function documentation.

**Warning:**

Since Python streams have their own buffering layer, mixing them with OS-level file descriptors can produce various issues (such as unexpected ordering of data).

Changed in version 3.2: Ignore *name* attribute.

<!-- anchor: c.PyObject_AsFileDescriptor | type: c function -->
## `int PyObject_AsFileDescriptor(PyObject *p)`

*Part of the Stable ABI.*

Return the file descriptor associated with *p* as an int. If the object is an integer, its value is returned. If not, the object’s `fileno()` method is called if it exists; the method must return an integer, which is returned as the file descriptor value. Sets an exception and returns `-1` on failure.

<!-- anchor: c.PyFile_GetLine | type: c function -->
## `PyObject *PyFile_GetLine(PyObject *p, int n)`

*Return value: New reference.**Part of the Stable ABI.*

Equivalent to `p.readline([n])`, this function reads one line from the object *p*. *p* may be a file object or any object with a `readline()` method. If *n* is `0`, exactly one line is read, regardless of the length of the line. If *n* is greater than `0`, no more than *n* bytes will be read from the file; a partial line can be returned. In both cases, an empty string is returned if the end of the file is reached immediately. If *n* is less than `0`, however, one line is read regardless of length, but `EOFError` is raised if the end of the file is reached immediately.

<!-- anchor: c.PyFile_SetOpenCodeHook | type: c function -->
## `int PyFile_SetOpenCodeHook(Py_OpenCodeHookFunction handler)`

Overrides the normal behavior of `io.open_code()` to pass its parameter through the provided handler.

The *handler* is a function of type:

<!-- anchor: c.Py_OpenCodeHookFunction | type: c type -->
### `typedef PyObject *(*Py_OpenCodeHookFunction)(PyObject*, void*)`

Equivalent of PyObject *(*)(PyObject *path, void *userData), where *path* is guaranteed to be `PyUnicodeObject`.

The *userData* pointer is passed into the hook function. Since hook functions may be called from different runtimes, this pointer should not refer directly to Python state.

As this hook is intentionally used during import, avoid importing new modules during its execution unless they are known to be frozen or available in `sys.modules`.

Once a hook has been set, it cannot be removed or replaced, and later calls to `PyFile_SetOpenCodeHook()` will fail. On failure, the function returns -1 and sets an exception if the interpreter has been initialized.

This function is safe to call before `Py_Initialize()`.

Raises an auditing event `setopencodehook` with no arguments.

Added in version 3.8.

<!-- anchor: c.PyFile_OpenCodeObject | type: c function -->
## `PyObject *PyFile_OpenCodeObject(PyObject *path)`

Open *path* with the mode `'rb'`. *path* must be a Python `str` object. The behavior of this function may be overridden by `PyFile_SetOpenCodeHook()` to allow for some preprocessing of the text.

This is analogous to `io.open_code()` in Python.

On success, this function returns a strong reference to a Python file object. On failure, this function returns `NULL` with an exception set.

Added in version 3.8.

<!-- anchor: c.PyFile_OpenCode | type: c function -->
## `PyObject *PyFile_OpenCode(const char *path)`

Similar to `PyFile_OpenCodeObject()`, but *path* is a UTF-8 encoded const char*.

Added in version 3.8.

<!-- anchor: c.PyFile_WriteObject | type: c function -->
## `int PyFile_WriteObject(PyObject *obj, PyObject *p, int flags)`

*Part of the Stable ABI.*

Write object *obj* to file object *p*. The only supported flag for *flags* is `Py_PRINT_RAW`; if given, the `str()` of the object is written instead of the `repr()`.

If *obj* is `NULL`, write the string `"<NULL>"`.

Return `0` on success or `-1` on failure; the appropriate exception will be set.

<!-- anchor: c.PyFile_WriteString | type: c function -->
## `int PyFile_WriteString(const char *s, PyObject *p)`

*Part of the Stable ABI.*

Write string *s* to file object *p*. Return `0` on success or `-1` on failure; the appropriate exception will be set.

<!-- anchor: soft-deprecated-api | type: section -->
## Soft-deprecated API

Soft deprecated since version 3.15.

These are APIs that were included in Python’s C API by mistake. They are documented solely for completeness; use other `PyFile*` APIs instead.

<!-- anchor: c.PyFile_NewStdPrinter | type: c function -->
### `PyObject *PyFile_NewStdPrinter(int fd)`

Use `PyFile_FromFd()` with defaults (`fd, NULL, "w", -1, NULL, NULL, NULL, 0`) instead.

<!-- anchor: c.PyStdPrinter_Type | type: c var -->
### `PyTypeObject PyStdPrinter_Type`

Type of file-like objects used internally at Python startup when `io` is not yet available. Use Python `open()` or `PyFile_FromFd()` to create file objects instead.
