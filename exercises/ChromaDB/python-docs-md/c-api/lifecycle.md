---
page: c-api/lifecycle.html
title: Object Life Cycle
area: c-api
kind: guide
---

<!-- anchor: object-life-cycle | type: section -->
# Object Life Cycle

This section explains how a type’s slots relate to each other throughout the life of an object. It is not intended to be a complete canonical reference for the slots; instead, refer to the slot-specific documentation in Type Object Structures for details about a particular slot.

<!-- anchor: life-events | type: section -->
## Life Events

The figure below illustrates the order of events that can occur throughout an object’s life. An arrow from *A* to *B* indicates that event *B* can occur after event *A* has occurred, with the arrow’s label indicating the condition that must be true for *B* to occur after *A*.

xml version="1.0" encoding="UTF-8" standalone="no"?

xml-stylesheet href="lifecycle.dot.css" type="text/css"?

svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"

Life Events     tp_new   tp_new      start->tp_new        type call       tp_alloc   tp_alloc      tp_new->tp_alloc        direct call       tp_init   tp_init      tp_new->tp_init         reachable  reachable    tp_init->reachable         reachable->tp_init         tp_traverse   tp_traverse      reachable->tp_traverse        not in a   cyclic   isolate       reachable->tp_traverse        periodic   cyclic isolate   detection       finalized?   marked as finalized?      reachable->finalized?        no refs       tp_finalize   tp_finalize      reachable->tp_finalize        resurrected   (maybe remove   finalized mark)       uncollectable   uncollectable (leaked)      reachable->uncollectable        cyclic   isolate   (no GC   support)       tp_dealloc   tp_dealloc      reachable->tp_dealloc     no refs      tp_traverse->finalized?        cyclic   isolate       finalized?->tp_finalize        no (mark   as finalized)       tp_clear   tp_clear      finalized?->tp_clear        yes       tp_finalize->tp_clear        no refs or   cyclic isolate       tp_finalize->tp_dealloc        recommended  call (see  explanation)      tp_finalize->tp_dealloc        no refs       tp_clear->uncollectable        cyclic   isolate       tp_clear->tp_dealloc        no refs        tp_free   tp_free      tp_dealloc->tp_free        direct call

Explanation:

- When a new object is constructed by calling its type:

  1. `tp_new` is called to create a new object.

  2. `tp_alloc` is directly called by `tp_new` to allocate the memory for the new object.

  3. `tp_init` initializes the newly created object. `tp_init` can be called again to re-initialize an object, if desired. The `tp_init` call can also be skipped entirely, for example by Python code calling `__new__()`.

- After `tp_init` completes, the object is ready to use.

- Some time after the last reference to an object is removed:

  1. If an object is not marked as *finalized*, it might be finalized by marking it as *finalized* and calling its `tp_finalize` function. Python does *not* finalize an object when the last reference to it is deleted; use `PyObject_CallFinalizerFromDealloc()` to ensure that `tp_finalize` is always called.

  2. If the object is marked as finalized, `tp_clear` might be called by the garbage collector to clear references held by the object. It is *not* called when the object’s reference count reaches zero.

  3. `tp_dealloc` is called to destroy the object. To avoid code duplication, `tp_dealloc` typically calls into `tp_clear` to free up the object’s references.

  4. When `tp_dealloc` finishes object destruction, it directly calls `tp_free` (usually set to `PyObject_Free()` or `PyObject_GC_Del()` automatically as appropriate for the type) to deallocate the memory.

- The `tp_finalize` function is permitted to add a reference to the object if desired. If it does, the object is *resurrected*, preventing its pending destruction. (Only `tp_finalize` is allowed to resurrect an object; `tp_clear` and `tp_dealloc` cannot without calling into `tp_finalize`.) Resurrecting an object may or may not cause the object’s *finalized* mark to be removed. Currently, Python does not remove the *finalized* mark from a resurrected object if it supports garbage collection (i.e., the `Py_TPFLAGS_HAVE_GC` flag is set) but does remove the mark if the object does not support garbage collection; either or both of these behaviors may change in the future.

- `tp_dealloc` can optionally call `tp_finalize` via `PyObject_CallFinalizerFromDealloc()` if it wishes to reuse that code to help with object destruction. This is recommended because it guarantees that `tp_finalize` is always called before destruction. See the `tp_dealloc` documentation for example code.

- If the object is a member of a cyclic isolate and either `tp_clear` fails to break the reference cycle or the cyclic isolate is not detected (perhaps `gc.disable()` was called, or the `Py_TPFLAGS_HAVE_GC` flag was erroneously omitted in one of the involved types), the objects remain indefinitely uncollectable (they “leak”). See `gc.garbage`.

If the object is marked as supporting garbage collection (the `Py_TPFLAGS_HAVE_GC` flag is set in `tp_flags`), the following events are also possible:

- The garbage collector occasionally calls `tp_traverse` to identify cyclic isolates.

- When the garbage collector discovers a cyclic isolate, it finalizes one of the objects in the group by marking it as *finalized* and calling its `tp_finalize` function, if it has one. This repeats until the cyclic isolate doesn’t exist or all of the objects have been finalized.

- `tp_finalize` is permitted to resurrect the object by adding a reference from outside the cyclic isolate. The new reference causes the group of objects to no longer form a cyclic isolate (the reference cycle may still exist, but if it does the objects are no longer isolated).

- When the garbage collector discovers a cyclic isolate and all of the objects in the group have already been marked as *finalized*, the garbage collector clears one or more of the uncleared objects in the group (possibly concurrently) by calling each’s `tp_clear` function. This repeats as long as the cyclic isolate still exists and not all of the objects have been cleared.

<!-- anchor: cyclic-isolate-destruction | type: section -->
## Cyclic Isolate Destruction

Listed below are the stages of life of a hypothetical cyclic isolate that continues to exist after each member object is finalized or cleared. It is a memory leak if a cyclic isolate progresses through all of these stages; it should vanish once all objects are cleared, if not sooner. A cyclic isolate can vanish either because the reference cycle is broken or because the objects are no longer isolated due to finalizer resurrection (see `tp_finalize`).

1. **Reachable** (not yet a cyclic isolate): All objects are in their normal, reachable state. A reference cycle could exist, but an external reference means the objects are not yet isolated.

2. **Unreachable but consistent:** The final reference from outside the cyclic group of objects has been removed, causing the objects to become isolated (thus a cyclic isolate is born). None of the group’s objects have been finalized or cleared yet. The cyclic isolate remains at this stage until some future run of the garbage collector (not necessarily the next run because the next run might not scan every object).

3. **Mix of finalized and not finalized:** Objects in a cyclic isolate are finalized one at a time, which means that there is a period of time when the cyclic isolate is composed of a mix of finalized and non-finalized objects. Finalization order is unspecified, so it can appear random. A finalized object must behave in a sane manner when non-finalized objects interact with it, and a non-finalized object must be able to tolerate the finalization of an arbitrary subset of its referents.

4. **All finalized:** All objects in a cyclic isolate are finalized before any of them are cleared.

5. **Mix of finalized and cleared:** The objects can be cleared serially or concurrently (but with the GIL held); either way, some will finish before others. A finalized object must be able to tolerate the clearing of a subset of its referents. **PEP 442** calls this stage “cyclic trash”.

6. **Leaked:** If a cyclic isolate still exists after all objects in the group have been finalized and cleared, then the objects remain indefinitely uncollectable (see `gc.garbage`). It is a bug if a cyclic isolate reaches this stage—it means the `tp_clear` methods of the participating objects have failed to break the reference cycle as required.

If `tp_clear` did not exist, then Python would have no way to safely break a reference cycle. Simply destroying an object in a cyclic isolate would result in a dangling pointer, triggering undefined behavior when an object referencing the destroyed object is itself destroyed. The clearing step makes object destruction a two-phase process: first `tp_clear` is called to partially destroy the objects enough to detangle them from each other, then `tp_dealloc` is called to complete the destruction.

Unlike clearing, finalization is not a phase of destruction. A finalized object must still behave properly by continuing to fulfill its design contracts. An object’s finalizer is allowed to execute arbitrary Python code, and is even allowed to prevent the impending destruction by adding a reference. The finalizer is only related to destruction by call order—if it runs, it runs before destruction, which starts with `tp_clear` (if called) and concludes with `tp_dealloc`.

The finalization step is not necessary to safely reclaim the objects in a cyclic isolate, but its existence makes it easier to design types that behave in a sane manner when objects are cleared. Clearing an object might necessarily leave it in a broken, partially destroyed state—it might be unsafe to call any of the cleared object’s methods or access any of its attributes. With finalization, only finalized objects can possibly interact with cleared objects; non-finalized objects are guaranteed to interact with only non-cleared (but potentially finalized) objects.

To summarize the possible interactions:

- A non-finalized object might have references to or from non-finalized and finalized objects, but not to or from cleared objects.

- A finalized object might have references to or from non-finalized, finalized, and cleared objects.

- A cleared object might have references to or from finalized and cleared objects, but not to or from non-finalized objects.

Without any reference cycles, an object can be simply destroyed once its last reference is deleted; the finalization and clearing steps are not necessary to safely reclaim unused objects. However, it can be useful to automatically call `tp_finalize` and `tp_clear` before destruction anyway because type design is simplified when all objects always experience the same series of events regardless of whether they participated in a cyclic isolate. Python currently only calls `tp_finalize` and `tp_clear` as needed to destroy a cyclic isolate; this may change in a future version.

<!-- anchor: functions | type: section -->
## Functions

To allocate and free memory, see Allocating objects on the heap.

<!-- anchor: c.PyObject_CallFinalizer | type: c function -->
### `void PyObject_CallFinalizer(PyObject *op)`

Finalizes the object as described in `tp_finalize`. Call this function (or `PyObject_CallFinalizerFromDealloc()`) instead of calling `tp_finalize` directly because this function may deduplicate multiple calls to `tp_finalize`. Currently, calls are only deduplicated if the type supports garbage collection (i.e., the `Py_TPFLAGS_HAVE_GC` flag is set); this may change in the future.

Added in version 3.4.

<!-- anchor: c.PyObject_CallFinalizerFromDealloc | type: c function -->
### `int PyObject_CallFinalizerFromDealloc(PyObject *op)`

*Part of the Stable ABI since version 3.15.*

Same as `PyObject_CallFinalizer()` but meant to be called at the beginning of the object’s destructor (`tp_dealloc`). There must not be any references to the object. If the object’s finalizer resurrects the object, this function returns -1; no further destruction should happen. Otherwise, this function returns 0 and destruction can continue normally.

Added in version 3.4.

**See also:**

`tp_dealloc` for example code.
