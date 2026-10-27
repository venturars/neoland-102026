---
page: builtins/constants.html
title: Built-in Constants
area: builtins
kind: guide
---

<!-- anchor: built-in-constants | type: section -->
# Built-in Constants

A small number of constants live in the built-in namespace. They are:

<!-- anchor: False | type: py data -->
## `False`

The false value of the `bool` type. Assignments to `False` are illegal and raise a `SyntaxError`.

<!-- anchor: True | type: py data -->
## `True`

The true value of the `bool` type. Assignments to `True` are illegal and raise a `SyntaxError`.

<!-- anchor: None | type: py data -->
## `None`

An object frequently used to represent the absence of a value, as when default arguments are not passed to a function. Assignments to `None` are illegal and raise a `SyntaxError`. `None` is the sole instance of the `NoneType` type.

<!-- anchor: NotImplemented | type: py data -->
## `NotImplemented`

A special value which should be returned by the binary special methods (e.g. `__eq__()`, `__lt__()`, `__add__()`, `__rsub__()`, etc.) to indicate that the operation is not implemented with respect to the other type; may be returned by the in-place binary special methods (e.g. `__imul__()`, `__iand__()`, etc.) for the same purpose. It should not be evaluated in a boolean context. `NotImplemented` is the sole instance of the `types.NotImplementedType` type.

**Note:**

When a binary (or in-place) method returns `NotImplemented` the interpreter will try the reflected operation on the other type (or some other fallback, depending on the operator). If all attempts return `NotImplemented`, the interpreter will raise an appropriate exception. Incorrectly returning `NotImplemented` will result in a misleading error message or the `NotImplemented` value being returned to Python code.

See Implementing the arithmetic operations for examples.

**Caution:**

`NotImplemented` and `NotImplementedError` are not interchangeable. This constant should only be used as described above; see `NotImplementedError` for details on correct usage of the exception.

Changed in version 3.9: Evaluating `NotImplemented` in a boolean context was deprecated.

Changed in version 3.14: Evaluating `NotImplemented` in a boolean context now raises a `TypeError`. It previously evaluated to `True` and emitted a `DeprecationWarning` since Python 3.9.

<!-- anchor: Ellipsis | type: py data -->
## `Ellipsis`

The same as the ellipsis literal “`...`”, an object frequently used to indicate that something is omitted. Assignment to `Ellipsis` is possible, but assignment to `...` raises a `SyntaxError`. `Ellipsis` is the sole instance of the `types.EllipsisType` type.

<!-- anchor: debug__ | type: py data -->
## `__debug__`

This constant is true if Python was not started with an `-O` option. See also the `assert` statement.

**Note:**

The names `None`, `False`, `True` and `__debug__` cannot be reassigned (assignments to them, even as an attribute name, raise `SyntaxError`), so they can be considered “true” constants.

<!-- anchor: constants-added-by-the-site-module | type: section -->
## Constants added by the `site` module

The `site` module (which is imported automatically during startup, except if the `-S` command-line option is given) adds several constants to the built-in namespace. They are useful for the interactive interpreter shell and should not be used in programs.

<!-- anchor: quit | type: py data -->
### `quit(code=None)`

`exit(code=None)`

Objects that when printed, print a message like “Use quit() or Ctrl-D (i.e. EOF) to exit”, and when accessed directly in the interactive interpreter or called as functions, raise `SystemExit` with the specified exit code.

<!-- anchor:  | type: py data -->
### `help`

Object that when printed, prints the message “Type help() for interactive help, or help(object) for help about object.”, and when accessed directly in the interactive interpreter, invokes the built-in help system (see `help()`).

<!-- anchor: copyright | type: py data -->
### `copyright`

`credits`

Objects that when printed or called, print the text of copyright or credits, respectively.

<!-- anchor: license | type: py data -->
### `license`

Object that when printed, prints the message “Type license() to see the full license text”, and when called, displays the full license text in a pager-like fashion (one screen at a time).
