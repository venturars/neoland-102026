---
page: builtins/time-complexity.html
title: Time complexity of operations on built-in types
area: builtins
kind: guide
---

<!-- anchor: time-complexity-of-operations-on-built-in-types | type: section -->
# Time complexity of operations on built-in types

This page documents the time complexity of various operations on built-in types in CPython. Other Python implementations may have different performance characteristics. Additionally, the listed costs assume exact built-in types, as instances of subclasses may have different costs.

We use Big *O* notation to describe how the running time of an operation grows with the size of its inputs. Unless stated otherwise, *n* denotes the number of elements currently in the container, and *k* is the value of a numeric parameter, such as an index or a repeat count.

<!-- anchor: list | type: section -->
## `list`

Lists are mutable sequences; for more detail on the implementation see How are lists implemented in CPython?. The largest costs come from growing beyond the current allocation size (because everything must move), or from inserting or deleting somewhere near the beginning (because everything after that must move). If you need to add or remove at both ends, consider using a `collections.deque` instead.

| Operation | Complexity |
| --- | --- |
| Copy (`l.copy()`) | *O*(*n*) |
| Append (`l.append(x)`) [1] | *O*(1) |
| Pop (`l.pop(k)`) [1] [2] | *O*(*n* - *k*) |
| Insert (`l.insert(k, x)`) [1] [2] | *O*(*n* - *k*) |
| Get item (`l[k]`) | *O*(1) |
| Set item (`l[k] = x`) | *O*(1) |
| Delete item (`del l[k]`) [2] | *O*(*n* - *k*) |
| Iteration | *O*(*n*) |
| Get slice (`l[i:j]`) | *O*(*j* - *i*) |
| Set slice (`l[i:j] = t`) [1] | *O*(*j* - *i*) if len(*t*) == *j* - *i*, otherwise *O*(*n* - *i* + len(*t*)) |
| Delete slice (`del l[i:j]`) | *O*(*n* - *i*) |
| Extend (`l.extend(t)`) [1] [3] | *O*(len(*t*)) |
| Sort (`l.sort()`) [4] | *O*(*n* log *n*) |
| Concatenate (`l1 + l2`) | *O*(len(*l1*) + len(*l2*)) |
| Multiply (`l * k`) | *O*(*nk*) |
| `x in l` | *O*(*n*) |
| `min(l)`, `max(l)` | *O*(*n*) |
| Get length (`len(l)`) [5] | *O*(1) |

<!-- anchor: tuple | type: section -->
## `tuple`

A `tuple` is an immutable sequence. Because a tuple can never change, there are no insertion or deletion costs, and making a copy simply returns the same object, so is constant time (*O*(1)).

| Operation | Complexity |
| --- | --- |
| Copy (`tuple(t)`) | *O*(1) |
| Get item (`t[k]`) | *O*(1) |
| Get slice (`t[i:j]`) | *O*(*j* - *i*) |
| Concatenate (`t1 + t2`) | *O*(len(*t1*) + len(*t2*)) |
| Multiply (`t * k`) | *O*(*nk*) |
| Iteration | *O*(*n*) |
| `x in t` | *O*(*n*) |
| `min(t)`, `max(t)` | *O*(*n*) |
| Get length (`len(t)`) [5] | *O*(1) |

<!-- anchor: dict-frozendict | type: section -->
## `dict`, `frozendict`

The times listed for dict objects are average-case times, as they assume the hash function for the objects is sufficiently robust to make collisions uncommon. They also assume the keys are well-distributed among the set of possible keys. In the worst case, when every key hashes to the same value, each of the *O*(1) operations below instead takes *O*(*n*) time. They also assume that hashing and comparing a key is *O*(1). For more detail on the implementation, see How are dictionaries implemented in CPython?.

A `frozendict` is immutable, so it does not support setting, deleting, or updating items. The other operations below apply to it at the same costs.

| Operation | Complexity |
| --- | --- |
| `key in d` | *O*(1) |
| Copy (`d.copy()`) [6] [7] | *O*(*n*) |
| Get item (`d[key]`, `d.get(key)`) | *O*(1) |
| Set item (`d[key] = value`) [1] | *O*(1) |
| Delete item (`del d[key]`, `d.pop(key)`) | *O*(1) |
| Update (`d.update(t)`, `d \|= t`) [1] [3] [7] | *O*(len(*t*)) |
| Iteration [7] | *O*(*n*) |
| Get length (`len(d)`) [5] | *O*(1) |

<!-- anchor: set-frozenset | type: section -->
## `set`, `frozenset`

See `dict` as the `set` and `frozenset` implementations are similar, and the same caveats apply. In the worst case, *O*(1) operations instead take *O*(*n*) time, and operations that look up every element degrade accordingly.

A `frozenset` is immutable, so it does not support adding, discarding, or the in-place update operations. The others below apply to it at the same costs.

| Operation | Complexity |
| --- | --- |
| `x in s` | *O*(1) |
| Copy (`s.copy()`) [6] [7] | *O*(*n*) |
| Add (`s.add(x)`) [1] | *O*(1) |
| Discard (`s.discard(x)`, `s.remove(x)`) | *O*(1) |
| Union (`s1 \| s2`, `s1.union(s2)`) [7] | *O*(len(*s1*) + len(*s2*)) |
| Update (`s1 \|= s2`, `s1.update(s2)`) [1] [7] | *O*(len(*s2*)) |
| Intersection (`s1 & s2`, `s1.intersection(s2)`) [7] [8] | *O*(min(len(*s1*), len(*s2*))) |
| Intersection update (`s1 &= s2`, `s1.intersection_update(s2)`) [1] [7] [8] | *O*(min(len(*s1*), len(*s2*))) |
| Difference (`s1 - s2`, `s1.difference(s2)`) [7] [9] | *O*(len(*s1*)) |
| Difference update (`s1 -= s2`, `s1.difference_update(s2)`) [1] [7] [8] | *O*(min(len(*s1*), len(*s2*))) |
| Symmetric difference (`s1 ^ s2`, `s1.symmetric_difference(s2)`) [7] | *O*(len(*s1*) + len(*s2*)) |
| Symmetric difference update (`s1 ^= s2`, `s1.symmetric_difference_update(s2)`) [1] [7] | *O*(len(*s2*)) |
| Get length (`len(s)`) [5] | *O*(1) |

<!-- anchor: str-bytes-bytearray | type: section -->
## `str`, `bytes`, `bytearray`

`str` and `bytes` objects are immutable sequences of characters and bytes, respectively. As with tuples, copying one returns the original object. A `bytearray` is mutable, and additionally supports the mutating operations of `list` (except `sort()`), at the same costs. However, deleting at the front with `del` (`del b[0]`, `del b[:k]`) only advances the start of the buffer instead of moving the remaining bytes, and is amortized *O*(1).

| Operation | Complexity |
| --- | --- |
| Get item (`s[k]`) | *O*(1) |
| Get slice (`s[i:j]`) | *O*(*j* - *i*) |
| Concatenate (`s + t`) [10] | *O*(len(*s*) + len(*t*)) |
| Multiply (`s * k`) | *O*(*nk*) |
| Substring search (`x in s`, `s.find(x)`, `s.index(x)`) [11] | *O*(*n*) |
| Reverse substring search (`s.rfind(x)`, `s.rindex(x)`) [11] [12] | *O*(*n* × len(*x*)) |
| Encode or decode [13] | *O*(*n*) |
| Iteration | *O*(*n*) |
| Get length (`len(s)`) [5] | *O*(1) |

<!-- anchor: memoryview | type: section -->
## `memoryview`

`memoryview` objects allow Python code to access the internal data of an object that supports the buffer protocol without copying. In particular, slicing a memory view returns a new view onto the same buffer.

| Operation | Complexity |
| --- | --- |
| Create (`memoryview(obj)`) | *O*(1) |
| Get item (`v[k]`) | *O*(1) |
| Get slice (`v[i:j]`) | *O*(1) |
| Index (`v.index(x)`) [11] [14] | *O*(*n*) |
| Count (`v.count(x)`) [14] | *O*(*n*) |
| Convert to bytes (`v.tobytes()`, `bytes(v)`) | *O*(*n*) |
| Get length (`len(v)`) [5] | *O*(1) |

<!-- anchor: range | type: section -->
## `range`

A `range` object computes its items on demand from its *start*, *stop* and *step* values, so most operations do not depend on the length of the range.

| Operation | Complexity |
| --- | --- |
| Get item (`r[k]`) | *O*(1) |
| Get slice (`r[i:j]`) | *O*(1) |
| `x in r` [15] | *O*(1) |
| Index and count (`r.index(x)`, `r.count(x)`) [15] | *O*(1) |
| Iteration | *O*(*n*) |
| `min(r)`, `max(r)` | *O*(*n*) |
| Get length (`len(r)`) [5] | *O*(1) |

<!-- anchor: notes | type: section -->
## Notes

[1] (1,2,3,4,5,6,7,8,9,10,11,12)

Amortized. An individual operation may occasionally be *O*(*n*) when the underlying storage is resized, but this cost is spread over many operations, depending on the history of the container.

[2] (1,2,3)

Popping or deleting the element at index *k* of a list of size *n* shifts all elements after *k* one slot to the left, moving *n* - *k* - 1 elements; inserting at index *k* shifts the elements from *k* onwards one slot to the right, moving *n* - *k* elements. The worst case is index 0, where the whole rest of the list has to be moved; the average case, an index in the middle of the list, takes *O*(*n*/2) = *O*(*n*) operations; and operating at the end of the list moves nothing and is *O*(1).

[3] (1,2)

Plus the cost of iterating over *t*, which may be expensive for an arbitrary iterable.

[4]

This is the worst case scenario. Sorting is adaptive and input that is already sorted or reverse-sorted takes only *O*(*n*) comparisons. See Objects/listsort.txt for more information.

[5] (1,2,3,4,5,6,7)

The number of elements is stored in the object, so `len()` does not need to count them.

[6] (1,2)

Copying a `frozendict` or a `frozenset` is *O*(1) as it returns the original object.

[7] (1,2,3,4,5,6,7,8,9,10,11,12)

These operations scan the container’s internal hash table, which is not shrunk when elements are removed. After removing most elements, they still take time proportional to the container’s former size, until a later insertion triggers a resize.

[8] (1,2,3)

*O*(len(*t*)) if *t* is not a set.

[9]

*O*(len(*s*) + len(*t*)) if *t* is not a set.

[10]

Each concatenation builds a new object, so building a string by concatenating many pieces in a loop is quadratic in the total length. See the note on concatenating immutable sequences for alternatives.

[11] (1,2,3)

With *start* and *end* arguments, *n* is the length of the region searched rather than of *s*, and unlike slicing nothing is copied.

[12]

This is the worst case. Reverse searches are *O*(*n*) on typical input. Forward searches instead use a more elaborate algorithm with a linear worst case, described in Objects/stringlib/stringlib_find_two_way_notes.txt.

[13]

This assumes a codec that does a constant amount of work per character.

[14] (1,2)

These unpack and compare each element individually, so they are much slower than the equivalent `bytes` methods.

[15] (1,2)

Assuming `int` or `bool` arguments. For other types, the range is searched like any other sequence in *O*(*n*) time.
