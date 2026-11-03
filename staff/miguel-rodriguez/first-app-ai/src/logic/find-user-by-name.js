import { findByName } from "../queries/users.js";

export async function findUserByName(name) {
  const trimmedName = name.trim();
  const nameIsEmpty = !trimmedName;
  if (nameIsEmpty) {
    throw new Error("Name is empty");
  }

  let users;
  try {
    users = await findByName(trimmedName);
  } catch {
    throw new Error("Could not find the user");
  }

  const contacts = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));
  return contacts;
}
