export class AppError extends Error {
  constructor(message, details = {}, options) {
    super(message, options);
    this.name = this.constructor.name;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  code = "VALIDATION";
}
export class NotFoundError extends AppError {
  code = "NOT_FOUND";
}
export class DuplicateError extends AppError {
  code = "DUPLICATE";
}
export class SystemError extends AppError {
  code = "SYSTEM";
}
