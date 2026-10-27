---
page: library/profiling.html
title: profiling — Python profilers
area: library
kind: guide
module: profiling
---

<!-- anchor: module-profiling | type: section -->
# `profiling` — Python profilers

Added in version 3.15.

**Source code:** Lib/profiling/

<!-- anchor: introduction-to-profiling | type: section -->
## Introduction to profiling

A *profile* is a set of statistics that describes how often and for how long various parts of a program execute. These statistics help identify performance bottlenecks and guide optimization efforts. Python provides two fundamentally different approaches to collecting this information: statistical sampling and deterministic tracing.

The `profiling` package organizes Python’s built-in profiling tools under a single namespace. It contains two submodules, each implementing a different profiling methodology:

**`profiling.sampling`**

A statistical profiler that periodically samples the call stack. Run scripts directly or attach to running processes by PID. Provides multiple output formats (flame graphs, heatmaps, Firefox Profiler), GIL analysis, GC tracking, and multiple profiling modes (wall-clock, CPU, GIL) with virtually no overhead.

**`profiling.tracing`**

A deterministic profiler that traces every function call, return, and exception event. Provides exact call counts and precise timing information, capturing every invocation including very fast functions.

**Note:**

The profiler modules are designed to provide an execution profile for a given program, not for benchmarking purposes. For benchmarking, use the `timeit` module, which provides reasonably accurate timing measurements. This distinction is particularly important when comparing Python code against C code: deterministic profilers introduce overhead for Python code but not for C-level functions, which can skew comparisons.

<!-- anchor: choosing-a-profiler | type: section -->
## Choosing a profiler

For most performance analysis, use the statistical profiler (`profiling.sampling`). It has minimal overhead, works for both development and production, and provides rich visualization options including flame graphs, heatmaps, GIL analysis, and more.

Use the deterministic profiler (`profiling.tracing`) when you need **exact call counts** and cannot afford to miss any function calls. Since it instruments every function call and return, it will capture even very fast functions that complete between sampling intervals. The tradeoff is higher overhead.

The following table summarizes the key differences:

| Feature | Statistical sampling (`profiling.sampling`) | Deterministic (`profiling.tracing`) |
| --- | --- | --- |
| **Overhead** | Virtually none | Moderate |
| **Accuracy** | Statistical estimate | Exact call counts |
| **Output formats** | pstats, flame graph, heatmap, gecko, collapsed | pstats |
| **Profiling modes** | Wall-clock, CPU, GIL | Wall-clock |
| **Special frames** | GC, native (C extensions) | N/A |
| **Attach to PID** | Yes | No |

<!-- anchor: when-to-use-statistical-sampling | type: section -->
### When to use statistical sampling

The statistical profiler (`profiling.sampling`) is recommended for most performance analysis tasks. Use it the same way you would use `profiling.tracing`:

```sh
python -m profiling.sampling run script.py
```

One of the main strengths of the sampling profiler is its variety of output formats. Beyond traditional pstats tables, it can generate interactive flame graphs that visualize call hierarchies, line-level source heatmaps that show exactly where time is spent in your code, and Firefox Profiler output for timeline-based analysis.

The profiler also provides insight into Python interpreter behavior that deterministic profiling cannot capture. Use `--mode gil` to identify GIL contention in multi-threaded code, `--mode cpu` to measure actual CPU time excluding I/O waits, or inspect `<GC>` frames to understand garbage collection overhead. The `--native` option reveals time spent in C extensions, helping distinguish Python overhead from library performance.

For multi-threaded applications, the `-a` option samples all threads simultaneously, showing how work is distributed. And for production debugging, the `attach` command connects to any running Python process by PID without requiring a restart or code changes.

<!-- anchor: when-to-use-deterministic-tracing | type: section -->
### When to use deterministic tracing

The deterministic profiler (`profiling.tracing`) instruments every function call and return. This approach has higher overhead than sampling, but guarantees complete coverage of program execution.

The primary reason to choose deterministic tracing is when you need exact call counts. Statistical profiling estimates frequency based on sampling, which may undercount short-lived functions that complete between samples. If you need to verify that an optimization actually reduced the number of function calls, or if you want to trace the complete call graph to understand caller-callee relationships, deterministic tracing is the right choice.

Deterministic tracing also excels at capturing functions that execute in microseconds. Such functions may not appear frequently enough in statistical samples, but deterministic tracing records every invocation regardless of duration.

<!-- anchor: quick-start | type: section -->
## Quick start

This section provides the minimal steps needed to start profiling. For complete documentation, see the dedicated pages for each profiler.

<!-- anchor: statistical-profiling | type: section -->
### Statistical profiling

To profile a script, use the `profiling.sampling` module with the `run` command:

```sh
python -m profiling.sampling run script.py
python -m profiling.sampling run -m mypackage.module
```

This runs the script under the profiler and prints a summary of where time was spent. For an interactive flame graph:

```sh
python -m profiling.sampling run --flamegraph script.py
```

To profile an already-running process, use the `attach` command with the process ID:

```sh
python -m profiling.sampling attach 1234
```

For custom settings, specify the sampling interval (in microseconds) and duration (in seconds):

```sh
python -m profiling.sampling run -i 50 -d 30 script.py
```

<!-- anchor: deterministic-profiling | type: section -->
### Deterministic profiling

To profile a script from the command line:

```sh
python -m profiling.tracing script.py
```

To profile a piece of code programmatically:

```python
import profiling.tracing
profiling.tracing.run('my_function()')
```

This executes the given code under the profiler and prints a summary showing exact function call counts and timing.

<!-- anchor: understanding-profile-output | type: section -->
## Understanding profile output

Both profilers collect function-level statistics, though they present them in different formats. The sampling profiler offers multiple visualizations (flame graphs, heatmaps, Firefox Profiler, pstats tables), while the deterministic profiler produces pstats-compatible output. Regardless of format, the underlying concepts are the same.

Key profiling concepts:

****Direct time** (also called *self time* or *tottime*)**

Time spent executing code in the function itself, excluding time spent in functions it called. High direct time indicates the function contains expensive operations.

****Cumulative time** (also called *total time* or *cumtime*)**

Time spent in the function and all functions it called. This measures the total cost of calling a function, including its entire call subtree.

****Call count** (also called *ncalls* or *samples*)**

How many times the function was called (deterministic) or sampled (statistical). In deterministic profiling, this is exact. In statistical profiling, it represents the number of times the function appeared in a stack sample.

****Primitive calls****

Calls that are not induced by recursion. When a function recurses, the total call count includes recursive invocations, but primitive calls counts only the initial entry. Displayed as `total/primitive` (for example, `3/1` means three total calls, one primitive).

****Caller/Callee relationships****

Which functions called a given function (callers) and which functions it called (callees). Flame graphs visualize this as nested rectangles; pstats can display it via the `print_callers()` and `print_callees()` methods.

<!-- anchor: legacy-compatibility | type: section -->
## Legacy compatibility

For backward compatibility, the `cProfile` module remains available as an alias to `profiling.tracing`. Existing code using `import cProfile` will continue to work without modification in all future Python versions.

Deprecated since version 3.15: The pure Python `profile` module is deprecated and will be removed in Python 3.17. Use `profiling.tracing` (or its alias `cProfile`) instead. See `profile` for migration guidance.

**See also:**

**`profiling.sampling`**

Statistical sampling profiler with flame graphs, heatmaps, and GIL analysis. Recommended for most users.

**`profiling.tracing`**

Deterministic tracing profiler for exact call counts.

**`pstats`**

Statistics analysis and formatting for profile data.

**`timeit`**

Module for measuring execution time of small code snippets.

**Submodules**

- `profiling.tracing` — Deterministic profiler

- `profiling.sampling` — Statistical profiler
