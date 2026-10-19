import { db } from "../../../db/connection.js";
import { createUsersTable } from "../../../queries/user-create-table.js";
import { handleClientError } from "../_shared/handle-client-error.js";
import { printJson } from "../_shared/print.js";

try {
  createUsersTable();
  printJson({ message: "Users table is ready" });
} catch (error) {
  handleClientError(error);
} finally {
  db.close();
}
