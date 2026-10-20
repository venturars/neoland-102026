export function createUser({ name, email, users }) {
  for (const user of users) {
    if (user.email === email) {
      throw new Error("Email already exists");
    }
  }

  let id = 1;

  for (const user of users) {
    if (user.id >= id) {
      id = user.id + 1;
    }
  }

  return {
    id,
    name,
    email,
  };
}
