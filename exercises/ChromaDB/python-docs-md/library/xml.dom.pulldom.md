---
page: library/xml.dom.pulldom.html
title: xml.dom.pulldom — Support for building partial DOM trees
area: library
kind: guide
module: xml.dom.pulldom
---

<!-- anchor: module-xml.dom.pulldom | type: section -->
# `xml.dom.pulldom` — Support for building partial DOM trees

**Source code:** Lib/xml/dom/pulldom.py

The `xml.dom.pulldom` module provides a “pull parser” which can also be asked to produce DOM-accessible fragments of the document where necessary. The basic concept involves pulling “events” from a stream of incoming XML and processing them. In contrast to SAX which also employs an event-driven processing model together with callbacks, the user of a pull parser is responsible for explicitly pulling events from the stream, looping over those events until either processing is finished or an error condition occurs.

**Note:**

If you need to parse untrusted or unauthenticated data, see XML security.

Changed in version 3.7.1: The SAX parser no longer processes general external entities by default to increase security by default. To enable processing of external entities, pass a custom parser instance in:

```python
from xml.dom.pulldom import parse
from xml.sax import make_parser
from xml.sax.handler import feature_external_ges

parser = make_parser()
parser.setFeature(feature_external_ges, True)
parse(filename, parser=parser)
```

Example:

```python
from xml.dom import pulldom

doc = pulldom.parse('sales_items.xml')
for event, node in doc:
    if event == pulldom.START_ELEMENT and node.tagName == 'item':
        if int(node.getAttribute('price')) > 50:
            doc.expandNode(node)
            print(node.toxml())
```

`event` is one of the following constants, and `node` is the node which the event is about. The nodes implement the `xml.dom` interfaces; they are created by the DOM implementation given to `PullDOM`, which is `xml.dom.minidom` by default.

<!-- anchor: xml.dom.pulldom.START_DOCUMENT | type: py data -->
## `xml.dom.pulldom.START_DOCUMENT`

`xml.dom.pulldom.END_DOCUMENT`

The start and the end of the document. *node* is the `Document`.

<!-- anchor: xml.dom.pulldom.START_ELEMENT | type: py data -->
## `xml.dom.pulldom.START_ELEMENT`

`xml.dom.pulldom.END_ELEMENT`

The start tag and the end tag of an element. *node* is the `Element`.

<!-- anchor: xml.dom.pulldom.CHARACTERS | type: py data -->
## `xml.dom.pulldom.CHARACTERS`

Character data. *node* is the `Text` node.

<!-- anchor: xml.dom.pulldom.IGNORABLE_WHITESPACE | type: py data -->
## `xml.dom.pulldom.IGNORABLE_WHITESPACE`

White space in element content, as declared in the DTD. *node* is the `Text` node.

<!-- anchor: xml.dom.pulldom.COMMENT | type: py data -->
## `xml.dom.pulldom.COMMENT`

A comment. *node* is the `Comment` node.

<!-- anchor: xml.dom.pulldom.PROCESSING_INSTRUCTION | type: py data -->
## `xml.dom.pulldom.PROCESSING_INSTRUCTION`

A processing instruction. *node* is the `ProcessingInstruction` node.

Since the document is treated as a “flat” stream of events, the document “tree” is implicitly traversed and the desired elements are found regardless of their depth in the tree. In other words, one does not need to consider hierarchical issues such as recursive searching of the document nodes, although if the context of elements were important, one would either need to maintain some context-related state (i.e. remembering where one is in the document at any given point) or to make use of the `DOMEventStream.expandNode()` method and switch to DOM-related processing.

<!-- anchor: xml.dom.pulldom.PullDOM | type: py class -->
## `class xml.dom.pulldom.PullDOM(documentFactory=None)`

Subclass of `xml.sax.handler.ContentHandler` which turns SAX events into the events of the pull parser. The nodes are created, but they are not added to the tree, unless `expandNode()` is called. *documentFactory*, if given, is a DOM implementation used to create the document; by default the implementation of `xml.dom.minidom` is used.

<!-- anchor: xml.dom.pulldom.SAX2DOM | type: py class -->
## `class xml.dom.pulldom.SAX2DOM(documentFactory=None)`

Subclass of `PullDOM` which also adds every created node to the tree, so that the complete document is built.

<!-- anchor: xml.dom.pulldom.parse | type: py function -->
## `xml.dom.pulldom.parse(stream_or_string, parser=None, bufsize=None)`

Return a `DOMEventStream` from the given input. *stream_or_string* may be either a file name, or a file-like object. *parser*, if given, must be an `XMLReader` object. This function will change the document handler of the parser and activate namespace support; other parser configuration (like setting an entity resolver) must have been done in advance.

If you have XML in a string, you can use the `parseString()` function instead:

<!-- anchor: xml.dom.pulldom.parseString | type: py function -->
## `xml.dom.pulldom.parseString(string, parser=None)`

Return a `DOMEventStream` that represents the *string*. *string* must be a `str` instance; to parse bytes, pass a binary file object to `parse()`.

<!-- anchor: xml.dom.pulldom.default_bufsize | type: py data -->
## `xml.dom.pulldom.default_bufsize`

Default value for the *bufsize* parameter to `parse()`.

The value of this variable can be changed before calling `parse()` and the new value will take effect.

<!-- anchor: domeventstream-objects | type: section -->
## DOMEventStream Objects

<!-- anchor: xml.dom.pulldom.DOMEventStream | type: py class -->
### `class xml.dom.pulldom.DOMEventStream(stream, parser, bufsize)`

Produce the events for the data read from the file object *stream* by the `XMLReader` *parser*. The data is read by *bufsize* bytes, or characters for a text stream, at a time.

Changed in version 3.11: Support for `__getitem__()` method has been removed.

<!-- anchor: xml.dom.pulldom.DOMEventStream.getEvent | type: py method -->
#### `getEvent()`

Return the next `(event, node)` tuple, or `None` at the end of the document. See above for the events and the corresponding nodes. The current node does not contain information about its children, unless `expandNode()` is called.

<!-- anchor: xml.dom.pulldom.DOMEventStream.expandNode | type: py method -->
#### `expandNode(node)`

Expands all children of *node* into *node*. Example:

```python
from xml.dom import pulldom

xml = '<html><title>Foo</title> <p>Some text <div>and more</div></p> </html>'
doc = pulldom.parseString(xml)
for event, node in doc:
    if event == pulldom.START_ELEMENT and node.tagName == 'p':
        # Following statement only prints '<p/>'
        print(node.toxml())
        doc.expandNode(node)
        # Following statement prints node with all its children '<p>Some text <div>and more</div></p>'
        print(node.toxml())
```

<!-- anchor: xml.dom.pulldom.DOMEventStream.reset | type: py method -->
#### `reset()`

Discard the events which are not read yet and prepare the object for parsing a new document.

<!-- anchor: xml.dom.pulldom.DOMEventStream.clear | type: py method -->
#### `clear()`

Release the parser and the document. The stream is not closed, and the object can no longer be used.
