---
page: extending/building.html
title: Building C and C++ Extensions
area: extending
kind: guide
---

<!-- anchor: building-c-and-c-extensions | type: section -->
# Building C and C++ Extensions

A C extension for CPython is a shared library (for example, a `.so` file on Linux, `.pyd` on Windows), which exports an *initialization function*.

See Defining extension modules for details.

<!-- anchor: building-c-and-c-extensions-with-setuptools | type: section -->
## Building C and C++ Extensions with setuptools

Building, packaging and distributing extension modules is best done with third-party tools, and is out of scope of this document. One suitable tool is Setuptools, whose documentation can be found at https://setuptools.pypa.io/en/latest/setuptools.html.

The `distutils` module, which was included in the standard library until Python 3.12, is now maintained as part of Setuptools.
