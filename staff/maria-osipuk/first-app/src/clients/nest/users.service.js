import { Injectable } from "@nestjs/common";

import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

// The service is the only place of this client that calls logic/. It does
// not validate anything: the rules stay in logic/, and a failure travels
// up unchanged to the exception filter, which decides the HTTP status.
@Injectable()
export class UsersService {
  // createUser receives the name and the email as two separate values.
  async create(name, email) {
    const user = await createUser(name, email);
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

  // deleteUser returns no value, so neither does this method.
  async remove(id) {
    await deleteUser(id);
  }
}
