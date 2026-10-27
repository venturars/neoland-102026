---
page: library/fnmatch.html
title: fnmatch — Unix filename pattern matching
area: library
kind: guide
module: fnmatch
---

<!-- anchor: module-fnmatch | type: section -->
# `fnmatch` — Unix filename pattern matching

**Source code:** Lib/fnmatch.py

This module provides support for Unix shell-style wildcards, which are *not* the same as regular expressions (which are documented in the `re` module). The special characters used in shell-style wildcards are:

| Pattern | Meaning |
| --- | --- |
| `*` | matches everything |
| `?` | matches any single character |
| `[seq]` | matches any character in *seq* |
| `[!seq]` | matches any character not in *seq* |

For a literal match, wrap the meta-characters in brackets. For example, `'[?]'` matches the character `'?'`.

Note that the filename separator (`'/'` on Unix) is *not* special to this module. See module `glob` for pathname expansion (`glob` uses `filter()` to match pathname segments). Similarly, filenames starting with a period are not special for this module, and are matched by the `*` and `?` patterns.

Unless stated otherwise, “filename string” and “pattern string” either refer to `str` or `ISO-8859-1` encoded `bytes` objects. Note that the functions documented below do not allow to mix a `bytes` pattern with a `str` filename, and vice-versa.

Finally, note that `@functools.lru_cache` with a *maxsize* of 32768 is used to cache the (typed) compiled regex patterns in the following functions: `fnmatch()`, `fnmatchcase()`, `filter()`, `filterfalse()`.

<!-- anchor: fnmatch.fnmatch | type: py function -->
## `fnmatch.fnmatch(name, pat)`

Test whether the filename string *name* matches the pattern string *pat*, returning `True` or `False`. Both parameters are case-normalized using `os.path.normcase()`. `fnmatchcase()` can be used to perform a case-sensitive comparison, regardless of whether that’s standard for the operating system.

This example will print all file names in the current directory with the extension `.txt`:

```python
import fnmatch
import os

for file in os.listdir('.'):
    if fnmatch.fnmatch(file, '*.txt'):
        print(file)
```

<!-- anchor: fnmatch.fnmatchcase | type: py function -->
## `fnmatch.fnmatchcase(name, pat)`

Test whether the filename string *name* matches the pattern string *pat*, returning `True` or `False`; the comparison is case-sensitive and does not apply `os.path.normcase()`.

<!-- anchor: fnmatch.filter | type: py function -->
## `fnmatch.filter(names, pat)`

Construct a list from those elements of the iterable of filename strings *names* that match the pattern string *pat*. It is the same as `[n for n in names if fnmatch(n, pat)]`, but implemented more efficiently.

<!-- anchor: fnmatch.filterfalse | type: py function -->
## `fnmatch.filterfalse(names, pat)`

Construct a list from those elements of the iterable of filename strings *names* that do not match the pattern string *pat*. It is the same as `[n for n in names if not fnmatch(n, pat)]`, but implemented more efficiently.

Added in version 3.14.

<!-- anchor: fnmatch.translate | type: py function -->
## `fnmatch.translate(pat)`

Return the shell-style pattern *pat* converted to a regular expression for using with `re.prefixmatch()`. The pattern is expected to be a `str`.

Example:

```
>>> import fnmatch, re
>>>
>>> regex = fnmatch.translate('*.txt')
>>> regex
'(?s:.*\\.txt)\\z'
>>> reobj = re.compile(regex)
>>> reobj.prefixmatch('foobar.txt')
<re.Match object; span=(0, 10), match='foobar.txt'>
```

**See also:**

**Module `glob`**

Unix shell-style path expansion.
