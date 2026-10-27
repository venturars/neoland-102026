---
page: c-api/codec.html
title: Codec registry and support functions
area: c-api
kind: guide
---

<!-- anchor: codec-registry-and-support-functions | type: section -->
# Codec registry and support functions

<!-- anchor: c.PyCodec_Register | type: c function -->
## `int PyCodec_Register(PyObject *search_function)`

*Part of the Stable ABI.*

Register a new codec search function.

As a side effect, this tries to load the `encodings` package, if not yet done, to make sure that it is always first in the list of search functions.

<!-- anchor: c.PyCodec_Unregister | type: c function -->
## `int PyCodec_Unregister(PyObject *search_function)`

*Part of the Stable ABI since version 3.10.*

Unregister a codec search function and clear the registry’s cache. If the search function is not registered, do nothing. Return 0 on success. Raise an exception and return -1 on error.

Added in version 3.10.

<!-- anchor: c.PyCodec_KnownEncoding | type: c function -->
## `int PyCodec_KnownEncoding(const char *encoding)`

*Part of the Stable ABI.*

Return `1` or `0` depending on whether there is a registered codec for the given *encoding*. This function always succeeds.

<!-- anchor: c.PyCodec_Encode | type: c function -->
## `PyObject *PyCodec_Encode(PyObject *object, const char *encoding, const char *errors)`

*Return value: New reference.**Part of the Stable ABI.*

Generic codec based encoding API.

*object* is passed through the encoder function found for the given *encoding* using the error handling method defined by *errors*. *errors* may be `NULL` to use the default method defined for the codec. Raises a `LookupError` if no encoder can be found.

<!-- anchor: c.PyCodec_Decode | type: c function -->
## `PyObject *PyCodec_Decode(PyObject *object, const char *encoding, const char *errors)`

*Return value: New reference.**Part of the Stable ABI.*

Generic codec based decoding API.

*object* is passed through the decoder function found for the given *encoding* using the error handling method defined by *errors*. *errors* may be `NULL` to use the default method defined for the codec. Raises a `LookupError` if no decoder can be found.

<!-- anchor: codec-lookup-api | type: section -->
## Codec lookup API

In the following functions, the *encoding* string is looked up converted to all lower-case characters, which makes encodings looked up through this mechanism effectively case-insensitive. If no codec is found, a `KeyError` is set and `NULL` returned.

<!-- anchor: c.PyCodec_Encoder | type: c function -->
### `PyObject *PyCodec_Encoder(const char *encoding)`

*Return value: New reference.**Part of the Stable ABI.*

Get an encoder function for the given *encoding*.

<!-- anchor: c.PyCodec_Decoder | type: c function -->
### `PyObject *PyCodec_Decoder(const char *encoding)`

*Return value: New reference.**Part of the Stable ABI.*

Get a decoder function for the given *encoding*.

<!-- anchor: c.PyCodec_IncrementalEncoder | type: c function -->
### `PyObject *PyCodec_IncrementalEncoder(const char *encoding, const char *errors)`

*Return value: New reference.**Part of the Stable ABI.*

Get an `IncrementalEncoder` object for the given *encoding*.

<!-- anchor: c.PyCodec_IncrementalDecoder | type: c function -->
### `PyObject *PyCodec_IncrementalDecoder(const char *encoding, const char *errors)`

*Return value: New reference.**Part of the Stable ABI.*

Get an `IncrementalDecoder` object for the given *encoding*.

<!-- anchor: c.PyCodec_StreamReader | type: c function -->
### `PyObject *PyCodec_StreamReader(const char *encoding, PyObject *stream, const char *errors)`

*Return value: New reference.**Part of the Stable ABI.*

Get a `StreamReader` factory function for the given *encoding*.

<!-- anchor: c.PyCodec_StreamWriter | type: c function -->
### `PyObject *PyCodec_StreamWriter(const char *encoding, PyObject *stream, const char *errors)`

*Return value: New reference.**Part of the Stable ABI.*

Get a `StreamWriter` factory function for the given *encoding*.

<!-- anchor: registry-api-for-unicode-encoding-error-handlers | type: section -->
## Registry API for Unicode encoding error handlers

<!-- anchor: c.PyCodec_RegisterError | type: c function -->
### `int PyCodec_RegisterError(const char *name, PyObject *error)`

*Part of the Stable ABI.*

Register the error handling callback function *error* under the given *name*. This callback function will be called by a codec when it encounters unencodable characters/undecodable bytes and *name* is specified as the error parameter in the call to the encode/decode function.

The callback gets a single argument, an instance of `UnicodeEncodeError`, `UnicodeDecodeError` or `UnicodeTranslateError` that holds information about the problematic sequence of characters or bytes and their offset in the original string (see Unicode Exception Objects for functions to extract this information). The callback must either raise the given exception, or return a two-item tuple containing the replacement for the problematic sequence, and an integer giving the offset in the original string at which encoding/decoding should be resumed.

Return `0` on success, `-1` on error.

<!-- anchor: c.PyCodec_LookupError | type: c function -->
### `PyObject *PyCodec_LookupError(const char *name)`

*Return value: New reference.**Part of the Stable ABI.*

Lookup the error handling callback function registered under *name*. As a special case `NULL` can be passed, in which case the error handling callback for “strict” will be returned.

<!-- anchor: c.PyCodec_StrictErrors | type: c function -->
### `PyObject *PyCodec_StrictErrors(PyObject *exc)`

*Return value: Always NULL.**Part of the Stable ABI.*

Raise *exc* as an exception.

<!-- anchor: c.PyCodec_IgnoreErrors | type: c function -->
### `PyObject *PyCodec_IgnoreErrors(PyObject *exc)`

*Return value: New reference.**Part of the Stable ABI.*

Ignore the unicode error, skipping the faulty input.

<!-- anchor: c.PyCodec_ReplaceErrors | type: c function -->
### `PyObject *PyCodec_ReplaceErrors(PyObject *exc)`

*Return value: New reference.**Part of the Stable ABI.*

Replace the unicode encode error with `?` or `U+FFFD`.

<!-- anchor: c.PyCodec_XMLCharRefReplaceErrors | type: c function -->
### `PyObject *PyCodec_XMLCharRefReplaceErrors(PyObject *exc)`

*Return value: New reference.**Part of the Stable ABI.*

Replace the unicode encode error with XML character references.

<!-- anchor: c.PyCodec_BackslashReplaceErrors | type: c function -->
### `PyObject *PyCodec_BackslashReplaceErrors(PyObject *exc)`

*Return value: New reference.**Part of the Stable ABI.*

Replace the unicode encode error with backslash escapes (`\x`, `\u` and `\U`).

<!-- anchor: c.PyCodec_NameReplaceErrors | type: c function -->
### `PyObject *PyCodec_NameReplaceErrors(PyObject *exc)`

*Return value: New reference.**Part of the Stable ABI since version 3.7.*

Replace the unicode encode error with `\N{...}` escapes.

Added in version 3.5.

<!-- anchor: codec-utility-variables | type: section -->
## Codec utility variables

<!-- anchor: c.Py_hexdigits | type: c var -->
### `const char *Py_hexdigits`

A string constant containing the lowercase hexadecimal digits: `"0123456789abcdef"`.

Added in version 3.3.
