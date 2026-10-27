---
page: library/gzip.html
title: gzip — Support for **gzip** files
area: library
kind: guide
module: gzip
---

<!-- anchor: module-gzip | type: section -->
# `gzip` — Support for **gzip** files

**Source code:** Lib/gzip.py

This module provides a simple interface to compress and decompress files just like the GNU programs **gzip** and **gunzip** would.

This is an optional module. If it is missing from your copy of CPython, look for documentation from your distributor (that is, whoever provided Python to you). If you are the distributor, see Requirements for optional modules.

The data compression is provided by the `zlib` module.

The `gzip` module provides the `GzipFile` class, as well as the `open()`, `compress()` and `decompress()` convenience functions. The `GzipFile` class reads and writes **gzip**-format files, automatically compressing or decompressing the data so that it looks like an ordinary file object.

Note that additional file formats which can be decompressed by the **gzip** and **gunzip** programs, such as those produced by **compress** and **pack**, are not supported by this module.

The module defines the following items:

<!-- anchor: gzip.open | type: py function -->
## `gzip.open(filename, mode='rb', compresslevel=6, encoding=None, errors=None, newline=None)`

Open a gzip-compressed file in binary or text mode, returning a file object.

The *filename* argument can be an actual filename (a `str` or `bytes` object), or an existing file object to read from or write to.

The *mode* argument can be any of `'r'`, `'rb'`, `'a'`, `'ab'`, `'w'`, `'wb'`, `'x'` or `'xb'` for binary mode, or `'rt'`, `'at'`, `'wt'`, or `'xt'` for text mode. The default is `'rb'`.

The *compresslevel* argument is an integer from 0 to 9, as for the `GzipFile` constructor.

For binary mode, this function is equivalent to the `GzipFile` constructor: `GzipFile(filename, mode, compresslevel)`. In this case, the *encoding*, *errors* and *newline* arguments must not be provided.

For text mode, a `GzipFile` object is created, and wrapped in an `io.TextIOWrapper` instance with the specified encoding, error handling behavior, and line ending(s).

Changed in version 3.3: Added support for *filename* being a file object, support for text mode, and the *encoding*, *errors* and *newline* arguments.

Changed in version 3.4: Added support for the `'x'`, `'xb'` and `'xt'` modes.

Changed in version 3.6: Accepts a path-like object.

Changed in version 3.15: The default compression level was reduced to 6 (down from 9). It is the default level used by most compression tools and a better tradeoff between speed and performance.

<!-- anchor: gzip.BadGzipFile | type: py exception -->
## `exception gzip.BadGzipFile`

An exception raised for invalid gzip files. It inherits from `OSError`. `EOFError` and `zlib.error` can also be raised for invalid gzip files.

Added in version 3.8.

<!-- anchor: gzip.GzipFile | type: py class -->
## `class gzip.GzipFile(filename=None, mode=None, compresslevel=6, fileobj=None, mtime=None)`

Constructor for the `GzipFile` class, which simulates most of the methods of a file object, with the exception of the `truncate()` method. At least one of *fileobj* and *filename* must be given a non-trivial value.

The new class instance is based on *fileobj*, which can be a regular file, an `io.BytesIO` object, or any other object which simulates a file. It defaults to `None`, in which case *filename* is opened to provide a file object.

When *fileobj* is not `None`, the *filename* argument is only used to be included in the **gzip** file header, which may include the original filename of the uncompressed file. It defaults to the filename of *fileobj*, if discernible; otherwise, it defaults to the empty string, and in this case the original filename is not included in the header.

The *mode* argument can be any of `'r'`, `'rb'`, `'a'`, `'ab'`, `'w'`, `'wb'`, `'x'`, or `'xb'`, depending on whether the file will be read or written. The default is the mode of *fileobj* if discernible; otherwise, the default is `'rb'`. In future Python releases the mode of *fileobj* will not be used. It is better to always specify *mode* for writing.

Note that the file is always opened in binary mode. To open a compressed file in text mode, use `open()` (or wrap your `GzipFile` with an `io.TextIOWrapper`).

The *compresslevel* argument is an integer from `0` to `9` controlling the level of compression; `1` is fastest and produces the least compression, and `9` is slowest and produces the most compression. `0` is no compression. The default is `9`.

The optional *mtime* argument is the timestamp requested by gzip. The time is in Unix format, i.e., seconds since 00:00:00 UTC, January 1, 1970. Set *mtime* to `0` to generate a compressed stream that does not depend on creation time. If *mtime* is omitted or `None`, the current time is used; however, if the current time is outside the range 00:00:00 UTC, January 1, 1970 through 06:28:15 UTC, February 7, 2106, or explicitly passed *mtime* argument is outside the range `0` to `2**32-1`, then the value `0` is used instead.

See below for the `mtime` attribute that is set when decompressing.

Calling a `GzipFile` object’s `close()` method does not close *fileobj*, since you might wish to append more material after the compressed data. This also allows you to pass an `io.BytesIO` object opened for writing as *fileobj*, and retrieve the resulting memory buffer using the `io.BytesIO` object’s `getvalue()` method.

`GzipFile` supports the `io.BufferedIOBase` interface, including iteration and the `with` statement. Only the `truncate()` method isn’t implemented.

`GzipFile` also provides the following method and attribute:

<!-- anchor: gzip.GzipFile.peek | type: py method -->
### `peek(n)`

Read *n* uncompressed bytes without advancing the file position. The number of bytes returned may be more or less than requested.

**Note:**

While calling `peek()` does not change the file position of the `GzipFile`, it may change the position of the underlying file object (e.g. if the `GzipFile` was constructed with the *fileobj* parameter).

Added in version 3.2.

<!-- anchor: gzip.GzipFile.mode | type: py attribute -->
### `mode`

`'rb'` for reading and `'wb'` for writing.

Changed in version 3.13: In previous versions it was an integer `1` or `2`.

<!-- anchor: gzip.GzipFile.mtime | type: py attribute -->
### `mtime`

When decompressing, this attribute is set to the last timestamp in the most recently read header. It is an integer, holding the number of seconds since the Unix epoch (00:00:00 UTC, January 1, 1970). The initial value before reading any headers is `None`.

<!-- anchor: gzip.GzipFile.name | type: py attribute -->
### `name`

The path to the gzip file on disk, as a `str` or `bytes`. Equivalent to the output of `os.fspath()` on the original input path, with no other normalization, resolution or expansion.

Changed in version 3.1: Support for the `with` statement was added, along with the *mtime* constructor argument and `mtime` attribute.

Changed in version 3.2: Support for zero-padded and unseekable files was added.

Changed in version 3.3: The `io.BufferedIOBase.read1()` method is now implemented.

Changed in version 3.4: Added support for the `'x'` and `'xb'` modes.

Changed in version 3.5: Added support for writing arbitrary bytes-like objects. The `read()` method now accepts an argument of `None`.

Changed in version 3.6: Accepts a path-like object.

Deprecated since version 3.9: Opening `GzipFile` for writing without specifying the *mode* argument is deprecated.

Changed in version 3.12: Remove the `filename` attribute, use the `name` attribute instead.

Changed in version 3.15: The default compression level was reduced to 6 (down from 9). It is the default level used by most compression tools and a better tradeoff between speed and performance.

<!-- anchor: gzip.compress | type: py function -->
## `gzip.compress(data, compresslevel=6, *, mtime=0)`

Compress the *data*, returning a `bytes` object containing the compressed data. *compresslevel* and *mtime* have the same meaning as in the `GzipFile` constructor above, but *mtime* defaults to 0 for reproducible output.

Added in version 3.2.

Changed in version 3.8: Added the *mtime* parameter for reproducible output.

Changed in version 3.11: Speed is improved by compressing all data at once instead of in a streamed fashion. Calls with *mtime* set to `0` are delegated to `zlib.compress()` for better speed. In this situation the output may contain a gzip header “OS” byte value other than 255 “unknown” as supplied by the underlying zlib implementation.

Changed in version 3.13: The gzip header OS byte is guaranteed to be set to 255 when this function is used as was the case in 3.10 and earlier.

Changed in version 3.14: The *mtime* parameter now defaults to 0 for reproducible output. For the previous behaviour of using the current time, pass `None` to *mtime*.

Changed in version 3.15: The default compression level was reduced to 6 (down from 9). It is the default level used by most compression tools and a better tradeoff between speed and performance.

<!-- anchor: gzip.decompress | type: py function -->
## `gzip.decompress(data)`

Decompress the *data*, returning a `bytes` object containing the uncompressed data. This function is capable of decompressing multi-member gzip data (multiple gzip blocks concatenated together). When the data is certain to contain only one member the `zlib.decompress()` function with *wbits* set to 31 is faster.

Added in version 3.2.

Changed in version 3.11: Speed is improved by decompressing members at once in memory instead of in a streamed fashion.

<!-- anchor: examples-of-usage | type: section -->
## Examples of usage

Example of how to read a compressed file:

```python
import gzip
with gzip.open('/home/joe/file.txt.gz', 'rb') as f:
    file_content = f.read()
```

Example of how to create a compressed GZIP file:

```python
import gzip
content = b"Lots of content here"
with gzip.open('/home/joe/file.txt.gz', 'wb') as f:
    f.write(content)
```

Example of how to GZIP compress an existing file:

```python
import gzip
import shutil
with open('/home/joe/file.txt', 'rb') as f_in:
    with gzip.open('/home/joe/file.txt.gz', 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)
```

Example of how to GZIP compress a binary string:

```python
import gzip
s_in = b"Lots of content here"
s_out = gzip.compress(s_in)
```

**See also:**

**Module `zlib`**

The basic data compression module needed to support the **gzip** file format.

In case gzip (de)compression is a bottleneck, the python-isal package speeds up (de)compression with a mostly compatible API.

<!-- anchor: command-line-interface | type: section -->
## Command-line interface

The `gzip` module provides a simple command line interface to compress or decompress files.

Once executed the `gzip` module keeps the input file(s).

Changed in version 3.8: Add a new command line interface with a usage. By default, when you will execute the CLI, the default compression level is 6.

<!-- anchor: command-line-options | type: section -->
### Command-line options

<!-- anchor: cmdoption-gzip-arg-file | type: std option -->
#### `file`

If *file* is not specified, read from `sys.stdin`.

<!-- anchor: cmdoption-gzip-fast | type: std option -->
#### `--fast`

Indicates the fastest compression method (less compression).

<!-- anchor: cmdoption-gzip-best | type: std option -->
#### `--best`

Indicates the slowest compression method (best compression).

<!-- anchor: cmdoption-gzip-d | type: std option -->
#### `-d, --decompress`

Decompress the given file.

<!-- anchor: cmdoption-gzip-h | type: std option -->
#### `-h, --help`

Show the help message.
