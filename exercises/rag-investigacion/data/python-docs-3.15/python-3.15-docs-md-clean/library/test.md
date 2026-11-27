# `test` — Regression tests package for Python

Note

The `test` package is meant for internal use by Python only. It is
documented for the benefit of the core developers of Python. Any use of
this package outside of Python’s standard library is discouraged as code
mentioned here can change or be removed without notice between releases of
Python.

---

The `test` package contains all regression tests for Python as well as the
modules `test.support` and `test.regrtest`.
`test.support` is used to enhance your tests while
`test.regrtest` drives the testing suite.

Each module in the `test` package whose name starts with `test_` is a
testing suite for a specific module or feature. All new tests should be written
using the `unittest` or `doctest` module. Some older tests are
written using a “traditional” testing style that compares output printed to
`sys.stdout`; this style of test is considered deprecated.

See also

Module `unittest`
:   Writing PyUnit regression tests.

Module `doctest`
:   Tests embedded in documentation strings.

## Writing Unit Tests for the `test` package

It is preferred that tests that use the `unittest` module follow a few
guidelines. One is to name the test module by starting it with `test_` and end
it with the name of the module being tested. The test methods in the test module
should start with `test_` and end with a description of what the method is
testing. This is needed so that the methods are recognized by the test driver as
test methods. Also, no documentation string for the method should be included. A
comment (such as `# Tests function returns only True or False`) should be used
to provide documentation for test methods. This is done because documentation
strings get printed out if they exist and thus what test is being run is not
stated.

A basic boilerplate is often used:

```
import unittest
from test import support

class MyTestCase1(unittest.TestCase):

    # Only use setUp() and tearDown() if necessary

    def setUp(self):
        ... code to execute in preparation for tests ...

    def tearDown(self):
        ... code to execute to clean up after tests ...

    def test_feature_one(self):
        # Test feature one.
        ... testing code ...

    def test_feature_two(self):
        # Test feature two.
        ... testing code ...

    ... more test methods ...

class MyTestCase2(unittest.TestCase):
    ... same structure as MyTestCase1 ...

... more test classes ...

if __name__ == '__main__':
    unittest.main()
```

This code pattern allows the testing suite to be run by `test.regrtest`,
on its own as a script that supports the `unittest` CLI, or via the
`python -m unittest` CLI.

The goal for regression testing is to try to break code. This leads to a few
guidelines to be followed:

- The testing suite should exercise all classes, functions, and constants. This
  includes not just the external API that is to be presented to the outside
  world but also “private” code.
- Whitebox testing (examining the code being tested when the tests are being
  written) is preferred. Blackbox testing (testing only the published user
  interface) is not complete enough to make sure all boundary and edge cases
  are tested.
- Make sure all possible values are tested including invalid ones. This makes
  sure that not only all valid values are acceptable but also that improper
  values are handled correctly.
- Exhaust as many code paths as possible. Test where branching occurs and thus
  tailor input to make sure as many different paths through the code are taken.
- Add an explicit test for any bugs discovered for the tested code. This will
  make sure that the error does not crop up again if the code is changed in the
  future.
- Make sure to clean up after your tests (such as close and remove all temporary
  files).
- If a test is dependent on a specific condition of the operating system then
  verify the condition already exists before attempting the test.
- Import as few modules as possible and do it as soon as possible. This
  minimizes external dependencies of tests and also minimizes possible anomalous
  behavior from side-effects of importing a module.
- Try to maximize code reuse. On occasion, tests will vary by something as small
  as what type of input is used. Minimize code duplication by subclassing a
  basic test class with a class that specifies the input:

  ```
  class TestFuncAcceptsSequencesMixin:

      func = mySuperWhammyFunction

      def test_func(self):
          self.func(self.arg)

  class AcceptLists(TestFuncAcceptsSequencesMixin, unittest.TestCase):
      arg = [1, 2, 3]

  class AcceptStrings(TestFuncAcceptsSequencesMixin, unittest.TestCase):
      arg = 'abc'

  class AcceptTuples(TestFuncAcceptsSequencesMixin, unittest.TestCase):
      arg = (1, 2, 3)
  ```

  When using this pattern, remember that all classes that inherit from
  `unittest.TestCase` are run as tests. The `TestFuncAcceptsSequencesMixin` class in the example above
  does not have any data and so can’t be run by itself, thus it does not
  inherit from `unittest.TestCase`.

See also

Test Driven Development
:   A book by Kent Beck on writing tests before code.

## Running tests using the command-line interface

The `test` package can be run as a script to drive Python’s regression
test suite, thanks to the `-m` option: **python -m test**. Under
the hood, it uses `test.regrtest`; the call **python -m
test.regrtest** used in previous Python versions still works. Running the
script by itself automatically starts running all regression tests in the
`test` package. It does this by finding modules and packages whose names
start with `test_`, importing each one, and loading its tests with
`unittest.TestLoader.loadTestsFromModule()`. See the
load\_tests protocol for how a module or package
can customize what is loaded. Defining a module-level `test_main()` function
is not supported and causes the test to fail. The names of tests to
execute may also be passed to the script. Specifying a single
regression test (**python -m test test\_spam**) will minimize output and
only print whether the test passed or failed.

Running `test` directly allows what resources are available for
tests to use to be set. You do this by using the `-u` command-line
option. Specifying `all` as the value for the `-u` option enables all
possible resources: **python -m test -uall**.
If all but one resource is desired (a more common case), a
comma-separated list of resources that are not desired may be listed after
`all`. The command **python -m test -uall,-audio,-largefile**
will run `test` with all resources except the `audio` and
`largefile` resources. For a list of all resources and more command-line
options, run **python -m test -h**.

Some other ways to execute the regression tests depend on what platform the
tests are being executed on. On Unix, you can run **make test** at the
top-level directory where Python was built. On Windows,
executing **rt.bat** from your `PCbuild` directory will run all
regression tests.

# `test.support` — Utilities for the Python test suite

The `test.support` module provides support for Python’s regression
test suite.

Note

`test.support` is not a public module. It is documented here to help
Python developers write tests. The API of this module is subject to change
without backwards compatibility concerns between releases.

This module defines the following exceptions:

exception test.support.TestFailed
:   Exception to be raised when a test fails. This is deprecated in favor of
    `unittest`-based tests and `unittest.TestCase`’s assertion
    methods.

exception test.support.ResourceDenied
:   Subclass of `unittest.SkipTest`. Raised when a resource (such as a
    network connection) is not available. Raised by the `requires()`
    function.

The `test.support` module defines the following constants:

test.support.verbose
:   `True` when verbose output is enabled. Should be checked when more
    detailed information is desired about a running test. *verbose* is set by
    `test.regrtest`.

test.support.is\_jython
:   `True` if the running interpreter is Jython.

test.support.is\_android
:   `True` if `sys.platform` is `android`.

test.support.is\_emscripten
:   `True` if `sys.platform` is `emscripten`.

test.support.is\_wasi
:   `True` if `sys.platform` is `wasi`.

test.support.is\_apple\_mobile
:   `True` if `sys.platform` is `ios`, `tvos`, or `watchos`.

test.support.is\_apple
:   `True` if `sys.platform` is `darwin` or `is_apple_mobile` is `True`.

test.support.unix\_shell
:   Path for shell if not on Windows; otherwise `None`.

test.support.LOOPBACK\_TIMEOUT
:   Timeout in seconds for tests using a network server listening on the network
    local loopback interface like `127.0.0.1`.

    The timeout is long enough to prevent test failure: it takes into account
    that the client and the server can run in different threads or even
    different processes.

    The timeout should be long enough for `connect()`,
    `recv()` and `send()` methods of
    `socket.socket`.

    Its default value is 10 seconds.

    See also `INTERNET_TIMEOUT`.

test.support.INTERNET\_TIMEOUT
:   Timeout in seconds for network requests going to the internet.

    The timeout is short enough to prevent a test to wait for too long if the
    internet request is blocked for whatever reason.

    Usually, a timeout using `INTERNET_TIMEOUT` should not mark a test as
    failed, but skip the test instead: see
    `transient_internet()`.

    Its default value is 1 minute.

    See also `LOOPBACK_TIMEOUT`.

test.support.SHORT\_TIMEOUT
:   Timeout in seconds to mark a test as failed if the test takes “too long”.

    The timeout value depends on the regrtest `--timeout` command line option.

    If a test using `SHORT_TIMEOUT` starts to fail randomly on slow
    buildbots, use `LONG_TIMEOUT` instead.

    Its default value is 30 seconds.

test.support.LONG\_TIMEOUT
:   Timeout in seconds to detect when a test hangs.

    It is long enough to reduce the risk of test failure on the slowest Python
    buildbots. It should not be used to mark a test as failed if the test takes
    “too long”. The timeout value depends on the regrtest `--timeout` command
    line option.

    Its default value is 5 minutes.

    See also `LOOPBACK_TIMEOUT`, `INTERNET_TIMEOUT` and
    `SHORT_TIMEOUT`.

test.support.PGO
:   Set when tests can be skipped when they are not useful for PGO.

test.support.PIPE\_MAX\_SIZE
:   A constant that is likely larger than the underlying OS pipe buffer size,
    to make writes blocking.

test.support.Py\_DEBUG
:   `True` if Python was built with the `Py_DEBUG` macro
    defined, that is, if
    Python was built in debug mode.

test.support.SOCK\_MAX\_SIZE
:   A constant that is likely larger than the underlying OS socket buffer size,
    to make writes blocking.

test.support.TEST\_SUPPORT\_DIR
:   Set to the top level directory that contains `test.support`.

test.support.TEST\_HOME\_DIR
:   Set to the top level directory for the test package.

test.support.TEST\_DATA\_DIR
:   Set to the `data` directory within the test package.

test.support.MAX\_Py\_ssize\_t
:   Set to `sys.maxsize` for big memory tests.

test.support.max\_memuse
:   Set by `set_memlimit()` as the memory limit for big memory tests.
    Limited by `MAX_Py_ssize_t`.

test.support.real\_max\_memuse
:   Set by `set_memlimit()` as the memory limit for big memory tests. Not
    limited by `MAX_Py_ssize_t`.

test.support.MISSING\_C\_DOCSTRINGS
:   Set to `True` if Python is built without docstrings (the
    `WITH_DOC_STRINGS` macro is not defined).
    See the `configure --without-doc-strings` option.

    See also the `HAVE_DOCSTRINGS` variable.

test.support.HAVE\_DOCSTRINGS
:   Set to `True` if function docstrings are available.
    See the `python -OO` option, which strips docstrings of functions implemented in Python.

    See also the `MISSING_C_DOCSTRINGS` variable.

test.support.TEST\_HTTP\_URL
:   Define the URL of a dedicated HTTP server for the network tests.

test.support.ALWAYS\_EQ
:   Object that is equal to anything. Used to test mixed type comparison.

test.support.NEVER\_EQ
:   Object that is not equal to anything (even to `ALWAYS_EQ`).
    Used to test mixed type comparison.

test.support.LARGEST
:   Object that is greater than anything (except itself).
    Used to test mixed type comparison.

test.support.SMALLEST
:   Object that is less than anything (except itself).
    Used to test mixed type comparison.

The `test.support` module defines the following functions:

test.support.busy\_retry(*timeout*, *err\_msg=None*, */*, *\**, *error=True*)
:   Run the loop body until `break` stops the loop.

    After *timeout* seconds, raise an `AssertionError` if *error* is true,
    or just stop the loop if *error* is false.

    Example:

    ```
    for _ in support.busy_retry(support.SHORT_TIMEOUT):
        if check():
            break
    ```

    Example of error=False usage:

    ```
    for _ in support.busy_retry(support.SHORT_TIMEOUT, error=False):
        if check():
            break
    else:
        raise RuntimeError('my custom error')
    ```

test.support.sleeping\_retry(*timeout*, *err\_msg=None*, */*, *\**, *init\_delay=0.010*, *max\_delay=1.0*, *error=True*)
:   Wait strategy that applies exponential backoff.

    Run the loop body until `break` stops the loop. Sleep at each loop
    iteration, but not at the first iteration. The sleep delay is doubled at
    each iteration (up to *max\_delay* seconds).

    See `busy_retry()` documentation for the parameters usage.

    Example raising an exception after SHORT\_TIMEOUT seconds:

    ```
    for _ in support.sleeping_retry(support.SHORT_TIMEOUT):
        if check():
            break
    ```

    Example of error=False usage:

    ```
    for _ in support.sleeping_retry(support.SHORT_TIMEOUT, error=False):
        if check():
            break
    else:
        raise RuntimeError('my custom error')
    ```

test.support.is\_resource\_enabled(*resource*)
:   Return `True` if *resource* is enabled and available. The list of
    available resources is only set when `test.regrtest` is executing the
    tests.

test.support.get\_resource\_value(*resource*)
:   Return the value specified for *resource* (as `-u resource=value`).
    Return `None` if *resource* is disabled or no value is specified.

test.support.python\_is\_optimized()
:   Return `True` if Python was not built with `-O0` or `-Og`.

test.support.with\_pymalloc()
:   Return `True` if Python was built with pymalloc enabled
    and is not a free-threaded build.

test.support.requires(*resource*, *msg=None*)
:   Raise `ResourceDenied` if *resource* is not available. *msg* is the
    argument to `ResourceDenied` if it is raised. Always returns
    `True` if called by a function whose `__name__` is `'__main__'`.
    Used when tests are executed by `test.regrtest`.

test.support.sortdict(*dict*)
:   Return a repr of *dict* with keys sorted.

test.support.findfile(*filename*, *subdir=None*)
:   Return the path to the file named *filename*. If no match is found
    *filename* is returned. This does not equal a failure since it could be the
    path to the file.

    Setting *subdir* indicates a relative path to use to find the file
    rather than looking directly in the path directories.

test.support.get\_pagesize()
:   Get size of a page in bytes.

test.support.setswitchinterval(*interval*)
:   Set the `sys.setswitchinterval()` to the given *interval*. Defines
    a minimum interval for Android systems to prevent the system from hanging.

test.support.check\_impl\_detail(*\*\*guards*)
:   Use this check to guard CPython’s implementation-specific tests or to
    run them only on the implementations guarded by the arguments. This
    function returns `True` or `False` depending on the host platform.
    Example usage:

    ```
    check_impl_detail()               # Only on CPython (default).
    check_impl_detail(jython=True)    # Only on Jython.
    check_impl_detail(cpython=False)  # Everywhere except CPython.
    ```

test.support.set\_memlimit(*limit*)
:   Set the values for `max_memuse` and `real_max_memuse` for big
    memory tests.

test.support.record\_original\_stdout(*stdout*)
:   Store the value from *stdout*. It is meant to hold the stdout at the
    time the regrtest began.

test.support.get\_original\_stdout()
:   Return the original stdout set by `record_original_stdout()` or
    `sys.stdout` if it’s not set.

test.support.args\_from\_interpreter\_flags()
:   Return a list of command line arguments reproducing the current settings
    in `sys.flags` and `sys.warnoptions`.

test.support.optim\_args\_from\_interpreter\_flags()
:   Return a list of command line arguments reproducing the current
    optimization settings in `sys.flags`.

test.support.captured\_stdin()

test.support.captured\_stdout()

test.support.captured\_stderr()
:   A context managers that temporarily replaces the named stream with
    `io.StringIO` object.

    Example use with output streams:

    ```
    with captured_stdout() as stdout, captured_stderr() as stderr:
        print("hello")
        print("error", file=sys.stderr)
    assert stdout.getvalue() == "hello\n"
    assert stderr.getvalue() == "error\n"
    ```

    Example use with input stream:

    ```
    with captured_stdin() as stdin:
        stdin.write('hello\n')
        stdin.seek(0)
        # call test code that consumes from sys.stdin
        captured = input()
    self.assertEqual(captured, "hello")
    ```

test.support.disable\_faulthandler()
:   A context manager that temporary disables `faulthandler`.

test.support.gc\_collect()
:   Force as many objects as possible to be collected. This is needed because
    timely deallocation is not guaranteed by the garbage collector. This means
    that `__del__` methods may be called later than expected and weakrefs
    may remain alive for longer than expected.

test.support.disable\_gc()
:   A context manager that disables the garbage collector on entry. On
    exit, the garbage collector is restored to its prior state.

test.support.swap\_attr(*obj*, *attr*, *new\_val*)
:   Context manager to swap out an attribute with a new object.

    Usage:

    ```
    with swap_attr(obj, "attr", 5):
        ...
    ```

    This will set `obj.attr` to 5 for the duration of the `with` block,
    restoring the old value at the end of the block. If `attr` doesn’t
    exist on `obj`, it will be created and then deleted at the end of the
    block.

    The old value (or `None` if it doesn’t exist) will be assigned to the
    target of the “as” clause, if there is one.

test.support.swap\_item(*obj*, *attr*, *new\_val*)
:   Context manager to swap out an item with a new object.

    Usage:

    ```
    with swap_item(obj, "item", 5):
        ...
    ```

    This will set `obj["item"]` to 5 for the duration of the `with` block,
    restoring the old value at the end of the block. If `item` doesn’t
    exist on `obj`, it will be created and then deleted at the end of the
    block.

    The old value (or `None` if it doesn’t exist) will be assigned to the
    target of the “as” clause, if there is one.

test.support.flush\_std\_streams()
:   Call the `flush()` method on `sys.stdout` and then on
    `sys.stderr`. It can be used to make sure that the logs order is
    consistent before writing into stderr.

test.support.print\_warning(*msg*)
:   Print a warning into `sys.__stderr__`. Format the message as:
    `f"Warning -- {msg}"`. If *msg* is made of multiple lines, add
    `"Warning -- "` prefix to each line.

test.support.wait\_process(*pid*, *\**, *exitcode*, *timeout=None*)
:   Wait until process *pid* completes and check that the process exit code is
    *exitcode*.

    Raise an `AssertionError` if the process exit code is not equal to
    *exitcode*.

    If the process runs longer than *timeout* seconds (`SHORT_TIMEOUT` by
    default), kill the process and raise an `AssertionError`. The timeout
    feature is not available on Windows.

test.support.calcobjsize(*fmt*)
:   Return the size of the `PyObject` whose structure members are
    defined by *fmt*. The returned value includes the size of the Python object header and alignment.

test.support.calcvobjsize(*fmt*)
:   Return the size of the `PyVarObject` whose structure members are
    defined by *fmt*. The returned value includes the size of the Python object header and alignment.

test.support.checksizeof(*test*, *o*, *size*)
:   For testcase *test*, assert that the `sys.getsizeof` for *o* plus the GC
    header size equals *size*.

@test.support.anticipate\_failure(*condition*)
:   A decorator to conditionally mark tests with
    `@unittest.expectedFailure`. Any use of this decorator should
    have an associated comment identifying the relevant tracker issue.

test.support.system\_must\_validate\_cert(*f*)
:   A decorator that skips the decorated test on TLS certification validation failures.

@test.support.run\_with\_locale(*catstr*, *\*locales*)
:   A decorator for running a function in a different locale, correctly
    resetting it after it has finished. *catstr* is the locale category as
    a string (for example `"LC_ALL"`). The *locales* passed will be tried
    sequentially, and the first valid locale will be used.

@test.support.run\_with\_tz(*tz*)
:   A decorator for running a function in a specific timezone, correctly
    resetting it after it has finished.

@test.support.requires\_freebsd\_version(*\*min\_version*)
:   Decorator for the minimum version when running test on FreeBSD. If the
    FreeBSD version is less than the minimum, the test is skipped.

@test.support.requires\_linux\_version(*\*min\_version*)
:   Decorator for the minimum version when running test on Linux. If the
    Linux version is less than the minimum, the test is skipped.

@test.support.requires\_mac\_version(*\*min\_version*)
:   Decorator for the minimum version when running test on macOS. If the
    macOS version is less than the minimum, the test is skipped.

@test.support.requires\_gil\_enabled
:   Decorator for skipping tests on the free-threaded build. If the
    GIL is disabled, the test is skipped.

@test.support.requires\_IEEE\_754
:   Decorator for skipping tests on non-IEEE 754 platforms.

@test.support.requires\_zlib
:   Decorator for skipping tests if `zlib` doesn’t exist.

@test.support.requires\_gzip
:   Decorator for skipping tests if `gzip` doesn’t exist.

@test.support.requires\_bz2
:   Decorator for skipping tests if `bz2` doesn’t exist.

@test.support.requires\_lzma
:   Decorator for skipping tests if `lzma` doesn’t exist.

@test.support.requires\_resource(*resource*)
:   Decorator for skipping tests if *resource* is not available.

@test.support.requires\_docstrings
:   Decorator for only running the test if `HAVE_DOCSTRINGS`.

@test.support.requires\_limited\_api
:   Decorator for only running the test if Limited C API
    is available.

@test.support.cpython\_only
:   Decorator for tests only applicable to CPython.

@test.support.impl\_detail(*msg=None*, *\*\*guards*)
:   Decorator for invoking `check_impl_detail()` on *guards*. If that
    returns `False`, then uses *msg* as the reason for skipping the test.

@test.support.thread\_unsafe(*reason=None*)
:   Decorator for marking tests as thread-unsafe. This test always runs in one
    thread even when invoked with `--parallel-threads`.

@test.support.no\_tracing
:   Decorator to temporarily turn off tracing for the duration of the test.

@test.support.refcount\_test
:   Decorator for tests which involve reference counting. The decorator does
    not run the test if it is not run by CPython. Any trace function is unset
    for the duration of the test to prevent unexpected refcounts caused by
    the trace function.

@test.support.bigmemtest(*size*, *memuse*, *dry\_run=True*)
:   Decorator for bigmem tests.

    *size* is a requested size for the test (in arbitrary, test-interpreted
    units.) *memuse* is the number of bytes per unit for the test, or a good
    estimate of it. For example, a test that needs two byte buffers, of 4 GiB
    each, could be decorated with `@bigmemtest(size=_4G, memuse=2)`.

    The *size* argument is normally passed to the decorated test method as an
    extra argument. If *dry\_run* is `True`, the value passed to the test
    method may be less than the requested value. If *dry\_run* is `False`, it
    means the test doesn’t support dummy runs when `-M` is not specified.

@test.support.bigaddrspacetest
:   Decorator for tests that fill the address space.

test.support.linked\_to\_musl()
:   Return `False` if there is no evidence the interpreter was compiled with
    `musl`, otherwise return a version triple, either `(0, 0, 0)` if the
    version is unknown, or the actual version if it is known. Intended for use
    in `skip` decorators. `emscripten` and `wasi` are assumed to be
    compiled with `musl`; otherwise `platform.libc_ver` is checked.

test.support.check\_syntax\_error(*testcase*, *statement*, *errtext=''*, *\**, *lineno=None*, *offset=None*)
:   Test for syntax errors in *statement* by attempting to compile *statement*.
    *testcase* is the `unittest` instance for the test. *errtext* is the
    regular expression which should match the string representation of the
    raised `SyntaxError`. If *lineno* is not `None`, compares to
    the line of the exception. If *offset* is not `None`, compares to
    the offset of the exception.

test.support.open\_urlresource(*url*, *\*args*, *\*\*kw*)
:   Open *url*. If open fails, raises `TestFailed`.

test.support.reap\_children()
:   Call this from `setUp()`,
    `tearDown()`, or `tearDownModule()` in tests
    that start subprocesses. This will help ensure that no extra children
    (zombies) stick around to hog resources and create problems when looking
    for refleaks.

test.support.get\_attribute(*obj*, *name*)
:   Get an attribute, raising `unittest.SkipTest` if `AttributeError`
    is raised.

test.support.catch\_unraisable\_exception()
:   Context manager catching unraisable exception using
    `sys.unraisablehook()`.

    Storing the exception value (`cm.unraisable.exc_value`) creates a
    reference cycle. The reference cycle is broken explicitly when the context
    manager exits.

    Storing the object (`cm.unraisable.object`) can resurrect it if it is set
    to an object which is being finalized. Exiting the context manager clears
    the stored object.

    Usage:

    ```
    with support.catch_unraisable_exception() as cm:
        # code creating an "unraisable exception"
        ...

        # check the unraisable exception: use cm.unraisable
        ...

    # cm.unraisable attribute no longer exists at this point
    # (to break a reference cycle)
    ```

test.support.load\_package\_tests(*pkg\_dir*, *loader*, *standard\_tests*, *pattern*)
:   Generic implementation of the `unittest` `load_tests` protocol for
    use in test packages. *pkg\_dir* is the root directory of the package;
    *loader*, *standard\_tests*, and *pattern* are the arguments expected by
    `load_tests`. In simple cases, the test package’s `__init__.py`
    can be the following:

    ```
    import os
    from test.support import load_package_tests

    def load_tests(*args):
        return load_package_tests(os.path.dirname(__file__), *args)
    ```

test.support.detect\_api\_mismatch(*ref\_api*, *other\_api*, *\**, *ignore=()*)
:   Returns the set of attributes, functions or methods of *ref\_api* not
    found on *other\_api*, except for a defined list of items to be
    ignored in this check specified in *ignore*.

    By default this skips private attributes beginning with ‘\_’ but
    includes all magic methods, i.e. those starting and ending in ‘\_\_’.

test.support.patch(*test\_instance*, *object\_to\_patch*, *attr\_name*, *new\_value*)
:   Override *object\_to\_patch.attr\_name* with *new\_value*. Also add
    cleanup procedure to *test\_instance* to restore *object\_to\_patch* for
    *attr\_name*. The *attr\_name* should be a valid attribute for
    *object\_to\_patch*.

test.support.run\_in\_subinterp(*code*)
:   Run *code* in subinterpreter. Raise `unittest.SkipTest` if
    `tracemalloc` is enabled.

@test.support.isolation.runInSubprocess(*\**, *options=()*, *env=None*, *timeout=None*)
:   Decorator that runs the decorated test in a fresh interpreter subprocess, in
    isolation, so that it does not share global or interpreter state with the
    rest of the test run. It can decorate a test method or a whole
    `TestCase` subclass. Decorated methods must take no extra
    arguments. A failure, error or skip in the subprocess is reported for the
    corresponding test, and individual `subtests` that fail or are skipped are reported
    individually. A reported failure or error shows the original subprocess
    traceback as the cause of the exception.

    When a **method** is decorated, only that method runs in a subprocess; all
    fixtures (`setUp()` / `tearDown()`,
    `setUpClass()` / `tearDownClass()`
    and `setUpModule()` / `tearDownModule()`) run both in the parent process
    (as usual) and in the subprocess around the method.

    When a **class** is decorated, the whole class runs in a single subprocess,
    and `setUpClass()`,
    `tearDownClass()`, `setUp()`
    and `tearDown()` run once each in the subprocess and
    are skipped in the parent process. A failure or skip of
    `setUpClass()` in the subprocess is reported for the
    whole class. `setUpModule()` cannot be controlled by a class decorator,
    so it still runs in the parent process too; test it with
    `runningInSubprocess` if needed.

    The subprocess inherits the enabled resources (`-u`), memory limit
    (`-M`) and verbosity (`-v`) of the parent test run, so that
    `requires_resource()`, `requires()`,
    `bigmemtest()` and the like behave consistently in both
    processes.

    *options* is a sequence of interpreter command line options
    to run the subprocess with,
    and *env* is a mapping of environment variables to set in it,
    on top of the inherited environment.
    A value of `None` in *env* unsets the variable.
    Note that `-E` and `-I` make the subprocess ignore
    the `PYTHON*` environment variables, including `PYTHONPATH`.

    *timeout* is the number of seconds to wait for the subprocess;
    the test is reported as an error if it does not complete in time.
    By default there is no timeout,
    and a hung test is left to the timeout of the test runner.

    The test is skipped on platforms without subprocess support.

test.support.isolation.runningInSubprocess
:   `True` while the code runs in the isolated subprocess spawned by
    `runInSubprocess()`, and `False` otherwise (including in the parent
    process and in a normal, non-isolated test run). Fixtures such as
    `setUp()`, `tearDown()`,
    `setUpClass()`, `tearDownClass()`,
    `setUpModule()` and `tearDownModule()` can test it to choose which code
    to run in the subprocess.

test.support.check\_free\_after\_iterating(*test*, *iter*, *cls*, *args=()*)
:   Assert instances of *cls* are deallocated after iterating.

test.support.missing\_compiler\_executable(*cmd\_names=[]*)
:   Check for the existence of the compiler executables whose names are listed
    in *cmd\_names* or all the compiler executables when *cmd\_names* is empty
    and return the first missing executable or `None` when none is found
    missing.

test.support.check\_\_all\_\_(*test\_case*, *module*, *name\_of\_module=None*, *extra=()*, *not\_exported=()*)
:   Assert that the `__all__` variable of *module* contains all public names.

    The module’s public names (its API) are detected automatically
    based on whether they match the public name convention and were defined in
    *module*.

    The *name\_of\_module* argument can specify (as a string or tuple thereof) what
    module(s) an API could be defined in order to be detected as a public
    API. One case for this is when *module* imports part of its public API from
    other modules, possibly a C backend (like `csv` and its `_csv`).

    The *extra* argument can be a set of names that wouldn’t otherwise be automatically
    detected as “public”, like objects without a proper `__module__`
    attribute. If provided, it will be added to the automatically detected ones.

    The *not\_exported* argument can be a set of names that must not be treated
    as part of the public API even though their names indicate otherwise.

    Example use:

    ```
    import bar
    import foo
    import unittest
    from test import support

    class MiscTestCase(unittest.TestCase):
        def test__all__(self):
            support.check__all__(self, foo)

    class OtherTestCase(unittest.TestCase):
        def test__all__(self):
            extra = {'BAR_CONST', 'FOO_CONST'}
            not_exported = {'baz'}  # Undocumented name.
            # bar imports part of its API from _bar.
            support.check__all__(self, bar, ('bar', '_bar'),
                                 extra=extra, not_exported=not_exported)
    ```

test.support.skip\_if\_broken\_multiprocessing\_synchronize()
:   Skip tests if the `multiprocessing.synchronize` module is missing, if
    there is no available semaphore implementation, or if creating a lock raises
    an `OSError`.

test.support.check\_disallow\_instantiation(*test\_case*, *tp*, *\*args*, *\*\*kwds*)
:   Assert that type *tp* cannot be instantiated using *args* and *kwds*.

test.support.adjust\_int\_max\_str\_digits(*max\_digits*)
:   This function returns a context manager that will change the global
    `sys.set_int_max_str_digits()` setting for the duration of the
    context to allow execution of test code that needs a different limit
    on the number of digits when converting between an integer and string.

The `test.support` module defines the following classes:

class test.support.SuppressCrashReport
:   A context manager used to try to prevent crash dialog popups on tests that
    are expected to crash a subprocess.

    On Windows, it disables Windows Error Reporting dialogs using
    SetErrorMode.

    On UNIX, `resource.setrlimit()` is used to set
    `resource.RLIMIT_CORE`’s soft limit to 0 to prevent coredump file
    creation.

    On both platforms, the old value is restored by `__exit__()`.

class test.support.SaveSignals
:   Class to save and restore signal handlers registered by the Python signal
    handler.

    save(*self*)
    :   Save the signal handlers to a dictionary mapping signal numbers to the
        current signal handler.

    restore(*self*)
    :   Set the signal numbers from the `save()` dictionary to the saved
        handler.

class test.support.Matcher
:   matches(*self*, *d*, *\*\*kwargs*)
    :   Try to match a single dict with the supplied arguments.

    match\_value(*self*, *k*, *dv*, *v*)
    :   Try to match a single stored value (*dv*) with a supplied value (*v*).

# `test.support.socket_helper` — Utilities for socket tests

The `test.support.socket_helper` module provides support for socket tests.

test.support.socket\_helper.IPV6\_ENABLED
:   Set to `True` if IPv6 is enabled on this host, `False` otherwise.

test.support.socket\_helper.find\_unused\_port(*family=socket.AF\_INET*, *socktype=socket.SOCK\_STREAM*)
:   Returns an unused port that should be suitable for binding. This is
    achieved by creating a temporary socket with the same family and type as
    the `sock` parameter (default is `AF_INET`,
    `SOCK_STREAM`),
    and binding it to the specified host address (defaults to `0.0.0.0`)
    with the port set to 0, eliciting an unused ephemeral port from the OS.
    The temporary socket is then closed and deleted, and the ephemeral port is
    returned.

    Either this method or `bind_port()` should be used for any tests
    where a server socket needs to be bound to a particular port for the
    duration of the test.
    Which one to use depends on whether the calling code is creating a Python
    socket, or if an unused port needs to be provided in a constructor
    or passed to an external program (i.e. the `-accept` argument to
    openssl’s s\_server mode). Always prefer `bind_port()` over
    `find_unused_port()` where possible. Using a hard coded port is
    discouraged since it can make multiple instances of the test impossible to
    run simultaneously, which is a problem for buildbots.

test.support.socket\_helper.bind\_port(*sock*, *host=HOST*)
:   Bind the socket to a free port and return the port number. Relies on
    ephemeral ports in order to ensure we are using an unbound port. This is
    important as many tests may be running simultaneously, especially in a
    buildbot environment. This method raises an exception if the
    `sock.family` is `AF_INET` and `sock.type` is
    `SOCK_STREAM`, and the socket has
    `SO_REUSEADDR` or `SO_REUSEPORT` set on it.
    Tests should never set these socket options for TCP/IP sockets.
    The only case for setting these options is testing multicasting via
    multiple UDP sockets.

    Additionally, if the `SO_EXCLUSIVEADDRUSE` socket option is
    available (i.e. on Windows), it will be set on the socket. This will
    prevent anyone else from binding to our host/port for the duration of the
    test.

test.support.socket\_helper.bind\_unix\_socket(*sock*, *addr*)
:   Bind a Unix socket, raising `unittest.SkipTest` if
    `PermissionError` is raised.

@test.support.socket\_helper.skip\_unless\_bind\_unix\_socket
:   A decorator for running tests that require a functional `bind()` for Unix
    sockets.

test.support.socket\_helper.transient\_internet(*resource\_name*, *\**, *timeout=30.0*, *errnos=()*)
:   A context manager that raises `ResourceDenied` when
    various issues with the internet connection manifest themselves as
    exceptions.

# `test.support.script_helper` — Utilities for the Python execution tests

The `test.support.script_helper` module provides support for Python’s
script execution tests.

test.support.script\_helper.interpreter\_requires\_environment()
:   Return `True` if `sys.executable interpreter` requires environment
    variables in order to be able to run at all.

    This is designed to be used with `@unittest.skipIf()` to annotate tests
    that need to use an `assert_python*()` function to launch an isolated
    mode (`-I`) or no environment mode (`-E`) sub-interpreter process.

    A normal build & test does not run into this situation but it can happen
    when trying to run the standard library test suite from an interpreter that
    doesn’t have an obvious home with Python’s current home finding logic.

    Setting `PYTHONHOME` is one way to get most of the testsuite to run
    in that situation. `PYTHONPATH` or `PYTHONNOUSERSITE` are
    other common environment variables that might impact whether or not the
    interpreter can start.

test.support.script\_helper.run\_python\_until\_end(*\*args*, *\*\*env\_vars*)
:   Set up the environment based on *env\_vars* for running the interpreter
    in a subprocess. The values can include `__isolated`, `__cleanenv`,
    `__cwd`, and `TERM`.

    Changed in version 3.9: The function no longer strips whitespaces from *stderr*.

test.support.script\_helper.assert\_python\_ok(*\*args*, *\*\*env\_vars*)
:   Assert that running the interpreter with *args* and optional environment
    variables *env\_vars* succeeds (`rc == 0`) and return a `(return code,
    stdout, stderr)` tuple.

    If the *\_\_cleanenv* keyword-only parameter is set, *env\_vars* is used as a fresh
    environment.

    Python is started in isolated mode (command line option `-I`),
    except if the *\_\_isolated* keyword-only parameter is set to `False`.

    Changed in version 3.9: The function no longer strips whitespaces from *stderr*.

test.support.script\_helper.assert\_python\_failure(*\*args*, *\*\*env\_vars*)
:   Assert that running the interpreter with *args* and optional environment
    variables *env\_vars* fails (`rc != 0`) and return a `(return code,
    stdout, stderr)` tuple.

    See `assert_python_ok()` for more options.

    Changed in version 3.9: The function no longer strips whitespaces from *stderr*.

test.support.script\_helper.spawn\_python(*\*args*, *stdout=subprocess.PIPE*, *stderr=subprocess.STDOUT*, *\*\*kw*)
:   Run a Python subprocess with the given arguments.

    *kw* is extra keyword args to pass to `subprocess.Popen()`. Returns a
    `subprocess.Popen` object.

test.support.script\_helper.kill\_python(*p*)
:   Run the given `subprocess.Popen` process until completion and return
    stdout.

test.support.script\_helper.make\_script(*script\_dir*, *script\_basename*, *source*, *omit\_suffix=False*)
:   Create script containing *source* in path *script\_dir* and *script\_basename*.
    If *omit\_suffix* is `False`, append `.py` to the name. Return the full
    script path.

test.support.script\_helper.make\_zip\_script(*zip\_dir*, *zip\_basename*, *script\_name*, *name\_in\_zip=None*)
:   Create zip file at *zip\_dir* and *zip\_basename* with extension `zip` which
    contains the files in *script\_name*. *name\_in\_zip* is the archive name.
    Return a tuple containing `(full path, full path of archive name)`.

test.support.script\_helper.make\_pkg(*pkg\_dir*, *init\_source=''*)
:   Create a directory named *pkg\_dir* containing an `__init__` file with
    *init\_source* as its contents.

test.support.script\_helper.make\_zip\_pkg(*zip\_dir*, *zip\_basename*, *pkg\_name*, *script\_basename*, *source*, *depth=1*, *compiled=False*)
:   Create a zip package directory with a path of *zip\_dir* and *zip\_basename*
    containing an empty `__init__` file and a file *script\_basename*
    containing the *source*. If *compiled* is `True`, both source files will
    be compiled and added to the zip package. Return a tuple of the full zip
    path and the archive name for the zip file.

# `test.support.bytecode_helper` — Support tools for testing correct bytecode generation

The `test.support.bytecode_helper` module provides support for testing
and inspecting bytecode generation.

The module defines the following class:

class test.support.bytecode\_helper.BytecodeTestCase(*unittest.TestCase*)
:   This class has custom assertion methods for inspecting bytecode.

BytecodeTestCase.get\_disassembly\_as\_string(*co*)
:   Return the disassembly of *co* as string.

BytecodeTestCase.assertInBytecode(*x*, *opname*, *argval=\_UNSPECIFIED*)
:   Return instr if *opname* is found, otherwise throws `AssertionError`.

BytecodeTestCase.assertNotInBytecode(*x*, *opname*, *argval=\_UNSPECIFIED*)
:   Throws `AssertionError` if *opname* is found.

# `test.support.threading_helper` — Utilities for threading tests

The `test.support.threading_helper` module provides support for threading tests.

test.support.threading\_helper.join\_thread(*thread*, *timeout=None*)
:   Join a *thread* within *timeout*. Raise an `AssertionError` if thread
    is still alive after *timeout* seconds.

@test.support.threading\_helper.reap\_threads
:   Decorator to ensure the threads are cleaned up even if the test fails.

test.support.threading\_helper.start\_threads(*threads*, *unlock=None*)
:   Context manager to start *threads*, which is a sequence of threads.
    *unlock* is a function called after the threads are started, even if an
    exception was raised; an example would be `threading.Event.set()`.
    `start_threads` will attempt to join the started threads upon exit.

test.support.threading\_helper.threading\_cleanup(*\*original\_values*)
:   Cleanup up threads not specified in *original\_values*. Designed to emit
    a warning if a test leaves running threads in the background.

test.support.threading\_helper.threading\_setup()
:   Return current thread count and copy of dangling threads.

test.support.threading\_helper.wait\_threads\_exit(*timeout=None*)
:   Context manager to wait until all threads created in the `with` statement
    exit.

test.support.threading\_helper.catch\_threading\_exception()
:   Context manager catching `threading.Thread` exception using
    `threading.excepthook()`.

    Attributes set when an exception is caught:

    - `exc_type`
    - `exc_value`
    - `exc_traceback`
    - `thread`

    See `threading.excepthook()` documentation.

    These attributes are deleted at the context manager exit.

    Usage:

    ```
    with threading_helper.catch_threading_exception() as cm:
        # code spawning a thread which raises an exception
        ...

        # check the thread exception, use cm attributes:
        # exc_type, exc_value, exc_traceback, thread
        ...

    # exc_type, exc_value, exc_traceback, thread attributes of cm no longer
    # exists at this point
    # (to avoid reference cycles)
    ```

test.support.threading\_helper.run\_concurrently(*worker\_func*, *nthreads*, *args=()*, *kwargs={}*)
:   Run the worker function concurrently in multiple threads.
    Re-raises an exception if any thread raises one, after all threads have
    finished.

# `test.support.os_helper` — Utilities for os tests

The `test.support.os_helper` module provides support for os tests.

test.support.os\_helper.FS\_NONASCII
:   A non-ASCII character encodable by `os.fsencode()`.

test.support.os\_helper.SAVEDCWD
:   Set to `os.getcwd()`.

test.support.os\_helper.TESTFN
:   Set to a name that is safe to use as the name of a temporary file. Any
    temporary file that is created should be closed and unlinked (removed).

test.support.os\_helper.TESTFN\_NONASCII
:   Set to a filename containing the `FS_NONASCII` character, if it exists.
    This guarantees that if the filename exists, it can be encoded and decoded
    with the default filesystem encoding. This allows tests that require a
    non-ASCII filename to be easily skipped on platforms where they can’t work.

test.support.os\_helper.TESTFN\_UNENCODABLE
:   Set to a filename (str type) that should not be able to be encoded by file
    system encoding in strict mode. It may be `None` if it’s not possible to
    generate such a filename.

test.support.os\_helper.TESTFN\_UNDECODABLE
:   Set to a filename (bytes type) that should not be able to be decoded by
    file system encoding in strict mode. It may be `None` if it’s not
    possible to generate such a filename.

test.support.os\_helper.TESTFN\_UNICODE
:   Set to a non-ASCII name for a temporary file.

class test.support.os\_helper.EnvironmentVarGuard
:   Class used to temporarily set or unset environment variables. Instances can
    be used as a context manager and have a complete dictionary interface for
    querying/modifying the underlying `os.environ`. After exit from the
    context manager all changes to environment variables done through this
    instance will be rolled back.

class test.support.os\_helper.FakePath(*path*)
:   Simple path-like object. It implements the
    `__fspath__()`
    method which just returns the *path* argument. If *path* is an exception,
    it will be raised in `__fspath__()`.

EnvironmentVarGuard.set(*envvar*, *value*)
:   Temporarily set the environment variable `envvar` to the value of
    `value`.

EnvironmentVarGuard.unset(*envvar*, *\*others*)
:   Temporarily unset one or more environment variables.

test.support.os\_helper.can\_symlink()
:   Return `True` if the OS supports symbolic links, `False`
    otherwise.

test.support.os\_helper.can\_xattr()
:   Return `True` if the OS supports xattr, `False`
    otherwise.

test.support.os\_helper.change\_cwd(*path*, *quiet=False*)
:   A context manager that temporarily changes the current working
    directory to *path* and yields the directory.

    If *quiet* is `False`, the context manager raises an exception
    on error. Otherwise, it issues only a warning and keeps the current
    working directory the same.

test.support.os\_helper.create\_empty\_file(*filename*)
:   Create an empty file with *filename*. If it already exists, truncate it.

test.support.os\_helper.fd\_count()
:   Count the number of open file descriptors.

test.support.os\_helper.fs\_is\_case\_insensitive(*directory*)
:   Return `True` if the file system for *directory* is case-insensitive.

test.support.os\_helper.make\_bad\_fd()
:   Create an invalid file descriptor by opening and closing a temporary file,
    and returning its descriptor.

test.support.os\_helper.rmdir(*filename*)
:   Call `os.rmdir()` on *filename*. On Windows platforms, this is
    wrapped with a wait loop that checks for the existence of the file,
    which is needed due to antivirus programs that can hold files open and prevent
    deletion.

test.support.os\_helper.rmtree(*path*)
:   Call `shutil.rmtree()` on *path* or call `os.lstat()` and
    `os.rmdir()` to remove a path and its contents. As with `rmdir()`,
    on Windows platforms
    this is wrapped with a wait loop that checks for the existence of the files.

@test.support.os\_helper.skip\_unless\_symlink
:   A decorator for running tests that require support for symbolic links.

@test.support.os\_helper.skip\_unless\_xattr
:   A decorator for running tests that require support for xattr.

test.support.os\_helper.temp\_cwd(*name='tempcwd'*, *quiet=False*)
:   A context manager that temporarily creates a new directory and
    changes the current working directory (CWD).

    The context manager creates a temporary directory in the current
    directory with name *name* before temporarily changing the current
    working directory. If *name* is `None`, the temporary directory is
    created using `tempfile.mkdtemp()`.

    If *quiet* is `False` and it is not possible to create or change
    the CWD, an error is raised. Otherwise, only a warning is raised
    and the original CWD is used.

test.support.os\_helper.temp\_dir(*path=None*, *quiet=False*)
:   A context manager that creates a temporary directory at *path* and
    yields the directory.

    If *path* is `None`, the temporary directory is created using
    `tempfile.mkdtemp()`. If *quiet* is `False`, the context manager
    raises an exception on error. Otherwise, if *path* is specified and
    cannot be created, only a warning is issued.

test.support.os\_helper.temp\_umask(*umask*)
:   A context manager that temporarily sets the process umask.

test.support.os\_helper.unlink(*filename*)
:   Call `os.unlink()` on *filename*. As with `rmdir()`,
    on Windows platforms, this is
    wrapped with a wait loop that checks for the existence of the file.

@test.support.os\_helper.with\_source\_date\_epoch(*\**, *epoch=123456789*)
:   A decorator for running tests with the `SOURCE_DATE_EPOCH`
    environment variable set to *epoch*.

@test.support.os\_helper.without\_source\_date\_epoch
:   A decorator for running tests with the `SOURCE_DATE_EPOCH`
    environment variable unset.

class test.support.os\_helper.SourceDateEpochTestMeta
:   Metaclass wrapping all test methods of the class with
    `with_source_date_epoch()` if the *source\_date\_epoch* keyword class
    argument is true, or with `without_source_date_epoch()` otherwise.
    For example:

    ```
    class TestsWithSourceEpoch(Tests,
                               metaclass=SourceDateEpochTestMeta,
                               source_date_epoch=True):
        pass
    ```

# `test.support.import_helper` — Utilities for import tests

The `test.support.import_helper` module provides support for import tests.

## Creating module objects

test.support.import\_helper.create\_module(*name*, *loader=None*, *\**, *ispkg=False*)
:   Create a new, empty module or package and return it.

    *name*, *loader* and *ispkg* (as `is_package`) are passed to
    `importlib.machinery.ModuleSpec`.

test.support.import\_helper.add\_module(*spec*, *\**, *parents=True*)
:   Create a module from a name or spec and add it to `sys.modules`.

    If *parents* is `True`, create any missing parent modules.

    Return the new module.

test.support.import\_helper.add\_package(*spec*, *\**, *parents=True*)
:   Create a package from a name or spec and add it to `sys.modules`.

    If *parents* is `True`, create any missing parent modules.

    Return the new package.

## Manipulating sys.modules

test.support.import\_helper.unload(*name*)
:   Remove the module named *name* from `sys.modules`.

test.support.import\_helper.forget(*modname*)
:   Remove the module named *modname* from `sys.modules` and delete any
    byte-compiled files of the module.

test.support.import\_helper.modules\_setup()
:   Return a tuple containing a copy of `sys.modules`.

test.support.import\_helper.modules\_cleanup(*oldmodules*)
:   Remove modules except for *oldmodules* and `encodings` from `sys.modules`
    in order to preserve the internal cache.

test.support.import\_helper.isolated\_modules()
:   A context manager that makes a copy of `sys.modules` on entry and restores
    it on exit.

class test.support.import\_helper.CleanImport(*\*module\_names*, *usefrozen=False*)
:   A context manager to force imports to return new module references. This
    is useful for testing module-level behaviors, such as the emission of a
    `DeprecationWarning` on import.

    When created, this makes a copy of `sys.modules` and removes names from
    *module\_names* from the original. On exit, the original module references are
    restored.

    If *usefrozen* is False (the default) then the frozen importer is
    disabled (except for essential modules like `importlib._bootstrap`).

    Example usage:

    ```
    with CleanImport('foo'):
          importlib.import_module('foo')  # New reference.
    ```

## Importing modules

test.support.import\_helper.import\_module(*name*, *deprecated=False*, *\**, *required\_on=()*)
:   This function imports and returns the named module. Unlike a normal
    import, this function raises `unittest.SkipTest` if the module
    cannot be imported.

    Module and package deprecation messages are suppressed during this import
    if *deprecated* is `True`. If a module is required on a platform but
    optional for others, set *required\_on* to an iterable of platform prefixes
    which will be compared against `sys.platform`.

test.support.import\_helper.import\_fresh\_module(*name*, *fresh=()*, *blocked=()*, *\**, *deprecated=False*, *usefrozen=False*)
:   This function imports and returns a fresh copy of the named Python module
    by removing the named module from `sys.modules` before doing the import.
    Note that unlike `reload`, the original module is not
    affected by this operation.

    *fresh* is an iterable of additional module names that are also removed
    from the `sys.modules` cache before doing the import.

    *blocked* is an iterable of module names that are replaced with `None`
    in the module cache during the import to ensure that attempts to import
    them raise `ImportError`.

    The named module and any modules named in the *fresh* and *blocked*
    parameters are saved before starting the import and then reinserted into
    `sys.modules` when the fresh import is complete.

    Module and package deprecation messages are suppressed during this import
    if *deprecated* is `True`.

    If *usefrozen* is False (the default) then the frozen importer is
    disabled (except for essential modules like `importlib._bootstrap`).

    This function will raise `ImportError` if the named module cannot be
    imported.

    Example use:

    ```
    # Get copies of the warnings module for testing without affecting the
    # version being used by the rest of the test suite. One copy uses the
    # C implementation, the other is forced to use the pure Python fallback
    # implementation
    py_warnings = import_fresh_module('warnings', blocked=['_warnings'])
    c_warnings = import_fresh_module('warnings', fresh=['_warnings'])
    ```

test.support.import\_helper.ensure\_module\_imported(*name*, *\**, *clearnone=True*)
:   Import and return the named module.

    If the module is already imported, this is returned. Otherwise, import
    the module and return it. If the module is not found a new, empty module
    will be created.

    If *clearnone* is `True`, this will first remove any `None` values that
    would block the import.

## Manipulating sys.path

class test.support.import\_helper.DirsOnSysPath(*\*paths*)
:   A context manager to temporarily add directories to `sys.path`.

    This makes a copy of `sys.path`, appends any directories given
    as positional arguments, then reverts `sys.path` to the copied
    settings when the context ends.

    Note that *all* `sys.path` modifications in the body of the
    context manager, including replacement of the object,
    will be reverted at the end of the block.

test.support.import\_helper.ready\_to\_import(*name=None*, *source=''*)
:   A context manager that will create a new Python module *name* with *source*
    source code in a temporary directory and inserts this directory at the start
    of `sys.path`. The context manager yields a tuple with the name and the path
    to the script in the temporary directory.

    If the name matches an existing module, this will be cleared from `sys.modules`
    on entry and restored on exit.

    If no name is given, the module will be named “spam”.

## Manipulating internals

test.support.import\_helper.make\_legacy\_pyc(*source*, *allow\_compile=False*)
:   Move a **PEP 3147**/**PEP 488** pyc file to its legacy pyc location and return the file
    system path to the legacy pyc file. The *source* value is the file system
    path to the source file. It does not need to exist, however the PEP
    3147/488 pyc file must exist or *allow\_compile* must be set.

    If *allow\_compile* is `True` this will create a .pyc file if it does not exist.

test.support.import\_helper.frozen\_modules(*enabled=True*)
:   A context manager that forces frozen modules to be used or excluded.

    If *enabled* is `True` frozen modules are used, otherwise they are excluded.

    This only applies to modules that have not yet been imported. Some essential
    modules will always be imported frozen.

test.support.import\_helper.multi\_interp\_extensions\_check(*enabled=True*)
:   A context manager that forces (if *enabled* is `True`) or prevents legacy (single-phase init)
    modules from being allowed in subinterpreters.

    This only applies to modules that haven’t been imported yet.
    It overrides the `PyInterpreterConfig.check_multi_interp_extensions`
    setting.

## Lazy imports

test.support.import\_helper.ensure\_lazy\_imports(*imported\_module*, *modules\_to\_block*, *\**, *additional\_code=None*)
:   Test that when *imported\_module* is imported, none of the modules named in *modules\_to\_block*
    are imported as a side effect.

    *additional\_code* if given should be additional Python source code to execute before
    checking that the blocked modules still haven’t been imported.

# `test.support.warnings_helper` — Utilities for warnings tests

The `test.support.warnings_helper` module provides support for warnings tests.

test.support.warnings\_helper.ignore\_warnings(*\**, *category*)
:   Suppress warnings that are instances of *category*,
    which must be `Warning` or a subclass.
    Roughly equivalent to `warnings.catch_warnings()`
    with `warnings.simplefilter('ignore', category=category)`.
    For example:

    ```
    @warning_helper.ignore_warnings(category=DeprecationWarning)
    def test_suppress_warning():
        # do something
    ```

test.support.warnings\_helper.check\_no\_resource\_warning(*testcase*)
:   Context manager to check that no `ResourceWarning` was raised. You
    must remove the object which may emit `ResourceWarning` before the
    end of the context manager.

test.support.warnings\_helper.check\_syntax\_warning(*testcase*, *statement*, *errtext=''*, *\**, *lineno=1*, *offset=None*)
:   Test for syntax warning in *statement* by attempting to compile *statement*.
    Test also that the `SyntaxWarning` is emitted only once, and that it
    will be converted to a `SyntaxError` when turned into error.
    *testcase* is the `unittest` instance for the test. *errtext* is the
    regular expression which should match the string representation of the
    emitted `SyntaxWarning` and raised `SyntaxError`. If *lineno*
    is not `None`, compares to the line of the warning and exception.
    If *offset* is not `None`, compares to the offset of the exception.

test.support.warnings\_helper.check\_warnings(*\*filters*, *quiet=True*)
:   A convenience wrapper for `warnings.catch_warnings()` that makes it
    easier to test that a warning was correctly raised. It is approximately
    equivalent to calling `warnings.catch_warnings(record=True)` with
    `warnings.simplefilter()` set to `always` and with the option to
    automatically validate the results that are recorded.

    `check_warnings` accepts 2-tuples of the form `("message regexp",
    WarningCategory)` as positional arguments. If one or more *filters* are
    provided, or if the optional keyword argument *quiet* is `False`,
    it checks to make sure the warnings are as expected: each specified filter
    must match at least one of the warnings raised by the enclosed code or the
    test fails, and if any warnings are raised that do not match any of the
    specified filters the test fails. To disable the first of these checks,
    set *quiet* to `True`.

    If no arguments are specified, it defaults to:

    ```
    check_warnings(("", Warning), quiet=True)
    ```

    In this case all warnings are caught and no errors are raised.

    On entry to the context manager, a `WarningsRecorder` instance is
    returned. The recorded warnings are available via its
    `warnings` attribute, and its
    `reset()` method discards previously recorded warnings.

    The context manager is designed to be used like this:

    ```
    with check_warnings(("assertion is always true", SyntaxWarning),
                        ("", UserWarning)):
        exec('assert(False, "Hey!")')
        warnings.warn(UserWarning("Hide me!"))
    ```

    In this case if either warning was not raised, or some other warning was
    raised, `check_warnings()` would raise an error.

    When a test needs to look more deeply into the warnings, rather than
    just checking whether or not they occurred, code like this can be used:

    ```
    with check_warnings(quiet=True) as w:
        warnings.warn("foo")
        assert str(w.message) == "foo"
        warnings.warn("bar")
        assert str(w.message) == "bar"
        assert str(w.warnings[0].message) == "foo"
        assert str(w.warnings[1].message) == "bar"
        w.reset()
        assert len(w.warnings) == 0
    ```

    Here all warnings will be caught, and the test code tests the captured
    warnings directly.

class test.support.warnings\_helper.WarningsRecorder(*warnings\_list*)
:   Class used to record warnings for unit tests. Wraps the warnings list
    returned by `warnings.catch_warnings()` when recording is enabled.
    `check_warnings()` returns an instance of this class.

    As a convenience, the attributes of the object representing the most recent
    warning can also be accessed directly through the recorder object.
    If no warning has been raised since the recorder was created or last reset,
    these attributes return `None`.

    warnings
    :   A list of warnings recorded since the recorder was created or last reset.

    reset()
    :   Discard previously recorded warnings from the recorder’s view.
        The underlying warnings list is not modified.
