const { contextBridge, ipcRenderer } = require("electron");

const CREATE_USER = "create-user";
const LIST_USERS = "list-users";
const FIND_USER_BY_ID = "find-user-by-id";
const UPDATE_USER = "update-user";
const DELETE_USER = "delete-user";
const USERS_GENDER_COUNT = "users-gender-count";

contextBridge.exposeInMainWorld("desktop", {
  createUser(input) {
    return ipcRenderer.invoke(CREATE_USER, input);
  },
  listUsers() {
    return ipcRenderer.invoke(LIST_USERS);
  },
  findUserById(id) {
    return ipcRenderer.invoke(FIND_USER_BY_ID, id);
  },
  updateUser(id, changes) {
    return ipcRenderer.invoke(UPDATE_USER, id, changes);
  },
  deleteUser(id) {
    return ipcRenderer.invoke(DELETE_USER, id);
  },
  usersGenderCount() {
    return ipcRenderer.invoke(USERS_GENDER_COUNT);
  },
});
