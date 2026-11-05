import { Injectable } from "@nestjs/common";
import { createUser } from "../../logic/create-user.js";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

@Injectable()
export class UsersService {
  create(input) {
    return createUser(input);
  }
  list() {
    return listUsers();
  }
  find(id) {
    return findUserById(id);
  }
  update(id, changes) {
    return updateUser(id, changes);
  }
  remove(id) {
    return deleteUser(id);
  }
}
