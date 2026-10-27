---
page: library/concurrent.interpreters.html
title: concurrent.interpreters — Multiple interpreters in the same process
area: library
kind: guide
module: concurrent.interpreters
---

<!-- anchor: module-concurrent.interpreters | type: section -->
# `concurrent.interpreters` — Multiple interpreters in the same process

Added in version 3.14.

**Source code:** Lib/concurrent/interpreters

The `concurrent.interpreters` module constructs higher-level interfaces on top of the lower level `_interpreters` module.

The module is primarily meant to provide a basic API for managing interpreters (AKA “subinterpreters”) and running things in them. Running mostly involves switching to an interpreter (in the current thread) and calling a function in that execution context.

For concurrency, interpreters themselves (and this module) don’t provide much more than isolation, which on its own isn’t useful. Actual concurrency is available separately through `threads` – see below.

**See also:**

**`InterpreterPoolExecutor`**

Combines threads with interpreters in a familiar interface.

**Isolating Extension Modules**

How to update an extension module to support multiple interpreters.

**PEP 554**

**PEP 734**

**PEP 684**

Availability: not WASI.

This module does not work or is not available on WebAssembly. See WebAssembly platforms for more information.

<!-- anchor: key-details | type: section -->
## Key details

Before we dive in further, there are a small number of details to keep in mind about using multiple interpreters:

- isolated, by default

- no implicit threads

- not all PyPI packages support use in multiple interpreters yet

<!-- anchor: introduction | type: section -->
## Introduction

An “interpreter” is effectively the execution context of the Python runtime. It contains all of the state the runtime needs to execute a program. This includes things like the import state and builtins. (Each thread, even if there’s only the main thread, has some extra runtime state, in addition to the current interpreter, related to the current exception and the bytecode eval loop.)

The concept and functionality of the interpreter have been a part of Python since version 2.2, but the feature was only available through the C-API and not well known, and the isolation was relatively incomplete until version 3.12.

<!-- anchor: multiple-interpreters-and-isolation | type: section -->
### Multiple Interpreters and Isolation

A Python implementation may support using multiple interpreters in the same process. CPython has this support. Each interpreter is effectively isolated from the others (with a limited number of carefully managed process-global exceptions to the rule).

That isolation is primarily useful as a strong separation between distinct logical components of a program, where you want to have careful control of how those components interact.

**Note:**

Interpreters in the same process can technically never be strictly isolated from one another since there are few restrictions on memory access within the same process. The Python runtime makes a best effort at isolation but extension modules may easily violate that. Therefore, do not use multiple interpreters in security-sensitive situations, where they shouldn’t have access to each other’s data.

<!-- anchor: running-in-an-interpreter | type: section -->
### Running in an Interpreter

Running in a different interpreter involves switching to it in the current thread and then calling some function. The runtime will execute the function using the current interpreter’s state. The `concurrent.interpreters` module provides a basic API for creating and managing interpreters, as well as the switch-and-call operation.

No other threads are automatically started for the operation. There is a helper for that though. There is another dedicated helper for calling the builtin `exec()` in an interpreter.

When `exec()` (or `eval()`) are called in an interpreter, they run using the interpreter’s `__main__` module as the “globals” namespace. The same is true for functions that aren’t associated with any module. This is the same as how scripts invoked from the command-line run in the `__main__` module.

<!-- anchor: concurrency-and-parallelism | type: section -->
### Concurrency and Parallelism

As noted earlier, interpreters do not provide any concurrency on their own. They strictly represent the isolated execution context the runtime will use *in the current thread*. That isolation makes them similar to processes, but they still enjoy in-process efficiency, like threads.

All that said, interpreters do naturally support certain flavors of concurrency. There’s a powerful side effect of that isolation. It enables a different approach to concurrency than you can take with async or threads. It’s a similar concurrency model to CSP or the actor model, a model which is relatively easy to reason about.

You can take advantage of that concurrency model in a single thread, switching back and forth between interpreters, Stackless-style. However, this model is more useful when you combine interpreters with multiple threads. This mostly involves starting a new thread, where you switch to another interpreter and run what you want there.

Each actual thread in Python, even if you’re only running in the main thread, has its own *current* execution context. Multiple threads can use the same interpreter or different ones.

At a high level, you can think of the combination of threads and interpreters as threads with opt-in sharing.

As a significant bonus, interpreters are sufficiently isolated that they do not share the GIL, which means combining threads with multiple interpreters enables full multi-core parallelism. (This has been the case since Python 3.12.)

<!-- anchor: communication-between-interpreters | type: section -->
### Communication Between Interpreters

In practice, multiple interpreters are useful only if we have a way to communicate between them. This usually involves some form of message passing, but can even mean sharing data in some carefully managed way.

With this in mind, the `concurrent.interpreters` module provides a `queue.Queue` implementation, available through `create_queue()`.

<!-- anchor: sharing-objects | type: section -->
### “Sharing” Objects

Any data actually shared between interpreters loses the thread-safety provided by the GIL. There are various options for dealing with this in extension modules. However, from Python code the lack of thread-safety means objects can’t actually be shared, with a few exceptions. Instead, a copy must be created, which means mutable objects won’t stay in sync.

By default, most objects are copied with `pickle` when they are passed to another interpreter. Nearly all of the immutable builtin objects are either directly shared or copied efficiently. For example:

- `None`

- `bool` (`True` and `False`)

- `bytes`

- `str`

- `int`

- `float`

- `tuple` (of similarly supported objects)

There are a small number of Python types that actually share mutable data between interpreters:

- `memoryview`

- `Queue`

<!-- anchor: reference | type: section -->
## Reference

This module defines the following functions:

<!-- anchor: concurrent.interpreters.list_all | type: py function -->
### `concurrent.interpreters.list_all()`

Return a `list` of `Interpreter` objects, one for each existing interpreter.

<!-- anchor: concurrent.interpreters.get_current | type: py function -->
### `concurrent.interpreters.get_current()`

Return an `Interpreter` object for the currently running interpreter.

<!-- anchor: concurrent.interpreters.get_main | type: py function -->
### `concurrent.interpreters.get_main()`

Return an `Interpreter` object for the main interpreter. This is the interpreter the runtime created to run the REPL or the script given at the command-line. It is usually the only one.

<!-- anchor: concurrent.interpreters.create | type: py function -->
### `concurrent.interpreters.create()`

Initialize a new (idle) Python interpreter and return a `Interpreter` object for it.

<!-- anchor: concurrent.interpreters.create_queue | type: py function -->
### `concurrent.interpreters.create_queue(maxsize=0)`

Initialize a new cross-interpreter queue and return a `Queue` object for it.

*maxsize* is an integer that sets the upperbound limit on the number of items that can be placed in the queue. Insertion will be blocked once this size has been reached, until queue items are consumed. If *maxsize* is less than or equal to zero, the queue size is infinite.

<!-- anchor: interpreter-objects | type: section -->
### Interpreter objects

<!-- anchor: concurrent.interpreters.Interpreter | type: py class -->
#### `class concurrent.interpreters.Interpreter(id)`

A single interpreter in the current process.

Generally, `Interpreter` shouldn’t be called directly. Instead, use `create()` or one of the other module functions.

<!-- anchor: concurrent.interpreters.Interpreter.id | type: py attribute -->
##### `id`

(read-only)

The underlying interpreter’s ID.

<!-- anchor: concurrent.interpreters.Interpreter.whence | type: py attribute -->
##### `whence`

(read-only)

A string describing where the interpreter came from.

<!-- anchor: concurrent.interpreters.Interpreter.is_running | type: py method -->
##### `is_running()`

Return `True` if the interpreter is currently executing code in its `__main__` module and `False` otherwise.

<!-- anchor: concurrent.interpreters.Interpreter.close | type: py method -->
##### `close()`

Finalize and destroy the interpreter.

<!-- anchor: concurrent.interpreters.Interpreter.prepare_main | type: py method -->
##### `prepare_main(ns=None, **kwargs)`

Bind objects in the interpreter’s `__main__` module.

Some objects are actually shared and some are copied efficiently, but most are copied via `pickle`. See “Sharing” Objects.

<!-- anchor: concurrent.interpreters.Interpreter.exec | type: py method -->
##### `exec(code, /)`

Run the given source code in the interpreter (in the current thread).

<!-- anchor: concurrent.interpreters.Interpreter.call | type: py method -->
##### `call(callable, /, *args, **kwargs)`

Return the result of running the given function in the interpreter (in the current thread).

<!-- anchor: concurrent.interpreters.Interpreter.call_in_thread | type: py method -->
##### `call_in_thread(callable, /, *args, **kwargs)`

Run the given function in the interpreter (in a new thread).

<!-- anchor: exceptions | type: section -->
### Exceptions

<!-- anchor: concurrent.interpreters.InterpreterError | type: py exception -->
#### `exception concurrent.interpreters.InterpreterError`

This exception, a subclass of `Exception`, is raised when an interpreter-related error happens.

<!-- anchor: concurrent.interpreters.InterpreterNotFoundError | type: py exception -->
#### `exception concurrent.interpreters.InterpreterNotFoundError`

This exception, a subclass of `InterpreterError`, is raised when the targeted interpreter no longer exists.

<!-- anchor: concurrent.interpreters.ExecutionFailed | type: py exception -->
#### `exception concurrent.interpreters.ExecutionFailed`

This exception, a subclass of `InterpreterError`, is raised when the running code raised an uncaught exception.

<!-- anchor: concurrent.interpreters.ExecutionFailed.excinfo | type: py attribute -->
##### `excinfo`

A basic snapshot of the exception raised in the other interpreter.

<!-- anchor: concurrent.interpreters.NotShareableError | type: py exception -->
#### `exception concurrent.interpreters.NotShareableError`

This exception, a subclass of `TypeError`, is raised when an object cannot be sent to another interpreter.

<!-- anchor: communicating-between-interpreters | type: section -->
### Communicating Between Interpreters

<!-- anchor: concurrent.interpreters.Queue | type: py class -->
#### `class concurrent.interpreters.Queue(id)`

A wrapper around a low-level, cross-interpreter queue, which implements all the methods of `queue.Queue` except for `task_done()`, `join()` and `shutdown()`. The underlying queue can only be created through `create_queue()`.

Some objects are actually shared and some are copied efficiently, but most are copied via `pickle`. See “Sharing” Objects.

<!-- anchor: concurrent.interpreters.Queue.id | type: py attribute -->
##### `id`

(read-only)

The queue’s ID.

<!-- anchor: concurrent.interpreters.Queue.qsize | type: py method -->
##### `qsize()`

Return the number of items in the queue.

<!-- anchor: concurrent.interpreters.Queue.empty | type: py method -->
##### `empty()`

Return `True` if the queue is empty, `False` otherwise.

<!-- anchor: concurrent.interpreters.Queue.full | type: py method -->
##### `full()`

Return `True` if the queue is full, `False` otherwise.

<!-- anchor: concurrent.interpreters.Queue.put | type: py method -->
##### `put(obj, block=True, timeout=None)`

Put *obj* into the queue. If optional args *block* is true and *timeout* is `None` (the default), block if necessary until a free slot is available. If *timeout* is a positive number, it blocks at most *timeout* seconds and raises the `QueueFull` exception if no free slot was available within that time. Otherwise (*block* is false), put an object on the queue if a free slot is immediately available, else raise the `QueueFull` exception (*timeout* is ignored in that case).

<!-- anchor: concurrent.interpreters.Queue.put_nowait | type: py method -->
##### `put_nowait(obj)`

Equivalent to `put(obj, block=False)`.

<!-- anchor: concurrent.interpreters.Queue.get | type: py method -->
##### `get(block=True, timeout=None)`

Remove and return an object from the queue. If optional args *block* is true and *timeout* is `None` (the default), block if necessary until an object is available. If *timeout* is a positive number, it blocks at most *timeout* seconds and raises the `QueueEmpty` exception if no object was available within that time. Otherwise (*block* is false), return an object if one is immediately available, else raise the `QueueEmpty` exception (*timeout* is ignored in that case).

<!-- anchor: concurrent.interpreters.Queue.get_nowait | type: py method -->
##### `get_nowait()`

Equivalent to `get(block=False)`.

<!-- anchor: concurrent.interpreters.QueueEmpty | type: py exception -->
#### `exception concurrent.interpreters.QueueEmpty`

This exception, a subclass of `queue.Empty`, is raised from `Queue.get()` and `Queue.get_nowait()` when the queue is empty.

<!-- anchor: concurrent.interpreters.QueueFull | type: py exception -->
#### `exception concurrent.interpreters.QueueFull`

This exception, a subclass of `queue.Full`, is raised from `Queue.put()` and `Queue.put_nowait()` when the queue is full.

<!-- anchor: basic-usage | type: section -->
## Basic usage

Creating an interpreter and running code in it:

```python
from concurrent import interpreters

interp = interpreters.create()

# Run in the current OS thread.

interp.exec('print("spam!")')

interp.exec("""if True:
    print('spam!')
    """)

from textwrap import dedent
interp.exec(dedent("""
    print('spam!')
    """))

def run(arg):
    return arg

res = interp.call(run, 'spam!')
print(res)

def run():
    print('spam!')

interp.call(run)

# Run in new OS thread.

t = interp.call_in_thread(run)
t.join()
```

Communicating between interpreters with a queue:

```python
from concurrent import interpreters

interp = interpreters.create()
queue = interpreters.create_queue()

def worker(queue):
    queue.put('spam!')

t = interp.call_in_thread(worker, queue)
print(queue.get())
t.join()
```
