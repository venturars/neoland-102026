import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));

// Neither client sets this variable, so both open db/users.sqlite.
// A process can still point the connection at another file by setting it.
const configuredFile = process.env.FIRST_APP_DATABASE_FILE;
const hasConfiguredFile =
  typeof configuredFile === "string" && configuredFile.trim() !== "";
const databaseFile = hasConfiguredFile
  ? path.resolve(configuredFile)
  : path.join(directory, "users.sqlite");

const database = new DatabaseSync(databaseFile);

export default database;
