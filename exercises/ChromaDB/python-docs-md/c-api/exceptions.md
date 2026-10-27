---
page: c-api/exceptions.html
title: Exception Handling
area: c-api
kind: guide
---

<!-- anchor: exception-handling | type: section -->
# Exception Handling

The functions described in this chapter will let you handle and raise Python exceptions. It is important to understand some of the basics of Python exception handling. It works somewhat like the POSIX `errno` variable: there is a global indicator (per thread) of the last error that occurred. Most C API functions don’t clear this on success, but will set it to indicate the cause of the error on failure. Most C API functions also return an error indicator, usually `NULL` if they are supposed to return a pointer, or `-1` if they return an integer (exception: the `PyArg_*` functions return `1` for success and `0` for failure).

Concretely, the error indicator consists of three object pointers: the exception’s type, the exception’s value, and the traceback object. Any of those pointers can be `NULL` if non-set (although some combinations are forbidden, for example you can’t have a non-`NULL` traceback if the exception type is `NULL`).

When a function must fail because some function it called failed, it generally doesn’t set the error indicator; the function it called already set it. It is responsible for either handling the error and clearing the exception or returning after cleaning up any resources it holds (such as object references or memory allocations); it should *not* continue normally if it is not prepared to handle the error. If returning due to an error, it is important to indicate to the caller that an error has been set. If the error is not handled or carefully propagated, additional calls into the Python/C API may not behave as intended and may fail in mysterious ways.

**Note:**

The error indicator is **not** the result of `sys.exc_info()`. The former corresponds to an exception that is not yet caught (and is therefore still propagating), while the latter returns an exception after it is caught (and has therefore stopped propagating).

<!-- anchor: printing-and-clearing | type: section -->
## Printing and clearing

<!-- anchor: c.PyErr_Clear | type: c function -->
### `void PyErr_Clear()`

*Part of the Stable ABI.*

Clear the error indicator. If the error indicator is not set, there is no effect.

<!-- anchor: c.PyErr_PrintEx | type: c function -->
### `void PyErr_PrintEx(int set_sys_last_vars)`

*Part of the Stable ABI.*

Print a standard traceback to `sys.stderr` and clear the error indicator. **Unless** the error is a `SystemExit`, in that case no traceback is printed and the Python process will exit with the error code specified by the `SystemExit` instance.

Call this function **only** when the error indicator is set. Otherwise it will cause a fatal error!

If *set_sys_last_vars* is nonzero, the variable `sys.last_exc` is set to the printed exception. For backwards compatibility, the deprecated variables `sys.last_type`, `sys.last_value` and `sys.last_traceback` are also set to the type, value and traceback of this exception, respectively.

Changed in version 3.12: The setting of `sys.last_exc` was added.

<!-- anchor: c.PyErr_Print | type: c function -->
### `void PyErr_Print()`

*Part of the Stable ABI.*

Alias for `PyErr_PrintEx(1)`.

<!-- anchor: c.PyErr_WriteUnraisable | type: c function -->
### `void PyErr_WriteUnraisable(PyObject *obj)`

*Part of the Stable ABI.*

Call `sys.unraisablehook()` using the current exception and *obj* argument.

This utility function prints a warning message to `sys.stderr` when an exception has been set but it is impossible for the interpreter to actually raise the exception. It is used, for example, when an exception occurs in an `__del__()` method.

The function is called with a single argument *obj* that identifies the context in which the unraisable exception occurred. If possible, the repr of *obj* will be printed in the warning message. If *obj* is `NULL`, only the traceback is printed.

An exception must be set when calling this function.

Changed in version 3.4: Print a traceback. Print only traceback if *obj* is `NULL`.

Changed in version 3.8: Use `sys.unraisablehook()`.

<!-- anchor: c.PyErr_FormatUnraisable | type: c function -->
### `void PyErr_FormatUnraisable(const char *format, ...)`

Similar to `PyErr_WriteUnraisable()`, but the *format* and subsequent parameters help format the warning message; they have the same meaning and values as in `PyUnicode_FromFormat()`. `PyErr_WriteUnraisable(obj)` is roughly equivalent to `PyErr_FormatUnraisable("Exception ignored in: %R", obj)`. If *format* is `NULL`, only the traceback is printed.

Added in version 3.13.

<!-- anchor: c.PyErr_DisplayException | type: c function -->
### `void PyErr_DisplayException(PyObject *exc)`

*Part of the Stable ABI since version 3.12.*

Print the standard traceback display of `exc` to `sys.stderr`, including chained exceptions and notes.

Added in version 3.12.

<!-- anchor: c.PyErr_Display | type: c function -->
### `void PyErr_Display(PyObject *unused, PyObject *value, PyObject *tb)`

*Part of the Stable ABI.*

Legacy variant of `PyErr_DisplayException()`.

Print the exception *value* with its traceback to `sys.stderr`. If *value* has no traceback set, *tb* is used as its traceback. The first argument is ignored.

If `sys.stderr` is `None`, nothing is printed. If `sys.stderr` is not set, the exception is dumped to the C `stderr` stream instead.

Deprecated since version 3.12: Use `PyErr_DisplayException()` instead.

<!-- anchor: raising-exceptions | type: section -->
## Raising exceptions

These functions help you set the current thread’s error indicator. For convenience, some of these functions will always return a `NULL` pointer for use in a `return` statement.

<!-- anchor: c.PyErr_SetString | type: c function -->
### `void PyErr_SetString(PyObject *type, const char *message)`

*Part of the Stable ABI.*

This is the most common way to set the error indicator. The first argument specifies the exception type; it is normally one of the standard exceptions, e.g. `PyExc_RuntimeError`. You need not create a new strong reference to it (e.g. with `Py_INCREF()`). The second argument is an error message; it is decoded from `'utf-8'`.

<!-- anchor: c.PyErr_SetObject | type: c function -->
### `void PyErr_SetObject(PyObject *type, PyObject *value)`

*Part of the Stable ABI.*

This function is similar to `PyErr_SetString()` but lets you specify an arbitrary Python object for the “value” of the exception.

<!-- anchor: c.PyErr_Format | type: c function -->
### `PyObject *PyErr_Format(PyObject *exception, const char *format, ...)`

*Return value: Always NULL.**Part of the Stable ABI.*

This function sets the error indicator and returns `NULL`. *exception* should be a Python exception class. The *format* and subsequent parameters help format the error message; they have the same meaning and values as in `PyUnicode_FromFormat()`. *format* is an ASCII-encoded string.

<!-- anchor: c.PyErr_FormatV | type: c function -->
### `PyObject *PyErr_FormatV(PyObject *exception, const char *format, va_list vargs)`

*Return value: Always NULL.**Part of the Stable ABI since version 3.5.*

Same as `PyErr_Format()`, but taking a `va_list` argument rather than a variable number of arguments.

Added in version 3.5.

<!-- anchor: c.PyErr_SetNone | type: c function -->
### `void PyErr_SetNone(PyObject *type)`

*Part of the Stable ABI.*

This is a shorthand for `PyErr_SetObject(type, Py_None)`.

<!-- anchor: c.PyErr_BadArgument | type: c function -->
### `int PyErr_BadArgument()`

*Part of the Stable ABI.*

This is a shorthand for `PyErr_SetString(PyExc_TypeError, message)`, where *message* indicates that a built-in operation was invoked with an illegal argument. It is mostly for internal use.

<!-- anchor: c.PyErr_NoMemory | type: c function -->
### `PyObject *PyErr_NoMemory()`

*Return value: Always NULL.**Part of the Stable ABI.*

This is a shorthand for `PyErr_SetNone(PyExc_MemoryError)`; it returns `NULL` so an object allocation function can write `return PyErr_NoMemory();` when it runs out of memory.

<!-- anchor: c.PyErr_SetFromErrno | type: c function -->
### `PyObject *PyErr_SetFromErrno(PyObject *type)`

*Return value: Always NULL.**Part of the Stable ABI.*

This is a convenience function to raise an exception when a C library function has returned an error and set the C variable `errno`. It constructs a tuple object whose first item is the integer `errno` value and whose second item is the corresponding error message (gotten from `strerror()`), and then calls `PyErr_SetObject(type, object)`. On Unix, when the `errno` value is `EINTR`, indicating an interrupted system call, this calls `PyErr_CheckSignals()`, and if that set the error indicator, leaves it set to that. The function always returns `NULL`, so a wrapper function around a system call can write `return PyErr_SetFromErrno(type);` when the system call returns an error.

<!-- anchor: c.PyErr_SetFromErrnoWithFilenameObject | type: c function -->
### `PyObject *PyErr_SetFromErrnoWithFilenameObject(PyObject *type, PyObject *filenameObject)`

*Return value: Always NULL.**Part of the Stable ABI.*

Similar to `PyErr_SetFromErrno()`, with the additional behavior that if *filenameObject* is not `NULL`, it is passed to the constructor of *type* as a third parameter. In the case of `OSError` exception, this is used to define the `filename` attribute of the exception instance.

<!-- anchor: c.PyErr_SetFromErrnoWithFilenameObjects | type: c function -->
### `PyObject *PyErr_SetFromErrnoWithFilenameObjects(PyObject *type, PyObject *filenameObject, PyObject *filenameObject2)`

*Return value: Always NULL.**Part of the Stable ABI since version 3.7.*

Similar to `PyErr_SetFromErrnoWithFilenameObject()`, but takes a second filename object, for raising errors when a function that takes two filenames fails.

Added in version 3.4.

<!-- anchor: c.PyErr_SetFromErrnoWithFilename | type: c function -->
### `PyObject *PyErr_SetFromErrnoWithFilename(PyObject *type, const char *filename)`

*Return value: Always NULL.**Part of the Stable ABI.*

Similar to `PyErr_SetFromErrnoWithFilenameObject()`, but the filename is given as a C string. *filename* is decoded from the filesystem encoding and error handler.

<!-- anchor: c.PyErr_SetFromWindowsErr | type: c function -->
### `PyObject *PyErr_SetFromWindowsErr(int ierr)`

*Return value: Always NULL.**Part of the Stable ABI on Windows since version 3.7.*

This is a convenience function to raise `OSError`. If called with *ierr* of `0`, the error code returned by a call to `GetLastError()` is used instead. It calls the Win32 function `FormatMessage()` to retrieve the Windows description of error code given by *ierr* or `GetLastError()`, then it constructs a `OSError` object with the `winerror` attribute set to the error code, the `strerror` attribute set to the corresponding error message (gotten from `FormatMessage()`), and then calls `PyErr_SetObject(PyExc_OSError, object)`. This function always returns `NULL`.

Availability: Windows.

<!-- anchor: c.PyErr_SetExcFromWindowsErr | type: c function -->
### `PyObject *PyErr_SetExcFromWindowsErr(PyObject *type, int ierr)`

*Return value: Always NULL.**Part of the Stable ABI on Windows since version 3.7.*

Similar to `PyErr_SetFromWindowsErr()`, with an additional parameter specifying the exception type to be raised.

Availability: Windows.

<!-- anchor: c.PyErr_SetFromWindowsErrWithFilename | type: c function -->
### `PyObject *PyErr_SetFromWindowsErrWithFilename(int ierr, const char *filename)`

*Return value: Always NULL.**Part of the Stable ABI on Windows since version 3.7.*

Similar to `PyErr_SetFromWindowsErr()`, with the additional behavior that if *filename* is not `NULL`, it is decoded from the filesystem encoding (`os.fsdecode()`) and passed to the constructor of `OSError` as a third parameter to be used to define the `filename` attribute of the exception instance.

Availability: Windows.

<!-- anchor: c.PyErr_SetExcFromWindowsErrWithFilenameObject | type: c function -->
### `PyObject *PyErr_SetExcFromWindowsErrWithFilenameObject(PyObject *type, int ierr, PyObject *filename)`

*Return value: Always NULL.**Part of the Stable ABI on Windows since version 3.7.*

Similar to `PyErr_SetExcFromWindowsErr()`, with the additional behavior that if *filename* is not `NULL`, it is passed to the constructor of `OSError` as a third parameter to be used to define the `filename` attribute of the exception instance.

Availability: Windows.

<!-- anchor: c.PyErr_SetExcFromWindowsErrWithFilenameObjects | type: c function -->
### `PyObject *PyErr_SetExcFromWindowsErrWithFilenameObjects(PyObject *type, int ierr, PyObject *filename, PyObject *filename2)`

*Return value: Always NULL.**Part of the Stable ABI on Windows since version 3.7.*

Similar to `PyErr_SetExcFromWindowsErrWithFilenameObject()`, but accepts a second filename object.

Availability: Windows.

Added in version 3.4.

<!-- anchor: c.PyErr_SetExcFromWindowsErrWithFilename | type: c function -->
### `PyObject *PyErr_SetExcFromWindowsErrWithFilename(PyObject *type, int ierr, const char *filename)`

*Return value: Always NULL.**Part of the Stable ABI on Windows since version 3.7.*

Similar to `PyErr_SetFromWindowsErrWithFilename()`, with an additional parameter specifying the exception type to be raised.

Availability: Windows.

<!-- anchor: c.PyErr_SetImportError | type: c function -->
### `PyObject *PyErr_SetImportError(PyObject *msg, PyObject *name, PyObject *path)`

*Return value: Always NULL.**Part of the Stable ABI since version 3.7.*

This is a convenience function to raise `ImportError`. *msg* will be set as the exception’s message string. *name* and *path*, both of which can be `NULL`, will be set as the `ImportError`’s respective `name` and `path` attributes.

Added in version 3.3.

<!-- anchor: c.PyErr_SetImportErrorSubclass | type: c function -->
### `PyObject *PyErr_SetImportErrorSubclass(PyObject *exception, PyObject *msg, PyObject *name, PyObject *path)`

*Return value: Always NULL.**Part of the Stable ABI since version 3.6.*

Much like `PyErr_SetImportError()` but this function allows for specifying a subclass of `ImportError` to raise.

Added in version 3.6.

<!-- anchor: c.PyErr_SyntaxLocationObject | type: c function -->
### `void PyErr_SyntaxLocationObject(PyObject *filename, int lineno, int col_offset)`

Set file, line, and offset information for the current exception. If the current exception is not a `SyntaxError`, then it sets additional attributes, which make the exception printing subsystem think the exception is a `SyntaxError`.

Added in version 3.4.

<!-- anchor: c.PyErr_RangedSyntaxLocationObject | type: c function -->
### `void PyErr_RangedSyntaxLocationObject(PyObject *filename, int lineno, int col_offset, int end_lineno, int end_col_offset)`

Similar to `PyErr_SyntaxLocationObject()`, but also sets the *end_lineno* and *end_col_offset* information for the current exception.

Added in version 3.10.

<!-- anchor: c.PyErr_SyntaxLocationEx | type: c function -->
### `void PyErr_SyntaxLocationEx(const char *filename, int lineno, int col_offset)`

*Part of the Stable ABI since version 3.7.*

Like `PyErr_SyntaxLocationObject()`, but *filename* is a byte string decoded from the filesystem encoding and error handler.

Added in version 3.2.

<!-- anchor: c.PyErr_SyntaxLocation | type: c function -->
### `void PyErr_SyntaxLocation(const char *filename, int lineno)`

*Part of the Stable ABI.*

Like `PyErr_SyntaxLocationEx()`, but the *col_offset* parameter is omitted.

<!-- anchor: c.PyErr_BadInternalCall | type: c function -->
### `void PyErr_BadInternalCall()`

*Part of the Stable ABI.*

This is a shorthand for `PyErr_SetString(PyExc_SystemError, message)`, where *message* indicates that an internal operation (e.g. a Python/C API function) was invoked with an illegal argument. It is mostly for internal use.

<!-- anchor: c.PyErr_ProgramTextObject | type: c function -->
### `PyObject *PyErr_ProgramTextObject(PyObject *filename, int lineno)`

Get the source line in *filename* at line *lineno*. *filename* should be a Python `str` object.

On success, this function returns a Python string object with the found line. On failure, this function returns `NULL` without an exception set.

<!-- anchor: c.PyErr_ProgramText | type: c function -->
### `PyObject *PyErr_ProgramText(const char *filename, int lineno)`

*Part of the Stable ABI.*

Similar to `PyErr_ProgramTextObject()`, but *filename* is a const char*, which is decoded with the filesystem encoding and error handler, instead of a Python object reference.

<!-- anchor: issuing-warnings | type: section -->
## Issuing warnings

Use these functions to issue warnings from C code. They mirror similar functions exported by the Python `warnings` module. They normally print a warning message to *sys.stderr*; however, it is also possible that the user has specified that warnings are to be turned into errors, and in that case they will raise an exception. It is also possible that the functions raise an exception because of a problem with the warning machinery. The return value is `0` if no exception is raised, or `-1` if an exception is raised. (It is not possible to determine whether a warning message is actually printed, nor what the reason is for the exception; this is intentional.) If an exception is raised, the caller should do its normal exception handling (for example, `Py_DECREF()` owned references and return an error value).

<!-- anchor: c.PyErr_WarnEx | type: c function -->
### `int PyErr_WarnEx(PyObject *category, const char *message, Py_ssize_t stack_level)`

*Part of the Stable ABI.*

Issue a warning message. The *category* argument is a warning category (see below) or `NULL`; the *message* argument is a UTF-8 encoded string. *stack_level* is a positive number giving a number of stack frames; the warning will be issued from the currently executing line of code in that stack frame. A *stack_level* of 1 is the function calling `PyErr_WarnEx()`, 2 is the function above that, and so forth.

Warning categories must be subclasses of `PyExc_Warning`; `PyExc_Warning` is a subclass of `PyExc_Exception`; the default warning category is `PyExc_RuntimeWarning`. The standard Python warning categories are available as global variables whose names are enumerated at Warning types.

For information about warning control, see the documentation for the `warnings` module and the `-W` option in the command line documentation. There is no C API for warning control.

<!-- anchor: c.PyErr_WarnExplicitObject | type: c function -->
### `int PyErr_WarnExplicitObject(PyObject *category, PyObject *message, PyObject *filename, int lineno, PyObject *module, PyObject *registry)`

Issue a warning message with explicit control over all warning attributes. This is a straightforward wrapper around the Python function `warnings.warn_explicit()`; see there for more information. The *module* and *registry* arguments may be set to `NULL` to get the default effect described there.

Added in version 3.4.

<!-- anchor: c.PyErr_WarnExplicit | type: c function -->
### `int PyErr_WarnExplicit(PyObject *category, const char *message, const char *filename, int lineno, const char *module, PyObject *registry)`

*Part of the Stable ABI.*

Similar to `PyErr_WarnExplicitObject()` except that *message* and *module* are UTF-8 encoded strings, and *filename* is decoded from the filesystem encoding and error handler.

<!-- anchor: c.PyErr_WarnFormat | type: c function -->
### `int PyErr_WarnFormat(PyObject *category, Py_ssize_t stack_level, const char *format, ...)`

*Part of the Stable ABI.*

Function similar to `PyErr_WarnEx()`, but uses `PyUnicode_FromFormat()` to format the warning message. *format* is an ASCII-encoded string.

Added in version 3.2.

<!-- anchor: c.PyErr_WarnExplicitFormat | type: c function -->
### `int PyErr_WarnExplicitFormat(PyObject *category, const char *filename, int lineno, const char *module, PyObject *registry, const char *format, ...)`

Similar to `PyErr_WarnExplicit()`, but uses `PyUnicode_FromFormat()` to format the warning message. *format* is an ASCII-encoded string.

Added in version 3.2.

<!-- anchor: c.PyErr_ResourceWarning | type: c function -->
### `int PyErr_ResourceWarning(PyObject *source, Py_ssize_t stack_level, const char *format, ...)`

*Part of the Stable ABI since version 3.6.*

Function similar to `PyErr_WarnFormat()`, but *category* is `ResourceWarning` and it passes *source* to `warnings.WarningMessage`.

Added in version 3.6.

<!-- anchor: querying-the-error-indicator | type: section -->
## Querying the error indicator

<!-- anchor: c.PyErr_Occurred | type: c function -->
### `PyObject *PyErr_Occurred()`

*Return value: Borrowed reference.**Part of the Stable ABI.*

Test whether the error indicator is set. If set, return the exception *type* (the first argument to the last call to one of the `PyErr_Set*` functions or to `PyErr_Restore()`). If not set, return `NULL`. You do not own a reference to the return value, so you do not need to `Py_DECREF()` it.

The caller must have an attached thread state.

**Note:**

Do not compare the return value to a specific exception; use `PyErr_ExceptionMatches()` instead, shown below. (The comparison could easily fail since the exception may be an instance instead of a class, in the case of a class exception, or it may be a subclass of the expected exception.)

<!-- anchor: c.PyErr_ExceptionMatches | type: c function -->
### `int PyErr_ExceptionMatches(PyObject *exc)`

*Part of the Stable ABI.*

Equivalent to `PyErr_GivenExceptionMatches(PyErr_Occurred(), exc)`. This should only be called when an exception is actually set; a memory access violation will occur if no exception has been raised.

<!-- anchor: c.PyErr_GivenExceptionMatches | type: c function -->
### `int PyErr_GivenExceptionMatches(PyObject *given, PyObject *exc)`

*Part of the Stable ABI.*

Return true if the *given* exception matches the exception type in *exc*. If *exc* is a class object, this also returns true when *given* is an instance of a subclass. If *exc* is a tuple, all exception types in the tuple (and recursively in subtuples) are searched for a match.

<!-- anchor: c.PyErr_GetRaisedException | type: c function -->
### `PyObject *PyErr_GetRaisedException(void)`

*Return value: New reference.**Part of the Stable ABI since version 3.12.*

Return the exception currently being raised, clearing the error indicator at the same time. Return `NULL` if the error indicator is not set.

This function is used by code that needs to catch exceptions, or code that needs to save and restore the error indicator temporarily.

For example:

```c
{
   PyObject *exc = PyErr_GetRaisedException();

   /* ... code that might produce other errors ... */

   PyErr_SetRaisedException(exc);
}
```

**See also:**

`PyErr_GetHandledException()`, to save the exception currently being handled.

Added in version 3.12.

<!-- anchor: c.PyErr_SetRaisedException | type: c function -->
### `void PyErr_SetRaisedException(PyObject *exc)`

*Part of the Stable ABI since version 3.12.*

Set *exc* as the exception currently being raised, clearing the existing exception if one is set. If *exc* is `NULL`, just clear the existing exception.

*exc* must be a valid exception or `NULL`.

This call “steals” a reference to *exc*.

Added in version 3.12.

<!-- anchor: c.PyErr_Fetch | type: c function -->
### `void PyErr_Fetch(PyObject **ptype, PyObject **pvalue, PyObject **ptraceback)`

*Part of the Stable ABI.*

Deprecated since version 3.12: Use `PyErr_GetRaisedException()` instead.

Retrieve the error indicator into three variables whose addresses are passed. If the error indicator is not set, set all three variables to `NULL`. If it is set, it will be cleared and you own a reference to each object retrieved. The value and traceback object may be `NULL` even when the type object is not.

**Note:**

This function is normally only used by legacy code that needs to catch exceptions or save and restore the error indicator temporarily.

For example:

```c
{
   PyObject *type, *value, *traceback;
   PyErr_Fetch(&type, &value, &traceback);

   /* ... code that might produce other errors ... */

   PyErr_Restore(type, value, traceback);
}
```

<!-- anchor: c.PyErr_Restore | type: c function -->
### `void PyErr_Restore(PyObject *type, PyObject *value, PyObject *traceback)`

*Part of the Stable ABI.*

Deprecated since version 3.12: Use `PyErr_SetRaisedException()` instead.

Set the error indicator from the three objects, *type*, *value*, and *traceback*, clearing the existing exception if one is set. If the objects are `NULL`, the error indicator is cleared. Do not pass a `NULL` type and non-`NULL` value or traceback. The exception type should be a class. Do not pass an invalid exception type or value. (Violating these rules will cause subtle problems later.) This call takes away a reference to each object: you must own a reference to each object before the call and after the call you no longer own these references. (If you don’t understand this, don’t use this function. I warned you.)

**Note:**

This function is normally only used by legacy code that needs to save and restore the error indicator temporarily. Use `PyErr_Fetch()` to save the current error indicator.

<!-- anchor: c.PyErr_NormalizeException | type: c function -->
### `void PyErr_NormalizeException(PyObject **exc, PyObject **val, PyObject **tb)`

*Part of the Stable ABI.*

Deprecated since version 3.12: Use `PyErr_GetRaisedException()` instead, to avoid any possible de-normalization.

Under certain circumstances, the values returned by `PyErr_Fetch()` below can be “unnormalized”, meaning that `*exc` is a class object but `*val` is not an instance of the same class. This function can be used to instantiate the class in that case. If the values are already normalized, nothing happens. The delayed normalization is implemented to improve performance.

**Note:**

This function *does not* implicitly set the `__traceback__` attribute on the exception value. If setting the traceback appropriately is desired, the following additional snippet is needed:

```c
if (tb != NULL) {
  PyException_SetTraceback(val, tb);
}
```

<!-- anchor: c.PyErr_GetHandledException | type: c function -->
### `PyObject *PyErr_GetHandledException(void)`

*Part of the Stable ABI since version 3.11.*

Retrieve the active exception instance, as would be returned by `sys.exception()`. This refers to an exception that was *already caught*, not to an exception that was freshly raised. Returns a new reference to the exception or `NULL`. Does not modify the interpreter’s exception state.

**Note:**

This function is not normally used by code that wants to handle exceptions. Rather, it can be used when code needs to save and restore the exception state temporarily. Use `PyErr_SetHandledException()` to restore or clear the exception state.

Added in version 3.11.

<!-- anchor: c.PyErr_SetHandledException | type: c function -->
### `void PyErr_SetHandledException(PyObject *exc)`

*Part of the Stable ABI since version 3.11.*

Set the active exception, as known from `sys.exception()`. This refers to an exception that was *already caught*, not to an exception that was freshly raised. To clear the exception state, pass `NULL`.

**Note:**

This function is not normally used by code that wants to handle exceptions. Rather, it can be used when code needs to save and restore the exception state temporarily. Use `PyErr_GetHandledException()` to get the exception state.

Added in version 3.11.

<!-- anchor: c.PyErr_GetExcInfo | type: c function -->
### `void PyErr_GetExcInfo(PyObject **ptype, PyObject **pvalue, PyObject **ptraceback)`

*Part of the Stable ABI since version 3.7.*

Retrieve the old-style representation of the exception info, as known from `sys.exc_info()`. This refers to an exception that was *already caught*, not to an exception that was freshly raised. Returns new references for the three objects, any of which may be `NULL`. Does not modify the exception info state. This function is kept for backwards compatibility. Prefer using `PyErr_GetHandledException()`.

**Note:**

This function is not normally used by code that wants to handle exceptions. Rather, it can be used when code needs to save and restore the exception state temporarily. Use `PyErr_SetExcInfo()` to restore or clear the exception state.

Added in version 3.3.

<!-- anchor: c.PyErr_SetExcInfo | type: c function -->
### `void PyErr_SetExcInfo(PyObject *type, PyObject *value, PyObject *traceback)`

*Part of the Stable ABI since version 3.7.*

Set the exception info, as known from `sys.exc_info()`. This refers to an exception that was *already caught*, not to an exception that was freshly raised. This function “steals” the references of the arguments. To clear the exception state, pass `NULL` for all three arguments. This function is kept for backwards compatibility. Prefer using `PyErr_SetHandledException()`.

**Note:**

This function is not normally used by code that wants to handle exceptions. Rather, it can be used when code needs to save and restore the exception state temporarily. Use `PyErr_GetExcInfo()` to read the exception state.

Added in version 3.3.

Changed in version 3.11: The `type` and `traceback` arguments are no longer used and can be NULL. The interpreter now derives them from the exception instance (the `value` argument). The function still “steals” references of all three arguments.

<!-- anchor: signal-handling | type: section -->
## Signal Handling

<!-- anchor: c.PyErr_CheckSignals | type: c function -->
### `int PyErr_CheckSignals()`

*Part of the Stable ABI.*

Handle external interruptions, such as signals or activating a debugger, whose processing has been delayed until it is safe to run Python code and/or raise exceptions.

For example, pressing `Ctrl`-`C` causes a terminal to send the `signal.SIGINT` signal. This function executes the corresponding Python signal handler, which, by default, raises the `KeyboardInterrupt` exception.

`PyErr_CheckSignals()` should be called by long-running C code frequently enough so that the response appears immediate to humans.

Handlers invoked by this function currently include:

- Signal handlers, including Python functions registered using the `signal` module.

  Signal handlers are only run in the main thread of the main interpreter.

  (This is where the function got the name: originally, signals were the only way to interrupt the interpreter.)

- Running the garbage collector, if necessary.

- Executing a pending remote debugger script.

- Raise the exception set by `PyThreadState_SetAsyncExc()`.

If any handler raises an exception, immediately return `-1` with that exception set. Any remaining interruptions are left to be processed on the next `PyErr_CheckSignals()` invocation, if appropriate.

If all handlers finish successfully, or there are no handlers to run, return `0`.

Changed in version 3.12: This function may now invoke the garbage collector.

Changed in version 3.14: This function may now execute a remote debugger script, if remote debugging is enabled.

Changed in version 3.15: The exception set by `PyThreadState_SetAsyncExc()` is now raised.

<!-- anchor: c.PyErr_SetInterrupt | type: c function -->
### `void PyErr_SetInterrupt()`

*Part of the Stable ABI.*

Simulate the effect of a `SIGINT` signal arriving. This is equivalent to `PyErr_SetInterruptEx(SIGINT)`.

**Note:**

This function is async-signal-safe. It can be called without an attached thread state and from a C signal handler.

<!-- anchor: c.PyErr_SetInterruptEx | type: c function -->
### `int PyErr_SetInterruptEx(int signum)`

*Part of the Stable ABI since version 3.10.*

Simulate the effect of a signal arriving. The next time `PyErr_CheckSignals()` is called, the Python signal handler for the given signal number will be called.

This function can be called by C code that sets up its own signal handling and wants Python signal handlers to be invoked as expected when an interruption is requested (for example when the user presses Ctrl-C to interrupt an operation).

If the given signal isn’t handled by Python (it was set to `signal.SIG_DFL` or `signal.SIG_IGN`), it will be ignored.

If *signum* is outside of the allowed range of signal numbers, `-1` is returned. Otherwise, `0` is returned. The error indicator is never changed by this function.

**Note:**

This function is async-signal-safe. It can be called without an attached thread state and from a C signal handler.

Added in version 3.10.

<!-- anchor: c.PySignal_SetWakeupFd | type: c function -->
### `int PySignal_SetWakeupFd(int fd)`

This utility function specifies a file descriptor to which the signal number is written as a single byte whenever a signal is received. *fd* must be non-blocking. It returns the previous such file descriptor.

The value `-1` disables the feature; this is the initial state. This is equivalent to `signal.set_wakeup_fd()` in Python, but without any error checking. *fd* should be a valid file descriptor. The function should only be called from the main thread.

Changed in version 3.5: On Windows, the function now also supports socket handles.

<!-- anchor: exception-classes | type: section -->
## Exception Classes

<!-- anchor: c.PyErr_NewException | type: c function -->
### `PyObject *PyErr_NewException(const char *name, PyObject *base, PyObject *dict)`

*Return value: New reference.**Part of the Stable ABI.*

This utility function creates and returns a new exception class. The *name* argument must be the name of the new exception, a C string of the form `module.classname`. The *base* and *dict* arguments are normally `NULL`. This creates a class object derived from `Exception` (accessible in C as `PyExc_Exception`).

The `__module__` attribute of the new class is set to the first part (up to the last dot) of the *name* argument, and the class name is set to the last part (after the last dot). The *base* argument can be used to specify alternate base classes; it can either be only one class or a tuple of classes. The *dict* argument can be used to specify a dictionary of class variables and methods.

<!-- anchor: c.PyErr_NewExceptionWithDoc | type: c function -->
### `PyObject *PyErr_NewExceptionWithDoc(const char *name, const char *doc, PyObject *base, PyObject *dict)`

*Return value: New reference.**Part of the Stable ABI.*

Same as `PyErr_NewException()`, except that the new exception class can easily be given a docstring: If *doc* is non-`NULL`, it will be used as the docstring for the exception class.

Added in version 3.2.

<!-- anchor: c.PyExceptionClass_Check | type: c function -->
### `int PyExceptionClass_Check(PyObject *ob)`

Return non-zero if *ob* is an exception class, zero otherwise. This function always succeeds.

<!-- anchor: c.PyExceptionClass_Name | type: c function -->
### `const char *PyExceptionClass_Name(PyObject *ob)`

*Part of the Stable ABI since version 3.8.*

Return `tp_name` of the exception class *ob*.

<!-- anchor: c.PyException_HEAD | type: c macro -->
### `PyException_HEAD`

This is a macro including the base fields for an exception object.

This was included in Python’s C API by mistake and is not designed for use in extensions. For creating custom exception objects, use `PyErr_NewException()` or otherwise create a class inheriting from `PyExc_BaseException`.

Soft deprecated since version 3.15.

<!-- anchor: exception-objects | type: section -->
## Exception Objects

<!-- anchor: c.PyExceptionInstance_Check | type: c function -->
### `int PyExceptionInstance_Check(PyObject *op)`

Return true if *op* is an instance of `BaseException`, false otherwise. This function always succeeds.

<!-- anchor: c.PyExceptionInstance_Class | type: c macro -->
### `PyExceptionInstance_Class(op)`

Equivalent to `Py_TYPE(op)`.

<!-- anchor: c.PyException_GetTraceback | type: c function -->
### `PyObject *PyException_GetTraceback(PyObject *ex)`

*Return value: New reference.**Part of the Stable ABI.*

Return the traceback associated with the exception as a new reference, as accessible from Python through the `__traceback__` attribute. If there is no traceback associated, this returns `NULL`.

<!-- anchor: c.PyException_SetTraceback | type: c function -->
### `int PyException_SetTraceback(PyObject *ex, PyObject *tb)`

*Part of the Stable ABI.*

Set the traceback associated with the exception to *tb*. Use `Py_None` to clear it.

<!-- anchor: c.PyException_GetContext | type: c function -->
### `PyObject *PyException_GetContext(PyObject *ex)`

*Return value: New reference.**Part of the Stable ABI.*

Return the context (another exception instance during whose handling *ex* was raised) associated with the exception as a new reference, as accessible from Python through the `__context__` attribute. If there is no context associated, this returns `NULL`.

<!-- anchor: c.PyException_SetContext | type: c function -->
### `void PyException_SetContext(PyObject *ex, PyObject *ctx)`

*Part of the Stable ABI.*

Set the context associated with the exception to *ctx*. Use `NULL` to clear it. There is no type check to make sure that *ctx* is an exception instance. This “steals” a reference to *ctx*.

<!-- anchor: c.PyException_GetCause | type: c function -->
### `PyObject *PyException_GetCause(PyObject *ex)`

*Return value: New reference.**Part of the Stable ABI.*

Return the cause (either an exception instance, or `None`, set by `raise ... from ...`) associated with the exception as a new reference, as accessible from Python through the `__cause__` attribute.

<!-- anchor: c.PyException_SetCause | type: c function -->
### `void PyException_SetCause(PyObject *ex, PyObject *cause)`

*Part of the Stable ABI.*

Set the cause associated with the exception to *cause*. Use `NULL` to clear it. There is no type check to make sure that *cause* is either an exception instance or `None`. This “steals” a reference to *cause*.

The `__suppress_context__` attribute is implicitly set to `True` by this function.

<!-- anchor: c.PyException_GetArgs | type: c function -->
### `PyObject *PyException_GetArgs(PyObject *ex)`

*Return value: New reference.**Part of the Stable ABI since version 3.12.*

Return `args` of exception *ex*.

<!-- anchor: c.PyException_SetArgs | type: c function -->
### `void PyException_SetArgs(PyObject *ex, PyObject *args)`

*Part of the Stable ABI since version 3.12.*

Set `args` of exception *ex* to *args*.

<!-- anchor: c.PyUnstable_Exc_PrepReraiseStar | type: c function -->
### `PyObject *PyUnstable_Exc_PrepReraiseStar(PyObject *orig, PyObject *excs)`

*This is Unstable API. It may change without warning in minor releases.*

Implement part of the interpreter’s implementation of `except*`. *orig* is the original exception that was caught, and *excs* is the list of the exceptions that need to be raised. This list contains the unhandled part of *orig*, if any, as well as the exceptions that were raised from the `except*` clauses (so they have a different traceback from *orig*) and those that were reraised (and have the same traceback as *orig*). Return the `ExceptionGroup` that needs to be reraised in the end, or `None` if there is nothing to reraise.

Added in version 3.12.

<!-- anchor: unicode-exception-objects | type: section -->
## Unicode Exception Objects

The following functions are used to create and modify Unicode exceptions from C.

<!-- anchor: c.PyUnicodeDecodeError_Create | type: c function -->
### `PyObject *PyUnicodeDecodeError_Create(const char *encoding, const char *object, Py_ssize_t length, Py_ssize_t start, Py_ssize_t end, const char *reason)`

*Return value: New reference.**Part of the Stable ABI.*

Create a `UnicodeDecodeError` object with the attributes *encoding*, *object*, *length*, *start*, *end* and *reason*. *encoding* and *reason* are UTF-8 encoded strings.

<!-- anchor: c.PyUnicodeDecodeError_GetEncoding | type: c function -->
### `PyObject *PyUnicodeDecodeError_GetEncoding(PyObject *exc)`

`PyObject *PyUnicodeEncodeError_GetEncoding(PyObject *exc)`

*Return value: New reference.**Part of the Stable ABI.*

Return the *encoding* attribute of the given exception object.

<!-- anchor: c.PyUnicodeDecodeError_GetObject | type: c function -->
### `PyObject *PyUnicodeDecodeError_GetObject(PyObject *exc)`

`PyObject *PyUnicodeEncodeError_GetObject(PyObject *exc)`

`PyObject *PyUnicodeTranslateError_GetObject(PyObject *exc)`

*Return value: New reference.**Part of the Stable ABI.*

Return the *object* attribute of the given exception object.

<!-- anchor: c.PyUnicodeDecodeError_GetStart | type: c function -->
### `int PyUnicodeDecodeError_GetStart(PyObject *exc, Py_ssize_t *start)`

`int PyUnicodeEncodeError_GetStart(PyObject *exc, Py_ssize_t *start)`

`int PyUnicodeTranslateError_GetStart(PyObject *exc, Py_ssize_t *start)`

*Part of the Stable ABI.*

Get the *start* attribute of the given exception object and place it into **start*. *start* must not be `NULL`. Return `0` on success, `-1` on failure.

If the `UnicodeError.object` is an empty sequence, the resulting *start* is `0`. Otherwise, it is clipped to `[0, len(object) - 1]`.

**See also:**

`UnicodeError.start`

<!-- anchor: c.PyUnicodeDecodeError_SetStart | type: c function -->
### `int PyUnicodeDecodeError_SetStart(PyObject *exc, Py_ssize_t start)`

`int PyUnicodeEncodeError_SetStart(PyObject *exc, Py_ssize_t start)`

`int PyUnicodeTranslateError_SetStart(PyObject *exc, Py_ssize_t start)`

*Part of the Stable ABI.*

Set the *start* attribute of the given exception object to *start*. Return `0` on success, `-1` on failure.

**Note:**

While passing a negative *start* does not raise an exception, the corresponding getters will not consider it as a relative offset.

<!-- anchor: c.PyUnicodeDecodeError_GetEnd | type: c function -->
### `int PyUnicodeDecodeError_GetEnd(PyObject *exc, Py_ssize_t *end)`

`int PyUnicodeEncodeError_GetEnd(PyObject *exc, Py_ssize_t *end)`

`int PyUnicodeTranslateError_GetEnd(PyObject *exc, Py_ssize_t *end)`

*Part of the Stable ABI.*

Get the *end* attribute of the given exception object and place it into **end*. *end* must not be `NULL`. Return `0` on success, `-1` on failure.

If the `UnicodeError.object` is an empty sequence, the resulting *end* is `0`. Otherwise, it is clipped to `[1, len(object)]`.

<!-- anchor: c.PyUnicodeDecodeError_SetEnd | type: c function -->
### `int PyUnicodeDecodeError_SetEnd(PyObject *exc, Py_ssize_t end)`

`int PyUnicodeEncodeError_SetEnd(PyObject *exc, Py_ssize_t end)`

`int PyUnicodeTranslateError_SetEnd(PyObject *exc, Py_ssize_t end)`

*Part of the Stable ABI.*

Set the *end* attribute of the given exception object to *end*. Return `0` on success, `-1` on failure.

**See also:**

`UnicodeError.end`

<!-- anchor: c.PyUnicodeDecodeError_GetReason | type: c function -->
### `PyObject *PyUnicodeDecodeError_GetReason(PyObject *exc)`

`PyObject *PyUnicodeEncodeError_GetReason(PyObject *exc)`

`PyObject *PyUnicodeTranslateError_GetReason(PyObject *exc)`

*Return value: New reference.**Part of the Stable ABI.*

Return the *reason* attribute of the given exception object.

<!-- anchor: c.PyUnicodeDecodeError_SetReason | type: c function -->
### `int PyUnicodeDecodeError_SetReason(PyObject *exc, const char *reason)`

`int PyUnicodeEncodeError_SetReason(PyObject *exc, const char *reason)`

`int PyUnicodeTranslateError_SetReason(PyObject *exc, const char *reason)`

*Part of the Stable ABI.*

Set the *reason* attribute of the given exception object to *reason*. Return `0` on success, `-1` on failure.

<!-- anchor: recursion-control | type: section -->
## Recursion Control

These two functions provide a way to perform safe recursive calls at the C level, both in the core and in extension modules. They are needed if the recursive code does not necessarily invoke Python code (which tracks its recursion depth automatically). They are also not needed for *tp_call* implementations because the call protocol takes care of recursion handling.

<!-- anchor: c.Py_EnterRecursiveCall | type: c function -->
### `int Py_EnterRecursiveCall(const char *where)`

*Part of the Stable ABI since version 3.9.*

Marks a point where a recursive C-level call is about to be performed.

The function then checks if the stack limit is reached. If this is the case, a `RecursionError` is set and a nonzero value is returned. Otherwise, zero is returned.

The check is based on the remaining C stack space of the current thread, not on a count of calls, so it is unaffected by `Py_SetRecursionLimit()` and `sys.setrecursionlimit()`.

*where* should be a UTF-8 encoded string such as `" in instance check"` to be concatenated to the `RecursionError` message caused by the recursion depth limit.

**See also:**

The `PyUnstable_ThreadState_SetStackProtection()` function.

Changed in version 3.9: This function is now also available in the limited API.

Changed in version 3.14: The check is based on the remaining C stack space. Previously, a separate counter of C-level calls was used.

<!-- anchor: c.Py_LeaveRecursiveCall | type: c function -->
### `void Py_LeaveRecursiveCall(void)`

*Part of the Stable ABI since version 3.9.*

Ends a `Py_EnterRecursiveCall()`. Must be called once for each *successful* invocation of `Py_EnterRecursiveCall()`.

Changed in version 3.9: This function is now also available in the limited API.

Properly implementing `tp_repr` for container types requires special recursion handling. In addition to protecting the stack, `tp_repr` also needs to track objects to prevent cycles. The following two functions facilitate this functionality. Effectively, these are the C equivalent to `@reprlib.recursive_repr`.

<!-- anchor: c.Py_ReprEnter | type: c function -->
### `int Py_ReprEnter(PyObject *object)`

*Part of the Stable ABI.*

Called at the beginning of the `tp_repr` implementation to detect cycles.

If the object has already been processed, the function returns a positive integer. In that case the `tp_repr` implementation should return a string object indicating a cycle. As examples, `dict` objects return `{...}` and `list` objects return `[...]`.

The function will return a negative integer if the recursion limit is reached. In that case the `tp_repr` implementation should typically return `NULL`.

Otherwise, the function returns zero and the `tp_repr` implementation can continue normally.

<!-- anchor: c.Py_ReprLeave | type: c function -->
### `void Py_ReprLeave(PyObject *object)`

*Part of the Stable ABI.*

Ends a `Py_ReprEnter()`. Must be called once for each invocation of `Py_ReprEnter()` that returns zero.

<!-- anchor: c.Py_GetRecursionLimit | type: c function -->
### `int Py_GetRecursionLimit(void)`

*Part of the Stable ABI.*

Get the recursion limit for the current interpreter. It can be set with `Py_SetRecursionLimit()`. The recursion limit prevents the Python interpreter stack from growing infinitely.

This function cannot fail, and the caller must hold an attached thread state.

**See also:**

`sys.getrecursionlimit()`

<!-- anchor: c.Py_SetRecursionLimit | type: c function -->
### `void Py_SetRecursionLimit(int new_limit)`

*Part of the Stable ABI.*

Set the recursion limit for the current interpreter.

This function cannot fail, and the caller must hold an attached thread state.

**See also:**

`sys.setrecursionlimit()`

<!-- anchor: exception-and-warning-types | type: section -->
## Exception and warning types

All standard Python exceptions and warning categories are available as global variables whose names are `PyExc_` followed by the Python exception name. These have the type PyObject*; they are all class objects.

For completeness, here are all the variables:

<!-- anchor: exception-types | type: section -->
### Exception types

| C name | Python name |
| --- | --- |
| `PyObject *PyExc_BaseException` *Part of the Stable ABI.* | `BaseException` |
| `PyObject *PyExc_BaseExceptionGroup` *Part of the Stable ABI since version 3.11.* | `BaseExceptionGroup` |
| `PyObject *PyExc_Exception` *Part of the Stable ABI.* | `Exception` |
| `PyObject *PyExc_ArithmeticError` *Part of the Stable ABI.* | `ArithmeticError` |
| `PyObject *PyExc_AssertionError` *Part of the Stable ABI.* | `AssertionError` |
| `PyObject *PyExc_AttributeError` *Part of the Stable ABI.* | `AttributeError` |
| `PyObject *PyExc_BlockingIOError` *Part of the Stable ABI since version 3.7.* | `BlockingIOError` |
| `PyObject *PyExc_BrokenPipeError` *Part of the Stable ABI since version 3.7.* | `BrokenPipeError` |
| `PyObject *PyExc_BufferError` *Part of the Stable ABI.* | `BufferError` |
| `PyObject *PyExc_ChildProcessError` *Part of the Stable ABI since version 3.7.* | `ChildProcessError` |
| `PyObject *PyExc_ConnectionAbortedError` *Part of the Stable ABI since version 3.7.* | `ConnectionAbortedError` |
| `PyObject *PyExc_ConnectionError` *Part of the Stable ABI since version 3.7.* | `ConnectionError` |
| `PyObject *PyExc_ConnectionRefusedError` *Part of the Stable ABI since version 3.7.* | `ConnectionRefusedError` |
| `PyObject *PyExc_ConnectionResetError` *Part of the Stable ABI since version 3.7.* | `ConnectionResetError` |
| `PyObject *PyExc_EOFError` *Part of the Stable ABI.* | `EOFError` |
| `PyObject *PyExc_FileExistsError` *Part of the Stable ABI since version 3.7.* | `FileExistsError` |
| `PyObject *PyExc_FileNotFoundError` *Part of the Stable ABI since version 3.7.* | `FileNotFoundError` |
| `PyObject *PyExc_FloatingPointError` *Part of the Stable ABI.* | `FloatingPointError` |
| `PyObject *PyExc_GeneratorExit` *Part of the Stable ABI.* | `GeneratorExit` |
| `PyObject *PyExc_ImportCycleError` | `ImportCycleError` |
| `PyObject *PyExc_ImportError` *Part of the Stable ABI.* | `ImportError` |
| `PyObject *PyExc_IndentationError` *Part of the Stable ABI.* | `IndentationError` |
| `PyObject *PyExc_IndexError` *Part of the Stable ABI.* | `IndexError` |
| `PyObject *PyExc_InterruptedError` *Part of the Stable ABI since version 3.7.* | `InterruptedError` |
| `PyObject *PyExc_IsADirectoryError` *Part of the Stable ABI since version 3.7.* | `IsADirectoryError` |
| `PyObject *PyExc_KeyError` *Part of the Stable ABI.* | `KeyError` |
| `PyObject *PyExc_KeyboardInterrupt` *Part of the Stable ABI.* | `KeyboardInterrupt` |
| `PyObject *PyExc_LookupError` *Part of the Stable ABI.* | `LookupError` |
| `PyObject *PyExc_MemoryError` *Part of the Stable ABI.* | `MemoryError` |
| `PyObject *PyExc_ModuleNotFoundError` *Part of the Stable ABI since version 3.6.* | `ModuleNotFoundError` |
| `PyObject *PyExc_NameError` *Part of the Stable ABI.* | `NameError` |
| `PyObject *PyExc_NotADirectoryError` *Part of the Stable ABI since version 3.7.* | `NotADirectoryError` |
| `PyObject *PyExc_NotImplementedError` *Part of the Stable ABI.* | `NotImplementedError` |
| `PyObject *PyExc_OSError` *Part of the Stable ABI.* | `OSError` |
| `PyObject *PyExc_OverflowError` *Part of the Stable ABI.* | `OverflowError` |
| `PyObject *PyExc_PermissionError` *Part of the Stable ABI since version 3.7.* | `PermissionError` |
| `PyObject *PyExc_ProcessLookupError` *Part of the Stable ABI since version 3.7.* | `ProcessLookupError` |
| `PyObject *PyExc_PythonFinalizationError` | `PythonFinalizationError` |
| `PyObject *PyExc_RecursionError` *Part of the Stable ABI since version 3.7.* | `RecursionError` |
| `PyObject *PyExc_ReferenceError` *Part of the Stable ABI.* | `ReferenceError` |
| `PyObject *PyExc_RuntimeError` *Part of the Stable ABI.* | `RuntimeError` |
| `PyObject *PyExc_StopAsyncIteration` *Part of the Stable ABI since version 3.7.* | `StopAsyncIteration` |
| `PyObject *PyExc_StopIteration` *Part of the Stable ABI.* | `StopIteration` |
| `PyObject *PyExc_SyntaxError` *Part of the Stable ABI.* | `SyntaxError` |
| `PyObject *PyExc_SystemError` *Part of the Stable ABI.* | `SystemError` |
| `PyObject *PyExc_SystemExit` *Part of the Stable ABI.* | `SystemExit` |
| `PyObject *PyExc_TabError` *Part of the Stable ABI.* | `TabError` |
| `PyObject *PyExc_TimeoutError` *Part of the Stable ABI since version 3.7.* | `TimeoutError` |
| `PyObject *PyExc_TypeError` *Part of the Stable ABI.* | `TypeError` |
| `PyObject *PyExc_UnboundLocalError` *Part of the Stable ABI.* | `UnboundLocalError` |
| `PyObject *PyExc_UnicodeDecodeError` *Part of the Stable ABI.* | `UnicodeDecodeError` |
| `PyObject *PyExc_UnicodeEncodeError` *Part of the Stable ABI.* | `UnicodeEncodeError` |
| `PyObject *PyExc_UnicodeError` *Part of the Stable ABI.* | `UnicodeError` |
| `PyObject *PyExc_UnicodeTranslateError` *Part of the Stable ABI.* | `UnicodeTranslateError` |
| `PyObject *PyExc_ValueError` *Part of the Stable ABI.* | `ValueError` |
| `PyObject *PyExc_ZeroDivisionError` *Part of the Stable ABI.* | `ZeroDivisionError` |

Added in version 3.3: `PyExc_BlockingIOError`, `PyExc_BrokenPipeError`, `PyExc_ChildProcessError`, `PyExc_ConnectionError`, `PyExc_ConnectionAbortedError`, `PyExc_ConnectionRefusedError`, `PyExc_ConnectionResetError`, `PyExc_FileExistsError`, `PyExc_FileNotFoundError`, `PyExc_InterruptedError`, `PyExc_IsADirectoryError`, `PyExc_NotADirectoryError`, `PyExc_PermissionError`, `PyExc_ProcessLookupError` and `PyExc_TimeoutError` were introduced following **PEP 3151**.

Added in version 3.5: `PyExc_StopAsyncIteration` and `PyExc_RecursionError`.

Added in version 3.6: `PyExc_ModuleNotFoundError`.

Added in version 3.11: `PyExc_BaseExceptionGroup`.

<!-- anchor: oserror-aliases | type: section -->
### OSError aliases

The following are a compatibility aliases to `PyExc_OSError`.

Changed in version 3.3: These aliases used to be separate exception types.

| C name | Python name | Notes |
| --- | --- | --- |
| `PyObject *PyExc_EnvironmentError` *Part of the Stable ABI.* | `OSError` |  |
| `PyObject *PyExc_IOError` *Part of the Stable ABI.* | `OSError` |  |
| `PyObject *PyExc_WindowsError` *Part of the Stable ABI on Windows since version 3.7.* | `OSError` | [win] |

Notes:

[win]

`PyExc_WindowsError` is only defined on Windows; protect code that uses this by testing that the preprocessor macro `MS_WINDOWS` is defined.

<!-- anchor: warning-types | type: section -->
### Warning types

| C name | Python name |
| --- | --- |
| `PyObject *PyExc_Warning` *Part of the Stable ABI.* | `Warning` |
| `PyObject *PyExc_BytesWarning` *Part of the Stable ABI.* | `BytesWarning` |
| `PyObject *PyExc_DeprecationWarning` *Part of the Stable ABI.* | `DeprecationWarning` |
| `PyObject *PyExc_EncodingWarning` *Part of the Stable ABI since version 3.10.* | `EncodingWarning` |
| `PyObject *PyExc_FutureWarning` *Part of the Stable ABI.* | `FutureWarning` |
| `PyObject *PyExc_ImportWarning` *Part of the Stable ABI.* | `ImportWarning` |
| `PyObject *PyExc_PendingDeprecationWarning` *Part of the Stable ABI.* | `PendingDeprecationWarning` |
| `PyObject *PyExc_ResourceWarning` *Part of the Stable ABI since version 3.7.* | `ResourceWarning` |
| `PyObject *PyExc_RuntimeWarning` *Part of the Stable ABI.* | `RuntimeWarning` |
| `PyObject *PyExc_SyntaxWarning` *Part of the Stable ABI.* | `SyntaxWarning` |
| `PyObject *PyExc_UnicodeWarning` *Part of the Stable ABI.* | `UnicodeWarning` |
| `PyObject *PyExc_UserWarning` *Part of the Stable ABI.* | `UserWarning` |

Added in version 3.2: `PyExc_ResourceWarning`.

Added in version 3.10: `PyExc_EncodingWarning`.

<!-- anchor: tracebacks | type: section -->
## Tracebacks

<!-- anchor: c.PyTraceBack_Type | type: c var -->
### `PyTypeObject PyTraceBack_Type`

*Part of the Stable ABI.*

Type object for traceback objects. This is available as `types.TracebackType` in the Python layer.

<!-- anchor: c.PyTraceBack_Check | type: c function -->
### `int PyTraceBack_Check(PyObject *op)`

Return true if *op* is a traceback object, false otherwise. This function does not account for subtypes.

<!-- anchor: c.PyTraceBack_Here | type: c function -->
### `int PyTraceBack_Here(PyFrameObject *f)`

*Part of the Stable ABI.*

Replace the `__traceback__` attribute on the current exception with a new traceback prepending *f* to the existing chain.

Calling this function without an exception set is undefined behavior.

This function returns `0` on success, and returns `-1` with an exception set on failure.

<!-- anchor: c.PyTraceBack_Print | type: c function -->
### `int PyTraceBack_Print(PyObject *tb, PyObject *f)`

*Part of the Stable ABI.*

Write the traceback *tb* into the file *f*.

This function returns `0` on success, and returns `-1` with an exception set on failure.

<!-- anchor: c.PyUnstable_DumpTraceback | type: c function -->
### `const char *PyUnstable_DumpTraceback(int fd, PyThreadState *tstate)`

*This is Unstable API. It may change without warning in minor releases.*

Write a trace of the Python stack in *tstate* into the file *fd*. The format looks like:

```c
Traceback (most recent call first):
  File "xxx", line xxx in <xxx>
  File "xxx", line xxx in <xxx>
  ...
  File "xxx", line xxx in <xxx>
```

This function is meant to debug situations such as segfaults, fatal errors, and similar. The file and function names it outputs are encoded to ASCII with backslashreplace and truncated to 500 characters. It writes only the first 100 frames; further frames are truncated with the line `...`.

This function will return `NULL` on success, or an error message on error.

This function is intended for use in crash scenarios such as signal handlers for SIGSEGV, where the interpreter may be in an inconsistent state. Given that it reads interpreter data structures that may be partially modified, the function might produce incomplete output or it may even crash itself.

The caller does not need to hold an attached thread state, nor does *tstate* need to be attached.

Added in version 3.15.

<!-- anchor: c.PyUnstable_DumpTracebackThreads | type: c function -->
### `const char *PyUnstable_DumpTracebackThreads(int fd, PyInterpreterState *interp, PyThreadState *current_tstate, Py_ssize_t max_threads)`

*This is Unstable API. It may change without warning in minor releases.*

Write the traces of all Python threads in *interp* into the file *fd*.

If *interp* is `NULL` then this function will try to identify the current interpreter using thread-specific storage. If it cannot, it will return an error.

If *current_tstate* is not `NULL` then it will be used to identify what the current thread is in the written output. If it is `NULL` then this function will identify the current thread using thread-specific storage. It is not an error if the function is unable to get the current Python thread state.

This function will return `NULL` on success, or an error message on error.

This function is meant to debug situations such as segfaults, fatal errors, and similar. It calls `PyUnstable_DumpTraceback()` for each thread. It only writes the tracebacks of the first *max_threads* threads, further output is truncated with the line `...`. If *max_threads* is 0, the function will use a default value of 100 for the argument.

This function is intended for use in crash scenarios such as signal handlers for SIGSEGV, where the interpreter may be in an inconsistent state. Given that it reads interpreter data structures that may be partially modified, the function might produce incomplete output or it may even crash itself.

The caller does not need to hold an attached thread state, nor does *current_tstate* need to be attached.

**Warning:**

On the free-threaded build, this function is not thread-safe. If another thread deletes its thread state while this function is being called, the process will likely crash.

Added in version 3.15.
