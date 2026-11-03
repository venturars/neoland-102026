// Pantallas del cliente de navegador: enseña una cada vez y pide los datos al servidor.

const SCREEN_IDS = ["select-screen", "options-screen", "edit-screen"];

// La lista de usuarios y el usuario elegido.
let users = [];
let selectedUser = null;

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

function hideError(elementId) {
  const element = document.getElementById(elementId);
  element.textContent = "";
  element.hidden = true;
}

// Llama al servidor y devuelve el JSON. Si el servidor responde con un error, lo lanza con su mensaje.
async function callServer(method, path, body) {
  const options = { method: method, headers: {} };
  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(path, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error);
  }
  return data;
}

function renderUsers() {
  const tableBody = document.getElementById("users-body");
  tableBody.textContent = "";

  const table = document.getElementById("users-table");
  const emptyText = document.getElementById("empty-list");
  const hasUsers = users.length > 0;
  table.hidden = !hasUsers;
  emptyText.hidden = hasUsers;

  for (const user of users) {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = user.id;
    row.appendChild(idCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = user.name;
    row.appendChild(nameCell);

    const emailCell = document.createElement("td");
    emailCell.textContent = user.email;
    row.appendChild(emailCell);

    row.addEventListener("click", function () {
      selectUser(user);
    });
    tableBody.appendChild(row);
  }
}

async function loadUsers() {
  hideError("select-error");
  showScreen("select-screen");

  try {
    users = await callServer("GET", "/users");
    renderUsers();
  } catch (error) {
    showError("select-error", error.message);
  }
}

function selectUser(user) {
  selectedUser = user;

  const idText = document.getElementById("options-id");
  idText.textContent = selectedUser.id;
  const nameText = document.getElementById("options-name");
  nameText.textContent = selectedUser.name;
  const emailText = document.getElementById("options-email");
  emailText.textContent = selectedUser.email;

  showScreen("options-screen");
}

function openEditor() {
  hideError("edit-error");

  const nameInput = document.getElementById("edit-name");
  nameInput.value = selectedUser.name;
  const emailInput = document.getElementById("edit-email");
  emailInput.value = selectedUser.email;

  showScreen("edit-screen");
}

async function saveUser(event) {
  // Sin esto, el formulario recargaría la página.
  event.preventDefault();
  hideError("edit-error");

  const nameInput = document.getElementById("edit-name");
  const emailInput = document.getElementById("edit-email");
  const changes = { name: nameInput.value, email: emailInput.value };

  try {
    const updatedUser = await callServer(
      "PUT",
      "/users/" + selectedUser.id,
      changes,
    );
    selectUser(updatedUser);
  } catch (error) {
    showError("edit-error", error.message);
  }
}

async function removeUser() {
  hideError("edit-error");

  const question =
    "¿Seguro que quieres eliminar a " +
    selectedUser.name +
    " (id " +
    selectedUser.id +
    ")?";
  const isConfirmed = confirm(question);
  if (!isConfirmed) {
    return;
  }

  try {
    await callServer("DELETE", "/users/" + selectedUser.id);
    selectedUser = null;
    await loadUsers();
  } catch (error) {
    showError("edit-error", error.message);
  }
}

function connectButtons() {
  const optionsBack = document.getElementById("options-back");
  optionsBack.addEventListener("click", loadUsers);

  const optionsEdit = document.getElementById("options-edit");
  optionsEdit.addEventListener("click", openEditor);

  const editBack = document.getElementById("edit-back");
  editBack.addEventListener("click", function () {
    selectUser(selectedUser);
  });

  const editForm = document.getElementById("edit-form");
  editForm.addEventListener("submit", saveUser);

  const editDelete = document.getElementById("edit-delete");
  editDelete.addEventListener("click", removeUser);
}

connectButtons();
loadUsers();
