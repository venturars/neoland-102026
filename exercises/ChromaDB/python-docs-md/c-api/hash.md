---
page: c-api/hash.html
title: PyHash API
area: c-api
kind: guide
---

<!-- anchor: pyhash-api | type: section -->
# PyHash API

See also the `PyTypeObject.tp_hash` member and Hashing of numeric types.

<!-- anchor: c.Py_hash_t | type: c type -->
## `type Py_hash_t`

Hash value type: signed integer.

Added in version 3.2.

<!-- anchor: c.Py_uhash_t | type: c type -->
## `type Py_uhash_t`

Hash value type: unsigned integer.

Added in version 3.2.

<!-- anchor: c.Py_HASH_ALGORITHM | type: c macro -->
## `Py_HASH_ALGORITHM`

A numerical value indicating the algorithm for hashing of `str`, `bytes`, and `memoryview`.

The algorithm name is exposed by `sys.hash_info.algorithm`.

Added in version 3.4.

<!-- anchor: c.Py_HASH_FNV | type: c macro -->
## `Py_HASH_FNV`

`Py_HASH_SIPHASH24`

`Py_HASH_SIPHASH13`

Numerical values to compare to `Py_HASH_ALGORITHM` to determine which algorithm is used for hashing. The hash algorithm can be configured via the configure `--with-hash-algorithm` option.

Added in version 3.4: Add `Py_HASH_FNV` and `Py_HASH_SIPHASH24`.

Added in version 3.11: Add `Py_HASH_SIPHASH13`.

<!-- anchor: c.Py_HASH_CUTOFF | type: c macro -->
## `Py_HASH_CUTOFF`

Buffers of length in range `[1, Py_HASH_CUTOFF)` are hashed using DJBX33A instead of the algorithm described by `Py_HASH_ALGORITHM`.

- A `Py_HASH_CUTOFF` of 0 disables the optimization.

- `Py_HASH_CUTOFF` must be non-negative and less or equal than 7.

32-bit platforms should use a cutoff smaller than 64-bit platforms because it is easier to create colliding strings. A cutoff of 7 on 64-bit platforms and 5 on 32-bit platforms should provide a decent safety margin.

This corresponds to the `sys.hash_info.cutoff` constant.

Added in version 3.4.

<!-- anchor: c.PyHASH_MODULUS | type: c macro -->
## `PyHASH_MODULUS`

The Mersenne prime `P = 2**n -1`, used for numeric hash scheme.

This corresponds to the `sys.hash_info.modulus` constant.

Added in version 3.13.

<!-- anchor: c.PyHASH_BITS | type: c macro -->
## `PyHASH_BITS`

The exponent `n` of `P` in `PyHASH_MODULUS`.

Added in version 3.13.

<!-- anchor: c.PyHASH_MULTIPLIER | type: c macro -->
## `PyHASH_MULTIPLIER`

Prime multiplier used in string and various other hashes.

Added in version 3.13.

<!-- anchor: c.PyHASH_INF | type: c macro -->
## `PyHASH_INF`

The hash value returned for a positive infinity.

This corresponds to the `sys.hash_info.inf` constant.

Added in version 3.13.

<!-- anchor: c.PyHASH_IMAG | type: c macro -->
## `PyHASH_IMAG`

The multiplier used for the imaginary part of a complex number.

This corresponds to the `sys.hash_info.imag` constant.

Added in version 3.13.

<!-- anchor: c.PyHash_FuncDef | type: c type -->
## `type PyHash_FuncDef`

Hash function definition used by `PyHash_GetFuncDef()`.

<!-- anchor: c.PyHash_FuncDef.hash | type: c member -->
### `Py_hash_t (*const hash)(const void*, Py_ssize_t)`

Hash function.

<!-- anchor: c.PyHash_FuncDef.name | type: c member -->
### `const char *name`

Hash function name (UTF-8 encoded string).

This corresponds to the `sys.hash_info.algorithm` constant.

<!-- anchor: c.PyHash_FuncDef.hash_bits | type: c member -->
### `const int hash_bits`

Internal size of the hash value in bits.

This corresponds to the `sys.hash_info.hash_bits` constant.

<!-- anchor: c.PyHash_FuncDef.seed_bits | type: c member -->
### `const int seed_bits`

Size of seed input in bits.

This corresponds to the `sys.hash_info.seed_bits` constant.

Added in version 3.4.

<!-- anchor: c.PyHash_GetFuncDef | type: c function -->
## `PyHash_FuncDef *PyHash_GetFuncDef(void)`

Get the hash function definition.

**See also:**

**PEP 456** “Secure and interchangeable hash algorithm”.

Added in version 3.4.

<!-- anchor: c.Py_HashPointer | type: c function -->
## `Py_hash_t Py_HashPointer(const void *ptr)`

Hash a pointer value: process the pointer value as an integer (cast it to `uintptr_t` internally). The pointer is not dereferenced.

The function cannot fail: it cannot return `-1`.

Added in version 3.13.

<!-- anchor: c.Py_HashBuffer | type: c function -->
## `Py_hash_t Py_HashBuffer(const void *ptr, Py_ssize_t len)`

Compute and return the hash value of a buffer of *len* bytes starting at address *ptr*. The hash is guaranteed to match that of `bytes`, `memoryview`, and other built-in objects that implement the buffer protocol.

Use this function to implement hashing for immutable objects whose `tp_richcompare` function compares to another object’s buffer.

*len* must be greater than or equal to `0`.

This function always succeeds.

Added in version 3.14.

<!-- anchor: c.PyObject_GenericHash | type: c function -->
## `Py_hash_t PyObject_GenericHash(PyObject *obj)`

Generic hashing function that is meant to be put into a type object’s `tp_hash` slot. Its result only depends on the object’s identity.

**CPython implementation detail:** In CPython, it is equivalent to `Py_HashPointer()`.

Added in version 3.13.
