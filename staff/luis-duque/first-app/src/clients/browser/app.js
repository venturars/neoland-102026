/* global document */
import { deleteUser } from "../../logic/delete-user.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

const listScreen = document.querySelector("#list-screen");
const menuScreen = document.querySelector("#menu-screen");
const editScreen = document.querySelector("#edit-screen");
const notesScreen = document.querySelector("#notes-screen");
const userList = document.querySelector("#user-list");
const listMessage = document.querySelector("#list-message");
const menuUser = document.querySelector("#menu-user");
const editId = document.querySelector("#edit-id");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const editMessage = document.querySelector("#edit-message");
const idInput = document.querySelector("#id-input");

let currentUser = null;
let loadedUsers = [];

function showScreen(screen) {
  listScreen.hidden = true;
  menuScreen.hidden = true;
  editScreen.hidden = true;
  notesScreen.hidden = true;
  screen.hidden = false;
}

function positiveInteger(value) {
  const userId = Number(value);

  if (!Number.isInteger(userId) || userId <= 0) {
    return undefined;
  }

  return userId;
}

async function showUsers() {
  listMessage.textContent = "";
  userList.replaceChildren();

  let users;

  try {
    users = await listUsers();
  } catch (error) {
    listMessage.textContent = error.message;
    loadedUsers = [];
    return;
  }

  loadedUsers = users;

  for (const user of users) {
    const item = document.createElement("li");
    const id = document.createElement("span");
    const name = document.createElement("span");
    const email = document.createElement("span");

    id.className = "user-id";
    name.className = "user-name";
    email.className = "user-email";
    id.textContent = String(user.id);
    name.textContent = user.name;
    email.textContent = user.email;
    item.append(id, name, email);
    userList.append(item);
  }
}

function chooseUser(event) {
  event.preventDefault();
  listMessage.textContent = "";
  const userId = positiveInteger(idInput.value);

  if (userId === undefined) {
    listMessage.textContent = "User id must be a positive integer";
    return;
  }

  const user = loadedUsers.find((item) => item.id === userId);

  if (!user) {
    listMessage.textContent = `User ${userId} was not found`;
    return;
  }

  currentUser = user;
  const name = document.createElement("span");
  const id = document.createElement("span");

  name.className = "user-name";
  id.className = "user-id";
  name.textContent = user.name;
  id.textContent = `id ${user.id}`;
  menuUser.replaceChildren(name, id);
  showScreen(menuScreen);
}

function openEdit() {
  editMessage.textContent = "";
  editId.textContent = `id ${currentUser.id}`;
  nameInput.value = currentUser.name;
  emailInput.value = currentUser.email;
  showScreen(editScreen);
}

async function saveUser(event) {
  event.preventDefault();
  editMessage.textContent = "";

  try {
    await updateUser(currentUser.id, {
      name: nameInput.value,
      email: emailInput.value,
    });
  } catch (error) {
    editMessage.textContent = error.message;
    return;
  }

  currentUser = null;
  showScreen(listScreen);
  await showUsers();
}

async function removeUser() {
  editMessage.textContent = "";

  try {
    await deleteUser(currentUser.id);
  } catch (error) {
    editMessage.textContent = error.message;
    return;
  }

  currentUser = null;
  showScreen(listScreen);
  await showUsers();
}

document.querySelector("#back-button").addEventListener("click", () => {
  currentUser = null;
  showScreen(listScreen);
  showUsers();
});

document.querySelector("#edit-button").addEventListener("click", () => {
  openEdit();
});

document.querySelector("#notes-button").addEventListener("click", () => {
  showScreen(notesScreen);
});

document.querySelector("#notes-back-button").addEventListener("click", () => {
  showScreen(menuScreen);
});

document.querySelector("#edit-back-button").addEventListener("click", () => {
  showScreen(menuScreen);
});

document.querySelector("#choose-form").addEventListener("submit", (event) => {
  chooseUser(event);
});

document.querySelector("#edit-form").addEventListener("submit", (event) => {
  saveUser(event);
});

document.querySelector("#delete-button").addEventListener("click", () => {
  removeUser();
});

showScreen(listScreen);
showUsers();
