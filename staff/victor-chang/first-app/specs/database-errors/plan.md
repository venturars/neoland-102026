# Plan — database errors

## Files

- Create: `query/safe.js`.
- Touch: every `query/*.js` file wraps its function with `safe(...)`.

## Looks like

No `logic/` file: this lives in `query/`, the only place that sees driver errors.

## Signature

`safe(fn)` → a function with the same parameters and result as `fn`.

## SQL

None.

## Errors

| Spec failure                      | Message                | Code        |
| --------------------------------- | ---------------------- | ----------- |
| SQLite `UNIQUE constraint failed` | `email already exists` | `DUPLICATE` |
| any other driver error            | `database error`       | `SYSTEM`    |

- An `AppError` passes through unchanged.
- The original error is kept as `cause`.
- `DUPLICATE` details: `{ field, value }` read from the column name and the object argument.

## Tests

`test/query/safe.test.js` — SQ-1 … SQ-4.

## Open questions

None.
