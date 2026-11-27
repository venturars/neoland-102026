# `sys.monitoring` — Execution event monitoring

---

Note

`sys.monitoring` is a namespace within the `sys` module,
not an independent module, and `import sys.monitoring` would fail
with a `ModuleNotFoundError`. Instead, simply `import sys`
and then use `sys.monitoring`.

This namespace provides access to the functions and constants necessary to
activate and control event monitoring.

As programs execute, events occur that might be of interest to tools that
monitor execution. The `sys.monitoring` namespace provides means to
receive callbacks when events of interest occur.

The monitoring API consists of three components:

- Tool identifiers
- Events
- Callbacks

## Tool identifiers

A tool identifier is an integer and the associated name.
Tool identifiers are used to discourage tools from interfering with each
other and to allow multiple tools to operate at the same time.
Currently tools are completely independent and cannot be used to
monitor each other. This restriction may be lifted in the future.

Before registering or activating events, a tool should choose an identifier.
Identifiers are integers in the range 0 to 5 inclusive.

### Registering and using tools

sys.monitoring.use\_tool\_id(*tool\_id: int*, *name: str*, */*) → None
:   Must be called before *tool\_id* can be used.
    *tool\_id* must be in the range 0 to 5 inclusive.
    Raises a `ValueError` if *tool\_id* is in use.

sys.monitoring.clear\_tool\_id(*tool\_id: int*, */*) → None
:   Unregister all events and callback functions associated with *tool\_id*.

sys.monitoring.free\_tool\_id(*tool\_id: int*, */*) → None
:   Should be called once a tool no longer requires *tool\_id*.
    Will call `clear_tool_id()` before releasing *tool\_id*.

sys.monitoring.get\_tool(*tool\_id: int*, */*) → str | None
:   Returns the name of the tool if *tool\_id* is in use,
    otherwise it returns `None`.
    *tool\_id* must be in the range 0 to 5 inclusive.

All IDs are treated the same by the VM with regard to events, but the
following IDs are pre-defined to make co-operation of tools easier:

```
sys.monitoring.DEBUGGER_ID = 0
sys.monitoring.COVERAGE_ID = 1
sys.monitoring.PROFILER_ID = 2
sys.monitoring.OPTIMIZER_ID = 5
```

## Events

The following events are supported:

sys.monitoring.events.BRANCH\_LEFT
:   A conditional branch goes left.

    It is up to the tool to determine how to present “left” and “right” branches.
    There is no guarantee which branch is “left” and which is “right”, except
    that it will be consistent for the duration of the program.

sys.monitoring.events.BRANCH\_RIGHT
:   A conditional branch goes right.

sys.monitoring.events.CALL
:   A call in Python code (event occurs before the call).

sys.monitoring.events.C\_RAISE
:   An exception raised from any callable, except for Python functions (event occurs after the exit).

sys.monitoring.events.C\_RETURN
:   Return from any callable, except for Python functions (event occurs after the return).

sys.monitoring.events.EXCEPTION\_HANDLED
:   An exception is handled.

sys.monitoring.events.INSTRUCTION
:   A VM instruction is about to be executed.

sys.monitoring.events.JUMP
:   An unconditional jump in the control flow graph is made.

sys.monitoring.events.LINE
:   An instruction is about to be executed that has a different line number from the preceding instruction.

sys.monitoring.events.PY\_RESUME
:   Resumption of a Python function (for generator and coroutine functions), except for `throw()` calls.

sys.monitoring.events.PY\_RETURN
:   Return from a Python function (occurs immediately before the return, the callee’s frame will be on the stack).

sys.monitoring.events.PY\_START
:   Start of a Python function (occurs immediately after the call, the callee’s frame will be on the stack)

sys.monitoring.events.PY\_THROW
:   A Python function is resumed by a `throw()` call.

sys.monitoring.events.PY\_UNWIND
:   Exit from a Python function during exception unwinding. This includes exceptions raised directly within the
    function and that are allowed to continue to propagate.

sys.monitoring.events.PY\_YIELD
:   Yield from a Python function (occurs immediately before the yield, the callee’s frame will be on the stack).

sys.monitoring.events.RAISE
:   An exception is raised, except those that cause a `STOP_ITERATION` event.

sys.monitoring.events.RERAISE
:   An exception is re-raised, for example at the end of a `finally` block.

sys.monitoring.events.STOP\_ITERATION
:   An artificial `StopIteration` is raised; see the STOP\_ITERATION event.

More events may be added in the future.

These events are attributes of the `sys.monitoring.events` namespace.
Each event is represented as a power-of-2 integer constant.
To define a set of events, simply bitwise OR the individual events together.
For example, to specify both `PY_RETURN` and `PY_START`
events, use the expression `PY_RETURN | PY_START`.

sys.monitoring.events.NO\_EVENTS
:   An alias for `0` so users can do explicit comparisons like:

    ```
    if get_events(DEBUGGER_ID) == NO_EVENTS:
        ...
    ```

    Setting this event deactivates all events.

### Local events

Local events are associated with normal execution of the program and happen
at clearly defined locations. All local events can be disabled
per location. The local events are:

- `PY_START`
- `PY_RESUME`
- `PY_RETURN`
- `PY_YIELD`
- `CALL`
- `LINE`
- `INSTRUCTION`
- `JUMP`
- `BRANCH_LEFT`
- `BRANCH_RIGHT`
- `STOP_ITERATION`

### Deprecated event

- `BRANCH`

The `BRANCH` event is deprecated in 3.14.
Using `BRANCH_LEFT` and `BRANCH_RIGHT`
events will give much better performance as they can be disabled
independently.

### Ancillary events

Ancillary events can be monitored like other events, but are controlled
by another event:

- `C_RAISE`
- `C_RETURN`

The `C_RETURN` and `C_RAISE` events
are controlled by the `CALL` event.
`C_RETURN` and `C_RAISE` events will only be
seen if the corresponding `CALL` event is being monitored.

### Other events

Other events are not necessarily tied to a specific location in the
program and cannot be individually disabled per location.

The other events that can be monitored are:

- `PY_THROW`
- `PY_UNWIND`
- `RAISE`
- `EXCEPTION_HANDLED`
- `RERAISE`

Changed in version 3.15: Other events can now be turned on and disabled on a per code object
basis. Returning `DISABLE` from a callback disables the event
for the entire code object (for the current tool).

### The STOP\_ITERATION event

**PEP 380**
specifies that a `StopIteration` exception is raised when returning a value
from a generator or coroutine. However, this is a very inefficient way to
return a value, so some Python implementations, notably CPython 3.12+, do not
raise an exception unless it would be visible to other code.

To allow tools to monitor for real exceptions without slowing down generators
and coroutines, the `STOP_ITERATION` event is provided.
`STOP_ITERATION` can be locally disabled.

Note that the `STOP_ITERATION` event and the
`RAISE` event for a `StopIteration` exception are
equivalent, and are treated as interchangeable when generating events.
Implementations will favor `STOP_ITERATION` for performance
reasons, but may generate a `RAISE` event with a
`StopIteration`.

## Turning events on and off

In order to monitor an event, it must be turned on and a corresponding callback
must be registered. Events can be turned on or off by setting the events either
globally and/or for a particular code object. An event will trigger only once,
even if it is turned on both globally and locally.

### Setting events globally

Events can be controlled globally by modifying the set of events being monitored.

sys.monitoring.get\_events(*tool\_id: int*, */*) → int
:   Returns the `int` representing all the active events.

sys.monitoring.set\_events(*tool\_id: int*, *event\_set: int*, */*) → None
:   Activates all events which are set in *event\_set*.
    Raises a `ValueError` if *tool\_id* is not in use.

No events are active by default.

### Per code object events

Events can also be controlled on a per code object basis. The functions
defined below which accept a `types.CodeType` should be prepared
to accept a look-alike object from functions which are not defined
in Python (see Monitoring C API).

sys.monitoring.get\_local\_events(*tool\_id: int*, *code: CodeType*, */*) → int
:   Returns all the local events for *code*

sys.monitoring.set\_local\_events(*tool\_id: int*, *code: CodeType*, *event\_set: int*, */*) → None
:   Activates all the local events for *code*
    which are set in *event\_set*. Raises a `ValueError` if *tool\_id* is not
    in use.

### Disabling events

sys.monitoring.DISABLE
:   A special value that can be returned from a callback function to disable
    events for the current code location.

Local events can be disabled for a specific code
location by returning `sys.monitoring.DISABLE` from a callback function.
This does not change which events are set, or any other code locations for the
same event.

Other events can be disabled on a per code
object basis by returning `sys.monitoring.DISABLE` from a callback
function. This disables the event for the entire code object (for the current
tool).

Disabling events for specific locations is very important for high performance
monitoring. For example, a program can be run under a debugger with no overhead
if the debugger disables all monitoring except for a few breakpoints.

sys.monitoring.restart\_events() → None
:   Enable all the events that were disabled by `sys.monitoring.DISABLE`
    for all tools.

## Registering callback functions

sys.monitoring.register\_callback(*tool\_id: int*, *event: int*, *func: Callable | None*, */*) → Callable | None
:   Registers the callable *func* for the *event* with the given *tool\_id*

    If another callback was registered for the given *tool\_id* and *event*,
    it is unregistered and returned.
    Otherwise `register_callback()` returns `None`.

    Raises an auditing event `sys.monitoring.register_callback` with argument `func`.

Functions can be unregistered by calling
`sys.monitoring.register_callback(tool_id, event, None)`.

Callback functions can be registered and unregistered at any time.

Callbacks are called only once regardless if the event is turned on both
globally and locally. As such, if an event could be turned on for both global
and local events by your code then the callback needs to be written to handle
either trigger.

### Callback function arguments

sys.monitoring.MISSING
:   A special value that is passed to a callback function to indicate
    that there are no arguments to the call.

When an active event occurs, the registered callback function is called.
Callback functions returning an object other than `DISABLE` will have no effect.
Different events will provide the callback function with different arguments, as follows:

- `PY_START` and `PY_RESUME`:

  ```
  func(code: CodeType, instruction_offset: int) -> object
  ```
- `PY_RETURN` and `PY_YIELD`:

  ```
  func(code: CodeType, instruction_offset: int, retval: object) -> object
  ```
- `CALL`, `C_RAISE` and `C_RETURN`
  (*arg0* can be `MISSING` specifically):

  ```
  func(code: CodeType, instruction_offset: int, callable: object, arg0: object) -> object
  ```

  *code* represents the code object where the call is being made, while
  *callable* is the object that is about to be called (and thus
  triggered the event).
  If there are no arguments, *arg0* is set to `sys.monitoring.MISSING`.

  For instance methods, *callable* will be the function object as found on the
  class with *arg0* set to the instance (i.e. the `self` argument to the
  method).
- `RAISE`, `RERAISE`, `EXCEPTION_HANDLED`,
  `PY_UNWIND`, `PY_THROW` and `STOP_ITERATION`:

  ```
  func(code: CodeType, instruction_offset: int, exception: BaseException) -> object
  ```
- `LINE`:

  ```
  func(code: CodeType, line_number: int) -> object
  ```
- `BRANCH_LEFT`, `BRANCH_RIGHT` and `JUMP`:

  ```
  func(code: CodeType, instruction_offset: int, destination_offset: int) -> object
  ```

  Note that the *destination\_offset* is where the code will next execute.
- `INSTRUCTION`:

  ```
  func(code: CodeType, instruction_offset: int) -> object
  ```
