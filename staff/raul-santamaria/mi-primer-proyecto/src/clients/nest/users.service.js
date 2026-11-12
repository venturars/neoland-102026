import { Injectable } from "@nestjs/common";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

@Injectable()
class UsersService {
  createUser(input) {
    return createUser(input);
  }

  listUsers() {
    return listUsers();
  }

  findUserById(id) {
    return findUserById(id);
  }

  updateUser(input) {
    return updateUser(input);
  }

  deleteUser(input) {
    return deleteUser(input);
  }
}

export { UsersService };
