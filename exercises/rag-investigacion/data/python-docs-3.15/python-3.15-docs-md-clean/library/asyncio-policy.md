# Policies

Warning

Policies are deprecated and will be removed in Python 3.16.
Users are encouraged to use the `asyncio.run()` function
or the `asyncio.Runner` with *loop\_factory* to use
the desired loop implementation.

An event loop policy is a global object
used to get and set the current event loop,
as well as create new event loops.
The default policy can be replaced with
built-in alternatives
to use different event loop implementations,
or substituted by a custom policy
that can override these behaviors.

The policy object
gets and sets a separate event loop per *context*.
This is per-thread by default,
though custom policies could define *context* differently.

Custom event loop policies can control the behavior of
`get_event_loop()`, `set_event_loop()`, and `new_event_loop()`.

Policy objects should implement the APIs defined
in the `AbstractEventLoopPolicy` abstract base class.

## Getting and Setting the Policy

The following functions can be used to get and set the policy
for the current process:

asyncio.get\_event\_loop\_policy()
:   Return the current process-wide policy.

    Deprecated since version 3.14: The `get_event_loop_policy()` function is deprecated and
    will be removed in Python 3.16.

asyncio.set\_event\_loop\_policy(*policy*)
:   Set the current process-wide policy to *policy*.

    If *policy* is set to `None`, the default policy is restored.

    Deprecated since version 3.14: The `set_event_loop_policy()` function is deprecated and
    will be removed in Python 3.16.

## Policy Objects

The abstract event loop policy base class is defined as follows:

class asyncio.AbstractEventLoopPolicy
:   An abstract base class for asyncio policies.

    get\_event\_loop()
    :   Get the event loop for the current context.

        Return an event loop object implementing the
        `AbstractEventLoop` interface.

        This method should never return `None`.

    set\_event\_loop(*loop*)
    :   Set the event loop for the current context to *loop*.

    new\_event\_loop()
    :   Create and return a new event loop object.

        This method should never return `None`.

    Deprecated since version 3.14: The `AbstractEventLoopPolicy` class is deprecated and
    will be removed in Python 3.16.

asyncio ships with the following built-in policies:

class asyncio.DefaultEventLoopPolicy
:   The default asyncio policy. Uses `SelectorEventLoop`
    on Unix and `ProactorEventLoop` on Windows.

    There is no need to install the default policy manually. asyncio
    is configured to use the default policy automatically.

    Changed in version 3.14: The `get_event_loop()` method of the default asyncio policy now
    raises a `RuntimeError` if there is no set event loop.

    Deprecated since version 3.14: The `DefaultEventLoopPolicy` class is deprecated and
    will be removed in Python 3.16.

class asyncio.WindowsSelectorEventLoopPolicy
:   An alternative event loop policy that uses the
    `SelectorEventLoop` event loop implementation.

    Availability: Windows.

    Deprecated since version 3.14: The `WindowsSelectorEventLoopPolicy` class is deprecated and
    will be removed in Python 3.16.

class asyncio.WindowsProactorEventLoopPolicy
:   An alternative event loop policy that uses the
    `ProactorEventLoop` event loop implementation.

    Availability: Windows.

    Deprecated since version 3.14: The `WindowsProactorEventLoopPolicy` class is deprecated and
    will be removed in Python 3.16.

## Custom Policies

To implement a new event loop policy, it is recommended to subclass
`DefaultEventLoopPolicy` and override the methods for which
custom behavior is wanted, e.g.:

```
class MyEventLoopPolicy(asyncio.DefaultEventLoopPolicy):

    def get_event_loop(self):
        """Get the event loop.

        This may be None or an instance of EventLoop.
        """
        loop = super().get_event_loop()
        # Do something with loop ...
        return loop

asyncio.set_event_loop_policy(MyEventLoopPolicy())
```
