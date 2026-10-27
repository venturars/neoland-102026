export class InvalidData extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidData";
  }
}

export class DuplicateEmail extends Error {
  constructor(message) {
    super(message);
    this.name = "DuplicateEmail";
  }
}

export class UserNotFound extends Error {
  constructor(id) {
    super(`There is no user with id ${id}`);
    this.name = "UserNotFound";
  }
}
