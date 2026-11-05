// This page does not import logic/. It asks the main process through
// window.users, which preload.cjs publishes. Every answer is an object:
// { data } on success, { error } with the English message of logic/,
// or { cancelled: true } when the delete dialog is cancelled.

// Each known message has one Spanish sentence.
// This copy belongs to this client; the other clients keep their own.
const MESSAGES = {
  "User name is required": "Introduce un nombre.",
  "User email is invalid": "Introduce un email válido de hasta 64 caracteres.",
  "User email is already registered": "Ya existe un usuario con ese email.",
  "User does not exist": "No se ha encontrado ese usuario. Actualiza la lista.",
  "Unable to list users":
    "No se ha podido cargar la lista. Comprueba que el servidor de datos está arrancado.",
  "Unable to find user":
    "No se ha podido obtener el usuario. Comprueba que el servidor de datos está arrancado.",
  "Unable to create user":
    "No se ha podido crear el usuario. Comprueba que el servidor de datos está arrancado.",
  "Unable to update user":
    "No se ha podido guardar el usuario. Comprueba que el servidor de datos está arrancado.",
  "Unable to delete user":
    "No se ha podido eliminar el usuario. Comprueba que el servidor de datos está arrancado.",
};

const GENERIC_MESSAGE = "No se ha podido completar la operación.";

// The selection lives in memory, so closing the window forgets it.
// isBusy stops a second click while an action is still waiting for its answer.
const STATE = {
  selectedId: null,
  isBusy: false,
};

function translateError(message) {
  // Translate only known messages. Anything else shows the generic sentence
  // and never the original technical text.
  const isKnown = Object.hasOwn(MESSAGES, message);

  if (isKnown) {
    return MESSAGES[message];
  }

  return GENERIC_MESSAGE;
}

function showMessage(text, isError) {
  const message = document.getElementById("message");

  message.textContent = text;
  message.hidden = text === "";
  message.classList.toggle("message-error", isError);
}

function clearMessage() {
  showMessage("", false);
}

function showError(errorMessage) {
  const text = translateError(errorMessage);
  showMessage(text, true);
}

function markSelectedUser() {
  const buttons = document.querySelectorAll("#user-list button");

  for (const button of buttons) {
    const buttonId = Number(button.dataset.id);
    const isSelected = buttonId === STATE.selectedId;
    button.classList.toggle("is-selected", isSelected);
  }
}

function showCreateView() {
  STATE.selectedId = null;
  document.getElementById("create-view").hidden = false;
  document.getElementById("detail-view").hidden = true;
  markSelectedUser();
}

function showDetailView(user) {
  STATE.selectedId = user.id;

  // A saved name can contain HTML characters, so it is always written
  // with textContent or value and never read as HTML.
  document.getElementById("detail-title").textContent = user.name;
  document.getElementById("detail-id").textContent = user.id;
  document.getElementById("detail-created").textContent = user.createdAt;
  document.getElementById("detail-updated").textContent = user.updatedAt;
  document.getElementById("edit-name").value = user.name;
  document.getElementById("edit-email").value = user.email;

  document.getElementById("create-view").hidden = true;
  document.getElementById("detail-view").hidden = false;
  markSelectedUser();
}

function createUserButton(user) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.id = user.id;

  const name = document.createElement("strong");
  name.textContent = user.id + ". " + user.name;

  const email = document.createElement("span");
  email.textContent = user.email;

  button.append(name, email);

  return button;
}

async function loadUsers() {
  const list = document.getElementById("user-list");
  const emptyList = document.getElementById("empty-list");

  const answer = await window.users.list();

  // An empty list is only shown after a load that worked. If the load
  // fails, the message explains it and the list does not claim anything.
  if (answer.error !== undefined) {
    list.replaceChildren();
    emptyList.hidden = true;
    showError(answer.error);
    return;
  }

  const users = answer.data;
  const items = [];

  for (const user of users) {
    const item = document.createElement("li");
    const button = createUserButton(user);
    item.append(button);
    items.push(item);
  }

  list.replaceChildren(...items);
  emptyList.hidden = users.length > 0;

  // Another client may have deleted the user open in the panel. The detail
  // must not keep showing someone who is no longer in the list.
  let selectedUserExists = false;

  for (const user of users) {
    if (user.id === STATE.selectedId) {
      selectedUserExists = true;
    }
  }

  if (STATE.selectedId !== null && !selectedUserExists) {
    showCreateView();
  }

  markSelectedUser();
}

async function refreshList() {
  if (STATE.isBusy) {
    return;
  }

  STATE.isBusy = true;
  clearMessage();
  await loadUsers();
  STATE.isBusy = false;
}

async function selectUser(event) {
  const button = event.target.closest("button[data-id]");

  if (button === null || STATE.isBusy) {
    return;
  }

  STATE.isBusy = true;
  clearMessage();

  // The id comes from the list, so it goes back to a number here.
  const id = Number(button.dataset.id);
  const answer = await window.users.find(id);

  // Ask for the user again so the detail shows what is saved right now,
  // even if another client changed it after the list was loaded.
  if (answer.error !== undefined) {
    showError(answer.error);
  } else {
    showDetailView(answer.data);
  }

  STATE.isBusy = false;
}

async function createNewUser(event) {
  event.preventDefault();

  if (STATE.isBusy) {
    return;
  }

  STATE.isBusy = true;
  clearMessage();

  const name = document.getElementById("create-name").value;
  const email = document.getElementById("create-email").value;
  const answer = await window.users.create(name, email);

  // On failure the form keeps what was written so it can be corrected.
  if (answer.error !== undefined) {
    showError(answer.error);
    STATE.isBusy = false;
    return;
  }

  document.getElementById("create-form").reset();
  showMessage("Usuario creado.", false);
  await loadUsers();
  STATE.isBusy = false;
}

async function saveUser(event) {
  event.preventDefault();

  if (STATE.isBusy) {
    return;
  }

  STATE.isBusy = true;
  clearMessage();

  // The form arrives filled in, so both fields are always sent.
  // logic/ lets a user keep their own email.
  const name = document.getElementById("edit-name").value;
  const email = document.getElementById("edit-email").value;
  const changes = { name, email };
  const answer = await window.users.update(STATE.selectedId, changes);

  if (answer.error !== undefined) {
    showError(answer.error);
    STATE.isBusy = false;
    return;
  }

  showDetailView(answer.data);
  showMessage("Cambios guardados.", false);
  await loadUsers();
  STATE.isBusy = false;
}

async function deleteSelectedUser() {
  if (STATE.isBusy) {
    return;
  }

  STATE.isBusy = true;
  clearMessage();

  const answer = await window.users.remove(STATE.selectedId);

  if (answer.cancelled === true) {
    STATE.isBusy = false;
    return;
  }

  if (answer.error !== undefined) {
    showError(answer.error);
    STATE.isBusy = false;
    return;
  }

  showCreateView();
  showMessage("Usuario eliminado.", false);
  await loadUsers();
  STATE.isBusy = false;
}

function startNewUser() {
  if (STATE.isBusy) {
    return;
  }

  clearMessage();
  showCreateView();
}

function initializeClient() {
  // A module script runs after the HTML is available, so these controls exist.
  const refreshButton = document.getElementById("refresh");
  refreshButton.addEventListener("click", refreshList);
  const newUserButton = document.getElementById("new-user");
  newUserButton.addEventListener("click", startNewUser);
  const userList = document.getElementById("user-list");
  userList.addEventListener("click", selectUser);
  const createForm = document.getElementById("create-form");
  createForm.addEventListener("submit", createNewUser);
  const editForm = document.getElementById("edit-form");
  editForm.addEventListener("submit", saveUser);
  const deleteButton = document.getElementById("delete-user");
  deleteButton.addEventListener("click", deleteSelectedUser);

  refreshList();
}

initializeClient();
