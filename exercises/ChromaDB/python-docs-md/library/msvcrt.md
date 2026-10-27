---
page: library/msvcrt.html
title: msvcrt — Useful routines from the MS VC++ runtime
area: library
kind: guide
module: msvcrt
---

<!-- anchor: module-msvcrt | type: section -->
# `msvcrt` — Useful routines from the MS VC++ runtime

**Source code:** PC/msvcrtmodule.c

These functions provide access to some useful capabilities on Windows platforms. Some higher-level modules use these functions to build the Windows implementations of their services. For example, the `getpass` module uses this in the implementation of the `getpass()` function.

Further documentation on these functions can be found in the Platform API documentation.

The module implements both the normal and wide char variants of the console I/O api. The normal API deals only with ASCII characters and is of limited use for internationalized applications. The wide char API should be used where ever possible.

Availability: Windows.

Changed in version 3.3: Operations in this module now raise `OSError` where `IOError` was raised.

<!-- anchor: file-operations | type: section -->
## File Operations

<!-- anchor: msvcrt.locking | type: py function -->
### `msvcrt.locking(fd, mode, nbytes)`

Lock part of a file based on file descriptor *fd* from the C runtime. Raises `OSError` on failure. The locked region of the file extends from the current file position for *nbytes* bytes, and may continue beyond the end of the file. *mode* must be one of the `LK_*` constants listed below. Multiple regions in a file may be locked at the same time, but may not overlap. Adjacent regions are not merged; they must be unlocked individually.

Raises an auditing event `msvcrt.locking` with arguments `fd`, `mode`, `nbytes`.

<!-- anchor: msvcrt.LK_LOCK | type: py data -->
### `msvcrt.LK_LOCK`

`msvcrt.LK_RLCK`

Locks the specified bytes. If the bytes cannot be locked, the program immediately tries again after 1 second. If, after 10 attempts, the bytes cannot be locked, `OSError` is raised.

<!-- anchor: msvcrt.LK_NBLCK | type: py data -->
### `msvcrt.LK_NBLCK`

`msvcrt.LK_NBRLCK`

Locks the specified bytes. If the bytes cannot be locked, `OSError` is raised.

<!-- anchor: msvcrt.LK_UNLCK | type: py data -->
### `msvcrt.LK_UNLCK`

Unlocks the specified bytes, which must have been previously locked.

<!-- anchor: msvcrt.setmode | type: py function -->
### `msvcrt.setmode(fd, flags)`

Set the line-end translation mode for the file descriptor *fd*. To set it to text mode, *flags* should be `os.O_TEXT`; for binary, it should be `os.O_BINARY`.

<!-- anchor: msvcrt.open_osfhandle | type: py function -->
### `msvcrt.open_osfhandle(handle, flags)`

Create a C runtime file descriptor from the file handle *handle*. The *flags* parameter should be a bitwise OR of `os.O_APPEND`, `os.O_RDONLY`, `os.O_TEXT` and `os.O_NOINHERIT`. The returned file descriptor may be used as a parameter to `os.fdopen()` to create a file object.

The file descriptor is inheritable by default. Pass `os.O_NOINHERIT` flag to make it non inheritable.

Raises an auditing event `msvcrt.open_osfhandle` with arguments `handle`, `flags`.

<!-- anchor: msvcrt.get_osfhandle | type: py function -->
### `msvcrt.get_osfhandle(fd)`

Return the file handle for the file descriptor *fd*. Raises `OSError` if *fd* is not recognized.

Raises an auditing event `msvcrt.get_osfhandle` with argument `fd`.

<!-- anchor: console-i-o | type: section -->
## Console I/O

<!-- anchor: msvcrt.kbhit | type: py function -->
### `msvcrt.kbhit()`

Returns a nonzero value if a keypress is waiting to be read. Otherwise, return 0.

<!-- anchor: msvcrt.getch | type: py function -->
### `msvcrt.getch()`

Read a keypress and return the resulting character as a byte string. Nothing is echoed to the console. This call will block if a keypress is not already available, but will not wait for `Enter` to be pressed. If the pressed key was a special function key, this will return `'\000'` or `'\xe0'`; the next call will return the keycode. The `Control`-`C` keypress cannot be read with this function.

<!-- anchor: msvcrt.getwch | type: py function -->
### `msvcrt.getwch()`

Wide char variant of `getch()`, returning a Unicode value.

<!-- anchor: msvcrt.getche | type: py function -->
### `msvcrt.getche()`

Similar to `getch()`, but the keypress will be echoed if it represents a printable character.

<!-- anchor: msvcrt.getwche | type: py function -->
### `msvcrt.getwche()`

Wide char variant of `getche()`, returning a Unicode value.

<!-- anchor: msvcrt.putch | type: py function -->
### `msvcrt.putch(char)`

Print the byte string *char* to the console without buffering.

<!-- anchor: msvcrt.putwch | type: py function -->
### `msvcrt.putwch(unicode_char)`

Wide char variant of `putch()`, accepting a Unicode value.

<!-- anchor: msvcrt.ungetch | type: py function -->
### `msvcrt.ungetch(char)`

Cause the byte string *char* to be “pushed back” into the console buffer; it will be the next character read by `getch()` or `getche()`.

<!-- anchor: msvcrt.ungetwch | type: py function -->
### `msvcrt.ungetwch(unicode_char)`

Wide char variant of `ungetch()`, accepting a Unicode value.

<!-- anchor: other-functions | type: section -->
## Other Functions

<!-- anchor: msvcrt.heapmin | type: py function -->
### `msvcrt.heapmin()`

Force the `malloc()` heap to clean itself up and return unused blocks to the operating system. On failure, this raises `OSError`.

<!-- anchor: msvcrt.set_error_mode | type: py function -->
### `msvcrt.set_error_mode(mode)`

Changes the location where the C runtime writes an error message for an error that might end the program. *mode* must be one of the `OUT_*` constants listed below or `REPORT_ERRMODE`. Returns the old setting or -1 if an error occurs. Only available in debug build of Python.

<!-- anchor: msvcrt.OUT_TO_DEFAULT | type: py data -->
### `msvcrt.OUT_TO_DEFAULT`

Error sink is determined by the app’s type. Only available in debug build of Python.

<!-- anchor: msvcrt.OUT_TO_STDERR | type: py data -->
### `msvcrt.OUT_TO_STDERR`

Error sink is a standard error. Only available in debug build of Python.

<!-- anchor: msvcrt.OUT_TO_MSGBOX | type: py data -->
### `msvcrt.OUT_TO_MSGBOX`

Error sink is a message box. Only available in debug build of Python.

<!-- anchor: msvcrt.REPORT_ERRMODE | type: py data -->
### `msvcrt.REPORT_ERRMODE`

Report the current error mode value. Only available in debug build of Python.

<!-- anchor: msvcrt.CrtSetReportMode | type: py function -->
### `msvcrt.CrtSetReportMode(type, mode)`

Specifies the destination or destinations for a specific report type generated by `_CrtDbgReport()` in the MS VC++ runtime. *type* must be one of the `CRT_*` constants listed below. *mode* must be one of the `CRTDBG_*` constants listed below. Only available in debug build of Python.

<!-- anchor: msvcrt.CrtSetReportFile | type: py function -->
### `msvcrt.CrtSetReportFile(type, file)`

After you use `CrtSetReportMode()` to specify `CRTDBG_MODE_FILE`, you can specify the file handle to receive the message text. *type* must be one of the `CRT_*` constants listed below. *file* should be the file handle your want specified. Only available in debug build of Python.

<!-- anchor: msvcrt.CRT_WARN | type: py data -->
### `msvcrt.CRT_WARN`

Warnings, messages, and information that doesn’t need immediate attention.

<!-- anchor: msvcrt.CRT_ERROR | type: py data -->
### `msvcrt.CRT_ERROR`

Errors, unrecoverable problems, and issues that require immediate attention.

<!-- anchor: msvcrt.CRT_ASSERT | type: py data -->
### `msvcrt.CRT_ASSERT`

Assertion failures.

<!-- anchor: msvcrt.CRTDBG_MODE_DEBUG | type: py data -->
### `msvcrt.CRTDBG_MODE_DEBUG`

Writes the message to the debugger’s output window.

<!-- anchor: msvcrt.CRTDBG_MODE_FILE | type: py data -->
### `msvcrt.CRTDBG_MODE_FILE`

Writes the message to a user-supplied file handle. `CrtSetReportFile()` should be called to define the specific file or stream to use as the destination.

<!-- anchor: msvcrt.CRTDBG_MODE_WNDW | type: py data -->
### `msvcrt.CRTDBG_MODE_WNDW`

Creates a message box to display the message along with the `Abort`, `Retry`, and `Ignore` buttons.

<!-- anchor: msvcrt.CRTDBG_REPORT_MODE | type: py data -->
### `msvcrt.CRTDBG_REPORT_MODE`

Returns current *mode* for the specified *type*.

<!-- anchor: msvcrt.CRT_ASSEMBLY_VERSION | type: py data -->
### `msvcrt.CRT_ASSEMBLY_VERSION`

The CRT Assembly version, from the `crtassem.h` header file.

<!-- anchor: msvcrt.VC_ASSEMBLY_PUBLICKEYTOKEN | type: py data -->
### `msvcrt.VC_ASSEMBLY_PUBLICKEYTOKEN`

The VC Assembly public key token, from the `crtassem.h` header file.

<!-- anchor: msvcrt.LIBRARIES_ASSEMBLY_NAME_PREFIX | type: py data -->
### `msvcrt.LIBRARIES_ASSEMBLY_NAME_PREFIX`

The Libraries Assembly name prefix, from the `crtassem.h` header file.
