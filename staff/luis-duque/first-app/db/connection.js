import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const folder = path.dirname(fileURLToPath(import.meta.url));

export const database = new DatabaseSync(path.join(folder, "users.sqlite"));
