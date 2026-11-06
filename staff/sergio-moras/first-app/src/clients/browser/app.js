// Pantallas del cliente de navegador: enseña una cada vez y llama a las funciones de logic/.

import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

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

// Las iniciales del círculo: la primera letra de las dos primeras palabras del nombre.
function getInitials(name) {
  const words = name.trim().split(" ");
  let initials = "";
  for (const word of words) {
    if (word !== "" && initials.length < 2) {
      initials = initials + word[0];
    }
  }
  return initials.toUpperCase();
}

function createUserRow(user) {
  const row = document.createElement("button");
  row.type = "button";
  row.className = "user-row";

  const avatar = document.createElement("span");
  avatar.className = "avatar";
  avatar.textContent = getInitials(user.name);
  row.appendChild(avatar);

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

  row.appendChild(text);

  const id = document.createElement("span");
  id.className = "user-id";
  id.textContent = "#" + user.id;
  row.appendChild(id);

  row.addEventListener("click", function () {
    selectUser(user);
  });
  return row;
}

function renderUsers() {
  const list = document.getElementById("users-list");
  list.textContent = "";

  const emptyText = document.getElementById("empty-list");
  const hasUsers = users.length > 0;
  list.hidden = !hasUsers;
  emptyText.hidden = hasUsers;

  for (const user of users) {
    const row = createUserRow(user);
    list.appendChild(row);
  }
}

async function loadUsers() {
  hideError("select-error");
  showScreen("select-screen");

  try {
    users = await listUsers();
    renderUsers();
  } catch (error) {
    showError("select-error", error.message);
  }
}

function selectUser(user) {
  selectedUser = user;

  const avatar = document.getElementById("options-avatar");
  avatar.textContent = getInitials(selectedUser.name);
  const nameText = document.getElementById("options-name");
  nameText.textContent = selectedUser.name;
  const emailText = document.getElementById("options-email");
  emailText.textContent = selectedUser.email;
  const idText = document.getElementById("options-id");
  idText.textContent = "Id " + selectedUser.id;

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

  try {
    const updatedUser = await updateUser(
      selectedUser.id,
      nameInput.value,
      emailInput.value,
    );
    selectUser(updatedUser);
  } catch (error) {
    showError("edit-error", error.message);
  }
}

function askDeleteConfirmation() {
  hideError("edit-error");

  const question = document.getElementById("delete-question");
  question.textContent =
    "¿Seguro que quieres eliminar a " +
    selectedUser.name +
    " (id " +
    selectedUser.id +
    ")?";

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
    await deleteUser(selectedUser.id);
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
  editDelete.addEventListener("click", askDeleteConfirmation);

  const deleteCancel = document.getElementById("delete-cancel");
  deleteCancel.addEventListener("click", closeDeleteDialog);

  const deleteConfirm = document.getElementById("delete-confirm");
  deleteConfirm.addEventListener("click", removeUser);

  // Un clic en el fondo oscuro llega al propio <dialog>, no a su contenido: cancela.
  // Esc ya lo cierra el navegador.
  const dialog = document.getElementById("delete-dialog");
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      closeDeleteDialog();
    }
  });
}

connectButtons();
loadUsers();
