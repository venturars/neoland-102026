---
page: library/stat.html
title: stat — Interpreting stat() results
area: library
kind: guide
module: stat
---

<!-- anchor: module-stat | type: section -->
# `stat` — Interpreting `stat()` results

**Source code:** Lib/stat.py

The `stat` module defines constants and functions for interpreting the results of `os.stat()`, `os.fstat()` and `os.lstat()` (if they exist). For complete details about the `stat()`, `fstat()` and `lstat()` calls, consult the documentation for your system.

Changed in version 3.4: The stat module is backed by a C implementation.

The `stat` module defines the following functions to test for specific file types:

<!-- anchor: stat.S_ISDIR | type: py function -->
## `stat.S_ISDIR(mode)`

Return non-zero if the mode is from a directory.

<!-- anchor: stat.S_ISCHR | type: py function -->
## `stat.S_ISCHR(mode)`

Return non-zero if the mode is from a character special device file.

<!-- anchor: stat.S_ISBLK | type: py function -->
## `stat.S_ISBLK(mode)`

Return non-zero if the mode is from a block special device file.

<!-- anchor: stat.S_ISREG | type: py function -->
## `stat.S_ISREG(mode)`

Return non-zero if the mode is from a regular file.

<!-- anchor: stat.S_ISFIFO | type: py function -->
## `stat.S_ISFIFO(mode)`

Return non-zero if the mode is from a FIFO (named pipe).

<!-- anchor: stat.S_ISLNK | type: py function -->
## `stat.S_ISLNK(mode)`

Return non-zero if the mode is from a symbolic link.

<!-- anchor: stat.S_ISSOCK | type: py function -->
## `stat.S_ISSOCK(mode)`

Return non-zero if the mode is from a socket.

<!-- anchor: stat.S_ISDOOR | type: py function -->
## `stat.S_ISDOOR(mode)`

Return non-zero if the mode is from a door.

Added in version 3.4.

<!-- anchor: stat.S_ISPORT | type: py function -->
## `stat.S_ISPORT(mode)`

Return non-zero if the mode is from an event port.

Added in version 3.4.

<!-- anchor: stat.S_ISWHT | type: py function -->
## `stat.S_ISWHT(mode)`

Return non-zero if the mode is from a whiteout.

Added in version 3.4.

Two additional functions are defined for more general manipulation of the file’s mode:

<!-- anchor: stat.S_IMODE | type: py function -->
## `stat.S_IMODE(mode)`

Return the portion of the file’s mode that can be set by `os.chmod()`—that is, the file’s permission bits, plus the sticky bit, set-group-id, and set-user-id bits (on systems that support them).

<!-- anchor: stat.S_IFMT | type: py function -->
## `stat.S_IFMT(mode)`

Return the portion of the file’s mode that describes the file type (used by the `S_IS*()` functions above).

Normally, you would use the `os.path.is*()` functions for testing the type of a file; the functions here are useful when you are doing multiple tests of the same file and wish to avoid the overhead of the `stat()` system call for each test. These are also useful when checking for information about a file that isn’t handled by `os.path`, like the tests for block and character devices.

Example:

```python
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

An additional utility function is provided to convert a file’s mode in a human readable string:

<!-- anchor: stat.filemode | type: py function -->
## `stat.filemode(mode)`

Convert a file’s mode to a string of the form ‘-rwxrwxrwx’.

Added in version 3.3.

Changed in version 3.4: The function supports `S_IFDOOR`, `S_IFPORT` and `S_IFWHT`.

All the variables below are simply symbolic indexes into the 10-tuple returned by `os.stat()`, `os.fstat()` or `os.lstat()`.

<!-- anchor: stat.ST_MODE | type: py data -->
## `stat.ST_MODE`

Inode protection mode.

<!-- anchor: stat.ST_INO | type: py data -->
## `stat.ST_INO`

Inode number.

<!-- anchor: stat.ST_DEV | type: py data -->
## `stat.ST_DEV`

Device inode resides on.

<!-- anchor: stat.ST_NLINK | type: py data -->
## `stat.ST_NLINK`

Number of links to the inode.

<!-- anchor: stat.ST_UID | type: py data -->
## `stat.ST_UID`

User id of the owner.

<!-- anchor: stat.ST_GID | type: py data -->
## `stat.ST_GID`

Group id of the owner.

<!-- anchor: stat.ST_SIZE | type: py data -->
## `stat.ST_SIZE`

Size in bytes of a plain file; amount of data waiting on some special files.

<!-- anchor: stat.ST_ATIME | type: py data -->
## `stat.ST_ATIME`

Time of last access.

<!-- anchor: stat.ST_MTIME | type: py data -->
## `stat.ST_MTIME`

Time of last modification.

<!-- anchor: stat.ST_CTIME | type: py data -->
## `stat.ST_CTIME`

The “ctime” as reported by the operating system. On some systems (like Unix) is the time of the last metadata change, and, on others (like Windows), is the creation time (see platform documentation for details).

The interpretation of “file size” changes according to the file type. For plain files this is the size of the file in bytes. For FIFOs and sockets under most flavors of Unix (including Linux in particular), the “size” is the number of bytes waiting to be read at the time of the call to `os.stat()`, `os.fstat()`, or `os.lstat()`; this can sometimes be useful, especially for polling one of these special files after a non-blocking open. The meaning of the size field for other character and block devices varies more, depending on the implementation of the underlying system call.

The variables below define the flags used in the `ST_MODE` field.

Use of the functions above is more portable than use of the first set of flags:

<!-- anchor: stat.S_IFSOCK | type: py data -->
## `stat.S_IFSOCK`

Socket.

<!-- anchor: stat.S_IFLNK | type: py data -->
## `stat.S_IFLNK`

Symbolic link.

<!-- anchor: stat.S_IFREG | type: py data -->
## `stat.S_IFREG`

Regular file.

<!-- anchor: stat.S_IFBLK | type: py data -->
## `stat.S_IFBLK`

Block device.

<!-- anchor: stat.S_IFDIR | type: py data -->
## `stat.S_IFDIR`

Directory.

<!-- anchor: stat.S_IFCHR | type: py data -->
## `stat.S_IFCHR`

Character device.

<!-- anchor: stat.S_IFIFO | type: py data -->
## `stat.S_IFIFO`

FIFO.

<!-- anchor: stat.S_IFDOOR | type: py data -->
## `stat.S_IFDOOR`

Door.

Added in version 3.4.

<!-- anchor: stat.S_IFPORT | type: py data -->
## `stat.S_IFPORT`

Event port.

Added in version 3.4.

<!-- anchor: stat.S_IFWHT | type: py data -->
## `stat.S_IFWHT`

Whiteout.

Added in version 3.4.

**Note:**

`S_IFDOOR`, `S_IFPORT` or `S_IFWHT` are defined as 0 when the platform does not have support for the file types.

The following flags can also be used in the *mode* argument of `os.chmod()`:

<!-- anchor: stat.S_ISUID | type: py data -->
## `stat.S_ISUID`

Set UID bit.

<!-- anchor: stat.S_ISGID | type: py data -->
## `stat.S_ISGID`

Set-group-ID bit. This bit has several special uses. For a directory it indicates that BSD semantics is to be used for that directory: files created there inherit their group ID from the directory, not from the effective group ID of the creating process, and directories created there will also get the `S_ISGID` bit set. For a file that does not have the group execution bit (`S_IXGRP`) set, the set-group-ID bit indicates mandatory file/record locking (see also `S_ENFMT`).

<!-- anchor: stat.S_ISVTX | type: py data -->
## `stat.S_ISVTX`

Sticky bit. When this bit is set on a directory it means that a file in that directory can be renamed or deleted only by the owner of the file, by the owner of the directory, or by a privileged process.

<!-- anchor: stat.S_IRWXU | type: py data -->
## `stat.S_IRWXU`

Mask for file owner permissions.

<!-- anchor: stat.S_IRUSR | type: py data -->
## `stat.S_IRUSR`

Owner has read permission.

<!-- anchor: stat.S_IWUSR | type: py data -->
## `stat.S_IWUSR`

Owner has write permission.

<!-- anchor: stat.S_IXUSR | type: py data -->
## `stat.S_IXUSR`

Owner has execute permission.

<!-- anchor: stat.S_IRWXG | type: py data -->
## `stat.S_IRWXG`

Mask for group permissions.

<!-- anchor: stat.S_IRGRP | type: py data -->
## `stat.S_IRGRP`

Group has read permission.

<!-- anchor: stat.S_IWGRP | type: py data -->
## `stat.S_IWGRP`

Group has write permission.

<!-- anchor: stat.S_IXGRP | type: py data -->
## `stat.S_IXGRP`

Group has execute permission.

<!-- anchor: stat.S_IRWXO | type: py data -->
## `stat.S_IRWXO`

Mask for permissions for others (not in group).

<!-- anchor: stat.S_IROTH | type: py data -->
## `stat.S_IROTH`

Others have read permission.

<!-- anchor: stat.S_IWOTH | type: py data -->
## `stat.S_IWOTH`

Others have write permission.

<!-- anchor: stat.S_IXOTH | type: py data -->
## `stat.S_IXOTH`

Others have execute permission.

<!-- anchor: stat.S_ENFMT | type: py data -->
## `stat.S_ENFMT`

System V file locking enforcement. This flag is shared with `S_ISGID`: file/record locking is enforced on files that do not have the group execution bit (`S_IXGRP`) set.

<!-- anchor: stat.S_IREAD | type: py data -->
## `stat.S_IREAD`

Unix V7 synonym for `S_IRUSR`.

<!-- anchor: stat.S_IWRITE | type: py data -->
## `stat.S_IWRITE`

Unix V7 synonym for `S_IWUSR`.

<!-- anchor: stat.S_IEXEC | type: py data -->
## `stat.S_IEXEC`

Unix V7 synonym for `S_IXUSR`.

The following flags can be used in the *flags* argument of `os.chflags()`:

<!-- anchor: stat.UF_SETTABLE | type: py data -->
## `stat.UF_SETTABLE`

All user settable flags.

Added in version 3.13.

<!-- anchor: stat.UF_NODUMP | type: py data -->
## `stat.UF_NODUMP`

Do not dump the file.

<!-- anchor: stat.UF_IMMUTABLE | type: py data -->
## `stat.UF_IMMUTABLE`

The file may not be changed.

<!-- anchor: stat.UF_APPEND | type: py data -->
## `stat.UF_APPEND`

The file may only be appended to.

<!-- anchor: stat.UF_OPAQUE | type: py data -->
## `stat.UF_OPAQUE`

The directory is opaque when viewed through a union stack.

<!-- anchor: stat.UF_NOUNLINK | type: py data -->
## `stat.UF_NOUNLINK`

The file may not be renamed or deleted.

<!-- anchor: stat.UF_COMPRESSED | type: py data -->
## `stat.UF_COMPRESSED`

The file is stored compressed (macOS 10.6+).

<!-- anchor: stat.UF_TRACKED | type: py data -->
## `stat.UF_TRACKED`

Used for handling document IDs (macOS)

Added in version 3.13.

<!-- anchor: stat.UF_DATAVAULT | type: py data -->
## `stat.UF_DATAVAULT`

The file needs an entitlement for reading or writing (macOS 10.13+)

Added in version 3.13.

<!-- anchor: stat.UF_HIDDEN | type: py data -->
## `stat.UF_HIDDEN`

The file should not be displayed in a GUI (macOS 10.5+).

<!-- anchor: stat.SF_SETTABLE | type: py data -->
## `stat.SF_SETTABLE`

All super-user changeable flags

Added in version 3.13.

<!-- anchor: stat.SF_SUPPORTED | type: py data -->
## `stat.SF_SUPPORTED`

All super-user supported flags

Availability: macOS

Added in version 3.13.

<!-- anchor: stat.SF_SYNTHETIC | type: py data -->
## `stat.SF_SYNTHETIC`

All super-user read-only synthetic flags

Availability: macOS

Added in version 3.13.

<!-- anchor: stat.SF_ARCHIVED | type: py data -->
## `stat.SF_ARCHIVED`

The file may be archived.

<!-- anchor: stat.SF_IMMUTABLE | type: py data -->
## `stat.SF_IMMUTABLE`

The file may not be changed.

<!-- anchor: stat.SF_APPEND | type: py data -->
## `stat.SF_APPEND`

The file may only be appended to.

<!-- anchor: stat.SF_RESTRICTED | type: py data -->
## `stat.SF_RESTRICTED`

The file needs an entitlement to write to (macOS 10.13+)

Added in version 3.13.

<!-- anchor: stat.SF_NOUNLINK | type: py data -->
## `stat.SF_NOUNLINK`

The file may not be renamed or deleted.

<!-- anchor: stat.SF_SNAPSHOT | type: py data -->
## `stat.SF_SNAPSHOT`

The file is a snapshot file.

<!-- anchor: stat.SF_FIRMLINK | type: py data -->
## `stat.SF_FIRMLINK`

The file is a firmlink (macOS 10.15+)

Added in version 3.13.

<!-- anchor: stat.SF_DATALESS | type: py data -->
## `stat.SF_DATALESS`

The file is a dataless object (macOS 10.15+)

Added in version 3.13.

See the *BSD or macOS systems man page *chflags(2)* for more information.

On Windows, the following file attribute constants are available for use when testing bits in the `st_file_attributes` member returned by `os.stat()`. See the Windows API documentation for more detail on the meaning of these constants.

<!-- anchor: stat.FILE_ATTRIBUTE_ARCHIVE | type: py data -->
## `stat.FILE_ATTRIBUTE_ARCHIVE`

`stat.FILE_ATTRIBUTE_COMPRESSED`

`stat.FILE_ATTRIBUTE_DEVICE`

`stat.FILE_ATTRIBUTE_DIRECTORY`

`stat.FILE_ATTRIBUTE_ENCRYPTED`

`stat.FILE_ATTRIBUTE_HIDDEN`

`stat.FILE_ATTRIBUTE_INTEGRITY_STREAM`

`stat.FILE_ATTRIBUTE_NORMAL`

`stat.FILE_ATTRIBUTE_NOT_CONTENT_INDEXED`

`stat.FILE_ATTRIBUTE_NO_SCRUB_DATA`

`stat.FILE_ATTRIBUTE_OFFLINE`

`stat.FILE_ATTRIBUTE_READONLY`

`stat.FILE_ATTRIBUTE_REPARSE_POINT`

`stat.FILE_ATTRIBUTE_SPARSE_FILE`

`stat.FILE_ATTRIBUTE_SYSTEM`

`stat.FILE_ATTRIBUTE_TEMPORARY`

`stat.FILE_ATTRIBUTE_VIRTUAL`

Added in version 3.5.

On Windows, the following constants are available for comparing against the `st_reparse_tag` member returned by `os.lstat()`. These are well-known constants, but are not an exhaustive list.

<!-- anchor: stat.IO_REPARSE_TAG_SYMLINK | type: py data -->
## `stat.IO_REPARSE_TAG_SYMLINK`

`stat.IO_REPARSE_TAG_MOUNT_POINT`

`stat.IO_REPARSE_TAG_APPEXECLINK`

Added in version 3.8.

On Linux, the following file attribute constants are available for use when testing bits in the `stx_attributes` and `stx_attributes_mask` members returned by `os.statx()`. See the *statx(2)* man page for more detail on the meaning of these constants.

<!-- anchor: stat.STATX_ATTR_COMPRESSED | type: py data -->
## `stat.STATX_ATTR_COMPRESSED`

`stat.STATX_ATTR_IMMUTABLE`

`stat.STATX_ATTR_APPEND`

`stat.STATX_ATTR_NODUMP`

`stat.STATX_ATTR_ENCRYPTED`

`stat.STATX_ATTR_AUTOMOUNT`

`stat.STATX_ATTR_MOUNT_ROOT`

`stat.STATX_ATTR_VERITY`

`stat.STATX_ATTR_DAX`

`stat.STATX_ATTR_WRITE_ATOMIC`

Added in version 3.15.
