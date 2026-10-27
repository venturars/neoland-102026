---
page: library/urllib.error.html
title: urllib.error — Exception classes raised by urllib.request
area: library
kind: guide
module: urllib.error
---

<!-- anchor: module-urllib.error | type: section -->
# `urllib.error` — Exception classes raised by urllib.request

**Source code:** Lib/urllib/error.py

The `urllib.error` module defines the exception classes for exceptions raised by `urllib.request`. The base exception class is `URLError`.

The following exceptions are raised by `urllib.error` as appropriate:

<!-- anchor: urllib.error.URLError | type: py exception -->
## `exception urllib.error.URLError`

The handlers raise this exception (or derived exceptions) when they run into a problem. It is a subclass of `OSError`.

<!-- anchor: urllib.error.URLError.reason | type: py attribute -->
### `reason`

The reason for this error. It can be a message string or another exception instance.

Changed in version 3.3: `URLError` used to be a subtype of `IOError`, which is now an alias of `OSError`.

<!-- anchor: urllib.error.HTTPError | type: py exception -->
## `exception urllib.error.HTTPError(url, code, msg, hdrs, fp)`

Though being an exception (a subclass of `URLError`), an `HTTPError` can also function as a non-exceptional file-like return value (the same thing that `urlopen()` returns). This is useful when handling exotic HTTP errors, such as requests for authentication.

<!-- anchor: urllib.error.HTTPError.url | type: py attribute -->
### `url`

Contains the request URL. An alias for *filename* attribute.

<!-- anchor: urllib.error.HTTPError.code | type: py attribute -->
### `code`

An HTTP status code as defined in **RFC 2616**. This numeric value corresponds to a value found in the dictionary of codes as found in `http.server.BaseHTTPRequestHandler.responses`.

<!-- anchor: urllib.error.HTTPError.reason | type: py attribute -->
### `reason`

This is usually a string explaining the reason for this error. An alias for *msg* attribute.

<!-- anchor: urllib.error.HTTPError.headers | type: py attribute -->
### `headers`

The HTTP response headers for the HTTP request that caused the `HTTPError`. An alias for *hdrs* attribute.

Added in version 3.4.

<!-- anchor: urllib.error.HTTPError.fp | type: py attribute -->
### `fp`

A file-like object where the HTTP error body can be read from.

<!-- anchor: urllib.error.ContentTooShortError | type: py exception -->
## `exception urllib.error.ContentTooShortError(msg, content)`

This exception is raised when the `urlretrieve()` function detects that the amount of the downloaded data is less than the expected amount (given by the *Content-Length* header).

<!-- anchor: urllib.error.ContentTooShortError.content | type: py attribute -->
### `content`

The downloaded (and supposedly truncated) data.
