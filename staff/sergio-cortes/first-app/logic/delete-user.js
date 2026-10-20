export function deleteUser({ id, users }) {
  for (const user of users) {
    if (user.id === id) {
      return user;
    }
  }

  throw new Error("User not found");
}
