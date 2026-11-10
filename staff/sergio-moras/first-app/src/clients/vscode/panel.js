// Panel de la extensión de VS Code: la lista con el alta y la ficha de un usuario.
// Corre aislado dentro de VS Code y no puede llamar a nada: pide cada operación
// a extension.js con un mensaje y enseña el resultado o el mensaje de error tal cual.

const vscode = acquireVsCodeApi();

const SCREEN_IDS = ["users-screen", "user-screen"];

// Las preguntas que esperan respuesta, por su id.
const pending = new Map();
let nextId = 1;

// El usuario de la ficha abierta.
let openedUser = null;

// Pide una acción a extension.js. Devuelve su resultado o lanza un Error con su mensaje.
function callExtension(action, data) {
  const id = nextId;
  nextId = nextId + 1;

  // Los datos van aparte: un id de usuario no puede pisar el id de la pregunta.
  const message = { id: id, action: action, data: data };
  return new Promise(function (resolve, reject) {
    pending.set(id, { resolve: resolve, reject: reject });
    vscode.postMessage(message);
  });
}

function receiveReply(event) {
  const reply = event.data;
  if (!pending.has(reply.id)) {
    return;
  }
  const waiting = pending.get(reply.id);
  pending.delete(reply.id);

  if (reply.ok) {
    waiting.resolve(reply.result);
  } else {
    waiting.reject(new Error(reply.error));
  }
}

function showScreen(screenId) {
  for (const id of SCREEN_IDS) {
    const screen = document.getElementById(id);
    screen.hidden = id !== screenId;
  }
}

function showError(elementId, message) {
  const element = document.getElementById(elementId);
  element.textContent = "Error: " + message;
  element.hidden = false;
}

function clearError(elementId) {
  const element = document.getElementById(elementId);
  element.textContent = "";
  element.hidden = true;
}

function writeText(elementId, text) {
  const element = document.getElementById(elementId);
  element.textContent = text;
}

function createUserItem(user) {
  const item = document.createElement("li");

  const button = document.createElement("button");
  button.type = "button";
  button.className = "user-item";

  const id = document.createElement("span");
  id.className = "user-id";
  id.textContent = "#" + user.id;
  button.appendChild(id);

  const text = document.createElement("span");
  text.className = "user-text";

  const name = document.createElement("span");
  name.className = "user-name";
  name.textContent = user.name;
  text.appendChild(name);

  const email = document.createElement("span");
  email.className = "user-email";
  email.textContent = user.email;
  text.appendChild(email);

  button.appendChild(text);
  button.addEventListener("click", function () {
    openUser(user);
  });
  item.appendChild(button);
  return item;
}

// Pinta la lista, o el texto de lista vacía si no hay usuarios.
async function loadUsers() {
  clearError("users-error");

  const list = document.getElementById("users-list");
  const emptyText = document.getElementById("users-empty");

  let users;
  try {
    users = await callExtension("list", {});
  } catch (error) {
    showError("users-error", error.message);
    return;
  }

  list.textContent = "";
  for (const user of users) {
    const item = createUserItem(user);
    list.appendChild(item);
  }
  const hasUsers = users.length > 0;
  list.hidden = !hasUsers;
  emptyText.hidden = hasUsers;
}

async function addUser(event) {
  event.preventDefault();
  clearError("users-error");

  const nameInput = document.getElementById("add-name");
  const emailInput = document.getElementById("add-email");
  const data = { name: nameInput.value, email: emailInput.value };

  try {
    await callExtension("create", data);
  } catch (error) {
    showError("users-error", error.message);
    return;
  }

  nameInput.value = "";
  emailInput.value = "";
  await loadUsers();
}

// Pinta los datos de la ficha y rellena los campos con los datos actuales.
function showUser(user) {
  openedUser = user;

  writeText("user-title", user.name);
  writeText("user-id", user.id);
  writeText("user-name", user.name);
  writeText("user-email", user.email);
  writeText("user-created", user.createdAt);
  writeText("user-updated", user.updatedAt);

  const nameInput = document.getElementById("save-name");
  nameInput.value = user.name;
  const emailInput = document.getElementById("save-email");
  emailInput.value = user.email;
}

function openUser(user) {
  clearError("user-error");
  showUser(user);
  showScreen("user-screen");
}

async function saveUser(event) {
  event.preventDefault();
  clearError("user-error");

  const nameInput = document.getElementById("save-name");
  const emailInput = document.getElementById("save-email");
  const data = {
    id: openedUser.id,
    name: nameInput.value,
    email: emailInput.value,
  };

  let user;
  try {
    user = await callExtension("update", data);
  } catch (error) {
    showError("user-error", error.message);
    return;
  }

  showUser(user);
  await loadUsers();
}

function askDelete() {
  clearError("user-error");
  const text =
    "Se borrará a " + openedUser.name + " (" + openedUser.email + ").";
  writeText("delete-text", text);
  const dialog = document.getElementById("delete-dialog");
  dialog.showModal();
}

function closeDeleteDialog() {
  const dialog = document.getElementById("delete-dialog");
  dialog.close();
}

async function removeUser() {
  closeDeleteDialog();

  try {
    await callExtension("delete", { id: openedUser.id });
  } catch (error) {
    showError("user-error", error.message);
    return;
  }

  openedUser = null;
  showScreen("users-screen");
  await loadUsers();
}

async function goBack() {
  openedUser = null;
  showScreen("users-screen");
  await loadUsers();
}

function connectButtons() {
  window.addEventListener("message", receiveReply);

  const addForm = document.getElementById("add-form");
  addForm.addEventListener("submit", addUser);

  const saveForm = document.getElementById("save-form");
  saveForm.addEventListener("submit", saveUser);

  const deleteButton = document.getElementById("delete-button");
  deleteButton.addEventListener("click", askDelete);

  const deleteCancel = document.getElementById("delete-cancel");
  deleteCancel.addEventListener("click", closeDeleteDialog);

  const deleteConfirm = document.getElementById("delete-confirm");
  deleteConfirm.addEventListener("click", removeUser);

  const backButton = document.getElementById("user-back");
  backButton.addEventListener("click", goBack);
}

connectButtons();
loadUsers();
