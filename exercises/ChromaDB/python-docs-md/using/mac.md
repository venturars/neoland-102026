---
page: using/mac.html
title: 5. Using Python on macOS
area: using
kind: guide
---

<!-- anchor: using-python-on-macos | type: section -->
# 5. Using Python on macOS

This document aims to give an overview of macOS-specific behavior you should know about to get started with Python on Mac computers. Python on a Mac running macOS is very similar to Python on other Unix-derived platforms, but there are some differences in installation and some features.

There are various ways to obtain and install Python for macOS. Pre-built versions of the most recent versions of Python are available from a number of distributors. Much of this document describes use of the Pythons provided by the CPython release team for download from the python.org website. See Alternative distributions for some other options.

<!-- anchor: using-python-for-macos-from-python-org | type: section -->
## 5.1. Using Python for macOS from `python.org`

<!-- anchor: installation-steps | type: section -->
### 5.1.1. Installation steps

For current Python versions (other than those in `security` status), the release team produces a **Python for macOS** installer package for each new release. A list of available installers is provided on the macOS downloads page. We recommend using the most recent supported Python version where possible. Current installers provide a universal2 binary build of Python which runs natively on all Macs (Apple Silicon and Intel) that are supported by a wide range of macOS versions, currently typically from at least **macOS 10.15 Catalina** on.

The downloaded file is a standard macOS installer package file (`.pkg`). File integrity information (such as checksum, size, and Sigstore signature) for each file is included on the release download page. Installer packages and their contents are signed and notarized with `Python Software Foundation` Apple Developer ID certificates to meet macOS Gatekeeper requirements.

For a default installation, double-click on the downloaded installer package file. This should launch the standard macOS Installer app and display the first of several installer steps.

[Image: ../_images/mac_installer_01_introduction.png]

Clicking on the **Continue** button brings up the **Read Me** for this installer. Besides other important information, the **Read Me** documents which Python version is going to be installed and on what versions of macOS it is supported. You may need to scroll through to read the whole file. By default, this **Read Me** will also be installed in `/Applications/Python 3.15/` and available to read anytime.

[Image: ../_images/mac_installer_02_readme.png]

Clicking on **Continue** proceeds to display the license for Python and for other included software. You will then need to **Agree** to the license terms before proceeding to the next step. This license file will also be installed and available to be read later.

[Image: ../_images/mac_installer_03_license.png]

After the license terms are accepted, the next step is the **Installation Type** display. For most uses, the standard set of installation operations is appropriate.

[Image: ../_images/mac_installer_04_installation_type.png]

By pressing the **Customize** button, you can choose to omit or select certain package components of the installer. Click on each package name to see a description of what it installs. For details of the optional free-threaded feature, which is installed by default, see Installing free-threaded binaries.

[Image: ../_images/mac_installer_05_custom_install.png]

In either case, clicking **Install** will begin the install process by asking permission to install new software. A macOS user name with `Administrator` privilege is needed as the installed Python will be available to all users of the Mac.

When the installation is complete, the **Summary** window will appear.

[Image: ../_images/mac_installer_06_summary.png]

Double-click on the **Install Certificates.command** icon or file in the `/Applications/Python 3.15/` window to complete the installation.

[Image: ../_images/mac_installer_07_applications.png]

This will open a temporary **Terminal** shell window that will use the new Python to download and install SSL root certificates for its use.

[Image: ../_images/mac_installer_08_install_certificates.png]

If `Successfully installed certifi` and `update complete` appear in the terminal window, the installation is complete. Close this terminal window and the installer window.

A default install will include:

- A `Python 3.15` folder in your `Applications` folder. In here you find **IDLE**, the development environment that is a standard part of official Python distributions; and **Python Launcher**, which handles double-clicking Python scripts from the macOS Finder.

- A framework `/Library/Frameworks/Python.framework`, which includes the Python executable and libraries. The installer adds this location to your shell path. To uninstall Python, you can remove these three things. Symlinks to the Python executable are placed in `/usr/local/bin/`.

**Note:**

Recent versions of macOS include a **python3** command in `/usr/bin/python3` that links to a usually older and incomplete version of Python provided by and for use by the Apple development tools, **Xcode** or the **Command Line Tools for Xcode**. You should never modify or attempt to delete this installation, as it is Apple-controlled and is used by Apple-provided or third-party software. If you choose to install a newer Python version from `python.org`, you will have two different but functional Python installations on your computer that can co-exist. The default installer options should ensure that its **python3** will be used instead of the system **python3**.

<!-- anchor: how-to-run-a-python-script | type: section -->
### 5.1.2. How to run a Python script

There are two ways to invoke the Python interpreter. If you are familiar with using a Unix shell in a terminal window, you can invoke `python3.15` or `python3` optionally followed by one or more command line options (described in Command line and environment). The Python tutorial also has a useful section on using Python interactively from a shell.

You can also invoke the interpreter through an integrated development environment. IDLE — Python editor and shell is a basic editor and interpreter environment which is included with the standard distribution of Python. **IDLE** includes a Help menu that allows you to access Python documentation. If you are completely new to Python, you can read the tutorial introduction in that document.

There are many other editors and IDEs available, see Editors and IDEs for more information.

To run a Python script file from the terminal window, you can invoke the interpreter with the name of the script file:

`python3.15` `myscript.py`

To run your script from the Finder, you can either:

- Drag it to **Python Launcher**.

- Select **Python Launcher** as the default application to open your script (or any `.py` script) through the Finder Info window and double-click it. **Python Launcher** has various preferences to control how your script is launched. Option-dragging allows you to change these for one invocation, or use its `Preferences` menu to change things globally.

Be aware that running the script directly from the macOS Finder might produce different results than when running from a terminal window as the script will not be run in the usual shell environment including any setting of environment variables in shell profiles. And, as with any other script or program, be certain of what you are about to run.

<!-- anchor: alternative-distributions | type: section -->
## 5.2. Alternative distributions

Besides the standard `python.org` for macOS installer, there are third-party distributions for macOS that may include additional functionality. Some popular distributions and their key features:

**ActivePython**

Installer with multi-platform compatibility, documentation

**Anaconda**

Popular scientific modules (such as numpy, scipy, and pandas) and the `conda` package manager.

**Homebrew**

Package manager for macOS including multiple versions of Python and many third-party Python-based packages (including numpy, scipy, and pandas).

**MacPorts**

Another package manager for macOS including multiple versions of Python and many third-party Python-based packages. May include pre-built versions of Python and many packages for older versions of macOS.

Note that distributions might not include the latest versions of Python or other libraries, and are not maintained or supported by the core Python team.

<!-- anchor: installing-additional-python-packages | type: section -->
## 5.3. Installing additional Python packages

Refer to the Python Packaging User Guide for more information.

<!-- anchor: gui-programming | type: section -->
## 5.4. GUI programming

There are several options for building GUI applications on the Mac with Python.

The standard Python GUI toolkit is `tkinter`, based on the cross-platform Tk toolkit (https://www.tcl.tk). A macOS-native version of Tk is included with the installer.

*PyObjC* is a Python binding to Apple’s Objective-C/Cocoa framework. Information on PyObjC is available from pyobjc.

A number of alternative macOS GUI toolkits are available including:

- PySide: Official Python bindings to the Qt GUI toolkit.

- PyQt: Alternative Python bindings to Qt.

- Kivy: A cross-platform GUI toolkit that supports desktop and mobile platforms.

- Toga: Part of the BeeWare Project; supports desktop, mobile, web and console apps.

- wxPython: A cross-platform toolkit that supports desktop operating systems.

<!-- anchor: advanced-topics | type: section -->
## 5.5. Advanced topics

<!-- anchor: installing-free-threaded-binaries | type: section -->
### 5.5.1. Installing free-threaded binaries

Added in version 3.13.

Changed in version 3.15: Free-threading support is now installed by default.

The `python.org` Python for macOS installer package installs, by default, an additional build of Python 3.15 that supports free threading (running with the global interpreter lock disabled). Check the release page on `python.org` for possible updated information.

The free-threaded mode is working and continues to be improved, but there is some additional overhead in single-threaded workloads compared to the regular build. Additionally, third-party packages, in particular ones with an extension module, may not be ready for use in a free-threaded build, and will re-enable the GIL. As of Python 3.15, free-threading support is installed by default. It is packaged as a separate install option, which can be deselected by clicking the **Customize** button on the **Installation Type** step of the installer as described above.

[Image: ../_images/mac_installer_09_custom_install_free_threaded.png]

If the box next to the **Free-threaded Python** package name is checked (as it is by default), a separate `PythonT.framework` will also be installed alongside the normal `Python.framework` in `/Library/Frameworks`. This configuration allows a free-threaded Python 3.15 build to co-exist on your system with a traditional (GIL only) Python 3.15 build with minimal risk while installing or testing. This installation layout may change in future releases.

Known cautions and limitations:

- The **UNIX command-line tools** package, which is selected by default, will install links in `/usr/local/bin` for `python3.15t`, the free-threaded interpreter, and `python3.15t-config`, a configuration utility which may be useful for package builders. Since `/usr/local/bin` is typically included in your shell `PATH`, in most cases no changes to your `PATH` environment variable should be needed to use `python3.15t`.

- For this release, the **Shell profile updater** package and the `Update Shell Profile.command` in `/Applications/Python 3.15/` do not support the free-threaded package.

- The free-threaded build and the traditional build have separate search paths and separate `site-packages` directories so, by default, if you need a package available in both builds, it may need to be installed in both. The free-threaded package will install a separate instance of **pip** for use with `python3.15t`.

  - To install a package using **pip** without a **venv**:

    ```
    python3.15t -m pip install <package_name>
    ```

- When working with multiple Python environments, it is usually safest and easiest to create and use virtual environments. This can avoid possible command name conflicts and confusion about which Python is in use:

  ```
  python3.15t -m venv <venv_name>
  ```

  then **activate**.

- To run a free-threaded version of IDLE:

  ```
  python3.15t -m idlelib
  ```

- The interpreters in both builds respond to the same PYTHON environment variables which may have unexpected results, for example, if you have `PYTHONPATH` set in a shell profile. If necessary, there are command line options like `-E` to ignore these environment variables.

- The free-threaded build links to the third-party shared libraries, such as `OpenSSL` and `Tk`, installed in the traditional framework. This means that both builds also share one set of trust certificates as installed by the **Install Certificates.command** script, thus it only needs to be run once.

- If you cannot depend on the link in `/usr/local/bin` pointing to the `python.org` free-threaded `python3.15t` (for example, if you want to install your own version there or some other distribution does), you can explicitly set your shell `PATH` environment variable to include the `PythonT` framework `bin` directory:

  ```
  export PATH="/Library/Frameworks/PythonT.framework/Versions/3.15/bin":"$PATH"
  ```

  The traditional framework installation by default does something similar, except for `Python.framework`. Be aware that having both framework `bin` directories in `PATH` can lead to confusion if there are duplicate names like `python3.15` in both; which one is actually used depends on the order they appear in `PATH`. The `which python3.x` or `which python3.xt` commands can show which path is being used. Using virtual environments can help avoid such ambiguities. Another option might be to create a shell **alias** to the desired interpreter, like:

  ```
  alias py3.15="/Library/Frameworks/Python.framework/Versions/3.15/bin/python3.15"
  alias py3.15t="/Library/Frameworks/PythonT.framework/Versions/3.15/bin/python3.15t"
  ```

<!-- anchor: installing-using-the-command-line | type: section -->
### 5.5.2. Installing using the command line

If you want to use automation to install the `python.org` installer package (rather than by using the familiar macOS **Installer** GUI app), the macOS command line **installer** utility lets you select non-default options, too. If you are not familiar with **installer**, it can be somewhat cryptic (see **man installer** for more information). As an example, the following shell snippet shows one way to do it, using the `3.15.0b2` release and deselecting the free-threaded interpreter option:

```
RELEASE="python-3.150b2-macos11.pkg"

# download installer pkg
curl -O https://www.python.org/ftp/python/3.15.0/${RELEASE}

# create installer choicechanges to customize the install:
#    disable the PythonTFramework-3.15 package
#    while accepting the other defaults (install all other packages)
cat > ./choicechanges.plist <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<array>
        <dict>
                <key>attributeSetting</key>
                <integer>0</integer>
                <key>choiceAttribute</key>
                <string>selected</string>
                <key>choiceIdentifier</key>
                <string>org.python.Python.PythonTFramework-3.15</string>
        </dict>
</array>
</plist>
EOF

sudo installer -pkg ./${RELEASE} -applyChoiceChangesXML ./choicechanges.plist -target /
```

After a default install, you can test that both builds are available with something like:

```
$ # test that the free-threaded interpreter was installed if the Unix Command Tools package was enabled
$ /usr/local/bin/python3.15t -VV
Python 3.15.0b2 free-threading build (v3.15.0b2:3a83b172af, Jun  5 2024, 12:57:31) [Clang 15.0.0 (clang-1500.3.9.4)]
$ #    and the traditional interpreter
$ /usr/local/bin/python3.15 -VV
Python 3.15.0b2 (v3.15.0b2:3a83b172af, Jun  5 2024, 12:50:24) [Clang 15.0.0 (clang-1500.3.9.4)]
$ # test that they are also available without the prefix if /usr/local/bin is on $PATH
$ python3.15t -VV
Python 3.15.0b2 free-threading build (v3.15.0b2:3a83b172af, Jun  5 2024, 12:57:31) [Clang 15.0.0 (clang-1500.3.9.4)]
$ python3.15 -VV
Python 3.15.0b2 (v3.15.0b2:3a83b172af, Jun  5 2024, 12:50:24) [Clang 15.0.0 (clang-1500.3.9.4)]
```

**Note:**

Current `python.org` installers only install to fixed locations like `/Library/Frameworks/`, `/Applications`, and `/usr/local/bin`. You cannot use the **installer** `-domain` option to install to other locations.

<!-- anchor: distributing-python-applications | type: section -->
### 5.5.3. Distributing Python applications

A range of tools exist for converting your Python code into a standalone distributable application:

- py2app: Supports creating macOS `.app` bundles from a Python project.

- Briefcase: Part of the BeeWare Project; a cross-platform packaging tool that supports creation of `.app` bundles on macOS, as well as managing signing and notarization.

- PyInstaller: A cross-platform packaging tool that creates a single file or folder as a distributable artifact.

<!-- anchor: app-store-compliance | type: section -->
### 5.5.4. App Store compliance

Apps submitted for distribution through the macOS App Store must pass Apple’s app review process. This process includes a set of automated validation rules that inspect the submitted application bundle for problematic code.

The Python standard library contains some code that is known to violate these automated rules. While these violations appear to be false positives, Apple’s review rules cannot be challenged. Therefore, it is necessary to modify the Python standard library for an app to pass App Store review.

The Python source tree contains a patch file that will remove all code that is known to cause issues with the App Store review process. This patch is applied automatically when CPython is configured with the `--with-app-store-compliance` option.

This patch is not normally required to use CPython on a Mac; nor is it required if you are distributing an app *outside* the macOS App Store. It is *only* required if you are using the macOS App Store as a distribution channel.

<!-- anchor: other-resources | type: section -->
## 5.6. Other resources

The python.org Help page has links to many useful resources. The Pythonmac-SIG mailing list is another support resource specifically for Python users and developers on the Mac.
