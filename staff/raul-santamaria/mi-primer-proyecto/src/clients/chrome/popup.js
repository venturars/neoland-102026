const ORIGIN = "http://127.0.0.1:3002";

const message = document.querySelector("#message");
const userList = document.querySelector("#user-list");
const viewedUser = document.querySelector("#viewed-user");
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

function writeUser(user) {
  const idText = String(user.id);
  const createdAt = user.createdAt;
  const updatedAt = user.updatedAt;
  const text = `${idText}. ${user.name} (${user.email}) ${createdAt} ${updatedAt}`;
  viewedUser.textContent = text;
}

function writeListItem(user) {
  const item = document.createElement("li");
  const idText = String(user.id);
  const createdAt = user.createdAt;
  const updatedAt = user.updatedAt;
  const text = `${idText}. ${user.name} (${user.email}) ${createdAt} ${updatedAt}`;
  item.textContent = text;
  userList.append(item);
}

async function showUsers() {
  const url = `${ORIGIN}/users`;
  const response = await fetch(url);
  const result = await response.json();
  if (result.message) {
    message.textContent = result.message;
    userList.replaceChildren();
    return;
  }

  userList.replaceChildren();
  for (const user of result) {
    writeListItem(user);
  }
}

async function createFromForm(event) {
  event.preventDefault();
  message.textContent = "";
  const name = createName.value;
  const email = createEmail.value;
  const url = `${ORIGIN}/users`;
  const payload = { name, email };
  const body = JSON.stringify(payload);
  const requestInit = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  };
  const response = await fetch(url, requestInit);
  const result = await response.json();
  if (result.message) {
    message.textContent = result.message;
    return;
  }

  writeUser(result);
  await showUsers();
}

async function viewFromForm(event) {
  event.preventDefault();
  message.textContent = "";
  const id = viewId.value;
  const url = `${ORIGIN}/users/${id}`;
  const response = await fetch(url);
  const result = await response.json();
  if (result.message) {
    message.textContent = result.message;
    return;
  }

  writeUser(result);
}

async function updateFromForm(event) {
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
  const url = `${ORIGIN}/users/${id}`;
  const body = JSON.stringify(changes);
  const requestInit = {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body,
  };
  const response = await fetch(url, requestInit);
  const result = await response.json();
  if (result.message) {
    message.textContent = result.message;
    return;
  }

  writeUser(result);
  await showUsers();
}

async function deleteFromForm(event) {
  event.preventDefault();
  message.textContent = "";
  const id = deleteId.value;
  const url = `${ORIGIN}/users/${id}`;
  const requestInit = { method: "DELETE" };
  const response = await fetch(url, requestInit);
  if (response.status === 204) {
    viewedUser.textContent = "";
    await showUsers();
    return;
  }

  const result = await response.json();
  if (result.message) {
    message.textContent = result.message;
  }
}

createForm.addEventListener("submit", (event) => {
  createFromForm(event);
});

viewForm.addEventListener("submit", (event) => {
  viewFromForm(event);
});

updateForm.addEventListener("submit", (event) => {
  updateFromForm(event);
});

deleteForm.addEventListener("submit", (event) => {
  deleteFromForm(event);
});

showUsers();
