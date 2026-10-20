export function deleteUser(input) {
  const id = input.id;
  const users = input.users;

  if (typeof id !== "number") {
    throw new Error("Id is invalid");
  }

  if (!Array.isArray(users)) {
    throw new Error("Users is invalid");
  }

  for (const user of users) {
    if (user.id === id) {
      return user;
    }
  }

  throw new Error("User not found");
}
