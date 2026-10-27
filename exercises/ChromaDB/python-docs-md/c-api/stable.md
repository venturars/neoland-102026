---
page: c-api/stable.html
title: C API and ABI Stability
area: c-api
kind: guide
---

<!-- anchor: c-api-and-abi-stability | type: section -->
# C API and ABI Stability

Unless documented otherwise, Python’s C API is covered by the Backwards Compatibility Policy, **PEP 387**. Most changes to it are source-compatible (typically by only adding new API). Changing existing API or removing API is only done after a deprecation period or to fix serious issues.

CPython’s Application Binary Interface (ABI) is forward- and backwards-compatible across a minor release (if these are compiled the same way; see Platform Considerations below). So, code compiled for Python 3.10.0 will work on 3.10.8 and vice versa, but will need to be compiled separately for 3.9.x and 3.11.x.

There are two tiers of C API with different stability expectations:

- Unstable API, may change in minor versions without a deprecation period. It is marked by the `PyUnstable` prefix in names.

- Limited API, is compatible across several minor releases. When `Py_LIMITED_API` is defined, only this subset is exposed from `Python.h`.

These are discussed in more detail below.

Names prefixed by an underscore, such as `_Py_InternalState`, are private API that can change without notice even in patch releases. If you need to use this API, consider reaching out to CPython developers to discuss adding public API for your use case.

<!-- anchor: unstable-c-api | type: section -->
## Unstable C API

Any API named with the `PyUnstable` prefix exposes CPython implementation details, and may change in every minor release (e.g. from 3.9 to 3.10) without any deprecation warnings. However, it will not change in a bugfix release (e.g. from 3.10.0 to 3.10.1).

It is generally intended for specialized, low-level tools like debuggers.

Projects that use this API are expected to follow CPython development and spend extra effort adjusting to changes.

<!-- anchor: stable-application-binary-interfaces | type: section -->
## Stable Application Binary Interfaces

Python’s *Stable ABI* allows extensions to be compatible with multiple versions of Python, without recompilation.

**Note:**

For simplicity, this document talks about *extensions*, but Stable ABI works the same way for all uses of the API – for example, embedding Python.

There are two Stable ABIs:

- `abi3`, introduced in Python 3.2, is compatible with **non**-free-threaded builds of CPython.

- `abi3t`, introduced in Python 3.15, is compatible with free-threaded builds of CPython. It has stricter API limitations than `abi3`.

  Added in version 3.15: `abi3t` was added in **PEP 803**

It is possible for an extension to be compiled for *both* `abi3` and `abi3t` at the same time; the result will be compatible with both free-threaded and non-free-threaded builds of Python. Currently, this has no downsides compared to compiling for `abi3t` only.

Each Stable ABI is versioned using the first two numbers of the Python version. For example, Stable ABI 3.14 corresponds to Python 3.14. An extension compiled for Stable ABI 3.x is ABI-compatible with Python 3.x and above.

Extensions that target a stable ABI must only use a limited subset of the C API. This subset is known as the *Limited API*; its contents are listed below.

On Windows, extensions that use a Stable ABI should be linked against `python3.dll` rather than a version-specific library such as `python39.dll`. This library only exposes the relevant symbols.

On some platforms, Python will look for and load shared library files named with the `abi3` or `abi3t` tag (for example, `mymodule.abi3.so`). Free-threaded interpreters only recognize the `abi3t` tag, while non-free-threaded ones will prefer `abi3` but fall back to `abi3t`. Thus, extensions compatible with both ABIs should use the `abi3t` tag.

Python does not necessarily check that extensions it loads have compatible ABI. Extension authors are encouraged to add a check using the `Py_mod_abi` slot or the `PyABIInfo_Check()` function, but the user (or their packaging tool) is ultimately responsible for ensuring that, for example, extensions built for Stable ABI 3.10 are not installed for lower versions of Python.

All functions in Stable ABI are present as functions in Python’s shared library, not solely as macros. This makes them usable in languages that don’t use the C preprocessor, including Python’s `ctypes`.

<!-- anchor: compiling-for-stable-abi | type: section -->
### Compiling for Stable ABI

**Note:**

Build tools (such as, for example, meson-python, scikit-build-core, or Setuptools) often have a mechanism for setting macros and synchronizing them with extension filenames and other metadata. Prefer using such a mechanism, if it exists, over defining the macros manually.

The rest of this section is mainly relevant for tool authors, and for people who compile extensions manually.

**See also:**

list of recommended tools in the Python Packaging User Guide

To compile for a Stable ABI, define one or both of the following macros to the lowest Python version your extension should support, in `Py_PACK_VERSION` format. Typically, you should choose a specific value rather than the version of the Python headers you are compiling against.

The macros must be defined before including `Python.h`. Since `Py_PACK_VERSION` is not available at this point, you will need to use the numeric value directly. For reference, the values for a few recent Python versions are:

```c
0x30a0000  /* Py_PACK_VERSION(3,10) */
0x30b0000  /* Py_PACK_VERSION(3,11) */
0x30c0000  /* Py_PACK_VERSION(3,12) */
0x30d0000  /* Py_PACK_VERSION(3,13) */
0x30e0000  /* Py_PACK_VERSION(3,14) */
0x30f0000  /* Py_PACK_VERSION(3,15) */
```

When one of the macros is defined, `Python.h` will only expose API that is compatible with the given Stable ABI – that is, the Limited API plus some definitions that need to be visible to the compiler but should not be used directly. When both are defined, `Python.h` will only expose API compatible with both Stable ABIs.

<!-- anchor: c.Py_LIMITED_API | type: c macro -->
#### `Py_LIMITED_API`

Target `abi3`, that is, non-free-threaded builds of CPython. See above for common information.

<!-- anchor: c.Py_TARGET_ABI3T | type: c macro -->
#### `Py_TARGET_ABI3T`

Target `abi3t`, that is, free-threaded builds of CPython. See above for common information.

Added in version 3.15.

Both macros specify a target ABI; the different naming style is due to backwards compatibility.

**Historical note:**

You can also define `Py_LIMITED_API` as `3`. This works the same as `0x03020000` (Python 3.2, the version that introduced Stable ABI).

When both are defined, `Python.h` may, or may not, redefine `Py_LIMITED_API` to match `Py_TARGET_ABI3T`.

On a free-threaded build – that is, when `Py_GIL_DISABLED` is defined – `Py_TARGET_ABI3T` defaults to the value of `Py_LIMITED_API`. This means that there are two ways to build for both `abi3` and `abi3t`:

- define both `Py_LIMITED_API` and `Py_TARGET_ABI3T`, or

- define only `Py_LIMITED_API` and:

  - on Windows, define `Py_GIL_DISABLED`;

  - on other systems, use the headers of free-threaded build of Python.

<!-- anchor: stable-abi-scope-and-performance | type: section -->
### Stable ABI Scope and Performance

The goal for Stable ABI is to allow everything that is possible with the full C API, but possibly with a performance penalty. Generally, compatibility with Stable ABI will require some changes to an extension’s source code.

For example, while `PyList_GetItem()` is available, its “unsafe” macro variant `PyList_GET_ITEM()` is not. The macro can be faster because it can rely on version-specific implementation details of the list object.

For another example, when *not* compiling for Stable ABI, some C API functions are inlined or replaced by macros. Compiling for Stable ABI disables this inlining, allowing stability as Python’s data structures are improved, but possibly reducing performance.

By leaving out the `Py_LIMITED_API` or `Py_TARGET_ABI3T` definition, it is possible to compile Stable-ABI-compatible source for a version-specific ABI. A potentially faster version-specific extension can then be distributed alongside a version compiled for Stable ABI – a slower but more compatible fallback.

<!-- anchor: stable-abi-caveats | type: section -->
### Stable ABI Caveats

Note that compiling for Stable ABI is *not* a complete guarantee that code will be compatible with the expected Python versions. Stable ABI prevents *ABI* issues, like linker errors due to missing symbols or data corruption due to changes in structure layouts or function signatures. However, other changes in Python can change the *behavior* of extensions.

One issue that the `Py_TARGET_ABI3T` and `Py_LIMITED_API` macros do not guard against is calling a function with arguments that are invalid in a lower Python version. For example, consider a function that starts accepting `NULL` for an argument. In Python 3.9, `NULL` now selects a default behavior, but in Python 3.8, the argument will be used directly, causing a `NULL` dereference and crash. A similar argument works for fields of structs.

For these reasons, we recommend testing an extension with *all* minor Python versions it supports.

We also recommend reviewing documentation of all used API to check if it is explicitly part of the Limited API. Even with `Py_LIMITED_API` defined, a few private declarations are exposed for technical reasons (or even unintentionally, as bugs).

Also note that while compiling with `Py_LIMITED_API` 3.8 means that the extension should *load* on Python 3.12, and *compile* with Python 3.12, the same source will not necessarily compile with `Py_LIMITED_API` set to 3.12. In general, parts of the Limited API may be deprecated and removed, provided that Stable ABI stays stable.

<!-- anchor: platform-considerations | type: section -->
## Platform Considerations

ABI stability depends not only on Python, but also on the compiler used, lower-level libraries and compiler options. For the purposes of the Stable ABIs, these details define a “platform”. They usually depend on the OS type and processor architecture

It is the responsibility of each particular distributor of Python to ensure that all Python versions on a particular platform are built in a way that does not break the Stable ABIs, or the version-specific ABIs. This is the case with Windows and macOS releases from `python.org` and many third-party distributors.

<!-- anchor: abi-checking | type: section -->
## ABI Checking

Added in version 3.15.

Python includes a rudimentary check for ABI compatibility.

This check is not comprehensive. It only guards against common cases of incompatible modules being installed for the wrong interpreter. It also does not take platform incompatibilities into account. It can only be done after an extension is successfully loaded.

Despite these limitations, it is recommended that extension modules use this mechanism, so that detectable incompatibilities raise exceptions rather than crash.

Most modules can use this check via the `Py_mod_abi` slot and the `PyABIInfo_VAR` macro, for example like this:

```c
PyABIInfo_VAR(abi_info);

static PyModuleDef_Slot mymodule_slots[] = {
   {Py_mod_abi, &abi_info},
   ...
};
```

The full API is described below for advanced use cases.

<!-- anchor: c.PyABIInfo_Check | type: c function -->
### `int PyABIInfo_Check(PyABIInfo *info, const char *module_name)`

*Part of the Stable ABI since version 3.15.*

Verify that the given *info* is compatible with the currently running interpreter.

Return 0 on success. On failure, raise an exception and return -1.

If the ABI is incompatible, the raised exception will be `ImportError`.

The *module_name* argument can be `NULL`, or point to a NUL-terminated UTF-8-encoded string used for error messages.

Note that if *info* describes the ABI that the current code uses (as defined by `PyABIInfo_VAR`, for example), using any other Python C API may lead to crashes. In particular, it is not safe to examine the raised exception.

Added in version 3.15.

<!-- anchor: c.PyABIInfo_VAR | type: c macro -->
### `PyABIInfo_VAR(NAME)`

*This macro is available when compiling for the Stable ABI since version 3.15.*

Define a static `PyABIInfo` variable with the given *NAME* that describes the ABI that the current code will use. This macro expands to:

```c
static PyABIInfo NAME = {
    1, 0,
    PyABIInfo_DEFAULT_FLAGS,
    PY_VERSION_HEX,
    PyABIInfo_DEFAULT_ABI_VERSION
}
```

Added in version 3.15.

<!-- anchor: c.PyABIInfo | type: c type -->
### `type PyABIInfo`

*Part of the Stable ABI (including all members) since version 3.15.*

<!-- anchor: c.PyABIInfo.abiinfo_major_version | type: c member -->
#### `uint8_t abiinfo_major_version`

The major version of `PyABIInfo`. Can be set to:

- `0` to skip all checking, or

- `1` to specify this version of `PyABIInfo`.

<!-- anchor: c.PyABIInfo.abiinfo_minor_version | type: c member -->
#### `uint8_t abiinfo_minor_version`

The minor version of `PyABIInfo`. Must be set to `0`; larger values are reserved for backwards-compatible future versions of `PyABIInfo`.

<!-- anchor: c.PyABIInfo.flags | type: c member -->
#### `uint16_t flags`

This field is usually set to the following macro:

<!-- anchor: c.PyABIInfo_DEFAULT_FLAGS | type: c macro -->
##### `PyABIInfo_DEFAULT_FLAGS`

*Part of the Stable ABI since version 3.15.*

Default flags, based on current values of macros such as `Py_LIMITED_API` and `Py_GIL_DISABLED`.

Alternately, the field can be set to the following flags, combined by bitwise OR. Unused bits must be set to zero.

ABI variant – one of:

<!-- anchor: c.PyABIInfo_STABLE | type: c macro -->
##### `PyABIInfo_STABLE`

*Part of the Stable ABI since version 3.15.*

Specifies that Stable ABI is used.

<!-- anchor: c.PyABIInfo_INTERNAL | type: c macro -->
##### `PyABIInfo_INTERNAL`

Specifies ABI specific to a particular build of CPython. Internal use only.

Free-threading compatibility – one of:

<!-- anchor: c.PyABIInfo_FREETHREADED | type: c macro -->
##### `PyABIInfo_FREETHREADED`

*Part of the Stable ABI since version 3.15.*

Specifies ABI compatible with free-threaded builds of CPython. (That is, ones compiled with `--disable-gil`; with `t` in `sys.abiflags`)

<!-- anchor: c.PyABIInfo_GIL | type: c macro -->
##### `PyABIInfo_GIL`

*Part of the Stable ABI since version 3.15.*

Specifies ABI compatible with non-free-threaded builds of CPython (ones compiled *without* `--disable-gil`).

<!-- anchor: c.PyABIInfo_FREETHREADING_AGNOSTIC | type: c macro -->
##### `PyABIInfo_FREETHREADING_AGNOSTIC`

*Part of the Stable ABI since version 3.15.*

Specifies ABI compatible with both free-threaded and non-free-threaded builds of CPython, that is, both `abi3` and `abi3t`.

<!-- anchor: c.PyABIInfo.build_version | type: c member -->
#### `uint32_t build_version`

The version of the Python headers used to build the code, in the format used by `PY_VERSION_HEX`.

This can be set to `0` to skip any checks related to this field. This option is meant mainly for projects that do not use the CPython headers directly, and do not emulate a specific version of them.

<!-- anchor: c.PyABIInfo.abi_version | type: c member -->
#### `uint32_t abi_version`

The ABI version.

For Stable ABI, this field should be the value of `Py_LIMITED_API` or `Py_TARGET_ABI3T`. If both are defined, use the smaller value. (If `Py_LIMITED_API` is `3`; use Py_PACK_VERSION(3, 2) instead of `3`.)

Otherwise, it should be set to `PY_VERSION_HEX`.

It can also be set to `0` to skip any checks related to this field.

<!-- anchor: c.PyABIInfo_DEFAULT_ABI_VERSION | type: c macro -->
##### `PyABIInfo_DEFAULT_ABI_VERSION`

*Part of the Stable ABI since version 3.15.*

The value that should be used for this field, based on current values of macros such as `Py_LIMITED_API`, `PY_VERSION_HEX` and `Py_GIL_DISABLED`.

Added in version 3.15.

<!-- anchor: contents-of-limited-api | type: section -->
## Contents of Limited API

This is the definitive list of Limited API for Python 3.15:

- `METH_CLASS`

- `METH_COEXIST`

- `METH_FASTCALL`

- `METH_METHOD`

- `METH_NOARGS`

- `METH_O`

- `METH_STATIC`

- `METH_VARARGS`

- `PY_VECTORCALL_ARGUMENTS_OFFSET`

- `PyABIInfo`

- `PyABIInfo_Check()`

- `PyABIInfo_DEFAULT_ABI_VERSION`

- `PyABIInfo_DEFAULT_FLAGS`

- `PyABIInfo_FREETHREADED`

- `PyABIInfo_FREETHREADING_AGNOSTIC`

- `PyABIInfo_GIL`

- `PyABIInfo_STABLE`

- `PyABIInfo_VAR`

- `PyAIter_Check()`

- `PyArg_Parse()`

- `PyArg_ParseTuple()`

- `PyArg_ParseTupleAndKeywords()`

- `PyArg_UnpackTuple()`

- `PyArg_VaParse()`

- `PyArg_VaParseTupleAndKeywords()`

- `PyArg_ValidateKeywordArguments()`

- `PyBUF_ANY_CONTIGUOUS`

- `PyBUF_CONTIG`

- `PyBUF_CONTIG_RO`

- `PyBUF_C_CONTIGUOUS`

- `PyBUF_FORMAT`

- `PyBUF_FULL`

- `PyBUF_FULL_RO`

- `PyBUF_F_CONTIGUOUS`

- `PyBUF_INDIRECT`

- `PyBUF_MAX_NDIM`

- `PyBUF_ND`

- `PyBUF_READ`

- `PyBUF_RECORDS`

- `PyBUF_RECORDS_RO`

- `PyBUF_SIMPLE`

- `PyBUF_STRIDED`

- `PyBUF_STRIDED_RO`

- `PyBUF_STRIDES`

- `PyBUF_WRITABLE`

- `PyBUF_WRITE`

- `PyBaseObject_Type`

- `PyBool_FromLong()`

- `PyBool_Type`

- `PyBuffer_FillContiguousStrides()`

- `PyBuffer_FillInfo()`

- `PyBuffer_FromContiguous()`

- `PyBuffer_GetPointer()`

- `PyBuffer_IsContiguous()`

- `PyBuffer_Release()`

- `PyBuffer_SizeFromFormat()`

- `PyBuffer_ToContiguous()`

- `PyByteArrayIter_Type`

- `PyByteArray_AsString()`

- `PyByteArray_Concat()`

- `PyByteArray_FromObject()`

- `PyByteArray_FromStringAndSize()`

- `PyByteArray_Resize()`

- `PyByteArray_Size()`

- `PyByteArray_Type`

- `PyBytesIter_Type`

- `PyBytes_AsString()`

- `PyBytes_AsStringAndSize()`

- `PyBytes_Concat()`

- `PyBytes_ConcatAndDel()`

- `PyBytes_DecodeEscape()`

- `PyBytes_FromFormat()`

- `PyBytes_FromFormatV()`

- `PyBytes_FromObject()`

- `PyBytes_FromString()`

- `PyBytes_FromStringAndSize()`

- `PyBytes_Repr()`

- `PyBytes_Size()`

- `PyBytes_Type`

- `PyCFunction`

- `PyCFunctionFast`

- `PyCFunctionFastWithKeywords`

- `PyCFunctionWithKeywords`

- `PyCFunction_GetFlags()`

- `PyCFunction_GetFunction()`

- `PyCFunction_GetSelf()`

- `PyCFunction_New()`

- `PyCFunction_NewEx()`

- `PyCFunction_Type`

- `PyCMethod_New()`

- `PyCallIter_New()`

- `PyCallIter_Type`

- `PyCallable_Check()`

- `PyCapsule_Destructor`

- `PyCapsule_GetContext()`

- `PyCapsule_GetDestructor()`

- `PyCapsule_GetName()`

- `PyCapsule_GetPointer()`

- `PyCapsule_Import()`

- `PyCapsule_IsValid()`

- `PyCapsule_New()`

- `PyCapsule_SetContext()`

- `PyCapsule_SetDestructor()`

- `PyCapsule_SetName()`

- `PyCapsule_SetPointer()`

- `PyCapsule_Type`

- `PyClassMethodDescr_Type`

- `PyCodec_BackslashReplaceErrors()`

- `PyCodec_Decode()`

- `PyCodec_Decoder()`

- `PyCodec_Encode()`

- `PyCodec_Encoder()`

- `PyCodec_IgnoreErrors()`

- `PyCodec_IncrementalDecoder()`

- `PyCodec_IncrementalEncoder()`

- `PyCodec_KnownEncoding()`

- `PyCodec_LookupError()`

- `PyCodec_NameReplaceErrors()`

- `PyCodec_Register()`

- `PyCodec_RegisterError()`

- `PyCodec_ReplaceErrors()`

- `PyCodec_StreamReader()`

- `PyCodec_StreamWriter()`

- `PyCodec_StrictErrors()`

- `PyCodec_Unregister()`

- `PyCodec_XMLCharRefReplaceErrors()`

- `PyComplex_FromDoubles()`

- `PyComplex_ImagAsDouble()`

- `PyComplex_RealAsDouble()`

- `PyComplex_Type`

- `PyCriticalSection`

- `PyCriticalSection2`

- `PyCriticalSection2_Begin()`

- `PyCriticalSection2_End()`

- `PyCriticalSection_Begin()`

- `PyCriticalSection_End()`

- `PyDescr_NewClassMethod()`

- `PyDescr_NewGetSet()`

- `PyDescr_NewMember()`

- `PyDescr_NewMethod()`

- `PyDictItems_Type`

- `PyDictIterItem_Type`

- `PyDictIterKey_Type`

- `PyDictIterValue_Type`

- `PyDictKeys_Type`

- `PyDictProxy_New()`

- `PyDictProxy_Type`

- `PyDictRevIterItem_Type`

- `PyDictRevIterKey_Type`

- `PyDictRevIterValue_Type`

- `PyDictValues_Type`

- `PyDict_Clear()`

- `PyDict_Contains()`

- `PyDict_Copy()`

- `PyDict_DelItem()`

- `PyDict_DelItemString()`

- `PyDict_GetItem()`

- `PyDict_GetItemRef()`

- `PyDict_GetItemString()`

- `PyDict_GetItemStringRef()`

- `PyDict_GetItemWithError()`

- `PyDict_Items()`

- `PyDict_Keys()`

- `PyDict_Merge()`

- `PyDict_MergeFromSeq2()`

- `PyDict_New()`

- `PyDict_Next()`

- `PyDict_SetDefaultRef()`

- `PyDict_SetItem()`

- `PyDict_SetItemString()`

- `PyDict_Size()`

- `PyDict_Type`

- `PyDict_Update()`

- `PyDict_Values()`

- `PyEllipsis_Type`

- `PyEnum_Type`

- `PyErr_BadArgument()`

- `PyErr_BadInternalCall()`

- `PyErr_CheckSignals()`

- `PyErr_Clear()`

- `PyErr_Display()`

- `PyErr_DisplayException()`

- `PyErr_ExceptionMatches()`

- `PyErr_Fetch()`

- `PyErr_Format()`

- `PyErr_FormatV()`

- `PyErr_GetExcInfo()`

- `PyErr_GetHandledException()`

- `PyErr_GetRaisedException()`

- `PyErr_GivenExceptionMatches()`

- `PyErr_NewException()`

- `PyErr_NewExceptionWithDoc()`

- `PyErr_NoMemory()`

- `PyErr_NormalizeException()`

- `PyErr_Occurred()`

- `PyErr_Print()`

- `PyErr_PrintEx()`

- `PyErr_ProgramText()`

- `PyErr_ResourceWarning()`

- `PyErr_Restore()`

- `PyErr_SetExcFromWindowsErr()`

- `PyErr_SetExcFromWindowsErrWithFilename()`

- `PyErr_SetExcFromWindowsErrWithFilenameObject()`

- `PyErr_SetExcFromWindowsErrWithFilenameObjects()`

- `PyErr_SetExcInfo()`

- `PyErr_SetFromErrno()`

- `PyErr_SetFromErrnoWithFilename()`

- `PyErr_SetFromErrnoWithFilenameObject()`

- `PyErr_SetFromErrnoWithFilenameObjects()`

- `PyErr_SetFromWindowsErr()`

- `PyErr_SetFromWindowsErrWithFilename()`

- `PyErr_SetHandledException()`

- `PyErr_SetImportError()`

- `PyErr_SetImportErrorSubclass()`

- `PyErr_SetInterrupt()`

- `PyErr_SetInterruptEx()`

- `PyErr_SetNone()`

- `PyErr_SetObject()`

- `PyErr_SetRaisedException()`

- `PyErr_SetString()`

- `PyErr_SyntaxLocation()`

- `PyErr_SyntaxLocationEx()`

- `PyErr_WarnEx()`

- `PyErr_WarnExplicit()`

- `PyErr_WarnFormat()`

- `PyErr_WriteUnraisable()`

- `PyEval_AcquireThread()`

- `PyEval_EvalCode()`

- `PyEval_EvalCodeEx()`

- `PyEval_EvalFrame()`

- `PyEval_EvalFrameEx()`

- `PyEval_GetBuiltins()`

- `PyEval_GetFrame()`

- `PyEval_GetFrameBuiltins()`

- `PyEval_GetFrameGlobals()`

- `PyEval_GetFrameLocals()`

- `PyEval_GetFuncDesc()`

- `PyEval_GetFuncName()`

- `PyEval_GetGlobals()`

- `PyEval_GetLocals()`

- `PyEval_InitThreads()`

- `PyEval_ReleaseThread()`

- `PyEval_RestoreThread()`

- `PyEval_SaveThread()`

- `PyExc_ArithmeticError`

- `PyExc_AssertionError`

- `PyExc_AttributeError`

- `PyExc_BaseException`

- `PyExc_BaseExceptionGroup`

- `PyExc_BlockingIOError`

- `PyExc_BrokenPipeError`

- `PyExc_BufferError`

- `PyExc_BytesWarning`

- `PyExc_ChildProcessError`

- `PyExc_ConnectionAbortedError`

- `PyExc_ConnectionError`

- `PyExc_ConnectionRefusedError`

- `PyExc_ConnectionResetError`

- `PyExc_DeprecationWarning`

- `PyExc_EOFError`

- `PyExc_EncodingWarning`

- `PyExc_EnvironmentError`

- `PyExc_Exception`

- `PyExc_FileExistsError`

- `PyExc_FileNotFoundError`

- `PyExc_FloatingPointError`

- `PyExc_FutureWarning`

- `PyExc_GeneratorExit`

- `PyExc_IOError`

- `PyExc_ImportError`

- `PyExc_ImportWarning`

- `PyExc_IndentationError`

- `PyExc_IndexError`

- `PyExc_InterruptedError`

- `PyExc_IsADirectoryError`

- `PyExc_KeyError`

- `PyExc_KeyboardInterrupt`

- `PyExc_LookupError`

- `PyExc_MemoryError`

- `PyExc_ModuleNotFoundError`

- `PyExc_NameError`

- `PyExc_NotADirectoryError`

- `PyExc_NotImplementedError`

- `PyExc_OSError`

- `PyExc_OverflowError`

- `PyExc_PendingDeprecationWarning`

- `PyExc_PermissionError`

- `PyExc_ProcessLookupError`

- `PyExc_RecursionError`

- `PyExc_ReferenceError`

- `PyExc_ResourceWarning`

- `PyExc_RuntimeError`

- `PyExc_RuntimeWarning`

- `PyExc_StopAsyncIteration`

- `PyExc_StopIteration`

- `PyExc_SyntaxError`

- `PyExc_SyntaxWarning`

- `PyExc_SystemError`

- `PyExc_SystemExit`

- `PyExc_TabError`

- `PyExc_TimeoutError`

- `PyExc_TypeError`

- `PyExc_UnboundLocalError`

- `PyExc_UnicodeDecodeError`

- `PyExc_UnicodeEncodeError`

- `PyExc_UnicodeError`

- `PyExc_UnicodeTranslateError`

- `PyExc_UnicodeWarning`

- `PyExc_UserWarning`

- `PyExc_ValueError`

- `PyExc_Warning`

- `PyExc_WindowsError`

- `PyExc_ZeroDivisionError`

- `PyExceptionClass_Name()`

- `PyException_GetArgs()`

- `PyException_GetCause()`

- `PyException_GetContext()`

- `PyException_GetTraceback()`

- `PyException_SetArgs()`

- `PyException_SetCause()`

- `PyException_SetContext()`

- `PyException_SetTraceback()`

- `PyFile_FromFd()`

- `PyFile_GetLine()`

- `PyFile_WriteObject()`

- `PyFile_WriteString()`

- `PyFilter_Type`

- `PyFloat_AsDouble()`

- `PyFloat_FromDouble()`

- `PyFloat_FromString()`

- `PyFloat_GetInfo()`

- `PyFloat_GetMax()`

- `PyFloat_GetMin()`

- `PyFloat_Type`

- `PyFrameObject`

- `PyFrame_GetCode()`

- `PyFrame_GetLineNumber()`

- `PyFrozenSet_New()`

- `PyFrozenSet_Type`

- `PyGC_Collect()`

- `PyGC_Disable()`

- `PyGC_Enable()`

- `PyGC_IsEnabled()`

- `PyGILState_Ensure()`

- `PyGILState_GetThisThreadState()`

- `PyGILState_Release()`

- `PyGILState_STATE`

- `PyGetSetDef`

- `PyGetSetDescr_Type`

- `PyImport_AddModule()`

- `PyImport_AddModuleObject()`

- `PyImport_AddModuleRef()`

- `PyImport_AppendInittab()`

- `PyImport_ExecCodeModule()`

- `PyImport_ExecCodeModuleEx()`

- `PyImport_ExecCodeModuleObject()`

- `PyImport_ExecCodeModuleWithPathnames()`

- `PyImport_GetImporter()`

- `PyImport_GetMagicNumber()`

- `PyImport_GetMagicTag()`

- `PyImport_GetModule()`

- `PyImport_GetModuleDict()`

- `PyImport_Import()`

- `PyImport_ImportFrozenModule()`

- `PyImport_ImportFrozenModuleObject()`

- `PyImport_ImportModule()`

- `PyImport_ImportModuleLevel()`

- `PyImport_ImportModuleLevelObject()`

- `PyImport_ReloadModule()`

- `PyIndex_Check()`

- `PyInterpreterGuard`

- `PyInterpreterGuard_Close()`

- `PyInterpreterGuard_FromCurrent()`

- `PyInterpreterGuard_FromView()`

- `PyInterpreterState`

- `PyInterpreterState_Clear()`

- `PyInterpreterState_Delete()`

- `PyInterpreterState_Get()`

- `PyInterpreterState_GetDict()`

- `PyInterpreterState_GetID()`

- `PyInterpreterState_New()`

- `PyInterpreterView`

- `PyInterpreterView_Close()`

- `PyInterpreterView_FromCurrent()`

- `PyInterpreterView_FromMain()`

- `PyIter_Check()`

- `PyIter_Next()`

- `PyIter_NextItem()`

- `PyIter_Send()`

- `PyListIter_Type`

- `PyListRevIter_Type`

- `PyList_Append()`

- `PyList_AsTuple()`

- `PyList_GetItem()`

- `PyList_GetItemRef()`

- `PyList_GetSlice()`

- `PyList_Insert()`

- `PyList_New()`

- `PyList_Reverse()`

- `PyList_SetItem()`

- `PyList_SetSlice()`

- `PyList_Size()`

- `PyList_Sort()`

- `PyList_Type`

- `PyLongExport`

- `PyLongLayout`

- `PyLongObject`

- `PyLongRangeIter_Type`

- `PyLongWriter`

- `PyLongWriter_Create()`

- `PyLongWriter_Discard()`

- `PyLongWriter_Finish()`

- `PyLong_AsDouble()`

- `PyLong_AsInt()`

- `PyLong_AsInt32()`

- `PyLong_AsInt64()`

- `PyLong_AsLong()`

- `PyLong_AsLongAndOverflow()`

- `PyLong_AsLongLong()`

- `PyLong_AsLongLongAndOverflow()`

- `PyLong_AsNativeBytes()`

- `PyLong_AsSize_t()`

- `PyLong_AsSsize_t()`

- `PyLong_AsUInt32()`

- `PyLong_AsUInt64()`

- `PyLong_AsUnsignedLong()`

- `PyLong_AsUnsignedLongLong()`

- `PyLong_AsUnsignedLongLongMask()`

- `PyLong_AsUnsignedLongMask()`

- `PyLong_AsVoidPtr()`

- `PyLong_Export()`

- `PyLong_FreeExport()`

- `PyLong_FromDouble()`

- `PyLong_FromInt32()`

- `PyLong_FromInt64()`

- `PyLong_FromLong()`

- `PyLong_FromLongLong()`

- `PyLong_FromNativeBytes()`

- `PyLong_FromSize_t()`

- `PyLong_FromSsize_t()`

- `PyLong_FromString()`

- `PyLong_FromUInt32()`

- `PyLong_FromUInt64()`

- `PyLong_FromUnsignedLong()`

- `PyLong_FromUnsignedLongLong()`

- `PyLong_FromUnsignedNativeBytes()`

- `PyLong_FromVoidPtr()`

- `PyLong_GetInfo()`

- `PyLong_GetNativeLayout()`

- `PyLong_Type`

- `PyMODEXPORT_FUNC`

- `PyMap_Type`

- `PyMapping_Check()`

- `PyMapping_GetItemString()`

- `PyMapping_GetOptionalItem()`

- `PyMapping_GetOptionalItemString()`

- `PyMapping_HasKey()`

- `PyMapping_HasKeyString()`

- `PyMapping_HasKeyStringWithError()`

- `PyMapping_HasKeyWithError()`

- `PyMapping_Items()`

- `PyMapping_Keys()`

- `PyMapping_Length()`

- `PyMapping_SetItemString()`

- `PyMapping_Size()`

- `PyMapping_Values()`

- `PyMem_Calloc()`

- `PyMem_Free()`

- `PyMem_Malloc()`

- `PyMem_RawCalloc()`

- `PyMem_RawFree()`

- `PyMem_RawMalloc()`

- `PyMem_RawRealloc()`

- `PyMem_Realloc()`

- `PyMemberDef`

- `PyMemberDescr_Type`

- `PyMember_GetOne()`

- `PyMember_SetOne()`

- `PyMemoryView_FromBuffer()`

- `PyMemoryView_FromMemory()`

- `PyMemoryView_FromObject()`

- `PyMemoryView_GetContiguous()`

- `PyMemoryView_Type`

- `PyMethodDef`

- `PyMethodDescr_Type`

- `PyModuleDef`

- `PyModuleDef_Base`

- `PyModuleDef_Init()`

- `PyModuleDef_Slot`

- `PyModuleDef_Type`

- `PyModule_Add()`

- `PyModule_AddFunctions()`

- `PyModule_AddIntConstant()`

- `PyModule_AddObject()`

- `PyModule_AddObjectRef()`

- `PyModule_AddStringConstant()`

- `PyModule_AddType()`

- `PyModule_Create2()`

- `PyModule_Exec()`

- `PyModule_ExecDef()`

- `PyModule_FromDefAndSpec2()`

- `PyModule_FromSlotsAndSpec()`

- `PyModule_GetDef()`

- `PyModule_GetDict()`

- `PyModule_GetFilename()`

- `PyModule_GetFilenameObject()`

- `PyModule_GetName()`

- `PyModule_GetNameObject()`

- `PyModule_GetState()`

- `PyModule_GetStateSize()`

- `PyModule_GetState_DuringGC()`

- `PyModule_GetToken()`

- `PyModule_GetToken_DuringGC()`

- `PyModule_New()`

- `PyModule_NewObject()`

- `PyModule_SetDocString()`

- `PyModule_Type`

- `PyNumber_Absolute()`

- `PyNumber_Add()`

- `PyNumber_And()`

- `PyNumber_AsSsize_t()`

- `PyNumber_Check()`

- `PyNumber_Divmod()`

- `PyNumber_Float()`

- `PyNumber_FloorDivide()`

- `PyNumber_InPlaceAdd()`

- `PyNumber_InPlaceAnd()`

- `PyNumber_InPlaceFloorDivide()`

- `PyNumber_InPlaceLshift()`

- `PyNumber_InPlaceMatrixMultiply()`

- `PyNumber_InPlaceMultiply()`

- `PyNumber_InPlaceOr()`

- `PyNumber_InPlacePower()`

- `PyNumber_InPlaceRemainder()`

- `PyNumber_InPlaceRshift()`

- `PyNumber_InPlaceSubtract()`

- `PyNumber_InPlaceTrueDivide()`

- `PyNumber_InPlaceXor()`

- `PyNumber_Index()`

- `PyNumber_Invert()`

- `PyNumber_Long()`

- `PyNumber_Lshift()`

- `PyNumber_MatrixMultiply()`

- `PyNumber_Multiply()`

- `PyNumber_Negative()`

- `PyNumber_Or()`

- `PyNumber_Positive()`

- `PyNumber_Power()`

- `PyNumber_Remainder()`

- `PyNumber_Rshift()`

- `PyNumber_Subtract()`

- `PyNumber_ToBase()`

- `PyNumber_TrueDivide()`

- `PyNumber_Xor()`

- `PyOS_AfterFork()`

- `PyOS_AfterFork_Child()`

- `PyOS_AfterFork_Parent()`

- `PyOS_BeforeFork()`

- `PyOS_CheckStack()`

- `PyOS_FSPath()`

- `PyOS_InputHook`

- `PyOS_InterruptOccurred()`

- `PyOS_double_to_string()`

- `PyOS_getsig()`

- `PyOS_mystricmp()`

- `PyOS_mystrnicmp()`

- `PyOS_setsig()`

- `PyOS_sighandler_t`

- `PyOS_snprintf()`

- `PyOS_string_to_double()`

- `PyOS_strtol()`

- `PyOS_strtoul()`

- `PyOS_vsnprintf()`

- `PyObject`

- `PyObject.ob_refcnt`

- `PyObject.ob_type`

- `PyObject_ASCII()`

- `PyObject_AsFileDescriptor()`

- `PyObject_Bytes()`

- `PyObject_Call()`

- `PyObject_CallFinalizerFromDealloc()`

- `PyObject_CallFunction()`

- `PyObject_CallFunctionObjArgs()`

- `PyObject_CallMethod()`

- `PyObject_CallMethodObjArgs()`

- `PyObject_CallNoArgs()`

- `PyObject_CallObject()`

- `PyObject_Calloc()`

- `PyObject_CheckBuffer()`

- `PyObject_ClearWeakRefs()`

- `PyObject_CopyData()`

- `PyObject_DelAttr()`

- `PyObject_DelAttrString()`

- `PyObject_DelItem()`

- `PyObject_DelItemString()`

- `PyObject_Dir()`

- `PyObject_Format()`

- `PyObject_Free()`

- `PyObject_GC_Del()`

- `PyObject_GC_IsFinalized()`

- `PyObject_GC_IsTracked()`

- `PyObject_GC_Track()`

- `PyObject_GC_UnTrack()`

- `PyObject_GenericGetAttr()`

- `PyObject_GenericGetDict()`

- `PyObject_GenericSetAttr()`

- `PyObject_GenericSetDict()`

- `PyObject_GetAIter()`

- `PyObject_GetAttr()`

- `PyObject_GetAttrString()`

- `PyObject_GetBuffer()`

- `PyObject_GetItem()`

- `PyObject_GetIter()`

- `PyObject_GetOptionalAttr()`

- `PyObject_GetOptionalAttrString()`

- `PyObject_GetTypeData()`

- `PyObject_GetTypeData_DuringGC()`

- `PyObject_HasAttr()`

- `PyObject_HasAttrString()`

- `PyObject_HasAttrStringWithError()`

- `PyObject_HasAttrWithError()`

- `PyObject_Hash()`

- `PyObject_HashNotImplemented()`

- `PyObject_Init()`

- `PyObject_InitVar()`

- `PyObject_IsInstance()`

- `PyObject_IsSubclass()`

- `PyObject_IsTrue()`

- `PyObject_Length()`

- `PyObject_Malloc()`

- `PyObject_Not()`

- `PyObject_Realloc()`

- `PyObject_Repr()`

- `PyObject_RichCompare()`

- `PyObject_RichCompareBool()`

- `PyObject_SelfIter()`

- `PyObject_SetAttr()`

- `PyObject_SetAttrString()`

- `PyObject_SetItem()`

- `PyObject_Size()`

- `PyObject_Str()`

- `PyObject_Type()`

- `PyObject_Vectorcall()`

- `PyObject_VectorcallMethod()`

- `PyProperty_Type`

- `PyRangeIter_Type`

- `PyRange_Type`

- `PyReversed_Type`

- `PySeqIter_New()`

- `PySeqIter_Type`

- `PySequence_Check()`

- `PySequence_Concat()`

- `PySequence_Contains()`

- `PySequence_Count()`

- `PySequence_DelItem()`

- `PySequence_DelSlice()`

- `PySequence_Fast()`

- `PySequence_GetItem()`

- `PySequence_GetSlice()`

- `PySequence_In()`

- `PySequence_InPlaceConcat()`

- `PySequence_InPlaceRepeat()`

- `PySequence_Index()`

- `PySequence_Length()`

- `PySequence_List()`

- `PySequence_Repeat()`

- `PySequence_SetItem()`

- `PySequence_SetSlice()`

- `PySequence_Size()`

- `PySequence_Tuple()`

- `PySetIter_Type`

- `PySet_Add()`

- `PySet_Clear()`

- `PySet_Contains()`

- `PySet_Discard()`

- `PySet_New()`

- `PySet_Pop()`

- `PySet_Size()`

- `PySet_Type`

- `PySlice_AdjustIndices()`

- `PySlice_GetIndices()`

- `PySlice_GetIndicesEx()`

- `PySlice_New()`

- `PySlice_Type`

- `PySlice_Unpack()`

- `PySlot`

- `PySlot_DATA`

- `PySlot_END`

- `PySlot_FUNC`

- `PySlot_INT64`

- `PySlot_INTPTR`

- `PySlot_OPTIONAL`

- `PySlot_PTR`

- `PySlot_PTR_STATIC`

- `PySlot_SIZE`

- `PySlot_STATIC`

- `PySlot_STATIC_DATA`

- `PySlot_UINT64`

- `PyState_AddModule()`

- `PyState_FindModule()`

- `PyState_RemoveModule()`

- `PyStructSequence_Desc`

- `PyStructSequence_Field`

- `PyStructSequence_GetItem()`

- `PyStructSequence_New()`

- `PyStructSequence_NewType()`

- `PyStructSequence_SetItem()`

- `PyStructSequence_UnnamedField`

- `PySuper_Type`

- `PySys_Audit()`

- `PySys_AuditTuple()`

- `PySys_FormatStderr()`

- `PySys_FormatStdout()`

- `PySys_GetAttr()`

- `PySys_GetAttrString()`

- `PySys_GetObject()`

- `PySys_GetOptionalAttr()`

- `PySys_GetOptionalAttrString()`

- `PySys_GetXOptions()`

- `PySys_SetArgv()`

- `PySys_SetArgvEx()`

- `PySys_SetObject()`

- `PySys_WriteStderr()`

- `PySys_WriteStdout()`

- `PyThreadState`

- `PyThreadStateToken`

- `PyThreadState_Clear()`

- `PyThreadState_Delete()`

- `PyThreadState_Ensure()`

- `PyThreadState_EnsureFromView()`

- `PyThreadState_Get()`

- `PyThreadState_GetDict()`

- `PyThreadState_GetFrame()`

- `PyThreadState_GetID()`

- `PyThreadState_GetInterpreter()`

- `PyThreadState_New()`

- `PyThreadState_Release()`

- `PyThreadState_SetAsyncExc()`

- `PyThreadState_Swap()`

- `PyThread_GetInfo()`

- `PyThread_ReInitTLS()`

- `PyThread_acquire_lock()`

- `PyThread_acquire_lock_timed()`

- `PyThread_allocate_lock()`

- `PyThread_create_key()`

- `PyThread_delete_key()`

- `PyThread_delete_key_value()`

- `PyThread_exit_thread()`

- `PyThread_free_lock()`

- `PyThread_get_key_value()`

- `PyThread_get_stacksize()`

- `PyThread_get_thread_ident()`

- `PyThread_get_thread_native_id()`

- `PyThread_init_thread()`

- `PyThread_release_lock()`

- `PyThread_set_key_value()`

- `PyThread_set_stacksize()`

- `PyThread_start_new_thread()`

- `PyThread_tss_alloc()`

- `PyThread_tss_create()`

- `PyThread_tss_delete()`

- `PyThread_tss_free()`

- `PyThread_tss_get()`

- `PyThread_tss_is_created()`

- `PyThread_tss_set()`

- `PyTraceBack_Here()`

- `PyTraceBack_Print()`

- `PyTraceBack_Type`

- `PyTupleIter_Type`

- `PyTuple_GetItem()`

- `PyTuple_GetSlice()`

- `PyTuple_New()`

- `PyTuple_Pack()`

- `PyTuple_SetItem()`

- `PyTuple_Size()`

- `PyTuple_Type`

- `PyTypeObject`

- `PyType_ClearCache()`

- `PyType_Freeze()`

- `PyType_FromMetaclass()`

- `PyType_FromModuleAndSpec()`

- `PyType_FromSlots()`

- `PyType_FromSpec()`

- `PyType_FromSpecWithBases()`

- `PyType_GenericAlloc()`

- `PyType_GenericNew()`

- `PyType_GetBaseByToken()`

- `PyType_GetBaseByToken_DuringGC()`

- `PyType_GetFlags()`

- `PyType_GetFullyQualifiedName()`

- `PyType_GetModule()`

- `PyType_GetModuleByDef()`

- `PyType_GetModuleByToken()`

- `PyType_GetModuleByToken_DuringGC()`

- `PyType_GetModuleName()`

- `PyType_GetModuleState()`

- `PyType_GetModuleState_DuringGC()`

- `PyType_GetModule_DuringGC()`

- `PyType_GetName()`

- `PyType_GetQualName()`

- `PyType_GetSlot()`

- `PyType_GetTypeDataSize()`

- `PyType_IsSubtype()`

- `PyType_Modified()`

- `PyType_Ready()`

- `PyType_Slot`

- `PyType_Spec`

- `PyType_Type`

- `PyUnicodeDecodeError_Create()`

- `PyUnicodeDecodeError_GetEncoding()`

- `PyUnicodeDecodeError_GetEnd()`

- `PyUnicodeDecodeError_GetObject()`

- `PyUnicodeDecodeError_GetReason()`

- `PyUnicodeDecodeError_GetStart()`

- `PyUnicodeDecodeError_SetEnd()`

- `PyUnicodeDecodeError_SetReason()`

- `PyUnicodeDecodeError_SetStart()`

- `PyUnicodeEncodeError_GetEncoding()`

- `PyUnicodeEncodeError_GetEnd()`

- `PyUnicodeEncodeError_GetObject()`

- `PyUnicodeEncodeError_GetReason()`

- `PyUnicodeEncodeError_GetStart()`

- `PyUnicodeEncodeError_SetEnd()`

- `PyUnicodeEncodeError_SetReason()`

- `PyUnicodeEncodeError_SetStart()`

- `PyUnicodeIter_Type`

- `PyUnicodeTranslateError_GetEnd()`

- `PyUnicodeTranslateError_GetObject()`

- `PyUnicodeTranslateError_GetReason()`

- `PyUnicodeTranslateError_GetStart()`

- `PyUnicodeTranslateError_SetEnd()`

- `PyUnicodeTranslateError_SetReason()`

- `PyUnicodeTranslateError_SetStart()`

- `PyUnicode_Append()`

- `PyUnicode_AppendAndDel()`

- `PyUnicode_AsASCIIString()`

- `PyUnicode_AsCharmapString()`

- `PyUnicode_AsEncodedString()`

- `PyUnicode_AsLatin1String()`

- `PyUnicode_AsMBCSString()`

- `PyUnicode_AsRawUnicodeEscapeString()`

- `PyUnicode_AsUCS4()`

- `PyUnicode_AsUCS4Copy()`

- `PyUnicode_AsUTF16String()`

- `PyUnicode_AsUTF32String()`

- `PyUnicode_AsUTF8AndSize()`

- `PyUnicode_AsUTF8String()`

- `PyUnicode_AsUnicodeEscapeString()`

- `PyUnicode_AsWideChar()`

- `PyUnicode_AsWideCharString()`

- `PyUnicode_BuildEncodingMap()`

- `PyUnicode_Compare()`

- `PyUnicode_CompareWithASCIIString()`

- `PyUnicode_Concat()`

- `PyUnicode_Contains()`

- `PyUnicode_Count()`

- `PyUnicode_Decode()`

- `PyUnicode_DecodeASCII()`

- `PyUnicode_DecodeCharmap()`

- `PyUnicode_DecodeCodePageStateful()`

- `PyUnicode_DecodeFSDefault()`

- `PyUnicode_DecodeFSDefaultAndSize()`

- `PyUnicode_DecodeLatin1()`

- `PyUnicode_DecodeLocale()`

- `PyUnicode_DecodeLocaleAndSize()`

- `PyUnicode_DecodeMBCS()`

- `PyUnicode_DecodeMBCSStateful()`

- `PyUnicode_DecodeRawUnicodeEscape()`

- `PyUnicode_DecodeUTF16()`

- `PyUnicode_DecodeUTF16Stateful()`

- `PyUnicode_DecodeUTF32()`

- `PyUnicode_DecodeUTF32Stateful()`

- `PyUnicode_DecodeUTF7()`

- `PyUnicode_DecodeUTF7Stateful()`

- `PyUnicode_DecodeUTF8()`

- `PyUnicode_DecodeUTF8Stateful()`

- `PyUnicode_DecodeUnicodeEscape()`

- `PyUnicode_EncodeCodePage()`

- `PyUnicode_EncodeFSDefault()`

- `PyUnicode_EncodeLocale()`

- `PyUnicode_Equal()`

- `PyUnicode_EqualToUTF8()`

- `PyUnicode_EqualToUTF8AndSize()`

- `PyUnicode_FSConverter()`

- `PyUnicode_FSDecoder()`

- `PyUnicode_Find()`

- `PyUnicode_FindChar()`

- `PyUnicode_Format()`

- `PyUnicode_FromEncodedObject()`

- `PyUnicode_FromFormat()`

- `PyUnicode_FromFormatV()`

- `PyUnicode_FromObject()`

- `PyUnicode_FromOrdinal()`

- `PyUnicode_FromString()`

- `PyUnicode_FromStringAndSize()`

- `PyUnicode_FromWideChar()`

- `PyUnicode_GetDefaultEncoding()`

- `PyUnicode_GetLength()`

- `PyUnicode_InternFromString()`

- `PyUnicode_InternInPlace()`

- `PyUnicode_IsIdentifier()`

- `PyUnicode_Join()`

- `PyUnicode_Partition()`

- `PyUnicode_RPartition()`

- `PyUnicode_RSplit()`

- `PyUnicode_ReadChar()`

- `PyUnicode_Replace()`

- `PyUnicode_Resize()`

- `PyUnicode_RichCompare()`

- `PyUnicode_Split()`

- `PyUnicode_Splitlines()`

- `PyUnicode_Substring()`

- `PyUnicode_Tailmatch()`

- `PyUnicode_Translate()`

- `PyUnicode_Type`

- `PyUnicode_WriteChar()`

- `PyVarObject`

- `PyVarObject.ob_base`

- `PyVarObject.ob_size`

- `PyVectorcall_Call()`

- `PyVectorcall_NARGS()`

- `PyWeakReference`

- `PyWeakref_GetRef()`

- `PyWeakref_NewProxy()`

- `PyWeakref_NewRef()`

- `PyWrapperDescr_Type`

- `PyWrapper_New()`

- `PyZip_Type`

- `Py_ASNATIVEBYTES_ALLOW_INDEX`

- `Py_ASNATIVEBYTES_BIG_ENDIAN`

- `Py_ASNATIVEBYTES_DEFAULTS`

- `Py_ASNATIVEBYTES_LITTLE_ENDIAN`

- `Py_ASNATIVEBYTES_NATIVE_ENDIAN`

- `Py_ASNATIVEBYTES_REJECT_NEGATIVE`

- `Py_ASNATIVEBYTES_UNSIGNED_BUFFER`

- `Py_AUDIT_READ`

- `Py_AddPendingCall()`

- `Py_AtExit()`

- `Py_BEGIN_ALLOW_THREADS`

- `Py_BEGIN_CRITICAL_SECTION`

- `Py_BEGIN_CRITICAL_SECTION2`

- `Py_BLOCK_THREADS`

- `Py_BuildValue()`

- `Py_BytesMain()`

- `Py_CLEAR`

- `Py_CompileString()`

- `Py_DECREF`

- `Py_DecRef()`

- `Py_DecodeLocale()`

- `Py_END_ALLOW_THREADS`

- `Py_END_CRITICAL_SECTION`

- `Py_END_CRITICAL_SECTION2`

- `Py_EncodeLocale()`

- `Py_EndInterpreter()`

- `Py_EnterRecursiveCall()`

- `Py_Exit()`

- `Py_FatalError()`

- `Py_FileSystemDefaultEncodeErrors`

- `Py_FileSystemDefaultEncoding`

- `Py_Finalize()`

- `Py_FinalizeEx()`

- `Py_GenericAlias()`

- `Py_GenericAliasType`

- `Py_GetBuildInfo()`

- `Py_GetCompiler()`

- `Py_GetConstant()`

- `Py_GetConstantBorrowed()`

- `Py_GetCopyright()`

- `Py_GetPlatform()`

- `Py_GetRecursionLimit()`

- `Py_GetVersion()`

- `Py_HasFileSystemDefaultEncoding`

- `Py_INCREF`

- `Py_IS_TYPE()`

- `Py_IncRef()`

- `Py_Initialize()`

- `Py_InitializeEx()`

- `Py_Is()`

- `Py_IsFalse()`

- `Py_IsFinalizing()`

- `Py_IsInitialized()`

- `Py_IsNone()`

- `Py_IsTrue()`

- `Py_LeaveRecursiveCall()`

- `Py_Main()`

- `Py_MakePendingCalls()`

- `Py_NewInterpreter()`

- `Py_NewRef()`

- `Py_PACK_FULL_VERSION()`

- `Py_PACK_VERSION()`

- `Py_READONLY`

- `Py_REFCNT()`

- `Py_RELATIVE_OFFSET`

- `Py_ReprEnter()`

- `Py_ReprLeave()`

- `Py_SET_REFCNT`

- `Py_SET_SIZE()`

- `Py_SET_TYPE`

- `Py_SIZE()`

- `Py_SetProgramName()`

- `Py_SetPythonHome()`

- `Py_SetRecursionLimit()`

- `Py_TPFLAGS_BASETYPE`

- `Py_TPFLAGS_DEFAULT`

- `Py_TPFLAGS_HAVE_GC`

- `Py_TPFLAGS_HAVE_VECTORCALL`

- `Py_TPFLAGS_ITEMS_AT_END`

- `Py_TPFLAGS_METHOD_DESCRIPTOR`

- `Py_TP_USE_SPEC`

- `Py_TYPE()`

- `Py_T_BOOL`

- `Py_T_BYTE`

- `Py_T_CHAR`

- `Py_T_DOUBLE`

- `Py_T_FLOAT`

- `Py_T_INT`

- `Py_T_LONG`

- `Py_T_LONGLONG`

- `Py_T_OBJECT_EX`

- `Py_T_PYSSIZET`

- `Py_T_SHORT`

- `Py_T_STRING`

- `Py_T_STRING_INPLACE`

- `Py_T_UBYTE`

- `Py_T_UINT`

- `Py_T_ULONG`

- `Py_T_ULONGLONG`

- `Py_T_USHORT`

- `Py_UCS4`

- `Py_UNBLOCK_THREADS`

- `Py_UTF8Mode`

- `Py_VaBuildValue()`

- `Py_Version`

- `Py_XDECREF`

- `Py_XINCREF`

- `Py_XNewRef()`

- `Py_am_aiter`

- `Py_am_anext`

- `Py_am_await`

- `Py_am_send`

- `Py_bf_getbuffer`

- `Py_bf_releasebuffer`

- `Py_buffer`

- `Py_intptr_t`

- `Py_mod_abi`

- `Py_mod_create`

- `Py_mod_doc`

- `Py_mod_exec`

- `Py_mod_gil`

- `Py_mod_methods`

- `Py_mod_multiple_interpreters`

- `Py_mod_name`

- `Py_mod_slots`

- `Py_mod_state_clear`

- `Py_mod_state_free`

- `Py_mod_state_size`

- `Py_mod_state_traverse`

- `Py_mod_token`

- `Py_mp_ass_subscript`

- `Py_mp_length`

- `Py_mp_subscript`

- `Py_nb_absolute`

- `Py_nb_add`

- `Py_nb_and`

- `Py_nb_bool`

- `Py_nb_divmod`

- `Py_nb_float`

- `Py_nb_floor_divide`

- `Py_nb_index`

- `Py_nb_inplace_add`

- `Py_nb_inplace_and`

- `Py_nb_inplace_floor_divide`

- `Py_nb_inplace_lshift`

- `Py_nb_inplace_matrix_multiply`

- `Py_nb_inplace_multiply`

- `Py_nb_inplace_or`

- `Py_nb_inplace_power`

- `Py_nb_inplace_remainder`

- `Py_nb_inplace_rshift`

- `Py_nb_inplace_subtract`

- `Py_nb_inplace_true_divide`

- `Py_nb_inplace_xor`

- `Py_nb_int`

- `Py_nb_invert`

- `Py_nb_lshift`

- `Py_nb_matrix_multiply`

- `Py_nb_multiply`

- `Py_nb_negative`

- `Py_nb_or`

- `Py_nb_positive`

- `Py_nb_power`

- `Py_nb_remainder`

- `Py_nb_rshift`

- `Py_nb_subtract`

- `Py_nb_true_divide`

- `Py_nb_xor`

- `Py_slot_end`

- `Py_slot_invalid`

- `Py_slot_subslots`

- `Py_sq_ass_item`

- `Py_sq_concat`

- `Py_sq_contains`

- `Py_sq_inplace_concat`

- `Py_sq_inplace_repeat`

- `Py_sq_item`

- `Py_sq_length`

- `Py_sq_repeat`

- `Py_ssize_t`

- `Py_tp_alloc`

- `Py_tp_base`

- `Py_tp_bases`

- `Py_tp_basicsize`

- `Py_tp_call`

- `Py_tp_clear`

- `Py_tp_dealloc`

- `Py_tp_del`

- `Py_tp_descr_get`

- `Py_tp_descr_set`

- `Py_tp_doc`

- `Py_tp_extra_basicsize`

- `Py_tp_finalize`

- `Py_tp_flags`

- `Py_tp_free`

- `Py_tp_getattr`

- `Py_tp_getattro`

- `Py_tp_getset`

- `Py_tp_hash`

- `Py_tp_init`

- `Py_tp_is_gc`

- `Py_tp_itemsize`

- `Py_tp_iter`

- `Py_tp_iternext`

- `Py_tp_members`

- `Py_tp_metaclass`

- `Py_tp_methods`

- `Py_tp_module`

- `Py_tp_name`

- `Py_tp_new`

- `Py_tp_repr`

- `Py_tp_richcompare`

- `Py_tp_setattr`

- `Py_tp_setattro`

- `Py_tp_slots`

- `Py_tp_str`

- `Py_tp_token`

- `Py_tp_traverse`

- `Py_tp_vectorcall`

- `Py_uintptr_t`

- `allocfunc`

- `binaryfunc`

- `descrgetfunc`

- `descrsetfunc`

- `destructor`

- `getattrfunc`

- `getattrofunc`

- `getbufferproc`

- `getiterfunc`

- `getter`

- `hashfunc`

- `initproc`

- `inquiry`

- `iternextfunc`

- `lenfunc`

- `newfunc`

- `objobjargproc`

- `objobjproc`

- `releasebufferproc`

- `reprfunc`

- `richcmpfunc`

- `setattrfunc`

- `setattrofunc`

- `setter`

- `ssizeargfunc`

- `ssizeobjargproc`

- `ssizessizeargfunc`

- `ssizessizeobjargproc`

- `symtable`

- `ternaryfunc`

- `traverseproc`

- `unaryfunc`

- `vectorcallfunc`

- `visitproc`
