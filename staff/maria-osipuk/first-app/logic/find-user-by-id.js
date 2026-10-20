import {
  createUsersTable,
  findUserById as findUserRowById,
} from "../queries/users.js";

export function findUserById({ id }) {
  createUsersTable();

  // Validate the input
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("User id must be a positive integer");
  }

  // Execute the database operation
  let user;

  try {
    user = findUserRowById(id);
  } catch {
    throw new Error("Unable to find user");
  }

  // A missing row is a business rule, not a database failure
  if (!user) {
    throw new Error("User does not exist");
  }

  // Return a safe response
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}
