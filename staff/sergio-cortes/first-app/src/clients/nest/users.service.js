import { Injectable } from "@nestjs/common";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { ValidationError } from "../../logic/errors.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

@Injectable()
export class UsersService {
  parseUserId(rawId) {
    const hasOnlyDigits = /^[1-9][0-9]*$/.test(rawId);

    if (!hasOnlyDigits) {
      throw new ValidationError("Id is invalid");
    }

    const id = Number(rawId);

    if (!Number.isSafeInteger(id)) {
      throw new ValidationError("Id is invalid");
    }

    return id;
  }

  list() {
    const users = listUsers();
    return users;
  }

  find(rawId) {
    const id = this.parseUserId(rawId);
    const user = findUserById(id);
    return user;
  }

  create(name, email) {
    const user = createUser({ name, email });
    return user;
  }

  update(rawId, name, email) {
    const id = this.parseUserId(rawId);
    const user = updateUser({ id, name, email });
    return user;
  }

  remove(rawId) {
    const id = this.parseUserId(rawId);
    const result = deleteUser(id);
    return result;
  }
}
