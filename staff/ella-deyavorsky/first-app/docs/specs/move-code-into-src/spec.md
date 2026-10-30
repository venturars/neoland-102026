# Move the code into src

Issue: #627.

Whoever opens `first-app` sees the project files at the top and the code of the app in one place, a folder called `src`. The four code folders `clients`, `db`, `queries` and `logic` live inside `src`. They no longer sit at the top.

It is used by whoever builds a feature, whoever runs a client by hand, and whoever reads the guides.

Everyone who can open the repository has access. No new data comes in.

The app works the same way. Only the place of the folders changes.

Example: before, a terminal client is at `clients/terminal/list-users.txt`. After, it is at `src/clients/terminal/list-users.txt`. Pasted in the terminal with `first-app` as the current folder, it still prints the users.

What goes wrong if a path is left behind:

- A client that still points to the old place stops with a "module not found" error.
- A guide that names the old place sends the reader to a folder that is not there.
- A notebook that still starts Node from the old place cannot find the logic.
- The format and lint commands skip the moved files.
- The database file can end up tracked by git if its ignore line does not follow it.
