import { db } from "../../../db/connection.js";
import { updateUser } from "../../../logic/update-user.js";
import { handleClientError } from "../_shared/handle-client-error.js";
import { printJson } from "../_shared/print.js";

const userId = 1;

try {
  printJson(
    updateUser({
      id: userId,
      name: "Ada Lovelace",
      email: "ada@example.com",
    }),
  );
} catch (error) {
  handleClientError(error);
} finally {
  db.close();
}
