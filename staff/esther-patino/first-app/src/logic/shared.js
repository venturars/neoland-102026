export function validateName(value) {
  if (typeof value !== "string") {
    throw new Error("Name is empty");
  }

  const name = value.trim();
  if (name === "") {
    throw new Error("Name is empty");
  }

  return name;
}

export function validateEmail(value) {
  if (typeof value !== "string") {
    throw new Error("Email is invalid");
  }

  const trimmed = value.trim();
  const email = trimmed.toLowerCase();
  const parts = email.split("@");

  if (parts.length !== 2) {
    throw new Error("Email is invalid");
  }

  const localPart = parts[0];
  const domain = parts[1];

  if (localPart.length === 0) {
    throw new Error("Email is invalid");
  }

  if (domain.length === 0) {
    throw new Error("Email is invalid");
  }

  if (email.length > 64) {
    throw new Error("Email is invalid");
  }

  if (email.includes(" ")) {
    throw new Error("Email is invalid");
  }

  return email;
}

export function validateId(value) {
  if (typeof value !== "number") {
    throw new Error("Invalid id");
  }

  if (!Number.isInteger(value)) {
    throw new Error("Invalid id");
  }

  if (value < 1) {
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
