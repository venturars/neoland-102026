---
page: library/collections.abc.html
title: collections.abc — Abstract Base Classes for Containers
area: library
kind: guide
module: collections.abc
---

<!-- anchor: module-collections.abc | type: section -->
# `collections.abc` — Abstract Base Classes for Containers

Added in version 3.3: Formerly, this module was part of the `collections` module.

**Source code:** Lib/_collections_abc.py

This module provides abstract base classes that can be used to test whether a class provides a particular interface; for example, whether it is hashable or whether it is a mapping.

An `issubclass()` or `isinstance()` test for an interface works in one of three ways.

1. A newly written class can inherit directly from one of the abstract base classes. The class must supply the required abstract methods. The remaining mixin methods come from inheritance and can be overridden if desired. Other methods may be added as needed:

   ```python
   class C(Sequence):                      # Direct inheritance
       def __init__(self): ...             # Extra method not required by the ABC
       def __getitem__(self, index):  ...  # Required abstract method
       def __len__(self):  ...             # Required abstract method
       def count(self, value): ...         # Optionally override a mixin method
   ```

   ```pycon
   >>> issubclass(C, Sequence)
   True
   >>> isinstance(C(), Sequence)
   True
   ```

2. Existing classes and built-in classes can be registered as “virtual subclasses” of the ABCs. Those classes should define the full API including all of the abstract methods and all of the mixin methods. This lets users rely on `issubclass()` or `isinstance()` tests to determine whether the full interface is supported. The exception to this rule is for methods that are automatically inferred from the rest of the API:

   ```python
   class D:                                 # No inheritance
       def __init__(self): ...              # Extra method not required by the ABC
       def __getitem__(self, index):  ...   # Abstract method
       def __len__(self):  ...              # Abstract method
       def count(self, value): ...          # Mixin method
       def index(self, value): ...          # Mixin method

   Sequence.register(D)                     # Register instead of inherit
   ```

   ```pycon
   >>> issubclass(D, Sequence)
   True
   >>> isinstance(D(), Sequence)
   True
   ```

   In this example, class `D` does not need to define `__contains__`, `__iter__`, and `__reversed__` because the in-operator, the iteration logic, and the `reversed()` function automatically fall back to using `__getitem__` and `__len__`.

3. Some simple interfaces are directly recognizable by the presence of the required methods (unless those methods have been set to `None`):

   ```python
   class E:
       def __iter__(self): ...
       def __next__(self): ...
   ```

   ```pycon
   >>> issubclass(E, Iterable)
   True
   >>> isinstance(E(), Iterable)
   True
   ```

   Complex interfaces do not support this last technique because an interface is more than just the presence of method names. Interfaces specify semantics and relationships between methods that cannot be inferred solely from the presence of specific method names. For example, knowing that a class supplies `__getitem__`, `__len__`, and `__iter__` is insufficient for distinguishing a `Sequence` from a `Mapping`.

Added in version 3.9: These abstract classes now support `[]`. See Generic Alias Type and **PEP 585**.

<!-- anchor: collections-abstract-base-classes | type: section -->
## Collections Abstract Base Classes

The collections module offers the following ABCs:

| ABC | Inherits from | Abstract Methods | Mixin Methods |
| --- | --- | --- | --- |
| `Container` [1] |  | `__contains__` |  |
| `Hashable` [1] |  | `__hash__` |  |
| `Iterable` [1] [2] |  | `__iter__` |  |
| `Iterator` [1] | `Iterable` | `__next__` | `__iter__` |
| `Reversible` [1] | `Iterable` | `__reversed__` |  |
| `Generator` [1] | `Iterator` | `send`, `throw` | `close`, `__iter__`, `__next__` |
| `Sized` [1] |  | `__len__` |  |
| `Callable` [1] |  | `__call__` |  |
| `Collection` [1] | `Sized`, `Iterable`, `Container` | `__contains__`, `__iter__`, `__len__` |  |
| `Sequence` | `Reversible`, `Collection` | `__getitem__`, `__len__` | `__contains__`, `__iter__`, `__reversed__`, `index`, and `count` |
| `MutableSequence` | `Sequence` | `__getitem__`, `__setitem__`, `__delitem__`, `__len__`, `insert` | Inherited `Sequence` methods and `append`, `clear`, `reverse`, `extend`, `pop`, `remove`, and `__iadd__` |
| `ByteString` | `Sequence` | `__getitem__`, `__len__` | Inherited `Sequence` methods |
| `Set` | `Collection` | `__contains__`, `__iter__`, `__len__` | `__le__`, `__lt__`, `__eq__`, `__ne__`, `__gt__`, `__ge__`, `__and__`, `__or__`, `__sub__`, `__rsub__`, `__xor__`, `__rxor__` and `isdisjoint` |
| `MutableSet` | `Set` | `__contains__`, `__iter__`, `__len__`, `add`, `discard` | Inherited `Set` methods and `clear`, `pop`, `remove`, `__ior__`, `__iand__`, `__ixor__`, and `__isub__` |
| `Mapping` | `Collection` | `__getitem__`, `__iter__`, `__len__` | `__contains__`, `keys`, `items`, `values`, `get`, `__eq__`, and `__ne__` |
| `MutableMapping` | `Mapping` | `__getitem__`, `__setitem__`, `__delitem__`, `__iter__`, `__len__` | Inherited `Mapping` methods and `pop`, `popitem`, `clear`, `update`, and `setdefault` |
| `MappingView` | `Sized` |  | `__init__`, `__len__` and `__repr__` |
| `ItemsView` | `MappingView`, `Set` |  | `__contains__`, `__iter__` |
| `KeysView` | `MappingView`, `Set` |  | `__contains__`, `__iter__` |
| `ValuesView` | `MappingView`, `Collection` |  | `__contains__`, `__iter__` |
| `Awaitable` [1] |  | `__await__` |  |
| `Coroutine` [1] | `Awaitable` | `send`, `throw` | `close` |
| `AsyncIterable` [1] |  | `__aiter__` |  |
| `AsyncIterator` [1] | `AsyncIterable` | `__anext__` | `__aiter__` |
| `AsyncGenerator` [1] | `AsyncIterator` | `asend`, `athrow` | `aclose`, `__aiter__`, `__anext__` |
| `Buffer` [1] |  | `__buffer__` |  |

**Footnotes**

[1] (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15)

These ABCs override `__subclasshook__()` to support testing an interface by verifying the required methods are present and have not been set to `None`. This only works for simple interfaces. More complex interfaces require registration or direct subclassing.

[2]

Checking `isinstance(obj, Iterable)` detects classes that are registered as `Iterable` or that have an `__iter__()` method, but it does not detect classes that iterate with the `__getitem__()` method. The only reliable way to determine whether an object is iterable is to call `iter(obj)`.

<!-- anchor: collections-abstract-base-classes-detailed-descriptions | type: section -->
## Collections Abstract Base Classes – Detailed Descriptions

<!-- anchor: collections.abc.Container | type: py class -->
### `class collections.abc.Container`

ABC for classes that provide the `__contains__()` method.

<!-- anchor: collections.abc.Hashable | type: py class -->
### `class collections.abc.Hashable`

ABC for classes that provide the `__hash__()` method.

<!-- anchor: collections.abc.Sized | type: py class -->
### `class collections.abc.Sized`

ABC for classes that provide the `__len__()` method.

<!-- anchor: collections.abc.Callable | type: py class -->
### `class collections.abc.Callable`

ABC for classes that provide the `__call__()` method.

See Annotating callable objects for details on how to use `Callable` in type annotations.

<!-- anchor: collections.abc.Iterable | type: py class -->
### `class collections.abc.Iterable`

ABC for classes that provide the `__iter__()` method.

Checking `isinstance(obj, Iterable)` detects classes that are registered as `Iterable` or that have an `__iter__()` method, but it does not detect classes that iterate with the `__getitem__()` method. The only reliable way to determine whether an object is iterable is to call `iter(obj)`.

<!-- anchor: collections.abc.Collection | type: py class -->
### `class collections.abc.Collection`

ABC for sized iterable container classes.

Added in version 3.6.

<!-- anchor: collections.abc.Iterator | type: py class -->
### `class collections.abc.Iterator`

ABC for classes that provide the `__iter__()` and `__next__()` methods. See also the definition of iterator.

<!-- anchor: collections.abc.Reversible | type: py class -->
### `class collections.abc.Reversible`

ABC for iterable classes that also provide the `__reversed__()` method.

Added in version 3.6.

<!-- anchor: collections.abc.Generator | type: py class -->
### `class collections.abc.Generator`

ABC for generator classes that implement the protocol defined in **PEP 342** that extends iterators with the `send()`, `throw()` and `close()` methods.

See Annotating generators and coroutines for details on using `Generator` in type annotations.

Added in version 3.5.

<!-- anchor: collections.abc.Sequence | type: py class -->
### `class collections.abc.Sequence`

`class collections.abc.MutableSequence`

`class collections.abc.ByteString`

ABCs for read-only and mutable sequences.

Implementation note: Some of the mixin methods, such as `__iter__()`, `__reversed__()`, and `index()` make repeated calls to the underlying `__getitem__()` method. Consequently, if `__getitem__()` is implemented with constant access speed, the mixin methods will have linear performance; however, if the underlying method is linear (as it would be with a linked list), the mixins will have quadratic performance and will likely need to be overridden.

<!-- anchor: collections.abc.ByteString.index | type: py method -->
#### `index(value, start=0, stop=None)`

Return first index of *value*.

Raises `ValueError` if the value is not present.

Supporting the *start* and *stop* arguments is optional, but recommended.

Changed in version 3.5: The `index()` method gained support for the *stop* and *start* arguments.

Deprecated since version 3.12, will be removed in version 3.17: The `ByteString` ABC has been deprecated.

Use `isinstance(obj, collections.abc.Buffer)` to test if `obj` implements the buffer protocol at runtime. For use in type annotations, either use `Buffer` or a union that explicitly specifies the types your code supports (e.g., `bytes | bytearray | memoryview`).

`ByteString` was originally intended to be an abstract class that would serve as a supertype of both `bytes` and `bytearray`. However, since the ABC never had any methods, knowing that an object was an instance of `ByteString` never actually told you anything useful about the object. Other common buffer types such as `memoryview` were also never understood as subtypes of `ByteString` (either at runtime or by static type checkers).

See **PEP 688** for more details.

<!-- anchor: collections.abc.Set | type: py class -->
### `class collections.abc.Set`

`class collections.abc.MutableSet`

ABCs for read-only and mutable sets.

<!-- anchor: collections.abc.Mapping | type: py class -->
### `class collections.abc.Mapping`

`class collections.abc.MutableMapping`

ABCs for read-only and mutable mappings.

<!-- anchor: collections.abc.MappingView | type: py class -->
### `class collections.abc.MappingView`

`class collections.abc.ItemsView`

`class collections.abc.KeysView`

`class collections.abc.ValuesView`

ABCs for mapping, items, keys, and values views.

<!-- anchor: collections.abc.Awaitable | type: py class -->
### `class collections.abc.Awaitable`

ABC for awaitable objects, which can be used in `await` expressions. Custom implementations must provide the `__await__()` method.

Coroutine objects and instances of the `Coroutine` ABC are all instances of this ABC.

**Note:**

In CPython, generator-based coroutines (generators decorated with `@types.coroutine`) are *awaitables*, even though they do not have an `__await__()` method. Using `isinstance(gencoro, Awaitable)` for them will return `False`. Use `inspect.isawaitable()` to detect them.

Added in version 3.5.

<!-- anchor: collections.abc.Coroutine | type: py class -->
### `class collections.abc.Coroutine`

ABC for coroutine compatible classes. These implement the following methods, defined in Coroutine Objects: `send()`, `throw()`, and `close()`. Custom implementations must also implement `__await__()`. All `Coroutine` instances are also instances of `Awaitable`.

**Note:**

In CPython, generator-based coroutines (generators decorated with `@types.coroutine`) are *awaitables*, even though they do not have an `__await__()` method. Using `isinstance(gencoro, Coroutine)` for them will return `False`. Use `inspect.isawaitable()` to detect them.

See Annotating generators and coroutines for details on using `Coroutine` in type annotations. The variance and order of type parameters correspond to those of `Generator`.

Added in version 3.5.

<!-- anchor: collections.abc.AsyncIterable | type: py class -->
### `class collections.abc.AsyncIterable`

ABC for classes that provide an `__aiter__` method. See also the definition of asynchronous iterable.

Added in version 3.5.

<!-- anchor: collections.abc.AsyncIterator | type: py class -->
### `class collections.abc.AsyncIterator`

ABC for classes that provide `__aiter__` and `__anext__` methods. See also the definition of asynchronous iterator.

Added in version 3.5.

<!-- anchor: collections.abc.AsyncGenerator | type: py class -->
### `class collections.abc.AsyncGenerator`

ABC for asynchronous generator classes that implement the protocol defined in **PEP 525** and **PEP 492**.

See Annotating generators and coroutines for details on using `AsyncGenerator` in type annotations.

Added in version 3.6.

<!-- anchor: collections.abc.Buffer | type: py class -->
### `class collections.abc.Buffer`

ABC for classes that provide the `__buffer__()` method, implementing the buffer protocol. See **PEP 688**.

Added in version 3.12.

<!-- anchor: examples-and-recipes | type: section -->
## Examples and Recipes

ABCs allow us to ask classes or instances if they provide particular functionality, for example:

```python
size = None
if isinstance(myvar, collections.abc.Sized):
    size = len(myvar)
```

Several of the ABCs are also useful as mixins that make it easier to develop classes supporting container APIs. For example, to write a class supporting the full `Set` API, it is only necessary to supply the three underlying abstract methods: `__contains__()`, `__iter__()`, and `__len__()`. The ABC supplies the remaining methods such as `__and__()` and `isdisjoint()`:

```python
class ListBasedSet(collections.abc.Set):
    ''' Alternate set implementation favoring space over speed
        and not requiring the set elements to be hashable. '''
    def __init__(self, iterable):
        self.elements = lst = []
        for value in iterable:
            if value not in lst:
                lst.append(value)

    def __iter__(self):
        return iter(self.elements)

    def __contains__(self, value):
        return value in self.elements

    def __len__(self):
        return len(self.elements)

s1 = ListBasedSet('abcdef')
s2 = ListBasedSet('defghi')
overlap = s1 & s2            # The __and__() method is supported automatically
```

Notes on using `Set` and `MutableSet` as a mixin:

1. Since some set operations create new sets, the default mixin methods need a way to create new instances from an iterable. The class constructor is assumed to have a signature in the form `ClassName(iterable)`. That assumption is factored-out to an internal `classmethod` called `_from_iterable()` which calls `cls(iterable)` to produce a new set. If the `Set` mixin is being used in a class with a different constructor signature, you will need to override `_from_iterable()` with a classmethod or regular method that can construct new instances from an iterable argument.

2. To override the comparisons (presumably for speed, as the semantics are fixed), redefine `__le__()` and `__ge__()`, then the other operations will automatically follow suit.

3. The `Set` mixin provides a `_hash()` method to compute a hash value for the set; however, `__hash__()` is not defined because not all sets are hashable or immutable. To add set hashability using mixins, inherit from both `Set` and `Hashable`, then define `__hash__ = Set._hash`.

**See also:**

- OrderedSet recipe for an example built on `MutableSet`.

- For more about ABCs, see the `abc` module and **PEP 3119**.
