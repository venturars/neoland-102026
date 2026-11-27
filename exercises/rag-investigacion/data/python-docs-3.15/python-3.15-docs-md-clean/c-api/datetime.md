# DateTime Objects

Various date and time objects are supplied by the `datetime` module.
Before using any of these functions, the header file `datetime.h` must be
included in your source (note that this is not included by `Python.h`),
and the macro `PyDateTime_IMPORT` must be invoked, usually as part of
the module initialisation function. The macro puts a pointer to a C structure
into a static variable, `PyDateTimeAPI`, that is used by the following
macros.

PyDateTime\_IMPORT
:   Import the datetime C API.

    On success, populate the `PyDateTimeAPI` pointer.
    On failure, set `PyDateTimeAPI` to `NULL` and set an exception.
    The caller must check if an error occurred via `PyErr_Occurred()`:

    ```
    PyDateTime_IMPORT;
    if (PyErr_Occurred()) { /* cleanup */ }
    ```

    Warning

    This is not compatible with subinterpreters.

    Changed in version 3.15: This macro is now thread safe.

type PyDateTime\_CAPI
:   Structure containing the fields for the datetime C API.

    The fields of this structure are private and subject to change.

    Do not use this directly; prefer `PyDateTime_*` APIs instead.

PyDateTime\_CAPI \*PyDateTimeAPI
:   Dynamically allocated object containing the datetime C API.

    This variable is only available once `PyDateTime_IMPORT` succeeds.

    Changed in version 3.15: This variable should not be accessed directly as direct access is not thread-safe.
    Use `PyDateTime_IMPORT` instead.

type PyDateTime\_Date
:   This subtype of `PyObject` represents a Python date object.

type PyDateTime\_DateTime
:   This subtype of `PyObject` represents a Python datetime object.

type PyDateTime\_Time
:   This subtype of `PyObject` represents a Python time object.

type PyDateTime\_Delta
:   This subtype of `PyObject` represents the difference between two datetime values.

PyTypeObject PyDateTime\_DateType
:   This instance of `PyTypeObject` represents the Python date type;
    it is the same object as `datetime.date` in the Python layer.

PyTypeObject PyDateTime\_DateTimeType
:   This instance of `PyTypeObject` represents the Python datetime type;
    it is the same object as `datetime.datetime` in the Python layer.

PyTypeObject PyDateTime\_TimeType
:   This instance of `PyTypeObject` represents the Python time type;
    it is the same object as `datetime.time` in the Python layer.

PyTypeObject PyDateTime\_DeltaType
:   This instance of `PyTypeObject` represents the Python type for
    the difference between two datetime values;
    it is the same object as `datetime.timedelta` in the Python layer.

PyTypeObject PyDateTime\_TZInfoType
:   This instance of `PyTypeObject` represents the Python time zone info type;
    it is the same object as `datetime.tzinfo` in the Python layer.

Macro for access to the UTC singleton:

PyObject \*PyDateTime\_TimeZone\_UTC
:   Returns the time zone singleton representing UTC, the same object as
    `datetime.timezone.utc`.

Type-check macros:

int PyDate\_Check(PyObject \*ob)
:   Return true if *ob* is of type `PyDateTime_DateType` or a subtype of
    `PyDateTime_DateType`. *ob* must not be `NULL`. This function always
    succeeds.

int PyDate\_CheckExact(PyObject \*ob)
:   Return true if *ob* is of type `PyDateTime_DateType`. *ob* must not be
    `NULL`. This function always succeeds.

int PyDateTime\_Check(PyObject \*ob)
:   Return true if *ob* is of type `PyDateTime_DateTimeType` or a subtype of
    `PyDateTime_DateTimeType`. *ob* must not be `NULL`. This function always
    succeeds.

int PyDateTime\_CheckExact(PyObject \*ob)
:   Return true if *ob* is of type `PyDateTime_DateTimeType`. *ob* must not
    be `NULL`. This function always succeeds.

int PyTime\_Check(PyObject \*ob)
:   Return true if *ob* is of type `PyDateTime_TimeType` or a subtype of
    `PyDateTime_TimeType`. *ob* must not be `NULL`. This function always
    succeeds.

int PyTime\_CheckExact(PyObject \*ob)
:   Return true if *ob* is of type `PyDateTime_TimeType`. *ob* must not be
    `NULL`. This function always succeeds.

int PyDelta\_Check(PyObject \*ob)
:   Return true if *ob* is of type `PyDateTime_DeltaType` or a subtype of
    `PyDateTime_DeltaType`. *ob* must not be `NULL`. This function always
    succeeds.

int PyDelta\_CheckExact(PyObject \*ob)
:   Return true if *ob* is of type `PyDateTime_DeltaType`. *ob* must not be
    `NULL`. This function always succeeds.

int PyTZInfo\_Check(PyObject \*ob)
:   Return true if *ob* is of type `PyDateTime_TZInfoType` or a subtype of
    `PyDateTime_TZInfoType`. *ob* must not be `NULL`. This function always
    succeeds.

int PyTZInfo\_CheckExact(PyObject \*ob)
:   Return true if *ob* is of type `PyDateTime_TZInfoType`. *ob* must not be
    `NULL`. This function always succeeds.

Macros to create objects:

PyObject \*PyDate\_FromDate(int year, int month, int day)
:   *Return value: New reference.*

    Return a `datetime.date` object with the specified year, month and day.

PyObject \*PyDateTime\_FromDateAndTime(int year, int month, int day, int hour, int minute, int second, int usecond)
:   *Return value: New reference.*

    Return a `datetime.datetime` object with the specified year, month, day, hour,
    minute, second and microsecond.

PyObject \*PyDateTime\_FromDateAndTimeAndFold(int year, int month, int day, int hour, int minute, int second, int usecond, int fold)
:   *Return value: New reference.*

    Return a `datetime.datetime` object with the specified year, month, day, hour,
    minute, second, microsecond and fold.

PyObject \*PyTime\_FromTime(int hour, int minute, int second, int usecond)
:   *Return value: New reference.*

    Return a `datetime.time` object with the specified hour, minute, second and
    microsecond.

PyObject \*PyTime\_FromTimeAndFold(int hour, int minute, int second, int usecond, int fold)
:   *Return value: New reference.*

    Return a `datetime.time` object with the specified hour, minute, second,
    microsecond and fold.

PyObject \*PyDelta\_FromDSU(int days, int seconds, int useconds)
:   *Return value: New reference.*

    Return a `datetime.timedelta` object representing the given number
    of days, seconds and microseconds. Normalization is performed so that the
    resulting number of microseconds and seconds lie in the ranges documented for
    `datetime.timedelta` objects.

PyObject \*PyTimeZone\_FromOffset(PyObject \*offset)
:   *Return value: New reference.*

    Return a `datetime.timezone` object with an unnamed fixed offset
    represented by the *offset* argument.

PyObject \*PyTimeZone\_FromOffsetAndName(PyObject \*offset, PyObject \*name)
:   *Return value: New reference.*

    Return a `datetime.timezone` object with a fixed offset represented
    by the *offset* argument and with tzname *name*.

Macros to extract fields from date objects. The argument must be an instance of
`PyDateTime_Date`, including subclasses (such as
`PyDateTime_DateTime`). The argument must not be `NULL`, and the type is
not checked:

int PyDateTime\_GET\_YEAR(PyDateTime\_Date \*o)
:   Return the year, as a positive int.

int PyDateTime\_GET\_MONTH(PyDateTime\_Date \*o)
:   Return the month, as an int from 1 through 12.

int PyDateTime\_GET\_DAY(PyDateTime\_Date \*o)
:   Return the day, as an int from 1 through 31.

Macros to extract fields from datetime objects. The argument must be an
instance of `PyDateTime_DateTime`, including subclasses. The argument
must not be `NULL`, and the type is not checked:

int PyDateTime\_DATE\_GET\_HOUR(PyDateTime\_DateTime \*o)
:   Return the hour, as an int from 0 through 23.

int PyDateTime\_DATE\_GET\_MINUTE(PyDateTime\_DateTime \*o)
:   Return the minute, as an int from 0 through 59.

int PyDateTime\_DATE\_GET\_SECOND(PyDateTime\_DateTime \*o)
:   Return the second, as an int from 0 through 59.

int PyDateTime\_DATE\_GET\_MICROSECOND(PyDateTime\_DateTime \*o)
:   Return the microsecond, as an int from 0 through 999999.

int PyDateTime\_DATE\_GET\_FOLD(PyDateTime\_DateTime \*o)
:   Return the fold, as an int from 0 through 1.

PyObject \*PyDateTime\_DATE\_GET\_TZINFO(PyDateTime\_DateTime \*o)
:   Return the tzinfo (which may be `None`).

Macros to extract fields from time objects. The argument must be an instance of
`PyDateTime_Time`, including subclasses. The argument must not be `NULL`,
and the type is not checked:

int PyDateTime\_TIME\_GET\_HOUR(PyDateTime\_Time \*o)
:   Return the hour, as an int from 0 through 23.

int PyDateTime\_TIME\_GET\_MINUTE(PyDateTime\_Time \*o)
:   Return the minute, as an int from 0 through 59.

int PyDateTime\_TIME\_GET\_SECOND(PyDateTime\_Time \*o)
:   Return the second, as an int from 0 through 59.

int PyDateTime\_TIME\_GET\_MICROSECOND(PyDateTime\_Time \*o)
:   Return the microsecond, as an int from 0 through 999999.

int PyDateTime\_TIME\_GET\_FOLD(PyDateTime\_Time \*o)
:   Return the fold, as an int from 0 through 1.

PyObject \*PyDateTime\_TIME\_GET\_TZINFO(PyDateTime\_Time \*o)
:   Return the tzinfo (which may be `None`).

Macros to extract fields from time delta objects. The argument must be an
instance of `PyDateTime_Delta`, including subclasses. The argument must
not be `NULL`, and the type is not checked:

int PyDateTime\_DELTA\_GET\_DAYS(PyDateTime\_Delta \*o)
:   Return the number of days, as an int from -999999999 to 999999999.

int PyDateTime\_DELTA\_GET\_SECONDS(PyDateTime\_Delta \*o)
:   Return the number of seconds, as an int from 0 through 86399.

int PyDateTime\_DELTA\_GET\_MICROSECONDS(PyDateTime\_Delta \*o)
:   Return the number of microseconds, as an int from 0 through 999999.

Macros for the convenience of modules implementing the DB API:

PyObject \*PyDateTime\_FromTimestamp(PyObject \*args)
:   *Return value: New reference.*

    Create and return a new `datetime.datetime` object given an argument
    tuple suitable for passing to `datetime.datetime.fromtimestamp()`.

PyObject \*PyDate\_FromTimestamp(PyObject \*args)
:   *Return value: New reference.*

    Create and return a new `datetime.date` object given an argument
    tuple suitable for passing to `datetime.date.fromtimestamp()`.

# Internal data

The following symbols are exposed by the C API but should be considered
internal-only.

PyDateTime\_CAPSULE\_NAME
:   Name of the datetime capsule to pass to `PyCapsule_Import()`.

    Internal usage only. Use `PyDateTime_IMPORT` instead.
