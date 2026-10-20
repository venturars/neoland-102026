import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const DATABASE_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "users.sqlite",
);

function openDatabase() {
  return new DatabaseSync(DATABASE_PATH);
}

export { openDatabase };
