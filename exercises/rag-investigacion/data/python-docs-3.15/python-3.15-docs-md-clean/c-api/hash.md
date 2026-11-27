# PyHash API

See also the `PyTypeObject.tp_hash` member and Hashing of numeric types.

type Py\_hash\_t
:   Hash value type: signed integer.

type Py\_uhash\_t
:   Hash value type: unsigned integer.

Py\_HASH\_ALGORITHM
:   A numerical value indicating the algorithm for hashing of `str`,
    `bytes`, and `memoryview`.

    The algorithm name is exposed by `sys.hash_info.algorithm`.

Py\_HASH\_FNV

Py\_HASH\_SIPHASH24

Py\_HASH\_SIPHASH13

Py\_HASH\_EXTERNAL
:   Numerical values to compare to `Py_HASH_ALGORITHM` to determine
    which algorithm is used for hashing. The built-in hash algorithm can be
    configured via the configure `--with-hash-algorithm` option.

    `Py_HASH_EXTERNAL` has value `0` and indicates a hash
    implementation supplied by the application embedding Python; see
    `PyHash_Func`.

Py\_HASH\_CUTOFF
:   Buffers of length in range `[1, Py_HASH_CUTOFF)` are hashed using DJBX33A
    instead of the algorithm described by `Py_HASH_ALGORITHM`.

    - A `Py_HASH_CUTOFF` of 0 disables the optimization.
    - `Py_HASH_CUTOFF` must be non-negative and less or equal than 7.

    32-bit platforms should use a cutoff smaller than 64-bit platforms because
    it is easier to create colliding strings. A cutoff of 7 on 64-bit platforms
    and 5 on 32-bit platforms should provide a decent safety margin.

    This corresponds to the `sys.hash_info.cutoff` constant.

PyHASH\_MODULUS
:   The Mersenne prime `P = 2**n -1`,
    used for numeric hash scheme.

    This corresponds to the `sys.hash_info.modulus` constant.

PyHASH\_BITS
:   The exponent `n` of `P` in `PyHASH_MODULUS`.

PyHASH\_MULTIPLIER
:   Prime multiplier used in string and various other hashes.

PyHASH\_INF
:   The hash value returned for a positive infinity.

    This corresponds to the `sys.hash_info.inf` constant.

PyHASH\_IMAG
:   The multiplier used for the imaginary part of a complex number.

    This corresponds to the `sys.hash_info.imag` constant.

type PyHash\_FuncDef
:   Hash function definition used by `PyHash_GetFuncDef()`.

    Py\_hash\_t (\*const hash)(const void\*, Py\_ssize\_t)
    :   Hash function.

    const char \*name
    :   Hash function name (UTF-8 encoded string).

        This corresponds to the `sys.hash_info.algorithm` constant.

    const int hash\_bits
    :   Internal size of the hash value in bits.

        This corresponds to the `sys.hash_info.hash_bits` constant.

    const int seed\_bits
    :   Size of seed input in bits.

        This corresponds to the `sys.hash_info.seed_bits` constant.

PyHash\_FuncDef PyHash\_Func
:   When Python is built with `Py_HASH_ALGORITHM` set to
    `Py_HASH_EXTERNAL`, the application embedding Python must define
    this variable to supply a hash implementation instead of using one of
    Python’s built-in hash algorithms.

    Deprecated since version 3.15, will be removed in version 3.19: Use one of the built-in hash algorithms instead.

PyHash\_FuncDef \*PyHash\_GetFuncDef(void)
:   Get the hash function definition.

    See also

    **PEP 456** “Secure and interchangeable hash algorithm”.

Py\_hash\_t Py\_HashPointer(const void \*ptr)
:   Hash a pointer value: process the pointer value as an integer (cast it to
    `uintptr_t` internally). The pointer is not dereferenced.

    The function cannot fail: it cannot return `-1`.

Py\_hash\_t Py\_HashBuffer(const void \*ptr, Py\_ssize\_t len)
:   Compute and return the hash value of a buffer of *len* bytes
    starting at address *ptr*. The hash is guaranteed to match that of
    `bytes`, `memoryview`, and other built-in objects
    that implement the buffer protocol.

    Use this function to implement hashing for immutable objects whose
    `tp_richcompare` function compares to another
    object’s buffer.

    *len* must be greater than or equal to `0`.

    This function always succeeds.

Py\_hash\_t PyObject\_GenericHash(PyObject \*obj)
:   Generic hashing function that is meant to be put into a type
    object’s `tp_hash` slot.
    Its result only depends on the object’s identity.

    **CPython implementation detail:** In CPython, it is equivalent to `Py_HashPointer()`.
