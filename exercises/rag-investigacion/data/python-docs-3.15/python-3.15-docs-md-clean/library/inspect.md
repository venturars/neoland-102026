# `inspect` — Inspect live objects

The `inspect` module provides several useful functions to help get
information about live objects such as modules, classes, methods, functions,
tracebacks, frame objects, and code objects. For example, it can help you
examine the contents of a class, retrieve the source code of a method, extract
and format the argument list for a function, or get all the information you need
to display a detailed traceback.

There are four main kinds of services provided by this module: type checking,
getting source code, inspecting classes and functions, and examining the
interpreter stack.

## Types and members

The `getmembers()` function retrieves the members of an object such as a
class or module. The functions whose names begin with “is” are mainly
provided as convenient choices for the second argument to `getmembers()`.
They also help you determine when you can expect to find the following special
attributes (see Import-related attributes on module objects for module attributes):

| Type | Attribute | Description |
| --- | --- | --- |
| class | \_\_doc\_\_ | documentation string |
|  | \_\_name\_\_ | name with which this class was defined |
|  | \_\_qualname\_\_ | qualified name |
|  | \_\_module\_\_ | name of module in which this class was defined |
|  | \_\_type\_params\_\_ | A tuple containing the type parameters of a generic class |
| method | \_\_doc\_\_ | documentation string |
|  | \_\_name\_\_ | name with which this method was defined |
|  | \_\_qualname\_\_ | qualified name |
|  | \_\_func\_\_ | function object containing implementation of method |
|  | \_\_self\_\_ | instance to which this method is bound, or `None` |
|  | \_\_module\_\_ | name of module in which this method was defined |
| function | \_\_doc\_\_ | documentation string |
|  | \_\_name\_\_ | name with which this function was defined |
|  | \_\_qualname\_\_ | qualified name |
|  | \_\_code\_\_ | code object containing compiled function bytecode |
|  | \_\_defaults\_\_ | tuple of any default values for positional or keyword parameters |
|  | \_\_kwdefaults\_\_ | mapping of any default values for keyword-only parameters |
|  | \_\_globals\_\_ | global namespace in which this function was defined |
|  | \_\_builtins\_\_ | builtins namespace |
|  | \_\_annotations\_\_ | mapping of parameters names to annotations; `"return"` key is reserved for return annotations. |
|  | \_\_type\_params\_\_ | A tuple containing the type parameters of a generic function |
|  | \_\_module\_\_ | name of module in which this function was defined |
| traceback | tb\_frame | frame object at this level |
|  | tb\_lasti | index of last attempted instruction in bytecode |
|  | tb\_lineno | current line number in Python source code |
|  | tb\_next | next inner traceback object (called by this level) |
| frame | f\_back | next outer frame object (this frame’s caller) |
|  | f\_builtins | builtins namespace seen by this frame |
|  | f\_code | code object being executed in this frame |
|  | f\_globals | global namespace seen by this frame |
|  | f\_lasti | index of last attempted instruction in bytecode |
|  | f\_lineno | current line number in Python source code |
|  | f\_locals | local namespace seen by this frame |
|  | f\_generator | returns the generator or coroutine object that owns this frame, or `None` if the frame is of a regular function |
|  | f\_trace | tracing function for this frame, or `None` |
|  | f\_trace\_lines | indicate whether a tracing event is triggered for each source source line |
|  | f\_trace\_opcodes | indicate whether per-opcode events are requested |
|  | clear() | used to clear all references to local variables |
| code | co\_argcount | number of arguments (not including keyword only arguments, \* or \*\* args) |
|  | co\_code | string of raw compiled bytecode |
|  | co\_cellvars | tuple of names of cell variables (referenced by containing scopes) |
|  | co\_consts | tuple of constants used in the bytecode |
|  | co\_filename | name of file in which this code object was created |
|  | co\_firstlineno | number of first line in Python source code |
|  | co\_flags | bitmap of `CO_*` flags, read more here |
|  | co\_freevars | tuple of names of free variables (referenced via a function’s closure) |
|  | co\_posonlyargcount | number of positional only arguments |
|  | co\_kwonlyargcount | number of keyword only arguments (not including \*\* arg) |
|  | co\_name | name with which this code object was defined |
|  | co\_qualname | fully qualified name with which this code object was defined |
|  | co\_names | tuple of names other than arguments and function locals |
|  | co\_nlocals | number of local variables |
|  | co\_stacksize | virtual machine stack space required |
|  | co\_varnames | tuple of names of arguments and local variables |
|  | co\_lines() | returns an iterator that yields successive bytecode ranges |
|  | co\_positions() | returns an iterator of source code positions for each bytecode instruction |
|  | replace() | returns a copy of the code object with new values |
| generator | \_\_name\_\_ | name |
|  | \_\_qualname\_\_ | qualified name |
|  | gi\_frame | frame |
|  | gi\_running | is the generator running? |
|  | gi\_suspended | is the generator suspended? |
|  | gi\_code | code |
|  | gi\_yieldfrom | object being iterated by `yield from`, or `None` |
|  | gi\_state | state of the generator, one of `GEN_CREATED`, `GEN_RUNNING`, `GEN_SUSPENDED`, or `GEN_CLOSED` |
| async generator | \_\_name\_\_ | name |
|  | \_\_qualname\_\_ | qualified name |
|  | ag\_await | object being awaited on, or `None` |
|  | ag\_frame | frame |
|  | ag\_running | is the generator running? |
|  | ag\_suspended | is the generator suspended? |
|  | ag\_code | code |
|  | ag\_state | state of the async generator, one of `AGEN_CREATED`, `AGEN_RUNNING`, `AGEN_SUSPENDED`, or `AGEN_CLOSED` |
| coroutine | \_\_name\_\_ | name |
|  | \_\_qualname\_\_ | qualified name |
|  | cr\_await | object being awaited on, or `None` |
|  | cr\_frame | frame |
|  | cr\_running | is the coroutine running? |
|  | cr\_suspended | is the coroutine suspended? |
|  | cr\_code | code |
|  | cr\_origin | where coroutine was created, or `None`. See `sys.set_coroutine_origin_tracking_depth()` |
|  | cr\_state | state of the coroutine, one of `CORO_CREATED`, `CORO_RUNNING`, `CORO_SUSPENDED`, or `CORO_CLOSED` |
| builtin | \_\_doc\_\_ | documentation string |
|  | \_\_name\_\_ | original name of this function or method |
|  | \_\_qualname\_\_ | qualified name |
|  | \_\_self\_\_ | instance to which a method is bound, or module object a function was defined in, or `None` |

The `__name__` attribute of generators is now set from the function
name, instead of the code name, and it can now be modified.

Changed in version 3.15: Add `gi_state` attribute to generators, `cr_state` attribute to
coroutines, and `ag_state` attribute to async generators.

inspect.getmembers(*object*[, *predicate*])
:   Return all the members of an object in a list of `(name, value)`
    pairs sorted by name. If the optional *predicate* argument—which will be
    called with the `value` object of each member—is supplied, only members
    for which the predicate returns a true value are included.

    Note

    `getmembers()` will only return class attributes defined in the
    metaclass when the argument is a class and those attributes have been
    listed in the metaclass’ custom `__dir__()`.

inspect.getmembers\_static(*object*[, *predicate*])
:   Return all the members of an object in a list of `(name, value)`
    pairs sorted by name without triggering dynamic lookup via the descriptor
    protocol, \_\_getattr\_\_ or \_\_getattribute\_\_. Optionally, only return members
    that satisfy a given predicate.

    Note

    `getmembers_static()` may not be able to retrieve all members
    that getmembers can fetch (like dynamically created attributes)
    and may find members that getmembers can’t (like descriptors
    that raise AttributeError). It can also return descriptor objects
    instead of instance members in some cases.

inspect.getmodulename(*path*)
:   Return the name of the module named by the file *path*, without including the
    names of enclosing packages. The file extension is checked against all of
    the entries in `importlib.machinery.all_suffixes()`. If it matches,
    the final path component is returned with the extension removed.
    Otherwise, `None` is returned.

    Note that this function *only* returns a meaningful name for actual
    Python modules - paths that potentially refer to Python packages will
    still return `None`.

inspect.ismodule(*object*)
:   Return `True` if the object is a module.

inspect.isclass(*object*)
:   Return `True` if the object is a class, whether built-in or created in Python
    code.

    This function returns `False` for generic aliases of classes,
    such as `list[int]`.

inspect.ismethod(*object*)
:   Return `True` if the object is a bound method written in Python.

    Note

    For example, given this class:

    ```
    >>> class Greeter:
    ...     def say_hello(self):
    ...         print('hello!')
    ```

    A bound method (also known as an *instance method*) is created when
    accessing `say_hello` (a function defined in the
    `Greeter` namespace) through an instance of the `Greeter` class:

    ```
    >>> instance = Greeter()

    >>> instance.say_hello
    <bound method Greeter.say_hello of <__main__.Greeter object ...>>
    >>> ismethod(instance.say_hello)
    True
    >>> isfunction(instance.say_hello)
    False
    ```

    Accessing `say_hello` through the `Greeter` class will return the
    function itself. For this function, `ismethod()` will return
    `False`, but `isfunction()` will return `True`:

    ```
    >>> Greeter.say_hello
    <function Greeter.say_hello at 0x7f7503854a90>
    >>> ismethod(Greeter.say_hello)
    False
    >>> isfunction(Greeter.say_hello)
    True
    ```

    See Methods for details.

inspect.isfunction(*object*)
:   Return `True` if the object is a Python function, which includes functions
    created by a lambda expression.

    See the note for `ismethod()` for an example.

inspect.ispackage(*object*)
:   Return `True` if the object is a package.

inspect.isgeneratorfunction(*object*)
:   Return `True` if the object is a Python generator function.

    It also returns `True` for bound methods created from Python generator functions
    (see Methods for more information).

inspect.isgenerator(*object*)
:   Return `True` if the object is a generator.

inspect.iscoroutinefunction(*object*)
:   Return `True` if the object is a coroutine function (a function
    defined with an `async def` syntax), a `functools.partial()`
    wrapping a coroutine function, or a sync function marked with
    `markcoroutinefunction()`.

inspect.markcoroutinefunction(*func*)
:   Decorator to mark a callable as a coroutine function if it would not
    otherwise be detected by `iscoroutinefunction()`.

    This may be of use for sync functions that return a coroutine, if
    the function is passed to an API that requires `iscoroutinefunction()`.

    When possible, using an `async def` function is preferred. Also
    acceptable is calling the function and testing the return with
    `iscoroutine()`.

inspect.iscoroutine(*object*)
:   Return `True` if the object is a coroutine created by an
    `async def` function.

inspect.isawaitable(*object*)
:   Return `True` if the object can be used in `await` expression.

    Can also be used to distinguish generator-based coroutines from regular
    generators:

    ```
    import types

    def gen():
        yield
    @types.coroutine
    def gen_coro():
        yield

    assert not isawaitable(gen())
    assert isawaitable(gen_coro())
    ```

inspect.isasyncgenfunction(*object*)
:   Return `True` if the object is an asynchronous generator function,
    for example:

    ```
    >>> async def agen():
    ...     yield 1
    ...
    >>> inspect.isasyncgenfunction(agen)
    True
    ```

inspect.isasyncgen(*object*)
:   Return `True` if the object is an asynchronous generator iterator
    created by an asynchronous generator function.

inspect.istraceback(*object*)
:   Return `True` if the object is a traceback.

inspect.isframe(*object*)
:   Return `True` if the object is a frame.

inspect.iscode(*object*)
:   Return `True` if the object is a code.

inspect.isbuiltin(*object*)
:   Return `True` if the object is a built-in function or a bound built-in method.

inspect.ismethodwrapper(*object*)
:   Return `True` if the type of object is a `MethodWrapperType`.

    These are instances of `MethodWrapperType`, such as `__str__()`,
    `__eq__()` and `__repr__()`.

inspect.isroutine(*object*)
:   Return `True` if the object is a user-defined or built-in function or method.

inspect.isabstract(*object*)
:   Return `True` if the object is an abstract base class.

inspect.ismethoddescriptor(*object*)
:   Return `True` if the object is a method descriptor, but not if
    `isclass()`, `ismethod()` or `isfunction()` is true.

    This, for example, is true of `int.__add__`. An object passing this test
    has a `__get__()` method, but not a `__set__()`
    method or a `__delete__()` method. Beyond that, the set of
    attributes varies. A `__name__` attribute is usually
    sensible, and `__doc__` often is.

    Method descriptors that also pass any of the other tests (`isclass()`,
    `ismethod()` or `isfunction()`) make this function return `False`,
    simply because those other tests promise more – you can, for example, count
    on having the `__func__` attribute when an object passes
    `ismethod()`.

    Changed in version 3.13: This function no longer incorrectly reports objects with `__get__()`
    and `__delete__()`, but not `__set__()`, as being method
    descriptors (such objects are data descriptors, not method descriptors).

inspect.isdatadescriptor(*object*)
:   Return `True` if the object is a data descriptor, but not if
    `isclass()`, `ismethod()` or `isfunction()` is true.

    Data descriptors always have a `__set__()` method and/or
    a `__delete__()` method. Optionally, they may also have a
    `__get__()` method.

    Examples of data descriptors are `properties`, getsets and
    member descriptors. Note that for the latter two (defined only in C extension
    modules), more specific tests are available: `isgetsetdescriptor()` and
    `ismemberdescriptor()`, respectively.

    While data descriptors may also have `__name__` and
    `__doc__` attributes (as properties, getsets and member descriptors
    do), this is not necessarily the case in general.

inspect.isgetsetdescriptor(*object*)
:   Return `True` if the object is a getset descriptor.

    **CPython implementation detail:** getsets are attributes defined in extension modules via
    `PyGetSetDef` structures. For Python implementations without such
    types, this method will always return `False`.

inspect.ismemberdescriptor(*object*)
:   Return `True` if the object is a member descriptor.

    **CPython implementation detail:** Member descriptors are attributes defined in extension modules via
    `PyMemberDef` structures. For Python implementations without such
    types, this method will always return `False`.

## Retrieving source code

inspect.getdoc(*object*, *\**, *inherit\_class\_doc=True*, *fallback\_to\_class\_doc=True*)
:   Get the documentation string for an object, cleaned up with `cleandoc()`.
    If the documentation string for an object is not provided:

    - if the object is a class and *inherit\_class\_doc* is true (by default),
      retrieve the documentation string from the inheritance hierarchy;
    - if the object is a method, a property or a descriptor, retrieve
      the documentation string from the inheritance hierarchy;
    - otherwise, if *fallback\_to\_class\_doc* is true (by default), retrieve
      the documentation string from the class of the object.

    Return `None` if the documentation string is invalid or missing.

    Changed in version 3.15: Added parameters *inherit\_class\_doc* and *fallback\_to\_class\_doc*.

    Documentation strings on `cached_property`
    objects are now inherited if not overridden.

inspect.getcomments(*object*)
:   Return in a single string any lines of comments immediately preceding the
    object’s source code (for a class, function, or method), or at the top of the
    Python source file (if the object is a module). If the object’s source code
    is unavailable, return `None`. This could happen if the object has been
    defined in C or the interactive shell.

inspect.getfile(*object*)
:   Return the name of the (text or binary) file in which an object was defined.
    An `OSError` is raised if the source code cannot be retrieved.
    This will fail with a `TypeError` if the object is a built-in module,
    class, or function.

inspect.getmodule(*object*)
:   Try to guess which module an object was defined in. Return `None`
    if the module cannot be determined.

inspect.getsourcefile(*object*)
:   Return the name of the Python source file in which an object was defined
    or `None` if no way can be identified to get the source. An `OSError` is
    raised if the source code cannot be retrieved.
    This will fail with a `TypeError` if the object is a built-in module,
    class, or function.

inspect.getsourcelines(*object*)
:   Return a list of source lines and starting line number for an object. The
    argument may be a module, class, method, function, traceback, frame, or code
    object. The source code is returned as a list of the lines corresponding to the
    object and the line number indicates where in the original source file the first
    line of code was found. An `OSError` is raised if the source code cannot
    be retrieved.
    A `TypeError` is raised if the object is a built-in module, class, or
    function.

inspect.getsource(*object*)
:   Return the text of the source code for an object. The argument may be a module,
    class, method, function, traceback, frame, or code object. The source code is
    returned as a single string. An `OSError` is raised if the source code
    cannot be retrieved.
    A `TypeError` is raised if the object is a built-in module, class, or
    function.

inspect.cleandoc(*doc*)
:   Clean up indentation from docstrings that are indented to line up with blocks
    of code.

    All leading whitespace is removed from the first line. Any leading whitespace
    that can be uniformly removed from the second line onwards is removed. Empty
    lines at the beginning and end are subsequently removed. Also, all tabs are
    expanded to spaces.

## Introspecting callables with the Signature object

The `Signature` object represents the call signature of a callable object
and its return annotation. To retrieve a `Signature` object,
use the `signature()`
function.

inspect.signature(*callable*, *\**, *follow\_wrapped=True*, *globals=None*, *locals=None*, *eval\_str=False*, *annotation\_format=Format.VALUE*)
:   Return a `Signature` object for the given *callable*:

    ```
    >>> from inspect import signature
    >>> def foo(a, *, b:int, **kwargs):
    ...     pass

    >>> sig = signature(foo)

    >>> str(sig)
    '(a, *, b: int, **kwargs)'

    >>> str(sig.parameters['b'])
    'b: int'

    >>> sig.parameters['b'].annotation
    <class 'int'>
    ```

    Accepts a wide range of Python callables, from plain functions and classes to
    `functools.partial()` objects.

    If some of the annotations are strings (e.g., because
    `from __future__ import annotations` was used), `signature()` will
    attempt to automatically un-stringize the annotations using
    `annotationlib.get_annotations()`. The
    *globals*, *locals*, and *eval\_str* parameters are passed
    into `annotationlib.get_annotations()` when resolving the
    annotations; see the documentation for `annotationlib.get_annotations()`
    for instructions on how to use these parameters. A member of the
    `annotationlib.Format` enum can be passed to the
    *annotation\_format* parameter to control the format of the returned
    annotations. For example, use
    `annotation_format=annotationlib.Format.STRING` to return annotations in string
    format.

    Raises `ValueError` if no signature can be provided, and
    `TypeError` if that type of object is not supported. Also,
    if the annotations are stringized, and *eval\_str* is not false,
    the `eval()` call(s) to un-stringize the annotations in `annotationlib.get_annotations()`
    could potentially raise any kind of exception.

    A slash (/) in the signature of a function denotes that the parameters prior
    to it are positional-only. For more info, see
    the FAQ entry on positional-only parameters.

    Note

    Some callables may not be introspectable in certain implementations of
    Python. For example, in CPython, some built-in functions defined in
    C provide no metadata about their arguments.

    **CPython implementation detail:** If the passed object has a `__signature__` attribute,
    we may use it to create the signature.
    The exact semantics are an implementation detail and are subject to
    unannounced changes. Consult the source code for current semantics.

class inspect.Signature(*parameters=None*, *\**, *return\_annotation=Signature.empty*)
:   A `Signature` object represents the call signature of a function
    and its return
    annotation. For each parameter accepted by the function it stores a
    `Parameter` object in its `parameters` collection.

    The optional *parameters* argument is a sequence of `Parameter`
    objects, which is validated to check that there are no parameters with
    duplicate names, and that the parameters are in the right order, i.e.
    positional-only first, then positional-or-keyword, and that parameters with
    defaults follow parameters without defaults.

    The optional *return\_annotation* argument can be an arbitrary Python object.
    It represents the “return” annotation of the callable.

    `Signature` objects are *immutable*. Use `Signature.replace()` or
    `copy.replace()` to make a modified copy.

    empty
    :   A special class-level marker to specify absence of a return annotation.

    parameters
    :   An ordered mapping of parameters’ names to the corresponding
        `Parameter` objects. Parameters appear in strict definition
        order, including keyword-only parameters.

    return\_annotation
    :   The “return” annotation for the callable. If the callable has no “return”
        annotation, this attribute is set to `Signature.empty`.

    bind(*\*args*, *\*\*kwargs*)
    :   Create a mapping from positional and keyword arguments to parameters.
        Returns `BoundArguments` if `*args` and `**kwargs` match the
        signature, or raises a `TypeError`.

    bind\_partial(*\*args*, *\*\*kwargs*)
    :   Works the same way as `Signature.bind()`, but allows the omission of
        some required arguments (mimics `functools.partial()` behavior.)
        Returns `BoundArguments`, or raises a `TypeError` if the
        passed arguments do not match the signature.

    replace(*\*[, parameters][, return\_annotation]*)
    :   Create a new `Signature` instance based on the instance
        `replace()` was invoked on.
        It is possible to pass different *parameters* and/or
        *return\_annotation* to override the corresponding properties of the base
        signature. To remove `return_annotation` from the copied
        `Signature`, pass in
        `Signature.empty`.

        ```
        >>> def test(a, b):
        ...     pass
        ...
        >>> sig = signature(test)
        >>> new_sig = sig.replace(return_annotation="new return anno")
        >>> str(new_sig)
        "(a, b) -> 'new return anno'"
        ```

        `Signature` objects are also supported by the generic function
        `copy.replace()`.

    format(*\**, *max\_width=None*, *quote\_annotation\_strings=True*)
    :   Create a string representation of the `Signature` object.

        If *max\_width* is passed, the method will attempt to fit
        the signature into lines of at most *max\_width* characters.
        If the signature is longer than *max\_width*,
        all parameters will be on separate lines.

        If *quote\_annotation\_strings* is False, annotations
        in the signature are displayed without opening and closing quotation
        marks if they are strings. This is useful if the signature was created with the
        `STRING` format or if
        `from __future__ import annotations` was used.

    classmethod from\_callable(*obj*, *\**, *follow\_wrapped=True*, *globals=None*, *locals=None*, *eval\_str=False*)
    :   Return a `Signature` (or its subclass) object for a given callable
        *obj*.

        This method simplifies subclassing of `Signature`:

        ```
        class MySignature(Signature):
            pass
        sig = MySignature.from_callable(sum)
        assert isinstance(sig, MySignature)
        ```

        Its behavior is otherwise identical to that of `signature()`.

class inspect.Parameter(*name*, *kind*, *\**, *default=Parameter.empty*, *annotation=Parameter.empty*)
:   `Parameter` objects are *immutable*.
    Instead of modifying a `Parameter` object,
    you can use `Parameter.replace()` or `copy.replace()` to create a modified copy.

    empty
    :   A special class-level marker to specify absence of default values and
        annotations.

    name
    :   The name of the parameter as a string. The name must be a valid
        Python identifier.

        **CPython implementation detail:** CPython generates implicit parameter names of the form `.0` on the
        code objects used to implement comprehensions and generator
        expressions.

    default
    :   The default value for the parameter. If the parameter has no default
        value, this attribute is set to `Parameter.empty`.

    annotation
    :   The annotation for the parameter. If the parameter has no annotation,
        this attribute is set to `Parameter.empty`.

    kind
    :   Describes how argument values are bound to the parameter. The possible
        values are accessible via `Parameter` (like `Parameter.KEYWORD_ONLY`),
        and support comparison and ordering, in the following order:

        | Name | Meaning |
        | --- | --- |
        | *POSITIONAL\_ONLY* | Value must be supplied as a positional argument. Positional only parameters are those which appear before a `/` entry (if present) in a Python function definition. |
        | *POSITIONAL\_OR\_KEYWORD* | Value may be supplied as either a keyword or positional argument (this is the standard binding behaviour for functions implemented in Python.) |
        | *VAR\_POSITIONAL* | A tuple of positional arguments that aren’t bound to any other parameter. This corresponds to a `*args` parameter in a Python function definition. |
        | *KEYWORD\_ONLY* | Value must be supplied as a keyword argument. Keyword only parameters are those which appear after a `*` or `*args` entry in a Python function definition. |
        | *VAR\_KEYWORD* | A dict of keyword arguments that aren’t bound to any other parameter. This corresponds to a `**kwargs` parameter in a Python function definition. |

        Example: print all keyword-only arguments without default values:

        ```
        >>> def foo(a, b, *, c, d=10):
        ...     pass

        >>> sig = signature(foo)
        >>> for param in sig.parameters.values():
        ...     if (param.kind == param.KEYWORD_ONLY and
        ...                        param.default is param.empty):
        ...         print('Parameter:', param)
        Parameter: c
        ```

    kind.description
    :   Describes an enum value of `Parameter.kind`.

        Example: print all descriptions of arguments:

        ```
        >>> def foo(a, b, *, c, d=10):
        ...     pass

        >>> sig = signature(foo)
        >>> for param in sig.parameters.values():
        ...     print(param.kind.description)
        positional or keyword
        positional or keyword
        keyword-only
        keyword-only
        ```

    replace(*\*[, name][, kind][, default][, annotation]*)
    :   Create a new `Parameter` instance based on the instance replaced was invoked
        on. To override a `Parameter` attribute, pass the corresponding
        argument. To remove a default value or/and an annotation from a
        `Parameter`, pass `Parameter.empty`.

        ```
        >>> from inspect import Parameter
        >>> param = Parameter('foo', Parameter.KEYWORD_ONLY, default=42)
        >>> str(param)
        'foo=42'

        >>> str(param.replace()) # Will create a shallow copy of 'param'
        'foo=42'

        >>> str(param.replace(default=Parameter.empty, annotation='spam'))
        "foo: 'spam'"
        ```

        `Parameter` objects are also supported by the generic function
        `copy.replace()`.

    Changed in version 3.4: In Python 3.3 `Parameter` objects were allowed to have `name` set
    to `None` if their `kind` was set to `POSITIONAL_ONLY`.
    This is no longer permitted.

class inspect.BoundArguments
:   Result of a `Signature.bind()` or `Signature.bind_partial()` call.
    Holds the mapping of arguments to the function’s parameters.

    arguments
    :   A mutable mapping of parameters’ names to arguments’ values.
        Contains only explicitly bound arguments. Changes in `arguments`
        will reflect in `args` and `kwargs`.

        Should be used in conjunction with `Signature.parameters` for any
        argument processing purposes.

        Note

        Arguments for which `Signature.bind()` or
        `Signature.bind_partial()` relied on a default value are skipped.
        However, if needed, use `BoundArguments.apply_defaults()` to add
        them.

    args
    :   A tuple of positional arguments values. Dynamically computed from the
        `arguments` attribute.

    kwargs
    :   A dict of keyword arguments values. Dynamically computed from the
        `arguments` attribute. Arguments that can be passed positionally
        are included in `args` instead.

    signature
    :   A reference to the parent `Signature` object.

    apply\_defaults()
    :   Set default values for missing arguments.

        For variable-positional arguments (`*args`) the default is an
        empty tuple.

        For variable-keyword arguments (`**kwargs`) the default is an
        empty dict.

        ```
        >>> def foo(a, b='ham', *args): pass
        >>> ba = inspect.signature(foo).bind('spam')
        >>> ba.apply_defaults()
        >>> ba.arguments
        {'a': 'spam', 'b': 'ham', 'args': ()}
        ```

    The `args` and `kwargs` properties can be used to invoke
    functions:

    ```
    def test(a, *, b):
        ...

    sig = signature(test)
    ba = sig.bind(10, b=20)
    test(*ba.args, **ba.kwargs)
    ```

See also

**PEP 362** - Function Signature Object.
:   The detailed specification, implementation details and examples.

## Classes and functions

inspect.getclasstree(*classes*, *unique=False*)
:   Arrange the given list of classes into a hierarchy of nested lists. Where a
    nested list appears, it contains classes derived from the class whose entry
    immediately precedes the list. Each entry is a 2-tuple containing a class and a
    tuple of its base classes. If the *unique* argument is true, exactly one entry
    appears in the returned structure for each class in the given list. Otherwise,
    classes using multiple inheritance and their descendants will appear multiple
    times.

inspect.getfullargspec(*func*, *\**, *annotation\_format=Format.VALUE*)
:   Get the names and default values of a Python function’s parameters. A
    named tuple is returned:

    `FullArgSpec(args, varargs, varkw, defaults, kwonlyargs, kwonlydefaults,
    annotations)`

    *args* is a list of the positional parameter names.
    *varargs* is the name of the `*` parameter or `None` if arbitrary
    positional arguments are not accepted.
    *varkw* is the name of the `**` parameter or `None` if arbitrary
    keyword arguments are not accepted.
    *defaults* is an *n*-tuple of default argument values corresponding to the
    last *n* positional parameters, or `None` if there are no such defaults
    defined.
    *kwonlyargs* is a list of keyword-only parameter names in declaration order.
    *kwonlydefaults* is a dictionary mapping parameter names from *kwonlyargs*
    to the default values used if no argument is supplied.
    *annotations* is a dictionary mapping parameter names to annotations.
    The special key `"return"` is used to report the function return value
    annotation (if any).

    Note that `signature()` and
    Signature Object provide the recommended
    API for callable introspection, and support additional behaviours (like
    positional-only arguments) that are sometimes encountered in extension module
    APIs. This function is retained primarily for use in code that needs to
    maintain compatibility with the Python 2 `inspect` module API.

    A member of the
    `annotationlib.Format` enum can be passed to the
    *annotation\_format* parameter to control the format of the returned
    annotations. For example, use
    `annotation_format=annotationlib.Format.STRING` to return annotations in string
    format. Note that with the default `VALUE` format, creation of some argspecs
    may raise an exception.

    Changed in version 3.6: This method was previously documented as deprecated in favour of
    `signature()` in Python 3.5, but that decision has been reversed
    in order to restore a clearly supported standard interface for
    single-source Python 2/3 code migrating away from the legacy
    `getargspec()` API.

    Changed in version 3.15: The *annotation\_format* parameter was added.

inspect.getargvalues(*frame*)
:   Get information about arguments passed into a particular frame. A
    named tuple `ArgInfo(args, varargs, keywords, locals)` is
    returned. *args* is a list of the argument names. *varargs* and *keywords*
    are the names of the `*` and `**` arguments or `None`. *locals* is the
    locals dictionary of the given frame.

    Note

    This function was inadvertently marked as deprecated in Python 3.5.

inspect.formatargvalues(*args*[, *varargs*, *varkw*, *locals*, *formatarg*, *formatvarargs*, *formatvarkw*, *formatvalue*])
:   Format a pretty argument spec from the four values returned by
    `getargvalues()`. The format\* arguments are the corresponding optional
    formatting functions that are called to turn names and values into strings.

    Note

    This function was inadvertently marked as deprecated in Python 3.5.

inspect.getmro(*cls*)
:   Return a tuple of class cls’s base classes, including cls, in method resolution
    order. No class appears more than once in this tuple. Note that the method
    resolution order depends on cls’s type. Unless a very peculiar user-defined
    metatype is in use, cls will be the first element of the tuple.

inspect.getcallargs(*func*, */*, *\*args*, *\*\*kwds*)
:   Bind the *args* and *kwds* to the argument names of the Python function or
    method *func*, as if it was called with them. For bound methods, bind also the
    first argument (typically named `self`) to the associated instance. A dict
    is returned, mapping the argument names (including the names of the `*` and
    `**` arguments, if any) to their values from *args* and *kwds*. In case of
    invoking *func* incorrectly, i.e. whenever `func(*args, **kwds)` would raise
    an exception because of incompatible signature, an exception of the same type
    and the same or similar message is raised. For example:

    ```
    >>> from inspect import getcallargs
    >>> def f(a, b=1, *pos, **named):
    ...     pass
    ...
    >>> getcallargs(f, 1, 2, 3) == {'a': 1, 'named': {}, 'b': 2, 'pos': (3,)}
    True
    >>> getcallargs(f, a=2, x=4) == {'a': 2, 'named': {'x': 4}, 'b': 1, 'pos': ()}
    True
    >>> getcallargs(f)
    Traceback (most recent call last):
    ...
    TypeError: f() missing 1 required positional argument: 'a'
    ```

    Deprecated since version 3.5: Use `Signature.bind()` and `Signature.bind_partial()` instead.

inspect.getclosurevars(*func*)
:   Get the mapping of external name references in a Python function or
    method *func* to their current values. A
    named tuple `ClosureVars(nonlocals, globals, builtins, unbound)`
    is returned. *nonlocals* maps referenced names to lexical closure
    variables, *globals* to the function’s module globals and *builtins* to
    the builtins visible from the function body. *unbound* is the set of names
    referenced in the function that could not be resolved at all given the
    current module globals and builtins.

    `TypeError` is raised if *func* is not a Python function or method.

inspect.unwrap(*func*, *\**, *stop=None*)
:   Get the object wrapped by *func*. It follows the chain of `__wrapped__`
    attributes returning the last object in the chain.

    *stop* is an optional callback accepting an object in the wrapper chain
    as its sole argument that allows the unwrapping to be terminated early if
    the callback returns a true value. If the callback never returns a true
    value, the last object in the chain is returned as usual. For example,
    `signature()` uses this to stop unwrapping if any object in the
    chain has a `__signature__` attribute defined.

    `ValueError` is raised if a cycle is encountered.

inspect.get\_annotations(*obj*, *\**, *globals=None*, *locals=None*, *eval\_str=False*, *format=annotationlib.Format.VALUE*)
:   Compute the annotations dict for an object.

    This is an alias for `annotationlib.get_annotations()`; see the documentation
    of that function for more information.

    Caution

    This function may execute arbitrary code contained in annotations.
    See Security implications of introspecting annotations for more information.

## The interpreter stack

Some of the following functions return
`FrameInfo` objects. For backwards compatibility these objects allow
tuple-like operations on all attributes except `positions`. This behavior
is considered deprecated and may be removed in the future.

class inspect.FrameInfo
:   frame
    :   The frame object that the record corresponds to.

    filename
    :   The file name associated with the code being executed by the frame this record
        corresponds to.

    lineno
    :   The line number of the current line associated with the code being
        executed by the frame this record corresponds to.

    function
    :   The function name that is being executed by the frame this record corresponds to.

    code\_context
    :   A list of lines of context from the source code that’s being executed by the frame
        this record corresponds to.

    index
    :   The index of the current line being executed in the `code_context` list.

    positions
    :   A `dis.Positions` object containing the start line number, end line
        number, start column offset, and end column offset associated with the
        instruction being executed by the frame this record corresponds to.

class inspect.Traceback
:   filename
    :   The file name associated with the code being executed by the frame this traceback
        corresponds to.

    lineno
    :   The line number of the current line associated with the code being
        executed by the frame this traceback corresponds to.

    function
    :   The function name that is being executed by the frame this traceback corresponds to.

    code\_context
    :   A list of lines of context from the source code that’s being executed by the frame
        this traceback corresponds to.

    index
    :   The index of the current line being executed in the `code_context` list.

    positions
    :   A `dis.Positions` object containing the start line number, end
        line number, start column offset, and end column offset associated with
        the instruction being executed by the frame this traceback corresponds
        to.

Note

Keeping references to frame objects, as found in the first element of the frame
records these functions return, can cause your program to create reference
cycles. Once a reference cycle has been created, the lifespan of all objects
which can be accessed from the objects which form the cycle can become much
longer even if Python’s optional cycle detector is enabled. If such cycles must
be created, it is important to ensure they are explicitly broken to avoid the
delayed destruction of objects and increased memory consumption which occurs.

Though the cycle detector will catch these, destruction of the frames (and local
variables) can be made deterministic by removing the cycle in a
`finally` clause. This is also important if the cycle detector was
disabled when Python was compiled or using `gc.disable()`. For example:

```
def handle_stackframe_without_leak():
    frame = inspect.currentframe()
    try:
        # do something with the frame
    finally:
        del frame
```

If you want to keep the frame around (for example to print a traceback
later), you can also break reference cycles by using the
`frame.clear()` method.

The optional *context* argument supported by most of these functions specifies
the number of lines of context to return, which are centered around the current
line.

inspect.getframeinfo(*frame*, *context=1*)
:   Get information about a frame or traceback object. A `Traceback` object
    is returned.

inspect.getouterframes(*frame*, *context=1*)
:   Get a list of `FrameInfo` objects for a frame and all outer frames.
    These frames represent the calls that lead to the creation of *frame*. The
    first entry in the returned list represents *frame*; the last entry
    represents the outermost call on *frame*’s stack.

inspect.getinnerframes(*traceback*, *context=1*)
:   Get a list of `FrameInfo` objects for a traceback’s frame and all
    inner frames. These frames represent calls made as a consequence of *frame*.
    The first entry in the list represents *traceback*; the last entry represents
    where the exception was raised.

inspect.currentframe()
:   Return the frame object for the caller’s stack frame.

    **CPython implementation detail:** This function relies on Python stack frame support in the interpreter,
    which isn’t guaranteed to exist in all implementations of Python. If
    running in an implementation without Python stack frame support this
    function returns `None`.

inspect.stack(*context=1*)
:   Return a list of `FrameInfo` objects for the caller’s stack. The
    first entry in the returned list represents the caller; the last entry
    represents the outermost call on the stack.

inspect.trace(*context=1*)
:   Return a list of `FrameInfo` objects for the stack between the current
    frame and the frame in which an exception currently being handled was raised
    in. The first entry in the list represents the caller; the last entry
    represents where the exception was raised.

## Fetching attributes statically

Both `getattr()` and `hasattr()` can trigger code execution when
fetching or checking for the existence of attributes. Descriptors, like
properties, will be invoked and `__getattr__()` and
`__getattribute__()`
may be called.

For cases where you want passive introspection, like documentation tools, this
can be inconvenient. `getattr_static()` has a similar signature as `getattr()`
but avoids executing code when it fetches attributes.

inspect.getattr\_static(*obj*, *attr*)

inspect.getattr\_static(*obj*, *attr*, *default*)
:   Retrieve attributes without triggering dynamic lookup via the
    descriptor protocol, `__getattr__()`
    or `__getattribute__()`.

    Note: this function may not be able to retrieve all attributes
    that getattr can fetch (like dynamically created attributes)
    and may find attributes that getattr can’t (like descriptors
    that raise AttributeError). It can also return descriptors objects
    instead of instance members.

    If the instance `__dict__` is shadowed by another member (for
    example a property) then this function will be unable to find instance
    members.

`getattr_static()` does not resolve descriptors, for example slot descriptors or
getset descriptors on objects implemented in C. The descriptor object
is returned instead of the underlying attribute.

You can handle these with code like the following. Note that
for arbitrary getset descriptors invoking these may trigger
code execution:

```
# example code for resolving the builtin descriptor types
class _foo:
    __slots__ = ['foo']

slot_descriptor = type(_foo.foo)
getset_descriptor = type(type(open(__file__)).name)
wrapper_descriptor = type(str.__dict__['__add__'])
descriptor_types = (slot_descriptor, getset_descriptor, wrapper_descriptor)

result = getattr_static(some_object, 'foo')
if type(result) in descriptor_types:
    try:
        result = result.__get__()
    except AttributeError:
        # descriptors can raise AttributeError to
        # indicate there is no underlying value
        # in which case the descriptor itself will
        # have to do
        pass
```

## Current State of Generators, Coroutines, and Asynchronous Generators

When implementing coroutine schedulers and for other advanced uses of
generators, it is useful to determine whether a generator is currently
executing, is waiting to start or resume or execution, or has already
terminated. `getgeneratorstate()` allows the current state of a
generator to be determined easily.

inspect.getgeneratorstate(*generator*)
:   Get current state of a generator-iterator.

    Possible states are:

    - GEN\_CREATED: Waiting to start execution.
    - GEN\_RUNNING: Currently being executed by the interpreter.
    - GEN\_SUSPENDED: Currently suspended at a yield expression.
    - GEN\_CLOSED: Execution has completed.

inspect.getcoroutinestate(*coroutine*)
:   Get current state of a coroutine object. The function is intended to be
    used with coroutine objects created by `async def` functions, but
    will accept any coroutine-like object that has `cr_running` and
    `cr_frame` attributes.

    Possible states are:

    - CORO\_CREATED: Waiting to start execution.
    - CORO\_RUNNING: Currently being executed by the interpreter.
    - CORO\_SUSPENDED: Currently suspended at an await expression.
    - CORO\_CLOSED: Execution has completed.

inspect.getasyncgenstate(*agen*)
:   Get current state of an asynchronous generator object. The function is
    intended to be used with asynchronous iterator objects created by
    `async def` functions which use the `yield` statement,
    but will accept any asynchronous generator-like object that has
    `ag_running` and `ag_frame` attributes.

    Possible states are:

    - AGEN\_CREATED: Waiting to start execution.
    - AGEN\_RUNNING: Currently being executed by the interpreter.
    - AGEN\_SUSPENDED: Currently suspended at a yield expression.
    - AGEN\_CLOSED: Execution has completed.

The current internal state of the generator can also be queried. This is
mostly useful for testing purposes, to ensure that internal state is being
updated as expected:

inspect.getgeneratorlocals(*generator*)
:   Get the mapping of live local variables in *generator* to their current
    values. A dictionary is returned that maps from variable names to values.
    This is the equivalent of calling `locals()` in the body of the
    generator, and all the same caveats apply.

    If *generator* is a generator with no currently associated frame,
    then an empty dictionary is returned. `TypeError` is raised if
    *generator* is not a Python generator object.

    **CPython implementation detail:** This function relies on the generator exposing a Python stack frame
    for introspection, which isn’t guaranteed to be the case in all
    implementations of Python. In such cases, this function will always
    return an empty dictionary.

inspect.getcoroutinelocals(*coroutine*)
:   This function is analogous to `getgeneratorlocals()`, but
    works for coroutine objects created by `async def` functions.

inspect.getasyncgenlocals(*agen*)
:   This function is analogous to `getgeneratorlocals()`, but
    works for asynchronous generator objects created by `async def`
    functions which use the `yield` statement.

## Code Objects Bit Flags

Python code objects have a `co_flags` attribute,
which is a bitmap of the following flags:

inspect.CO\_OPTIMIZED
:   The code object is optimized, using fast locals.

inspect.CO\_NEWLOCALS
:   If set, a new dict will be created for the frame’s `f_locals`
    when the code object is executed.

inspect.CO\_VARARGS
:   The code object has a variable positional parameter (`*args`-like).

inspect.CO\_VARKEYWORDS
:   The code object has a variable keyword parameter (`**kwargs`-like).

inspect.CO\_NESTED
:   The flag is set when the code object is a nested function.

inspect.CO\_GENERATOR
:   The flag is set when the code object is a generator function, i.e.
    a generator object is returned when the code object is executed.

inspect.CO\_COROUTINE
:   The flag is set when the code object is a coroutine function.
    When the code object is executed it returns a coroutine object.
    See **PEP 492** for more details.

inspect.CO\_ITERABLE\_COROUTINE
:   The flag is used to transform generators into generator-based
    coroutines. Generator objects with this flag can be used in
    `await` expression, and can `yield from` coroutine objects.
    See **PEP 492** for more details.

inspect.CO\_ASYNC\_GENERATOR
:   The flag is set when the code object is an asynchronous generator
    function. When the code object is executed it returns an
    asynchronous generator object. See **PEP 525** for more details.

inspect.CO\_HAS\_DOCSTRING
:   The flag is set when there is a docstring for the code object in
    the source code. If set, it will be the first item in
    `co_consts`.

inspect.CO\_METHOD
:   The flag is set when the code object is a function defined in class
    scope.

Note

The flags are specific to CPython, and may not be defined in other
Python implementations. Furthermore, the flags are an implementation
detail, and can be removed or deprecated in future Python releases.
It’s recommended to use public APIs from the `inspect` module
for any introspection needs.

## Buffer flags

class inspect.BufferFlags
:   This is an `enum.IntFlag` that represents the flags that
    can be passed to the `__buffer__()` method of objects
    implementing the buffer protocol.

    The meaning of the flags is explained at Buffer request types.

    SIMPLE

    WRITABLE

    FORMAT

    ND

    STRIDES

    C\_CONTIGUOUS

    F\_CONTIGUOUS

    ANY\_CONTIGUOUS

    INDIRECT

    CONTIG

    CONTIG\_RO

    STRIDED

    STRIDED\_RO

    RECORDS

    RECORDS\_RO

    FULL

    FULL\_RO

    READ

    WRITE

## Command-line interface

The `inspect` module also provides a basic introspection capability
from the command line.

By default, accepts the name of a module and prints the source of that
module. A class or function within the module can be printed instead by
appending a colon and the qualified name of the target object.

--details
:   Print information about the specified object rather than the source code

Changed in version 3.15: The `--details` option now supports basic introspection for modules
without available source code and indicates when modules are frozen.
It also indicates when the given target reference is not the canonical
name of the referenced object.
