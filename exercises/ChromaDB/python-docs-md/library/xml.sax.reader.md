---
page: library/xml.sax.reader.html
title: xml.sax.xmlreader — Interface for XML parsers
area: library
kind: guide
module: xml.sax.xmlreader
---

<!-- anchor: module-xml.sax.xmlreader | type: section -->
# `xml.sax.xmlreader` — Interface for XML parsers

**Source code:** Lib/xml/sax/xmlreader.py

SAX parsers implement the `XMLReader` interface. They are implemented in a Python module, which must provide a function `create_parser()`. This function is invoked by `xml.sax.make_parser()` with no arguments to create a new parser object.

<!-- anchor: xml.sax.xmlreader.XMLReader | type: py class -->
## `class xml.sax.xmlreader.XMLReader`

Base class which can be inherited by SAX parsers.

<!-- anchor: xml.sax.xmlreader.IncrementalParser | type: py class -->
## `class xml.sax.xmlreader.IncrementalParser`

In some cases, it is desirable not to parse an input source at once, but to feed chunks of the document as they get available. Note that the reader will normally not read the entire file, but read it in chunks as well; still `parse()` won’t return until the entire document is processed. So these interfaces should be used if the blocking behaviour of `parse()` is not desirable.

When the parser is instantiated it is ready to begin accepting data from the feed method immediately. After parsing has been finished with a call to close the reset method must be called to make the parser ready to accept new data, either from feed or using the parse method.

Note that these methods must *not* be called during parsing, that is, after parse has been called and before it returns.

By default, the class also implements the parse method of the XMLReader interface using the feed, close and reset methods of the IncrementalParser interface as a convenience to SAX 2.0 driver writers.

<!-- anchor: xml.sax.xmlreader.Locator | type: py class -->
## `class xml.sax.xmlreader.Locator`

Interface for associating a SAX event with a document location. A locator object will return valid results only during calls to DocumentHandler methods; at any other time, the results are unpredictable. If information is not available, methods may return `None`.

<!-- anchor: xml.sax.xmlreader.InputSource | type: py class -->
## `class xml.sax.xmlreader.InputSource(system_id=None)`

Encapsulation of the information needed by the `XMLReader` to read entities.

This class may include information about the public identifier, system identifier, byte stream (possibly with character encoding information) and/or the character stream of an entity.

Applications will create objects of this class for use in the `XMLReader.parse()` method and for returning from EntityResolver.resolveEntity.

An `InputSource` belongs to the application, the `XMLReader` is not allowed to modify `InputSource` objects passed to it from the application, although it may make copies and modify those.

<!-- anchor: xml.sax.xmlreader.AttributesImpl | type: py class -->
## `class xml.sax.xmlreader.AttributesImpl(attrs)`

This is an implementation of the `Attributes` interface (see section The Attributes Interface). This is a dictionary-like object which represents the element attributes in a `startElement()` call. In addition to the most useful dictionary operations, it supports a number of other methods as described by the interface. Objects of this class should be instantiated by readers; *attrs* must be a dictionary-like object containing a mapping from attribute names to attribute values.

<!-- anchor: xml.sax.xmlreader.AttributesNSImpl | type: py class -->
## `class xml.sax.xmlreader.AttributesNSImpl(attrs, qnames)`

Namespace-aware variant of `AttributesImpl`, which will be passed to `startElementNS()`. It is derived from `AttributesImpl`, but understands attribute names as two-tuples of *namespaceURI* and *localname*. In addition, it provides a number of methods expecting qualified names as they appear in the original document. This class implements the `AttributesNS` interface (see section The AttributesNS Interface).

<!-- anchor: xmlreader-objects | type: section -->
## XMLReader Objects

The `XMLReader` interface supports the following methods:

<!-- anchor: xml.sax.xmlreader.XMLReader.parse | type: py method -->
### `XMLReader.parse(source)`

Process an input source, producing SAX events. The *source* object can be a system identifier (a string identifying the input source – typically a file name or a URL), a `pathlib.Path` or path-like object, or an `InputSource` object. When `parse()` returns, the input is completely processed, and the parser object can be discarded or reset.

Changed in version 3.5: Added support of character streams.

Changed in version 3.8: Added support of path-like objects.

<!-- anchor: xml.sax.xmlreader.XMLReader.getContentHandler | type: py method -->
### `XMLReader.getContentHandler()`

Return the current `ContentHandler`.

<!-- anchor: xml.sax.xmlreader.XMLReader.setContentHandler | type: py method -->
### `XMLReader.setContentHandler(handler)`

Set the current `ContentHandler`. If no `ContentHandler` is set, content events will be discarded.

<!-- anchor: xml.sax.xmlreader.XMLReader.getDTDHandler | type: py method -->
### `XMLReader.getDTDHandler()`

Return the current `DTDHandler`.

<!-- anchor: xml.sax.xmlreader.XMLReader.setDTDHandler | type: py method -->
### `XMLReader.setDTDHandler(handler)`

Set the current `DTDHandler`. If no `DTDHandler` is set, DTD events will be discarded.

<!-- anchor: xml.sax.xmlreader.XMLReader.getEntityResolver | type: py method -->
### `XMLReader.getEntityResolver()`

Return the current `EntityResolver`.

<!-- anchor: xml.sax.xmlreader.XMLReader.setEntityResolver | type: py method -->
### `XMLReader.setEntityResolver(handler)`

Set the current `EntityResolver`. If no `EntityResolver` is set, attempts to resolve an external entity will result in opening the system identifier for the entity, and fail if it is not available.

<!-- anchor: xml.sax.xmlreader.XMLReader.getErrorHandler | type: py method -->
### `XMLReader.getErrorHandler()`

Return the current `ErrorHandler`.

<!-- anchor: xml.sax.xmlreader.XMLReader.setErrorHandler | type: py method -->
### `XMLReader.setErrorHandler(handler)`

Set the current error handler. If no `ErrorHandler` is set, errors will be raised as exceptions, and warnings will be printed.

<!-- anchor: xml.sax.xmlreader.XMLReader.setLocale | type: py method -->
### `XMLReader.setLocale(locale)`

Allow an application to set the locale for errors and warnings.

SAX parsers are not required to provide localization for errors and warnings; if they cannot support the requested locale, however, they must raise a SAX exception. Applications may request a locale change in the middle of a parse.

<!-- anchor: xml.sax.xmlreader.XMLReader.getFeature | type: py method -->
### `XMLReader.getFeature(featurename)`

Return the current setting for feature *featurename*. If the feature is not recognized, `SAXNotRecognizedException` is raised. The well-known featurenames are listed in the module `xml.sax.handler`.

<!-- anchor: xml.sax.xmlreader.XMLReader.setFeature | type: py method -->
### `XMLReader.setFeature(featurename, value)`

Set the *featurename* to *value*. If the feature is not recognized, `SAXNotRecognizedException` is raised. If the feature or its setting is not supported by the parser, *SAXNotSupportedException* is raised.

<!-- anchor: xml.sax.xmlreader.XMLReader.getProperty | type: py method -->
### `XMLReader.getProperty(propertyname)`

Return the current setting for property *propertyname*. If the property is not recognized, a `SAXNotRecognizedException` is raised. The well-known propertynames are listed in the module `xml.sax.handler`.

<!-- anchor: xml.sax.xmlreader.XMLReader.setProperty | type: py method -->
### `XMLReader.setProperty(propertyname, value)`

Set the *propertyname* to *value*. If the property is not recognized, `SAXNotRecognizedException` is raised. If the property or its setting is not supported by the parser, *SAXNotSupportedException* is raised.

<!-- anchor: incrementalparser-objects | type: section -->
## IncrementalParser Objects

Instances of `IncrementalParser` offer the following additional methods:

<!-- anchor: xml.sax.xmlreader.IncrementalParser.feed | type: py method -->
### `IncrementalParser.feed(data)`

Process a chunk of *data*.

<!-- anchor: xml.sax.xmlreader.IncrementalParser.close | type: py method -->
### `IncrementalParser.close()`

Assume the end of the document. That will check well-formedness conditions that can be checked only at the end, invoke handlers, and may clean up resources allocated during parsing.

<!-- anchor: xml.sax.xmlreader.IncrementalParser.prepareParser | type: py method -->
### `IncrementalParser.prepareParser(source)`

Prepare the parser for parsing *source*, an `InputSource` instance. It is called by `parse()` before feeding the data. The parser implementation must override this method; the default implementation raises `NotImplementedError`.

<!-- anchor: xml.sax.xmlreader.IncrementalParser.reset | type: py method -->
### `IncrementalParser.reset()`

This method is called after close has been called to reset the parser so that it is ready to parse new documents. The results of calling parse or feed after close without calling reset are undefined.

<!-- anchor: locator-objects | type: section -->
## Locator Objects

Instances of `Locator` provide these methods:

<!-- anchor: xml.sax.xmlreader.Locator.getColumnNumber | type: py method -->
### `Locator.getColumnNumber()`

Return the column number where the current event begins.

<!-- anchor: xml.sax.xmlreader.Locator.getLineNumber | type: py method -->
### `Locator.getLineNumber()`

Return the line number where the current event begins.

<!-- anchor: xml.sax.xmlreader.Locator.getPublicId | type: py method -->
### `Locator.getPublicId()`

Return the public identifier for the current event.

<!-- anchor: xml.sax.xmlreader.Locator.getSystemId | type: py method -->
### `Locator.getSystemId()`

Return the system identifier for the current event.

<!-- anchor: inputsource-objects | type: section -->
## InputSource Objects

<!-- anchor: xml.sax.xmlreader.InputSource.setPublicId | type: py method -->
### `InputSource.setPublicId(id)`

Sets the public identifier of this `InputSource`.

<!-- anchor: xml.sax.xmlreader.InputSource.getPublicId | type: py method -->
### `InputSource.getPublicId()`

Returns the public identifier of this `InputSource`.

<!-- anchor: xml.sax.xmlreader.InputSource.setSystemId | type: py method -->
### `InputSource.setSystemId(id)`

Sets the system identifier of this `InputSource`.

<!-- anchor: xml.sax.xmlreader.InputSource.getSystemId | type: py method -->
### `InputSource.getSystemId()`

Returns the system identifier of this `InputSource`.

<!-- anchor: xml.sax.xmlreader.InputSource.setEncoding | type: py method -->
### `InputSource.setEncoding(encoding)`

Sets the character encoding of this `InputSource`.

The encoding must be a string acceptable for an XML encoding declaration (see section 4.3.3 of the XML recommendation).

The encoding attribute of the `InputSource` is ignored if the `InputSource` also contains a character stream.

<!-- anchor: xml.sax.xmlreader.InputSource.getEncoding | type: py method -->
### `InputSource.getEncoding()`

Get the character encoding of this InputSource.

<!-- anchor: xml.sax.xmlreader.InputSource.setByteStream | type: py method -->
### `InputSource.setByteStream(bytefile)`

Set the byte stream (a binary file) for this input source.

The SAX parser will ignore this if there is also a character stream specified, but it will use a byte stream in preference to opening a URI connection itself.

If the application knows the character encoding of the byte stream, it should set it with the setEncoding method.

<!-- anchor: xml.sax.xmlreader.InputSource.getByteStream | type: py method -->
### `InputSource.getByteStream()`

Get the byte stream for this input source.

The getEncoding method will return the character encoding for this byte stream, or `None` if unknown.

<!-- anchor: xml.sax.xmlreader.InputSource.setCharacterStream | type: py method -->
### `InputSource.setCharacterStream(charfile)`

Set the character stream (a text file) for this input source.

If there is a character stream specified, the SAX parser will ignore any byte stream and will not attempt to open a URI connection to the system identifier.

<!-- anchor: xml.sax.xmlreader.InputSource.getCharacterStream | type: py method -->
### `InputSource.getCharacterStream()`

Get the character stream for this input source.

<!-- anchor: the-attributes-interface | type: section -->
## The `Attributes` Interface

`Attributes` objects implement a portion of the mapping protocol, including the methods `copy()`, `get()`, `__contains__()`, `items()`, `keys()`, and `values()`. The following methods are also provided:

<!-- anchor: xml.sax.xmlreader.Attributes.getLength | type: py method -->
### `Attributes.getLength()`

Return the number of attributes.

<!-- anchor: xml.sax.xmlreader.Attributes.getNames | type: py method -->
### `Attributes.getNames()`

Return the names of the attributes.

<!-- anchor: xml.sax.xmlreader.Attributes.getType | type: py method -->
### `Attributes.getType(name)`

Returns the type of the attribute *name*, which is normally `'CDATA'`.

<!-- anchor: xml.sax.xmlreader.Attributes.getValue | type: py method -->
### `Attributes.getValue(name)`

Return the value of attribute *name*.

<!-- anchor: the-attributesns-interface | type: section -->
## The `AttributesNS` Interface

This interface is a subtype of the `Attributes` interface (see section The Attributes Interface). All methods supported by that interface are also available on `AttributesNS` objects.

The following methods are also available:

<!-- anchor: xml.sax.xmlreader.AttributesNS.getValueByQName | type: py method -->
### `AttributesNS.getValueByQName(name)`

Return the value for a qualified name.

<!-- anchor: xml.sax.xmlreader.AttributesNS.getNameByQName | type: py method -->
### `AttributesNS.getNameByQName(name)`

Return the `(namespace, localname)` pair for a qualified *name*.

<!-- anchor: xml.sax.xmlreader.AttributesNS.getQNameByName | type: py method -->
### `AttributesNS.getQNameByName(name)`

Return the qualified name for a `(namespace, localname)` pair.

<!-- anchor: xml.sax.xmlreader.AttributesNS.getQNames | type: py method -->
### `AttributesNS.getQNames()`

Return the qualified names of all attributes.
