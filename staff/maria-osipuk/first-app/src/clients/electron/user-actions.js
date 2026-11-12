import { countUsersByGender } from "../../logic/count-users-by-gender.js";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

// These functions run in the main process and answer the page.
// An error thrown in an ipcMain handler reaches the page with extra text in
// front ("Error invoking remote method ..."), so its Spanish table would not
// recognise it. For that reason each function catches the error and returns
// { error } with the original message from logic/, or { data } on success.
// This file does not import electron, so the tests can run it with node.

export async function listUsersAction() {
  try {
    const users = await listUsers();
    return { data: users };
  } catch (error) {
    return { error: error.message };
  }
}

export async function findUserAction(id) {
  try {
    const user = await findUserById(id);
    return { data: user };
  } catch (error) {
    return { error: error.message };
  }
}

export async function createUserAction(name, email) {
  try {
    const user = await createUser(name, email);
    return { data: user };
  } catch (error) {
    return { error: error.message };
  }
}

export async function updateUserAction(id, changes) {
  try {
    const user = await updateUser(id, changes);
    return { data: user };
  } catch (error) {
    return { error: error.message };
  }
}

export async function deleteUserAction(id) {
  try {
    await deleteUser(id);

    // deleteUser returns nothing, so the answer has no user to carry.
    return { data: null };
  } catch (error) {
    return { error: error.message };
  }
}

export async function countUsersAction() {
  try {
    const counts = await countUsersByGender();
    return { data: counts };
  } catch (error) {
    return { error: error.message };
  }
}
