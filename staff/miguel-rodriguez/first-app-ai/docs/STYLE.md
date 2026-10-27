# Style and conventions

## Names and functions

Use kebab-case filenames, camelCase functions and variables, named exports, and
ES module imports with `.js` extensions. Keep explicitly prescribed document
names such as `AGENTS.md` and `CONSTITUTIONS.md`.

Fixed application configuration values use uppercase constant names, such as
`MODEL`. This convention does not rename existing SQL-text variables or introduce
configuration.

Write one public business operation per file using functions. Do not organize
business logic with custom classes, `this`, or custom object methods. Ordinary
data records and existing library APIs remain available, including methods such
as string normalization and SQLite query execution.

The public-operation contract is in the
[constitution](CONSTITUTIONS.md#public-business-operations). The rule about a
business operation per file does not require splitting the shared query module
or client adapters.

## Explicit steps

Give each step one action per line and a descriptive name for the value obtained
or checked. Read a value separately from transforming it. Store a check's result
before using it; keep the condition and the error throw on separate lines.

```js
const inputName = input.name;
const name = inputName.trim();
const nameLength = name.length;
const nameIsEmpty = nameLength === 0;

if (nameIsEmpty) {
  throw new Error("Name is empty");
}
```

Use ordinary returned data and the errors in [ERRORS.md](ERRORS.md). Avoid result
wrappers, custom error classes, generic helpers, or additional layers that hide a
simple operation. Do not add dependencies without the approved need and package
procedure in the [constitution](CONSTITUTIONS.md#dependencies-and-package-management).

## Formatting

Use the standard Prettier format: double quotes, semicolons, trailing commas,
two-space indentation, and a print width of 80. Formatting does not combine the
separate actions above. This guide does not install a formatter or add a custom
configuration.

## New work and existing code

Existing code helps identify a similar operation; this guide determines how new
code is written. Older code may combine actions or use different formatting. That
style difference does not block a new development and does not authorize a
refactor. Behavioral or instruction conflicts still require a decision under
[AGENTS.md](../AGENTS.md).

Preserve the language of existing client examples. These conventions do not
require translating clients or changing the query module's SQL-text names.
