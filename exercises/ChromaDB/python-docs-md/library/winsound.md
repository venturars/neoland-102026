---
page: library/winsound.html
title: winsound — Sound-playing interface for Windows
area: library
kind: guide
module: winsound
---

<!-- anchor: module-winsound | type: section -->
# `winsound` — Sound-playing interface for Windows

**Source code:** PC/winsound.c

The `winsound` module provides access to the basic sound-playing machinery provided by Windows platforms. It includes functions and several constants.

Availability: Windows.

<!-- anchor: functions | type: section -->
## Functions

<!-- anchor: winsound.Beep | type: py function -->
### `winsound.Beep(frequency, duration)`

Beep the PC’s speaker. The *frequency* parameter specifies frequency, in hertz, of the sound, and must be in the range 37 through 32,767. The *duration* parameter specifies the number of milliseconds the sound should last. If the system is not able to beep the speaker, `RuntimeError` is raised.

<!-- anchor: winsound.PlaySound | type: py function -->
### `winsound.PlaySound(sound, flags)`

Call the underlying `PlaySound()` function from the Platform API. The *sound* parameter may be a filename, a system sound alias, audio data as a bytes-like object, or `None`. Its interpretation depends on the value of *flags*, which can be a bitwise ORed combination of the constants described below. If the *sound* parameter is `None`, any currently playing waveform sound is stopped. If the system indicates an error, `RuntimeError` is raised.

<!-- anchor: winsound.MessageBeep | type: py function -->
### `winsound.MessageBeep(type=MB_OK)`

Call the underlying `MessageBeep()` function from the Platform API. This plays a sound as specified in the registry. The *type* argument specifies which sound to play; possible values are `-1`, `MB_ICONASTERISK`, `MB_ICONEXCLAMATION`, `MB_ICONHAND`, `MB_ICONQUESTION`, and `MB_OK`, all described below. The value `-1` produces a “simple beep”; this is the final fallback if a sound cannot be played otherwise. If the system indicates an error, `RuntimeError` is raised.

<!-- anchor: constants | type: section -->
## Constants

<!-- anchor: winsound.SND_FILENAME | type: py data -->
### `winsound.SND_FILENAME`

The *sound* parameter is the name of a WAV file. Do not use with `SND_ALIAS`.

<!-- anchor: winsound.SND_ALIAS | type: py data -->
### `winsound.SND_ALIAS`

The *sound* parameter is a sound association name from the registry. If the registry contains no such name, play the system default sound unless `SND_NODEFAULT` is also specified. If no default sound is registered, raise `RuntimeError`. Do not use with `SND_FILENAME`.

All Win32 systems support at least the following; most systems support many more:

| `PlaySound()` *name* | Corresponding Control Panel Sound name |
| --- | --- |
| `'SystemAsterisk'` | Asterisk |
| `'SystemExclamation'` | Exclamation |
| `'SystemExit'` | Exit Windows |
| `'SystemHand'` | Critical Stop |
| `'SystemQuestion'` | Question |

For example:

```python
import winsound
# Play Windows exit sound.
winsound.PlaySound("SystemExit", winsound.SND_ALIAS)

# Probably play Windows default sound, if any is registered (because
# "*" probably isn't the registered name of any sound).
winsound.PlaySound("*", winsound.SND_ALIAS)
```

<!-- anchor: winsound.SND_LOOP | type: py data -->
### `winsound.SND_LOOP`

Play the sound repeatedly. The `SND_ASYNC` flag must also be used to avoid blocking. Cannot be used with `SND_MEMORY`.

<!-- anchor: winsound.SND_MEMORY | type: py data -->
### `winsound.SND_MEMORY`

The *sound* parameter to `PlaySound()` is a memory image of a WAV file, as a bytes-like object.

**Note:**

This module does not support playing from a memory image asynchronously, so a combination of this flag and `SND_ASYNC` will raise `RuntimeError`.

<!-- anchor: winsound.SND_PURGE | type: py data -->
### `winsound.SND_PURGE`

Stop playing all instances of the specified sound.

**Note:**

This flag is not supported on modern Windows platforms.

<!-- anchor: winsound.SND_ASYNC | type: py data -->
### `winsound.SND_ASYNC`

Return immediately, allowing sounds to play asynchronously.

<!-- anchor: winsound.SND_NODEFAULT | type: py data -->
### `winsound.SND_NODEFAULT`

If the specified sound cannot be found, do not play the system default sound.

<!-- anchor: winsound.SND_NOSTOP | type: py data -->
### `winsound.SND_NOSTOP`

Do not interrupt sounds currently playing.

<!-- anchor: winsound.SND_NOWAIT | type: py data -->
### `winsound.SND_NOWAIT`

Return immediately if the sound driver is busy.

**Note:**

This flag is not supported on modern Windows platforms.

<!-- anchor: winsound.SND_APPLICATION | type: py data -->
### `winsound.SND_APPLICATION`

The *sound* parameter is an application-specific alias in the registry. This flag can be combined with the `SND_ALIAS` flag to specify an application-defined sound alias.

<!-- anchor: winsound.SND_SENTRY | type: py data -->
### `winsound.SND_SENTRY`

Triggers a SoundSentry event when the sound is played.

Added in version 3.14.

<!-- anchor: winsound.SND_SYNC | type: py data -->
### `winsound.SND_SYNC`

The sound is played synchronously. This is the default behavior.

Added in version 3.14.

<!-- anchor: winsound.SND_SYSTEM | type: py data -->
### `winsound.SND_SYSTEM`

Assign the sound to the audio session for system notification sounds.

Added in version 3.14.

<!-- anchor: winsound.MB_ICONASTERISK | type: py data -->
### `winsound.MB_ICONASTERISK`

Play the `SystemDefault` sound.

<!-- anchor: winsound.MB_ICONEXCLAMATION | type: py data -->
### `winsound.MB_ICONEXCLAMATION`

Play the `SystemExclamation` sound.

<!-- anchor: winsound.MB_ICONHAND | type: py data -->
### `winsound.MB_ICONHAND`

Play the `SystemHand` sound.

<!-- anchor: winsound.MB_ICONQUESTION | type: py data -->
### `winsound.MB_ICONQUESTION`

Play the `SystemQuestion` sound.

<!-- anchor: winsound.MB_OK | type: py data -->
### `winsound.MB_OK`

Play the `SystemDefault` sound.

<!-- anchor: winsound.MB_ICONERROR | type: py data -->
### `winsound.MB_ICONERROR`

Play the `SystemHand` sound.

Added in version 3.14.

<!-- anchor: winsound.MB_ICONINFORMATION | type: py data -->
### `winsound.MB_ICONINFORMATION`

Play the `SystemDefault` sound.

Added in version 3.14.

<!-- anchor: winsound.MB_ICONSTOP | type: py data -->
### `winsound.MB_ICONSTOP`

Play the `SystemHand` sound.

Added in version 3.14.

<!-- anchor: winsound.MB_ICONWARNING | type: py data -->
### `winsound.MB_ICONWARNING`

Play the `SystemExclamation` sound.

Added in version 3.14.
