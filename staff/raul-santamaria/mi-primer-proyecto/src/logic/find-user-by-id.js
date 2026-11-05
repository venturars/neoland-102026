import { findById } from "../queries/users.js";

export async function findUserById(id) {
  const rawId = id;
  const numericId = Number(rawId);
  const idIsInteger = Number.isInteger(numericId);
  let idIsValid = false;
  if (idIsInteger) {
    if (numericId > 0) {
      idIsValid = true;
    }
  }
  if (!idIsValid) {
    throw new Error("User id is not valid");
  }

  let user;
  try {
    user = await findById(numericId);
  } catch {
    throw new Error("Could not find the user");
  }

  if (!user) {
    throw new Error("No user exists with that id");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
