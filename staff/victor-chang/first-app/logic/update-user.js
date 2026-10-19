import { DuplicateError, NotFoundError } from "./errors.js";
import { validateUser } from "./validate-user.js";

export const updateUser = (queries) => (id, input) => {
  const user = validateUser(input);
  if (!queries.findUserById(id))
    throw new NotFoundError("user not found", { resource: "user", id });
  const same = queries.findUserByEmail(user.email);
  if (same && same.id !== id)
    throw new DuplicateError("email already exists", {
      field: "email",
      value: user.email,
    });
  return queries.modifyUser(id, user);
};
