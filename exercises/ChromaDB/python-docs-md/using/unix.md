---
page: using/unix.html
title: 2. Using Python on Unix platforms
area: using
kind: guide
---

<!-- anchor: using-python-on-unix-platforms | type: section -->
# 2. Using Python on Unix platforms

<!-- anchor: getting-and-installing-the-latest-version-of-python | type: section -->
## 2.1. Getting and installing the latest version of Python

<!-- anchor: on-linux | type: section -->
### 2.1.1. On Linux

Python comes preinstalled on most Linux distributions, and is available as a package on all others. However there are certain features you might want to use that are not available on your distro’s package. You can compile the latest version of Python from source.

In the event that the latest version of Python doesn’t come preinstalled and isn’t in the repositories as well, you can make packages for your own distro. Have a look at the following links:

**See also:**

**https://www.debian.org/doc/manuals/maint-guide/first.en.html**

for Debian users

**https://en.opensuse.org/Portal:Packaging**

for OpenSuse users

**https://docs.fedoraproject.org/en-US/package-maintainers/Packaging_Tutorial_GNU_Hello/**

for Fedora users

**https://slackbook.org/html/package-management-making-packages.html**

for Slackware users

<!-- anchor: installing-idle | type: section -->
#### 2.1.1.1. Installing IDLE

In some cases, IDLE might not be included in your Python installation.

- For Debian and Ubuntu users:

  ```sh
  sudo apt update
  sudo apt install idle
  ```

- For Fedora, RHEL, and CentOS users:

  ```sh
  sudo dnf install python3-idle
  ```

- For SUSE and OpenSUSE users:

  ```sh
  sudo zypper install python3-idle
  ```

- For Alpine Linux users:

  ```sh
  sudo apk add python3-idle
  ```

<!-- anchor: on-freebsd-and-openbsd | type: section -->
### 2.1.2. On FreeBSD and OpenBSD

- FreeBSD users, to add the package use:

  ```sh
  pkg install python3
  ```

- OpenBSD users, to add the package use:

  ```sh
  pkg_add -r python

  pkg_add ftp://ftp.openbsd.org/pub/OpenBSD/4.2/packages/<insert your architecture here>/python-<version>.tgz
  ```

  For example i386 users get the 2.5.1 version of Python using:

  ```sh
  pkg_add ftp://ftp.openbsd.org/pub/OpenBSD/4.2/packages/i386/python-2.5.1p2.tgz
  ```

<!-- anchor: building-python | type: section -->
## 2.2. Building Python

**See also:**

If you want to contribute to CPython, refer to the devguide, which includes build instructions and other tips on setting up environment.

If you want to compile CPython yourself, first thing you should do is get the source. You can download either the latest release’s source or grab a fresh clone. You will also need to install the build requirements.

The build process consists of the usual commands:

```sh
./configure
make
make install
```

Configuration options and caveats for specific Unix platforms are extensively documented in the README.rst file in the root of the Python source tree.

**Warning:**

`make install` can overwrite or masquerade the `python3` binary. `make altinstall` is therefore recommended instead of `make install` since it only installs `exec_prefix/bin/pythonversion`.

<!-- anchor: python-related-paths-and-files | type: section -->
## 2.3. Python-related paths and files

These are subject to difference depending on local installation conventions; `prefix` and `exec_prefix` are installation-dependent and should be interpreted as for GNU software; they may be the same.

For example, on most Linux systems, the default for both is `/usr`.

| File/directory | Meaning |
| --- | --- |
| `exec_prefix/bin/python3` | Recommended location of the interpreter. |
| `prefix/lib/pythonversion`, `exec_prefix/lib/pythonversion` | Recommended locations of the directories containing the standard modules. |
| `prefix/include/pythonversion`, `exec_prefix/include/pythonversion` | Recommended locations of the directories containing the include files needed for developing Python extensions and embedding the interpreter. |

<!-- anchor: miscellaneous | type: section -->
## 2.4. Miscellaneous

To easily use Python scripts on Unix, you need to make them executable, e.g. with

```shell-session
$ chmod +x script
```

and put an appropriate Shebang line at the top of the script. A good choice is usually

```sh
#!/usr/bin/env python3
```

which searches for the Python interpreter in the whole `PATH`. However, some Unices may not have the **env** command, so you may need to hardcode `/usr/bin/python3` as the interpreter path.

To use shell commands in your Python scripts, look at the `subprocess` module.

<!-- anchor: custom-openssl | type: section -->
## 2.5. Custom OpenSSL

1. To use your vendor’s OpenSSL configuration and system trust store, locate the directory with `openssl.cnf` file or symlink in `/etc`. On most distribution the file is either in `/etc/ssl` or `/etc/pki/tls`. The directory should also contain a `cert.pem` file and/or a `certs` directory.

   ```shell-session
   $ find /etc/ -name openssl.cnf -printf "%h\n"
   /etc/ssl
   ```

2. Download, build, and install OpenSSL. Make sure you use `install_sw` and not `install`. The `install_sw` target does not override `openssl.cnf`.

   ```shell-session
   $ curl -O https://www.openssl.org/source/openssl-VERSION.tar.gz
   $ tar xzf openssl-VERSION
   $ pushd openssl-VERSION
   $ ./config \
       --prefix=/usr/local/custom-openssl \
       --libdir=lib \
       --openssldir=/etc/ssl
   $ make -j1 depend
   $ make -j8
   $ make install_sw
   $ popd
   ```

3. Build Python with custom OpenSSL (see the configure `--with-openssl` and `--with-openssl-rpath` options)

   ```shell-session
   $ pushd python-3.x.x
   $ ./configure -C \
       --with-openssl=/usr/local/custom-openssl \
       --with-openssl-rpath=auto \
       --prefix=/usr/local/python-3.x.x
   $ make -j8
   $ make altinstall
   ```

**Note:**

Patch releases of OpenSSL have a backwards compatible ABI. You don’t need to recompile Python to update OpenSSL. It’s sufficient to replace the custom OpenSSL installation with a newer version.
