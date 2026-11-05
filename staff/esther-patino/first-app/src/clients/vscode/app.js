/* global acquireVsCodeApi, document, window */
const editor = acquireVsCodeApi();

const STATE = {
  selectedUser: null,
  isBusy: false,
};

function showMessage(text, isError) {
  const message = document.getElementById("message");

  message.textContent = text;
  message.hidden = text === "";
  message.classList.toggle("message-error", isError);
}

function showUsers(users) {
  const list = document.getElementById("user-list");
  list.replaceChildren();

  for (const user of users) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "user-item";
    button.textContent = "#" + user.id + " · " + user.name + " — " + user.email;
    button.addEventListener("click", function () {
      viewUser(user.id);
    });
    item.append(button);
    list.append(item);
  }
}

function fillForm(user) {
  const name = document.getElementById("user-name");
  const email = document.getElementById("user-email");

  if (user === null) {
    name.value = "";
    email.value = "";
    return;
  }

  name.value = user.name;
  email.value = user.email;
}

function showCard(user) {
  const card = document.getElementById("user-card");
  card.hidden = false;
  document.getElementById("card-id").textContent = "Id: " + user.id;
  document.getElementById("card-name").textContent = "Nombre: " + user.name;
  document.getElementById("card-email").textContent = "Email: " + user.email;
  document.getElementById("card-created").textContent =
    "Creado: " + user.createdAt;
  document.getElementById("card-updated").textContent =
    "Cambiado: " + user.updatedAt;
}

function hideCard() {
  const card = document.getElementById("user-card");
  card.hidden = true;
}

function listUsers() {
  if (STATE.isBusy) {
    return;
  }

  STATE.isBusy = true;
  showMessage("", false);
  editor.postMessage({ type: "list-users" });
}

function viewUser(id) {
  if (STATE.isBusy) {
    return;
  }

  STATE.isBusy = true;
  showMessage("", false);
  editor.postMessage({ type: "find-user-by-id", id });
}

function createUser() {
  if (STATE.isBusy) {
    return;
  }

  const name = document.getElementById("user-name").value;
  const email = document.getElementById("user-email").value;
  STATE.isBusy = true;
  showMessage("", false);
  editor.postMessage({ type: "create-user", name, email });
}

function searchUsers(event) {
  event.preventDefault();

  if (STATE.isBusy) {
    return;
  }

  const criterion = document.getElementById("search-criterion").value;
  const value = document.getElementById("search-value").value;
  STATE.isBusy = true;
  showMessage("", false);
  editor.postMessage({ type: "search-users", criterion, value });
}

function saveUser(event) {
  event.preventDefault();

  if (STATE.isBusy) {
    return;
  }

  if (STATE.selectedUser === null) {
    return;
  }

  const name = document.getElementById("user-name").value;
  const email = document.getElementById("user-email").value;
  const id = STATE.selectedUser.id;
  STATE.isBusy = true;
  showMessage("", false);
  editor.postMessage({ type: "update-user", id, name, email });
}

function deleteUser() {
  if (STATE.isBusy) {
    return;
  }

  if (STATE.selectedUser === null) {
    return;
  }

  const id = STATE.selectedUser.id;
  STATE.isBusy = true;
  showMessage("", false);
  editor.postMessage({ type: "delete-user", id });
}

function onEditorMessage(event) {
  const message = event.data;

  if (message.type === "users") {
    showUsers(message.users);
    STATE.isBusy = false;
    return;
  }

  if (message.type === "user") {
    STATE.selectedUser = message.user;
    fillForm(message.user);
    showCard(message.user);
    STATE.isBusy = false;
    return;
  }

  if (message.type === "created") {
    STATE.selectedUser = null;
    fillForm(null);
    hideCard();
    STATE.isBusy = false;
    listUsers();
    return;
  }

  if (message.type === "saved") {
    STATE.selectedUser = message.user;
    fillForm(message.user);
    showCard(message.user);
    STATE.isBusy = false;
    listUsers();
    return;
  }

  if (message.type === "deleted") {
    STATE.selectedUser = null;
    fillForm(null);
    hideCard();
    STATE.isBusy = false;
    listUsers();
    return;
  }

  if (message.type === "gender-count") {
    showGenderCount(message.count);
    STATE.isBusy = false;
    return;
  }

  if (message.type === "error") {
    showMessage(message.message, true);
    STATE.isBusy = false;
  }
}

function showUsersSection() {
  const usersSection = document.getElementById("users-section");
  const countSection = document.getElementById("count-section");
  const usersTab = document.getElementById("show-users");
  const countTab = document.getElementById("show-count");

  usersSection.hidden = false;
  countSection.hidden = true;
  usersTab.classList.add("tab-selected");
  countTab.classList.remove("tab-selected");
}

function showCountSection() {
  const usersSection = document.getElementById("users-section");
  const countSection = document.getElementById("count-section");
  const usersTab = document.getElementById("show-users");
  const countTab = document.getElementById("show-count");

  usersSection.hidden = true;
  countSection.hidden = false;
  usersTab.classList.remove("tab-selected");
  countTab.classList.add("tab-selected");
}

function showGenderCount(count) {
  const women = document.getElementById("count-women");
  const men = document.getElementById("count-men");
  const undefinedUser = document.getElementById("count-undefined");

  women.textContent = "women " + count.women;
  men.textContent = "men " + count.men;
  undefinedUser.textContent = "undefinedUser " + count.undefinedUser;
  women.hidden = false;
  men.hidden = false;
  undefinedUser.hidden = false;
}

function countUsers() {
  if (STATE.isBusy) {
    return;
  }

  STATE.isBusy = true;
  showMessage("", false);
  editor.postMessage({ type: "users-gender-count" });
}

function initializeClient() {
  const searchForm = document.getElementById("search-form");
  searchForm.addEventListener("submit", searchUsers);
  const userForm = document.getElementById("user-form");
  userForm.addEventListener("submit", saveUser);
  const listButton = document.getElementById("list-users");
  listButton.addEventListener("click", listUsers);
  const createButton = document.getElementById("create-user");
  createButton.addEventListener("click", createUser);
  const deleteButton = document.getElementById("delete-user");
  deleteButton.addEventListener("click", deleteUser);
  const usersTab = document.getElementById("show-users");
  usersTab.addEventListener("click", showUsersSection);
  const countTab = document.getElementById("show-count");
  countTab.addEventListener("click", showCountSection);
  const countButton = document.getElementById("count-users");
  countButton.addEventListener("click", countUsers);
  window.addEventListener("message", onEditorMessage);
  listUsers();
}

initializeClient();
