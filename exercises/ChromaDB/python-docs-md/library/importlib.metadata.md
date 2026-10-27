---
page: library/importlib.metadata.html
title: importlib.metadata – Accessing package metadata
area: library
kind: guide
module: importlib.metadata
---

<!-- anchor: module-importlib.metadata | type: section -->
# `importlib.metadata` – Accessing package metadata

Added in version 3.8.

Changed in version 3.10: `importlib.metadata` is no longer provisional.

**Source code:** Lib/importlib/metadata/__init__.py

`importlib.metadata` is a library that provides access to the metadata of an installed Distribution Package, such as its entry points or its top-level names (Import Packages, modules, if any). Built in part on Python’s import system, this library provides the entry point and metadata APIs that were previously exposed by the now-removed `pkg_resources` package. Along with `importlib.resources`, it supersedes `pkg_resources`.

`importlib.metadata` operates on third-party *distribution packages* installed into Python’s `site-packages` directory via tools such as pip. Specifically, it works with distributions with discoverable `dist-info` or `egg-info` directories, and metadata defined by the Core metadata specifications.

**Important:**

These are *not* necessarily equivalent to or correspond 1:1 with the top-level *import package* names that can be imported inside Python code. One *distribution package* can contain multiple *import packages* (and single modules), and one top-level *import package* may map to multiple *distribution packages* if it is a namespace package. You can use packages_distributions() to get a mapping between them.

By default, distribution metadata can live on the file system or in zip archives on `sys.path`. Through an extension mechanism, the metadata can live almost anywhere.

**See also:**

**https://importlib-metadata.readthedocs.io/**

The documentation for `importlib_metadata`, which supplies a backport of `importlib.metadata`. This includes an API reference for this module’s classes and functions, as well as a migration guide for existing users of `pkg_resources`.

<!-- anchor: overview | type: section -->
## Overview

Let’s say you wanted to get the version string for a Distribution Package you’ve installed using `pip`. We start by creating a virtual environment and installing something into it:

```shell-session
$ python -m venv example
$ source example/bin/activate
(example) $ python -m pip install wheel
```

You can get the version string for `wheel` by running the following:

```pycon
(example) $ python
>>> from importlib.metadata import version
>>> version('wheel')
'0.32.3'
```

You can also get a collection of entry points selectable by properties of the EntryPoint (typically ‘group’ or ‘name’), such as `console_scripts`, `distutils.commands` and others. Each group contains a collection of EntryPoint objects.

You can get the metadata for a distribution:

```python
>>> from importlib.metadata import metadata
>>> list(metadata('wheel'))
['Metadata-Version', 'Name', 'Version', 'Summary', 'Home-page', 'Author', 'Author-email', 'Maintainer', 'Maintainer-email', 'License', 'Project-URL', 'Project-URL', 'Project-URL', 'Keywords', 'Platform', 'Classifier', 'Classifier', 'Classifier', 'Classifier', 'Classifier', 'Classifier', 'Classifier', 'Classifier', 'Classifier', 'Classifier', 'Classifier', 'Classifier', 'Requires-Python', 'Provides-Extra', 'Requires-Dist', 'Requires-Dist']
```

You can also get a distribution’s version number, list its constituent files, and get a list of the distribution’s Distribution requirements.

<!-- anchor: importlib.metadata.PackageNotFoundError | type: py exception -->
### `exception importlib.metadata.PackageNotFoundError`

Subclass of `ModuleNotFoundError` raised by several functions in this module when queried for a distribution package which is not installed in the current Python environment.

<!-- anchor: importlib.metadata.MetadataNotFound | type: py exception -->
### `exception importlib.metadata.MetadataNotFound`

Subclass of `FileNotFoundError` raised when attempting to load metadata from a distribution folder that is empty or otherwise does not contain a metadata file.

<!-- anchor: functional-api | type: section -->
## Functional API

This package provides the following functionality via its public API.

<!-- anchor: entry-points | type: section -->
### Entry points

<!-- anchor: importlib.metadata.entry_points | type: py function -->
#### `importlib.metadata.entry_points(**select_params)`

Returns a `EntryPoints` instance describing entry points for the current environment. Any given keyword parameters are passed to the `select()` method for comparison to the attributes of the individual entry point definitions.

Note: to query for entry points based on `EntryPoint.dist` attribute, use `Distribution.entry_points()` instead (as different `Distribution` instances do not currently compare equal, even if they have the same attributes)

<!-- anchor: importlib.metadata.EntryPoints | type: py class -->
#### `class importlib.metadata.EntryPoints`

Details of a collection of installed entry points.

Also provides a `.groups` attribute that reports all identified entry point groups, and a `.names` attribute that reports all identified entry point names.

<!-- anchor: importlib.metadata.EntryPoint | type: py class -->
#### `class importlib.metadata.EntryPoint`

Details of an installed entry point.

Each `EntryPoint` instance has `.name`, `.group`, and `.value` attributes and a `.load()` method to resolve the value. There are also `.module`, `.attr`, and `.extras` attributes for getting the components of the `.value` attribute, and `.dist` for obtaining information regarding the distribution package that provides the entry point.

Query all entry points:

```python
>>> eps = entry_points()
```

The `entry_points()` function returns a `EntryPoints` object, a collection of all `EntryPoint` objects with `names` and `groups` attributes for convenience:

```python
>>> sorted(eps.groups)
['console_scripts', 'distutils.commands', 'distutils.setup_keywords', 'egg_info.writers', 'setuptools.installation']
```

`EntryPoints` has a `select()` method to select entry points matching specific properties. Select entry points in the `console_scripts` group:

```python
>>> scripts = eps.select(group='console_scripts')
```

Equivalently, since `entry_points()` passes keyword arguments through to select:

```python
>>> scripts = entry_points(group='console_scripts')
```

Pick out a specific script named “wheel” (found in the wheel project):

```python
>>> 'wheel' in scripts.names
True
>>> wheel = scripts['wheel']
```

Equivalently, query for that entry point during selection:

```python
>>> (wheel,) = entry_points(group='console_scripts', name='wheel')
>>> (wheel,) = entry_points().select(group='console_scripts', name='wheel')
```

Inspect the resolved entry point:

```python
>>> wheel
EntryPoint(name='wheel', value='wheel.cli:main', group='console_scripts')
>>> wheel.module
'wheel.cli'
>>> wheel.attr
'main'
>>> wheel.extras
[]
>>> main = wheel.load()
>>> main
<function main at 0x103528488>
```

The `group` and `name` are arbitrary values defined by the package author and usually a client will wish to resolve all entry points for a particular group. Read the setuptools docs for more information on entry points, their definition, and usage.

Changed in version 3.12: The “selectable” entry points were introduced in `importlib_metadata` 3.6 and Python 3.10. Prior to those changes, `entry_points` accepted no parameters and always returned a dictionary of entry points, keyed by group. With `importlib_metadata` 5.0 and Python 3.12, `entry_points` always returns an `EntryPoints` object. See backports.entry_points_selectable for compatibility options.

Changed in version 3.13: `EntryPoint` objects no longer present a tuple-like interface (`__getitem__()`).

<!-- anchor: distribution-metadata | type: section -->
### Distribution metadata

<!-- anchor: importlib.metadata.metadata | type: py function -->
#### `importlib.metadata.metadata(distribution_name)`

Return the distribution metadata corresponding to the named distribution package as a `PackageMetadata` instance.

Raises `PackageNotFoundError` if the named distribution package is not installed in the current Python environment.

Raises `MetadataNotFound` if a distribution package is present but no METADATA file is present.

<!-- anchor: importlib.metadata.PackageMetadata | type: py class -->
#### `class importlib.metadata.PackageMetadata`

A concrete implementation of the PackageMetadata protocol.

In addition to providing the defined protocol methods and attributes, subscripting the instance is equivalent to calling the `get()` method.

Every Distribution Package includes some metadata, which you can extract using the `metadata()` function:

```python
>>> wheel_metadata = metadata('wheel')
```

The keys of the returned data structure name the metadata keywords, and the values are returned unparsed from the distribution metadata:

```python
>>> wheel_metadata['Requires-Python']
'>=2.7, !=3.0.*, !=3.1.*, !=3.2.*, !=3.3.*'
```

`PackageMetadata` also presents a `json` attribute that returns all the metadata in a JSON-compatible form per **PEP 566**:

```python
>>> wheel_metadata.json['requires_python']
'>=2.7, !=3.0.*, !=3.1.*, !=3.2.*, !=3.3.*'
```

The full set of available metadata is not described here. See the PyPA Core metadata specification for additional details.

Changed in version 3.15: Previously and incidentally, if a METADATA file was missing from a distribution, an empty `PackageMetadata` would be returned, indistinguishable from an empty METADATA file. Now, a missing METADATA file triggers a `MetadataNotFound` exception.

Changed in version 3.10: The `Description` is now included in the metadata when presented through the payload. Line continuation characters have been removed.

The `json` attribute was added.

<!-- anchor: distribution-versions | type: section -->
### Distribution versions

<!-- anchor: importlib.metadata.version | type: py function -->
#### `importlib.metadata.version(distribution_name)`

Return the installed distribution package version for the named distribution package.

Raises `PackageNotFoundError` if the named distribution package is not installed in the current Python environment.

The `version()` function is the quickest way to get a Distribution Package’s version number, as a string:

```python
>>> version('wheel')
'0.32.3'
```

<!-- anchor: distribution-files | type: section -->
### Distribution files

<!-- anchor: importlib.metadata.files | type: py function -->
#### `importlib.metadata.files(distribution_name)`

Return the full set of files contained within the named distribution package as `PackagePath` instances.

Raises `PackageNotFoundError` if the named distribution package is not installed in the current Python environment.

Returns `None` if the distribution is found but the installation database records reporting the files associated with the distribution package are missing.

<!-- anchor: importlib.metadata.PackagePath | type: py class -->
#### `class importlib.metadata.PackagePath`

A `pathlib.PurePath` derived object with additional `dist`, `size`, and `hash` properties corresponding to the distribution package’s installation metadata for that file, also:

<!-- anchor: importlib.metadata.PackagePath.locate | type: py method -->
##### `locate()`

If possible, return the concrete `SimplePath` allowing to access data, or raise a `NotImplementedError` otherwise.

<!-- anchor: importlib.metadata.SimplePath | type: py class -->
#### `class importlib.metadata.SimplePath`

A protocol representing a minimal subset of `pathlib.Path` that allows to check if it `exists()`, to traverse using `joinpath()` and `parent`, and to retrieve data using `read_text()` and `read_bytes()`.

The `files()` function takes a Distribution Package name and returns all of the files installed by this distribution. For example:

```python
>>> util = [p for p in files('wheel') if 'util.py' in str(p)][0]
>>> util
PackagePath('wheel/util.py')
>>> util.size
859
>>> util.dist
<importlib.metadata._hooks.PathDistribution object at 0x101e0cef0>
>>> util.hash
<FileHash mode: sha256 value: bYkw5oMccfazVCoYQwKkkemoVyMAFoR34mmKBx8R1NI>
```

Once you have the file, you can also read its contents:

```python
>>> print(util.read_text())
import base64
import sys
...
def as_bytes(s):
    if isinstance(s, text_type):
        return s.encode('utf-8')
    return s
```

You can also use the `locate()` method to get the absolute path to the file:

```python
>>> util.locate()
PosixPath('/home/gustav/example/lib/site-packages/wheel/util.py')
```

In the case where the metadata file listing files (`RECORD` or `SOURCES.txt`) is missing, `files()` will return `None`. The caller may wish to wrap calls to `files()` in always_iterable or otherwise guard against this condition if the target distribution is not known to have the metadata present.

<!-- anchor: distribution-requirements | type: section -->
### Distribution requirements

<!-- anchor: importlib.metadata.requires | type: py function -->
#### `importlib.metadata.requires(distribution_name)`

Return the declared dependency specifiers for the named distribution package.

Raises `PackageNotFoundError` if the named distribution package is not installed in the current Python environment.

To get the full set of requirements for a Distribution Package, use the `requires()` function:

```python
>>> requires('wheel')
["pytest (>=3.0.0) ; extra == 'test'", "pytest-cov ; extra == 'test'"]
```

<!-- anchor: mapping-import-to-distribution-packages | type: section -->
### Mapping import to distribution packages

<!-- anchor: importlib.metadata.packages_distributions | type: py function -->
#### `importlib.metadata.packages_distributions()`

Return a mapping from the top level module and import package names found via `sys.meta_path` to the names of the distribution packages (if any) that provide the corresponding files.

To allow for namespace packages (which may have members provided by multiple distribution packages), each top level import name maps to a list of distribution names rather than mapping directly to a single name.

A convenience method to resolve the Distribution Package name (or names, in the case of a namespace package) that provide each importable top-level Python module or Import Package:

```python
>>> packages_distributions()
{'importlib_metadata': ['importlib-metadata'], 'yaml': ['PyYAML'], 'jaraco': ['jaraco.classes', 'jaraco.functools'], ...}
```

Some editable installs, do not supply top-level names, and thus this function is not reliable with such installs.

Added in version 3.10.

<!-- anchor: distributions | type: section -->
## Distributions

While the module level API described above is the most common and convenient usage, all that information is accessible from the `Distribution` class. `Distribution` is an abstract object that represents the metadata for a Python Distribution Package. Get the concrete `Distribution` subclass instance for an installed distribution package by calling the `distribution()` function:

```python
>>> from importlib.metadata import distribution
>>> dist = distribution('wheel')
>>> type(dist)
<class 'importlib.metadata.PathDistribution'>
```

<!-- anchor: importlib.metadata.distribution | type: py function -->
### `importlib.metadata.distribution(distribution_name)`

Return a `Distribution` instance describing the named distribution package.

Raises `PackageNotFoundError` if the named distribution package is not installed in the current Python environment.

Thus, an alternative way to get e.g. the version number is through the `Distribution.version` attribute:

```python
>>> dist.version
'0.32.3'
```

The same applies for `entry_points()` and `files()`.

<!-- anchor: importlib.metadata.Distribution | type: py class -->
### `class importlib.metadata.Distribution`

Details of an installed distribution package.

Note: different `Distribution` instances do not currently compare equal, even if they relate to the same installed distribution and accordingly have the same attributes.

<!-- anchor: importlib.metadata.Distribution.at | type: py method -->
#### `static at(path)`

<!-- anchor: importlib.metadata.Distribution.from_name | type: py method -->
#### `classmethod from_name(name)`

Return a `Distribution` instance at the given path or with the given name.

<!-- anchor: importlib.metadata.Distribution.discover | type: py method -->
#### `classmethod discover(*, context=None, **kwargs)`

Returns an iterable of `Distribution` instances for all packages (see distribution-discovery).

The optional argument *context* is a `DistributionFinder.Context` instance, used to modify the search for distributions. Alternatively, *kwargs* may contain keyword arguments for constructing a new `DistributionFinder.Context`.

<!-- anchor: importlib.metadata.Distribution.metadata | type: py attribute -->
#### `metadata: PackageMetadata`

Raises `MetadataNotFound` if the METADATA file is not present in the distribution.

There are all kinds of additional metadata available on `Distribution` instances as a `PackageMetadata` instance:

```python
>>> dist.metadata['Requires-Python']
'>=2.7, !=3.0.*, !=3.1.*, !=3.2.*, !=3.3.*'
>>> dist.metadata['License']
'MIT'
```

The full set of available metadata is not described here. See the PyPA Core metadata specification for additional details.

<!-- anchor: importlib.metadata.Distribution.name | type: py attribute -->
#### `name: str`

<!-- anchor: importlib.metadata.Distribution.requires | type: py attribute -->
#### `requires: list[str]`

<!-- anchor: importlib.metadata.Distribution.version | type: py attribute -->
#### `version: str`

A few metadata fields are also available as shortcut properties.

Added in version 3.10: The `name` shortcut was added.

<!-- anchor: importlib.metadata.Distribution.origin | type: py attribute -->
#### `origin`

For editable packages, an `origin` property may present **PEP 610** metadata (for non-editable packages, `origin` is `None`):

```python
>>> dist.origin.url
'file:///path/to/wheel-0.32.3.editable-py3-none-any.whl'
```

The `origin` object follows the Direct URL Data Structure.

Added in version 3.13.

<!-- anchor: importlib.metadata.Distribution.entry_points | type: py attribute -->
#### `entry_points: EntryPoints`

The entry points provided by this distribution package.

<!-- anchor: importlib.metadata.Distribution.files | type: py attribute -->
#### `files: list[PackagePath] | None`

All files contained in this distribution package. Like `files()`, this returns `None` if there are no records.

The following two abstract methods need to be implemented when implementing-custom-providers:

<!-- anchor: importlib.metadata.Distribution.locate_file | type: py method -->
#### `locate_file(path)`

Like `PackagePath.locate()`, return a `SimplePath` for the given path. Takes a `os.PathLike` or a `str`.

<!-- anchor: importlib.metadata.Distribution.read_text | type: py method -->
#### `read_text(filename)`

A shortcut for `distribution.locate_file(filename).read_text()`.

<!-- anchor: distribution-discovery | type: section -->
## Distribution Discovery

By default, this package provides built-in support for discovery of metadata for file system and zip file Distribution Packages. This metadata finder search defaults to `sys.path`, but varies slightly in how it interprets those values from how other import machinery does. In particular:

- `importlib.metadata` does not honor `bytes` objects on `sys.path`.

- `importlib.metadata` will incidentally honor `pathlib.Path` objects on `sys.path` even though such values will be ignored for imports.

<!-- anchor: importlib.metadata.DistributionFinder | type: py class -->
### `class importlib.metadata.DistributionFinder`

A `MetaPathFinder` subclass capable of discovering installed distributions.

Custom providers should implement this interface in order to supply metadata.

<!-- anchor: importlib.metadata.DistributionFinder.Context | type: py class -->
#### `class Context(**kwargs)`

A `Context` gives a custom provider a means to solicit additional details from the callers of distribution discovery functions like `distributions()` or `Distribution.discover()` beyond `.name` and `.path` when searching for distributions.

For example, a provider could expose suites of packages in either a “public” or “private” `realm`. A caller of distribution discovery functions may wish to query only for distributions in a particular realm and could call `distributions(realm="private")` to signal to the custom provider to only include distributions from that realm.

Each `DistributionFinder` must expect any parameters and should attempt to honor the canonical parameters defined below when appropriate.

See the section on Implementing Custom Providers for more details.

<!-- anchor: importlib.metadata.DistributionFinder.Context.name | type: py attribute -->
##### `name`

Specific name for which a distribution finder should match.

A `.name` of `None` matches all distributions.

<!-- anchor: importlib.metadata.DistributionFinder.Context.path | type: py attribute -->
##### `path`

A property providing the sequence of directory paths that a distribution finder should search.

Typically refers to Python installed package paths such as “site-packages” directories and defaults to `sys.path`.

<!-- anchor: importlib.metadata.distributions | type: py function -->
### `importlib.metadata.distributions(**kwargs)`

Returns an iterable of `Distribution` instances for all packages.

The *kwargs* argument may contain either a keyword argument `context`, a `DistributionFinder.Context` instance, or pass keyword arguments for constructing a new `DistributionFinder.Context`. The `DistributionFinder.Context` is used to modify the search for distributions.

<!-- anchor: implementing-custom-providers | type: section -->
## Implementing Custom Providers

`importlib.metadata` address two API surfaces, one for *consumers* and another for *providers*. Most users are consumers, consuming metadata provided by the packages. There are other use-cases, however, where users wish to expose metadata through some other mechanism, such as alongside a custom importer. Such a use case calls for a *custom provider*.

Because Distribution Package metadata is not available through `sys.path` searches, or package loaders directly, the metadata for a distribution is found through import system finders. To find a distribution package’s metadata, `importlib.metadata` queries the list of meta path finders on `sys.meta_path`.

The implementation has hooks integrated into the `PathFinder`, serving metadata for distribution packages found on the file system.

The abstract class `importlib.abc.MetaPathFinder` defines the interface expected of finders by Python’s import system. `importlib.metadata` extends this protocol by looking for an optional `find_distributions` callable on the finders from `sys.meta_path` and presents this extended interface as the `DistributionFinder` abstract base class, which defines this abstract method:

```python
@abc.abstractmethod
def find_distributions(context=DistributionFinder.Context()) -> Iterable[Distribution]:
    """Return an iterable of all Distribution instances capable of
    loading the metadata for packages for the indicated ``context``.
    """
```

The `DistributionFinder.Context` object provides `path` and `name` properties indicating the path to search and name to match and may supply other relevant context sought by the consumer.

In practice, to support finding distribution package metadata in locations other than the file system, subclass `Distribution` and implement the abstract methods. Then from a custom finder, return instances of this derived `Distribution` in the `find_distributions()` method.

<!-- anchor: example | type: section -->
### Example

Imagine a custom finder that loads Python modules from a database:

```python
class DatabaseImporter(importlib.abc.MetaPathFinder):
    def __init__(self, db):
        self.db = db

    def find_spec(self, fullname, target=None) -> ModuleSpec:
        return self.db.spec_from_name(fullname)

sys.meta_path.append(DatabaseImporter(connect_db(...)))
```

That importer now presumably provides importable modules from a database, but it provides no metadata or entry points. For this custom importer to provide metadata, it would also need to implement `DistributionFinder`:

```python
from importlib.metadata import DistributionFinder

class DatabaseImporter(DistributionFinder):
    ...

    def find_distributions(self, context=DistributionFinder.Context()):
        query = dict(name=context.name) if context.name else {}
        for dist_record in self.db.query_distributions(query):
            yield DatabaseDistribution(dist_record)
```

In this way, `query_distributions` would return records for each distribution served by the database matching the query. For example, if `requests-1.0` is in the database, `find_distributions` would yield a `DatabaseDistribution` for `Context(name='requests')` or `Context(name=None)`.

For the sake of simplicity, this example ignores `context.path`. The `path` attribute defaults to `sys.path` and is the set of import paths to be considered in the search. A `DatabaseImporter` could potentially function without any concern for a search path. Assuming the importer does no partitioning, the “path” would be irrelevant. In order to illustrate the purpose of `path`, the example would need to illustrate a more complex `DatabaseImporter` whose behavior varied depending on `sys.path`/`PYTHONPATH`. In that case, the `find_distributions` should honor the `context.path` and only yield `Distribution`s pertinent to that path.

`DatabaseDistribution`, then, would look something like:

```python
class DatabaseDistribution(importlib.metadata.Distribution):
    def __init__(self, record):
        self.record = record

    def read_text(self, filename):
        """
        Read a file like "METADATA" for the current distribution.
        """
        if filename == "METADATA":
            return f"""Name: {self.record.name}
Version: {self.record.version}
"""
        if filename == "entry_points.txt":
            return "\n".join(
              f"""[{ep.group}]\n{ep.name}={ep.value}"""
              for ep in self.record.entry_points)

    def locate_file(self, path):
        raise RuntimeError("This distribution has no file system")
```

This basic implementation should provide metadata and entry points for packages served by the `DatabaseImporter`, assuming that the `record` supplies suitable `.name`, `.version`, and `.entry_points` attributes.

The `DatabaseDistribution` may also provide other metadata files, like `RECORD` (required for `Distribution.files`) or override the implementation of `Distribution.files`. See the source for more inspiration.
