# Python built-ins reference

Python comes with a number of built-in functions and classes.

The built-in classes include data types that would normally be considered part
of the “core” of a language, such as numbers and lists. For these types, the
Python language core defines the form of literals and places some constraints
on their semantics, but does not fully define the semantics.

The built-ins also include functions and exceptions — objects that can
be used by all Python code without the need of an `import` statement.
Some of these are defined by the core language, but many are not essential for
the core semantics and are only described here.

See also

In addition to the built-ins, Python provides an extensive importable
standard library, see The Python standard library.

- Built-in Types
  - Truth Value Testing
  - Boolean Operations — `and`, `or`, `not`
  - Comparisons
  - Numeric Types — `int`, `float`, `complex`
  - Boolean Type - `bool`
  - Iteration-related types
  - Sequence Types — `list`, `tuple`, `range`
  - Text and Binary Sequence Type Methods Summary
  - Text Sequence Type — `str`
  - Binary Sequence Types — `bytes`, `bytearray`, `memoryview`
  - Set Types — `set`, `frozenset`
  - Mapping types — `dict`, `frozendict`
  - Context Manager Types
  - Type Annotation Types — Generic Alias, Union
  - Other Built-in Types
  - Special Attributes
  - Integer string conversion length limitation
- Built-in Constants
  - Constants added by the `site` module
- Built-in functions
- Built-in Exceptions
  - Exception context
  - Inheriting from built-in exceptions
  - Base classes
  - Concrete exceptions
  - Warnings
  - Exception groups
  - Exception hierarchy
- Thread Safety Guarantees
  - Thread safety levels
  - Thread safety for list objects
  - Thread safety for dict objects
  - Thread safety for set objects
  - Thread safety for bytearray objects
  - Thread safety for memoryview objects
- Time complexity of operations on built-in types
  - `list`
  - `tuple`
  - `dict`, `frozendict`
  - `set`, `frozenset`
  - `str`, `bytes`, `bytearray`
  - `memoryview`
  - `range`
  - Notes
