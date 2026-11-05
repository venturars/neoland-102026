import { findGmail } from "../queries/users.js";

export async function listGmailUsers() {
  let users;
  try {
    users = await findGmail();
  } catch {
    throw new Error("The database failed.");
  }

  // Only these fields leave logic.
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
