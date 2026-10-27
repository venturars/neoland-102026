---
page: deprecations/soft-deprecations.html
title: Soft deprecations
area: deprecations
kind: deprecation
---

<!-- anchor: soft-deprecations | type: section -->
# Soft deprecations

There are no plans to remove soft deprecated APIs.

- `re.match()` and `re.Pattern.match()` are now soft deprecated in favor of the new `re.prefixmatch()` and `re.Pattern.prefixmatch()` APIs, which have been added as alternate, more explicit names. These are intended to be used to alleviate confusion around what *match* means by following the Zen of Python’s *“Explicit is better than implicit”* mantra. Most other language regular expression libraries use an API named *match* to mean what Python has always called *search*.

  We **do not** plan to remove the older `match()` name, as it has been used in code for over 30 years. Code supporting older versions of Python should continue to use `match()`, while new code should prefer `prefixmatch()`. See prefixmatch() vs. match().

  (Contributed by Gregory P. Smith in gh-86519 and Hugo van Kemenade in gh-148100.)

- Using `'F'` and `'D'` format type codes of the `struct` module now are soft deprecated in favor of two-letter forms `'Zf'` and `'Zd'`. (Contributed by Sergey B Kirpichev in gh-121249.)
