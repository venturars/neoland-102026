---
page: builtins/threadsafety.html
title: Thread Safety Guarantees
area: builtins
kind: guide
---

<!-- anchor: thread-safety-guarantees | type: section -->
# Thread Safety Guarantees

This page documents thread-safety guarantees for built-in types in Python’s free-threaded build. The guarantees described here apply when using Python with the GIL disabled (free-threaded mode). When the GIL is enabled, most operations are implicitly serialized.

For general guidance on writing thread-safe code in free-threaded Python, see Python support for free threading.

<!-- anchor: thread-safety-levels | type: section -->
## Thread safety levels

The C API documentation uses the following levels to describe the thread safety guarantees of each function. The levels are listed from least to most safe.

<!-- anchor: incompatible | type: section -->
### Incompatible

A function or operation that cannot be made safe for concurrent use even with external synchronization. Incompatible code typically accesses global state in an unsynchronized way and must only be called from a single thread throughout the program’s lifetime.

Example: a function that modifies process-wide state such as signal handlers or environment variables, where concurrent calls from any threads, even with external locking, can conflict with the runtime or other libraries.

<!-- anchor: compatible | type: section -->
### Compatible

A function or operation that is safe to call from multiple threads *provided* the caller supplies appropriate external synchronization, for example by holding a lock for the duration of each call. Without such synchronization, concurrent calls may produce race conditions or data races.

Example: a function that reads from or writes to an object whose internal state is not protected by a lock. Callers must ensure that no two threads access the same object at the same time.

<!-- anchor: safe-on-distinct-objects | type: section -->
### Safe on distinct objects

A function or operation that is safe to call from multiple threads without external synchronization, as long as each thread operates on a **different** object. Two threads may call the function at the same time, but they must not pass the same object (or objects that share underlying state) as arguments.

Example: a function that modifies fields of a struct using non-atomic writes. Two threads can each call the function on their own struct instance safely, but concurrent calls on the *same* instance require external synchronization.

<!-- anchor: safe-on-shared-objects | type: section -->
### Safe on shared objects

A function or operation that is safe for concurrent use on the **same** object. The implementation uses internal synchronization (such as per-object locks or critical sections) to protect shared mutable state, so callers do not need to supply their own locking.

Example: `PyList_GetItemRef()` can be called from multiple threads on the same `PyListObject` - it uses internal synchronization to serialize access.

<!-- anchor: atomic | type: section -->
### Atomic

A function or operation that appears atomic with respect to other threads - it executes instantaneously from the perspective of other threads. This is the strongest form of thread safety.

Example: `PyMutex_IsLocked()` performs an atomic read of the mutex state and can be called from any thread at any time.

<!-- anchor: thread-safety-for-list-objects | type: section -->
## Thread safety for list objects

Reading a single element from a `list` is atomic:

```
lst[i]   # list.__getitem__
```

The following methods traverse the list and use atomic reads of each item to perform their function. That means that they may return results affected by concurrent modifications:

```
item in lst
lst.index(item)
lst.count(item)
```

All of the above operations avoid acquiring per-object locks. They do not block concurrent modifications. Other operations that hold a lock will not block these from observing intermediate states.

All other operations from here on block using the per-object lock.

Writing a single item via `lst[i] = x` is safe to call from multiple threads and will not corrupt the list.

The following operations return new objects and appear atomic to other threads:

```
lst1 + lst2    # concatenates two lists into a new list
x * lst        # repeats lst x times into a new list
lst.copy()     # returns a shallow copy of the list
```

The following methods that only operate on a single element with no shifting required are atomic:

```
lst.append(x)  # append to the end of the list, no shifting required
lst.pop()      # pop element from the end of the list, no shifting required
```

The `clear()` method is also atomic. Other threads cannot observe elements being removed.

The `sort()` method is not atomic. Other threads cannot observe intermediate states during sorting, but the list appears empty for the duration of the sort.

The following operations may allow lock-free operations to observe intermediate states since they modify multiple elements in place:

```
lst.insert(idx, item)  # shifts elements
lst.pop(idx)           # idx not at the end of the list, shifts elements
lst *= x               # copies elements in place
```

The `remove()` method may allow concurrent modifications since element comparison may execute arbitrary Python code (via `__eq__()`).

`extend()` is safe to call from multiple threads. However, its guarantees depend on the iterable passed to it. If it is a `list`, a `tuple`, a `set`, a `frozenset`, a `dict` or a dictionary view object (but not their subclasses), the `extend` operation is safe from concurrent modifications to the iterable. Otherwise, an iterator is created which can be concurrently modified by another thread. The same applies to inplace concatenation of a list with other iterables when using `lst += iterable`.

Similarly, assigning to a list slice with `lst[i:j] = iterable` is safe to call from multiple threads, but `iterable` is only locked when it is also a `list` (but not its subclasses).

Operations that involve multiple accesses, as well as iteration, are never atomic. For example:

```
# NOT atomic: read-modify-write
lst[i] = lst[i] + 1

# NOT atomic: check-then-act
if lst:
    item = lst.pop()

# NOT thread-safe: iteration while modifying
for item in lst:
    process(item)  # another thread may modify lst
```

Consider external synchronization when sharing `list` instances across threads.

<!-- anchor: thread-safety-for-dict-objects | type: section -->
## Thread safety for dict objects

Creating a dictionary with the `dict` constructor is atomic when the argument to it is a `dict` or a `tuple`. When using the `dict.fromkeys()` method, dictionary creation is atomic when the argument is a `dict`, `tuple`, `set` or `frozenset`.

The following operations and functions are lock-free and atomic.

```
d[key]       # dict.__getitem__
d.get(key)   # dict.get
key in d     # dict.__contains__
len(d)       # dict.__len__
```

All other operations from here on hold the per-object lock.

Writing or removing a single item is safe to call from multiple threads and will not corrupt the dictionary:

```
d[key] = value        # write
del d[key]            # delete
d.pop(key)            # remove and return
d.popitem()           # remove and return last item
d.setdefault(key, v)  # insert if missing
```

These operations may compare keys using `__eq__()`, which can execute arbitrary Python code. During such comparisons, the dictionary may be modified by another thread. For built-in types like `str`, `int`, and `float`, that implement `__eq__()` in C, the underlying lock is not released during comparisons and this is not a concern.

The following operations return new objects and hold the per-object lock for the duration of the operation:

```
d.copy()      # returns a shallow copy of the dictionary
d | other     # merges two dicts into a new dict
d.keys()      # returns a new dict_keys view object
d.values()    # returns a new dict_values view object
d.items()     # returns a new dict_items view object
```

The `clear()` method holds the lock for its duration. Other threads cannot observe elements being removed.

The following operations lock both dictionaries. For `update()` and `|=`, this applies only when the other operand is a `dict` that uses the standard dict iterator (but not subclasses that override iteration). For equality comparison, this applies to `dict` and its subclasses:

```
d.update(other_dict)  # both locked when other_dict is a dict
d |= other_dict       # both locked when other_dict is a dict
d == other_dict       # both locked for dict and subclasses
```

All comparison operations also compare values using `__eq__()`, so for non-built-in types the lock may be released during comparison.

`fromkeys()` locks both the new dictionary and the iterable when the iterable is exactly a `dict`, `set`, or `frozenset` (not subclasses):

```
dict.fromkeys(a_dict)      # locks both
dict.fromkeys(a_set)       # locks both
dict.fromkeys(a_frozenset) # locks both
```

When updating from a non-dict iterable, only the target dictionary is locked. The iterable may be concurrently modified by another thread:

```
d.update(iterable)        # iterable is not a dict: only d locked
d |= iterable             # iterable is not a dict: only d locked
dict.fromkeys(iterable)   # iterable is not a dict/set/frozenset: only result locked
```

Operations that involve multiple accesses, as well as iteration, are never atomic:

```
# NOT atomic: read-modify-write
d[key] = d[key] + 1

# NOT atomic: check-then-act (TOCTOU)
if key in d:
    del d[key]

# NOT thread-safe: iteration while modifying
for key, value in d.items():
    process(key)  # another thread may modify d
```

To avoid time-of-check to time-of-use (TOCTOU) issues, use atomic operations or handle exceptions:

```
# Use pop() with default instead of check-then-delete
d.pop(key, None)

# Or handle the exception
try:
    del d[key]
except KeyError:
    pass
```

To safely iterate over a dictionary that may be modified by another thread, iterate over a copy:

```
# Make a copy to iterate safely
for key, value in d.copy().items():
    process(key)
```

Consider external synchronization when sharing `dict` instances across threads.

<!-- anchor: thread-safety-for-set-objects | type: section -->
## Thread safety for set objects

The `len()` function is lock-free and atomic.

The following read operation is lock-free. It does not block concurrent modifications and may observe intermediate states from operations that hold the per-object lock:

```
elem in s    # set.__contains__
```

This operation may compare elements using `__eq__()`, which can execute arbitrary Python code. During such comparisons, the set may be modified by another thread. For built-in types like `str`, `int`, and `float`, `__eq__()` does not release the underlying lock during comparisons and this is not a concern.

All other operations from here on hold the per-object lock.

Adding or removing a single element is safe to call from multiple threads and will not corrupt the set:

```
s.add(elem)      # add element
s.remove(elem)   # remove element, raise if missing
s.discard(elem)  # remove element if present
s.pop()          # remove and return arbitrary element
```

These operations also compare elements, so the same `__eq__()` considerations as above apply.

The `copy()` method returns a new object and holds the per-object lock for the duration so that it is always atomic.

The `clear()` method holds the lock for its duration. Other threads cannot observe elements being removed.

The following operations only accept `set` or `frozenset` as operands and always lock both objects:

```
s |= other                   # other must be set/frozenset
s &= other                   # other must be set/frozenset
s -= other                   # other must be set/frozenset
s ^= other                   # other must be set/frozenset
s & other                    # other must be set/frozenset
s | other                    # other must be set/frozenset
s - other                    # other must be set/frozenset
s ^ other                    # other must be set/frozenset
```

`set.update()`, `set.union()`, `set.intersection()` and `set.difference()` can take multiple iterables as arguments. They all iterate through all the passed iterables and do the following:

- `set.update()` and `set.union()` lock both objects only when the other operand is a `set`, `frozenset`, or `dict`.

- `set.intersection()` and `set.difference()` always try to lock all objects.

`set.symmetric_difference()` tries to lock both objects.

The update variants of the above methods also have some differences between them:

- `set.difference_update()` and `set.intersection_update()` try to lock all objects one-by-one.

- `set.symmetric_difference_update()` only locks the arguments if it is of type `set`, `frozenset`, or `dict`.

The following methods always try to lock both objects:

```
s.isdisjoint(other)          # both locked
s.issubset(other)            # both locked
s.issuperset(other)          # both locked
```

Operations that involve multiple accesses, as well as iteration, are never atomic:

```
# NOT atomic: check-then-act
if elem in s:
      s.remove(elem)

# NOT thread-safe: iteration while modifying
for elem in s:
      process(elem)  # another thread may modify s
```

Consider external synchronization when sharing `set` instances across threads. See Python support for free threading for more information.

<!-- anchor: thread-safety-for-bytearray-objects | type: section -->
## Thread safety for bytearray objects

The `len()` function is lock-free and atomic.

Concatenation and comparisons use the buffer protocol, which prevents resizing but does not hold the per-object lock. These operations may observe intermediate states from concurrent modifications:

```
ba + other    # may observe concurrent writes
ba == other   # may observe concurrent writes
ba < other    # may observe concurrent writes
```

All other operations from here on hold the per-object lock.

Reading a single element or slice is safe to call from multiple threads:

```
ba[i]        # bytearray.__getitem__
ba[i:j]      # slice
```

The following operations are safe to call from multiple threads and will not corrupt the bytearray:

```
ba[i] = x         # write single byte
ba[i:j] = values  # write slice
ba.append(x)      # append single byte
ba.extend(other)  # extend with iterable
ba.insert(i, x)   # insert single byte
ba.pop()          # remove and return last byte
ba.pop(i)         # remove and return byte at index
ba.remove(x)      # remove first occurrence
ba.reverse()      # reverse in place
ba.clear()        # remove all bytes
```

Slice assignment locks both objects when *values* is a `bytearray`:

```
ba[i:j] = other_bytearray  # both locked
```

The following operations return new objects and hold the per-object lock for the duration:

```
ba.copy()     # returns a shallow copy
ba * n        # repeat into new bytearray
```

The membership test holds the lock for its duration:

```
x in ba       # bytearray.__contains__
```

All other bytearray methods (such as `find()`, `replace()`, `split()`, `decode()`, etc.) hold the per-object lock for their duration.

Operations that involve multiple accesses, as well as iteration, are never atomic:

```
# NOT atomic: check-then-act
if x in ba:
    ba.remove(x)

# NOT thread-safe: iteration while modifying
for byte in ba:
    process(byte)  # another thread may modify ba
```

To safely iterate over a bytearray that may be modified by another thread, iterate over a copy:

```
# Make a copy to iterate safely
for byte in ba.copy():
    process(byte)
```

Consider external synchronization when sharing `bytearray` instances across threads. See Python support for free threading for more information.

<!-- anchor: thread-safety-for-memoryview-objects | type: section -->
## Thread safety for memoryview objects

`memoryview` objects provide access to the internal data of an underlying object without copying. Thread safety depends on both the memoryview itself and the underlying buffer exporter.

The memoryview implementation uses atomic operations to track its own exports in the free-threaded build. Creating and releasing a memoryview are thread-safe. Attribute access (e.g., `shape`, `format`) reads fields that are immutable for the lifetime of the memoryview, so concurrent reads are safe as long as the memoryview has not been released.

However, the actual data accessed through the memoryview is owned by the underlying object. Concurrent access to this data is only safe if the underlying object supports it:

- For immutable objects like `bytes`, concurrent reads through multiple memoryviews are safe.

- For mutable objects like `bytearray`, reading and writing the same memory region from multiple threads without external synchronization is not safe and may result in data corruption. Note that even read-only memoryviews of mutable objects do not prevent data races if the underlying object is modified from another thread.

```
# NOT safe: concurrent writes to the same buffer
data = bytearray(1000)
view = memoryview(data)
# Thread 1: view[0:500] = b'x' * 500
# Thread 2: view[0:500] = b'y' * 500
```

```
# Safe: use a lock for concurrent access
import threading
lock = threading.Lock()
data = bytearray(1000)
view = memoryview(data)

with lock:
    view[0:500] = b'x' * 500
```

Resizing or reallocating the underlying object (such as calling `bytearray.resize()`) while a memoryview is exported raises `BufferError`. This is enforced regardless of threading.
