import { findUserById } from './findUserById.js'
import { findUserByEmail } from './findUserByEmail.js'
import { findAllUsers } from './findAllUsers.js'
import { insertUser } from './insertUser.js'
import { modifyUser } from './modifyUser.js'
import { removeUser } from './removeUser.js'

export const createQueries = (db) => ({
  findUserById: findUserById(db),
  findUserByEmail: findUserByEmail(db),
  findAllUsers: findAllUsers(db),
  insertUser: insertUser(db),
  modifyUser: modifyUser(db),
  removeUser: removeUser(db),
})
