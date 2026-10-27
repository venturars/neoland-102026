---
page: c-api/tls.html
title: Thread-local storage support
area: c-api
kind: guide
---

<!-- anchor: thread-local-storage-support | type: section -->
# Thread-local storage support

The Python interpreter provides low-level support for thread-local storage (TLS) which wraps the underlying native TLS implementation to support the Python-level thread-local storage API (`threading.local`). The CPython C level APIs are similar to those offered by pthreads and Windows: use a thread key and functions to associate a void* value per thread.

A thread state does *not* need to be attached when calling these functions; they supply their own locking.

Note that `Python.h` does not include the declaration of the TLS APIs, you need to include `pythread.h` to use thread-local storage.

**Note:**

None of these API functions handle memory management on behalf of the void* values. You need to allocate and deallocate them yourself. If the void* values happen to be PyObject*, these functions don’t do refcount operations on them either.

<!-- anchor: thread-specific-storage-api | type: section -->
## Thread-specific storage API

The thread-specific storage (TSS) API was introduced to supersede the use of the existing TLS API within the CPython interpreter. This API uses a new type `Py_tss_t` instead of int to represent thread keys.

Added in version 3.7.

**See also:**

“A New C-API for Thread-Local Storage in CPython” (**PEP 539**)

<!-- anchor: c.Py_tss_t | type: c type -->
### `type Py_tss_t`

This data structure represents the state of a thread key, the definition of which may depend on the underlying TLS implementation, and it has an internal field representing the key’s initialization state. There are no public members in this structure.

When Py_LIMITED_API is not defined, static allocation of this type by `Py_tss_NEEDS_INIT` is allowed.

<!-- anchor: c.Py_tss_NEEDS_INIT | type: c macro -->
### `Py_tss_NEEDS_INIT`

This macro expands to the initializer for `Py_tss_t` variables. Note that this macro won’t be defined with Py_LIMITED_API.

<!-- anchor: dynamic-allocation | type: section -->
## Dynamic allocation

Dynamic allocation of the `Py_tss_t`, required in extension modules built with Py_LIMITED_API, where static allocation of this type is not possible due to its implementation being opaque at build time.

<!-- anchor: c.PyThread_tss_alloc | type: c function -->
### `Py_tss_t *PyThread_tss_alloc()`

*Part of the Stable ABI since version 3.7.*

Return a value which is the same state as a value initialized with `Py_tss_NEEDS_INIT`, or `NULL` in the case of dynamic allocation failure.

<!-- anchor: c.PyThread_tss_free | type: c function -->
### `void PyThread_tss_free(Py_tss_t *key)`

*Part of the Stable ABI since version 3.7.*

Free the given *key* allocated by `PyThread_tss_alloc()`, after first calling `PyThread_tss_delete()` to ensure any associated thread locals have been unassigned. This is a no-op if the *key* argument is `NULL`.

**Note:**

A freed key becomes a dangling pointer. You should reset the key to `NULL`.

<!-- anchor: methods | type: section -->
## Methods

The parameter *key* of these functions must not be `NULL`. Moreover, the behaviors of `PyThread_tss_set()` and `PyThread_tss_get()` are undefined if the given `Py_tss_t` has not been initialized by `PyThread_tss_create()`.

<!-- anchor: c.PyThread_tss_is_created | type: c function -->
### `int PyThread_tss_is_created(Py_tss_t *key)`

*Part of the Stable ABI since version 3.7.*

Return a non-zero value if the given `Py_tss_t` has been initialized by `PyThread_tss_create()`.

<!-- anchor: c.PyThread_tss_create | type: c function -->
### `int PyThread_tss_create(Py_tss_t *key)`

*Part of the Stable ABI since version 3.7.*

Return a zero value on successful initialization of a TSS key. The behavior is undefined if the value pointed to by the *key* argument is not initialized by `Py_tss_NEEDS_INIT`. This function can be called repeatedly on the same key – calling it on an already initialized key is a no-op and immediately returns success.

<!-- anchor: c.PyThread_tss_delete | type: c function -->
### `void PyThread_tss_delete(Py_tss_t *key)`

*Part of the Stable ABI since version 3.7.*

Destroy a TSS key to forget the values associated with the key across all threads, and change the key’s initialization state to uninitialized. A destroyed key is able to be initialized again by `PyThread_tss_create()`. This function can be called repeatedly on the same key – calling it on an already destroyed key is a no-op.

<!-- anchor: c.PyThread_tss_set | type: c function -->
### `int PyThread_tss_set(Py_tss_t *key, void *value)`

*Part of the Stable ABI since version 3.7.*

Return a zero value to indicate successfully associating a void* value with a TSS key in the current thread. Each thread has a distinct mapping of the key to a void* value.

<!-- anchor: c.PyThread_tss_get | type: c function -->
### `void *PyThread_tss_get(Py_tss_t *key)`

*Part of the Stable ABI since version 3.7.*

Return the void* value associated with a TSS key in the current thread. This returns `NULL` if no value is associated with the key in the current thread.

<!-- anchor: legacy-apis | type: section -->
## Legacy APIs

Deprecated since version 3.7: This API is superseded by the thread-specific storage (TSS) API.

**Note:**

This version of the API does not support platforms where the native TLS key is defined in a way that cannot be safely cast to `int`. On such platforms, `PyThread_create_key()` will return immediately with a failure status, and the other TLS functions will all be no-ops on such platforms.

Due to the compatibility problem noted above, this version of the API should not be used in new code.

<!-- anchor: c.PyThread_create_key | type: c function -->
### `int PyThread_create_key()`

*Part of the Stable ABI.*

<!-- anchor: c.PyThread_delete_key | type: c function -->
### `void PyThread_delete_key(int key)`

*Part of the Stable ABI.*

<!-- anchor: c.PyThread_set_key_value | type: c function -->
### `int PyThread_set_key_value(int key, void *value)`

*Part of the Stable ABI.*

<!-- anchor: c.PyThread_get_key_value | type: c function -->
### `void *PyThread_get_key_value(int key)`

*Part of the Stable ABI.*

<!-- anchor: c.PyThread_delete_key_value | type: c function -->
### `void PyThread_delete_key_value(int key)`

*Part of the Stable ABI.*

<!-- anchor: c.PyThread_ReInitTLS | type: c function -->
### `void PyThread_ReInitTLS()`

*Part of the Stable ABI.*
