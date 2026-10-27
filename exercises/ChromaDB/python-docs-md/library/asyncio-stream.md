---
page: library/asyncio-stream.html
title: Streams
area: library
kind: guide
---

<!-- anchor: streams | type: section -->
# Streams

**Source code:** Lib/asyncio/streams.py

Streams are high-level async/await-ready primitives to work with network connections. Streams allow sending and receiving data without using callbacks or low-level protocols and transports.

Here is an example of a TCP echo client written using asyncio streams:

```python
import asyncio

async def tcp_echo_client(message):
    reader, writer = await asyncio.open_connection(
        '127.0.0.1', 8888)

    print(f'Send: {message!r}')
    writer.write(message.encode())
    await writer.drain()

    data = await reader.read(100)
    print(f'Received: {data.decode()!r}')

    print('Close the connection')
    writer.close()
    await writer.wait_closed()

asyncio.run(tcp_echo_client('Hello World!'))
```

See also the Examples section below.

**Stream Functions**

The following top-level asyncio functions can be used to create and work with streams:

<!-- anchor: asyncio.open_connection | type: py function -->
## `async asyncio.open_connection(host=None, port=None, *, limit=65536, ssl=None, family=0, proto=0, flags=0, sock=None, local_addr=None, server_hostname=None, ssl_handshake_timeout=None, ssl_shutdown_timeout=None, happy_eyeballs_delay=None, interleave=None)`

Establish a network connection and return a pair of `(reader, writer)` objects.

The returned *reader* and *writer* objects are instances of `StreamReader` and `StreamWriter` classes.

*limit* determines the buffer size limit used by the returned `StreamReader` instance. By default the *limit* is set to 64 KiB.

The rest of the arguments are passed directly to `loop.create_connection()`.

**Note:**

The *sock* argument transfers ownership of the socket to the `StreamWriter` created. To close the socket, call its `close()` method.

Changed in version 3.7: Added the *ssl_handshake_timeout* parameter.

Changed in version 3.8: Added the *happy_eyeballs_delay* and *interleave* parameters.

Changed in version 3.10: Removed the *loop* parameter.

Changed in version 3.11: Added the *ssl_shutdown_timeout* parameter.

<!-- anchor: asyncio.start_server | type: py function -->
## `async asyncio.start_server(client_connected_cb, host=None, port=None, *, limit=65536, family=socket.AF_UNSPEC, flags=socket.AI_PASSIVE, sock=None, backlog=100, ssl=None, reuse_address=None, reuse_port=None, keep_alive=None, ssl_handshake_timeout=None, ssl_shutdown_timeout=None, start_serving=True)`

Start a socket server.

The *client_connected_cb* callback is called whenever a new client connection is established. It receives a `(reader, writer)` pair as two arguments, instances of the `StreamReader` and `StreamWriter` classes.

*client_connected_cb* can be a plain callable or a coroutine function; if it is a coroutine function, it will be automatically scheduled as a `Task`.

*limit* determines the buffer size limit used by the returned `StreamReader` instance. By default the *limit* is set to 64 KiB.

The rest of the arguments are passed directly to `loop.create_server()`.

**Note:**

The *sock* argument transfers ownership of the socket to the server created. To close the socket, call the server’s `close()` method.

Changed in version 3.7: Added the *ssl_handshake_timeout* and *start_serving* parameters.

Changed in version 3.10: Removed the *loop* parameter.

Changed in version 3.11: Added the *ssl_shutdown_timeout* parameter.

Changed in version 3.13: Added the *keep_alive* parameter.

**Unix Sockets**

<!-- anchor: asyncio.open_unix_connection | type: py function -->
## `async asyncio.open_unix_connection(path=None, *, limit=65536, ssl=None, sock=None, server_hostname=None, ssl_handshake_timeout=None, ssl_shutdown_timeout=None)`

Establish a Unix socket connection and return a pair of `(reader, writer)`.

Similar to `open_connection()` but operates on Unix sockets.

See also the documentation of `loop.create_unix_connection()`.

**Note:**

The *sock* argument transfers ownership of the socket to the `StreamWriter` created. To close the socket, call its `close()` method.

Availability: Unix.

Changed in version 3.7: Added the *ssl_handshake_timeout* parameter. The *path* parameter can now be a path-like object

Changed in version 3.10: Removed the *loop* parameter.

Changed in version 3.11: Added the *ssl_shutdown_timeout* parameter.

<!-- anchor: asyncio.start_unix_server | type: py function -->
## `async asyncio.start_unix_server(client_connected_cb, path=None, *, limit=65536, sock=None, backlog=100, ssl=None, ssl_handshake_timeout=None, ssl_shutdown_timeout=None, start_serving=True, cleanup_socket=True)`

Start a Unix socket server.

Similar to `start_server()` but works with Unix sockets.

If *cleanup_socket* is true then the Unix socket will automatically be removed from the filesystem when the server is closed, unless the socket has been replaced after the server has been created.

See also the documentation of `loop.create_unix_server()`.

**Note:**

The *sock* argument transfers ownership of the socket to the server created. To close the socket, call the server’s `close()` method.

Availability: Unix.

Changed in version 3.7: Added the *ssl_handshake_timeout* and *start_serving* parameters. The *path* parameter can now be a path-like object.

Changed in version 3.10: Removed the *loop* parameter.

Changed in version 3.11: Added the *ssl_shutdown_timeout* parameter.

Changed in version 3.13: Added the *cleanup_socket* parameter.

<!-- anchor: streamreader | type: section -->
## StreamReader

<!-- anchor: asyncio.StreamReader | type: py class -->
### `class asyncio.StreamReader`

Represents a reader object that provides APIs to read data from the IO stream. As an asynchronous iterable, the object supports the `async for` statement.

It is not recommended to instantiate *StreamReader* objects directly; use `open_connection()` and `start_server()` instead.

<!-- anchor: asyncio.StreamReader.feed_eof | type: py method -->
#### `feed_eof()`

Acknowledge the EOF.

<!-- anchor: asyncio.StreamReader.read | type: py method -->
#### `async read(n=-1)`

Read up to *n* bytes from the stream.

If *n* is not provided or set to `-1`, read until EOF, then return all read `bytes`. If EOF was received and the internal buffer is empty, return an empty `bytes` object.

If *n* is `0`, return an empty `bytes` object immediately.

If *n* is positive, return at most *n* available `bytes` as soon as at least 1 byte is available in the internal buffer. If EOF is received before any byte is read, return an empty `bytes` object.

<!-- anchor: asyncio.StreamReader.readline | type: py method -->
#### `async readline()`

Read one line, where “line” is a sequence of bytes ending with `\n`.

If EOF is received and `\n` was not found, the method returns partially read data.

If EOF is received and the internal buffer is empty, return an empty `bytes` object.

<!-- anchor: asyncio.StreamReader.readexactly | type: py method -->
#### `async readexactly(n)`

Read exactly *n* bytes.

Raise an `IncompleteReadError` if EOF is reached before *n* can be read. Use the `IncompleteReadError.partial` attribute to get the partially read data.

<!-- anchor: asyncio.StreamReader.readuntil | type: py method -->
#### `async readuntil(separator=b'\n')`

Read data from the stream until *separator* is found.

On success, the data and separator will be removed from the internal buffer (consumed). Returned data will include the separator at the end.

If the amount of data read exceeds the configured stream limit, a `LimitOverrunError` exception is raised, and the data is left in the internal buffer and can be read again.

If EOF is reached before the complete separator is found, an `IncompleteReadError` exception is raised, and the internal buffer is reset. The `IncompleteReadError.partial` attribute may contain a portion of the separator.

The *separator* may also be a tuple of separators. In this case the return value will be the shortest possible that has any separator as the suffix. For the purposes of `LimitOverrunError`, the shortest possible separator is considered to be the one that matched.

Added in version 3.5.2.

Changed in version 3.13: The *separator* parameter may now be a `tuple` of separators.

<!-- anchor: asyncio.StreamReader.at_eof | type: py method -->
#### `at_eof()`

Return `True` if the buffer is empty and `feed_eof()` was called.

<!-- anchor: streamwriter | type: section -->
## StreamWriter

<!-- anchor: asyncio.StreamWriter | type: py class -->
### `class asyncio.StreamWriter`

Represents a writer object that provides APIs to write data to the IO stream.

It is not recommended to instantiate *StreamWriter* objects directly; use `open_connection()` and `start_server()` instead.

<!-- anchor: asyncio.StreamWriter.write | type: py method -->
#### `write(data)`

The method attempts to write the *data* to the underlying socket immediately. If that fails, the data is queued in an internal write buffer until it can be sent.

The *data* buffer should be a bytes, bytearray, or C-contiguous one-dimensional memoryview object.

The method should be used along with the `drain()` method:

```python
stream.write(data)
await stream.drain()
```

<!-- anchor: asyncio.StreamWriter.writelines | type: py method -->
#### `writelines(data)`

The method writes a list (or any iterable) of bytes to the underlying socket immediately. If that fails, the data is queued in an internal write buffer until it can be sent.

The method should be used along with the `drain()` method:

```python
stream.writelines(lines)
await stream.drain()
```

<!-- anchor: asyncio.StreamWriter.close | type: py method -->
#### `close()`

The method closes the stream and the underlying socket.

The method should be used, though not mandatory, along with the `wait_closed()` method:

```python
stream.close()
await stream.wait_closed()
```

<!-- anchor: asyncio.StreamWriter.can_write_eof | type: py method -->
#### `can_write_eof()`

Return `True` if the underlying transport supports the `write_eof()` method, `False` otherwise.

<!-- anchor: asyncio.StreamWriter.write_eof | type: py method -->
#### `write_eof()`

Close the write end of the stream after the buffered write data is flushed.

<!-- anchor: asyncio.StreamWriter.transport | type: py attribute -->
#### `transport`

Return the underlying asyncio transport.

<!-- anchor: asyncio.StreamWriter.get_extra_info | type: py method -->
#### `get_extra_info(name, default=None)`

Access optional transport information; see `BaseTransport.get_extra_info()` for details.

<!-- anchor: asyncio.StreamWriter.drain | type: py method -->
#### `async drain()`

Wait until it is appropriate to resume writing to the stream. Example:

```python
writer.write(data)
await writer.drain()
```

This is a flow control method that interacts with the underlying IO write buffer. When the size of the buffer reaches the high watermark, *drain()* blocks until the size of the buffer is drained down to the low watermark and writing can be resumed. When there is nothing to wait for, the `drain()` returns immediately.

**Note:**

When the write buffer is below the high watermark, `drain()` returns immediately without yielding to the event loop. As a result, code which repeatedly calls `write()` followed by `await drain()` may prevent other tasks from running. To prevent blocking behavior, yield to the event loop explicitly with `await asyncio.sleep(0)` (see `asyncio.sleep()`).

<!-- anchor: asyncio.StreamWriter.start_tls | type: py method -->
#### `async start_tls(sslcontext, *, server_hostname=None, ssl_handshake_timeout=None, ssl_shutdown_timeout=None)`

Upgrade an existing stream-based connection to TLS.

Parameters:

- *sslcontext*: a configured instance of `SSLContext`.

- *server_hostname*: sets or overrides the host name that the target server’s certificate will be matched against.

- *ssl_handshake_timeout* is the time in seconds to wait for the TLS handshake to complete before aborting the connection. `60.0` seconds if `None` (default).

- *ssl_shutdown_timeout* is the time in seconds to wait for the SSL shutdown to complete before aborting the connection. `30.0` seconds if `None` (default).

Added in version 3.11.

Changed in version 3.12: Added the *ssl_shutdown_timeout* parameter.

Changed in version 3.15: Raises a `ValueError` if `sslcontext.check_hostname` is `True` and `server_hostname` is not supplied.

<!-- anchor: asyncio.StreamWriter.is_closing | type: py method -->
#### `is_closing()`

Return `True` if the stream is closed or in the process of being closed.

Added in version 3.7.

<!-- anchor: asyncio.StreamWriter.wait_closed | type: py method -->
#### `async wait_closed()`

Wait until the stream is closed.

Should be called after `close()` to wait until the underlying connection is closed, ensuring that all data has been flushed before e.g. exiting the program.

Added in version 3.7.

<!-- anchor: examples | type: section -->
## Examples

<!-- anchor: tcp-echo-client-using-streams | type: section -->
### TCP echo client using streams

TCP echo client using the `asyncio.open_connection()` function:

```python
import asyncio

async def tcp_echo_client(message):
    reader, writer = await asyncio.open_connection(
        '127.0.0.1', 8888)

    print(f'Send: {message!r}')
    writer.write(message.encode())
    await writer.drain()

    data = await reader.read(100)
    print(f'Received: {data.decode()!r}')

    print('Close the connection')
    writer.close()
    await writer.wait_closed()

asyncio.run(tcp_echo_client('Hello World!'))
```

**See also:**

The TCP echo client protocol example uses the low-level `loop.create_connection()` method.

<!-- anchor: tcp-echo-server-using-streams | type: section -->
### TCP echo server using streams

TCP echo server using the `asyncio.start_server()` function:

```python
import asyncio

async def handle_echo(reader, writer):
    data = await reader.read(100)
    message = data.decode()
    addr = writer.get_extra_info('peername')

    print(f"Received {message!r} from {addr!r}")

    print(f"Send: {message!r}")
    writer.write(data)
    await writer.drain()

    print("Close the connection")
    writer.close()
    await writer.wait_closed()

async def main():
    server = await asyncio.start_server(
        handle_echo, '127.0.0.1', 8888)

    addrs = ', '.join(str(sock.getsockname()) for sock in server.sockets)
    print(f'Serving on {addrs}')

    async with server:
        await server.serve_forever()

asyncio.run(main())
```

**See also:**

The TCP echo server protocol example uses the `loop.create_server()` method.

<!-- anchor: get-http-headers | type: section -->
### Get HTTP headers

Simple example querying HTTP headers of the URL passed on the command line:

```python
import asyncio
import urllib.parse
import sys

async def print_http_headers(url):
    url = urllib.parse.urlsplit(url)
    if url.scheme == 'https':
        reader, writer = await asyncio.open_connection(
            url.hostname, 443, ssl=True)
    else:
        reader, writer = await asyncio.open_connection(
            url.hostname, 80)

    query = (
        f"HEAD {url.path or '/'} HTTP/1.0\r\n"
        f"Host: {url.hostname}\r\n"
        f"\r\n"
    )

    writer.write(query.encode('latin-1'))
    while True:
        line = await reader.readline()
        if not line:
            break

        line = line.decode('latin1').rstrip()
        if line:
            print(f'HTTP header> {line}')

    # Ignore the body, close the socket
    writer.close()
    await writer.wait_closed()

url = sys.argv[1]
asyncio.run(print_http_headers(url))
```

Usage:

```python
python example.py http://example.com/path/page.html
```

or with HTTPS:

```python
python example.py https://example.com/path/page.html
```

<!-- anchor: register-an-open-socket-to-wait-for-data-using-streams | type: section -->
### Register an open socket to wait for data using streams

Coroutine waiting until a socket receives data using the `open_connection()` function:

```python
import asyncio
import socket

async def wait_for_data():
    # Get a reference to the current event loop because
    # we want to access low-level APIs.
    loop = asyncio.get_running_loop()

    # Create a pair of connected sockets.
    rsock, wsock = socket.socketpair()

    # Register the open socket to wait for data.
    reader, writer = await asyncio.open_connection(sock=rsock)

    # Simulate the reception of data from the network
    loop.call_soon(wsock.send, 'abc'.encode())

    # Wait for data
    data = await reader.read(100)

    # Got data, we are done: close the socket
    print("Received:", data.decode())
    writer.close()
    await writer.wait_closed()

    # Close the second socket
    wsock.close()

asyncio.run(wait_for_data())
```

**See also:**

The register an open socket to wait for data using a protocol example uses a low-level protocol and the `loop.create_connection()` method.

The watch a file descriptor for read events example uses the low-level `loop.add_reader()` method to watch a file descriptor.
