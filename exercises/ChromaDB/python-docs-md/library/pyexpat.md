---
page: library/pyexpat.html
title: xml.parsers.expat — Fast XML parsing using Expat
area: library
kind: guide
module: xml.parsers.expat
---

<!-- anchor: module-xml.parsers.expat | type: section -->
# `xml.parsers.expat` — Fast XML parsing using Expat

**Note:**

If you need to parse untrusted or unauthenticated data, see XML security.

The `xml.parsers.expat` module is a Python interface to the Expat non-validating XML parser. The module provides a single extension type, `xmlparser`, that represents the current state of an XML parser. After an `xmlparser` object has been created, various attributes of the object can be set to handler functions. When an XML document is then fed to the parser, the handler functions are called for the character data and markup in the XML document.

This module uses the `pyexpat` module to provide access to the Expat parser. Direct use of the `pyexpat` module is deprecated.

This module provides the following exception, type object and data items:

<!-- anchor: xml.parsers.expat.ExpatError | type: py exception -->
## `exception xml.parsers.expat.ExpatError`

The exception raised when Expat reports an error. See section ExpatError Exceptions for more information on interpreting Expat errors.

<!-- anchor: xml.parsers.expat.error | type: py exception -->
## `exception xml.parsers.expat.error`

Alias for `ExpatError`.

<!-- anchor: xml.parsers.expat.XMLParserType | type: py data -->
## `xml.parsers.expat.XMLParserType`

The type of the return values from the `ParserCreate()` function.

<!-- anchor: xml.parsers.expat.EXPAT_VERSION | type: py data -->
## `xml.parsers.expat.EXPAT_VERSION`

The version string of the Expat library loaded by the interpreter, like `'expat_2.8.4'`.

<!-- anchor: xml.parsers.expat.version_info | type: py data -->
## `xml.parsers.expat.version_info`

The version of the Expat library loaded by the interpreter, as a tuple of three integers: major, minor and micro version.

<!-- anchor: xml.parsers.expat.features | type: py data -->
## `xml.parsers.expat.features`

The list of the features with which the loaded Expat library was compiled, as `(name, value)` pairs. The value is only meaningful for features which have one, like `'XML_CONTEXT_BYTES'` or the default protection limits `'XML_BLAP_ACT_THRES'` and `'XML_AT_MAX_AMP'`; for other features, like `'XML_DTD'` and `'XML_NS'`, the value is `0` and only the presence of the name is significant.

The `xml.parsers.expat` module contains two functions:

<!-- anchor: xml.parsers.expat.ErrorString | type: py function -->
## `xml.parsers.expat.ErrorString(errno)`

Returns an explanatory string for a given error number *errno*.

<!-- anchor: xml.parsers.expat.ParserCreate | type: py function -->
## `xml.parsers.expat.ParserCreate(encoding=None, namespace_separator=None, intern=None)`

Creates and returns a new `xmlparser` object. *encoding*, if specified, must be a string naming the encoding used by the XML data. Expat doesn’t support as many encodings as Python does, and its repertoire of encodings can’t be extended; it supports UTF-8, UTF-16, ISO-8859-1 (Latin1), and ASCII. If *encoding* [1] is given it will override the implicit or explicit encoding of the document.

Parsers created through `ParserCreate()` are called “root” parsers, in the sense that they do not have any parent parser attached. Non-root parsers are created by `parser.ExternalEntityParserCreate`.

Expat can optionally do XML namespace processing for you, enabled by providing a value for *namespace_separator*. The value must be a one-character string; a `ValueError` will be raised if the string has an illegal length (`None` is considered the same as omission). When namespace processing is enabled, element type names and attribute names that belong to a namespace will be expanded. The element name passed to the element handlers `StartElementHandler` and `EndElementHandler` will be the concatenation of the namespace URI, the namespace separator character, and the local part of the name. If the namespace separator is a zero byte (`chr(0)`) then the namespace URI and the local part will be concatenated without any separator.

For example, if *namespace_separator* is set to a space character (`' '`) and the following document is parsed:

```xml
<?xml version="1.0"?>
<root xmlns    = "http://default-namespace.org/"
      xmlns:py = "http://www.python.org/ns/">
  <py:elem1 />
  <elem2 xmlns="" />
</root>
```

`StartElementHandler` will receive the following strings for each element:

```python
http://default-namespace.org/ root
http://www.python.org/ns/ elem1
elem2
```

*intern*, if given, must be a dictionary. It is used to intern the names of elements and attributes, and is available as the `intern` attribute. By default a new empty dictionary is created for every parser.

Due to limitations in the `Expat` library used by `pyexpat`, the `xmlparser` instance returned can only be used to parse a single XML document. Call `ParserCreate` for each document to provide unique parser instances.

**See also:**

**The Expat XML Parser**

Home page of the Expat project.

<!-- anchor: xmlparser-objects | type: section -->
## XMLParser Objects

`xmlparser` objects have the following methods:

<!-- anchor: xml.parsers.expat.xmlparser.Parse | type: py method -->
### `xmlparser.Parse(data[, isfinal])`

Parses the contents of *data*, calling the appropriate handler functions to process the parsed data. *data* can be a bytes-like object or a string. If it is a string, the encoding declaration in the XML data is ignored, and the data is parsed as already decoded text. *isfinal* must be true on the final call to this method; it allows the parsing of a single file in fragments, not the submission of multiple files. *data* can be empty at any time.

<!-- anchor: xml.parsers.expat.xmlparser.ParseFile | type: py method -->
### `xmlparser.ParseFile(file)`

Parse XML data reading from the object *file*. *file* only needs to provide the `read(nbytes)` method, which returns bytes, and an empty bytes object when there’s no more data. Text files are not supported; use `Parse()` for data which is already decoded.

<!-- anchor: xml.parsers.expat.xmlparser.SetBase | type: py method -->
### `xmlparser.SetBase(base)`

Sets the base to be used for resolving relative URIs in system identifiers in declarations. Resolving relative identifiers is left to the application: this value will be passed through as the *base* argument to the `ExternalEntityRefHandler()`, `NotationDeclHandler()`, and `UnparsedEntityDeclHandler()` functions.

<!-- anchor: xml.parsers.expat.xmlparser.GetBase | type: py method -->
### `xmlparser.GetBase()`

Returns a string containing the base set by a previous call to `SetBase()`, or `None` if `SetBase()` hasn’t been called.

<!-- anchor: xml.parsers.expat.xmlparser.GetInputContext | type: py method -->
### `xmlparser.GetInputContext()`

Returns the input data which generated the current event as a `bytes` object. The data is in the encoding of the entity which contains the text. It extends to the end of the currently buffered input, therefore it can contain also the data of the following events, and if the event was generated by a large amount of text, not all of it may be available. When called while an event handler is not active, the return value is `None`.

<!-- anchor: xml.parsers.expat.xmlparser.ExternalEntityParserCreate | type: py method -->
### `xmlparser.ExternalEntityParserCreate(context[, encoding])`

Create a “child” parser which can be used to parse an external parsed entity referred to by content parsed by the parent parser. The *context* parameter should be the string passed to the `ExternalEntityRefHandler()` handler function, described below. The child parser is created with the `ordered_attributes` and `specified_attributes` set to the values of this parser.

<!-- anchor: xml.parsers.expat.xmlparser.SetParamEntityParsing | type: py method -->
### `xmlparser.SetParamEntityParsing(flag)`

Control parsing of parameter entities (including the external DTD subset). Possible *flag* values are `XML_PARAM_ENTITY_PARSING_NEVER`, `XML_PARAM_ENTITY_PARSING_UNLESS_STANDALONE` and `XML_PARAM_ENTITY_PARSING_ALWAYS`. Return true if setting the flag was successful.

<!-- anchor: xml.parsers.expat.xmlparser.UseForeignDTD | type: py method -->
### `xmlparser.UseForeignDTD([flag])`

Calling this with a true value for *flag* (the default) will cause Expat to call the `ExternalEntityRefHandler` with `None` for all arguments to allow an alternate DTD to be loaded. If the document does not contain a document type declaration, the `ExternalEntityRefHandler` will still be called, but the `StartDoctypeDeclHandler` and `EndDoctypeDeclHandler` will not be called.

Passing a false value for *flag* will cancel a previous call that passed a true value, but otherwise has no effect.

This method can only be called before the `Parse()` or `ParseFile()` methods are called; calling it after either of those have been called causes `ExpatError` to be raised with the `code` attribute set to `errors.codes[errors.XML_ERROR_CANT_CHANGE_FEATURE_ONCE_PARSING]`.

<!-- anchor: xml.parsers.expat.xmlparser.SetReparseDeferralEnabled | type: py method -->
### `xmlparser.SetReparseDeferralEnabled(enabled)`

**Warning:**

Calling `SetReparseDeferralEnabled(False)` has security implications, as detailed below; please make sure to understand these consequences prior to using the `SetReparseDeferralEnabled` method.

Expat 2.6.0 introduced a security mechanism called “reparse deferral” where instead of causing denial of service through quadratic runtime from reparsing large tokens, reparsing of unfinished tokens is now delayed by default until a sufficient amount of input is reached. Due to this delay, registered handlers may — depending of the sizing of input chunks pushed to Expat — no longer be called right after pushing new input to the parser. Where immediate feedback and taking over responsibility of protecting against denial of service from large tokens are both wanted, calling `SetReparseDeferralEnabled(False)` disables reparse deferral for the current Expat parser instance, temporarily or altogether. Calling `SetReparseDeferralEnabled(True)` allows re-enabling reparse deferral.

`SetReparseDeferralEnabled()` has been backported to some prior releases of CPython as a security fix. Check for availability using `hasattr()` if used in code running across a variety of Python versions.

Added in version 3.13.

<!-- anchor: xml.parsers.expat.xmlparser.GetReparseDeferralEnabled | type: py method -->
### `xmlparser.GetReparseDeferralEnabled()`

Returns whether reparse deferral is currently enabled for the given Expat parser instance.

Added in version 3.13.

`xmlparser` objects have the following methods to tune protections against some common XML vulnerabilities.

<!-- anchor: xml.parsers.expat.xmlparser.SetBillionLaughsAttackProtectionActivationThreshold | type: py method -->
### `xmlparser.SetBillionLaughsAttackProtectionActivationThreshold(threshold, /)`

Sets the number of output bytes needed to activate protection against billion laughs attacks.

The number of output bytes includes amplification from entity expansion and reading DTD files.

Parser objects usually have a protection activation threshold of 8 MiB, but the actual default value depends on the underlying Expat library.

An `ExpatError` is raised if this method is called on a non-root parser. The corresponding `lineno` and `offset` should not be used as they may have no special meaning.

`SetBillionLaughsAttackProtectionActivationThreshold()` has been backported to some prior releases of CPython as a security fix. Check for availability using `hasattr()` if used in code running across a variety of Python versions.

**Note:**

Activation thresholds below 4 MiB are known to break support for DITA 1.3 payload and are hence not recommended.

Added in version 3.15.

<!-- anchor: xml.parsers.expat.xmlparser.SetBillionLaughsAttackProtectionMaximumAmplification | type: py method -->
### `xmlparser.SetBillionLaughsAttackProtectionMaximumAmplification(max_factor, /)`

Sets the maximum tolerated amplification factor for protection against billion laughs attacks.

The amplification factor is calculated as `(direct + indirect) / direct` while parsing, where `direct` is the number of bytes read from the primary document in parsing and `indirect` is the number of bytes added by expanding entities and reading of external DTD files.

The *max_factor* value must be a non-NaN `float` value greater than or equal to 1.0. Peak amplifications of factor 15,000 for the entire payload and of factor 30,000 in the middle of parsing have been observed with small benign files in practice. In particular, the activation threshold should be carefully chosen to avoid false positives.

Parser objects usually have a maximum amplification factor of 100, but the actual default value depends on the underlying Expat library.

An `ExpatError` is raised if this method is called on a non-root parser or if *max_factor* is outside the valid range. The corresponding `lineno` and `offset` should not be used as they may have no special meaning.

`SetBillionLaughsAttackProtectionMaximumAmplification()` has been backported to some prior releases of CPython as a security fix. Check for availability using `hasattr()` if used in code running across a variety of Python versions.

**Note:**

The maximum amplification factor is only considered if the threshold that can be adjusted by `SetBillionLaughsAttackProtectionActivationThreshold()` is exceeded.

Added in version 3.15.

<!-- anchor: xml.parsers.expat.xmlparser.SetAllocTrackerActivationThreshold | type: py method -->
### `xmlparser.SetAllocTrackerActivationThreshold(threshold, /)`

Sets the number of allocated bytes of dynamic memory needed to activate protection against disproportionate use of RAM.

Parser objects usually have an allocation activation threshold of 64 MiB, but the actual default value depends on the underlying Expat library.

An `ExpatError` is raised if this method is called on a non-root parser. The corresponding `lineno` and `offset` should not be used as they may have no special meaning.

`SetAllocTrackerActivationThreshold()` has been backported to some prior releases of CPython as a security fix. Check for availability using `hasattr()` if used in code running across a variety of Python versions.

Added in version 3.15.

<!-- anchor: xml.parsers.expat.xmlparser.SetAllocTrackerMaximumAmplification | type: py method -->
### `xmlparser.SetAllocTrackerMaximumAmplification(max_factor, /)`

Sets the maximum amplification factor between direct input and bytes of dynamic memory allocated.

The amplification factor is calculated as `allocated / direct` while parsing, where `direct` is the number of bytes read from the primary document in parsing and `allocated` is the number of bytes of dynamic memory allocated in the parser hierarchy.

The *max_factor* value must be a non-NaN `float` value greater than or equal to 1.0. Amplification factors greater than 100.0 can be observed near the start of parsing even with benign files in practice. In particular, the activation threshold should be carefully chosen to avoid false positives.

Parser objects usually have a maximum amplification factor of 100, but the actual default value depends on the underlying Expat library.

An `ExpatError` is raised if this method is called on a non-root parser or if *max_factor* is outside the valid range. The corresponding `lineno` and `offset` should not be used as they may have no special meaning.

`SetAllocTrackerMaximumAmplification()` has been backported to some prior releases of CPython as a security fix. Check for availability using `hasattr()` if used in code running across a variety of Python versions.

**Note:**

The maximum amplification factor is only considered if the threshold that can be adjusted by `SetAllocTrackerActivationThreshold()` is exceeded.

Added in version 3.15.

`xmlparser` objects have the following attributes:

<!-- anchor: xml.parsers.expat.xmlparser.buffer_size | type: py attribute -->
### `xmlparser.buffer_size`

The size of the buffer used when `buffer_text` is true. A new buffer size can be set by assigning a new integer value to this attribute. When the size is changed, the buffer will be flushed.

<!-- anchor: xml.parsers.expat.xmlparser.buffer_text | type: py attribute -->
### `xmlparser.buffer_text`

Setting this to true causes the `xmlparser` object to buffer textual content returned by Expat to avoid multiple calls to the `CharacterDataHandler()` callback whenever possible. This can improve performance substantially since Expat normally breaks character data into chunks at every line ending. This attribute is false by default, and may be changed at any time. Note that when it is false, data that does not contain newlines may be chunked too.

<!-- anchor: xml.parsers.expat.xmlparser.buffer_used | type: py attribute -->
### `xmlparser.buffer_used`

If `buffer_text` is enabled, the number of bytes stored in the buffer. These bytes represent UTF-8 encoded text. This attribute has no meaningful interpretation when `buffer_text` is false.

<!-- anchor: xml.parsers.expat.xmlparser.ordered_attributes | type: py attribute -->
### `xmlparser.ordered_attributes`

Setting this attribute to a non-zero integer causes the attributes to be reported as a list rather than a dictionary. The attributes are presented in the order found in the document text. For each attribute, two list entries are presented: the attribute name and the attribute value. (Older versions of this module also used this format.) By default, this attribute is false; it may be changed at any time.

<!-- anchor: xml.parsers.expat.xmlparser.specified_attributes | type: py attribute -->
### `xmlparser.specified_attributes`

If set to a non-zero integer, the parser will report only those attributes which were specified in the document instance and not those which were derived from attribute declarations. Applications which set this need to be especially careful to use what additional information is available from the declarations as needed to comply with the standards for the behavior of XML processors. By default, this attribute is false; it may be changed at any time.

<!-- anchor: xml.parsers.expat.xmlparser.intern | type: py attribute -->
### `xmlparser.intern`

The dictionary used to intern the names of elements and attributes. It is either the dictionary passed as the *intern* argument of `ParserCreate()`, or a new dictionary created for this parser.

<!-- anchor: xml.parsers.expat.xmlparser.namespace_prefixes | type: py attribute -->
### `xmlparser.namespace_prefixes`

If set to a true value, and namespace processing is enabled, the namespace prefix is reported as the third part of the expanded name, separated by the namespace separator. Names which have no prefix are not affected. By default, this attribute is false; it may be changed at any time.

The following attributes contain values relating to the most recent error encountered by an `xmlparser` object, and will only have correct values once a call to `Parse()` or `ParseFile()` has raised an `xml.parsers.expat.ExpatError` exception.

<!-- anchor: xml.parsers.expat.xmlparser.ErrorByteIndex | type: py attribute -->
### `xmlparser.ErrorByteIndex`

Byte index at which an error occurred.

<!-- anchor: xml.parsers.expat.xmlparser.ErrorCode | type: py attribute -->
### `xmlparser.ErrorCode`

Numeric code specifying the problem. This value can be passed to the `ErrorString()` function, or compared to one of the constants defined in the `errors` object.

<!-- anchor: xml.parsers.expat.xmlparser.ErrorColumnNumber | type: py attribute -->
### `xmlparser.ErrorColumnNumber`

Column number at which an error occurred.

<!-- anchor: xml.parsers.expat.xmlparser.ErrorLineNumber | type: py attribute -->
### `xmlparser.ErrorLineNumber`

Line number at which an error occurred.

The following attributes contain values relating to the current parse location in an `xmlparser` object. During a callback reporting a parse event they indicate the location of the first of the sequence of characters that generated the event. When called outside of a callback, the position indicated will be just past the last parse event (regardless of whether there was an associated callback).

<!-- anchor: xml.parsers.expat.xmlparser.CurrentByteIndex | type: py attribute -->
### `xmlparser.CurrentByteIndex`

Current byte index in the parser input.

<!-- anchor: xml.parsers.expat.xmlparser.CurrentColumnNumber | type: py attribute -->
### `xmlparser.CurrentColumnNumber`

Current column number in the parser input.

<!-- anchor: xml.parsers.expat.xmlparser.CurrentLineNumber | type: py attribute -->
### `xmlparser.CurrentLineNumber`

Current line number in the parser input.

Here is the list of handlers that can be set. To set a handler on an `xmlparser` object *o*, use `o.handlername = func`. *handlername* must be taken from the following list, and *func* must be a callable object accepting the correct number of arguments. The arguments are all strings, unless otherwise stated.

<!-- anchor: xml.parsers.expat.xmlparser.XmlDeclHandler | type: py method -->
### `xmlparser.XmlDeclHandler(version, encoding, standalone)`

Called when the XML declaration is parsed. The XML declaration is the (optional) declaration of the applicable version of the XML recommendation, the encoding of the document text, and an optional “standalone” declaration. *version* and *encoding* will be strings, and *standalone* will be `1` if the document is declared standalone, `0` if it is declared not to be standalone, or `-1` if the standalone clause was omitted.

<!-- anchor: xml.parsers.expat.xmlparser.StartDoctypeDeclHandler | type: py method -->
### `xmlparser.StartDoctypeDeclHandler(doctypeName, systemId, publicId, has_internal_subset)`

Called when Expat begins parsing the document type declaration (`<!DOCTYPE ...`). The *doctypeName* is provided exactly as presented. The *systemId* and *publicId* parameters give the system and public identifiers if specified, or `None` if omitted. *has_internal_subset* will be true if the document contains an internal document declaration subset.

<!-- anchor: xml.parsers.expat.xmlparser.EndDoctypeDeclHandler | type: py method -->
### `xmlparser.EndDoctypeDeclHandler()`

Called when Expat is done parsing the document type declaration.

<!-- anchor: xml.parsers.expat.xmlparser.ElementDeclHandler | type: py method -->
### `xmlparser.ElementDeclHandler(name, model)`

Called once for each element type declaration. *name* is the name of the element type, and *model* is a representation of the content model.

<!-- anchor: xml.parsers.expat.xmlparser.AttlistDeclHandler | type: py method -->
### `xmlparser.AttlistDeclHandler(elname, attname, type, default, required)`

Called for each declared attribute for an element type. If an attribute list declaration declares three attributes, this handler is called three times, once for each attribute. *elname* is the name of the element to which the declaration applies and *attname* is the name of the attribute declared. The The attribute type is a string passed as *type*: `'CDATA'`, `'ID'`, `'IDREF'`, `'IDREFS'`, `'ENTITY'`, `'ENTITIES'`, `'NMTOKEN'` or `'NMTOKENS'`, an enumeration like `'(x|y)'`, or a notation list like `'NOTATION(n1|n2)'`. *default* gives the default value for the attribute used when the attribute is not specified by the document instance, or `None` if there is no default value (`#IMPLIED` values). If the attribute is required to be given in the document instance, *required* will be true.

<!-- anchor: xml.parsers.expat.xmlparser.StartElementHandler | type: py method -->
### `xmlparser.StartElementHandler(name, attributes)`

Called for the start of every element. *name* is a string containing the element name, and *attributes* is the element attributes. If `ordered_attributes` is true, this is a list (see `ordered_attributes` for a full description). Otherwise it’s a dictionary mapping names to values.

<!-- anchor: xml.parsers.expat.xmlparser.EndElementHandler | type: py method -->
### `xmlparser.EndElementHandler(name)`

Called for the end of every element.

<!-- anchor: xml.parsers.expat.xmlparser.ProcessingInstructionHandler | type: py method -->
### `xmlparser.ProcessingInstructionHandler(target, data)`

Called for every processing instruction.

<!-- anchor: xml.parsers.expat.xmlparser.CharacterDataHandler | type: py method -->
### `xmlparser.CharacterDataHandler(data)`

Called for character data. This will be called for normal character data, CDATA marked content, and ignorable whitespace. Applications which must distinguish these cases can use the `StartCdataSectionHandler`, `EndCdataSectionHandler`, and `ElementDeclHandler` callbacks to collect the required information. Note that the character data may be chunked even if it is short and so you may receive more than one call to `CharacterDataHandler()`. Set the `buffer_text` instance attribute to `True` to avoid that.

<!-- anchor: xml.parsers.expat.xmlparser.UnparsedEntityDeclHandler | type: py method -->
### `xmlparser.UnparsedEntityDeclHandler(entityName, base, systemId, publicId, notationName)`

Called for unparsed (NDATA) entity declarations. If this handler is not set, such declarations are reported by `EntityDeclHandler`, which is preferred for new code. (The underlying function in the Expat library has been declared obsolete.)

<!-- anchor: xml.parsers.expat.xmlparser.EntityDeclHandler | type: py method -->
### `xmlparser.EntityDeclHandler(entityName, is_parameter_entity, value, base, systemId, publicId, notationName)`

Called for all entity declarations. For parameter and internal entities, *value* will be a string giving the declared contents of the entity; this will be `None` for external entities. The *notationName* parameter will be `None` for parsed entities, and the name of the notation for unparsed entities. *is_parameter_entity* will be true if the entity is a parameter entity or false for general entities (most applications only need to be concerned with general entities).

<!-- anchor: xml.parsers.expat.xmlparser.NotationDeclHandler | type: py method -->
### `xmlparser.NotationDeclHandler(notationName, base, systemId, publicId)`

Called for notation declarations. *notationName*, *base*, and *systemId*, and *publicId* are strings if given. If the public identifier is omitted, *publicId* will be `None`.

<!-- anchor: xml.parsers.expat.xmlparser.StartNamespaceDeclHandler | type: py method -->
### `xmlparser.StartNamespaceDeclHandler(prefix, uri)`

Called when an element contains a namespace declaration. Namespace declarations are processed before the `StartElementHandler` is called for the element on which declarations are placed.

<!-- anchor: xml.parsers.expat.xmlparser.EndNamespaceDeclHandler | type: py method -->
### `xmlparser.EndNamespaceDeclHandler(prefix)`

Called when the closing tag is reached for an element that contained a namespace declaration. This is called once for each namespace declaration on the element in the reverse of the order for which the `StartNamespaceDeclHandler` was called to indicate the start of each namespace declaration’s scope. Calls to this handler are made after the corresponding `EndElementHandler` for the end of the element.

<!-- anchor: xml.parsers.expat.xmlparser.CommentHandler | type: py method -->
### `xmlparser.CommentHandler(data)`

Called for comments. *data* is the text of the comment, excluding the leading `'<!-``-'` and trailing `'-``->'`.

<!-- anchor: xml.parsers.expat.xmlparser.StartCdataSectionHandler | type: py method -->
### `xmlparser.StartCdataSectionHandler()`

Called at the start of a CDATA section. This and `EndCdataSectionHandler` are needed to be able to identify the syntactical start and end for CDATA sections.

<!-- anchor: xml.parsers.expat.xmlparser.EndCdataSectionHandler | type: py method -->
### `xmlparser.EndCdataSectionHandler()`

Called at the end of a CDATA section.

<!-- anchor: xml.parsers.expat.xmlparser.DefaultHandler | type: py method -->
### `xmlparser.DefaultHandler(data)`

Called for any characters in the XML document for which no applicable handler has been specified. This means characters that are part of a construct which could be reported, but for which no handler has been supplied.

<!-- anchor: xml.parsers.expat.xmlparser.DefaultHandlerExpand | type: py method -->
### `xmlparser.DefaultHandlerExpand(data)`

This is the same as the `DefaultHandler`, but doesn’t inhibit expansion of internal entities. The entity reference will not be passed to the default handler.

<!-- anchor: xml.parsers.expat.xmlparser.NotStandaloneHandler | type: py method -->
### `xmlparser.NotStandaloneHandler()`

Called if the XML document hasn’t been declared as being a standalone document. This happens when there is an external subset or a reference to a parameter entity, but the XML declaration does not set standalone to `yes` in an XML declaration. If this handler returns `0`, then the parser will raise an `XML_ERROR_NOT_STANDALONE` error. If this handler is not set, no exception is raised by the parser for this condition.

<!-- anchor: xml.parsers.expat.xmlparser.ExternalEntityRefHandler | type: py method -->
### `xmlparser.ExternalEntityRefHandler(context, base, systemId, publicId)`

**Warning:**

Implementing a handler that accesses local files and/or the network may create a vulnerability to external entity attacks if `xmlparser` is used with user-provided XML content. Please reflect on your threat model before implementing this handler.

Called for references to external entities. *base* is the current base, as set by a previous call to `SetBase()`. The public and system identifiers, *systemId* and *publicId*, are strings if given; if the public identifier is not given, *publicId* will be `None`. The *context* value is opaque and should only be used as described below.

For external entities to be parsed, this handler must be implemented. It is responsible for creating the sub-parser using `ExternalEntityParserCreate(context)`, initializing it with the appropriate callbacks, and parsing the entity. This handler should return an integer; if it returns `0`, the parser will raise an `XML_ERROR_EXTERNAL_ENTITY_HANDLING` error, otherwise parsing will continue.

If this handler is not provided, external entities are reported by the `DefaultHandler` callback, if provided.

<!-- anchor: xml.parsers.expat.xmlparser.SkippedEntityHandler | type: py method -->
### `xmlparser.SkippedEntityHandler(entityName, is_parameter_entity)`

Called for entity references which are not expanded, because the parser did not read the declaration of the entity. This happens when the external DTD subset or an external parameter entity is not parsed. *is_parameter_entity* is true for a parameter entity and false for a general entity.

<!-- anchor: expaterror-exceptions | type: section -->
## ExpatError Exceptions

`ExpatError` exceptions have a number of interesting attributes:

<!-- anchor: xml.parsers.expat.ExpatError.code | type: py attribute -->
### `ExpatError.code`

Expat’s internal error number for the specific error. The `errors.messages` dictionary maps these error numbers to Expat’s error messages. For example:

```python
from xml.parsers.expat import ParserCreate, ExpatError, errors

p = ParserCreate()
try:
    p.Parse(some_xml_document)
except ExpatError as err:
    print("Error:", errors.messages[err.code])
```

The `errors` module also provides error message constants and a dictionary `codes` mapping these messages back to the error codes, see below.

<!-- anchor: xml.parsers.expat.ExpatError.lineno | type: py attribute -->
### `ExpatError.lineno`

Line number on which the error was detected. The first line is numbered `1`.

<!-- anchor: xml.parsers.expat.ExpatError.offset | type: py attribute -->
### `ExpatError.offset`

Character offset into the line where the error occurred. The first column is numbered `0`.

<!-- anchor: example | type: section -->
## Example

The following program defines three handlers that just print out their arguments.

```python
import xml.parsers.expat

# 3 handler functions
def start_element(name, attrs):
    print('Start element:', name, attrs)
def end_element(name):
    print('End element:', name)
def char_data(data):
    print('Character data:', repr(data))

p = xml.parsers.expat.ParserCreate()

p.StartElementHandler = start_element
p.EndElementHandler = end_element
p.CharacterDataHandler = char_data

p.Parse("""<?xml version="1.0"?>
<parent id="top"><child1 name="paul">Text goes here</child1>
<child2 name="fred">More text</child2>
</parent>""", 1)
```

The output from this program is:

```python
Start element: parent {'id': 'top'}
Start element: child1 {'name': 'paul'}
Character data: 'Text goes here'
End element: child1
Character data: '\n'
Start element: child2 {'name': 'fred'}
Character data: 'More text'
End element: child2
Character data: '\n'
End element: parent
```

<!-- anchor: module-xml.parsers.expat.model | type: section -->
## Content Model Descriptions

Content models are described using nested tuples. Each tuple contains four values: the type, the quantifier, the name, and a tuple of children. Children are simply additional content model descriptions.

The values of the first two fields are constants defined in the `xml.parsers.expat.model` module. These constants can be collected in two groups: the model type group and the quantifier group.

The constants in the model type group are:

<!-- anchor: xml.parsers.expat.model.XML_CTYPE_ANY | type: py data -->
### `xml.parsers.expat.model.XML_CTYPE_ANY`

The element named by the model name was declared to have a content model of `ANY`.

<!-- anchor: xml.parsers.expat.model.XML_CTYPE_CHOICE | type: py data -->
### `xml.parsers.expat.model.XML_CTYPE_CHOICE`

The named element allows a choice from a number of options; this is used for content models such as `(A | B | C)`.

<!-- anchor: xml.parsers.expat.model.XML_CTYPE_EMPTY | type: py data -->
### `xml.parsers.expat.model.XML_CTYPE_EMPTY`

Elements which are declared to be `EMPTY` have this model type.

<!-- anchor: xml.parsers.expat.model.XML_CTYPE_MIXED | type: py data -->
### `xml.parsers.expat.model.XML_CTYPE_MIXED`

The named element allows character data, optionally interspersed with the named children; this is used for content models such as `(#PCDATA)` and `(#PCDATA | A | B)*`.

<!-- anchor: xml.parsers.expat.model.XML_CTYPE_NAME | type: py data -->
### `xml.parsers.expat.model.XML_CTYPE_NAME`

The model names a single element, as for `A`.

<!-- anchor: xml.parsers.expat.model.XML_CTYPE_SEQ | type: py data -->
### `xml.parsers.expat.model.XML_CTYPE_SEQ`

Models which represent a series of models which follow one after the other are indicated with this model type. This is used for models such as `(A, B, C)`.

The constants in the quantifier group are:

<!-- anchor: xml.parsers.expat.model.XML_CQUANT_NONE | type: py data -->
### `xml.parsers.expat.model.XML_CQUANT_NONE`

No modifier is given, so it can appear exactly once, as for `A`.

<!-- anchor: xml.parsers.expat.model.XML_CQUANT_OPT | type: py data -->
### `xml.parsers.expat.model.XML_CQUANT_OPT`

The model is optional: it can appear once or not at all, as for `A?`.

<!-- anchor: xml.parsers.expat.model.XML_CQUANT_PLUS | type: py data -->
### `xml.parsers.expat.model.XML_CQUANT_PLUS`

The model must occur one or more times (like `A+`).

<!-- anchor: xml.parsers.expat.model.XML_CQUANT_REP | type: py data -->
### `xml.parsers.expat.model.XML_CQUANT_REP`

The model must occur zero or more times, as for `A*`.

<!-- anchor: module-xml.parsers.expat.errors | type: section -->
## Expat error constants

The following constants are provided in the `xml.parsers.expat.errors` module. These constants are useful in interpreting some of the attributes of the `ExpatError` exception objects raised when an error has occurred. Since for backwards compatibility reasons, the constants’ value is the error *message* and not the numeric error *code*, you do this by comparing its `code` attribute with `errors.codes[errors.XML_ERROR_CONSTANT_NAME]`.

The `errors` module has the following attributes:

<!-- anchor: xml.parsers.expat.errors.codes | type: py data -->
### `xml.parsers.expat.errors.codes`

A dictionary mapping string descriptions to their error codes.

Added in version 3.2.

<!-- anchor: xml.parsers.expat.errors.messages | type: py data -->
### `xml.parsers.expat.errors.messages`

A dictionary mapping numeric error codes to their string descriptions.

Added in version 3.2.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_ASYNC_ENTITY | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_ASYNC_ENTITY`

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_ATTRIBUTE_EXTERNAL_ENTITY_REF | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_ATTRIBUTE_EXTERNAL_ENTITY_REF`

An entity reference in an attribute value referred to an external entity instead of an internal entity.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_BAD_CHAR_REF | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_BAD_CHAR_REF`

A character reference referred to a character which is illegal in XML (for example, character `0`, or ‘`&#0;`’).

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_BINARY_ENTITY_REF | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_BINARY_ENTITY_REF`

An entity reference referred to an entity which was declared with a notation, so cannot be parsed.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_DUPLICATE_ATTRIBUTE | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_DUPLICATE_ATTRIBUTE`

An attribute was used more than once in a start tag.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_INCORRECT_ENCODING | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_INCORRECT_ENCODING`

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_INVALID_TOKEN | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_INVALID_TOKEN`

Raised when an input byte could not properly be assigned to a character; for example, a NUL byte (value `0`) in a UTF-8 input stream.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_JUNK_AFTER_DOC_ELEMENT | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_JUNK_AFTER_DOC_ELEMENT`

Something other than whitespace occurred after the document element.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_MISPLACED_XML_PI | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_MISPLACED_XML_PI`

An XML declaration was found somewhere other than the start of the input data.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_NO_ELEMENTS | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_NO_ELEMENTS`

The document contains no elements (XML requires all documents to contain exactly one top-level element).

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_NO_MEMORY | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_NO_MEMORY`

Expat was not able to allocate memory internally.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_PARAM_ENTITY_REF | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_PARAM_ENTITY_REF`

A parameter entity reference was found where it was not allowed.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_PARTIAL_CHAR | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_PARTIAL_CHAR`

An incomplete character was found in the input.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_RECURSIVE_ENTITY_REF | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_RECURSIVE_ENTITY_REF`

An entity reference contained another reference to the same entity; possibly via a different name, and possibly indirectly.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_SYNTAX | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_SYNTAX`

Some unspecified syntax error was encountered.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_TAG_MISMATCH | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_TAG_MISMATCH`

An end tag did not match the innermost open start tag.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_UNCLOSED_TOKEN | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_UNCLOSED_TOKEN`

Some token (such as a start tag) was not closed before the end of the stream or the next token was encountered.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_UNDEFINED_ENTITY | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_UNDEFINED_ENTITY`

A reference was made to an entity which was not defined.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_UNKNOWN_ENCODING | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_UNKNOWN_ENCODING`

The document encoding is not supported by Expat.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_UNCLOSED_CDATA_SECTION | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_UNCLOSED_CDATA_SECTION`

A CDATA marked section was not closed.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_EXTERNAL_ENTITY_HANDLING | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_EXTERNAL_ENTITY_HANDLING`

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_NOT_STANDALONE | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_NOT_STANDALONE`

The parser determined that the document was not “standalone” though it declared itself to be in the XML declaration, and the `NotStandaloneHandler` was set and returned `0`.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_UNEXPECTED_STATE | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_UNEXPECTED_STATE`

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_ENTITY_DECLARED_IN_PE | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_ENTITY_DECLARED_IN_PE`

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_FEATURE_REQUIRES_XML_DTD | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_FEATURE_REQUIRES_XML_DTD`

An operation was requested that requires DTD support to be compiled in, but Expat was configured without DTD support. This should never be reported by a standard build of the `xml.parsers.expat` module.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_CANT_CHANGE_FEATURE_ONCE_PARSING | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_CANT_CHANGE_FEATURE_ONCE_PARSING`

A behavioral change was requested after parsing started that can only be changed before parsing has started. This is (currently) only raised by `UseForeignDTD()`.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_UNBOUND_PREFIX | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_UNBOUND_PREFIX`

An undeclared prefix was found when namespace processing was enabled.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_UNDECLARING_PREFIX | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_UNDECLARING_PREFIX`

The document attempted to remove the namespace declaration associated with a prefix.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_INCOMPLETE_PE | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_INCOMPLETE_PE`

A parameter entity contained incomplete markup.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_XML_DECL | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_XML_DECL`

There was an error parsing the XML declaration.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_TEXT_DECL | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_TEXT_DECL`

There was an error parsing a text declaration in an external entity.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_PUBLICID | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_PUBLICID`

Characters were found in the public id that are not allowed.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_SUSPENDED | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_SUSPENDED`

The requested operation was made on a suspended parser, but isn’t allowed. This includes attempts to provide additional input or to stop the parser.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_NOT_SUSPENDED | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_NOT_SUSPENDED`

An attempt to resume the parser was made when the parser had not been suspended.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_ABORTED | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_ABORTED`

This should not be reported to Python applications.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_FINISHED | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_FINISHED`

The requested operation was made on a parser which was finished parsing input, but isn’t allowed. This includes attempts to provide additional input or to stop the parser.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_SUSPEND_PE | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_SUSPEND_PE`

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_RESERVED_PREFIX_XML | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_RESERVED_PREFIX_XML`

An attempt was made to undeclare reserved namespace prefix `xml` or to bind it to another namespace URI.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_RESERVED_PREFIX_XMLNS | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_RESERVED_PREFIX_XMLNS`

An attempt was made to declare or undeclare reserved namespace prefix `xmlns`.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_RESERVED_NAMESPACE_URI | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_RESERVED_NAMESPACE_URI`

An attempt was made to bind the URI of one the reserved namespace prefixes `xml` and `xmlns` to another namespace prefix.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_INVALID_ARGUMENT | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_INVALID_ARGUMENT`

This should not be reported to Python applications.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_NO_BUFFER | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_NO_BUFFER`

This should not be reported to Python applications.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_AMPLIFICATION_LIMIT_BREACH | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_AMPLIFICATION_LIMIT_BREACH`

The limit on input amplification factor (from DTD and entities) has been breached.

<!-- anchor: xml.parsers.expat.errors.XML_ERROR_NOT_STARTED | type: py data -->
### `xml.parsers.expat.errors.XML_ERROR_NOT_STARTED`

The parser was tried to be stopped or suspended before it started.

Added in version 3.14.

**Footnotes**

[1]

The encoding string included in XML output should conform to the appropriate standards. For example, “UTF-8” is valid, but “UTF8” is not. See https://www.w3.org/TR/2006/REC-xml11-20060816/#NT-EncodingDecl and https://www.iana.org/assignments/character-sets/character-sets.xhtml.
