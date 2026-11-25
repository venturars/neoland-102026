# Profiling and tracing

The Python interpreter provides some low-level support for attaching profiling
and execution tracing facilities. These are used for profiling, debugging, and
coverage analysis tools.

This C interface allows the profiling or tracing code to avoid the overhead of
calling through Python-level callable objects, making a direct C function call
instead. The essential attributes of the facility have not changed; the
interface allows trace functions to be installed per-thread, and the basic
events reported to the trace function are the same as had been reported to the
Python-level trace functions in previous versions.

typedef int (\*Py\_tracefunc)(PyObject \*obj, PyFrameObject \*frame, int what, PyObject \*arg)
:   The type of the trace function registered using `PyEval_SetProfile()` and
    `PyEval_SetTrace()`. The first parameter is the object passed to the
    registration function as *obj*, *frame* is the frame object to which the event
    pertains, *what* is one of the constants `PyTrace_CALL`,
    `PyTrace_EXCEPTION`, `PyTrace_LINE`, `PyTrace_RETURN`,
    `PyTrace_C_CALL`, `PyTrace_C_EXCEPTION`, `PyTrace_C_RETURN`,
    or `PyTrace_OPCODE`, and *arg* depends on the value of *what*:

    | Value of *what* | Meaning of *arg* |
    | --- | --- |
    | `PyTrace_CALL` | Always `Py_None`. |
    | `PyTrace_EXCEPTION` | Exception information as returned by `sys.exc_info()`. |
    | `PyTrace_LINE` | Always `Py_None`. |
    | `PyTrace_RETURN` | Value being returned to the caller, or `NULL` if caused by an exception. |
    | `PyTrace_C_CALL` | Function object being called. |
    | `PyTrace_C_EXCEPTION` | Function object being called. |
    | `PyTrace_C_RETURN` | Function object being called. |
    | `PyTrace_OPCODE` | Always `Py_None`. |

int PyTrace\_CALL
:   The value of the *what* parameter to a `Py_tracefunc` function when a new
    call to a function or method is being reported, or a new entry into a generator.
    Note that the creation of the iterator for a generator function is not reported
    as there is no control transfer to the Python bytecode in the corresponding
    frame.

int PyTrace\_EXCEPTION
:   The value of the *what* parameter to a `Py_tracefunc` function when an
    exception has been raised. The callback function is called with this value for
    *what* when after any bytecode is processed after which the exception becomes
    set within the frame being executed. The effect of this is that as exception
    propagation causes the Python stack to unwind, the callback is called upon
    return to each frame as the exception propagates. Only trace functions receive
    these events; they are not needed by the profiler.

int PyTrace\_LINE
:   The value passed as the *what* parameter to a `Py_tracefunc` function
    (but not a profiling function) when a line-number event is being reported.
    It may be disabled for a frame by setting `f_trace_lines` to
    *0* on that frame.

int PyTrace\_RETURN
:   The value for the *what* parameter to `Py_tracefunc` functions when a
    call is about to return.

int PyTrace\_C\_CALL
:   The value for the *what* parameter to `Py_tracefunc` functions when a C
    function is about to be called.

int PyTrace\_C\_EXCEPTION
:   The value for the *what* parameter to `Py_tracefunc` functions when a C
    function has raised an exception.

int PyTrace\_C\_RETURN
:   The value for the *what* parameter to `Py_tracefunc` functions when a C
    function has returned.

int PyTrace\_OPCODE
:   The value for the *what* parameter to `Py_tracefunc` functions (but not
    profiling functions) when a new opcode is about to be executed. This event is
    not emitted by default: it must be explicitly requested by setting
    `f_trace_opcodes` to *1* on the frame.

void PyEval\_SetProfile(Py\_tracefunc func, PyObject \*obj)
:   Set the profiler function to *func*. The *obj* parameter is passed to the
    function as its first parameter, and may be any Python object, or `NULL`. If
    the profile function needs to maintain state, using a different value for *obj*
    for each thread provides a convenient and thread-safe place to store it. The
    profile function is called for all monitored events except `PyTrace_LINE`
    `PyTrace_OPCODE` and `PyTrace_EXCEPTION`.

    See also the `sys.setprofile()` function.

    The caller must have an attached thread state.

void PyEval\_SetProfileAllThreads(Py\_tracefunc func, PyObject \*obj)
:   Like `PyEval_SetProfile()` but sets the profile function in all running threads
    belonging to the current interpreter instead of the setting it only on the current thread.

    The caller must have an attached thread state.

    As `PyEval_SetProfile()`, this function ignores any exceptions raised while
    setting the profile functions in all threads.

void PyEval\_SetTrace(Py\_tracefunc func, PyObject \*obj)
:   Set the tracing function to *func*. This is similar to
    `PyEval_SetProfile()`, except the tracing function does receive line-number
    events and per-opcode events, but does not receive any event related to C function
    objects being called. Any trace function registered using `PyEval_SetTrace()`
    will not receive `PyTrace_C_CALL`, `PyTrace_C_EXCEPTION` or
    `PyTrace_C_RETURN` as a value for the *what* parameter.

    See also the `sys.settrace()` function.

    The caller must have an attached thread state.

void PyEval\_SetTraceAllThreads(Py\_tracefunc func, PyObject \*obj)
:   Like `PyEval_SetTrace()` but sets the tracing function in all running threads
    belonging to the current interpreter instead of the setting it only on the current thread.

    The caller must have an attached thread state.

    As `PyEval_SetTrace()`, this function ignores any exceptions raised while
    setting the trace functions in all threads.

# Reference tracing

typedef int (\*PyRefTracer)(PyObject\*, int event, void \*data)
:   The type of the trace function registered using `PyRefTracer_SetTracer()`.
    The first parameter is a Python object that has been just created (when **event**
    is set to `PyRefTracer_CREATE`) or about to be destroyed (when **event**
    is set to `PyRefTracer_DESTROY`). The **data** argument is the opaque pointer
    that was provided when `PyRefTracer_SetTracer()` was called.

    If a new tracing function is registered replacing the current one, a call to the
    trace function will be made with the object set to **NULL** and **event** set to
    `PyRefTracer_TRACKER_REMOVED`. This will happen just before the new
    function is registered.

int PyRefTracer\_CREATE
:   The value for the *event* parameter to `PyRefTracer` functions when a Python
    object has been created.

int PyRefTracer\_DESTROY
:   The value for the *event* parameter to `PyRefTracer` functions when a Python
    object has been destroyed.

int PyRefTracer\_TRACKER\_REMOVED
:   The value for the *event* parameter to `PyRefTracer` functions when the
    current tracer is about to be replaced by a new one.

int PyRefTracer\_SetTracer(PyRefTracer tracer, void \*data)
:   Register a reference tracer function. The function will be called when a new
    Python object has been created or when an object is going to be destroyed. If
    **data** is provided it must be an opaque pointer that will be provided when
    the tracer function is called. Return `0` on success. Set an exception and
    return `-1` on error.

    Note that tracer functions **must not** create Python objects inside or
    otherwise the call will be re-entrant. The tracer also **must not** clear
    any existing exception or set an exception. A thread state will be active
    every time the tracer function is called.

    There must be an attached thread state when calling this function.

    If another tracer function was already registered, the old function will be
    called with **event** set to `PyRefTracer_TRACKER_REMOVED` just before
    the new function is registered.

PyRefTracer PyRefTracer\_GetTracer(void \*\*data)
:   Get the registered reference tracer function and the value of the opaque data
    pointer that was registered when `PyRefTracer_SetTracer()` was called.
    If no tracer was registered this function will return NULL and will set the
    **data** pointer to NULL.

    There must be an attached thread state when calling this function.

# Performance statistics

PYSTATS\_MAX\_UOP\_ID
:   Largest micro-operation identifier for which CPython allocates performance
    statistics counters. Available only in builds configured with
    `--enable-pystats`.

    This constant is intended for internal use only and is not useful to
    extension modules.

    Soft deprecated since version 3.15.2.
