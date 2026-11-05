// This view does not import logic/. It asks the extension process with
// messages. Every answer is an object: { data } on success, { error } with
// the English message of logic/, or { cancelled: true } when the delete
// dialog is cancelled.

// VS Code only lets a view ask for this channel once.
const vscode = acquireVsCodeApi();

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

// The count shows this sentence in English, as it is, when the model
// cannot classify. It is not in MESSAGES because it has no Spanish copy.
const UNABLE_TO_CLASSIFY = "Unable to classify names";
const COULD_NOT_CLASSIFY = "Could not classify the users.";

// The selection lives in memory, so hiding the view forgets it.
// isBusy stops a second click while an action is still waiting for its answer.
const STATE = {
  selectedId: null,
  isBusy: false,
  isCounting: false,
  lastRequest: 0,
};

// Each request waits here, by its number, until its answer arrives.
const pendingRequests = new Map();

// The only wrapper around postMessage. A message has no answer of its own,
// so the number and this promise let each action read in order with await.
function call(action, values) {
  STATE.lastRequest = STATE.lastRequest + 1;

  const request = STATE.lastRequest;
  const message = { ...values, action, request };

  return new Promise((resolve) => {
    pendingRequests.set(request, resolve);
    vscode.postMessage(message);
  });
}

function receiveAnswer(event) {
  const answer = event.data;
  const resolve = pendingRequests.get(answer.request);

  if (resolve === undefined) {
    return;
  }

  pendingRequests.delete(answer.request);
  resolve(answer);
}

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

function showListView() {
  STATE.selectedId = null;
  document.getElementById("list-view").hidden = false;
  document.getElementById("detail-view").hidden = true;
}

function showDetailView(user) {
  STATE.selectedId = user.id;

  // A saved name can contain HTML characters, so it is always written
  // with textContent or value and never read as HTML.
  document.getElementById("detail-title").textContent = user.name;
  document.getElementById("detail-id").textContent = user.id;
  document.getElementById("detail-email").textContent = user.email;
  document.getElementById("detail-created").textContent = user.createdAt;
  document.getElementById("detail-updated").textContent = user.updatedAt;
  document.getElementById("edit-name").value = user.name;
  document.getElementById("edit-email").value = user.email;

  document.getElementById("list-view").hidden = true;
  document.getElementById("detail-view").hidden = false;
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
  const loading = document.getElementById("loading");

  loading.hidden = false;
  emptyList.hidden = true;

  const answer = await call("list", {});

  loading.hidden = true;

  // An empty list is only shown after a load that worked. If the load
  // fails, the message explains it and the list does not claim anything.
  if (answer.error !== undefined) {
    list.replaceChildren();
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
  const answer = await call("view", { id });

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
  const answer = await call("create", { name, email });

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
  const id = STATE.selectedId;
  const answer = await call("update", { id, changes });

  if (answer.error !== undefined) {
    showError(answer.error);
    STATE.isBusy = false;
    return;
  }

  showDetailView(answer.data);
  showMessage("Cambios guardados.", false);
  STATE.isBusy = false;
}

async function deleteSelectedUser() {
  if (STATE.isBusy) {
    return;
  }

  STATE.isBusy = true;
  clearMessage();

  const id = STATE.selectedId;
  const answer = await call("delete", { id });

  if (answer.cancelled === true) {
    STATE.isBusy = false;
    return;
  }

  if (answer.error !== undefined) {
    showError(answer.error);
    STATE.isBusy = false;
    return;
  }

  showListView();
  showMessage("Usuario eliminado.", false);
  await loadUsers();
  STATE.isBusy = false;
}

async function goBack() {
  if (STATE.isBusy) {
    return;
  }

  STATE.isBusy = true;
  clearMessage();
  showListView();
  await loadUsers();
  STATE.isBusy = false;
}

function showTab(tabName) {
  // The users tab is only hidden, not rebuilt, so its list, its detail and
  // what was written in its forms are still there when it comes back.
  const isUsers = tabName === "users";
  document.getElementById("users-tab").hidden = !isUsers;
  document.getElementById("count-tab").hidden = isUsers;

  const usersTab = document.getElementById("tab-users");
  usersTab.classList.toggle("is-active", isUsers);
  usersTab.setAttribute("aria-selected", String(isUsers));

  const countTab = document.getElementById("tab-count");
  countTab.classList.toggle("is-active", !isUsers);
  countTab.setAttribute("aria-selected", String(!isUsers));
}

function showUsersTab() {
  showTab("users");
}

function showCountTab() {
  showTab("count");
}

function showCountError(errorMessage) {
  let text = COULD_NOT_CLASSIFY;

  // Only this error has the English sentence. Any other error uses the
  // same Spanish table as the rest of the view.
  if (errorMessage !== UNABLE_TO_CLASSIFY) {
    text = translateError(errorMessage);
  }

  const message = document.getElementById("count-message");
  message.textContent = text;
  message.hidden = false;
}

async function requestCount() {
  if (STATE.isCounting) {
    return;
  }

  STATE.isCounting = true;

  // Hide the previous answer first: a failed count must not leave
  // numbers on the screen that look like its result.
  document.getElementById("count-message").hidden = true;
  document.getElementById("count-result").hidden = true;
  document.getElementById("count-loading").hidden = false;
  document.getElementById("count-button").disabled = true;

  const answer = await call("count", {});

  document.getElementById("count-loading").hidden = true;
  document.getElementById("count-button").disabled = false;
  STATE.isCounting = false;

  if (answer.error !== undefined) {
    showCountError(answer.error);
    return;
  }

  const counts = answer.data;
  document.getElementById("count-female").textContent = counts.female;
  document.getElementById("count-male").textContent = counts.male;
  document.getElementById("count-undefined").textContent = counts.undefined;
  document.getElementById("count-result").hidden = false;
}

async function initializeClient() {
  // This script is the last tag of the body, so these controls exist.
  window.addEventListener("message", receiveAnswer);

  const userList = document.getElementById("user-list");
  userList.addEventListener("click", selectUser);
  const createForm = document.getElementById("create-form");
  createForm.addEventListener("submit", createNewUser);
  const editForm = document.getElementById("edit-form");
  editForm.addEventListener("submit", saveUser);
  const backButton = document.getElementById("back");
  backButton.addEventListener("click", goBack);
  const deleteButton = document.getElementById("delete-user");
  deleteButton.addEventListener("click", deleteSelectedUser);

  const usersTab = document.getElementById("tab-users");
  usersTab.addEventListener("click", showUsersTab);
  const countTab = document.getElementById("tab-count");
  countTab.addEventListener("click", showCountTab);
  const countButton = document.getElementById("count-button");
  countButton.addEventListener("click", requestCount);

  STATE.isBusy = true;
  await loadUsers();
  STATE.isBusy = false;
}

initializeClient();
