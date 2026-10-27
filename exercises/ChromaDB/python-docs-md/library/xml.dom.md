---
page: library/xml.dom.html
title: xml.dom — The Document Object Model API
area: library
kind: guide
module: xml.dom
---

<!-- anchor: module-xml.dom | type: section -->
# `xml.dom` — The Document Object Model API

**Source code:** Lib/xml/dom/__init__.py

The Document Object Model, or “DOM,” is a cross-language API from the World Wide Web Consortium (W3C) for accessing and modifying XML documents. A DOM implementation presents an XML document as a tree structure, or allows client code to build such a structure from scratch. It then gives access to the structure through a set of objects which provided well-known interfaces.

The DOM is extremely useful for random-access applications. SAX only allows you a view of one bit of the document at a time. If you are looking at one SAX element, you have no access to another. If you are looking at a text node, you have no access to a containing element. When you write a SAX application, you need to keep track of your program’s position in the document somewhere in your own code. SAX does not do it for you. Also, if you need to look ahead in the XML document, you are just out of luck.

Some applications are simply impossible in an event driven model with no access to a tree. Of course you could build some sort of tree yourself in SAX events, but the DOM allows you to avoid writing that code. The DOM is a standard tree representation for XML data.

The Document Object Model is being defined by the W3C in stages, or “levels” in their terminology. The Python mapping of the API is substantially based on the DOM Level 2 recommendation.

DOM applications typically start by parsing some XML into a DOM. How this is accomplished is not covered at all by DOM Level 1, and Level 2 provides only limited improvements: There is a `DOMImplementation` object class which provides access to `Document` creation methods, but no way to access an XML reader/parser/Document builder in an implementation-independent way. There is also no well-defined way to access these methods without an existing `Document` object. In Python, each DOM implementation will provide a function `getDOMImplementation()`. DOM Level 3 adds a Load/Store specification, which defines an interface to the reader, but this is not yet available in the Python standard library.

Once you have a DOM document object, you can access the parts of your XML document through its properties and methods. These properties are defined in the DOM specification; this portion of the reference manual describes the interpretation of the specification in Python.

The specification provided by the W3C defines the DOM API for Java, ECMAScript, and OMG IDL. The Python mapping defined here is based in large part on the IDL version of the specification, but strict compliance is not required (though implementations are free to support the strict mapping from IDL). See section Conformance for a detailed discussion of mapping requirements.

**See also:**

**Document Object Model (DOM) Level 2 Specification**

The W3C recommendation upon which the Python DOM API is based.

**Document Object Model (DOM) Level 1 Specification**

The W3C recommendation for the DOM supported by `xml.dom.minidom`.

**Python Language Mapping Specification**

This specifies the mapping from OMG IDL to Python.

<!-- anchor: module-contents | type: section -->
## Module Contents

The `xml.dom` contains the following functions:

<!-- anchor: xml.dom.registerDOMImplementation | type: py function -->
### `xml.dom.registerDOMImplementation(name, factory)`

Register the *factory* function with the name *name*. The factory function should return an object which implements the `DOMImplementation` interface. The factory function can return the same object every time, or a new one for each call, as appropriate for the specific implementation (e.g. if that implementation supports some customization).

<!-- anchor: xml.dom.getDOMImplementation | type: py function -->
### `xml.dom.getDOMImplementation(name=None, features=())`

Return a suitable DOM implementation. The *name* is either well-known, the module name of a DOM implementation, or `None`. If it is not `None`, imports the corresponding module and returns a `DOMImplementation` object if the import succeeds. If no name is given, and if the environment variable `PYTHON_DOM` is set, this variable is used to find the implementation. The only well-known name in the standard library is `'minidom'`, for `xml.dom.minidom`.

If name is not given, this examines the available implementations to find one with the required feature set. If no implementation can be found, raise an `ImportError`. The features list must be a sequence of `(feature, version)` pairs which are passed to the `hasFeature()` method on available `DOMImplementation` objects.

Some convenience constants are also provided:

<!-- anchor: xml.dom.EMPTY_NAMESPACE | type: py data -->
### `xml.dom.EMPTY_NAMESPACE`

The value used to indicate that no namespace is associated with a node in the DOM. This is typically found as the `namespaceURI` of a node, or used as the *namespaceURI* parameter to a namespaces-specific method.

<!-- anchor: xml.dom.XML_NAMESPACE | type: py data -->
### `xml.dom.XML_NAMESPACE`

The namespace URI associated with the reserved prefix `xml`, as defined by Namespaces in XML (section 4).

<!-- anchor: xml.dom.XMLNS_NAMESPACE | type: py data -->
### `xml.dom.XMLNS_NAMESPACE`

The namespace URI for namespace declarations, as defined by Document Object Model (DOM) Level 2 Core Specification (section 1.1.8).

<!-- anchor: xml.dom.XHTML_NAMESPACE | type: py data -->
### `xml.dom.XHTML_NAMESPACE`

The URI of the XHTML namespace as defined by XHTML 1.0: The Extensible HyperText Markup Language (section 3.1.1).

In addition, `xml.dom` contains a base `Node` class and the DOM exception classes. The `Node` class provided by this module does not implement any of the methods or attributes defined by the DOM specification; concrete DOM implementations must provide those. The `Node` class provided as part of this module does provide the constants used for the `nodeType` attribute on concrete `Node` objects; they are located within the class rather than at the module level to conform with the DOM specifications.

<!-- anchor: objects-in-the-dom | type: section -->
## Objects in the DOM

The definitive documentation for the DOM is the DOM specification from the W3C.

The names documented in this section are DOM interfaces. With the exception of `Node` and the exception classes, they are not provided by the `xml.dom` module itself, but by concrete DOM implementations, such as `xml.dom.minidom`.

Note that DOM attributes may also be manipulated as nodes instead of as simple strings. It is fairly rare that you must do this, however, so this usage is not yet documented.

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

An additional section describes the exceptions defined for working with the DOM in Python.

<!-- anchor: domimplementation-objects | type: section -->
### DOMImplementation Objects

The `DOMImplementation` interface provides a way for applications to determine the availability of particular features in the DOM they are using. DOM Level 2 added the ability to create new `Document` and `DocumentType` objects using the `DOMImplementation` as well.

<!-- anchor: xml.dom.DOMImplementation.hasFeature | type: py method -->
#### `DOMImplementation.hasFeature(feature, version)`

Return `True` if the feature identified by the pair of strings *feature* and *version* is implemented.

<!-- anchor: xml.dom.DOMImplementation.createDocument | type: py method -->
#### `DOMImplementation.createDocument(namespaceUri, qualifiedName, doctype)`

Return a new `Document` object (the root of the DOM), with a child `Element` object having the given *namespaceUri* and *qualifiedName*. The *doctype* must be a `DocumentType` object created by `createDocumentType()`, or `None`. In the Python DOM API, the first two arguments can also be `None` in order to indicate that no `Element` child is to be created.

<!-- anchor: xml.dom.DOMImplementation.createDocumentType | type: py method -->
#### `DOMImplementation.createDocumentType(qualifiedName, publicId, systemId)`

Return a new `DocumentType` object that encapsulates the given *qualifiedName*, *publicId*, and *systemId* strings, representing the information contained in an XML document type declaration.

<!-- anchor: node-objects | type: section -->
### Node Objects

All of the components of an XML document are subclasses of `Node`.

Only nodes of the following types can have children, and only children of the listed types:

**`Document`**

at most one `Element`, at most one `DocumentType`, `ProcessingInstruction` and `Comment`

**`DocumentFragment` and `Element`**

`Element`, `Text`, `CDATASection`, `ProcessingInstruction` and `Comment`

**`Attr`**

`Text`

Nodes of other types cannot have children. Inserting a child of a not allowed type raises `HierarchyRequestErr`.

<!-- anchor: xml.dom.Node.nodeType | type: py attribute -->
#### `Node.nodeType`

An integer representing the node type. Symbolic constants for the types are on the `Node` object. This is a read-only attribute.

<!-- anchor: xml.dom.Node.ELEMENT_NODE | type: py data -->
#### `Node.ELEMENT_NODE`

`Node.ATTRIBUTE_NODE`

`Node.TEXT_NODE`

`Node.CDATA_SECTION_NODE`

`Node.ENTITY_REFERENCE_NODE`

`Node.ENTITY_NODE`

`Node.PROCESSING_INSTRUCTION_NODE`

`Node.COMMENT_NODE`

`Node.DOCUMENT_NODE`

`Node.DOCUMENT_TYPE_NODE`

`Node.DOCUMENT_FRAGMENT_NODE`

`Node.NOTATION_NODE`

Integer constants for the possible values of the `nodeType` attribute.

<!-- anchor: xml.dom.Node.parentNode | type: py attribute -->
#### `Node.parentNode`

The parent of the current node, or `None` for the document node. The value is always a `Node` object or `None`. For `Element` nodes, this will be the parent element, except for the root element, in which case it will be the `Document` object. For `Attr` nodes, this is always `None`. This is a read-only attribute.

<!-- anchor: xml.dom.Node.attributes | type: py attribute -->
#### `Node.attributes`

A `NamedNodeMap` of attribute objects. Only elements have actual values for this; others provide `None` for this attribute. This is a read-only attribute.

<!-- anchor: xml.dom.Node.previousSibling | type: py attribute -->
#### `Node.previousSibling`

The node that immediately precedes this one with the same parent. For instance the element with an end-tag that comes just before the *self* element’s start-tag. Of course, XML documents are made up of more than just elements so the previous sibling could be text, a comment, or something else. If this node is the first child of the parent, this attribute will be `None`. This is a read-only attribute.

<!-- anchor: xml.dom.Node.nextSibling | type: py attribute -->
#### `Node.nextSibling`

The node that immediately follows this one with the same parent. See also `previousSibling`. If this is the last child of the parent, this attribute will be `None`. This is a read-only attribute.

<!-- anchor: xml.dom.Node.childNodes | type: py attribute -->
#### `Node.childNodes`

A `NodeList` of the children of this node. If the node has no children, the list is empty. This is a read-only attribute.

<!-- anchor: xml.dom.Node.firstChild | type: py attribute -->
#### `Node.firstChild`

The first child of the node, if there are any, or `None`. This is a read-only attribute.

<!-- anchor: xml.dom.Node.lastChild | type: py attribute -->
#### `Node.lastChild`

The last child of the node, if there are any, or `None`. This is a read-only attribute.

<!-- anchor: xml.dom.Node.localName | type: py attribute -->
#### `Node.localName`

The part of the `tagName` following the colon if there is one, else the entire `tagName`. The value is a string.

<!-- anchor: xml.dom.Node.prefix | type: py attribute -->
#### `Node.prefix`

The part of the `tagName` preceding the colon if there is one, else the empty string. The value is a string, or `None`.

<!-- anchor: xml.dom.Node.namespaceURI | type: py attribute -->
#### `Node.namespaceURI`

The namespace associated with the element name. This will be a string or `None`. This is a read-only attribute.

<!-- anchor: xml.dom.Node.ownerDocument | type: py attribute -->
#### `Node.ownerDocument`

The `Document` object to which this node belongs, or `None` for a document itself. This is a read-only attribute.

<!-- anchor: xml.dom.Node.isSupported | type: py method -->
#### `Node.isSupported(feature, version)`

Return whether the DOM implementation supports a particular *feature*, as `DOMImplementation.hasFeature()` does.

<!-- anchor: xml.dom.Node.setUserData | type: py method -->
#### `Node.setUserData(key, data, handler)`

Associate *data* with *key* on this node and return the data previously associated with *key*, or `None`. If *data* is `None`, the association is removed. *handler* is called when the node is cloned, imported, renamed or deleted; pass `None` if no notification is needed.

<!-- anchor: xml.dom.Node.getUserData | type: py method -->
#### `Node.getUserData(key)`

Return the data associated with *key* on this node by `setUserData()`, or `None`.

<!-- anchor: xml.dom.Node.nodeName | type: py attribute -->
#### `Node.nodeName`

The name of this node, depending on its type; see the table below. You can always get the information you would get here from another property such as the `tagName` property for elements or the `name` property for attributes. This is a read-only attribute.

<!-- anchor: xml.dom.Node.nodeValue | type: py attribute -->
#### `Node.nodeValue`

The value of this node, depending on its type; see the table below. The value is a string or `None`.

The values of `nodeName` and `nodeValue` for each node type are:

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

<!-- anchor: xml.dom.Node.hasAttributes | type: py method -->
#### `Node.hasAttributes()`

Return `True` if the node has any attributes.

<!-- anchor: xml.dom.Node.hasChildNodes | type: py method -->
#### `Node.hasChildNodes()`

Return `True` if the node has any child nodes.

<!-- anchor: xml.dom.Node.isSameNode | type: py method -->
#### `Node.isSameNode(other)`

Return `True` if *other* refers to the same node as this node. This is especially useful for DOM implementations which use any sort of proxy architecture (because more than one object can refer to the same node).

**Note:**

This is based on a proposed DOM Level 3 API which is still in the “working draft” stage, but this particular interface appears uncontroversial. Changes from the W3C will not necessarily affect this method in the Python DOM interface (though any new W3C API for this would also be supported).

<!-- anchor: xml.dom.Node.appendChild | type: py method -->
#### `Node.appendChild(newChild)`

Add a new child node to this node at the end of the list of children, returning *newChild*. If the node was already in the tree, it is removed first.

<!-- anchor: xml.dom.Node.insertBefore | type: py method -->
#### `Node.insertBefore(newChild, refChild)`

Insert a new child node before an existing child. It must be the case that *refChild* is a child of this node; if not, `NotFoundErr` is raised. *newChild* is returned. If *refChild* is `None`, it inserts *newChild* at the end of the children’s list.

<!-- anchor: xml.dom.Node.removeChild | type: py method -->
#### `Node.removeChild(oldChild)`

Remove a child node. *oldChild* must be a child of this node; if not, `NotFoundErr` is raised. *oldChild* is returned on success. If *oldChild* will not be used further, its `unlink()` method should be called.

<!-- anchor: xml.dom.Node.replaceChild | type: py method -->
#### `Node.replaceChild(newChild, oldChild)`

Replace an existing node with a new node. It must be the case that *oldChild* is a child of this node; if not, `NotFoundErr` is raised.

<!-- anchor: xml.dom.Node.normalize | type: py method -->
#### `Node.normalize()`

Join adjacent text nodes so that all stretches of text are stored as single `Text` instances. This simplifies processing text from a DOM tree for many applications.

<!-- anchor: xml.dom.Node.cloneNode | type: py method -->
#### `Node.cloneNode(deep)`

Clone this node. Setting *deep* means to clone all child nodes as well. This returns the clone.

<!-- anchor: nodelist-objects | type: section -->
### NodeList Objects

A `NodeList` represents a sequence of nodes. These objects are used in two ways in the DOM Core recommendation: an `Element` object provides one as its list of child nodes, and the `getElementsByTagName()` and `getElementsByTagNameNS()` methods of `Node` return objects with this interface to represent query results.

`NodeList` does *not* inherit from `Node`.

The DOM Level 2 recommendation defines one method and one attribute for these objects:

<!-- anchor: xml.dom.NodeList.item | type: py method -->
#### `NodeList.item(i)`

Return the *i*’th item from the sequence, or `None` if *i* is out of range. Negative indices are not supported.

<!-- anchor: xml.dom.NodeList.length | type: py attribute -->
#### `NodeList.length`

The number of nodes in the sequence.

In addition, the Python DOM interface requires that some additional support is provided to allow `NodeList` objects to be used as Python sequences. All `NodeList` implementations must include support for `__len__()` and `__getitem__()`; this allows iteration over the `NodeList` in `for` statements and proper support for the `len()` built-in function.

If a DOM implementation supports modification of the document, the `NodeList` implementation must also support the `__setitem__()` and `__delitem__()` methods.

<!-- anchor: documenttype-objects | type: section -->
### DocumentType Objects

Information about the notations and entities declared by a document (including the external subset if the parser uses it and can provide the information) is available from a `DocumentType` object. The `DocumentType` for a document is available from the `Document` object’s `doctype` attribute; if there is no `DOCTYPE` declaration for the document, the document’s `doctype` attribute will be set to `None` instead of an instance of this interface.

`DocumentType` is a specialization of `Node`, and adds the following attributes:

<!-- anchor: xml.dom.DocumentType.publicId | type: py attribute -->
#### `DocumentType.publicId`

The public identifier for the external subset of the document type definition, or `None` if the `DOCTYPE` declaration does not specify it.

<!-- anchor: xml.dom.DocumentType.systemId | type: py attribute -->
#### `DocumentType.systemId`

The system identifier, a URI, for the external subset of the document type definition, or `None` if the `DOCTYPE` declaration does not specify it.

<!-- anchor: xml.dom.DocumentType.internalSubset | type: py attribute -->
#### `DocumentType.internalSubset`

A string giving the complete internal subset from the document. This does not include the brackets which enclose the subset. If the document has no internal subset, this should be `None`.

<!-- anchor: xml.dom.DocumentType.name | type: py attribute -->
#### `DocumentType.name`

The name of the root element as given in the `DOCTYPE` declaration, if present.

<!-- anchor: xml.dom.DocumentType.entities | type: py attribute -->
#### `DocumentType.entities`

This is a `NamedNodeMap` of `Entity` nodes giving the definitions of external entities. For entity names defined more than once, only the first definition is provided (others are ignored as required by the XML recommendation). This may be `None` if the information is not provided by the parser, or if no entities are defined.

<!-- anchor: xml.dom.DocumentType.notations | type: py attribute -->
#### `DocumentType.notations`

This is a `NamedNodeMap` of `Notation` nodes giving the definitions of notations. For notation names defined more than once, only the first definition is provided (others are ignored as required by the XML recommendation). This may be `None` if the information is not provided by the parser, or if no notations are defined.

<!-- anchor: document-objects | type: section -->
### Document Objects

A `Document` represents an entire XML document, including its constituent elements, attributes, processing instructions, comments etc. Remember that it inherits properties from `Node`.

<!-- anchor: xml.dom.Document.documentElement | type: py attribute -->
#### `Document.documentElement`

The one and only root element of the document.

<!-- anchor: xml.dom.Document.doctype | type: py attribute -->
#### `Document.doctype`

The `DocumentType` node of the document, or `None`. This is a read-only attribute.

<!-- anchor: xml.dom.Document.implementation | type: py attribute -->
#### `Document.implementation`

The `DOMImplementation` object which created this document. This is a read-only attribute.

<!-- anchor: xml.dom.Document.strictErrorChecking | type: py attribute -->
#### `Document.strictErrorChecking`

Whether error checking is enforced.

<!-- anchor: xml.dom.Document.documentURI | type: py attribute -->
#### `Document.documentURI`

The location of the document, or `None` if it is unknown.

<!-- anchor: xml.dom.Document.createDocumentFragment | type: py method -->
#### `Document.createDocumentFragment()`

Create and return an empty `DocumentFragment` node.

<!-- anchor: xml.dom.Document.createCDATASection | type: py method -->
#### `Document.createCDATASection(data)`

Create and return a `CDATASection` node containing *data*.

<!-- anchor: xml.dom.Document.importNode | type: py method -->
#### `Document.importNode(importedNode, deep)`

Return a copy of *importedNode* which belongs to this document. The original node is not removed from its document. If *deep* is true, the descendants of the node are copied too.

<!-- anchor: xml.dom.Document.createElement | type: py method -->
#### `Document.createElement(tagName)`

Create and return a new element node. The element is not inserted into the document when it is created. You need to explicitly insert it with one of the other methods such as `insertBefore()` or `appendChild()`.

<!-- anchor: xml.dom.Document.createElementNS | type: py method -->
#### `Document.createElementNS(namespaceURI, tagName)`

Create and return a new element with a namespace. The *tagName* may have a prefix. The element is not inserted into the document when it is created. You need to explicitly insert it with one of the other methods such as `insertBefore()` or `appendChild()`.

<!-- anchor: xml.dom.Document.createTextNode | type: py method -->
#### `Document.createTextNode(data)`

Create and return a text node containing the data passed as a parameter. As with the other creation methods, this one does not insert the node into the tree.

<!-- anchor: xml.dom.Document.createComment | type: py method -->
#### `Document.createComment(data)`

Create and return a comment node containing the data passed as a parameter. As with the other creation methods, this one does not insert the node into the tree.

<!-- anchor: xml.dom.Document.createProcessingInstruction | type: py method -->
#### `Document.createProcessingInstruction(target, data)`

Create and return a processing instruction node containing the *target* and *data* passed as parameters. As with the other creation methods, this one does not insert the node into the tree.

<!-- anchor: xml.dom.Document.createAttribute | type: py method -->
#### `Document.createAttribute(name)`

Create and return an attribute node. This method does not associate the attribute node with any particular element. You must use `setAttributeNode()` on the appropriate `Element` object to use the newly created attribute instance.

<!-- anchor: xml.dom.Document.createAttributeNS | type: py method -->
#### `Document.createAttributeNS(namespaceURI, qualifiedName)`

Create and return an attribute node with a namespace. The *tagName* may have a prefix. This method does not associate the attribute node with any particular element. You must use `setAttributeNode()` on the appropriate `Element` object to use the newly created attribute instance.

<!-- anchor: xml.dom.Document.getElementById | type: py method -->
#### `Document.getElementById(id)`

Return the element with the given ID, or `None`. Only attributes declared as being of type ID in the DTD or by `Element.setIdAttribute()` are searched.

<!-- anchor: xml.dom.Document.getElementsByTagName | type: py method -->
#### `Document.getElementsByTagName(tagName)`

Search for all descendants (direct children, children’s children, etc.) with a particular element type name.

<!-- anchor: xml.dom.Document.getElementsByTagNameNS | type: py method -->
#### `Document.getElementsByTagNameNS(namespaceURI, localName)`

Search for all descendants (direct children, children’s children, etc.) with a particular namespace URI and localname. The localname is the part of the namespace after the prefix.

<!-- anchor: xml.dom.Document.renameNode | type: py method -->
#### `Document.renameNode(n, namespaceURI, name)`

Rename the element or attribute node *n* and return it. *namespaceURI* is the new namespace URI, or `EMPTY_NAMESPACE` if the node does not belong to a namespace. *name* is the new qualified name.

Raise `WrongDocumentErr` if *n* was created by another document, and `NotSupportedErr` if it is neither an element nor an attribute.

<!-- anchor: element-objects | type: section -->
### Element Objects

`Element` is a subclass of `Node`, so inherits all the attributes of that class.

<!-- anchor: xml.dom.Element.tagName | type: py attribute -->
#### `Element.tagName`

The element type name. In a namespace-using document it may have colons in it. The value is a string.

<!-- anchor: xml.dom.Element.setIdAttribute | type: py method -->
#### `Element.setIdAttribute(name)`

Declare that the attribute *name* is of type ID, so that the element is found by `Document.getElementById()`. Raise `NotFoundErr` if the element has no such attribute.

<!-- anchor: xml.dom.Element.setIdAttributeNS | type: py method -->
#### `Element.setIdAttributeNS(namespaceURI, localName)`

The same as `setIdAttribute()`, but for an attribute specified by its namespace URI and local name.

<!-- anchor: xml.dom.Element.setIdAttributeNode | type: py method -->
#### `Element.setIdAttributeNode(idAttr)`

The same as `setIdAttribute()`, but for an already retrieved attribute node.

<!-- anchor: xml.dom.Element.getElementsByTagName | type: py method -->
#### `Element.getElementsByTagName(tagName)`

Same as equivalent method in the `Document` class.

<!-- anchor: xml.dom.Element.getElementsByTagNameNS | type: py method -->
#### `Element.getElementsByTagNameNS(namespaceURI, localName)`

Same as equivalent method in the `Document` class.

<!-- anchor: xml.dom.Element.hasAttribute | type: py method -->
#### `Element.hasAttribute(name)`

Return `True` if the element has an attribute named by *name*.

<!-- anchor: xml.dom.Element.hasAttributeNS | type: py method -->
#### `Element.hasAttributeNS(namespaceURI, localName)`

Return `True` if the element has an attribute named by *namespaceURI* and *localName*.

<!-- anchor: xml.dom.Element.getAttribute | type: py method -->
#### `Element.getAttribute(name)`

Return the value of the attribute named by *name* as a string. If no such attribute exists, an empty string is returned, as if the attribute had no value.

<!-- anchor: xml.dom.Element.getAttributeNode | type: py method -->
#### `Element.getAttributeNode(attrname)`

Return the `Attr` node for the attribute named by *attrname*.

<!-- anchor: xml.dom.Element.getAttributeNS | type: py method -->
#### `Element.getAttributeNS(namespaceURI, localName)`

Return the value of the attribute named by *namespaceURI* and *localName* as a string. If no such attribute exists, an empty string is returned, as if the attribute had no value.

<!-- anchor: xml.dom.Element.getAttributeNodeNS | type: py method -->
#### `Element.getAttributeNodeNS(namespaceURI, localName)`

Return an attribute value as a node, given a *namespaceURI* and *localName*.

<!-- anchor: xml.dom.Element.removeAttribute | type: py method -->
#### `Element.removeAttribute(name)`

Remove an attribute by name.

<!-- anchor: xml.dom.Element.removeAttributeNode | type: py method -->
#### `Element.removeAttributeNode(oldAttr)`

Remove and return *oldAttr* from the attribute list, if present. If *oldAttr* is not present, `NotFoundErr` is raised.

<!-- anchor: xml.dom.Element.removeAttributeNS | type: py method -->
#### `Element.removeAttributeNS(namespaceURI, localName)`

Remove an attribute by name. Note that it uses a localName, not a qname.

<!-- anchor: xml.dom.Element.setAttribute | type: py method -->
#### `Element.setAttribute(name, value)`

Set an attribute value from a string.

<!-- anchor: xml.dom.Element.setAttributeNode | type: py method -->
#### `Element.setAttributeNode(newAttr)`

Add a new attribute node to the element, replacing an existing attribute if necessary if the `name` attribute matches. If a replacement occurs, the old attribute node will be returned. If *newAttr* is already in use, `InuseAttributeErr` will be raised.

<!-- anchor: xml.dom.Element.setAttributeNodeNS | type: py method -->
#### `Element.setAttributeNodeNS(newAttr)`

Add a new attribute node to the element, replacing an existing attribute if necessary if the `namespaceURI` and `localName` attributes match. If a replacement occurs, the old attribute node will be returned. If *newAttr* is already in use, `InuseAttributeErr` will be raised.

<!-- anchor: xml.dom.Element.setAttributeNS | type: py method -->
#### `Element.setAttributeNS(namespaceURI, qname, value)`

Set an attribute value from a string, given a *namespaceURI* and a *qname*. Note that a qname is the whole attribute name. This is different than above.

<!-- anchor: attr-objects | type: section -->
### Attr Objects

`Attr` inherits from `Node`, so inherits all its attributes.

Attribute nodes are not part of the document tree. They are contained in the `attributes` map of an element, not in its children, and their `parentNode`, `previousSibling` and `nextSibling` are always `None`.

<!-- anchor: xml.dom.Attr.name | type: py attribute -->
#### `Attr.name`

The attribute name. In a namespace-using document it may include a colon.

<!-- anchor: xml.dom.Attr.localName | type: py attribute -->
#### `Attr.localName`

The part of the name following the colon if there is one, else the entire name. This is a read-only attribute.

<!-- anchor: xml.dom.Attr.prefix | type: py attribute -->
#### `Attr.prefix`

The part of the name preceding the colon if there is one, else the empty string.

<!-- anchor: xml.dom.Attr.isId | type: py attribute -->
#### `Attr.isId`

Whether this attribute is of type ID, either because it is declared as such in the DTD or because `Element.setIdAttribute()` was used. This is a read-only attribute.

<!-- anchor: xml.dom.Attr.ownerElement | type: py attribute -->
#### `Attr.ownerElement`

The `Element` node to which this attribute belongs, or `None` if it is not used. This is a read-only attribute.

<!-- anchor: xml.dom.Attr.specified | type: py attribute -->
#### `Attr.specified`

Whether the value of the attribute was explicitly set in the document, as opposed to being defaulted from the DTD. This is a read-only attribute.

<!-- anchor: xml.dom.Attr.value | type: py attribute -->
#### `Attr.value`

The text value of the attribute. This is a synonym for the `nodeValue` attribute.

<!-- anchor: namednodemap-objects | type: section -->
### NamedNodeMap Objects

`NamedNodeMap` does *not* inherit from `Node`.

<!-- anchor: xml.dom.NamedNodeMap.length | type: py attribute -->
#### `NamedNodeMap.length`

The length of the attribute list.

<!-- anchor: xml.dom.NamedNodeMap.item | type: py method -->
#### `NamedNodeMap.item(index)`

Return an attribute with a particular index. The order you get the attributes in is arbitrary but will be consistent for the life of a DOM. Each item is an attribute node. Get its value with the `value` attribute.

<!-- anchor: xml.dom.NamedNodeMap.getNamedItem | type: py method -->
#### `NamedNodeMap.getNamedItem(name)`

Return the node with the given `name`, or `None` if there is no such node.

<!-- anchor: xml.dom.NamedNodeMap.getNamedItemNS | type: py method -->
#### `NamedNodeMap.getNamedItemNS(namespaceURI, localName)`

Return the node with the given namespace URI and local name, or `None` if there is no such node.

<!-- anchor: xml.dom.NamedNodeMap.setNamedItem | type: py method -->
#### `NamedNodeMap.setNamedItem(node)`

Add *node* to the map, using its `name` as the key. Return the node which it replaces, or `None` if it replaces no node.

<!-- anchor: xml.dom.NamedNodeMap.setNamedItemNS | type: py method -->
#### `NamedNodeMap.setNamedItemNS(node)`

Add *node* to the map, using its namespace URI and local name as the key. Return the node which it replaces, or `None` if it replaces no node.

<!-- anchor: xml.dom.NamedNodeMap.removeNamedItem | type: py method -->
#### `NamedNodeMap.removeNamedItem(name)`

Remove and return the node with the given `name`. Raise `NotFoundErr` if there is no such node.

<!-- anchor: xml.dom.NamedNodeMap.removeNamedItemNS | type: py method -->
#### `NamedNodeMap.removeNamedItemNS(namespaceURI, localName)`

Remove and return the node with the given namespace URI and local name. Raise `NotFoundErr` if there is no such node.

You can also use the standardized `getAttribute*()` family of methods on the `Element` objects.

<!-- anchor: documentfragment-objects | type: section -->
### DocumentFragment Objects

`DocumentFragment` is a lightweight container of nodes. It is a subclass of `Node`. When it is inserted into the document tree, its children are inserted instead of it, and it becomes empty.

<!-- anchor: characterdata-objects | type: section -->
### CharacterData Objects

`CharacterData` represents text-like data in the XML document. It is a subclass of `Node`, and the base class of `Text`, `CDATASection` and `Comment`. Such nodes cannot have child nodes.

<!-- anchor: xml.dom.CharacterData.data | type: py attribute -->
#### `CharacterData.data`

The content of the node as a string.

<!-- anchor: xml.dom.CharacterData.length | type: py attribute -->
#### `CharacterData.length`

The number of characters in `data`. This is a read-only attribute.

<!-- anchor: xml.dom.CharacterData.substringData | type: py method -->
#### `CharacterData.substringData(offset, count)`

Return the substring of `data` of *count* characters starting at *offset*.

<!-- anchor: xml.dom.CharacterData.appendData | type: py method -->
#### `CharacterData.appendData(arg)`

Append the string *arg* to `data`.

<!-- anchor: xml.dom.CharacterData.insertData | type: py method -->
#### `CharacterData.insertData(offset, arg)`

Insert the string *arg* into `data` at *offset*.

<!-- anchor: xml.dom.CharacterData.deleteData | type: py method -->
#### `CharacterData.deleteData(offset, count)`

Remove *count* characters from `data` starting at *offset*.

<!-- anchor: xml.dom.CharacterData.replaceData | type: py method -->
#### `CharacterData.replaceData(offset, count, arg)`

Replace *count* characters of `data` starting at *offset* with the string *arg*.

<!-- anchor: comment-objects | type: section -->
### Comment Objects

`Comment` represents a comment in the XML document. It is a subclass of `CharacterData`.

<!-- anchor: xml.dom.Comment.data | type: py attribute -->
#### `Comment.data`

The content of the comment as a string. The attribute contains all characters between the leading `<!-``-` and trailing `-``->`, but does not include them.

<!-- anchor: text-and-cdatasection-objects | type: section -->
### Text and CDATASection Objects

The `Text` interface represents text in the XML document. If the parser and DOM implementation support the DOM’s XML extension, portions of the text enclosed in CDATA marked sections are stored in `CDATASection` objects. These two interfaces are identical, but provide different values for the `nodeType` attribute.

`Text` extends the `CharacterData` interface, and `CDATASection` extends `Text`.

<!-- anchor: xml.dom.Text.data | type: py attribute -->
#### `Text.data`

The content of the text node as a string.

<!-- anchor: xml.dom.Text.wholeText | type: py attribute -->
#### `Text.wholeText`

The text of all `Text` nodes logically adjacent to this node, concatenated in document order. This is a read-only attribute.

<!-- anchor: xml.dom.Text.replaceWholeText | type: py method -->
#### `Text.replaceWholeText(content)`

Replace the text of all `Text` nodes logically adjacent to this node with *content*, removing the other nodes. Return this node, or `None` if *content* is empty.

<!-- anchor: xml.dom.Text.splitText | type: py method -->
#### `Text.splitText(offset)`

Split this node into two nodes at *offset*, keeping the first part in this node and returning a new sibling node with the rest.

**Note:**

The use of a `CDATASection` node does not indicate that the node represents a complete CDATA marked section, only that the content of the node was part of a CDATA section. A single CDATA section may be represented by more than one node in the document tree. There is no way to determine whether two adjacent `CDATASection` nodes represent different CDATA marked sections.

<!-- anchor: processinginstruction-objects | type: section -->
### ProcessingInstruction Objects

Represents a processing instruction in the XML document; this inherits from the `Node` interface and cannot have child nodes.

<!-- anchor: xml.dom.ProcessingInstruction.target | type: py attribute -->
#### `ProcessingInstruction.target`

The content of the processing instruction up to the first whitespace character. This is a read-only attribute.

<!-- anchor: xml.dom.ProcessingInstruction.data | type: py attribute -->
#### `ProcessingInstruction.data`

The content of the processing instruction following the first whitespace character.

<!-- anchor: entity-objects | type: section -->
### Entity Objects

`Entity` represents a parsed or unparsed entity declared in the DTD. It is a subclass of `Node`. Entity nodes are contained in `DocumentType.entities` and cannot be inserted into the document tree. The name of the entity is its `nodeName`.

<!-- anchor: xml.dom.Entity.publicId | type: py attribute -->
#### `Entity.publicId`

The public identifier of the entity, or `None` if it is not specified. This is a read-only attribute.

<!-- anchor: xml.dom.Entity.systemId | type: py attribute -->
#### `Entity.systemId`

The system identifier of the entity, or `None` if it is not specified. This is a read-only attribute.

<!-- anchor: xml.dom.Entity.notationName | type: py attribute -->
#### `Entity.notationName`

The name of the notation for an unparsed entity, or `None` for a parsed entity. This is a read-only attribute.

<!-- anchor: notation-objects | type: section -->
### Notation Objects

`Notation` represents a notation declared in the DTD. It is a subclass of `Node` and cannot have child nodes. Notation nodes are contained in `DocumentType.notations` and cannot be inserted into the document tree. The name of the notation is its `nodeName`.

<!-- anchor: xml.dom.Notation.publicId | type: py attribute -->
#### `Notation.publicId`

The public identifier of the notation, or `None` if it is not specified. This is a read-only attribute.

<!-- anchor: xml.dom.Notation.systemId | type: py attribute -->
#### `Notation.systemId`

The system identifier of the notation, or `None` if it is not specified. This is a read-only attribute.

<!-- anchor: exceptions | type: section -->
### Exceptions

The DOM Level 2 recommendation defines a single exception, `DOMException`, and a number of constants that allow applications to determine what sort of error occurred. `DOMException` instances carry a `code` attribute that provides the appropriate value for the specific exception.

The Python DOM interface provides the constants, but also expands the set of exceptions so that a specific exception exists for each of the exception codes defined by the DOM. The implementations must raise the appropriate specific exception, each of which carries the appropriate value for the `code` attribute.

<!-- anchor: xml.dom.DOMException | type: py exception -->
#### `exception xml.dom.DOMException`

Base exception class used for all specific DOM exceptions. This exception class cannot be directly instantiated.

<!-- anchor: xml.dom.DomstringSizeErr | type: py exception -->
#### `exception xml.dom.DomstringSizeErr`

Raised when a specified range of text does not fit into a string. This is not known to be used in the Python DOM implementations, but may be received from DOM implementations not written in Python.

<!-- anchor: xml.dom.HierarchyRequestErr | type: py exception -->
#### `exception xml.dom.HierarchyRequestErr`

Raised when an attempt is made to insert a node where the node type is not allowed.

<!-- anchor: xml.dom.IndexSizeErr | type: py exception -->
#### `exception xml.dom.IndexSizeErr`

Raised when an index or size parameter to a method is negative or exceeds the allowed values.

<!-- anchor: xml.dom.InuseAttributeErr | type: py exception -->
#### `exception xml.dom.InuseAttributeErr`

Raised when an attempt is made to insert an `Attr` node that is already present elsewhere in the document.

<!-- anchor: xml.dom.InvalidAccessErr | type: py exception -->
#### `exception xml.dom.InvalidAccessErr`

Raised if a parameter or an operation is not supported on the underlying object.

<!-- anchor: xml.dom.InvalidCharacterErr | type: py exception -->
#### `exception xml.dom.InvalidCharacterErr`

This exception is raised when a string parameter contains a character that is not permitted in the context it’s being used in by the XML 1.0 recommendation. For example, attempting to create an `Element` node with a space in the element type name will cause this error to be raised.

<!-- anchor: xml.dom.InvalidModificationErr | type: py exception -->
#### `exception xml.dom.InvalidModificationErr`

Raised when an attempt is made to modify the type of a node.

<!-- anchor: xml.dom.InvalidStateErr | type: py exception -->
#### `exception xml.dom.InvalidStateErr`

Raised when an attempt is made to use an object that is not defined or is no longer usable.

<!-- anchor: xml.dom.NamespaceErr | type: py exception -->
#### `exception xml.dom.NamespaceErr`

If an attempt is made to change any object in a way that is not permitted with regard to the Namespaces in XML recommendation, this exception is raised.

<!-- anchor: xml.dom.NotFoundErr | type: py exception -->
#### `exception xml.dom.NotFoundErr`

Exception when a node does not exist in the referenced context. For example, `NamedNodeMap.removeNamedItem()` will raise this if the node passed in does not exist in the map.

<!-- anchor: xml.dom.NotSupportedErr | type: py exception -->
#### `exception xml.dom.NotSupportedErr`

Raised when the implementation does not support the requested type of object or operation.

<!-- anchor: xml.dom.NoDataAllowedErr | type: py exception -->
#### `exception xml.dom.NoDataAllowedErr`

This is raised if data is specified for a node which does not support data.

<!-- anchor: xml.dom.NoModificationAllowedErr | type: py exception -->
#### `exception xml.dom.NoModificationAllowedErr`

Raised on attempts to modify an object where modifications are not allowed (such as for read-only nodes).

<!-- anchor: xml.dom.SyntaxErr | type: py exception -->
#### `exception xml.dom.SyntaxErr`

Raised when an invalid or illegal string is specified.

<!-- anchor: xml.dom.ValidationErr | type: py exception -->
#### `exception xml.dom.ValidationErr`

Raised when an operation would make the document invalid with respect to partial validity. This is not known to be used in the Python DOM implementations, but may be received from DOM implementations not written in Python.

<!-- anchor: xml.dom.WrongDocumentErr | type: py exception -->
#### `exception xml.dom.WrongDocumentErr`

Raised when a node is inserted in a different document than it currently belongs to, and the implementation does not support migrating the node from one document to the other.

The exception codes defined in the DOM recommendation map to the exceptions described above according to this table:

| Constant | Exception |
| --- | --- |
| `xml.dom.DOMSTRING_SIZE_ERR` | `DomstringSizeErr` |
| `xml.dom.HIERARCHY_REQUEST_ERR` | `HierarchyRequestErr` |
| `xml.dom.INDEX_SIZE_ERR` | `IndexSizeErr` |
| `xml.dom.INUSE_ATTRIBUTE_ERR` | `InuseAttributeErr` |
| `xml.dom.INVALID_ACCESS_ERR` | `InvalidAccessErr` |
| `xml.dom.INVALID_CHARACTER_ERR` | `InvalidCharacterErr` |
| `xml.dom.INVALID_MODIFICATION_ERR` | `InvalidModificationErr` |
| `xml.dom.INVALID_STATE_ERR` | `InvalidStateErr` |
| `xml.dom.NAMESPACE_ERR` | `NamespaceErr` |
| `xml.dom.NOT_FOUND_ERR` | `NotFoundErr` |
| `xml.dom.NOT_SUPPORTED_ERR` | `NotSupportedErr` |
| `xml.dom.NO_DATA_ALLOWED_ERR` | `NoDataAllowedErr` |
| `xml.dom.NO_MODIFICATION_ALLOWED_ERR` | `NoModificationAllowedErr` |
| `xml.dom.SYNTAX_ERR` | `SyntaxErr` |
| `xml.dom.VALIDATION_ERR` | `ValidationErr` |
| `xml.dom.WRONG_DOCUMENT_ERR` | `WrongDocumentErr` |

<!-- anchor: conformance | type: section -->
## Conformance

This section describes the conformance requirements and relationships between the Python DOM API, the W3C DOM recommendations, and the OMG IDL mapping for Python.

<!-- anchor: type-mapping | type: section -->
### Type Mapping

The IDL types used in the DOM specification are mapped to Python types according to the following table.

| IDL Type | Python Type |
| --- | --- |
| `boolean` | `bool` or `int` |
| `int` | `int` |
| `long int` | `int` |
| `unsigned int` | `int` |
| `DOMString` | `str` or `bytes` |
| `null` | `None` |

<!-- anchor: accessor-methods | type: section -->
### Accessor Methods

The mapping from OMG IDL to Python defines accessor functions for IDL `attribute` declarations in much the way the Java mapping does. Mapping the IDL declarations

```python
readonly attribute string someValue;
         attribute string anotherValue;
```

yields three accessor functions: a “get” method for `someValue` (`_get_someValue()`), and “get” and “set” methods for `anotherValue` (`_get_anotherValue()` and `_set_anotherValue()`). The mapping, in particular, does not require that the IDL attributes are accessible as normal Python attributes: `object.someValue` is *not* required to work, and may raise an `AttributeError`.

The Python DOM API, however, *does* require that normal attribute access work. This means that the typical surrogates generated by Python IDL compilers are not likely to work, and wrapper objects may be needed on the client if the DOM objects are accessed via CORBA. While this does require some additional consideration for CORBA DOM clients, the implementers with experience using DOM over CORBA from Python do not consider this a problem. Attributes that are declared `readonly` may not restrict write access in all DOM implementations.

In the Python DOM API, accessor functions are not required. If provided, they should take the form defined by the Python IDL mapping, but these methods are considered unnecessary since the attributes are accessible directly from Python. “Set” accessors should never be provided for `readonly` attributes.

The IDL definitions do not fully embody the requirements of the W3C DOM API, such as the notion of certain objects, such as the return value of `getElementsByTagName()`, being “live”. The Python DOM API does not require implementations to enforce such requirements.
