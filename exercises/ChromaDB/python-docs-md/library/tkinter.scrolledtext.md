---
page: library/tkinter.scrolledtext.html
title: tkinter.scrolledtext — Scrolled text widget
area: library
kind: guide
module: tkinter.scrolledtext
---

<!-- anchor: module-tkinter.scrolledtext | type: section -->
# `tkinter.scrolledtext` — Scrolled text widget

**Source code:** Lib/tkinter/scrolledtext.py

The `tkinter.scrolledtext` module provides a class of the same name which implements a basic text widget which has a vertical scroll bar configured to do the “right thing.” Using the `ScrolledText` class is a lot easier than setting up a text widget and scroll bar directly.

The text widget and scrollbar are packed together in a `Frame`, and the methods of the `Pack`, `Grid` and `Place` geometry managers are acquired from the `Frame` object. This allows the `ScrolledText` widget to be used directly to achieve most normal geometry management behavior.

Should more specific control be necessary, the following attributes are available:

<!-- anchor: tkinter.scrolledtext.ScrolledText | type: py class -->
## `class tkinter.scrolledtext.ScrolledText(master=None, **kw)`

<!-- anchor: tkinter.scrolledtext.ScrolledText.frame | type: py attribute -->
### `frame`

The frame which surrounds the text and scroll bar widgets.

<!-- anchor: tkinter.scrolledtext.ScrolledText.vbar | type: py attribute -->
### `vbar`

The scroll bar widget.
