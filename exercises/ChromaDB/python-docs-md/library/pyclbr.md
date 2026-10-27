---
page: library/pyclbr.html
title: pyclbr — Python module browser support
area: library
kind: guide
module: pyclbr
---

<!-- anchor: module-pyclbr | type: section -->
# `pyclbr` — Python module browser support

**Source code:** Lib/pyclbr.py

The `pyclbr` module provides limited information about the functions, classes, and methods defined in a Python-coded module. The information is sufficient to implement a module browser. The information is extracted from the Python source code rather than by importing the module, so this module is safe to use with untrusted code. This restriction makes it impossible to use this module with modules not implemented in Python, including all standard and optional extension modules.

<!-- anchor: pyclbr.readmodule | type: py function -->
## `pyclbr.readmodule(module, path=None)`

Return a dictionary mapping module-level class names to class descriptors. If possible, descriptors for imported base classes are included. Parameter *module* is a string with the name of the module to read; it may be the name of a module within a package. If given, *path* is a sequence of directory paths prepended to `sys.path`, which is used to locate the module source code.

This function is the original interface and is only kept for back compatibility. It returns a filtered version of the following.

<!-- anchor: pyclbr.readmodule_ex | type: py function -->
## `pyclbr.readmodule_ex(module, path=None)`

Return a dictionary-based tree containing a function or class descriptors for each function and class defined in the module with a `def` or `class` statement. The returned dictionary maps module-level function and class names to their descriptors. Nested objects are entered into the children dictionary of their parent. As with readmodule, *module* names the module to be read and *path* is prepended to sys.path. If the module being read is a package, the returned dictionary has a key `'__path__'` whose value is a list containing the package search path.

Added in version 3.7: Descriptors for nested definitions. They are accessed through the new children attribute. Each has a new parent attribute.

The descriptors returned by these functions are instances of Function and Class classes. Users are not expected to create instances of these classes.

<!-- anchor: function-objects | type: section -->
## Function Objects

<!-- anchor: pyclbr.Function | type: py class -->
### `class pyclbr.Function`

Class `Function` instances describe functions defined by def statements. They have the following attributes:

<!-- anchor: pyclbr.Function.file | type: py attribute -->
#### `file`

Name of the file in which the function is defined.

<!-- anchor: pyclbr.Function.module | type: py attribute -->
#### `module`

The name of the module defining the function described.

<!-- anchor: pyclbr.Function.name | type: py attribute -->
#### `name`

The name of the function.

<!-- anchor: pyclbr.Function.lineno | type: py attribute -->
#### `lineno`

The line number in the file where the definition starts.

<!-- anchor: pyclbr.Function.parent | type: py attribute -->
#### `parent`

For top-level functions, `None`. For nested functions, the parent.

Added in version 3.7.

<!-- anchor: pyclbr.Function.children | type: py attribute -->
#### `children`

A `dictionary` mapping names to descriptors for nested functions and classes.

Added in version 3.7.

<!-- anchor: pyclbr.Function.is_async | type: py attribute -->
#### `is_async`

`True` for functions that are defined with the `async` prefix, `False` otherwise.

Added in version 3.10.

<!-- anchor: class-objects | type: section -->
## Class Objects

<!-- anchor: pyclbr.Class | type: py class -->
### `class pyclbr.Class`

Class `Class` instances describe classes defined by class statements. They have the same attributes as `Functions` and two more.

<!-- anchor: pyclbr.Class.file | type: py attribute -->
#### `file`

Name of the file in which the class is defined.

<!-- anchor: pyclbr.Class.module | type: py attribute -->
#### `module`

The name of the module defining the class described.

<!-- anchor: pyclbr.Class.name | type: py attribute -->
#### `name`

The name of the class.

<!-- anchor: pyclbr.Class.lineno | type: py attribute -->
#### `lineno`

The line number in the file where the definition starts.

<!-- anchor: pyclbr.Class.parent | type: py attribute -->
#### `parent`

For top-level classes, `None`. For nested classes, the parent.

Added in version 3.7.

<!-- anchor: pyclbr.Class.children | type: py attribute -->
#### `children`

A dictionary mapping names to descriptors for nested functions and classes.

Added in version 3.7.

<!-- anchor: pyclbr.Class.super | type: py attribute -->
#### `super`

A list of `Class` objects which describe the immediate base classes of the class being described. Classes which are named as superclasses but which are not discoverable by `readmodule_ex()` are listed as a string with the class name instead of as `Class` objects.

<!-- anchor: pyclbr.Class.methods | type: py attribute -->
#### `methods`

A `dictionary` mapping method names to line numbers. This can be derived from the newer `children` dictionary, but remains for back-compatibility.
