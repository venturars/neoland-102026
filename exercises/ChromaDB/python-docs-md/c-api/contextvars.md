---
page: c-api/contextvars.html
title: Context Variables Objects
area: c-api
kind: guide
---

<!-- anchor: context-variables-objects | type: section -->
# Context Variables Objects

Added in version 3.7.

Changed in version 3.7.1:

**Note:**

In Python 3.7.1 the signatures of all context variables C APIs were **changed** to use `PyObject` pointers instead of `PyContext`, `PyContextVar`, and `PyContextToken`, e.g.:

```c
// in 3.7.0:
PyContext *PyContext_New(void);

// in 3.7.1+:
PyObject *PyContext_New(void);
```

See bpo-34762 for more details.

This section details the public C API for the `contextvars` module.

<!-- anchor: c.PyContext | type: c type -->
## `type PyContext`

The C structure used to represent a `contextvars.Context` object.

<!-- anchor: c.PyContextVar | type: c type -->
## `type PyContextVar`

The C structure used to represent a `contextvars.ContextVar` object.

<!-- anchor: c.PyContextToken | type: c type -->
## `type PyContextToken`

The C structure used to represent a `contextvars.Token` object.

<!-- anchor: c.PyContext_Type | type: c var -->
## `PyTypeObject PyContext_Type`

The type object representing the *context* type.

<!-- anchor: c.PyContextVar_Type | type: c var -->
## `PyTypeObject PyContextVar_Type`

The type object representing the *context variable* type.

<!-- anchor: c.PyContextToken_Type | type: c var -->
## `PyTypeObject PyContextToken_Type`

The type object representing the *context variable token* type.

Type-check macros:

<!-- anchor: c.PyContext_CheckExact | type: c function -->
## `int PyContext_CheckExact(PyObject *o)`

Return true if *o* is of type `PyContext_Type`. *o* must not be `NULL`. This function always succeeds.

<!-- anchor: c.PyContextVar_CheckExact | type: c function -->
## `int PyContextVar_CheckExact(PyObject *o)`

Return true if *o* is of type `PyContextVar_Type`. *o* must not be `NULL`. This function always succeeds.

<!-- anchor: c.PyContextToken_CheckExact | type: c function -->
## `int PyContextToken_CheckExact(PyObject *o)`

Return true if *o* is of type `PyContextToken_Type`. *o* must not be `NULL`. This function always succeeds.

Context object management functions:

<!-- anchor: c.PyContext_New | type: c function -->
## `PyObject *PyContext_New(void)`

*Return value: New reference.*

Create a new empty context object. Returns `NULL` if an error has occurred.

<!-- anchor: c.PyContext_Copy | type: c function -->
## `PyObject *PyContext_Copy(PyObject *ctx)`

*Return value: New reference.*

Create a shallow copy of the passed *ctx* context object. Returns `NULL` if an error has occurred.

<!-- anchor: c.PyContext_CopyCurrent | type: c function -->
## `PyObject *PyContext_CopyCurrent(void)`

*Return value: New reference.*

Create a shallow copy of the current thread context. Returns `NULL` if an error has occurred.

<!-- anchor: c.PyContext_Enter | type: c function -->
## `int PyContext_Enter(PyObject *ctx)`

Set *ctx* as the current context for the current thread. Returns `0` on success, and `-1` on error.

<!-- anchor: c.PyContext_Exit | type: c function -->
## `int PyContext_Exit(PyObject *ctx)`

Deactivate the *ctx* context and restore the previous context as the current context for the current thread. Returns `0` on success, and `-1` on error.

<!-- anchor: c.PyContext_AddWatcher | type: c function -->
## `int PyContext_AddWatcher(PyContext_WatchCallback callback)`

Register *callback* as a context object watcher for the current interpreter. Return an ID which may be passed to `PyContext_ClearWatcher()`. In case of error (e.g. no more watcher IDs available), return `-1` and set an exception.

Added in version 3.14.

<!-- anchor: c.PyContext_ClearWatcher | type: c function -->
## `int PyContext_ClearWatcher(int watcher_id)`

Clear watcher identified by *watcher_id* previously returned from `PyContext_AddWatcher()` for the current interpreter. Return `0` on success, or `-1` and set an exception on error (e.g. if the given *watcher_id* was never registered.)

Added in version 3.14.

<!-- anchor: c.PyContextEvent | type: c type -->
## `type PyContextEvent`

Enumeration of possible context object watcher events:

- `Py_CONTEXT_SWITCHED`: The current context has switched to a different context. The object passed to the watch callback is the now-current `contextvars.Context` object, or None if no context is current.

Added in version 3.14.

<!-- anchor: c.PyContext_WatchCallback | type: c type -->
## `typedef int (*PyContext_WatchCallback)(PyContextEvent event, PyObject *obj)`

Context object watcher callback function. The object passed to the callback is event-specific; see `PyContextEvent` for details.

If the callback returns with an exception set, it must return `-1`; this exception will be printed as an unraisable exception using `PyErr_FormatUnraisable()`. Otherwise it should return `0`.

There may already be a pending exception set on entry to the callback. In this case, the callback should return `0` with the same exception still set. This means the callback may not call any other API that can set an exception unless it saves and clears the exception state first, and restores it before returning.

Added in version 3.14.

Context variable functions:

<!-- anchor: c.PyContextVar_New | type: c function -->
## `PyObject *PyContextVar_New(const char *name, PyObject *def)`

*Return value: New reference.*

Create a new `ContextVar` object. The *name* parameter is used for introspection and debug purposes. The *def* parameter specifies a default value for the context variable, or `NULL` for no default. If an error has occurred, this function returns `NULL`.

<!-- anchor: c.PyContextVar_Get | type: c function -->
## `int PyContextVar_Get(PyObject *var, PyObject *default_value, PyObject **value)`

Get the value of a context variable. Returns `-1` if an error has occurred during lookup, and `0` if no error occurred, whether or not a value was found.

If the context variable was found, *value* will be a pointer to it. If the context variable was *not* found, *value* will point to:

- *default_value*, if not `NULL`;

- the default value of *var*, if not `NULL`;

- `NULL`

Except for `NULL`, the function returns a new reference.

<!-- anchor: c.PyContextVar_Set | type: c function -->
## `PyObject *PyContextVar_Set(PyObject *var, PyObject *value)`

*Return value: New reference.*

Set the value of *var* to *value* in the current context. Returns a new token object for this change, or `NULL` if an error has occurred.

<!-- anchor: c.PyContextVar_Reset | type: c function -->
## `int PyContextVar_Reset(PyObject *var, PyObject *token)`

Reset the state of the *var* context variable to that it was in before `PyContextVar_Set()` that returned the *token* was called. This function returns `0` on success and `-1` on error.
