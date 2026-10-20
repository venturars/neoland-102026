import { db } from "../../../db/connection.js";
import { deleteUser } from "../../../logic/delete-user.js";
import { handleClientError } from "../_shared/handle-client-error.js";
import { printJson } from "../_shared/print.js";

const userId = 1;

try {
  deleteUser(userId);
  printJson({ message: "User deleted", id: userId });
} catch (error) {
  handleClientError(error);
} finally {
  db.close();
}
