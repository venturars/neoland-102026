import { createUsersTable, findByEmail, insertUser } from "../queries/run-query.js";
import { parseEmail, parseName, toUser } from "./user-rules.js";

export { insertUser };

export function createUser(input) {
  const name = parseName(input?.name);
  const email = parseEmail(input?.email);

  createUsersTable();

  const owner = findByEmail(email);
  if (owner) {
    throw new Error("Email is already used");
  }

  return toUser(insertUser({ name, email }));
}
