---
page: library/token.html
title: token — Constants used with Python parse trees
area: library
kind: guide
module: token
---

<!-- anchor: module-token | type: section -->
# `token` — Constants used with Python parse trees

**Source code:** Lib/token.py

This module provides constants which represent the numeric values of leaf nodes of the parse tree (terminal tokens). Refer to the file `Grammar/Tokens` in the Python distribution for the definitions of the names in the context of the language grammar. The specific numeric values which the names map to may change between Python versions.

The module also provides a mapping from numeric codes to names and some functions. The functions mirror definitions in the Python C header files.

Note that a token’s value may depend on tokenizer options. For example, a `"+"` token may be reported as either `PLUS` or `OP`, or a `"match"` token may be either `NAME` or `SOFT_KEYWORD`.

<!-- anchor: token.tok_name | type: py data -->
## `token.tok_name`

Dictionary mapping the numeric values of the constants defined in this module back to name strings, allowing more human-readable representation of parse trees to be generated.

<!-- anchor: token.ISTERMINAL | type: py function -->
## `token.ISTERMINAL(x)`

Return `True` for terminal token values.

<!-- anchor: token.ISNONTERMINAL | type: py function -->
## `token.ISNONTERMINAL(x)`

Return `True` for non-terminal token values.

<!-- anchor: token.ISEOF | type: py function -->
## `token.ISEOF(x)`

Return `True` if *x* is the marker indicating the end of input.

The token constants are:

<!-- anchor: token.NAME | type: py data -->
## `token.NAME`

Token value that indicates an identifier or keyword.

<!-- anchor: token.NUMBER | type: py data -->
## `token.NUMBER`

Token value that indicates a numeric literal

<!-- anchor: token.STRING | type: py data -->
## `token.STRING`

Token value that indicates a string or byte literal, excluding formatted string literals. The token string is not interpreted: it includes the surrounding quotation marks and the prefix (if given); backslashes are included literally, without processing escape sequences.

<!-- anchor: token.OP | type: py data -->
## `token.OP`

A generic token value that indicates an operator or delimiter.

**CPython implementation detail:** This value is only reported by the `tokenize` module. Internally, the tokenizer uses exact token types instead.

<!-- anchor: token.COMMENT | type: py data -->
## `token.COMMENT`

Token value used to indicate a comment. The parser ignores `COMMENT` tokens.

<!-- anchor: token.NEWLINE | type: py data -->
## `token.NEWLINE`

Token value that indicates the end of a logical line.

<!-- anchor: token.NL | type: py data -->
## `token.NL`

Token value used to indicate a non-terminating newline. `NL` tokens are generated when a logical line of code is continued over multiple physical lines. The parser ignores `NL` tokens.

<!-- anchor: token.INDENT | type: py data -->
## `token.INDENT`

Token value used at the beginning of a logical line to indicate the start of an indented block.

<!-- anchor: token.DEDENT | type: py data -->
## `token.DEDENT`

Token value used at the beginning of a logical line to indicate the end of an indented block.

<!-- anchor: token.FSTRING_START | type: py data -->
## `token.FSTRING_START`

Token value used to indicate the beginning of an f-string literal.

**CPython implementation detail:** The token string includes the prefix and the opening quote(s), but none of the contents of the literal.

<!-- anchor: token.FSTRING_MIDDLE | type: py data -->
## `token.FSTRING_MIDDLE`

Token value used for literal text inside an f-string literal, including format specifications.

**CPython implementation detail:** Replacement fields (that is, the non-literal parts of f-strings) use the same tokens as other expressions, and are delimited by `LBRACE`, `RBRACE`, `EXCLAMATION` and `COLON` tokens.

<!-- anchor: token.FSTRING_END | type: py data -->
## `token.FSTRING_END`

Token value used to indicate the end of a f-string.

**CPython implementation detail:** The token string contains the closing quote(s).

<!-- anchor: token.TSTRING_START | type: py data -->
## `token.TSTRING_START`

Token value used to indicate the beginning of a template string literal.

**CPython implementation detail:** The token string includes the prefix and the opening quote(s), but none of the contents of the literal.

Added in version 3.14.

<!-- anchor: token.TSTRING_MIDDLE | type: py data -->
## `token.TSTRING_MIDDLE`

Token value used for literal text inside a template string literal including format specifications.

**CPython implementation detail:** Replacement fields (that is, the non-literal parts of t-strings) use the same tokens as other expressions, and are delimited by `LBRACE`, `RBRACE`, `EXCLAMATION` and `COLON` tokens.

Added in version 3.14.

<!-- anchor: token.TSTRING_END | type: py data -->
## `token.TSTRING_END`

Token value used to indicate the end of a template string literal.

**CPython implementation detail:** The token string contains the closing quote(s).

Added in version 3.14.

<!-- anchor: token.ENDMARKER | type: py data -->
## `token.ENDMARKER`

Token value that indicates the end of input. Used in top-level grammar rules.

<!-- anchor: token.ENCODING | type: py data -->
## `token.ENCODING`

Token value that indicates the encoding used to decode the source bytes into text. The first token returned by `tokenize.tokenize()` will always be an `ENCODING` token.

**CPython implementation detail:** This token type isn’t used by the C tokenizer but is needed for the `tokenize` module.

The following token types are not produced by the `tokenize` module, and are defined for special uses in the tokenizer or parser:

<!-- anchor: token.TYPE_IGNORE | type: py data -->
## `token.TYPE_IGNORE`

Token value indicating that a `type: ignore` comment was recognized. Such tokens are produced instead of regular `COMMENT` tokens only with the `PyCF_TYPE_COMMENTS` flag.

<!-- anchor: token.TYPE_COMMENT | type: py data -->
## `token.TYPE_COMMENT`

Token value indicating that a type comment was recognized. Such tokens are produced instead of regular `COMMENT` tokens only with the `PyCF_TYPE_COMMENTS` flag.

<!-- anchor: token.SOFT_KEYWORD | type: py data -->
## `token.SOFT_KEYWORD`

Token value indicating a soft keyword.

The tokenizer never produces this value. To check for a soft keyword, pass a `NAME` token’s string to `keyword.issoftkeyword()`.

<!-- anchor: token.ERRORTOKEN | type: py data -->
## `token.ERRORTOKEN`

Token value used to indicate wrong input.

The `tokenize` module generally indicates errors by raising exceptions instead of emitting this token. It can also emit tokens such as `OP` or `NAME` with strings that are later rejected by the parser.

The remaining tokens represent specific operators and delimiters. (The `tokenize` module reports these as `OP`; see `exact_type` in the `tokenize` documentation for details.)

| Token | Value |
| --- | --- |
| `token.LPAR` | `"("` |
| `token.RPAR` | `")"` |
| `token.LSQB` | `"["` |
| `token.RSQB` | `"]"` |
| `token.COLON` | `":"` |
| `token.COMMA` | `","` |
| `token.SEMI` | `";"` |
| `token.PLUS` | `"+"` |
| `token.MINUS` | `"-"` |
| `token.STAR` | `"*"` |
| `token.SLASH` | `"/"` |
| `token.VBAR` | `"\|"` |
| `token.AMPER` | `"&"` |
| `token.LESS` | `"<"` |
| `token.GREATER` | `">"` |
| `token.EQUAL` | `"="` |
| `token.DOT` | `"."` |
| `token.PERCENT` | `"%"` |
| `token.LBRACE` | `"{"` |
| `token.RBRACE` | `"}"` |
| `token.EQEQUAL` | `"=="` |
| `token.NOTEQUAL` | `"!="` |
| `token.LESSEQUAL` | `"<="` |
| `token.GREATEREQUAL` | `">="` |
| `token.TILDE` | `"~"` |
| `token.CIRCUMFLEX` | `"^"` |
| `token.LEFTSHIFT` | `"<<"` |
| `token.RIGHTSHIFT` | `">>"` |
| `token.DOUBLESTAR` | `"**"` |
| `token.PLUSEQUAL` | `"+="` |
| `token.MINEQUAL` | `"-="` |
| `token.STAREQUAL` | `"*="` |
| `token.SLASHEQUAL` | `"/="` |
| `token.PERCENTEQUAL` | `"%="` |
| `token.AMPEREQUAL` | `"&="` |
| `token.VBAREQUAL` | `"\|="` |
| `token.CIRCUMFLEXEQUAL` | `"^="` |
| `token.LEFTSHIFTEQUAL` | `"<<="` |
| `token.RIGHTSHIFTEQUAL` | `">>="` |
| `token.DOUBLESTAREQUAL` | `"**="` |
| `token.DOUBLESLASH` | `"//"` |
| `token.DOUBLESLASHEQUAL` | `"//="` |
| `token.AT` | `"@"` |
| `token.ATEQUAL` | `"@="` |
| `token.RARROW` | `"->"` |
| `token.ELLIPSIS` | `"..."` |
| `token.COLONEQUAL` | `":="` |
| `token.EXCLAMATION` | `"!"` |

The following non-token constants are provided:

<!-- anchor: token.N_TOKENS | type: py data -->
## `token.N_TOKENS`

The number of token types defined in this module.

<!-- anchor: token.EXACT_TOKEN_TYPES | type: py data -->
## `token.EXACT_TOKEN_TYPES`

A dictionary mapping the string representation of a token to its numeric code.

Added in version 3.8.

Changed in version 3.5: Added `AWAIT` and `ASYNC` tokens.

Changed in version 3.7: Added `COMMENT`, `NL` and `ENCODING` tokens.

Changed in version 3.7: Removed `AWAIT` and `ASYNC` tokens. “async” and “await” are now tokenized as `NAME` tokens.

Changed in version 3.8: Added `TYPE_COMMENT`, `TYPE_IGNORE`, `COLONEQUAL`. Added `AWAIT` and `ASYNC` tokens back (they’re needed to support parsing older Python versions for `ast.parse()` with `feature_version` set to 6 or lower).

Changed in version 3.12: Added `EXCLAMATION`.

Changed in version 3.13: Removed `AWAIT` and `ASYNC` tokens again.
