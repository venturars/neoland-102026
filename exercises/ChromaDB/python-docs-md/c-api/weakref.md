---
page: c-api/weakref.html
title: Weak Reference Objects
area: c-api
kind: guide
---

<!-- anchor: weak-reference-objects | type: section -->
# Weak Reference Objects

Python supports *weak references* as first-class objects. There are two specific object types which directly implement weak references. The first is a simple reference object, and the second acts as a proxy for the original object as much as it can.

<!-- anchor: c.PyWeakref_Check | type: c function -->
## `int PyWeakref_Check(PyObject *ob)`

Return non-zero if *ob* is either a reference or proxy object. This function always succeeds.

<!-- anchor: c.PyWeakref_CheckRef | type: c function -->
## `int PyWeakref_CheckRef(PyObject *ob)`

Return non-zero if *ob* is a reference object or a subclass of the reference type. This function always succeeds.

<!-- anchor: c.PyWeakref_CheckRefExact | type: c function -->
## `int PyWeakref_CheckRefExact(PyObject *ob)`

Return non-zero if *ob* is a reference object, but not a subclass of the reference type. This function always succeeds.

<!-- anchor: c.PyWeakref_CheckProxy | type: c function -->
## `int PyWeakref_CheckProxy(PyObject *ob)`

Return non-zero if *ob* is a proxy object. This function always succeeds.

<!-- anchor: c.PyWeakref_NewRef | type: c function -->
## `PyObject *PyWeakref_NewRef(PyObject *ob, PyObject *callback)`

*Return value: New reference.**Part of the Stable ABI.*

Return a weak reference object for the object *ob*. This will always return a new reference, but is not guaranteed to create a new object; an existing reference object may be returned. The second parameter, *callback*, can be a callable object that receives notification when *ob* is garbage collected; it should accept a single parameter, which will be the weak reference object itself. *callback* may also be `None` or `NULL`. If *ob* is not a weakly referenceable object, this will raise `TypeError` and return `NULL`.

**See also:**

`PyType_SUPPORTS_WEAKREFS()` for checking if *ob* is weakly referenceable.

<!-- anchor: c.PyWeakref_NewProxy | type: c function -->
## `PyObject *PyWeakref_NewProxy(PyObject *ob, PyObject *callback)`

*Return value: New reference.**Part of the Stable ABI.*

Return a weak reference proxy object for the object *ob*. This will always return a new reference, but is not guaranteed to create a new object; an existing proxy object may be returned. The second parameter, *callback*, can be a callable object that receives notification when *ob* is garbage collected; it should accept a single parameter, which will be the weak reference object itself. *callback* may also be `None` or `NULL`. If *ob* weakly referenceable object, this will raise `TypeError` and return `NULL`.

**See also:**

`PyType_SUPPORTS_WEAKREFS()` for checking if *ob* is weakly referenceable.

<!-- anchor: c.PyWeakref_GetRef | type: c function -->
## `int PyWeakref_GetRef(PyObject *ref, PyObject **pobj)`

*Part of the Stable ABI since version 3.13.*

Get a strong reference to the referenced object from a weak reference, *ref*, into **pobj*.

- On success, set **pobj* to a new strong reference to the referenced object and return 1.

- If the reference is dead, set **pobj* to `NULL` and return 0.

- On error, raise an exception and return -1.

Added in version 3.13.

<!-- anchor: c.PyWeakref_IsDead | type: c function -->
## `int PyWeakref_IsDead(PyObject *ref)`

Test if the weak reference *ref* is dead. Returns 1 if the reference is dead, 0 if it is alive, and -1 with an error set if *ref* is not a weak reference object.

Added in version 3.14.

<!-- anchor: c.PyObject_ClearWeakRefs | type: c function -->
## `void PyObject_ClearWeakRefs(PyObject *object)`

*Part of the Stable ABI.*

This function is called by the `tp_dealloc` handler to clear weak references.

This iterates through the weak references for *object* and calls callbacks for those references which have one. It returns when all callbacks have been attempted.

<!-- anchor: c.PyUnstable_Object_ClearWeakRefsNoCallbacks | type: c function -->
## `void PyUnstable_Object_ClearWeakRefsNoCallbacks(PyObject *object)`

*This is Unstable API. It may change without warning in minor releases.*

Clears the weakrefs for *object* without calling the callbacks.

This function is called by the `tp_dealloc` handler for types with finalizers (i.e., `__del__()`). The handler for those objects first calls `PyObject_ClearWeakRefs()` to clear weakrefs and call their callbacks, then the finalizer, and finally this function to clear any weakrefs that may have been created by the finalizer.

In most circumstances, it’s more appropriate to use `PyObject_ClearWeakRefs()` to clear weakrefs instead of this function.

Added in version 3.13.
