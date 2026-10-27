---
page: c-api/complex.html
title: Complex Number Objects
area: c-api
kind: guide
---

<!-- anchor: complex-number-objects | type: section -->
# Complex Number Objects

<!-- anchor: c.PyComplexObject | type: c type -->
## `type PyComplexObject`

This subtype of `PyObject` represents a Python complex number object.

<!-- anchor: c.PyComplexObject.cval | type: c member -->
### `Py_complex cval`

The complex number value, using the C `Py_complex` representation.

Deprecated since version 3.15, will be removed in version 3.20: Use `PyComplex_AsCComplex()` and `PyComplex_FromCComplex()` to convert a Python complex number to/from the C `Py_complex` representation.

<!-- anchor: c.PyComplex_Type | type: c var -->
## `PyTypeObject PyComplex_Type`

*Part of the Stable ABI.*

This instance of `PyTypeObject` represents the Python complex number type. It is the same object as `complex` in the Python layer.

<!-- anchor: c.PyComplex_Check | type: c function -->
## `int PyComplex_Check(PyObject *p)`

Return true if its argument is a `PyComplexObject` or a subtype of `PyComplexObject`. This function always succeeds.

<!-- anchor: c.PyComplex_CheckExact | type: c function -->
## `int PyComplex_CheckExact(PyObject *p)`

Return true if its argument is a `PyComplexObject`, but not a subtype of `PyComplexObject`. This function always succeeds.

<!-- anchor: c.PyComplex_FromDoubles | type: c function -->
## `PyObject *PyComplex_FromDoubles(double real, double imag)`

*Return value: New reference.**Part of the Stable ABI.*

Return a new `PyComplexObject` object from *real* and *imag*. Return `NULL` with an exception set on error.

<!-- anchor: c.PyComplex_RealAsDouble | type: c function -->
## `double PyComplex_RealAsDouble(PyObject *op)`

*Part of the Stable ABI.*

Return the real part of *op* as a C double.

If *op* is not a Python complex number object but has a `__complex__()` method, this method will first be called to convert *op* to a Python complex number object. If `__complex__()` is not defined then it falls back to call `PyFloat_AsDouble()` and returns its result.

Upon failure, this method returns `-1.0` with an exception set, so one should call `PyErr_Occurred()` to check for errors.

Changed in version 3.13: Use `__complex__()` if available.

<!-- anchor: c.PyComplex_ImagAsDouble | type: c function -->
## `double PyComplex_ImagAsDouble(PyObject *op)`

*Part of the Stable ABI.*

Return the imaginary part of *op* as a C double.

If *op* is not a Python complex number object but has a `__complex__()` method, this method will first be called to convert *op* to a Python complex number object. If `__complex__()` is not defined then it falls back to call `PyFloat_AsDouble()` and returns `0.0` on success.

Upon failure, this method returns `-1.0` with an exception set, so one should call `PyErr_Occurred()` to check for errors.

Changed in version 3.13: Use `__complex__()` if available.

<!-- anchor: c.Py_complex | type: c type -->
## `type Py_complex`

This C structure defines an export format for a Python complex number object.

<!-- anchor: c.Py_complex.real | type: c member -->
### `double real`

`double imag`

The structure is defined as:

```c
typedef struct {
    double real;
    double imag;
} Py_complex;
```

<!-- anchor: c.PyComplex_FromCComplex | type: c function -->
## `PyObject *PyComplex_FromCComplex(Py_complex v)`

*Return value: New reference.*

Create a new Python complex number object from a C `Py_complex` value. Return `NULL` with an exception set on error.

<!-- anchor: c.PyComplex_AsCComplex | type: c function -->
## `Py_complex PyComplex_AsCComplex(PyObject *op)`

Return the `Py_complex` value of the complex number *op*.

If *op* is not a Python complex number object but has a `__complex__()` method, this method will first be called to convert *op* to a Python complex number object. If `__complex__()` is not defined then it falls back to `__float__()`. If `__float__()` is not defined then it falls back to `__index__()`.

Upon failure, this method returns `Py_complex` with `real` set to `-1.0` and with an exception set, so one should call `PyErr_Occurred()` to check for errors.

Changed in version 3.8: Use `__index__()` if available.

<!-- anchor: complex-numbers-as-c-structures | type: section -->
## Complex Numbers as C Structures

The API also provides functions for working with complex numbers, using the `Py_complex` representation. Note that the functions which accept these structures as parameters and return them as results do so *by value* rather than dereferencing them through pointers.

Please note, that these functions are soft deprecated since Python 3.15. Avoid using this API in a new code to do complex arithmetic: either use the Number Protocol API or use native complex types, like double complex.

<!-- anchor: c._Py_c_sum | type: c function -->
### `Py_complex _Py_c_sum(Py_complex left, Py_complex right)`

Return the sum of two complex numbers, using the C `Py_complex` representation.

Deprecated since version 3.15.

<!-- anchor: c._Py_c_diff | type: c function -->
### `Py_complex _Py_c_diff(Py_complex left, Py_complex right)`

Return the difference between two complex numbers, using the C `Py_complex` representation.

Deprecated since version 3.15.

<!-- anchor: c._Py_c_neg | type: c function -->
### `Py_complex _Py_c_neg(Py_complex num)`

Return the negation of the complex number *num*, using the C `Py_complex` representation.

Deprecated since version 3.15.

<!-- anchor: c._Py_c_prod | type: c function -->
### `Py_complex _Py_c_prod(Py_complex left, Py_complex right)`

Return the product of two complex numbers, using the C `Py_complex` representation.

Deprecated since version 3.15.

<!-- anchor: c._Py_c_quot | type: c function -->
### `Py_complex _Py_c_quot(Py_complex dividend, Py_complex divisor)`

Return the quotient of two complex numbers, using the C `Py_complex` representation.

If *divisor* is null, this method returns zero and sets `errno` to `EDOM`.

Deprecated since version 3.15.

<!-- anchor: c._Py_c_pow | type: c function -->
### `Py_complex _Py_c_pow(Py_complex num, Py_complex exp)`

Return the exponentiation of *num* by *exp*, using the C `Py_complex` representation.

If *num* is null and *exp* is not a positive real number, this method returns zero and sets `errno` to `EDOM`.

Set `errno` to `ERANGE` on overflows.

Deprecated since version 3.15.

<!-- anchor: c._Py_c_abs | type: c function -->
### `double _Py_c_abs(Py_complex num)`

Return the absolute value of the complex number *num*.

Set `errno` to `ERANGE` on overflows.

Deprecated since version 3.15.
