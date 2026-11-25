# Thread-local storage support

The Python interpreter provides low-level support for thread-local storage
(TLS) which wraps the underlying native TLS implementation to support the
Python-level thread-local storage API (`threading.local`). The
CPython C level APIs are similar to those offered by pthreads and Windows:
use a thread key and functions to associate a void\* value per
thread.

A thread state does *not* need to be attached
when calling these functions; they supply their own locking.

Note that `Python.h` does not include the declaration of the TLS APIs,
you need to include `pythread.h` to use thread-local storage.

Note

None of these API functions handle memory management on behalf of the
void\* values. You need to allocate and deallocate them yourself.
If the void\* values happen to be PyObject\*, these
functions don’t do refcount operations on them either.

## Thread-specific storage API

The thread-specific storage (TSS) API was introduced to supersede the use of the existing TLS API within the
CPython interpreter. This API uses a new type `Py_tss_t` instead of
int to represent thread keys.

See also

“A New C-API for Thread-Local Storage in CPython” (**PEP 539**)

type Py\_tss\_t
:   This data structure represents the state of a thread key, the definition of
    which may depend on the underlying TLS implementation, and it has an
    internal field representing the key’s initialization state. There are no
    public members in this structure.

    When Py\_LIMITED\_API is not defined, static allocation of
    this type by `Py_tss_NEEDS_INIT` is allowed.

Py\_tss\_NEEDS\_INIT
:   This macro expands to the initializer for `Py_tss_t` variables.
    Note that this macro won’t be defined with Py\_LIMITED\_API.

## Dynamic allocation

Dynamic allocation of the `Py_tss_t`, required in extension modules
built with Py\_LIMITED\_API, where static allocation of this type
is not possible due to its implementation being opaque at build time.

Py\_tss\_t \*PyThread\_tss\_alloc()
:   *Part of the Stable ABI since version 3.7.*

    Return a value which is the same state as a value initialized with
    `Py_tss_NEEDS_INIT`, or `NULL` in the case of dynamic allocation
    failure.

void PyThread\_tss\_free(Py\_tss\_t \*key)
:   *Part of the Stable ABI since version 3.7.*

    Free the given *key* allocated by `PyThread_tss_alloc()`, after
    first calling `PyThread_tss_delete()` to ensure any associated
    thread locals have been unassigned. This is a no-op if the *key*
    argument is `NULL`.

    Note

    A freed key becomes a dangling pointer. You should reset the key to
    `NULL`.

## Methods

The parameter *key* of these functions must not be `NULL`. Moreover, the
behaviors of `PyThread_tss_set()` and `PyThread_tss_get()` are
undefined if the given `Py_tss_t` has not been initialized by
`PyThread_tss_create()`.

int PyThread\_tss\_is\_created(Py\_tss\_t \*key)
:   *Part of the Stable ABI since version 3.7.*

    Return a non-zero value if the given `Py_tss_t` has been initialized
    by `PyThread_tss_create()`.

int PyThread\_tss\_create(Py\_tss\_t \*key)
:   *Part of the Stable ABI since version 3.7.*

    Return a zero value on successful initialization of a TSS key. The behavior
    is undefined if the value pointed to by the *key* argument is not
    initialized by `Py_tss_NEEDS_INIT`. This function can be called
    repeatedly on the same key – calling it on an already initialized key is a
    no-op and immediately returns success.

void PyThread\_tss\_delete(Py\_tss\_t \*key)
:   *Part of the Stable ABI since version 3.7.*

    Destroy a TSS key to forget the values associated with the key across all
    threads, and change the key’s initialization state to uninitialized. A
    destroyed key is able to be initialized again by
    `PyThread_tss_create()`. This function can be called repeatedly on
    the same key – calling it on an already destroyed key is a no-op.

int PyThread\_tss\_set(Py\_tss\_t \*key, void \*value)
:   *Part of the Stable ABI since version 3.7.*

    Return a zero value to indicate successfully associating a void\*
    value with a TSS key in the current thread. Each thread has a distinct
    mapping of the key to a void\* value.

void \*PyThread\_tss\_get(Py\_tss\_t \*key)
:   *Part of the Stable ABI since version 3.7.*

    Return the void\* value associated with a TSS key in the current
    thread. This returns `NULL` if no value is associated with the key in the
    current thread.

## Legacy APIs

Deprecated since version 3.7: This API is superseded by the
thread-specific storage (TSS) API.

Note

This version of the API does not support platforms where the native TLS key
is defined in a way that cannot be safely cast to `int`. On such platforms,
`PyThread_create_key()` will return immediately with a failure status,
and the other TLS functions will all be no-ops on such platforms.

Due to the compatibility problem noted above, this version of the API should not
be used in new code.

int PyThread\_create\_key()
:   *Part of the Stable ABI.*

void PyThread\_delete\_key(int key)
:   *Part of the Stable ABI.*

int PyThread\_set\_key\_value(int key, void \*value)
:   *Part of the Stable ABI.*

void \*PyThread\_get\_key\_value(int key)
:   *Part of the Stable ABI.*

void PyThread\_delete\_key\_value(int key)
:   *Part of the Stable ABI.*

void PyThread\_ReInitTLS()
:   *Part of the Stable ABI.*
