export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.code = "VALIDATION";
  }
}

export class NotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
    this.name = "NotFoundError";
    this.code = "NOT_FOUND";
  }
}

export class ConflictError extends Error {
  constructor(message = "Conflict") {
    super(message);
    this.name = "ConflictError";
    this.code = "CONFLICT";
  }
}

export function translateQueryError(error) {
  if (error?.code === "SQLITE_UNIQUE_EMAIL") {
    throw new ConflictError("Email is already used");
  }

  throw error;
}
