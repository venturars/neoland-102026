import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { createUser } from "../../logic/create-user.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

const listScreen = document.querySelector("#list-screen");
const personScreen = document.querySelector("#person-screen");
const listError = document.querySelector("#list-error");
const personError = document.querySelector("#person-error");
const userList = document.querySelector("#user-list");
const createForm = document.querySelector("#create-form");
const findForm = document.querySelector("#find-form");
const findId = document.querySelector("#find-id");
const updateForm = document.querySelector("#update-form");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");

let current = null;

function readId(value) {
  if (!/^[1-9]\d*$/.test(value)) {
    throw new Error("Invalid id");
  }
  const id = Number(value);
  if (!Number.isSafeInteger(id)) {
    throw new Error("Invalid id");
  }
  return id;
}

function showPerson(person) {
  current = person;
  document.querySelector("#person-id").textContent = String(person.id);
  document.querySelector("#person-name").textContent = person.name;
  document.querySelector("#person-email").textContent = person.email;
  document.querySelector("#person-created").textContent = person.createdAt;
  document.querySelector("#person-updated").textContent = person.updatedAt;
  nameInput.value = person.name;
  emailInput.value = person.email;
  personError.textContent = "";
  listScreen.hidden = true;
  personScreen.hidden = false;
}

async function showList() {
  current = null;
  listError.textContent = "";
  listScreen.hidden = false;
  personScreen.hidden = true;
  userList.replaceChildren();
  const people = await listUsers();
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
    id.textContent = String(person.id);
    name.textContent = person.name;
    email.textContent = person.email;
    button.append(id, name, email);
    button.addEventListener("click", () => {
      openPerson(person.id);
    });
    userList.append(button);
  }
}

async function openPerson(id) {
  personError.textContent = "";
  const person = await findUserById(id);
  showPerson(person);
}

createForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  listError.textContent = "";
  const data = new FormData(createForm);
  try {
    await createUser({
      name: data.get("name"),
      email: data.get("email"),
    });
    createForm.reset();
    await showList();
  } catch (error) {
    listError.textContent = error.message;
  }
});

findForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  listError.textContent = "";
  try {
    await openPerson(readId(findId.value.trim()));
  } catch (error) {
    listError.textContent = error.message;
  }
});

updateForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  personError.textContent = "";
  const changes = {};
  if (nameInput.value !== current.name) {
    changes.name = nameInput.value;
  }
  if (emailInput.value !== current.email) {
    changes.email = emailInput.value;
  }
  if (changes.name === undefined && changes.email === undefined) {
    return;
  }
  try {
    const saved = await updateUser(current.id, changes);
    showPerson(saved);
  } catch (error) {
    personError.textContent = error.message;
  }
});

document.querySelector("#back-button").addEventListener("click", async () => {
  try {
    await showList();
  } catch (error) {
    listError.textContent = error.message;
  }
});

document.querySelector("#delete-button").addEventListener("click", async () => {
  personError.textContent = "";
  try {
    await deleteUser(current.id);
    await showList();
  } catch (error) {
    personError.textContent = error.message;
  }
});

showList().catch((error) => {
  listError.textContent = error.message;
});
