import { listUsers } from "./list-users.js";

export async function pickRandomUser() {
  let contacts;
  try {
    contacts = await listUsers();
  } catch {
    throw new Error("Could not pick a user");
  }

  const count = contacts.length;
  const empty = count === 0;
  if (empty) {
    return null;
  }

  const randomValue = Math.random();
  const position = randomValue * count;
  const index = Math.floor(position);
  const contact = contacts[index];
  return contact;
}
