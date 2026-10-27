---
page: library/string.templatelib.html
title: string.templatelib — Support for template string literals
area: library
kind: guide
module: string.templatelib
---

<!-- anchor: module-string.templatelib | type: section -->
# `string.templatelib` — Support for template string literals

**Source code:** Lib/string/templatelib.py

**See also:**

- Format strings

- Template string literal (t-string) syntax

- **PEP 750**

<!-- anchor: template-strings | type: section -->
## Template strings

Added in version 3.14.

Template strings are a mechanism for custom string processing. They have the full flexibility of Python’s f-strings, but return a `Template` instance that gives access to the static and interpolated (in curly brackets) parts of a string *before* they are combined.

To write a t-string, use a `'t'` prefix instead of an `'f'`, like so:

```pycon
>>> pi = 3.14
>>> t't-strings are new in Python {pi!s}!'
Template(
   strings=('t-strings are new in Python ', '!'),
   interpolations=(Interpolation(3.14, 'pi', 's', ''),)
)
```

<!-- anchor: types | type: section -->
## Types

<!-- anchor: string.templatelib.Template | type: py class -->
### `class string.templatelib.Template`

The `Template` class describes the contents of a template string. It is immutable, meaning that attributes of a template cannot be reassigned.

The most common way to create a `Template` instance is to use the template string literal syntax. This syntax is identical to that of f-strings, except that it uses a `t` prefix in place of an `f`:

```
>>> cheese = 'Red Leicester'
>>> template = t"We're fresh out of {cheese}, sir."
>>> type(template)
<class 'string.templatelib.Template'>
```

Templates are stored as sequences of literal `strings` and dynamic `interpolations`. A `values` attribute holds the values of the interpolations:

```
>>> cheese = 'Camembert'
>>> template = t'Ah! We do have {cheese}.'
>>> template.strings
('Ah! We do have ', '.')
>>> template.interpolations
(Interpolation('Camembert', ...),)
>>> template.values
('Camembert',)
```

The `strings` tuple has one more element than `interpolations` and `values`; the interpolations “belong” between the strings. This may be easier to understand when tuples are aligned

```python
template.strings:  ('Ah! We do have ',              '.')
template.values:   (                   'Camembert',    )
```

**Attributes**

<!-- anchor: string.templatelib.Template.strings | type: py attribute -->
#### `strings: tuple[str, ...]`

A `tuple` of the static strings in the template.

```
>>> cheese = 'Camembert'
>>> template = t'Ah! We do have {cheese}.'
>>> template.strings
('Ah! We do have ', '.')
```

Empty strings *are* included in the tuple:

```
>>> response = 'We do have '
>>> cheese = 'Camembert'
>>> template = t'Ah! {response}{cheese}.'
>>> template.strings
('Ah! ', '', '.')
```

The `strings` tuple is never empty, and always contains one more string than the `interpolations` and `values` tuples:

```
>>> t''.strings
('',)
>>> t''.values
()
>>> t'{'cheese'}'.strings
('', '')
>>> t'{'cheese'}'.values
('cheese',)
```

<!-- anchor: string.templatelib.Template.interpolations | type: py attribute -->
#### `interpolations: tuple[Interpolation, ...]`

A `tuple` of the interpolations in the template.

```
>>> cheese = 'Camembert'
>>> template = t'Ah! We do have {cheese}.'
>>> template.interpolations
(Interpolation('Camembert', 'cheese', None, ''),)
```

The `interpolations` tuple may be empty and always contains one fewer values than the `strings` tuple:

```
>>> t'Red Leicester'.interpolations
()
```

<!-- anchor: string.templatelib.Template.values | type: py attribute -->
#### `values: tuple[object, ...]`

A tuple of all interpolated values in the template.

```
>>> cheese = 'Camembert'
>>> template = t'Ah! We do have {cheese}.'
>>> template.values
('Camembert',)
```

The `values` tuple always has the same length as the `interpolations` tuple. It is always equivalent to `tuple(i.value for i in template.interpolations)`.

**Methods**

<!-- anchor: string.templatelib.Template.__new__ | type: py method -->
#### `__new__(*args: str | Interpolation)`

While literal syntax is the most common way to create a `Template`, it is also possible to create them directly using the constructor:

```
>>> from string.templatelib import Interpolation, Template
>>> cheese = 'Camembert'
>>> template = Template(
...     'Ah! We do have ', Interpolation(cheese, 'cheese'), '.'
... )
>>> list(template)
['Ah! We do have ', Interpolation('Camembert', 'cheese', None, ''), '.']
```

If multiple strings are passed consecutively, they will be concatenated into a single value in the `strings` attribute. For example, the following code creates a `Template` with a single final string:

```
>>> from string.templatelib import Template
>>> template = Template('Ah! We do have ', 'Camembert', '.')
>>> template.strings
('Ah! We do have Camembert.',)
```

If multiple interpolations are passed consecutively, they will be treated as separate interpolations and an empty string will be inserted between them. For example, the following code creates a template with empty placeholders in the `strings` attribute:

```
>>> from string.templatelib import Interpolation, Template
>>> template = Template(
...     Interpolation('Camembert', 'cheese'),
...     Interpolation('.', 'punctuation'),
... )
>>> template.strings
('', '', '')
```

**iter(template)**

Iterate over the template, yielding each non-empty string and `Interpolation` in the correct order:

```
>>> cheese = 'Camembert'
>>> list(t'Ah! We do have {cheese}.')
['Ah! We do have ', Interpolation('Camembert', 'cheese', None, ''), '.']
```

**Caution:**

Empty strings are **not** included in the iteration:

```
>>> response = 'We do have '
>>> cheese = 'Camembert'
>>> list(t'Ah! {response}{cheese}.')
['Ah! ',
 Interpolation('We do have ', 'response', None, ''),
 Interpolation('Camembert', 'cheese', None, ''),
 '.']
```

**template + other**

**template += other**

Concatenate this template with another, returning a new `Template` instance:

```
>>> cheese = 'Camembert'
>>> list(t'Ah! ' + t'We do have {cheese}.')
['Ah! We do have ', Interpolation('Camembert', 'cheese', None, ''), '.']
```

Concatenating a `Template` and a `str` is **not** supported. This is because it is unclear whether the string should be treated as a static string or an interpolation. If you want to concatenate a `Template` with a string, you should either wrap the string directly in a `Template` (to treat it as a static string) or use an `Interpolation` (to treat it as dynamic):

```
>>> from string.templatelib import Interpolation, Template
>>> template = t'Ah! '
>>> # Treat 'We do have ' as a static string
>>> template += Template('We do have ')
>>> # Treat cheese as an interpolation
>>> cheese = 'Camembert'
>>> template += Template(Interpolation(cheese, 'cheese'))
>>> list(template)
['Ah! We do have ', Interpolation('Camembert', 'cheese', None, '')]
```

<!-- anchor: string.templatelib.Interpolation | type: py class -->
### `class string.templatelib.Interpolation`

The `Interpolation` type represents an expression inside a template string. It is immutable, meaning that attributes of an interpolation cannot be reassigned.

Interpolations support pattern matching, allowing you to match against their attributes with the match statement:

```
>>> from string.templatelib import Interpolation
>>> interpolation = t'{1. + 2.:.2f}'.interpolations[0]
>>> interpolation
Interpolation(3.0, '1. + 2.', None, '.2f')
>>> match interpolation:
...     case Interpolation(value, expression, conversion, format_spec):
...         print(value, expression, conversion, format_spec, sep=' | ')
...
3.0 | 1. + 2. | None | .2f
```

Interpolations are generic over the types of their values.

**Attributes**

<!-- anchor: string.templatelib.Interpolation.value | type: py attribute -->
#### `value: object`

The evaluated value of the interpolation.

```
>>> t'{1 + 2}'.interpolations[0].value
3
```

<!-- anchor: string.templatelib.Interpolation.expression | type: py attribute -->
#### `expression: str`

For interpolations created by t-string literals, `expression` is the expression text found inside the curly brackets (`{` & `}`), including any whitespace, excluding the curly brackets themselves, and ending before the first `!`, `:`, or `=` if any is present. For manually created interpolations, `expression` is the arbitrary string provided when constructing the interpolation instance.

We recommend using valid Python expressions or the empty string for the `expression` field of manually created `Interpolation` instances, although this is not enforced at runtime.

```
>>> t'{1 + 2}'.interpolations[0].expression
'1 + 2'
```

<!-- anchor: string.templatelib.Interpolation.conversion | type: py attribute -->
#### `conversion: Literal['a', 'r', 's'] | None`

The conversion to apply to the value, or `None`.

The `conversion` is the optional conversion to apply to the value:

```
>>> t'{1 + 2!a}'.interpolations[0].conversion
'a'
```

**Note:**

Unlike f-strings, where conversions are applied automatically, the expected behavior with t-strings is that code that *processes* the `Template` will decide how to interpret and whether to apply the `conversion`. For convenience, the `convert()` function can be used to mimic f-string conversion semantics.

<!-- anchor: string.templatelib.Interpolation.format_spec | type: py attribute -->
#### `format_spec: str`

The format specification to apply to the value.

The `format_spec` is an optional, arbitrary string used as the format specification to present the value:

```
>>> t'{1 + 2:.2f}'.interpolations[0].format_spec
'.2f'
```

**Note:**

Unlike f-strings, where format specifications are applied automatically via the `format()` protocol, the expected behavior with t-strings is that code that *processes* the interpolation will decide how to interpret and whether to apply the format specification. As a result, `format_spec` values in interpolations can be arbitrary strings, including those that do not conform to the `format()` protocol.

**Methods**

<!-- anchor: string.templatelib.Interpolation.__new__ | type: py method -->
#### `__new__(value: object, expression: str, conversion: Literal['a', 'r', 's'] | None = None, format_spec: str = '')`

Create a new `Interpolation` object from component parts.

**Parameters:**

- **value** – The evaluated, in-scope result of the interpolation.

- **expression** – The text of a valid Python expression, or an empty string.

- **conversion** – The conversion to be used, one of `None`, `'a'`, `'r'`, or `'s'`.

- **format_spec** – An optional, arbitrary string used as the format specification to present the value.

<!-- anchor: helper-functions | type: section -->
## Helper functions

<!-- anchor: string.templatelib.convert | type: py function -->
### `string.templatelib.convert(obj, /, conversion)`

Applies formatted string literal conversion semantics to the given object *obj*. This is frequently useful for custom template string processing logic.

Three conversion flags are currently supported:

- `'s'` which calls `str()` on the value (like `!s`),

- `'r'` which calls `repr()` (like `!r`), and

- `'a'` which calls `ascii()` (like `!a`).

If the conversion flag is `None`, *obj* is returned unchanged.
