import { SystemError } from "./errors.js";
import * as users from "../queries/users.js";

export function listUsers() {
  try {
    // 3. Apply
    const all = users.findAll();

    // 4. Return plain objects
    return all.map((user) => ({ ...user }));
  } catch (error) {
    throw new SystemError("Could not list the users", {}, { cause: error });
  }
}
