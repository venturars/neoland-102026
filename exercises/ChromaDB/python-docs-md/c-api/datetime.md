---
page: c-api/datetime.html
title: DateTime Objects
area: c-api
kind: guide
---

<!-- anchor: datetime-objects | type: section -->
# DateTime Objects

Various date and time objects are supplied by the `datetime` module. Before using any of these functions, the header file `datetime.h` must be included in your source (note that this is not included by `Python.h`), and the macro `PyDateTime_IMPORT` must be invoked, usually as part of the module initialisation function. The macro puts a pointer to a C structure into a static variable, `PyDateTimeAPI`, that is used by the following macros.

<!-- anchor: c.PyDateTime_IMPORT | type: c macro -->
## `PyDateTime_IMPORT()`

Import the datetime C API.

On success, populate the `PyDateTimeAPI` pointer. On failure, set `PyDateTimeAPI` to `NULL` and set an exception. The caller must check if an error occurred via `PyErr_Occurred()`:

```c
PyDateTime_IMPORT;
if (PyErr_Occurred()) { /* cleanup */ }
```

**Warning:**

This is not compatible with subinterpreters.

Changed in version 3.15: This macro is now thread safe.

<!-- anchor: c.PyDateTime_CAPI | type: c type -->
## `type PyDateTime_CAPI`

Structure containing the fields for the datetime C API.

The fields of this structure are private and subject to change.

Do not use this directly; prefer `PyDateTime_*` APIs instead.

<!-- anchor: c.PyDateTimeAPI | type: c var -->
## `PyDateTime_CAPI *PyDateTimeAPI`

Dynamically allocated object containing the datetime C API.

This variable is only available once `PyDateTime_IMPORT` succeeds.

Changed in version 3.15: This variable should not be accessed directly as direct access is not thread-safe. Use `PyDateTime_IMPORT()` instead.

<!-- anchor: c.PyDateTime_Date | type: c type -->
## `type PyDateTime_Date`

This subtype of `PyObject` represents a Python date object.

<!-- anchor: c.PyDateTime_DateTime | type: c type -->
## `type PyDateTime_DateTime`

This subtype of `PyObject` represents a Python datetime object.

<!-- anchor: c.PyDateTime_Time | type: c type -->
## `type PyDateTime_Time`

This subtype of `PyObject` represents a Python time object.

<!-- anchor: c.PyDateTime_Delta | type: c type -->
## `type PyDateTime_Delta`

This subtype of `PyObject` represents the difference between two datetime values.

<!-- anchor: c.PyDateTime_DateType | type: c var -->
## `PyTypeObject PyDateTime_DateType`

This instance of `PyTypeObject` represents the Python date type; it is the same object as `datetime.date` in the Python layer.

<!-- anchor: c.PyDateTime_DateTimeType | type: c var -->
## `PyTypeObject PyDateTime_DateTimeType`

This instance of `PyTypeObject` represents the Python datetime type; it is the same object as `datetime.datetime` in the Python layer.

<!-- anchor: c.PyDateTime_TimeType | type: c var -->
## `PyTypeObject PyDateTime_TimeType`

This instance of `PyTypeObject` represents the Python time type; it is the same object as `datetime.time` in the Python layer.

<!-- anchor: c.PyDateTime_DeltaType | type: c var -->
## `PyTypeObject PyDateTime_DeltaType`

This instance of `PyTypeObject` represents the Python type for the difference between two datetime values; it is the same object as `datetime.timedelta` in the Python layer.

<!-- anchor: c.PyDateTime_TZInfoType | type: c var -->
## `PyTypeObject PyDateTime_TZInfoType`

This instance of `PyTypeObject` represents the Python time zone info type; it is the same object as `datetime.tzinfo` in the Python layer.

Macro for access to the UTC singleton:

<!-- anchor: c.PyDateTime_TimeZone_UTC | type: c var -->
## `PyObject *PyDateTime_TimeZone_UTC`

Returns the time zone singleton representing UTC, the same object as `datetime.timezone.utc`.

Added in version 3.7.

Type-check macros:

<!-- anchor: c.PyDate_Check | type: c function -->
## `int PyDate_Check(PyObject *ob)`

Return true if *ob* is of type `PyDateTime_DateType` or a subtype of `PyDateTime_DateType`. *ob* must not be `NULL`. This function always succeeds.

<!-- anchor: c.PyDate_CheckExact | type: c function -->
## `int PyDate_CheckExact(PyObject *ob)`

Return true if *ob* is of type `PyDateTime_DateType`. *ob* must not be `NULL`. This function always succeeds.

<!-- anchor: c.PyDateTime_Check | type: c function -->
## `int PyDateTime_Check(PyObject *ob)`

Return true if *ob* is of type `PyDateTime_DateTimeType` or a subtype of `PyDateTime_DateTimeType`. *ob* must not be `NULL`. This function always succeeds.

<!-- anchor: c.PyDateTime_CheckExact | type: c function -->
## `int PyDateTime_CheckExact(PyObject *ob)`

Return true if *ob* is of type `PyDateTime_DateTimeType`. *ob* must not be `NULL`. This function always succeeds.

<!-- anchor: c.PyTime_Check | type: c function -->
## `int PyTime_Check(PyObject *ob)`

Return true if *ob* is of type `PyDateTime_TimeType` or a subtype of `PyDateTime_TimeType`. *ob* must not be `NULL`. This function always succeeds.

<!-- anchor: c.PyTime_CheckExact | type: c function -->
## `int PyTime_CheckExact(PyObject *ob)`

Return true if *ob* is of type `PyDateTime_TimeType`. *ob* must not be `NULL`. This function always succeeds.

<!-- anchor: c.PyDelta_Check | type: c function -->
## `int PyDelta_Check(PyObject *ob)`

Return true if *ob* is of type `PyDateTime_DeltaType` or a subtype of `PyDateTime_DeltaType`. *ob* must not be `NULL`. This function always succeeds.

<!-- anchor: c.PyDelta_CheckExact | type: c function -->
## `int PyDelta_CheckExact(PyObject *ob)`

Return true if *ob* is of type `PyDateTime_DeltaType`. *ob* must not be `NULL`. This function always succeeds.

<!-- anchor: c.PyTZInfo_Check | type: c function -->
## `int PyTZInfo_Check(PyObject *ob)`

Return true if *ob* is of type `PyDateTime_TZInfoType` or a subtype of `PyDateTime_TZInfoType`. *ob* must not be `NULL`. This function always succeeds.

<!-- anchor: c.PyTZInfo_CheckExact | type: c function -->
## `int PyTZInfo_CheckExact(PyObject *ob)`

Return true if *ob* is of type `PyDateTime_TZInfoType`. *ob* must not be `NULL`. This function always succeeds.

Macros to create objects:

<!-- anchor: c.PyDate_FromDate | type: c function -->
## `PyObject *PyDate_FromDate(int year, int month, int day)`

*Return value: New reference.*

Return a `datetime.date` object with the specified year, month and day.

<!-- anchor: c.PyDateTime_FromDateAndTime | type: c function -->
## `PyObject *PyDateTime_FromDateAndTime(int year, int month, int day, int hour, int minute, int second, int usecond)`

*Return value: New reference.*

Return a `datetime.datetime` object with the specified year, month, day, hour, minute, second and microsecond.

<!-- anchor: c.PyDateTime_FromDateAndTimeAndFold | type: c function -->
## `PyObject *PyDateTime_FromDateAndTimeAndFold(int year, int month, int day, int hour, int minute, int second, int usecond, int fold)`

*Return value: New reference.*

Return a `datetime.datetime` object with the specified year, month, day, hour, minute, second, microsecond and fold.

Added in version 3.6.

<!-- anchor: c.PyTime_FromTime | type: c function -->
## `PyObject *PyTime_FromTime(int hour, int minute, int second, int usecond)`

*Return value: New reference.*

Return a `datetime.time` object with the specified hour, minute, second and microsecond.

<!-- anchor: c.PyTime_FromTimeAndFold | type: c function -->
## `PyObject *PyTime_FromTimeAndFold(int hour, int minute, int second, int usecond, int fold)`

*Return value: New reference.*

Return a `datetime.time` object with the specified hour, minute, second, microsecond and fold.

Added in version 3.6.

<!-- anchor: c.PyDelta_FromDSU | type: c function -->
## `PyObject *PyDelta_FromDSU(int days, int seconds, int useconds)`

*Return value: New reference.*

Return a `datetime.timedelta` object representing the given number of days, seconds and microseconds. Normalization is performed so that the resulting number of microseconds and seconds lie in the ranges documented for `datetime.timedelta` objects.

<!-- anchor: c.PyTimeZone_FromOffset | type: c function -->
## `PyObject *PyTimeZone_FromOffset(PyObject *offset)`

*Return value: New reference.*

Return a `datetime.timezone` object with an unnamed fixed offset represented by the *offset* argument.

Added in version 3.7.

<!-- anchor: c.PyTimeZone_FromOffsetAndName | type: c function -->
## `PyObject *PyTimeZone_FromOffsetAndName(PyObject *offset, PyObject *name)`

*Return value: New reference.*

Return a `datetime.timezone` object with a fixed offset represented by the *offset* argument and with tzname *name*.

Added in version 3.7.

Macros to extract fields from date objects. The argument must be an instance of `PyDateTime_Date`, including subclasses (such as `PyDateTime_DateTime`). The argument must not be `NULL`, and the type is not checked:

<!-- anchor: c.PyDateTime_GET_YEAR | type: c function -->
## `int PyDateTime_GET_YEAR(PyDateTime_Date *o)`

Return the year, as a positive int.

<!-- anchor: c.PyDateTime_GET_MONTH | type: c function -->
## `int PyDateTime_GET_MONTH(PyDateTime_Date *o)`

Return the month, as an int from 1 through 12.

<!-- anchor: c.PyDateTime_GET_DAY | type: c function -->
## `int PyDateTime_GET_DAY(PyDateTime_Date *o)`

Return the day, as an int from 1 through 31.

Macros to extract fields from datetime objects. The argument must be an instance of `PyDateTime_DateTime`, including subclasses. The argument must not be `NULL`, and the type is not checked:

<!-- anchor: c.PyDateTime_DATE_GET_HOUR | type: c function -->
## `int PyDateTime_DATE_GET_HOUR(PyDateTime_DateTime *o)`

Return the hour, as an int from 0 through 23.

<!-- anchor: c.PyDateTime_DATE_GET_MINUTE | type: c function -->
## `int PyDateTime_DATE_GET_MINUTE(PyDateTime_DateTime *o)`

Return the minute, as an int from 0 through 59.

<!-- anchor: c.PyDateTime_DATE_GET_SECOND | type: c function -->
## `int PyDateTime_DATE_GET_SECOND(PyDateTime_DateTime *o)`

Return the second, as an int from 0 through 59.

<!-- anchor: c.PyDateTime_DATE_GET_MICROSECOND | type: c function -->
## `int PyDateTime_DATE_GET_MICROSECOND(PyDateTime_DateTime *o)`

Return the microsecond, as an int from 0 through 999999.

<!-- anchor: c.PyDateTime_DATE_GET_FOLD | type: c function -->
## `int PyDateTime_DATE_GET_FOLD(PyDateTime_DateTime *o)`

Return the fold, as an int from 0 through 1.

Added in version 3.6.

<!-- anchor: c.PyDateTime_DATE_GET_TZINFO | type: c function -->
## `PyObject *PyDateTime_DATE_GET_TZINFO(PyDateTime_DateTime *o)`

Return the tzinfo (which may be `None`).

Added in version 3.10.

Macros to extract fields from time objects. The argument must be an instance of `PyDateTime_Time`, including subclasses. The argument must not be `NULL`, and the type is not checked:

<!-- anchor: c.PyDateTime_TIME_GET_HOUR | type: c function -->
## `int PyDateTime_TIME_GET_HOUR(PyDateTime_Time *o)`

Return the hour, as an int from 0 through 23.

<!-- anchor: c.PyDateTime_TIME_GET_MINUTE | type: c function -->
## `int PyDateTime_TIME_GET_MINUTE(PyDateTime_Time *o)`

Return the minute, as an int from 0 through 59.

<!-- anchor: c.PyDateTime_TIME_GET_SECOND | type: c function -->
## `int PyDateTime_TIME_GET_SECOND(PyDateTime_Time *o)`

Return the second, as an int from 0 through 59.

<!-- anchor: c.PyDateTime_TIME_GET_MICROSECOND | type: c function -->
## `int PyDateTime_TIME_GET_MICROSECOND(PyDateTime_Time *o)`

Return the microsecond, as an int from 0 through 999999.

<!-- anchor: c.PyDateTime_TIME_GET_FOLD | type: c function -->
## `int PyDateTime_TIME_GET_FOLD(PyDateTime_Time *o)`

Return the fold, as an int from 0 through 1.

Added in version 3.6.

<!-- anchor: c.PyDateTime_TIME_GET_TZINFO | type: c function -->
## `PyObject *PyDateTime_TIME_GET_TZINFO(PyDateTime_Time *o)`

Return the tzinfo (which may be `None`).

Added in version 3.10.

Macros to extract fields from time delta objects. The argument must be an instance of `PyDateTime_Delta`, including subclasses. The argument must not be `NULL`, and the type is not checked:

<!-- anchor: c.PyDateTime_DELTA_GET_DAYS | type: c function -->
## `int PyDateTime_DELTA_GET_DAYS(PyDateTime_Delta *o)`

Return the number of days, as an int from -999999999 to 999999999.

Added in version 3.3.

<!-- anchor: c.PyDateTime_DELTA_GET_SECONDS | type: c function -->
## `int PyDateTime_DELTA_GET_SECONDS(PyDateTime_Delta *o)`

Return the number of seconds, as an int from 0 through 86399.

Added in version 3.3.

<!-- anchor: c.PyDateTime_DELTA_GET_MICROSECONDS | type: c function -->
## `int PyDateTime_DELTA_GET_MICROSECONDS(PyDateTime_Delta *o)`

Return the number of microseconds, as an int from 0 through 999999.

Added in version 3.3.

Macros for the convenience of modules implementing the DB API:

<!-- anchor: c.PyDateTime_FromTimestamp | type: c function -->
## `PyObject *PyDateTime_FromTimestamp(PyObject *args)`

*Return value: New reference.*

Create and return a new `datetime.datetime` object given an argument tuple suitable for passing to `datetime.datetime.fromtimestamp()`.

<!-- anchor: c.PyDate_FromTimestamp | type: c function -->
## `PyObject *PyDate_FromTimestamp(PyObject *args)`

*Return value: New reference.*

Create and return a new `datetime.date` object given an argument tuple suitable for passing to `datetime.date.fromtimestamp()`.

<!-- anchor: internal-data | type: section -->
# Internal data

The following symbols are exposed by the C API but should be considered internal-only.

<!-- anchor: c.PyDateTime_CAPSULE_NAME | type: c macro -->
## `PyDateTime_CAPSULE_NAME`

Name of the datetime capsule to pass to `PyCapsule_Import()`.

Internal usage only. Use `PyDateTime_IMPORT` instead.
