---
page: c-api/frame.html
title: Frame objects
area: c-api
kind: guide
---

<!-- anchor: frame-objects | type: section -->
# Frame objects

<!-- anchor: c.PyFrameObject | type: c type -->
## `type PyFrameObject`

*Part of the Stable ABI (as an opaque struct).*

The C structure of the objects used to describe frame objects.

There are no public members in this structure.

Changed in version 3.11: The members of this structure were removed from the public C API. Refer to the What’s New entry for details.

The `PyEval_GetFrame()` and `PyThreadState_GetFrame()` functions can be used to get a frame object.

See also Reflection.

<!-- anchor: c.PyFrame_Type | type: c var -->
## `PyTypeObject PyFrame_Type`

The type of frame objects. It is the same object as `types.FrameType` in the Python layer.

Changed in version 3.11: Previously, this type was only available after including `<frameobject.h>`.

<!-- anchor: c.PyFrame_New | type: c function -->
## `PyFrameObject *PyFrame_New(PyThreadState *tstate, PyCodeObject *code, PyObject *globals, PyObject *locals)`

Create a new frame object. This function returns a strong reference to the new frame object on success, and returns `NULL` with an exception set on failure.

<!-- anchor: c.PyFrame_Check | type: c function -->
## `int PyFrame_Check(PyObject *obj)`

Return non-zero if *obj* is a frame object.

Changed in version 3.11: Previously, this function was only available after including `<frameobject.h>`.

<!-- anchor: c.PyFrame_GetBack | type: c function -->
## `PyFrameObject *PyFrame_GetBack(PyFrameObject *frame)`

*Return value: New reference.*

Get the *frame* next outer frame.

Return a strong reference, or `NULL` if *frame* has no outer frame. This raises no exceptions.

Added in version 3.9.

<!-- anchor: c.PyFrame_GetBuiltins | type: c function -->
## `PyObject *PyFrame_GetBuiltins(PyFrameObject *frame)`

*Return value: New reference.*

Get the *frame*’s `f_builtins` attribute.

Return a strong reference. The result cannot be `NULL`.

Added in version 3.11.

<!-- anchor: c.PyFrame_GetCode | type: c function -->
## `PyCodeObject *PyFrame_GetCode(PyFrameObject *frame)`

*Return value: New reference.**Part of the Stable ABI since version 3.10.*

Get the *frame* code.

Return a strong reference.

The result (frame code) cannot be `NULL`.

Added in version 3.9.

<!-- anchor: c.PyFrame_GetGenerator | type: c function -->
## `PyObject *PyFrame_GetGenerator(PyFrameObject *frame)`

*Return value: New reference.*

Get the generator, coroutine, or async generator that owns this frame, or `NULL` if this frame is not owned by a generator. Does not raise an exception, even if the return value is `NULL`.

Return a strong reference, or `NULL`.

Added in version 3.11.

<!-- anchor: c.PyFrame_GetGlobals | type: c function -->
## `PyObject *PyFrame_GetGlobals(PyFrameObject *frame)`

*Return value: New reference.*

Get the *frame*’s `f_globals` attribute.

Return a strong reference. The result cannot be `NULL`.

Added in version 3.11.

<!-- anchor: c.PyFrame_GetLasti | type: c function -->
## `int PyFrame_GetLasti(PyFrameObject *frame)`

Get the *frame*’s `f_lasti` attribute.

Returns -1 if `frame.f_lasti` is `None`.

Added in version 3.11.

<!-- anchor: c.PyFrame_GetVar | type: c function -->
## `PyObject *PyFrame_GetVar(PyFrameObject *frame, PyObject *name)`

*Return value: New reference.*

Get the variable *name* of *frame*.

- Return a strong reference to the variable value on success.

- Raise `NameError` and return `NULL` if the variable does not exist.

- Raise an exception and return `NULL` on error.

*name* type must be a `str`.

Added in version 3.12.

<!-- anchor: c.PyFrame_GetVarString | type: c function -->
## `PyObject *PyFrame_GetVarString(PyFrameObject *frame, const char *name)`

*Return value: New reference.*

Similar to `PyFrame_GetVar()`, but the variable name is a C string encoded in UTF-8.

Added in version 3.12.

<!-- anchor: c.PyFrame_GetLocals | type: c function -->
## `PyObject *PyFrame_GetLocals(PyFrameObject *frame)`

*Return value: New reference.*

Get the *frame*’s `f_locals` attribute. If the frame refers to an optimized scope, this returns a write-through proxy object that allows modifying the locals. In all other cases (classes, modules, `exec()`, `eval()`) it returns the mapping representing the frame locals directly (as described for `locals()`).

Return a strong reference.

Added in version 3.11.

Changed in version 3.13: As part of **PEP 667**, return an instance of `PyFrameLocalsProxy_Type`.

<!-- anchor: c.PyFrame_GetLineNumber | type: c function -->
## `int PyFrame_GetLineNumber(PyFrameObject *frame)`

*Part of the Stable ABI since version 3.10.*

Return the line number that *frame* is currently executing.

<!-- anchor: frame-locals-proxies | type: section -->
## Frame locals proxies

Added in version 3.13.

The `f_locals` attribute on a frame object is an instance of a “frame-locals proxy”. The proxy object exposes a write-through view of the underlying locals dictionary for the frame. This ensures that the variables exposed by `f_locals` are always up to date with the live local variables in the frame itself.

See **PEP 667** for more information.

<!-- anchor: c.PyFrameLocalsProxy_Type | type: c var -->
### `PyTypeObject PyFrameLocalsProxy_Type`

The type of frame `locals()` proxy objects.

<!-- anchor: c.PyFrameLocalsProxy_Check | type: c function -->
### `int PyFrameLocalsProxy_Check(PyObject *obj)`

Return non-zero if *obj* is a frame `locals()` proxy.

<!-- anchor: legacy-local-variable-apis | type: section -->
## Legacy local variable APIs

These APIs are soft deprecated. As of Python 3.13, they do nothing. They exist solely for backwards compatibility.

<!-- anchor: c.PyFrame_LocalsToFast | type: c function -->
### `void PyFrame_LocalsToFast(PyFrameObject *f, int clear)`

Prior to Python 3.13, this function would copy the `f_locals` attribute of *f* to the internal “fast” array of local variables, allowing changes in frame objects to be visible to the interpreter. If *clear* was true, this function would process variables that were unset in the locals dictionary.

Soft deprecated since version 3.13: This function now does nothing.

<!-- anchor: c.PyFrame_FastToLocals | type: c function -->
### `void PyFrame_FastToLocals(PyFrameObject *f)`

Prior to Python 3.13, this function would copy the internal “fast” array of local variables (which is used by the interpreter) to the `f_locals` attribute of *f*, allowing changes in local variables to be visible to frame objects.

Soft deprecated since version 3.13: This function now does nothing.

<!-- anchor: c.PyFrame_FastToLocalsWithError | type: c function -->
### `int PyFrame_FastToLocalsWithError(PyFrameObject *f)`

Prior to Python 3.13, this function was similar to `PyFrame_FastToLocals()`, but would return `0` on success, and `-1` with an exception set on failure.

Soft deprecated since version 3.13: This function now does nothing.

**See also:**

**PEP 667**

<!-- anchor: internal-frames | type: section -->
## Internal frames

Unless using **PEP 523**, you will not need this.

<!-- anchor: c._PyInterpreterFrame | type: c struct -->
### `struct _PyInterpreterFrame`

The interpreter’s internal frame representation.

Added in version 3.11.

<!-- anchor: c.PyUnstable_InterpreterFrame_GetCode | type: c function -->
### `PyObject *PyUnstable_InterpreterFrame_GetCode(struct _PyInterpreterFrame *frame);`

*This is Unstable API. It may change without warning in minor releases.*

Return a strong reference to the code object for the frame.

Added in version 3.12.

<!-- anchor: c.PyUnstable_InterpreterFrame_GetLasti | type: c function -->
### `int PyUnstable_InterpreterFrame_GetLasti(struct _PyInterpreterFrame *frame);`

*This is Unstable API. It may change without warning in minor releases.*

Return the byte offset into the last executed instruction.

Added in version 3.12.

<!-- anchor: c.PyUnstable_InterpreterFrame_GetLine | type: c function -->
### `int PyUnstable_InterpreterFrame_GetLine(struct _PyInterpreterFrame *frame);`

*This is Unstable API. It may change without warning in minor releases.*

Return the currently executing line number, or -1 if there is no line number.

Added in version 3.12.

<!-- anchor: c.PyUnstable_ExecutableKinds | type: c var -->
### `const PyTypeObject *PyUnstable_ExecutableKinds`

*This is Unstable API. It may change without warning in minor releases.*

An array of executable kinds (executor types) for frames, used for internal debugging and tracing.

Tools like debuggers and profilers can use this to identify the type of execution context associated with a frame (such as to filter out internal frames). The entries are indexed by the following constants:

| Constant | Description |
| --- | --- |
| `PyUnstable_EXECUTABLE_KIND_SKIP` *This is Unstable API. It may change without warning in minor releases.* | The frame is internal (For example: inlined) and should be skipped by tools. |
| `PyUnstable_EXECUTABLE_KIND_PY_FUNCTION` *This is Unstable API. It may change without warning in minor releases.* | The frame corresponds to a standard Python function. |
| `PyUnstable_EXECUTABLE_KIND_BUILTIN_FUNCTION` *This is Unstable API. It may change without warning in minor releases.* | The frame corresponds to a function defined in native code. |
| `PyUnstable_EXECUTABLE_KIND_METHOD_DESCRIPTOR` *This is Unstable API. It may change without warning in minor releases.* | The frame corresponds to a method on a class instance. |

Note that reading the executable kind from a frame is currently only possible with undocumented internal APIs.

Added in version 3.13.

<!-- anchor: c.PyUnstable_EXECUTABLE_KINDS | type: c macro -->
### `PyUnstable_EXECUTABLE_KINDS`

*This is Unstable API. It may change without warning in minor releases.*

The number of entries in `PyUnstable_ExecutableKinds`.

Added in version 3.13.
