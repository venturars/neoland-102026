import { NotFoundError } from "./errors.js";
import { validateEmail } from "./validate-email.js";

export const getUserByEmail = (queries) => (input) => {
  const email = validateEmail(input);
  const user = queries.findUserByEmail(email);
  if (!user)
    throw new NotFoundError("user not found", { resource: "user", email });
  return user;
};
