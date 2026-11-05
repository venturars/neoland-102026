/* global document */
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listGmailUsers } from "../../logic/list-gmail-users.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

const SCREEN_IDS = ["screen-list", "screen-detail"];

// The user shown in the detail (null when there is none)
let currentUser = null;

// true: the list shows only the Gmail users
let onlyGmail = false;

// Show one screen and hide the other
function show(screenId) {
  for (const id of SCREEN_IDS) {
    document.getElementById(id).classList.toggle("hidden", id !== screenId);
  }
}

// Draw the users of the database
async function renderList() {
  const list = document.getElementById("user-list");
  const listError = document.getElementById("list-error");
  list.innerHTML = "";
  let users = [];
  try {
    users = onlyGmail ? await listGmailUsers() : await listUsers();
  } catch (error) {
    listError.textContent = error.message;
  }
  for (const user of users) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = user.id + " - " + user.name;
    button.addEventListener("click", () => openDetail(user));
    item.appendChild(button);
    list.appendChild(item);
  }
  document
    .getElementById("list-empty")
    .classList.toggle("hidden", users.length > 0);
  show("screen-list");
}

function openDetail(user) {
  currentUser = user;
  document.getElementById("detail-id").textContent = user.id;
  document.getElementById("detail-name").textContent = user.name;
  document.getElementById("detail-email").textContent = user.email;
  document.getElementById("detail-created").textContent = user.createdAt;
  document.getElementById("detail-updated").textContent = user.updatedAt;
  document.getElementById("edit-name").value = user.name;
  document.getElementById("edit-email").value = user.email;
  document.getElementById("detail-error").textContent = "";
  show("screen-detail");
}

async function create(event) {
  event.preventDefault();
  const listError = document.getElementById("list-error");
  listError.textContent = "";
  const name = document.getElementById("create-name").value;
  const email = document.getElementById("create-email").value;
  try {
    await createUser({ name, email });
  } catch (error) {
    listError.textContent = error.message;
    return;
  }
  document.getElementById("create-form").reset();
  await renderList();
}

async function find(event) {
  event.preventDefault();
  const listError = document.getElementById("list-error");
  listError.textContent = "";
  const id = Number(document.getElementById("find-id").value);
  try {
    const user = await findUserById({ id });
    openDetail(user);
  } catch (error) {
    listError.textContent = error.message;
  }
}

async function save(event) {
  event.preventDefault();
  const detailError = document.getElementById("detail-error");
  detailError.textContent = "";
  const name = document.getElementById("edit-name").value;
  const email = document.getElementById("edit-email").value;
  try {
    const user = await updateUser({ id: currentUser.id, name, email });
    openDetail(user);
  } catch (error) {
    detailError.textContent = error.message;
  }
}

async function remove() {
  const detailError = document.getElementById("detail-error");
  detailError.textContent = "";
  try {
    await deleteUser({ id: currentUser.id });
  } catch (error) {
    detailError.textContent = error.message;
    return;
  }
  currentUser = null;
  await renderList();
}

document.getElementById("create-form").addEventListener("submit", create);
document.getElementById("find-form").addEventListener("submit", find);
document.getElementById("edit-form").addEventListener("submit", save);
document.getElementById("btn-delete").addEventListener("click", remove);
document.getElementById("btn-only-gmail").addEventListener("click", () => {
  onlyGmail = true;
  renderList();
});
document.getElementById("btn-show-all").addEventListener("click", () => {
  onlyGmail = false;
  renderList();
});
document.getElementById("btn-back").addEventListener("click", () => {
  document.getElementById("list-error").textContent = "";
  renderList();
});

renderList();
