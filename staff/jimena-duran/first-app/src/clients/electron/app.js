/* global document */
import { createUser } from "../../logic/create-user.js";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

const usersScreen = document.querySelector("#users-screen");
const userScreen = document.querySelector("#user-screen");
const errorMessage = document.querySelector("#error-message");
const usersList = document.querySelector("#users-list");
const createForm = document.querySelector("#create-form");
const createName = document.querySelector("#create-name");
const createEmail = document.querySelector("#create-email");
const findForm = document.querySelector("#find-form");
const findId = document.querySelector("#find-id");
const updateForm = document.querySelector("#update-form");
const updateName = document.querySelector("#update-name");
const updateEmail = document.querySelector("#update-email");
const deleteButton = document.querySelector("#delete-user");
const backButton = document.querySelector("#back-to-list");
let selectedId;

function showUser(user) {
  selectedId = user.id;
  document.querySelector("#user-id").textContent = user.id;
  document.querySelector("#user-name").textContent = user.name;
  document.querySelector("#user-email").textContent = user.email;
  document.querySelector("#user-created").textContent = user.createdAt;
  document.querySelector("#user-updated").textContent = user.updatedAt;
  updateName.value = user.name;
  updateEmail.value = user.email;
  usersScreen.hidden = true;
  userScreen.hidden = false;
}

async function openUser(id) {
  errorMessage.textContent = "";
  try {
    const user = await findUserById(id);
    showUser(user);
  } catch (error) {
    errorMessage.textContent = error.message;
  }
}

async function showUsers() {
  errorMessage.textContent = "";
  usersScreen.hidden = false;
  userScreen.hidden = true;
  usersList.replaceChildren();
  try {
    const users = await listUsers();
    for (const user of users) {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${user.id} · ${user.name} · ${user.email}`;
      button.addEventListener("click", () => {
        openUser(user.id);
      });
      item.append(button);
      usersList.append(item);
    }
  } catch (error) {
    errorMessage.textContent = error.message;
  }
}

createForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.textContent = "";
  try {
    const name = createName.value;
    const email = createEmail.value;
    await createUser({ name, email });
    createForm.reset();
    await showUsers();
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});

findForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = findId.value;
  await openUser(id);
});

updateForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.textContent = "";
  try {
    const name = updateName.value;
    const email = updateEmail.value;
    const user = await updateUser(selectedId, { name, email });
    showUser(user);
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});

deleteButton.addEventListener("click", async () => {
  errorMessage.textContent = "";
  try {
    await deleteUser(selectedId);
    await showUsers();
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});

backButton.addEventListener("click", showUsers);
showUsers();
