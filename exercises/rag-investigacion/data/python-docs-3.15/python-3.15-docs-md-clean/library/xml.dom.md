# `xml.dom` — The Document Object Model API

The Document Object Model, or “DOM,” is a cross-language API from the World Wide
Web Consortium (W3C) for accessing and modifying XML documents. A DOM
implementation presents an XML document as a tree structure, or allows client
code to build such a structure from scratch. It then gives access to the
structure through a set of objects which provided well-known interfaces.

The DOM is extremely useful for random-access applications. SAX only allows you
a view of one bit of the document at a time. If you are looking at one SAX
element, you have no access to another. If you are looking at a text node, you
have no access to a containing element. When you write a SAX application, you
need to keep track of your program’s position in the document somewhere in your
own code. SAX does not do it for you. Also, if you need to look ahead in the
XML document, you are just out of luck.

Some applications are simply impossible in an event driven model with no access
to a tree. Of course you could build some sort of tree yourself in SAX events,
but the DOM allows you to avoid writing that code. The DOM is a standard tree
representation for XML data.

The Document Object Model is being defined by the W3C in stages, or “levels” in
their terminology. The Python mapping of the API is substantially based on the
DOM Level 2 recommendation.

DOM applications typically start by parsing some XML into a DOM. How this is
accomplished is not covered at all by DOM Level 1, and Level 2 provides only
limited improvements: There is a `DOMImplementation` object class which
provides access to `Document` creation methods, but no way to access an
XML reader/parser/Document builder in an implementation-independent way. There
is also no well-defined way to access these methods without an existing
`Document` object. In Python, each DOM implementation will provide a
function `getDOMImplementation()`. DOM Level 3 adds a Load/Store
specification, which defines an interface to the reader, but this is not yet
available in the Python standard library.

Once you have a DOM document object, you can access the parts of your XML
document through its properties and methods. These properties are defined in
the DOM specification; this portion of the reference manual describes the
interpretation of the specification in Python.

The specification provided by the W3C defines the DOM API for Java, ECMAScript,
and OMG IDL. The Python mapping defined here is based in large part on the IDL
version of the specification, but strict compliance is not required (though
implementations are free to support the strict mapping from IDL). See section
Conformance for a detailed discussion of mapping requirements.

See also

Document Object Model (DOM) Level 2 Specification
:   The W3C recommendation upon which the Python DOM API is based.

Document Object Model (DOM) Level 1 Specification
:   The W3C recommendation for the DOM supported by `xml.dom.minidom`.

Python Language Mapping Specification
:   This specifies the mapping from OMG IDL to Python.

## Module Contents

The `xml.dom` contains the following functions:

xml.dom.registerDOMImplementation(*name*, *factory*)
:   Register the *factory* function with the name *name*. The factory function
    should return an object which implements the `DOMImplementation`
    interface. The factory function can return the same object every time, or a new
    one for each call, as appropriate for the specific implementation (e.g. if that
    implementation supports some customization).

xml.dom.getDOMImplementation(*name=None*, *features=()*)
:   Return a suitable DOM implementation. The *name* is either well-known, the
    module name of a DOM implementation, or `None`. If it is not `None`, imports
    the corresponding module and returns a `DOMImplementation` object if the
    import succeeds. If no name is given, and if the environment variable
    `PYTHON_DOM` is set, this variable is used to find the implementation.
    The only well-known name in the standard library is `'minidom'`,
    for `xml.dom.minidom`.

    If name is not given, this examines the available implementations to find one
    with the required feature set. If no implementation can be found, raise an
    `ImportError`. The features list must be a sequence of `(feature,
    version)` pairs which are passed to the `hasFeature()`
    method on available `DOMImplementation` objects.

Some convenience constants are also provided:

xml.dom.EMPTY\_NAMESPACE
:   The value used to indicate that no namespace is associated with a node in the
    DOM. This is typically found as the `namespaceURI` of a node, or
    used as the *namespaceURI* parameter to a namespaces-specific method.

xml.dom.XML\_NAMESPACE
:   The namespace URI associated with the reserved prefix `xml`, as defined by
    Namespaces in XML (section 4).

xml.dom.XMLNS\_NAMESPACE
:   The namespace URI for namespace declarations, as defined by [Document Object
    Model (DOM) Level 2 Core Specification](https://www.w3.org/TR/DOM-Level-2-Core/core.html) (section 1.1.8).

xml.dom.XHTML\_NAMESPACE
:   The URI of the XHTML namespace as defined by [XHTML 1.0: The Extensible
    HyperText Markup Language](https://www.w3.org/TR/xhtml1/) (section 3.1.1).

In addition, `xml.dom` contains a base `Node` class and the DOM
exception classes. The `Node` class provided by this module does not
implement any of the methods or attributes defined by the DOM specification;
concrete DOM implementations must provide those. The `Node` class
provided as part of this module does provide the constants used for the
`nodeType` attribute on concrete `Node` objects; they are located
within the class rather than at the module level to conform with the DOM
specifications.

## Objects in the DOM

The definitive documentation for the DOM is the DOM specification from the W3C.

The names documented in this section are DOM interfaces.
With the exception of `Node` and the exception classes,
they are not provided by the `xml.dom` module itself,
but by concrete DOM implementations, such as `xml.dom.minidom`.

Note that DOM attributes may also be manipulated as nodes instead of as simple
strings. It is fairly rare that you must do this, however, so this usage is not
yet documented.

| Interface | Section | Purpose |
| --- | --- | --- |
| `DOMImplementation` | DOMImplementation Objects | Interface to the underlying implementation. |
| `Node` | Node Objects | Base interface for most objects in a document. |
| `NodeList` | NodeList Objects | Interface for a sequence of nodes. |
| `DocumentType` | DocumentType Objects | Information about the declarations needed to process a document. |
| `Document` | Document Objects | Object which represents an entire document. |
| `Element` | Element Objects | Element nodes in the document hierarchy. |
| `Attr` | Attr Objects | Attribute value nodes on element nodes. |
| `Comment` | Comment Objects | Representation of comments in the source document. |
| `Text` | Text and CDATASection Objects | Nodes containing textual content from the document. |
| `ProcessingInstruction` | ProcessingInstruction Objects | Processing instruction representation. |

An additional section describes the exceptions defined for working with the DOM
in Python.

### DOMImplementation Objects

The `DOMImplementation` interface provides a way for applications to
determine the availability of particular features in the DOM they are using.
DOM Level 2 added the ability to create new `Document` and
`DocumentType` objects using the `DOMImplementation` as well.

DOMImplementation.hasFeature(*feature*, *version*)
:   Return `True` if the feature identified by the pair of strings *feature* and
    *version* is implemented.

DOMImplementation.createDocument(*namespaceUri*, *qualifiedName*, *doctype*)
:   Return a new `Document` object (the root of the DOM), with a child
    `Element` object having the given *namespaceUri* and *qualifiedName*. The
    *doctype* must be a `DocumentType` object created by
    `createDocumentType()`, or `None`. In the Python DOM API, the first two
    arguments can also be `None` in order to indicate that no `Element`
    child is to be created.

DOMImplementation.createDocumentType(*qualifiedName*, *publicId*, *systemId*)
:   Return a new `DocumentType` object that encapsulates the given
    *qualifiedName*, *publicId*, and *systemId* strings, representing the
    information contained in an XML document type declaration.

### Node Objects

All of the components of an XML document are subclasses of `Node`.

Only nodes of the following types can have children,
and only children of the listed types:

`Document`
:   at most one `Element`, at most one `DocumentType`,
    `ProcessingInstruction` and `Comment`

`DocumentFragment` and `Element`
:   `Element`, `Text`, `CDATASection`,
    `ProcessingInstruction` and `Comment`

`Attr`
:   `Text`

Nodes of other types cannot have children.
Inserting a child of a not allowed type raises `HierarchyRequestErr`.

Node.nodeType
:   An integer representing the node type. Symbolic constants for the types are on
    the `Node` object.
    This is a read-only attribute.

Node.ELEMENT\_NODE

Node.ATTRIBUTE\_NODE

Node.TEXT\_NODE

Node.CDATA\_SECTION\_NODE

Node.ENTITY\_REFERENCE\_NODE

Node.ENTITY\_NODE

Node.PROCESSING\_INSTRUCTION\_NODE

Node.COMMENT\_NODE

Node.DOCUMENT\_NODE

Node.DOCUMENT\_TYPE\_NODE

Node.DOCUMENT\_FRAGMENT\_NODE

Node.NOTATION\_NODE
:   Integer constants for the possible values
    of the `nodeType` attribute.

Node.parentNode
:   The parent of the current node, or `None` for the document node. The value is
    always a `Node` object or `None`. For `Element` nodes, this
    will be the parent element, except for the root element, in which case it will
    be the `Document` object. For `Attr` nodes, this is always
    `None`. This is a read-only attribute.

Node.attributes
:   A `NamedNodeMap` of attribute objects. Only elements have actual values
    for this; others provide `None` for this attribute. This is a read-only
    attribute.

Node.previousSibling
:   The node that immediately precedes this one with the same parent. For
    instance the element with an end-tag that comes just before the *self*
    element’s start-tag. Of course, XML documents are made up of more than just
    elements so the previous sibling could be text, a comment, or something else.
    If this node is the first child of the parent, this attribute will be
    `None`. This is a read-only attribute.

Node.nextSibling
:   The node that immediately follows this one with the same parent. See also
    `previousSibling`. If this is the last child of the parent, this
    attribute will be `None`. This is a read-only attribute.

Node.childNodes
:   A `NodeList` of the children of this node.
    If the node has no children, the list is empty.
    This is a read-only attribute.

Node.firstChild
:   The first child of the node, if there are any, or `None`. This is a read-only
    attribute.

Node.lastChild
:   The last child of the node, if there are any, or `None`. This is a read-only
    attribute.

Node.localName
:   The part of the `tagName` following the colon if there is one,
    else the entire `tagName`. The value is a string.

Node.prefix
:   The part of the `tagName` preceding the colon if there is one,
    else the empty string. The value is a string, or `None`.

Node.namespaceURI
:   The namespace associated with the element name. This will be a string or
    `None`. This is a read-only attribute.

Node.ownerDocument
:   The `Document` object to which this node belongs, or `None`
    for a document itself.
    This is a read-only attribute.

Node.isSupported(*feature*, *version*)
:   Return whether the DOM implementation supports a particular *feature*,
    as `DOMImplementation.hasFeature()` does.

Node.setUserData(*key*, *data*, *handler*)
:   Associate *data* with *key* on this node and return the data previously
    associated with *key*, or `None`.
    If *data* is `None`, the association is removed.
    *handler* is called when the node is cloned, imported, renamed or deleted;
    pass `None` if no notification is needed.

Node.getUserData(*key*)
:   Return the data associated with *key* on this node
    by `setUserData()`, or `None`.

Node.nodeName
:   The name of this node, depending on its type; see the table below.
    You can always get the information you would get here from another
    property such as the `tagName` property for elements or the
    `name` property for attributes.
    This is a read-only attribute.

Node.nodeValue
:   The value of this node, depending on its type; see the table below.
    The value is a string or `None`.

The values of `nodeName` and `nodeValue`
for each node type are:

| Node type | nodeName | nodeValue |
| --- | --- | --- |
| `Attr` | `name` | `value` |
| `CDATASection` | `'#cdata-section'` | the content |
| `Comment` | `'#comment'` | the content |
| `Document` | `'#document'` | `None` |
| `DocumentFragment` | `'#document-fragment'` | `None` |
| `DocumentType` | `name` | `None` |
| `Element` | `tagName` | `None` |
| `Entity` | the name of the entity | `None` |
| `Notation` | the name of the notation | `None` |
| `ProcessingInstruction` | `target` | `data` |
| `Text` | `'#text'` | the content |

Node.hasAttributes()
:   Return `True` if the node has any attributes.

Node.hasChildNodes()
:   Return `True` if the node has any child nodes.

Node.isSameNode(*other*)
:   Return `True` if *other* refers to the same node as this node. This is especially
    useful for DOM implementations which use any sort of proxy architecture (because
    more than one object can refer to the same node).

    Note

    This is based on a proposed DOM Level 3 API which is still in the “working
    draft” stage, but this particular interface appears uncontroversial. Changes
    from the W3C will not necessarily affect this method in the Python DOM interface
    (though any new W3C API for this would also be supported).

Node.appendChild(*newChild*)
:   Add a new child node to this node at the end of the list of
    children, returning *newChild*. If the node was already in
    the tree, it is removed first.

Node.insertBefore(*newChild*, *refChild*)
:   Insert a new child node before an existing child. It must be the case that
    *refChild* is a child of this node; if not, `NotFoundErr` is raised.
    *newChild* is returned. If *refChild* is `None`, it inserts *newChild* at the
    end of the children’s list.

Node.removeChild(*oldChild*)
:   Remove a child node. *oldChild* must be a child of this node; if not,
    `NotFoundErr` is raised. *oldChild* is returned on success. If *oldChild*
    will not be used further, its `unlink()` method
    should be called.

Node.replaceChild(*newChild*, *oldChild*)
:   Replace an existing node with a new node. It must be the case that *oldChild*
    is a child of this node; if not, `NotFoundErr` is raised.

Node.normalize()
:   Join adjacent text nodes so that all stretches of text are stored as single
    `Text` instances. This simplifies processing text from a DOM tree for
    many applications.

Node.cloneNode(*deep*)
:   Clone this node. Setting *deep* means to clone all child nodes as well. This
    returns the clone.

### NodeList Objects

A `NodeList` represents a sequence of nodes. These objects are used in
two ways in the DOM Core recommendation: an `Element` object provides
one as its list of child nodes, and the `getElementsByTagName()`
and `getElementsByTagNameNS()` methods of `Element` return
objects with this interface to represent query results.

`NodeList` does *not* inherit from `Node`.

The DOM Level 2 recommendation defines one method and one attribute for these
objects:

NodeList.item(*i*)
:   Return the *i*’th item from the sequence,
    or `None` if *i* is out of range.
    Negative indices are not supported.

NodeList.length
:   The number of nodes in the sequence.

In addition, the Python DOM interface requires that some additional support is
provided to allow `NodeList` objects to be used as Python sequences. All
`NodeList` implementations must include support for
`__len__()` and
`__getitem__()`; this allows iteration over the `NodeList` in
`for` statements and proper support for the `len()` built-in
function.

If a DOM implementation supports modification of the document, the
`NodeList` implementation must also support the
`__setitem__()` and `__delitem__()` methods.

### DocumentType Objects

Information about the notations and entities declared by a document (including
the external subset if the parser uses it and can provide the information) is
available from a `DocumentType` object. The `DocumentType` for a
document is available from the `Document` object’s `doctype`
attribute; if there is no `DOCTYPE` declaration for the document, the
document’s `doctype` attribute will be set to `None` instead of an
instance of this interface.

`DocumentType` is a specialization of `Node`, and adds the
following attributes:

DocumentType.publicId
:   The public identifier for the external subset of the document type definition,
    or `None` if the `DOCTYPE` declaration does not specify it.

DocumentType.systemId
:   The system identifier, a URI, for the external subset of the document type
    definition, or `None` if the `DOCTYPE` declaration does not specify it.

DocumentType.internalSubset
:   A string giving the complete internal subset from the document. This does not
    include the brackets which enclose the subset. If the document has no internal
    subset, this should be `None`.

DocumentType.name
:   The name of the root element as given in the `DOCTYPE` declaration, if
    present.

DocumentType.entities
:   This is a `NamedNodeMap` of `Entity` nodes
    giving the definitions of external entities.
    For entity names defined more than once, only the first definition is provided
    (others are ignored as required by the XML recommendation). This may be
    `None` if the information is not provided by the parser, or if no entities are
    defined.

DocumentType.notations
:   This is a `NamedNodeMap` of `Notation` nodes
    giving the definitions of notations. For
    notation names defined more than once, only the first definition is provided
    (others are ignored as required by the XML recommendation). This may be
    `None` if the information is not provided by the parser, or if no notations
    are defined.

### Document Objects

A `Document` represents an entire XML document, including its constituent
elements, attributes, processing instructions, comments etc. Remember that it
inherits properties from `Node`.

Document.documentElement
:   The one and only root element of the document.

Document.doctype
:   The `DocumentType` node of the document, or `None`.
    This is a read-only attribute.

Document.implementation
:   The `DOMImplementation` object which created this document.
    This is a read-only attribute.

Document.strictErrorChecking
:   Whether error checking is enforced.

Document.documentURI
:   The location of the document, or `None` if it is unknown.

Document.createDocumentFragment()
:   Create and return an empty `DocumentFragment` node.

Document.createCDATASection(*data*)
:   Create and return a `CDATASection` node containing *data*.

Document.importNode(*importedNode*, *deep*)
:   Return a copy of *importedNode* which belongs to this document.
    The original node is not removed from its document.
    If *deep* is true, the descendants of the node are copied too.

Document.createElement(*tagName*)
:   Create and return a new element node. The element is not inserted into the
    document when it is created. You need to explicitly insert it with one of the
    other methods such as `insertBefore()` or `appendChild()`.

Document.createElementNS(*namespaceURI*, *tagName*)
:   Create and return a new element with a namespace. The *tagName* may have a
    prefix. The element is not inserted into the document when it is created. You
    need to explicitly insert it with one of the other methods such as
    `insertBefore()` or `appendChild()`.

Document.createTextNode(*data*)
:   Create and return a text node containing the data passed as a parameter. As
    with the other creation methods, this one does not insert the node into the
    tree.

Document.createComment(*data*)
:   Create and return a comment node containing the data passed as a parameter. As
    with the other creation methods, this one does not insert the node into the
    tree.

Document.createProcessingInstruction(*target*, *data*)
:   Create and return a processing instruction node containing the *target* and
    *data* passed as parameters. As with the other creation methods, this one does
    not insert the node into the tree.

Document.createAttribute(*name*)
:   Create and return an attribute node. This method does not associate the
    attribute node with any particular element. You must use
    `setAttributeNode()` on the appropriate `Element` object
    to use the newly created attribute instance.

Document.createAttributeNS(*namespaceURI*, *qualifiedName*)
:   Create and return an attribute node with a namespace. The *tagName* may have a
    prefix. This method does not associate the attribute node with any particular
    element. You must use `setAttributeNode()` on the appropriate
    `Element` object to use the newly created attribute instance.

Document.getElementById(*id*)
:   Return the element with the given ID, or `None`.
    Only attributes declared as being of type ID in the DTD
    or by `Element.setIdAttribute()` are searched.

Document.getElementsByTagName(*tagName*)
:   Search for all descendants (direct children, children’s children, etc.) with a
    particular element type name.

Document.getElementsByTagNameNS(*namespaceURI*, *localName*)
:   Search for all descendants (direct children, children’s children, etc.) with a
    particular namespace URI and localname. The localname is the part of the
    namespace after the prefix.

Document.renameNode(*n*, *namespaceURI*, *name*)
:   Rename the element or attribute node *n*
    and return it.
    *namespaceURI* is the new namespace URI, or
    `EMPTY_NAMESPACE` if the node does not belong to a namespace.
    *name* is the new qualified name.

    Raise `WrongDocumentErr` if *n* was created by another document,
    and `NotSupportedErr` if it is neither an element nor an attribute.

### Element Objects

`Element` is a subclass of `Node`, so inherits all the attributes
of that class.

Element.tagName
:   The element type name. In a namespace-using document it may have colons in it.
    The value is a string.

Element.setIdAttribute(*name*)
:   Declare that the attribute *name* is of type ID,
    so that the element is found by `Document.getElementById()`.
    Raise `NotFoundErr` if the element has no such attribute.

Element.setIdAttributeNS(*namespaceURI*, *localName*)
:   The same as `setIdAttribute()`,
    but for an attribute specified by its namespace URI and local name.

Element.setIdAttributeNode(*idAttr*)
:   The same as `setIdAttribute()`,
    but for an already retrieved attribute node.

Element.getElementsByTagName(*tagName*)
:   Same as equivalent method in the `Document` class.

Element.getElementsByTagNameNS(*namespaceURI*, *localName*)
:   Same as equivalent method in the `Document` class.

Element.hasAttribute(*name*)
:   Return `True` if the element has an attribute named by *name*.

Element.hasAttributeNS(*namespaceURI*, *localName*)
:   Return `True` if the element has an attribute named by *namespaceURI* and
    *localName*.

Element.getAttribute(*name*)
:   Return the value of the attribute named by *name* as a string. If no such
    attribute exists, an empty string is returned, as if the attribute had no value.

Element.getAttributeNode(*attrname*)
:   Return the `Attr` node for the attribute named by *attrname*.

Element.getAttributeNS(*namespaceURI*, *localName*)
:   Return the value of the attribute named by *namespaceURI* and *localName* as a
    string. If no such attribute exists, an empty string is returned, as if the
    attribute had no value.

Element.getAttributeNodeNS(*namespaceURI*, *localName*)
:   Return an attribute value as a node, given a *namespaceURI* and *localName*.

Element.removeAttribute(*name*)
:   Remove an attribute by name.

Element.removeAttributeNode(*oldAttr*)
:   Remove and return *oldAttr* from the attribute list, if present. If *oldAttr* is
    not present, `NotFoundErr` is raised.

Element.removeAttributeNS(*namespaceURI*, *localName*)
:   Remove an attribute by name. Note that it uses a localName, not a qname.

Element.setAttribute(*name*, *value*)
:   Set an attribute value from a string.

Element.setAttributeNode(*newAttr*)
:   Add a new attribute node to the element, replacing an existing attribute if
    necessary if the `name` attribute matches. If a replacement
    occurs, the old attribute node will be returned. If *newAttr* is already in use,
    `InuseAttributeErr` will be raised.

Element.setAttributeNodeNS(*newAttr*)
:   Add a new attribute node to the element, replacing an existing attribute if
    necessary if the `namespaceURI` and `localName`
    attributes match. If a replacement occurs, the old attribute node will be
    returned. If *newAttr* is already in use, `InuseAttributeErr` will be
    raised.

Element.setAttributeNS(*namespaceURI*, *qname*, *value*)
:   Set an attribute value from a string, given a *namespaceURI* and a *qname*.
    Note that a qname is the whole attribute name. This is different than above.

### Attr Objects

`Attr` inherits from `Node`, so inherits all its attributes.

Attribute nodes are not part of the document tree.
They are contained in the `attributes` map of an element,
not in its children,
and their `parentNode`, `previousSibling`
and `nextSibling` are always `None`.

Attr.name
:   The attribute name.
    In a namespace-using document it may include a colon.

Attr.localName
:   The part of the name following the colon if there is one, else the
    entire name.
    This is a read-only attribute.

Attr.prefix
:   The part of the name preceding the colon if there is one, else the
    empty string.

Attr.isId
:   Whether this attribute is of type ID,
    either because it is declared as such in the DTD
    or because `Element.setIdAttribute()` was used.
    This is a read-only attribute.

Attr.ownerElement
:   The `Element` node to which this attribute belongs,
    or `None` if it is not used.
    This is a read-only attribute.

Attr.specified
:   Whether the value of the attribute was explicitly set in the document,
    as opposed to being defaulted from the DTD.
    This is a read-only attribute.

Attr.value
:   The text value of the attribute. This is a synonym for the
    `nodeValue` attribute.

### NamedNodeMap Objects

`NamedNodeMap` does *not* inherit from `Node`.

NamedNodeMap.length
:   The length of the attribute list.

NamedNodeMap.item(*index*)
:   Return an attribute with a particular index. The order you get the attributes
    in is arbitrary but will be consistent for the life of a DOM. Each item is an
    attribute node. Get its value with the `value` attribute.

NamedNodeMap.getNamedItem(*name*)
:   Return the node with the given `name`,
    or `None` if there is no such node.

NamedNodeMap.getNamedItemNS(*namespaceURI*, *localName*)
:   Return the node with the given namespace URI and local name,
    or `None` if there is no such node.

NamedNodeMap.setNamedItem(*node*)
:   Add *node* to the map, using its `name` as the key.
    Return the node which it replaces, or `None` if it replaces no node.

NamedNodeMap.setNamedItemNS(*node*)
:   Add *node* to the map,
    using its namespace URI and local name as the key.
    Return the node which it replaces, or `None` if it replaces no node.

NamedNodeMap.removeNamedItem(*name*)
:   Remove and return the node with the given `name`.
    Raise `NotFoundErr` if there is no such node.

NamedNodeMap.removeNamedItemNS(*namespaceURI*, *localName*)
:   Remove and return the node with the given namespace URI and local name.
    Raise `NotFoundErr` if there is no such node.

You can also use the standardized `getAttribute*()` family of methods
on the `Element` objects.

### DocumentFragment Objects

`DocumentFragment` is a lightweight container of nodes.
It is a subclass of `Node`.
When it is inserted into the document tree,
its children are inserted instead of it,
and it becomes empty.

### CharacterData Objects

`CharacterData` represents text-like data in the XML document.
It is a subclass of `Node`, and the base class
of `Text`, `CDATASection` and `Comment`.
Such nodes cannot have child nodes.

CharacterData.data
:   The content of the node as a string.

CharacterData.length
:   The number of characters in `data`.
    This is a read-only attribute.

CharacterData.substringData(*offset*, *count*)
:   Return the substring of `data`
    of *count* characters starting at *offset*.

CharacterData.appendData(*arg*)
:   Append the string *arg* to `data`.

CharacterData.insertData(*offset*, *arg*)
:   Insert the string *arg* into `data` at *offset*.

CharacterData.deleteData(*offset*, *count*)
:   Remove *count* characters from `data`
    starting at *offset*.

CharacterData.replaceData(*offset*, *count*, *arg*)
:   Replace *count* characters of `data`
    starting at *offset* with the string *arg*.

### Comment Objects

`Comment` represents a comment in the XML document.
It is a subclass of `CharacterData`.

Comment.data
:   The content of the comment as a string. The attribute contains all characters
    between the leading `<!-``-` and trailing `-``->`, but does not
    include them.

### Text and CDATASection Objects

The `Text` interface represents text in the XML document. If the parser
and DOM implementation support the DOM’s XML extension, portions of the text
enclosed in CDATA marked sections are stored in `CDATASection` objects.
These two interfaces are identical, but provide different values for the
`nodeType` attribute.

`Text` extends the `CharacterData` interface,
and `CDATASection` extends `Text`.

Text.data
:   The content of the text node as a string.

Text.wholeText
:   The text of all `Text` nodes logically adjacent to this node,
    concatenated in document order.
    This is a read-only attribute.

Text.replaceWholeText(*content*)
:   Replace the text of all `Text` nodes logically adjacent
    to this node with *content*, removing the other nodes.
    Return this node, or `None` if *content* is empty.

Text.splitText(*offset*)
:   Split this node into two nodes at *offset*,
    keeping the first part in this node
    and returning a new sibling node with the rest.

Note

The use of a `CDATASection` node does not indicate that the node
represents a complete CDATA marked section, only that the content of the node
was part of a CDATA section. A single CDATA section may be represented by more
than one node in the document tree. There is no way to determine whether two
adjacent `CDATASection` nodes represent different CDATA marked sections.

### ProcessingInstruction Objects

Represents a processing instruction in the XML document; this inherits from the
`Node` interface and cannot have child nodes.

ProcessingInstruction.target
:   The content of the processing instruction up to the first whitespace character.
    This is a read-only attribute.

ProcessingInstruction.data
:   The content of the processing instruction following the first whitespace
    character.

### Entity Objects

`Entity` represents a parsed or unparsed entity declared in the DTD.
It is a subclass of `Node`.
Entity nodes are contained in `DocumentType.entities`
and cannot be inserted into the document tree.
The name of the entity is its `nodeName`.

Entity.publicId
:   The public identifier of the entity,
    or `None` if it is not specified.
    This is a read-only attribute.

Entity.systemId
:   The system identifier of the entity,
    or `None` if it is not specified.
    This is a read-only attribute.

Entity.notationName
:   The name of the notation for an unparsed entity,
    or `None` for a parsed entity.
    This is a read-only attribute.

### Notation Objects

`Notation` represents a notation declared in the DTD.
It is a subclass of `Node` and cannot have child nodes.
Notation nodes are contained in `DocumentType.notations`
and cannot be inserted into the document tree.
The name of the notation is its `nodeName`.

Notation.publicId
:   The public identifier of the notation,
    or `None` if it is not specified.
    This is a read-only attribute.

Notation.systemId
:   The system identifier of the notation,
    or `None` if it is not specified.
    This is a read-only attribute.

### Exceptions

The DOM Level 2 recommendation defines a single exception, `DOMException`,
and a number of constants that allow applications to determine what sort of
error occurred. `DOMException` instances carry a `code` attribute
that provides the appropriate value for the specific exception.

The Python DOM interface provides the constants, but also expands the set of
exceptions so that a specific exception exists for each of the exception codes
defined by the DOM. The implementations must raise the appropriate specific
exception, each of which carries the appropriate value for the `code`
attribute.

exception xml.dom.DOMException
:   Base exception class used for all specific DOM exceptions. This exception class
    cannot be directly instantiated.

exception xml.dom.DomstringSizeErr
:   Raised when a specified range of text does not fit into a string. This is not
    known to be used in the Python DOM implementations, but may be received from DOM
    implementations not written in Python.

exception xml.dom.HierarchyRequestErr
:   Raised when an attempt is made to insert a node where the node type is not
    allowed.

exception xml.dom.IndexSizeErr
:   Raised when an index or size parameter to a method is negative or exceeds the
    allowed values.

exception xml.dom.InuseAttributeErr
:   Raised when an attempt is made to insert an `Attr` node that is already
    present elsewhere in the document.

exception xml.dom.InvalidAccessErr
:   Raised if a parameter or an operation is not supported on the underlying object.

exception xml.dom.InvalidCharacterErr
:   This exception is raised when a string parameter contains a character that is
    not permitted in the context it’s being used in by the XML 1.0 recommendation.
    For example, attempting to create an `Element` node with a space in the
    element type name will cause this error to be raised.

exception xml.dom.InvalidModificationErr
:   Raised when an attempt is made to modify the type of a node.

exception xml.dom.InvalidStateErr
:   Raised when an attempt is made to use an object that is not defined or is no
    longer usable.

exception xml.dom.NamespaceErr
:   If an attempt is made to change any object in a way that is not permitted with
    regard to the Namespaces in XML
    recommendation, this exception is raised.

exception xml.dom.NotFoundErr
:   Exception when a node does not exist in the referenced context. For example,
    `NamedNodeMap.removeNamedItem()` will raise this if the node passed in does
    not exist in the map.

exception xml.dom.NotSupportedErr
:   Raised when the implementation does not support the requested type of object or
    operation.

exception xml.dom.NoDataAllowedErr
:   This is raised if data is specified for a node which does not support data.

exception xml.dom.NoModificationAllowedErr
:   Raised on attempts to modify an object where modifications are not allowed (such
    as for read-only nodes).

exception xml.dom.SyntaxErr
:   Raised when an invalid or illegal string is specified.

exception xml.dom.ValidationErr
:   Raised when an operation would make the document invalid
    with respect to partial validity.
    This is not known to be used in the Python DOM implementations,
    but may be received from DOM implementations not written in Python.

exception xml.dom.WrongDocumentErr
:   Raised when a node is inserted in a different document than it currently belongs
    to, and the implementation does not support migrating the node from one document
    to the other.

The exception codes defined in the DOM recommendation map to the exceptions
described above according to this table:

| Constant | Exception |
| --- | --- |
| xml.dom.DOMSTRING\_SIZE\_ERR | `DomstringSizeErr` |
| xml.dom.HIERARCHY\_REQUEST\_ERR | `HierarchyRequestErr` |
| xml.dom.INDEX\_SIZE\_ERR | `IndexSizeErr` |
| xml.dom.INUSE\_ATTRIBUTE\_ERR | `InuseAttributeErr` |
| xml.dom.INVALID\_ACCESS\_ERR | `InvalidAccessErr` |
| xml.dom.INVALID\_CHARACTER\_ERR | `InvalidCharacterErr` |
| xml.dom.INVALID\_MODIFICATION\_ERR | `InvalidModificationErr` |
| xml.dom.INVALID\_STATE\_ERR | `InvalidStateErr` |
| xml.dom.NAMESPACE\_ERR | `NamespaceErr` |
| xml.dom.NOT\_FOUND\_ERR | `NotFoundErr` |
| xml.dom.NOT\_SUPPORTED\_ERR | `NotSupportedErr` |
| xml.dom.NO\_DATA\_ALLOWED\_ERR | `NoDataAllowedErr` |
| xml.dom.NO\_MODIFICATION\_ALLOWED\_ERR | `NoModificationAllowedErr` |
| xml.dom.SYNTAX\_ERR | `SyntaxErr` |
| xml.dom.VALIDATION\_ERR | `ValidationErr` |
| xml.dom.WRONG\_DOCUMENT\_ERR | `WrongDocumentErr` |

## Conformance

This section describes the conformance requirements and relationships between
the Python DOM API, the W3C DOM recommendations, and the OMG IDL mapping for
Python.

### Type Mapping

The IDL types used in the DOM specification are mapped to Python types
according to the following table.

| IDL Type | Python Type |
| --- | --- |
| `boolean` | `bool` or `int` |
| `int` | `int` |
| `long int` | `int` |
| `unsigned int` | `int` |
| `DOMString` | `str` or `bytes` |
| `null` | `None` |

### Accessor Methods

The mapping from OMG IDL to Python defines accessor functions for IDL
`attribute` declarations in much the way the Java mapping does.
Mapping the IDL declarations

```
readonly attribute string someValue;
         attribute string anotherValue;
```

yields three accessor functions: a “get” method for `someValue`
(`_get_someValue()`), and “get” and “set” methods for `anotherValue`
(`_get_anotherValue()` and `_set_anotherValue()`). The mapping, in
particular, does not require that the IDL attributes are accessible as normal
Python attributes: `object.someValue` is *not* required to work, and may
raise an `AttributeError`.

The Python DOM API, however, *does* require that normal attribute access work.
This means that the typical surrogates generated by Python IDL compilers are not
likely to work, and wrapper objects may be needed on the client if the DOM
objects are accessed via CORBA. While this does require some additional
consideration for CORBA DOM clients, the implementers with experience using DOM
over CORBA from Python do not consider this a problem. Attributes that are
declared `readonly` may not restrict write access in all DOM
implementations.

In the Python DOM API, accessor functions are not required. If provided, they
should take the form defined by the Python IDL mapping, but these methods are
considered unnecessary since the attributes are accessible directly from Python.
“Set” accessors should never be provided for `readonly` attributes.

The IDL definitions do not fully embody the requirements of the W3C DOM API,
such as the notion of certain objects, such as the return value of
`getElementsByTagName()`, being “live”. The Python DOM API does
not require implementations to enforce such requirements.
