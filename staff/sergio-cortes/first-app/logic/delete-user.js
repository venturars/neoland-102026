import { findById, remove } from "../queries/user.js";

export function deleteUser(id) {
  if (typeof id !== "number") {
    throw new Error("Id is invalid");
  }

  const user = findById(id);
  remove(id);

  if (user === undefined) {
    return undefined;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
