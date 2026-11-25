# `socket` — Low-level networking interface

This module provides access to the BSD *socket* interface. It is available on
all modern Unix systems, Windows, MacOS, and probably additional platforms.

Note

Some behavior may be platform dependent, since calls are made to the operating
system socket APIs.

This module does not work or is not available on WebAssembly. See

The Python interface is a straightforward transliteration of the Unix system
call and library interface for sockets to Python’s object-oriented style: the
`socket()` function returns a *socket object* whose methods implement
the various socket system calls. Parameter types are somewhat higher-level than
in the C interface: as with `read()` and `write()` operations on Python
files, buffer allocation on receive operations is automatic, and buffer length
is implicit on send operations.

See also

Module `socketserver`
:   Classes that simplify writing network servers.

Module `ssl`
:   A TLS/SSL wrapper for socket objects.

## Socket families

Depending on the system and the build options, various socket families
are supported by this module.

The address format required by a particular socket object is automatically
selected based on the address family specified when the socket object was
created. Socket addresses are represented as follows:

- The address of an `AF_UNIX` socket bound to a file system node
  is represented as a string, using the file system encoding and the
  `'surrogateescape'` error handler (see **PEP 383**). An address in
  Linux’s abstract namespace is returned as a bytes-like object with
  an initial null byte; note that sockets in this namespace can
  communicate with normal file system sockets, so programs intended to
  run on Linux may need to deal with both types of address. A string or
  bytes-like object can be used for either type of address when
  passing it as an argument.

- A pair `(host, port)` is used for the `AF_INET` address family,
  where *host* is a string representing either a hostname in internet domain
  notation like `'daring.cwi.nl'` or an IPv4 address like `'100.50.200.5'`,
  and *port* is an integer.

  - For IPv4 addresses, two special forms are accepted instead of a host
    address: `''` represents `INADDR_ANY`, which is used to bind to all
    interfaces, and the string `'<broadcast>'` represents
    `INADDR_BROADCAST`. This behavior is not compatible with IPv6,
    therefore, you may want to avoid these if you intend to support IPv6 with your
    Python programs.
- For `AF_INET6` address family, a four-tuple `(host, port, flowinfo,
  scope_id)` is used, where *flowinfo* and *scope\_id* represent the `sin6_flowinfo`
  and `sin6_scope_id` members in `struct sockaddr_in6` in C. For
  `socket` module methods, *flowinfo* and *scope\_id* can be omitted just for
  backward compatibility. Note, however, omission of *scope\_id* can cause problems
  in manipulating scoped IPv6 addresses.

  - *addr\_type* is one of `TIPC_ADDR_NAMESEQ`, `TIPC_ADDR_NAME`,
    or `TIPC_ADDR_ID`.
  - *scope* is one of `TIPC_ZONE_SCOPE`, `TIPC_CLUSTER_SCOPE`, and
    `TIPC_NODE_SCOPE`.
  - If *addr\_type* is `TIPC_ADDR_NAME`, then *v1* is the server type, *v2* is
    the port identifier, and *v3* should be 0.

    If *addr\_type* is `TIPC_ADDR_NAMESEQ`, then *v1* is the server type, *v2*
    is the lower port number, and *v3* is the upper port number.

    If *addr\_type* is `TIPC_ADDR_ID`, then *v1* is the node, *v2* is the
    reference, and *v3* should be set to 0.
- A tuple `(interface, )` is used for the `AF_CAN` address family,
  where *interface* is a string representing a network interface name like
  `'can0'`. The network interface name `''` can be used to receive packets
  from all network interfaces of this family.

  - `CAN_ISOTP` protocol requires a tuple `(interface, rx_addr, tx_addr)`
    where both additional parameters are unsigned long integer that represent a
    CAN identifier (standard or extended).
  - `CAN_J1939` protocol requires a tuple `(interface, name, pgn, addr)`
    where additional parameters are 64-bit unsigned integer representing the
    ECU name, a 32-bit unsigned integer representing the Parameter Group Number
    (PGN), and an 8-bit integer representing the address.
- A string or a tuple `(id, unit)` is used for the `SYSPROTO_CONTROL`
  protocol of the `PF_SYSTEM` family. The string is the name of a
  kernel control using a dynamically assigned ID. The tuple can be used if ID
  and unit number of the kernel control are known or if a registered ID is
  used.

  - `BTPROTO_L2CAP` accepts a tuple
    `(bdaddr, psm[, cid[, bdaddr_type]])` where:

    - `bdaddr` is a string specifying the Bluetooth address.
    - `psm` is an integer specifying the Protocol/Service Multiplexer.
    - `cid` is an optional integer specifying the Channel Identifier.
      If not given, defaults to zero.
    - `bdaddr_type` is an optional integer specifying the address type;
      one of `BDADDR_BREDR` (default), `BDADDR_LE_PUBLIC`,
      `BDADDR_LE_RANDOM`.

    - On Linux it accepts an integer `device_id` or a tuple
      `(device_id, [channel])` where `device_id`
      specifies the number of the Bluetooth device,
      and `channel` is an optional integer specifying the HCI channel
      (`HCI_CHANNEL_RAW` by default).
    - On FreeBSD, NetBSD and DragonFly BSD it accepts `bdaddr`
      where `bdaddr` is the Bluetooth address as a string.

  - *type* is the algorithm type as string, e.g. `aead`, `hash`,
    `skcipher` or `rng`.
  - *name* is the algorithm name and operation mode as string, e.g.
    `sha256`, `hmac(sha256)`, `cbc(aes)` or `drbg_nopr_ctr_aes256`.
  - *feat* and *mask* are unsigned 32bit integers.

  Availability: Linux >= 2.6.38.

  Some algorithm types require more recent Kernels.

  Availability: Linux >= 3.9

  See *vsock(7)*

  - *ifname* - String specifying the device name.
  - *proto* - The Ethernet protocol number.
    May be `ETH_P_ALL` to capture all protocols,
    one of the ETHERTYPE\_\* constants
    or any other Ethernet protocol number.
  - *pkttype* - Optional integer specifying the packet type:

    - `PACKET_HOST` (the default) - Packet addressed to the local host.
    - `PACKET_BROADCAST` - Physical-layer broadcast packet.
    - `PACKET_MULTICAST` - Packet sent to a physical-layer multicast address.
    - `PACKET_OTHERHOST` - Packet to some other host that has been caught by
      a device driver in promiscuous mode.
    - `PACKET_OUTGOING` - Packet originating from the local host that is
      looped back to a packet socket.
  - *hatype* - Optional integer specifying the ARP hardware address type.
  - *addr* - Optional bytes-like object specifying the hardware physical
    address, whose interpretation depends on the device.

  Availability: Linux >= 2.2.
- `AF_QIPCRTR` is a Linux-only socket based interface for communicating
  with services running on co-processors in Qualcomm platforms. The address
  family is represented as a `(node, port)` tuple where the *node* and *port*
  are non-negative integers.

  Availability: Linux >= 4.7.

  Such a socket should be constructed with
  `socket(AF_INET, SOCK_DGRAM, IPPROTO_UDPLITE)` for IPv4 or
  `socket(AF_INET6, SOCK_DGRAM, IPPROTO_UDPLITE)` for IPv6.

  Availability: Linux >= 2.6.20, FreeBSD >= 10.1

  The `vm_id` is the virtual machine identifier or a set of known VMID values
  if the target is not a specific virtual machine. Known VMID constants
  defined on `socket` are:

  - `HV_GUID_ZERO`
  - `HV_GUID_BROADCAST`
  - `HV_GUID_WILDCARD` - Used to bind on itself and accept connections from
    all partitions.
  - `HV_GUID_CHILDREN` - Used to bind on itself and accept connection from
    child partitions.
  - `HV_GUID_LOOPBACK` - Used as a target to itself.
  - `HV_GUID_PARENT` - When used as a bind accepts connection from the parent
    partition. When used as an address target it will connect to the parent partition.

  The `service_id` is the service identifier of the registered service.

If you use a hostname in the *host* portion of IPv4/v6 socket address, the
program may show a nondeterministic behavior, as Python uses the first address
returned from the DNS resolution. The socket address will be resolved
differently into an actual IPv4/v6 address, depending on the results from DNS
resolution and/or the host configuration. For deterministic behavior use a
numeric address in *host* portion.

All errors raise exceptions. The normal exceptions for invalid argument types
and out-of-memory conditions can be raised. Errors
related to socket or address semantics raise `OSError` or one of its
subclasses.

Non-blocking mode is supported through `setblocking()`. A
generalization of this based on timeouts is supported through
`settimeout()`.

## Module contents

The module `socket` exports the following elements.

### Exceptions

exception socket.error
:   A deprecated alias of `OSError`.

exception socket.herror
:   A subclass of `OSError`, this exception is raised for
    address-related errors, i.e. for functions that use *h\_errno* in the POSIX
    C API, including `gethostbyname_ex()` and `gethostbyaddr()`.
    The accompanying value is a pair `(h_errno, string)` representing an
    error returned by a library call. *h\_errno* is a numeric value, while
    *string* represents the description of *h\_errno*, as returned by the
    `hstrerror()` C function.

exception socket.gaierror
:   A subclass of `OSError`, this exception is raised for
    address-related errors by `getaddrinfo()` and `getnameinfo()`.
    The accompanying value is a pair `(error, string)` representing an error
    returned by a library call. *string* represents the description of
    *error*, as returned by the `gai_strerror()` C function. The
    numeric *error* value will match one of the `EAI_*` constants
    defined in this module.

exception socket.timeout
:   A deprecated alias of `TimeoutError`.

    A subclass of `OSError`, this exception is raised when a timeout
    occurs on a socket which has had timeouts enabled via a prior call to
    `settimeout()` (or implicitly through
    `setdefaulttimeout()`). The accompanying value is a string
    whose value is currently always “timed out”.

### Constants

The AF\_\* and SOCK\_\* constants are now `AddressFamily` and
`SocketKind` `IntEnum` collections.

socket.AF\_UNIX

socket.AF\_INET

socket.AF\_INET6
:   These constants represent the address (and protocol) families, used for the
    first argument to `socket()`. If the `AF_UNIX` constant is not
    defined then this protocol is unsupported. More constants may be available
    depending on the system.

socket.AF\_UNSPEC
:   `AF_UNSPEC` means that
    `getaddrinfo()` should return socket addresses for any
    address family (either IPv4, IPv6, or any other) that can be used.

socket.SOCK\_STREAM

socket.SOCK\_DGRAM

socket.SOCK\_RAW

socket.SOCK\_RDM

socket.SOCK\_SEQPACKET
:   These constants represent the socket types, used for the second argument to
    `socket()`. More constants may be available depending on the system.
    (Only `SOCK_STREAM` and `SOCK_DGRAM` appear to be generally
    useful.)

socket.SOCK\_CLOEXEC

socket.SOCK\_NONBLOCK
:   These two constants, if defined, can be combined with the socket types and
    allow you to set some flags atomically (thus avoiding possible race
    conditions and the need for separate calls).

    See also

    Secure File Descriptor Handling
    for a more thorough explanation.

    Availability: Linux >= 2.6.27.

SO\_\*

socket.SOMAXCONN

MSG\_\*

SOL\_\*

SCM\_\*

IPPROTO\_\*

IPPORT\_\*

INADDR\_\*

IP\_\*

IPV6\_\*

EAI\_\*

AI\_\*

NI\_\*

TCP\_\*
:   Many constants of these forms, documented in the Unix documentation on sockets
    and/or the IP protocol, are also defined in the socket module. They are
    generally used in arguments to the `setsockopt()` and `getsockopt()`
    methods of socket objects. In most cases, only those symbols that are defined
    in the Unix header files are defined; for a few symbols, default values are
    provided.

    Added support for `TCP_KEEPIDLE`, `TCP_KEEPINTVL` on Windows platforms
    when available.

    Changed in version 3.15: `IPV6_HDRINCL` was added.
    Added support for `SO_PASSRIGHTS` on Linux platforms when available.

socket.AF\_CAN

socket.PF\_CAN

SOL\_CAN\_\*

CAN\_\*
:   Many constants of these forms, documented in the Linux documentation, are
    also defined in the socket module.

    Availability: Linux >= 2.6.25, NetBSD >= 8.

socket.CAN\_BCM

CAN\_BCM\_\*
:   CAN\_BCM, in the CAN protocol family, is the broadcast manager (BCM) protocol.
    Broadcast manager constants, documented in the Linux documentation, are also
    defined in the socket module.

    Availability: Linux >= 2.6.25.

    Note

    The `CAN_BCM_CAN_FD_FRAME` flag is only available on Linux >= 4.8.

socket.CAN\_RAW\_FD\_FRAMES
:   Enables CAN FD support in a CAN\_RAW socket. This is disabled by default.
    This allows your application to send both CAN and CAN FD frames; however,
    you must accept both CAN and CAN FD frames when reading from the socket.

    This constant is documented in the Linux documentation.

    Availability: Linux >= 3.6.

socket.CAN\_RAW\_JOIN\_FILTERS
:   Joins the applied CAN filters such that only CAN frames that match all
    given CAN filters are passed to user space.

    This constant is documented in the Linux documentation.

    Availability: Linux >= 4.1.

socket.CAN\_ISOTP
:   CAN\_ISOTP, in the CAN protocol family, is the ISO-TP (ISO 15765-2) protocol.
    ISO-TP constants, documented in the Linux documentation.

    Availability: Linux >= 2.6.25.

socket.CAN\_J1939
:   CAN\_J1939, in the CAN protocol family, is the SAE J1939 protocol.
    J1939 constants, documented in the Linux documentation.

    Availability: Linux >= 5.4.

socket.AF\_DIVERT

socket.PF\_DIVERT
:   These two constants, documented in the FreeBSD divert(4) manual page, are
    also defined in the socket module.

    Availability: FreeBSD >= 14.0.

socket.AF\_PACKET

socket.PF\_PACKET

PACKET\_\*
:   Many constants of these forms, documented in the Linux documentation, are
    also defined in the socket module.

    Availability: Linux >= 2.2.

socket.ETH\_P\_ALL
:   `ETH_P_ALL` can be used in the `socket`
    constructor as *proto* for the `AF_PACKET` family in order to
    capture every packet, regardless of protocol.

    For more information, see the *packet(7)* manpage.

    Availability: Linux.

socket.AF\_RDS

socket.PF\_RDS

socket.SOL\_RDS

RDS\_\*
:   Many constants of these forms, documented in the Linux documentation, are
    also defined in the socket module.

    Availability: Linux >= 2.6.30.

socket.SIO\_RCVALL

socket.SIO\_KEEPALIVE\_VALS

socket.SIO\_LOOPBACK\_FAST\_PATH

RCVALL\_\*
:   Constants for Windows’ WSAIoctl(). The constants are used as arguments to the
    `ioctl()` method of socket objects.

TIPC\_\*
:   TIPC related constants, matching the ones exported by the C socket API. See
    the TIPC documentation for more information.

socket.AF\_ALG

socket.SOL\_ALG

ALG\_\*
:   Constants for Linux Kernel cryptography.

    Availability: Linux >= 2.6.38.

socket.AF\_VSOCK

socket.IOCTL\_VM\_SOCKETS\_GET\_LOCAL\_CID

VMADDR\*

SO\_VM\*
:   Constants for Linux host/guest communication.

    Availability: Linux >= 4.8.

socket.AF\_LINK
:   Availability: BSD, macOS.

socket.has\_ipv6
:   This constant contains a boolean value which indicates if IPv6 is supported on
    this platform.

socket.AF\_BLUETOOTH

socket.BTPROTO\_L2CAP

socket.BTPROTO\_RFCOMM

socket.BTPROTO\_HCI

socket.BTPROTO\_SCO
:   Integer constants for use with Bluetooth addresses.

socket.BDADDR\_ANY

socket.BDADDR\_LOCAL
:   These are string constants containing Bluetooth addresses with special
    meanings. For example, `BDADDR_ANY` can be used to indicate
    any address when specifying the binding socket with
    `BTPROTO_RFCOMM`.

socket.BDADDR\_BREDR

socket.BDADDR\_LE\_PUBLIC

socket.BDADDR\_LE\_RANDOM
:   These constants describe the Bluetooth address type when binding or
    connecting a `BTPROTO_L2CAP` socket.

    Availability: Linux, FreeBSD

socket.SOL\_RFCOMM

socket.SOL\_L2CAP

socket.SOL\_HCI

socket.SOL\_SCO

socket.SOL\_BLUETOOTH
:   Used in the level argument to the `setsockopt()` and
    `getsockopt()` methods of Bluetooth socket objects.

    `SOL_BLUETOOTH` is only available on Linux. Other constants
    are available if the corresponding protocol is supported.

SO\_L2CAP\_\*

socket.L2CAP\_LM

L2CAP\_LM\_\*

SO\_RFCOMM\_\*

RFCOMM\_LM\_\*

SO\_SCO\_\*

SO\_BTH\_\*

BT\_\*
:   Used in the option name and value argument to the `setsockopt()`
    and `getsockopt()` methods of Bluetooth socket objects.

    `BT_*` and `L2CAP_LM` are only available on Linux.
    `SO_BTH_*` are only available on Windows.
    Other constants may be available on Linux and various BSD platforms.

socket.HCI\_FILTER

socket.HCI\_TIME\_STAMP

socket.HCI\_DATA\_DIR

socket.SO\_HCI\_EVT\_FILTER

socket.SO\_HCI\_PKT\_FILTER
:   Option names for use with `BTPROTO_HCI`.
    Availability and format of the option values depend on platform.

socket.HCI\_DEV\_NONE
:   The `device_id` value used to create an HCI socket that isn’t specific
    to a single Bluetooth adapter.

    Availability: Linux

socket.HCI\_CHANNEL\_RAW

socket.HCI\_CHANNEL\_USER

socket.HCI\_CHANNEL\_MONITOR

socket.HCI\_CHANNEL\_CONTROL

socket.HCI\_CHANNEL\_LOGGING
:   Possible values for `channel` field in the `BTPROTO_HCI` address.

    Availability: Linux

socket.AF\_QIPCRTR
:   Constant for Qualcomm’s IPC router protocol, used to communicate with
    service providing remote processors.

    Availability: Linux >= 4.7.

socket.SCM\_CREDS2

socket.LOCAL\_CREDS

socket.LOCAL\_CREDS\_PERSISTENT
:   LOCAL\_CREDS and LOCAL\_CREDS\_PERSISTENT can be used
    with SOCK\_DGRAM, SOCK\_STREAM sockets, equivalent to
    Linux/DragonFlyBSD SO\_PASSCRED, while LOCAL\_CREDS
    sends the credentials at first read, LOCAL\_CREDS\_PERSISTENT
    sends for each read, SCM\_CREDS2 must be then used for
    the latter for the message type.

    Availability: FreeBSD.

socket.SO\_INCOMING\_CPU
:   Constant to optimize CPU locality, to be used in conjunction with
    `SO_REUSEPORT`.

    Availability: Linux >= 3.9

socket.SO\_REUSEPORT\_LB
:   > Constant to enable duplicate address and port bindings with load balancing.

    Availability: FreeBSD >= 12.0

socket.AF\_HYPERV

socket.HV\_PROTOCOL\_RAW

socket.HVSOCKET\_CONNECT\_TIMEOUT

socket.HVSOCKET\_CONNECT\_TIMEOUT\_MAX

socket.HVSOCKET\_CONNECTED\_SUSPEND

socket.HVSOCKET\_ADDRESS\_FLAG\_PASSTHRU

socket.HV\_GUID\_ZERO

socket.HV\_GUID\_WILDCARD

socket.HV\_GUID\_BROADCAST

socket.HV\_GUID\_CHILDREN

socket.HV\_GUID\_LOOPBACK

socket.HV\_GUID\_PARENT
:   Constants for Windows Hyper-V sockets for host/guest communications.

    Availability: Windows.

socket.ETHERTYPE\_ARP

socket.ETHERTYPE\_IP

socket.ETHERTYPE\_IPV6

socket.ETHERTYPE\_VLAN
:   IEEE 802.3 protocol number.
    constants.

    Availability: Linux, FreeBSD, macOS.

socket.SHUT\_RD

socket.SHUT\_WR

socket.SHUT\_RDWR
:   These constants are used by the `shutdown()` method of socket objects.

    Availability: not WASI.

### Functions

#### Creating sockets

The following functions all create socket objects.

The `socket` class constructor creates a new socket
directly; see Socket Objects for its parameters and full description.

socket.socketpair([*family*[, *type*[, *proto*]]])
:   Build a pair of connected socket objects using the given address family, socket
    type, and protocol number. Address family, socket type, and protocol number are
    as for the `socket()` function. The default family is `AF_UNIX`
    if defined on the platform; otherwise, the default is `AF_INET`.

    The newly created sockets are non-inheritable.

socket.create\_connection(*address*, *timeout=GLOBAL\_DEFAULT*, *source\_address=None*, *\**, *all\_errors=False*)
:   Connect to a TCP service listening on the internet *address* (a 2-tuple
    `(host, port)`), and return the socket object. This is a higher-level
    function than `socket.connect()`: if *host* is a non-numeric hostname,
    it will try to resolve it for both `AF_INET` and `AF_INET6`,
    and then try to connect to all possible addresses in turn until a
    connection succeeds. This makes it easy to write clients that are
    compatible to both IPv4 and IPv6.

    Passing the optional *timeout* parameter will set the timeout on the
    socket instance before attempting to connect. If no *timeout* is
    supplied, the global default timeout setting returned by
    `getdefaulttimeout()` is used.

    If supplied, *source\_address* must be a 2-tuple `(host, port)` for the
    socket to bind to as its source address before connecting. If host or port
    are ‘’ or 0 respectively the OS default behavior will be used.

    When a connection cannot be created, an exception is raised. By default,
    it is the exception from the last address in the list. If *all\_errors*
    is `True`, it is an `ExceptionGroup` containing the errors of all
    attempts.

socket.create\_server(*address*, *\**, *family=AF\_INET*, *backlog=None*, *reuse\_port=False*, *dualstack\_ipv6=False*)
:   Convenience function which creates a TCP socket bound to *address* (a 2-tuple
    `(host, port)`) and returns the socket object.

    *family* should be either `AF_INET` or `AF_INET6`.
    *backlog* is the queue size passed to `socket.listen()`; if not specified
    , a default reasonable value is chosen.
    *reuse\_port* dictates whether to set the `SO_REUSEPORT` socket option.

    If *dualstack\_ipv6* is true, *family* is `AF_INET6` and the platform
    supports it the socket will be able to accept both IPv4 and IPv6 connections,
    else it will raise `ValueError`. Most POSIX platforms and Windows are
    supposed to support this functionality.
    When this functionality is enabled the address returned by
    `socket.getpeername()` when an IPv4 connection occurs will be an IPv6
    address represented as an IPv4-mapped IPv6 address.
    If *dualstack\_ipv6* is false it will explicitly disable this functionality
    on platforms that enable it by default (e.g. Linux).
    This parameter can be used in conjunction with `has_dualstack_ipv6()`:

    ```
    import socket

    addr = ("", 8080)  # all interfaces, port 8080
    if socket.has_dualstack_ipv6():
        s = socket.create_server(addr, family=socket.AF_INET6, dualstack_ipv6=True)
    else:
        s = socket.create_server(addr)
    ```

    Note

    On POSIX platforms the `SO_REUSEADDR` socket option is set in order to
    immediately reuse previous sockets which were bound on the same *address*
    and remained in TIME\_WAIT state.

socket.has\_dualstack\_ipv6()
:   Return `True` if the platform supports creating a TCP socket which can
    handle both IPv4 and IPv6 connections.

socket.fromfd(*fd*, *family*, *type*, *proto=0*)
:   Duplicate the file descriptor *fd* (an integer as returned by a file object’s
    `fileno()` method) and build a socket object from the result. Address
    family, socket type and protocol number are as for the `socket()` function.
    The file descriptor should refer to a socket, but this is not checked —
    subsequent operations on the object may fail if the file descriptor is invalid.
    This function is rarely needed, but can be used to get or set socket options on
    a socket passed to a program as standard input or output (such as a server
    started by the Unix inet daemon). The socket is assumed to be in blocking mode.

    The newly created socket is non-inheritable.

socket.fromshare(*data*)
:   Instantiate a socket from data obtained from the `socket.share()`
    method. The socket is assumed to be in blocking mode.

    Availability: Windows.

#### Other functions

The `socket` module also offers various network-related services:

socket.close(*fd*)
:   Close a socket file descriptor. This is like `os.close()`, but for
    sockets. On some platforms (most notably Windows) `os.close()`
    does not work for socket file descriptors.

socket.getaddrinfo(*host*, *port*, *family=AF\_UNSPEC*, *type=0*, *proto=0*, *flags=0*)
:   This function wraps the C function `getaddrinfo` of the underlying system.

    Translate the *host*/*port* argument into a sequence of 5-tuples that contain
    all the necessary arguments for creating a socket connected to that service.
    *host* is a domain name, a string representation of an IPv4/v6 address
    or `None`. *port* is a string service name such as `'http'`, a numeric
    port number or `None`. By passing `None` as the value of *host*
    and *port*, you can pass `NULL` to the underlying C API.

    The *family*, *type* and *proto* arguments can be optionally specified
    in order to provide options and limit the list of addresses returned.
    Pass their default values (`AF_UNSPEC`, 0, and 0, respectively)
    to not limit the results. See the note below for details.

    The *flags* argument can be one or several of the `AI_*` constants,
    and will influence how results are computed and returned.
    For example, `AI_NUMERICHOST` will disable domain name resolution
    and will raise an error if *host* is a domain name.

    The function returns a list of 5-tuples with the following structure:

    `(family, type, proto, canonname, sockaddr)`

    In these tuples, *family*, *type*, *proto* are all integers and are
    meant to be passed to the `socket()` function. *canonname* will be
    a string representing the canonical name of the *host* if
    `AI_CANONNAME` is part of the *flags* argument; else *canonname*
    will be empty. *sockaddr* is a tuple describing a socket address, whose
    format depends on the returned *family* and flags Python was compiled with,
    and is meant to be passed to the `socket.connect()` method.

    *sockaddr* can be one of the following:

    - a `(address, port)` 2-tuple for `AF_INET`
    - a `(address, port, flowinfo, scope_id)` 4-tuple for `AF_INET6` if
      Python was compiled with `--enable-ipv6` (the default)
    - a 2-tuple containing raw data for `AF_INET6` if Python was
      compiled with `--disable-ipv6`

    Note

    If you intend to use results from `getaddrinfo()` to create a socket
    (rather than, for example, retrieve *canonname*),
    consider limiting the results by *type* (e.g. `SOCK_STREAM` or
    `SOCK_DGRAM`) and/or *proto* (e.g. `IPPROTO_TCP` or
    `IPPROTO_UDP`) that your application can handle.

    The behavior with default values of *family*, *type*, *proto*
    and *flags* is system-specific.

    Many systems (for example, most Linux configurations) will return a sorted
    list of all matching addresses.
    These addresses should generally be tried in order until a connection succeeds
    (possibly tried in parallel, for example, using a Happy Eyeballs algorithm).
    In these cases, limiting the *type* and/or *proto* can help eliminate
    unsuccessful or unusable connection attempts.

    Some systems will, however, only return a single address.
    (For example, this was reported on Solaris and AIX configurations.)
    On these systems, limiting the *type* and/or *proto* helps ensure that
    this address is usable.

    Raises an auditing event `socket.getaddrinfo` with arguments `host`, `port`, `family`, `type`, `protocol`.

    The following example fetches address information for a hypothetical TCP
    connection to `example.org` on port 80 (results may differ on your
    system if IPv6 isn’t enabled):

    ```
    >>> socket.getaddrinfo("example.org", 80, proto=socket.IPPROTO_TCP)
    [(socket.AF_INET6, socket.SOCK_STREAM,
     6, '', ('2606:2800:220:1:248:1893:25c8:1946', 80, 0, 0)),
     (socket.AF_INET, socket.SOCK_STREAM,
     6, '', ('93.184.216.34', 80))]
    ```

    Changed in version 3.15.2 (unreleased): Null characters are now rejected in the *host* and *port* parameters.

socket.getfqdn([*name*])
:   Return a fully qualified domain name for *name*. If *name* is omitted or empty,
    it is interpreted as the local host. To find the fully qualified name, the
    hostname returned by `gethostbyaddr()` is checked, followed by aliases for the
    host, if available. The first name which includes a period is selected. In
    case no fully qualified domain name is available and *name* was provided,
    it is returned unchanged. If *name* was empty or equal to `'0.0.0.0'`,
    the hostname from `gethostname()` is returned.

socket.gethostbyname(*hostname*)
:   Translate a host name to IPv4 address format. The IPv4 address is returned as a
    string, such as `'100.50.200.5'`. If the host name is an IPv4 address itself
    it is returned unchanged. See `gethostbyname_ex()` for a more complete
    interface. `gethostbyname()` does not support IPv6 name resolution, and
    `getaddrinfo()` should be used instead for IPv4/v6 dual stack support.

    Raises an auditing event `socket.gethostbyname` with argument `hostname`.

    Availability: not WASI.

socket.gethostbyname\_ex(*hostname*)
:   Translate a host name to IPv4 address format, extended interface. Return a
    3-tuple `(hostname, aliaslist, ipaddrlist)` where *hostname* is the host’s
    primary host name, *aliaslist* is a (possibly
    empty) list of alternative host names for the same address, and *ipaddrlist* is
    a list of IPv4 addresses for the same interface on the same host (often but not
    always a single address). `gethostbyname_ex()` does not support IPv6 name
    resolution, and `getaddrinfo()` should be used instead for IPv4/v6 dual
    stack support.

    Raises an auditing event `socket.gethostbyname` with argument `hostname`.

    Availability: not WASI.

socket.gethostname()
:   Return a string containing the hostname of the machine where the Python
    interpreter is currently executing.

    Raises an auditing event `socket.gethostname` with no arguments.

    Note: `gethostname()` doesn’t always return the fully qualified domain
    name; use `getfqdn()` for that.

    Availability: not WASI.

socket.gethostbyaddr(*ip\_address*)
:   Return a 3-tuple `(hostname, aliaslist, ipaddrlist)` where *hostname* is the
    primary host name responding to the given *ip\_address*, *aliaslist* is a
    (possibly empty) list of alternative host names for the same address, and
    *ipaddrlist* is a list of IPv4/v6 addresses for the same interface on the same
    host (most likely containing only a single address). To find the fully qualified
    domain name, use the function `getfqdn()`. `gethostbyaddr()` supports
    both IPv4 and IPv6.

    Raises an auditing event `socket.gethostbyaddr` with argument `ip_address`.

    Availability: not WASI.

socket.getnameinfo(*sockaddr*, *flags*)
:   Translate a socket address *sockaddr* into a 2-tuple `(host, port)`. Depending
    on the settings of *flags*, the result can contain a fully qualified domain name
    or numeric address representation in *host*. Similarly, *port* can contain a
    string port name or a numeric port number.

    For IPv6 addresses, `%scope_id` is appended to the host part if *sockaddr*
    contains meaningful *scope\_id*. Usually this happens for multicast addresses.

    For more information about *flags* you can consult *getnameinfo(3)*.

    Raises an auditing event `socket.getnameinfo` with argument `sockaddr`.

    Availability: not WASI.

socket.getprotobyname(*protocolname*)
:   Translate an internet protocol name (for example, `'icmp'`) to a constant
    suitable for passing as the (optional) third argument to the `socket()`
    function. This is usually only needed for sockets opened in “raw” mode
    (`SOCK_RAW`); for the normal socket modes, the correct protocol is chosen
    automatically if the protocol is omitted or zero.

    Availability: not WASI.

socket.getservbyname(*servicename*[, *protocolname*])
:   Translate an internet service name and protocol name to a port number for that
    service. The optional protocol name, if given, should be `'tcp'` or
    `'udp'`, otherwise any protocol will match.

    Raises an auditing event `socket.getservbyname` with arguments `servicename`, `protocolname`.

    Availability: not WASI.

socket.getservbyport(*port*[, *protocolname*])
:   Translate an internet port number and protocol name to a service name for that
    service. The optional protocol name, if given, should be `'tcp'` or
    `'udp'`, otherwise any protocol will match.

    Raises an auditing event `socket.getservbyport` with arguments `port`, `protocolname`.

    Availability: not WASI.

socket.ntohl(*x*)
:   Convert 32-bit positive integers from network to host byte order. On machines
    where the host byte order is the same as network byte order, this is a no-op;
    otherwise, it performs a 4-byte swap operation.

socket.ntohs(*x*)
:   Convert 16-bit positive integers from network to host byte order. On machines
    where the host byte order is the same as network byte order, this is a no-op;
    otherwise, it performs a 2-byte swap operation.

    Changed in version 3.10: Raises `OverflowError` if *x* does not fit in a 16-bit unsigned
    integer.

socket.htonl(*x*)
:   Convert 32-bit positive integers from host to network byte order. On machines
    where the host byte order is the same as network byte order, this is a no-op;
    otherwise, it performs a 4-byte swap operation.

socket.htons(*x*)
:   Convert 16-bit positive integers from host to network byte order. On machines
    where the host byte order is the same as network byte order, this is a no-op;
    otherwise, it performs a 2-byte swap operation.

    Changed in version 3.10: Raises `OverflowError` if *x* does not fit in a 16-bit unsigned
    integer.

socket.inet\_aton(*ip\_string*)
:   Convert an IPv4 address from dotted-quad string format (for example,
    ‘123.45.67.89’) to 32-bit packed binary format, as a bytes object four characters in
    length. This is useful when conversing with a program that uses the standard C
    library and needs objects of type `in_addr`, which is the C type
    for the 32-bit packed binary this function returns.

    `inet_aton()` also accepts strings with less than three dots; see the
    Unix manual page *inet(3)* for details.

    If the IPv4 address string passed to this function is invalid,
    `OSError` will be raised. Note that exactly what is valid depends on
    the underlying C implementation of `inet_aton()`.

    `inet_aton()` does not support IPv6, and `inet_pton()` should be used
    instead for IPv4/v6 dual stack support.

socket.inet\_ntoa(*packed\_ip*)
:   Convert a 32-bit packed IPv4 address (a bytes-like object four
    bytes in length) to its standard dotted-quad string representation (for example,
    ‘123.45.67.89’). This is useful when conversing with a program that uses the
    standard C library and needs objects of type `in_addr`, which
    is the C type for the 32-bit packed binary data this function takes as an
    argument.

    If the byte sequence passed to this function is not exactly 4 bytes in
    length, `OSError` will be raised. `inet_ntoa()` does not
    support IPv6, and `inet_ntop()` should be used instead for IPv4/v6 dual
    stack support.

socket.inet\_pton(*address\_family*, *ip\_string*)
:   Convert an IP address from its family-specific string format to a packed,
    binary format. `inet_pton()` is useful when a library or network protocol
    calls for an object of type `in_addr` (similar to
    `inet_aton()`) or `in6_addr`.

    Supported values for *address\_family* are currently `AF_INET` and
    `AF_INET6`. If the IP address string *ip\_string* is invalid,
    `OSError` will be raised. Note that exactly what is valid depends on
    both the value of *address\_family* and the underlying implementation of
    `inet_pton()`.

    Availability: Unix, Windows.

socket.inet\_ntop(*address\_family*, *packed\_ip*)
:   Convert a packed IP address (a bytes-like object of some number of
    bytes) to its standard, family-specific string representation (for
    example, `'7.10.0.5'` or `'5aef:2b::8'`).
    `inet_ntop()` is useful when a library or network protocol returns an
    object of type `in_addr` (similar to `inet_ntoa()`) or
    `in6_addr`.

    Supported values for *address\_family* are currently `AF_INET` and
    `AF_INET6`. If the bytes object *packed\_ip* is not the correct
    length for the specified address family, `ValueError` will be raised.
    `OSError` is raised for errors from the call to `inet_ntop()`.

    Availability: Unix, Windows.

socket.CMSG\_LEN(*length*)
:   Return the total length, without trailing padding, of an ancillary
    data item with associated data of the given *length*. This value
    can often be used as the buffer size for `recvmsg()` to
    receive a single item of ancillary data, but **RFC 3542** requires
    portable applications to use `CMSG_SPACE()` and thus include
    space for padding, even when the item will be the last in the
    buffer. Raises `OverflowError` if *length* is outside the
    permissible range of values.

    Availability: Unix, not WASI.

    Most Unix platforms.

socket.CMSG\_SPACE(*length*)
:   Return the buffer size needed for `recvmsg()` to
    receive an ancillary data item with associated data of the given
    *length*, along with any trailing padding. The buffer space needed
    to receive multiple items is the sum of the `CMSG_SPACE()`
    values for their associated data lengths. Raises
    `OverflowError` if *length* is outside the permissible range
    of values.

    Note that some systems might support ancillary data without
    providing this function. Also note that setting the buffer size
    using the results of this function may not precisely limit the
    amount of ancillary data that can be received, since additional
    data may be able to fit into the padding area.

    Availability: Unix, not WASI.

    most Unix platforms.

socket.getdefaulttimeout()
:   Return the default timeout in seconds (float) for new socket objects. A value
    of `None` indicates that new socket objects have no timeout. When the socket
    module is first imported, the default is `None`.

socket.setdefaulttimeout(*timeout*)
:   Set the default timeout in seconds (real number) for new socket objects. When
    the socket module is first imported, the default is `None`. See
    `settimeout()` for possible values and their respective
    meanings.

    Changed in version 3.15: Accepts any real number, not only integer or float.

socket.sethostname(*name*)
:   Set the machine’s hostname to *name*. This will raise an
    `OSError` if you don’t have enough rights.

    Raises an auditing event `socket.sethostname` with argument `name`.

    Availability: Unix, not Android.

socket.if\_nameindex()
:   Return a list of network interface information
    (index int, name string) tuples.
    `OSError` if the system call fails.

    Availability: Unix, Windows, not WASI.

    Note

    On Windows network interfaces have different names in different contexts
    (all names are examples):

    - UUID: `{FB605B73-AAC2-49A6-9A2F-25416AEA0573}`
    - name: `ethernet_32770`
    - friendly name: `vEthernet (nat)`
    - description: `Hyper-V Virtual Ethernet Adapter`

    This function returns names of the second form from the list, `ethernet_32770`
    in this example case.

socket.if\_nametoindex(*if\_name*)
:   Return a network interface index number corresponding to an
    interface name.
    `OSError` if no interface with the given name exists.

    Availability: Unix, Windows, not WASI.

    See also

    “Interface name” is a name as documented in `if_nameindex()`.

socket.if\_indextoname(*if\_index*)
:   Return a network interface name corresponding to an
    interface index number.
    `OSError` if no interface with the given index exists.

    Availability: Unix, Windows, not WASI.

    See also

    “Interface name” is a name as documented in `if_nameindex()`.

socket.send\_fds(*sock*, *buffers*, *fds*[, *flags*[, *address*]])
:   Send the list of file descriptors *fds* over an `AF_UNIX` socket *sock*.
    The *fds* parameter is a sequence of file descriptors.
    Consult `sendmsg()` for the documentation of these parameters.

    Availability: Unix, not WASI.

    Unix platforms supporting `sendmsg()`
    and `SCM_RIGHTS` mechanism.

socket.recv\_fds(*sock*, *bufsize*, *maxfds*[, *flags*])
:   Receive up to *maxfds* file descriptors from an `AF_UNIX` socket *sock*.
    Return `(msg, list(fds), flags, addr)`.
    Consult `recvmsg()` for the documentation of these parameters.

    Availability: Unix, not WASI.

    Unix platforms supporting `recvmsg()`
    and `SCM_RIGHTS` mechanism.

    Note

    Any truncated integers at the end of the list of file descriptors.

## Socket Objects

class socket.socket(*family=AF\_INET*, *type=SOCK\_STREAM*, *proto=0*, *fileno=None*)
:   Create a new socket using the given address family, socket type and protocol
    number. The address family should be `AF_INET` (the default),
    `AF_INET6`, `AF_UNIX`, `AF_CAN`, `AF_PACKET`,
    or `AF_RDS`. The socket type should be `SOCK_STREAM` (the
    default), `SOCK_DGRAM`, `SOCK_RAW` or perhaps one of the other
    `SOCK_` constants. The protocol number is usually zero and may be omitted
    or in the case where the address family is `AF_CAN` the protocol
    should be one of `CAN_RAW`, `CAN_BCM`, `CAN_ISOTP` or
    `CAN_J1939`.

    If *fileno* is specified, the values for *family*, *type*, and *proto* are
    auto-detected from the specified file descriptor. Auto-detection can be
    overruled by calling the function with explicit *family*, *type*, or *proto*
    arguments. This only affects how Python represents e.g. the return value
    of `socket.getpeername()` but not the actual OS resource. Unlike
    `socket.fromfd()`, *fileno* will return the same socket and not a
    duplicate. This may help close a detached socket using
    `close()`.

    The newly created socket is non-inheritable.

    Raises an auditing event `socket.__new__` with arguments `self`, `family`, `type`, `protocol`.

    ```
    sock = socket.socket(
        socket.AF_INET,
        socket.SOCK_STREAM | socket.SOCK_NONBLOCK)
    ```

    will still create a non-blocking socket on OSes that support
    `SOCK_NONBLOCK`, but `sock.type` will be set to
    `socket.SOCK_STREAM`.

    Socket objects have the following methods. Except for
    `makefile()`, these correspond to Unix system calls applicable
    to sockets.

    accept()
    :   Accept a connection. The socket must be bound to an address and listening for
        connections. The return value is a pair `(conn, address)` where *conn* is a
        *new* socket object usable to send and receive data on the connection, and
        *address* is the address bound to the socket on the other end of the connection.

        The newly created socket is non-inheritable.

    bind(*address*)
    :   Bind the socket to *address*. The socket must not already be bound. The format
        of *address* depends on the address family — see Socket families.

        Raises an auditing event `socket.bind` with arguments `self`, `address`.

        Availability: not WASI.

    close()
    :   Mark the socket closed. The underlying system resource (e.g. a file
        descriptor) is also closed when all file objects from `makefile()`
        are closed. Once that happens, all future operations on the socket
        object will fail. The remote end will receive no more data (after
        queued data is flushed).

        Sockets are automatically closed when they are garbage-collected, but
        it is recommended to `close()` them explicitly, or to use a
        `with` statement around them.

        Note

        `close()` releases the resource associated with a connection but
        does not necessarily close the connection immediately. If you want
        to close the connection in a timely fashion, call `shutdown()`
        before `close()`.

    connect(*address*)
    :   Connect to a remote socket at *address*. The format of *address* depends on the
        address family — see Socket families.

        If the connection is interrupted by a signal, the method waits until the
        connection completes, or raises a `TimeoutError` on timeout, if the
        signal handler doesn’t raise an exception and the socket is blocking or has
        a timeout. For non-blocking sockets, the method raises an
        `InterruptedError` exception if the connection is interrupted by a
        signal (or the exception raised by the signal handler).

        Raises an auditing event `socket.connect` with arguments `self`, `address`.

        Availability: not WASI.

    connect\_ex(*address*)
    :   Like `connect(address)`, but return an error indicator instead of raising an
        exception for errors returned by the C-level `connect()` call (other
        problems, such as “host not found,” can still raise exceptions). The error
        indicator is `0` if the operation succeeded, otherwise the value of the
        `errno` variable. This is useful to support, for example, asynchronous
        connects.

        Raises an auditing event `socket.connect` with arguments `self`, `address`.

        Availability: not WASI.

    detach()
    :   Put the socket object into closed state without actually closing the
        underlying file descriptor. The file descriptor is returned, and can
        be reused for other purposes.

    dup()
    :   Duplicate the socket.

        The newly created socket is non-inheritable.

        Availability: not WASI.

    fileno()
    :   Return the socket’s file descriptor (a small integer), or -1 on failure. This
        is useful with `select.select()`.

        Under Windows the small integer returned by this method cannot be used where a
        file descriptor can be used (such as `os.fdopen()`). Unix does not have
        this limitation.

    get\_inheritable()
    :   Get the inheritable flag of the socket’s file
        descriptor or socket’s handle: `True` if the socket can be inherited in
        child processes, `False` if it cannot.

    getpeername()
    :   Return the remote address to which the socket is connected. This is useful to
        find out the port number of a remote IPv4/v6 socket, for instance. The format
        of the address returned depends on the address family — see Socket families.
        On some systems this function is not supported.

    getsockname()
    :   Return the socket’s own address. This is useful to find out the port number of
        an IPv4/v6 socket, for instance. The format of the address returned depends on
        the address family — see Socket families.

    getsockopt(*level*, *optname*[, *buflen*])
    :   Return the value of the given socket option (see the Unix man page
        *getsockopt(2)*). The needed symbolic constants (SO\_\* etc.)
        are defined in this module. If *buflen* is absent, an integer option is assumed
        and its integer value is returned by the function. If *buflen* is present, it
        specifies the maximum length of the buffer used to receive the option in, and
        this buffer is returned as a bytes object. It is up to the caller to decode the
        contents of the buffer (see the optional built-in module `struct` for a way
        to decode C structures encoded as byte strings).

        Availability: not WASI.

    getblocking()
    :   Return `True` if socket is in blocking mode, `False` if in
        non-blocking.

        This is equivalent to checking `socket.gettimeout() != 0`.

    gettimeout()
    :   Return the timeout in seconds (float) associated with socket operations,
        or `None` if no timeout is set. This reflects the last call to
        `setblocking()` or `settimeout()`.

    ioctl(*control*, *option*)
    :   The `ioctl()` method is a limited interface to the WSAIoctl system
        interface. Please refer to the Win32 documentation for more
        information.

        On other platforms, the generic `fcntl.fcntl()` and `fcntl.ioctl()`
        functions may be used; they accept a socket object as their first argument.

        Currently only the following control codes are supported:
        `SIO_RCVALL`, `SIO_KEEPALIVE_VALS`, and `SIO_LOOPBACK_FAST_PATH`.

        Availability: Windows

    listen([*backlog*])
    :   Enable a server to accept connections. If *backlog* is specified, it must
        be at least 0 (if it is lower, it is set to 0); it specifies the number of
        unaccepted connections that the system will allow before refusing new
        connections. If not specified, a default reasonable value is chosen.

        Availability: not WASI.

    makefile(*mode='r'*, *buffering=None*, *\**, *encoding=None*, *errors=None*, *newline=None*)
    :   Return a file object associated with the socket. The exact returned
        type depends on the arguments given to `makefile()`. These arguments are
        interpreted the same way as by the built-in `open()` function, except
        the only supported *mode* values are `'r'` (default), `'w'`, `'b'`, or
        a combination of those.

        The socket must be in blocking mode; it can have a timeout, but the file
        object’s internal buffer may end up in an inconsistent state if a timeout
        occurs.

        Closing the file object returned by `makefile()` won’t close the
        original socket unless all other file objects have been closed and
        `close()` has been called on the socket object.

        Note

        On Windows, the file-like object created by `makefile()` cannot be
        used where a file object with a file descriptor is expected, such as the
        stream arguments of `subprocess.Popen()`.

    recv(*bufsize*[, *flags*])
    :   Receive data from the socket. The return value is a bytes object representing the
        data received. The maximum amount of data to be received at once is specified
        by *bufsize*. A returned empty bytes object indicates that the client has disconnected.
        See the Unix manual page *recv(2)* for the meaning of the optional argument
        *flags*; it defaults to zero.

    recvfrom(*bufsize*[, *flags*])
    :   Receive data from the socket. The return value is a pair `(bytes, address)`
        where *bytes* is a bytes object representing the data received and *address* is the
        address of the socket sending the data. See the Unix manual page
        *recv(2)* for the meaning of the optional argument *flags*; it defaults
        to zero. The format of *address* depends on the address family — see
        Socket families.

    recvmsg(*bufsize*[, *ancbufsize*[, *flags*]])
    :   Receive normal data (up to *bufsize* bytes) and ancillary data from
        the socket. The *ancbufsize* argument sets the size in bytes of
        the internal buffer used to receive the ancillary data; it defaults
        to 0, meaning that no ancillary data will be received. Appropriate
        buffer sizes for ancillary data can be calculated using
        `CMSG_SPACE()` or `CMSG_LEN()`, and items which do not fit
        into the buffer might be truncated or discarded. The *flags*
        argument defaults to 0 and has the same meaning as for
        `recv()`.

        The return value is a 4-tuple: `(data, ancdata, msg_flags,
        address)`. The *data* item is a `bytes` object holding the
        non-ancillary data received. The *ancdata* item is a list of zero
        or more tuples `(cmsg_level, cmsg_type, cmsg_data)` representing
        the ancillary data (control messages) received: *cmsg\_level* and
        *cmsg\_type* are integers specifying the protocol level and
        protocol-specific type respectively, and *cmsg\_data* is a
        `bytes` object holding the associated data. The *msg\_flags*
        item is the bitwise OR of various flags indicating conditions on
        the received message; see your system documentation for details.
        If the receiving socket is unconnected, *address* is the address of
        the sending socket, if available; otherwise, its value is
        unspecified.

        On some systems, `sendmsg()` and `recvmsg()` can be used to
        pass file descriptors between processes over an `AF_UNIX`
        socket. When this facility is used (it is often restricted to
        `SOCK_STREAM` sockets), `recvmsg()` will return, in its
        ancillary data, items of the form `(socket.SOL_SOCKET,
        socket.SCM_RIGHTS, fds)`, where *fds* is a `bytes` object
        representing the new file descriptors as a binary array of the
        native C int type. If `recvmsg()` raises an
        exception after the system call returns, it will first attempt to
        close any file descriptors received via this mechanism.

        Some systems do not indicate the truncated length of ancillary data
        items which have been only partially received. If an item appears
        to extend beyond the end of the buffer, `recvmsg()` will issue
        a `RuntimeWarning`, and will return the part of it which is
        inside the buffer provided it has not been truncated before the
        start of its associated data.

        On systems which support the `SCM_RIGHTS` mechanism, the
        following function will receive up to *maxfds* file descriptors,
        returning the message data and a list containing the descriptors
        (while ignoring unexpected conditions such as unrelated control
        messages being received). See also `sendmsg()`.

        ```
        import socket, array

        def recv_fds(sock, msglen, maxfds):
            fds = array.array("i")   # Array of ints
            msg, ancdata, flags, addr = sock.recvmsg(msglen, socket.CMSG_LEN(maxfds * fds.itemsize))
            for cmsg_level, cmsg_type, cmsg_data in ancdata:
                if cmsg_level == socket.SOL_SOCKET and cmsg_type == socket.SCM_RIGHTS:
                    # Append data, ignoring any truncated integers at the end.
                    fds.frombytes(cmsg_data[:len(cmsg_data) - (len(cmsg_data) % fds.itemsize)])
            return msg, list(fds)
        ```

        Availability: Unix.

        Most Unix platforms.

    recvmsg\_into(*buffers*[, *ancbufsize*[, *flags*]])
    :   Receive normal data and ancillary data from the socket, behaving as
        `recvmsg()` would, but scatter the non-ancillary data into a
        series of buffers instead of returning a new bytes object. The
        *buffers* argument must be an iterable of objects that export
        writable buffers (e.g. `bytearray` objects); these will be
        filled with successive chunks of the non-ancillary data until it
        has all been written or there are no more buffers. The operating
        system may set a limit (`sysconf()` value `SC_IOV_MAX`)
        on the number of buffers that can be used. The *ancbufsize* and
        *flags* arguments have the same meaning as for `recvmsg()`.

        The return value is a 4-tuple: `(nbytes, ancdata, msg_flags,
        address)`, where *nbytes* is the total number of bytes of
        non-ancillary data written into the buffers, and *ancdata*,
        *msg\_flags* and *address* are the same as for `recvmsg()`.

        Example:

        ```
        >>> import socket
        >>> s1, s2 = socket.socketpair()
        >>> b1 = bytearray(b'----')
        >>> b2 = bytearray(b'0123456789')
        >>> b3 = bytearray(b'--------------')
        >>> s1.send(b'Mary had a little lamb')
        22
        >>> s2.recvmsg_into([b1, memoryview(b2)[2:9], b3])
        (22, [], 0, None)
        >>> [b1, b2, b3]
        [bytearray(b'Mary'), bytearray(b'01 had a 9'), bytearray(b'little lamb---')]
        ```

        Availability: Unix.

        Most Unix platforms.

    recvfrom\_into(*buffer*[, *nbytes*[, *flags*]])
    :   Receive data from the socket, writing it into *buffer* instead of creating a
        new bytestring. The return value is a pair `(nbytes, address)` where *nbytes* is
        the number of bytes received and *address* is the address of the socket sending
        the data. See the Unix manual page *recv(2)* for the meaning of the
        optional argument *flags*; it defaults to zero. The format of *address*
        depends on the address family — see Socket families.

    recv\_into(*buffer*[, *nbytes*[, *flags*]])
    :   Receive up to *nbytes* bytes from the socket, storing the data into a buffer
        rather than creating a new bytestring. If *nbytes* is not specified (or 0),
        receive up to the size available in the given buffer. Returns the number of
        bytes received. See the Unix manual page *recv(2)* for the meaning
        of the optional argument *flags*; it defaults to zero.

    send(*bytes*[, *flags*])
    :   Send data to the socket. The socket must be connected to a remote socket. The
        optional *flags* argument has the same meaning as for `recv()`.
        Returns the number of bytes sent. Applications are responsible for checking that
        all data has been sent; if only some of the data was transmitted, the
        application needs to attempt delivery of the remaining data. For further
        information on this topic, consult the Socket Programming HOWTO.

    sendall(*bytes*[, *flags*])
    :   Send data to the socket. The socket must be connected to a remote socket. The
        optional *flags* argument has the same meaning as for `recv()`.
        Unlike `send()`, this method continues to send data from *bytes* until
        either all data has been sent or an error occurs. `None` is returned on
        success. On error, an exception is raised, and there is no way to determine how
        much data, if any, was successfully sent.

        Changed in version 3.5: The socket timeout is no longer reset each time data is sent successfully.
        The socket timeout is now the maximum total duration to send all data.

    sendto(*bytes*, *address*)

    sendto(*bytes*, *flags*, *address*)
    :   Send data to the socket. The socket should not be connected to a remote socket,
        since the destination socket is specified by *address*. The optional *flags*
        argument has the same meaning as for `recv()`. Return the number of
        bytes sent. The format of *address* depends on the address family — see
        Socket families.

        Raises an auditing event `socket.sendto` with arguments `self`, `address`.

    sendmsg(*buffers*[, *ancdata*[, *flags*[, *address*]]])
    :   Send normal and ancillary data to the socket, gathering the
        non-ancillary data from a series of buffers and concatenating it
        into a single message. The *buffers* argument specifies the
        non-ancillary data as an iterable of
        bytes-like objects
        (e.g. `bytes` objects); the operating system may set a limit
        (`sysconf()` value `SC_IOV_MAX`) on the number of buffers
        that can be used. The *ancdata* argument specifies the ancillary
        data (control messages) as an iterable of zero or more tuples
        `(cmsg_level, cmsg_type, cmsg_data)`, where *cmsg\_level* and
        *cmsg\_type* are integers specifying the protocol level and
        protocol-specific type respectively, and *cmsg\_data* is a
        bytes-like object holding the associated data. Note that
        some systems (in particular, systems without `CMSG_SPACE()`)
        might support sending only one control message per call. The
        *flags* argument defaults to 0 and has the same meaning as for
        `send()`. If *address* is supplied and not `None`, it sets a
        destination address for the message. The return value is the
        number of bytes of non-ancillary data sent.

        The following function sends the list of file descriptors *fds*
        over an `AF_UNIX` socket, on systems which support the
        `SCM_RIGHTS` mechanism. See also `recvmsg()`.

        ```
        import socket, array

        def send_fds(sock, msg, fds):
            return sock.sendmsg([msg], [(socket.SOL_SOCKET, socket.SCM_RIGHTS, array.array("i", fds))])
        ```

        Availability: Unix, not WASI.

        Most Unix platforms.

        Raises an auditing event `socket.sendmsg` with arguments `self`, `address`.

    sendmsg\_afalg([*msg*, ]*\**, *op*[, *iv*[, *assoclen*[, *flags*]]])
    :   Specialized version of `sendmsg()` for `AF_ALG` socket.
        Set mode, IV, AEAD associated data length and flags for `AF_ALG` socket.

        Availability: Linux >= 2.6.38.

    sendfile(*file*, *offset=0*, *count=None*)
    :   Send a file until EOF is reached by using high-performance
        `os.sendfile` and return the total number of bytes which were sent.
        *file* must be a regular file object opened in binary mode. If
        `os.sendfile` is not available (e.g. Windows) or *file* is not a
        regular file `send()` will be used instead. *offset* tells from where to
        start reading the file. If specified, *count* is the total number of bytes
        to transmit as opposed to sending the file until EOF is reached. File
        position is updated on return or also in case of error in which case
        `file.tell()` can be used to figure out the number of
        bytes which were sent. The socket must be of `SOCK_STREAM` type.
        Non-blocking sockets are not supported.

    set\_inheritable(*inheritable*)
    :   Set the inheritable flag of the socket’s file
        descriptor or socket’s handle.

    setblocking(*flag*)
    :   Set blocking or non-blocking mode of the socket: if *flag* is false, the
        socket is set to non-blocking, else to blocking mode.

        This method is a shorthand for certain `settimeout()` calls:

        - `sock.setblocking(True)` is equivalent to `sock.settimeout(None)`
        - `sock.setblocking(False)` is equivalent to `sock.settimeout(0.0)`

        Changed in version 3.7: The method no longer applies `SOCK_NONBLOCK` flag on
        `socket.type`.

    settimeout(*value*)
    :   Set a timeout on blocking socket operations. The *value* argument can be a
        nonnegative real number expressing seconds, or `None`.
        If a non-zero value is given, subsequent socket operations will raise a
        `timeout` exception if the timeout period *value* has elapsed before
        the operation has completed. If zero is given, the socket is put in
        non-blocking mode. If `None` is given, the socket is put in blocking mode.

        For further information, please consult the notes on socket timeouts.

        Changed in version 3.7: The method no longer toggles `SOCK_NONBLOCK` flag on
        `socket.type`.

        Changed in version 3.15: Accepts any real number, not only integer or float.

    setsockopt(*level*, *optname*, *value: int | Buffer*)

    setsockopt(*level*, *optname*, *None*, *optlen: int*)
    :   Set the value of the given socket option (see the Unix manual page
        *setsockopt(2)*). The needed symbolic constants are defined in this
        module (SO\_\* etc. <socket-unix-constants>). The value can be an integer,
        `None` or a bytes-like object representing a buffer. In the latter
        case it is up to the caller to ensure that the bytestring contains the
        proper bits (see the optional built-in module `struct` for a way to
        encode C structures as bytestrings). When *value* is set to `None`,
        *optlen* argument is required. It’s equivalent to calling `setsockopt()` C
        function with `optval=NULL` and `optlen=optlen`.

        Availability: not WASI.

    shutdown(*how*)
    :   Shut down one or both halves of the connection. If *how* is `SHUT_RD`,
        further receives are disallowed. If *how* is `SHUT_WR`, further sends
        are disallowed. If *how* is `SHUT_RDWR`, further sends and receives are
        disallowed.

        Availability: not WASI.

    share(*process\_id*)
    :   Duplicate a socket and prepare it for sharing with a target process. The
        target process must be provided with *process\_id*. The resulting bytes object
        can then be passed to the target process using some form of interprocess
        communication and the socket can be recreated there using `fromshare()`.
        Once this method has been called, it is safe to close the socket since
        the operating system has already duplicated it for the target process.

        Availability: Windows.

    Note that there are no methods `read()` or `write()`; use
    `recv()` and `send()` without *flags* argument instead.

    Socket objects also have these (read-only) attributes that correspond to the
    values given to the `socket` constructor.

    family
    :   The socket family.

    type
    :   The socket type.

    proto
    :   The socket protocol.

class socket.SocketType
:   The base class of the `socket` type, re-exported from
    `_socket`. An instance check such as
    `isinstance(socket(...), SocketType)` is true, but `SocketType` is not
    the same as `type(socket(...))`, which is `socket` itself.

## Notes on socket timeouts

A socket object can be in one of three modes: blocking, non-blocking, or
timeout. Sockets are by default always created in blocking mode, but this
can be changed by calling `setdefaulttimeout()`.

- In *blocking mode*, operations block until complete or the system returns
  an error (such as connection timed out).
- In *non-blocking mode*, operations fail (with an error that is unfortunately
  system-dependent) if they cannot be completed immediately: functions from the
  `select` module can be used to know when and whether a socket is available
  for reading or writing.
- In *timeout mode*, operations fail if they cannot be completed within the
  timeout specified for the socket (they raise a `timeout` exception)
  or if the system returns an error.

Note

At the operating system level, sockets in *timeout mode* are internally set
in non-blocking mode. Also, the blocking and timeout modes are shared between
file descriptors and socket objects that refer to the same network endpoint.
This implementation detail can have visible consequences if e.g. you decide
to use the `fileno()` of a socket.

### Timeouts and the `connect` method

The `connect()` operation is also subject to the timeout
setting, and in general it is recommended to call `settimeout()`
before calling `connect()` or pass a timeout parameter to
`create_connection()`. However, the system network stack may also
return a connection timeout error of its own regardless of any Python socket
timeout setting.

### Timeouts and the `accept` method

If `getdefaulttimeout()` is not `None`, sockets returned by
the `accept()` method inherit that timeout. Otherwise, the
behaviour depends on settings of the listening socket:

- if the listening socket is in *blocking mode* or in *timeout mode*,
  the socket returned by `accept()` is in *blocking mode*;
- if the listening socket is in *non-blocking mode*, whether the socket
  returned by `accept()` is in blocking or non-blocking mode
  is operating system-dependent. If you want to ensure cross-platform
  behaviour, it is recommended you manually override this setting.

## Example

Here are four minimal example programs using the TCP/IP protocol: a server that
echoes all data that it receives back (servicing only one client), and a client
using it. Note that a server must perform the sequence `socket()`,
`bind()`, `listen()`, `accept()` (possibly
repeating the `accept()` to service more than one client), while a
client only needs the sequence `socket()`, `connect()`. Also
note that the server does not `sendall()`/`recv()` on
the socket it is listening on but on the new socket returned by
`accept()`.

The first two examples support IPv4 only.

```
# Echo server program
import socket

HOST = ''                 # Symbolic name meaning all available interfaces
PORT = 50007              # Arbitrary non-privileged port
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen(1)
    conn, addr = s.accept()
    with conn:
        print('Connected by', addr)
        while True:
            data = conn.recv(1024)
            if not data: break
            conn.sendall(data)
```

```
# Echo client program
import socket

HOST = 'daring.cwi.nl'    # The remote host
PORT = 50007              # The same port as used by the server
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, PORT))
    s.sendall(b'Hello, world')
    data = s.recv(1024)
print('Received', repr(data))
```

The next two examples are identical to the above two, but support both IPv4 and
IPv6. The server side will listen to the first address family available (it
should listen to both instead). On most of IPv6-ready systems, IPv6 will take
precedence and the server may not accept IPv4 traffic. The client side will try
to connect to all the addresses returned as a result of the name resolution, and
sends traffic to the first one connected successfully.

```
# Echo server program
import socket
import sys

HOST = None               # Symbolic name meaning all available interfaces
PORT = 50007              # Arbitrary non-privileged port
s = None
for res in socket.getaddrinfo(HOST, PORT, socket.AF_UNSPEC,
                              socket.SOCK_STREAM, 0, socket.AI_PASSIVE):
    af, socktype, proto, canonname, sa = res
    try:
        s = socket.socket(af, socktype, proto)
    except OSError as msg:
        s = None
        continue
    try:
        s.bind(sa)
        s.listen(1)
    except OSError as msg:
        s.close()
        s = None
        continue
    break
if s is None:
    print('could not open socket')
    sys.exit(1)
conn, addr = s.accept()
with conn:
    print('Connected by', addr)
    while True:
        data = conn.recv(1024)
        if not data: break
        conn.send(data)
```

```
# Echo client program
import socket
import sys

HOST = 'daring.cwi.nl'    # The remote host
PORT = 50007              # The same port as used by the server
s = None
for res in socket.getaddrinfo(HOST, PORT, socket.AF_UNSPEC, socket.SOCK_STREAM):
    af, socktype, proto, canonname, sa = res
    try:
        s = socket.socket(af, socktype, proto)
    except OSError as msg:
        s = None
        continue
    try:
        s.connect(sa)
    except OSError as msg:
        s.close()
        s = None
        continue
    break
if s is None:
    print('could not open socket')
    sys.exit(1)
with s:
    s.sendall(b'Hello, world')
    data = s.recv(1024)
print('Received', repr(data))
```

The next example shows how to write a very simple network sniffer with raw
sockets on Windows. The example requires administrator privileges to modify
the interface:

```
import socket

# the public network interface
HOST = socket.gethostbyname(socket.gethostname())

# create a raw socket and bind it to the public interface
s = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_IP)
s.bind((HOST, 0))

# Include IP headers
s.setsockopt(socket.IPPROTO_IP, socket.IP_HDRINCL, 1)

# receive all packets
s.ioctl(socket.SIO_RCVALL, socket.RCVALL_ON)

# receive a packet
print(s.recvfrom(65565))

# disabled promiscuous mode
s.ioctl(socket.SIO_RCVALL, socket.RCVALL_OFF)
```

The next example shows how to use the socket interface to communicate to a CAN
network using the raw socket protocol. To use CAN with the broadcast
manager protocol instead, open a socket with:

```
socket.socket(socket.AF_CAN, socket.SOCK_DGRAM, socket.CAN_BCM)
```

After binding (`CAN_RAW`) or connecting (`CAN_BCM`) the socket, you
can use the `socket.send()` and `socket.recv()` operations (and
their counterparts) on the socket object as usual.

This last example might require special privileges:

```
import socket
import struct

# CAN frame packing/unpacking (see 'struct can_frame' in <linux/can.h>)

can_frame_fmt = "=IB3x8s"
can_frame_size = struct.calcsize(can_frame_fmt)

def build_can_frame(can_id, data):
    can_dlc = len(data)
    data = data.ljust(8, b'\x00')
    return struct.pack(can_frame_fmt, can_id, can_dlc, data)

def dissect_can_frame(frame):
    can_id, can_dlc, data = struct.unpack(can_frame_fmt, frame)
    return (can_id, can_dlc, data[:can_dlc])

# create a raw socket and bind it to the 'vcan0' interface
s = socket.socket(socket.AF_CAN, socket.SOCK_RAW, socket.CAN_RAW)
s.bind(('vcan0',))

while True:
    cf, addr = s.recvfrom(can_frame_size)

    print('Received: can_id=%x, can_dlc=%x, data=%s' % dissect_can_frame(cf))

    try:
        s.send(cf)
    except OSError:
        print('Error sending CAN frame')

    try:
        s.send(build_can_frame(0x01, b'\x01\x02\x03'))
    except OSError:
        print('Error sending CAN frame')
```

Running an example several times with too small delay between executions, could
lead to this error:

```
OSError: [Errno 98] Address already in use
```

This is because the previous execution has left the socket in a `TIME_WAIT`
state, and can’t be immediately reused.

There is a `socket` flag to set, in order to prevent this,
`socket.SO_REUSEADDR`:

```
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind((HOST, PORT))
```

the `SO_REUSEADDR` flag tells the kernel to reuse a local socket in
`TIME_WAIT` state, without waiting for its natural timeout to expire.

See also

For an introduction to socket programming (in C), see the following papers:

- *An Introductory 4.3BSD Interprocess Communication Tutorial*, by Stuart Sechrest
- *An Advanced 4.3BSD Interprocess Communication Tutorial*, by Samuel J. Leffler et
  al,

both in the UNIX Programmer’s Manual, Supplementary Documents 1 (sections
PS1:7 and PS1:8). The platform-specific reference material for the various
socket-related system calls are also a valuable source of information on the
details of socket semantics. For Unix, refer to the manual pages; for Windows,
see the WinSock (or Winsock 2) specification. For IPv6-ready APIs, readers may
want to refer to **RFC 3493** titled Basic Socket Interface Extensions for IPv6.
