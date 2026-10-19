# terminal client

## Signature

`node client/terminal/index.js <command> [args]`

| Command | Args |
|---|---|
| `create` | `<name> <email>` |
| `list` | — |
| `get` | `<id>` |
| `update` | `<id> <name> <email>` |
| `delete` | `<id>` |

## Rules

1. On success, prints the result as JSON on stdout and exits `0`. `delete` prints `{ "deleted": <id> }`.
2. On error, prints `{ "error": { code, message, details } }` on stderr and exits with the code from the constitution's client mapping.
3. An unknown command is `VALIDATION`, details `{ field: 'command' }`, message lists every command's usage.
4. A wrong number of arguments is `VALIDATION`, details `{ field: 'args' }`, message is that command's usage.
5. An `id` that is not a positive integer is `VALIDATION`, details `{ field: 'id' }`.
6. A non-`AppError` is reported as `SYSTEM`, message `unexpected error`; the stack is printed only when `DEBUG=1`.
7. The database path comes from the `DB_PATH` environment variable, defaulting to `db/users.db`.

## Scenarios

| ID | Given | When | Then |
|---|---|---|---|
| CLI-1 | empty database | `create Ana ana@x.com` | stdout `{ id: 1, name: 'Ana', email: 'ana@x.com' }`, exit 0 |
| CLI-2 | user 1 | `delete 1` | stdout `{ deleted: 1 }`, exit 0 |
| CLI-3 | — | `foo` | `VALIDATION`, field `command`, exit 2 |
| CLI-4 | — | `update "Victor C" victor@x.com` | `VALIDATION`, field `args`, message `usage: update <id> <name> <email>`, exit 2 |
| CLI-5 | — | `get abc` | `VALIDATION`, field `id`, exit 2 |
| CLI-6 | empty database | `get 9` | `NOT_FOUND`, exit 3 |
| CLI-7 | user with `ana@x.com` | `create Bob ana@x.com` | `DUPLICATE`, exit 4 |
| CLI-8 | `DB_PATH` points to a folder that does not exist | `list` | `SYSTEM`, message `unexpected error`, exit 1, no stack on stderr |
| CLI-9 | same as CLI-8, `DEBUG=1` | `list` | exit 1, stderr also contains the stack |
