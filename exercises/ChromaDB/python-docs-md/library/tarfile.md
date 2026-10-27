---
page: library/tarfile.html
title: tarfile — Read and write tar archive files
area: library
kind: guide
module: tarfile
---

<!-- anchor: module-tarfile | type: section -->
# `tarfile` — Read and write tar archive files

**Source code:** Lib/tarfile.py

The `tarfile` module makes it possible to read and write tar archives, including those using gzip, bz2 and lzma compression. Use the `zipfile` module to read or write `.zip` files, or the higher-level functions in shutil.

Some facts and figures:

- reads and writes `gzip`, `bz2`, `compression.zstd`, and `lzma` compressed archives if the respective modules are available.

  If any of these optional modules are missing from your copy of CPython, look for documentation from your distributor (that is, whoever provided Python to you). If you are the distributor, see Requirements for optional modules.

- read/write support for the POSIX.1-1988 (ustar) format.

- read/write support for the GNU tar format including *longname* and *longlink* extensions, read-only support for all variants of the *sparse* extension including restoration of sparse files.

- read/write support for the POSIX.1-2001 (pax) format.

- handles directories, regular files, hardlinks, symbolic links, fifos, character devices and block devices and is able to acquire and restore file information like timestamp, access permissions and owner.

Changed in version 3.3: Added support for `lzma` compression.

Changed in version 3.12: Archives are extracted using a filter, which makes it possible to either limit surprising/dangerous features, or to acknowledge that they are expected and the archive is fully trusted.

Changed in version 3.14: Set the default extraction filter to `data`, which disallows some dangerous features such as links to absolute paths or paths outside of the destination. Previously, the filter strategy was equivalent to `fully_trusted`.

Changed in version 3.14: Added support for Zstandard compression using `compression.zstd`.

<!-- anchor: tarfile.open | type: py function -->
## `tarfile.open(name=None, mode='r', fileobj=None, bufsize=10240, **kwargs)`

Return a `TarFile` object for the pathname *name*. For detailed information on `TarFile` objects and the keyword arguments that are allowed, see TarFile Objects.

*mode* has to be a string of the form `'filemode[:compression]'`, it defaults to `'r'`. Here is a full list of mode combinations:

| mode | action |
| --- | --- |
| `'r'` or `'r:*'` | Open for reading with transparent compression (recommended). |
| `'r:'` | Open for reading exclusively without compression. |
| `'r:gz'` | Open for reading with gzip compression. |
| `'r:bz2'` | Open for reading with bzip2 compression. |
| `'r:xz'` | Open for reading with lzma compression. |
| `'r:zst'` | Open for reading with Zstandard compression. |
| `'x'` or `'x:'` | Create a tarfile exclusively without compression. Raise a `FileExistsError` exception if it already exists. |
| `'x:gz'` | Create a tarfile with gzip compression. Raise a `FileExistsError` exception if it already exists. |
| `'x:bz2'` | Create a tarfile with bzip2 compression. Raise a `FileExistsError` exception if it already exists. |
| `'x:xz'` | Create a tarfile with lzma compression. Raise a `FileExistsError` exception if it already exists. |
| `'x:zst'` | Create a tarfile with Zstandard compression. Raise a `FileExistsError` exception if it already exists. |
| `'a'` or `'a:'` | Open for appending with no compression. The file is created if it does not exist. |
| `'w'` or `'w:'` | Open for uncompressed writing. |
| `'w:gz'` | Open for gzip compressed writing. |
| `'w:bz2'` | Open for bzip2 compressed writing. |
| `'w:xz'` | Open for lzma compressed writing. |
| `'w:zst'` | Open for Zstandard compressed writing. |

Note that `'a:gz'`, `'a:bz2'` or `'a:xz'` is not possible. If *mode* is not suitable to open a certain (compressed) file for reading, `ReadError` is raised. Use *mode* `'r'` to avoid this. If a compression method is not supported, `CompressionError` is raised.

If *fileobj* is specified, it is used as an alternative to a file object opened in binary mode for *name*. It is supposed to be at position 0.

For modes `'w:gz'`, `'x:gz'`, `'w|gz'`, `'w:bz2'`, `'x:bz2'`, `'w|bz2'`, `tarfile.open()` accepts the keyword argument *compresslevel* (default `6`) to specify the compression level of the file.

For modes `'w:xz'`, `'x:xz'` and `'w|xz'`, `tarfile.open()` accepts the keyword argument *preset* to specify the compression level of the file.

For modes `'w:zst'`, `'x:zst'` and `'w|zst'`, `tarfile.open()` accepts the keyword argument *level* to specify the compression level of the file. The keyword argument *options* may also be passed, providing advanced Zstandard compression parameters described by `CompressionParameter`. The keyword argument *zstd_dict* can be passed to provide a `ZstdDict`, a Zstandard dictionary used to improve compression of smaller amounts of data.

For modes `'w:gz'` and `'w|gz'`, `tarfile.open()` accepts the keyword argument *mtime* to create a gzip archive header with that mtime. By default, the mtime is set to the time of creation of the archive. Use *mtime* `0` to generate a compressed stream that does not depend on creation time, for reproducible output.

For special purposes, there is a second format for *mode*: `'filemode|[compression]'`. `tarfile.open()` will return a `TarFile` object that processes its data as a stream of blocks. No random seeking will be done on the file. If given, *fileobj* may be any object that has a `read()` or `write()` method (depending on the *mode*) that works with bytes. *bufsize* specifies the blocksize and defaults to `20 * 512` bytes. Use this variant in combination with e.g. `sys.stdin.buffer`, a socket file object or a tape device. However, such a `TarFile` object is limited in that it does not allow random access, see Examples. The currently possible modes:

| Mode | Action |
| --- | --- |
| `'r\|*'` | Open a *stream* of tar blocks for reading with transparent compression. |
| `'r\|'` | Open a *stream* of uncompressed tar blocks for reading. |
| `'r\|gz'` | Open a gzip compressed *stream* for reading. |
| `'r\|bz2'` | Open a bzip2 compressed *stream* for reading. |
| `'r\|xz'` | Open an lzma compressed *stream* for reading. |
| `'r\|zst'` | Open a Zstandard compressed *stream* for reading. |
| `'w\|'` | Open an uncompressed *stream* for writing. |
| `'w\|gz'` | Open a gzip compressed *stream* for writing. |
| `'w\|bz2'` | Open a bzip2 compressed *stream* for writing. |
| `'w\|xz'` | Open an lzma compressed *stream* for writing. |
| `'w\|zst'` | Open a Zstandard compressed *stream* for writing. |

Changed in version 3.5: The `'x'` (exclusive creation) mode was added.

Changed in version 3.6: The *name* parameter accepts a path-like object.

Changed in version 3.12: The *compresslevel* keyword argument also works for streams.

Changed in version 3.14: The *preset* keyword argument also works for streams.

Changed in version 3.15: The default compression level was reduced to 6 (down from 9). It is the default level used by most compression tools and a better tradeoff between speed and performance.

<!-- anchor:  | type: py class -->
## `class tarfile.TarFile`

Class for reading and writing tar archives. Do not use this class directly: use `tarfile.open()` instead. See TarFile Objects.

<!-- anchor: tarfile.is_tarfile | type: py function -->
## `tarfile.is_tarfile(name)`

Return `True` if *name* is a tar archive file, that the `tarfile` module can read. *name* may be a `str`, file, or file-like object.

Changed in version 3.9: Support for file and file-like objects.

The `tarfile` module defines the following exceptions:

<!-- anchor: tarfile.TarError | type: py exception -->
## `exception tarfile.TarError`

Base class for all `tarfile` exceptions.

<!-- anchor: tarfile.ReadError | type: py exception -->
## `exception tarfile.ReadError`

Is raised when a tar archive is opened, that either cannot be handled by the `tarfile` module or is somehow invalid.

<!-- anchor: tarfile.CompressionError | type: py exception -->
## `exception tarfile.CompressionError`

Is raised when a compression method is not supported or when the data cannot be decoded properly.

<!-- anchor: tarfile.StreamError | type: py exception -->
## `exception tarfile.StreamError`

Is raised for the limitations that are typical for stream-like `TarFile` objects.

<!-- anchor: tarfile.ExtractError | type: py exception -->
## `exception tarfile.ExtractError`

Is raised for *non-fatal* errors when using `TarFile.extract()`, but only if `TarFile.errorlevel``== 2`.

<!-- anchor: tarfile.HeaderError | type: py exception -->
## `exception tarfile.HeaderError`

Is raised by `TarInfo.frombuf()` if the buffer it gets is invalid.

<!-- anchor: tarfile.FilterError | type: py exception -->
## `exception tarfile.FilterError`

Base class for members refused by filters.

<!-- anchor: tarfile.FilterError.tarinfo | type: py attribute -->
### `tarinfo`

Information about the member that the filter refused to extract, as TarInfo.

<!-- anchor: tarfile.AbsolutePathError | type: py exception -->
## `exception tarfile.AbsolutePathError`

Raised to refuse extracting a member with an absolute path.

<!-- anchor: tarfile.OutsideDestinationError | type: py exception -->
## `exception tarfile.OutsideDestinationError`

Raised to refuse extracting a member outside the destination directory.

<!-- anchor: tarfile.SpecialFileError | type: py exception -->
## `exception tarfile.SpecialFileError`

Raised to refuse extracting a special file (e.g. a device or pipe).

<!-- anchor: tarfile.AbsoluteLinkError | type: py exception -->
## `exception tarfile.AbsoluteLinkError`

Raised to refuse extracting a symbolic link with an absolute path.

<!-- anchor: tarfile.LinkOutsideDestinationError | type: py exception -->
## `exception tarfile.LinkOutsideDestinationError`

Raised to refuse extracting a symbolic link pointing outside the destination directory.

<!-- anchor: tarfile.LinkFallbackError | type: py exception -->
## `exception tarfile.LinkFallbackError`

Raised to refuse emulating a link (hard or symbolic) by extracting another archive member, when that member would be rejected by the filter location. The exception that was raised to reject the replacement member is available as `BaseException.__context__`.

Added in version 3.15.

The following constants are available at the module level:

<!-- anchor: tarfile.ENCODING | type: py data -->
## `tarfile.ENCODING`

The default character encoding: `'utf-8'` on Windows, the value returned by `sys.getfilesystemencoding()` otherwise.

<!-- anchor: tarfile.REGTYPE | type: py data -->
## `tarfile.REGTYPE`

`tarfile.AREGTYPE`

A regular file `type`.

<!-- anchor: tarfile.LNKTYPE | type: py data -->
## `tarfile.LNKTYPE`

A link (inside tarfile) `type`.

<!-- anchor: tarfile.SYMTYPE | type: py data -->
## `tarfile.SYMTYPE`

A symbolic link `type`.

<!-- anchor: tarfile.CHRTYPE | type: py data -->
## `tarfile.CHRTYPE`

A character special device `type`.

<!-- anchor: tarfile.BLKTYPE | type: py data -->
## `tarfile.BLKTYPE`

A block special device `type`.

<!-- anchor: tarfile.DIRTYPE | type: py data -->
## `tarfile.DIRTYPE`

A directory `type`.

<!-- anchor: tarfile.FIFOTYPE | type: py data -->
## `tarfile.FIFOTYPE`

A FIFO special device `type`.

<!-- anchor: tarfile.CONTTYPE | type: py data -->
## `tarfile.CONTTYPE`

A contiguous file `type`.

<!-- anchor: tarfile.GNUTYPE_LONGNAME | type: py data -->
## `tarfile.GNUTYPE_LONGNAME`

A GNU tar longname `type`.

<!-- anchor: tarfile.GNUTYPE_LONGLINK | type: py data -->
## `tarfile.GNUTYPE_LONGLINK`

A GNU tar longlink `type`.

<!-- anchor: tarfile.GNUTYPE_SPARSE | type: py data -->
## `tarfile.GNUTYPE_SPARSE`

A GNU tar sparse file `type`.

Each of the following constants defines a tar archive format that the `tarfile` module is able to create. See section Supported tar formats for details.

<!-- anchor: tarfile.USTAR_FORMAT | type: py data -->
## `tarfile.USTAR_FORMAT`

POSIX.1-1988 (ustar) format.

<!-- anchor: tarfile.GNU_FORMAT | type: py data -->
## `tarfile.GNU_FORMAT`

GNU tar format.

<!-- anchor: tarfile.PAX_FORMAT | type: py data -->
## `tarfile.PAX_FORMAT`

POSIX.1-2001 (pax) format.

<!-- anchor: tarfile.DEFAULT_FORMAT | type: py data -->
## `tarfile.DEFAULT_FORMAT`

The default format for creating archives. This is currently `PAX_FORMAT`.

Changed in version 3.8: The default format for new archives was changed to `PAX_FORMAT` from `GNU_FORMAT`.

**See also:**

**Module `zipfile`**

Documentation of the `zipfile` standard module.

**Archiving operations**

Documentation of the higher-level archiving facilities provided by the standard `shutil` module.

**GNU tar manual, Basic Tar Format**

Documentation for tar archive files, including GNU tar extensions.

<!-- anchor: tarfile-objects | type: section -->
## TarFile Objects

The `TarFile` object provides an interface to a tar archive. A tar archive is a sequence of blocks. An archive member (a stored file) is made up of a header block followed by data blocks. It is possible to store a file in a tar archive several times. Each archive member is represented by a `TarInfo` object, see TarInfo Objects for details.

A `TarFile` object can be used as a context manager in a `with` statement. It will automatically be closed when the block is completed. Please note that in the event of an exception an archive opened for writing will not be finalized; only the internally used file object will be closed. See the Examples section for a use case.

Added in version 3.2: Added support for the context management protocol.

<!-- anchor: tarfile.TarFile | type: py class -->
### `class tarfile.TarFile(name=None, mode='r', fileobj=None, format=DEFAULT_FORMAT, tarinfo=TarInfo, dereference=False, ignore_zeros=False, encoding=ENCODING, errors='surrogateescape', pax_headers=None, debug=0, errorlevel=1, stream=False)`

All following arguments are optional and can be accessed as instance attributes as well.

*name* is the pathname of the archive. *name* may be a path-like object. It can be omitted if *fileobj* is given. In this case, the file object’s `name` attribute is used if it exists.

*mode* is either `'r'` to read from an existing archive, `'a'` to append data to an existing file, `'w'` to create a new file overwriting an existing one, or `'x'` to create a new file only if it does not already exist.

If *fileobj* is given, it is used for reading or writing data. If it can be determined, *mode* is overridden by *fileobj*’s mode. *fileobj* will be used from position 0.

**Note:**

*fileobj* is not closed, when `TarFile` is closed.

*format* controls the archive format for writing. It must be one of the constants `USTAR_FORMAT`, `GNU_FORMAT` or `PAX_FORMAT` that are defined at module level. When reading, format will be automatically detected, even if different formats are present in a single archive.

The *tarinfo* argument can be used to replace the default `TarInfo` class with a different one.

If *dereference* is `False`, add symbolic and hard links to the archive. If it is `True`, add the content of the target files to the archive. This has no effect on systems that do not support symbolic links.

If *ignore_zeros* is `False`, treat an empty block as the end of the archive. If it is `True`, skip empty (and invalid) blocks and try to get as many members as possible. This is only useful for reading concatenated or damaged archives.

*debug* can be set from `0` (no debug messages) up to `3` (all debug messages). The messages are written to `sys.stderr`.

*errorlevel* controls how extraction errors are handled, see `the corresponding attribute`.

The *encoding* and *errors* arguments define the character encoding to be used for reading or writing the archive and how conversion errors are going to be handled. The default settings will work for most users. See section Unicode issues for in-depth information.

The *pax_headers* argument is an optional dictionary of strings which will be added as a pax global header if *format* is `PAX_FORMAT`.

If *stream* is set to `True` then while reading the archive info about files in the archive are not cached, saving memory.

Changed in version 3.2: Use `'surrogateescape'` as the default for the *errors* argument.

Changed in version 3.5: The `'x'` (exclusive creation) mode was added.

Changed in version 3.6: The *name* parameter accepts a path-like object.

Changed in version 3.13: Add the *stream* parameter.

<!-- anchor: tarfile.TarFile.open | type: py method -->
### `classmethod TarFile.open(...)`

Alternative constructor. The `tarfile.open()` function is actually a shortcut to this classmethod.

<!-- anchor: tarfile.TarFile.getmember | type: py method -->
### `TarFile.getmember(name)`

Return a `TarInfo` object for member *name*. If *name* can not be found in the archive, `KeyError` is raised.

**Note:**

If a member occurs more than once in the archive, its last occurrence is assumed to be the most up-to-date version.

<!-- anchor: tarfile.TarFile.getmembers | type: py method -->
### `TarFile.getmembers()`

Return the members of the archive as a list of `TarInfo` objects. The list has the same order as the members in the archive.

<!-- anchor: tarfile.TarFile.getnames | type: py method -->
### `TarFile.getnames()`

Return the members as a list of their names. It has the same order as the list returned by `getmembers()`.

<!-- anchor: tarfile.TarFile.list | type: py method -->
### `TarFile.list(verbose=True, *, members=None)`

Print a table of contents to `sys.stdout`. If *verbose* is `False`, only the names of the members are printed. If it is `True`, output similar to that of **ls -l** is produced. If optional *members* is given, it must be a subset of the list returned by `getmembers()`.

Changed in version 3.5: Added the *members* parameter.

<!-- anchor: tarfile.TarFile.next | type: py method -->
### `TarFile.next()`

Return the next member of the archive as a `TarInfo` object, when `TarFile` is opened for reading. Return `None` if there is no more available.

<!-- anchor: tarfile.TarFile.extractall | type: py method -->
### `TarFile.extractall(path='.', members=None, *, numeric_owner=False, filter=None)`

Extract all members from the archive to the current working directory or directory *path*. If optional *members* is given, it must be a subset of the list returned by `getmembers()`. Directory information like owner, modification time and permissions are set after all members have been extracted. This is done to work around two problems: A directory’s modification time is reset each time a file is created in it. And, if a directory’s permissions do not allow writing, extracting files to it will fail.

If *numeric_owner* is `True`, the uid and gid numbers from the tarfile are used to set the owner/group for the extracted files. Otherwise, the named values from the tarfile are used.

The *filter* argument specifies how `members` are modified or rejected before extraction. See Extraction filters for details. It is recommended to set this explicitly only if specific *tar* features are required, or as `filter='data'` to support Python versions with a less secure default (3.13 and lower).

**Warning:**

Never extract archives from untrusted sources without prior inspection.

Since Python 3.14, the default (`data`) will prevent the most dangerous security issues. However, it will not prevent *all* unintended or insecure behavior. Read the Extraction filters section for details.

Changed in version 3.5: Added the *numeric_owner* parameter.

Changed in version 3.6: The *path* parameter accepts a path-like object.

Changed in version 3.12: Added the *filter* parameter.

Changed in version 3.14: The *filter* parameter now defaults to `'data'`.

<!-- anchor: tarfile.TarFile.extract | type: py method -->
### `TarFile.extract(member, path='', set_attrs=True, *, numeric_owner=False, filter=None)`

Extract a member from the archive to the current working directory, using its full name. Its file information is extracted as accurately as possible. *member* may be a filename or a `TarInfo` object. You can specify a different directory using *path*. *path* may be a path-like object. File attributes (owner, mtime, mode) are set unless *set_attrs* is false.

The *numeric_owner* and *filter* arguments are the same as for `extractall()`.

**Note:**

The `extract()` method does not take care of several extraction issues. In most cases you should consider using the `extractall()` method.

**Warning:**

Never extract archives from untrusted sources without prior inspection. See the warning for `extractall()` for details.

Changed in version 3.2: Added the *set_attrs* parameter.

Changed in version 3.5: Added the *numeric_owner* parameter.

Changed in version 3.6: The *path* parameter accepts a path-like object.

Changed in version 3.12: Added the *filter* parameter.

<!-- anchor: tarfile.TarFile.extractfile | type: py method -->
### `TarFile.extractfile(member)`

Extract a member from the archive as a file object. *member* may be a filename or a `TarInfo` object. If *member* is a regular file or a link, an `io.BufferedReader` object is returned. For all other existing members, `None` is returned. If *member* does not appear in the archive, `KeyError` is raised.

Changed in version 3.3: Return an `io.BufferedReader` object.

Changed in version 3.13: The returned `io.BufferedReader` object has the `mode` attribute which is always equal to `'rb'`.

<!-- anchor: tarfile.TarFile.errorlevel | type: py attribute -->
### `TarFile.errorlevel: int`

If *errorlevel* is `0`, errors are ignored when using `TarFile.extract()` and `TarFile.extractall()`. Nevertheless, they appear as error messages in the debug output when *debug* is greater than 0. If `1` (the default), all *fatal* errors are raised as `OSError` or `FilterError` exceptions. If `2`, all *non-fatal* errors are raised as `TarError` exceptions as well.

Some exceptions, e.g. ones caused by wrong argument types or data corruption, are always raised.

Custom extraction filters should raise `FilterError` for *fatal* errors and `ExtractError` for *non-fatal* ones.

Note that when an exception is raised, the archive may be partially extracted. It is the user’s responsibility to clean up.

<!-- anchor: tarfile.TarFile.extraction_filter | type: py attribute -->
### `TarFile.extraction_filter`

Added in version 3.12.

The extraction filter used as a default for the *filter* argument of `extract()` and `extractall()`.

The attribute may be `None` or a callable. String names are not allowed for this attribute, unlike the *filter* argument to `extract()`.

If `extraction_filter` is `None` (the default), extraction methods will use the `data` filter by default.

The attribute may be set on instances or overridden in subclasses. It also is possible to set it on the `TarFile` class itself to set a global default, although, since it affects all uses of *tarfile*, it is best practice to only do so in top-level applications or `site configuration`. To set a global default this way, a filter function needs to be wrapped in `@staticmethod` to prevent injection of a `self` argument.

Changed in version 3.14: The default filter is set to `data`, which disallows some dangerous features such as links to absolute paths or paths outside of the destination. Previously, the default was equivalent to `fully_trusted`.

<!-- anchor: tarfile.TarFile.add | type: py method -->
### `TarFile.add(name, arcname=None, recursive=True, *, filter=None)`

Add the file *name* to the archive. *name* may be any type of file (directory, fifo, symbolic link, etc.). If given, *arcname* specifies an alternative name for the file in the archive. Directories are added recursively by default. This can be avoided by setting *recursive* to `False`. Recursion adds entries in sorted order. If *filter* is given, it should be a function that takes a `TarInfo` object argument and returns the changed `TarInfo` object. If it instead returns `None` the `TarInfo` object will be excluded from the archive. See Examples for an example.

Changed in version 3.2: Added the *filter* parameter.

Changed in version 3.7: Recursion adds entries in sorted order.

<!-- anchor: tarfile.TarFile.addfile | type: py method -->
### `TarFile.addfile(tarinfo, fileobj=None)`

Add the `TarInfo` object *tarinfo* to the archive. If *tarinfo* represents a non zero-size regular file, the *fileobj* argument should be a binary file, and `tarinfo.size` bytes are read from it and added to the archive. You can create `TarInfo` objects directly, or by using `gettarinfo()`.

Changed in version 3.13: *fileobj* must be given for non-zero-sized regular files.

<!-- anchor: tarfile.TarFile.gettarinfo | type: py method -->
### `TarFile.gettarinfo(name=None, arcname=None, fileobj=None)`

Create a `TarInfo` object from the result of `os.stat()` or equivalent on an existing file. The file is either named by *name*, or specified as a file object *fileobj* with a file descriptor. *name* may be a path-like object. If given, *arcname* specifies an alternative name for the file in the archive, otherwise, the name is taken from *fileobj*’s `name` attribute, or the *name* argument. The name should be a text string.

You can modify some of the `TarInfo`’s attributes before you add it using `addfile()`. If the file object is not an ordinary file object positioned at the beginning of the file, attributes such as `size` may need modifying. This is the case for objects such as `GzipFile`. The `name` may also be modified, in which case *arcname* could be a dummy string.

Changed in version 3.6: The *name* parameter accepts a path-like object.

<!-- anchor: tarfile.TarFile.close | type: py method -->
### `TarFile.close()`

Close the `TarFile`. In write mode, two finishing zero blocks are appended to the archive.

<!-- anchor: tarfile.TarFile.pax_headers | type: py attribute -->
### `TarFile.pax_headers: dict`

A dictionary containing key-value pairs of pax global headers.

<!-- anchor: tarinfo-objects | type: section -->
## TarInfo Objects

A `TarInfo` object represents one member in a `TarFile`. Aside from storing all required attributes of a file (like file type, size, time, permissions, owner etc.), it provides some useful methods to determine its type. It does *not* contain the file’s data itself.

`TarInfo` objects are returned by `TarFile`’s methods `getmember()`, `getmembers()` and `gettarinfo()`.

Modifying the objects returned by `getmember()` or `getmembers()` will affect all subsequent operations on the archive. For cases where this is unwanted, you can use `copy.copy()` or call the `replace()` method to create a modified copy in one step.

Several attributes can be set to `None` to indicate that a piece of metadata is unused or unknown. Different `TarInfo` methods handle `None` differently:

- The `extract()` or `extractall()` methods will ignore the corresponding metadata, leaving it set to a default.

- `addfile()` will fail.

- `list()` will print a placeholder string.

<!-- anchor: tarfile.TarInfo | type: py class -->
### `class tarfile.TarInfo(name='')`

Create a `TarInfo` object.

<!-- anchor: tarfile.TarInfo.frombuf | type: py method -->
### `classmethod TarInfo.frombuf(buf, encoding, errors)`

Create and return a `TarInfo` object from string buffer *buf*.

Raises `HeaderError` if the buffer is invalid.

<!-- anchor: tarfile.TarInfo.fromtarfile | type: py method -->
### `classmethod TarInfo.fromtarfile(tarfile)`

Read the next member from the `TarFile` object *tarfile* and return it as a `TarInfo` object.

<!-- anchor: tarfile.TarInfo.tobuf | type: py method -->
### `TarInfo.tobuf(format=DEFAULT_FORMAT, encoding=ENCODING, errors='surrogateescape')`

Create a string buffer from a `TarInfo` object. For information on the arguments see the constructor of the `TarFile` class.

Changed in version 3.2: Use `'surrogateescape'` as the default for the *errors* argument.

A `TarInfo` object has the following public data attributes:

<!-- anchor: tarfile.TarInfo.name | type: py attribute -->
### `TarInfo.name: str`

Name of the archive member.

<!-- anchor: tarfile.TarInfo.size | type: py attribute -->
### `TarInfo.size: int`

Size in bytes.

<!-- anchor: tarfile.TarInfo.mtime | type: py attribute -->
### `TarInfo.mtime: int | float`

Time of last modification in seconds since the epoch, as in `os.stat_result.st_mtime`.

Changed in version 3.12: Can be set to `None` for `extract()` and `extractall()`, causing extraction to skip applying this attribute.

<!-- anchor: tarfile.TarInfo.mode | type: py attribute -->
### `TarInfo.mode: int`

Permission bits, as for `os.chmod()`.

Changed in version 3.12: Can be set to `None` for `extract()` and `extractall()`, causing extraction to skip applying this attribute.

<!-- anchor: tarfile.TarInfo.type | type: py attribute -->
### `TarInfo.type`

File type. *type* is usually one of these constants: `REGTYPE`, `AREGTYPE`, `LNKTYPE`, `SYMTYPE`, `DIRTYPE`, `FIFOTYPE`, `CONTTYPE`, `CHRTYPE`, `BLKTYPE`, `GNUTYPE_SPARSE`. To determine the type of a `TarInfo` object more conveniently, use the `is*()` methods below.

<!-- anchor: tarfile.TarInfo.linkname | type: py attribute -->
### `TarInfo.linkname: str`

Name of the target file name, which is only present in `TarInfo` objects of type `LNKTYPE` and `SYMTYPE`.

For symbolic links (`SYMTYPE`), the *linkname* is relative to the directory that contains the link. For hard links (`LNKTYPE`), the *linkname* is relative to the root of the archive.

<!-- anchor: tarfile.TarInfo.uid | type: py attribute -->
### `TarInfo.uid: int`

User ID of the user who originally stored this member.

Changed in version 3.12: Can be set to `None` for `extract()` and `extractall()`, causing extraction to skip applying this attribute.

<!-- anchor: tarfile.TarInfo.gid | type: py attribute -->
### `TarInfo.gid: int`

Group ID of the user who originally stored this member.

Changed in version 3.12: Can be set to `None` for `extract()` and `extractall()`, causing extraction to skip applying this attribute.

<!-- anchor: tarfile.TarInfo.uname | type: py attribute -->
### `TarInfo.uname: str`

User name.

Changed in version 3.12: Can be set to `None` for `extract()` and `extractall()`, causing extraction to skip applying this attribute.

<!-- anchor: tarfile.TarInfo.gname | type: py attribute -->
### `TarInfo.gname: str`

Group name.

Changed in version 3.12: Can be set to `None` for `extract()` and `extractall()`, causing extraction to skip applying this attribute.

<!-- anchor: tarfile.TarInfo.chksum | type: py attribute -->
### `TarInfo.chksum: int`

Header checksum.

<!-- anchor: tarfile.TarInfo.devmajor | type: py attribute -->
### `TarInfo.devmajor: int`

Device major number.

<!-- anchor: tarfile.TarInfo.devminor | type: py attribute -->
### `TarInfo.devminor: int`

Device minor number.

<!-- anchor: tarfile.TarInfo.offset | type: py attribute -->
### `TarInfo.offset: int`

The tar header starts here.

<!-- anchor: tarfile.TarInfo.offset_data | type: py attribute -->
### `TarInfo.offset_data: int`

The file’s data starts here.

<!-- anchor: tarfile.TarInfo.sparse | type: py attribute -->
### `TarInfo.sparse`

Sparse member information.

<!-- anchor: tarfile.TarInfo.pax_headers | type: py attribute -->
### `TarInfo.pax_headers: dict`

A dictionary containing key-value pairs of an associated pax extended header.

<!-- anchor: tarfile.TarInfo.replace | type: py method -->
### `TarInfo.replace(name=..., mtime=..., mode=..., linkname=..., uid=..., gid=..., uname=..., gname=..., deep=True)`

Added in version 3.12.

Return a *new* copy of the `TarInfo` object with the given attributes changed. For example, to return a `TarInfo` with the group name set to `'staff'`, use:

```python
new_tarinfo = old_tarinfo.replace(gname='staff')
```

By default, a deep copy is made. If *deep* is false, the copy is shallow, i.e. `pax_headers` and any custom attributes are shared with the original `TarInfo` object.

A `TarInfo` object also provides some convenient query methods:

<!-- anchor: tarfile.TarInfo.isfile | type: py method -->
### `TarInfo.isfile()`

Return `True` if the `TarInfo` object is a regular file.

<!-- anchor: tarfile.TarInfo.isreg | type: py method -->
### `TarInfo.isreg()`

Same as `isfile()`.

<!-- anchor: tarfile.TarInfo.isdir | type: py method -->
### `TarInfo.isdir()`

Return `True` if it is a directory.

<!-- anchor: tarfile.TarInfo.issym | type: py method -->
### `TarInfo.issym()`

Return `True` if it is a symbolic link.

<!-- anchor: tarfile.TarInfo.islnk | type: py method -->
### `TarInfo.islnk()`

Return `True` if it is a hard link.

<!-- anchor: tarfile.TarInfo.ischr | type: py method -->
### `TarInfo.ischr()`

Return `True` if it is a character device.

<!-- anchor: tarfile.TarInfo.isblk | type: py method -->
### `TarInfo.isblk()`

Return `True` if it is a block device.

<!-- anchor: tarfile.TarInfo.isfifo | type: py method -->
### `TarInfo.isfifo()`

Return `True` if it is a FIFO.

<!-- anchor: tarfile.TarInfo.isdev | type: py method -->
### `TarInfo.isdev()`

Return `True` if it is one of character device, block device or FIFO.

<!-- anchor: extraction-filters | type: section -->
## Extraction filters

Added in version 3.12.

The *tar* format is designed to capture all details of a UNIX-like filesystem, which makes it very powerful. Unfortunately, the features make it easy to create tar files that have unintended – and possibly malicious – effects when extracted. For example, extracting a tar file can overwrite arbitrary files in various ways (e.g. by using absolute paths, `..` path components, or symlinks that affect later members).

In most cases, the full functionality is not needed. Therefore, *tarfile* supports extraction filters: a mechanism to limit functionality, and thus mitigate some of the security issues.

**Warning:**

None of the available filters blocks *all* dangerous archive features. Never extract archives from untrusted sources without prior inspection. See also Hints for further verification.

**See also:**

****PEP 706****

Contains further motivation and rationale behind the design.

The *filter* argument to `TarFile.extract()` or `extractall()` can be:

- the string `'fully_trusted'`: Honor all metadata as specified in the archive. Should be used if the user trusts the archive completely, or implements their own complex verification.

- the string `'tar'`: Honor most *tar*-specific features (i.e. features of UNIX-like filesystems), but block features that are very likely to be surprising or malicious. See `tar_filter()` for details.

- the string `'data'`: Ignore or block most features specific to UNIX-like filesystems. Intended for extracting cross-platform data archives. See `data_filter()` for details.

- `None` (default): Use `TarFile.extraction_filter`.

  If that is also `None` (the default), the `'data'` filter will be used.

  Changed in version 3.14: The default filter is set to `data`. Previously, the default was equivalent to `fully_trusted`.

- A callable which will be called for each extracted member with a TarInfo describing the member and the destination path to where the archive is extracted (i.e. the same path is used for all members):

  ```python
  filter(member: TarInfo, path: str, /) -> TarInfo | None
  ```

  The callable is called just before each member is extracted, so it can take the current state of the disk into account. It can:

  - return a `TarInfo` object which will be used instead of the metadata in the archive, or

  - return `None`, in which case the member will be skipped, or

  - raise an exception to abort the operation or skip the member, depending on `errorlevel`. Note that when extraction is aborted, `extractall()` may leave the archive partially extracted. It does not attempt to clean up.

<!-- anchor: default-named-filters | type: section -->
### Default named filters

The pre-defined, named filters are available as functions, so they can be reused in custom filters:

<!-- anchor: tarfile.fully_trusted_filter | type: py function -->
#### `tarfile.fully_trusted_filter(member, path)`

Return *member* unchanged.

This implements the `'fully_trusted'` filter.

<!-- anchor: tarfile.tar_filter | type: py function -->
#### `tarfile.tar_filter(member, path)`

Implements the `'tar'` filter.

- Strip leading slashes (`/` and `os.sep`) from filenames.

- Refuse to extract files with absolute paths (in case the name is absolute even after stripping slashes, e.g. `C:/foo` on Windows). This raises `AbsolutePathError`.

- Normalize filenames (`TarInfo.name`) that contain `..` components using `os.path.normpath()`. Note that this removes internal `..` components, which may change the meaning of the name if it traverses symbolic links.

- Refuse to extract files whose absolute path (after following symlinks) would end up outside the destination. This raises `OutsideDestinationError`.

- Clear high mode bits (setuid, setgid, sticky) and group/other write bits (`S_IWGRP` | `S_IWOTH`).

Return the modified `TarInfo` member.

Changed in version 3.15: Filenames containing `..` components are now normalized.

<!-- anchor: tarfile.data_filter | type: py function -->
#### `tarfile.data_filter(member, path)`

Implements the `'data'` filter. In addition to what `tar_filter` does:

- Normalize link targets (`TarInfo.linkname`) using `os.path.normpath()`. Note that this removes internal `..` components, which may change the meaning of the link if the path in `TarInfo.linkname` traverses symbolic links.

- Refuse to extract links (hard or soft) that link to absolute paths, or ones that link outside the destination.

  This raises `AbsoluteLinkError` or `LinkOutsideDestinationError`.

  Note that such files are refused even on platforms that do not support symbolic links.

- Refuse to extract device files (including pipes). This raises `SpecialFileError`.

- For regular files, including hard links:

  - Set the owner read and write permissions (`S_IRUSR` | `S_IWUSR`).

  - Remove the group & other executable permission (`S_IXGRP` | `S_IXOTH`) if the owner doesn’t have it (`S_IXUSR`).

- For other files (directories), set `mode` to `None`, so that extraction methods skip applying permission bits.

- Set user and group info (`uid`, `gid`, `uname`, `gname`) to `None`, so that extraction methods skip setting it.

Return the modified `TarInfo` member.

Note that this filter does not block *all* dangerous archive features. See Hints for further verification for details.

Changed in version 3.15: Link targets are now normalized.

<!-- anchor: filter-errors | type: section -->
### Filter errors

When a filter refuses to extract a file, it will raise an appropriate exception, a subclass of `FilterError`. This will abort the extraction if `TarFile.errorlevel` is 1 or more. With `errorlevel=0` the error will be logged and the member will be skipped, but extraction will continue.

<!-- anchor: hints-for-further-verification | type: section -->
### Hints for further verification

Even with `filter='data'`, *tarfile* is not suited for extracting untrusted files without prior inspection. Among other issues, the pre-defined filters do not prevent denial-of-service attacks. Users should do additional checks.

Here is an incomplete list of things to consider:

- Extract to a `new temporary directory` to prevent e.g. exploiting pre-existing links, and to make it easier to clean up after a failed extraction.

- Disallow symbolic links if you do not need the functionality.

- When working with untrusted data, use external (e.g. OS-level) limits on disk, memory and CPU usage.

- Check filenames against an allow-list of characters (to filter out control characters, confusables, foreign path separators, and so on).

- Check that filenames have expected extensions (discouraging files that execute when you “click on them”, or extension-less files like Windows special device names).

- Limit the number of extracted files, total size of extracted data, filename length (including symlink length), and size of individual files.

- Check for files that would be shadowed on case-insensitive filesystems.

Also note that:

- Tar files may contain multiple versions of the same file. Later ones are expected to overwrite any earlier ones. This feature is crucial to allow updating tape archives, but can be abused maliciously.

- *tarfile* does not protect against issues with “live” data, e.g. an attacker tinkering with the destination (or source) directory while extraction (or archiving) is in progress.

<!-- anchor: supporting-older-python-versions | type: section -->
### Supporting older Python versions

Extraction filters were added to Python 3.12, but may be backported to older versions as security updates. To check whether the feature is available, use e.g. `hasattr(tarfile, 'data_filter')` rather than checking the Python version.

The following examples show how to support Python versions with and without the feature. Note that setting `extraction_filter` will affect any subsequent operations.

- Fully trusted archive:

  ```python
  my_tarfile.extraction_filter = (lambda member, path: member)
  my_tarfile.extractall()
  ```

- Use the `'data'` filter if available, but revert to Python 3.11 behavior (`'fully_trusted'`) if this feature is not available:

  ```python
  my_tarfile.extraction_filter = getattr(tarfile, 'data_filter',
                                         (lambda member, path: member))
  my_tarfile.extractall()
  ```

- Use the `'data'` filter; *fail* if it is not available:

  ```python
  my_tarfile.extractall(filter=tarfile.data_filter)
  ```

  or:

  ```python
  my_tarfile.extraction_filter = tarfile.data_filter
  my_tarfile.extractall()
  ```

- Use the `'data'` filter; *warn* if it is not available:

  ```python
  if hasattr(tarfile, 'data_filter'):
      my_tarfile.extractall(filter='data')
  else:
      # remove this when no longer needed
      warn_the_user('Extracting may be unsafe; consider updating Python')
      my_tarfile.extractall()
  ```

<!-- anchor: stateful-extraction-filter-example | type: section -->
### Stateful extraction filter example

While *tarfile*’s extraction methods take a simple *filter* callable, custom filters may be more complex objects with an internal state. It may be useful to write these as context managers, to be used like this:

```python
with StatefulFilter() as filter_func:
    tar.extractall(path, filter=filter_func)
```

Such a filter can be written as, for example:

```python
class StatefulFilter:
    def __init__(self):
        self.file_count = 0

    def __enter__(self):
        return self

    def __call__(self, member, path):
        self.file_count += 1
        return member

    def __exit__(self, *exc_info):
        print(f'{self.file_count} files extracted')
```

<!-- anchor: command-line-interface | type: section -->
## Command-Line Interface

Added in version 3.4.

The `tarfile` module provides a simple command-line interface to interact with tar archives.

If you want to create a new tar archive, specify its name after the `-c` option and then list the filename(s) that should be included:

```shell-session
$ python -m tarfile -c monty.tar  spam.txt eggs.txt
```

Passing a directory is also acceptable:

```shell-session
$ python -m tarfile -c monty.tar life-of-brian_1979/
```

If you want to extract a tar archive into the current directory, use the `-e` option:

```shell-session
$ python -m tarfile -e monty.tar
```

You can also extract a tar archive into a different directory by passing the directory’s name:

```shell-session
$ python -m tarfile -e monty.tar  other-dir/
```

For a list of the files in a tar archive, use the `-l` option:

```shell-session
$ python -m tarfile -l monty.tar
```

<!-- anchor: command-line-options | type: section -->
### Command-line options

<!-- anchor: cmdoption-tarfile-l | type: std option -->
#### `-l <tarfile>`

`--list <tarfile>`

List files in a tarfile.

<!-- anchor: cmdoption-tarfile-c | type: std option -->
#### `-c <tarfile> <source1> ... <sourceN>`

`--create <tarfile> <source1> ... <sourceN>`

Create tarfile from source files.

<!-- anchor: cmdoption-tarfile-e | type: std option -->
#### `-e <tarfile> [<output_dir>]`

`--extract <tarfile> [<output_dir>]`

Extract tarfile into the current directory if *output_dir* is not specified.

<!-- anchor: cmdoption-tarfile-t | type: std option -->
#### `-t <tarfile>`

`--test <tarfile>`

Test whether the tarfile is valid or not.

<!-- anchor: cmdoption-tarfile-v | type: std option -->
#### `-v, --verbose`

Verbose output.

<!-- anchor: cmdoption-tarfile-filter | type: std option -->
#### `--filter <filtername>`

Specifies the *filter* for `--extract`. See Extraction filters for details. Only string names are accepted (that is, `fully_trusted`, `tar`, and `data`).

<!-- anchor: examples | type: section -->
## Examples

<!-- anchor: reading-examples | type: section -->
### Reading examples

How to extract an entire tar archive to the current working directory:

```python
import tarfile
tar = tarfile.open("sample.tar.gz")
tar.extractall(filter='data')
tar.close()
```

How to extract a subset of a tar archive with `TarFile.extractall()` using a generator function instead of a list:

```python
import os
import tarfile

def py_files(members):
    for tarinfo in members:
        if os.path.splitext(tarinfo.name)[1] == ".py":
            yield tarinfo

tar = tarfile.open("sample.tar.gz")
tar.extractall(members=py_files(tar))
tar.close()
```

How to read a gzip compressed tar archive and display some member information:

```python
import tarfile
tar = tarfile.open("sample.tar.gz", "r:gz")
for tarinfo in tar:
    print(tarinfo.name, "is", tarinfo.size, "bytes in size and is ", end="")
    if tarinfo.isreg():
        print("a regular file.")
    elif tarinfo.isdir():
        print("a directory.")
    else:
        print("something else.")
tar.close()
```

<!-- anchor: writing-examples | type: section -->
### Writing examples

How to create an uncompressed tar archive from a list of filenames:

```python
import tarfile
tar = tarfile.open("sample.tar", "w")
for name in ["foo", "bar", "quux"]:
    tar.add(name)
tar.close()
```

The same example using the `with` statement:

```python
import tarfile
with tarfile.open("sample.tar", "w") as tar:
    for name in ["foo", "bar", "quux"]:
        tar.add(name)
```

How to create and write an archive to stdout using `sys.stdout.buffer` in the *fileobj* parameter in `TarFile.add()`:

```python
import sys
import tarfile
with tarfile.open("sample.tar.gz", "w|gz", fileobj=sys.stdout.buffer) as tar:
    for name in ["foo", "bar", "quux"]:
        tar.add(name)
```

How to create an archive and reset the user information using the *filter* parameter in `TarFile.add()`:

```python
import tarfile
def reset(tarinfo):
    tarinfo.uid = tarinfo.gid = 0
    tarinfo.uname = tarinfo.gname = "root"
    return tarinfo
tar = tarfile.open("sample.tar.gz", "w:gz")
tar.add("foo", filter=reset)
tar.close()
```

<!-- anchor: supported-tar-formats | type: section -->
## Supported tar formats

There are three tar formats that can be created with the `tarfile` module:

- The POSIX.1-1988 ustar format (`USTAR_FORMAT`). It supports filenames up to a length of at best 256 characters and linknames up to 100 characters. The maximum file size is 8 GiB. This is an old and limited but widely supported format.

- The GNU tar format (`GNU_FORMAT`). It supports long filenames and linknames, files bigger than 8 GiB and sparse files. It is the de facto standard on GNU/Linux systems. `tarfile` fully supports the GNU tar extensions for long names, sparse file support is read-only.

- The POSIX.1-2001 pax format (`PAX_FORMAT`). It is the most flexible format with virtually no limits. It supports long filenames and linknames, large files and stores pathnames in a portable way. Modern tar implementations, including GNU tar, bsdtar/libarchive and star, fully support extended *pax* features; some old or unmaintained libraries may not, but should treat *pax* archives as if they were in the universally supported *ustar* format. It is the current default format for new archives.

  It extends the existing *ustar* format with extra headers for information that cannot be stored otherwise. There are two flavours of pax headers: Extended headers only affect the subsequent file header, global headers are valid for the complete archive and affect all following files. All the data in a pax header is encoded in *UTF-8* for portability reasons.

There are some more variants of the tar format which can be read, but not created:

- The ancient V7 format. This is the first tar format from Unix Seventh Edition, storing only regular files and directories. Names must not be longer than 100 characters, there is no user/group name information. Some archives have miscalculated header checksums in case of fields with non-ASCII characters.

- The SunOS tar extended format. This format is a variant of the POSIX.1-2001 pax format, but is not compatible.

<!-- anchor: unicode-issues | type: section -->
## Unicode issues

The tar format was originally conceived to make backups on tape drives with the main focus on preserving file system information. Nowadays tar archives are commonly used for file distribution and exchanging archives over networks. One problem of the original format (which is the basis of all other formats) is that there is no concept of supporting different character encodings. For example, an ordinary tar archive created on a *UTF-8* system cannot be read correctly on a *Latin-1* system if it contains non-*ASCII* characters. Textual metadata (like filenames, linknames, user/group names) will appear damaged. Unfortunately, there is no way to autodetect the encoding of an archive. The pax format was designed to solve this problem. It stores non-ASCII metadata using the universal character encoding *UTF-8*.

The details of character conversion in `tarfile` are controlled by the *encoding* and *errors* keyword arguments of the `TarFile` class.

*encoding* defines the character encoding to use for the metadata in the archive. The default value is `sys.getfilesystemencoding()` or `'ascii'` as a fallback. Depending on whether the archive is read or written, the metadata must be either decoded or encoded. If *encoding* is not set appropriately, this conversion may fail.

The *errors* argument defines how characters are treated that cannot be converted. Possible values are listed in section Error Handlers. The default scheme is `'surrogateescape'` which Python also uses for its file system calls, see File Names, Command Line Arguments, and Environment Variables.

For `PAX_FORMAT` archives (the default), *encoding* is generally not needed because all the metadata is stored using *UTF-8*. *encoding* is only used in the rare cases when binary pax headers are decoded or when strings with surrogate characters are stored.
