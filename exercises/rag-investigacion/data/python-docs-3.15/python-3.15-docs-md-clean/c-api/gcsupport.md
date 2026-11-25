# Supporting Cyclic Garbage Collection

Python’s support for detecting and collecting garbage which involves circular
references requires support from object types which are “containers” for other
objects which may also be containers. Types which do not store references to
other objects, or which only store references to atomic types (such as numbers
or strings), do not need to provide any explicit support for garbage
collection.

To create a container type, the `tp_flags` field of the type object must
include the `Py_TPFLAGS_HAVE_GC` and provide an implementation of the
`tp_traverse` handler. If instances of the type are mutable, a
`tp_clear` implementation must also be provided.

`Py_TPFLAGS_HAVE_GC`
:   Objects with a type with this flag set must conform with the rules
    documented here. For convenience these objects will be referred to as
    container objects.

Constructors for container types must conform to two rules:

1. The memory for the object must be allocated using `PyObject_GC_New`
   or `PyObject_GC_NewVar`.
2. Once all the fields which may contain references to other containers are
   initialized, it must call `PyObject_GC_Track()`.

Similarly, the deallocator for the object must conform to a similar pair of
rules:

1. Before fields which refer to other containers are invalidated,
   `PyObject_GC_UnTrack()` must be called.
2. The object’s memory must be deallocated using `PyObject_GC_Del()`.

   Warning

   If a type adds the Py\_TPFLAGS\_HAVE\_GC, then it *must* implement at least
   a `tp_traverse` handler or explicitly use one
   from a base class.

   When calling `PyType_Ready()` or some of the APIs that indirectly
   call it like `PyType_FromSpecWithBases()` or
   `PyType_FromSpec()` the interpreter will automatically populate the
   `tp_flags`, `tp_traverse`
   and `tp_clear` fields if the type inherits from a
   class that implements the garbage collector protocol and the child class
   does *not* include the `Py_TPFLAGS_HAVE_GC` flag.

PyObject\_GC\_New(TYPE, typeobj)
:   Analogous to `PyObject_New` but for container objects with the
    `Py_TPFLAGS_HAVE_GC` flag set.

    Do not call this directly to allocate memory for an object; call the type’s
    `tp_alloc` slot instead.

    When populating a type’s `tp_alloc` slot,
    `PyType_GenericAlloc()` is preferred over a custom function that
    simply calls this macro.

    Memory allocated by this macro must be freed with
    `PyObject_GC_Del()` (usually called via the object’s
    `tp_free` slot).

    See also

    - `PyObject_GC_Del()`
    - `PyObject_New`
    - `PyType_GenericAlloc()`
    - `tp_alloc`

PyObject\_GC\_NewVar(TYPE, typeobj, size)
:   Analogous to `PyObject_NewVar` but for container objects with the
    `Py_TPFLAGS_HAVE_GC` flag set.

    Do not call this directly to allocate memory for an object; call the type’s
    `tp_alloc` slot instead.

    When populating a type’s `tp_alloc` slot,
    `PyType_GenericAlloc()` is preferred over a custom function that
    simply calls this macro.

    Memory allocated by this macro must be freed with
    `PyObject_GC_Del()` (usually called via the object’s
    `tp_free` slot).

    See also

    - `PyObject_GC_Del()`
    - `PyObject_NewVar`
    - `PyType_GenericAlloc()`
    - `tp_alloc`

PyObject \*PyUnstable\_Object\_GC\_NewWithExtraData(PyTypeObject \*type, size\_t extra\_size)
:   *This is Unstable API. It may change without warning in minor releases.*

    Analogous to `PyObject_GC_New` but allocates *extra\_size*
    bytes at the end of the object (at offset
    `tp_basicsize`).
    The allocated memory is initialized to zeros,
    except for the `Python object header`.

    The extra data will be deallocated with the object, but otherwise it is
    not managed by Python.

    Memory allocated by this function must be freed with
    `PyObject_GC_Del()` (usually called via the object’s
    `tp_free` slot).

    Warning

    The function is marked as unstable because the final mechanism
    for reserving extra data after an instance is not yet decided.
    For allocating a variable number of fields, prefer using
    `PyVarObject` and `tp_itemsize`
    instead.

PyObject\_GC\_Resize(TYPE, op, newsize)
:   Resize an object allocated by `PyObject_GC_NewVar`.
    Returns the resized object of type `TYPE*` (refers to any C type)
    or `NULL` on failure.

    *op* must be of type PyVarObject\*
    and must not be tracked by the collector yet.
    *newsize* must be of type `Py_ssize_t`.

void PyObject\_GC\_Track(PyObject \*op)
:   *Part of the Stable ABI.*

    Adds the object *op* to the set of container objects tracked by the
    collector. The collector can run at unexpected times so objects must be
    valid while being tracked. This should be called once all the fields
    followed by the `tp_traverse` handler become valid, usually near the
    end of the constructor.

int PyObject\_IS\_GC(PyObject \*obj)
:   Returns non-zero if the object implements the garbage collector protocol,
    otherwise returns 0.

    The object cannot be tracked by the garbage collector if this function returns 0.

int PyObject\_GC\_IsTracked(PyObject \*op)
:   *Part of the Stable ABI since version 3.9.*

    Returns 1 if the object type of *op* implements the GC protocol and *op* is being
    currently tracked by the garbage collector and 0 otherwise.

    This is analogous to the Python function `gc.is_tracked()`.

int PyObject\_GC\_IsFinalized(PyObject \*op)
:   *Part of the Stable ABI since version 3.9.*

    Returns 1 if the object type of *op* implements the GC protocol and *op* has been
    already finalized by the garbage collector and 0 otherwise.

    This is analogous to the Python function `gc.is_finalized()`.

void PyObject\_GC\_Del(void \*op)
:   *Part of the Stable ABI.*

    Releases memory allocated to an object using `PyObject_GC_New` or
    `PyObject_GC_NewVar`.

    Do not call this directly to free an object’s memory; call the type’s
    `tp_free` slot instead.

    Do not use this for memory allocated by `PyObject_New`,
    `PyObject_NewVar`, or related allocation functions; use
    `PyObject_Free()` instead.

    See also

    - `PyObject_Free()` is the non-GC equivalent of this function.
    - `PyObject_GC_New`
    - `PyObject_GC_NewVar`
    - `PyType_GenericAlloc()`
    - `tp_free`

void PyObject\_GC\_UnTrack(void \*op)
:   *Part of the Stable ABI.*

    Remove the object *op* from the set of container objects tracked by the
    collector. Note that `PyObject_GC_Track()` can be called again on
    this object to add it back to the set of tracked objects. The deallocator
    (`tp_dealloc` handler) should call this for the object before any of
    the fields used by the `tp_traverse` handler become invalid.

Changed in version 3.8: The `_PyObject_GC_TRACK()` and `_PyObject_GC_UNTRACK()` macros
have been removed from the public C API.

The `tp_traverse` handler accepts a function parameter of this type:

typedef int (\*visitproc)(PyObject \*object, void \*arg)
:   *Part of the Stable ABI.*

    Type of the visitor function passed to the `tp_traverse` handler.
    The function should be called with an object to traverse as *object* and
    the third parameter to the `tp_traverse` handler as *arg*. The
    Python core uses several visitor functions to implement cyclic garbage
    detection; it’s not expected that users will need to write their own
    visitor functions.

The `tp_clear` handler must be of the `inquiry` type, or `NULL`
if the object is immutable.

typedef int (\*inquiry)(PyObject \*self)
:   *Part of the Stable ABI.*

    Drop references that may have created reference cycles. Immutable objects
    do not have to define this method since they can never directly create
    reference cycles. Note that the object must still be valid after calling
    this method (don’t just call `Py_DECREF()` on a reference). The
    collector will call this method if it detects that this object is involved
    in a reference cycle.

## Traversal

The `tp_traverse` handler must have the following type:

typedef int (\*traverseproc)(PyObject \*self, visitproc visit, void \*arg)
:   *Part of the Stable ABI.*

    Traversal function for a garbage-collected object, used by the garbage
    collector to detect reference cycles.
    Implementations must call the
    *visit* function for each object directly contained by *self*, with the
    parameters to *visit* being the contained object and the *arg* value passed
    to the handler. The *visit* function must not be called with a `NULL`
    object argument. If *visit* returns a non-zero value, that value should be
    returned immediately.
    Otherwise, return zero.

    A typical `tp_traverse` function calls the `Py_VISIT()`
    convenience macro on each of the instance’s members that are Python
    objects that the instance owns.
    For example, this is a (slightly outdated) traversal function for
    the `threading.local` class:

    ```
    static int
    local_traverse(PyObject *op, visitproc visit, void *arg)
    {
        localobject *self = (localobject *) op;
        Py_VISIT(Py_TYPE(self));
        Py_VISIT(self->args);
        Py_VISIT(self->kw);
        Py_VISIT(self->dict);
        return 0;
    }
    ```

    Note

    `Py_VISIT()` requires the *visit* and *arg* parameters to
    `local_traverse()` to have these specific names; don’t name them just
    anything.

    Instances of heap-allocated types hold a reference to
    their type. Their traversal function must therefore visit the type:

    ```
    Py_VISIT(Py_TYPE(self));
    ```

    Alternately, the type may delegate this responsibility by
    calling `tp_traverse` of a heap-allocated superclass (or another
    heap-allocated type, if applicable).
    If they do not, the type object may not be garbage-collected.

    If the `Py_TPFLAGS_MANAGED_DICT` bit is set in the
    `tp_flags` field, the traverse function must call
    `PyObject_VisitManagedDict()` like this:

    ```
    int err = PyObject_VisitManagedDict((PyObject*)self, visit, arg);
    if (err) {
        return err;
    }
    ```

    Only the members that the instance *owns* (by having
    strong references to them) must be
    visited. For instance, if an object supports weak references via the
    `tp_weaklist` slot, the pointer supporting
    the linked list (what *tp\_weaklist* points to) must **not** be
    visited as the instance does not directly own the weak references to itself.

    The traversal function has a limitation:

    Warning

    The traversal function must not have any side effects. Implementations
    may not modify the reference counts of any Python objects nor create or
    destroy any Python objects, directly or indirectly.

    This means that *most* Python C API functions may not be used, since
    they can raise a new exception, return a new reference to a result object,
    have internal logic that uses side effects.
    Also, unless documented otherwise, functions that happen to not have side
    effects may start having them in future versions, without warning.

    For a list of safe functions, see a
    separate section below.

    If an error occurs during traversal, ignore it and return 0.
    If `tp_traverse` fails to visit some strong references, garbage reference
    cycles involving the skipped references will not be reliably broken,
    but correctness won’t be affected.
    For example, if traversal requires a lock that cannot be acquired promptly,
    skip the traversal.
    The garbage collector will visit your object again in a future pass.

    Note

    The `Py_VISIT()` call may be skipped for those members that provably
    cannot participate in reference cycles.
    In the `local_traverse` example above, there is also a `self->key`
    member, but it can only be `NULL` or a Python string and therefore
    cannot be part of a reference cycle.

    On the other hand, even if you know a member can never be part of a cycle,
    as a debugging aid you may want to visit it anyway just so the `gc`
    module’s `get_referents()` function will include it.

    Note

    The `tp_traverse` function can be called from any
    thread.

    **CPython implementation detail:** Garbage collection is a “stop-the-world” operation:
    even in free threading builds, only one thread state is
    attached when `tp_traverse`
    handlers run.

To simplify writing `tp_traverse` handlers,
a `Py_VISIT()` macro is provided.
In order to use this macro, the `tp_traverse`
implementation must name its arguments exactly *visit* and *arg*:

Py\_VISIT(o)
:   If the PyObject\* *o* is not `NULL`, call the *visit*
    callback, with arguments *o* and *arg*.
    If *visit* returns a non-zero value, then return it.

    This corresponds roughly to:

    ```
    #define Py_VISIT(o)                             \
       if (o) {                                    \
          int visit_result = visit(o, arg);         \
          if (visit_result != 0) {                  \
             return visit_result;                   \
          }                                         \
       }
    ```

### Traversal-safe functions

The following functions and macros are safe to use in a
`tp_traverse` handler:

- the *visit* function passed to `tp_traverse`
- `Py_VISIT()`
- `Py_SIZE()`
- `Py_TYPE()`: if called from a `tp_traverse` handler,
  `Py_TYPE()`’s result will be valid for the duration of the handler call
- `PyObject_VisitManagedDict()`
- `PyObject_TypeCheck()`, `PyType_IsSubtype()`,
  `PyType_HasFeature()`
- `Py<type>_Check` and `Py<type>_CheckExact` – for example,
  `PyTuple_Check()`
- “DuringGC” functions

### “DuringGC” functions

The following functions should *only* be used in a
`tp_traverse` handler; calling them in other
contexts may have unintended consequences.

These functions act like their counterparts without the `_DuringGC` suffix,
but they are guaranteed to not have side effects, they do not set an exception
on failure, and they return/set borrowed references
as detailed in the individual documentation.

Note that these functions may fail (return `NULL` or `-1`),
but as they do not set an exception, no error information is available.
In some cases, failure is not distinguishable from a successful `NULL` result.

void \*PyObject\_GetTypeData\_DuringGC(PyObject \*o, PyTypeObject \*cls)

void \*PyObject\_GetItemData\_DuringGC(PyObject \*o)

void \*PyType\_GetModuleState\_DuringGC(PyTypeObject \*type)

void \*PyModule\_GetState\_DuringGC(PyObject \*module)

int PyModule\_GetToken\_DuringGC(PyObject \*module, void \*\*result)
:   *Part of the Stable ABI since version 3.15.*

    See “DuringGC” functions for common information.

    Added in version 3.15.

    See also

    `PyObject_GetTypeData()`,
    `PyObject_GetItemData()`,
    `PyType_GetModuleState()`,
    `PyModule_GetState()`,
    `PyModule_GetToken()`,
    `PyType_GetBaseByToken()`

int PyType\_GetBaseByToken\_DuringGC(PyTypeObject \*type, void \*tp\_token, PyTypeObject \*\*result)
:   *Part of the Stable ABI since version 3.15.*

    See “DuringGC” functions for common information.

    Sets *\*result* to a borrowed reference rather than a strong one.
    The reference is valid for the duration
    of the `tp_traverse` handler call.

    Added in version 3.15.

    See also

    `PyType_GetBaseByToken()`

PyObject \*PyType\_GetModule\_DuringGC(PyTypeObject \*type)

PyObject \*PyType\_GetModuleByToken\_DuringGC(PyTypeObject \*type, const void \*mod\_token)
:   *Return value: Borrowed reference.* *Part of the Stable ABI since version 3.15.*

    See “DuringGC” functions for common information.

    These functions return a borrowed reference, which is
    valid for the duration of the `tp_traverse` handler call.

    Added in version 3.15.

    See also

    `PyType_GetModule()`,
    `PyType_GetModuleByToken()`

## Controlling the Garbage Collector State

The C-API provides the following functions for controlling
garbage collection runs.

Py\_ssize\_t PyGC\_Collect(void)
:   *Part of the Stable ABI.*

    Perform a full garbage collection, if the garbage collector is enabled.
    (Note that `gc.collect()` runs it unconditionally.)

    Returns the number of collected + unreachable objects which cannot
    be collected.
    If the garbage collector is disabled or already collecting,
    returns `0` immediately.
    Errors during garbage collection are passed to `sys.unraisablehook`.
    This function does not raise exceptions.

int PyGC\_Enable(void)
:   *Part of the Stable ABI since version 3.10.*

    Enable the garbage collector: similar to `gc.enable()`.
    Returns the previous state, 0 for disabled and 1 for enabled.

int PyGC\_Disable(void)
:   *Part of the Stable ABI since version 3.10.*

    Disable the garbage collector: similar to `gc.disable()`.
    Returns the previous state, 0 for disabled and 1 for enabled.

int PyGC\_IsEnabled(void)
:   *Part of the Stable ABI since version 3.10.*

    Query the state of the garbage collector: similar to `gc.isenabled()`.
    Returns the current state, 0 for disabled and 1 for enabled.

## Querying Garbage Collector State

The C-API provides the following interface for querying information about
the garbage collector.

void PyUnstable\_GC\_VisitObjects(gcvisitobjects\_t callback, void \*arg)
:   *This is Unstable API. It may change without warning in minor releases.*

    Run supplied *callback* on all live GC-capable objects. *arg* is passed through to
    all invocations of *callback*.

    Warning

    If new objects are (de)allocated by the callback it is undefined if they
    will be visited.

    Garbage collection is disabled during operation. Explicitly running a collection
    in the callback may lead to undefined behaviour e.g. visiting the same objects
    multiple times or not at all.

typedef int (\*gcvisitobjects\_t)(PyObject \*object, void \*arg)
:   Type of the visitor function to be passed to `PyUnstable_GC_VisitObjects()`.
    *arg* is the same as the *arg* passed to `PyUnstable_GC_VisitObjects`.
    Return `1` to continue iteration, return `0` to stop iteration. Other return
    values are reserved for now so behavior on returning anything else is undefined.
