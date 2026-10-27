---
page: library/tkinter.font.html
title: tkinter.font — Tkinter font wrapper
area: library
kind: guide
module: tkinter.font
---

<!-- anchor: module-tkinter.font | type: section -->
# `tkinter.font` — Tkinter font wrapper

**Source code:** Lib/tkinter/font.py

The `tkinter.font` module provides the `Font` class for creating and using named fonts.

The different font weights and slants are:

<!-- anchor: tkinter.font.NORMAL | type: py data -->
## `tkinter.font.NORMAL`

`tkinter.font.BOLD`

`tkinter.font.ITALIC`

`tkinter.font.ROMAN`

<!-- anchor: tkinter.font.Font | type: py class -->
## `class tkinter.font.Font(root=None, font=None, name=None, exists=False, **options)`

The `Font` class represents a named font. *Font* instances are given unique names and can be specified by their family, size, and style configuration. Named fonts are Tk’s method of creating and identifying fonts as a single object, rather than specifying a font by its attributes with each occurrence.

Changed in version 3.10: Two fonts now compare equal (`==`) only when both are `Font` instances with the same name belonging to the same Tcl interpreter.

arguments:

*font* - font specifier tuple (family, size, options)

*name* - unique font name

*exists* - self points to existing named font if true

additional keyword options (ignored if *font* is specified):

*family* - font family, for example, Courier, Times

*size* - font size

If *size* is positive it is interpreted as size in points.

If *size* is a negative number its absolute value is treated

as size in pixels.

*weight* - font emphasis (NORMAL, BOLD)

*slant* - ROMAN, ITALIC

*underline* - font underlining (0 - none, 1 - underline)

*overstrike* - font strikeout (0 - none, 1 - strikeout)

<!-- anchor: tkinter.font.Font.actual | type: py method -->
### `actual(option=None, displayof=None)`

Return the actual attributes of the font, which may differ from the requested ones because of platform limitations. With no *option*, return a dictionary of all the attributes; if *option* is given, return the value of that single attribute. The attributes are resolved on the display of the *displayof* widget, or the main application window if it is not specified.

<!-- anchor: tkinter.font.Font.cget | type: py method -->
### `cget(option)`

Retrieve an attribute of the font.

<!-- anchor: tkinter.font.Font.configure | type: py method -->
### `configure(**options)`

Modify one or more attributes of the font. With no arguments, return a dictionary of the current attributes.

`config()` is an alias of `configure()`.

<!-- anchor: tkinter.font.Font.copy | type: py method -->
### `copy()`

Return a distinct copy of the current font: a new named font with the same attributes but a different name, which can be reconfigured independently of the original. If the current font wraps a font description, the copy is instead a named font with its resolved attributes.

<!-- anchor: tkinter.font.Font.measure | type: py method -->
### `measure(text, displayof=None)`

Return amount of space the text would occupy on the specified display when formatted in the current font, as an integer number of pixels. If no display is specified then the main application window is assumed.

<!-- anchor: tkinter.font.Font.metrics | type: py method -->
### `metrics(*options, **kw)`

Return font-specific data. With no options, return a dictionary mapping each metric name to its integer value; if one option name is given, return that metric’s value as an integer. Options include:

***ascent* - distance between baseline and highest point that a**

character of the font can occupy

***descent* - distance between baseline and lowest point that a**

character of the font can occupy

***linespace* - minimum vertical separation necessary between any two**

characters of the font that ensures no vertical overlap between lines.

*fixed* - 1 if font is fixed-width else 0

<!-- anchor: tkinter.font.families | type: py function -->
## `tkinter.font.families(root=None, displayof=None)`

Return a tuple of the names of the available font families.

<!-- anchor: tkinter.font.names | type: py function -->
## `tkinter.font.names(root=None)`

Return a tuple of the names of all the defined fonts.

<!-- anchor: tkinter.font.nametofont | type: py function -->
## `tkinter.font.nametofont(name, root=None)`

Return a `Font` representation of the existing named font *name*. *root* is the widget whose Tcl interpreter owns the font; if omitted, the default root window is used.

Changed in version 3.10: The *root* parameter was added.
