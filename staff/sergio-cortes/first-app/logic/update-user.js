export function updateUser(input) {
  const id = input.id;
  const name = input.name;
  const email = input.email;
  const users = input.users;

  if (typeof id !== "number") {
    throw new Error("Id is invalid");
  }

  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("Name is invalid");
  }

  if (typeof email !== "string" || email.includes(" ")) {
    throw new Error("Email is invalid");
  }

  const atIndex = email.indexOf("@");
  const lastAtIndex = email.lastIndexOf("@");

  if (atIndex <= 0 || atIndex !== lastAtIndex) {
    throw new Error("Email is invalid");
  }

  const domain = email.slice(atIndex + 1);
  const dotIndex = domain.lastIndexOf(".");

  if (dotIndex <= 0 || dotIndex === domain.length - 1) {
    throw new Error("Email is invalid");
  }

  if (!Array.isArray(users)) {
    throw new Error("Users is invalid");
  }

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
    updatedAt: currentUser.updatedAt,
  };
}
