# `wave` — Read and write WAV files

The `wave` module provides a convenient interface to the Waveform Audio
“WAVE” (or “WAV”) file format.

The module supports uncompressed PCM and IEEE floating-point WAV formats.

Changed in version 3.15: Support for reading and writing `WAVE_FORMAT_IEEE_FLOAT` files was added.

The `wave` module defines the following function and exception:

wave.open(*file*, *mode=None*)
:   If *file* is a string, a path-like object or a
    bytes-like object open the file by that name, otherwise treat it as
    a file-like object. *mode* can be:

    `'rb'`
    :   Read only mode.

    `'wb'`
    :   Write only mode.

    Note that it does not allow read/write WAV files.

    A *mode* of `'rb'` returns a `Wave_read` object, while a *mode* of
    `'wb'` returns a `Wave_write` object. If *mode* is omitted and a
    file-like object is passed as *file*, `file.mode` is used as the default
    value for *mode*.

    If you pass in a file-like object, the wave object will not close it when its
    `close()` method is called; it is the caller’s responsibility to close
    the file object.

    The `open()` function may be used in a `with` statement. When
    the `with` block completes, the `Wave_read.close()` or
    `Wave_write.close()` method is called.

    Changed in version 3.15: Added support for path-like objects
    and bytes-like objects.

exception wave.Error
:   An error raised when something is impossible because it violates the WAV
    specification or hits an implementation deficiency.

wave.WAVE\_FORMAT\_PCM
:   Format code for uncompressed PCM audio.

wave.WAVE\_FORMAT\_IEEE\_FLOAT
:   Format code for IEEE floating-point audio.

    Added in version 3.15.

wave.WAVE\_FORMAT\_EXTENSIBLE
:   Format code for WAVE extensible headers.

## Wave\_read Objects

class wave.Wave\_read
:   Read a WAV file.

    Wave\_read objects, as returned by `open()`, have the following methods:

    close()
    :   Close the stream if it was opened by `wave`, and make the instance
        unusable. This is called automatically on object collection.

    getnchannels()
    :   Returns number of audio channels (`1` for mono, `2` for stereo).

    getsampwidth()
    :   Returns sample width in bytes.

    getframerate()
    :   Returns sampling frequency.

    getnframes()
    :   Returns number of audio frames.

    getformat()
    :   Returns the frame format code.

        This is one of `WAVE_FORMAT_PCM`,
        `WAVE_FORMAT_IEEE_FLOAT`, or `WAVE_FORMAT_EXTENSIBLE`.

        Added in version 3.15.

    getcomptype()
    :   Returns compression type (`'NONE'` is the only supported type).

    getcompname()
    :   Human-readable version of `getcomptype()`. Usually `'not compressed'`
        parallels `'NONE'`.

    getparams()
    :   Returns a `namedtuple()` `(nchannels, sampwidth,
        framerate, nframes, comptype, compname)`, equivalent to output
        of the `get*()` methods.

    readframes(*n*)
    :   Reads and returns at most *n* frames of audio, as a `bytes` object.

    rewind()
    :   Rewind the file pointer to the beginning of the audio stream.

    The following two methods define a term “position” which is compatible between
    them, and is otherwise implementation dependent.

    setpos(*pos*)
    :   Set the file pointer to the specified position.

    tell()
    :   Return current file pointer position.

## Wave\_write Objects

class wave.Wave\_write
:   Write a WAV file.

    Wave\_write objects, as returned by `open()`.

    For seekable output streams, the `wave` header will automatically be updated
    to reflect the number of frames actually written. For unseekable streams, the
    *nframes* value must be accurate when the first frame data is written. An
    accurate *nframes* value can be achieved either by calling
    `setnframes()` or `setparams()` with the number
    of frames that will be written before `close()` is called and
    then using `writeframesraw()` to write the frame data, or by
    calling `writeframes()` with all of the frame data to be
    written. In the latter case `writeframes()` will calculate
    the number of frames in the data and set *nframes* accordingly before writing
    the frame data.

    Wave\_write objects have the following methods:

    close()
    :   Make sure *nframes* is correct, and close the file if it was opened by
        `wave`. This method is called upon object collection. It will raise
        an exception if the output stream is not seekable and *nframes* does not
        match the number of frames actually written.

    setnchannels(*n*)
    :   Set the number of channels.

    getnchannels()
    :   Return the number of channels.

    setsampwidth(*n*)
    :   Set the sample width to *n* bytes.

        For `WAVE_FORMAT_IEEE_FLOAT`, only 4-byte (32-bit) and
        8-byte (64-bit) sample widths are supported.

    getsampwidth()
    :   Return the sample width in bytes.

    setframerate(*n*)
    :   Set the frame rate to *n*.

    getframerate()
    :   Return the frame rate.

    setnframes(*n*)
    :   Set the number of frames to *n*. This will be changed later if the number
        of frames actually written is different (this update attempt will
        raise an error if the output stream is not seekable).

    getnframes()
    :   Return the number of audio frames written so far.

    setcomptype(*type*, *name*)
    :   Set the compression type and description. At the moment, only compression type
        `NONE` is supported, meaning no compression.

    getcomptype()
    :   Return the compression type (`'NONE'`).

    getcompname()
    :   Return the human-readable compression type name.

    setformat(*format*)
    :   Set the frame format code.

        Supported values are `WAVE_FORMAT_PCM` and
        `WAVE_FORMAT_IEEE_FLOAT`.

        When setting `WAVE_FORMAT_IEEE_FLOAT`, the sample width must be
        4 or 8 bytes.

        Added in version 3.15.

    getformat()
    :   Return the current frame format code.

        Added in version 3.15.

    setparams(*tuple*)
    :   The *tuple* should be
        `(nchannels, sampwidth, framerate, nframes, comptype, compname, format)`,
        with values valid for the `set*()` methods. Sets all parameters.

        For backwards compatibility, a 6-item tuple without *format* is also
        accepted and defaults to `WAVE_FORMAT_PCM`.

        For `format=WAVE_FORMAT_IEEE_FLOAT`, *sampwidth* must be 4 or 8.

        Changed in version 3.15: Added optional item *format* to the *tuple*.

    getparams()
    :   Return a `namedtuple()`
        `(nchannels, sampwidth, framerate, nframes, comptype, compname)`
        containing the current output parameters.

    tell()
    :   Return current position in the file, with the same disclaimer for the
        `Wave_read.tell()` and `Wave_read.setpos()` methods.

    writeframesraw(*data*)
    :   Write audio frames, without correcting *nframes*.

    writeframes(*data*)
    :   Write audio frames and make sure *nframes* is correct. It will raise an
        error if the output stream is not seekable and the total number of frames
        that have been written after *data* has been written does not match the
        previously set value for *nframes*.

        Note that it is invalid to set any parameters after calling `writeframes()`
        or `writeframesraw()`, and any attempt to do so will raise
        `wave.Error`.

        For `WAVE_FORMAT_IEEE_FLOAT` output, a `fact` chunk is written as
        required by the WAVE specification for non-PCM formats.
