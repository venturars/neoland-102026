# Unicode Objects and Codecs

## Unicode Objects

Since the implementation of **PEP 393** in Python 3.3, Unicode objects internally
use a variety of representations, in order to allow handling the complete range
of Unicode characters while staying memory efficient. There are special cases
for strings where all code points are below 128, 256, or 65536; otherwise, code
points must be below 1114112 (which is the full Unicode range).

UTF-8 representation is created on demand and cached in the Unicode object.

**CPython implementation detail:** The internal buffer always includes an extra trailing null character for
compatibility with null terminated C strings. This extra character is not
counted in `PyUnicode_GetLength()` nor in the various *size* arguments
of the functions below.

Note

The `Py_UNICODE` representation has been removed since Python 3.12
with deprecated APIs.
See **PEP 623** for more information.

### Unicode Type

These are the basic Unicode object types used for the Unicode implementation in
Python:

PyTypeObject PyUnicode\_Type
:   *Part of the Stable ABI.*

    This instance of `PyTypeObject` represents the Python Unicode type.
    It is exposed to Python code as `str`.

PyTypeObject PyUnicodeIter\_Type
:   *Part of the Stable ABI.*

    This instance of `PyTypeObject` represents the Python Unicode
    iterator type. It is used to iterate over Unicode string objects.

type Py\_UCS4

type Py\_UCS2

type Py\_UCS1
:   *Part of the Stable ABI.*

    These types are typedefs for unsigned integer types wide enough to contain
    characters of 32 bits, 16 bits and 8 bits, respectively. When dealing with
    single Unicode characters, use `Py_UCS4`.

type PyASCIIObject

type PyCompactUnicodeObject

type PyUnicodeObject
:   These subtypes of `PyObject` represent a Python Unicode object. In
    almost all cases, they shouldn’t be used directly, since all API functions
    that deal with Unicode objects take and return `PyObject` pointers.

    The structure of a particular object can be determined using the following
    macros.
    The macros cannot fail; their behavior is undefined if their argument
    is not a Python Unicode object.

    PyUnicode\_IS\_COMPACT(o)
    :   True if *o* uses the `PyCompactUnicodeObject` structure.

    PyUnicode\_IS\_COMPACT\_ASCII(o)
    :   True if *o* uses the `PyASCIIObject` structure.

The following APIs are C macros and static inlined functions for fast checks and
access to internal read-only data of Unicode objects:

int PyUnicode\_Check(PyObject \*obj)
:   Return true if the object *obj* is a Unicode object or an instance of a Unicode
    subtype. This function always succeeds.

int PyUnicode\_CheckExact(PyObject \*obj)
:   Return true if the object *obj* is a Unicode object, but not an instance of a
    subtype. This function always succeeds.

Py\_ssize\_t PyUnicode\_GET\_LENGTH(PyObject \*unicode)
:   Return the length of the Unicode string, in code points. *unicode* has to be a
    Unicode object in the “canonical” representation (not checked).

Py\_UCS1 \*PyUnicode\_1BYTE\_DATA(PyObject \*unicode)

Py\_UCS2 \*PyUnicode\_2BYTE\_DATA(PyObject \*unicode)

Py\_UCS4 \*PyUnicode\_4BYTE\_DATA(PyObject \*unicode)
:   Return a pointer to the canonical representation cast to UCS1, UCS2 or UCS4
    integer types for direct character access. No checks are performed if the
    canonical representation has the correct character size; use
    `PyUnicode_KIND()` to select the right function.

PyUnicode\_1BYTE\_KIND

PyUnicode\_2BYTE\_KIND

PyUnicode\_4BYTE\_KIND
:   Return values of the `PyUnicode_KIND()` macro.

    Changed in version 3.12: `PyUnicode_WCHAR_KIND` has been removed.

int PyUnicode\_KIND(PyObject \*unicode)
:   Return one of the PyUnicode kind constants (see above) that indicate how many
    bytes per character this Unicode object uses to store its data. *unicode* has to
    be a Unicode object in the “canonical” representation (not checked).

void \*PyUnicode\_DATA(PyObject \*unicode)
:   Return a void pointer to the raw Unicode buffer. *unicode* has to be a Unicode
    object in the “canonical” representation (not checked).

void PyUnicode\_WRITE(int kind, void \*data, Py\_ssize\_t index, Py\_UCS4 value)
:   Write the code point *value* to the given zero-based *index* in a string.

    The *kind* value and *data* pointer must have been obtained from a
    string using `PyUnicode_KIND()` and `PyUnicode_DATA()`
    respectively. You must hold a reference to that string while calling
    `PyUnicode_WRITE()`. All requirements of
    `PyUnicode_WriteChar()` also apply.

    The function performs no checks for any of its requirements,
    and is intended for usage in loops.

Py\_UCS4 PyUnicode\_READ(int kind, void \*data, Py\_ssize\_t index)
:   Read a code point from a canonical representation *data* (as obtained with
    `PyUnicode_DATA()`). No checks are performed.

    **CPython implementation detail:** Accept reading the trailing null character at index
    `PyUnicode_GetLength()`.

Py\_UCS4 PyUnicode\_READ\_CHAR(PyObject \*unicode, Py\_ssize\_t index)
:   Read a character from a Unicode object *unicode*, which must be in the “canonical”
    representation. This is less efficient than `PyUnicode_READ()` if you
    do multiple consecutive reads.

    **CPython implementation detail:** Accept reading the trailing null character at index
    `PyUnicode_GetLength()`.

Py\_UCS4 PyUnicode\_MAX\_CHAR\_VALUE(PyObject \*unicode)
:   Return the maximum code point that is suitable for creating another string
    based on *unicode*, which must be in the “canonical” representation. This is
    always an approximation but more efficient than iterating over the string.

int PyUnicode\_IsIdentifier(PyObject \*unicode)
:   *Part of the Stable ABI.*

    Return `1` if the string is a valid identifier according to the language
    definition, section Names (identifiers and keywords). Return `0` otherwise.

unsigned int PyUnicode\_IS\_ASCII(PyObject \*unicode)
:   Return true if the string only contains ASCII characters.
    Equivalent to `str.isascii()`.

Py\_hash\_t PyUnstable\_Unicode\_GET\_CACHED\_HASH(PyObject \*str)
:   *This is Unstable API. It may change without warning in minor releases.*

    If the hash of *str*, as returned by `PyObject_Hash()`, has been
    cached and is immediately available, return it.
    Otherwise, return `-1` *without* setting an exception.

    If *str* is not a string (that is, if `PyUnicode_Check(obj)`
    is false), the behavior is undefined.

    This function never fails with an exception.

    Note that there are no guarantees on when an object’s hash is cached,
    and the (non-)existence of a cached hash does not imply that the string has
    any other properties.

### Unicode Character Properties

Unicode provides many different character properties. The most often needed ones
are available through these macros which are mapped to C functions depending on
the Python configuration.

int Py\_UNICODE\_ISSPACE(Py\_UCS4 ch)
:   Return `1` or `0` depending on whether *ch* is a whitespace character.

int Py\_UNICODE\_ISLOWER(Py\_UCS4 ch)
:   Return `1` or `0` depending on whether *ch* is a lowercase character.

int Py\_UNICODE\_ISUPPER(Py\_UCS4 ch)
:   Return `1` or `0` depending on whether *ch* is an uppercase character.

int Py\_UNICODE\_ISTITLE(Py\_UCS4 ch)
:   Return `1` or `0` depending on whether *ch* is a titlecase character.

int Py\_UNICODE\_ISLINEBREAK(Py\_UCS4 ch)
:   Return `1` or `0` depending on whether *ch* is a linebreak character.

int Py\_UNICODE\_ISDECIMAL(Py\_UCS4 ch)
:   Return `1` or `0` depending on whether *ch* is a decimal character.

int Py\_UNICODE\_ISDIGIT(Py\_UCS4 ch)
:   Return `1` or `0` depending on whether *ch* is a digit character.

int Py\_UNICODE\_ISNUMERIC(Py\_UCS4 ch)
:   Return `1` or `0` depending on whether *ch* is a numeric character.

int Py\_UNICODE\_ISALPHA(Py\_UCS4 ch)
:   Return `1` or `0` depending on whether *ch* is an alphabetic character.

int Py\_UNICODE\_ISALNUM(Py\_UCS4 ch)
:   Return `1` or `0` depending on whether *ch* is an alphanumeric character.

int Py\_UNICODE\_ISPRINTABLE(Py\_UCS4 ch)
:   Return `1` or `0` depending on whether *ch* is a printable character,
    in the sense of `str.isprintable()`.

These APIs can be used for fast direct character conversions:

Py\_UCS4 Py\_UNICODE\_TOLOWER(Py\_UCS4 ch)
:   Return the character *ch* converted to lower case.

Py\_UCS4 Py\_UNICODE\_TOUPPER(Py\_UCS4 ch)
:   Return the character *ch* converted to upper case.

Py\_UCS4 Py\_UNICODE\_TOTITLE(Py\_UCS4 ch)
:   Return the character *ch* converted to title case.

int Py\_UNICODE\_TODECIMAL(Py\_UCS4 ch)
:   Return the character *ch* converted to a decimal positive integer. Return
    `-1` if this is not possible. This function does not raise exceptions.

int Py\_UNICODE\_TODIGIT(Py\_UCS4 ch)
:   Return the character *ch* converted to a single digit integer. Return `-1` if
    this is not possible. This function does not raise exceptions.

double Py\_UNICODE\_TONUMERIC(Py\_UCS4 ch)
:   Return the character *ch* converted to a double. Return `-1.0` if this is not
    possible. This function does not raise exceptions.

These APIs can be used to work with surrogates:

int Py\_UNICODE\_IS\_SURROGATE(Py\_UCS4 ch)
:   Check if *ch* is a surrogate (`0xD800 <= ch <= 0xDFFF`).

int Py\_UNICODE\_IS\_HIGH\_SURROGATE(Py\_UCS4 ch)
:   Check if *ch* is a high surrogate (`0xD800 <= ch <= 0xDBFF`).

int Py\_UNICODE\_IS\_LOW\_SURROGATE(Py\_UCS4 ch)
:   Check if *ch* is a low surrogate (`0xDC00 <= ch <= 0xDFFF`).

Py\_UCS4 Py\_UNICODE\_HIGH\_SURROGATE(Py\_UCS4 ch)
:   Return the high UTF-16 surrogate (`0xD800` to `0xDBFF`) for a Unicode
    code point in the range `[0x10000; 0x10FFFF]`.

Py\_UCS4 Py\_UNICODE\_LOW\_SURROGATE(Py\_UCS4 ch)
:   Return the low UTF-16 surrogate (`0xDC00` to `0xDFFF`) for a Unicode
    code point in the range `[0x10000; 0x10FFFF]`.

Py\_UCS4 Py\_UNICODE\_JOIN\_SURROGATES(Py\_UCS4 high, Py\_UCS4 low)
:   Join two surrogate code points and return a single `Py_UCS4` value.
    *high* and *low* are respectively the leading and trailing surrogates in a
    surrogate pair. *high* must be in the range `[0xD800; 0xDBFF]` and *low* must
    be in the range `[0xDC00; 0xDFFF]`.

### Creating and accessing Unicode strings

To create Unicode objects and access their basic sequence properties, use these
APIs:

PyObject \*PyUnicode\_New(Py\_ssize\_t size, Py\_UCS4 maxchar)
:   *Return value: New reference.*

    Create a new Unicode object. *maxchar* should be the true maximum code point
    to be placed in the string. As an approximation, it can be rounded up to the
    nearest value in the sequence 127, 255, 65535, 1114111.

    On error, set an exception and return `NULL`.

    After creation, the string can be filled by `PyUnicode_WriteChar()`,
    `PyUnicode_CopyCharacters()`, `PyUnicode_Fill()`,
    `PyUnicode_WRITE()` or similar.
    Since strings are supposed to be immutable, take care to not “use” the
    result while it is being modified. In particular, before it’s filled
    with its final contents, a string:

    - must not be hashed,
    - must not be `converted to UTF-8`,
      or another non-“canonical” representation,
    - must not have its reference count changed,
    - must not be shared with code that might do one of the above.

    This list is not exhaustive. Avoiding these uses is your responsibility;
    Python does not always check these requirements.

    To avoid accidentally exposing a partially-written string object, prefer
    using the `PyUnicodeWriter` API, or one of the `PyUnicode_From*`
    functions below.

PyObject \*PyUnicode\_FromKindAndData(int kind, const void \*buffer, Py\_ssize\_t size)
:   *Return value: New reference.*

    Create a new Unicode object with the given *kind* (possible values are
    `PyUnicode_1BYTE_KIND` etc., as returned by
    `PyUnicode_KIND()`). The *buffer* must point to an array of *size*
    units of 1, 2 or 4 bytes per character, as given by the kind.

    If necessary, the input *buffer* is copied and transformed into the
    canonical representation. For example, if the *buffer* is a UCS4 string
    (`PyUnicode_4BYTE_KIND`) and it consists only of codepoints in
    the UCS1 range, it will be transformed into UCS1
    (`PyUnicode_1BYTE_KIND`).

    All characters must be in range [U+0000; U+10ffff]. If *kind* is
    `PyUnicode_4BYTE_KIND` and the string contains invalid characters,
    the behavior is undefined.

PyObject \*PyUnicode\_FromStringAndSize(const char \*str, Py\_ssize\_t size)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Create a Unicode object from the char buffer *str*. The bytes will be
    interpreted as being UTF-8 encoded. The buffer is copied into the new
    object.
    The return value might be a shared object, i.e. modification of the data is
    not allowed.

    This function raises `SystemError` when:

    - *size* < 0,
    - *str* is `NULL` and *size* > 0

PyObject \*PyUnicode\_FromString(const char \*str)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Create a Unicode object from a UTF-8 encoded null-terminated char buffer
    *str*.

PyObject \*PyUnicode\_FromFormat(const char \*format, ...)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Take a C `printf()`-style *format* string and a variable number of
    arguments, calculate the size of the resulting Python Unicode string and return
    a string with the values formatted into it. The variable arguments must be C
    types and must correspond exactly to the format characters in the *format*
    ASCII-encoded string.

    A conversion specifier contains two or more characters and has the following
    components, which must occur in this order:

    1. The `'%'` character, which marks the start of the specifier.
    2. Conversion flags (optional), which affect the result of some conversion
       types.
    3. Minimum field width (optional).
       If specified as an `'*'` (asterisk), the actual width is given in the
       next argument, which must be of type int, and the object to
       convert comes after the minimum field width and optional precision.
    4. Precision (optional), given as a `'.'` (dot) followed by the precision.
       If specified as `'*'` (an asterisk), the actual precision is given in
       the next argument, which must be of type int, and the value to
       convert comes after the precision.
    5. Length modifier (optional).
    6. Conversion type.

    The conversion flag characters are:

    | Flag | Meaning |
    | --- | --- |
    | `0` | The conversion will be zero padded for numeric values. |
    | `-` | The converted value is left adjusted (overrides the `0` flag if both are given). |

    The length modifiers for following integer conversions (`d`, `i`,
    `o`, `u`, `x`, or `X`) specify the type of the argument
    (int by default):

    | Modifier | Types |
    | --- | --- |
    | `l` | long or unsigned long |
    | `ll` | long long or unsigned long long |
    | `j` | `intmax_t` or `uintmax_t` |
    | `z` | `size_t` or `ssize_t` |
    | `t` | `ptrdiff_t` |

    The length modifier `l` for following conversions `s` or `V` specify
    that the type of the argument is const wchar\_t\*.

    The conversion specifiers are:

    | Conversion Specifier | Type | Comment |
    | --- | --- | --- |
    | `%` | *n/a* | The literal `%` character. |
    | `d`, `i` | Specified by the length modifier | The decimal representation of a signed C integer. |
    | `u` | Specified by the length modifier | The decimal representation of an unsigned C integer. |
    | `o` | Specified by the length modifier | The octal representation of an unsigned C integer. |
    | `x` | Specified by the length modifier | The hexadecimal representation of an unsigned C integer (lowercase). |
    | `X` | Specified by the length modifier | The hexadecimal representation of an unsigned C integer (uppercase). |
    | `c` | int | A single character. |
    | `s` | const char\* or const wchar\_t\* | A null-terminated C character array. |
    | `p` | const void\* | The hex representation of a C pointer. Mostly equivalent to `printf("%p")` except that it is guaranteed to start with the literal `0x` regardless of what the platform’s `printf` yields. |
    | `A` | PyObject\* | The result of calling `ascii()`. |
    | `U` | PyObject\* | A Unicode object. |
    | `V` | PyObject\*, const char\* or const wchar\_t\* | A Unicode object (which may be `NULL`) and a null-terminated C character array as a second parameter (which will be used, if the first parameter is `NULL`). |
    | `S` | PyObject\* | The result of calling `PyObject_Str()`. |
    | `R` | PyObject\* | The result of calling `PyObject_Repr()`. |
    | `T` | PyObject\* | Get the fully qualified name of an object type; call `PyType_GetFullyQualifiedName()`. |
    | `#T` | PyObject\* | Similar to `T` format, but use a colon (`:`) as separator between the module name and the qualified name. |
    | `N` | PyTypeObject\* | Get the fully qualified name of a type; call `PyType_GetFullyQualifiedName()`. |
    | `#N` | PyTypeObject\* | Similar to `N` format, but use a colon (`:`) as separator between the module name and the qualified name. |

    Note

    The width formatter unit is number of characters rather than bytes.
    The precision formatter unit is number of bytes or `wchar_t`
    items (if the length modifier `l` is used) for `"%s"` and
    `"%V"` (if the `PyObject*` argument is `NULL`), and a number of
    characters for `"%A"`, `"%U"`, `"%S"`, `"%R"` and `"%V"`
    (if the `PyObject*` argument is not `NULL`).

    Note

    Unlike to C `printf()` the `0` flag has effect even when
    a precision is given for integer conversions (`d`, `i`, `u`, `o`,
    `x`, or `X`).

    An unrecognized format character now sets a `SystemError`.
    In previous versions it caused all the rest of the format string to be
    copied as-is to the result string, and any extra arguments discarded.

PyObject \*PyUnicode\_FromFormatV(const char \*format, va\_list vargs)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Identical to `PyUnicode_FromFormat()` except that it takes exactly two
    arguments.

PyObject \*PyUnicode\_FromObject(PyObject \*obj)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Copy an instance of a Unicode subtype to a new true Unicode object if
    necessary. If *obj* is already a true Unicode object (not a subtype),
    return a new strong reference to the object.

    Objects other than Unicode or its subtypes will cause a `TypeError`.

PyObject \*PyUnicode\_FromOrdinal(int ordinal)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Create a Unicode Object from the given Unicode code point *ordinal*.

    The ordinal must be in `range(0x110000)`. A `ValueError` is
    raised in the case it is not.

PyObject \*PyUnicode\_FromEncodedObject(PyObject \*obj, const char \*encoding, const char \*errors)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Decode an encoded object *obj* to a Unicode object.

    `bytes`, `bytearray` and other
    bytes-like objects
    are decoded according to the given *encoding* and using the error handling
    defined by *errors*. Both can be `NULL` to have the interface use the default
    values (see Built-in Codecs for details).

    All other objects, including Unicode objects, cause a `TypeError` to be
    set.

    The API returns `NULL` if there was an error. The caller is responsible for
    decref’ing the returned objects.

void PyUnicode\_Append(PyObject \*\*p\_left, PyObject \*right)
:   *Part of the Stable ABI.*

    Append the string *right* to the end of *p\_left*.
    *p\_left* must point to a strong reference to a Unicode object;
    `PyUnicode_Append()` releases (”steals”)
    this reference.

    On error, set *\*p\_left* to `NULL` and set an exception.

    On success, set *\*p\_left* to a new strong reference to the result.

void PyUnicode\_AppendAndDel(PyObject \*\*p\_left, PyObject \*right)
:   *Part of the Stable ABI.*

    The function is similar to `PyUnicode_Append()`, with the only
    difference being that it decrements the reference count of *right* by one.

PyObject \*PyUnicode\_BuildEncodingMap(PyObject \*string)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return a mapping suitable for decoding a custom single-byte encoding.
    Given a Unicode string *string* of up to 256 characters representing an encoding
    table, returns either a compact internal mapping object or a dictionary
    mapping character ordinals to byte values. Raises a `TypeError` and
    return `NULL` on invalid input.

const char \*PyUnicode\_GetDefaultEncoding(void)
:   *Part of the Stable ABI.*

    Return the name of the default string encoding, `"utf-8"`.
    See `sys.getdefaultencoding()`.

    The returned string does not need to be freed, and is valid
    until interpreter shutdown.

Py\_ssize\_t PyUnicode\_GetLength(PyObject \*unicode)
:   *Part of the Stable ABI since version 3.7.*

    Return the length of the Unicode object, in code points.

    On error, set an exception and return `-1`.

    **CPython implementation detail:** The length does not count the trailing null character.

Py\_ssize\_t PyUnicode\_CopyCharacters(PyObject \*to, Py\_ssize\_t to\_start, PyObject \*from, Py\_ssize\_t from\_start, Py\_ssize\_t how\_many)
:   Copy characters from one Unicode object into another. This function performs
    character conversion when necessary and falls back to `memcpy()` if
    possible. Returns `-1` and sets an exception on error, otherwise returns
    the number of copied characters.

    The string must not have been “used” yet.
    See `PyUnicode_New()` for details.

int PyUnicode\_Resize(PyObject \*\*unicode, Py\_ssize\_t length);
:   *Part of the Stable ABI.*

    Resize a Unicode object *\*unicode* to the new *length* in code points.

    Try to resize the string in place (which is usually faster than allocating
    a new string and copying characters), or create a new string.

    *\*unicode* is modified to point to the new (resized) object and `0` is
    returned on success. Otherwise, `-1` is returned and an exception is set,
    and *\*unicode* is left untouched.

    The function doesn’t check string content, the result may not be a
    string in canonical representation.

Py\_ssize\_t PyUnicode\_Fill(PyObject \*unicode, Py\_ssize\_t start, Py\_ssize\_t length, Py\_UCS4 fill\_char)
:   Fill a string with a character: write *fill\_char* into
    `unicode[start:start+length]`.

    Fail if *fill\_char* is bigger than the string maximum character, or if the
    string has more than 1 reference.

    The string must not have been “used” yet.
    See `PyUnicode_New()` for details.

    Return the number of written characters, or return `-1` and raise an
    exception on error.

int PyUnicode\_WriteChar(PyObject \*unicode, Py\_ssize\_t index, Py\_UCS4 character)
:   *Part of the Stable ABI since version 3.7.*

    Write a *character* to the string *unicode* at the zero-based *index*.
    Return `0` on success, `-1` on error with an exception set.

    This function checks that *unicode* is a Unicode object, that the index is
    not out of bounds, and that the object’s reference count is one.
    See `PyUnicode_WRITE()` for a version that skips these checks,
    making them your responsibility.

    The string must not have been “used” yet.
    See `PyUnicode_New()` for details.

Py\_UCS4 PyUnicode\_ReadChar(PyObject \*unicode, Py\_ssize\_t index)
:   *Part of the Stable ABI since version 3.7.*

    Read a character from a string. This function checks that *unicode* is a
    Unicode object and the index is not out of bounds, in contrast to
    `PyUnicode_READ_CHAR()`, which performs no error checking.

    Return character on success, `-1` on error with an exception set.

    **CPython implementation detail:** Do not accept reading the trailing null character at index
    `PyUnicode_GetLength()`.

PyObject \*PyUnicode\_Substring(PyObject \*unicode, Py\_ssize\_t start, Py\_ssize\_t end)
:   *Return value: New reference.* *Part of the Stable ABI since version 3.7.*

    Return a substring of *unicode*, from character index *start* (included) to
    character index *end* (excluded). Negative indices are not supported.
    On error, set an exception and return `NULL`.

Py\_UCS4 \*PyUnicode\_AsUCS4(PyObject \*unicode, Py\_UCS4 \*buffer, Py\_ssize\_t buflen, int copy\_null)
:   *Part of the Stable ABI since version 3.7.*

    Copy the string *unicode* into a UCS4 buffer, including a null character, if
    *copy\_null* is set. Returns `NULL` and sets an exception on error (in
    particular, a `SystemError` if *buflen* is smaller than the length of
    *unicode*). *buffer* is returned on success.

Py\_UCS4 \*PyUnicode\_AsUCS4Copy(PyObject \*unicode)
:   *Part of the Stable ABI since version 3.7.*

    Copy the string *unicode* into a new UCS4 buffer that is allocated using
    `PyMem_Malloc()`. If this fails, `NULL` is returned with a
    `MemoryError` set. The returned buffer always has an extra
    null code point appended.

### Locale Encoding

The current locale encoding can be used to decode text from the operating
system.

PyObject \*PyUnicode\_DecodeLocaleAndSize(const char \*str, Py\_ssize\_t length, const char \*errors)
:   *Return value: New reference.* *Part of the Stable ABI since version 3.7.*

    Decode a string from UTF-8 on Android and VxWorks, or from the current
    locale encoding on other platforms. The supported
    error handlers are `"strict"` and `"surrogateescape"`
    (**PEP 383**). The decoder uses `"strict"` error handler if
    *errors* is `NULL`. *str* must end with a null character but
    cannot contain embedded null characters.

    Use `PyUnicode_DecodeFSDefaultAndSize()` to decode a string from
    the filesystem encoding and error handler.

    This function ignores the Python UTF-8 Mode.

    See also

    The `Py_DecodeLocale()` function.

PyObject \*PyUnicode\_DecodeLocale(const char \*str, const char \*errors)
:   *Return value: New reference.* *Part of the Stable ABI since version 3.7.*

    Similar to `PyUnicode_DecodeLocaleAndSize()`, but compute the string
    length using `strlen()`.

PyObject \*PyUnicode\_EncodeLocale(PyObject \*unicode, const char \*errors)
:   *Return value: New reference.* *Part of the Stable ABI since version 3.7.*

    Encode a Unicode object to UTF-8 on Android and VxWorks, or to the current
    locale encoding on other platforms. The
    supported error handlers are `"strict"` and `"surrogateescape"`
    (**PEP 383**). The encoder uses `"strict"` error handler if
    *errors* is `NULL`. Return a `bytes` object. *unicode* cannot
    contain embedded null characters.

    Use `PyUnicode_EncodeFSDefault()` to encode a string to the
    filesystem encoding and error handler.

    This function ignores the Python UTF-8 Mode.

    See also

    The `Py_EncodeLocale()` function.

### File System Encoding

Functions encoding to and decoding from the [filesystem encoding and
error handler](../glossary.md#term-filesystem-encoding-and-error-handler) (**PEP 383** and **PEP 529**).

To encode file names to `bytes` during argument parsing, the `"O&"`
converter should be used, passing `PyUnicode_FSConverter()` as the
conversion function:

int PyUnicode\_FSConverter(PyObject \*obj, void \*result)
:   *Part of the Stable ABI.*

    PyArg\_Parse\* converter: encode `str` objects – obtained directly or
    through the `os.PathLike` interface – to `bytes` using
    `PyUnicode_EncodeFSDefault()`; `bytes` objects are output as-is.
    *result* must be an address of a C variable of type PyObject\*
    (or PyBytesObject\*).
    On success, set the variable to a new strong reference to
    a bytes object which must be released
    when it is no longer used and return a non-zero value
    (`Py_CLEANUP_SUPPORTED`).
    Embedded null bytes are not allowed in the result.
    On failure, return `0` with an exception set.

    If *obj* is `NULL`, the function releases a strong reference
    stored in the variable referred by *result* and returns `1`.

To decode file names to `str` during argument parsing, the `"O&"`
converter should be used, passing `PyUnicode_FSDecoder()` as the
conversion function:

int PyUnicode\_FSDecoder(PyObject \*obj, void \*result)
:   *Part of the Stable ABI.*

    PyArg\_Parse\* converter: decode `bytes` objects – obtained either
    directly or indirectly through the `os.PathLike` interface – to
    `str` using `PyUnicode_DecodeFSDefaultAndSize()`; `str`
    objects are output as-is.
    *result* must be an address of a C variable of type PyObject\*
    (or PyUnicodeObject\*).
    On success, set the variable to a new strong reference to
    a Unicode object which must be released
    when it is no longer used and return a non-zero value
    (`Py_CLEANUP_SUPPORTED`).
    Embedded null characters are not allowed in the result.
    On failure, return `0` with an exception set.

    If *obj* is `NULL`, release the strong reference
    to the object referred to by *result* and return `1`.

PyObject \*PyUnicode\_DecodeFSDefaultAndSize(const char \*str, Py\_ssize\_t size)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Decode a string from the filesystem encoding and error handler.

    If you need to decode a string from the current locale encoding, use
    `PyUnicode_DecodeLocaleAndSize()`.

    See also

    The `Py_DecodeLocale()` function.

PyObject \*PyUnicode\_DecodeFSDefault(const char \*str)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Decode a null-terminated string from the [filesystem encoding and
    error handler](../glossary.md#term-filesystem-encoding-and-error-handler).

    If the string length is known, use
    `PyUnicode_DecodeFSDefaultAndSize()`.

PyObject \*PyUnicode\_EncodeFSDefault(PyObject \*unicode)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Encode a Unicode object to the [filesystem encoding and error
    handler](../glossary.md#term-filesystem-encoding-and-error-handler), and return `bytes`. Note that the resulting `bytes`
    object can contain null bytes.

    If you need to encode a string to the current locale encoding, use
    `PyUnicode_EncodeLocale()`.

    See also

    The `Py_EncodeLocale()` function.

### wchar\_t Support

`wchar_t` support for platforms which support it:

PyObject \*PyUnicode\_FromWideChar(const wchar\_t \*wstr, Py\_ssize\_t size)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Create a Unicode object from the `wchar_t` buffer *wstr* of the given *size*.
    Passing `-1` as the *size* indicates that the function must itself compute the length,
    using `wcslen()`.
    Return `NULL` on failure.

Py\_ssize\_t PyUnicode\_AsWideChar(PyObject \*unicode, wchar\_t \*wstr, Py\_ssize\_t size)
:   *Part of the Stable ABI.*

    Copy the Unicode object contents into the `wchar_t` buffer *wstr*. At most
    *size* `wchar_t` characters are copied (excluding a possibly trailing
    null termination character). Return the number of `wchar_t` characters
    copied or `-1` in case of an error.

    When *wstr* is `NULL`, instead return the *size* that would be required
    to store all of *unicode* including a terminating null.

    Note that the resulting wchar\_t\*
    string may or may not be null-terminated. It is the responsibility of the caller
    to make sure that the wchar\_t\* string is null-terminated in case this is
    required by the application. Also, note that the wchar\_t\* string
    might contain null characters, which would cause the string to be truncated
    when used with most C functions.

wchar\_t \*PyUnicode\_AsWideCharString(PyObject \*unicode, Py\_ssize\_t \*size)
:   *Part of the Stable ABI since version 3.7.*

    Convert the Unicode object to a wide character string. The output string
    always ends with a null character. If *size* is not `NULL`, write the number
    of wide characters (excluding the trailing null termination character) into
    *\*size*. Note that the resulting `wchar_t` string might contain
    null characters, which would cause the string to be truncated when used with
    most C functions. If *size* is `NULL` and the wchar\_t\* string
    contains null characters a `ValueError` is raised.

    Returns a buffer allocated by `PyMem_New` (use
    `PyMem_Free()` to free it) on success. On error, returns `NULL`
    and *\*size* is undefined. Raises a `MemoryError` if memory allocation
    is failed.

    Changed in version 3.7: Raises a `ValueError` if *size* is `NULL` and the wchar\_t\*
    string contains null characters.

## Built-in Codecs

Python provides a set of built-in codecs which are written in C for speed. All of
these codecs are directly usable via the following functions.

Many of the following APIs take two arguments encoding and errors, and they
have the same semantics as the ones of the built-in `str()` string object
constructor.

Setting encoding to `NULL` causes the default encoding to be used
which is UTF-8. The file system calls should use
`PyUnicode_FSConverter()` for encoding file names. This uses the
filesystem encoding and error handler internally.

Error handling is set by errors which may also be set to `NULL` meaning to use
the default handling defined for the codec. Default error handling for all
built-in codecs is “strict” (`ValueError` is raised).

The codecs all use a similar interface. Only deviations from the following
generic ones are documented for simplicity.

### Generic Codecs

The following macro is provided:

Py\_UNICODE\_REPLACEMENT\_CHARACTER
:   The Unicode code point `U+FFFD` (replacement character).

    This Unicode character is used as the replacement character during
    decoding if the *errors* argument is set to “replace”.

These are the generic codec APIs:

PyObject \*PyUnicode\_Decode(const char \*str, Py\_ssize\_t size, const char \*encoding, const char \*errors)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Create a Unicode object by decoding *size* bytes of the encoded string *str*.
    *encoding* and *errors* have the same meaning as the parameters of the same name
    in the `str()` built-in function. The codec to be used is looked up
    using the Python codec registry. Return `NULL` if an exception was raised by
    the codec.

PyObject \*PyUnicode\_AsEncodedString(PyObject \*unicode, const char \*encoding, const char \*errors)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Encode a Unicode object and return the result as Python bytes object.
    *encoding* and *errors* have the same meaning as the parameters of the same
    name in the Unicode `encode()` method. The codec to be used is looked up
    using the Python codec registry. Return `NULL` if an exception was raised by
    the codec.

### UTF-8 Codecs

These are the UTF-8 codec APIs:

PyObject \*PyUnicode\_DecodeUTF8(const char \*str, Py\_ssize\_t size, const char \*errors)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Create a Unicode object by decoding *size* bytes of the UTF-8 encoded string
    *str*. Return `NULL` if an exception was raised by the codec.

PyObject \*PyUnicode\_DecodeUTF8Stateful(const char \*str, Py\_ssize\_t size, const char \*errors, Py\_ssize\_t \*consumed)
:   *Return value: New reference.* *Part of the Stable ABI.*

    If *consumed* is `NULL`, behave like `PyUnicode_DecodeUTF8()`. If
    *consumed* is not `NULL`, trailing incomplete UTF-8 byte sequences will not be
    treated as an error. Those bytes will not be decoded and the number of bytes
    that have been decoded will be stored in *consumed*.

PyObject \*PyUnicode\_AsUTF8String(PyObject \*unicode)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Encode a Unicode object using UTF-8 and return the result as Python bytes
    object. Error handling is “strict”. Return `NULL` if an exception was
    raised by the codec.

    The function fails if the string contains surrogate code points
    (`U+D800` - `U+DFFF`).

const char \*PyUnicode\_AsUTF8AndSize(PyObject \*unicode, Py\_ssize\_t \*size)
:   *Part of the Stable ABI since version 3.10.*

    Return a pointer to the UTF-8 encoding of the Unicode object, and
    store the size of the encoded representation (in bytes) in *size*. The
    *size* argument can be `NULL`; in this case no size will be stored. The
    returned buffer always has an extra null byte appended (not included in
    *size*), regardless of whether there are any other null code points.

    On error, set an exception, set *size* to `-1` (if it’s not NULL) and
    return `NULL`.

    The function fails if the string contains surrogate code points
    (`U+D800` - `U+DFFF`).

    This caches the UTF-8 representation of the string in the Unicode object, and
    subsequent calls will return a pointer to the same buffer. The caller is not
    responsible for deallocating the buffer. The buffer is deallocated and
    pointers to it become invalid when the Unicode object is garbage collected.

const char \*PyUnicode\_AsUTF8(PyObject \*unicode)
:   As `PyUnicode_AsUTF8AndSize()`, but does not store the size.

    Warning

    This function does not have any special behavior for
    null characters embedded within
    *unicode*. As a result, strings containing null characters will remain in the returned
    string, which some C functions might interpret as the end of the string, leading to
    truncation. If truncation is an issue, it is recommended to use `PyUnicode_AsUTF8AndSize()`
    instead.

### UTF-32 Codecs

These are the UTF-32 codec APIs:

PyObject \*PyUnicode\_DecodeUTF32(const char \*str, Py\_ssize\_t size, const char \*errors, int \*byteorder)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Decode *size* bytes from a UTF-32 encoded buffer string and return the
    corresponding Unicode object. *errors* (if non-`NULL`) defines the error
    handling. It defaults to “strict”.

    If *byteorder* is non-`NULL`, the decoder starts decoding using the given byte
    order:

    ```
    *byteorder == -1: little endian
    *byteorder == 0:  native order
    *byteorder == 1:  big endian
    ```

    If `*byteorder` is zero, and the first four bytes of the input data are a
    byte order mark (BOM), the decoder switches to this byte order and the BOM is
    not copied into the resulting Unicode string. If `*byteorder` is `-1` or
    `1`, any byte order mark is copied to the output.

    After completion, *\*byteorder* is set to the current byte order at the end
    of input data.

    If *byteorder* is `NULL`, the codec starts in native order mode.

    Return `NULL` if an exception was raised by the codec.

PyObject \*PyUnicode\_DecodeUTF32Stateful(const char \*str, Py\_ssize\_t size, const char \*errors, int \*byteorder, Py\_ssize\_t \*consumed)
:   *Return value: New reference.* *Part of the Stable ABI.*

    If *consumed* is `NULL`, behave like `PyUnicode_DecodeUTF32()`. If
    *consumed* is not `NULL`, `PyUnicode_DecodeUTF32Stateful()` will not treat
    trailing incomplete UTF-32 byte sequences (such as a number of bytes not divisible
    by four) as an error. Those bytes will not be decoded and the number of bytes
    that have been decoded will be stored in *consumed*.

PyObject \*PyUnicode\_AsUTF32String(PyObject \*unicode)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return a Python byte string using the UTF-32 encoding in native byte
    order. The string always starts with a BOM mark. Error handling is “strict”.
    Return `NULL` if an exception was raised by the codec.

### UTF-16 Codecs

These are the UTF-16 codec APIs:

PyObject \*PyUnicode\_DecodeUTF16(const char \*str, Py\_ssize\_t size, const char \*errors, int \*byteorder)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Decode *size* bytes from a UTF-16 encoded buffer string and return the
    corresponding Unicode object. *errors* (if non-`NULL`) defines the error
    handling. It defaults to “strict”.

    If *byteorder* is non-`NULL`, the decoder starts decoding using the given byte
    order:

    ```
    *byteorder == -1: little endian
    *byteorder == 0:  native order
    *byteorder == 1:  big endian
    ```

    If `*byteorder` is zero, and the first two bytes of the input data are a
    byte order mark (BOM), the decoder switches to this byte order and the BOM is
    not copied into the resulting Unicode string. If `*byteorder` is `-1` or
    `1`, any byte order mark is copied to the output (where it will result in
    either a `\ufeff` or a `\ufffe` character).

    After completion, `*byteorder` is set to the current byte order at the end
    of input data.

    If *byteorder* is `NULL`, the codec starts in native order mode.

    Return `NULL` if an exception was raised by the codec.

PyObject \*PyUnicode\_DecodeUTF16Stateful(const char \*str, Py\_ssize\_t size, const char \*errors, int \*byteorder, Py\_ssize\_t \*consumed)
:   *Return value: New reference.* *Part of the Stable ABI.*

    If *consumed* is `NULL`, behave like `PyUnicode_DecodeUTF16()`. If
    *consumed* is not `NULL`, `PyUnicode_DecodeUTF16Stateful()` will not treat
    trailing incomplete UTF-16 byte sequences (such as an odd number of bytes or a
    split surrogate pair) as an error. Those bytes will not be decoded and the
    number of bytes that have been decoded will be stored in *consumed*.

PyObject \*PyUnicode\_AsUTF16String(PyObject \*unicode)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return a Python byte string using the UTF-16 encoding in native byte
    order. The string always starts with a BOM mark. Error handling is “strict”.
    Return `NULL` if an exception was raised by the codec.

### UTF-7 Codecs

These are the UTF-7 codec APIs:

PyObject \*PyUnicode\_DecodeUTF7(const char \*str, Py\_ssize\_t size, const char \*errors)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Create a Unicode object by decoding *size* bytes of the UTF-7 encoded string
    *str*. Return `NULL` if an exception was raised by the codec.

PyObject \*PyUnicode\_DecodeUTF7Stateful(const char \*str, Py\_ssize\_t size, const char \*errors, Py\_ssize\_t \*consumed)
:   *Return value: New reference.* *Part of the Stable ABI.*

    If *consumed* is `NULL`, behave like `PyUnicode_DecodeUTF7()`. If
    *consumed* is not `NULL`, trailing incomplete UTF-7 base-64 sections will not
    be treated as an error. Those bytes will not be decoded and the number of
    bytes that have been decoded will be stored in *consumed*.

### Unicode-Escape Codecs

These are the “Unicode Escape” codec APIs:

PyObject \*PyUnicode\_DecodeUnicodeEscape(const char \*str, Py\_ssize\_t size, const char \*errors)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Create a Unicode object by decoding *size* bytes of the Unicode-Escape encoded
    string *str*. Return `NULL` if an exception was raised by the codec.

PyObject \*PyUnicode\_AsUnicodeEscapeString(PyObject \*unicode)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Encode a Unicode object using Unicode-Escape and return the result as a
    bytes object. Error handling is “strict”. Return `NULL` if an exception was
    raised by the codec.

### Raw-Unicode-Escape Codecs

These are the “Raw Unicode Escape” codec APIs:

PyObject \*PyUnicode\_DecodeRawUnicodeEscape(const char \*str, Py\_ssize\_t size, const char \*errors)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Create a Unicode object by decoding *size* bytes of the Raw-Unicode-Escape
    encoded string *str*. Return `NULL` if an exception was raised by the codec.

PyObject \*PyUnicode\_AsRawUnicodeEscapeString(PyObject \*unicode)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Encode a Unicode object using Raw-Unicode-Escape and return the result as
    a bytes object. Error handling is “strict”. Return `NULL` if an exception
    was raised by the codec.

### Latin-1 Codecs

These are the Latin-1 codec APIs: Latin-1 corresponds to the first 256 Unicode
ordinals and only these are accepted by the codecs during encoding.

PyObject \*PyUnicode\_DecodeLatin1(const char \*str, Py\_ssize\_t size, const char \*errors)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Create a Unicode object by decoding *size* bytes of the Latin-1 encoded string
    *str*. Return `NULL` if an exception was raised by the codec.

PyObject \*PyUnicode\_AsLatin1String(PyObject \*unicode)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Encode a Unicode object using Latin-1 and return the result as Python bytes
    object. Error handling is “strict”. Return `NULL` if an exception was
    raised by the codec.

### ASCII Codecs

These are the ASCII codec APIs. Only 7-bit ASCII data is accepted. All other
codes generate errors.

PyObject \*PyUnicode\_DecodeASCII(const char \*str, Py\_ssize\_t size, const char \*errors)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Create a Unicode object by decoding *size* bytes of the ASCII encoded string
    *str*. Return `NULL` if an exception was raised by the codec.

PyObject \*PyUnicode\_AsASCIIString(PyObject \*unicode)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Encode a Unicode object using ASCII and return the result as Python bytes
    object. Error handling is “strict”. Return `NULL` if an exception was
    raised by the codec.

### Character Map Codecs

This codec is special in that it can be used to implement many different codecs
(and this is in fact what was done to obtain most of the standard codecs
included in the `encodings` package). The codec uses mappings to encode and
decode characters. The mapping objects provided must support the
`__getitem__()` mapping interface; dictionaries and sequences work well.

These are the mapping codec APIs:

PyObject \*PyUnicode\_DecodeCharmap(const char \*str, Py\_ssize\_t length, PyObject \*mapping, const char \*errors)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Create a Unicode object by decoding *size* bytes of the encoded string *str*
    using the given *mapping* object. Return `NULL` if an exception was raised
    by the codec.

    If *mapping* is `NULL`, Latin-1 decoding will be applied. Else
    *mapping* must map bytes ordinals (integers in the range from 0 to 255)
    to Unicode strings, integers (which are then interpreted as Unicode
    ordinals) or `None`. Unmapped data bytes – ones which cause a
    `LookupError`, as well as ones which get mapped to `None`,
    `0xFFFE` or `'\ufffe'`, are treated as undefined mappings and cause
    an error.

PyObject \*PyUnicode\_AsCharmapString(PyObject \*unicode, PyObject \*mapping)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Encode a Unicode object using the given *mapping* object and return the
    result as a bytes object. Error handling is “strict”. Return `NULL` if an
    exception was raised by the codec.

    The *mapping* object must map Unicode ordinal integers to bytes objects,
    integers in the range from 0 to 255 or `None`. Unmapped character
    ordinals (ones which cause a `LookupError`) as well as mapped to
    `None` are treated as “undefined mapping” and cause an error.

The following codec API is special in that maps Unicode to Unicode.

PyObject \*PyUnicode\_Translate(PyObject \*unicode, PyObject \*table, const char \*errors)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Translate a string by applying a character mapping table to it and return the
    resulting Unicode object. Return `NULL` if an exception was raised by the
    codec.

    The mapping table must map Unicode ordinal integers to Unicode ordinal integers
    or `None` (causing deletion of the character).

    Mapping tables need only provide the `__getitem__()` interface; dictionaries
    and sequences work well. Unmapped character ordinals (ones which cause a
    `LookupError`) are left untouched and are copied as-is.

    *errors* has the usual meaning for codecs. It may be `NULL` which indicates to
    use the default error handling.

### MBCS codecs for Windows

These are the MBCS codec APIs. They are currently only available on Windows and
use the Win32 MBCS converters to implement the conversions. Note that MBCS (or
DBCS) is a class of encodings, not just one. The target encoding is defined by
the user settings on the machine running the codec.

PyObject \*PyUnicode\_DecodeMBCS(const char \*str, Py\_ssize\_t size, const char \*errors)
:   *Return value: New reference.* *Part of the Stable ABI on Windows since version 3.7.*

    Create a Unicode object by decoding *size* bytes of the MBCS encoded string *str*.
    Return `NULL` if an exception was raised by the codec.

PyObject \*PyUnicode\_DecodeMBCSStateful(const char \*str, Py\_ssize\_t size, const char \*errors, Py\_ssize\_t \*consumed)
:   *Return value: New reference.* *Part of the Stable ABI on Windows since version 3.7.*

    If *consumed* is `NULL`, behave like `PyUnicode_DecodeMBCS()`. If
    *consumed* is not `NULL`, `PyUnicode_DecodeMBCSStateful()` will not decode
    trailing lead byte and the number of bytes that have been decoded will be stored
    in *consumed*.

PyObject \*PyUnicode\_DecodeCodePageStateful(int code\_page, const char \*str, Py\_ssize\_t size, const char \*errors, Py\_ssize\_t \*consumed)
:   *Return value: New reference.* *Part of the Stable ABI on Windows since version 3.7.*

    Similar to `PyUnicode_DecodeMBCSStateful()`, except uses the code page
    specified by *code\_page*.

PyObject \*PyUnicode\_AsMBCSString(PyObject \*unicode)
:   *Return value: New reference.* *Part of the Stable ABI on Windows since version 3.7.*

    Encode a Unicode object using MBCS and return the result as Python bytes
    object. Error handling is “strict”. Return `NULL` if an exception was
    raised by the codec.

PyObject \*PyUnicode\_EncodeCodePage(int code\_page, PyObject \*unicode, const char \*errors)
:   *Return value: New reference.* *Part of the Stable ABI on Windows since version 3.7.*

    Encode the Unicode object using the specified code page and return a Python
    bytes object. Return `NULL` if an exception was raised by the codec. Use
    `CP_ACP` code page to get the MBCS encoder.

## Methods and Slot Functions

The following APIs are capable of handling Unicode objects and strings on input
(we refer to them as strings in the descriptions) and return Unicode objects or
integers as appropriate.

They all return `NULL` or `-1` if an exception occurs.

PyObject \*PyUnicode\_Concat(PyObject \*left, PyObject \*right)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Concat two strings giving a new Unicode string.

PyObject \*PyUnicode\_Split(PyObject \*unicode, PyObject \*sep, Py\_ssize\_t maxsplit)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Split a string giving a list of Unicode strings. If *sep* is `NULL`, splitting
    will be done at all whitespace substrings. Otherwise, splits occur at the given
    separator. At most *maxsplit* splits will be done. If negative, no limit is
    set. Separators are not included in the resulting list.

    On error, return `NULL` with an exception set.

    Equivalent to `str.split()`.

PyObject \*PyUnicode\_RSplit(PyObject \*unicode, PyObject \*sep, Py\_ssize\_t maxsplit)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Similar to `PyUnicode_Split()`, but splitting will be done beginning
    at the end of the string.

    On error, return `NULL` with an exception set.

    Equivalent to `str.rsplit()`.

PyObject \*PyUnicode\_Splitlines(PyObject \*unicode, int keepends)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Split a Unicode string at line breaks, returning a list of Unicode strings.
    CRLF is considered to be one line break. If *keepends* is `0`, the Line break
    characters are not included in the resulting strings.

PyObject \*PyUnicode\_Partition(PyObject \*unicode, PyObject \*sep)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Split a Unicode string at the first occurrence of *sep*, and return
    a 3-tuple containing the part before the separator, the separator itself,
    and the part after the separator. If the separator is not found,
    return a 3-tuple containing the string itself, followed by two empty strings.

    *sep* must not be empty.

    On error, return `NULL` with an exception set.

    Equivalent to `str.partition()`.

PyObject \*PyUnicode\_RPartition(PyObject \*unicode, PyObject \*sep)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Similar to `PyUnicode_Partition()`, but split a Unicode string at the
    last occurrence of *sep*. If the separator is not found, return a 3-tuple
    containing two empty strings, followed by the string itself.

    *sep* must not be empty.

    On error, return `NULL` with an exception set.

    Equivalent to `str.rpartition()`.

PyObject \*PyUnicode\_Join(PyObject \*separator, PyObject \*seq)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Join a sequence of strings using the given *separator* and return the resulting
    Unicode string.

Py\_ssize\_t PyUnicode\_Tailmatch(PyObject \*unicode, PyObject \*substr, Py\_ssize\_t start, Py\_ssize\_t end, int direction)
:   *Part of the Stable ABI.*

    Return `1` if *substr* matches `unicode[start:end]` at the given tail end
    (*direction* == `-1` means to do a prefix match, *direction* == `1` a suffix match),
    `0` otherwise. Return `-1` if an error occurred.

Py\_ssize\_t PyUnicode\_Find(PyObject \*unicode, PyObject \*substr, Py\_ssize\_t start, Py\_ssize\_t end, int direction)
:   *Part of the Stable ABI.*

    Return the first position of *substr* in `unicode[start:end]` using the given
    *direction* (*direction* == `1` means to do a forward search, *direction* == `-1` a
    backward search). The return value is the index of the first match; a value of
    `-1` indicates that no match was found, and `-2` indicates that an error
    occurred and an exception has been set.

Py\_ssize\_t PyUnicode\_FindChar(PyObject \*unicode, Py\_UCS4 ch, Py\_ssize\_t start, Py\_ssize\_t end, int direction)
:   *Part of the Stable ABI since version 3.7.*

    Return the first position of the character *ch* in `unicode[start:end]` using
    the given *direction* (*direction* == `1` means to do a forward search,
    *direction* == `-1` a backward search). The return value is the index of the
    first match; a value of `-1` indicates that no match was found, and `-2`
    indicates that an error occurred and an exception has been set.

Py\_ssize\_t PyUnicode\_Count(PyObject \*unicode, PyObject \*substr, Py\_ssize\_t start, Py\_ssize\_t end)
:   *Part of the Stable ABI.*

    Return the number of non-overlapping occurrences of *substr* in
    `unicode[start:end]`. Return `-1` if an error occurred.

PyObject \*PyUnicode\_Replace(PyObject \*unicode, PyObject \*substr, PyObject \*replstr, Py\_ssize\_t maxcount)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Replace at most *maxcount* occurrences of *substr* in *unicode* with *replstr* and
    return the resulting Unicode object. *maxcount* == `-1` means replace all
    occurrences.

int PyUnicode\_Compare(PyObject \*left, PyObject \*right)
:   *Part of the Stable ABI.*

    Compare two strings and return `-1`, `0`, `1` for less than, equal, and greater than,
    respectively.

    This function returns `-1` upon failure, so one should call
    `PyErr_Occurred()` to check for errors.

    See also

    The `PyUnicode_Equal()` function.

int PyUnicode\_Equal(PyObject \*a, PyObject \*b)
:   *Part of the Stable ABI since version 3.14.*

    Test if two strings are equal:

    - Return `1` if *a* is equal to *b*.
    - Return `0` if *a* is not equal to *b*.
    - Set a `TypeError` exception and return `-1` if *a* or *b* is not a
      `str` object.

    The function always succeeds if *a* and *b* are `str` objects.

    The function works for `str` subclasses, but does not honor custom
    `__eq__()` method.

    See also

    The `PyUnicode_Compare()` function.

int PyUnicode\_EqualToUTF8AndSize(PyObject \*unicode, const char \*string, Py\_ssize\_t size)
:   *Part of the Stable ABI since version 3.13.*

    Compare a Unicode object with a char buffer which is interpreted as
    being UTF-8 or ASCII encoded and return true (`1`) if they are equal,
    or false (`0`) otherwise.
    If the Unicode object contains surrogate code points
    (`U+D800` - `U+DFFF`) or the C string is not valid UTF-8,
    false (`0`) is returned.

    This function does not raise exceptions.

int PyUnicode\_EqualToUTF8(PyObject \*unicode, const char \*string)
:   *Part of the Stable ABI since version 3.13.*

    Similar to `PyUnicode_EqualToUTF8AndSize()`, but compute *string*
    length using `strlen()`.
    If the Unicode object contains null characters, false (`0`) is returned.

int PyUnicode\_CompareWithASCIIString(PyObject \*unicode, const char \*string)
:   *Part of the Stable ABI.*

    Compare a Unicode object, *unicode*, with *string* and return `-1`, `0`, `1` for less
    than, equal, and greater than, respectively. It is best to pass only
    ASCII-encoded strings, but the function interprets the input string as
    ISO-8859-1 if it contains non-ASCII characters.

    This function does not raise exceptions.

PyObject \*PyUnicode\_RichCompare(PyObject \*left, PyObject \*right, int op)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Rich compare two Unicode strings and return one of the following:

    - `NULL` in case an exception was raised
    - `Py_True` or `Py_False` for successful comparisons
    - `Py_NotImplemented` in case the type combination is unknown

    Possible values for *op* are `Py_GT`, `Py_GE`, `Py_EQ`,
    `Py_NE`, `Py_LT`, and `Py_LE`.

PyObject \*PyUnicode\_Format(PyObject \*format, PyObject \*args)
:   *Return value: New reference.* *Part of the Stable ABI.*

    Return a new string object from *format* and *args*; this is analogous to
    `format % args`.

int PyUnicode\_Contains(PyObject \*unicode, PyObject \*substr)
:   *Part of the Stable ABI.*

    Check whether *substr* is contained in *unicode* and return true or false
    accordingly.

    *substr* has to coerce to a one element Unicode string. `-1` is returned
    if there was an error.

void PyUnicode\_InternInPlace(PyObject \*\*p\_unicode)
:   *Part of the Stable ABI.*

    Intern the argument \*p\_unicode in place. The argument must be the address of a
    pointer variable pointing to a Python Unicode string object. If there is an
    existing interned string that is the same as \*p\_unicode, it sets \*p\_unicode to
    it (releasing the reference to the old string object and creating a new
    strong reference to the interned string object), otherwise it leaves
    \*p\_unicode alone and interns it.

    (Clarification: even though there is a lot of talk about references, think
    of this function as reference-neutral. You must own the object you pass in;
    after the call you no longer own the passed-in reference, but you newly own
    the result.)

    This function never raises an exception.
    On error, it leaves its argument unchanged without interning it.

    Instances of subclasses of `str` may not be interned, that is,
    PyUnicode\_CheckExact(\*p\_unicode) must be true. If it is not,
    then – as with any other error – the argument is left unchanged.

    Note that interned strings are not “immortal”.
    You must keep a reference to the result to benefit from interning.

PyObject \*PyUnicode\_InternFromString(const char \*str)
:   *Return value: New reference.* *Part of the Stable ABI.*

    A combination of `PyUnicode_FromString()` and
    `PyUnicode_InternInPlace()`, meant for statically allocated strings.

    Return a new (“owned”) reference to either a new Unicode string object
    that has been interned, or an earlier interned string object with the
    same value.

    Python may keep a reference to the result, or make it immortal,
    preventing it from being garbage-collected promptly.
    For interning an unbounded number of different strings, such as ones coming
    from user input, prefer calling `PyUnicode_FromString()` and
    `PyUnicode_InternInPlace()` directly.

unsigned int PyUnicode\_CHECK\_INTERNED(PyObject \*str)
:   Return a non-zero value if *str* is interned, zero if not.
    The *str* argument must be a string; this is not checked.
    This function always succeeds.

    **CPython implementation detail:** A non-zero return value may carry additional information
    about *how* the string is interned.
    The meaning of such non-zero values, as well as each specific string’s
    intern-related details, may change between CPython versions.

## PyUnicodeWriter

The `PyUnicodeWriter` API can be used to create a Python `str`
object.

type PyUnicodeWriter
:   A Unicode writer instance.

    The instance must be destroyed by `PyUnicodeWriter_Finish()` on
    success, or `PyUnicodeWriter_Discard()` on error.

    The API is **not thread safe**. To share a writer with multiple threads, a
    critical section or a lock is needed.

PyUnicodeWriter \*PyUnicodeWriter\_Create(Py\_ssize\_t length)
:   Create a Unicode writer instance.

    *length* must be greater than or equal to `0`.

    If *length* is greater than `0`, preallocate an internal buffer of
    *length* characters.

    Set an exception and return `NULL` on error.

PyObject \*PyUnicodeWriter\_Finish(PyUnicodeWriter \*writer)
:   Return the final Python `str` object and destroy the writer instance.

    Set an exception and return `NULL` on error.

    The writer instance is invalid after this call.

void PyUnicodeWriter\_Discard(PyUnicodeWriter \*writer)
:   Discard the internal Unicode buffer and destroy the writer instance.

    If *writer* is `NULL`, no operation is performed.

    The writer instance is invalid after this call.

int PyUnicodeWriter\_WriteChar(PyUnicodeWriter \*writer, Py\_UCS4 ch)
:   Write the single Unicode character *ch* into *writer*.

    On success, return `0`.
    On error, set an exception, leave the writer unchanged, and return `-1`.

int PyUnicodeWriter\_WriteUTF8(PyUnicodeWriter \*writer, const char \*str, Py\_ssize\_t size)
:   Decode the string *str* from UTF-8 in strict mode and write the output into *writer*.

    *size* is the string length in bytes. If *size* is equal to `-1`, call
    `strlen(str)` to get the string length.

    On success, return `0`.
    On error, set an exception, leave the writer unchanged, and return `-1`.

    See also `PyUnicodeWriter_DecodeUTF8Stateful()`.

int PyUnicodeWriter\_WriteASCII(PyUnicodeWriter \*writer, const char \*str, Py\_ssize\_t size)
:   Write the ASCII string *str* into *writer*.

    *size* is the string length in bytes. If *size* is equal to `-1`, call
    `strlen(str)` to get the string length.

    *str* must only contain ASCII characters. The behavior is undefined if
    *str* contains non-ASCII characters.

    On success, return `0`.
    On error, set an exception, leave the writer unchanged, and return `-1`.

int PyUnicodeWriter\_WriteWideChar(PyUnicodeWriter \*writer, const wchar\_t \*str, Py\_ssize\_t size)
:   Write the wide string *str* into *writer*.

    *size* is a number of wide characters. If *size* is equal to `-1`, call
    `wcslen(str)` to get the string length.

    On success, return `0`.
    On error, set an exception, leave the writer unchanged, and return `-1`.

int PyUnicodeWriter\_WriteUCS4(PyUnicodeWriter \*writer, const Py\_UCS4 \*str, Py\_ssize\_t size)
:   Write the UCS4 string *str* into *writer*.

    *size* is a number of UCS4 characters.

    All characters must be in range [U+0000; U+10ffff]. If the string contains
    invalid characters, the behavior is undefined.

    On success, return `0`.
    On error, set an exception, leave the writer unchanged, and return `-1`.

int PyUnicodeWriter\_WriteStr(PyUnicodeWriter \*writer, PyObject \*obj)
:   Call `PyObject_Str()` on *obj* and write the output into *writer*.

    On success, return `0`.
    On error, set an exception, leave the writer unchanged, and return `-1`.

    To write a `str` subclass which overrides the `__str__()`
    method, `PyUnicode_FromObject()` can be used to get the original
    string.

int PyUnicodeWriter\_WriteRepr(PyUnicodeWriter \*writer, PyObject \*obj)
:   Call `PyObject_Repr()` on *obj* and write the output into *writer*.

    If *obj* is `NULL`, write the string `"<NULL>"` into *writer*.

    On success, return `0`.
    On error, set an exception, leave the writer unchanged, and return `-1`.

int PyUnicodeWriter\_WriteSubstring(PyUnicodeWriter \*writer, PyObject \*str, Py\_ssize\_t start, Py\_ssize\_t end)
:   Write the substring `str[start:end]` into *writer*.

    *str* must be Python `str` object. *start* must be greater than or
    equal to 0, and less than or equal to *end*. *end* must be less than or
    equal to *str* length.

    On success, return `0`.
    On error, set an exception, leave the writer unchanged, and return `-1`.

int PyUnicodeWriter\_Format(PyUnicodeWriter \*writer, const char \*format, ...)
:   Similar to `PyUnicode_FromFormat()`, but write the output directly into *writer*.

    On success, return `0`.
    On error, set an exception, leave the writer unchanged, and return `-1`.

int PyUnicodeWriter\_DecodeUTF8Stateful(PyUnicodeWriter \*writer, const char \*string, Py\_ssize\_t length, const char \*errors, Py\_ssize\_t \*consumed)
:   Decode the string *str* from UTF-8 with *errors* error handler and write the
    output into *writer*.

    *size* is the string length in bytes. If *size* is equal to `-1`, call
    `strlen(str)` to get the string length.

    *errors* is an error handler name, such as
    `"replace"`. If *errors* is `NULL`, use the strict error handler.

    If *consumed* is not `NULL`, set *\*consumed* to the number of decoded
    bytes on success.
    If *consumed* is `NULL`, treat trailing incomplete UTF-8 byte sequences
    as an error.

    On success, return `0`.
    On error, set an exception, leave the writer unchanged, and return `-1`.

    See also `PyUnicodeWriter_WriteUTF8()`.

## Deprecated API

The following API is deprecated.

type Py\_UNICODE
:   This is a typedef of `wchar_t`, which is a 16-bit type or 32-bit type
    depending on the platform.
    Please use `wchar_t` directly instead.

    Deprecated since version 3.13, removed in version 3.15.

int PyUnicode\_READY(PyObject \*unicode)
:   Do nothing and return `0`.
    This API is kept only for backward compatibility, but there are no plans
    to remove it.

    Deprecated since version 3.10: This API does nothing since Python 3.12.
    Previously, this needed to be called for each string created using
    the old API (`PyUnicode_FromUnicode()` or similar).

unsigned int PyUnicode\_IS\_READY(PyObject \*unicode)
:   Do nothing and return `1`.
    This API is kept only for backward compatibility, but there are no plans
    to remove it.

    Deprecated since version 3.14: This API does nothing since Python 3.12.
    Previously, this could be called to check if
    `PyUnicode_READY()` is necessary.
