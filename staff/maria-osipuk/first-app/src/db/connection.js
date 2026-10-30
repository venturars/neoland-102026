import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const fileUrl = import.meta.url;
const filePath = fileURLToPath(fileUrl);
const directory = path.dirname(filePath);

// Neither client sets this variable, so both open src/db/users.sqlite.
// A process can still point the connection at another file by setting it.
const configuredFile = process.env.FIRST_APP_DATABASE_FILE;
let hasConfiguredFile = false;

if (typeof configuredFile === "string") {
  const trimmedFile = configuredFile.trim();

  if (trimmedFile !== "") {
    hasConfiguredFile = true;
  }
}

// Start with the default file and replace it only when the variable
// has text, so an empty variable still opens src/db/users.sqlite.
let databaseFile = path.join(directory, "users.sqlite");

if (hasConfiguredFile) {
  databaseFile = path.resolve(configuredFile);
}

export const database = new DatabaseSync(databaseFile);
