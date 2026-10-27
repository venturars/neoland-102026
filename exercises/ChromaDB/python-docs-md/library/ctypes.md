---
page: library/ctypes.html
title: ctypes — A foreign function library for Python
area: library
kind: guide
module: ctypes
---

<!-- anchor: module-ctypes | type: section -->
# `ctypes` — A foreign function library for Python

**Source code:** Lib/ctypes

`ctypes` is a foreign function library for Python. It provides C compatible data types, and allows calling functions in DLLs or shared libraries. It can be used to wrap these libraries in pure Python.

This is an optional module. If it is missing from your copy of CPython, look for documentation from your distributor (that is, whoever provided Python to you). If you are the distributor, see Requirements for optional modules.

**Warning:**

`ctypes` provides low-level access to native libraries and the process’s memory, bypassing Python’s safety mechanisms and allowing execution of arbitrary native code. Incorrect use can corrupt data and objects, reveal sensitive information, cause crashes, or otherwise compromise the running process.

<!-- anchor: ctypes-tutorial | type: section -->
## ctypes tutorial

Note: Some code samples reference the ctypes `c_int` type. On platforms where `sizeof(long) == sizeof(int)` it is an alias to `c_long`. So, you should not be confused if `c_long` is printed if you would expect `c_int` — they are actually the same type.

<!-- anchor: loading-dynamic-link-libraries | type: section -->
### Loading dynamic link libraries

`ctypes` exports the `cdll`, and on Windows `windll` and `oledll` objects, for loading dynamic link libraries.

You load libraries by accessing them as attributes of these objects. `cdll` loads libraries which export functions using the standard `cdecl` calling convention, while `windll` libraries call functions using the `stdcall` calling convention. `oledll` also uses the `stdcall` calling convention, and assumes the functions return a Windows `HRESULT` error code. The error code is used to automatically raise an `OSError` exception when the function call fails.

Changed in version 3.3: Windows errors used to raise `WindowsError`, which is now an alias of `OSError`.

Here are some examples for Windows. Note that `msvcrt` is the MS standard C library containing most standard C functions, and uses the `cdecl` calling convention:

```python
>>> from ctypes import *
>>> print(windll.kernel32)
<WinDLL 'kernel32', handle ... at ...>
>>> print(cdll.msvcrt)
<CDLL 'msvcrt', handle ... at ...>
>>> libc = cdll.msvcrt
>>>
```

Windows appends the usual `.dll` file suffix automatically.

**Note:**

Accessing the standard C library through `cdll.msvcrt` will use an outdated version of the library that may be incompatible with the one being used by Python. Where possible, use native Python functionality, or else import and use the `msvcrt` module.

Other systems require the filename *including* the extension to load a library, so attribute access can not be used to load libraries. Either the `LoadLibrary()` method of the dll loaders should be used, or you should load the library by creating an instance of `CDLL` by calling the constructor.

For example, on Linux:

```python
>>> cdll.LoadLibrary("libc.so.6")
<CDLL 'libc.so.6', handle ... at ...>
>>> libc = CDLL("libc.so.6")
>>> libc
<CDLL 'libc.so.6', handle ... at ...>
>>>
```

On macOS:

```python
>>> cdll.LoadLibrary("libc.dylib")
<CDLL 'libc.dylib', handle ... at ...>
>>> libc = CDLL("libc.dylib")
>>> libc
<CDLL 'libc.dylib', handle ... at ...>
```

<!-- anchor: accessing-functions-from-loaded-dlls | type: section -->
### Accessing functions from loaded dlls

Functions are accessed as attributes of dll objects:

```python
>>> libc.printf
<_FuncPtr object at 0x...>
>>> print(windll.kernel32.GetModuleHandleA)
<_FuncPtr object at 0x...>
>>> print(windll.kernel32.MyOwnFunction)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "ctypes.py", line 239, in __getattr__
    func = _StdcallFuncPtr(name, self)
AttributeError: function 'MyOwnFunction' not found
>>>
```

Note that win32 system dlls like `kernel32` and `user32` often export ANSI as well as UNICODE versions of a function. The UNICODE version is exported with a `W` appended to the name, while the ANSI version is exported with an `A` appended to the name. The win32 `GetModuleHandle` function, which returns a *module handle* for a given module name, has the following C prototype, and a macro is used to expose one of them as `GetModuleHandle` depending on whether UNICODE is defined or not:

```python
/* ANSI version */
HMODULE GetModuleHandleA(LPCSTR lpModuleName);
/* UNICODE version */
HMODULE GetModuleHandleW(LPCWSTR lpModuleName);
```

*windll* does not try to select one of them by magic, you must access the version you need by specifying `GetModuleHandleA` or `GetModuleHandleW` explicitly, and then call it with bytes or string objects respectively.

Sometimes, dlls export functions with names which aren’t valid Python identifiers, like `"??2@YAPAXI@Z"`. In this case you have to use `getattr()` to retrieve the function:

```python
>>> getattr(cdll.msvcrt, "??2@YAPAXI@Z")
<_FuncPtr object at 0x...>
>>>
```

On Windows, some dlls export functions not by name but by ordinal. These functions can be accessed by indexing the dll object with the ordinal number:

```python
>>> cdll.kernel32[1]
<_FuncPtr object at 0x...>
>>> cdll.kernel32[0]
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "ctypes.py", line 310, in __getitem__
    func = _StdcallFuncPtr(name, self)
AttributeError: function ordinal 0 not found
>>>
```

<!-- anchor: calling-functions | type: section -->
### Calling functions

You can call these functions like any other Python callable. This example uses the `rand()` function, which takes no arguments and returns a pseudo-random integer:

```python
>>> print(libc.rand())
1804289383
```

On Windows, you can call the `GetModuleHandleA()` function, which returns a win32 module handle (passing `None` as single argument to call it with a `NULL` pointer):

```python
>>> print(hex(windll.kernel32.GetModuleHandleA(None)))
0x1d000000
>>>
```

`ValueError` is raised when you call an `stdcall` function with the `cdecl` calling convention, or vice versa:

```python
>>> cdll.kernel32.GetModuleHandleA(None)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ValueError: Procedure probably called with not enough arguments (4 bytes missing)
>>>

>>> windll.msvcrt.printf(b"spam")
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ValueError: Procedure probably called with too many arguments (4 bytes in excess)
>>>
```

To find out the correct calling convention you have to look into the C header file or the documentation for the function you want to call.

On Windows, `ctypes` uses win32 structured exception handling to prevent crashes from general protection faults when functions are called with invalid argument values:

```python
>>> windll.kernel32.GetModuleHandleA(32)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
OSError: exception: access violation reading 0x00000020
>>>
```

The `faulthandler` module can help debug crashes, such as segmentation faults produced by erroneous C library calls.

`None`, integers, bytes objects and (unicode) strings are the only native Python objects that can directly be used as parameters in these function calls. `None` is passed as a C `NULL` pointer, bytes objects and strings are passed as pointer to the memory block that contains their data (char* or wchar_t*). Python integers are passed as the platform’s default C int type, their value is masked to fit into the C type.

Before we move on calling functions with other parameter types, we have to learn more about `ctypes` data types.

<!-- anchor: fundamental-data-types | type: section -->
### Fundamental data types

`ctypes` defines a number of primitive C compatible data types:

| ctypes type | C type | Python type | `_type_` |
| --- | --- | --- | --- |
| `c_bool` | _Bool | `bool` | `'?'` |
| `c_char` | char | 1-character `bytes` | `'c'` |
| `c_wchar` | `wchar_t` | 1-character `str` | `'u'` |
| `c_byte` | char | `int` | `'b'` |
| `c_ubyte` | unsigned char | `int` | `'B'` |
| `c_short` | short | `int` | `'h'` |
| `c_ushort` | unsigned short | `int` | `'H'` |
| `c_int` | int | `int` | `'i'` * |
| `c_int8` | `int8_t` | `int` | * |
| `c_int16` | `int16_t` | `int` | * |
| `c_int32` | `int32_t` | `int` | * |
| `c_int64` | `int64_t` | `int` | * |
| `c_uint` | unsigned int | `int` | `'I'` * |
| `c_uint8` | `uint8_t` | `int` | * |
| `c_uint16` | `uint16_t` | `int` | * |
| `c_uint32` | `uint32_t` | `int` | * |
| `c_uint64` | `uint64_t` | `int` | * |
| `c_long` | long | `int` | `'l'` |
| `c_ulong` | unsigned long | `int` | `'L'` |
| `c_longlong` | long long | `int` | `'q'` * |
| `c_ulonglong` | unsigned long long | `int` | `'Q'` * |
| `c_size_t` | `size_t` | `int` | * |
| `c_ssize_t` | `Py_ssize_t` | `int` | * |
| `c_time_t` | `time_t` | `int` | * |
| `c_float` | float | `float` | `'f'` |
| `c_double` | double | `float` | `'d'` |
| `c_longdouble` | long double | `float` | `'g'` * |
| `c_char_p` | char* (NUL terminated) | `bytes` or `None` | `'z'` |
| `c_wchar_p` | wchar_t* (NUL terminated) | `str` or `None` | `'Z'` |
| `c_void_p` | void* | `int` or `None` | `'P'` |
| `py_object` | PyObject* | `object` | `'O'` |
| VARIANT_BOOL | short int | `bool` | `'v'` |

Additionally, if IEC 60559 compatible complex arithmetic (Annex G) is supported in both C and `libffi`, the following complex types are available:

| ctypes type | C type | Python type | `_type_` |
| --- | --- | --- | --- |
| `c_float_complex` | float complex | `complex` | `'Zf'` |
| `c_double_complex` | double complex | `complex` | `'Zd'` |
| `c_longdouble_complex` | long double complex | `complex` | `'Zg'` |

Changed in version 3.15: The `_type_` types `F`, `D` and `G` have been replaced with `Zf`, `Zd` and `Zg`.

All these types can be created by calling them with an optional initializer of the correct type and value:

```python
>>> c_int()
c_long(0)
>>> c_wchar_p("Hello, World")
c_wchar_p(140018365411392)
>>> c_ushort(-3)
c_ushort(65533)
>>>
```

The constructors for numeric types will convert input using `__bool__()`, `__index__()` (for `int`), `__float__()` or `__complex__()`. This means `c_bool` accepts any object with a truth value:

```python
>>> empty_list = []
>>> c_bool(empty_list)
c_bool(False)
```

Since these types are mutable, their value can also be changed afterwards:

```python
>>> i = c_int(42)
>>> print(i)
c_long(42)
>>> print(i.value)
42
>>> i.value = -99
>>> print(i.value)
-99
>>>
```

Assigning a new value to instances of the pointer types `c_char_p`, `c_wchar_p`, and `c_void_p` changes the *memory location* they point to, *not the contents* of the memory block (of course not, because Python string objects are immutable):

```python
>>> s = "Hello, World"
>>> c_s = c_wchar_p(s)
>>> print(c_s)
c_wchar_p(139966785747344)
>>> print(c_s.value)
Hello World
>>> c_s.value = "Hi, there"
>>> print(c_s)              # the memory location has changed
c_wchar_p(139966783348904)
>>> print(c_s.value)
Hi, there
>>> print(s)                # first object is unchanged
Hello, World
>>>
```

You should be careful, however, not to pass them to functions expecting pointers to mutable memory. If you need mutable memory blocks, ctypes has a `create_string_buffer()` function which creates these in various ways. The current memory block contents can be accessed (or changed) with the `raw` property; if you want to access it as NUL terminated string, use the `value` property:

```python
>>> from ctypes import *
>>> p = create_string_buffer(3)            # create a 3 byte buffer, initialized to NUL bytes
>>> print(sizeof(p), repr(p.raw))
3 b'\x00\x00\x00'
>>> p = create_string_buffer(b"Hello")     # create a buffer containing a NUL terminated string
>>> print(sizeof(p), repr(p.raw))
6 b'Hello\x00'
>>> print(repr(p.value))
b'Hello'
>>> p = create_string_buffer(b"Hello", 10) # create a 10 byte buffer
>>> print(sizeof(p), repr(p.raw))
10 b'Hello\x00\x00\x00\x00\x00'
>>> p.value = b"Hi"
>>> print(sizeof(p), repr(p.raw))
10 b'Hi\x00lo\x00\x00\x00\x00\x00'
>>>
```

The `create_string_buffer()` function replaces the old `c_buffer()` function (which is still available as an alias). To create a mutable memory block containing unicode characters of the C type `wchar_t`, use the `create_unicode_buffer()` function.

<!-- anchor: calling-functions-continued | type: section -->
### Calling functions, continued

Note that printf prints to the real standard output channel, *not* to `sys.stdout`, so these examples will only work at the console prompt, not from within *IDLE* or *PythonWin*:

```python
>>> printf = libc.printf
>>> printf(b"Hello, %s\n", b"World!")
Hello, World!
14
>>> printf(b"Hello, %S\n", "World!")
Hello, World!
14
>>> printf(b"%d bottles of beer\n", 42)
42 bottles of beer
19
>>> printf(b"%f bottles of beer\n", 42.5)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ctypes.ArgumentError: argument 2: TypeError: Don't know how to convert parameter 2
>>>
```

As has been mentioned before, all Python types except integers, strings, and bytes objects have to be wrapped in their corresponding `ctypes` type, so that they can be converted to the required C data type:

```python
>>> printf(b"An int %d, a double %f\n", 1234, c_double(3.14))
An int 1234, a double 3.140000
31
>>>
```

<!-- anchor: calling-variadic-functions | type: section -->
### Calling variadic functions

On a lot of platforms calling variadic functions through ctypes is exactly the same as calling functions with a fixed number of parameters. On some platforms, and in particular ARM64 for Apple Platforms, the calling convention for variadic functions is different than that for regular functions.

On those platforms it is required to specify the `argtypes` attribute for the regular, non-variadic, function arguments:

```python
libc.printf.argtypes = [ctypes.c_char_p]
```

Because specifying the attribute does not inhibit portability it is advised to always specify `argtypes` for all variadic functions.

<!-- anchor: calling-functions-with-your-own-custom-data-types | type: section -->
### Calling functions with your own custom data types

You can also customize `ctypes` argument conversion to allow instances of your own classes be used as function arguments. `ctypes` looks for an `_as_parameter_` attribute and uses this as the function argument. The attribute must be an integer, string, bytes, a `ctypes` instance, or an object with an `_as_parameter_` attribute:

```python
>>> class Bottles:
...     def __init__(self, number):
...         self._as_parameter_ = number
...
>>> bottles = Bottles(42)
>>> printf(b"%d bottles of beer\n", bottles)
42 bottles of beer
19
>>>
```

If you don’t want to store the instance’s data in the `_as_parameter_` instance variable, you could define a `@property` which makes the attribute available on request.

<!-- anchor: specifying-the-required-argument-types-function-prototypes | type: section -->
### Specifying the required argument types (function prototypes)

It is possible to specify the required argument types of functions exported from DLLs by setting the `argtypes` attribute.

`argtypes` must be a sequence of C data types (the `printf()` function is probably not a good example here, because it takes a variable number and different types of parameters depending on the format string, on the other hand this is quite handy to experiment with this feature):

```python
>>> printf.argtypes = [c_char_p, c_char_p, c_int, c_double]
>>> printf(b"String '%s', Int %d, Double %f\n", b"Hi", 10, 2.2)
String 'Hi', Int 10, Double 2.200000
37
>>>
```

Specifying a format protects against incompatible argument types (just as a prototype for a C function), and tries to convert the arguments to valid types:

```python
>>> printf(b"%d %d %d", 1, 2, 3)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ctypes.ArgumentError: argument 2: TypeError: 'int' object cannot be interpreted as ctypes.c_char_p
>>> printf(b"%s %d %f\n", b"X", 2, 3)
X 2 3.000000
13
>>>
```

If you have defined your own classes which you pass to function calls, you have to implement a `from_param()` class method for them to be able to use them in the `argtypes` sequence. The `from_param()` class method receives the Python object passed to the function call, it should do a typecheck or whatever is needed to make sure this object is acceptable, and then return the object itself, its `_as_parameter_` attribute, or whatever you want to pass as the C function argument in this case. Again, the result should be an integer, string, bytes, a `ctypes` instance, or an object with an `_as_parameter_` attribute.

<!-- anchor: return-types | type: section -->
### Return types

By default functions are assumed to return the C int type. Other return types can be specified by setting the `restype` attribute of the function object.

The C prototype of `time()` is `time_t time(time_t *)`. Because `time_t` might be of a different type than the default return type int, you should specify the `restype` attribute:

```python
>>> libc.time.restype = c_time_t
```

The argument types can be specified using `argtypes`:

```python
>>> libc.time.argtypes = (POINTER(c_time_t),)
```

To call the function with a `NULL` pointer as first argument, use `None`:

```python
>>> print(libc.time(None))
1150640792
```

Here is a more advanced example, it uses the `strchr()` function, which expects a string pointer and a char, and returns a pointer to a string:

```python
>>> strchr = libc.strchr
>>> strchr(b"abcdef", ord("d"))
8059983
>>> strchr.restype = c_char_p    # c_char_p is a pointer to a string
>>> strchr(b"abcdef", ord("d"))
b'def'
>>> print(strchr(b"abcdef", ord("x")))
None
>>>
```

If you want to avoid the `ord("x")` calls above, you can set the `argtypes` attribute, and the second argument will be converted from a single character Python bytes object into a C char:

```pycon
>>> strchr.restype = c_char_p
>>> strchr.argtypes = [c_char_p, c_char]
>>> strchr(b"abcdef", b"d")
b'def'
>>> strchr(b"abcdef", b"def")
Traceback (most recent call last):
ctypes.ArgumentError: argument 2: TypeError: one character bytes, bytearray or integer expected
>>> print(strchr(b"abcdef", b"x"))
None
>>> strchr(b"abcdef", b"d")
b'def'
>>>
```

You can also use a callable Python object (a function or a class for example) as the `restype` attribute, if the foreign function returns an integer. The callable will be called with the *integer* the C function returns, and the result of this call will be used as the result of your function call. This is useful to check for error return values and automatically raise an exception:

```python
>>> GetModuleHandle = windll.kernel32.GetModuleHandleA
>>> def ValidHandle(value):
...     if value == 0:
...         raise WinError()
...     return value
...
>>>
>>> GetModuleHandle.restype = ValidHandle
>>> GetModuleHandle(None)
486539264
>>> GetModuleHandle("something silly")
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 3, in ValidHandle
OSError: [Errno 126] The specified module could not be found.
>>>
```

`WinError` is a function which will call Windows `FormatMessage()` api to get the string representation of an error code, and *returns* an exception. `WinError` takes an optional error code parameter, if no one is used, it calls `GetLastError()` to retrieve it.

Please note that a much more powerful error checking mechanism is available through the `errcheck` attribute; see the reference manual for details.

<!-- anchor: passing-pointers-or-passing-parameters-by-reference | type: section -->
### Passing pointers (or: passing parameters by reference)

Sometimes a C api function expects a *pointer* to a data type as parameter, probably to write into the corresponding location, or if the data is too large to be passed by value. This is also known as *passing parameters by reference*.

`ctypes` exports the `byref()` function which is used to pass parameters by reference. The same effect can be achieved with the `pointer()` function, although `pointer()` does a lot more work since it constructs a real pointer object, so it is faster to use `byref()` if you don’t need the pointer object in Python itself:

```python
>>> i = c_int()
>>> f = c_float()
>>> s = create_string_buffer(b'\000' * 32)
>>> print(i.value, f.value, repr(s.value))
0 0.0 b''
>>> libc.sscanf(b"1 3.14 Hello", b"%d %f %s",
...             byref(i), byref(f), s)
3
>>> print(i.value, f.value, repr(s.value))
1 3.1400001049 b'Hello'
>>>
```

<!-- anchor: structures-and-unions | type: section -->
### Structures and unions

Structures and unions must derive from the `Structure` and `Union` base classes which are defined in the `ctypes` module. Each subclass must define a `_fields_` attribute. `_fields_` must be a list of *2-tuples*, containing a *field name* and a *field type*.

The field type must be a `ctypes` type like `c_int`, or any other derived `ctypes` type: structure, union, array, pointer.

Here is a simple example of a POINT structure, which contains two integers named *x* and *y*, and also shows how to initialize a structure in the constructor:

```python
>>> from ctypes import *
>>> class POINT(Structure):
...     _fields_ = [("x", c_int),
...                 ("y", c_int)]
...
>>> point = POINT(10, 20)
>>> print(point.x, point.y)
10 20
>>> point = POINT(y=5)
>>> print(point.x, point.y)
0 5
>>> POINT(1, 2, 3)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: too many initializers
>>>
```

You can, however, build much more complicated structures. A structure can itself contain other structures by using a structure as a field type.

Here is a RECT structure which contains two POINTs named *upperleft* and *lowerright*:

```python
>>> class RECT(Structure):
...     _fields_ = [("upperleft", POINT),
...                 ("lowerright", POINT)]
...
>>> rc = RECT(point)
>>> print(rc.upperleft.x, rc.upperleft.y)
0 5
>>> print(rc.lowerright.x, rc.lowerright.y)
0 0
>>>
```

Nested structures can also be initialized in the constructor in several ways:

```python
>>> r = RECT(POINT(1, 2), POINT(3, 4))
>>> r = RECT((1, 2), (3, 4))
```

Field descriptors can be retrieved from the *class*, they are useful for debugging because they can provide useful information. See `CField`:

```python
>>> POINT.x
<ctypes.CField 'x' type=c_int, ofs=0, size=4>
>>> POINT.y
<ctypes.CField 'y' type=c_int, ofs=4, size=4>
>>>
```

**Warning:**

`ctypes` does not support passing unions or structures with bit-fields to functions by value. While this may work on 32-bit x86, it’s not guaranteed by the library to work in the general case. Unions and structures with bit-fields should always be passed to functions by pointer.

<!-- anchor: structure-union-layout-alignment-and-byte-order | type: section -->
### Structure/union layout, alignment and byte order

By default, Structure and Union fields are laid out in the same way the C compiler does it. It is possible to override this behavior entirely by specifying a `_layout_` class attribute in the subclass definition; see the attribute documentation for details.

It is possible to specify the maximum alignment for the fields and/or for the structure itself by setting the class attributes `_pack_` and/or `_align_`, respectively. See the attribute documentation for details.

`ctypes` uses the native byte order for Structures and Unions. To build structures with non-native byte order, you can use one of the `BigEndianStructure`, `LittleEndianStructure`, `BigEndianUnion`, and `LittleEndianUnion` base classes. These classes cannot contain pointer fields.

<!-- anchor: bit-fields-in-structures-and-unions | type: section -->
### Bit fields in structures and unions

It is possible to create structures and unions containing bit fields. Bit fields are only possible for integer fields, the bit width is specified as the third item in the `_fields_` tuples:

```python
>>> class Int(Structure):
...     _fields_ = [("first_16", c_int, 16),
...                 ("second_16", c_int, 16)]
...
>>> print(Int.first_16)
<ctypes.CField 'first_16' type=c_int, ofs=0, bit_size=16, bit_offset=0>
>>> print(Int.second_16)
<ctypes.CField 'second_16' type=c_int, ofs=0, bit_size=16, bit_offset=16>
```

It is important to note that bit field allocation and layout in memory are not defined as a C standard; their implementation is compiler-specific. By default, Python will attempt to match the behavior of a “native” compiler for the current platform. See the `_layout_` attribute for details on the default behavior and how to change it.

<!-- anchor: arrays | type: section -->
### Arrays

Arrays are sequences, containing a fixed number of instances of the same type.

The recommended way to create array types is by multiplying a data type with a positive integer:

```python
TenPointsArrayType = POINT * 10
```

Here is an example of a somewhat artificial data type, a structure containing 4 POINTs among other stuff:

```python
>>> from ctypes import *
>>> class POINT(Structure):
...     _fields_ = ("x", c_int), ("y", c_int)
...
>>> class MyStruct(Structure):
...     _fields_ = [("a", c_int),
...                 ("b", c_float),
...                 ("point_array", POINT * 4)]
>>>
>>> print(len(MyStruct().point_array))
4
>>>
```

Instances are created in the usual way, by calling the class:

```python
arr = TenPointsArrayType()
for pt in arr:
    print(pt.x, pt.y)
```

The above code print a series of `0 0` lines, because the array contents is initialized to zeros.

Initializers of the correct type can also be specified:

```python
>>> from ctypes import *
>>> TenIntegers = c_int * 10
>>> ii = TenIntegers(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
>>> print(ii)
<c_long_Array_10 object at 0x...>
>>> for i in ii: print(i, end=" ")
...
1 2 3 4 5 6 7 8 9 10
>>>
```

<!-- anchor: pointers | type: section -->
### Pointers

Pointer instances are created by calling the `pointer()` function on a `ctypes` type:

```python
>>> from ctypes import *
>>> i = c_int(42)
>>> pi = pointer(i)
>>>
```

Pointer instances have a `contents` attribute which returns the object to which the pointer points, the `i` object above:

```python
>>> pi.contents
c_long(42)
>>>
```

Note that `ctypes` does not have OOR (original object return), it constructs a new, equivalent object each time you retrieve an attribute:

```python
>>> pi.contents is i
False
>>> pi.contents is pi.contents
False
>>>
```

Assigning another `c_int` instance to the pointer’s contents attribute would cause the pointer to point to the memory location where this is stored:

```python
>>> i = c_int(99)
>>> pi.contents = i
>>> pi.contents
c_long(99)
>>>
```

Pointer instances can also be indexed with integers:

```python
>>> pi[0]
99
>>>
```

Assigning to an integer index changes the pointed to value:

```python
>>> print(i)
c_long(99)
>>> pi[0] = 22
>>> print(i)
c_long(22)
>>>
```

It is also possible to use indexes different from 0, but you must know what you’re doing, just as in C: You can access or change arbitrary memory locations. Generally you only use this feature if you receive a pointer from a C function, and you *know* that the pointer actually points to an array instead of a single item.

**Warning:**

Because pointer objects support subscription, they implicitly support iteration. Unless doing this in a controlled manner, such as by manually calling `next()` on a `pointer()` iterator, this will typically lead to infinite loops or crashes, because ctypes has no way of knowing when to stop iteration. In other words, a `pointer` iterator will infinitely yield arbitrary memory.

Behind the scenes, the `pointer()` function does more than simply create pointer instances, it has to create pointer *types* first. This is done with the `POINTER()` function, which accepts any `ctypes` type, and returns a new type:

```python
>>> PI = POINTER(c_int)
>>> PI
<class 'ctypes.LP_c_long'>
>>> PI(42)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: expected c_long instead of int
>>> PI(c_int(42))
<ctypes.LP_c_long object at 0x...>
>>>
```

Calling the pointer type without an argument creates a `NULL` pointer. `NULL` pointers have a `False` boolean value:

```python
>>> null_ptr = POINTER(c_int)()
>>> print(bool(null_ptr))
False
>>>
```

`ctypes` checks for `NULL` when dereferencing pointers (but dereferencing invalid non-`NULL` pointers would crash Python):

```python
>>> null_ptr[0]
Traceback (most recent call last):
    ....
ValueError: NULL pointer access
>>>

>>> null_ptr[0] = 1234
Traceback (most recent call last):
    ....
ValueError: NULL pointer access
>>>
```

<!-- anchor: thread-safety-without-the-gil | type: section -->
### Thread safety without the GIL

From Python 3.13 onward, the GIL can be disabled on the free-threaded build. In ctypes, reads and writes to a single object concurrently is safe, but not across multiple objects:

```pycon
>>> number = c_int(42)
>>> pointer_a = pointer(number)
>>> pointer_b = pointer(number)
```

In the above, it’s only safe for one object to read and write to the address at once if the GIL is disabled. So, `pointer_a` can be shared and written to across multiple threads, but only if `pointer_b` is not also attempting to do the same. If this is an issue, consider using a `threading.Lock` to synchronize access to memory:

```pycon
>>> import threading
>>> lock = threading.Lock()
>>> # Thread 1
>>> with lock:
...    pointer_a.contents = 24
>>> # Thread 2
>>> with lock:
...    pointer_b.contents = 42
```

<!-- anchor: type-conversions | type: section -->
### Type conversions

Usually, ctypes does strict type checking. This means, if you have `POINTER(c_int)` in the `argtypes` list of a function or as the type of a member field in a structure definition, only instances of exactly the same type are accepted. There are some exceptions to this rule, where ctypes accepts other objects. For example, you can pass compatible array instances instead of pointer types. So, for `POINTER(c_int)`, ctypes accepts an array of c_int:

```python
>>> class Bar(Structure):
...     _fields_ = [("count", c_int), ("values", POINTER(c_int))]
...
>>> bar = Bar()
>>> bar.values = (c_int * 3)(1, 2, 3)
>>> bar.count = 3
>>> for i in range(bar.count):
...     print(bar.values[i])
...
1
2
3
>>>
```

In addition, if a function argument is explicitly declared to be a pointer type (such as `POINTER(c_int)`) in `argtypes`, an object of the pointed type (`c_int` in this case) can be passed to the function. ctypes will apply the required `byref()` conversion in this case automatically.

To set a POINTER type field to `NULL`, you can assign `None`:

```python
>>> bar.values = None
>>>
```

Sometimes you have instances of incompatible types. In C, you can cast one type into another type. `ctypes` provides a `cast()` function which can be used in the same way. The `Bar` structure defined above accepts `POINTER(c_int)` pointers or `c_int` arrays for its `values` field, but not instances of other types:

```python
>>> bar.values = (c_byte * 4)()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: incompatible types, c_byte_Array_4 instance instead of LP_c_long instance
>>>
```

For these cases, the `cast()` function is handy.

The `cast()` function can be used to cast a ctypes instance into a pointer to a different ctypes data type. `cast()` takes two parameters, a ctypes object that is or can be converted to a pointer of some kind, and a ctypes pointer type. It returns an instance of the second argument, which references the same memory block as the first argument:

```python
>>> a = (c_byte * 4)()
>>> cast(a, POINTER(c_int))
<ctypes.LP_c_long object at ...>
>>>
```

So, `cast()` can be used to assign to the `values` field of `Bar` the structure:

```python
>>> bar = Bar()
>>> bar.values = cast((c_byte * 4)(), POINTER(c_int))
>>> print(bar.values[0])
0
>>>
```

<!-- anchor: incomplete-types | type: section -->
### Incomplete Types

*Incomplete Types* are structures, unions or arrays whose members are not yet specified. In C, they are specified by forward declarations, which are defined later:

```python
struct cell; /* forward declaration */

struct cell {
    char *name;
    struct cell *next;
};
```

The straightforward translation into ctypes code would be this, but it does not work:

```python
>>> class cell(Structure):
...     _fields_ = [("name", c_char_p),
...                 ("next", POINTER(cell))]
...
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 2, in cell
NameError: name 'cell' is not defined
>>>
```

because the new `class cell` is not available in the class statement itself. In `ctypes`, we can define the `cell` class and set the `_fields_` attribute later, after the class statement:

```python
>>> from ctypes import *
>>> class cell(Structure):
...     pass
...
>>> cell._fields_ = [("name", c_char_p),
...                  ("next", POINTER(cell))]
>>>
```

Let’s try it. We create two instances of `cell`, and let them point to each other, and finally follow the pointer chain a few times:

```python
>>> c1 = cell()
>>> c1.name = b"foo"
>>> c2 = cell()
>>> c2.name = b"bar"
>>> c1.next = pointer(c2)
>>> c2.next = pointer(c1)
>>> p = c1
>>> for i in range(8):
...     print(p.name, end=" ")
...     p = p.next[0]
...
foo bar foo bar foo bar foo bar
>>>
```

<!-- anchor: callback-functions | type: section -->
### Callback functions

`ctypes` allows creating C callable function pointers from Python callables. These are sometimes called *callback functions*.

First, you must create a class for the callback function. The class knows the calling convention, the return type, and the number and types of arguments this function will receive.

The `CFUNCTYPE()` factory function creates types for callback functions using the `cdecl` calling convention. On Windows, the `WINFUNCTYPE()` factory function creates types for callback functions using the `stdcall` calling convention.

Both of these factory functions are called with the result type as first argument, and the callback functions expected argument types as the remaining arguments.

I will present an example here which uses the standard C library’s `qsort()` function, that is used to sort items with the help of a callback function. `qsort()` will be used to sort an array of integers:

```python
>>> IntArray5 = c_int * 5
>>> ia = IntArray5(5, 1, 7, 33, 99)
>>> qsort = libc.qsort
>>> qsort.restype = None
>>>
```

`qsort()` must be called with a pointer to the data to sort, the number of items in the data array, the size of one item, and a pointer to the comparison function, the callback. The callback will then be called with two pointers to items, and it must return a negative integer if the first item is smaller than the second, a zero if they are equal, and a positive integer otherwise.

So our callback function receives pointers to integers, and must return an integer. First we create the `type` for the callback function:

```python
>>> CMPFUNC = CFUNCTYPE(c_int, POINTER(c_int), POINTER(c_int))
>>>
```

To get started, here is a simple callback that shows the values it gets passed:

```python
>>> def py_cmp_func(a, b):
...     print("py_cmp_func", a[0], b[0])
...     return 0
...
>>> cmp_func = CMPFUNC(py_cmp_func)
>>>
```

The result:

```python
>>> qsort(ia, len(ia), sizeof(c_int), cmp_func)
py_cmp_func 5 1
py_cmp_func 33 99
py_cmp_func 7 33
py_cmp_func 5 7
py_cmp_func 1 7
>>>
```

Now we can actually compare the two items and return a useful result:

```python
>>> def py_cmp_func(a, b):
...     print("py_cmp_func", a[0], b[0])
...     return a[0] - b[0]
...
>>>
>>> qsort(ia, len(ia), sizeof(c_int), CMPFUNC(py_cmp_func))
py_cmp_func 5 1
py_cmp_func 33 99
py_cmp_func 7 33
py_cmp_func 1 7
py_cmp_func 5 7
>>>
```

As we can easily check, our array is sorted now:

```python
>>> for i in ia: print(i, end=" ")
...
1 5 7 33 99
>>>
```

The function factories can be used as decorator factories, so we may as well write:

```python
>>> @CFUNCTYPE(c_int, POINTER(c_int), POINTER(c_int))
... def py_cmp_func(a, b):
...     print("py_cmp_func", a[0], b[0])
...     return a[0] - b[0]
...
>>> qsort(ia, len(ia), sizeof(c_int), py_cmp_func)
py_cmp_func 5 1
py_cmp_func 33 99
py_cmp_func 7 33
py_cmp_func 1 7
py_cmp_func 5 7
>>>
```

**Note:**

Make sure you keep references to `CFUNCTYPE()` objects as long as they are used from C code. `ctypes` doesn’t, and if you don’t, they may be garbage collected, crashing your program when a callback is made.

Also, note that if the callback function is called in a thread created outside of Python’s control (e.g. by the foreign code that calls the callback), ctypes creates a new dummy Python thread on every invocation. This behavior is correct for most purposes, but it means that values stored with `threading.local` will *not* survive across different callbacks, even when those calls are made from the same C thread.

<!-- anchor: accessing-values-exported-from-dlls | type: section -->
### Accessing values exported from dlls

Some shared libraries not only export functions, they also export variables. An example in the Python library itself is the `Py_Version`, Python runtime version number encoded in a single constant integer.

`ctypes` can access values like this with the `in_dll()` class methods of the type. *pythonapi* is a predefined symbol giving access to the Python C api:

```python
>>> version = ctypes.c_int.in_dll(ctypes.pythonapi, "Py_Version")
>>> print(hex(version.value))
0x30c00a0
```

An extended example which also demonstrates the use of pointers accesses the `PyImport_FrozenModules` pointer exported by Python.

Quoting the docs for that value:

This pointer is initialized to point to an array of `_frozen` records, terminated by one whose members are all `NULL` or zero. When a frozen module is imported, it is searched in this table. Third-party code could play tricks with this to provide a dynamically created collection of frozen modules.

So manipulating this pointer could even prove useful. To restrict the example size, we show only how this table can be read with `ctypes`:

```python
>>> from ctypes import *
>>>
>>> class struct_frozen(Structure):
...     _fields_ = [("name", c_char_p),
...                 ("code", POINTER(c_ubyte)),
...                 ("size", c_int),
...                 ("get_code", POINTER(c_ubyte)),  # Function pointer
...                ]
...
>>>
```

We have defined the `_frozen` data type, so we can get the pointer to the table:

```python
>>> FrozenTable = POINTER(struct_frozen)
>>> table = FrozenTable.in_dll(pythonapi, "_PyImport_FrozenBootstrap")
>>>
```

Since `table` is a `pointer` to the array of `struct_frozen` records, we can iterate over it, but we just have to make sure that our loop terminates, because pointers have no size. Sooner or later it would probably crash with an access violation or whatever, so it’s better to break out of the loop when we hit the `NULL` entry:

```python
>>> for item in table:
...     if item.name is None:
...         break
...     print(item.name.decode("ascii"), item.size)
...
_frozen_importlib 31764
_frozen_importlib_external 41499
zipimport 12345
>>>
```

The fact that standard Python has a frozen module and a frozen package (indicated by the negative `size` member) is not well known, it is only used for testing. Try it out with `import __hello__` for example.

<!-- anchor: surprises | type: section -->
### Surprises

There are some edges in `ctypes` where you might expect something other than what actually happens.

Consider the following example:

```python
>>> from ctypes import *
>>> class POINT(Structure):
...     _fields_ = ("x", c_int), ("y", c_int)
...
>>> class RECT(Structure):
...     _fields_ = ("a", POINT), ("b", POINT)
...
>>> p1 = POINT(1, 2)
>>> p2 = POINT(3, 4)
>>> rc = RECT(p1, p2)
>>> print(rc.a.x, rc.a.y, rc.b.x, rc.b.y)
1 2 3 4
>>> # now swap the two points
>>> rc.a, rc.b = rc.b, rc.a
>>> print(rc.a.x, rc.a.y, rc.b.x, rc.b.y)
3 4 3 4
>>>
```

Hm. We certainly expected the last statement to print `3 4 1 2`. What happened? Here are the steps of the `rc.a, rc.b = rc.b, rc.a` line above:

```python
>>> temp0, temp1 = rc.b, rc.a
>>> rc.a = temp0
>>> rc.b = temp1
>>>
```

Note that `temp0` and `temp1` are objects still using the internal buffer of the `rc` object above. So executing `rc.a = temp0` copies the buffer contents of `temp0` into `rc` ‘s buffer. This, in turn, changes the contents of `temp1`. So, the last assignment `rc.b = temp1`, doesn’t have the expected effect.

Keep in mind that retrieving sub-objects from Structure, Unions, and Arrays doesn’t *copy* the sub-object, instead it retrieves a wrapper object accessing the root-object’s underlying buffer.

Another example that may behave differently from what one would expect is this:

```python
>>> s = c_char_p()
>>> s.value = b"abc def ghi"
>>> s.value
b'abc def ghi'
>>> s.value is s.value
False
>>>
```

**Note:**

Objects instantiated from `c_char_p` can only have their value set to bytes or integers.

Why is it printing `False`? ctypes instances are objects containing a memory block plus some descriptors accessing the contents of the memory. Storing a Python object in the memory block does not store the object itself, instead the `contents` of the object is stored. Accessing the contents again constructs a new Python object each time!

<!-- anchor: variable-sized-data-types | type: section -->
### Variable-sized data types

`ctypes` provides some support for variable-sized arrays and structures.

The `resize()` function can be used to resize the memory buffer of an existing ctypes object. The function takes the object as first argument, and the requested size in bytes as the second argument. The memory block cannot be made smaller than the natural memory block specified by the objects type, a `ValueError` is raised if this is tried:

```python
>>> short_array = (c_short * 4)()
>>> print(sizeof(short_array))
8
>>> resize(short_array, 4)
Traceback (most recent call last):
    ...
ValueError: minimum size is 8
>>> resize(short_array, 32)
>>> sizeof(short_array)
32
>>> sizeof(type(short_array))
8
>>>
```

This is nice and fine, but how would one access the additional elements contained in this array? Since the type still only knows about 4 elements, we get errors accessing other elements:

```python
>>> short_array[:]
[0, 0, 0, 0]
>>> short_array[7]
Traceback (most recent call last):
    ...
IndexError: invalid index
>>>
```

Another way to use variable-sized data types with `ctypes` is to use the dynamic nature of Python, and (re-)define the data type after the required size is already known, on a case by case basis.

<!-- anchor: ctypes-reference | type: section -->
## ctypes reference

<!-- anchor: loading-shared-libraries | type: section -->
### Loading shared libraries

There are several ways to load shared libraries into the Python process. One way is to instantiate `CDLL` or one of its subclasses:

<!-- anchor: ctypes.CDLL | type: py class -->
#### `class ctypes.CDLL(name, mode=DEFAULT_MODE, handle=None, use_errno=False, use_last_error=False, winmode=None)`

Represents a loaded shared library.

Functions in this library use the standard C calling convention, and are assumed to return int. The Python global interpreter lock is released before calling any function exported by these libraries, and reacquired afterwards. For different function behavior, use a subclass: `OleDLL`, `WinDLL`, or `PyDLL`.

If you have an existing `handle` to an already loaded shared library, it can be passed as the *handle* argument to wrap the opened library in a new `CDLL` object. In this case, *name* is only used to set the `_name` attribute, but it may be adjusted and/or validated.

If *handle* is `None`, the underlying platform’s *dlopen(3)* or LoadLibraryExW function is used to load the library into the process, and to get a handle to it.

*name* is the pathname of the shared library to open. If *name* does not contain a path separator, the library is found in a platform-specific way.

On Windows, the `.DLL` suffix may be missing. (For details, see LoadLibraryExW documentation.) Other platform-specific prefixes and suffixes (for example, `lib`, `.so`, `.dylib`, or version numbers) must be present in *name*; they are not added automatically. See Finding shared libraries for more information.

On non-Windows systems, *name* can be `None`. In this case, `dlopen()` is called with `NULL`, which opens the main program as a “library”. (Some systems do the same is *name* is empty; `None`/`NULL` is more portable.)

**CPython implementation detail:**

Since CPython is linked to `libc`, a `None` *name* is often used to access the C standard library:

```python
>>> printf = ctypes.CDLL(None).printf
>>> printf.argtypes = [ctypes.c_char_p]
>>> printf(b"hello\n")
hello
6
```

To access the Python C API, prefer `ctypes.pythonapi` which works across platforms.

The *mode* parameter can be used to specify how the library is loaded. For details, consult the *dlopen(3)* manpage. On Windows, *mode* is ignored. On posix systems, RTLD_NOW is always added, and is not configurable.

The *use_errno* parameter, when set to true, enables a ctypes mechanism that allows accessing the system `errno` error number in a safe way. `ctypes` maintains a thread-local copy of the system’s `errno` variable; if you call foreign functions created with `use_errno=True` then the `errno` value before the function call is swapped with the ctypes private copy, the same happens immediately after the function call. This mechanism only works for libraries that use the same C runtime library as the interpreter itself. A library linked against a different C runtime (for example, a different CRT on Windows) has its own `errno`, which `ctypes` cannot observe.

The function `ctypes.get_errno()` returns the value of the ctypes private copy, and the function `ctypes.set_errno()` changes the ctypes private copy to a new value and returns the former value.

The *use_last_error* parameter, when set to true, enables the same mechanism for the Windows error code which is managed by the `GetLastError()` and `SetLastError()` Windows API functions; `ctypes.get_last_error()` and `ctypes.set_last_error()` are used to request and change the ctypes private copy of the windows error code.

The *winmode* parameter is used on Windows to specify how the library is loaded (since *mode* is ignored). It takes any value that is valid for the Win32 API LoadLibraryExW flags parameter. When omitted, the default is to use the flags that result in the most secure DLL load, which avoids issues such as DLL hijacking. Passing the full path to the DLL is the safest way to ensure the correct library and dependencies are loaded.

On Windows creating a `CDLL` instance may fail even if the DLL name exists. When a dependent DLL of the loaded DLL is not found, a `OSError` error is raised with the message *“[WinError 126] The specified module could not be found”.* This error message does not contain the name of the missing DLL because the Windows API does not return this information making this error hard to diagnose. To resolve this error and determine which DLL is not found, you need to find the list of dependent DLLs and determine which one is not found using Windows debugging and tracing tools.

**See also:**

Microsoft DUMPBIN tool – A tool to find DLL dependents.

Changed in version 3.8: Added *winmode* parameter.

Changed in version 3.12: The *name* parameter can now be a path-like object.

Instances of this class have no public methods. Functions exported by the shared library can be accessed as attributes or by index. Please note that accessing the function through an attribute caches the result and therefore accessing it repeatedly returns the same object each time. On the other hand, accessing it through an index returns a new object each time:

```python
>>> from ctypes import CDLL
>>> libc = CDLL("libc.so.6")  # On Linux
>>> libc.time == libc.time
True
>>> libc['time'] == libc['time']
False
```

The following public attributes are available. Their name starts with an underscore to not clash with exported function names:

<!-- anchor: ctypes.CDLL._handle | type: py attribute -->
##### `_handle`

The system handle used to access the library.

<!-- anchor: ctypes.CDLL._name | type: py attribute -->
##### `_name`

The name of the library passed in the constructor.

<!-- anchor: ctypes.OleDLL | type: py class -->
#### `class ctypes.OleDLL`

See `CDLL`, the superclass, for common information.

Functions in this library use the `stdcall` calling convention, and are assumed to return the windows specific `HRESULT` code. `HRESULT` values contain information specifying whether the function call failed or succeeded, together with additional error code. If the return value signals a failure, an `OSError` is automatically raised.

Availability: Windows

Changed in version 3.3: `WindowsError` used to be raised, which is now an alias of `OSError`.

<!-- anchor: ctypes.WinDLL | type: py class -->
#### `class ctypes.WinDLL`

See `CDLL`, the superclass, for common information.

Functions in these libraries use the `stdcall` calling convention, and are assumed to return int by default.

Availability: Windows

<!-- anchor: ctypes.PyDLL | type: py class -->
#### `class ctypes.PyDLL`

See `CDLL`, the superclass, for common information.

When functions in this library are called, the Python GIL is *not* released during the function call, and after the function execution the Python error flag is checked. If the error flag is set, a Python exception is raised.

Thus, this is only useful to call Python C API functions directly.

<!-- anchor: ctypes.RTLD_GLOBAL | type: py data -->
#### `ctypes.RTLD_GLOBAL`

Flag to use as *mode* parameter. On platforms where this flag is not available, it is defined as the integer zero.

<!-- anchor: ctypes.RTLD_LOCAL | type: py data -->
#### `ctypes.RTLD_LOCAL`

Flag to use as *mode* parameter. On platforms where this is not available, it is the same as *RTLD_GLOBAL*.

<!-- anchor: ctypes.DEFAULT_MODE | type: py data -->
#### `ctypes.DEFAULT_MODE`

The default mode which is used to load shared libraries. On OSX 10.3, this is *RTLD_GLOBAL*, otherwise it is the same as *RTLD_LOCAL*.

Shared libraries can also be loaded by using one of the prefabricated objects, which are instances of the `LibraryLoader` class, either by calling the `LoadLibrary()` method, or by retrieving the library as attribute of the loader instance.

<!-- anchor: ctypes.LibraryLoader | type: py class -->
#### `class ctypes.LibraryLoader(dlltype)`

Class which loads shared libraries. *dlltype* should be one of the `CDLL`, `PyDLL`, `WinDLL`, or `OleDLL` types.

`__getattr__()` has special behavior: It allows loading a shared library by accessing it as attribute of a library loader instance. The result is cached, so repeated attribute accesses return the same library each time.

<!-- anchor: ctypes.LibraryLoader.LoadLibrary | type: py method -->
##### `LoadLibrary(name)`

Load a shared library into the process and return it. This method always returns a new instance of the library.

These prefabricated library loaders are available:

<!-- anchor: ctypes.cdll | type: py data -->
#### `ctypes.cdll`

Creates `CDLL` instances.

<!-- anchor: ctypes.windll | type: py data -->
#### `ctypes.windll`

Creates `WinDLL` instances.

Availability: Windows

<!-- anchor: ctypes.oledll | type: py data -->
#### `ctypes.oledll`

Creates `OleDLL` instances.

Availability: Windows

<!-- anchor: ctypes.pydll | type: py data -->
#### `ctypes.pydll`

Creates `PyDLL` instances.

<!-- anchor: ctypes.pythonapi | type: py data -->
#### `ctypes.pythonapi`

An instance of `PyDLL` that exposes Python C API functions as attributes. Note that all these functions are assumed to return C int, which is of course not always the truth, so you have to assign the correct `restype` attribute to use these functions.

**Note:**

If the Python interpreter is statically linked, this may be `None`.

Loading a library through any of these objects raises an auditing event `ctypes.dlopen` with string argument `name`, the name used to load the library.

Accessing a function on a loaded library raises an auditing event `ctypes.dlsym` with arguments `library` (the library object) and `name` (the symbol’s name as a string or integer).

In cases when only the library handle is available rather than the object, accessing a function raises an auditing event `ctypes.dlsym/handle` with arguments `handle` (the raw library handle) and `name`.

<!-- anchor: finding-shared-libraries | type: section -->
### Finding shared libraries

When programming in a compiled language, shared libraries are accessed when compiling/linking a program, and when the program is run. The programmer specifies a short name; the C compiler, linker, and runtime dynamic library loader then interact in system-specific ways to find the filename of the library to load.

While the mapping from short names to filenames is not consistently exposed by platforms, the `ctypes.util` module provides a function, `find_library()`, that attempts to match it. However, as backwards compatibility concerns make it difficult to adjust its behavior for new platforms and configurations, the function is soft deprecated.

If wrapping a shared library with `ctypes`, consider determining the shared library name at development time, and hardcoding it into the wrapper module instead of using `find_library()` to locate the library at runtime. Also consider adding a configuration option or environment variable to let users select a library to use, and then perhaps use `find_library()` as a default or fallback.

<!-- anchor: ctypes.util.find_library | type: py function -->
#### `ctypes.util.find_library(name)`

Try to find a library and return a pathname.

*name* is the “short” library name without any prefix like `lib`, suffix like `.so`, `.dylib` or version number. (This is the form used for the posix linker option `-l`.) The result is in a format suitable for passing to `CDLL`.

If no library can be found, return `None`.

The exact functionality is system dependent, and is *not guaranteed* to match the behavior of the compiler, linker, and loader used for (or by) Python. It is recommended to only use this function as a default or fallback,

Soft deprecated since version 3.15: This function is kept for use in cases where it works, but not expected to be updated for additional platforms and configurations.

On Linux, `find_library()` tries to run external programs (`/sbin/ldconfig`, `gcc`, `objdump` and `ld`) to find the library file. If the output of these programs does not correspond to the dynamic linker used by Python, the result of this function may be misleading.

Changed in version 3.6: On Linux, the value of the environment variable `LD_LIBRARY_PATH` is used when searching for libraries, if a library cannot be found by any other means.

Here are some examples:

```python
>>> from ctypes.util import find_library
>>> find_library("m")
'libm.so.6'
>>> find_library("c")
'libc.so.6'
>>> find_library("bz2")
'libbz2.so.1.0'
>>>
```

On macOS and Android, `find_library()` uses the system’s standard naming schemes and paths to locate the library, and returns a full pathname if successful:

```python
>>> from ctypes.util import find_library
>>> find_library("c")
'/usr/lib/libc.dylib'
>>> find_library("m")
'/usr/lib/libm.dylib'
>>> find_library("bz2")
'/usr/lib/libbz2.dylib'
>>> find_library("AGL")
'/System/Library/Frameworks/AGL.framework/AGL'
>>>
```

On Windows, `find_library()` searches along the system search path, and returns the full pathname, but since there is no predefined naming scheme a call like `find_library("c")` will fail and return `None`.

<!-- anchor: ctypes.util.find_msvcrt | type: py function -->
#### `ctypes.util.find_msvcrt()`

Returns the filename of the VC runtime library used by Python, and by the extension modules.

If the name of the library cannot be determined, `None` is returned. Notably, this will happen for recent versions of the VC runtime library, which are not directly loadable.

If you need to free memory, for example, allocated by an extension module with a call to the `free(void *)`, it is important that you use the function in the same library that allocated the memory.

Availability: Windows

<!-- anchor: listing-loaded-shared-libraries | type: section -->
### Listing loaded shared libraries

When writing code that relies on code loaded from shared libraries, it can be useful to know which shared libraries have already been loaded into the current process.

The `ctypes.util` module provides the `dllist()` function, which calls the different APIs provided by the various platforms to help determine which shared libraries have already been loaded into the current process.

The exact output of this function will be system dependent. On most platforms, the first entry of this list represents the current process itself, which may be an empty string. For example, on glibc-based Linux, the return may look like:

```python
>>> from ctypes.util import dllist
>>> dllist()
['', 'linux-vdso.so.1', '/lib/x86_64-linux-gnu/libm.so.6', '/lib/x86_64-linux-gnu/libc.so.6', ... ]
```

<!-- anchor: foreign-functions | type: section -->
### Foreign functions

As explained in the previous section, foreign functions can be accessed as attributes of loaded shared libraries. The function objects created in this way by default accept any number of arguments, accept any ctypes data instances as arguments, and return the default result type specified by the library loader.

They are instances of a private local class `_FuncPtr` (not exposed in `ctypes`) which inherits from the private `_CFuncPtr` class:

```pycon
>>> import ctypes
>>> lib = ctypes.CDLL(None)
>>> issubclass(lib._FuncPtr, ctypes._CFuncPtr)
True
>>> lib._FuncPtr is ctypes._CFuncPtr
False
```

<!-- anchor: ctypes._CFuncPtr | type: py class -->
#### `class ctypes._CFuncPtr`

Base class for C callable foreign functions.

Instances of foreign functions are also C compatible data types; they represent C function pointers.

This behavior can be customized by assigning to special attributes of the foreign function object.

<!-- anchor: ctypes._CFuncPtr.restype | type: py attribute -->
##### `restype`

Assign a ctypes type to specify the result type of the foreign function. Use `None` for void, a function not returning anything.

It is possible to assign a callable Python object that is not a ctypes type, in this case the function is assumed to return a C int, and the callable will be called with this integer, allowing further processing or error checking. Using this is deprecated, for more flexible post processing or error checking use a ctypes data type as `restype` and assign a callable to the `errcheck` attribute.

<!-- anchor: ctypes._CFuncPtr.argtypes | type: py attribute -->
##### `argtypes`

Assign a tuple of ctypes types to specify the argument types that the function accepts. Functions using the `stdcall` calling convention can only be called with the same number of arguments as the length of this tuple; functions using the C calling convention accept additional, unspecified arguments as well.

When a foreign function is called, each actual argument is passed to the `from_param()` class method of the items in the `argtypes` tuple, this method allows adapting the actual argument to an object that the foreign function accepts. For example, a `c_char_p` item in the `argtypes` tuple will convert a string passed as argument into a bytes object using ctypes conversion rules.

New: It is now possible to put items in argtypes which are not ctypes types, but each item must have a `from_param()` method which returns a value usable as argument (integer, string, ctypes instance). This allows defining adapters that can adapt custom objects as function parameters.

<!-- anchor: ctypes._CFuncPtr.errcheck | type: py attribute -->
##### `errcheck`

Assign a Python function or another callable to this attribute. The callable will be called with three or more arguments:

<!-- anchor:  | type: py function -->
###### `callable(result, func, arguments)`

*result* is what the foreign function returns, as specified by the `restype` attribute.

*func* is the foreign function object itself, this allows reusing the same callable object to check or post process the results of several functions.

*arguments* is a tuple containing the parameters originally passed to the function call, this allows specializing the behavior on the arguments used.

The object that this function returns will be returned from the foreign function call, but it can also check the result value and raise an exception if the foreign function call failed.

On Windows, when a foreign function call raises a system exception (for example, due to an access violation), it will be captured and replaced with a suitable Python exception. Further, an auditing event `ctypes.set_exception` with argument `code` will be raised, allowing an audit hook to replace the exception with its own.

Some ways to invoke foreign function calls as well as some of the functions in this module may raise an auditing event `ctypes.call_function` with arguments `function pointer` and `arguments`.

<!-- anchor: function-prototypes | type: section -->
### Function prototypes

Foreign functions can also be created by instantiating function prototypes. Function prototypes are similar to function prototypes in C; they describe a function (return type, argument types, calling convention) without defining an implementation. The factory functions must be called with the desired result type and the argument types of the function, and can be used as decorator factories, and as such, be applied to functions through the `@wrapper` syntax. See Callback functions for examples.

<!-- anchor: ctypes.CFUNCTYPE | type: py function -->
#### `ctypes.CFUNCTYPE(restype, *argtypes, use_errno=False, use_last_error=False)`

The returned function prototype creates functions that use the standard C calling convention. The function will release the GIL during the call. If *use_errno* is set to true, the ctypes private copy of the system `errno` variable is exchanged with the real `errno` value before and after the call; *use_last_error* does the same for the Windows error code.

<!-- anchor: ctypes.WINFUNCTYPE | type: py function -->
#### `ctypes.WINFUNCTYPE(restype, *argtypes, use_errno=False, use_last_error=False)`

The returned function prototype creates functions that use the `stdcall` calling convention. The function will release the GIL during the call. *use_errno* and *use_last_error* have the same meaning as above.

Availability: Windows

<!-- anchor: ctypes.PYFUNCTYPE | type: py function -->
#### `ctypes.PYFUNCTYPE(restype, *argtypes)`

The returned function prototype creates functions that use the Python calling convention. The function will *not* release the GIL during the call.

Function prototypes created by these factory functions can be instantiated in different ways, depending on the type and number of the parameters in the call:

<!-- anchor:  | type: py function -->
#### `prototype(address)`

Returns a foreign function at the specified address which must be an integer.

<!-- anchor:  | type: py function -->
#### `prototype(callable)`

Create a C callable function (a callback function) from a Python *callable*.

<!-- anchor:  | type: py function -->
#### `prototype(func_spec[, paramflags])`

Returns a foreign function exported by a shared library. *func_spec* must be a 2-tuple `(name_or_ordinal, library)`. The first item is the name of the exported function as string, or the ordinal of the exported function as small integer. The second item is the shared library instance.

<!-- anchor:  | type: py function -->
#### `prototype(vtbl_index, name[, paramflags[, iid]])`

Returns a foreign function that will call a COM method. *vtbl_index* is the index into the virtual function table, a small non-negative integer. *name* is name of the COM method. *iid* is an optional pointer to the interface identifier which is used in extended error reporting.

If *iid* is not specified, an `OSError` is raised if the COM method call fails. If *iid* is specified, a `COMError` is raised instead.

COM methods use a special calling convention: They require a pointer to the COM interface as first argument, in addition to those parameters that are specified in the `argtypes` tuple.

Availability: Windows

The optional *paramflags* parameter creates foreign function wrappers with much more functionality than the features described above.

*paramflags* must be a tuple of the same length as `argtypes`.

Each item in this tuple contains further information about a parameter, it must be a tuple containing one, two, or three items.

The first item is an integer containing a combination of direction flags for the parameter:

**1**

Specifies an input parameter to the function.

**2**

Output parameter. The foreign function fills in a value.

**4**

Input parameter which defaults to the integer zero.

The optional second item is the parameter name as string. If this is specified, the foreign function can be called with named parameters.

The optional third item is the default value for this parameter.

The following example demonstrates how to wrap the Windows `MessageBoxW` function so that it supports default parameters and named arguments. The C declaration from the windows header file is this:

```python
WINUSERAPI int WINAPI
MessageBoxW(
    HWND hWnd,
    LPCWSTR lpText,
    LPCWSTR lpCaption,
    UINT uType);
```

Here is the wrapping with `ctypes`:

```python
>>> from ctypes import c_int, WINFUNCTYPE, windll
>>> from ctypes.wintypes import HWND, LPCWSTR, UINT
>>> prototype = WINFUNCTYPE(c_int, HWND, LPCWSTR, LPCWSTR, UINT)
>>> paramflags = (1, "hwnd", 0), (1, "text", "Hi"), (1, "caption", "Hello from ctypes"), (1, "flags", 0)
>>> MessageBox = prototype(("MessageBoxW", windll.user32), paramflags)
```

The `MessageBox` foreign function can now be called in these ways:

```python
>>> MessageBox()
>>> MessageBox(text="Spam, spam, spam")
>>> MessageBox(flags=2, text="foo bar")
```

A second example demonstrates output parameters. The win32 `GetWindowRect` function retrieves the dimensions of a specified window by copying them into `RECT` structure that the caller has to supply. Here is the C declaration:

```python
WINUSERAPI BOOL WINAPI
GetWindowRect(
     HWND hWnd,
     LPRECT lpRect);
```

Here is the wrapping with `ctypes`:

```python
>>> from ctypes import POINTER, WINFUNCTYPE, windll, WinError
>>> from ctypes.wintypes import BOOL, HWND, RECT
>>> prototype = WINFUNCTYPE(BOOL, HWND, POINTER(RECT))
>>> paramflags = (1, "hwnd"), (2, "lprect")
>>> GetWindowRect = prototype(("GetWindowRect", windll.user32), paramflags)
>>>
```

Functions with output parameters will automatically return the output parameter value if there is a single one, or a tuple containing the output parameter values when there are more than one, so the GetWindowRect function now returns a RECT instance, when called.

Output parameters can be combined with the `errcheck` protocol to do further output processing and error checking. The win32 `GetWindowRect` api function returns a `BOOL` to signal success or failure, so this function could do the error checking, and raises an exception when the api call failed:

```python
>>> def errcheck(result, func, args):
...     if not result:
...         raise WinError()
...     return args
...
>>> GetWindowRect.errcheck = errcheck
>>>
```

If the `errcheck` function returns the argument tuple it receives unchanged, `ctypes` continues the normal processing it does on the output parameters. If you want to return a tuple of window coordinates instead of a `RECT` instance, you can retrieve the fields in the function and return them instead, the normal processing will no longer take place:

```python
>>> def errcheck(result, func, args):
...     if not result:
...         raise WinError()
...     rc = args[1]
...     return rc.left, rc.top, rc.bottom, rc.right
...
>>> GetWindowRect.errcheck = errcheck
>>>
```

<!-- anchor: utility-functions | type: section -->
### Utility functions

<!-- anchor: ctypes.addressof | type: py function -->
#### `ctypes.addressof(obj)`

Returns the address of the memory buffer as integer. *obj* must be an instance of a ctypes type.

Raises an auditing event `ctypes.addressof` with argument `obj`.

<!-- anchor: ctypes.alignment | type: py function -->
#### `ctypes.alignment(obj_or_type)`

Returns the alignment requirements of a ctypes type. *obj_or_type* must be a ctypes type or instance.

<!-- anchor: ctypes.byref | type: py function -->
#### `ctypes.byref(obj[, offset])`

Returns a light-weight pointer to *obj*, which must be an instance of a ctypes type. *offset* defaults to zero, and must be an integer that will be added to the internal pointer value.

`byref(obj, offset)` corresponds to this C code:

```python
(((char *)&obj) + offset)
```

The returned object can only be used as a foreign function call parameter. It behaves similar to `pointer(obj)`, but the construction is a lot faster.

<!-- anchor: ctypes.CopyComPointer | type: py function -->
#### `ctypes.CopyComPointer(src, dst)`

Copies a COM pointer from *src* to *dst* and returns the Windows specific `HRESULT` value.

If *src* is not `NULL`, its `AddRef` method is called, incrementing the reference count.

In contrast, the reference count of *dst* will not be decremented before assigning the new value. Unless *dst* is `NULL`, the caller is responsible for decrementing the reference count by calling its `Release` method when necessary.

Availability: Windows

Added in version 3.14.

<!-- anchor: ctypes.cast | type: py function -->
#### `ctypes.cast(obj, type)`

This function is similar to the cast operator in C. It returns a new instance of *type* which points to the same memory block as *obj*. *type* must be a pointer type, and *obj* must be an object that can be interpreted as a pointer.

<!-- anchor: ctypes.create_string_buffer | type: py function -->
#### `ctypes.create_string_buffer(init, size=None)`

`ctypes.create_string_buffer(size)`

This function creates a mutable character buffer. The returned object is a ctypes array of `c_char`.

If *size* is given (and not `None`), it must be an `int`. It specifies the size of the returned array.

If the *init* argument is given, it must be `bytes`. It is used to initialize the array items. Bytes not initialized this way are set to zero (NUL).

If *size* is not given (or if it is `None`), the buffer is made one element larger than *init*, effectively adding a NUL terminator.

If both arguments are given, *size* must not be less than `len(init)`.

**Warning:**

If *size* is equal to `len(init)`, a NUL terminator is not added. Do not treat such a buffer as a C string.

For example:

```python
>>> bytes(create_string_buffer(2))
b'\x00\x00'
>>> bytes(create_string_buffer(b'ab'))
b'ab\x00'
>>> bytes(create_string_buffer(b'ab', 2))
b'ab'
>>> bytes(create_string_buffer(b'ab', 4))
b'ab\x00\x00'
>>> bytes(create_string_buffer(b'abcdef', 2))
Traceback (most recent call last):
   ...
ValueError: byte string too long
```

Raises an auditing event `ctypes.create_string_buffer` with arguments `init`, `size`.

<!-- anchor: ctypes.create_unicode_buffer | type: py function -->
#### `ctypes.create_unicode_buffer(init, size=None)`

`ctypes.create_unicode_buffer(size)`

This function creates a mutable unicode character buffer. The returned object is a ctypes array of `c_wchar`.

The function takes the same arguments as `create_string_buffer()` except *init* must be a string and *size* counts `c_wchar`.

Raises an auditing event `ctypes.create_unicode_buffer` with arguments `init`, `size`.

<!-- anchor: ctypes.DllCanUnloadNow | type: py function -->
#### `ctypes.DllCanUnloadNow()`

This function is a hook which allows implementing in-process COM servers with ctypes. It is called from the DllCanUnloadNow function that the _ctypes extension dll exports.

Availability: Windows

<!-- anchor: ctypes.DllGetClassObject | type: py function -->
#### `ctypes.DllGetClassObject()`

This function is a hook which allows implementing in-process COM servers with ctypes. It is called from the DllGetClassObject function that the `_ctypes` extension dll exports.

Availability: Windows

<!-- anchor: ctypes.util.dllist | type: py function -->
#### `ctypes.util.dllist()`

Try to provide a list of paths of the shared libraries loaded into the current process. These paths are not normalized or processed in any way. The function can raise `OSError` if the underlying platform APIs fail. The exact functionality is system dependent.

On most platforms, the first element of the list represents the current executable file. It may be an empty string.

Availability: Windows, macOS, iOS, glibc, BSD libc, musl

Added in version 3.14.

<!-- anchor: ctypes.FormatError | type: py function -->
#### `ctypes.FormatError([code])`

Returns a textual description of the error code *code*. If no error code is specified, the last error code is used by calling the Windows API function `GetLastError()`.

Availability: Windows

<!-- anchor: ctypes.GetLastError | type: py function -->
#### `ctypes.GetLastError()`

Returns the last error code set by Windows in the calling thread. This function calls the Windows `GetLastError()` function directly, it does not return the ctypes-private copy of the error code.

Availability: Windows

<!-- anchor: ctypes.get_errno | type: py function -->
#### `ctypes.get_errno()`

Returns the current value of the ctypes-private copy of the system `errno` variable in the calling thread.

Raises an auditing event `ctypes.get_errno` with no arguments.

<!-- anchor: ctypes.get_last_error | type: py function -->
#### `ctypes.get_last_error()`

Returns the current value of the ctypes-private copy of the system `LastError` variable in the calling thread.

Availability: Windows

Raises an auditing event `ctypes.get_last_error` with no arguments.

<!-- anchor: ctypes.memmove | type: py function -->
#### `ctypes.memmove(dst, src, count)`

Same as the standard C memmove library function: copies *count* bytes from *src* to *dst*. *dst* and *src* must be integers or ctypes instances that can be converted to pointers.

<!-- anchor: ctypes.memset | type: py function -->
#### `ctypes.memset(dst, c, count)`

Same as the standard C memset library function: fills the memory block at address *dst* with *count* bytes of value *c*. *dst* must be an integer specifying an address, or a ctypes instance.

<!-- anchor: ctypes.POINTER | type: py function -->
#### `ctypes.POINTER(type, /)`

Create or return a ctypes pointer type. Pointer types are cached and reused internally, so calling this function repeatedly is cheap. *type* must be a ctypes type.

**CPython implementation detail:** The resulting pointer type is cached in the `__pointer_type__` attribute of *type*. It is possible to set this attribute before the first call to `POINTER` in order to set a custom pointer type. However, doing this is discouraged: manually creating a suitable pointer type is difficult without relying on implementation details that may change in future Python versions.

<!-- anchor: ctypes.pointer | type: py function -->
#### `ctypes.pointer(obj, /)`

Create a new pointer instance, pointing to *obj*. The returned object is of the type `POINTER(type(obj))`.

Note: If you just want to pass a pointer to an object to a foreign function call, you should use `byref(obj)` which is much faster.

<!-- anchor: ctypes.resize | type: py function -->
#### `ctypes.resize(obj, size)`

This function resizes the internal memory buffer of *obj*, which must be an instance of a ctypes type. It is not possible to make the buffer smaller than the native size of the objects type, as given by `sizeof(type(obj))`, but it is possible to enlarge the buffer.

<!-- anchor: ctypes.set_errno | type: py function -->
#### `ctypes.set_errno(value)`

Set the current value of the ctypes-private copy of the system `errno` variable in the calling thread to *value* and return the previous value.

Raises an auditing event `ctypes.set_errno` with argument `errno`.

<!-- anchor: ctypes.set_last_error | type: py function -->
#### `ctypes.set_last_error(value)`

Sets the current value of the ctypes-private copy of the system `LastError` variable in the calling thread to *value* and return the previous value.

Availability: Windows

Raises an auditing event `ctypes.set_last_error` with argument `error`.

<!-- anchor: ctypes.sizeof | type: py function -->
#### `ctypes.sizeof(obj_or_type)`

Returns the size in bytes of a ctypes type or instance memory buffer. Does the same as the C `sizeof` operator.

<!-- anchor: ctypes.string_at | type: py function -->
#### `ctypes.string_at(ptr, size=-1)`

Return the byte string at *void *ptr*. If *size* is specified, it is used as size, otherwise the string is assumed to be zero-terminated.

Raises an auditing event `ctypes.string_at` with arguments `ptr`, `size`.

<!-- anchor: ctypes.WinError | type: py function -->
#### `ctypes.WinError(code=None, descr=None)`

Creates an instance of `OSError`. If *code* is not specified, `GetLastError()` is called to determine the error code. If *descr* is not specified, `FormatError()` is called to get a textual description of the error.

Availability: Windows

Changed in version 3.3: An instance of `WindowsError` used to be created, which is now an alias of `OSError`.

<!-- anchor: ctypes.wstring_at | type: py function -->
#### `ctypes.wstring_at(ptr, size=-1)`

Return the wide-character string at *void *ptr*. If *size* is specified, it is used as the number of characters of the string, otherwise the string is assumed to be zero-terminated.

Raises an auditing event `ctypes.wstring_at` with arguments `ptr`, `size`.

<!-- anchor: ctypes.memoryview_at | type: py function -->
#### `ctypes.memoryview_at(ptr, size, readonly=False)`

Return a `memoryview` object of length *size* that references memory starting at *void *ptr*.

If *readonly* is true, the returned `memoryview` object can not be used to modify the underlying memory. (Changes made by other means will still be reflected in the returned object.)

This function is similar to `string_at()` with the key difference of not making a copy of the specified memory. It is a semantically equivalent (but more efficient) alternative to `memoryview((c_byte * size).from_address(ptr))`. (While `from_address()` only takes integers, *ptr* can also be given as a `ctypes.POINTER` or a `byref()` object.)

Raises an auditing event `ctypes.memoryview_at` with arguments `address`, `size`, `readonly`.

Added in version 3.14.

<!-- anchor: data-types | type: section -->
### Data types

<!-- anchor: ctypes._CData | type: py class -->
#### `class ctypes._CData`

This non-public class is the common base class of all ctypes data types. Among other things, all ctypes type instances contain a memory block that hold C compatible data; the address of the memory block is returned by the `addressof()` helper function. Another instance variable is exposed as `_objects`; this contains other Python objects that need to be kept alive in case the memory block contains pointers.

Common methods of ctypes data types, these are all class methods (to be exact, they are methods of the metaclass):

<!-- anchor: ctypes._CData.from_buffer | type: py method -->
##### `from_buffer(source[, offset])`

This method returns a ctypes instance that shares the buffer of the *source* object. The *source* object must support the writeable buffer interface. The optional *offset* parameter specifies an offset into the source buffer in bytes; the default is zero. If the source buffer is not large enough a `ValueError` is raised.

Raises an auditing event `ctypes.cdata/buffer` with arguments `pointer`, `size`, `offset`.

<!-- anchor: ctypes._CData.from_buffer_copy | type: py method -->
##### `from_buffer_copy(source[, offset])`

This method creates a ctypes instance, copying the buffer from the *source* object buffer which must be readable. The optional *offset* parameter specifies an offset into the source buffer in bytes; the default is zero. If the source buffer is not large enough a `ValueError` is raised.

Raises an auditing event `ctypes.cdata/buffer` with arguments `pointer`, `size`, `offset`.

<!-- anchor: ctypes._CData.from_address | type: py method -->
##### `from_address(address)`

This method returns a ctypes type instance using the memory specified by *address* which must be an integer.

This method, and others that indirectly call this method, raises an auditing event `ctypes.cdata` with argument `address`.

<!-- anchor: ctypes._CData.from_param | type: py method -->
##### `from_param(obj)`

This method adapts *obj* to a ctypes type. It is called with the actual object used in a foreign function call when the type is present in the foreign function’s `argtypes` tuple; it must return an object that can be used as a function call parameter.

All ctypes data types have a default implementation of this classmethod that normally returns *obj* if that is an instance of the type. Some types accept other objects as well.

<!-- anchor: ctypes._CData.in_dll | type: py method -->
##### `in_dll(library, name)`

This method returns a ctypes type instance exported by a shared library. *name* is the name of the symbol that exports the data, *library* is the loaded shared library.

Common class variables of ctypes data types:

<!-- anchor: ctypes._CData.__pointer_type__ | type: py attribute -->
##### `__pointer_type__`

The pointer type that was created by calling `POINTER()` for corresponding ctypes data type. If a pointer type was not yet created, the attribute is missing.

Added in version 3.14.

Common instance variables of ctypes data types:

<!-- anchor: ctypes._CData._b_base_ | type: py attribute -->
##### `_b_base_`

Sometimes ctypes data instances do not own the memory block they contain, instead they share part of the memory block of a base object. The `_b_base_` read-only member is the root ctypes object that owns the memory block.

<!-- anchor: ctypes._CData._b_needsfree_ | type: py attribute -->
##### `_b_needsfree_`

This read-only variable is true when the ctypes data instance has allocated the memory block itself, false otherwise.

<!-- anchor: ctypes._CData._objects | type: py attribute -->
##### `_objects`

This member is either `None` or a dictionary containing Python objects that need to be kept alive so that the memory block contents is kept valid. This object is only exposed for debugging; never modify the contents of this dictionary.

<!-- anchor: ctypes-fundamental-data-types-2 | type: section -->
### Fundamental data types

<!-- anchor: ctypes._SimpleCData | type: py class -->
#### `class ctypes._SimpleCData`

This non-public class is the base class of all fundamental ctypes data types. It is mentioned here because it contains the common attributes of the fundamental ctypes data types. `_SimpleCData` is a subclass of `_CData`, so it inherits their methods and attributes. ctypes data types that are not and do not contain pointers can now be pickled.

Instances have a single attribute:

<!-- anchor: ctypes._SimpleCData.value | type: py attribute -->
##### `value`

This attribute contains the actual value of the instance. For integer and pointer types, it is an integer, for character types, it is a single character bytes object or string, for character pointer types it is a Python bytes object or string.

When the `value` attribute is retrieved from a ctypes instance, usually a new object is returned each time. `ctypes` does *not* implement original object return, always a new object is constructed. The same is true for all other ctypes object instances.

Each subclass has a class attribute:

<!-- anchor: ctypes._SimpleCData._type_ | type: py attribute -->
##### `_type_`

Class attribute that contains an internal type code, as a single-character string. See Fundamental data types for a summary.

Types marked * in the summary may be (or always are) aliases of a different `_SimpleCData` subclass, and will not necessarily use the listed type code. For example, if the platform’s long, long long and time_t C types are the same, then `c_long`, `c_longlong` and `c_time_t` all refer to a single class, `c_long`, whose `_type_` code is `'l'`. The `'L'` code will be unused.

**See also:**

The `array` and struct modules, as well as third-party modules like numpy, use similar – but slightly different – type codes.

Fundamental data types, when returned as foreign function call results, or, for example, by retrieving structure field members or array items, are transparently converted to native Python types. In other words, if a foreign function has a `restype` of `c_char_p`, you will always receive a Python bytes object, *not* a `c_char_p` instance.

Subclasses of fundamental data types do *not* inherit this behavior. So, if a foreign functions `restype` is a subclass of `c_void_p`, you will receive an instance of this subclass from the function call. Of course, you can get the value of the pointer by accessing the `value` attribute.

These are the fundamental ctypes data types:

<!-- anchor: ctypes.c_byte | type: py class -->
#### `class ctypes.c_byte`

Represents the C signed char datatype, and interprets the value as small integer. The constructor accepts an optional integer initializer; no overflow checking is done.

<!-- anchor: ctypes.c_char | type: py class -->
#### `class ctypes.c_char`

Represents the C char datatype, and interprets the value as a single character. The constructor accepts an optional string initializer, the length of the string must be exactly one character.

<!-- anchor: ctypes.c_char_p | type: py class -->
#### `class ctypes.c_char_p`

Represents the C char* datatype when it points to a zero-terminated string. For a general character pointer that may also point to binary data, `POINTER(c_char)` must be used. The constructor accepts an integer address, or a bytes object.

<!-- anchor: ctypes.c_double | type: py class -->
#### `class ctypes.c_double`

Represents the C double datatype. The constructor accepts an optional float initializer.

<!-- anchor: ctypes.c_longdouble | type: py class -->
#### `class ctypes.c_longdouble`

Represents the C long double datatype. The constructor accepts an optional float initializer. On platforms where `sizeof(long double) == sizeof(double)` it is an alias to `c_double`.

<!-- anchor: ctypes.c_float | type: py class -->
#### `class ctypes.c_float`

Represents the C float datatype. The constructor accepts an optional float initializer.

<!-- anchor: ctypes.c_double_complex | type: py class -->
#### `class ctypes.c_double_complex`

Represents the C double complex datatype, if available. The constructor accepts an optional `complex` initializer.

Added in version 3.14.

<!-- anchor: ctypes.c_float_complex | type: py class -->
#### `class ctypes.c_float_complex`

Represents the C float complex datatype, if available. The constructor accepts an optional `complex` initializer.

Added in version 3.14.

<!-- anchor: ctypes.c_longdouble_complex | type: py class -->
#### `class ctypes.c_longdouble_complex`

Represents the C long double complex datatype, if available. The constructor accepts an optional `complex` initializer.

Added in version 3.14.

<!-- anchor: ctypes.c_int | type: py class -->
#### `class ctypes.c_int`

Represents the C signed int datatype. The constructor accepts an optional integer initializer; no overflow checking is done. On platforms where `sizeof(int) == sizeof(long)` it is an alias to `c_long`.

<!-- anchor: ctypes.c_int8 | type: py class -->
#### `class ctypes.c_int8`

Represents the C 8-bit signed int datatype. It is an alias for `c_byte`.

<!-- anchor: ctypes.c_int16 | type: py class -->
#### `class ctypes.c_int16`

Represents the C 16-bit signed int datatype. Usually an alias for `c_short`.

<!-- anchor: ctypes.c_int32 | type: py class -->
#### `class ctypes.c_int32`

Represents the C 32-bit signed int datatype. Usually an alias for `c_int`.

<!-- anchor: ctypes.c_int64 | type: py class -->
#### `class ctypes.c_int64`

Represents the C 64-bit signed int datatype. Usually an alias for `c_longlong`.

<!-- anchor: ctypes.c_long | type: py class -->
#### `class ctypes.c_long`

Represents the C signed long datatype. The constructor accepts an optional integer initializer; no overflow checking is done.

<!-- anchor: ctypes.c_longlong | type: py class -->
#### `class ctypes.c_longlong`

Represents the C signed long long datatype. The constructor accepts an optional integer initializer; no overflow checking is done. On platforms where `sizeof(long long) == sizeof(long)` it is an alias to `c_long`.

<!-- anchor: ctypes.c_short | type: py class -->
#### `class ctypes.c_short`

Represents the C signed short datatype. The constructor accepts an optional integer initializer; no overflow checking is done.

<!-- anchor: ctypes.c_size_t | type: py class -->
#### `class ctypes.c_size_t`

Represents the C `size_t` datatype. Usually an alias for another unsigned integer type.

<!-- anchor: ctypes.c_ssize_t | type: py class -->
#### `class ctypes.c_ssize_t`

Represents the `Py_ssize_t` datatype. This is a signed version of `size_t`; that is, the POSIX `ssize_t` type. Usually an alias for another integer type.

Added in version 3.2.

<!-- anchor: ctypes.c_time_t | type: py class -->
#### `class ctypes.c_time_t`

Represents the C `time_t` datatype. Usually an alias for another integer type.

Added in version 3.12.

<!-- anchor: ctypes.c_ubyte | type: py class -->
#### `class ctypes.c_ubyte`

Represents the C unsigned char datatype, it interprets the value as small integer. The constructor accepts an optional integer initializer; no overflow checking is done.

<!-- anchor: ctypes.c_uint | type: py class -->
#### `class ctypes.c_uint`

Represents the C unsigned int datatype. The constructor accepts an optional integer initializer; no overflow checking is done. On platforms where `sizeof(int) == sizeof(long)` it is an alias for `c_ulong`.

<!-- anchor: ctypes.c_uint8 | type: py class -->
#### `class ctypes.c_uint8`

Represents the C 8-bit unsigned int datatype. It is an alias for `c_ubyte`.

<!-- anchor: ctypes.c_uint16 | type: py class -->
#### `class ctypes.c_uint16`

Represents the C 16-bit unsigned int datatype. Usually an alias for `c_ushort`.

<!-- anchor: ctypes.c_uint32 | type: py class -->
#### `class ctypes.c_uint32`

Represents the C 32-bit unsigned int datatype. Usually an alias for `c_uint`.

<!-- anchor: ctypes.c_uint64 | type: py class -->
#### `class ctypes.c_uint64`

Represents the C 64-bit unsigned int datatype. Usually an alias for `c_ulonglong`.

<!-- anchor: ctypes.c_ulong | type: py class -->
#### `class ctypes.c_ulong`

Represents the C unsigned long datatype. The constructor accepts an optional integer initializer; no overflow checking is done.

<!-- anchor: ctypes.c_ulonglong | type: py class -->
#### `class ctypes.c_ulonglong`

Represents the C unsigned long long datatype. The constructor accepts an optional integer initializer; no overflow checking is done. On platforms where `sizeof(long long) == sizeof(long)` it is an alias to `c_long`.

<!-- anchor: ctypes.c_ushort | type: py class -->
#### `class ctypes.c_ushort`

Represents the C unsigned short datatype. The constructor accepts an optional integer initializer; no overflow checking is done.

<!-- anchor: ctypes.c_void_p | type: py class -->
#### `class ctypes.c_void_p`

Represents the C void* type. The value is represented as integer. The constructor accepts an optional integer initializer.

<!-- anchor: ctypes.c_wchar | type: py class -->
#### `class ctypes.c_wchar`

Represents the C `wchar_t` datatype, and interprets the value as a single character unicode string. The constructor accepts an optional string initializer, the length of the string must be exactly one character.

<!-- anchor: ctypes.c_wchar_p | type: py class -->
#### `class ctypes.c_wchar_p`

Represents the C wchar_t* datatype, which must be a pointer to a zero-terminated wide character string. The constructor accepts an integer address, or a string.

<!-- anchor: ctypes.c_bool | type: py class -->
#### `class ctypes.c_bool`

Represent the C bool datatype (more accurately, _Bool from C99). Its value can be `True` or `False`, and the constructor accepts any object that has a truth value.

<!-- anchor: ctypes.HRESULT | type: py class -->
#### `class ctypes.HRESULT`

Represents a `HRESULT` value, which contains success or error information for a function or method call.

Availability: Windows

<!-- anchor: ctypes.py_object | type: py class -->
#### `class ctypes.py_object`

Represents the C PyObject* datatype. Calling this without an argument creates a `NULL` PyObject* pointer.

Changed in version 3.14: `py_object` is now a generic type.

The `ctypes.wintypes` module provides quite some other Windows specific data types, for example `HWND`, `WPARAM`, `VARIANT_BOOL` or `DWORD`. Some useful structures like `MSG` or `RECT` are also defined.

<!-- anchor: structured-data-types | type: section -->
### Structured data types

<!-- anchor: ctypes.Union | type: py class -->
#### `class ctypes.Union(*args, **kw)`

Abstract base class for unions in native byte order.

Unions share common attributes and behavior with structures; see `Structure` documentation for details.

<!-- anchor: ctypes.BigEndianUnion | type: py class -->
#### `class ctypes.BigEndianUnion(*args, **kw)`

Abstract base class for unions in *big endian* byte order.

Added in version 3.11.

<!-- anchor: ctypes.LittleEndianUnion | type: py class -->
#### `class ctypes.LittleEndianUnion(*args, **kw)`

Abstract base class for unions in *little endian* byte order.

Added in version 3.11.

<!-- anchor: ctypes.BigEndianStructure | type: py class -->
#### `class ctypes.BigEndianStructure(*args, **kw)`

Abstract base class for structures in *big endian* byte order.

<!-- anchor: ctypes.LittleEndianStructure | type: py class -->
#### `class ctypes.LittleEndianStructure(*args, **kw)`

Abstract base class for structures in *little endian* byte order.

Structures and unions with non-native byte order cannot contain pointer type fields, or any other data types containing pointer type fields.

<!-- anchor: ctypes.Structure | type: py class -->
#### `class ctypes.Structure(*args, **kw)`

Abstract base class for structures in *native* byte order.

Concrete structure and union types must be created by subclassing one of these types, and at least define a `_fields_` class variable. `ctypes` will create descriptors which allow reading and writing the fields by direct attribute accesses. These are the

<!-- anchor: ctypes.Structure._fields_ | type: py attribute -->
##### `_fields_`

A sequence defining the structure fields. The items must be 2-tuples or 3-tuples. The first item is the name of the field, the second item specifies the type of the field; it can be any ctypes data type.

For integer type fields like `c_int`, a third optional item can be given. It must be a small positive integer defining the bit width of the field.

Field names must be unique within one structure or union. This is not checked, only one field can be accessed when names are repeated.

It is possible to define the `_fields_` class variable *after* the class statement that defines the Structure subclass, this allows creating data types that directly or indirectly reference themselves:

```python
class List(Structure):
    pass
List._fields_ = [("pnext", POINTER(List)),
                 ...
                ]
```

The `_fields_` class variable can only be set once. Later assignments will raise an `AttributeError`.

Additionally, the `_fields_` class variable must be defined before the structure or union type is first used: an instance or subclass is created, `sizeof()` is called on it, and so on. Later assignments to `_fields_` will raise an `AttributeError`. If `_fields_` has not been set before such use, the structure or union will have no own fields, as if `_fields_` was empty.

Sub-subclasses of structure types inherit the fields of the base class plus the `_fields_` defined in the sub-subclass, if any.

<!-- anchor: ctypes.Structure._pack_ | type: py attribute -->
##### `_pack_`

An optional small integer that allows overriding the alignment of structure fields in the instance.

This is only implemented for the MSVC-compatible memory layout (see `_layout_`).

Setting `_pack_` to 0 is the same as not setting it at all. Otherwise, the value must be a positive power of two. The effect is equivalent to `#pragma pack(N)` in C, except `ctypes` may allow larger *n* than what the compiler accepts.

`_pack_` must already be defined when `_fields_` is assigned, otherwise it will have no effect.

Deprecated since version 3.14, will be removed in version 3.19: For historical reasons, if `_pack_` is non-zero, the MSVC-compatible layout will be used by default. On non-Windows platforms, this default is deprecated and is slated to become an error in Python 3.19. If it is intended, set `_layout_` to `'ms'` explicitly.

<!-- anchor: ctypes.Structure._align_ | type: py attribute -->
##### `_align_`

An optional small integer that allows increasing the alignment of the structure when being packed or unpacked to/from memory.

The value must not be negative. The effect is equivalent to `__attribute__((aligned(N)))` on GCC or `#pragma align(N)` on MSVC, except `ctypes` may allow values that the compiler would reject.

`_align_` can only *increase* a structure’s alignment requirements. Setting it to 0 or 1 has no effect.

Using values that are not powers of two is discouraged and may lead to surprising behavior.

`_align_` must already be defined when `_fields_` is assigned, otherwise it will have no effect.

Added in version 3.13.

<!-- anchor: ctypes.Structure._layout_ | type: py attribute -->
##### `_layout_`

An optional string naming the struct/union layout. It can currently be set to:

- `"ms"`: the layout used by the Microsoft compiler (MSVC). On GCC and Clang, this layout can be selected with `__attribute__((ms_struct))`.

- `"gcc-sysv"`: the layout used by GCC with the System V or “SysV-like” data model, as used on Linux and macOS. With this layout, `_pack_` must be unset or zero.

If not set explicitly, `ctypes` will use a default that matches the platform conventions. This default may change in future Python releases (for example, when a new platform gains official support, or when a difference between similar platforms is found). Currently the default will be:

- On Windows: `"ms"`

- When `_pack_` is specified: `"ms"`. (This is deprecated; see `_pack_` documentation.)

- Otherwise: `"gcc-sysv"`

`_layout_` must already be defined when `_fields_` is assigned, otherwise it will have no effect.

Added in version 3.14.

<!-- anchor: ctypes.Structure._anonymous_ | type: py attribute -->
##### `_anonymous_`

An optional sequence that lists the names of unnamed (anonymous) fields. `_anonymous_` must be already defined when `_fields_` is assigned, otherwise it will have no effect.

The fields listed in this variable must be structure or union type fields. `ctypes` will create descriptors in the structure type that allows accessing the nested fields directly, without the need to create the structure or union field.

Here is an example type (Windows):

```python
class _U(Union):
    _fields_ = [("lptdesc", POINTER(TYPEDESC)),
                ("lpadesc", POINTER(ARRAYDESC)),
                ("hreftype", HREFTYPE)]

class TYPEDESC(Structure):
    _anonymous_ = ("u",)
    _fields_ = [("u", _U),
                ("vt", VARTYPE)]
```

The `TYPEDESC` structure describes a COM data type, the `vt` field specifies which one of the union fields is valid. Since the `u` field is defined as anonymous field, it is now possible to access the members directly off the TYPEDESC instance. `td.lptdesc` and `td.u.lptdesc` are equivalent, but the former is faster since it does not need to create a temporary union instance:

```python
td = TYPEDESC()
td.vt = VT_PTR
td.lptdesc = POINTER(some_type)
td.u.lptdesc = POINTER(some_type)
```

It is possible to define sub-subclasses of structures, they inherit the fields of the base class. If the subclass definition has a separate `_fields_` variable, the fields specified in this are appended to the fields of the base class.

Structure and union constructors accept both positional and keyword arguments. Positional arguments are used to initialize member fields in the same order as they are appear in `_fields_`. Keyword arguments in the constructor are interpreted as attribute assignments, so they will initialize `_fields_` with the same name, or create new attributes for names not present in `_fields_`.

<!-- anchor: ctypes.CField | type: py class -->
#### `class ctypes.CField(*args, **kw)`

Descriptor for fields of a `Structure` and `Union`. For example:

```python
>>> class Color(Structure):
...     _fields_ = (
...         ('red', c_uint8),
...         ('green', c_uint8),
...         ('blue', c_uint8),
...         ('intense', c_bool, 1),
...         ('blinking', c_bool, 1),
...    )
...
>>> Color.red
<ctypes.CField 'red' type=c_ubyte, ofs=0, size=1>
>>> Color.green.type
<class 'ctypes.c_ubyte'>
>>> Color.blue.byte_offset
2
>>> Color.intense
<ctypes.CField 'intense' type=c_bool, ofs=3, bit_size=1, bit_offset=0>
>>> Color.blinking.bit_offset
1
```

All attributes are read-only.

`CField` objects are created via `_fields_`; do not instantiate the class directly.

Added in version 3.14: Previously, descriptors only had `offset` and `size` attributes and a readable string representation; the `CField` class was not available directly.

<!-- anchor: ctypes.CField.name | type: py attribute -->
##### `name`

Name of the field, as a string.

<!-- anchor: ctypes.CField.type | type: py attribute -->
##### `type`

Type of the field, as a ctypes class.

<!-- anchor: ctypes.CField.offset | type: py attribute -->
##### `offset`

`byte_offset`

Offset of the field, in bytes.

For bitfields, this is the offset of the underlying byte-aligned *storage unit*; see `bit_offset`.

<!-- anchor: ctypes.CField.byte_size | type: py attribute -->
##### `byte_size`

Size of the field, in bytes.

For bitfields, this is the size of the underlying *storage unit*. Typically, it has the same size as the bitfield’s type.

<!-- anchor: ctypes.CField.size | type: py attribute -->
##### `size`

For non-bitfields, equivalent to `byte_size`.

For bitfields, this contains a backwards-compatible bit-packed value that combines `bit_size` and `bit_offset`. Prefer using the explicit attributes instead.

<!-- anchor: ctypes.CField.is_bitfield | type: py attribute -->
##### `is_bitfield`

True if this is a bitfield.

<!-- anchor: ctypes.CField.bit_offset | type: py attribute -->
##### `bit_offset`

`bit_size`

The location of a bitfield within its *storage unit*, that is, within `byte_size` bytes of memory starting at `byte_offset`.

To get the field’s value, read the storage unit as an integer, shift left by `bit_offset` and take the `bit_size` least significant bits.

For non-bitfields, `bit_offset` is zero and `bit_size` is equal to `byte_size * 8`.

<!-- anchor: ctypes.CField.is_anonymous | type: py attribute -->
##### `is_anonymous`

True if this field is anonymous, that is, it contains nested sub-fields that should be merged into a containing structure or union.

<!-- anchor: arrays-and-pointers | type: section -->
### Arrays and pointers

<!-- anchor: ctypes.Array | type: py class -->
#### `class ctypes.Array(*args)`

Abstract base class for arrays.

The recommended way to create concrete array types is by multiplying any `ctypes` data type with a non-negative integer. Alternatively, you can subclass this type and define `_length_` and `_type_` class variables. Array elements can be read and written using standard subscript and slice accesses; for slice reads, the resulting object is *not* itself an `Array`.

Arrays are generic over the type of their elements.

<!-- anchor: ctypes.Array._length_ | type: py attribute -->
##### `_length_`

A positive integer specifying the number of elements in the array. Out-of-range subscripts result in an `IndexError`. Will be returned by `len()`.

<!-- anchor: ctypes.Array._type_ | type: py attribute -->
##### `_type_`

Specifies the type of each element in the array.

Array subclass constructors accept positional arguments, used to initialize the elements in order.

<!-- anchor: ctypes.ARRAY | type: py function -->
#### `ctypes.ARRAY(type, length)`

Create an array. Equivalent to `type * length`, where *type* is a `ctypes` data type and *length* an integer.

Soft deprecated since version 3.14: In favor of multiplication.

<!-- anchor: ctypes._Pointer | type: py class -->
#### `class ctypes._Pointer`

Private, abstract base class for pointers.

Concrete pointer types are created by calling `POINTER()` with the type that will be pointed to; this is done automatically by `pointer()`.

If a pointer points to an array, its elements can be read and written using standard subscript and slice accesses. Pointer objects have no size, so `len()` will raise `TypeError`. Negative subscripts will read from the memory *before* the pointer (as in C), and out-of-range subscripts will probably crash with an access violation (if you’re lucky).

<!-- anchor: ctypes._Pointer._type_ | type: py attribute -->
##### `_type_`

Specifies the type pointed to.

<!-- anchor: ctypes._Pointer.contents | type: py attribute -->
##### `contents`

Returns the object to which to pointer points. Assigning to this attribute changes the pointer to point to the assigned object.

<!-- anchor: exceptions | type: section -->
### Exceptions

<!-- anchor: ctypes.ArgumentError | type: py exception -->
#### `exception ctypes.ArgumentError`

This exception is raised when a foreign function call cannot convert one of the passed arguments.

<!-- anchor: ctypes.COMError | type: py exception -->
#### `exception ctypes.COMError(hresult, text, details)`

This exception is raised when a COM method call failed.

<!-- anchor: ctypes.COMError.hresult | type: py attribute -->
##### `hresult`

The integer value representing the error code.

<!-- anchor: ctypes.COMError.text | type: py attribute -->
##### `text`

The error message.

<!-- anchor: ctypes.COMError.details | type: py attribute -->
##### `details`

The 5-tuple `(descr, source, helpfile, helpcontext, progid)`.

*descr* is the textual description. *source* is the language-dependent `ProgID` for the class or application that raised the error. *helpfile* is the path of the help file. *helpcontext* is the help context identifier. *progid* is the `ProgID` of the interface that defined the error.

Availability: Windows

Added in version 3.14.
