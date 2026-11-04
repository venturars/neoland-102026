// The people page. It calls the same rules as the terminal.
// It does not decide if a name or email is allowed.

import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

const listScreen = document.querySelector("#list-screen");
const optionsScreen = document.querySelector("#options-screen");
const editScreen = document.querySelector("#edit-screen");
const userList = document.querySelector("#user-list");
const listError = document.querySelector("#list-error");
const optionsName = document.querySelector("#options-name");
const optionsEmail = document.querySelector("#options-email");
const optionsError = document.querySelector("#options-error");
const editError = document.querySelector("#edit-error");
const editForm = document.querySelector("#edit-form");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const deleteName = document.querySelector("#delete-name");
const deleteEmail = document.querySelector("#delete-email");
const confirmDelete = document.querySelector("#confirm-delete");
const toast = document.querySelector("#toast");

let currentUser = null;
let toastTimer;

function showScreen(screen) {
  listScreen.hidden = true;
  optionsScreen.hidden = true;
  editScreen.hidden = true;
  screen.hidden = false;
}

function showToast(message) {
  toast.hidden = false;
  toast.textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 3000);
}

async function showUsers() {
  listError.textContent = "";
  userList.replaceChildren();
  let people;
  try {
    people = await listUsers();
  } catch (error) {
    listError.textContent = error.message;
    return;
  }

  if (people.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "There are no people yet.";
    userList.append(empty);
    return;
  }

  for (const person of people) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "row";
    const id = document.createElement("span");
    const name = document.createElement("span");
    const email = document.createElement("span");
    id.textContent = person.id;
    name.textContent = person.name;
    email.textContent = person.email;
    button.append(id, name, email);
    button.addEventListener("click", () => {
      chooseUser(person.id);
    });
    userList.append(button);
  }
}

async function chooseUser(id) {
  listError.textContent = "";
  let person;
  try {
    person = await findUserById(id);
  } catch (error) {
    listError.textContent = error.message;
    return;
  }
  currentUser = person;
  optionsName.textContent = person.name;
  optionsEmail.textContent = person.email;
  optionsError.textContent = "";
  showScreen(optionsScreen);
}

function openEdit() {
  editError.textContent = "";
  nameInput.value = currentUser.name;
  emailInput.value = currentUser.email;
  deleteName.textContent = currentUser.name;
  deleteEmail.textContent = currentUser.email;
  showScreen(editScreen);
}

async function saveUser() {
  editError.textContent = "";
  let person;
  try {
    person = await updateUser(currentUser.id, {
      name: nameInput.value,
      email: emailInput.value,
    });
  } catch (error) {
    editError.textContent = error.message;
    return;
  }
  currentUser = person;
  optionsName.textContent = person.name;
  optionsEmail.textContent = person.email;
  showToast("Saved");
  showScreen(optionsScreen);
}

async function removeUser() {
  editError.textContent = "";
  try {
    await deleteUser(currentUser.id);
  } catch (error) {
    confirmDelete.close();
    editError.textContent = error.message;
    return;
  }
  confirmDelete.close();
  currentUser = null;
  showToast("Person deleted");
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

document.querySelector("#edit-back-button").addEventListener("click", () => {
  showScreen(optionsScreen);
});

editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveUser();
});

document.querySelector("#open-delete").addEventListener("click", () => {
  deleteName.textContent = currentUser.name;
  deleteEmail.textContent = currentUser.email;
  confirmDelete.showModal();
});

document.querySelector("#cancel-delete").addEventListener("click", () => {
  confirmDelete.close();
});

document
  .querySelector("#confirm-delete-button")
  .addEventListener("click", () => {
    removeUser();
  });

showScreen(listScreen);
showUsers();
