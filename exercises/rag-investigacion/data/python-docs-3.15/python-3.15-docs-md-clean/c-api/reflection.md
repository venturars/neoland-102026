# Reflection

PyObject \*PyEval\_GetBuiltins(void)
:   *Return value: Borrowed reference.* *Part of the Stable ABI.*

    Deprecated since version 3.13: Use `PyEval_GetFrameBuiltins()` instead.

    Return a dictionary of the builtins in the current execution frame,
    or the interpreter of the thread state if no frame is currently executing.

PyObject \*PyEval\_GetLocals(void)
:   *Return value: Borrowed reference.* *Part of the Stable ABI.*

    Deprecated since version 3.13: Use either `PyEval_GetFrameLocals()` to obtain the same behaviour as calling
    `locals()` in Python code, or else call `PyFrame_GetLocals()` on the result
    of `PyEval_GetFrame()` to access the `f_locals` attribute of the
    currently executing frame.

    Return a mapping providing access to the local variables in the current execution frame,
    or `NULL` if no frame is currently executing.

    Refer to `locals()` for details of the mapping returned at different scopes.

    As this function returns a borrowed reference, the dictionary returned for
    optimized scopes is cached on the frame object and will remain
    alive as long as the frame object does. Unlike `PyEval_GetFrameLocals()` and
    `locals()`, subsequent calls to this function in the same frame will update the
    contents of the cached dictionary to reflect changes in the state of the local variables
    rather than returning a new snapshot.

    Changed in version 3.13: As part of **PEP 667**, `PyFrame_GetLocals()`, `locals()`, and
    `FrameType.f_locals` no longer make use of the shared cache
    dictionary. Refer to the What’s New entry for
    additional details.

PyObject \*PyEval\_GetGlobals(void)
:   *Return value: Borrowed reference.* *Part of the Stable ABI.*

    Deprecated since version 3.13: Use `PyEval_GetFrameGlobals()` instead.

    Return a dictionary of the global variables in the current execution frame,
    or `NULL` if no frame is currently executing.

PyFrameObject \*PyEval\_GetFrame(void)
:   *Return value: Borrowed reference.* *Part of the Stable ABI.*

    Return the attached thread state’s frame, which is `NULL` if no frame is
    currently executing.

    See also `PyThreadState_GetFrame()`.

PyObject \*PyEval\_GetFrameBuiltins(void)
:   *Return value: New reference.* *Part of the Stable ABI since version 3.13.*

    Return a dictionary of the builtins in the current execution frame,
    or the interpreter of the thread state if no frame is currently executing.

PyObject \*PyEval\_GetFrameLocals(void)
:   *Return value: New reference.* *Part of the Stable ABI since version 3.13.*

    Return a dictionary of the local variables in the current execution frame,
    or `NULL` if no frame is currently executing. Equivalent to calling
    `locals()` in Python code.

    To access `f_locals` on the current frame without making an independent
    snapshot in optimized scopes, call `PyFrame_GetLocals()`
    on the result of `PyEval_GetFrame()`.

PyObject \*PyEval\_GetFrameGlobals(void)
:   *Return value: New reference.* *Part of the Stable ABI since version 3.13.*

    Return a dictionary of the global variables in the current execution frame,
    or `NULL` if no frame is currently executing. Equivalent to calling
    `globals()` in Python code.

const char \*PyEval\_GetFuncName(PyObject \*func)
:   *Part of the Stable ABI.*

    Return the name of *func* if it is a function, class or instance object, else the
    name of *func*s type.

    For a Python function or method, the returned pointer refers to the
    function’s name and must not be retained across operations that may change
    that name. In the free-threaded build, copy the string before detaching
    the thread state or executing Python code if the name may be modified
    concurrently.

const char \*PyEval\_GetFuncDesc(PyObject \*func)
:   *Part of the Stable ABI.*

    Return a description string, depending on the type of *func*.
    Return values include “()” for functions and methods, “ constructor”,
    “ instance”, and “ object”. Concatenated with the result of
    `PyEval_GetFuncName()`, the result will be a description of
    *func*.
