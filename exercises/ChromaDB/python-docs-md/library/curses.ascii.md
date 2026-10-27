---
page: library/curses.ascii.html
title: curses.ascii — Utilities for ASCII characters
area: library
kind: guide
module: curses.ascii
---

<!-- anchor: module-curses.ascii | type: section -->
# `curses.ascii` — Utilities for ASCII characters

**Source code:** Lib/curses/ascii.py

The `curses.ascii` module supplies name constants for ASCII characters and functions to test membership in various ASCII character classes. The constants supplied are names for control characters as follows:

| Name | Meaning |
| --- | --- |
| `curses.ascii.NUL` |  |
| `curses.ascii.SOH` | Start of heading, console interrupt |
| `curses.ascii.STX` | Start of text |
| `curses.ascii.ETX` | End of text |
| `curses.ascii.EOT` | End of transmission |
| `curses.ascii.ENQ` | Enquiry, goes with `ACK` flow control |
| `curses.ascii.ACK` | Acknowledgement |
| `curses.ascii.BEL` | Bell |
| `curses.ascii.BS` | Backspace |
| `curses.ascii.TAB` | Tab |
| `curses.ascii.HT` | Alias for `TAB`: “Horizontal tab” |
| `curses.ascii.LF` | Line feed |
| `curses.ascii.NL` | Alias for `LF`: “New line” |
| `curses.ascii.VT` | Vertical tab |
| `curses.ascii.FF` | Form feed |
| `curses.ascii.CR` | Carriage return |
| `curses.ascii.SO` | Shift-out, begin alternate character set |
| `curses.ascii.SI` | Shift-in, resume default character set |
| `curses.ascii.DLE` | Data-link escape |
| `curses.ascii.DC1` | XON, for flow control |
| `curses.ascii.DC2` | Device control 2, block-mode flow control |
| `curses.ascii.DC3` | XOFF, for flow control |
| `curses.ascii.DC4` | Device control 4 |
| `curses.ascii.NAK` | Negative acknowledgement |
| `curses.ascii.SYN` | Synchronous idle |
| `curses.ascii.ETB` | End transmission block |
| `curses.ascii.CAN` | Cancel |
| `curses.ascii.EM` | End of medium |
| `curses.ascii.SUB` | Substitute |
| `curses.ascii.ESC` | Escape |
| `curses.ascii.FS` | File separator |
| `curses.ascii.GS` | Group separator |
| `curses.ascii.RS` | Record separator, block-mode terminator |
| `curses.ascii.US` | Unit separator |
| `curses.ascii.SP` | Space |
| `curses.ascii.DEL` | Delete |

Note that many of these have little practical significance in modern usage. The mnemonics derive from teleprinter conventions that predate digital computers.

The module supplies the following functions, patterned on those in the standard C library:

<!-- anchor: curses.ascii.isalnum | type: py function -->
## `curses.ascii.isalnum(c)`

Checks for an ASCII alphanumeric character; it is equivalent to `isalpha(c) or isdigit(c)`.

<!-- anchor: curses.ascii.isalpha | type: py function -->
## `curses.ascii.isalpha(c)`

Checks for an ASCII alphabetic character; it is equivalent to `isupper(c) or islower(c)`.

<!-- anchor: curses.ascii.isascii | type: py function -->
## `curses.ascii.isascii(c)`

Checks for a character value that fits in the 7-bit ASCII set.

<!-- anchor: curses.ascii.isblank | type: py function -->
## `curses.ascii.isblank(c)`

Checks for an ASCII blank character; space or horizontal tab.

<!-- anchor: curses.ascii.iscntrl | type: py function -->
## `curses.ascii.iscntrl(c)`

Checks for an ASCII control character (in the range 0x00 to 0x1f or 0x7f).

<!-- anchor: curses.ascii.isdigit | type: py function -->
## `curses.ascii.isdigit(c)`

Checks for an ASCII decimal digit, `'0'` through `'9'`. This is equivalent to `c in string.digits`.

<!-- anchor: curses.ascii.isgraph | type: py function -->
## `curses.ascii.isgraph(c)`

Checks for any ASCII printable character except space.

<!-- anchor: curses.ascii.islower | type: py function -->
## `curses.ascii.islower(c)`

Checks for an ASCII lower-case character.

<!-- anchor: curses.ascii.isprint | type: py function -->
## `curses.ascii.isprint(c)`

Checks for any ASCII printable character including space.

<!-- anchor: curses.ascii.ispunct | type: py function -->
## `curses.ascii.ispunct(c)`

Checks for any ASCII printable character which is not a space or an alphanumeric character.

<!-- anchor: curses.ascii.isspace | type: py function -->
## `curses.ascii.isspace(c)`

Checks for ASCII white-space characters; space, line feed, carriage return, form feed, horizontal tab, vertical tab.

<!-- anchor: curses.ascii.isupper | type: py function -->
## `curses.ascii.isupper(c)`

Checks for an ASCII uppercase letter.

<!-- anchor: curses.ascii.isxdigit | type: py function -->
## `curses.ascii.isxdigit(c)`

Checks for an ASCII hexadecimal digit. This is equivalent to `c in string.hexdigits`.

<!-- anchor: curses.ascii.isctrl | type: py function -->
## `curses.ascii.isctrl(c)`

Checks for an ASCII control character (ordinal values 0 to 31). Unlike `iscntrl()`, this does not include the delete character (0x7f).

<!-- anchor: curses.ascii.ismeta | type: py function -->
## `curses.ascii.ismeta(c)`

Checks for a non-ASCII character (ordinal values 0x80 and above).

These functions accept either integers or single-character strings; when the argument is a string, it is first converted using the built-in function `ord()`.

Note that all these functions check ordinal bit values derived from the character of the string you pass in; they do not actually know anything about the host machine’s character encoding.

The following two functions take either a single-character string or integer byte value; they return a value of the same type.

<!-- anchor: curses.ascii.ascii | type: py function -->
## `curses.ascii.ascii(c)`

Return the ASCII value corresponding to the low 7 bits of *c*.

<!-- anchor: curses.ascii.ctrl | type: py function -->
## `curses.ascii.ctrl(c)`

Return the control character corresponding to the given character (the character bit value is bitwise-anded with 0x1f).

<!-- anchor: curses.ascii.alt | type: py function -->
## `curses.ascii.alt(c)`

Return the 8-bit character corresponding to the given ASCII character (the character bit value is bitwise-ored with 0x80).

The following function takes either a single-character string or integer value; it returns a string.

<!-- anchor: curses.ascii.unctrl | type: py function -->
## `curses.ascii.unctrl(c)`

Return a string representation of the ASCII character *c*. If *c* is printable, this string is the character itself. If the character is a control character (0x00–0x1f) the string consists of a caret (`'^'`) followed by the corresponding uppercase letter. If the character is an ASCII delete (0x7f) the string is `'^?'`. If the character has its meta bit (0x80) set, the meta bit is stripped, the preceding rules applied, and `'!'` prepended to the result.

<!-- anchor: curses.ascii.controlnames | type: py data -->
## `curses.ascii.controlnames`

A 33-element string array that contains the ASCII mnemonics for the thirty-two ASCII control characters from 0 (NUL) to 0x1f (US), in order, plus the mnemonic `SP` for the space character.
