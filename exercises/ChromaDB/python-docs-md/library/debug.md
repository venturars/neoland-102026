---
page: library/debug.html
title: Debugging and profiling
area: library
kind: guide
---

<!-- anchor: debugging-and-profiling | type: section -->
# Debugging and profiling

These libraries help you with Python development: the debugger enables you to step through code, analyze stack frames and set breakpoints etc., and the profilers run code and give you a detailed breakdown of execution times, allowing you to identify bottlenecks in your programs. Auditing events provide visibility into runtime behaviors that would otherwise require intrusive debugging or patching.

- Audit events table

- `bdb` — Debugger framework

- `faulthandler` — Dump the Python traceback

  - Dumping the traceback

  - Dumping the C stack

    - C Stack Compatibility

  - Fault handler state

  - Dumping the tracebacks after a timeout

  - Dumping the traceback on a user signal

  - Issue with file descriptors

  - Example

- `pdb` — The Python Debugger

  - Command-line interface

  - Debugger commands

- `profiling` — Python profilers

  - Introduction to profiling

  - Choosing a profiler

    - When to use statistical sampling

    - When to use deterministic tracing

  - Quick start

    - Statistical profiling

    - Deterministic profiling

  - Understanding profile output

  - Legacy compatibility

    - `profiling.tracing` — Deterministic profiler

      - What is deterministic profiling?

      - Command-line interface

      - Programmatic usage examples

        - Basic profiling

        - Using the `Profile` class

      - Module reference

      - Using a custom timer

      - Limitations

    - `profiling.sampling` — Statistical profiler

      - What is statistical profiling?

        - How time is estimated

        - When to use a different approach

      - Quick examples

      - Commands

        - The `run` command

        - The `attach` command

        - The `dump` command

        - The `replay` command

        - Profiling in production

        - Platform requirements

        - Version compatibility

      - Sampling configuration

        - Sampling rate and duration

        - Thread selection

        - Blocking mode

        - Special frames

        - Opcode-aware profiling

        - Real-time statistics

        - Subprocess profiling

        - Sampling efficiency

      - Profiling modes

        - Wall-clock mode

        - CPU mode

        - Comparing wall-clock and CPU profiles

        - GIL mode

        - Exception mode

      - Output formats

        - pstats format

        - Collapsed stacks format

        - Flame graph format

          - Differential flame graphs

        - Gecko format

        - Heatmap format

        - Binary format

      - Record and replay workflow

      - Live mode

        - Keyboard commands

      - Async-aware profiling

        - Async modes

        - Task markers and stack reconstruction

        - Option restrictions

      - Command-line interface

        - Global options

        - Dump options

        - Sampling options

        - Mode options

        - Output options

        - pstats display options

        - Run command options

- `pstats` — Statistics for profilers

  - Reading and displaying profile data

    - Working with statistics

    - Filtering output

    - Analyzing call relationships

    - Combining multiple profiles

  - The `Stats` class

  - Command-line interface

- `timeit` — Measure execution time of small code snippets

  - Basic examples

  - Python interface

  - Command-line interface

  - Examples

- `trace` — Trace or track Python statement execution

  - Command-Line Usage

    - Main options

    - Modifiers

    - Filters

  - Programmatic Interface

- `tracemalloc` — Trace memory allocations

  - Examples

    - Display the top 10

    - Compute differences

    - Get the traceback of a memory block

    - Pretty top

      - Record the current and peak size of all traced memory blocks

  - API

    - Functions

    - DomainFilter

    - Filter

    - Frame

    - Snapshot

    - Statistic

    - StatisticDiff

    - Trace

    - Traceback
