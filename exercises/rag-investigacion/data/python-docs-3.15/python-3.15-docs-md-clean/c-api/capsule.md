# Capsules

Refer to Providing a C API for an Extension Module for more information on using these objects.

type PyCapsule
:   This subtype of `PyObject` represents an opaque value, useful for C
    extension modules which need to pass an opaque value (as a void\*
    pointer) through Python code to other C code. It is often used to make a C
    function pointer defined in one module available to other modules, so the
    regular import mechanism can be used to access C APIs defined in dynamically
    loaded modules.

PyTypeObject PyCapsule\_Type
:   *Part of the Stable ABI.*

    The type object corresponding to capsule objects. This is the same object
    as `types.CapsuleType` in the Python layer.

type PyCapsule\_Destructor
:   *Part of the Stable ABI.*

    The type of a destructor callback for a capsule. Defined as:

    ```
    typedef void (*PyCapsule_Destructor)(PyObject *);
    ```

    See `PyCapsule_New()` for the semantics of PyCapsule\_Destructor
    callbacks.

int PyCapsule\_CheckExact(PyObject \*p)
:   *Thread safety: Atomic.*

    Return true if its argument is a `PyCapsule`. This function always
    succeeds.

PyObject \*PyCapsule\_New(void \*pointer, const char \*name, PyCapsule\_Destructor destructor)
:   *Return value: New reference.* *Part of the Stable ABI.* *Thread safety: Atomic.*

    Create a `PyCapsule` encapsulating the *pointer*. The *pointer*
    argument may not be `NULL`.

    On failure, set an exception and return `NULL`.

    The *name* string may either be `NULL` or a pointer to a valid C string. If
    non-`NULL`, this string must outlive the capsule. (Though it is permitted to
    free it inside the *destructor*.)

    If the *destructor* argument is not `NULL`, it will be called with the
    capsule as its argument when it is destroyed.

    If this capsule will be stored as an attribute of a module, the *name* should
    be specified as `modulename.attributename`. This will enable other modules
    to import the capsule using `PyCapsule_Import()`.

void \*PyCapsule\_GetPointer(PyObject \*capsule, const char \*name)
:   *Part of the Stable ABI.* *Thread safety: Safe to call without external synchronization on distinct objects.*

    Retrieve the *pointer* stored in the capsule. On failure, set an exception
    and return `NULL`.

    The *name* parameter must compare exactly to the name stored in the capsule.
    If the name stored in the capsule is `NULL`, the *name* passed in must also
    be `NULL`. Python uses the C function `strcmp()` to compare capsule
    names.

PyCapsule\_Destructor PyCapsule\_GetDestructor(PyObject \*capsule)
:   *Part of the Stable ABI.* *Thread safety: Safe to call without external synchronization on distinct objects.*

    Return the current destructor stored in the capsule. On failure, set an
    exception and return `NULL`.

    It is legal for a capsule to have a `NULL` destructor. This makes a `NULL`
    return code somewhat ambiguous; use `PyCapsule_IsValid()` or
    `PyErr_Occurred()` to disambiguate.

void \*PyCapsule\_GetContext(PyObject \*capsule)
:   *Part of the Stable ABI.* *Thread safety: Safe to call without external synchronization on distinct objects.*

    Return the current context stored in the capsule. On failure, set an
    exception and return `NULL`.

    It is legal for a capsule to have a `NULL` context. This makes a `NULL`
    return code somewhat ambiguous; use `PyCapsule_IsValid()` or
    `PyErr_Occurred()` to disambiguate.

const char \*PyCapsule\_GetName(PyObject \*capsule)
:   *Part of the Stable ABI.* *Thread safety: Safe to call without external synchronization on distinct objects.*

    Return the current name stored in the capsule. On failure, set an exception
    and return `NULL`.

    It is legal for a capsule to have a `NULL` name. This makes a `NULL` return
    code somewhat ambiguous; use `PyCapsule_IsValid()` or
    `PyErr_Occurred()` to disambiguate.

void \*PyCapsule\_Import(const char \*name, int no\_block)
:   *Part of the Stable ABI.* *Thread safety: Safe to call from multiple threads with external synchronization only.*

    Import a pointer to a C object from a capsule attribute in a module. The
    *name* parameter should specify the full name to the attribute, as in
    `module.attribute`. The *name* stored in the capsule must match this
    string exactly.

    This function splits *name* on the `.` character, and imports the first
    element. It then processes further elements using attribute lookups.

    Return the capsule’s internal *pointer* on success. On failure, set an
    exception and return `NULL`.

    Note

    If *name* points to an attribute of some submodule or subpackage, this
    submodule or subpackage must be previously imported using other means
    (for example, by using `PyImport_ImportModule()`) for the
    attribute lookups to succeed.

int PyCapsule\_IsValid(PyObject \*capsule, const char \*name)
:   *Part of the Stable ABI.* *Thread safety: Safe to call without external synchronization on distinct objects.*

    Determines whether or not *capsule* is a valid capsule. A valid capsule is
    non-`NULL`, passes `PyCapsule_CheckExact()`, has a non-`NULL` pointer
    stored in it, and its internal name matches the *name* parameter. (See
    `PyCapsule_GetPointer()` for information on how capsule names are
    compared.)

    In other words, if `PyCapsule_IsValid()` returns a true value, calls to
    any of the accessors (any function starting with `PyCapsule_Get`) are
    guaranteed to succeed.

    Return a nonzero value if the object is valid and matches the name passed in.
    Return `0` otherwise. This function will not fail.

int PyCapsule\_SetContext(PyObject \*capsule, void \*context)
:   *Part of the Stable ABI.* *Thread safety: Safe to call without external synchronization on distinct objects.*

    Set the context pointer inside *capsule* to *context*.

    Return `0` on success. Return nonzero and set an exception on failure.

int PyCapsule\_SetDestructor(PyObject \*capsule, PyCapsule\_Destructor destructor)
:   *Part of the Stable ABI.* *Thread safety: Safe to call without external synchronization on distinct objects.*

    Set the destructor inside *capsule* to *destructor*.

    Return `0` on success. Return nonzero and set an exception on failure.

int PyCapsule\_SetName(PyObject \*capsule, const char \*name)
:   *Part of the Stable ABI.* *Thread safety: Safe to call without external synchronization on distinct objects.*

    Set the name inside *capsule* to *name*. If non-`NULL`, the name must
    outlive the capsule. If the previous *name* stored in the capsule was not
    `NULL`, no attempt is made to free it.

    Return `0` on success. Return nonzero and set an exception on failure.

int PyCapsule\_SetPointer(PyObject \*capsule, void \*pointer)
:   *Part of the Stable ABI.* *Thread safety: Safe to call without external synchronization on distinct objects.*

    Set the void pointer inside *capsule* to *pointer*. The pointer may not be
    `NULL`.

    Return `0` on success. Return nonzero and set an exception on failure.
