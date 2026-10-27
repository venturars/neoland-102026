---
page: library/asyncio-runner.html
title: Runners
area: library
kind: guide
---

<!-- anchor: runners | type: section -->
# Runners

**Source code:** Lib/asyncio/runners.py

This section outlines high-level asyncio primitives to run asyncio code.

They are built on top of an event loop with the aim to simplify async code usage for common wide-spread scenarios.

- Running an asyncio Program

- Runner context manager

- Handling Keyboard Interruption

<!-- anchor: running-an-asyncio-program | type: section -->
## Running an asyncio Program

<!-- anchor: asyncio.run | type: py function -->
### `asyncio.run(coro, *, debug=None, loop_factory=None)`

Execute *coro* in an asyncio event loop and return the result.

The argument can be any awaitable object.

This function runs the awaitable, taking care of managing the asyncio event loop, *finalizing asynchronous generators*, and closing the executor.

This function cannot be called when another asyncio event loop is running in the same thread.

If *debug* is `True`, the event loop will be run in debug mode. `False` disables debug mode explicitly. `None` is used to respect the global Debug Mode settings.

If *loop_factory* is not `None`, it is used to create a new event loop; otherwise `asyncio.new_event_loop()` is used. The loop is closed at the end. This function should be used as a main entry point for asyncio programs, and should ideally only be called once. It is recommended to use *loop_factory* to configure the event loop instead of policies. Passing `asyncio.EventLoop` allows running asyncio without the policy system.

The executor is given a timeout duration of 5 minutes to shutdown. If the executor hasn’t finished within that duration, a warning is emitted and the executor is closed.

Example:

```python
async def main():
    await asyncio.sleep(1)
    print('hello')

asyncio.run(main())
```

Added in version 3.7.

Changed in version 3.9: Updated to use `loop.shutdown_default_executor()`.

Changed in version 3.10: *debug* is `None` by default to respect the global debug mode settings.

Changed in version 3.12: Added *loop_factory* parameter.

Changed in version 3.14: *coro* can be any awaitable object.

**Note:**

The `asyncio` policy system is deprecated and will be removed in Python 3.16; from there on, an explicit *loop_factory* is needed to configure the event loop.

<!-- anchor: runner-context-manager | type: section -->
## Runner context manager

<!-- anchor: asyncio.Runner | type: py class -->
### `class asyncio.Runner(*, debug=None, loop_factory=None)`

A context manager that simplifies *multiple* async function calls in the same context.

Sometimes several top-level async functions should be called in the same event loop and `contextvars.Context`.

If *debug* is `True`, the event loop will be run in debug mode. `False` disables debug mode explicitly. `None` is used to respect the global Debug Mode settings.

*loop_factory* could be used for overriding the loop creation. It is the responsibility of the *loop_factory* to set the created loop as the current one. By default `asyncio.new_event_loop()` is used and set as current event loop with `asyncio.set_event_loop()` if *loop_factory* is `None`.

Basically, `asyncio.run()` example can be rewritten with the runner usage:

```python
async def main():
    await asyncio.sleep(1)
    print('hello')

with asyncio.Runner() as runner:
    runner.run(main())
```

Added in version 3.11.

<!-- anchor: asyncio.Runner.run | type: py method -->
#### `run(coro, *, context=None)`

Execute *coro* in the embedded event loop.

The argument can be any awaitable object.

If the argument is a coroutine, it is wrapped in a Task.

An optional keyword-only *context* argument allows specifying a custom `contextvars.Context` for the code to run in. The runner’s default context is used if context is `None`.

Returns the awaitable’s result or raises an exception.

This function cannot be called when another asyncio event loop is running in the same thread.

Changed in version 3.14: *coro* can be any awaitable object.

<!-- anchor: asyncio.Runner.close | type: py method -->
#### `close()`

Close the runner.

Finalize asynchronous generators, shutdown default executor, close the event loop and release embedded `contextvars.Context`.

<!-- anchor: asyncio.Runner.get_loop | type: py method -->
#### `get_loop()`

Return the event loop associated with the runner instance.

**Note:**

`Runner` uses the lazy initialization strategy, its constructor doesn’t initialize underlying low-level structures.

Embedded *loop* and *context* are created at the `with` body entering or the first call of `run()` or `get_loop()`.

<!-- anchor: handling-keyboard-interruption | type: section -->
## Handling Keyboard Interruption

Added in version 3.11.

When `signal.SIGINT` is raised by `Ctrl`-`C`, `KeyboardInterrupt` exception is raised in the main thread by default. However this doesn’t work with `asyncio` because it can interrupt asyncio internals and can hang the program from exiting.

To mitigate this issue, `asyncio` handles `signal.SIGINT` as follows:

1. `asyncio.Runner.run()` installs a custom `signal.SIGINT` handler before any user code is executed and removes it when exiting from the function.

2. The `Runner` creates the main task for the passed coroutine for its execution.

3. When `signal.SIGINT` is raised by `Ctrl`-`C`, the custom signal handler cancels the main task by calling `asyncio.Task.cancel()` which raises `asyncio.CancelledError` inside the main task. This causes the Python stack to unwind, `try/except` and `try/finally` blocks can be used for resource cleanup. After the main task is cancelled, `asyncio.Runner.run()` raises `KeyboardInterrupt`.

4. A user could write a tight loop which cannot be interrupted by `asyncio.Task.cancel()`, in which case the second following `Ctrl`-`C` immediately raises the `KeyboardInterrupt` without cancelling the main task.
