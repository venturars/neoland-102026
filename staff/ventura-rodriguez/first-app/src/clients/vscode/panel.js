/* global document, acquireVsCodeApi, window */
const vscode = acquireVsCodeApi();

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

let pending = "";

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

function writeList(users) {
  userList.replaceChildren();
  for (const user of users) {
    writeListItem(user);
  }
}

function askList() {
  pending = "list";
  const reply = { action: "list" };
  vscode.postMessage(reply);
}

function receiveResult(event) {
  const result = event.data;
  if (result.message) {
    message.textContent = result.message;
    if (pending === "list") {
      userList.replaceChildren();
    }
    return;
  }
  if (pending === "list") {
    writeList(result.users);
    return;
  }
  if (pending === "view") {
    writeUser(result.user);
    return;
  }
  if (pending === "create") {
    writeUser(result.user);
    askList();
    return;
  }
  if (pending === "update") {
    writeUser(result.user);
    askList();
    return;
  }
  if (pending === "delete") {
    viewedUser.textContent = "";
    askList();
  }
}

function createFromForm(event) {
  event.preventDefault();
  message.textContent = "";
  const name = createName.value;
  const email = createEmail.value;
  pending = "create";
  const reply = { action: "create", name, email };
  vscode.postMessage(reply);
}

function viewFromForm(event) {
  event.preventDefault();
  message.textContent = "";
  const id = viewId.value;
  pending = "view";
  const reply = { action: "view", id };
  vscode.postMessage(reply);
}

function updateFromForm(event) {
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
  pending = "update";
  const reply = { action: "update", id, changes };
  vscode.postMessage(reply);
}

function deleteFromForm(event) {
  event.preventDefault();
  message.textContent = "";
  const id = deleteId.value;
  pending = "delete";
  const reply = { action: "delete", id };
  vscode.postMessage(reply);
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

window.addEventListener("message", (event) => {
  receiveResult(event);
});

askList();
