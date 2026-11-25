# Expat C API

The `xml.parsers.expat` module exposes selected Expat functions
through its `expat_CAPI` capsule. This allows extension modules to use the
same Expat library as Python. The interface is declared in `pyexpat.h`,
which must be included after Expat’s `expat.h` header.

PyExpat\_CAPSULE\_NAME
:   The name of the capsule containing the Expat C API:
    `"pyexpat.expat_CAPI"`. Pass this to `PyCapsule_Import()` to obtain
    a pointer to a `PyExpat_CAPI`.

PyExpat\_CAPI\_MAGIC
:   The string identifying the layout of `PyExpat_CAPI`.
    Before using the function pointers in the structure, check that
    its `magic` member compares equal to this string using `strcmp()`
    and its `size` member is at least sizeof(struct PyExpat\_CAPI).

struct PyExpat\_CAPI
:   Table of function pointers exported by `xml.parsers.expat`.
    The capsule owns this structure: treat it as read-only and do not free it.
    Keep a strong reference to the capsule while using the table.

    Check the compatibility fields as described under
    `PyExpat_CAPI_MAGIC` before using the function pointers.

    char \*magic
    :   Interface identifier, set to `PyExpat_CAPI_MAGIC`.

    int size
    :   Size of the structure in bytes, set to `sizeof(struct PyExpat_CAPI)`
        by the `xml.parsers.expat` module that created the capsule.

    int MAJOR\_VERSION

    int MINOR\_VERSION

    int MICRO\_VERSION
    :   Major, minor, and micro version numbers of the Expat library used by
        `xml.parsers.expat`.

    void (\*SetUnknownEncodingHandler)(XML\_Parser parser, XML\_UnknownEncodingHandler handler, void \*encodingHandlerData)
    :   Pointer to XML\_SetUnknownEncodingHandler.
        The handler may set a Python exception on failure. The caller must
        check for a Python exception after parsing.

    int (\*DefaultUnknownEncodingHandler)(void \*encodingHandlerData, const XML\_Char \*name, XML\_Encoding \*info)
    :   Python’s unknown-encoding handler for Expat, used with
        `XML_SetUnknownEncodingHandler`. It uses Python’s codec
        registry to fill *info*.
        The *encodingHandlerData* argument is unused.
        Calling this handler requires an attached thread state.

    Pointers to the corresponding Expat functions, or `NULL` if not
    available in the Expat version used by `xml.parsers.expat`, are
    listed below.

    Member names omit the `XML_` prefix; for example, `SetHashSalt`
    exposes Expat’s `XML_SetHashSalt` function. See the Expat API reference for their behavior
    and the minimum Expat version they appear in.

    const XML\_LChar \*(\*ErrorString)(enum XML\_Error code)

    enum XML\_Error (\*GetErrorCode)(XML\_Parser parser)

    XML\_Size (\*GetErrorColumnNumber)(XML\_Parser parser)

    XML\_Size (\*GetErrorLineNumber)(XML\_Parser parser)

    enum XML\_Status (\*Parse)(XML\_Parser parser, const char \*s, int len, int isFinal)

    XML\_Parser (\*ParserCreate\_MM)(const XML\_Char \*encoding, const XML\_Memory\_Handling\_Suite \*memsuite, const XML\_Char \*namespaceSeparator)

    void (\*ParserFree)(XML\_Parser parser)

    void (\*SetCharacterDataHandler)(XML\_Parser parser, XML\_CharacterDataHandler handler)

    void (\*SetCommentHandler)(XML\_Parser parser, XML\_CommentHandler handler)

    void (\*SetDefaultHandlerExpand)(XML\_Parser parser, XML\_DefaultHandler handler)

    void (\*SetElementHandler)(XML\_Parser parser, XML\_StartElementHandler start, XML\_EndElementHandler end)

    void (\*SetNamespaceDeclHandler)(XML\_Parser parser, XML\_StartNamespaceDeclHandler start, XML\_EndNamespaceDeclHandler end)

    void (\*SetProcessingInstructionHandler)(XML\_Parser parser, XML\_ProcessingInstructionHandler handler)

    void (\*SetUserData)(XML\_Parser parser, void \*userData)

    void (\*SetStartDoctypeDeclHandler)(XML\_Parser parser, XML\_StartDoctypeDeclHandler start)

    enum XML\_Status (\*SetEncoding)(XML\_Parser parser, const XML\_Char \*encoding)

    int (\*SetHashSalt)(XML\_Parser parser, unsigned long hash\_salt)

    XML\_Bool (\*SetReparseDeferralEnabled)(XML\_Parser parser, XML\_Bool enabled)

    XML\_Bool (\*SetAllocTrackerActivationThreshold)(XML\_Parser parser, unsigned long long activationThresholdBytes)

    XML\_Bool (\*SetAllocTrackerMaximumAmplification)(XML\_Parser parser, float maxAmplificationFactor)

    XML\_Bool (\*SetBillionLaughsAttackProtectionActivationThreshold)(XML\_Parser parser, unsigned long long activationThresholdBytes)

    XML\_Bool (\*SetBillionLaughsAttackProtectionMaximumAmplification)(XML\_Parser parser, float maxAmplificationFactor)

    XML\_Bool (\*SetHashSalt16Bytes)(XML\_Parser parser, const uint8\_t entropy[16])
    :   See the Expat API reference.
