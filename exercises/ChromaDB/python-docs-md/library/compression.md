---
page: library/compression.html
title: The compression package
area: library
kind: guide
module: compression
---

<!-- anchor: module-compression | type: section -->
# The `compression` package

Added in version 3.14.

The `compression` package contains the canonical compression modules containing interfaces to several different compression algorithms. Some of these modules have historically been available as separate modules; those will continue to be available under their original names for compatibility reasons, and will not be removed without a deprecation cycle. The use of modules in `compression` is encouraged where practical.

- `compression.bz2` – Re-exports `bz2`

- `compression.gzip` – Re-exports `gzip`

- `compression.lzma` – Re-exports `lzma`

- `compression.zlib` – Re-exports `zlib`

- `compression.zstd` – Wrapper for the Zstandard compression library
