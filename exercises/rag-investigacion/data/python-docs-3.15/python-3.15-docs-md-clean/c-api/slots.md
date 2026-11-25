# Definition slots

To define module objects and
classes using the C API, you may use
an array of *slots* – essentially, key-value pairs that describe features
of the object to create.
This decouples the data from the structures used at runtime, allowing CPython
– and other Python C API implementations – to update the structures without
breaking backwards compatibility.

This section documents slots in general.
For object-specific behavior and slot values, see documentation for functions
that apply slots:

- `PyType_FromSlots()` for types;
- `PyModule_FromSlotsAndSpec()` and Extension export hook
  for modules.

When slots are passed to a function that applies them, the function will
not modify the slot array, nor any data it points to (recursively).
After the function is done, the caller is allowed to modify or deallocate
the array and any data it points to (recursively), except data
explicitly marked with `PySlot_STATIC`.

Except when documented otherwise, multiple slots with the same ID
(`sl_id`) may not occur in a single slots array.

Added in version 3.15: Slot arrays generalize an earlier way of defining objects:
using `PyType_Spec` with `PyType_Slot` for types, and
`PyModuleDef` with `PyModuleDef_Slot` for modules.
The earlier API is soft deprecated; there are no plans to remove it.

Entries of the slots array use the following structure:

type PySlot
:   *Part of the Stable ABI (including all members) since version 3.15.*

    An entry in a slots array. Defined as:

    ```
    typedef struct {
        uint16_t sl_id;
        uint16_t sl_flags;
        union {
            uint32_t sl_reserved;  // must be 0
        };
        union {
            void *sl_ptr;
            void (*sl_func)(void);
            Py_ssize_t sl_size;
            int64_t sl_int64;
            uint64_t sl_uint64;
        };
    } PySlot;
    ```

    uint16\_t sl\_id
    :   A slot ID, chosen from:

        - `Py_slot_*` values documented in Common slot IDs below;
        - `Py_mod_*` values for modules, as documented in Module definition;
        - Values for types, as documented in Type slot IDs.

        A `sl_id` of zero (`Py_slot_end`) marks the end of a
        slots array.

    void \*sl\_ptr

    void (\*sl\_func)(void)

    Py\_ssize\_t sl\_size

    int64\_t sl\_int64

    uint64\_t sl\_uint64
    :   The data for the slot.
        These members are part of an anonymous union;
        the member to use depends on which data type is required by the slot ID:
        data pointer, function pointer, size, signed or unsigned
        integer, respectively.

        Except when documented otherwise for a specific slot ID, pointers
        (that is `sl_ptr` and `sl_func`) may not be NULL.

    uint16\_t sl\_flags
    :   Zero or more of the following flags, OR-ed together:

        PySlot\_STATIC
        :   *Part of the Stable ABI since version 3.15.*

            All data the slot points to is statically allocated and constant.
            Thus, the interpreter does not need to copy the information.

            This flag is implied for function pointers.

            The flag applies even to data the slot points to “indirectly”,
            except for slots nested via `Py_slot_subslots` which may
            have their own `PySlot_STATIC` flags.
            For example, if applied to a `Py_tp_members` slot that
            points to an array of `PyMemberDef` structures,
            then the entire array, as well as the name and doc strings
            in its elements, must be static and constant.

        PySlot\_INTPTR
        :   *Part of the Stable ABI since version 3.15.*

            The data is stored in `sl_ptr`; CPython will cast it to
            the appropriate type.

            This flag can simplify porting from the older `PyType_Slot`
            and `PyModuleDef_Slot` structures.

        PySlot\_OPTIONAL
        :   *Part of the Stable ABI since version 3.15.*

            If the slot ID is unknown, the interpreter should ignore the
            slot, rather than fail.

            For example, if Python 3.16 adds a new feature with a new slot ID,attr
            the corresponding slot may be marked `PySlot_OPTIONAL`
            so that Python 3.15 ignores it.

            Note that the “optionality” only applies to unknown slot IDs.
            This flag does not make Python skip invalid values of known slots.

    Added in version 3.15.

## Convenience macros

PySlot\_DATA(name, value)

PySlot\_FUNC(name, value)

PySlot\_SIZE(name, value)

PySlot\_INT64(name, value)

PySlot\_UINT64(name, value)

PySlot\_STATIC\_DATA(name, value)
:   *This macro is available when compiling for the Stable ABI since version 3.15.*

    Convenience macros to define `PySlot` structures with
    `sl_id` and a particular union member set.

    `PySlot_STATIC_DATA` sets the `PySlot_STATIC` flag;
    others set no flags.

    Note that these macros use *designated initializers*, a C language feature
    that C++ added in the 2020 version of the standard.
    If your code needs to be compatible with C++11 or older,
    use `PySlot_PTR` instead.

    Defined as:

    ```
    #define PySlot_DATA(NAME, VALUE) \
       {.sl_id=NAME, .sl_ptr=(void*)(VALUE)}

    #define PySlot_FUNC(NAME, VALUE) \
       {.sl_id=NAME, .sl_func=(VALUE)}

    #define PySlot_SIZE(NAME, VALUE) \
       {.sl_id=NAME, .sl_size=(VALUE)}

    #define PySlot_INT64(NAME, VALUE) \
       {.sl_id=NAME, .sl_int64=(VALUE)}

    #define PySlot_UINT64(NAME, VALUE) \
       {.sl_id=NAME, .sl_uint64=(VALUE)}

    #define PySlot_STATIC_DATA(NAME, VALUE) \
       {.sl_id=NAME, .sl_flags=PySlot_STATIC, .sl_ptr=(VALUE)}
    ```

    Added in version 3.15.

PySlot\_END
:   *This macro is available when compiling for the Stable ABI since version 3.15.*

    Convenience macro to mark the end of a `PySlot` array.

    Defined as:

    ```
    #define PySlot_END {0}
    ```

    Added in version 3.15.

PySlot\_PTR(name, value)

PySlot\_PTR\_STATIC(name, value)
:   *This macro is available when compiling for the Stable ABI since version 3.15.*

    Convenience macros for use in C++11-compatible code.
    This version of C++ does not allow setting arbitrary union members in
    literals; instead, these macros set the `PySlot_INTPTR` flag and cast
    the value to `(void*)`.

    Defined as:

    ```
    #define PySlot_PTR(NAME, VALUE) \
       {NAME, PySlot_INTPTR, {0}, {(void*)(VALUE)}}

    #define PySlot_PTR_STATIC(NAME, VALUE) \
       {NAME, PySlot_INTPTR|PySlot_STATIC, {0}, {(void*)(VALUE)}}
    ```

    Added in version 3.15.

## Common slot IDs

The following slot IDs may be used in both type and module definitions.

Py\_slot\_end
:   *Part of the Stable ABI since version 3.15.*

    Marks the end of a slots array.
    Defined as zero.

    Added in version 3.15.

Py\_slot\_subslots
:   *Part of the Stable ABI since version 3.15.*

    Nested slots array.

    The value (`sl_ptr`) should point to an array of
    `PySlot` structures.
    The slots in the array (up to but not including the zero-ID
    terminator) will be treated as if they were inserted if the current
    slot array, at the point `Py_slot_subslots` appears.

    Slot nesting depth is limited to 5 levels.
    This restriction may be lifted in the future.

    Added in version 3.15.

Py\_slot\_invalid
:   *Part of the Stable ABI since version 3.15.*

    Reserved; will always be treated as an unknown slot ID.
    Defined as `UINT16_MAX` (`0xFFFF`).

    When used with the `PySlot_OPTIONAL` flag, defines a slot with
    no effect.
    Without the flag, processing a slot with this ID will fail.

    Added in version 3.15.
