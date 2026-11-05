/* global document, window, acquireVsCodeApi */
const vscode = acquireVsCodeApi();
let pending;
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

function requestList() {
  pending = "list";
  vscode.postMessage({ action: "list" });
}

function displayUser(user) {
  const details = [
    user.id,
    user.name,
    user.email,
    user.createdAt,
    user.updatedAt,
  ];
  const text = details.join(" | ");
  viewedUser.textContent = text;
}

createForm.addEventListener("submit", (event) => {
  event.preventDefault();
  message.textContent = "";
  const name = createName.value;
  const email = createEmail.value;
  pending = "create";
  vscode.postMessage({ action: "create", name, email });
});

viewForm.addEventListener("submit", (event) => {
  event.preventDefault();
  message.textContent = "";
  const id = viewId.value;
  pending = "view";
  vscode.postMessage({ action: "view", id });
});

updateForm.addEventListener("submit", (event) => {
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
  vscode.postMessage({ action: "update", id, changes });
});

deleteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  message.textContent = "";
  const id = deleteId.value;
  pending = "delete";
  vscode.postMessage({ action: "delete", id });
});

window.addEventListener("message", (event) => {
  const action = pending;
  const response = event.data;
  if (response.message) {
    if (action === "list") {
      userList.replaceChildren();
    }
    message.textContent = response.message;
    return;
  }
  if (action === "list") {
    userList.replaceChildren();
    for (const user of response.users) {
      const item = document.createElement("li");
      const details = [
        user.id,
        user.name,
        user.email,
        user.createdAt,
        user.updatedAt,
      ];
      const text = details.join(" | ");
      item.textContent = text;
      userList.append(item);
    }
    return;
  }
  if (response.user) {
    displayUser(response.user);
  }
  if (action === "delete") {
    viewedUser.textContent = "";
  }
  if (action === "create" || action === "update" || action === "delete") {
    requestList();
  }
});

requestList();
