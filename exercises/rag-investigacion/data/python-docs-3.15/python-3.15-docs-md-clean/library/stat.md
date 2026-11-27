# `stat` — Interpreting `stat()` results

The `stat` module defines constants and functions for interpreting the
results of `os.stat()`, `os.fstat()` and `os.lstat()` (if they
exist). For complete details about the `stat()`, `fstat()` and
`lstat()` calls, consult the documentation for your system.

The `stat` module defines the following functions to test for specific file
types:

stat.S\_ISDIR(*mode*)
:   Return non-zero if the mode is from a directory.

stat.S\_ISCHR(*mode*)
:   Return non-zero if the mode is from a character special device file.

stat.S\_ISBLK(*mode*)
:   Return non-zero if the mode is from a block special device file.

stat.S\_ISREG(*mode*)
:   Return non-zero if the mode is from a regular file.

stat.S\_ISFIFO(*mode*)
:   Return non-zero if the mode is from a FIFO (named pipe).

stat.S\_ISLNK(*mode*)
:   Return non-zero if the mode is from a symbolic link.

stat.S\_ISSOCK(*mode*)
:   Return non-zero if the mode is from a socket.

stat.S\_ISDOOR(*mode*)
:   Return non-zero if the mode is from a door.

stat.S\_ISPORT(*mode*)
:   Return non-zero if the mode is from an event port.

stat.S\_ISWHT(*mode*)
:   Return non-zero if the mode is from a whiteout.

Two additional functions are defined for more general manipulation of the file’s
mode:

stat.S\_IMODE(*mode*)
:   Return the portion of the file’s mode that can be set by
    `os.chmod()`—that is, the file’s permission bits, plus the sticky
    bit, set-group-id, and set-user-id bits (on systems that support them).

stat.S\_IFMT(*mode*)
:   Return the portion of the file’s mode that describes the file type (used by the
    `S_IS*()` functions above).

Normally, you would use the `os.path.is*()` functions for testing the type
of a file; the functions here are useful when you are doing multiple tests of
the same file and wish to avoid the overhead of the `stat()` system call
for each test. These are also useful when checking for information about a file
that isn’t handled by `os.path`, like the tests for block and character
devices.

Example:

```
import os, sys
from stat import *

def walktree(top, callback):
    '''recursively descend the directory tree rooted at top,
       calling the callback function for each regular file'''

    for f in os.listdir(top):
        pathname = os.path.join(top, f)
        mode = os.lstat(pathname).st_mode
        if S_ISDIR(mode):
            # It's a directory, recurse into it
            walktree(pathname, callback)
        elif S_ISREG(mode):
            # It's a file, call the callback function
            callback(pathname)
        else:
            # Unknown file type, print a message
            print('Skipping %s' % pathname)

def visitfile(file):
    print('visiting', file)

if __name__ == '__main__':
    walktree(sys.argv[1], visitfile)
```

An additional utility function is provided to convert a file’s mode in a human
readable string:

stat.filemode(*mode*)
:   Convert a file’s mode to a string of the form ‘-rwxrwxrwx’.

All the variables below are simply symbolic indexes into the 10-tuple returned
by `os.stat()`, `os.fstat()` or `os.lstat()`.

stat.ST\_MODE
:   Inode protection mode.

stat.ST\_INO
:   Inode number.

stat.ST\_DEV
:   Device inode resides on.

stat.ST\_NLINK
:   Number of links to the inode.

stat.ST\_UID
:   User id of the owner.

stat.ST\_GID
:   Group id of the owner.

stat.ST\_SIZE
:   Size in bytes of a plain file; amount of data waiting on some special files.

stat.ST\_ATIME
:   Time of last access.

stat.ST\_MTIME
:   Time of last modification.

stat.ST\_CTIME
:   The “ctime” as reported by the operating system. On some systems (like Unix) is
    the time of the last metadata change, and, on others (like Windows), is the
    creation time (see platform documentation for details).

The interpretation of “file size” changes according to the file type. For plain
files this is the size of the file in bytes. For FIFOs and sockets under most
flavors of Unix (including Linux in particular), the “size” is the number of
bytes waiting to be read at the time of the call to `os.stat()`,
`os.fstat()`, or `os.lstat()`; this can sometimes be useful, especially
for polling one of these special files after a non-blocking open. The meaning
of the size field for other character and block devices varies more, depending
on the implementation of the underlying system call.

The variables below define the flags used in the `ST_MODE` field.

Use of the functions above is more portable than use of the first set of flags:

stat.S\_IFSOCK
:   Socket.

stat.S\_IFLNK
:   Symbolic link.

stat.S\_IFREG
:   Regular file.

stat.S\_IFBLK
:   Block device.

stat.S\_IFDIR
:   Directory.

stat.S\_IFCHR
:   Character device.

stat.S\_IFIFO
:   FIFO.

stat.S\_IFDOOR
:   Door.

stat.S\_IFPORT
:   Event port.

stat.S\_IFWHT
:   Whiteout.

Note

`S_IFDOOR`, `S_IFPORT` or `S_IFWHT` are defined as
0 when the platform does not have support for the file types.

The following flags can also be used in the *mode* argument of `os.chmod()`:

stat.S\_ISUID
:   Set UID bit.

stat.S\_ISGID
:   Set-group-ID bit. This bit has several special uses. For a directory
    it indicates that BSD semantics is to be used for that directory:
    files created there inherit their group ID from the directory, not
    from the effective group ID of the creating process, and directories
    created there will also get the `S_ISGID` bit set. For a
    file that does not have the group execution bit (`S_IXGRP`)
    set, the set-group-ID bit indicates mandatory file/record locking
    (see also `S_ENFMT`).

stat.S\_ISVTX
:   Sticky bit. When this bit is set on a directory it means that a file
    in that directory can be renamed or deleted only by the owner of the
    file, by the owner of the directory, or by a privileged process.

stat.S\_IRWXU
:   Mask for file owner permissions.

stat.S\_IRUSR
:   Owner has read permission.

stat.S\_IWUSR
:   Owner has write permission.

stat.S\_IXUSR
:   Owner has execute permission.

stat.S\_IRWXG
:   Mask for group permissions.

stat.S\_IRGRP
:   Group has read permission.

stat.S\_IWGRP
:   Group has write permission.

stat.S\_IXGRP
:   Group has execute permission.

stat.S\_IRWXO
:   Mask for permissions for others (not in group).

stat.S\_IROTH
:   Others have read permission.

stat.S\_IWOTH
:   Others have write permission.

stat.S\_IXOTH
:   Others have execute permission.

stat.S\_ENFMT
:   System V file locking enforcement. This flag is shared with `S_ISGID`:
    file/record locking is enforced on files that do not have the group
    execution bit (`S_IXGRP`) set.

stat.S\_IREAD
:   Unix V7 synonym for `S_IRUSR`.

stat.S\_IWRITE
:   Unix V7 synonym for `S_IWUSR`.

stat.S\_IEXEC
:   Unix V7 synonym for `S_IXUSR`.

The following flags can be used in the *flags* argument of `os.chflags()`:

stat.UF\_SETTABLE
:   All user settable flags.

stat.UF\_NODUMP
:   Do not dump the file.

stat.UF\_IMMUTABLE
:   The file may not be changed.

stat.UF\_APPEND
:   The file may only be appended to.

stat.UF\_OPAQUE
:   The directory is opaque when viewed through a union stack.

stat.UF\_NOUNLINK
:   The file may not be renamed or deleted.

stat.UF\_COMPRESSED
:   The file is stored compressed (macOS 10.6+).

stat.UF\_TRACKED
:   Used for handling document IDs (macOS)

stat.UF\_DATAVAULT
:   The file needs an entitlement for reading or writing (macOS 10.13+)

stat.UF\_HIDDEN
:   The file should not be displayed in a GUI (macOS 10.5+).

stat.SF\_SETTABLE
:   All super-user changeable flags

stat.SF\_SUPPORTED
:   All super-user supported flags

    Availability: macOS

stat.SF\_SYNTHETIC
:   All super-user read-only synthetic flags

    Availability: macOS

stat.SF\_ARCHIVED
:   The file may be archived.

stat.SF\_IMMUTABLE
:   The file may not be changed.

stat.SF\_APPEND
:   The file may only be appended to.

stat.SF\_RESTRICTED
:   The file needs an entitlement to write to (macOS 10.13+)

stat.SF\_NOUNLINK
:   The file may not be renamed or deleted.

stat.SF\_SNAPSHOT
:   The file is a snapshot file.

stat.SF\_FIRMLINK
:   The file is a firmlink (macOS 10.15+)

stat.SF\_DATALESS
:   The file is a dataless object (macOS 10.15+)

See the \*BSD or macOS systems man page *chflags(2)* for more information.

On Windows, the following file attribute constants are available for use when
testing bits in the `st_file_attributes` member returned by `os.stat()`.
See the Windows API documentation
for more detail on the meaning of these constants.

stat.FILE\_ATTRIBUTE\_ARCHIVE

stat.FILE\_ATTRIBUTE\_COMPRESSED

stat.FILE\_ATTRIBUTE\_DEVICE

stat.FILE\_ATTRIBUTE\_DIRECTORY

stat.FILE\_ATTRIBUTE\_ENCRYPTED

stat.FILE\_ATTRIBUTE\_HIDDEN

stat.FILE\_ATTRIBUTE\_INTEGRITY\_STREAM

stat.FILE\_ATTRIBUTE\_NORMAL

stat.FILE\_ATTRIBUTE\_NOT\_CONTENT\_INDEXED

stat.FILE\_ATTRIBUTE\_NO\_SCRUB\_DATA

stat.FILE\_ATTRIBUTE\_OFFLINE

stat.FILE\_ATTRIBUTE\_READONLY

stat.FILE\_ATTRIBUTE\_REPARSE\_POINT

stat.FILE\_ATTRIBUTE\_SPARSE\_FILE

stat.FILE\_ATTRIBUTE\_SYSTEM

stat.FILE\_ATTRIBUTE\_TEMPORARY

stat.FILE\_ATTRIBUTE\_VIRTUAL
:   Added in version 3.5.

On Windows, the following constants are available for comparing against the
`st_reparse_tag` member returned by `os.lstat()`. These are well-known
constants, but are not an exhaustive list.

stat.IO\_REPARSE\_TAG\_SYMLINK

stat.IO\_REPARSE\_TAG\_MOUNT\_POINT

stat.IO\_REPARSE\_TAG\_APPEXECLINK
:   Added in version 3.8.

On Linux, the following file attribute constants are available for use when
testing bits in the `stx_attributes` and
`stx_attributes_mask` members returned by
`os.statx()`. See the *statx(2)* man page for more detail on the
meaning of these constants.

stat.STATX\_ATTR\_COMPRESSED

stat.STATX\_ATTR\_IMMUTABLE

stat.STATX\_ATTR\_APPEND

stat.STATX\_ATTR\_NODUMP

stat.STATX\_ATTR\_ENCRYPTED

stat.STATX\_ATTR\_AUTOMOUNT

stat.STATX\_ATTR\_MOUNT\_ROOT

stat.STATX\_ATTR\_VERITY

stat.STATX\_ATTR\_DAX

stat.STATX\_ATTR\_WRITE\_ATOMIC
:   Added in version 3.15.
