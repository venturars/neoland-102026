# `__future__` — Future statement definitions

Imports of the form `from __future__ import feature` are called
future statements. These are special-cased by the Python compiler
to allow the use of new Python features in modules containing the future statement
before the release in which the feature becomes standard.

While these future statements are given additional special meaning by the
Python compiler, they are still executed like any other import statement and
the `__future__` exists and is handled by the import system the same way
any other Python module would be. This design serves three purposes:

- To avoid confusing existing tools that analyze import statements and expect to
  find the modules they’re importing.
- To document when incompatible changes were introduced, and when they will be
  — or were — made mandatory. This is a form of executable documentation, and
  can be inspected programmatically via importing `__future__` and examining
  its contents.
- To ensure that future statements run under releases prior to
  Python 2.1 at least yield runtime exceptions (the import of `__future__`
  will fail, because there was no module of that name prior to 2.1).

## Module Contents

No feature description will ever be deleted from `__future__`. Since its
introduction in Python 2.1 the following features have found their way into the
language using this mechanism:

| feature | optional in | mandatory in | effect |
| --- | --- | --- | --- |
| \_\_future\_\_.nested\_scopes | 2.1.0b1 | 2.2 | **PEP 227**: *Statically Nested Scopes* |
| \_\_future\_\_.generators | 2.2.0a1 | 2.3 | **PEP 255**: *Simple Generators* |
| \_\_future\_\_.division | 2.2.0a2 | 3.0 | **PEP 238**: *Changing the Division Operator* |
| \_\_future\_\_.absolute\_import | 2.5.0a1 | 3.0 | **PEP 328**: *Imports: Multi-Line and Absolute/Relative* |
| \_\_future\_\_.with\_statement | 2.5.0a1 | 2.6 | **PEP 343**: *The “with” Statement* |
| \_\_future\_\_.print\_function | 2.6.0a2 | 3.0 | **PEP 3105**: *Make print a function* |
| \_\_future\_\_.unicode\_literals | 2.6.0a2 | 3.0 | **PEP 3112**: *Bytes literals in Python 3000* |
| \_\_future\_\_.generator\_stop | 3.5.0b1 | 3.7 | **PEP 479**: *StopIteration handling inside generators* |
| \_\_future\_\_.annotations | 3.7.0b1 | Never [[1]](#id2) | **PEP 563**: *Postponed evaluation of annotations*, **PEP 649**: *Deferred evaluation of annotations using descriptors* |

class \_\_future\_\_.\_Feature
:   Each statement in `__future__.py` is of the form:

    ```
    FeatureName = _Feature(OptionalRelease, MandatoryRelease,
                           CompilerFlag)
    ```

    where, normally, *OptionalRelease* is less than *MandatoryRelease*, and both are
    5-tuples of the same form as `sys.version_info`:

    ```
    (PY_MAJOR_VERSION, # the 2 in 2.1.0a3; an int
     PY_MINOR_VERSION, # the 1; an int
     PY_MICRO_VERSION, # the 0; an int
     PY_RELEASE_LEVEL, # "alpha", "beta", "candidate" or "final"; string
     PY_RELEASE_SERIAL # the 3; an int
    )
    ```

\_Feature.getOptionalRelease()
:   *OptionalRelease* records the first release in which the feature was accepted.

\_Feature.getMandatoryRelease()
:   In the case of a *MandatoryRelease* that has not yet occurred,
    *MandatoryRelease* predicts the release in which the feature will become part of
    the language.

    Else *MandatoryRelease* records when the feature became part of the language; in
    releases at or after that, modules no longer need a future statement to use the
    feature in question, but may continue to use such imports.

    *MandatoryRelease* may also be `None`, meaning that a planned feature got
    dropped or that it is not yet decided.

\_Feature.compiler\_flag
:   *CompilerFlag* is the (bitfield) flag that should be passed in the fourth
    argument to the built-in function `compile()` to enable the feature in
    dynamically compiled code. This flag is stored in the `_Feature.compiler_flag`
    attribute on `_Feature` instances.

[1]

`from __future__ import annotations` was previously scheduled to
become mandatory in Python 3.10, but the change was delayed and ultimately
canceled. This feature will eventually be deprecated and removed. See
**PEP 649** and **PEP 749**.

See also

Future statements
:   How the compiler treats future imports.

**PEP 236** - Back to the \_\_future\_\_
:   The original proposal for the \_\_future\_\_ mechanism.
