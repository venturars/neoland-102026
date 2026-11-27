# Frame objects

type PyFrameObject
:   *Part of the Stable ABI (as an opaque struct).*

    The C structure of the objects used to describe frame objects.

    There are no public members in this structure.

    Changed in version 3.11: The members of this structure were removed from the public C API.
    Refer to the What’s New entry
    for details.

The `PyEval_GetFrame()` and `PyThreadState_GetFrame()` functions
can be used to get a frame object.

See also Reflection.

PyTypeObject PyFrame\_Type
:   The type of frame objects.
    It is the same object as `types.FrameType` in the Python layer.

PyFrameObject \*PyFrame\_New(PyThreadState \*tstate, PyCodeObject \*code, PyObject \*globals, PyObject \*locals)
:   Create a new frame object. This function returns a strong reference
    to the new frame object on success, and returns `NULL` with an exception
    set on failure.

int PyFrame\_Check(PyObject \*obj)
:   Return non-zero if *obj* is a frame object.

PyFrameObject \*PyFrame\_GetBack(PyFrameObject \*frame)
:   *Return value: New reference.*

    Get the *frame* next outer frame.

    Return a strong reference, or `NULL` if *frame* has no outer
    frame.
    This raises no exceptions.

PyObject \*PyFrame\_GetBuiltins(PyFrameObject \*frame)
:   *Return value: New reference.*

    Get the *frame*’s `f_builtins` attribute.

    Return a strong reference. The result cannot be `NULL`.

PyCodeObject \*PyFrame\_GetCode(PyFrameObject \*frame)
:   *Return value: New reference.* *Part of the Stable ABI since version 3.10.*

    Get the *frame* code.

    Return a strong reference.

    The result (frame code) cannot be `NULL`.

PyObject \*PyFrame\_GetGenerator(PyFrameObject \*frame)
:   *Return value: New reference.*

    Get the generator, coroutine, or async generator that owns this frame,
    or `NULL` if this frame is not owned by a generator.
    Does not raise an exception, even if the return value is `NULL`.

    Return a strong reference, or `NULL`.

PyObject \*PyFrame\_GetGlobals(PyFrameObject \*frame)
:   *Return value: New reference.*

    Get the *frame*’s `f_globals` attribute.

    Return a strong reference. The result cannot be `NULL`.

int PyFrame\_GetLasti(PyFrameObject \*frame)
:   Get the *frame*’s `f_lasti` attribute.

PyObject \*PyFrame\_GetVar(PyFrameObject \*frame, PyObject \*name)
:   *Return value: New reference.*

    Get the variable *name* of *frame*.

    - Return a strong reference to the variable value on success.
    - Raise `NameError` and return `NULL` if the variable does not exist.
    - Raise an exception and return `NULL` on error.

    *name* type must be a `str`.

PyObject \*PyFrame\_GetVarString(PyFrameObject \*frame, const char \*name)
:   *Return value: New reference.*

    Similar to `PyFrame_GetVar()`, but the variable name is a C string
    encoded in UTF-8.

PyObject \*PyFrame\_GetLocals(PyFrameObject \*frame)
:   *Return value: New reference.*

    Get the *frame*’s `f_locals` attribute.
    If the frame refers to an optimized scope, this returns a
    write-through proxy object that allows modifying the locals.
    In all other cases (classes, modules, `exec()`, `eval()`) it returns
    the mapping representing the frame locals directly (as described for
    `locals()`).

    Return a strong reference.

int PyFrame\_GetLineNumber(PyFrameObject \*frame)
:   *Part of the Stable ABI since version 3.10.*

    Return the line number that *frame* is currently executing.

## Frame locals proxies

The `f_locals` attribute on a frame object
is an instance of a “frame-locals proxy”. The proxy object exposes a
write-through view of the underlying locals dictionary for the frame. This
ensures that the variables exposed by `f_locals` are always up to date with
the live local variables in the frame itself.

See **PEP 667** for more information.

PyTypeObject PyFrameLocalsProxy\_Type
:   The type of frame `locals()` proxy objects.

int PyFrameLocalsProxy\_Check(PyObject \*obj)
:   Return non-zero if *obj* is a frame `locals()` proxy.

## Legacy local variable APIs

These APIs are soft deprecated. As of Python 3.13, they do nothing.
They exist solely for backwards compatibility.

void PyFrame\_LocalsToFast(PyFrameObject \*f, int clear)
:   Prior to Python 3.13, this function would copy the `f_locals`
    attribute of *f* to the internal “fast” array of local variables, allowing
    changes in frame objects to be visible to the interpreter. If *clear* was
    true, this function would process variables that were unset in the locals
    dictionary.

    Soft deprecated since version 3.13: This function now does nothing.

void PyFrame\_FastToLocals(PyFrameObject \*f)
:   Prior to Python 3.13, this function would copy the internal “fast” array
    of local variables (which is used by the interpreter) to the
    `f_locals` attribute of *f*, allowing changes in local
    variables to be visible to frame objects.

    Soft deprecated since version 3.13: This function now does nothing.

int PyFrame\_FastToLocalsWithError(PyFrameObject \*f)
:   Prior to Python 3.13, this function was similar to
    `PyFrame_FastToLocals()`, but would return `0` on success, and
    `-1` with an exception set on failure.

    Soft deprecated since version 3.13: This function now does nothing.

See also

**PEP 667**

## Internal frames

Unless using **PEP 523**, you will not need this.

struct \_PyInterpreterFrame
:   The interpreter’s internal frame representation.

PyObject \*PyUnstable\_InterpreterFrame\_GetCode(struct \_PyInterpreterFrame \*frame);
:   *This is Unstable API. It may change without warning in minor releases.*

    > Return a strong reference to the code object for the frame.

int PyUnstable\_InterpreterFrame\_GetLasti(struct \_PyInterpreterFrame \*frame);
:   *This is Unstable API. It may change without warning in minor releases.*

    Return the byte offset into the last executed instruction.

int PyUnstable\_InterpreterFrame\_GetLine(struct \_PyInterpreterFrame \*frame);
:   *This is Unstable API. It may change without warning in minor releases.*

    Return the currently executing line number, or -1 if there is no line number.

const PyTypeObject \*PyUnstable\_ExecutableKinds
:   *This is Unstable API. It may change without warning in minor releases.*

    An array of executable kinds (executor types) for frames, used for internal
    debugging and tracing.

    Tools like debuggers and profilers can use this to identify the type of execution
    context associated with a frame (such as to filter out internal frames).
    The entries are indexed by the following constants:

    | Constant | Description |
    | --- | --- |
    | PyUnstable\_EXECUTABLE\_KIND\_SKIP  *This is Unstable API. It may change without warning in minor releases.* | The frame is internal (For example: inlined) and should be skipped by tools. |
    | PyUnstable\_EXECUTABLE\_KIND\_PY\_FUNCTION  *This is Unstable API. It may change without warning in minor releases.* | The frame corresponds to a standard Python function. |
    | PyUnstable\_EXECUTABLE\_KIND\_BUILTIN\_FUNCTION  *This is Unstable API. It may change without warning in minor releases.* | The frame corresponds to a function defined in native code. |
    | PyUnstable\_EXECUTABLE\_KIND\_METHOD\_DESCRIPTOR  *This is Unstable API. It may change without warning in minor releases.* | The frame corresponds to a method on a class instance. |

    Note that reading the executable kind from a frame is currently only
    possible with undocumented internal APIs.

PyUnstable\_EXECUTABLE\_KINDS
:   *This is Unstable API. It may change without warning in minor releases.*

    The number of entries in `PyUnstable_ExecutableKinds`.
