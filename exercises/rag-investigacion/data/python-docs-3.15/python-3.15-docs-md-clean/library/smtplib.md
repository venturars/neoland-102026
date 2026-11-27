# `smtplib` — SMTP protocol client

The `smtplib` module defines an SMTP client session object that can be used
to send mail to any internet machine with an SMTP or ESMTP listener daemon. For
details of SMTP and ESMTP operation, consult **RFC 821** (Simple Mail Transfer
Protocol) and **RFC 1869** (SMTP Service Extensions).

This module does not work or is not available on WebAssembly. See

class smtplib.SMTP(*host=''*, *port=0*, *local\_hostname=None*, [*timeout*, ]*source\_address=None*)
:   An `SMTP` instance encapsulates an SMTP connection. It has methods
    that support a full repertoire of SMTP and ESMTP operations.

    If the host parameter is set to a true value, `SMTP.connect()` is called with
    host and port automatically when the object is created; otherwise, `connect()` must
    be called manually.

    If specified, *local\_hostname* is used as the FQDN of the local host in the HELO/EHLO
    command. Otherwise, the local hostname is found using
    `socket.getfqdn()`. If the `connect()` call returns anything other
    than a success code, an `SMTPConnectError` is raised. The optional
    *timeout* parameter specifies a timeout in seconds for blocking operations
    like the connection attempt (if not specified, the global default timeout
    setting will be used). If the timeout expires, `TimeoutError` is
    raised. The optional *source\_address* parameter allows binding
    to some specific source address in a machine with multiple network
    interfaces, and/or to some specific source TCP port. It takes a 2-tuple
    `(host, port)`, for the socket to bind to as its source address before
    connecting. If omitted (or if *host* or *port* are `''` and/or `0`
    respectively) the OS default behavior will be used.

    For normal use, you should only require the initialization/connect,
    `sendmail()`, and `SMTP.quit()` methods.
    An example is included below.

    The `SMTP` class supports the `with` statement. When used
    like this, the SMTP `QUIT` command is issued automatically when the
    `with` statement exits. E.g.:

    ```
    >>> from smtplib import SMTP
    >>> with SMTP("domain.org") as smtp:
    ...     smtp.noop()
    ...
    (250, b'Ok')
    >>>
    ```

    All commands will raise an auditing event
    `smtplib.SMTP.send` with arguments `self` and `data`,
    where `data` is the bytes about to be sent to the remote host.

    default\_port
    :   The default port used for SMTP connections (25).

class smtplib.SMTP\_SSL(*host=''*, *port=0*, *local\_hostname=None*, *\**, [*timeout*, ]*context=None*, *source\_address=None*)
:   An `SMTP_SSL` instance behaves exactly the same as instances of
    `SMTP`. `SMTP_SSL` should be used for situations where SSL is
    required from the beginning of the connection and using `SMTP.starttls()` is
    not appropriate.

    If the host parameter is set to a true value, `SMTP.connect()` is called with host
    and port automatically when the object is created; otherwise, `SMTP.connect()` must
    be called manually.

    The optional arguments *local\_hostname*, *timeout* and *source\_address* have the same
    meaning as they do in the `SMTP` class. *context*, also optional,
    can contain a `SSLContext` and allows configuring various
    aspects of the secure connection. Please read Security considerations for
    best practices.

    default\_port
    :   The default port used for SMTP-over-SSL connections (465).

    Changed in version 3.12: The deprecated *keyfile* and *certfile* parameters have been removed.

class smtplib.LMTP(*host=''*, *port=LMTP\_PORT*, *local\_hostname=None*, *source\_address=None*[, *timeout*])
:   The LMTP protocol, which is very similar to ESMTP, is heavily based on the
    standard SMTP client. It’s common to use Unix sockets for LMTP, so our
    `connect()` method must support that as well as a regular host:port
    server. The optional arguments *local\_hostname* and *source\_address* have the
    same meaning as they do in the `SMTP` class. To specify a Unix
    socket, you must use an absolute path for *host*, starting with a ‘/’.

    Authentication is supported, using the regular SMTP mechanism. When using a
    Unix socket, LMTP generally don’t support or require any authentication, but
    your mileage might vary.

A nice selection of exceptions is defined as well:

exception smtplib.SMTPException
:   Subclass of `OSError` that is the base exception class for all
    the other exceptions provided by this module.

exception smtplib.SMTPServerDisconnected
:   This exception is raised when the server unexpectedly disconnects, or when an
    attempt is made to use the `SMTP` instance before connecting it to a
    server.

exception smtplib.SMTPResponseException
:   Base class for all exceptions that include an SMTP error code. These exceptions
    are generated in some instances when the SMTP server returns an error code.

    smtp\_code
    :   The error code.

    smtp\_error
    :   The error message.

exception smtplib.SMTPSenderRefused
:   Sender address refused. In addition to the attributes set by on all
    `SMTPResponseException` exceptions, this sets ‘sender’ to the string that
    the SMTP server refused.

exception smtplib.SMTPRecipientsRefused
:   All recipient addresses refused.

    recipients
    :   A dictionary of exactly the same sort as returned
        by `SMTP.sendmail()` containing the errors for
        each recipient.

exception smtplib.SMTPDataError
:   The SMTP server refused to accept the message data.

exception smtplib.SMTPConnectError
:   Error occurred during establishment of a connection with the server.

exception smtplib.SMTPHeloError
:   The server refused our `HELO` message.

exception smtplib.SMTPNotSupportedError
:   The command or option attempted is not supported by the server.

exception smtplib.SMTPAuthenticationError
:   SMTP authentication went wrong. Most probably the server didn’t accept the
    username/password combination provided.

See also

**RFC 821** - Simple Mail Transfer Protocol
:   Protocol definition for SMTP. This document covers the model, operating
    procedure, and protocol details for SMTP.

**RFC 1869** - SMTP Service Extensions
:   Definition of the ESMTP extensions for SMTP. This describes a framework for
    extending SMTP with new commands, supporting dynamic discovery of the commands
    provided by the server, and defines a few additional commands.

## SMTP Objects

An `SMTP` instance has the following methods:

SMTP.set\_debuglevel(*level*)
:   Set the debug output level. A value of 1 or `True` for *level* results in
    debug messages for connection and for all messages sent to and received from
    the server. A value of 2 for *level* results in these messages being
    timestamped.

SMTP.docmd(*cmd*, *args=''*)
:   Send a command *cmd* to the server. The optional argument *args* is simply
    concatenated to the command, separated by a space.

    This returns a 2-tuple composed of a numeric response code and the actual
    response line (multiline responses are joined into one long line.)

    In normal operation it should not be necessary to call this method explicitly.
    It is used to implement other methods and may be useful for testing private
    extensions.

    If the connection to the server is lost while waiting for the reply,
    `SMTPServerDisconnected` will be raised.

SMTP.connect(*host='localhost'*, *port=0*)
:   Connect to a host on a given port. The defaults are to connect to the local
    host at the standard SMTP port (25). If the hostname ends with a colon (`':'`)
    followed by a number, that suffix will be stripped off and the number
    interpreted as the port number to use. This method is automatically invoked by
    the constructor if a host is specified during instantiation. Returns a
    2-tuple of the response code and message sent by the server in its
    connection response.

    If port is not changed from its default value of 0, the value of the `default_port`
    attribute is used.

    Raises an auditing event `smtplib.connect` with arguments `self`, `host`, `port`.

SMTP.helo(*name=''*)
:   Identify yourself to the SMTP server using `HELO`. The hostname argument
    defaults to the fully qualified domain name of the local host.
    The message returned by the server is stored as the `helo_resp` attribute
    of the object.

    In normal operation it should not be necessary to call this method explicitly.
    It will be implicitly called by the `sendmail()` when necessary.

SMTP.ehlo(*name=''*)
:   Identify yourself to an ESMTP server using `EHLO`. The hostname argument
    defaults to the fully qualified domain name of the local host. Examine the
    response for ESMTP option and store them for use by `has_extn()`.
    Also sets several informational attributes: the message returned by
    the server is stored as the `ehlo_resp` attribute, `does_esmtp`
    is set to `True` or `False` depending on whether the server supports
    ESMTP, and `esmtp_features` will be a dictionary containing the names
    of the SMTP service extensions this server supports, and their parameters
    (if any).

    Unless you wish to use `has_extn()` before sending mail, it should not be
    necessary to call this method explicitly. It will be implicitly called by
    `sendmail()` when necessary.

SMTP.ehlo\_or\_helo\_if\_needed()
:   This method calls `ehlo()` and/or `helo()` if there has been no
    previous `EHLO` or `HELO` command this session. It tries ESMTP `EHLO`
    first.

    `SMTPHeloError`
    :   The server didn’t reply properly to the `HELO` greeting.

SMTP.has\_extn(*name*)
:   Return `True` if *name* is in the set of SMTP service extensions returned
    by the server, `False` otherwise. Case is ignored.

SMTP.verify(*address*)
:   Check the validity of an address on this server using SMTP `VRFY`. Returns a
    tuple consisting of code 250 and a full **RFC 822** address (including human
    name) if the user address is valid. Otherwise returns an SMTP error code of 400
    or greater and an error string.

    Note

    Many sites disable SMTP `VRFY` in order to foil spammers.

SMTP.login(*user*, *password*, *\**, *initial\_response\_ok=True*)
:   Log in on an SMTP server that requires authentication. The arguments are the
    username and the password to authenticate with. If there has been no previous
    `EHLO` or `HELO` command this session, this method tries ESMTP `EHLO`
    first. This method will return normally if the authentication was successful, or
    may raise the following exceptions:

    `SMTPHeloError`
    :   The server didn’t reply properly to the `HELO` greeting.

    `SMTPAuthenticationError`
    :   The server didn’t accept the username/password combination.

    `SMTPNotSupportedError`
    :   The `AUTH` command is not supported by the server.

    `SMTPException`
    :   No suitable authentication method was found.

    Each of the authentication methods supported by `smtplib` are tried in
    turn if they are advertised as supported by the server. See `auth()`
    for a list of supported authentication methods. *initial\_response\_ok* is
    passed through to `auth()`.

    Optional keyword argument *initial\_response\_ok* specifies whether, for
    authentication methods that support it, an “initial response” as specified
    in **RFC 4954** can be sent along with the `AUTH` command, rather than
    requiring a challenge/response.

SMTP.auth(*mechanism*, *authobject*, *\**, *initial\_response\_ok=True*)
:   Issue an `SMTP` `AUTH` command for the specified authentication
    *mechanism*, and handle the challenge response via *authobject*.

    *mechanism* specifies which authentication mechanism is to
    be used as argument to the `AUTH` command; the valid values are
    those listed in the `auth` element of `esmtp_features`.

    *authobject* must be a callable object taking an optional single argument:

    ```
    data = authobject(challenge=None)
    ```

    If optional keyword argument *initial\_response\_ok* is true,
    `authobject()` will be called first with no argument. It can return the
    **RFC 4954** “initial response” ASCII `str` which will be encoded and sent with
    the `AUTH` command as below. If the `authobject()` does not support an
    initial response (e.g. because it requires a challenge), it should return
    `None` when called with `challenge=None`. If *initial\_response\_ok* is
    false, then `authobject()` will not be called first with `None`.

    If the initial response check returns `None`, or if *initial\_response\_ok* is
    false, `authobject()` will be called to process the server’s challenge
    response; the *challenge* argument it is passed will be a `bytes`. It
    should return ASCII `str` *data* that will be base64 encoded and sent to the
    server.

    The `SMTP` class provides `authobjects` for the `CRAM-MD5`, `PLAIN`,
    and `LOGIN` mechanisms; they are named `SMTP.auth_cram_md5`,
    `SMTP.auth_plain`, and `SMTP.auth_login` respectively. They all require
    that the `user` and `password` properties of the `SMTP` instance are
    set to appropriate values.

    User code does not normally need to call `auth` directly, but can instead
    call the `login()` method, which will try each of the above mechanisms
    in turn, in the order listed. `auth` is exposed to facilitate the
    implementation of authentication methods not (or not yet) supported
    directly by `smtplib`.

SMTP.starttls(*\**, *context=None*)
:   Put the SMTP connection in TLS (Transport Layer Security) mode. All SMTP
    commands that follow will be encrypted. You should then call `ehlo()`
    again.

    If *keyfile* and *certfile* are provided, they are used to create an
    `ssl.SSLContext`.

    Optional *context* parameter is an `ssl.SSLContext` object; This is
    an alternative to using a keyfile and a certfile and if specified both
    *keyfile* and *certfile* should be `None`.

    If there has been no previous `EHLO` or `HELO` command this session,
    this method tries ESMTP `EHLO` first.

    Changed in version 3.12: The deprecated *keyfile* and *certfile* parameters have been removed.

    `SMTPHeloError`
    :   The server didn’t reply properly to the `HELO` greeting.

    `SMTPNotSupportedError`
    :   The server does not support the STARTTLS extension.

    `RuntimeError`
    :   SSL/TLS support is not available to your Python interpreter.

SMTP.sendmail(*from\_addr*, *to\_addrs*, *msg*, *mail\_options=()*, *rcpt\_options=()*)
:   Send mail. The required arguments are an **RFC 822** from-address string, a list
    of **RFC 822** to-address strings (a bare string will be treated as a list with 1
    address), and a message string. The caller may pass a list of ESMTP options
    (such as `"8bitmime"`) to be used in `MAIL FROM` commands as *mail\_options*.
    ESMTP options (such as `DSN` commands) that should be used with all `RCPT`
    commands can be passed as *rcpt\_options*. Each option should be passed as a string
    containing the full text of the option, including any potential key
    (for instance, `"NOTIFY=SUCCESS,FAILURE"`). (If you need to use different ESMTP
    options to different recipients you have to use the low-level methods such as
    `mail()`, `rcpt()` and `data()` to send the message.)

    Note

    The *from\_addr* and *to\_addrs* parameters are used to construct the message
    envelope used by the transport agents. `sendmail` does not modify the
    message headers in any way.

    *msg* may be a string containing characters in the ASCII range, or a byte
    string. A string is encoded to bytes using the ascii codec, and lone `\r`
    and `\n` characters are converted to `\r\n` characters. A byte string is
    not modified.

    If there has been no previous `EHLO` or `HELO` command this session, this
    method tries ESMTP `EHLO` first. If the server does ESMTP, message size and
    each of the specified options will be passed to it (if the option is in the
    feature set the server advertises). If `EHLO` fails, `HELO` will be tried
    and ESMTP options suppressed.

    This method will return normally if the mail is accepted for at least one
    recipient. Otherwise it will raise an exception. That is, if this method does
    not raise an exception, then someone should get your mail. If this method does
    not raise an exception, it returns a dictionary, with one entry for each
    recipient that was refused. Each entry contains a tuple of the SMTP error code
    and the accompanying error message sent by the server.

    If `SMTPUTF8` is included in *mail\_options*, and the server supports it,
    *from\_addr* and *to\_addrs* may contain non-ASCII characters.

    This method may raise the following exceptions:

    `SMTPRecipientsRefused`
    :   All recipients were refused. Nobody got the mail.

    `SMTPHeloError`
    :   The server didn’t reply properly to the `HELO` greeting.

    `SMTPSenderRefused`
    :   The server didn’t accept the *from\_addr*.

    `SMTPDataError`
    :   The server replied with an unexpected error code (other than a refusal of a
        recipient).

    `SMTPNotSupportedError`
    :   `SMTPUTF8` was given in the *mail\_options* but is not supported by the
        server.

    Unless otherwise noted, the connection will be open even after an exception is
    raised.

SMTP.send\_message(*msg*, *from\_addr=None*, *to\_addrs=None*, *mail\_options=()*, *rcpt\_options=()*)
:   This is a convenience method for calling `sendmail()` with the message
    represented by an `email.message.Message` object. The arguments have
    the same meaning as for `sendmail()`, except that *msg* is a `Message`
    object.

    If *from\_addr* is `None` or *to\_addrs* is `None`, `send_message` fills
    those arguments with addresses extracted from the headers of *msg* as
    specified in **RFC 5322**: *from\_addr* is set to the *Sender*
    field if it is present, and otherwise to the *From* field.
    *to\_addrs* combines the values (if any) of the *To*,
    *Cc*, and *Bcc* fields from *msg*. If exactly one
    set of *Resent-\** headers appear in the message, the regular
    headers are ignored and the *Resent-\** headers are used instead.
    If the message contains more than one set of *Resent-\** headers,
    a `ValueError` is raised, since there is no way to unambiguously detect
    the most recent set of *Resent-* headers.

    `send_message` serializes *msg* using
    `BytesGenerator` with `\r\n` as the *linesep*, and
    calls `sendmail()` to transmit the resulting message. Regardless of the
    values of *from\_addr* and *to\_addrs*, `send_message` does not transmit any
    *Bcc* or *Resent-Bcc* headers that may appear
    in *msg*. If any of the addresses in *from\_addr* and *to\_addrs* contain
    non-ASCII characters and the server does not advertise `SMTPUTF8` support,
    an `SMTPNotSupportedError` is raised. Otherwise the `Message` is
    serialized with a clone of its `policy` with the
    `utf8` attribute set to `True`, and
    `SMTPUTF8` and `BODY=8BITMIME` are added to *mail\_options*.

SMTP.quit()
:   Terminate the SMTP session and close the connection. Return the result of
    the SMTP `QUIT` command.

Low-level methods corresponding to the standard SMTP/ESMTP commands `HELP`,
`RSET`, `NOOP`, `MAIL`, `RCPT`, and `DATA` are also supported.
Normally these do not need to be called directly, so they are not documented
here. For details, consult the module code.

Additionally, an SMTP instance has the following attributes:

SMTP.helo\_resp
:   The response to the `HELO` command, see `helo()`.

SMTP.ehlo\_resp
:   The response to the `EHLO` command, see `ehlo()`.

SMTP.does\_esmtp
:   A boolean value indicating whether the server supports ESMTP, see
    `ehlo()`.

SMTP.esmtp\_features
:   A dictionary of the names of SMTP service extensions supported by the server,
    see `ehlo()`.

## SMTP Example

This example prompts the user for addresses needed in the message envelope (‘To’
and ‘From’ addresses), and the message to be delivered. Note that the headers
to be included with the message must be included in the message as entered; this
example doesn’t do any processing of the **RFC 822** headers. In particular, the
‘To’ and ‘From’ addresses must be included in the message headers explicitly:

```
import smtplib

def prompt(title):
    return input(title).strip()

from_addr = prompt("From: ")
to_addrs  = prompt("To: ").split()
print("Enter message, end with ^D (Unix) or ^Z (Windows):")

# Add the From: and To: headers at the start!
lines = [f"From: {from_addr}", f"To: {', '.join(to_addrs)}", ""]
while True:
    try:
        line = input()
    except EOFError:
        break
    else:
        lines.append(line)

msg = "\r\n".join(lines)
print("Message length is", len(msg))

server = smtplib.SMTP("localhost")
server.set_debuglevel(1)
server.sendmail(from_addr, to_addrs, msg)
server.quit()
```

Note

In general, you will want to use the `email` package’s features to
construct an email message, which you can then send
via `send_message()`; see email: Examples.
