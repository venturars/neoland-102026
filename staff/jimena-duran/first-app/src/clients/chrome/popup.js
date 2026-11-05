/* global document, fetch */
const ORIGIN = "http://127.0.0.1:3002";

const createForm = document.querySelector("#create-form");
const createName = document.querySelector("#create-name");
const createEmail = document.querySelector("#create-email");
const viewForm = document.querySelector("#view-form");
const viewId = document.querySelector("#view-id");
const updateForm = document.querySelector("#update-form");
const updateId = document.querySelector("#update-id");
const updateName = document.querySelector("#update-name");
const updateEmail = document.querySelector("#update-email");
const deleteForm = document.querySelector("#delete-form");
const deleteId = document.querySelector("#delete-id");
const userList = document.querySelector("#user-list");
const viewedUser = document.querySelector("#viewed-user");
const message = document.querySelector("#message");

function showUser(user) {
  const identity = `${user.id}: ${user.name} (${user.email})`;
  const dates = `${user.createdAt} / ${user.updatedAt}`;
  viewedUser.textContent = `${identity} — ${dates}`;
}

async function loadUsers() {
  const url = `${ORIGIN}/users`;
  const response = await fetch(url);
  const users = await response.json();
  userList.replaceChildren();
  if (users.message) {
    message.textContent = users.message;
    return;
  }

  for (const user of users) {
    const item = document.createElement("li");
    const identity = `${user.id}: ${user.name} (${user.email})`;
    const dates = `${user.createdAt} / ${user.updatedAt}`;
    item.textContent = `${identity} — ${dates}`;
    userList.append(item);
  }
}

async function submitCreate(event) {
  event.preventDefault();
  message.textContent = "";
  const name = createName.value;
  const email = createEmail.value;
  const body = JSON.stringify({ name, email });
  const url = `${ORIGIN}/users`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
  const user = await response.json();
  if (user.message) {
    message.textContent = user.message;
    return;
  }

  showUser(user);
  await loadUsers();
}

async function submitView(event) {
  event.preventDefault();
  message.textContent = "";
  const id = viewId.value;
  const url = `${ORIGIN}/users/${id}`;
  const response = await fetch(url);
  const user = await response.json();
  if (user.message) {
    message.textContent = user.message;
    return;
  }

  showUser(user);
}

async function submitUpdate(event) {
  event.preventDefault();
  message.textContent = "";
  const id = updateId.value;
  const name = updateName.value;
  const email = updateEmail.value;
  const changes = {};
  if (name !== "") {
    changes.name = name;
  }
  if (email !== "") {
    changes.email = email;
  }
  const body = JSON.stringify(changes);
  const url = `${ORIGIN}/users/${id}`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body,
  });
  const user = await response.json();
  if (user.message) {
    message.textContent = user.message;
    return;
  }

  showUser(user);
  await loadUsers();
}

async function submitDelete(event) {
  event.preventDefault();
  message.textContent = "";
  const id = deleteId.value;
  const url = `${ORIGIN}/users/${id}`;
  const response = await fetch(url, { method: "DELETE" });
  if (response.status === 204) {
    viewedUser.textContent = "";
    await loadUsers();
    return;
  }

  const result = await response.json();
  if (result.message) {
    message.textContent = result.message;
  }
}

createForm.addEventListener("submit", submitCreate);
viewForm.addEventListener("submit", submitView);
updateForm.addEventListener("submit", submitUpdate);
deleteForm.addEventListener("submit", submitDelete);

loadUsers();
