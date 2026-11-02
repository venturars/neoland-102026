import { findUsersByName as findUserRowsByName } from "../queries/users.js";

export function findUserByName(name) {
  let nameMissing = false;
  if (name === undefined) {
    nameMissing = true;
  }
  if (name === null) {
    nameMissing = true;
  }
  let trimmedName = "";
  if (!nameMissing) {
    const nameAsText = String(name);
    trimmedName = nameAsText.trim();
  }
  if (trimmedName === "") {
    nameMissing = true;
  }
  if (nameMissing) {
    throw new Error("Name is empty");
  }

  let rows;

  try {
    rows = findUserRowsByName(trimmedName);
  } catch {
    throw new Error("Could not find the user");
  }

  const users = [];

  for (const row of rows) {
    users.push({
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  return users;
}
