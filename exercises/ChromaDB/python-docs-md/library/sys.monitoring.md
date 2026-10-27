---
page: library/sys.monitoring.html
title: sys.monitoring — Execution event monitoring
area: library
kind: guide
module: sys.monitoring
---

<!-- anchor: module-sys.monitoring | type: section -->
# `sys.monitoring` — Execution event monitoring

Added in version 3.12.

**Note:**

`sys.monitoring` is a namespace within the `sys` module, not an independent module, and `import sys.monitoring` would fail with a `ModuleNotFoundError`. Instead, simply `import sys` and then use `sys.monitoring`.

This namespace provides access to the functions and constants necessary to activate and control event monitoring.

As programs execute, events occur that might be of interest to tools that monitor execution. The `sys.monitoring` namespace provides means to receive callbacks when events of interest occur.

The monitoring API consists of three components:

- Tool identifiers

- Events

- Callbacks

<!-- anchor: tool-identifiers | type: section -->
## Tool identifiers

A tool identifier is an integer and the associated name. Tool identifiers are used to discourage tools from interfering with each other and to allow multiple tools to operate at the same time. Currently tools are completely independent and cannot be used to monitor each other. This restriction may be lifted in the future.

Before registering or activating events, a tool should choose an identifier. Identifiers are integers in the range 0 to 5 inclusive.

<!-- anchor: registering-and-using-tools | type: section -->
### Registering and using tools

<!-- anchor: sys.monitoring.use_tool_id | type: py function -->
#### `sys.monitoring.use_tool_id(tool_id: int, name: str, /) → None`

Must be called before *tool_id* can be used. *tool_id* must be in the range 0 to 5 inclusive. Raises a `ValueError` if *tool_id* is in use.

<!-- anchor: sys.monitoring.clear_tool_id | type: py function -->
#### `sys.monitoring.clear_tool_id(tool_id: int, /) → None`

Unregister all events and callback functions associated with *tool_id*.

Added in version 3.14.

<!-- anchor: sys.monitoring.free_tool_id | type: py function -->
#### `sys.monitoring.free_tool_id(tool_id: int, /) → None`

Should be called once a tool no longer requires *tool_id*. Will call `clear_tool_id()` before releasing *tool_id*.

Changed in version 3.14: Now calls `clear_tool_id()` before releasing *tool_id*. Previously, it would not disable global or local events associated with *tool_id*, nor unregister any callback functions.

<!-- anchor: sys.monitoring.get_tool | type: py function -->
#### `sys.monitoring.get_tool(tool_id: int, /) → str | None`

Returns the name of the tool if *tool_id* is in use, otherwise it returns `None`. *tool_id* must be in the range 0 to 5 inclusive.

All IDs are treated the same by the VM with regard to events, but the following IDs are pre-defined to make co-operation of tools easier:

```python
sys.monitoring.DEBUGGER_ID = 0
sys.monitoring.COVERAGE_ID = 1
sys.monitoring.PROFILER_ID = 2
sys.monitoring.OPTIMIZER_ID = 5
```

<!-- anchor: events | type: section -->
## Events

The following events are supported:

<!-- anchor: monitoring-event-BRANCH_LEFT | type: std monitoring-event -->
### `sys.monitoring.events.BRANCH_LEFT`

A conditional branch goes left.

It is up to the tool to determine how to present “left” and “right” branches. There is no guarantee which branch is “left” and which is “right”, except that it will be consistent for the duration of the program.

<!-- anchor: monitoring-event-BRANCH_RIGHT | type: std monitoring-event -->
### `sys.monitoring.events.BRANCH_RIGHT`

A conditional branch goes right.

<!-- anchor: monitoring-event-CALL | type: std monitoring-event -->
### `sys.monitoring.events.CALL`

A call in Python code (event occurs before the call).

<!-- anchor: monitoring-event-C_RAISE | type: std monitoring-event -->
### `sys.monitoring.events.C_RAISE`

An exception raised from any callable, except for Python functions (event occurs after the exit).

<!-- anchor: monitoring-event-C_RETURN | type: std monitoring-event -->
### `sys.monitoring.events.C_RETURN`

Return from any callable, except for Python functions (event occurs after the return).

<!-- anchor: monitoring-event-EXCEPTION_HANDLED | type: std monitoring-event -->
### `sys.monitoring.events.EXCEPTION_HANDLED`

An exception is handled.

<!-- anchor: monitoring-event-INSTRUCTION | type: std monitoring-event -->
### `sys.monitoring.events.INSTRUCTION`

A VM instruction is about to be executed.

<!-- anchor: monitoring-event-JUMP | type: std monitoring-event -->
### `sys.monitoring.events.JUMP`

An unconditional jump in the control flow graph is made.

<!-- anchor: monitoring-event-LINE | type: std monitoring-event -->
### `sys.monitoring.events.LINE`

An instruction is about to be executed that has a different line number from the preceding instruction.

<!-- anchor: monitoring-event-PY_RESUME | type: std monitoring-event -->
### `sys.monitoring.events.PY_RESUME`

Resumption of a Python function (for generator and coroutine functions), except for `throw()` calls.

<!-- anchor: monitoring-event-PY_RETURN | type: std monitoring-event -->
### `sys.monitoring.events.PY_RETURN`

Return from a Python function (occurs immediately before the return, the callee’s frame will be on the stack).

<!-- anchor: monitoring-event-PY_START | type: std monitoring-event -->
### `sys.monitoring.events.PY_START`

Start of a Python function (occurs immediately after the call, the callee’s frame will be on the stack)

<!-- anchor: monitoring-event-PY_THROW | type: std monitoring-event -->
### `sys.monitoring.events.PY_THROW`

A Python function is resumed by a `throw()` call.

<!-- anchor: monitoring-event-PY_UNWIND | type: std monitoring-event -->
### `sys.monitoring.events.PY_UNWIND`

Exit from a Python function during exception unwinding. This includes exceptions raised directly within the function and that are allowed to continue to propagate.

<!-- anchor: monitoring-event-PY_YIELD | type: std monitoring-event -->
### `sys.monitoring.events.PY_YIELD`

Yield from a Python function (occurs immediately before the yield, the callee’s frame will be on the stack).

<!-- anchor: monitoring-event-RAISE | type: std monitoring-event -->
### `sys.monitoring.events.RAISE`

An exception is raised, except those that cause a `STOP_ITERATION` event.

<!-- anchor: monitoring-event-RERAISE | type: std monitoring-event -->
### `sys.monitoring.events.RERAISE`

An exception is re-raised, for example at the end of a `finally` block.

<!-- anchor: monitoring-event-STOP_ITERATION | type: std monitoring-event -->
### `sys.monitoring.events.STOP_ITERATION`

An artificial `StopIteration` is raised; see the STOP_ITERATION event.

More events may be added in the future.

These events are attributes of the `sys.monitoring.events` namespace. Each event is represented as a power-of-2 integer constant. To define a set of events, simply bitwise OR the individual events together. For example, to specify both `PY_RETURN` and `PY_START` events, use the expression `PY_RETURN | PY_START`.

<!-- anchor: monitoring-event-NO_EVENTS | type: std monitoring-event -->
### `sys.monitoring.events.NO_EVENTS`

An alias for `0` so users can do explicit comparisons like:

```python
if get_events(DEBUGGER_ID) == NO_EVENTS:
    ...
```

Setting this event deactivates all events.

<!-- anchor: local-events | type: section -->
### Local events

Local events are associated with normal execution of the program and happen at clearly defined locations. All local events can be disabled per location. The local events are:

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

<!-- anchor: deprecated-event | type: section -->
### Deprecated event

- `BRANCH`

The `BRANCH` event is deprecated in 3.14. Using `BRANCH_LEFT` and `BRANCH_RIGHT` events will give much better performance as they can be disabled independently.

<!-- anchor: ancillary-events | type: section -->
### Ancillary events

Ancillary events can be monitored like other events, but are controlled by another event:

- `C_RAISE`

- `C_RETURN`

The `C_RETURN` and `C_RAISE` events are controlled by the `CALL` event. `C_RETURN` and `C_RAISE` events will only be seen if the corresponding `CALL` event is being monitored.

<!-- anchor: other-events | type: section -->
### Other events

Other events are not necessarily tied to a specific location in the program and cannot be individually disabled per location.

The other events that can be monitored are:

- `PY_THROW`

- `PY_UNWIND`

- `RAISE`

- `EXCEPTION_HANDLED`

- `RERAISE`

Changed in version 3.15: Other events can now be turned on and disabled on a per code object basis. Returning `DISABLE` from a callback disables the event for the entire code object (for the current tool).

<!-- anchor: the-stop-iteration-event | type: section -->
### The STOP_ITERATION event

**PEP 380** specifies that a `StopIteration` exception is raised when returning a value from a generator or coroutine. However, this is a very inefficient way to return a value, so some Python implementations, notably CPython 3.12+, do not raise an exception unless it would be visible to other code.

To allow tools to monitor for real exceptions without slowing down generators and coroutines, the `STOP_ITERATION` event is provided. `STOP_ITERATION` can be locally disabled.

Note that the `STOP_ITERATION` event and the `RAISE` event for a `StopIteration` exception are equivalent, and are treated as interchangeable when generating events. Implementations will favor `STOP_ITERATION` for performance reasons, but may generate a `RAISE` event with a `StopIteration`.

<!-- anchor: turning-events-on-and-off | type: section -->
## Turning events on and off

In order to monitor an event, it must be turned on and a corresponding callback must be registered. Events can be turned on or off by setting the events either globally and/or for a particular code object. An event will trigger only once, even if it is turned on both globally and locally.

<!-- anchor: setting-events-globally | type: section -->
### Setting events globally

Events can be controlled globally by modifying the set of events being monitored.

<!-- anchor: sys.monitoring.get_events | type: py function -->
#### `sys.monitoring.get_events(tool_id: int, /) → int`

Returns the `int` representing all the active events.

<!-- anchor: sys.monitoring.set_events | type: py function -->
#### `sys.monitoring.set_events(tool_id: int, event_set: int, /) → None`

Activates all events which are set in *event_set*. Raises a `ValueError` if *tool_id* is not in use.

No events are active by default.

<!-- anchor: per-code-object-events | type: section -->
### Per code object events

Events can also be controlled on a per code object basis. The functions defined below which accept a `types.CodeType` should be prepared to accept a look-alike object from functions which are not defined in Python (see Monitoring C API).

<!-- anchor: sys.monitoring.get_local_events | type: py function -->
#### `sys.monitoring.get_local_events(tool_id: int, code: CodeType, /) → int`

Returns all the local events for *code*

<!-- anchor: sys.monitoring.set_local_events | type: py function -->
#### `sys.monitoring.set_local_events(tool_id: int, code: CodeType, event_set: int, /) → None`

Activates all the local events for *code* which are set in *event_set*. Raises a `ValueError` if *tool_id* is not in use.

<!-- anchor: disabling-events | type: section -->
### Disabling events

<!-- anchor: sys.monitoring.DISABLE | type: py data -->
#### `sys.monitoring.DISABLE`

A special value that can be returned from a callback function to disable events for the current code location.

Local events can be disabled for a specific code location by returning `sys.monitoring.DISABLE` from a callback function. This does not change which events are set, or any other code locations for the same event.

Other events can be disabled on a per code object basis by returning `sys.monitoring.DISABLE` from a callback function. This disables the event for the entire code object (for the current tool).

Disabling events for specific locations is very important for high performance monitoring. For example, a program can be run under a debugger with no overhead if the debugger disables all monitoring except for a few breakpoints.

<!-- anchor: sys.monitoring.restart_events | type: py function -->
#### `sys.monitoring.restart_events() → None`

Enable all the events that were disabled by `sys.monitoring.DISABLE` for all tools.

<!-- anchor: registering-callback-functions | type: section -->
## Registering callback functions

<!-- anchor: sys.monitoring.register_callback | type: py function -->
### `sys.monitoring.register_callback(tool_id: int, event: int, func: Callable | None, /) → Callable | None`

Registers the callable *func* for the *event* with the given *tool_id*

If another callback was registered for the given *tool_id* and *event*, it is unregistered and returned. Otherwise `register_callback()` returns `None`.

Raises an auditing event `sys.monitoring.register_callback` with argument `func`.

Functions can be unregistered by calling `sys.monitoring.register_callback(tool_id, event, None)`.

Callback functions can be registered and unregistered at any time.

Callbacks are called only once regardless if the event is turned on both globally and locally. As such, if an event could be turned on for both global and local events by your code then the callback needs to be written to handle either trigger.

<!-- anchor: callback-function-arguments | type: section -->
### Callback function arguments

<!-- anchor: sys.monitoring.MISSING | type: py data -->
#### `sys.monitoring.MISSING`

A special value that is passed to a callback function to indicate that there are no arguments to the call.

When an active event occurs, the registered callback function is called. Callback functions returning an object other than `DISABLE` will have no effect. Different events will provide the callback function with different arguments, as follows:

- `PY_START` and `PY_RESUME`:

  ```python
  func(code: CodeType, instruction_offset: int) -> object
  ```

- `PY_RETURN` and `PY_YIELD`:

  ```python
  func(code: CodeType, instruction_offset: int, retval: object) -> object
  ```

- `CALL`, `C_RAISE` and `C_RETURN` (*arg0* can be `MISSING` specifically):

  ```python
  func(code: CodeType, instruction_offset: int, callable: object, arg0: object) -> object
  ```

  *code* represents the code object where the call is being made, while *callable* is the object that is about to be called (and thus triggered the event). If there are no arguments, *arg0* is set to `sys.monitoring.MISSING`.

  For instance methods, *callable* will be the function object as found on the class with *arg0* set to the instance (i.e. the `self` argument to the method).

- `RAISE`, `RERAISE`, `EXCEPTION_HANDLED`, `PY_UNWIND`, `PY_THROW` and `STOP_ITERATION`:

  ```python
  func(code: CodeType, instruction_offset: int, exception: BaseException) -> object
  ```

- `LINE`:

  ```python
  func(code: CodeType, line_number: int) -> object
  ```

- `BRANCH_LEFT`, `BRANCH_RIGHT` and `JUMP`:

  ```python
  func(code: CodeType, instruction_offset: int, destination_offset: int) -> object
  ```

  Note that the *destination_offset* is where the code will next execute.

- `INSTRUCTION`:

  ```python
  func(code: CodeType, instruction_offset: int) -> object
  ```
