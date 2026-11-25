# Exception Handling

The functions described in this chapter will let you handle and raise Python
exceptions. It is important to understand some of the basics of Python
exception handling. It works somewhat like the POSIX `errno` variable:
there is a global indicator (per thread) of the last error that occurred. Most
C API functions don’t clear this on success, but will set it to indicate the
cause of the error on failure. Most C API functions also return an error
indicator, usually `NULL` if they are supposed to return a pointer, or `-1`
if they return an integer (exception: the `PyArg_*` functions
return `1` for success and `0` for failure).

Concretely, the error indicator consists of three object pointers: the
exception’s type, the exception’s value, and the traceback object. Any
of those pointers can be `NULL` if non-set (although some combinations are
forbidden, for example you can’t have a non-`NULL` traceback if the exception
type is `NULL`).

When a function must fail because some function it called failed, it generally
doesn’t set the error indicator; the function it called already set it. It is
responsible for either handling the error and clearing the exception or
returning after cleaning up any resources it holds (such as object references or
memory allocations); it should *not* continue normally if it is not prepared to
handle the error. If returning due to an error, it is important to indicate to
the caller that an error has been set. If the error is not handled or carefully
propagated, additional calls into the Python/C API may not behave as intended
and may fail in mysterious ways.

Note

The error indicator is **not** the result of `sys.exc_info()`.
The former corresponds to an exception that is not yet caught (and is
therefore still propagating), while the latter returns an exception after
it is caught (and has therefore stopped propagating).

## Printing and clearing

void PyErr\_Clear()
:   *Part of the Stable ABI.*

    Clear the error indicator. If the error indicator is not set, there is no
    effect.

void PyErr\_PrintEx(int set\_sys\_last\_vars)
:   *Part of the Stable ABI.*

    Print a standard traceback to `sys.stderr` and clear the error indicator.
    **Unless** the error is a `SystemExit`, in that case no traceback is
    printed and the Python process will exit with the error code specified by
    the `SystemExit` instance.

    Call this function **only** when the error indicator is set. Otherwise it
    will cause a fatal error!

    If *set\_sys\_last\_vars* is nonzero, the variable `sys.last_exc` is
    set to the printed exception. For backwards compatibility, the
    deprecated variables `sys.last_type`, `sys.last_value` and
    `sys.last_traceback` are also set to the type, value and traceback
    of this exception, respectively.

void PyErr\_Print()
:   *Part of the Stable ABI.*

    Alias for `PyErr_PrintEx(1)`.

void PyErr\_WriteUnraisable(PyObject \*obj)
:   *Part of the Stable ABI.*

    Call `sys.unraisablehook()` using the current exception and *obj*
    argument.

    This utility function prints a warning message to `sys.stderr` when an
    exception has been set but it is impossible for the interpreter to actually
    raise the exception. It is used, for example, when an exception occurs in an
    `__del__()` method.

    The function is called with a single argument *obj* that identifies the context
    in which the unraisable exception occurred. If possible,
    the repr of *obj* will be printed in the warning message.
    If *obj* is `NULL`, only the traceback is printed.

    An exception must be set when calling this function.

void PyErr\_FormatUnraisable(const char \*format, ...)
:   Similar to `PyErr_WriteUnraisable()`, but the *format* and subsequent
    parameters help format the warning message; they have the same meaning and
    values as in `PyUnicode_FromFormat()`.
    `PyErr_WriteUnraisable(obj)` is roughly equivalent to
    `PyErr_FormatUnraisable("Exception ignored in: %R", obj)`.
    If *format* is `NULL`, only the traceback is printed.

void PyErr\_DisplayException(PyObject \*exc)
:   *Part of the Stable ABI since version 3.12.*

    Print the standard traceback display of `exc` to `sys.stderr`, including
    chained exceptions and notes.

void PyErr\_Display(PyObject \*unused, PyObject \*value, PyObject \*tb)
:   *Part of the Stable ABI.*

    Legacy variant of `PyErr_DisplayException()`.

    Print the exception *value* with its traceback to `sys.stderr`.
    If *value* has no traceback set, *tb* is used as its traceback.
    The first argument is ignored.

    If `sys.stderr` is `None`, nothing is printed.
    If `sys.stderr` is not set, the exception is dumped to the
    C `stderr` stream instead.

    Deprecated since version 3.12: Use `PyErr_DisplayException()` instead.

## Raising exceptions

These functions help you set the current thread’s error indicator.
For convenience, some of these functions will always return a
`NULL` pointer for use in a `return` statement.

void PyErr\_SetString(PyObject \*type, const char \*message)
:   *Part of the Stable ABI.*

    This is the most common way to set the error indicator. The first argument
    specifies the exception type; it is normally one of the standard exceptions,
    e.g. `PyExc_RuntimeError`. You need not create a new
    strong reference to it (e.g. with `Py_INCREF()`).
    The second argument is an error message; it is decoded from `'utf-8'`.

void PyErr\_SetObject(PyObject \*type, PyObject \*value)
:   *Part of the Stable ABI.*

    This function is similar to `PyErr_SetString()` but lets you specify an
    arbitrary Python object for the “value” of the exception.

PyObject \*PyErr\_Format(PyObject \*exception, const char \*format, ...)
:   *Return value: Always NULL.* *Part of the Stable ABI.*

    This function sets the error indicator and returns `NULL`. *exception*
    should be a Python exception class. The *format* and subsequent
    parameters help format the error message; they have the same meaning and
    values as in `PyUnicode_FromFormat()`. *format* is an ASCII-encoded
    string.

PyObject \*PyErr\_FormatV(PyObject \*exception, const char \*format, va\_list vargs)
:   *Return value: Always NULL.* *Part of the Stable ABI since version 3.5.*

    Same as `PyErr_Format()`, but taking a `va_list` argument rather
    than a variable number of arguments.

void PyErr\_SetNone(PyObject \*type)
:   *Part of the Stable ABI.*

    This is a shorthand for `PyErr_SetObject(type, Py_None)`.

int PyErr\_BadArgument()
:   *Part of the Stable ABI.*

    This is a shorthand for `PyErr_SetString(PyExc_TypeError, message)`, where
    *message* indicates that a built-in operation was invoked with an illegal
    argument. It is mostly for internal use.

PyObject \*PyErr\_NoMemory()
:   *Return value: Always NULL.* *Part of the Stable ABI.*

    This is a shorthand for `PyErr_SetNone(PyExc_MemoryError)`; it returns `NULL`
    so an object allocation function can write `return PyErr_NoMemory();` when it
    runs out of memory.

PyObject \*PyErr\_SetFromErrno(PyObject \*type)
:   *Return value: Always NULL.* *Part of the Stable ABI.*

    This is a convenience function to raise an exception when a C library function
    has returned an error and set the C variable `errno`. It constructs a
    tuple object whose first item is the integer `errno` value and whose
    second item is the corresponding error message (gotten from `strerror()`),
    and then calls `PyErr_SetObject(type, object)`. On Unix, when the
    `errno` value is `EINTR`, indicating an interrupted system call,
    this calls `PyErr_CheckSignals()`, and if that set the error indicator,
    leaves it set to that. The function always returns `NULL`, so a wrapper
    function around a system call can write `return PyErr_SetFromErrno(type);`
    when the system call returns an error.

PyObject \*PyErr\_SetFromErrnoWithFilenameObject(PyObject \*type, PyObject \*filenameObject)
:   *Return value: Always NULL.* *Part of the Stable ABI.*

    Similar to `PyErr_SetFromErrno()`, with the additional behavior that if
    *filenameObject* is not `NULL`, it is passed to the constructor of *type* as
    a third parameter. In the case of `OSError` exception,
    this is used to define the `filename` attribute of the
    exception instance.

PyObject \*PyErr\_SetFromErrnoWithFilenameObjects(PyObject \*type, PyObject \*filenameObject, PyObject \*filenameObject2)
:   *Return value: Always NULL.* *Part of the Stable ABI since version 3.7.*

    Similar to `PyErr_SetFromErrnoWithFilenameObject()`, but takes a second
    filename object, for raising errors when a function that takes two filenames
    fails.

PyObject \*PyErr\_SetFromErrnoWithFilename(PyObject \*type, const char \*filename)
:   *Return value: Always NULL.* *Part of the Stable ABI.*

    Similar to `PyErr_SetFromErrnoWithFilenameObject()`, but the filename
    is given as a C string. *filename* is decoded from the [filesystem
    encoding and error handler](../glossary.md#term-filesystem-encoding-and-error-handler).

PyObject \*PyErr\_SetFromWindowsErr(int ierr)
:   *Return value: Always NULL.* *Part of the Stable ABI on Windows since version 3.7.*

    This is a convenience function to raise `OSError`. If called with
    *ierr* of `0`, the error code returned by a call to `GetLastError()`
    is used instead. It calls the Win32 function `FormatMessage()` to retrieve
    the Windows description of error code given by *ierr* or `GetLastError()`,
    then it constructs a `OSError` object with the `winerror`
    attribute set to the error code, the `strerror` attribute
    set to the corresponding error message (gotten from
    `FormatMessage()`), and then calls `PyErr_SetObject(PyExc_OSError,
    object)`. This function always returns `NULL`.

    Availability: Windows.

PyObject \*PyErr\_SetExcFromWindowsErr(PyObject \*type, int ierr)
:   *Return value: Always NULL.* *Part of the Stable ABI on Windows since version 3.7.*

    Similar to `PyErr_SetFromWindowsErr()`, with an additional parameter
    specifying the exception type to be raised.

    Availability: Windows.

PyObject \*PyErr\_SetFromWindowsErrWithFilename(int ierr, const char \*filename)
:   *Return value: Always NULL.* *Part of the Stable ABI on Windows since version 3.7.*

    Similar to `PyErr_SetFromWindowsErr()`, with the additional behavior
    that if *filename* is not `NULL`, it is decoded from the filesystem
    encoding (`os.fsdecode()`) and passed to the constructor of
    `OSError` as a third parameter to be used to define the
    `filename` attribute of the exception instance.

    Availability: Windows.

PyObject \*PyErr\_SetExcFromWindowsErrWithFilenameObject(PyObject \*type, int ierr, PyObject \*filename)
:   *Return value: Always NULL.* *Part of the Stable ABI on Windows since version 3.7.*

    Similar to `PyErr_SetExcFromWindowsErr()`, with the additional behavior
    that if *filename* is not `NULL`, it is passed to the constructor of
    `OSError` as a third parameter to be used to define the
    `filename` attribute of the exception instance.

    Availability: Windows.

PyObject \*PyErr\_SetExcFromWindowsErrWithFilenameObjects(PyObject \*type, int ierr, PyObject \*filename, PyObject \*filename2)
:   *Return value: Always NULL.* *Part of the Stable ABI on Windows since version 3.7.*

    Similar to `PyErr_SetExcFromWindowsErrWithFilenameObject()`,
    but accepts a second filename object.

    Availability: Windows.

PyObject \*PyErr\_SetExcFromWindowsErrWithFilename(PyObject \*type, int ierr, const char \*filename)
:   *Return value: Always NULL.* *Part of the Stable ABI on Windows since version 3.7.*

    Similar to `PyErr_SetFromWindowsErrWithFilename()`, with an additional
    parameter specifying the exception type to be raised.

    Availability: Windows.

PyObject \*PyErr\_SetImportError(PyObject \*msg, PyObject \*name, PyObject \*path)
:   *Return value: Always NULL.* *Part of the Stable ABI since version 3.7.*

    This is a convenience function to raise `ImportError`. *msg* will be
    set as the exception’s message string. *name* and *path*, both of which can
    be `NULL`, will be set as the `ImportError`’s respective `name`
    and `path` attributes.

PyObject \*PyErr\_SetImportErrorSubclass(PyObject \*exception, PyObject \*msg, PyObject \*name, PyObject \*path)
:   *Return value: Always NULL.* *Part of the Stable ABI since version 3.6.*

    Much like `PyErr_SetImportError()` but this function allows for
    specifying a subclass of `ImportError` to raise.

void PyErr\_SyntaxLocationObject(PyObject \*filename, int lineno, int col\_offset)
:   Set file, line, and offset information for the current exception. If the
    current exception is not a `SyntaxError`, then it sets additional
    attributes, which make the exception printing subsystem think the exception
    is a `SyntaxError`.

void PyErr\_RangedSyntaxLocationObject(PyObject \*filename, int lineno, int col\_offset, int end\_lineno, int end\_col\_offset)
:   Similar to `PyErr_SyntaxLocationObject()`, but also sets the
    *end\_lineno* and *end\_col\_offset* information for the current exception.

void PyErr\_SyntaxLocationEx(const char \*filename, int lineno, int col\_offset)
:   *Part of the Stable ABI since version 3.7.*

    Like `PyErr_SyntaxLocationObject()`, but *filename* is a byte string
    decoded from the filesystem encoding and error handler.

void PyErr\_SyntaxLocation(const char \*filename, int lineno)
:   *Part of the Stable ABI.*

    Like `PyErr_SyntaxLocationEx()`, but the *col\_offset* parameter is
    omitted.

void PyErr\_BadInternalCall()
:   *Part of the Stable ABI.*

    This is a shorthand for `PyErr_SetString(PyExc_SystemError, message)`,
    where *message* indicates that an internal operation (e.g. a Python/C API
    function) was invoked with an illegal argument. It is mostly for internal
    use.

PyObject \*PyErr\_ProgramTextObject(PyObject \*filename, int lineno)
:   Get the source line in *filename* at line *lineno*. *filename* should be a
    Python `str` object.

    On success, this function returns a Python string object with the found line.
    On failure, this function returns `NULL` without an exception set.

PyObject \*PyErr\_ProgramText(const char \*filename, int lineno)
:   *Part of the Stable ABI.*

    Similar to `PyErr_ProgramTextObject()`, but *filename* is a
    const char\*, which is decoded with the
    filesystem encoding and error handler, instead of a
    Python object reference.

## Issuing warnings

Use these functions to issue warnings from C code. They mirror similar
functions exported by the Python `warnings` module. They normally
print a warning message to *sys.stderr*; however, it is
also possible that the user has specified that warnings are to be turned into
errors, and in that case they will raise an exception. It is also possible that
the functions raise an exception because of a problem with the warning machinery.
The return value is `0` if no exception is raised, or `-1` if an exception
is raised. (It is not possible to determine whether a warning message is
actually printed, nor what the reason is for the exception; this is
intentional.) If an exception is raised, the caller should do its normal
exception handling (for example, `Py_DECREF()` owned references and return
an error value).

int PyErr\_WarnEx(PyObject \*category, const char \*message, Py\_ssize\_t stack\_level)
:   *Part of the Stable ABI.*

    Issue a warning message. The *category* argument is a warning category (see
    below) or `NULL`; the *message* argument is a UTF-8 encoded string. *stack\_level* is a
    positive number giving a number of stack frames; the warning will be issued from
    the currently executing line of code in that stack frame. A *stack\_level* of 1
    is the function calling `PyErr_WarnEx()`, 2 is the function above that,
    and so forth.

    Warning categories must be subclasses of `PyExc_Warning`;
    `PyExc_Warning` is a subclass of `PyExc_Exception`;
    the default warning category is `PyExc_RuntimeWarning`. The standard
    Python warning categories are available as global variables whose names are
    enumerated at Warning types.

    For information about warning control, see the documentation for the
    `warnings` module and the `-W` option in the command line
    documentation. There is no C API for warning control.

int PyErr\_Warn(PyObject \*category, const char \*message)
:   Equivalent to PyErr\_WarnEx(category, message, 1).

int PyErr\_WarnExplicitObject(PyObject \*category, PyObject \*message, PyObject \*filename, int lineno, PyObject \*module, PyObject \*registry)
:   Issue a warning message with explicit control over all warning attributes. This
    is a straightforward wrapper around the Python function
    `warnings.warn_explicit()`; see there for more information. The *module*
    and *registry* arguments may be set to `NULL` to get the default effect
    described there.

int PyErr\_WarnExplicit(PyObject \*category, const char \*message, const char \*filename, int lineno, const char \*module, PyObject \*registry)
:   *Part of the Stable ABI.*

    Similar to `PyErr_WarnExplicitObject()` except that *message* and
    *module* are UTF-8 encoded strings, and *filename* is decoded from the
    filesystem encoding and error handler.

int PyErr\_WarnFormat(PyObject \*category, Py\_ssize\_t stack\_level, const char \*format, ...)
:   *Part of the Stable ABI.*

    Function similar to `PyErr_WarnEx()`, but uses
    `PyUnicode_FromFormat()` to format the warning message. *format* is
    an ASCII-encoded string.

int PyErr\_WarnExplicitFormat(PyObject \*category, const char \*filename, int lineno, const char \*module, PyObject \*registry, const char \*format, ...)
:   Similar to `PyErr_WarnExplicit()`, but uses
    `PyUnicode_FromFormat()` to format the warning message. *format* is
    an ASCII-encoded string.

int PyErr\_ResourceWarning(PyObject \*source, Py\_ssize\_t stack\_level, const char \*format, ...)
:   *Part of the Stable ABI since version 3.6.*

    Function similar to `PyErr_WarnFormat()`, but *category* is
    `ResourceWarning` and it passes *source* to `warnings.WarningMessage`.

## Querying the error indicator

PyObject \*PyErr\_Occurred()
:   *Return value: Borrowed reference.* *Part of the Stable ABI.*

    Test whether the error indicator is set. If set, return the exception *type*
    (the first argument to the last call to one of the `PyErr_Set*`
    functions or to `PyErr_Restore()`). If not set, return `NULL`. You do not
    own a reference to the return value, so you do not need to `Py_DECREF()`
    it.

    The caller must have an attached thread state.

    Note

    Do not compare the return value to a specific exception; use
    `PyErr_ExceptionMatches()` instead, shown below. (The comparison could
    easily fail since the exception may be an instance instead of a class, in the
    case of a class exception, or it may be a subclass of the expected exception.)

int PyErr\_ExceptionMatches(PyObject \*exc)
:   *Part of the Stable ABI.*

    Equivalent to `PyErr_GivenExceptionMatches(PyErr_Occurred(), exc)`. This
    should only be called when an exception is actually set; a memory access
    violation will occur if no exception has been raised.

int PyErr\_GivenExceptionMatches(PyObject \*given, PyObject \*exc)
:   *Part of the Stable ABI.*

    Return true if the *given* exception matches the exception type in *exc*. If
    *exc* is a class object, this also returns true when *given* is an instance
    of a subclass. If *exc* is a tuple, all exception types in the tuple (and
    recursively in subtuples) are searched for a match.

PyObject \*PyErr\_GetRaisedException(void)
:   *Return value: New reference.* *Part of the Stable ABI since version 3.12.*

    Return the exception currently being raised, clearing the error indicator at
    the same time. Return `NULL` if the error indicator is not set.

    This function is used by code that needs to catch exceptions,
    or code that needs to save and restore the error indicator temporarily.

    For example:

    ```
    {
       PyObject *exc = PyErr_GetRaisedException();

       /* ... code that might produce other errors ... */

       PyErr_SetRaisedException(exc);
    }
    ```

    See also

    `PyErr_GetHandledException()`,
    to save the exception currently being handled.

void PyErr\_SetRaisedException(PyObject \*exc)
:   *Part of the Stable ABI since version 3.12.*

    Set *exc* as the exception currently being raised,
    clearing the existing exception if one is set. If *exc* is `NULL`,
    just clear the existing exception.

    *exc* must be a valid exception or `NULL`.

    This call “steals” a reference to *exc*.

void PyErr\_Fetch(PyObject \*\*ptype, PyObject \*\*pvalue, PyObject \*\*ptraceback)
:   *Part of the Stable ABI.*

    Deprecated since version 3.12: Use `PyErr_GetRaisedException()` instead.

    Retrieve the error indicator into three variables whose addresses are passed.
    If the error indicator is not set, set all three variables to `NULL`. If it is
    set, it will be cleared and you own a reference to each object retrieved. The
    value and traceback object may be `NULL` even when the type object is not.

    Note

    This function is normally only used by legacy code that needs to catch
    exceptions or save and restore the error indicator temporarily.

    For example:

    ```
    {
       PyObject *type, *value, *traceback;
       PyErr_Fetch(&type, &value, &traceback);

       /* ... code that might produce other errors ... */

       PyErr_Restore(type, value, traceback);
    }
    ```

void PyErr\_Restore(PyObject \*type, PyObject \*value, PyObject \*traceback)
:   *Part of the Stable ABI.*

    Deprecated since version 3.12: Use `PyErr_SetRaisedException()` instead.

    Set the error indicator from the three objects,
    *type*, *value*, and *traceback*,
    clearing the existing exception if one is set.
    If the objects are `NULL`, the error
    indicator is cleared. Do not pass a `NULL` type and non-`NULL` value or
    traceback. The exception type should be a class. Do not pass an invalid
    exception type or value. (Violating these rules will cause subtle problems
    later.) This call takes away a reference to each object: you must own a
    reference to each object before the call and after the call you no longer own
    these references. (If you don’t understand this, don’t use this function. I
    warned you.)

    Note

    This function is normally only used by legacy code that needs to
    save and restore the error indicator temporarily.
    Use `PyErr_Fetch()` to save the current error indicator.

void PyErr\_NormalizeException(PyObject \*\*exc, PyObject \*\*val, PyObject \*\*tb)
:   *Part of the Stable ABI.*

    Deprecated since version 3.12: Use `PyErr_GetRaisedException()` instead,
    to avoid any possible de-normalization.

    Under certain circumstances, the values returned by `PyErr_Fetch()` below
    can be “unnormalized”, meaning that `*exc` is a class object but `*val` is
    not an instance of the same class. This function can be used to instantiate
    the class in that case. If the values are already normalized, nothing happens.
    The delayed normalization is implemented to improve performance.

    Note

    This function *does not* implicitly set the
    `__traceback__`
    attribute on the exception value. If setting the traceback
    appropriately is desired, the following additional snippet is needed:

    ```
    if (tb != NULL) {
      PyException_SetTraceback(val, tb);
    }
    ```

PyObject \*PyErr\_GetHandledException(void)
:   *Part of the Stable ABI since version 3.11.*

    Retrieve the active exception instance, as would be returned by `sys.exception()`.
    This refers to an exception that was *already caught*, not to an exception that was
    freshly raised. Returns a new reference to the exception or `NULL`.
    Does not modify the interpreter’s exception state.

    Note

    This function is not normally used by code that wants to handle exceptions.
    Rather, it can be used when code needs to save and restore the exception
    state temporarily. Use `PyErr_SetHandledException()` to restore or
    clear the exception state.

void PyErr\_SetHandledException(PyObject \*exc)
:   *Part of the Stable ABI since version 3.11.*

    Set the active exception, as known from `sys.exception()`. This refers
    to an exception that was *already caught*, not to an exception that was
    freshly raised.
    To clear the exception state, pass `NULL`.

    Note

    This function is not normally used by code that wants to handle exceptions.
    Rather, it can be used when code needs to save and restore the exception
    state temporarily. Use `PyErr_GetHandledException()` to get the exception
    state.

void PyErr\_GetExcInfo(PyObject \*\*ptype, PyObject \*\*pvalue, PyObject \*\*ptraceback)
:   *Part of the Stable ABI since version 3.7.*

    Retrieve the old-style representation of the exception info, as known from
    `sys.exc_info()`. This refers to an exception that was *already caught*,
    not to an exception that was freshly raised. Returns new references for the
    three objects, any of which may be `NULL`. Does not modify the exception
    info state. This function is kept for backwards compatibility. Prefer using
    `PyErr_GetHandledException()`.

    Note

    This function is not normally used by code that wants to handle exceptions.
    Rather, it can be used when code needs to save and restore the exception
    state temporarily. Use `PyErr_SetExcInfo()` to restore or clear the
    exception state.

void PyErr\_SetExcInfo(PyObject \*type, PyObject \*value, PyObject \*traceback)
:   *Part of the Stable ABI since version 3.7.*

    Set the exception info, as known from `sys.exc_info()`. This refers
    to an exception that was *already caught*, not to an exception that was
    freshly raised. This function “steals” the references
    of the arguments.
    To clear the exception state, pass `NULL` for all three arguments.
    This function is kept for backwards compatibility. Prefer using
    `PyErr_SetHandledException()`.

    Note

    This function is not normally used by code that wants to handle exceptions.
    Rather, it can be used when code needs to save and restore the exception
    state temporarily. Use `PyErr_GetExcInfo()` to read the exception
    state.

    Changed in version 3.11: The `type` and `traceback` arguments are no longer used and
    can be NULL. The interpreter now derives them from the exception
    instance (the `value` argument). The function still
    “steals” references of all three arguments.

## Signal Handling

int PyErr\_CheckSignals()
:   *Part of the Stable ABI.*

    Handle external interruptions, such as signals or activating a debugger,
    whose processing has been delayed until it is safe
    to run Python code and/or raise exceptions.

    For example, pressing `Ctrl`-`C` causes a terminal to send the
    `signal.SIGINT` signal.
    This function executes the corresponding Python signal handler, which,
    by default, raises the `KeyboardInterrupt` exception.

    `PyErr_CheckSignals()` should be called by long-running C code
    frequently enough so that the response appears immediate to humans.

    Handlers invoked by this function currently include:

    - Signal handlers, including Python functions registered using
      the `signal` module.

      Signal handlers are only run in the main thread of the main interpreter.

      (This is where the function got the name: originally, signals
      were the only way to interrupt the interpreter.)
    - Running the garbage collector, if necessary.
    - Executing a pending remote debugger script.
    - Raise the exception set by `PyThreadState_SetAsyncExc()`.

    If any handler raises an exception, immediately return `-1` with that
    exception set.
    Any remaining interruptions are left to be processed on the next
    `PyErr_CheckSignals()` invocation, if appropriate.

    If all handlers finish successfully, or there are no handlers to run,
    return `0`.

    Changed in version 3.15: The exception set by `PyThreadState_SetAsyncExc()` is now raised.

void PyErr\_SetInterrupt()
:   *Part of the Stable ABI.*

    Simulate the effect of a `SIGINT` signal arriving.
    This is equivalent to `PyErr_SetInterruptEx(SIGINT)`.

    Note

    This function is async-signal-safe. It can be called without
    an attached thread state and from a C signal handler.

int PyErr\_SetInterruptEx(int signum)
:   *Part of the Stable ABI since version 3.10.*

    Simulate the effect of a signal arriving. The next time
    `PyErr_CheckSignals()` is called, the Python signal handler for
    the given signal number will be called.

    This function can be called by C code that sets up its own signal handling
    and wants Python signal handlers to be invoked as expected when an
    interruption is requested (for example when the user presses Ctrl-C
    to interrupt an operation).

    If the given signal isn’t handled by Python (it was set to
    `signal.SIG_DFL` or `signal.SIG_IGN`), it will be ignored.

    If *signum* is outside of the allowed range of signal numbers, `-1`
    is returned. Otherwise, `0` is returned. The error indicator is
    never changed by this function.

    Note

    This function is async-signal-safe. It can be called without
    an attached thread state and from a C signal handler.

int PySignal\_SetWakeupFd(int fd)
:   This utility function specifies a file descriptor to which the signal number
    is written as a single byte whenever a signal is received. *fd* must be
    non-blocking. It returns the previous such file descriptor.

    The value `-1` disables the feature; this is the initial state.
    This is equivalent to `signal.set_wakeup_fd()` in Python, but without any
    error checking. *fd* should be a valid file descriptor. The function should
    only be called from the main thread.

## Exception Classes

PyObject \*PyErr\_NewException(const char \*name, PyObject \*base, PyObject \*dict)
:   *Return value: New reference.* *Part of the Stable ABI.*

    This utility function creates and returns a new exception class. The *name*
    argument must be the name of the new exception, a C string of the form
    `module.classname`. The *base* and *dict* arguments are normally `NULL`.
    This creates a class object derived from `Exception` (accessible in C as
    `PyExc_Exception`).

    The `__module__` attribute of the new class is set to the first part (up
    to the last dot) of the *name* argument, and the class name is set to the last
    part (after the last dot). The *base* argument can be used to specify alternate
    base classes; it can either be only one class or a tuple of classes. The *dict*
    argument can be used to specify a dictionary of class variables and methods.

PyObject \*PyErr\_NewExceptionWithDoc(const char \*name, const char \*doc, PyObject \*base, PyObject \*dict)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Same as `PyErr_NewException()`, except that the new exception class can
    easily be given a docstring: If *doc* is non-`NULL`, it will be used as the
    docstring for the exception class.

int PyExceptionClass\_Check(PyObject \*ob)
:   Return non-zero if *ob* is an exception class, zero otherwise. This function always succeeds.

const char \*PyExceptionClass\_Name(PyObject \*ob)
:   *Part of the Stable ABI since version 3.8.*

    Return `tp_name` of the exception class *ob*.

PyException\_HEAD
:   This is a macro including the base fields for an
    exception object.

    This was included in Python’s C API by mistake and is not designed for use
    in extensions. For creating custom exception objects, use
    `PyErr_NewException()` or otherwise create a class inheriting from
    `PyExc_BaseException`.

    Soft deprecated since version 3.15.

## Exception Objects

int PyExceptionInstance\_Check(PyObject \*op)
:   Return true if *op* is an instance of `BaseException`, false
    otherwise. This function always succeeds.

PyExceptionInstance\_Class(op)
:   Equivalent to `Py_TYPE(op)`.

PyObject \*PyException\_GetTraceback(PyObject \*ex)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return the traceback associated with the exception as a new reference, as
    accessible from Python through the `__traceback__`
    attribute. If there is no
    traceback associated, this returns `NULL`.

int PyException\_SetTraceback(PyObject \*ex, PyObject \*tb)
:   *Part of the Stable ABI.*

    Set the traceback associated with the exception to *tb*. Use `Py_None` to
    clear it.

PyObject \*PyException\_GetContext(PyObject \*ex)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return the context (another exception instance during whose handling *ex* was
    raised) associated with the exception as a new reference, as accessible from
    Python through the `__context__` attribute.
    If there is no context associated, this returns `NULL`.

void PyException\_SetContext(PyObject \*ex, PyObject \*ctx)
:   *Part of the Stable ABI.*

    Set the context associated with the exception to *ctx*. Use `NULL` to clear
    it. There is no type check to make sure that *ctx* is an exception instance.
    This “steals” a reference to *ctx*.

PyObject \*PyException\_GetCause(PyObject \*ex)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return the cause (either an exception instance, or `None`,
    set by `raise ... from ...`) associated with the exception as a new
    reference, as accessible from Python through the
    `__cause__` attribute.

void PyException\_SetCause(PyObject \*ex, PyObject \*cause)
:   *Part of the Stable ABI.*

    Set the cause associated with the exception to *cause*. Use `NULL` to clear
    it. There is no type check to make sure that *cause* is either an exception
    instance or `None`.
    This “steals” a reference to *cause*.

    The `__suppress_context__` attribute is implicitly set
    to `True` by this function.

PyObject \*PyException\_GetArgs(PyObject \*ex)
:   *Return value: New reference.* *Part of the Stable ABI since version 3.12.*

    Return `args` of exception *ex*.

void PyException\_SetArgs(PyObject \*ex, PyObject \*args)
:   *Part of the Stable ABI since version 3.12.*

    Set `args` of exception *ex* to *args*.

PyObject \*PyUnstable\_Exc\_PrepReraiseStar(PyObject \*orig, PyObject \*excs)
:   *This is Unstable API. It may change without warning in minor releases.*

    Implement part of the interpreter’s implementation of `except*`.
    *orig* is the original exception that was caught, and *excs* is the list of
    the exceptions that need to be raised. This list contains the unhandled
    part of *orig*, if any, as well as the exceptions that were raised from the
    `except*` clauses (so they have a different traceback from *orig*) and
    those that were reraised (and have the same traceback as *orig*).
    Return the `ExceptionGroup` that needs to be reraised in the end, or
    `None` if there is nothing to reraise.

## Unicode Exception Objects

The following functions are used to create and modify Unicode exceptions from C.

PyObject \*PyUnicodeDecodeError\_Create(const char \*encoding, const char \*object, Py\_ssize\_t length, Py\_ssize\_t start, Py\_ssize\_t end, const char \*reason)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Create a `UnicodeDecodeError` object with the attributes *encoding*,
    *object*, *length*, *start*, *end* and *reason*. *encoding* and *reason* are
    UTF-8 encoded strings.

PyObject \*PyUnicodeDecodeError\_GetEncoding(PyObject \*exc)

PyObject \*PyUnicodeEncodeError\_GetEncoding(PyObject \*exc)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return the *encoding* attribute of the given exception object.

PyObject \*PyUnicodeDecodeError\_GetObject(PyObject \*exc)

PyObject \*PyUnicodeEncodeError\_GetObject(PyObject \*exc)

PyObject \*PyUnicodeTranslateError\_GetObject(PyObject \*exc)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return the *object* attribute of the given exception object.

int PyUnicodeDecodeError\_GetStart(PyObject \*exc, Py\_ssize\_t \*start)

int PyUnicodeEncodeError\_GetStart(PyObject \*exc, Py\_ssize\_t \*start)

int PyUnicodeTranslateError\_GetStart(PyObject \*exc, Py\_ssize\_t \*start)
:   *Part of the Stable ABI.*

    Get the *start* attribute of the given exception object and place it into
    *\*start*. *start* must not be `NULL`. Return `0` on success, `-1` on
    failure.

    If the `UnicodeError.object` is an empty sequence, the resulting
    *start* is `0`. Otherwise, it is clipped to `[0, len(object) - 1]`.

    See also

    `UnicodeError.start`

int PyUnicodeDecodeError\_SetStart(PyObject \*exc, Py\_ssize\_t start)

int PyUnicodeEncodeError\_SetStart(PyObject \*exc, Py\_ssize\_t start)

int PyUnicodeTranslateError\_SetStart(PyObject \*exc, Py\_ssize\_t start)
:   *Part of the Stable ABI.*

    Set the *start* attribute of the given exception object to *start*.
    Return `0` on success, `-1` on failure.

    Note

    While passing a negative *start* does not raise an exception,
    the corresponding getters will not consider it as a relative
    offset.

int PyUnicodeDecodeError\_GetEnd(PyObject \*exc, Py\_ssize\_t \*end)

int PyUnicodeEncodeError\_GetEnd(PyObject \*exc, Py\_ssize\_t \*end)

int PyUnicodeTranslateError\_GetEnd(PyObject \*exc, Py\_ssize\_t \*end)
:   *Part of the Stable ABI.*

    Get the *end* attribute of the given exception object and place it into
    *\*end*. *end* must not be `NULL`. Return `0` on success, `-1` on
    failure.

    If the `UnicodeError.object` is an empty sequence, the resulting
    *end* is `0`. Otherwise, it is clipped to `[1, len(object)]`.

int PyUnicodeDecodeError\_SetEnd(PyObject \*exc, Py\_ssize\_t end)

int PyUnicodeEncodeError\_SetEnd(PyObject \*exc, Py\_ssize\_t end)

int PyUnicodeTranslateError\_SetEnd(PyObject \*exc, Py\_ssize\_t end)
:   *Part of the Stable ABI.*

    Set the *end* attribute of the given exception object to *end*. Return `0`
    on success, `-1` on failure.

    See also

    `UnicodeError.end`

PyObject \*PyUnicodeDecodeError\_GetReason(PyObject \*exc)

PyObject \*PyUnicodeEncodeError\_GetReason(PyObject \*exc)

PyObject \*PyUnicodeTranslateError\_GetReason(PyObject \*exc)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return the *reason* attribute of the given exception object.

int PyUnicodeDecodeError\_SetReason(PyObject \*exc, const char \*reason)

int PyUnicodeEncodeError\_SetReason(PyObject \*exc, const char \*reason)

int PyUnicodeTranslateError\_SetReason(PyObject \*exc, const char \*reason)
:   *Part of the Stable ABI.*

    Set the *reason* attribute of the given exception object to *reason*. Return
    `0` on success, `-1` on failure.

## Recursion Control

These two functions provide a way to perform safe recursive calls at the C
level, both in the core and in extension modules. They are needed if the
recursive code does not necessarily invoke Python code (which tracks its
recursion depth automatically).
They are also not needed for *tp\_call* implementations
because the call protocol takes care of recursion handling.

int Py\_EnterRecursiveCall(const char \*where)
:   *Part of the Stable ABI since version 3.9.*

    Marks a point where a recursive C-level call is about to be performed.

    The function then checks if the stack limit is reached. If this is the
    case, a `RecursionError` is set and a nonzero value is returned.
    Otherwise, zero is returned.

    The check is based on the remaining C stack space of the current thread,
    not on a count of calls, so it is unaffected by
    `Py_SetRecursionLimit()` and `sys.setrecursionlimit()`.

    *where* should be a UTF-8 encoded string such as `" in instance check"` to
    be concatenated to the `RecursionError` message caused by the recursion
    depth limit.

    See also

    The `PyUnstable_ThreadState_SetStackProtection()` function.

void Py\_LeaveRecursiveCall(void)
:   *Part of the Stable ABI since version 3.9.*

    Ends a `Py_EnterRecursiveCall()`. Must be called once for each
    *successful* invocation of `Py_EnterRecursiveCall()`.

Properly implementing `tp_repr` for container types requires
special recursion handling. In addition to protecting the stack,
`tp_repr` also needs to track objects to prevent cycles. The
following two functions facilitate this functionality. Effectively,
these are the C equivalent to `@reprlib.recursive_repr`.

int Py\_ReprEnter(PyObject \*object)
:   *Part of the Stable ABI.*

    Called at the beginning of the `tp_repr` implementation to
    detect cycles.

    If the object has already been processed, the function returns a
    positive integer. In that case the `tp_repr` implementation
    should return a string object indicating a cycle. As examples,
    `dict` objects return `{...}` and `list` objects
    return `[...]`.

    The function will return a negative integer if the recursion limit
    is reached. In that case the `tp_repr` implementation should
    typically return `NULL`.

    Otherwise, the function returns zero and the `tp_repr`
    implementation can continue normally.

void Py\_ReprLeave(PyObject \*object)
:   *Part of the Stable ABI.*

    Ends a `Py_ReprEnter()`. Must be called once for each
    invocation of `Py_ReprEnter()` that returns zero.

int Py\_GetRecursionLimit(void)
:   *Part of the Stable ABI.*

    Get the recursion limit for the current interpreter. It can be set with
    `Py_SetRecursionLimit()`. The recursion limit prevents the
    Python interpreter stack from growing infinitely.

    This function cannot fail, and the caller must hold an
    attached thread state.

    See also

    `sys.getrecursionlimit()`

void Py\_SetRecursionLimit(int new\_limit)
:   *Part of the Stable ABI.*

    Set the recursion limit for the current interpreter.

    This function cannot fail, and the caller must hold an
    attached thread state.

    See also

    `sys.setrecursionlimit()`

## Exception and warning types

All standard Python exceptions and warning categories are available as global
variables whose names are `PyExc_` followed by the Python exception name.
These have the type PyObject\*; they are all class objects.

For completeness, here are all the variables:

### Exception types

These pointers are part of the Stable ABI since the
version in the *S.ABI* column (or since 3.2 when *S.ABI* is empty).
Exceptions marked N/A are *not* part of the Stable ABI.

| C name | S.ABI | Python name |
| --- | --- | --- |
| PyObject \*PyExc\_BaseException |  | `BaseException` |
| PyObject \*PyExc\_BaseExceptionGroup | 3.11 | `BaseExceptionGroup` |
| PyObject \*PyExc\_Exception |  | `Exception` |
| PyObject \*PyExc\_ArithmeticError |  | `ArithmeticError` |
| PyObject \*PyExc\_AssertionError |  | `AssertionError` |
| PyObject \*PyExc\_AttributeError |  | `AttributeError` |
| PyObject \*PyExc\_BlockingIOError | 3.7 | `BlockingIOError` |
| PyObject \*PyExc\_BrokenPipeError | 3.7 | `BrokenPipeError` |
| PyObject \*PyExc\_BufferError |  | `BufferError` |
| PyObject \*PyExc\_ChildProcessError | 3.7 | `ChildProcessError` |
| PyObject \*PyExc\_ConnectionAbortedError | 3.7 | `ConnectionAbortedError` |
| PyObject \*PyExc\_ConnectionError | 3.7 | `ConnectionError` |
| PyObject \*PyExc\_ConnectionRefusedError | 3.7 | `ConnectionRefusedError` |
| PyObject \*PyExc\_ConnectionResetError | 3.7 | `ConnectionResetError` |
| PyObject \*PyExc\_EOFError |  | `EOFError` |
| PyObject \*PyExc\_FileExistsError | 3.7 | `FileExistsError` |
| PyObject \*PyExc\_FileNotFoundError | 3.7 | `FileNotFoundError` |
| PyObject \*PyExc\_FloatingPointError |  | `FloatingPointError` |
| PyObject \*PyExc\_GeneratorExit |  | `GeneratorExit` |
| PyObject \*PyExc\_ImportCycleError | N/A | `ImportCycleError` |
| PyObject \*PyExc\_ImportError |  | `ImportError` |
| PyObject \*PyExc\_IndentationError |  | `IndentationError` |
| PyObject \*PyExc\_IndexError |  | `IndexError` |
| PyObject \*PyExc\_InterruptedError | 3.7 | `InterruptedError` |
| PyObject \*PyExc\_IsADirectoryError | 3.7 | `IsADirectoryError` |
| PyObject \*PyExc\_KeyError |  | `KeyError` |
| PyObject \*PyExc\_KeyboardInterrupt |  | `KeyboardInterrupt` |
| PyObject \*PyExc\_LookupError |  | `LookupError` |
| PyObject \*PyExc\_MemoryError |  | `MemoryError` |
| PyObject \*PyExc\_ModuleNotFoundError | 3.6 | `ModuleNotFoundError` |
| PyObject \*PyExc\_NameError |  | `NameError` |
| PyObject \*PyExc\_NotADirectoryError | 3.7 | `NotADirectoryError` |
| PyObject \*PyExc\_NotImplementedError |  | `NotImplementedError` |
| PyObject \*PyExc\_OSError |  | `OSError` |
| PyObject \*PyExc\_OverflowError |  | `OverflowError` |
| PyObject \*PyExc\_PermissionError | 3.7 | `PermissionError` |
| PyObject \*PyExc\_ProcessLookupError | 3.7 | `ProcessLookupError` |
| PyObject \*PyExc\_PythonFinalizationError |  | `PythonFinalizationError` |
| PyObject \*PyExc\_RecursionError | 3.7 | `RecursionError` |
| PyObject \*PyExc\_ReferenceError |  | `ReferenceError` |
| PyObject \*PyExc\_RuntimeError |  | `RuntimeError` |
| PyObject \*PyExc\_StopAsyncIteration | 3.7 | `StopAsyncIteration` |
| PyObject \*PyExc\_StopIteration |  | `StopIteration` |
| PyObject \*PyExc\_SyntaxError |  | `SyntaxError` |
| PyObject \*PyExc\_SystemError |  | `SystemError` |
| PyObject \*PyExc\_SystemExit |  | `SystemExit` |
| PyObject \*PyExc\_TabError |  | `TabError` |
| PyObject \*PyExc\_TimeoutError | 3.7 | `TimeoutError` |
| PyObject \*PyExc\_TypeError |  | `TypeError` |
| PyObject \*PyExc\_UnboundLocalError |  | `UnboundLocalError` |
| PyObject \*PyExc\_UnicodeDecodeError |  | `UnicodeDecodeError` |
| PyObject \*PyExc\_UnicodeEncodeError |  | `UnicodeEncodeError` |
| PyObject \*PyExc\_UnicodeError |  | `UnicodeError` |
| PyObject \*PyExc\_UnicodeTranslateError |  | `UnicodeTranslateError` |
| PyObject \*PyExc\_ValueError |  | `ValueError` |
| PyObject \*PyExc\_ZeroDivisionError |  | `ZeroDivisionError` |

### OSError aliases

The following are a compatibility aliases to `PyExc_OSError`.

| C name | Python name | Notes |
| --- | --- | --- |
| PyObject \*PyExc\_EnvironmentError  *Part of the Stable ABI.* | `OSError` |  |
| PyObject \*PyExc\_IOError  *Part of the Stable ABI.* | `OSError` |  |
| PyObject \*PyExc\_WindowsError  *Part of the Stable ABI on Windows since version 3.7.* | `OSError` | [[win]](#win) |

Notes:

[win]

`PyExc_WindowsError` is only defined on Windows; protect code that
uses this by testing that the preprocessor macro `MS_WINDOWS` is defined.

### Warning types

These pointers are part of the Stable ABI since the
version in the *S.ABI* column (or since 3.2 when *S.ABI* is empty).

| C name | S.ABI | Python name |
| --- | --- | --- |
| PyObject \*PyExc\_Warning |  | `Warning` |
| PyObject \*PyExc\_BytesWarning |  | `BytesWarning` |
| PyObject \*PyExc\_DeprecationWarning |  | `DeprecationWarning` |
| PyObject \*PyExc\_EncodingWarning | 3.10 | `EncodingWarning` |
| PyObject \*PyExc\_FutureWarning |  | `FutureWarning` |
| PyObject \*PyExc\_ImportWarning |  | `ImportWarning` |
| PyObject \*PyExc\_PendingDeprecationWarning |  | `PendingDeprecationWarning` |
| PyObject \*PyExc\_ResourceWarning | 3.7 | `ResourceWarning` |
| PyObject \*PyExc\_RuntimeWarning |  | `RuntimeWarning` |
| PyObject \*PyExc\_SyntaxWarning |  | `SyntaxWarning` |
| PyObject \*PyExc\_UnicodeWarning |  | `UnicodeWarning` |
| PyObject \*PyExc\_UserWarning |  | `UserWarning` |

## Tracebacks

PyTypeObject PyTraceBack\_Type
:   *Part of the Stable ABI.*

    Type object for traceback objects. This is available as
    `types.TracebackType` in the Python layer.

int PyTraceBack\_Check(PyObject \*op)
:   Return true if *op* is a traceback object, false otherwise. This function
    does not account for subtypes.

int PyTraceBack\_Here(PyFrameObject \*f)
:   *Part of the Stable ABI.*

    Replace the `__traceback__` attribute on the current
    exception with a new traceback prepending *f* to the existing chain.

    Calling this function without an exception set is undefined behavior.

    This function returns `0` on success, and returns `-1` with an
    exception set on failure.

int PyTraceBack\_Print(PyObject \*tb, PyObject \*f)
:   *Part of the Stable ABI.*

    Write the traceback *tb* into the file *f*.

    This function returns `0` on success, and returns `-1` with an
    exception set on failure.

const char \*PyUnstable\_DumpTraceback(int fd, PyThreadState \*tstate)
:   *This is Unstable API. It may change without warning in minor releases.*

    Write a trace of the Python stack in *tstate* into the file *fd*. The format
    looks like:

    ```
    Traceback (most recent call first):
      File "xxx", line xxx in <xxx>
      File "xxx", line xxx in <xxx>
      ...
      File "xxx", line xxx in <xxx>
    ```

    This function is meant to debug situations such as segfaults, fatal errors,
    and similar. The file and function names it outputs are encoded to ASCII with
    backslashreplace and truncated to 500 characters. It writes only the first
    100 frames; further frames are truncated with the line `...`.

    This function will return `NULL` on success, or an error message on error.

    This function is intended for use in crash scenarios such as signal handlers
    for SIGSEGV, where the interpreter may be in an inconsistent state. Given
    that it reads interpreter data structures that may be partially modified, the
    function might produce incomplete output or it may even crash itself.

    The caller does not need to hold an attached thread state, nor does
    *tstate* need to be attached.

    Added in version 3.15.

const char \*PyUnstable\_DumpTracebackThreads(int fd, PyInterpreterState \*interp, PyThreadState \*current\_tstate, Py\_ssize\_t max\_threads)
:   *This is Unstable API. It may change without warning in minor releases.*

    Write the traces of all Python threads in *interp* into the file *fd*.

    If *interp* is `NULL` then this function will try to identify the current
    interpreter using thread-specific storage. If it cannot, it will return an
    error.

    If *current\_tstate* is not `NULL` then it will be used to identify what the
    current thread is in the written output. If it is `NULL` then this function
    will identify the current thread using thread-specific storage. It is not an
    error if the function is unable to get the current Python thread state.

    This function will return `NULL` on success, or an error message on error.

    This function is meant to debug situations such as segfaults, fatal
    errors, and similar. It calls `PyUnstable_DumpTraceback()` for each
    thread. It only writes the tracebacks of the first *max\_threads* threads,
    further output is truncated with the line `...`. If *max\_threads* is 0, the
    function will use a default value of 100 for the argument.

    This function is intended for use in crash scenarios such as signal handlers
    for SIGSEGV, where the interpreter may be in an inconsistent state. Given
    that it reads interpreter data structures that may be partially modified, the
    function might produce incomplete output or it may even crash itself.

    The caller does not need to hold an attached thread state, nor does
    *current\_tstate* need to be attached.

    Warning

    On the free-threaded build, this function is not thread-safe. If
    another thread deletes its thread state while this function is being
    called, the process will likely crash.

    Added in version 3.15.
