import { Injectable } from "@nestjs/common";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

@Injectable()
export class UsersService {
  create(name, email) {
    const user = createUser({ name, email });
    return user;
  }

  list() {
    const users = listUsers();
    return users;
  }

  find(id) {
    const user = findUserById(id);
    return user;
  }

  update(id, changes) {
    const user = updateUser(id, changes);
    return user;
  }

  remove(id) {
    const result = deleteUser(id);
    return result;
  }
}
