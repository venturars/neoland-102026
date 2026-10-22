import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const database = new DatabaseSync(path.join(directory, "users.sqlite"));

export default database;
