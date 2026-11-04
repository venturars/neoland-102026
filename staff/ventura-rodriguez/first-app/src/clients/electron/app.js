/* global document */
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

const listScreen = document.querySelector("#list-screen");
const detailScreen = document.querySelector("#detail-screen");
const createForm = document.querySelector("#create-form");
const createName = document.querySelector("#create-name");
const createEmail = document.querySelector("#create-email");
const viewForm = document.querySelector("#view-form");
const viewId = document.querySelector("#view-id");
const userList = document.querySelector("#user-list");
const listMessage = document.querySelector("#list-message");
const detailId = document.querySelector("#detail-id");
const detailName = document.querySelector("#detail-name");
const detailEmail = document.querySelector("#detail-email");
const detailCreated = document.querySelector("#detail-created");
const detailUpdated = document.querySelector("#detail-updated");
const editForm = document.querySelector("#edit-form");
const editName = document.querySelector("#edit-name");
const editEmail = document.querySelector("#edit-email");
const detailMessage = document.querySelector("#detail-message");

let currentUser = null;

function showScreen(screen) {
  listScreen.hidden = true;
  detailScreen.hidden = true;
  screen.hidden = false;
}

function writeDetail(user) {
  const idText = `id ${user.id}`;
  detailId.textContent = idText;
  detailName.textContent = user.name;
  detailEmail.textContent = user.email;
  detailCreated.textContent = user.createdAt;
  detailUpdated.textContent = user.updatedAt;
  editName.value = user.name;
  editEmail.value = user.email;
}

async function showUsers() {
  listMessage.textContent = "";
  userList.replaceChildren();
  let users;
  try {
    users = await listUsers();
  } catch (error) {
    listMessage.textContent = error.message;
    return;
  }

  for (const user of users) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    const label = `${user.id}. ${user.name} (${user.email})`;
    button.textContent = label;
    button.addEventListener("click", () => {
      openById(user.id);
    });
    item.append(button);
    userList.append(item);
  }
}

async function openById(id) {
  listMessage.textContent = "";
  let user;
  try {
    user = await findUserById(id);
  } catch (error) {
    listMessage.textContent = error.message;
    return;
  }

  currentUser = user;
  writeDetail(user);
  detailMessage.textContent = "";
  showScreen(detailScreen);
}

async function createFromForm() {
  listMessage.textContent = "";
  const name = createName.value;
  const email = createEmail.value;
  try {
    await createUser({ name, email });
  } catch (error) {
    listMessage.textContent = error.message;
    return;
  }

  createName.value = "";
  createEmail.value = "";
  await showUsers();
}

async function saveUser() {
  detailMessage.textContent = "";
  const name = editName.value;
  const email = editEmail.value;
  const changes = { name, email };
  let user;
  try {
    user = await updateUser(currentUser.id, changes);
  } catch (error) {
    detailMessage.textContent = error.message;
    return;
  }

  currentUser = user;
  writeDetail(user);
}

async function removeUser() {
  detailMessage.textContent = "";
  try {
    await deleteUser(currentUser.id);
  } catch (error) {
    detailMessage.textContent = error.message;
    return;
  }

  currentUser = null;
  showScreen(listScreen);
  await showUsers();
}

createForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createFromForm();
});

viewForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = viewId.value;
  openById(id);
});

editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveUser();
});

document.querySelector("#delete-button").addEventListener("click", () => {
  removeUser();
});

document.querySelector("#back-button").addEventListener("click", () => {
  currentUser = null;
  showScreen(listScreen);
  showUsers();
});

showScreen(listScreen);
showUsers();
