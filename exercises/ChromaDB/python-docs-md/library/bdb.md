---
page: library/bdb.html
title: bdb — Debugger framework
area: library
kind: guide
module: bdb
---

<!-- anchor: module-bdb | type: section -->
# `bdb` — Debugger framework

**Source code:** Lib/bdb.py

The `bdb` module handles basic debugger functions, like setting breakpoints or managing execution via the debugger.

The following exception is defined:

<!-- anchor: bdb.BdbQuit | type: py exception -->
## `exception bdb.BdbQuit`

Exception raised by the `Bdb` class for quitting the debugger.

The `bdb` module also defines two classes:

<!-- anchor: bdb.Breakpoint | type: py class -->
## `class bdb.Breakpoint(self, file, line, temporary=False, cond=None, funcname=None)`

This class implements temporary breakpoints, ignore counts, disabling and (re-)enabling, and conditionals.

Breakpoints are indexed by number through a list called `bpbynumber` and by `(file, line)` pairs through `bplist`. The former points to a single instance of class `Breakpoint`. The latter points to a list of such instances since there may be more than one breakpoint per line.

When creating a breakpoint, its associated `file name` should be in canonical form. If a `funcname` is defined, a breakpoint `hit` will be counted when the first line of that function is executed. A `conditional` breakpoint always counts a `hit`.

`Breakpoint` instances have the following methods:

<!-- anchor: bdb.Breakpoint.deleteMe | type: py method -->
### `deleteMe()`

Delete the breakpoint from the list associated to a file/line. If it is the last breakpoint in that position, it also deletes the entry for the file/line.

<!-- anchor: bdb.Breakpoint.enable | type: py method -->
### `enable()`

Mark the breakpoint as enabled.

<!-- anchor: bdb.Breakpoint.disable | type: py method -->
### `disable()`

Mark the breakpoint as disabled.

<!-- anchor: bdb.Breakpoint.bpformat | type: py method -->
### `bpformat()`

Return a string with all the information about the breakpoint, nicely formatted:

- Breakpoint number.

- Temporary status (del or keep).

- File/line position.

- Break condition.

- Number of times to ignore.

- Number of times hit.

Added in version 3.2.

<!-- anchor: bdb.Breakpoint.bpprint | type: py method -->
### `bpprint(out=None)`

Print the output of `bpformat()` to the file *out*, or if it is `None`, to standard output.

`Breakpoint` instances have the following attributes:

<!-- anchor: bdb.Breakpoint.file | type: py attribute -->
### `file`

File name of the `Breakpoint`.

<!-- anchor: bdb.Breakpoint.line | type: py attribute -->
### `line`

Line number of the `Breakpoint` within `file`.

<!-- anchor: bdb.Breakpoint.temporary | type: py attribute -->
### `temporary`

`True` if a `Breakpoint` at (file, line) is temporary.

<!-- anchor: bdb.Breakpoint.cond | type: py attribute -->
### `cond`

Condition for evaluating a `Breakpoint` at (file, line).

<!-- anchor: bdb.Breakpoint.funcname | type: py attribute -->
### `funcname`

Function name that defines whether a `Breakpoint` is hit upon entering the function.

<!-- anchor: bdb.Breakpoint.enabled | type: py attribute -->
### `enabled`

`True` if `Breakpoint` is enabled.

<!-- anchor: bdb.Breakpoint.bpbynumber | type: py attribute -->
### `bpbynumber`

Numeric index for a single instance of a `Breakpoint`.

<!-- anchor: bdb.Breakpoint.bplist | type: py attribute -->
### `bplist`

Dictionary of `Breakpoint` instances indexed by (`file`, `line`) tuples.

<!-- anchor: bdb.Breakpoint.ignore | type: py attribute -->
### `ignore`

Number of times to ignore a `Breakpoint`.

<!-- anchor: bdb.Breakpoint.hits | type: py attribute -->
### `hits`

Count of the number of times a `Breakpoint` has been hit.

<!-- anchor: bdb.Bdb | type: py class -->
## `class bdb.Bdb(skip=None, backend='settrace')`

The `Bdb` class acts as a generic Python debugger base class.

This class takes care of the details of the trace facility; a derived class should implement user interaction. The standard debugger class (`pdb.Pdb`) is an example.

The *skip* argument, if given, must be an iterable of glob-style module name patterns. The debugger will not step into frames that originate in a module that matches one of these patterns. Whether a frame is considered to originate in a certain module is determined by the `__name__` in the frame globals.

The *backend* argument specifies the backend to use for `Bdb`. It can be either `'settrace'` or `'monitoring'`. `'settrace'` uses `sys.settrace()` which has the best backward compatibility. The `'monitoring'` backend uses the new `sys.monitoring` that was introduced in Python 3.12, which can be much more efficient because it can disable unused events. We are trying to keep the exact interfaces for both backends, but there are some differences. The debugger developers are encouraged to use the `'monitoring'` backend to achieve better performance.

Changed in version 3.1: Added the *skip* parameter.

Changed in version 3.14: Added the *backend* parameter.

The following methods of `Bdb` normally don’t need to be overridden.

<!-- anchor: bdb.Bdb.canonic | type: py method -->
### `canonic(filename)`

Return canonical form of *filename*.

For real file names, the canonical form is an operating-system-dependent, `case-normalized` `absolute path`. A *filename* with angle brackets, such as `"<stdin>"` generated in interactive mode, is returned unchanged.

<!-- anchor: bdb.Bdb.start_trace | type: py method -->
### `start_trace(self)`

Start tracing. For `'settrace'` backend, this method is equivalent to `sys.settrace(self.trace_dispatch)`

Added in version 3.14.

<!-- anchor: bdb.Bdb.stop_trace | type: py method -->
### `stop_trace(self)`

Stop tracing. For `'settrace'` backend, this method is equivalent to `sys.settrace(None)`

Added in version 3.14.

<!-- anchor: bdb.Bdb.reset | type: py method -->
### `reset()`

Set the `botframe`, `stopframe`, `returnframe` and `quitting` attributes with values ready to start debugging.

<!-- anchor: bdb.Bdb.trace_dispatch | type: py method -->
### `trace_dispatch(frame, event, arg)`

This function is installed as the trace function of debugged frames. Its return value is the new trace function (in most cases, that is, itself).

The default implementation decides how to dispatch a frame, depending on the type of event (passed as a string) that is about to be executed. *event* can be one of the following:

- `"line"`: A new line of code is going to be executed.

- `"call"`: A function is about to be called, or another code block entered.

- `"return"`: A function or other code block is about to return.

- `"exception"`: An exception has occurred.

For all the events, specialized functions (see below) are called.

The *arg* parameter depends on the previous event.

See the documentation for `sys.settrace()` for more information on the trace function. For more information on code and frame objects, refer to The standard type hierarchy.

<!-- anchor: bdb.Bdb.dispatch_line | type: py method -->
### `dispatch_line(frame)`

If the debugger should stop on the current line, invoke the `user_line()` method (which should be overridden in subclasses). Raise a `BdbQuit` exception if the `quitting` flag is set (which can be set from `user_line()`). Return a reference to the `trace_dispatch()` method for further tracing in that scope.

<!-- anchor: bdb.Bdb.dispatch_call | type: py method -->
### `dispatch_call(frame, arg)`

If the debugger should stop on this function call, invoke the `user_call()` method (which should be overridden in subclasses). Raise a `BdbQuit` exception if the `quitting` flag is set (which can be set from `user_call()`). Return a reference to the `trace_dispatch()` method for further tracing in that scope.

<!-- anchor: bdb.Bdb.dispatch_return | type: py method -->
### `dispatch_return(frame, arg)`

If the debugger should stop on this function return, invoke the `user_return()` method (which should be overridden in subclasses). Raise a `BdbQuit` exception if the `quitting` flag is set (which can be set from `user_return()`). Return a reference to the `trace_dispatch()` method for further tracing in that scope.

<!-- anchor: bdb.Bdb.dispatch_exception | type: py method -->
### `dispatch_exception(frame, arg)`

If the debugger should stop at this exception, invokes the `user_exception()` method (which should be overridden in subclasses). Raise a `BdbQuit` exception if the `quitting` flag is set (which can be set from `user_exception()`). Return a reference to the `trace_dispatch()` method for further tracing in that scope.

Normally derived classes don’t override the following methods, but they may if they want to redefine the definition of stopping and breakpoints.

<!-- anchor: bdb.Bdb.is_skipped_module | type: py method -->
### `is_skipped_module(module_name)`

Return `True` if *module_name* matches any skip pattern.

<!-- anchor: bdb.Bdb.stop_here | type: py method -->
### `stop_here(frame)`

Return `True` if *frame* is below the starting frame in the stack.

<!-- anchor: bdb.Bdb.break_here | type: py method -->
### `break_here(frame)`

Return `True` if there is an effective breakpoint for this line.

Check whether a line or function breakpoint exists and is in effect. Delete temporary breakpoints based on information from `effective()`.

<!-- anchor: bdb.Bdb.break_anywhere | type: py method -->
### `break_anywhere(frame)`

Return `True` if any breakpoint exists for *frame*’s filename.

Derived classes should override these methods to gain control over debugger operation.

<!-- anchor: bdb.Bdb.user_call | type: py method -->
### `user_call(frame, argument_list)`

Called from `dispatch_call()` if a break might stop inside the called function.

*argument_list* is not used anymore and will always be `None`. The argument is kept for backwards compatibility.

<!-- anchor: bdb.Bdb.user_line | type: py method -->
### `user_line(frame)`

Called from `dispatch_line()` when either `stop_here()` or `break_here()` returns `True`.

<!-- anchor: bdb.Bdb.user_return | type: py method -->
### `user_return(frame, return_value)`

Called from `dispatch_return()` when `stop_here()` returns `True`.

<!-- anchor: bdb.Bdb.user_exception | type: py method -->
### `user_exception(frame, exc_info)`

Called from `dispatch_exception()` when `stop_here()` returns `True`.

<!-- anchor: bdb.Bdb.do_clear | type: py method -->
### `do_clear(arg)`

Handle how a breakpoint must be removed when it is a temporary one.

This method must be implemented by derived classes.

Derived classes and clients can call the following methods to affect the stepping state.

<!-- anchor: bdb.Bdb.set_step | type: py method -->
### `set_step()`

Stop after one line of code.

<!-- anchor: bdb.Bdb.set_next | type: py method -->
### `set_next(frame)`

Stop on the next line in or below the given frame.

<!-- anchor: bdb.Bdb.set_return | type: py method -->
### `set_return(frame)`

Stop when returning from the given frame.

<!-- anchor: bdb.Bdb.set_until | type: py method -->
### `set_until(frame, lineno=None)`

Stop when the line with the *lineno* greater than the current one is reached or when returning from current frame.

<!-- anchor: bdb.Bdb.set_trace | type: py method -->
### `set_trace([frame])`

Start debugging from *frame*. If *frame* is not specified, debugging starts from caller’s frame.

Changed in version 3.13: `set_trace()` will enter the debugger immediately, rather than on the next line of code to be executed.

<!-- anchor: bdb.Bdb.set_continue | type: py method -->
### `set_continue()`

Stop only at breakpoints or when finished. If there are no breakpoints, set the system trace function to `None`.

<!-- anchor: bdb.Bdb.set_quit | type: py method -->
### `set_quit()`

Set the `quitting` attribute to `True`. This raises `BdbQuit` in the next call to one of the `dispatch_*()` methods.

Derived classes and clients can call the following methods to manipulate breakpoints. These methods return a string containing an error message if something went wrong, or `None` if all is well.

<!-- anchor: bdb.Bdb.set_break | type: py method -->
### `set_break(filename, lineno, temporary=False, cond=None, funcname=None)`

Set a new breakpoint. If the *lineno* line doesn’t exist for the *filename* passed as argument, return an error message. The *filename* should be in canonical form, as described in the `canonic()` method.

<!-- anchor: bdb.Bdb.clear_break | type: py method -->
### `clear_break(filename, lineno)`

Delete the breakpoints in *filename* and *lineno*. If none were set, return an error message.

<!-- anchor: bdb.Bdb.clear_bpbynumber | type: py method -->
### `clear_bpbynumber(arg)`

Delete the breakpoint which has the index *arg* in the `Breakpoint.bpbynumber`. If *arg* is not numeric or out of range, return an error message.

<!-- anchor: bdb.Bdb.clear_all_file_breaks | type: py method -->
### `clear_all_file_breaks(filename)`

Delete all breakpoints in *filename*. If none were set, return an error message.

<!-- anchor: bdb.Bdb.clear_all_breaks | type: py method -->
### `clear_all_breaks()`

Delete all existing breakpoints. If none were set, return an error message.

<!-- anchor: bdb.Bdb.get_bpbynumber | type: py method -->
### `get_bpbynumber(arg)`

Return a breakpoint specified by the given number. If *arg* is a string, it will be converted to a number. If *arg* is a non-numeric string, if the given breakpoint never existed or has been deleted, a `ValueError` is raised.

Added in version 3.2.

<!-- anchor: bdb.Bdb.get_break | type: py method -->
### `get_break(filename, lineno)`

Return `True` if there is a breakpoint for *lineno* in *filename*.

<!-- anchor: bdb.Bdb.get_breaks | type: py method -->
### `get_breaks(filename, lineno)`

Return all breakpoints for *lineno* in *filename*, or an empty list if none are set.

<!-- anchor: bdb.Bdb.get_file_breaks | type: py method -->
### `get_file_breaks(filename)`

Return all breakpoints in *filename*, or an empty list if none are set.

<!-- anchor: bdb.Bdb.get_all_breaks | type: py method -->
### `get_all_breaks()`

Return all breakpoints that are set.

Derived classes and clients can call the following methods to disable and restart events to achieve better performance. These methods only work when using the `'monitoring'` backend.

<!-- anchor: bdb.Bdb.disable_current_event | type: py method -->
### `disable_current_event()`

Disable the current event until the next time `restart_events()` is called. This is helpful when the debugger is not interested in the current line.

Added in version 3.14.

<!-- anchor: bdb.Bdb.restart_events | type: py method -->
### `restart_events()`

Restart all the disabled events. This function is automatically called in `dispatch_*` methods after `user_*` methods are called. If the `dispatch_*` methods are not overridden, the disabled events will be restarted after each user interaction.

Added in version 3.14.

Derived classes and clients can call the following methods to get a data structure representing a stack trace.

<!-- anchor: bdb.Bdb.get_stack | type: py method -->
### `get_stack(f, t)`

Return a list of (frame, lineno) tuples in a stack trace, and a size.

The most recently called frame is last in the list. The size is the number of frames below the frame where the debugger was invoked.

<!-- anchor: bdb.Bdb.format_stack_entry | type: py method -->
### `format_stack_entry(frame_lineno, lprefix=': ')`

Return a string with information about a stack entry, which is a `(frame, lineno)` tuple. The return string contains:

- The canonical filename which contains the frame.

- The function name or `"<lambda>"`.

- The input arguments.

- The return value.

- The line of code (if it exists).

The following two methods can be called by clients to use a debugger to debug a statement, given as a string.

<!-- anchor: bdb.Bdb.run | type: py method -->
### `run(cmd, globals=None, locals=None)`

Debug a statement executed via the `exec()` function. *globals* defaults to `__main__.__dict__`, *locals* defaults to *globals*.

<!-- anchor: bdb.Bdb.runeval | type: py method -->
### `runeval(expr, globals=None, locals=None)`

Debug an expression executed via the `eval()` function. *globals* and *locals* have the same meaning as in `run()`.

<!-- anchor: bdb.Bdb.runctx | type: py method -->
### `runctx(cmd, globals, locals)`

For backwards compatibility. Calls the `run()` method.

<!-- anchor: bdb.Bdb.runcall | type: py method -->
### `runcall(func, /, *args, **kwds)`

Debug a single function call, and return its result.

Finally, the module defines the following functions:

<!-- anchor: bdb.checkfuncname | type: py function -->
## `bdb.checkfuncname(b, frame)`

Return `True` if we should break here, depending on the way the `Breakpoint` *b* was set.

If it was set via line number, it checks if `b.line` is the same as the one in *frame*. If the breakpoint was set via `function name`, we have to check we are in the right *frame* (the right function) and if we are on its first executable line.

<!-- anchor: bdb.effective | type: py function -->
## `bdb.effective(file, line, frame)`

Return `(active breakpoint, delete temporary flag)` or `(None, None)` as the breakpoint to act upon.

The *active breakpoint* is the first entry in `bplist` for the (`file`, `line`) (which must exist) that is `enabled`, for which `checkfuncname()` is true, and that has neither a false `condition` nor positive `ignore` count. The *flag*, meaning that a temporary breakpoint should be deleted, is `False` only when the `cond` cannot be evaluated (in which case, `ignore` count is ignored).

If no such entry exists, then `(None, None)` is returned.

<!-- anchor: bdb.set_trace | type: py function -->
## `bdb.set_trace()`

Start debugging with a `Bdb` instance from caller’s frame.
