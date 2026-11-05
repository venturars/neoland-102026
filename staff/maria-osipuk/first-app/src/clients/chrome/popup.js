// This page does not import logic/: an extension only sees its own folder.
// It asks its own API with fetch. Every error is shown in English, exactly
// as the API answers it, without a table of translations.

const API = "http://127.0.0.1:3002";

// These two messages are born here, because these failures never reach
// logic/: the API is stopped, or an error answer brings no message.
const API_IS_UNREACHABLE = "Unable to reach the API";
const OPERATION_FAILED = "Unable to complete the operation";

// The selection lives in memory, so closing the window forgets it.
// isBusy stops a second click while an action is still waiting for its answer.
const STATE = {
  selectedId: null,
  isBusy: false,
};

// The only wrapper of fetch in this client. It always answers an object:
// { data } on success or { error } with the message to show. In this way
// each action below reads the same, and no action needs its own try.
async function callApi(method, route, body) {
  const options = { method };

  // Fastify answers 400 to a JSON content-type without a body, so only
  // the requests that really send data declare it.
  if (body !== undefined) {
    options.headers = { "content-type": "application/json" };
    options.body = JSON.stringify(body);
  }

  const url = API + route;
  let response;

  // fetch only fails here if nobody answers, which means the API is stopped.
  try {
    response = await fetch(url, options);
  } catch {
    return { error: API_IS_UNREACHABLE };
  }

  // A delete answers 204 and has no body to read.
  if (response.status === 204) {
    return { data: null };
  }

  let answer;

  try {
    answer = await response.json();
  } catch {
    return { error: OPERATION_FAILED };
  }

  if (response.ok) {
    return { data: answer };
  }

  // An answer of the API always brings message. Without it there is
  // no text that can be shown.
  if (answer === null || typeof answer.message !== "string") {
    return { error: OPERATION_FAILED };
  }

  return { error: answer.message };
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
  showMessage(errorMessage, true);
}

function hideDeleteConfirmation() {
  document.getElementById("delete-actions").hidden = false;
  document.getElementById("delete-confirmation").hidden = true;
}

function showListView() {
  STATE.selectedId = null;
  hideDeleteConfirmation();
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

  hideDeleteConfirmation();
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
  const loading = document.getElementById("loading");
  const list = document.getElementById("user-list");
  const emptyList = document.getElementById("empty-list");

  const answer = await callApi("GET", "/users");
  loading.hidden = true;

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
}

async function selectUser(event) {
  const button = event.target.closest("button[data-id]");

  if (button === null || STATE.isBusy) {
    return;
  }

  STATE.isBusy = true;
  clearMessage();

  // Ask for the user again so the detail shows what is saved right now,
  // even if another client changed it after the list was loaded.
  const route = "/users/" + button.dataset.id;
  const answer = await callApi("GET", route);

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
  const answer = await callApi("POST", "/users", { name, email });

  // On failure the form keeps what was written so it can be corrected.
  if (answer.error !== undefined) {
    showError(answer.error);
    STATE.isBusy = false;
    return;
  }

  document.getElementById("create-form").reset();
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
  const route = "/users/" + STATE.selectedId;
  const answer = await callApi("PATCH", route, { name, email });

  if (answer.error !== undefined) {
    showError(answer.error);
    STATE.isBusy = false;
    return;
  }

  showDetailView(answer.data);
  showMessage("Cambios guardados.", false);
  STATE.isBusy = false;
}

// The confirmation uses buttons of this page and not window.confirm: a native
// dialog can take the focus away, and Chrome closes the window when it loses it.
function askToDelete() {
  if (STATE.isBusy) {
    return;
  }

  clearMessage();
  document.getElementById("delete-actions").hidden = true;
  document.getElementById("delete-confirmation").hidden = false;
}

function cancelDelete() {
  if (STATE.isBusy) {
    return;
  }

  hideDeleteConfirmation();
}

async function deleteSelectedUser() {
  if (STATE.isBusy) {
    return;
  }

  STATE.isBusy = true;
  clearMessage();

  const route = "/users/" + STATE.selectedId;
  const answer = await callApi("DELETE", route);

  // The detail stays open, so the person can read why it failed.
  if (answer.error !== undefined) {
    hideDeleteConfirmation();
    showError(answer.error);
    STATE.isBusy = false;
    return;
  }

  showListView();
  await loadUsers();
  STATE.isBusy = false;
}

async function goBackToList() {
  if (STATE.isBusy) {
    return;
  }

  STATE.isBusy = true;
  clearMessage();
  showListView();

  // Load again, because the detail may have changed a name.
  await loadUsers();
  STATE.isBusy = false;
}

async function initializeClient() {
  // A module script runs after the HTML is available, so these controls exist.
  const userList = document.getElementById("user-list");
  userList.addEventListener("click", selectUser);
  const createForm = document.getElementById("create-form");
  createForm.addEventListener("submit", createNewUser);
  const editForm = document.getElementById("edit-form");
  editForm.addEventListener("submit", saveUser);
  const backButton = document.getElementById("back");
  backButton.addEventListener("click", goBackToList);
  const deleteButton = document.getElementById("delete-user");
  deleteButton.addEventListener("click", askToDelete);
  const confirmButton = document.getElementById("confirm-delete");
  confirmButton.addEventListener("click", deleteSelectedUser);
  const cancelButton = document.getElementById("cancel-delete");
  cancelButton.addEventListener("click", cancelDelete);

  STATE.isBusy = true;
  await loadUsers();
  STATE.isBusy = false;
}

initializeClient();
