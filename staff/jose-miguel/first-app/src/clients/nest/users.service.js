import { Injectable } from "@nestjs/common";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

@Injectable()
export class UsersService {
  async create(name, email) {
    const user = await createUser({ name, email });
    return user;
  }

  async list() {
    const users = await listUsers();
    return users;
  }

  async find(id) {
    const user = await findUserById(id);
    return user;
  }

  async update(id, changes) {
    const user = await updateUser(id, changes);
    return user;
  }

  async remove(id) {
    await deleteUser(id);
  }
}
