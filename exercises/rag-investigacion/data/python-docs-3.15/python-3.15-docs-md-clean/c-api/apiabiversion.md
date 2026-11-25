# API and ABI Versioning

## Build-time version constants

CPython exposes its version number in the following macros.
Note that these correspond to the version code is **built** with.
See `Py_Version` for the version used at **run time**.

See C API and ABI Stability for a discussion of API and ABI stability across versions.

PY\_MAJOR\_VERSION
:   The `3` in `3.4.1a2`.

PY\_MINOR\_VERSION
:   The `4` in `3.4.1a2`.

PY\_MICRO\_VERSION
:   The `1` in `3.4.1a2`.

PY\_RELEASE\_LEVEL
:   The `a` in `3.4.1a2`.
    This can be `0xA` for alpha, `0xB` for beta, `0xC` for release
    candidate or `0xF` for final.

    For completeness, the values are available as macros:
    `PY_RELEASE_LEVEL_ALPHA` (`0xA`),
    `PY_RELEASE_LEVEL_BETA` (`0xB`),
    `PY_RELEASE_LEVEL_GAMMA` (`0xC`), and
    `PY_RELEASE_LEVEL_FINAL` (`0xF`).

PY\_RELEASE\_SERIAL
:   The `2` in `3.4.1a2`. Zero for final releases.

PY\_VERSION\_HEX
:   The Python version number encoded in a single integer.
    See `Py_PACK_FULL_VERSION()` for the encoding details.

    Use this for numeric comparisons, for example,
    `#if PY_VERSION_HEX >= ...`.

PY\_VERSION
:   The Python version as a string, for example, `"3.4.1a2"`.

These macros are defined in Include/patchlevel.h.

## Run-time version

const unsigned long Py\_Version
:   *Part of the Stable ABI since version 3.11.*

    The Python runtime version number encoded in a single constant integer.
    See `Py_PACK_FULL_VERSION()` for the encoding details.
    This contains the Python version used at run time.

    Use this for numeric comparisons, for example, `if (Py_Version >= ...)`.

## Bit-packing macros

uint32\_t Py\_PACK\_FULL\_VERSION(int major, int minor, int micro, int release\_level, int release\_serial)
:   *Part of the Stable ABI since version 3.14.*

    Return the given version, encoded as a single 32-bit integer with
    the following structure:

    | Argument | No. of bits | Bit mask | Bit shift | Example values | |
    | --- | --- | --- | --- | --- | --- |
    | `3.4.1a2` | `3.10.0` |
    | *major* | 8 | `0xFF000000` | 24 | `0x03` | `0x03` |
    | *minor* | 8 | `0x00FF0000` | 16 | `0x04` | `0x0A` |
    | *micro* | 8 | `0x0000FF00` | 8 | `0x01` | `0x00` |
    | *release\_level* | 4 | `0x000000F0` | 4 | `0xA` | `0xF` |
    | *release\_serial* | 4 | `0x0000000F` | 0 | `0x2` | `0x0` |

    For example:

    | Version | `Py_PACK_FULL_VERSION` arguments | Encoded version |
    | --- | --- | --- |
    | `3.4.1a2` | `(3, 4, 1, 0xA, 2)` | `0x030401a2` |
    | `3.10.0` | `(3, 10, 0, 0xF, 0)` | `0x030a00f0` |

    Out-of range bits in the arguments are ignored.
    That is, the macro can be defined as:

    ```
    #ifndef Py_PACK_FULL_VERSION
    #define Py_PACK_FULL_VERSION(X, Y, Z, LEVEL, SERIAL) ( \
       (((X) & 0xff) << 24) |                              \
       (((Y) & 0xff) << 16) |                              \
       (((Z) & 0xff) << 8) |                               \
       (((LEVEL) & 0xf) << 4) |                            \
       (((SERIAL) & 0xf) << 0))
    #endif
    ```

    `Py_PACK_FULL_VERSION` is primarily a macro, intended for use in
    `#if` directives, but it is also available as an exported function.

uint32\_t Py\_PACK\_VERSION(int major, int minor)
:   *Part of the Stable ABI since version 3.14.*

    Equivalent to `Py_PACK_FULL_VERSION(major, minor, 0, 0, 0)`.
    The result does not correspond to any Python release, but is useful
    in numeric comparisons.
