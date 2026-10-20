export function parseName(value) {
  if (typeof value !== "string") {
    throw new Error("Name is empty");
  }

  const name = value.trim();
  if (name === "") {
    throw new Error("Name is empty");
  }

  return name;
}

export function parseEmail(value) {
  if (typeof value !== "string") {
    throw new Error("Email is invalid");
  }

  const email = value.trim().toLowerCase();
  const parts = email.split("@");
  const hasSingleAt =
    parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;

  if (!hasSingleAt || email.length > 64 || email.includes(" ")) {
    throw new Error("Email is invalid");
  }

  return email;
}

export function parseId(value) {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    throw new Error("Invalid id");
  }

  return value;
}

export function toUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
