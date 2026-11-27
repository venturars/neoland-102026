# Audit events table

This table contains all events raised by `sys.audit()` or
`PySys_Audit()` calls throughout the CPython runtime and the
standard library. These calls were added in 3.8 or later (see **PEP 578**).

See `sys.addaudithook()` and `PySys_AddAuditHook()` for
information on handling these events.

**CPython implementation detail:** This table is generated from the CPython documentation, and may not
represent events raised by other implementations. See your runtime
specific documentation for actual events raised.

| Audit event | Arguments | References |
| --- | --- | --- |
| \_thread.start\_new\_thread | `function`, `args`, `kwargs` | [[1]](_thread.md#start_new_thread) |
| array.\_\_new\_\_ | `typecode`, `initializer` | [[1]](array.md#array.array) |
| builtins.breakpoint | `breakpointhook` | [[1]](../builtins/functions.md#breakpoint) |
| builtins.id | `id` | [[1]](../builtins/functions.md#id) |
| builtins.input | `prompt` | [[1]](../builtins/functions.md#input) |
| builtins.input/result | `result` | [[1]](../builtins/functions.md#input) |
| code.\_\_new\_\_ | `code`, `filename`, `name`, `argcount`, `posonlyargcount`, `kwonlyargcount`, `nlocals`, `stacksize`, `flags` | [[1]](types.md#types.CodeType) |
| compile | `source`, `filename` | [[1]](../builtins/functions.md#compile) |
| cpython.PyConfig\_Set | `name`, `value` | [[1]](../c-api/init_config.md#c.PyConfig_Set) |
| cpython.PyInterpreterState\_Clear |  | [[1]](../c-api/subinterpreters.md#c.PyInterpreterState_Clear) |
| cpython.PyInterpreterState\_New |  | [[1]](../c-api/subinterpreters.md#c.PyInterpreterState_New) |
| cpython.\_PySys\_ClearAuditHooks |  | [[1]](../c-api/interp-lifecycle.md#c.Py_FinalizeEx) |
| cpython.remote\_debugger\_script | `script_path` | [[1]](sys.md#audit_event_cpython_remote_debugger_script_0) |
| cpython.run\_command | `command` | [[1]](../using/cmdline.md#cmdoption-c) |
| cpython.run\_file | `filename` | [[1]](../using/cmdline.md#audit_event_cpython_run_file_0) |
| cpython.run\_interactivehook | `hook` | [[1]](sys.md#sys.__interactivehook__) |
| cpython.run\_module | `module-name` | [[1]](../using/cmdline.md#cmdoption-m) |
| cpython.run\_startup | `filename` | [[1]](../using/cmdline.md#envvar-PYTHONSTARTUP) |
| cpython.run\_stdin |  | [[1]](asyncio.md#audit_event_cpython_run_stdin_0)[[2]](../using/cmdline.md#audit_event_cpython_run_stdin_0)[[3]](../using/cmdline.md#audit_event_cpython_run_stdin_1) |
| ctypes.addressof | `obj` | [[1]](ctypes.md#ctypes.addressof) |
| ctypes.call\_function | `func_pointer`, `arguments` | [[1]](ctypes.md#foreign-functions) |
| ctypes.cdata | `address` | [[1]](ctypes.md#ctypes._CData.from_address) |
| ctypes.cdata/buffer | `pointer`, `size`, `offset` | [[1]](ctypes.md#ctypes._CData.from_buffer)[[2]](ctypes.md#ctypes._CData.from_buffer_copy) |
| ctypes.create\_string\_buffer | `init`, `size` | [[1]](ctypes.md#ctypes.create_string_buffer) |
| ctypes.create\_unicode\_buffer | `init`, `size` | [[1]](ctypes.md#ctypes.create_unicode_buffer) |
| ctypes.dlopen | `name` | [[1]](ctypes.md#ctypes.LibraryLoader) |
| ctypes.dlsym | `library`, `name` | [[1]](ctypes.md#ctypes.LibraryLoader) |
| ctypes.dlsym/handle | `handle`, `name` | [[1]](ctypes.md#ctypes.LibraryLoader) |
| ctypes.get\_errno |  | [[1]](ctypes.md#ctypes.get_errno) |
| ctypes.get\_last\_error |  | [[1]](ctypes.md#ctypes.get_last_error) |
| ctypes.memoryview\_at | `address`, `size`, `readonly` | [[1]](ctypes.md#audit_event_ctypes_memoryview_at_0) |
| ctypes.set\_errno | `errno` | [[1]](ctypes.md#ctypes.set_errno) |
| ctypes.set\_exception | `code` | [[1]](ctypes.md#foreign-functions) |
| ctypes.set\_last\_error | `error` | [[1]](ctypes.md#ctypes.set_last_error) |
| ctypes.string\_at | `ptr`, `size` | [[1]](ctypes.md#ctypes.string_at) |
| ctypes.wstring\_at | `ptr`, `size` | [[1]](ctypes.md#ctypes.wstring_at) |
| ensurepip.bootstrap | `root` | [[1]](ensurepip.md#ensurepip.bootstrap) |
| exec | `code_object` | [[1]](../builtins/functions.md#eval)[[2]](../builtins/functions.md#exec) |
| fcntl.fcntl | `fd`, `cmd`, `arg` | [[1]](fcntl.md#fcntl.fcntl) |
| fcntl.flock | `fd`, `operation` | [[1]](fcntl.md#fcntl.flock) |
| fcntl.ioctl | `fd`, `request`, `arg` | [[1]](fcntl.md#fcntl.ioctl) |
| fcntl.lockf | `fd`, `cmd`, `len`, `start`, `whence` | [[1]](fcntl.md#fcntl.lockf) |
| ftplib.connect | `self`, `host`, `port` | [[1]](ftplib.md#ftplib.FTP.connect) |
| ftplib.sendcmd | `self`, `cmd` | [[1]](ftplib.md#ftplib.FTP.sendcmd)[[2]](ftplib.md#ftplib.FTP.voidcmd) |
| function.\_\_new\_\_ | `code` | [[1]](types.md#types.FunctionType) |
| gc.get\_objects | `generation` | [[1]](gc.md#gc.get_objects) |
| gc.get\_referents | `objs` | [[1]](gc.md#gc.get_referents) |
| gc.get\_referrers | `objs` | [[1]](gc.md#gc.get_referrers) |
| glob.glob | `pathname`, `recursive` | [[1]](glob.md#glob.glob)[[2]](glob.md#glob.iglob) |
| glob.glob/2 | `pathname`, `recursive`, `root_dir`, `dir_fd` | [[1]](glob.md#glob.glob)[[2]](glob.md#glob.iglob) |
| http.client.connect | `self`, `host`, `port` | [[1]](http.client.md#http.client.HTTPConnection.connect) |
| http.client.send | `self`, `data` | [[1]](http.client.md#http.client.HTTPConnection.send) |
| imaplib.open | `self`, `host`, `port` | [[1]](imaplib.md#imaplib.IMAP4.open) |
| imaplib.send | `self`, `data` | [[1]](imaplib.md#imaplib.IMAP4.send) |
| import | `module`, `filename`, `sys.path`, `sys.meta_path`, `sys.path_hooks` | [[1]](../reference/simple_stmts.md#import) |
| marshal.dumps | `value`, `version` | [[1]](marshal.md#marshal.dump) |
| marshal.load |  | [[1]](marshal.md#marshal.load) |
| marshal.loads | `bytes` | [[1]](marshal.md#marshal.load) |
| mmap.\_\_new\_\_ | `fileno`, `length`, `access`, `offset` | [[1]](mmap.md#mmap.mmap) |
| msvcrt.get\_osfhandle | `fd` | [[1]](msvcrt.md#msvcrt.get_osfhandle) |
| msvcrt.locking | `fd`, `mode`, `nbytes` | [[1]](msvcrt.md#msvcrt.locking) |
| msvcrt.open\_osfhandle | `handle`, `flags` | [[1]](msvcrt.md#msvcrt.open_osfhandle) |
| object.\_\_delattr\_\_ | `obj`, `name` | [[1]](../reference/datamodel.md#object.__delattr__) |
| object.\_\_getattr\_\_ | `obj`, `name` | [[1]](../reference/datamodel.md#object.__getattribute__) |
| object.\_\_setattr\_\_ | `obj`, `name`, `value` | [[1]](../reference/datamodel.md#object.__setattr__) |
| open | `path`, `mode`, `flags` | [[1]](../builtins/functions.md#open)[[2]](io.md#io.open)[[3]](os.md#os.open) |
| os.\_clearenv |  | [[1]](os.md#os._clearenv) |
| os.add\_dll\_directory | `path` | [[1]](os.md#os.add_dll_directory) |
| os.chdir | `path` | [[1]](os.md#os.chdir)[[2]](os.md#os.fchdir) |
| os.chflags | `path`, `flags` | [[1]](os.md#os.chflags)[[2]](os.md#os.lchflags) |
| os.chmod | `path`, `mode`, `dir_fd` | [[1]](os.md#os.chmod)[[2]](os.md#os.fchmod)[[3]](os.md#os.lchmod) |
| os.chown | `path`, `uid`, `gid`, `dir_fd` | [[1]](os.md#os.chown)[[2]](os.md#os.fchown)[[3]](os.md#os.lchown) |
| os.exec | `path`, `args`, `env` | [[1]](os.md#os.execl) |
| os.fork |  | [[1]](os.md#os.fork) |
| os.forkpty |  | [[1]](os.md#os.forkpty) |
| os.fwalk | `top`, `topdown`, `onerror`, `follow_symlinks`, `dir_fd` | [[1]](os.md#os.fwalk) |
| os.getxattr | `path`, `attribute` | [[1]](os.md#os.getxattr) |
| os.kill | `pid`, `sig` | [[1]](os.md#os.kill) |
| os.killpg | `pgid`, `sig` | [[1]](os.md#os.killpg) |
| os.link | `src`, `dst`, `src_dir_fd`, `dst_dir_fd` | [[1]](os.md#os.link) |
| os.listdir | `path` | [[1]](os.md#os.listdir) |
| os.listdrives |  | [[1]](os.md#os.listdrives) |
| os.listmounts | `volume` | [[1]](os.md#os.listmounts) |
| os.listvolumes |  | [[1]](os.md#os.listvolumes) |
| os.listxattr | `path` | [[1]](os.md#os.listxattr) |
| os.lockf | `fd`, `cmd`, `len` | [[1]](os.md#os.lockf) |
| os.mkdir | `path`, `mode`, `dir_fd` | [[1]](os.md#os.makedirs)[[2]](os.md#os.mkdir) |
| os.posix\_spawn | `path`, `argv`, `env` | [[1]](os.md#os.posix_spawn)[[2]](os.md#os.posix_spawnp) |
| os.putenv | `key`, `value` | [[1]](os.md#os.putenv) |
| os.remove | `path`, `dir_fd` | [[1]](os.md#os.remove)[[2]](os.md#os.removedirs)[[3]](os.md#os.unlink) |
| os.removexattr | `path`, `attribute` | [[1]](os.md#os.removexattr) |
| os.rename | `src`, `dst`, `src_dir_fd`, `dst_dir_fd` | [[1]](os.md#os.rename)[[2]](os.md#os.renames)[[3]](os.md#os.replace) |
| os.rmdir | `path`, `dir_fd` | [[1]](os.md#os.rmdir) |
| os.scandir | `path` | [[1]](os.md#os.scandir) |
| os.setxattr | `path`, `attribute`, `value`, `flags` | [[1]](os.md#os.setxattr) |
| os.spawn | `mode`, `file`, `args`, `env` | [[1]](os.md#os.spawnl) |
| os.startfile | `path`, `operation` | [[1]](os.md#os.startfile) |
| os.startfile/2 | `path`, `operation`, `arguments`, `cwd`, `show_cmd` | [[1]](os.md#os.startfile) |
| os.symlink | `src`, `dst`, `dir_fd` | [[1]](os.md#os.symlink) |
| os.system | `command` | [[1]](os.md#os.system) |
| os.truncate | `fd`, `length` | [[1]](os.md#os.ftruncate)[[2]](os.md#os.truncate) |
| os.unsetenv | `key` | [[1]](os.md#os.unsetenv) |
| os.utime | `path`, `times`, `ns`, `dir_fd` | [[1]](os.md#os.utime) |
| os.walk | `top`, `topdown`, `onerror`, `followlinks` | [[1]](os.md#os.walk) |
| pathlib.Path.glob | `self`, `pattern` | [[1]](pathlib.md#pathlib.Path.glob) |
| pathlib.Path.rglob | `self`, `pattern` | [[1]](pathlib.md#pathlib.Path.rglob) |
| pdb.Pdb |  | [[1]](pdb.md#pdb.Pdb) |
| pickle.find\_class | `module`, `name` | [[1]](pickle.md#pickle.Unpickler.find_class) |
| poplib.connect | `self`, `host`, `port` | [[1]](poplib.md#poplib.POP3)[[2]](poplib.md#poplib.POP3_SSL) |
| poplib.putline | `self`, `line` | [[1]](poplib.md#poplib.POP3)[[2]](poplib.md#poplib.POP3_SSL) |
| pty.spawn | `argv` | [[1]](pty.md#pty.spawn) |
| resource.prlimit | `pid`, `resource`, `limits` | [[1]](resource.md#resource.prlimit) |
| resource.setrlimit | `resource`, `limits` | [[1]](resource.md#resource.setrlimit) |
| setopencodehook |  | [[1]](../c-api/file.md#c.PyFile_SetOpenCodeHook) |
| shutil.chown | `path`, `user`, `group` | [[1]](shutil.md#shutil.chown) |
| shutil.copyfile | `src`, `dst` | [[1]](shutil.md#shutil.copy)[[2]](shutil.md#shutil.copy2)[[3]](shutil.md#shutil.copyfile) |
| shutil.copymode | `src`, `dst` | [[1]](shutil.md#shutil.copy)[[2]](shutil.md#shutil.copymode) |
| shutil.copystat | `src`, `dst` | [[1]](shutil.md#shutil.copy2)[[2]](shutil.md#shutil.copystat) |
| shutil.copytree | `src`, `dst` | [[1]](shutil.md#shutil.copytree) |
| shutil.make\_archive | `base_name`, `format`, `root_dir`, `base_dir` | [[1]](shutil.md#shutil.make_archive) |
| shutil.move | `src`, `dst` | [[1]](shutil.md#shutil.move) |
| shutil.rmtree | `path`, `dir_fd` | [[1]](shutil.md#shutil.rmtree) |
| shutil.unpack\_archive | `filename`, `extract_dir`, `format` | [[1]](shutil.md#shutil.unpack_archive) |
| signal.pthread\_kill | `thread_id`, `signalnum` | [[1]](signal.md#signal.pthread_kill) |
| smtplib.connect | `self`, `host`, `port` | [[1]](smtplib.md#smtplib.SMTP.connect) |
| smtplib.send | `self`, `data` | [[1]](smtplib.md#smtplib.SMTP) |
| socket.\_\_new\_\_ | `self`, `family`, `type`, `protocol` | [[1]](socket.md#socket.socket) |
| socket.bind | `self`, `address` | [[1]](socket.md#socket.socket.bind) |
| socket.connect | `self`, `address` | [[1]](socket.md#socket.socket.connect)[[2]](socket.md#socket.socket.connect_ex) |
| socket.getaddrinfo | `host`, `port`, `family`, `type`, `protocol` | [[1]](socket.md#socket.getaddrinfo) |
| socket.gethostbyaddr | `ip_address` | [[1]](socket.md#socket.gethostbyaddr) |
| socket.gethostbyname | `hostname` | [[1]](socket.md#socket.gethostbyname)[[2]](socket.md#socket.gethostbyname_ex) |
| socket.gethostname |  | [[1]](socket.md#socket.gethostname) |
| socket.getnameinfo | `sockaddr` | [[1]](socket.md#socket.getnameinfo) |
| socket.getservbyname | `servicename`, `protocolname` | [[1]](socket.md#socket.getservbyname) |
| socket.getservbyport | `port`, `protocolname` | [[1]](socket.md#socket.getservbyport) |
| socket.sendmsg | `self`, `address` | [[1]](socket.md#socket.socket.sendmsg) |
| socket.sendto | `self`, `address` | [[1]](socket.md#socket.socket.sendto) |
| socket.sethostname | `name` | [[1]](socket.md#socket.sethostname) |
| sqlite3.connect | `database` | [[1]](sqlite3.md#sqlite3.connect) |
| sqlite3.connect/handle | `connection_handle` | [[1]](sqlite3.md#sqlite3.connect) |
| sqlite3.enable\_load\_extension | `connection`, `enabled` | [[1]](sqlite3.md#sqlite3.Connection.enable_load_extension) |
| sqlite3.load\_extension | `connection`, `path` | [[1]](sqlite3.md#sqlite3.Connection.load_extension) |
| subprocess.Popen | `executable`, `args`, `cwd`, `env` | [[1]](subprocess.md#subprocess.Popen) |
| sys.\_current\_exceptions |  | [[1]](sys.md#sys._current_exceptions) |
| sys.\_current\_frames |  | [[1]](sys.md#sys._current_frames) |
| sys.\_getframe | `frame` | [[1]](sys.md#sys._getframe) |
| sys.\_getframemodulename | `depth` | [[1]](sys.md#sys._getframemodulename) |
| sys.addaudithook |  | [[1]](../c-api/sys.md#c.PySys_AddAuditHook)[[2]](sys.md#sys.addaudithook) |
| sys.excepthook | `hook`, `type`, `value`, `traceback` | [[1]](sys.md#sys.excepthook) |
| sys.monitoring.register\_callback | `func` | [[1]](sys.monitoring.md#sys.monitoring.register_callback) |
| sys.remote\_exec | `pid`, `script_path` | [[1]](sys.md#audit_event_sys_remote_exec_0) |
| sys.set\_asyncgen\_hooks\_finalizer |  | [[1]](sys.md#sys.set_asyncgen_hooks) |
| sys.set\_asyncgen\_hooks\_firstiter |  | [[1]](sys.md#sys.set_asyncgen_hooks) |
| sys.setprofile |  | [[1]](sys.md#sys.setprofile) |
| sys.settrace |  | [[1]](sys.md#sys.settrace) |
| sys.unraisablehook | `hook`, `unraisable` | [[1]](sys.md#sys.unraisablehook) |
| syslog.closelog |  | [[1]](syslog.md#syslog.closelog) |
| syslog.openlog | `ident`, `logoption`, `facility` | [[1]](syslog.md#syslog.openlog) |
| syslog.setlogmask | `maskpri` | [[1]](syslog.md#syslog.setlogmask) |
| syslog.syslog | `priority`, `message` | [[1]](syslog.md#syslog.syslog) |
| tempfile.mkdtemp | `fullpath` | [[1]](tempfile.md#tempfile.TemporaryDirectory)[[2]](tempfile.md#tempfile.mkdtemp) |
| tempfile.mkstemp | `fullpath` | [[1]](tempfile.md#tempfile.NamedTemporaryFile)[[2]](tempfile.md#tempfile.TemporaryFile)[[3]](tempfile.md#tempfile.mkstemp) |
| time.sleep | `seconds` | [[1]](time.md#audit_event_time_sleep_0) |
| urllib.Request | `fullurl`, `data`, `headers`, `method` | [[1]](urllib.request.md#urllib.request.urlopen) |
| webbrowser.open | `url` | [[1]](webbrowser.md#webbrowser.open) |
| winreg.ConnectRegistry | `computer_name`, `key` | [[1]](winreg.md#winreg.ConnectRegistry) |
| winreg.CreateKey | `key`, `sub_key`, `access` | [[1]](winreg.md#winreg.CreateKey)[[2]](winreg.md#winreg.CreateKeyEx) |
| winreg.DeleteKey | `key`, `sub_key`, `access` | [[1]](winreg.md#winreg.DeleteKey)[[2]](winreg.md#winreg.DeleteKeyEx) |
| winreg.DeleteTree | `key`, `sub_key` | [[1]](winreg.md#winreg.DeleteTree) |
| winreg.DeleteValue | `key`, `value` | [[1]](winreg.md#winreg.DeleteValue) |
| winreg.DisableReflectionKey | `key` | [[1]](winreg.md#winreg.DisableReflectionKey) |
| winreg.EnableReflectionKey | `key` | [[1]](winreg.md#winreg.EnableReflectionKey) |
| winreg.EnumKey | `key`, `index` | [[1]](winreg.md#winreg.EnumKey) |
| winreg.EnumValue | `key`, `index` | [[1]](winreg.md#winreg.EnumValue) |
| winreg.ExpandEnvironmentStrings | `str` | [[1]](winreg.md#winreg.ExpandEnvironmentStrings) |
| winreg.LoadKey | `key`, `sub_key`, `file_name` | [[1]](winreg.md#winreg.LoadKey) |
| winreg.OpenKey | `key`, `sub_key`, `access` | [[1]](winreg.md#winreg.OpenKey) |
| winreg.OpenKey/result | `key` | [[1]](winreg.md#winreg.CreateKey)[[2]](winreg.md#winreg.CreateKeyEx)[[3]](winreg.md#winreg.OpenKey) |
| winreg.PyHKEY.Detach | `key` | [[1]](winreg.md#winreg.PyHKEY.Detach) |
| winreg.QueryInfoKey | `key` | [[1]](winreg.md#winreg.QueryInfoKey) |
| winreg.QueryReflectionKey | `key` | [[1]](winreg.md#winreg.QueryReflectionKey) |
| winreg.QueryValue | `key`, `sub_key`, `value_name` | [[1]](winreg.md#winreg.QueryValue)[[2]](winreg.md#winreg.QueryValueEx) |
| winreg.SaveKey | `key`, `file_name` | [[1]](winreg.md#winreg.SaveKey) |
| winreg.SetValue | `key`, `sub_key`, `type`, `value` | [[1]](winreg.md#winreg.SetValue)[[2]](winreg.md#winreg.SetValueEx) |

The following events are raised internally and do not correspond to any
public API of CPython:

| Audit event | Arguments |
| --- | --- |
| \_winapi.CreateFile | `file_name`, `desired_access`, `share_mode`, `creation_disposition`, `flags_and_attributes` |
| \_winapi.CreateJunction | `src_path`, `dst_path` |
| \_winapi.CreateNamedPipe | `name`, `open_mode`, `pipe_mode` |
| \_winapi.CreatePipe |  |
| \_winapi.CreateProcess | `application_name`, `command_line`, `current_directory` |
| \_winapi.OpenProcess | `process_id`, `desired_access` |
| \_winapi.TerminateProcess | `handle`, `exit_code` |
| \_posixsubprocess.fork\_exec | `exec_list`, `args`, `env` |
| ctypes.PyObj\_FromPtr | `obj` |
