---
page: library/operator.html
title: operator — Standard operators as functions
area: library
kind: guide
module: operator
---

<!-- anchor: module-operator | type: section -->
# `operator` — Standard operators as functions

**Source code:** Lib/operator.py

The `operator` module exports a set of efficient functions corresponding to the intrinsic operators of Python. For example, `operator.add(x, y)` is equivalent to the expression `x+y`. Many function names are those used for special methods, without the double underscores. For backward compatibility, many of these have a variant with the double underscores kept. The variants without the double underscores are preferred for clarity.

The functions fall into categories that perform object comparisons, logical operations, mathematical operations and sequence operations.

The object comparison functions are useful for all objects, and are named after the rich comparison operators they support:

<!-- anchor: operator.lt | type: py function -->
## `operator.lt(a, b)`

`operator.le(a, b)`

`operator.eq(a, b)`

`operator.ne(a, b)`

`operator.ge(a, b)`

`operator.gt(a, b)`

`operator.__lt__(a, b)`

`operator.__le__(a, b)`

`operator.__eq__(a, b)`

`operator.__ne__(a, b)`

`operator.__ge__(a, b)`

`operator.__gt__(a, b)`

Perform “rich comparisons” between *a* and *b*. Specifically, `lt(a, b)` is equivalent to `a < b`, `le(a, b)` is equivalent to `a <= b`, `eq(a, b)` is equivalent to `a == b`, `ne(a, b)` is equivalent to `a != b`, `gt(a, b)` is equivalent to `a > b` and `ge(a, b)` is equivalent to `a >= b`. Note that these functions can return any value, which may or may not be interpretable as a Boolean value. See Comparisons for more information about rich comparisons.

The logical operations are also generally applicable to all objects, and support truth tests, identity tests, and boolean operations:

<!-- anchor: operator.not_ | type: py function -->
## `operator.not_(obj)`

`operator.__not__(obj)`

Return the outcome of `not` *obj*. (Note that there is no `__not__()` method for object instances; only the interpreter core defines this operation. The result is affected by the `__bool__()` and `__len__()` methods.)

<!-- anchor: operator.truth | type: py function -->
## `operator.truth(obj)`

Return `True` if *obj* is true, and `False` otherwise. This is equivalent to using the `bool` constructor.

<!-- anchor: operator.is_ | type: py function -->
## `operator.is_(a, b)`

Return `a is b`. Tests object identity.

<!-- anchor: operator.is_not | type: py function -->
## `operator.is_not(a, b)`

Return `a is not b`. Tests object identity.

<!-- anchor: operator.is_none | type: py function -->
## `operator.is_none(a)`

Return `a is None`. Tests object identity.

Added in version 3.14.

<!-- anchor: operator.is_not_none | type: py function -->
## `operator.is_not_none(a)`

Return `a is not None`. Tests object identity.

Added in version 3.14.

The mathematical and bitwise operations are the most numerous:

<!-- anchor: operator.abs | type: py function -->
## `operator.abs(obj)`

`operator.__abs__(obj)`

Return the absolute value of *obj*.

<!-- anchor: operator.add | type: py function -->
## `operator.add(a, b)`

`operator.__add__(a, b)`

Return `a + b`, for *a* and *b* numbers.

<!-- anchor: operator.and_ | type: py function -->
## `operator.and_(a, b)`

`operator.__and__(a, b)`

Return `a & b`.

<!-- anchor: operator.floordiv | type: py function -->
## `operator.floordiv(a, b)`

`operator.__floordiv__(a, b)`

Return `a // b`.

<!-- anchor: operator.index | type: py function -->
## `operator.index(a)`

`operator.__index__(a)`

Return *a* converted to an integer. Equivalent to `a.__index__()`.

Changed in version 3.10: The result always has exact type `int`. Previously, the result could have been an instance of a subclass of `int`.

<!-- anchor: operator.inv | type: py function -->
## `operator.inv(obj)`

`operator.invert(obj)`

`operator.__inv__(obj)`

`operator.__invert__(obj)`

Return `~obj`.

<!-- anchor: operator.lshift | type: py function -->
## `operator.lshift(a, b)`

`operator.__lshift__(a, b)`

Return `a << b`.

<!-- anchor: operator.mod | type: py function -->
## `operator.mod(a, b)`

`operator.__mod__(a, b)`

Return `a % b`.

<!-- anchor: operator.mul | type: py function -->
## `operator.mul(a, b)`

`operator.__mul__(a, b)`

Return `a * b`.

<!-- anchor: operator.matmul | type: py function -->
## `operator.matmul(a, b)`

`operator.__matmul__(a, b)`

Return `a @ b`.

Added in version 3.5.

<!-- anchor: operator.neg | type: py function -->
## `operator.neg(obj)`

`operator.__neg__(obj)`

Return *obj* negated (`-obj`).

<!-- anchor: operator.or_ | type: py function -->
## `operator.or_(a, b)`

`operator.__or__(a, b)`

Return `a | b`.

<!-- anchor: operator.pos | type: py function -->
## `operator.pos(obj)`

`operator.__pos__(obj)`

Return `+obj`.

<!-- anchor: operator.pow | type: py function -->
## `operator.pow(a, b)`

`operator.__pow__(a, b)`

Return `a ** b`.

<!-- anchor: operator.rshift | type: py function -->
## `operator.rshift(a, b)`

`operator.__rshift__(a, b)`

Return `a >> b`.

<!-- anchor: operator.sub | type: py function -->
## `operator.sub(a, b)`

`operator.__sub__(a, b)`

Return `a - b`.

<!-- anchor: operator.truediv | type: py function -->
## `operator.truediv(a, b)`

`operator.__truediv__(a, b)`

Return `a / b` where 2/3 is .66 rather than 0. This is also known as “true” division.

<!-- anchor: operator.xor | type: py function -->
## `operator.xor(a, b)`

`operator.__xor__(a, b)`

Return `a ^ b`.

Operations which work with sequences (some of them with mappings too) include:

<!-- anchor: operator.concat | type: py function -->
## `operator.concat(a, b)`

`operator.__concat__(a, b)`

Return `a + b` for *a* and *b* sequences.

<!-- anchor: operator.contains | type: py function -->
## `operator.contains(a, b)`

`operator.__contains__(a, b)`

Return the outcome of the test `b in a`. Note the reversed operands.

<!-- anchor: operator.countOf | type: py function -->
## `operator.countOf(a, b)`

Return the number of occurrences of *b* in *a*.

<!-- anchor: operator.delitem | type: py function -->
## `operator.delitem(a, b)`

`operator.__delitem__(a, b)`

Remove the value of *a* at index *b*.

<!-- anchor: operator.getitem | type: py function -->
## `operator.getitem(a, b)`

`operator.__getitem__(a, b)`

Return the value of *a* at index *b*.

<!-- anchor: operator.indexOf | type: py function -->
## `operator.indexOf(a, b)`

Return the index of the first of occurrence of *b* in *a*.

<!-- anchor: operator.setitem | type: py function -->
## `operator.setitem(a, b, c)`

`operator.__setitem__(a, b, c)`

Set the value of *a* at index *b* to *c*.

<!-- anchor: operator.length_hint | type: py function -->
## `operator.length_hint(obj, default=0)`

Return an estimated length for the object *obj*. First try to return its actual length, then an estimate using `object.__length_hint__()`, and finally return the default value.

Added in version 3.4.

The following operation works with callables:

<!-- anchor: operator.call | type: py function -->
## `operator.call(obj, /, *args, **kwargs)`

`operator.__call__(obj, /, *args, **kwargs)`

Return `obj(*args, **kwargs)`.

Added in version 3.11.

The `operator` module also defines tools for generalized attribute and item lookups. These are useful for making fast field extractors as arguments for `map()`, `sorted()`, `itertools.groupby()`, or other functions that expect a function argument.

<!-- anchor: operator.attrgetter | type: py function -->
## `operator.attrgetter(attr)`

`operator.attrgetter(*attrs)`

Return a callable object that fetches *attr* from its operand. If more than one attribute is requested, returns a tuple of attributes. The attribute names can also contain dots. For example:

- After `f = attrgetter('name')`, the call `f(b)` returns `b.name`.

- After `f = attrgetter('name', 'date')`, the call `f(b)` returns `(b.name, b.date)`.

- After `f = attrgetter('name.first', 'name.last')`, the call `f(b)` returns `(b.name.first, b.name.last)`.

Equivalent to:

```python
def attrgetter(*items):
    if any(not isinstance(item, str) for item in items):
        raise TypeError('attribute name must be a string')
    if len(items) == 1:
        attr = items[0]
        def g(obj):
            return resolve_attr(obj, attr)
    else:
        def g(obj):
            return tuple(resolve_attr(obj, attr) for attr in items)
    return g

def resolve_attr(obj, attr):
    for name in attr.split("."):
        obj = getattr(obj, name)
    return obj
```

<!-- anchor: operator.itemgetter | type: py function -->
## `operator.itemgetter(item)`

`operator.itemgetter(*items)`

Return a callable object that fetches *item* from its operand using the operand’s `__getitem__()` method. If multiple items are specified, returns a tuple of lookup values. For example:

- After `f = itemgetter(2)`, the call `f(r)` returns `r[2]`.

- After `g = itemgetter(2, 5, 3)`, the call `g(r)` returns `(r[2], r[5], r[3])`.

Equivalent to:

```python
def itemgetter(*items):
    if len(items) == 1:
        item = items[0]
        def g(obj):
            return obj[item]
    else:
        def g(obj):
            return tuple(obj[item] for item in items)
    return g
```

The items can be any type accepted by the operand’s `__getitem__()` method. Dictionaries accept any hashable value. Lists, tuples, and strings accept an index or a slice:

```
>>> itemgetter(1)('ABCDEFG')
'B'
>>> itemgetter(1, 3, 5)('ABCDEFG')
('B', 'D', 'F')
>>> itemgetter(slice(2, None))('ABCDEFG')
'CDEFG'
>>> soldier = dict(rank='captain', name='dotterbart')
>>> itemgetter('rank')(soldier)
'captain'
```

Example of using `itemgetter()` to retrieve specific fields from a tuple record:

```
>>> inventory = [('apple', 3), ('banana', 2), ('pear', 5), ('orange', 1)]
>>> getcount = itemgetter(1)
>>> list(map(getcount, inventory))
[3, 2, 5, 1]
>>> sorted(inventory, key=getcount)
[('orange', 1), ('banana', 2), ('apple', 3), ('pear', 5)]
```

<!-- anchor: operator.methodcaller | type: py function -->
## `operator.methodcaller(name, /, *args, **kwargs)`

Return a callable object that calls the method *name* on its operand. If additional arguments and/or keyword arguments are given, they will be given to the method as well. For example:

- After `f = methodcaller('name')`, the call `f(b)` returns `b.name()`.

- After `f = methodcaller('name', 'foo', bar=1)`, the call `f(b)` returns `b.name('foo', bar=1)`.

Equivalent to:

```python
def methodcaller(name, /, *args, **kwargs):
    def caller(obj):
        return getattr(obj, name)(*args, **kwargs)
    return caller
```

<!-- anchor: mapping-operators-to-functions | type: section -->
## Mapping Operators to Functions

This table shows how abstract operations correspond to operator symbols in the Python syntax and the functions in the `operator` module.

| Operation | Syntax | Function |
| --- | --- | --- |
| Addition | `a + b` | `add(a, b)` |
| Concatenation | `seq1 + seq2` | `concat(seq1, seq2)` |
| Containment Test | `obj in seq` | `contains(seq, obj)` |
| Division | `a / b` | `truediv(a, b)` |
| Division | `a // b` | `floordiv(a, b)` |
| Bitwise And, or Intersection | `a & b` | `and_(a, b)` |
| Bitwise Exclusive Or, or Symmetric Difference | `a ^ b` | `xor(a, b)` |
| Bitwise Inversion, or Complement | `~ a` | `invert(a)` |
| Bitwise Or, or Union | `a \| b` | `or_(a, b)` |
| Exponentiation | `a ** b` | `pow(a, b)` |
| Identity | `a is b` | `is_(a, b)` |
| Identity | `a is not b` | `is_not(a, b)` |
| Identity | `a is None` | `is_none(a)` |
| Identity | `a is not None` | `is_not_none(a)` |
| Indexed Assignment | `obj[k] = v` | `setitem(obj, k, v)` |
| Indexed Deletion | `del obj[k]` | `delitem(obj, k)` |
| Indexing | `obj[k]` | `getitem(obj, k)` |
| Left Shift | `a << b` | `lshift(a, b)` |
| Modulo | `a % b` | `mod(a, b)` |
| Multiplication | `a * b` | `mul(a, b)` |
| Matrix Multiplication | `a @ b` | `matmul(a, b)` |
| Negation (Arithmetic) | `- a` | `neg(a)` |
| Negation (Logical) | `not a` | `not_(a)` |
| Positive | `+ a` | `pos(a)` |
| Right Shift | `a >> b` | `rshift(a, b)` |
| Slice Assignment | `seq[i:j] = values` | `setitem(seq, slice(i, j), values)` |
| Slice Deletion | `del seq[i:j]` | `delitem(seq, slice(i, j))` |
| Slicing | `seq[i:j]` | `getitem(seq, slice(i, j))` |
| String Formatting | `s % obj` | `mod(s, obj)` |
| Subtraction | `a - b` | `sub(a, b)` |
| Truth Test | `obj` | `truth(obj)` |
| Ordering | `a < b` | `lt(a, b)` |
| Ordering | `a <= b` | `le(a, b)` |
| Equality | `a == b` | `eq(a, b)` |
| Difference | `a != b` | `ne(a, b)` |
| Ordering | `a >= b` | `ge(a, b)` |
| Ordering | `a > b` | `gt(a, b)` |

<!-- anchor: in-place-operators | type: section -->
## In-place Operators

Many operations have an “in-place” version. Listed below are functions providing a more primitive access to in-place operators than the usual syntax does; for example, the statement `x += y` is equivalent to `x = operator.iadd(x, y)`. Another way to put it is to say that `z = operator.iadd(x, y)` is equivalent to the compound statement `z = x; z += y`.

In those examples, note that when an in-place method is called, the computation and assignment are performed in two separate steps. The in-place functions listed below only do the first step, calling the in-place method. The second step, assignment, is not handled.

For immutable targets such as strings, numbers, and tuples, the updated value is computed, but not assigned back to the input variable:

```
>>> a = 'hello'
>>> iadd(a, ' world')
'hello world'
>>> a
'hello'
```

For mutable targets such as lists and dictionaries, the in-place method will perform the update, so no subsequent assignment is necessary:

```
>>> s = ['h', 'e', 'l', 'l', 'o']
>>> iadd(s, [' ', 'w', 'o', 'r', 'l', 'd'])
['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd']
>>> s
['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd']
```

<!-- anchor: operator.iadd | type: py function -->
### `operator.iadd(a, b)`

`operator.__iadd__(a, b)`

`a = iadd(a, b)` is equivalent to `a += b`.

<!-- anchor: operator.iand | type: py function -->
### `operator.iand(a, b)`

`operator.__iand__(a, b)`

`a = iand(a, b)` is equivalent to `a &= b`.

<!-- anchor: operator.iconcat | type: py function -->
### `operator.iconcat(a, b)`

`operator.__iconcat__(a, b)`

`a = iconcat(a, b)` is equivalent to `a += b` for *a* and *b* sequences.

<!-- anchor: operator.ifloordiv | type: py function -->
### `operator.ifloordiv(a, b)`

`operator.__ifloordiv__(a, b)`

`a = ifloordiv(a, b)` is equivalent to `a //= b`.

<!-- anchor: operator.ilshift | type: py function -->
### `operator.ilshift(a, b)`

`operator.__ilshift__(a, b)`

`a = ilshift(a, b)` is equivalent to `a <<= b`.

<!-- anchor: operator.imod | type: py function -->
### `operator.imod(a, b)`

`operator.__imod__(a, b)`

`a = imod(a, b)` is equivalent to `a %= b`.

<!-- anchor: operator.imul | type: py function -->
### `operator.imul(a, b)`

`operator.__imul__(a, b)`

`a = imul(a, b)` is equivalent to `a *= b`.

<!-- anchor: operator.imatmul | type: py function -->
### `operator.imatmul(a, b)`

`operator.__imatmul__(a, b)`

`a = imatmul(a, b)` is equivalent to `a @= b`.

Added in version 3.5.

<!-- anchor: operator.ior | type: py function -->
### `operator.ior(a, b)`

`operator.__ior__(a, b)`

`a = ior(a, b)` is equivalent to `a |= b`.

<!-- anchor: operator.ipow | type: py function -->
### `operator.ipow(a, b)`

`operator.__ipow__(a, b)`

`a = ipow(a, b)` is equivalent to `a **= b`.

<!-- anchor: operator.irshift | type: py function -->
### `operator.irshift(a, b)`

`operator.__irshift__(a, b)`

`a = irshift(a, b)` is equivalent to `a >>= b`.

<!-- anchor: operator.isub | type: py function -->
### `operator.isub(a, b)`

`operator.__isub__(a, b)`

`a = isub(a, b)` is equivalent to `a -= b`.

<!-- anchor: operator.itruediv | type: py function -->
### `operator.itruediv(a, b)`

`operator.__itruediv__(a, b)`

`a = itruediv(a, b)` is equivalent to `a /= b`.

<!-- anchor: operator.ixor | type: py function -->
### `operator.ixor(a, b)`

`operator.__ixor__(a, b)`

`a = ixor(a, b)` is equivalent to `a ^= b`.
