import { db } from "../../../db/connection.js";
import { listUsers } from "../../../logic/list-users.js";
import { handleClientError } from "../_shared/handle-client-error.js";
import { printJson } from "../_shared/print.js";

try {
  printJson(listUsers());
} catch (error) {
  handleClientError(error);
} finally {
  db.close();
}
