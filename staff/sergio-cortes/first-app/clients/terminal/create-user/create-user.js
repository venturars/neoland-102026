import { db } from "../../../db/connection.js";
import { createUser } from "../../../logic/create-user.js";
import { handleClientError } from "../_shared/handle-client-error.js";
import { printJson } from "../_shared/print.js";

try {
  printJson(createUser({ name: "Ada", email: "ada@example.com" }));
} catch (error) {
  handleClientError(error);
} finally {
  db.close();
}
