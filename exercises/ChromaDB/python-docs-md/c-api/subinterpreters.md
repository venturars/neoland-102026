---
page: c-api/subinterpreters.html
title: Multiple interpreters in a Python process
area: c-api
kind: guide
---

<!-- anchor: multiple-interpreters-in-a-python-process | type: section -->
# Multiple interpreters in a Python process

While in most uses, you will only embed a single Python interpreter, there are cases where you need to create several independent interpreters in the same process and perhaps even in the same thread. Sub-interpreters allow you to do that.

The “main” interpreter is the first one created when the runtime initializes. It is usually the only Python interpreter in a process. Unlike sub-interpreters, the main interpreter has unique process-global responsibilities like signal handling. It is also responsible for execution during runtime initialization and is usually the active interpreter during runtime finalization. The `PyInterpreterState_Main()` function returns a pointer to its state.

You can switch between sub-interpreters using the `PyThreadState_Swap()` function. You can create and destroy them using the following functions:

<!-- anchor: c.PyInterpreterConfig | type: c type -->
## `type PyInterpreterConfig`

Structure containing most parameters to configure a sub-interpreter. Its values are used only in `Py_NewInterpreterFromConfig()` and never modified by the runtime.

Added in version 3.12.

Structure fields:

<!-- anchor: c.PyInterpreterConfig.use_main_obmalloc | type: c member -->
### `int use_main_obmalloc`

If this is `0` then the sub-interpreter will use its own “object” allocator state. Otherwise it will use (share) the main interpreter’s.

If this is `0` then `check_multi_interp_extensions` must be `1` (non-zero). If this is `1` then `gil` must not be `PyInterpreterConfig_OWN_GIL`.

<!-- anchor: c.PyInterpreterConfig.allow_fork | type: c member -->
### `int allow_fork`

If this is `0` then the runtime will not support forking the process in any thread where the sub-interpreter is currently active. Otherwise fork is unrestricted.

Note that the `subprocess` module still works when fork is disallowed.

<!-- anchor: c.PyInterpreterConfig.allow_exec | type: c member -->
### `int allow_exec`

If this is `0` then the runtime will not support replacing the current process via exec (e.g. `os.execv()`) in any thread where the sub-interpreter is currently active. Otherwise exec is unrestricted.

Note that the `subprocess` module still works when exec is disallowed.

<!-- anchor: c.PyInterpreterConfig.allow_threads | type: c member -->
### `int allow_threads`

If this is `0` then the sub-interpreter’s `threading` module won’t create threads. Otherwise threads are allowed.

<!-- anchor: c.PyInterpreterConfig.allow_daemon_threads | type: c member -->
### `int allow_daemon_threads`

If this is `0` then the sub-interpreter’s `threading` module won’t create daemon threads. Otherwise daemon threads are allowed (as long as `allow_threads` is non-zero).

<!-- anchor: c.PyInterpreterConfig.check_multi_interp_extensions | type: c member -->
### `int check_multi_interp_extensions`

If this is `0` then all extension modules may be imported, including legacy (single-phase init) modules, in any thread where the sub-interpreter is currently active. Otherwise only multi-phase init extension modules (see **PEP 489**) may be imported. (Also see `Py_mod_multiple_interpreters`.)

This must be `1` (non-zero) if `use_main_obmalloc` is `0`.

<!-- anchor: c.PyInterpreterConfig.gil | type: c member -->
### `int gil`

This determines the operation of the GIL for the sub-interpreter. It may be one of the following:

<!-- anchor: c.PyInterpreterConfig_DEFAULT_GIL | type: c macro -->
#### `PyInterpreterConfig_DEFAULT_GIL`

Use the default selection (`PyInterpreterConfig_SHARED_GIL`).

<!-- anchor: c.PyInterpreterConfig_SHARED_GIL | type: c macro -->
#### `PyInterpreterConfig_SHARED_GIL`

Use (share) the main interpreter’s GIL.

<!-- anchor: c.PyInterpreterConfig_OWN_GIL | type: c macro -->
#### `PyInterpreterConfig_OWN_GIL`

Use the sub-interpreter’s own GIL.

If this is `PyInterpreterConfig_OWN_GIL` then `PyInterpreterConfig.use_main_obmalloc` must be `0`.

<!-- anchor: c.Py_NewInterpreterFromConfig | type: c function -->
## `PyStatus Py_NewInterpreterFromConfig(PyThreadState **tstate_p, const PyInterpreterConfig *config)`

Create a new sub-interpreter. This is an (almost) totally separate environment for the execution of Python code. In particular, the new interpreter has separate, independent versions of all imported modules, including the fundamental modules `builtins`, `__main__` and `sys`. The table of loaded modules (`sys.modules`) and the module search path (`sys.path`) are also separate. The new environment has no `sys.argv` variable. It has new standard I/O stream file objects `sys.stdin`, `sys.stdout` and `sys.stderr` (however these refer to the same underlying file descriptors).

The given *config* controls the options with which the interpreter is initialized.

Upon success, *tstate_p* will be set to the first thread state created in the new sub-interpreter. This thread state is attached. Note that no actual thread is created; see the discussion of thread states below. If creation of the new interpreter is unsuccessful, *tstate_p* is set to `NULL`; no exception is set since the exception state is stored in the attached thread state, which might not exist.

Like all other Python/C API functions, an attached thread state must be present before calling this function, but it might be detached upon returning. On success, the returned thread state will be attached. If the sub-interpreter is created with its own GIL then the attached thread state of the calling interpreter will be detached. When the function returns, the new interpreter’s thread state will be attached to the current thread and the previous interpreter’s attached thread state will remain detached.

Added in version 3.12.

Sub-interpreters are most effective when isolated from each other, with certain functionality restricted:

```c
PyInterpreterConfig config = {
    .use_main_obmalloc = 0,
    .allow_fork = 0,
    .allow_exec = 0,
    .allow_threads = 1,
    .allow_daemon_threads = 0,
    .check_multi_interp_extensions = 1,
    .gil = PyInterpreterConfig_OWN_GIL,
};
PyThreadState *tstate = NULL;
PyStatus status = Py_NewInterpreterFromConfig(&tstate, &config);
if (PyStatus_Exception(status)) {
    Py_ExitStatusException(status);
}
```

Note that the config is used only briefly and does not get modified. During initialization the config’s values are converted into various `PyInterpreterState` values. A read-only copy of the config may be stored internally on the `PyInterpreterState`.

Extension modules are shared between (sub-)interpreters as follows:

- For modules using multi-phase initialization, e.g. `PyModule_FromDefAndSpec()`, a separate module object is created and initialized for each interpreter. Only C-level static and global variables are shared between these module objects.

- For modules using legacy single-phase initialization, e.g. `PyModule_Create()`, the first time a particular extension is imported, it is initialized normally, and a (shallow) copy of its module’s dictionary is squirreled away. When the same extension is imported by another (sub-)interpreter, a new module is initialized and filled with the contents of this copy; the extension’s `init` function is not called. Objects in the module’s dictionary thus end up shared across (sub-)interpreters, which might cause unwanted behavior (see Bugs and caveats below).

  Note that this is different from what happens when an extension is imported after the interpreter has been completely re-initialized by calling `Py_FinalizeEx()` and `Py_Initialize()`; in that case, the extension’s `initmodule` function *is* called again. As with multi-phase initialization, this means that only C-level static and global variables are shared between these modules.

<!-- anchor: c.Py_NewInterpreter | type: c function -->
## `PyThreadState *Py_NewInterpreter(void)`

*Part of the Stable ABI.*

Create a new sub-interpreter. This is essentially just a wrapper around `Py_NewInterpreterFromConfig()` with a config that preserves the existing behavior. The result is an unisolated sub-interpreter that shares the main interpreter’s GIL, allows fork/exec, allows daemon threads, and allows single-phase init modules.

<!-- anchor: c.Py_EndInterpreter | type: c function -->
## `void Py_EndInterpreter(PyThreadState *tstate)`

*Part of the Stable ABI.*

Destroy the (sub-)interpreter represented by the given thread state. The given thread state must be attached. When the call returns, there will be no attached thread state. All thread states associated with this interpreter are destroyed.

`Py_FinalizeEx()` will destroy all sub-interpreters that haven’t been explicitly destroyed at that point.

<!-- anchor: a-per-interpreter-gil | type: section -->
## A per-interpreter GIL

Added in version 3.12.

Using `Py_NewInterpreterFromConfig()` you can create a sub-interpreter that is completely isolated from other interpreters, including having its own GIL. The most important benefit of this isolation is that such an interpreter can execute Python code without being blocked by other interpreters or blocking any others. Thus a single Python process can truly take advantage of multiple CPU cores when running Python code. The isolation also encourages a different approach to concurrency than that of just using threads. (See **PEP 554** and **PEP 684**.)

Using an isolated interpreter requires vigilance in preserving that isolation. That especially means not sharing any objects or mutable state without guarantees about thread-safety. Even objects that are otherwise immutable (e.g. `None`, `(1, 5)`) can’t normally be shared because of the refcount. One simple but less-efficient approach around this is to use a global lock around all use of some state (or object). Alternately, effectively immutable objects (like integers or strings) can be made safe in spite of their refcounts by making them immortal. In fact, this has been done for the builtin singletons, small integers, and a number of other builtin objects.

If you preserve isolation then you will have access to proper multi-core computing without the complications that come with free-threading. Failure to preserve isolation will expose you to the full consequences of free-threading, including races and hard-to-debug crashes.

Aside from that, one of the main challenges of using multiple isolated interpreters is how to communicate between them safely (not break isolation) and efficiently. The runtime and stdlib do not provide any standard approach to this yet. A future stdlib module would help mitigate the effort of preserving isolation and expose effective tools for communicating (and sharing) data between interpreters.

<!-- anchor: bugs-and-caveats | type: section -->
## Bugs and caveats

Because sub-interpreters (and the main interpreter) are part of the same process, the insulation between them isn’t perfect — for example, using low-level file operations like `os.close()` they can (accidentally or maliciously) affect each other’s open files. Because of the way extensions are shared between (sub-)interpreters, some extensions may not work properly; this is especially likely when using single-phase initialization or (static) global variables. It is possible to insert objects created in one sub-interpreter into a namespace of another (sub-)interpreter; this should be avoided if possible.

Special care should be taken to avoid sharing user-defined functions, methods, instances or classes between sub-interpreters, since import operations executed by such objects may affect the wrong (sub-)interpreter’s dictionary of loaded modules. It is equally important to avoid sharing objects from which the above are reachable.

Also note that combining this functionality with `PyGILState_*` APIs is delicate, because these APIs assume a bijection between Python thread states and OS-level threads, an assumption broken by the presence of sub-interpreters. It is highly recommended that you don’t switch sub-interpreters between a pair of matching `PyGILState_Ensure()` and `PyGILState_Release()` calls. Furthermore, extensions (such as `ctypes`) using these APIs to allow calling of Python code from non-Python created threads will probably be broken when using sub-interpreters.

<!-- anchor: high-level-apis | type: section -->
## High-level APIs

<!-- anchor: c.PyInterpreterState | type: c type -->
### `type PyInterpreterState`

*Part of the Stable ABI (as an opaque struct).*

This data structure represents the state shared by a number of cooperating threads. Threads belonging to the same interpreter share their module administration and a few other internal items. There are no public members in this structure.

Threads belonging to different interpreters initially share nothing, except process state like available memory, open file descriptors and such. The global interpreter lock is also shared by all threads, regardless of to which interpreter they belong.

Changed in version 3.12: **PEP 684** introduced the possibility of a per-interpreter GIL. See `Py_NewInterpreterFromConfig()`.

<!-- anchor: c.PyInterpreterState_Get | type: c function -->
### `PyInterpreterState *PyInterpreterState_Get(void)`

*Part of the Stable ABI since version 3.9.*

Get the current interpreter.

Issue a fatal error if there is no attached thread state. It cannot return NULL.

Added in version 3.9.

<!-- anchor: c.PyInterpreterState_GetID | type: c function -->
### `int64_t PyInterpreterState_GetID(PyInterpreterState *interp)`

*Part of the Stable ABI since version 3.7.*

Return the interpreter’s unique ID. If there was any error in doing so then `-1` is returned and an error is set.

The caller must have an attached thread state.

Added in version 3.7.

<!-- anchor: c.PyInterpreterState_GetDict | type: c function -->
### `PyObject *PyInterpreterState_GetDict(PyInterpreterState *interp)`

*Return value: Borrowed reference.**Part of the Stable ABI since version 3.8.*

Return a dictionary in which interpreter-specific data may be stored. If this function returns `NULL` then no exception has been raised and the caller should assume no interpreter-specific dict is available.

This is not a replacement for `PyModule_GetState()`, which extensions should use to store interpreter-specific state information.

The returned dictionary is borrowed from the interpreter and is valid until interpreter shutdown.

Added in version 3.8.

<!-- anchor: c._PyFrameEvalFunction | type: c type -->
### `typedef PyObject *(*_PyFrameEvalFunction)(PyThreadState *tstate, _PyInterpreterFrame *frame, int throwflag)`

Type of a frame evaluation function.

The *throwflag* parameter is used by the `throw()` method of generators: if non-zero, handle the current exception.

Changed in version 3.9: The function now takes a *tstate* parameter.

Changed in version 3.11: The *frame* parameter changed from `PyFrameObject*` to `_PyInterpreterFrame*`.

<!-- anchor: c._PyInterpreterState_GetEvalFrameFunc | type: c function -->
### `_PyFrameEvalFunction _PyInterpreterState_GetEvalFrameFunc(PyInterpreterState *interp)`

Get the frame evaluation function.

See the **PEP 523** “Adding a frame evaluation API to CPython”.

Added in version 3.9.

<!-- anchor: c._PyInterpreterState_SetEvalFrameFunc | type: c function -->
### `void _PyInterpreterState_SetEvalFrameFunc(PyInterpreterState *interp, _PyFrameEvalFunction eval_frame)`

Set the frame evaluation function.

See the **PEP 523** “Adding a frame evaluation API to CPython”.

Added in version 3.9.

<!-- anchor: c._PyInterpreterState_SetEvalFrameAllowSpecialization | type: c function -->
### `void _PyInterpreterState_SetEvalFrameAllowSpecialization(PyInterpreterState *interp, int allow_specialization)`

Enables or disables specialization why a custom frame evaluator is in place.

If *allow_specialization* is non-zero, the adaptive specializer will continue to specialize bytecodes even though a custom eval frame function is set. When *allow_specialization* is zero, setting a custom eval frame disables specialization. The standard interpreter loop will continue to deopt while a frame evaluation API is in place - the frame evaluation function needs to handle the specialized opcodes to take advantage of this.

Added in version 3.15.

<!-- anchor: c._PyInterpreterState_IsSpecializationEnabled | type: c function -->
### `int _PyInterpreterState_IsSpecializationEnabled(PyInterpreterState *interp)`

Return non-zero if adaptive specialization is enabled for the interpreter. Specialization is enabled when no custom eval frame function is set, or when one is set with *allow_specialization* enabled.

Added in version 3.15.

<!-- anchor: low-level-apis | type: section -->
## Low-level APIs

All of the following functions must be called after `Py_Initialize()`.

Changed in version 3.7: `Py_Initialize()` now initializes the GIL and sets an attached thread state.

<!-- anchor: c.PyInterpreterState_New | type: c function -->
### `PyInterpreterState *PyInterpreterState_New()`

*Part of the Stable ABI.*

Create a new interpreter state object. An attached thread state is not needed, but may optionally exist if it is necessary to serialize calls to this function.

Raises an auditing event `cpython.PyInterpreterState_New` with no arguments.

<!-- anchor: c.PyInterpreterState_Clear | type: c function -->
### `void PyInterpreterState_Clear(PyInterpreterState *interp)`

*Part of the Stable ABI.*

Reset all information in an interpreter state object. There must be an attached thread state for the interpreter.

Raises an auditing event `cpython.PyInterpreterState_Clear` with no arguments.

<!-- anchor: c.PyInterpreterState_Delete | type: c function -->
### `void PyInterpreterState_Delete(PyInterpreterState *interp)`

*Part of the Stable ABI.*

Destroy an interpreter state object. There **should not** be an attached thread state for the target interpreter. The interpreter state must have been reset with a previous call to `PyInterpreterState_Clear()`.

<!-- anchor: advanced-debugger-support | type: section -->
## Advanced debugger support

These functions are only intended to be used by advanced debugging tools.

<!-- anchor: c.PyInterpreterState_Head | type: c function -->
### `PyInterpreterState *PyInterpreterState_Head()`

Return the interpreter state object at the head of the list of all such objects.

<!-- anchor: c.PyInterpreterState_Main | type: c function -->
### `PyInterpreterState *PyInterpreterState_Main()`

Return the main interpreter state object.

<!-- anchor: c.PyInterpreterState_Next | type: c function -->
### `PyInterpreterState *PyInterpreterState_Next(PyInterpreterState *interp)`

Return the next interpreter state object after *interp* from the list of all such objects.

<!-- anchor: c.PyInterpreterState_ThreadHead | type: c function -->
### `PyThreadState *PyInterpreterState_ThreadHead(PyInterpreterState *interp)`

Return the pointer to the first `PyThreadState` object in the list of threads associated with the interpreter *interp*.

<!-- anchor: c.PyThreadState_Next | type: c function -->
### `PyThreadState *PyThreadState_Next(PyThreadState *tstate)`

Return the next thread state object after *tstate* from the list of all such objects belonging to the same `PyInterpreterState` object.
