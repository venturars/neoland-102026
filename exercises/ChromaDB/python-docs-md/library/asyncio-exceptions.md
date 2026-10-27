---
page: library/asyncio-exceptions.html
title: Exceptions
area: library
kind: guide
---

<!-- anchor: exceptions | type: section -->
# Exceptions

**Source code:** Lib/asyncio/exceptions.py

<!-- anchor: asyncio.TimeoutError | type: py exception -->
## `exception asyncio.TimeoutError`

A deprecated alias of `TimeoutError`, raised when the operation has exceeded the given deadline.

Changed in version 3.11: This class was made an alias of `TimeoutError`.

<!-- anchor: asyncio.CancelledError | type: py exception -->
## `exception asyncio.CancelledError`

The operation has been cancelled.

This exception can be caught to perform custom operations when asyncio Tasks are cancelled. In almost all situations the exception must be re-raised.

Changed in version 3.8: `CancelledError` is now a subclass of `BaseException` rather than `Exception`.

<!-- anchor: asyncio.InvalidStateError | type: py exception -->
## `exception asyncio.InvalidStateError`

Invalid internal state of `Task` or `Future`.

Can be raised in situations like setting a result value for a *Future* object that already has a result value set.

<!-- anchor: asyncio.SendfileNotAvailableError | type: py exception -->
## `exception asyncio.SendfileNotAvailableError`

The “sendfile” syscall is not available for the given socket or file type.

A subclass of `RuntimeError`.

<!-- anchor: asyncio.IncompleteReadError | type: py exception -->
## `exception asyncio.IncompleteReadError`

The requested read operation did not complete fully.

Raised by the asyncio stream APIs.

This exception is a subclass of `EOFError`.

<!-- anchor: asyncio.IncompleteReadError.expected | type: py attribute -->
### `expected`

The total number (`int`) of expected bytes.

<!-- anchor: asyncio.IncompleteReadError.partial | type: py attribute -->
### `partial`

A string of `bytes` read before the end of stream was reached.

<!-- anchor: asyncio.LimitOverrunError | type: py exception -->
## `exception asyncio.LimitOverrunError`

Reached the buffer size limit while looking for a separator.

Raised by the asyncio stream APIs.

<!-- anchor: asyncio.LimitOverrunError.consumed | type: py attribute -->
### `consumed`

The total number of to be consumed bytes.
