---
page: library/http.cookies.html
title: http.cookies — HTTP state management
area: library
kind: guide
module: http.cookies
---

<!-- anchor: module-http.cookies | type: section -->
# `http.cookies` — HTTP state management

**Source code:** Lib/http/cookies.py

The `http.cookies` module defines classes for abstracting the concept of cookies, an HTTP state management mechanism. It supports both simple string-only cookies, and provides an abstraction for having any serializable data-type as cookie value.

The module formerly strictly applied the parsing rules described in the **RFC 2109** and **RFC 2068** specifications. It has since been discovered that MSIE 3.0x didn’t follow the character rules outlined in those specs; many current-day browsers and servers have also relaxed parsing rules when it comes to cookie handling. As a result, this module now uses parsing rules that are a bit less strict than they once were.

The character set, `string.ascii_letters`, `string.digits` and `!#$%&'*+-.^_`|~:` denote the set of valid characters allowed by this module in a cookie name (as `key`).

Changed in version 3.3: Allowed ‘:’ as a valid cookie name character.

**Note:**

On encountering an invalid cookie, `CookieError` is raised, so if your cookie data comes from a browser you should always prepare for invalid data and catch `CookieError` on parsing.

<!-- anchor: http.cookies.CookieError | type: py exception -->
## `exception http.cookies.CookieError`

Exception failing because of **RFC 2109** invalidity: incorrect attributes, incorrect *Set-Cookie* header, etc.

<!-- anchor: http.cookies.BaseCookie | type: py class -->
## `class http.cookies.BaseCookie([input])`

This class is a dictionary-like object whose keys are strings and whose values are `Morsel` instances. Note that upon setting a key to a value, the value is first converted to a `Morsel` containing the key and the value.

If *input* is given, it is passed to the `load()` method.

<!-- anchor: http.cookies.SimpleCookie | type: py class -->
## `class http.cookies.SimpleCookie([input])`

This class derives from `BaseCookie` and overrides `value_decode()` and `value_encode()`. `SimpleCookie` supports strings as cookie values. When setting the value, `SimpleCookie` calls the builtin `str()` to convert the value to a string. Values received from HTTP are kept as strings.

**See also:**

**Module `http.cookiejar`**

HTTP cookie handling for web *clients*. The `http.cookiejar` and `http.cookies` modules do not depend on each other.

****RFC 2109** - HTTP State Management Mechanism**

This is the state management specification implemented by this module.

<!-- anchor: cookie-objects | type: section -->
## Cookie Objects

<!-- anchor: http.cookies.BaseCookie.value_decode | type: py method -->
### `BaseCookie.value_decode(val)`

Return a tuple `(real_value, coded_value)` from a string representation. `real_value` can be any type. This method does no decoding in `BaseCookie` — it exists so it can be overridden.

<!-- anchor: http.cookies.BaseCookie.value_encode | type: py method -->
### `BaseCookie.value_encode(val)`

Return a tuple `(real_value, coded_value)`. *val* can be any type, but `coded_value` will always be converted to a string. This method does no encoding in `BaseCookie` — it exists so it can be overridden.

In general, it should be the case that `value_encode()` and `value_decode()` are inverses on the range of *value_decode*.

<!-- anchor: http.cookies.BaseCookie.output | type: py method -->
### `BaseCookie.output(attrs=None, header='Set-Cookie:', sep='\r\n')`

Return a string representation suitable to be sent as HTTP headers. *attrs* and *header* are sent to each `Morsel`’s `output()` method. *sep* is used to join the headers together, and is by default the combination `'\r\n'` (CRLF).

<!-- anchor: http.cookies.BaseCookie.js_output | type: py method -->
### `BaseCookie.js_output(attrs=None)`

Return an embeddable JavaScript snippet, which, if run on a browser which supports JavaScript, will act the same as if the HTTP headers was sent.

The meaning for *attrs* is the same as in `output()`.

Deprecated since version 3.15, will be removed in version 3.19: This method generates a JavaScript snippet to set cookies in the browser, which is no longer considered a standard or recommended approach. Use `output()` instead to generate HTTP headers.

<!-- anchor: http.cookies.BaseCookie.load | type: py method -->
### `BaseCookie.load(rawdata)`

If *rawdata* is a string, parse it as an `HTTP_COOKIE` and add the values found there as `Morsel`s. If it is a dictionary, it is equivalent to:

```python
for k, v in rawdata.items():
    cookie[k] = v
```

<!-- anchor: morsel-objects | type: section -->
## Morsel Objects

<!-- anchor: http.cookies.Morsel | type: py class -->
### `class http.cookies.Morsel`

Abstract a key/value pair, which has some **RFC 2109** attributes.

Morsels are dictionary-like objects, whose set of keys is constant — the valid **RFC 2109** attributes, which are:

<!-- anchor: http.cookies.Morsel.expires | type: py attribute -->
#### `expires`

`path`

`comment`

`domain`

`max-age`

`secure`

`version`

`httponly`

`samesite`

`partitioned`

The attribute `httponly` specifies that the cookie is only transferred in HTTP requests, and is not accessible through JavaScript. This is intended to mitigate some forms of cross-site scripting.

The attribute `samesite` controls when the browser sends the cookie with cross-site requests. This helps to mitigate CSRF attacks. Valid values are “Strict” (only sent with same-site requests), “Lax” (sent with same-site requests and top-level navigations), and “None” (sent with same-site and cross-site requests). When using “None”, the “secure” attribute must also be set, as required by modern browsers.

The attribute `partitioned` indicates to user agents that these cross-site cookies *should* only be available in the same top-level context that the cookie was first set in. For this to be accepted by the user agent, you **must** also set `Secure`.

In addition, it is recommended to use the `__Host` prefix when setting partitioned cookies to make them bound to the hostname and not the registrable domain. Read CHIPS (Cookies Having Independent Partitioned State) for full details and examples.

The keys are case-insensitive and their default value is `''`.

Changed in version 3.5: `__eq__()` now takes `key` and `value` into account.

Changed in version 3.7: Attributes `key`, `value` and `coded_value` are read-only. Use `set()` for setting them.

Changed in version 3.8: Added support for the `samesite` attribute.

Changed in version 3.14: Added support for the `partitioned` attribute.

<!-- anchor: http.cookies.Morsel.value | type: py attribute -->
### `Morsel.value`

The value of the cookie.

<!-- anchor: http.cookies.Morsel.coded_value | type: py attribute -->
### `Morsel.coded_value`

The encoded value of the cookie — this is what should be sent.

<!-- anchor: http.cookies.Morsel.key | type: py attribute -->
### `Morsel.key`

The name of the cookie.

<!-- anchor: http.cookies.Morsel.set | type: py method -->
### `Morsel.set(key, value, coded_value)`

Set the *key*, *value* and *coded_value* attributes.

<!-- anchor: http.cookies.Morsel.isReservedKey | type: py method -->
### `Morsel.isReservedKey(K)`

Whether *K* is a member of the set of keys of a `Morsel`.

<!-- anchor: http.cookies.Morsel.output | type: py method -->
### `Morsel.output(attrs=None, header='Set-Cookie:')`

Return a string representation of the Morsel, suitable to be sent as an HTTP header. By default, all the attributes are included, unless *attrs* is given, in which case it should be a list of attributes to use. *header* is by default `"Set-Cookie:"`.

<!-- anchor: http.cookies.Morsel.js_output | type: py method -->
### `Morsel.js_output(attrs=None)`

Return an embeddable JavaScript snippet, which, if run on a browser which supports JavaScript, will act the same as if the HTTP header was sent.

The meaning for *attrs* is the same as in `output()`.

Deprecated since version 3.15, will be removed in version 3.19: This method generates a JavaScript snippet to set cookies in the browser, which is no longer considered a standard or recommended approach. Use `output()` instead to generate HTTP headers.

<!-- anchor: http.cookies.Morsel.OutputString | type: py method -->
### `Morsel.OutputString(attrs=None)`

Return a string representing the Morsel, without any surrounding HTTP or JavaScript.

The meaning for *attrs* is the same as in `output()`.

<!-- anchor: http.cookies.Morsel.update | type: py method -->
### `Morsel.update(values)`

Update the values in the Morsel dictionary with the values in the dictionary *values*. Raise an error if any of the keys in the *values* dict is not a valid **RFC 2109** attribute.

Changed in version 3.5: an error is raised for invalid keys.

<!-- anchor: http.cookies.Morsel.copy | type: py method -->
### `Morsel.copy(value)`

Return a shallow copy of the Morsel object.

Changed in version 3.5: return a Morsel object instead of a dict.

<!-- anchor: http.cookies.Morsel.setdefault | type: py method -->
### `Morsel.setdefault(key, value=None)`

Raise an error if key is not a valid **RFC 2109** attribute, otherwise behave the same as `dict.setdefault()`.

<!-- anchor: example | type: section -->
## Example

The following example demonstrates how to use the `http.cookies` module.

```pycon
>>> from http import cookies
>>> C = cookies.SimpleCookie()
>>> C["fig"] = "newton"
>>> C["sugar"] = "wafer"
>>> print(C) # generate HTTP headers
Set-Cookie: fig=newton
Set-Cookie: sugar=wafer
>>> print(C.output()) # same thing
Set-Cookie: fig=newton
Set-Cookie: sugar=wafer
>>> C = cookies.SimpleCookie()
>>> C["rocky"] = "road"
>>> C["rocky"]["path"] = "/cookie"
>>> print(C.output(header="Cookie:"))
Cookie: rocky=road; Path=/cookie
>>> print(C.output(attrs=[], header="Cookie:"))
Cookie: rocky=road
>>> C = cookies.SimpleCookie()
>>> C.load("chips=ahoy; vienna=finger") # load from a string (HTTP header)
>>> print(C)
Set-Cookie: chips=ahoy
Set-Cookie: vienna=finger
>>> C = cookies.SimpleCookie()
>>> C.load('keebler="E=everybody; L=\\"Loves\\"; fudge=;";')
>>> print(C)
Set-Cookie: keebler="E=everybody; L=\"Loves\"; fudge=;"
>>> C = cookies.SimpleCookie()
>>> C["oreo"] = "doublestuff"
>>> C["oreo"]["path"] = "/"
>>> print(C)
Set-Cookie: oreo=doublestuff; Path=/
>>> C = cookies.SimpleCookie()
>>> C["twix"] = "none for you"
>>> C["twix"].value
'none for you'
>>> C = cookies.SimpleCookie()
>>> C["number"] = 7 # equivalent to C["number"] = str(7)
>>> C["string"] = "seven"
>>> C["number"].value
'7'
>>> C["string"].value
'seven'
>>> print(C)
Set-Cookie: number=7
Set-Cookie: string=seven
```
