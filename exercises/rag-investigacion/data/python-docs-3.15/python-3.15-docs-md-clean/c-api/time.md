# PyTime C API

The clock C API provides access to system clocks.
It is similar to the Python `time` module.

For C API related to the `datetime` module, see DateTime Objects.

## Types

type PyTime\_t
:   A timestamp or duration in nanoseconds, represented as a signed 64-bit
    integer.

    The reference point for timestamps depends on the clock used. For example,
    `PyTime_Time()` returns timestamps relative to the UNIX epoch.

    The supported range is around [-292.3 years; +292.3 years].
    Using the Unix epoch (January 1st, 1970) as reference, the supported date
    range is around [1677-09-21; 2262-04-11].
    The exact limits are exposed as constants:

PyTime\_t PyTime\_MIN
:   Minimum value of `PyTime_t`.

PyTime\_t PyTime\_MAX
:   Maximum value of `PyTime_t`.

## Clock Functions

The following functions take a pointer to a PyTime\_t that they
set to the value of a particular clock.
Details of each clock are given in the documentation of the corresponding
Python function.

The functions return `0` on success, or `-1` (with an exception set)
on failure.

On integer overflow, they set the `PyExc_OverflowError` exception and
set `*result` to the value clamped to the `[PyTime_MIN; PyTime_MAX]`
range.
(On current systems, integer overflows are likely caused by misconfigured
system time.)

As any other C API (unless otherwise specified), the functions must be called
with an attached thread state.

int PyTime\_Monotonic(PyTime\_t \*result)
:   Read the monotonic clock.
    See `time.monotonic()` for important details on this clock.

int PyTime\_PerfCounter(PyTime\_t \*result)
:   Read the performance counter.
    See `time.perf_counter()` for important details on this clock.

int PyTime\_Time(PyTime\_t \*result)
:   Read the “wall clock” time.
    See `time.time()` for details important on this clock.

## Raw Clock Functions

Similar to clock functions, but don’t set an exception on error and don’t
require the caller to have an attached thread state.

On success, the functions return `0`.

On failure, they set `*result` to `0` and return `-1`, *without* setting
an exception. To get the cause of the error, attach a thread state,
and call the regular (non-`Raw`) function. Note that the regular function may succeed after
the `Raw` one failed.

int PyTime\_MonotonicRaw(PyTime\_t \*result)
:   Similar to `PyTime_Monotonic()`,
    but don’t set an exception on error and don’t require an attached thread state.

int PyTime\_PerfCounterRaw(PyTime\_t \*result)
:   Similar to `PyTime_PerfCounter()`,
    but don’t set an exception on error and don’t require an attached thread state.

int PyTime\_TimeRaw(PyTime\_t \*result)
:   Similar to `PyTime_Time()`,
    but don’t set an exception on error and don’t require an attached thread state.

## Conversion functions

double PyTime\_AsSecondsDouble(PyTime\_t t)
:   Convert a timestamp to a number of seconds as a C double.

    The function cannot fail, but note that double has limited
    accuracy for large values.
