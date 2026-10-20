export function createUser(input) {
  const name = input.name;
  const email = input.email;
  const users = input.users;

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

  for (const user of users) {
    if (user.email === email) {
      throw new Error("Email already exists");
    }
  }

  return {
    name,
    email,
  };
}
