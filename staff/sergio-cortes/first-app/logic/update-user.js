export function updateUser({ id, name, email, users }) {
  let currentUser = null;

  for (const user of users) {
    if (user.id === id) {
      currentUser = user;
    }
  }

  if (currentUser === null) {
    throw new Error("User not found");
  }

  for (const user of users) {
    if (user.email === email && user.id !== id) {
      throw new Error("Email already exists");
    }
  }

  return {
    id: currentUser.id,
    name,
    email,
    createdAt: currentUser.createdAt,
    updatedAt: new Date().toISOString(),
  };
}
