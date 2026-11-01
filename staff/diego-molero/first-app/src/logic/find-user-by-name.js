import { findByName } from "../queries/users.js";

// Busca coincidencias exactas y conserva el orden de los usuarios.
export function findUserByName(name) {
  if (typeof name !== "string") {
    throw new Error("Name is invalid");
  }
  const trimmedName = name.trim();
  if (trimmedName === "") {
    throw new Error("Name is empty");
  }

  let users;
  try {
    users = findByName(trimmedName);
  } catch (cause) {
    throw new Error("Could not find the user", { cause });
  }

  return users.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  });
}
