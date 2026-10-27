---
page: library/errno.html
title: errno — Standard errno system symbols
area: library
kind: guide
module: errno
---

<!-- anchor: module-errno | type: section -->
# `errno` — Standard errno system symbols

This module makes available standard `errno` system symbols. The value of each symbol is the corresponding integer value. The names and descriptions are borrowed from `linux/include/errno.h`, which should be all-inclusive.

<!-- anchor: errno.errorcode | type: py data -->
## `errno.errorcode`

Dictionary providing a mapping from the errno value to the string name in the underlying system. For instance, `errno.errorcode[errno.EPERM]` maps to `'EPERM'`.

To translate a numeric error code to an error message, use `os.strerror()`.

Of the following list, symbols that are not used on the current platform are not defined by the module. The specific list of defined symbols is available as `errno.errorcode.keys()`. Symbols available can include:

<!-- anchor: errno.EPERM | type: py data -->
## `errno.EPERM`

Operation not permitted. This error is mapped to the exception `PermissionError`.

<!-- anchor: errno.ENOENT | type: py data -->
## `errno.ENOENT`

No such file or directory. This error is mapped to the exception `FileNotFoundError`.

<!-- anchor: errno.ESRCH | type: py data -->
## `errno.ESRCH`

No such process. This error is mapped to the exception `ProcessLookupError`.

<!-- anchor: errno.EINTR | type: py data -->
## `errno.EINTR`

Interrupted system call. This error is mapped to the exception `InterruptedError`.

<!-- anchor: errno.EIO | type: py data -->
## `errno.EIO`

I/O error

<!-- anchor: errno.ENXIO | type: py data -->
## `errno.ENXIO`

No such device or address

<!-- anchor: errno.E2BIG | type: py data -->
## `errno.E2BIG`

Arg list too long

<!-- anchor: errno.ENOEXEC | type: py data -->
## `errno.ENOEXEC`

Exec format error

<!-- anchor: errno.EBADF | type: py data -->
## `errno.EBADF`

Bad file number

<!-- anchor: errno.ECHILD | type: py data -->
## `errno.ECHILD`

No child processes. This error is mapped to the exception `ChildProcessError`.

<!-- anchor: errno.EAGAIN | type: py data -->
## `errno.EAGAIN`

Try again. This error is mapped to the exception `BlockingIOError`.

<!-- anchor: errno.ENOMEM | type: py data -->
## `errno.ENOMEM`

Out of memory

<!-- anchor: errno.EACCES | type: py data -->
## `errno.EACCES`

Permission denied. This error is mapped to the exception `PermissionError`.

<!-- anchor: errno.EFAULT | type: py data -->
## `errno.EFAULT`

Bad address

<!-- anchor: errno.ENOTBLK | type: py data -->
## `errno.ENOTBLK`

Block device required

<!-- anchor: errno.EBUSY | type: py data -->
## `errno.EBUSY`

Device or resource busy

<!-- anchor: errno.EEXIST | type: py data -->
## `errno.EEXIST`

File exists. This error is mapped to the exception `FileExistsError`.

<!-- anchor: errno.EXDEV | type: py data -->
## `errno.EXDEV`

Cross-device link

<!-- anchor: errno.ENODEV | type: py data -->
## `errno.ENODEV`

No such device

<!-- anchor: errno.ENOTDIR | type: py data -->
## `errno.ENOTDIR`

Not a directory. This error is mapped to the exception `NotADirectoryError`.

<!-- anchor: errno.EISDIR | type: py data -->
## `errno.EISDIR`

Is a directory. This error is mapped to the exception `IsADirectoryError`.

<!-- anchor: errno.EINVAL | type: py data -->
## `errno.EINVAL`

Invalid argument

<!-- anchor: errno.ENFILE | type: py data -->
## `errno.ENFILE`

File table overflow

<!-- anchor: errno.EMFILE | type: py data -->
## `errno.EMFILE`

Too many open files

<!-- anchor: errno.ENOTTY | type: py data -->
## `errno.ENOTTY`

Not a typewriter

<!-- anchor: errno.ETXTBSY | type: py data -->
## `errno.ETXTBSY`

Text file busy

<!-- anchor: errno.EFBIG | type: py data -->
## `errno.EFBIG`

File too large

<!-- anchor: errno.ENOSPC | type: py data -->
## `errno.ENOSPC`

No space left on device

<!-- anchor: errno.ESPIPE | type: py data -->
## `errno.ESPIPE`

Illegal seek

<!-- anchor: errno.EROFS | type: py data -->
## `errno.EROFS`

Read-only file system

<!-- anchor: errno.EMLINK | type: py data -->
## `errno.EMLINK`

Too many links

<!-- anchor: errno.EPIPE | type: py data -->
## `errno.EPIPE`

Broken pipe. This error is mapped to the exception `BrokenPipeError`.

<!-- anchor: errno.EDOM | type: py data -->
## `errno.EDOM`

Math argument out of domain of func

<!-- anchor: errno.ERANGE | type: py data -->
## `errno.ERANGE`

Math result not representable

<!-- anchor: errno.EDEADLK | type: py data -->
## `errno.EDEADLK`

Resource deadlock would occur

<!-- anchor: errno.ENAMETOOLONG | type: py data -->
## `errno.ENAMETOOLONG`

File name too long

<!-- anchor: errno.ENOLCK | type: py data -->
## `errno.ENOLCK`

No record locks available

<!-- anchor: errno.ENOSYS | type: py data -->
## `errno.ENOSYS`

Function not implemented

<!-- anchor: errno.ENOTEMPTY | type: py data -->
## `errno.ENOTEMPTY`

Directory not empty

<!-- anchor: errno.ELOOP | type: py data -->
## `errno.ELOOP`

Too many symbolic links encountered

<!-- anchor: errno.EWOULDBLOCK | type: py data -->
## `errno.EWOULDBLOCK`

Operation would block. This error is mapped to the exception `BlockingIOError`.

<!-- anchor: errno.ENOMSG | type: py data -->
## `errno.ENOMSG`

No message of desired type

<!-- anchor: errno.EIDRM | type: py data -->
## `errno.EIDRM`

Identifier removed

<!-- anchor: errno.ECHRNG | type: py data -->
## `errno.ECHRNG`

Channel number out of range

<!-- anchor: errno.EL2NSYNC | type: py data -->
## `errno.EL2NSYNC`

Level 2 not synchronized

<!-- anchor: errno.EL3HLT | type: py data -->
## `errno.EL3HLT`

Level 3 halted

<!-- anchor: errno.EL3RST | type: py data -->
## `errno.EL3RST`

Level 3 reset

<!-- anchor: errno.ELNRNG | type: py data -->
## `errno.ELNRNG`

Link number out of range

<!-- anchor: errno.EUNATCH | type: py data -->
## `errno.EUNATCH`

Protocol driver not attached

<!-- anchor: errno.ENOCSI | type: py data -->
## `errno.ENOCSI`

No CSI structure available

<!-- anchor: errno.EL2HLT | type: py data -->
## `errno.EL2HLT`

Level 2 halted

<!-- anchor: errno.EBADE | type: py data -->
## `errno.EBADE`

Invalid exchange

<!-- anchor: errno.EBADR | type: py data -->
## `errno.EBADR`

Invalid request descriptor

<!-- anchor: errno.EXFULL | type: py data -->
## `errno.EXFULL`

Exchange full

<!-- anchor: errno.ENOANO | type: py data -->
## `errno.ENOANO`

No anode

<!-- anchor: errno.EBADRQC | type: py data -->
## `errno.EBADRQC`

Invalid request code

<!-- anchor: errno.EBADSLT | type: py data -->
## `errno.EBADSLT`

Invalid slot

<!-- anchor: errno.EDEADLOCK | type: py data -->
## `errno.EDEADLOCK`

File locking deadlock error

<!-- anchor: errno.EBFONT | type: py data -->
## `errno.EBFONT`

Bad font file format

<!-- anchor: errno.ENOSTR | type: py data -->
## `errno.ENOSTR`

Device not a stream

<!-- anchor: errno.ENODATA | type: py data -->
## `errno.ENODATA`

No data available

<!-- anchor: errno.ETIME | type: py data -->
## `errno.ETIME`

Timer expired

<!-- anchor: errno.ENOSR | type: py data -->
## `errno.ENOSR`

Out of streams resources

<!-- anchor: errno.ENONET | type: py data -->
## `errno.ENONET`

Machine is not on the network

<!-- anchor: errno.ENOPKG | type: py data -->
## `errno.ENOPKG`

Package not installed

<!-- anchor: errno.EREMOTE | type: py data -->
## `errno.EREMOTE`

Object is remote

<!-- anchor: errno.ENOLINK | type: py data -->
## `errno.ENOLINK`

Link has been severed

<!-- anchor: errno.EADV | type: py data -->
## `errno.EADV`

Advertise error

<!-- anchor: errno.ESRMNT | type: py data -->
## `errno.ESRMNT`

Srmount error

<!-- anchor: errno.ECOMM | type: py data -->
## `errno.ECOMM`

Communication error on send

<!-- anchor: errno.EPROTO | type: py data -->
## `errno.EPROTO`

Protocol error

<!-- anchor: errno.EMULTIHOP | type: py data -->
## `errno.EMULTIHOP`

Multihop attempted

<!-- anchor: errno.EDOTDOT | type: py data -->
## `errno.EDOTDOT`

RFS specific error

<!-- anchor: errno.EBADMSG | type: py data -->
## `errno.EBADMSG`

Not a data message

<!-- anchor: errno.EOVERFLOW | type: py data -->
## `errno.EOVERFLOW`

Value too large for defined data type

<!-- anchor: errno.ENOTUNIQ | type: py data -->
## `errno.ENOTUNIQ`

Name not unique on network

<!-- anchor: errno.EBADFD | type: py data -->
## `errno.EBADFD`

File descriptor in bad state

<!-- anchor: errno.EREMCHG | type: py data -->
## `errno.EREMCHG`

Remote address changed

<!-- anchor: errno.ELIBACC | type: py data -->
## `errno.ELIBACC`

Can not access a needed shared library

<!-- anchor: errno.ELIBBAD | type: py data -->
## `errno.ELIBBAD`

Accessing a corrupted shared library

<!-- anchor: errno.ELIBSCN | type: py data -->
## `errno.ELIBSCN`

.lib section in a.out corrupted

<!-- anchor: errno.ELIBMAX | type: py data -->
## `errno.ELIBMAX`

Attempting to link in too many shared libraries

<!-- anchor: errno.ELIBEXEC | type: py data -->
## `errno.ELIBEXEC`

Cannot exec a shared library directly

<!-- anchor: errno.EILSEQ | type: py data -->
## `errno.EILSEQ`

Illegal byte sequence

<!-- anchor: errno.ERESTART | type: py data -->
## `errno.ERESTART`

Interrupted system call should be restarted

<!-- anchor: errno.ESTRPIPE | type: py data -->
## `errno.ESTRPIPE`

Streams pipe error

<!-- anchor: errno.EUSERS | type: py data -->
## `errno.EUSERS`

Too many users

<!-- anchor: errno.ENOTSOCK | type: py data -->
## `errno.ENOTSOCK`

Socket operation on non-socket

<!-- anchor: errno.EDESTADDRREQ | type: py data -->
## `errno.EDESTADDRREQ`

Destination address required

<!-- anchor: errno.EMSGSIZE | type: py data -->
## `errno.EMSGSIZE`

Message too long

<!-- anchor: errno.EPROTOTYPE | type: py data -->
## `errno.EPROTOTYPE`

Protocol wrong type for socket

<!-- anchor: errno.ENOPROTOOPT | type: py data -->
## `errno.ENOPROTOOPT`

Protocol not available

<!-- anchor: errno.EPROTONOSUPPORT | type: py data -->
## `errno.EPROTONOSUPPORT`

Protocol not supported

<!-- anchor: errno.ESOCKTNOSUPPORT | type: py data -->
## `errno.ESOCKTNOSUPPORT`

Socket type not supported

<!-- anchor: errno.EOPNOTSUPP | type: py data -->
## `errno.EOPNOTSUPP`

Operation not supported on transport endpoint

<!-- anchor: errno.ENOTSUP | type: py data -->
## `errno.ENOTSUP`

Operation not supported

Added in version 3.2.

<!-- anchor: errno.EPFNOSUPPORT | type: py data -->
## `errno.EPFNOSUPPORT`

Protocol family not supported

<!-- anchor: errno.EAFNOSUPPORT | type: py data -->
## `errno.EAFNOSUPPORT`

Address family not supported by protocol

<!-- anchor: errno.EADDRINUSE | type: py data -->
## `errno.EADDRINUSE`

Address already in use

<!-- anchor: errno.EADDRNOTAVAIL | type: py data -->
## `errno.EADDRNOTAVAIL`

Cannot assign requested address

<!-- anchor: errno.ENETDOWN | type: py data -->
## `errno.ENETDOWN`

Network is down

<!-- anchor: errno.ENETUNREACH | type: py data -->
## `errno.ENETUNREACH`

Network is unreachable

<!-- anchor: errno.ENETRESET | type: py data -->
## `errno.ENETRESET`

Network dropped connection because of reset

<!-- anchor: errno.ECONNABORTED | type: py data -->
## `errno.ECONNABORTED`

Software caused connection abort. This error is mapped to the exception `ConnectionAbortedError`.

<!-- anchor: errno.ECONNRESET | type: py data -->
## `errno.ECONNRESET`

Connection reset by peer. This error is mapped to the exception `ConnectionResetError`.

<!-- anchor: errno.ENOBUFS | type: py data -->
## `errno.ENOBUFS`

No buffer space available

<!-- anchor: errno.EISCONN | type: py data -->
## `errno.EISCONN`

Transport endpoint is already connected

<!-- anchor: errno.ENOTCONN | type: py data -->
## `errno.ENOTCONN`

Transport endpoint is not connected

<!-- anchor: errno.ESHUTDOWN | type: py data -->
## `errno.ESHUTDOWN`

Cannot send after transport endpoint shutdown. This error is mapped to the exception `BrokenPipeError`.

<!-- anchor: errno.ETOOMANYREFS | type: py data -->
## `errno.ETOOMANYREFS`

Too many references: cannot splice

<!-- anchor: errno.ETIMEDOUT | type: py data -->
## `errno.ETIMEDOUT`

Connection timed out. This error is mapped to the exception `TimeoutError`.

<!-- anchor: errno.ECONNREFUSED | type: py data -->
## `errno.ECONNREFUSED`

Connection refused. This error is mapped to the exception `ConnectionRefusedError`.

<!-- anchor: errno.EHOSTDOWN | type: py data -->
## `errno.EHOSTDOWN`

Host is down

<!-- anchor: errno.EHOSTUNREACH | type: py data -->
## `errno.EHOSTUNREACH`

No route to host

<!-- anchor: errno.EHWPOISON | type: py data -->
## `errno.EHWPOISON`

Memory page has hardware error.

Added in version 3.14.

<!-- anchor: errno.EALREADY | type: py data -->
## `errno.EALREADY`

Operation already in progress. This error is mapped to the exception `BlockingIOError`.

<!-- anchor: errno.EINPROGRESS | type: py data -->
## `errno.EINPROGRESS`

Operation now in progress. This error is mapped to the exception `BlockingIOError`.

<!-- anchor: errno.ESTALE | type: py data -->
## `errno.ESTALE`

Stale NFS file handle

<!-- anchor: errno.EUCLEAN | type: py data -->
## `errno.EUCLEAN`

Structure needs cleaning

<!-- anchor: errno.ENOTNAM | type: py data -->
## `errno.ENOTNAM`

Not a XENIX named type file

<!-- anchor: errno.ENAVAIL | type: py data -->
## `errno.ENAVAIL`

No XENIX semaphores available

<!-- anchor: errno.EISNAM | type: py data -->
## `errno.EISNAM`

Is a named type file

<!-- anchor: errno.EREMOTEIO | type: py data -->
## `errno.EREMOTEIO`

Remote I/O error

<!-- anchor: errno.EDQUOT | type: py data -->
## `errno.EDQUOT`

Quota exceeded

<!-- anchor: errno.EQFULL | type: py data -->
## `errno.EQFULL`

Interface output queue is full

Added in version 3.11.

<!-- anchor: errno.ENOMEDIUM | type: py data -->
## `errno.ENOMEDIUM`

No medium found

<!-- anchor: errno.EMEDIUMTYPE | type: py data -->
## `errno.EMEDIUMTYPE`

Wrong medium type

<!-- anchor: errno.ENOKEY | type: py data -->
## `errno.ENOKEY`

Required key not available

<!-- anchor: errno.EKEYEXPIRED | type: py data -->
## `errno.EKEYEXPIRED`

Key has expired

<!-- anchor: errno.EKEYREVOKED | type: py data -->
## `errno.EKEYREVOKED`

Key has been revoked

<!-- anchor: errno.EKEYREJECTED | type: py data -->
## `errno.EKEYREJECTED`

Key was rejected by service

<!-- anchor: errno.ERFKILL | type: py data -->
## `errno.ERFKILL`

Operation not possible due to RF-kill

<!-- anchor: errno.ELOCKUNMAPPED | type: py data -->
## `errno.ELOCKUNMAPPED`

Locked lock was unmapped

<!-- anchor: errno.ENOTACTIVE | type: py data -->
## `errno.ENOTACTIVE`

Facility is not active

<!-- anchor: errno.EAUTH | type: py data -->
## `errno.EAUTH`

Authentication error

Added in version 3.2.

<!-- anchor: errno.EBADARCH | type: py data -->
## `errno.EBADARCH`

Bad CPU type in executable

Added in version 3.2.

<!-- anchor: errno.EBADEXEC | type: py data -->
## `errno.EBADEXEC`

Bad executable (or shared library)

Added in version 3.2.

<!-- anchor: errno.EBADMACHO | type: py data -->
## `errno.EBADMACHO`

Malformed Mach-o file

Added in version 3.2.

<!-- anchor: errno.EDEVERR | type: py data -->
## `errno.EDEVERR`

Device error

Added in version 3.2.

<!-- anchor: errno.EFTYPE | type: py data -->
## `errno.EFTYPE`

Inappropriate file type or format

Added in version 3.2.

<!-- anchor: errno.ENEEDAUTH | type: py data -->
## `errno.ENEEDAUTH`

Need authenticator

Added in version 3.2.

<!-- anchor: errno.ENOATTR | type: py data -->
## `errno.ENOATTR`

Attribute not found

Added in version 3.2.

<!-- anchor: errno.ENOPOLICY | type: py data -->
## `errno.ENOPOLICY`

Policy not found

Added in version 3.2.

<!-- anchor: errno.EPROCLIM | type: py data -->
## `errno.EPROCLIM`

Too many processes

Added in version 3.2.

<!-- anchor: errno.EPROCUNAVAIL | type: py data -->
## `errno.EPROCUNAVAIL`

Bad procedure for program

Added in version 3.2.

<!-- anchor: errno.EPROGMISMATCH | type: py data -->
## `errno.EPROGMISMATCH`

Program version wrong

Added in version 3.2.

<!-- anchor: errno.EPROGUNAVAIL | type: py data -->
## `errno.EPROGUNAVAIL`

RPC prog. not avail

Added in version 3.2.

<!-- anchor: errno.EPWROFF | type: py data -->
## `errno.EPWROFF`

Device power is off

Added in version 3.2.

<!-- anchor: errno.EBADRPC | type: py data -->
## `errno.EBADRPC`

RPC struct is bad

Added in version 3.2.

<!-- anchor: errno.ERPCMISMATCH | type: py data -->
## `errno.ERPCMISMATCH`

RPC version wrong

Added in version 3.2.

<!-- anchor: errno.ESHLIBVERS | type: py data -->
## `errno.ESHLIBVERS`

Shared library version mismatch

Added in version 3.2.

<!-- anchor: errno.ENOTCAPABLE | type: py data -->
## `errno.ENOTCAPABLE`

Capabilities insufficient. This error is mapped to the exception `PermissionError`.

Availability: WASI, FreeBSD

Added in version 3.11.1.

<!-- anchor: errno.ECANCELED | type: py data -->
## `errno.ECANCELED`

Operation canceled

Added in version 3.2.

<!-- anchor: errno.EOWNERDEAD | type: py data -->
## `errno.EOWNERDEAD`

Owner died

Added in version 3.2.

<!-- anchor: errno.ENOTRECOVERABLE | type: py data -->
## `errno.ENOTRECOVERABLE`

State not recoverable

Added in version 3.2.
