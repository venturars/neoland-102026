import { findUserById } from "./find-user-by-id.js";
import { findUserByEmail } from "./find-user-by-email.js";
import { findAllUsers } from "./find-all-users.js";
import { insertUser } from "./insert-user.js";
import { modifyUser } from "./modify-user.js";
import { removeUser } from "./remove-user.js";

export const createQueries = (db) => ({
  findUserById: findUserById(db),
  findUserByEmail: findUserByEmail(db),
  findAllUsers: findAllUsers(db),
  insertUser: insertUser(db),
  modifyUser: modifyUser(db),
  removeUser: removeUser(db),
});
