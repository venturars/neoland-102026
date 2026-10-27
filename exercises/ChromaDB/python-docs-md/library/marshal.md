---
page: library/marshal.html
title: marshal — Internal Python object serialization
area: library
kind: guide
module: marshal
---

<!-- anchor: module-marshal | type: section -->
# `marshal` — Internal Python object serialization

This module contains functions that can read and write Python values in a binary format. The format is specific to Python, but independent of machine architecture issues (e.g., you can write a Python value to a file on a PC, transport the file to a Mac, and read it back there). Details of the format are undocumented on purpose; it may change between Python versions (although it rarely does). [1]

This is not a general “persistence” module. For general persistence and transfer of Python objects through RPC calls, see the modules `pickle` and `shelve`. The `marshal` module exists mainly to support reading and writing the “pseudo-compiled” code for Python modules of `.pyc` files. Therefore, the Python maintainers reserve the right to modify the marshal format in backward incompatible ways should the need arise. The format of code objects is not compatible between Python versions, even if the version of the format is the same. De-serializing a code object in the incorrect Python version has undefined behavior. If you’re serializing and de-serializing Python objects, use the `pickle` module instead – the performance is comparable, version independence is guaranteed, and pickle supports a substantially wider range of objects than marshal.

**Warning:**

The `marshal` module is not intended to be secure against erroneous or maliciously constructed data. Never unmarshal data received from an untrusted or unauthenticated source.

There are functions that read/write files as well as functions operating on bytes-like objects.

Not all Python object types are supported; in general, only objects whose value is independent from a particular invocation of Python can be written and read by this module. The following types are supported:

- Numeric types: `int`, `bool`, `float`, `complex`.

- Strings (`str`) and `bytes`. Bytes-like objects like `bytearray` are marshalled as `bytes`.

- Containers: `tuple`, `list`, `dict`, `frozendict` (since `version` 6), `set`, `frozenset`, and `slice` (since `version` 5). It should be understood that these are supported only if the values contained therein are themselves supported. Recursive containers are supported since `version` 3.

- The singletons `None`, `Ellipsis` and `StopIteration`.

- `code` objects, if *allow_code* is true. See note above about version dependence.

Changed in version 3.4:

- Added format version 3, which supports marshalling recursive lists, sets and dictionaries.

- Added format version 4, which supports efficient representations of short strings.

Changed in version 3.14: Added format version 5, which allows marshalling slices.

Changed in version 3.15: Added format version 6, which allows marshalling `frozendict`.

The module defines these functions:

<!-- anchor: marshal.dump | type: py function -->
## `marshal.dump(value, file, version=version, /, *, allow_code=True)`

Write the value on the open file. The value must be a supported type. The file must be a writeable binary file.

If the value has (or contains an object that has) an unsupported type, a `ValueError` exception is raised — but garbage data will also be written to the file. The object will not be properly read back by `load()`. Code objects are only supported if *allow_code* is true.

The *version* argument indicates the data format that `dump` should use (see below).

Raises an auditing event `marshal.dumps` with arguments `value`, `version`.

Changed in version 3.13: Added the *allow_code* parameter.

<!-- anchor: marshal.load | type: py function -->
## `marshal.load(file, /, *, allow_code=True)`

Read one value from the open file and return it. If no valid value is read (e.g. because the data has a different Python version’s incompatible marshal format), raise `EOFError`, `ValueError` or `TypeError`. Code objects are only supported if *allow_code* is true. The file must be a readable binary file.

Raises an auditing event `marshal.load` with no arguments.

**Note:**

If an object containing an unsupported type was marshalled with `dump()`, `load()` will substitute `None` for the unmarshallable type.

Changed in version 3.10: This call used to raise a `code.__new__` audit event for each code object. Now it raises a single `marshal.load` event for the entire load operation.

Changed in version 3.13: Added the *allow_code* parameter.

<!-- anchor: marshal.dumps | type: py function -->
## `marshal.dumps(value, version=version, /, *, allow_code=True)`

Return the bytes object that would be written to a file by `dump(value, file)`. The value must be a supported type. Raise a `ValueError` exception if value has (or contains an object that has) an unsupported type. Code objects are only supported if *allow_code* is true.

The *version* argument indicates the data format that `dumps` should use (see below).

Raises an auditing event `marshal.dumps` with arguments `value`, `version`.

Changed in version 3.13: Added the *allow_code* parameter.

<!-- anchor: marshal.loads | type: py function -->
## `marshal.loads(bytes, /, *, allow_code=True)`

Convert the bytes-like object to a value. If no valid value is found, raise `EOFError`, `ValueError` or `TypeError`. Code objects are only supported if *allow_code* is true. Extra bytes in the input are ignored.

Raises an auditing event `marshal.loads` with argument `bytes`.

Changed in version 3.10: This call used to raise a `code.__new__` audit event for each code object. Now it raises a single `marshal.loads` event for the entire load operation.

Changed in version 3.13: Added the *allow_code* parameter.

In addition, the following constants are defined:

<!-- anchor: marshal.version | type: py data -->
## `marshal.version`

Indicates the format that the module uses. Version 0 is the historical first version; subsequent versions add new features. Generally, a new version becomes the default when it is introduced.

| Version | Available since | New features |
| --- | --- | --- |
| 1 | Python 2.4 | Sharing interned strings |
| 2 | Python 2.5 | Binary representation of floats |
| 3 | Python 3.4 | Support for object instancing and recursion |
| 4 | Python 3.4 | Efficient representation of short strings |
| 5 | Python 3.14 | Support for `slice` objects |
| 6 | Python 3.15 | Support for `frozendict` objects |

**Footnotes**

[1]

The name of this module stems from a bit of terminology used by the designers of Modula-3 (amongst others), who use the term “marshalling” for shipping of data around in a self-contained form. Strictly speaking, “to marshal” means to convert some data from internal to external form (in an RPC buffer for instance) and “unmarshalling” for the reverse process.
