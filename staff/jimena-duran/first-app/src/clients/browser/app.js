/* global document */
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

const listScreen = document.querySelector("#list-screen");
const menuScreen = document.querySelector("#menu-screen");
const editScreen = document.querySelector("#edit-screen");
const userList = document.querySelector("#user-list");
const listMessage = document.querySelector("#list-message");
const menuName = document.querySelector("#menu-name");
const editForm = document.querySelector("#edit-form");
const editId = document.querySelector("#edit-id");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const editMessage = document.querySelector("#edit-message");

let currentUser = null;

function showScreen(screen) {
  listScreen.hidden = true;
  menuScreen.hidden = true;
  editScreen.hidden = true;
  screen.hidden = false;
}

function writeUser(user) {
  const label = `${user.name} · id ${user.id}`;
  menuName.textContent = label;
  const idLabel = `id ${user.id}`;
  editId.textContent = idLabel;
  nameInput.value = user.name;
  emailInput.value = user.email;
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
      currentUser = user;
      writeUser(user);
      showScreen(menuScreen);
    });
    item.append(button);
    userList.append(item);
  }
}

async function saveUser() {
  editMessage.textContent = "";
  const name = nameInput.value;
  const email = emailInput.value;
  let user;
  try {
    user = await updateUser(currentUser.id, { name, email });
  } catch (error) {
    editMessage.textContent = error.message;
    return;
  }
  currentUser = user;
  writeUser(user);
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
  editMessage.textContent = "";
  writeUser(currentUser);
  showScreen(editScreen);
});

document.querySelector("#edit-back-button").addEventListener("click", () => {
  showScreen(menuScreen);
});

editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveUser();
});

document.querySelector("#delete-button").addEventListener("click", () => {
  removeUser();
});

showScreen(listScreen);
showUsers();
