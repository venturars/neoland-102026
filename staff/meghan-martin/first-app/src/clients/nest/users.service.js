import { Injectable } from "@nestjs/common";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

function readId(value) {
  const text = String(value ?? "").trim();
  if (!/^[1-9]\d*$/.test(text)) {
    throw new Error("Invalid id");
  }
  const id = Number(text);
  if (!Number.isSafeInteger(id)) {
    throw new Error("Invalid id");
  }
  return id;
}

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
    const user = findUserById(readId(id));
    return user;
  }

  update(id, changes) {
    const user = updateUser(readId(id), changes);
    return user;
  }

  remove(id) {
    const result = deleteUser(readId(id));
    return result;
  }
}
