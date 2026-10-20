import { createUsersTable, findByEmail } from "../queries/run-query.js";
import { parseEmail, toUser } from "./user-rules.js";

export { findByEmail };

export function findUserByEmail(email) {
  const normalizedEmail = parseEmail(email);

  createUsersTable();

  const user = findByEmail(normalizedEmail);
  if (!user) {
    throw new Error("User not found");
  }

  return toUser(user);
}
