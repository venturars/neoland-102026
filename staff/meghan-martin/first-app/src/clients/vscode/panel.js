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
  viewedUser.textContent =
    String(user.id) +
    ". " +
    user.name +
    " (" +
    user.email +
    ") " +
    user.createdAt +
    " " +
    user.updatedAt;
}

function writeList(users) {
  userList.replaceChildren();
  for (const user of users) {
    const item = document.createElement("li");
    item.textContent =
      String(user.id) +
      ". " +
      user.name +
      " (" +
      user.email +
      ") " +
      user.createdAt +
      " " +
      user.updatedAt;
    userList.append(item);
  }
}

function askList() {
  pending = "list";
  vscode.postMessage({ action: "list" });
}

window.addEventListener("message", function (event) {
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
  if (pending === "create" || pending === "update") {
    writeUser(result.user);
    askList();
    return;
  }
  if (pending === "delete") {
    viewedUser.textContent = "";
    askList();
  }
});

createForm.addEventListener("submit", function (event) {
  event.preventDefault();
  message.textContent = "";
  pending = "create";
  vscode.postMessage({
    action: "create",
    name: createName.value,
    email: createEmail.value,
  });
});

viewForm.addEventListener("submit", function (event) {
  event.preventDefault();
  message.textContent = "";
  pending = "view";
  vscode.postMessage({ action: "view", id: viewId.value });
});

updateForm.addEventListener("submit", function (event) {
  event.preventDefault();
  message.textContent = "";
  const changes = {};
  if (updateName.value !== "") {
    changes.name = updateName.value;
  }
  if (updateEmail.value !== "") {
    changes.email = updateEmail.value;
  }
  pending = "update";
  vscode.postMessage({
    action: "update",
    id: updateId.value,
    changes: changes,
  });
});

deleteForm.addEventListener("submit", function (event) {
  event.preventDefault();
  message.textContent = "";
  pending = "delete";
  vscode.postMessage({ action: "delete", id: deleteId.value });
});

askList();
