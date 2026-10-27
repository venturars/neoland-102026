---
page: library/unicodedata.html
title: unicodedata — Unicode Database
area: library
kind: guide
module: unicodedata
---

<!-- anchor: module-unicodedata | type: section -->
# `unicodedata` — Unicode Database

This module provides access to the Unicode Character Database (UCD) which defines character properties for all Unicode characters. The data contained in this database is compiled from the UCD version 17.0.0.

The module uses the same names and symbols as defined by Unicode Standard Annex #44, “Unicode Character Database”.

**See also:**

The Unicode HOWTO for more information about Unicode and how to use this module.

- **Lookup**
- `lookup(name)` | Look up character by name
- `name(chr)` | Return the name assigned to a character
- **Numeric values**
- `decimal(chr)` | Decimal value of a character
- `digit(chr)` | Digit value of a character
- `numeric(chr)` | Numeric value of a character
- **Properties**
- `bidirectional(chr)` | Bidirectional class of a character
- `block(chr)` | Unicode block of a character
- `category(chr)` | General category of a character
- `combining(chr)` | Canonical combining class of a character
- `decomposition(chr)` | Character decomposition mapping
- `east_asian_width(chr)` | East Asian width of a character
- `extended_pictographic(chr)` | Check if a character has the Extended_Pictographic property
- `grapheme_cluster_break(chr)` | Grapheme_Cluster_Break property of a character
- `indic_conjunct_break(chr)` | Indic_Conjunct_Break property of a character
- `isxidcontinue(chr)` | Check if a character is a valid identifier continuation
- `isxidstart(chr)` | Check if a character is a valid identifier start
- `mirrored(chr)` | Mirrored property of a character
- **Normalization**
- `normalize(form, unistr)` | Return the normalized form of a string
- `is_normalized(form, unistr)` | Check if a Unicode string is normalized
- **Text segmentation**
- `iter_graphemes(unistr)` | Iterate over grapheme clusters in a string

<!-- anchor: unicodedata.lookup | type: py function -->
## `unicodedata.lookup(name, /)`

Look up character by name. If a character with the given name is found, return the corresponding character. If not found, `KeyError` is raised. For example:

```python
>>> unicodedata.lookup('LEFT CURLY BRACKET')
'{'
```

The characters returned by this function are the same as those produced by `\N` escape sequence in string literals. For example:

```python
>>> unicodedata.lookup('MIDDLE DOT') == '\N{MIDDLE DOT}'
True
```

Changed in version 3.3: Support for name aliases [1] and named sequences [2] has been added.

<!-- anchor: unicodedata.name | type: py function -->
## `unicodedata.name(chr, default=None, /)`

Returns the name assigned to the character *chr* as a string. If no name is defined, *default* is returned, or, if not given, `ValueError` is raised. For example:

```python
>>> unicodedata.name('½')
'VULGAR FRACTION ONE HALF'
>>> unicodedata.name('\uFFFF', 'fallback')
'fallback'
```

<!-- anchor: unicodedata.decimal | type: py function -->
## `unicodedata.decimal(chr, default=None, /)`

Returns the decimal value assigned to the character *chr* as integer. If no such value is defined, *default* is returned, or, if not given, `ValueError` is raised. For example:

```python
>>> unicodedata.decimal('\N{ARABIC-INDIC DIGIT NINE}')
9
>>> unicodedata.decimal('\N{SUPERSCRIPT NINE}', -1)
-1
```

<!-- anchor: unicodedata.digit | type: py function -->
## `unicodedata.digit(chr, default=None, /)`

Returns the digit value assigned to the character *chr* as integer. If no such value is defined, *default* is returned, or, if not given, `ValueError` is raised:

```python
>>> unicodedata.digit('\N{SUPERSCRIPT NINE}')
9
```

<!-- anchor: unicodedata.numeric | type: py function -->
## `unicodedata.numeric(chr, default=None, /)`

Returns the numeric value assigned to the character *chr* as float. If no such value is defined, *default* is returned, or, if not given, `ValueError` is raised:

```python
>>> unicodedata.numeric('½')
0.5
```

<!-- anchor: unicodedata.category | type: py function -->
## `unicodedata.category(chr, /)`

Returns the general category assigned to the character *chr* as string. General category names consist of two letters. See the General Category Values section of the Unicode Character Database documentation for a list of category codes. For example:

```python
>>> unicodedata.category('A')  # 'L'etter, 'u'ppercase
'Lu'
```

<!-- anchor: unicodedata.bidirectional | type: py function -->
## `unicodedata.bidirectional(chr, /)`

Returns the bidirectional class assigned to the character *chr* as string. If no such value is defined, an empty string is returned. See the Bidirectional Class Values section of the Unicode Character Database documentation for a list of bidirectional codes. For example:

```python
>>> unicodedata.bidirectional('\N{ARABIC-INDIC DIGIT SEVEN}') # 'A'rabic, 'N'umber
'AN'
```

<!-- anchor: unicodedata.combining | type: py function -->
## `unicodedata.combining(chr, /)`

Returns the canonical combining class assigned to the character *chr* as integer. Returns `0` if no combining class is defined. See the Canonical Combining Class Values section of the Unicode Character Database for more information.

<!-- anchor: unicodedata.east_asian_width | type: py function -->
## `unicodedata.east_asian_width(chr, /)`

Returns the east asian width assigned to the character *chr* as string. For a list of widths and or more information, see the Unicode Standard Annex #11.

<!-- anchor: unicodedata.block | type: py function -->
## `unicodedata.block(chr, /)`

Returns the block assigned to the character *chr*. For example:

```python
>>> unicodedata.block('S')
'Basic Latin'
```

Added in version 3.15.

<!-- anchor: unicodedata.mirrored | type: py function -->
## `unicodedata.mirrored(chr, /)`

Returns the mirrored property assigned to the character *chr* as integer. Returns `1` if the character has been identified as a “mirrored” character in bidirectional text, `0` otherwise. For example:

```python
>>> unicodedata.mirrored('>')
1
```

<!-- anchor: unicodedata.isxidstart | type: py function -->
## `unicodedata.isxidstart(chr, /)`

Return `True` if *chr* is a valid identifier start per the Unicode Standard Annex #31, that is, it has the `XID_Start` property. Return `False` otherwise. For example:

```python
>>> unicodedata.isxidstart('S')
True
>>> unicodedata.isxidstart('0')
False
```

Added in version 3.15.

<!-- anchor: unicodedata.isxidcontinue | type: py function -->
## `unicodedata.isxidcontinue(chr, /)`

Return `True` if *chr* is a valid identifier character per the Unicode Standard Annex #31, that is, it has the `XID_Continue` property. Return `False` otherwise. For example:

```python
>>> unicodedata.isxidcontinue('S')
True
>>> unicodedata.isxidcontinue(' ')
False
```

Added in version 3.15.

<!-- anchor: unicodedata.decomposition | type: py function -->
## `unicodedata.decomposition(chr, /)`

Returns the character decomposition mapping assigned to the character *chr* as string. An empty string is returned in case no such mapping is defined. For example:

```python
>>> unicodedata.decomposition('Ã')
'0041 0303'
```

<!-- anchor: unicodedata.grapheme_cluster_break | type: py function -->
## `unicodedata.grapheme_cluster_break(chr, /)`

Returns the Grapheme_Cluster_Break property assigned to the character.

Added in version 3.15.

<!-- anchor: unicodedata.indic_conjunct_break | type: py function -->
## `unicodedata.indic_conjunct_break(chr, /)`

Returns the Indic_Conjunct_Break property assigned to the character.

Added in version 3.15.

<!-- anchor: unicodedata.extended_pictographic | type: py function -->
## `unicodedata.extended_pictographic(chr, /)`

Returns `True` if the character has the Extended_Pictographic property, `False` otherwise.

Added in version 3.15.

<!-- anchor: unicodedata.normalize | type: py function -->
## `unicodedata.normalize(form, unistr, /)`

Return the normal form *form* for the Unicode string *unistr*. Valid values for *form* are ‘NFC’, ‘NFKC’, ‘NFD’, and ‘NFKD’.

The Unicode standard defines various normalization forms of a Unicode string, based on the definition of canonical equivalence and compatibility equivalence. In Unicode, several characters can be expressed in various way. For example, the character U+00C7 (LATIN CAPITAL LETTER C WITH CEDILLA) can also be expressed as the sequence U+0043 (LATIN CAPITAL LETTER C) U+0327 (COMBINING CEDILLA).

For each character, there are two normal forms: normal form C and normal form D. Normal form D (NFD) is also known as canonical decomposition, and translates each character into its decomposed form. Normal form C (NFC) first applies a canonical decomposition, then composes pre-combined characters again.

In addition to these two forms, there are two additional normal forms based on compatibility equivalence. In Unicode, certain characters are supported which normally would be unified with other characters. For example, U+2160 (ROMAN NUMERAL ONE) is really the same thing as U+0049 (LATIN CAPITAL LETTER I). However, it is supported in Unicode for compatibility with existing character sets (for example, gb2312).

The normal form KD (NFKD) will apply the compatibility decomposition, that is, replace all compatibility characters with their equivalents. The normal form KC (NFKC) first applies the compatibility decomposition, followed by the canonical composition.

Even if two unicode strings are normalized and look the same to a human reader, if one has combining characters and the other doesn’t, they may not compare equal.

<!-- anchor: unicodedata.is_normalized | type: py function -->
## `unicodedata.is_normalized(form, unistr, /)`

Return whether the Unicode string *unistr* is in the normal form *form*. Valid values for *form* are ‘NFC’, ‘NFKC’, ‘NFD’, and ‘NFKD’.

Added in version 3.8.

<!-- anchor: unicodedata.iter_graphemes | type: py function -->
## `unicodedata.iter_graphemes(unistr, start=0, end=sys.maxsize, /)`

Returns an iterator to iterate over grapheme clusters. With optional *start*, iteration begins at that position. With optional *end*, iteration stops at that position.

Converting an emitted item to string returns a substring corresponding to the grapheme cluster. Its `start` and `end` attributes denote the start and end of the grapheme cluster.

It uses extended grapheme cluster rules defined by Unicode Standard Annex #29, “Unicode Text Segmentation”.

Added in version 3.15.

In addition, the module exposes the following constants:

<!-- anchor: unicodedata.unidata_version | type: py data -->
## `unicodedata.unidata_version`

The version of the Unicode database used in this module.

<!-- anchor: unicodedata.ucd_3_2_0 | type: py data -->
## `unicodedata.ucd_3_2_0`

This is an object that has most of the methods of the entire module, but uses the Unicode database version 3.2 instead, for applications that require this specific version of the Unicode database (such as IDNA).

**Footnotes**

[1]

https://www.unicode.org/Public/17.0.0/ucd/NameAliases.txt

[2]

https://www.unicode.org/Public/17.0.0/ucd/NamedSequences.txt
