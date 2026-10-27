---
page: c-api/objimpl.html
title: Object Implementation Support
area: c-api
kind: guide
---

<!-- anchor: object-implementation-support | type: section -->
# Object Implementation Support

This chapter describes the functions, types, and macros used when defining new object types.

- Allocating objects on the heap

  - Soft-deprecated aliases

- Object Life Cycle

  - Life Events

  - Cyclic Isolate Destruction

  - Functions

- Common Object Structures

  - Base object types and macros

  - Implementing functions and methods

  - Accessing attributes of extension types

    - Member flags

    - Member types

    - Defining Getters and Setters

- Type Object Structures

  - Quick Reference

    - “tp slots”

    - sub-slots

    - slot typedefs

  - PyTypeObject Definition

  - PyObject Slots

  - PyVarObject Slots

  - PyTypeObject Slots

  - Static Types

  - Heap Types

  - Number Object Structures

  - Mapping Object Structures

  - Sequence Object Structures

  - Buffer Object Structures

  - Async Object Structures

  - Slot Type typedefs

  - Examples

- Supporting Cyclic Garbage Collection

  - Traversal

    - Traversal-safe functions

    - “DuringGC” functions

  - Controlling the Garbage Collector State

  - Querying Garbage Collector State
