---
page: library/email.errors.html
title: email.errors: Exception and Defect classes
area: library
kind: guide
module: email.errors
---

<!-- anchor: module-email.errors | type: section -->
# `email.errors`: Exception and Defect classes

**Source code:** Lib/email/errors.py

The following exception classes are defined in the `email.errors` module:

<!-- anchor: email.errors.MessageError | type: py exception -->
## `exception email.errors.MessageError`

This is the base class for all exceptions that the `email` package can raise. It is derived from the standard `Exception` class and defines no additional methods.

<!-- anchor: email.errors.MessageParseError | type: py exception -->
## `exception email.errors.MessageParseError`

This is the base class for exceptions raised by the `Parser` class. It is derived from `MessageError`. This class is also used internally by the parser used by `headerregistry`.

<!-- anchor: email.errors.HeaderParseError | type: py exception -->
## `exception email.errors.HeaderParseError`

Raised under some error conditions when parsing the **RFC 5322** headers of a message, this class is derived from `MessageParseError`. The `set_boundary()` method will raise this error if the content type is unknown when the method is called. `Header` may raise this error for certain base64 decoding errors, and when an attempt is made to create a header that appears to contain an embedded header (that is, there is what is supposed to be a continuation line that has no leading whitespace and looks like a header).

<!-- anchor: email.errors.BoundaryError | type: py exception -->
## `exception email.errors.BoundaryError`

Deprecated and no longer used.

<!-- anchor: email.errors.MultipartConversionError | type: py exception -->
## `exception email.errors.MultipartConversionError`

Raised if the `attach()` method is called on an instance of a class derived from `MIMENonMultipart` (e.g. `MIMEImage`). `MultipartConversionError` multiply inherits from `MessageError` and the built-in `TypeError`.

<!-- anchor: email.errors.HeaderWriteError | type: py exception -->
## `exception email.errors.HeaderWriteError`

Raised when an error occurs when the `generator` outputs headers.

<!-- anchor: email.errors.MessageDefect | type: py exception -->
## `exception email.errors.MessageDefect`

This is the base class for all defects found when parsing email messages. It is derived from `ValueError`.

<!-- anchor: email.errors.HeaderDefect | type: py exception -->
## `exception email.errors.HeaderDefect`

This is the base class for all defects found when parsing email headers. It is derived from `MessageDefect`.

Here is the list of the defects that the `FeedParser` can find while parsing messages. Note that the defects are added to the message where the problem was found, so for example, if a message nested inside a *multipart/alternative* had a malformed header, that nested message object would have a defect, but the containing messages would not.

All defect classes are subclassed from `email.errors.MessageDefect`.

<!-- anchor: email.errors.NoBoundaryInMultipartDefect | type: py exception -->
## `exception email.errors.NoBoundaryInMultipartDefect`

A message claimed to be a multipart, but had no *boundary* parameter.

<!-- anchor: email.errors.StartBoundaryNotFoundDefect | type: py exception -->
## `exception email.errors.StartBoundaryNotFoundDefect`

The start boundary claimed in the *Content-Type* header was never found.

<!-- anchor: email.errors.CloseBoundaryNotFoundDefect | type: py exception -->
## `exception email.errors.CloseBoundaryNotFoundDefect`

A start boundary was found, but no corresponding close boundary was ever found.

Added in version 3.3.

<!-- anchor: email.errors.FirstHeaderLineIsContinuationDefect | type: py exception -->
## `exception email.errors.FirstHeaderLineIsContinuationDefect`

The message had a continuation line as its first header line.

<!-- anchor: email.errors.MisplacedEnvelopeHeaderDefect | type: py exception -->
## `exception email.errors.MisplacedEnvelopeHeaderDefect`

A “Unix From” header was found in the middle of a header block.

<!-- anchor: email.errors.MissingHeaderBodySeparatorDefect | type: py exception -->
## `exception email.errors.MissingHeaderBodySeparatorDefect`

A line was found while parsing headers that had no leading white space but contained no ‘:’. Parsing continues assuming that the line represents the first line of the body.

Added in version 3.3.

<!-- anchor: email.errors.MalformedHeaderDefect | type: py exception -->
## `exception email.errors.MalformedHeaderDefect`

A header was found that was missing a colon, or was otherwise malformed.

Deprecated since version 3.3: This defect has not been used for several Python versions.

<!-- anchor: email.errors.MultipartInvariantViolationDefect | type: py exception -->
## `exception email.errors.MultipartInvariantViolationDefect`

A message claimed to be a *multipart*, but no subparts were found. Note that when a message has this defect, its `is_multipart()` method may return `False` even though its content type claims to be *multipart*.

<!-- anchor: email.errors.InvalidBase64PaddingDefect | type: py exception -->
## `exception email.errors.InvalidBase64PaddingDefect`

When decoding a block of base64 encoded bytes, the padding was not correct. Enough padding is added to perform the decode, but the resulting decoded bytes may be invalid.

<!-- anchor: email.errors.InvalidBase64CharactersDefect | type: py exception -->
## `exception email.errors.InvalidBase64CharactersDefect`

When decoding a block of base64 encoded bytes, characters outside the base64 alphabet were encountered. The characters are ignored, but the resulting decoded bytes may be invalid.

<!-- anchor: email.errors.InvalidBase64LengthDefect | type: py exception -->
## `exception email.errors.InvalidBase64LengthDefect`

When decoding a block of base64 encoded bytes, the number of non-padding base64 characters was invalid (1 more than a multiple of 4). The encoded block was kept as-is.

<!-- anchor: email.errors.InvalidDateDefect | type: py exception -->
## `exception email.errors.InvalidDateDefect`

When decoding an invalid or unparsable date field. The original value is kept as-is.
