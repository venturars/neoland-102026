---
page: c-api/concrete.html
title: Concrete Objects Layer
area: c-api
kind: guide
---

<!-- anchor: concrete-objects-layer | type: section -->
# Concrete Objects Layer

The functions in this chapter are specific to certain Python object types. Passing them an object of the wrong type is not a good idea; if you receive an object from a Python program and you are not sure that it has the right type, you must perform a type check first; for example, to check that an object is a dictionary, use `PyDict_Check()`. The chapter is structured like the “family tree” of Python object types.

**Warning:**

While the functions described in this chapter carefully check the type of the objects which are passed in, many of them do not check for `NULL` being passed instead of a valid object. Allowing `NULL` to be passed in can cause memory access violations and immediate termination of the interpreter.

<!-- anchor: fundamental-objects | type: section -->
## Fundamental Objects

This section describes Python type objects and the singleton object `None`.

- Type Objects

  - Creating Heap-Allocated Types

    - Type slot IDs

  - Soft-deprecated API

- The `None` Object

<!-- anchor: numeric-objects | type: section -->
## Numeric Objects

- Integer Objects

  - Export API

  - PyLongWriter API

  - Deprecated API

- Boolean Objects

- Floating-Point Objects

  - Pack and Unpack functions

    - Pack functions

    - Unpack functions

- Complex Number Objects

  - Complex Numbers as C Structures

<!-- anchor: sequence-objects | type: section -->
## Sequence Objects

Generic operations on sequence objects were discussed in the previous chapter; this section deals with the specific kinds of sequence objects that are intrinsic to the Python language.

- Bytes Objects

- PyBytesWriter

  - Create, Finish, Discard

  - High-level API

  - Getters

  - Low-level API

  - Example creating the string `b'abc'`

  - Update `PyBytes_FromStringAndSize()` code

  - Update `_PyBytes_Resize()` code

- Byte Array Objects

  - Type check macros

  - Direct API functions

  - Macros

- Unicode Objects and Codecs

  - Unicode Objects

    - Unicode Type

    - Unicode Character Properties

    - Creating and accessing Unicode strings

    - Locale Encoding

    - File System Encoding

    - wchar_t Support

  - Built-in Codecs

    - Generic Codecs

    - UTF-8 Codecs

    - UTF-32 Codecs

    - UTF-16 Codecs

    - UTF-7 Codecs

    - Unicode-Escape Codecs

    - Raw-Unicode-Escape Codecs

    - Latin-1 Codecs

    - ASCII Codecs

    - Character Map Codecs

    - MBCS codecs for Windows

  - Methods and Slot Functions

  - PyUnicodeWriter

  - Deprecated API

- Tuple Objects

- Struct Sequence Objects

- List Objects

<!-- anchor: container-objects | type: section -->
## Container Objects

- Dictionary objects

  - Dictionary view objects

  - Frozen dictionary objects

  - Ordered dictionaries

- Set Objects

  - Deprecated API

<!-- anchor: function-objects | type: section -->
## Function Objects

- Function Objects

- Instance Method Objects

- Method Objects

- Cell Objects

- Code Objects

- Code Object Flags

- Extra information

<!-- anchor: other-objects | type: section -->
## Other Objects

- File objects

  - Soft-deprecated API

- Module Objects

  - Module definition

    - Metadata slots

    - Feature slots

    - Creation and initialization slots

  - Module state

    - Slots for defining module state

    - Module token

  - Creating extension modules dynamically

  - Module definition struct

  - Support functions

    - Module lookup (single-phase initialization)

- Iterator Objects

  - Range Objects

  - Builtin Iterator Types

  - Other Iterator Objects

- Descriptor Objects

  - Built-in descriptors

- Slice Objects

  - Ellipsis Object

- MemoryView objects

- Pickle buffer objects

- Weak Reference Objects

- Capsules

- Sentinel objects

- Frame objects

  - Frame locals proxies

  - Legacy local variable APIs

  - Internal frames

- Generator Objects

  - Asynchronous Generator Objects

  - Deprecated API

- Coroutine Objects

- Context Variables Objects

- Objects for Type Hinting

<!-- anchor: c-api-for-extension-modules | type: section -->
## C API for extension modules

- Curses C API

- Internal data

- DateTime Objects

- Internal data
