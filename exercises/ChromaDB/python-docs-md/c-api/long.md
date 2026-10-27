---
page: c-api/long.html
title: Integer Objects
area: c-api
kind: guide
---

<!-- anchor: integer-objects | type: section -->
# Integer Objects

All integers are implemented as “long” integer objects of arbitrary size.

On error, most `PyLong_As*` APIs return `(return type)-1` which cannot be distinguished from a number. Use `PyErr_Occurred()` to disambiguate.

<!-- anchor: c.PyLongObject | type: c type -->
## `type PyLongObject`

*Part of the Stable ABI (as an opaque struct).*

This subtype of `PyObject` represents a Python integer object.

<!-- anchor: c.PyLong_Type | type: c var -->
## `PyTypeObject PyLong_Type`

*Part of the Stable ABI.*

This instance of `PyTypeObject` represents the Python integer type. This is the same object as `int` in the Python layer.

<!-- anchor: c.PyLong_Check | type: c function -->
## `int PyLong_Check(PyObject *p)`

Return true if its argument is a `PyLongObject` or a subtype of `PyLongObject`. This function always succeeds.

<!-- anchor: c.PyLong_CheckExact | type: c function -->
## `int PyLong_CheckExact(PyObject *p)`

Return true if its argument is a `PyLongObject`, but not a subtype of `PyLongObject`. This function always succeeds.

<!-- anchor: c.PyLong_FromLong | type: c function -->
## `PyObject *PyLong_FromLong(long v)`

*Return value: New reference.**Part of the Stable ABI.*

Return a new `PyLongObject` object from *v*, or `NULL` on failure.

**CPython implementation detail:** CPython keeps an array of integer objects for all integers between `-5` and `1024`. When you create an int in that range you actually just get back a reference to the existing object.

<!-- anchor: c.PyLong_FromUnsignedLong | type: c function -->
## `PyObject *PyLong_FromUnsignedLong(unsigned long v)`

*Return value: New reference.**Part of the Stable ABI.*

Return a new `PyLongObject` object from a C unsigned long, or `NULL` on failure.

<!-- anchor: c.PyLong_FromSsize_t | type: c function -->
## `PyObject *PyLong_FromSsize_t(Py_ssize_t v)`

*Return value: New reference.**Part of the Stable ABI.*

Return a new `PyLongObject` object from a C `Py_ssize_t`, or `NULL` on failure.

<!-- anchor: c.PyLong_FromSize_t | type: c function -->
## `PyObject *PyLong_FromSize_t(size_t v)`

*Return value: New reference.**Part of the Stable ABI.*

Return a new `PyLongObject` object from a C `size_t`, or `NULL` on failure.

<!-- anchor: c.PyLong_FromLongLong | type: c function -->
## `PyObject *PyLong_FromLongLong(long long v)`

*Return value: New reference.**Part of the Stable ABI.*

Return a new `PyLongObject` object from a C long long, or `NULL` on failure.

<!-- anchor: c.PyLong_FromUnsignedLongLong | type: c function -->
## `PyObject *PyLong_FromUnsignedLongLong(unsigned long long v)`

*Return value: New reference.**Part of the Stable ABI.*

Return a new `PyLongObject` object from a C unsigned long long, or `NULL` on failure.

<!-- anchor: c.PyLong_FromInt32 | type: c function -->
## `PyObject *PyLong_FromInt32(int32_t value)`

`PyObject *PyLong_FromInt64(int64_t value)`

*Part of the Stable ABI since version 3.14.*

Return a new `PyLongObject` object from a signed C int32_t or int64_t, or `NULL` with an exception set on failure.

Added in version 3.14.

<!-- anchor: c.PyLong_FromUInt32 | type: c function -->
## `PyObject *PyLong_FromUInt32(uint32_t value)`

`PyObject *PyLong_FromUInt64(uint64_t value)`

*Part of the Stable ABI since version 3.14.*

Return a new `PyLongObject` object from an unsigned C uint32_t or uint64_t, or `NULL` with an exception set on failure.

Added in version 3.14.

<!-- anchor: c.PyLong_FromDouble | type: c function -->
## `PyObject *PyLong_FromDouble(double v)`

*Return value: New reference.**Part of the Stable ABI.*

Return a new `PyLongObject` object from the integer part of *v*, or `NULL` on failure.

<!-- anchor: c.PyLong_FromString | type: c function -->
## `PyObject *PyLong_FromString(const char *str, char **pend, int base)`

*Return value: New reference.**Part of the Stable ABI.*

Return a new `PyLongObject` based on the string value in *str*, which is interpreted according to the radix in *base*, or `NULL` on failure. If *pend* is non-`NULL`, **pend* will point to the end of *str* on success or to the first character that could not be processed on error. If *base* is `0`, *str* is interpreted using the Integer literals definition; in this case, leading zeros in a non-zero decimal number raises a `ValueError`. If *base* is not `0`, it must be between `2` and `36`, inclusive. Leading and trailing whitespace and single underscores after a base specifier and between digits are ignored. If there are no digits or *str* is not NULL-terminated following the digits and trailing whitespace, `ValueError` will be raised.

**See also:**

`PyLong_AsNativeBytes()` and `PyLong_FromNativeBytes()` functions can be used to convert a `PyLongObject` to/from an array of bytes in base `256`.

<!-- anchor: c.PyLong_FromUnicodeObject | type: c function -->
## `PyObject *PyLong_FromUnicodeObject(PyObject *u, int base)`

*Return value: New reference.*

Convert a sequence of Unicode digits in the string *u* to a Python integer value.

Added in version 3.3.

<!-- anchor: c.PyLong_FromVoidPtr | type: c function -->
## `PyObject *PyLong_FromVoidPtr(void *p)`

*Return value: New reference.**Part of the Stable ABI.*

Create a Python integer from the pointer *p*. The pointer value can be retrieved from the resulting value using `PyLong_AsVoidPtr()`.

<!-- anchor: c.PyLong_FromNativeBytes | type: c function -->
## `PyObject *PyLong_FromNativeBytes(const void *buffer, size_t n_bytes, int flags)`

*Part of the Stable ABI since version 3.14.*

Create a Python integer from the value contained in the first *n_bytes* of *buffer*, interpreted as a two’s-complement signed number.

*flags* are as for `PyLong_AsNativeBytes()`. Passing `-1` will select the native endian that CPython was compiled with and assume that the most-significant bit is a sign bit. Passing `Py_ASNATIVEBYTES_UNSIGNED_BUFFER` will produce the same result as calling `PyLong_FromUnsignedNativeBytes()`. Other flags are ignored.

Added in version 3.13.

<!-- anchor: c.PyLong_FromUnsignedNativeBytes | type: c function -->
## `PyObject *PyLong_FromUnsignedNativeBytes(const void *buffer, size_t n_bytes, int flags)`

*Part of the Stable ABI since version 3.14.*

Create a Python integer from the value contained in the first *n_bytes* of *buffer*, interpreted as an unsigned number.

*flags* are as for `PyLong_AsNativeBytes()`. Passing `-1` will select the native endian that CPython was compiled with and assume that the most-significant bit is not a sign bit. Flags other than endian are ignored.

Added in version 3.13.

<!-- anchor: c.PyLong_FromPid | type: c macro -->
## `PyLong_FromPid(pid)`

Macro for creating a Python integer from a process identifier.

This can be defined as an alias to `PyLong_FromLong()` or `PyLong_FromLongLong()`, depending on the size of the system’s PID type.

Added in version 3.2.

<!-- anchor: c.PyLong_AsLong | type: c function -->
## `long PyLong_AsLong(PyObject *obj)`

*Part of the Stable ABI.*

Return a C long representation of *obj*. If *obj* is not an instance of `PyLongObject`, first call its `__index__()` method (if present) to convert it to a `PyLongObject`.

Raise `OverflowError` if the value of *obj* is out of range for a long.

Returns `-1` on error. Use `PyErr_Occurred()` to disambiguate.

Changed in version 3.8: Use `__index__()` if available.

Changed in version 3.10: This function will no longer use `__int__()`.

<!-- anchor: c.PyLong_AS_LONG | type: c function -->
### `long PyLong_AS_LONG(PyObject *obj)`

Exactly equivalent to the preferred `PyLong_AsLong`. In particular, it can fail with `OverflowError` or another exception.

Soft deprecated since version 3.14.

<!-- anchor: c.PyLong_AsInt | type: c function -->
## `int PyLong_AsInt(PyObject *obj)`

*Part of the Stable ABI since version 3.13.*

Similar to `PyLong_AsLong()`, but store the result in a C int instead of a C long.

Added in version 3.13.

<!-- anchor: c.PyLong_AsLongAndOverflow | type: c function -->
## `long PyLong_AsLongAndOverflow(PyObject *obj, int *overflow)`

*Part of the Stable ABI.*

Return a C long representation of *obj*. If *obj* is not an instance of `PyLongObject`, first call its `__index__()` method (if present) to convert it to a `PyLongObject`.

If the value of *obj* is greater than `LONG_MAX` or less than `LONG_MIN`, set **overflow* to `1` or `-1`, respectively, and return `-1`; otherwise, set **overflow* to `0`. If any other exception occurs set **overflow* to `0` and return `-1` as usual.

Returns `-1` on error. Use `PyErr_Occurred()` to disambiguate.

Changed in version 3.8: Use `__index__()` if available.

Changed in version 3.10: This function will no longer use `__int__()`.

<!-- anchor: c.PyLong_AsLongLong | type: c function -->
## `long long PyLong_AsLongLong(PyObject *obj)`

*Part of the Stable ABI.*

Return a C long long representation of *obj*. If *obj* is not an instance of `PyLongObject`, first call its `__index__()` method (if present) to convert it to a `PyLongObject`.

Raise `OverflowError` if the value of *obj* is out of range for a long long.

Returns `-1` on error. Use `PyErr_Occurred()` to disambiguate.

Changed in version 3.8: Use `__index__()` if available.

Changed in version 3.10: This function will no longer use `__int__()`.

<!-- anchor: c.PyLong_AsLongLongAndOverflow | type: c function -->
## `long long PyLong_AsLongLongAndOverflow(PyObject *obj, int *overflow)`

*Part of the Stable ABI.*

Return a C long long representation of *obj*. If *obj* is not an instance of `PyLongObject`, first call its `__index__()` method (if present) to convert it to a `PyLongObject`.

If the value of *obj* is greater than `LLONG_MAX` or less than `LLONG_MIN`, set **overflow* to `1` or `-1`, respectively, and return `-1`; otherwise, set **overflow* to `0`. If any other exception occurs set **overflow* to `0` and return `-1` as usual.

Returns `-1` on error. Use `PyErr_Occurred()` to disambiguate.

Added in version 3.2.

Changed in version 3.8: Use `__index__()` if available.

Changed in version 3.10: This function will no longer use `__int__()`.

<!-- anchor: c.PyLong_AsSsize_t | type: c function -->
## `Py_ssize_t PyLong_AsSsize_t(PyObject *pylong)`

*Part of the Stable ABI.*

Return a C `Py_ssize_t` representation of *pylong*. *pylong* must be an instance of `PyLongObject`.

Raise `OverflowError` if the value of *pylong* is out of range for a `Py_ssize_t`.

Returns `-1` on error. Use `PyErr_Occurred()` to disambiguate.

<!-- anchor: c.PyLong_AsUnsignedLong | type: c function -->
## `unsigned long PyLong_AsUnsignedLong(PyObject *pylong)`

*Part of the Stable ABI.*

Return a C unsigned long representation of *pylong*. *pylong* must be an instance of `PyLongObject`.

Raise `OverflowError` if the value of *pylong* is out of range for a unsigned long.

Returns `(unsigned long)-1` on error. Use `PyErr_Occurred()` to disambiguate.

<!-- anchor: c.PyLong_AsSize_t | type: c function -->
## `size_t PyLong_AsSize_t(PyObject *pylong)`

*Part of the Stable ABI.*

Return a C `size_t` representation of *pylong*. *pylong* must be an instance of `PyLongObject`.

Raise `OverflowError` if the value of *pylong* is out of range for a `size_t`.

Returns `(size_t)-1` on error. Use `PyErr_Occurred()` to disambiguate.

<!-- anchor: c.PyLong_AsUnsignedLongLong | type: c function -->
## `unsigned long long PyLong_AsUnsignedLongLong(PyObject *pylong)`

*Part of the Stable ABI.*

Return a C unsigned long long representation of *pylong*. *pylong* must be an instance of `PyLongObject`.

Raise `OverflowError` if the value of *pylong* is out of range for an unsigned long long.

Returns `(unsigned long long)-1` on error. Use `PyErr_Occurred()` to disambiguate.

Changed in version 3.1: A negative *pylong* now raises `OverflowError`, not `TypeError`.

<!-- anchor: c.PyLong_AsUnsignedLongMask | type: c function -->
## `unsigned long PyLong_AsUnsignedLongMask(PyObject *obj)`

*Part of the Stable ABI.*

Return a C unsigned long representation of *obj*. If *obj* is not an instance of `PyLongObject`, first call its `__index__()` method (if present) to convert it to a `PyLongObject`.

If the value of *obj* is out of range for an unsigned long, return the reduction of that value modulo `ULONG_MAX + 1`.

Returns `(unsigned long)-1` on error. Use `PyErr_Occurred()` to disambiguate.

Changed in version 3.8: Use `__index__()` if available.

Changed in version 3.10: This function will no longer use `__int__()`.

<!-- anchor: c.PyLong_AsUnsignedLongLongMask | type: c function -->
## `unsigned long long PyLong_AsUnsignedLongLongMask(PyObject *obj)`

*Part of the Stable ABI.*

Return a C unsigned long long representation of *obj*. If *obj* is not an instance of `PyLongObject`, first call its `__index__()` method (if present) to convert it to a `PyLongObject`.

If the value of *obj* is out of range for an unsigned long long, return the reduction of that value modulo `ULLONG_MAX + 1`.

Returns `(unsigned long long)-1` on error. Use `PyErr_Occurred()` to disambiguate.

Changed in version 3.8: Use `__index__()` if available.

Changed in version 3.10: This function will no longer use `__int__()`.

<!-- anchor: c.PyLong_AsInt32 | type: c function -->
## `int PyLong_AsInt32(PyObject *obj, int32_t *value)`

`int PyLong_AsInt64(PyObject *obj, int64_t *value)`

*Part of the Stable ABI since version 3.14.*

Set **value* to a signed C int32_t or int64_t representation of *obj*.

If *obj* is not an instance of `PyLongObject`, first call its `__index__()` method (if present) to convert it to a `PyLongObject`.

If the *obj* value is out of range, raise an `OverflowError`.

Set **value* and return `0` on success. Set an exception and return `-1` on error.

*value* must not be `NULL`.

Added in version 3.14.

<!-- anchor: c.PyLong_AsUInt32 | type: c function -->
## `int PyLong_AsUInt32(PyObject *obj, uint32_t *value)`

`int PyLong_AsUInt64(PyObject *obj, uint64_t *value)`

*Part of the Stable ABI since version 3.14.*

Set **value* to an unsigned C uint32_t or uint64_t representation of *obj*.

If *obj* is not an instance of `PyLongObject`, first call its `__index__()` method (if present) to convert it to a `PyLongObject`.

- If *obj* is negative, raise a `ValueError`.

- If the *obj* value is out of range, raise an `OverflowError`.

Set **value* and return `0` on success. Set an exception and return `-1` on error.

*value* must not be `NULL`.

Added in version 3.14.

<!-- anchor: c.PyLong_AsDouble | type: c function -->
## `double PyLong_AsDouble(PyObject *pylong)`

*Part of the Stable ABI.*

Return a C double representation of *pylong*. *pylong* must be an instance of `PyLongObject`.

Raise `OverflowError` if the value of *pylong* is out of range for a double.

Returns `-1.0` on error. Use `PyErr_Occurred()` to disambiguate.

<!-- anchor: c.PyLong_AsVoidPtr | type: c function -->
## `void *PyLong_AsVoidPtr(PyObject *pylong)`

*Part of the Stable ABI.*

Convert a Python integer *pylong* to a C void pointer. If *pylong* cannot be converted, an `OverflowError` will be raised. This is only assured to produce a usable void pointer for values created with `PyLong_FromVoidPtr()`.

Returns `NULL` on error. Use `PyErr_Occurred()` to disambiguate.

<!-- anchor: c.PyLong_AsNativeBytes | type: c function -->
## `Py_ssize_t PyLong_AsNativeBytes(PyObject *pylong, void *buffer, Py_ssize_t n_bytes, int flags)`

*Part of the Stable ABI since version 3.14.*

Copy the Python integer value *pylong* to a native *buffer* of size *n_bytes*. The *flags* can be set to `-1` to behave similarly to a C cast, or to values documented below to control the behavior.

Returns `-1` with an exception raised on error. This may happen if *pylong* cannot be interpreted as an integer, or if *pylong* was negative and the `Py_ASNATIVEBYTES_REJECT_NEGATIVE` flag was set.

Otherwise, returns the number of bytes required to store the value. If this is equal to or less than *n_bytes*, the entire value was copied. All *n_bytes* of the buffer are written: remaining bytes filled by copies of the sign bit.

If the returned value is greater than *n_bytes*, the value was truncated: as many of the lowest bits of the value as could fit are written, and the higher bits are ignored. This matches the typical behavior of a C-style downcast.

**Note:**

Overflow is not considered an error. If the returned value is larger than *n_bytes*, most significant bits were discarded.

`0` will never be returned.

Values are always copied as two’s-complement.

Usage example:

```c
int32_t value;
Py_ssize_t bytes = PyLong_AsNativeBytes(pylong, &value, sizeof(value), -1);
if (bytes < 0) {
    // Failed. A Python exception was set with the reason.
    return NULL;
}
else if (bytes <= (Py_ssize_t)sizeof(value)) {
    // Success!
}
else {
    // Overflow occurred, but 'value' contains the truncated
    // lowest bits of pylong.
}
```

Passing zero to *n_bytes* will return the size of a buffer that would be large enough to hold the value. This may be larger than technically necessary, but not unreasonably so. If *n_bytes=0*, *buffer* may be `NULL`.

**Note:**

Passing *n_bytes=0* to this function is not an accurate way to determine the bit length of the value.

To get at the entire Python value of an unknown size, the function can be called twice: first to determine the buffer size, then to fill it:

```c
// Ask how much space we need.
Py_ssize_t expected = PyLong_AsNativeBytes(pylong, NULL, 0, -1);
if (expected < 0) {
    // Failed. A Python exception was set with the reason.
    return NULL;
}
assert(expected != 0);  // Impossible per the API definition.
uint8_t *bignum = malloc(expected);
if (!bignum) {
    PyErr_SetString(PyExc_MemoryError, "bignum malloc failed.");
    return NULL;
}
// Safely get the entire value.
Py_ssize_t bytes = PyLong_AsNativeBytes(pylong, bignum, expected, -1);
if (bytes < 0) {  // Exception has been set.
    free(bignum);
    return NULL;
}
else if (bytes > expected) {  // This should not be possible.
    PyErr_SetString(PyExc_RuntimeError,
        "Unexpected bignum truncation after a size check.");
    free(bignum);
    return NULL;
}
// The expected success given the above pre-check.
// ... use bignum ...
free(bignum);
```

*flags* is either `-1` (`Py_ASNATIVEBYTES_DEFAULTS`) to select defaults that behave most like a C cast, or a combination of the other flags in the table below. Note that `-1` cannot be combined with other flags.

Currently, `-1` corresponds to `Py_ASNATIVEBYTES_NATIVE_ENDIAN | Py_ASNATIVEBYTES_UNSIGNED_BUFFER`.

| Flag | Value |
| --- | --- |
| `Py_ASNATIVEBYTES_DEFAULTS` *Part of the Stable ABI since version 3.14.* | `-1` |
| `Py_ASNATIVEBYTES_BIG_ENDIAN` *Part of the Stable ABI since version 3.14.* | `0` |
| `Py_ASNATIVEBYTES_LITTLE_ENDIAN` *Part of the Stable ABI since version 3.14.* | `1` |
| `Py_ASNATIVEBYTES_NATIVE_ENDIAN` *Part of the Stable ABI since version 3.14.* | `3` |
| `Py_ASNATIVEBYTES_UNSIGNED_BUFFER` *Part of the Stable ABI since version 3.14.* | `4` |
| `Py_ASNATIVEBYTES_REJECT_NEGATIVE` *Part of the Stable ABI since version 3.14.* | `8` |
| `Py_ASNATIVEBYTES_ALLOW_INDEX` *Part of the Stable ABI since version 3.14.* | `16` |

Specifying `Py_ASNATIVEBYTES_NATIVE_ENDIAN` will override any other endian flags. Passing `2` is reserved.

By default, sufficient buffer will be requested to include a sign bit. For example, when converting 128 with *n_bytes=1*, the function will return 2 (or more) in order to store a zero sign bit.

If `Py_ASNATIVEBYTES_UNSIGNED_BUFFER` is specified, a zero sign bit will be omitted from size calculations. This allows, for example, 128 to fit in a single-byte buffer. If the destination buffer is later treated as signed, a positive input value may become negative. Note that the flag does not affect handling of negative values: for those, space for a sign bit is always requested.

Specifying `Py_ASNATIVEBYTES_REJECT_NEGATIVE` causes an exception to be set if *pylong* is negative. Without this flag, negative values will be copied provided there is enough space for at least one sign bit, regardless of whether `Py_ASNATIVEBYTES_UNSIGNED_BUFFER` was specified.

If `Py_ASNATIVEBYTES_ALLOW_INDEX` is specified and a non-integer value is passed, its `__index__()` method will be called first. This may result in Python code executing and other threads being allowed to run, which could cause changes to other objects or values in use. When *flags* is `-1`, this option is not set, and non-integer values will raise `TypeError`.

**Note:**

With the default *flags* (`-1`, or *UNSIGNED_BUFFER* without *REJECT_NEGATIVE*), multiple Python integers can map to a single value without overflow. For example, both `255` and `-1` fit a single-byte buffer and set all its bits. This matches typical C cast behavior.

Added in version 3.13.

<!-- anchor: c.PyLong_AsPid | type: c macro -->
## `PyLong_AsPid(pid)`

Macro for converting a Python integer into a process identifier.

This can be defined as an alias to `PyLong_AsLong()`, `PyLong_FromLongLong()`, or `PyLong_AsInt()`, depending on the size of the system’s PID type.

Added in version 3.2.

<!-- anchor: c.PyLong_GetSign | type: c function -->
## `int PyLong_GetSign(PyObject *obj, int *sign)`

Get the sign of the integer object *obj*.

On success, set **sign* to the integer sign (0, -1 or +1 for zero, negative or positive integer, respectively) and return 0.

On failure, return -1 with an exception set. This function always succeeds if *obj* is a `PyLongObject` or its subtype.

Added in version 3.14.

<!-- anchor: c.PyLong_IsPositive | type: c function -->
## `int PyLong_IsPositive(PyObject *obj)`

Check if the integer object *obj* is positive (`obj > 0`).

If *obj* is an instance of `PyLongObject` or its subtype, return `1` when it’s positive and `0` otherwise. Else set an exception and return `-1`.

Added in version 3.14.

<!-- anchor: c.PyLong_IsNegative | type: c function -->
## `int PyLong_IsNegative(PyObject *obj)`

Check if the integer object *obj* is negative (`obj < 0`).

If *obj* is an instance of `PyLongObject` or its subtype, return `1` when it’s negative and `0` otherwise. Else set an exception and return `-1`.

Added in version 3.14.

<!-- anchor: c.PyLong_IsZero | type: c function -->
## `int PyLong_IsZero(PyObject *obj)`

Check if the integer object *obj* is zero.

If *obj* is an instance of `PyLongObject` or its subtype, return `1` when it’s zero and `0` otherwise. Else set an exception and return `-1`.

Added in version 3.14.

<!-- anchor: c.PyLong_GetInfo | type: c function -->
## `PyObject *PyLong_GetInfo(void)`

*Part of the Stable ABI.*

On success, return a read only named tuple, that holds information about Python’s internal representation of integers. See `sys.int_info` for description of individual fields.

On failure, return `NULL` with an exception set.

Added in version 3.1.

<!-- anchor: c.PyUnstable_Long_IsCompact | type: c function -->
## `int PyUnstable_Long_IsCompact(const PyLongObject *op)`

*This is Unstable API. It may change without warning in minor releases.*

Return 1 if *op* is compact, 0 otherwise.

This function makes it possible for performance-critical code to implement a “fast path” for small integers. For compact values use `PyUnstable_Long_CompactValue()`; for others fall back to a `PyLong_As*` function or `PyLong_AsNativeBytes()`.

The speedup is expected to be negligible for most users.

Exactly what values are considered compact is an implementation detail and is subject to change.

Added in version 3.12.

<!-- anchor: c.PyUnstable_Long_CompactValue | type: c function -->
## `Py_ssize_t PyUnstable_Long_CompactValue(const PyLongObject *op)`

*This is Unstable API. It may change without warning in minor releases.*

If *op* is compact, as determined by `PyUnstable_Long_IsCompact()`, return its value.

Otherwise, the return value is undefined.

Added in version 3.12.

<!-- anchor: export-api | type: section -->
## Export API

Added in version 3.14.

<!-- anchor: c.PyLongLayout | type: c type -->
### `type PyLongLayout`

*Part of the Stable ABI (including all members) since version 3.15.*

Layout of an array of “digits” (“limbs” in the GMP terminology), used to represent absolute value for arbitrary precision integers.

Use `PyLong_GetNativeLayout()` to get the native layout of Python `int` objects, used internally for integers with “big enough” absolute value.

See also `sys.int_info` which exposes similar information in Python.

<!-- anchor: c.PyLongLayout.bits_per_digit | type: c member -->
#### `uint8_t bits_per_digit`

Bits per digit. For example, a 15 bit digit means that bits 0-14 contain meaningful information.

<!-- anchor: c.PyLongLayout.digit_size | type: c member -->
#### `uint8_t digit_size`

Digit size in bytes. For example, a 15 bit digit will require at least 2 bytes.

<!-- anchor: c.PyLongLayout.digits_order | type: c member -->
#### `int8_t digits_order`

Digits order:

- `1` for most significant digit first

- `-1` for least significant digit first

<!-- anchor: c.PyLongLayout.digit_endianness | type: c member -->
#### `int8_t digit_endianness`

Digit endianness:

- `1` for most significant byte first (big endian)

- `-1` for least significant byte first (little endian)

<!-- anchor: c.PyLong_GetNativeLayout | type: c function -->
### `const PyLongLayout *PyLong_GetNativeLayout(void)`

*Part of the Stable ABI since version 3.15.*

Get the native layout of Python `int` objects.

See the `PyLongLayout` structure.

The function must not be called before Python initialization nor after Python finalization. The returned layout is valid until Python is finalized. The layout is the same for all Python sub-interpreters in a process, and so it can be cached.

<!-- anchor: c.PyLongExport | type: c type -->
### `type PyLongExport`

*Part of the Stable ABI (including all members) since version 3.15.*

Export of a Python `int` object.

There are two cases:

- If `digits` is `NULL`, only use the `value` member.

- If `digits` is not `NULL`, use `negative`, `ndigits` and `digits` members.

<!-- anchor: c.PyLongExport.value | type: c member -->
#### `int64_t value`

The native integer value of the exported `int` object. Only valid if `digits` is `NULL`.

<!-- anchor: c.PyLongExport.negative | type: c member -->
#### `uint8_t negative`

`1` if the number is negative, `0` otherwise. Only valid if `digits` is not `NULL`.

<!-- anchor: c.PyLongExport.ndigits | type: c member -->
#### `Py_ssize_t ndigits`

Number of digits in `digits` array. Only valid if `digits` is not `NULL`.

<!-- anchor: c.PyLongExport.digits | type: c member -->
#### `const void *digits`

Read-only array of unsigned digits. Can be `NULL`.

<!-- anchor: c.PyLong_Export | type: c function -->
### `int PyLong_Export(PyObject *obj, PyLongExport *export_long)`

*Part of the Stable ABI since version 3.15.*

Export a Python `int` object.

*export_long* must point to a `PyLongExport` structure allocated by the caller. It must not be `NULL`.

On success, fill in **export_long* and return `0`. On error, set an exception and return `-1`.

`PyLong_FreeExport()` must be called when the export is no longer needed.

**CPython implementation detail:** This function always succeeds if *obj* is a Python `int` object or a subclass.

<!-- anchor: c.PyLong_FreeExport | type: c function -->
### `void PyLong_FreeExport(PyLongExport *export_long)`

*Part of the Stable ABI since version 3.15.*

Release the export *export_long* created by `PyLong_Export()`.

**CPython implementation detail:** Calling `PyLong_FreeExport()` is optional if *export_long->digits* is `NULL`.

<!-- anchor: pylongwriter-api | type: section -->
## PyLongWriter API

The `PyLongWriter` API can be used to import an integer.

Added in version 3.14.

<!-- anchor: c.PyLongWriter | type: c type -->
### `type PyLongWriter`

*Part of the Stable ABI (as an opaque struct) since version 3.15.*

A Python `int` writer instance.

The instance must be destroyed by `PyLongWriter_Finish()` or `PyLongWriter_Discard()`.

<!-- anchor: c.PyLongWriter_Create | type: c function -->
### `PyLongWriter *PyLongWriter_Create(int negative, Py_ssize_t ndigits, void **digits)`

*Part of the Stable ABI since version 3.15.*

Create a `PyLongWriter`.

On success, allocate **digits* and return a writer. On error, set an exception and return `NULL`.

*negative* is `1` if the number is negative, or `0` otherwise.

*ndigits* is the number of digits in the *digits* array. It must be greater than 0.

*digits* must not be NULL.

After a successful call to this function, the caller should fill in the array of digits *digits* and then call `PyLongWriter_Finish()` to get a Python `int`. The layout of *digits* is described by `PyLong_GetNativeLayout()`.

Digits must be in the range [`0`; `(1 << bits_per_digit) - 1`] (where the `bits_per_digit` is the number of bits per digit). Any unused most significant digits must be set to `0`.

Alternately, call `PyLongWriter_Discard()` to destroy the writer instance without creating an `int` object.

<!-- anchor: c.PyLongWriter_Finish | type: c function -->
### `PyObject *PyLongWriter_Finish(PyLongWriter *writer)`

*Return value: New reference.**Part of the Stable ABI since version 3.15.*

Finish a `PyLongWriter` created by `PyLongWriter_Create()`.

On success, return a Python `int` object. On error, set an exception and return `NULL`.

The function takes care of normalizing the digits and converts the object to a compact integer if needed.

The writer instance and the *digits* array are invalid after the call.

<!-- anchor: c.PyLongWriter_Discard | type: c function -->
### `void PyLongWriter_Discard(PyLongWriter *writer)`

*Part of the Stable ABI since version 3.15.*

Discard a `PyLongWriter` created by `PyLongWriter_Create()`.

If *writer* is `NULL`, no operation is performed.

The writer instance and the *digits* array are invalid after the call.

<!-- anchor: deprecated-api | type: section -->
## Deprecated API

These macros are soft deprecated. They describe parameters of the internal representation of `PyLongObject` instances.

Use `PyLong_GetNativeLayout()` instead, along with `PyLong_Export()` to read integer data or `PyLongWriter` to write it. These currently use the same layout, but are designed to continue working correctly even if CPython’s internal integer representation changes.

<!-- anchor: c.PyLong_SHIFT | type: c macro -->
### `PyLong_SHIFT`

This is equivalent to `bits_per_digit` in the output of `PyLong_GetNativeLayout()`.

<!-- anchor: c.PyLong_BASE | type: c macro -->
### `PyLong_BASE`

This is currently equivalent to 1 << PyLong_SHIFT.

<!-- anchor: c.PyLong_MASK | type: c macro -->
### `PyLong_MASK`

This is currently equivalent to (1 << PyLong_SHIFT) - 1
