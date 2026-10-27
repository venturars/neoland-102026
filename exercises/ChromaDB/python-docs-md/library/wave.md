---
page: library/wave.html
title: wave — Read and write WAV files
area: library
kind: guide
module: wave
---

<!-- anchor: module-wave | type: section -->
# `wave` — Read and write WAV files

**Source code:** Lib/wave.py

The `wave` module provides a convenient interface to the Waveform Audio “WAVE” (or “WAV”) file format.

The module supports uncompressed PCM and IEEE floating-point WAV formats.

Changed in version 3.12: Support for `WAVE_FORMAT_EXTENSIBLE` headers was added, provided that the extended format is `KSDATAFORMAT_SUBTYPE_PCM`.

Changed in version 3.15: Support for reading and writing `WAVE_FORMAT_IEEE_FLOAT` files was added.

The `wave` module defines the following function and exception:

<!-- anchor: wave.open | type: py function -->
## `wave.open(file, mode=None)`

If *file* is a string, a path-like object or a bytes-like object open the file by that name, otherwise treat it as a file-like object. *mode* can be:

**`'rb'`**

Read only mode.

**`'wb'`**

Write only mode.

Note that it does not allow read/write WAV files.

A *mode* of `'rb'` returns a `Wave_read` object, while a *mode* of `'wb'` returns a `Wave_write` object. If *mode* is omitted and a file-like object is passed as *file*, `file.mode` is used as the default value for *mode*.

If you pass in a file-like object, the wave object will not close it when its `close()` method is called; it is the caller’s responsibility to close the file object.

The `open()` function may be used in a `with` statement. When the `with` block completes, the `Wave_read.close()` or `Wave_write.close()` method is called.

Changed in version 3.4: Added support for unseekable files.

Changed in version 3.15: Added support for path-like objects and bytes-like objects.

<!-- anchor: wave.Error | type: py exception -->
## `exception wave.Error`

An error raised when something is impossible because it violates the WAV specification or hits an implementation deficiency.

<!-- anchor: wave.WAVE_FORMAT_PCM | type: py data -->
## `wave.WAVE_FORMAT_PCM`

Format code for uncompressed PCM audio.

<!-- anchor: wave.WAVE_FORMAT_IEEE_FLOAT | type: py data -->
## `wave.WAVE_FORMAT_IEEE_FLOAT`

Format code for IEEE floating-point audio.

<!-- anchor: wave.WAVE_FORMAT_EXTENSIBLE | type: py data -->
## `wave.WAVE_FORMAT_EXTENSIBLE`

Format code for WAVE extensible headers.

<!-- anchor: wave-read-objects | type: section -->
## Wave_read Objects

<!-- anchor: wave.Wave_read | type: py class -->
### `class wave.Wave_read`

Read a WAV file.

Wave_read objects, as returned by `open()`, have the following methods:

<!-- anchor: wave.Wave_read.close | type: py method -->
#### `close()`

Close the stream if it was opened by `wave`, and make the instance unusable. This is called automatically on object collection.

<!-- anchor: wave.Wave_read.getnchannels | type: py method -->
#### `getnchannels()`

Returns number of audio channels (`1` for mono, `2` for stereo).

<!-- anchor: wave.Wave_read.getsampwidth | type: py method -->
#### `getsampwidth()`

Returns sample width in bytes.

<!-- anchor: wave.Wave_read.getframerate | type: py method -->
#### `getframerate()`

Returns sampling frequency.

<!-- anchor: wave.Wave_read.getnframes | type: py method -->
#### `getnframes()`

Returns number of audio frames.

<!-- anchor: wave.Wave_read.getformat | type: py method -->
#### `getformat()`

Returns the frame format code.

This is one of `WAVE_FORMAT_PCM`, `WAVE_FORMAT_IEEE_FLOAT`, or `WAVE_FORMAT_EXTENSIBLE`.

Added in version 3.15.

<!-- anchor: wave.Wave_read.getcomptype | type: py method -->
#### `getcomptype()`

Returns compression type (`'NONE'` is the only supported type).

<!-- anchor: wave.Wave_read.getcompname | type: py method -->
#### `getcompname()`

Human-readable version of `getcomptype()`. Usually `'not compressed'` parallels `'NONE'`.

<!-- anchor: wave.Wave_read.getparams | type: py method -->
#### `getparams()`

Returns a `namedtuple()` `(nchannels, sampwidth, framerate, nframes, comptype, compname)`, equivalent to output of the `get*()` methods.

<!-- anchor: wave.Wave_read.readframes | type: py method -->
#### `readframes(n)`

Reads and returns at most *n* frames of audio, as a `bytes` object.

<!-- anchor: wave.Wave_read.rewind | type: py method -->
#### `rewind()`

Rewind the file pointer to the beginning of the audio stream.

The following two methods define a term “position” which is compatible between them, and is otherwise implementation dependent.

<!-- anchor: wave.Wave_read.setpos | type: py method -->
#### `setpos(pos)`

Set the file pointer to the specified position.

<!-- anchor: wave.Wave_read.tell | type: py method -->
#### `tell()`

Return current file pointer position.

<!-- anchor: wave-write-objects | type: section -->
## Wave_write Objects

<!-- anchor: wave.Wave_write | type: py class -->
### `class wave.Wave_write`

Write a WAV file.

Wave_write objects, as returned by `open()`.

For seekable output streams, the `wave` header will automatically be updated to reflect the number of frames actually written. For unseekable streams, the *nframes* value must be accurate when the first frame data is written. An accurate *nframes* value can be achieved either by calling `setnframes()` or `setparams()` with the number of frames that will be written before `close()` is called and then using `writeframesraw()` to write the frame data, or by calling `writeframes()` with all of the frame data to be written. In the latter case `writeframes()` will calculate the number of frames in the data and set *nframes* accordingly before writing the frame data.

Changed in version 3.4: Added support for unseekable files.

Wave_write objects have the following methods:

<!-- anchor: wave.Wave_write.close | type: py method -->
#### `close()`

Make sure *nframes* is correct, and close the file if it was opened by `wave`. This method is called upon object collection. It will raise an exception if the output stream is not seekable and *nframes* does not match the number of frames actually written.

<!-- anchor: wave.Wave_write.setnchannels | type: py method -->
#### `setnchannels(n)`

Set the number of channels.

<!-- anchor: wave.Wave_write.getnchannels | type: py method -->
#### `getnchannels()`

Return the number of channels.

<!-- anchor: wave.Wave_write.setsampwidth | type: py method -->
#### `setsampwidth(n)`

Set the sample width to *n* bytes.

For `WAVE_FORMAT_IEEE_FLOAT`, only 4-byte (32-bit) and 8-byte (64-bit) sample widths are supported.

<!-- anchor: wave.Wave_write.getsampwidth | type: py method -->
#### `getsampwidth()`

Return the sample width in bytes.

<!-- anchor: wave.Wave_write.setframerate | type: py method -->
#### `setframerate(n)`

Set the frame rate to *n*.

Changed in version 3.2: A non-integral input to this method is rounded to the nearest integer.

<!-- anchor: wave.Wave_write.getframerate | type: py method -->
#### `getframerate()`

Return the frame rate.

<!-- anchor: wave.Wave_write.setnframes | type: py method -->
#### `setnframes(n)`

Set the number of frames to *n*. This will be changed later if the number of frames actually written is different (this update attempt will raise an error if the output stream is not seekable).

<!-- anchor: wave.Wave_write.getnframes | type: py method -->
#### `getnframes()`

Return the number of audio frames written so far.

<!-- anchor: wave.Wave_write.setcomptype | type: py method -->
#### `setcomptype(type, name)`

Set the compression type and description. At the moment, only compression type `NONE` is supported, meaning no compression.

<!-- anchor: wave.Wave_write.getcomptype | type: py method -->
#### `getcomptype()`

Return the compression type (`'NONE'`).

<!-- anchor: wave.Wave_write.getcompname | type: py method -->
#### `getcompname()`

Return the human-readable compression type name.

<!-- anchor: wave.Wave_write.setformat | type: py method -->
#### `setformat(format)`

Set the frame format code.

Supported values are `WAVE_FORMAT_PCM` and `WAVE_FORMAT_IEEE_FLOAT`.

When setting `WAVE_FORMAT_IEEE_FLOAT`, the sample width must be 4 or 8 bytes.

<!-- anchor: wave.Wave_write.getformat | type: py method -->
#### `getformat()`

Return the current frame format code.

Added in version 3.15.

<!-- anchor: wave.Wave_write.setparams | type: py method -->
#### `setparams(tuple)`

The *tuple* should be `(nchannels, sampwidth, framerate, nframes, comptype, compname, format)`, with values valid for the `set*()` methods. Sets all parameters.

For backwards compatibility, a 6-item tuple without *format* is also accepted and defaults to `WAVE_FORMAT_PCM`.

For `format=WAVE_FORMAT_IEEE_FLOAT`, *sampwidth* must be 4 or 8.

<!-- anchor: wave.Wave_write.getparams | type: py method -->
#### `getparams()`

Return a `namedtuple()` `(nchannels, sampwidth, framerate, nframes, comptype, compname)` containing the current output parameters.

<!-- anchor: wave.Wave_write.tell | type: py method -->
#### `tell()`

Return current position in the file, with the same disclaimer for the `Wave_read.tell()` and `Wave_read.setpos()` methods.

<!-- anchor: wave.Wave_write.writeframesraw | type: py method -->
#### `writeframesraw(data)`

Write audio frames, without correcting *nframes*.

Changed in version 3.4: Any bytes-like object is now accepted.

<!-- anchor: wave.Wave_write.writeframes | type: py method -->
#### `writeframes(data)`

Write audio frames and make sure *nframes* is correct. It will raise an error if the output stream is not seekable and the total number of frames that have been written after *data* has been written does not match the previously set value for *nframes*.

Changed in version 3.4: Any bytes-like object is now accepted.

Note that it is invalid to set any parameters after calling `writeframes()` or `writeframesraw()`, and any attempt to do so will raise `wave.Error`.

For `WAVE_FORMAT_IEEE_FLOAT` output, a `fact` chunk is written as required by the WAVE specification for non-PCM formats.
