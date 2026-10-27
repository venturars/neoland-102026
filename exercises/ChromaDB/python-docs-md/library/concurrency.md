---
page: library/concurrency.html
title: Concurrent Execution
area: library
kind: guide
---

<!-- anchor: concurrent-execution | type: section -->
# Concurrent Execution

The modules described in this chapter provide support for concurrent execution of code. The appropriate choice of tool will depend on the task to be executed (CPU bound vs IO bound) and preferred style of development (event driven cooperative multitasking vs preemptive multitasking). Here’s an overview:

- `threading` — Thread-based parallelism

  - Introduction

  - GIL and performance considerations

  - Reference

    - Thread-local data

    - Thread objects

    - Lock objects

    - RLock objects

    - Condition objects

    - Semaphore objects

    - `Semaphore` example

    - Event objects

    - Timer objects

    - Barrier objects

  - Using locks, conditions, and semaphores in the `with` statement

  - Iterator synchronization

- `multiprocessing` — Process-based parallelism

  - Introduction

    - The `Process` class

    - Contexts and start methods

    - Exchanging objects between processes

    - Synchronization between processes

    - Sharing state between processes

    - Using a pool of workers

  - Reference

    - Global start method

    - `Process` and exceptions

    - Pipes and Queues

    - Miscellaneous

    - Connection Objects

    - Synchronization primitives

    - Shared `ctypes` Objects

      - The `multiprocessing.sharedctypes` module

    - Managers

      - Customized managers

      - Using a remote manager

    - Proxy Objects

      - Cleanup

    - Process Pools

    - Listeners and Clients

      - Address Formats

    - Authentication keys

    - Logging

    - The `multiprocessing.dummy` module

  - Programming guidelines

    - All start methods

    - The *spawn* and *forkserver* start methods

  - Examples

- `multiprocessing.shared_memory` — Shared memory for direct access across processes

- The `concurrent` package

- `concurrent.futures` — Launching parallel tasks

  - Executor Objects

  - ThreadPoolExecutor

    - ThreadPoolExecutor Example

  - InterpreterPoolExecutor

  - ProcessPoolExecutor

    - ProcessPoolExecutor Example

  - Future Objects

  - Module Functions

  - Exception classes

- `concurrent.interpreters` — Multiple interpreters in the same process

  - Key details

  - Introduction

    - Multiple Interpreters and Isolation

    - Running in an Interpreter

    - Concurrency and Parallelism

    - Communication Between Interpreters

    - “Sharing” Objects

  - Reference

    - Interpreter objects

    - Exceptions

    - Communicating Between Interpreters

  - Basic usage

- `subprocess` — Subprocess management

  - Using the `subprocess` Module

    - Frequently Used Arguments

    - Popen Constructor

    - Exceptions

  - Security Considerations

  - Popen Objects

  - Windows Popen Helpers

    - Windows Constants

  - Older high-level API

  - Replacing Older Functions with the `subprocess` Module

    - Replacing **/bin/sh** shell command substitution

    - Replacing shell pipeline

    - Replacing `os.system()`

    - Replacing the `os.spawn` family

    - Replacing `os.popen()`

  - Legacy Shell Invocation Functions

  - Notes

    - Timeout Behavior

    - Converting an argument sequence to a string on Windows

    - Disable use of `posix_spawn()`

- `sched` — Event scheduler

  - Scheduler Objects

- `queue` — A synchronized queue class

  - Queue Objects

    - Waiting for task completion

    - Terminating queues

  - SimpleQueue Objects

- `contextvars` — Context Variables

  - Context Variables

  - Manual Context Management

  - asyncio support

The following are support modules for some of the above services:

- `_thread` — Low-level threading API
