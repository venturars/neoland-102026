# Pending removal in Python 3.20

- `_PyObject_CallMethodId()`, `_PyObject_GetAttrId()` and
  `_PyUnicode_FromId()` are deprecated since 3.15 and will be removed in
  3.20. Instead, use `PyUnicode_InternFromString()` and cache the result in
  the module state, then call `PyObject_CallMethod()` or
  `PyObject_GetAttr()`.
  (Contributed by Victor Stinner in gh-141049.)
- The `cval` field in `PyComplexObject` (gh-128813).
  Use `PyComplex_AsCComplex()` and `PyComplex_FromCComplex()`
  to convert a Python complex number to/from the C `Py_complex`
  representation.
- Macros `Py_MATH_PIl` and `Py_MATH_El`.
