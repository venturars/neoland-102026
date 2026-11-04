# The web client opens users.sqlite in the browser

The web client cannot make API calls, not even to a local server, yet it must work on the same users as the terminal and Jupyter clients and reuse `logic/` unchanged. So the browser opens `db/users.sqlite` itself: sql.js runs SQLite in the page, the File System Access API reads and writes the file, and an import map sends the `../queries/users.js` that every `logic/` file imports to `clients/web/queries.js`, a browser twin that runs the same `.sql` files. This is the one exception to the single connection of `db/connection.js`.

## Considered Options

- **A REST server over `logic/`**: the usual way, ruled out because the web client may not call any API.
- **The browser's own database (IndexedDB)**: no dependency, but its users would not be the users of `db/users.sqlite`.
- **Opening `index.html` from disk (`file://`)**: no server at all, but Chrome blocks ES module imports there, so `logic/` could not be reused. A static file server (`pnpm web`) only hands out files and has no routes.

## Consequences

- The page works only in Chrome or Edge.
- The page has to ask for the file: a browser lets a page read or write a file on disk only after the person chooses it, so no website can open someone's files on its own. The first visit shows the file picker; later visits remember the file but ask again for permission to edit it. Downloading the file from `pnpm web` would avoid the question, but then the page could not save, since sending the changes back would need an API.
- `clients/web/queries.js` must keep the same functions as `queries/users.js`; a new query function needs both.
- The page reads the whole file before each step and writes it after each change. Two changes at the same moment, from the page and the terminal, can overwrite each other.
