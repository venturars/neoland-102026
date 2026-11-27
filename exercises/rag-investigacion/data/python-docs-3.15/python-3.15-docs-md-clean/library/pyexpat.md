# `xml.parsers.expat` — Fast XML parsing using Expat

---

Note

If you need to parse untrusted or unauthenticated data, see
XML security.

The `xml.parsers.expat` module is a Python interface to the Expat
non-validating XML parser. The module provides a single extension type,
`xmlparser`, that represents the current state of an XML parser. After
an `xmlparser` object has been created, various attributes of the object
can be set to handler functions. When an XML document is then fed to the
parser, the handler functions are called for the character data and markup in
the XML document.

This module uses the `pyexpat` module to provide access to the Expat
parser. Direct use of the `pyexpat` module is deprecated.

This module provides the following exception, type object and data items:

exception xml.parsers.expat.ExpatError
:   The exception raised when Expat reports an error. See section
    ExpatError Exceptions for more information on interpreting Expat errors.

exception xml.parsers.expat.error
:   Alias for `ExpatError`.

xml.parsers.expat.XMLParserType
:   The type of the return values from the `ParserCreate()` function.

xml.parsers.expat.EXPAT\_VERSION
:   The version string of the Expat library loaded by the interpreter,
    like `'expat_2.8.4'`.

xml.parsers.expat.version\_info
:   The version of the Expat library loaded by the interpreter,
    as a tuple of three integers: major, minor and micro version.

xml.parsers.expat.features
:   The list of the features with which the loaded Expat library
    was compiled, as `(name, value)` pairs.
    The value is only meaningful for features which have one,
    like `'XML_CONTEXT_BYTES'` or the default protection limits
    `'XML_BLAP_ACT_THRES'` and `'XML_AT_MAX_AMP'`;
    for other features, like `'XML_DTD'` and `'XML_NS'`,
    the value is `0` and only the presence of the name is significant.

The `xml.parsers.expat` module contains two functions:

xml.parsers.expat.ErrorString(*errno*)
:   Returns an explanatory string for a given error number *errno*.

xml.parsers.expat.ParserCreate(*encoding=None*, *namespace\_separator=None*, *intern=None*)
:   Creates and returns a new `xmlparser` object. *encoding*, if specified,
    must be a string naming the encoding used by the XML data. Expat doesn’t
    support as many encodings as Python does, and its repertoire of encodings can’t
    be extended; it supports UTF-8, UTF-16, ISO-8859-1 (Latin1), and ASCII. If
    *encoding* [[1]](#id3) is given it will override the implicit or explicit encoding of the
    document.

    Parsers created through `ParserCreate()` are called “root” parsers,
    in the sense that they do not have any parent parser attached. Non-root
    parsers are created by `parser.ExternalEntityParserCreate`.

    Expat can optionally do XML namespace processing for you, enabled by providing a
    value for *namespace\_separator*. The value must be a one-character string; a
    `ValueError` will be raised if the string has an illegal length (`None`
    is considered the same as omission). When namespace processing is enabled,
    element type names and attribute names that belong to a namespace will be
    expanded. The element name passed to the element handlers
    `StartElementHandler` and `EndElementHandler` will be the
    concatenation of the namespace URI, the namespace separator character, and the
    local part of the name. If the namespace separator is a zero byte (`chr(0)`)
    then the namespace URI and the local part will be concatenated without any
    separator.

    For example, if *namespace\_separator* is set to a space character (`' '`) and
    the following document is parsed:

    ```
    <?xml version="1.0"?>
    <root xmlns    = "http://default-namespace.org/"
          xmlns:py = "http://www.python.org/ns/">
      <py:elem1 />
      <elem2 xmlns="" />
    </root>
    ```

    `StartElementHandler` will receive the following strings for each
    element:

    ```
    http://default-namespace.org/ root
    http://www.python.org/ns/ elem1
    elem2
    ```

    *intern*, if given, must be a dictionary.
    It is used to intern the names of elements and attributes,
    and is available as the `intern` attribute.
    By default a new empty dictionary is created for every parser.

    Due to limitations in the `Expat` library used by `pyexpat`,
    the `xmlparser` instance returned can only be used to parse a single
    XML document. Call `ParserCreate` for each document to provide unique
    parser instances.

See also

The Expat XML Parser
:   Home page of the Expat project.

## XMLParser Objects

`xmlparser` objects have the following methods:

xmlparser.Parse(*data*[, *isfinal*])
:   Parses the contents of *data*,
    calling the appropriate handler functions to process the parsed data.
    *data* can be a bytes-like object or a string.
    If it is a string, the encoding declaration in the XML data is ignored,
    and the data is parsed as already decoded text.
    *isfinal* must be true on the final call to this method;
    it allows the parsing of a single file in fragments,
    not the submission of multiple files.
    *data* can be empty at any time.

xmlparser.ParseFile(*file*)
:   Parse XML data reading from the object *file*.
    *file* only needs to provide the `read(nbytes)` method,
    which returns bytes, and an empty bytes object when there’s no more data.
    Text files are not supported;
    use `Parse()` for data which is already decoded.

xmlparser.SetBase(*base*)
:   Sets the base to be used for resolving relative URIs in system identifiers in
    declarations. Resolving relative identifiers is left to the application: this
    value will be passed through as the *base* argument to the
    `ExternalEntityRefHandler()`, `NotationDeclHandler()`, and
    `UnparsedEntityDeclHandler()` functions.

xmlparser.GetBase()
:   Returns a string containing the base set by a previous call to `SetBase()`,
    or `None` if `SetBase()` hasn’t been called.

xmlparser.GetInputContext()
:   Returns the input data which generated the current event
    as a `bytes` object.
    The data is in the encoding of the entity which contains the text.
    It extends to the end of the currently buffered input,
    therefore it can contain also the data of the following events,
    and if the event was generated by a large amount of text,
    not all of it may be available.
    When called while an event handler is not active,
    the return value is `None`.

xmlparser.ExternalEntityParserCreate(*context*[, *encoding*])
:   Create a “child” parser which can be used to parse an external parsed entity
    referred to by content parsed by the parent parser. The *context* parameter
    should be the string passed to the `ExternalEntityRefHandler()` handler
    function, described below. The child parser is created with the
    `ordered_attributes` and `specified_attributes` set to the values of
    this parser.

xmlparser.SetParamEntityParsing(*flag*)
:   Control parsing of parameter entities (including the external DTD subset).
    Possible *flag* values are `XML_PARAM_ENTITY_PARSING_NEVER`,
    `XML_PARAM_ENTITY_PARSING_UNLESS_STANDALONE` and
    `XML_PARAM_ENTITY_PARSING_ALWAYS`. Return true if setting the flag
    was successful.

xmlparser.UseForeignDTD([*flag*])
:   Calling this with a true value for *flag* (the default) will cause Expat to call
    the `ExternalEntityRefHandler` with `None` for all arguments to
    allow an alternate DTD to be loaded. If the document does not contain a
    document type declaration, the `ExternalEntityRefHandler` will still be
    called, but the `StartDoctypeDeclHandler` and
    `EndDoctypeDeclHandler` will not be called.

    Passing a false value for *flag* will cancel a previous call that passed a true
    value, but otherwise has no effect.

    This method can only be called before the `Parse()` or `ParseFile()`
    methods are called; calling it after either of those have been called causes
    `ExpatError` to be raised with the `code` attribute set to
    `errors.codes[errors.XML_ERROR_CANT_CHANGE_FEATURE_ONCE_PARSING]`.

xmlparser.SetReparseDeferralEnabled(*enabled*)
:   Warning

    Calling `SetReparseDeferralEnabled(False)` has security implications,
    as detailed below; please make sure to understand these consequences
    prior to using the `SetReparseDeferralEnabled` method.

    Expat 2.6.0 introduced a security mechanism called “reparse deferral”
    where instead of causing denial of service through quadratic runtime
    from reparsing large tokens, reparsing of unfinished tokens is now delayed
    by default until a sufficient amount of input is reached.
    Due to this delay, registered handlers may — depending of the sizing of
    input chunks pushed to Expat — no longer be called right after pushing new
    input to the parser. Where immediate feedback and taking over responsibility
    of protecting against denial of service from large tokens are both wanted,
    calling `SetReparseDeferralEnabled(False)` disables reparse deferral
    for the current Expat parser instance, temporarily or altogether.
    Calling `SetReparseDeferralEnabled(True)` allows re-enabling reparse
    deferral.

    `SetReparseDeferralEnabled()`
    has been backported to some prior releases of CPython as a security fix.
    Check for availability using `hasattr()` if used in code running
    across a variety of Python versions.

xmlparser.GetReparseDeferralEnabled()
:   Returns whether reparse deferral is currently enabled for the given
    Expat parser instance.

`xmlparser` objects have the following methods to tune protections
against some common XML vulnerabilities.

xmlparser.SetBillionLaughsAttackProtectionActivationThreshold(*threshold*, */*)
:   Sets the number of output bytes needed to activate protection against
    billion laughs attacks.

    The number of output bytes includes amplification from entity expansion
    and reading DTD files.

    Parser objects usually have a protection activation threshold of 8 MiB,
    but the actual default value depends on the underlying Expat library.

    An `ExpatError` is raised if this method is called on a
    non-root parser.
    The corresponding `lineno` and `offset`
    should not be used as they may have no special meaning.

    `SetBillionLaughsAttackProtectionActivationThreshold()`
    has been backported to some prior releases of CPython as a security fix.
    Check for availability using `hasattr()` if used in code running
    across a variety of Python versions.

    Note

    Activation thresholds below 4 MiB are known to break support for DITA 1.3
    payload and are hence not recommended.

    Added in version 3.15.

xmlparser.SetBillionLaughsAttackProtectionMaximumAmplification(*max\_factor*, */*)
:   Sets the maximum tolerated amplification factor for protection against
    billion laughs attacks.

    The amplification factor is calculated as `(direct + indirect) / direct`
    while parsing, where `direct` is the number of bytes read from
    the primary document in parsing and `indirect` is the number of
    bytes added by expanding entities and reading of external DTD files.

    The *max\_factor* value must be a non-NaN `float` value greater than
    or equal to 1.0. Peak amplifications of factor 15,000 for the entire payload
    and of factor 30,000 in the middle of parsing have been observed with small
    benign files in practice. In particular, the activation threshold should be
    carefully chosen to avoid false positives.

    Parser objects usually have a maximum amplification factor of 100,
    but the actual default value depends on the underlying Expat library.

    An `ExpatError` is raised if this method is called on a
    non-root parser or if *max\_factor* is outside the valid range.
    The corresponding `lineno` and `offset`
    should not be used as they may have no special meaning.

    `SetBillionLaughsAttackProtectionMaximumAmplification()`
    has been backported to some prior releases of CPython as a security fix.
    Check for availability using `hasattr()` if used in code running
    across a variety of Python versions.

    Note

    The maximum amplification factor is only considered if the threshold
    that can be adjusted by `SetBillionLaughsAttackProtectionActivationThreshold()`
    is exceeded.

    Added in version 3.15.

xmlparser.SetAllocTrackerActivationThreshold(*threshold*, */*)
:   Sets the number of allocated bytes of dynamic memory needed to activate
    protection against disproportionate use of RAM.

    Parser objects usually have an allocation activation threshold of 64 MiB,
    but the actual default value depends on the underlying Expat library.

    An `ExpatError` is raised if this method is called on a
    non-root parser.
    The corresponding `lineno` and `offset`
    should not be used as they may have no special meaning.

    `SetAllocTrackerActivationThreshold()`
    has been backported to some prior releases of CPython as a security fix.
    Check for availability using `hasattr()` if used in code running
    across a variety of Python versions.

    Added in version 3.15.

xmlparser.SetAllocTrackerMaximumAmplification(*max\_factor*, */*)
:   Sets the maximum amplification factor between direct input and bytes
    of dynamic memory allocated.

    The amplification factor is calculated as `allocated / direct`
    while parsing, where `direct` is the number of bytes read from
    the primary document in parsing and `allocated` is the number
    of bytes of dynamic memory allocated in the parser hierarchy.

    The *max\_factor* value must be a non-NaN `float` value greater than
    or equal to 1.0. Amplification factors greater than 100.0 can be observed
    near the start of parsing even with benign files in practice. In particular,
    the activation threshold should be carefully chosen to avoid false positives.

    Parser objects usually have a maximum amplification factor of 100,
    but the actual default value depends on the underlying Expat library.

    An `ExpatError` is raised if this method is called on a
    non-root parser or if *max\_factor* is outside the valid range.
    The corresponding `lineno` and `offset`
    should not be used as they may have no special meaning.

    `SetAllocTrackerMaximumAmplification()`
    has been backported to some prior releases of CPython as a security fix.
    Check for availability using `hasattr()` if used in code running
    across a variety of Python versions.

    Note

    The maximum amplification factor is only considered if the threshold
    that can be adjusted by `SetAllocTrackerActivationThreshold()`
    is exceeded.

    Added in version 3.15.

`xmlparser` objects have the following attributes:

xmlparser.buffer\_size
:   The size of the buffer used when `buffer_text` is true.
    A new buffer size can be set by assigning a new integer value
    to this attribute.
    When the size is changed, the buffer will be flushed.

xmlparser.buffer\_text
:   Setting this to true causes the `xmlparser` object to buffer textual
    content returned by Expat to avoid multiple calls to the
    `CharacterDataHandler()` callback whenever possible. This can improve
    performance substantially since Expat normally breaks character data into chunks
    at every line ending. This attribute is false by default, and may be changed at
    any time. Note that when it is false, data that does not contain newlines
    may be chunked too.

xmlparser.buffer\_used
:   If `buffer_text` is enabled, the number of bytes stored in the buffer.
    These bytes represent UTF-8 encoded text. This attribute has no meaningful
    interpretation when `buffer_text` is false.

xmlparser.ordered\_attributes
:   Setting this attribute to a non-zero integer causes the attributes to be
    reported as a list rather than a dictionary. The attributes are presented in
    the order found in the document text. For each attribute, two list entries are
    presented: the attribute name and the attribute value. (Older versions of this
    module also used this format.) By default, this attribute is false; it may be
    changed at any time.

xmlparser.specified\_attributes
:   If set to a non-zero integer, the parser will report only those attributes which
    were specified in the document instance and not those which were derived from
    attribute declarations. Applications which set this need to be especially
    careful to use what additional information is available from the declarations as
    needed to comply with the standards for the behavior of XML processors. By
    default, this attribute is false; it may be changed at any time.

xmlparser.intern
:   The dictionary used to intern the names of elements and attributes.
    It is either the dictionary passed as the *intern* argument
    of `ParserCreate()`, or a new dictionary created for this parser.

xmlparser.namespace\_prefixes
:   If set to a true value, and namespace processing is enabled,
    the namespace prefix is reported as the third part of the expanded name,
    separated by the namespace separator.
    Names which have no prefix are not affected.
    By default, this attribute is false; it may be changed at any time.

The following attributes contain values relating to the most recent error
encountered by an `xmlparser` object, and will only have correct values
once a call to `Parse()` or `ParseFile()` has raised an
`xml.parsers.expat.ExpatError` exception.

xmlparser.ErrorByteIndex
:   Byte index at which an error occurred.

xmlparser.ErrorCode
:   Numeric code specifying the problem. This value can be passed to the
    `ErrorString()` function, or compared to one of the constants defined in the
    `errors` object.

xmlparser.ErrorColumnNumber
:   Column number at which an error occurred.

xmlparser.ErrorLineNumber
:   Line number at which an error occurred.

The following attributes contain values relating to the current parse location
in an `xmlparser` object. During a callback reporting a parse event they
indicate the location of the first of the sequence of characters that generated
the event. When called outside of a callback, the position indicated will be
just past the last parse event (regardless of whether there was an associated
callback).

xmlparser.CurrentByteIndex
:   Current byte index in the parser input.

xmlparser.CurrentColumnNumber
:   Current column number in the parser input.

xmlparser.CurrentLineNumber
:   Current line number in the parser input.

Here is the list of handlers that can be set. To set a handler on an
`xmlparser` object *o*, use `o.handlername = func`. *handlername* must
be taken from the following list, and *func* must be a callable object accepting
the correct number of arguments. The arguments are all strings, unless
otherwise stated.

xmlparser.XmlDeclHandler(*version*, *encoding*, *standalone*)
:   Called when the XML declaration is parsed. The XML declaration is the
    (optional) declaration of the applicable version of the XML recommendation, the
    encoding of the document text, and an optional “standalone” declaration.
    *version* and *encoding* will be strings, and *standalone* will be `1` if the
    document is declared standalone, `0` if it is declared not to be standalone,
    or `-1` if the standalone clause was omitted.

xmlparser.StartDoctypeDeclHandler(*doctypeName*, *systemId*, *publicId*, *has\_internal\_subset*)
:   Called when Expat begins parsing the document type declaration (`<!DOCTYPE
    ...`). The *doctypeName* is provided exactly as presented. The *systemId* and
    *publicId* parameters give the system and public identifiers if specified, or
    `None` if omitted. *has\_internal\_subset* will be true if the document
    contains an internal document declaration subset.

xmlparser.EndDoctypeDeclHandler()
:   Called when Expat is done parsing the document type declaration.

xmlparser.ElementDeclHandler(*name*, *model*)
:   Called once for each element type declaration. *name* is the name of the
    element type, and *model* is a representation of the content model.

xmlparser.AttlistDeclHandler(*elname*, *attname*, *type*, *default*, *required*)
:   Called for each declared attribute for an element type. If an attribute list
    declaration declares three attributes, this handler is called three times, once
    for each attribute. *elname* is the name of the element to which the
    declaration applies and *attname* is the name of the attribute declared. The
    The attribute type is a string passed as *type*:
    `'CDATA'`, `'ID'`, `'IDREF'`, `'IDREFS'`, `'ENTITY'`,
    `'ENTITIES'`, `'NMTOKEN'` or `'NMTOKENS'`,
    an enumeration like `'(x|y)'`,
    or a notation list like `'NOTATION(n1|n2)'`.
    *default* gives the default value for
    the attribute used when the attribute is not specified by the document instance,
    or `None` if there is no default value (`#IMPLIED` values). If the
    attribute is required to be given in the document instance, *required* will be
    true.

xmlparser.StartElementHandler(*name*, *attributes*)
:   Called for the start of every element. *name* is a string containing the
    element name, and *attributes* is the element attributes. If
    `ordered_attributes` is true, this is a list (see
    `ordered_attributes` for a full description). Otherwise it’s a
    dictionary mapping names to values.

xmlparser.EndElementHandler(*name*)
:   Called for the end of every element.

xmlparser.ProcessingInstructionHandler(*target*, *data*)
:   Called for every processing instruction.

xmlparser.CharacterDataHandler(*data*)
:   Called for character data. This will be called for normal character data, CDATA
    marked content, and ignorable whitespace. Applications which must distinguish
    these cases can use the `StartCdataSectionHandler`,
    `EndCdataSectionHandler`, and `ElementDeclHandler` callbacks to
    collect the required information. Note that the character data may be
    chunked even if it is short and so you may receive more than one call to
    `CharacterDataHandler()`. Set the `buffer_text` instance attribute
    to `True` to avoid that.

xmlparser.UnparsedEntityDeclHandler(*entityName*, *base*, *systemId*, *publicId*, *notationName*)
:   Called for unparsed (NDATA) entity declarations.
    If this handler is not set, such declarations are reported by
    `EntityDeclHandler`, which is preferred for new code.
    (The underlying function in the Expat library has been declared obsolete.)

xmlparser.EntityDeclHandler(*entityName*, *is\_parameter\_entity*, *value*, *base*, *systemId*, *publicId*, *notationName*)
:   Called for all entity declarations. For parameter and internal entities,
    *value* will be a string giving the declared contents of the entity; this will
    be `None` for external entities. The *notationName* parameter will be
    `None` for parsed entities, and the name of the notation for unparsed
    entities. *is\_parameter\_entity* will be true if the entity is a parameter entity
    or false for general entities (most applications only need to be concerned with
    general entities).

xmlparser.NotationDeclHandler(*notationName*, *base*, *systemId*, *publicId*)
:   Called for notation declarations. *notationName*, *base*, and *systemId*, and
    *publicId* are strings if given. If the public identifier is omitted,
    *publicId* will be `None`.

xmlparser.StartNamespaceDeclHandler(*prefix*, *uri*)
:   Called when an element contains a namespace declaration. Namespace declarations
    are processed before the `StartElementHandler` is called for the element
    on which declarations are placed.

xmlparser.EndNamespaceDeclHandler(*prefix*)
:   Called when the closing tag is reached for an element that contained a
    namespace declaration. This is called once for each namespace declaration on
    the element in the reverse of the order for which the
    `StartNamespaceDeclHandler` was called to indicate the start of each
    namespace declaration’s scope. Calls to this handler are made after the
    corresponding `EndElementHandler` for the end of the element.

xmlparser.CommentHandler(*data*)
:   Called for comments. *data* is the text of the comment, excluding the leading
    `'<!-``-'` and trailing `'-``->'`.

xmlparser.StartCdataSectionHandler()
:   Called at the start of a CDATA section. This and `EndCdataSectionHandler`
    are needed to be able to identify the syntactical start and end for CDATA
    sections.

xmlparser.EndCdataSectionHandler()
:   Called at the end of a CDATA section.

xmlparser.DefaultHandler(*data*)
:   Called for any characters in the XML document for which no applicable handler
    has been specified. This means characters that are part of a construct which
    could be reported, but for which no handler has been supplied.

xmlparser.DefaultHandlerExpand(*data*)
:   This is the same as the `DefaultHandler`, but doesn’t inhibit expansion
    of internal entities. The entity reference will not be passed to the default
    handler.

xmlparser.NotStandaloneHandler()
:   Called if the XML document hasn’t been declared as being a standalone document.
    This happens when there is an external subset or a reference to a parameter
    entity, but the XML declaration does not set standalone to `yes` in an XML
    declaration. If this handler returns `0`, then the parser will raise an
    `XML_ERROR_NOT_STANDALONE` error. If this handler is not set, no
    exception is raised by the parser for this condition.

xmlparser.ExternalEntityRefHandler(*context*, *base*, *systemId*, *publicId*)
:   Warning

    Implementing a handler that accesses local files and/or the network
    may create a vulnerability to
    external entity attacks
    if `xmlparser` is used with user-provided XML content.
    Please reflect on your threat model
    before implementing this handler.

    Called for references to external entities. *base* is the current base, as set
    by a previous call to `SetBase()`. The public and system identifiers,
    *systemId* and *publicId*, are strings if given; if the public identifier is not
    given, *publicId* will be `None`. The *context* value is opaque and should
    only be used as described below.

    For external entities to be parsed, this handler must be implemented. It is
    responsible for creating the sub-parser using
    `ExternalEntityParserCreate(context)`, initializing it with the appropriate
    callbacks, and parsing the entity. This handler should return an integer; if it
    returns `0`, the parser will raise an
    `XML_ERROR_EXTERNAL_ENTITY_HANDLING` error, otherwise parsing will
    continue.

    If this handler is not provided, external entities are reported by the
    `DefaultHandler` callback, if provided.

xmlparser.SkippedEntityHandler(*entityName*, *is\_parameter\_entity*)
:   Called for entity references which are not expanded,
    because the parser did not read the declaration of the entity.
    This happens when the external DTD subset or an external parameter entity
    is not parsed.
    *is\_parameter\_entity* is true for a parameter entity
    and false for a general entity.

## ExpatError Exceptions

`ExpatError` exceptions have a number of interesting attributes:

ExpatError.code
:   Expat’s internal error number for the specific error. The
    `errors.messages` dictionary maps
    these error numbers to Expat’s error messages. For example:

    ```
    from xml.parsers.expat import ParserCreate, ExpatError, errors

    p = ParserCreate()
    try:
        p.Parse(some_xml_document)
    except ExpatError as err:
        print("Error:", errors.messages[err.code])
    ```

    The `errors` module also provides error message
    constants and a dictionary `codes` mapping
    these messages back to the error codes, see below.

ExpatError.lineno
:   Line number on which the error was detected. The first line is numbered `1`.

ExpatError.offset
:   Character offset into the line where the error occurred. The first column is
    numbered `0`.

## Example

The following program defines three handlers that just print out their
arguments.

```
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

```
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

## Content Model Descriptions

Content models are described using nested tuples. Each tuple contains four
values: the type, the quantifier, the name, and a tuple of children. Children
are simply additional content model descriptions.

The values of the first two fields are constants defined in the
`xml.parsers.expat.model` module. These constants can be collected in two
groups: the model type group and the quantifier group.

The constants in the model type group are:

xml.parsers.expat.model.XML\_CTYPE\_ANY
:   The element named by the model name was declared to have a content model of
    `ANY`.

xml.parsers.expat.model.XML\_CTYPE\_CHOICE
:   The named element allows a choice from a number of options; this is used for
    content models such as `(A | B | C)`.

xml.parsers.expat.model.XML\_CTYPE\_EMPTY
:   Elements which are declared to be `EMPTY` have this model type.

xml.parsers.expat.model.XML\_CTYPE\_MIXED
:   The named element allows character data, optionally interspersed with
    the named children; this is used for content models such as
    `(#PCDATA)` and `(#PCDATA | A | B)*`.

xml.parsers.expat.model.XML\_CTYPE\_NAME
:   The model names a single element, as for `A`.

xml.parsers.expat.model.XML\_CTYPE\_SEQ
:   Models which represent a series of models which follow one after the other are
    indicated with this model type. This is used for models such as `(A, B, C)`.

The constants in the quantifier group are:

xml.parsers.expat.model.XML\_CQUANT\_NONE
:   No modifier is given, so it can appear exactly once, as for `A`.

xml.parsers.expat.model.XML\_CQUANT\_OPT
:   The model is optional: it can appear once or not at all, as for `A?`.

xml.parsers.expat.model.XML\_CQUANT\_PLUS
:   The model must occur one or more times (like `A+`).

xml.parsers.expat.model.XML\_CQUANT\_REP
:   The model must occur zero or more times, as for `A*`.

## Expat error constants

The following constants are provided in the `xml.parsers.expat.errors`
module. These constants are useful in interpreting some of the attributes of
the `ExpatError` exception objects raised when an error has occurred.
Since for backwards compatibility reasons, the constants’ value is the error
*message* and not the numeric error *code*, you do this by comparing its
`code` attribute with
`errors.codes[errors.XML_ERROR_CONSTANT_NAME]`.

The `errors` module has the following attributes:

xml.parsers.expat.errors.codes
:   A dictionary mapping string descriptions to their error codes.

xml.parsers.expat.errors.messages
:   A dictionary mapping numeric error codes to their string descriptions.

xml.parsers.expat.errors.XML\_ERROR\_ASYNC\_ENTITY

xml.parsers.expat.errors.XML\_ERROR\_ATTRIBUTE\_EXTERNAL\_ENTITY\_REF
:   An entity reference in an attribute value referred to an external entity instead
    of an internal entity.

xml.parsers.expat.errors.XML\_ERROR\_BAD\_CHAR\_REF
:   A character reference referred to a character which is illegal in XML (for
    example, character `0`, or ‘`&#0;`’).

xml.parsers.expat.errors.XML\_ERROR\_BINARY\_ENTITY\_REF
:   An entity reference referred to an entity which was declared with a notation, so
    cannot be parsed.

xml.parsers.expat.errors.XML\_ERROR\_DUPLICATE\_ATTRIBUTE
:   An attribute was used more than once in a start tag.

xml.parsers.expat.errors.XML\_ERROR\_INCORRECT\_ENCODING

xml.parsers.expat.errors.XML\_ERROR\_INVALID\_TOKEN
:   Raised when an input byte could not properly be assigned to a character; for
    example, a NUL byte (value `0`) in a UTF-8 input stream.

xml.parsers.expat.errors.XML\_ERROR\_JUNK\_AFTER\_DOC\_ELEMENT
:   Something other than whitespace occurred after the document element.

xml.parsers.expat.errors.XML\_ERROR\_MISPLACED\_XML\_PI
:   An XML declaration was found somewhere other than the start of the input data.

xml.parsers.expat.errors.XML\_ERROR\_NO\_ELEMENTS
:   The document contains no elements (XML requires all documents to contain exactly
    one top-level element).

xml.parsers.expat.errors.XML\_ERROR\_NO\_MEMORY
:   Expat was not able to allocate memory internally.

xml.parsers.expat.errors.XML\_ERROR\_PARAM\_ENTITY\_REF
:   A parameter entity reference was found where it was not allowed.

xml.parsers.expat.errors.XML\_ERROR\_PARTIAL\_CHAR
:   An incomplete character was found in the input.

xml.parsers.expat.errors.XML\_ERROR\_RECURSIVE\_ENTITY\_REF
:   An entity reference contained another reference to the same entity; possibly via
    a different name, and possibly indirectly.

xml.parsers.expat.errors.XML\_ERROR\_SYNTAX
:   Some unspecified syntax error was encountered.

xml.parsers.expat.errors.XML\_ERROR\_TAG\_MISMATCH
:   An end tag did not match the innermost open start tag.

xml.parsers.expat.errors.XML\_ERROR\_UNCLOSED\_TOKEN
:   Some token (such as a start tag) was not closed before the end of the stream or
    the next token was encountered.

xml.parsers.expat.errors.XML\_ERROR\_UNDEFINED\_ENTITY
:   A reference was made to an entity which was not defined.

xml.parsers.expat.errors.XML\_ERROR\_UNKNOWN\_ENCODING
:   The document encoding is not supported by Expat.

xml.parsers.expat.errors.XML\_ERROR\_UNCLOSED\_CDATA\_SECTION
:   A CDATA marked section was not closed.

xml.parsers.expat.errors.XML\_ERROR\_EXTERNAL\_ENTITY\_HANDLING

xml.parsers.expat.errors.XML\_ERROR\_NOT\_STANDALONE
:   The parser determined that the document was not “standalone” though it declared
    itself to be in the XML declaration, and the `NotStandaloneHandler` was
    set and returned `0`.

xml.parsers.expat.errors.XML\_ERROR\_UNEXPECTED\_STATE

xml.parsers.expat.errors.XML\_ERROR\_ENTITY\_DECLARED\_IN\_PE

xml.parsers.expat.errors.XML\_ERROR\_FEATURE\_REQUIRES\_XML\_DTD
:   An operation was requested that requires DTD support to be compiled in, but
    Expat was configured without DTD support. This should never be reported by a
    standard build of the `xml.parsers.expat` module.

xml.parsers.expat.errors.XML\_ERROR\_CANT\_CHANGE\_FEATURE\_ONCE\_PARSING
:   A behavioral change was requested after parsing started that can only be changed
    before parsing has started. This is (currently) only raised by
    `UseForeignDTD()`.

xml.parsers.expat.errors.XML\_ERROR\_UNBOUND\_PREFIX
:   An undeclared prefix was found when namespace processing was enabled.

xml.parsers.expat.errors.XML\_ERROR\_UNDECLARING\_PREFIX
:   The document attempted to remove the namespace declaration associated with a
    prefix.

xml.parsers.expat.errors.XML\_ERROR\_INCOMPLETE\_PE
:   A parameter entity contained incomplete markup.

xml.parsers.expat.errors.XML\_ERROR\_XML\_DECL
:   There was an error parsing the XML declaration.

xml.parsers.expat.errors.XML\_ERROR\_TEXT\_DECL
:   There was an error parsing a text declaration in an external entity.

xml.parsers.expat.errors.XML\_ERROR\_PUBLICID
:   Characters were found in the public id that are not allowed.

xml.parsers.expat.errors.XML\_ERROR\_SUSPENDED
:   The requested operation was made on a suspended parser, but isn’t allowed. This
    includes attempts to provide additional input or to stop the parser.

xml.parsers.expat.errors.XML\_ERROR\_NOT\_SUSPENDED
:   An attempt to resume the parser was made when the parser had not been suspended.

xml.parsers.expat.errors.XML\_ERROR\_ABORTED
:   This should not be reported to Python applications.

xml.parsers.expat.errors.XML\_ERROR\_FINISHED
:   The requested operation was made on a parser which was finished parsing input,
    but isn’t allowed. This includes attempts to provide additional input or to
    stop the parser.

xml.parsers.expat.errors.XML\_ERROR\_SUSPEND\_PE

xml.parsers.expat.errors.XML\_ERROR\_RESERVED\_PREFIX\_XML
:   An attempt was made to
    undeclare reserved namespace prefix `xml`
    or to bind it to another namespace URI.

xml.parsers.expat.errors.XML\_ERROR\_RESERVED\_PREFIX\_XMLNS
:   An attempt was made to declare or undeclare reserved namespace prefix `xmlns`.

xml.parsers.expat.errors.XML\_ERROR\_RESERVED\_NAMESPACE\_URI
:   An attempt was made to bind the URI of one the reserved namespace
    prefixes `xml` and `xmlns` to another namespace prefix.

xml.parsers.expat.errors.XML\_ERROR\_INVALID\_ARGUMENT
:   This should not be reported to Python applications.

xml.parsers.expat.errors.XML\_ERROR\_NO\_BUFFER
:   This should not be reported to Python applications.

xml.parsers.expat.errors.XML\_ERROR\_AMPLIFICATION\_LIMIT\_BREACH
:   The limit on input amplification factor (from DTD and entities)
    has been breached.

xml.parsers.expat.errors.XML\_ERROR\_NOT\_STARTED
:   The parser was tried to be stopped or suspended before it started.

Footnotes

[1]

The encoding string included in XML output should conform to the
appropriate standards. For example, “UTF-8” is valid, but “UTF8” is
not. See <https://www.w3.org/TR/2006/REC-xml11-20060816/#NT-EncodingDecl>
and <https://www.iana.org/assignments/character-sets/character-sets.xhtml>.
