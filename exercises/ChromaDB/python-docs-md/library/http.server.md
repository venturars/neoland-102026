---
page: library/http.server.html
title: http.server — HTTP servers
area: library
kind: guide
module: http.server
---

<!-- anchor: module-http.server | type: section -->
# `http.server` — HTTP servers

**Source code:** Lib/http/server.py

This module defines classes for implementing HTTP servers.

**Warning:**

`http.server` is not recommended for production. It only implements basic security checks.

Availability: not WASI.

This module does not work or is not available on WebAssembly. See WebAssembly platforms for more information.

One class, `HTTPServer`, is a `socketserver.TCPServer` subclass. It creates and listens at the HTTP socket, dispatching the requests to a handler. Code to create and run the server looks like this:

```python
def run(server_class=HTTPServer, handler_class=BaseHTTPRequestHandler):
    server_address = ('', 8000)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()
```

<!-- anchor: http.server.HTTPServer | type: py class -->
## `class http.server.HTTPServer(server_address, RequestHandlerClass)`

This class builds on the `TCPServer` class by storing the server address as instance variables named `server_name` and `server_port`. The server is accessible by the handler, typically through the handler’s `server` instance variable.

<!-- anchor: http.server.HTTPServer.server_name | type: py attribute -->
### `server_name`

The HTTP server’s fully qualified domain name.

<!-- anchor: http.server.HTTPServer.server_port | type: py attribute -->
### `server_port`

The HTTP server’s port number obtained from *server_address*.

<!-- anchor: http.server.ThreadingHTTPServer | type: py class -->
## `class http.server.ThreadingHTTPServer(server_address, RequestHandlerClass)`

This class is identical to HTTPServer but uses threads to handle requests by using the `ThreadingMixIn`. This is useful to handle web browsers pre-opening sockets, on which `HTTPServer` would wait indefinitely.

Added in version 3.7.

<!-- anchor: http.server.HTTPSServer | type: py class -->
## `class http.server.HTTPSServer(server_address, RequestHandlerClass, bind_and_activate=True, *, certfile, keyfile=None, password=None, alpn_protocols=None)`

Subclass of `HTTPServer` with a wrapped socket using the `ssl` module. If the `ssl` module is not available, instantiating a `HTTPSServer` object fails with a `RuntimeError`.

The *certfile* argument is the path to the SSL certificate chain file, and the *keyfile* is the path to the file containing the private key.

A *password* can be specified for files protected and wrapped with PKCS#8, but beware that this could possibly expose hardcoded passwords in clear.

**See also:**

See `ssl.SSLContext.load_cert_chain()` for additional information on the accepted values for *certfile*, *keyfile* and *password*.

When specified, the *alpn_protocols* argument must be a sequence of strings specifying the “Application-Layer Protocol Negotiation” (ALPN) protocols supported by the server. ALPN allows the server and the client to negotiate the application protocol during the TLS handshake.

By default, it is set to `["http/1.1"]`, meaning the server supports HTTP/1.1.

Added in version 3.14.

<!-- anchor: http.server.ThreadingHTTPSServer | type: py class -->
## `class http.server.ThreadingHTTPSServer(server_address, RequestHandlerClass, bind_and_activate=True, *, certfile, keyfile=None, password=None, alpn_protocols=None)`

This class is identical to `HTTPSServer` but uses threads to handle requests by inheriting from `ThreadingMixIn`. This is analogous to `ThreadingHTTPServer` only using `HTTPSServer`.

Added in version 3.14.

The `HTTPServer`, `ThreadingHTTPServer`, `HTTPSServer` and `ThreadingHTTPSServer` must be given a *RequestHandlerClass* on instantiation, of which this module provides three different variants:

<!-- anchor: http.server.BaseHTTPRequestHandler | type: py class -->
## `class http.server.BaseHTTPRequestHandler(request, client_address, server)`

This class is used to handle the HTTP requests that arrive at the server. By itself, it cannot respond to any actual HTTP requests; it must be subclassed to handle each request method (for example, `'GET'` or `'POST'`). `BaseHTTPRequestHandler` provides a number of class and instance variables, and methods for use by subclasses.

The handler will parse the request and the headers, then call a method specific to the request type. The method name is constructed from the request. For example, for the request method `SPAM`, the `do_SPAM()` method will be called with no arguments. All of the relevant information is stored in instance variables of the handler. Subclasses should not need to override or extend the `__init__()` method.

`BaseHTTPRequestHandler` has the following instance variables:

<!-- anchor: http.server.BaseHTTPRequestHandler.client_address | type: py attribute -->
### `client_address`

Contains a tuple of the form `(host, port)` referring to the client’s address.

<!-- anchor: http.server.BaseHTTPRequestHandler.server | type: py attribute -->
### `server`

Contains the server instance.

<!-- anchor: http.server.BaseHTTPRequestHandler.close_connection | type: py attribute -->
### `close_connection`

Boolean that should be set before `handle_one_request()` returns, indicating if another request may be expected, or if the connection should be shut down.

<!-- anchor: http.server.BaseHTTPRequestHandler.requestline | type: py attribute -->
### `requestline`

Contains the string representation of the HTTP request line. The terminating CRLF is stripped. This attribute should be set by `handle_one_request()`. If no valid request line was processed, it should be set to the empty string.

<!-- anchor: http.server.BaseHTTPRequestHandler.command | type: py attribute -->
### `command`

Contains the command (request type). For example, `'GET'`.

<!-- anchor: http.server.BaseHTTPRequestHandler.path | type: py attribute -->
### `path`

Contains the request path. If the query component of the URL is present, then `path` includes the query. Using the terminology of **RFC 3986**, `path` here includes `hier-part` and the `query`.

<!-- anchor: http.server.BaseHTTPRequestHandler.request_version | type: py attribute -->
### `request_version`

Contains the version string from the request. For example, `'HTTP/1.0'`.

<!-- anchor: http.server.BaseHTTPRequestHandler.headers | type: py attribute -->
### `headers`

Holds an instance of the class specified by the `MessageClass` class variable. This instance parses and manages the headers in the HTTP request. The `parse_headers()` function from `http.client` is used to parse the headers and it requires that the HTTP request provide a valid **RFC 5322** style header.

<!-- anchor: http.server.BaseHTTPRequestHandler.rfile | type: py attribute -->
### `rfile`

An `io.BufferedIOBase` input stream, ready to read from the start of the optional input data.

<!-- anchor: http.server.BaseHTTPRequestHandler.wfile | type: py attribute -->
### `wfile`

Contains the output stream for writing a response back to the client. Proper adherence to the HTTP protocol must be used when writing to this stream in order to achieve successful interoperation with HTTP clients.

Changed in version 3.6: This is an `io.BufferedIOBase` stream.

`BaseHTTPRequestHandler` has the following attributes:

<!-- anchor: http.server.BaseHTTPRequestHandler.server_version | type: py attribute -->
### `server_version`

Specifies the server software version. You may want to override this. The format is multiple whitespace-separated strings, where each string is of the form name[/version]. For example, `'BaseHTTP/0.2'`.

<!-- anchor: http.server.BaseHTTPRequestHandler.sys_version | type: py attribute -->
### `sys_version`

Contains the Python system version, in a form usable by the `version_string` method and the `server_version` class variable. For example, `'Python/1.4'`.

<!-- anchor: http.server.BaseHTTPRequestHandler.error_message_format | type: py attribute -->
### `error_message_format`

Specifies a format string that should be used by `send_error()` method for building an error response to the client. The string is filled by default with variables from `responses` based on the status code passed to `send_error()`.

<!-- anchor: http.server.BaseHTTPRequestHandler.error_content_type | type: py attribute -->
### `error_content_type`

Specifies the Content-Type HTTP header of error responses sent to the client. The default value is `'text/html'`.

<!-- anchor: http.server.BaseHTTPRequestHandler.protocol_version | type: py attribute -->
### `protocol_version`

Specifies the HTTP version to which the server is conformant. It is sent in responses to let the client know the server’s communication capabilities for future requests. If set to `'HTTP/1.1'`, the server will permit HTTP persistent connections; however, your server *must* then include an accurate `Content-Length` header (using `send_header()`) in all of its responses to clients. For backwards compatibility, the setting defaults to `'HTTP/1.0'`.

<!-- anchor: http.server.BaseHTTPRequestHandler.MessageClass | type: py attribute -->
### `MessageClass`

Specifies an `email.message.Message`-like class to parse HTTP headers. Typically, this is not overridden, and it defaults to `http.client.HTTPMessage`.

<!-- anchor: http.server.BaseHTTPRequestHandler.responses | type: py attribute -->
### `responses`

This attribute contains a mapping of error code integers to two-element tuples containing a short and long message. For example, `{code: (shortmessage, longmessage)}`. The *shortmessage* is usually used as the *message* key in an error response, and *longmessage* as the *explain* key. It is used by `send_response_only()` and `send_error()` methods.

A `BaseHTTPRequestHandler` instance has the following methods:

<!-- anchor: http.server.BaseHTTPRequestHandler.handle | type: py method -->
### `handle()`

Calls `handle_one_request()` once (or, if persistent connections are enabled, multiple times) to handle incoming HTTP requests. You should never need to override it; instead, implement appropriate `do_*()` methods.

<!-- anchor: http.server.BaseHTTPRequestHandler.handle_one_request | type: py method -->
### `handle_one_request()`

This method will parse and dispatch the request to the appropriate `do_*()` method. You should never need to override it.

<!-- anchor: http.server.BaseHTTPRequestHandler.handle_expect_100 | type: py method -->
### `handle_expect_100()`

When an HTTP/1.1 conformant server receives an `Expect: 100-continue` request header it responds with a `100 Continue` followed by `200 OK` headers. This method can be overridden to raise an error if the server does not want the client to continue. For example, the server can choose to send `417 Expectation Failed` as a response header and `return False`.

Added in version 3.2.

<!-- anchor: http.server.BaseHTTPRequestHandler.send_error | type: py method -->
### `send_error(code, message=None, explain=None)`

Sends and logs a complete error reply to the client. The numeric *code* specifies the HTTP error code, with *message* as an optional, short, human readable description of the error. The *explain* argument can be used to provide more detailed information about the error; it will be formatted using the `error_message_format` attribute and emitted, after a complete set of headers, as the response body. The `responses` attribute holds the default values for *message* and *explain* that will be used if no value is provided; for unknown codes the default value for both is the string `???`. The body will be empty if the method is HEAD or the response code is one of the following: `1xx`, `204 No Content`, `205 Reset Content`, `304 Not Modified`.

Changed in version 3.4: The error response includes a Content-Length header. Added the *explain* argument.

<!-- anchor: http.server.BaseHTTPRequestHandler.send_response | type: py method -->
### `send_response(code, message=None)`

Adds a response header to the headers buffer and logs the accepted request. The HTTP response line is written to the internal buffer, followed by *Server* and *Date* headers. The values for these two headers are picked up from the `version_string()` and `date_time_string()` methods, respectively. If the server does not intend to send any other headers using the `send_header()` method, then `send_response()` should be followed by an `end_headers()` call.

Changed in version 3.3: Headers are stored to an internal buffer and `end_headers()` needs to be called explicitly.

<!-- anchor: http.server.BaseHTTPRequestHandler.send_header | type: py method -->
### `send_header(keyword, value)`

Adds the HTTP header to an internal buffer which will be written to the output stream when either `end_headers()` or `flush_headers()` is invoked. *keyword* should specify the header keyword, with *value* specifying its value. Note that, after the send_header calls are done, `end_headers()` MUST BE called in order to complete the operation.

This method does not reject input containing CRLF sequences.

Changed in version 3.2: Headers are stored in an internal buffer.

<!-- anchor: http.server.BaseHTTPRequestHandler.send_response_only | type: py method -->
### `send_response_only(code, message=None)`

Sends the response header only, used for the purposes when `100 Continue` response is sent by the server to the client. The headers are not buffered and sent directly the output stream. If the *message* is not specified, the HTTP message corresponding the response *code* is sent.

This method does not reject *message* containing CRLF sequences.

Added in version 3.2.

<!-- anchor: http.server.BaseHTTPRequestHandler.end_headers | type: py method -->
### `end_headers()`

Adds a blank line (indicating the end of the HTTP headers in the response) to the headers buffer and calls `flush_headers()`.

Changed in version 3.2: The buffered headers are written to the output stream.

<!-- anchor: http.server.BaseHTTPRequestHandler.flush_headers | type: py method -->
### `flush_headers()`

Finally send the headers to the output stream and flush the internal headers buffer.

Added in version 3.3.

<!-- anchor: http.server.BaseHTTPRequestHandler.log_request | type: py method -->
### `log_request(code='-', size='-')`

Logs an accepted (successful) request. *code* should specify the numeric HTTP code associated with the response. If a size of the response is available, then it should be passed as the *size* parameter.

<!-- anchor: http.server.BaseHTTPRequestHandler.log_error | type: py method -->
### `log_error(...)`

Logs an error when a request cannot be fulfilled. By default, it passes the message to `log_message()`, so it takes the same arguments (*format* and additional values).

<!-- anchor: http.server.BaseHTTPRequestHandler.log_message | type: py method -->
### `log_message(format, ...)`

Logs an arbitrary message to `sys.stderr`. This is typically overridden to create custom error logging mechanisms. The *format* argument is a standard printf-style format string, where the additional arguments to `log_message()` are applied as inputs to the formatting. The client IP address and current date and time are prefixed to every message logged.

<!-- anchor: http.server.BaseHTTPRequestHandler.version_string | type: py method -->
### `version_string()`

Returns the server software’s version string. This is a combination of the `server_version` and `sys_version` attributes.

<!-- anchor: http.server.BaseHTTPRequestHandler.date_time_string | type: py method -->
### `date_time_string(timestamp=None)`

Returns the date and time given by *timestamp* (which must be `None` or in the format returned by `time.time()`), formatted for a message header. If *timestamp* is omitted, it uses the current date and time.

The result looks like `'Sun, 06 Nov 1994 08:49:37 GMT'`.

<!-- anchor: http.server.BaseHTTPRequestHandler.log_date_time_string | type: py method -->
### `log_date_time_string()`

Returns the current date and time, formatted for logging.

<!-- anchor: http.server.BaseHTTPRequestHandler.address_string | type: py method -->
### `address_string()`

Returns the client address.

Changed in version 3.3: Previously, a name lookup was performed. To avoid name resolution delays, it now always returns the IP address.

<!-- anchor: http.server.SimpleHTTPRequestHandler | type: py class -->
## `class http.server.SimpleHTTPRequestHandler(request, client_address, server, *, directory=None, extra_response_headers=None)`

This class serves files from the directory *directory* and below, or the current directory if *directory* is not provided, directly mapping the directory structure to HTTP requests.

Changed in version 3.7: Added the *directory* parameter.

Changed in version 3.9: The *directory* parameter accepts a path-like object.

Changed in version 3.15: Added *extra_response_headers* parameter.

A lot of the work, such as parsing the request, is done by the base class `BaseHTTPRequestHandler`. This class implements the `do_GET()` and `do_HEAD()` functions.

The following are defined as class-level attributes of `SimpleHTTPRequestHandler`:

<!-- anchor: http.server.SimpleHTTPRequestHandler.server_version | type: py attribute -->
### `server_version`

This will be `"SimpleHTTP/" + __version__`, where `__version__` is defined at the module level.

<!-- anchor: http.server.SimpleHTTPRequestHandler.default_content_type | type: py attribute -->
### `default_content_type`

Specifies the Content-Type header value sent when the MIME type cannot be guessed from the file extension of the requested URL. By default, it is set to `'application/octet-stream'`.

Added in version 3.15.

<!-- anchor: http.server.SimpleHTTPRequestHandler.index_pages | type: py attribute -->
### `index_pages`

Specifies the filenames that are treated as directory index pages.

Defaults to `("index.html", "index.htm")`.

Added in version 3.12.

<!-- anchor: http.server.SimpleHTTPRequestHandler.extensions_map | type: py attribute -->
### `extensions_map`

A dictionary mapping suffixes into MIME types, contains custom overrides for the default system mappings. The mapping is used case-insensitively, and so should contain only lower-cased keys.

Changed in version 3.9: This dictionary is no longer filled with the default system mappings, but only contains overrides.

<!-- anchor: http.server.SimpleHTTPRequestHandler.extra_response_headers | type: py attribute -->
### `extra_response_headers`

A sequence of `(name, value)` pairs containing user-defined extra HTTP response headers to add to each successful HTTP status 200 response. These headers are not included in other status code responses.

Headers that the server sends automatically such as `Content-Type` will not be overwritten by `extra_response_headers`.

The `SimpleHTTPRequestHandler` class defines the following methods:

<!-- anchor: http.server.SimpleHTTPRequestHandler.do_HEAD | type: py method -->
### `do_HEAD()`

This method serves the `'HEAD'` request type: it sends the headers it would send for the equivalent `GET` request. See the `do_GET()` method for a more complete explanation of the possible headers.

<!-- anchor: http.server.SimpleHTTPRequestHandler.do_GET | type: py method -->
### `do_GET()`

The request is mapped to a local file by interpreting the request as a path relative to the current working directory.

If the request was mapped to a directory, the directory is checked for an index page as specified by `index_pages`. If found, the file’s contents are returned; otherwise a directory listing is generated by calling the `list_directory()` method. This method uses `os.listdir()` to scan the directory, and returns a `404` error response if the `listdir()` fails.

If the request was mapped to a file, it is opened. Any `OSError` exception in opening the requested file is mapped to a `404`, `'File not found'` error. If there was an `'If-Modified-Since'` header in the request, and the file was not modified after this time, a `304`, `'Not Modified'` response is sent. Otherwise, the content type is guessed by calling the `guess_type()` method, which in turn uses the *extensions_map* variable, and the file contents are returned.

A `'Content-type:'` header with the guessed content type is output, followed by a `'Content-Length:'` header with the file’s size and a `'Last-Modified:'` header with the file’s modification time.

The instance attribute `extra_response_headers` is a sequence of `(name, value)` pairs containing user-defined extra response headers.

Then follows a blank line signifying the end of the headers, and then the contents of the file are output.

For example usage, see the implementation of the `test` function in Lib/http/server.py.

Changed in version 3.7: Support of the `'If-Modified-Since'` header.

<!-- anchor: http.server.SimpleHTTPRequestHandler.list_directory | type: py method -->
### `list_directory(path)`

Helper to list the contents of *path* when no index page is present.

This returns either a file-like object (which must be closed by the caller) or `None` to indicate an error, in which case the caller has nothing further to do. In either case, the headers are sent.

<!-- anchor: http.server.SimpleHTTPRequestHandler.guess_type | type: py method -->
### `guess_type(path)`

Guess the type of the file at the given *path*.

This returns a string of the form `type/subtype`, usable for a MIME Content-type header.

The default implementation looks the file’s extension up in `extensions_map`, falling back to `mimetypes.guess_file_type()` and then to `default_content_type`.

Changed in version 3.13: Add `mimetypes.guess_file_type()` as a fallback.

The `SimpleHTTPRequestHandler` class can be used to create a very basic webserver serving files relative to the current directory as follows:

```python
import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
```

`SimpleHTTPRequestHandler` can also be subclassed to enhance behavior, such as using different index file names by overriding the class attribute `index_pages`.

<!-- anchor: command-line-interface | type: section -->
## Command-line interface

`http.server` can also be invoked directly using the `-m` switch of the interpreter. The following example illustrates how to serve files relative to the current directory:

```bash
python -m http.server [OPTIONS] [port]
```

The following options are accepted:

<!-- anchor: cmdoption-http.server-arg-port | type: std option -->
### `port`

The server listens to port 8000 by default. The default can be overridden by passing the desired port number as an argument:

```bash
python -m http.server 9000
```

<!-- anchor: cmdoption-http.server-b | type: std option -->
### `-b, --bind <address>`

Specifies a specific address to which it should bind. Both IPv4 and IPv6 addresses are supported. By default, the server binds itself to all interfaces. For example, the following command causes the server to bind to localhost only:

```bash
python -m http.server --bind 127.0.0.1
```

Added in version 3.4.

Changed in version 3.8: Support IPv6 in the `--bind` option.

<!-- anchor: cmdoption-http.server-d | type: std option -->
### `-d, --directory <dir>`

Specifies a directory to which it should serve the files. By default, the server uses the current directory. For example, the following command uses a specific directory:

```bash
python -m http.server --directory /tmp/
```

Added in version 3.7.

<!-- anchor: cmdoption-http.server-p | type: std option -->
### `-p, --protocol <version>`

Specifies the HTTP version to which the server is conformant. By default, the server is conformant to HTTP/1.0. For example, the following command runs an HTTP/1.1 conformant server:

```bash
python -m http.server --protocol HTTP/1.1
```

Added in version 3.11.

<!-- anchor: cmdoption-http.server-content-type | type: std option -->
### `--content-type <content_type>`

Specifies the default Content-Type HTTP header used when the MIME type cannot be guessed from the URL’s file extension. By default, the server uses `'application/octet-stream'`:

```bash
python -m http.server --content-type text/html
```

Added in version 3.15.

<!-- anchor: cmdoption-http.server-tls-cert | type: std option -->
### `--tls-cert`

Specifies a TLS certificate chain for HTTPS connections:

```bash
python -m http.server --tls-cert fullchain.pem
```

Added in version 3.14.

<!-- anchor: cmdoption-http.server-tls-key | type: std option -->
### `--tls-key`

Specifies a private key file for HTTPS connections.

This option requires `--tls-cert` to be specified.

Added in version 3.14.

<!-- anchor: cmdoption-http.server-tls-password-file | type: std option -->
### `--tls-password-file`

Specifies the password file for password-protected private keys:

```bash
python -m http.server \
       --tls-cert cert.pem \
       --tls-key key.pem \
       --tls-password-file password.txt
```

This option requires `--tls-cert` to be specified.

Added in version 3.14.

<!-- anchor: cmdoption-http.server-H | type: std option -->
### `-H, --header <header> <value>`

Specify an additional HTTP Response Header to send on successful HTTP 200 responses. Can be used multiple times to send additional custom response headers. Headers that are sent automatically by the server (for instance Content-Type) will not be overwritten by the server.

Added in version 3.15.

<!-- anchor: security-considerations | type: section -->
## Security considerations

`SimpleHTTPRequestHandler` will follow symbolic links when handling requests which makes it possible for files outside of the specified directory to be served.

Methods `BaseHTTPRequestHandler.send_header()` and `BaseHTTPRequestHandler.send_response_only()` assume sanitized input and do not perform input validation such as checking for the presence of CRLF sequences. Untrusted input may result in HTTP header injection attacks.

Earlier versions of Python did not scrub control characters from the log messages emitted to stderr from `python -m http.server` or the default `BaseHTTPRequestHandler` `.log_message` implementation. This could allow remote clients connecting to your server to send nefarious control codes to your terminal.

Changed in version 3.12: Control characters are scrubbed in stderr logs.
