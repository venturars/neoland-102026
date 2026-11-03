import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

// The browser imports the business functions directly. They work here
// because they only use import and fetch: SQLite lives in the data server
// (pnpm start), and this page does not go through the HTTP client.

// Each known message thrown by logic/ has one Spanish sentence.
// This copy belongs to the web client; the other clients keep their own.
const MESSAGES = {
  "User id must be a positive integer":
    "El identificador debe ser un número entero mayor que cero.",
  "User name is required": "Introduce un nombre.",
  "User email is invalid": "Introduce un email válido de hasta 64 caracteres.",
  "User email is already registered": "Ya existe un usuario con ese email.",
  "User changes must be an object": "Revisa los datos que quieres modificar.",
  "User does not exist":
    "No se ha encontrado ese usuario. Vuelve a la selección y actualiza la lista.",
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

// Keep only the current selection in memory. Reloading the page starts again
// at the list; saved changes live in the data server, not in this object.
const STATE = {
  selectedUser: null,
  isBusy: false,
};

function translateError(error) {
  // Translate only known messages. Anything else, such as a browser error,
  // shows the generic sentence and never the original technical text.
  if (error instanceof Error) {
    const isKnown = Object.hasOwn(MESSAGES, error.message);

    if (isKnown) {
      return MESSAGES[error.message];
    }
  }

  return GENERIC_MESSAGE;
}

function showMessage(text, isError) {
  const message = document.getElementById("message");

  // Treat messages as text, even if a saved name contains HTML characters.
  message.textContent = text;
  message.hidden = text === "";
  message.classList.toggle("message-error", isError);
}

function showScreen(screenName) {
  const screens = document.querySelectorAll("[data-screen]");

  for (const screen of screens) {
    screen.hidden = screen.id !== screenName + "-screen";
  }

  showMessage("", false);

  // Move focus with the screen so keyboard users do not remain on a hidden button.
  const heading = document.getElementById(screenName + "-heading");
  heading.focus();
}

function setDisabled(selector, isDisabled) {
  const controls = document.querySelectorAll(selector);

  for (const control of controls) {
    control.disabled = isDisabled;
  }
}

async function loadUserSelection() {
  STATE.selectedUser = null;
  STATE.isBusy = true;
  showScreen("selection");

  const select = document.getElementById("user-select");
  const submit = document.getElementById("select-user");
  const reload = document.getElementById("reload-users");
  const status = document.getElementById("selection-status");
  select.replaceChildren();
  select.disabled = true;
  submit.disabled = true;
  reload.disabled = true;
  status.textContent = "Cargando la lista…";

  try {
    const users = await listUsers();

    if (users.length === 0) {
      status.textContent = "No hay usuarios disponibles. Crea uno abajo.";
      return;
    }

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Elige un usuario";
    placeholder.disabled = true;
    placeholder.selected = true;
    select.append(placeholder);

    for (const user of users) {
      const option = document.createElement("option");
      option.value = String(user.id);
      option.textContent =
        "#" + user.id + " · " + user.name + " — " + user.email;
      select.append(option);
    }

    select.disabled = false;
    submit.disabled = false;
    status.textContent = "Selecciona el usuario con el que quieres continuar.";
  } catch (error) {
    // A failed request is different from a successful list with no users.
    status.textContent = "Actualiza la lista para volver a intentarlo.";
    showMessage(translateError(error), true);
  } finally {
    STATE.isBusy = false;
    reload.disabled = false;
  }
}

async function selectUser(event) {
  event.preventDefault();

  if (STATE.isBusy) {
    return;
  }

  const select = document.getElementById("user-select");
  const rawId = select.value;

  if (rawId === "") {
    showMessage("Elige un usuario de la lista.", true);
    return;
  }

  // The option keeps the id as text. findUserById checks the number.
  const id = Number(rawId);
  STATE.isBusy = true;
  setDisabled("#selection-screen select, #selection-screen button", true);

  try {
    // Read the user again: the list may have been loaded before a deletion.
    const user = await findUserById(id);
    STATE.selectedUser = user;
    showUserMenu();
  } catch (error) {
    showMessage(translateError(error), true);
  } finally {
    STATE.isBusy = false;
    setDisabled("#selection-screen select, #selection-screen button", false);
  }
}

async function createNewUser(event) {
  event.preventDefault();

  if (STATE.isBusy) {
    return;
  }

  const nameInput = document.getElementById("new-user-name");
  const name = nameInput.value;
  const emailInput = document.getElementById("new-user-email");
  const email = emailInput.value;
  STATE.isBusy = true;
  showMessage("", false);
  setDisabled("#create-form input, #create-form button", true);

  let user;

  try {
    user = await createUser(name, email);
  } catch (error) {
    // Keep the form unchanged so the rejected value can be corrected.
    showMessage(translateError(error), true);
    return;
  } finally {
    STATE.isBusy = false;
    setDisabled("#create-form input, #create-form button", false);
  }

  // Only a successful create empties the form and reloads the list.
  nameInput.value = "";
  emailInput.value = "";
  await loadUserSelection();
  showMessage("Usuario #" + user.id + " creado.", false);
}

function showUserMenu() {
  const user = STATE.selectedUser;

  if (user === null) {
    return;
  }

  // Read the saved selection, not the unfinished values in the edit form.
  const id = document.getElementById("menu-user-id");
  id.textContent = "Usuario #" + user.id;
  const name = document.getElementById("menu-user-name");
  name.textContent = user.name;
  const email = document.getElementById("menu-user-email");
  email.textContent = user.email;
  showScreen("menu");
}

function openUserEditor() {
  const user = STATE.selectedUser;

  if (user === null) {
    return;
  }

  // Opening the form always starts from saved data. Returning without saving
  // therefore discards the previous draft without sending a request.
  const name = document.getElementById("user-name");
  name.value = user.name;
  const email = document.getElementById("user-email");
  email.value = user.email;
  showScreen("edit");
}

async function saveUser(event) {
  event.preventDefault();

  if (STATE.isBusy || STATE.selectedUser === null) {
    return;
  }

  const nameInput = document.getElementById("user-name");
  const name = nameInput.value;
  const emailInput = document.getElementById("user-email");
  const email = emailInput.value;
  const id = STATE.selectedUser.id;
  STATE.isBusy = true;
  showMessage("", false);

  // Block repeated submissions and navigation until the save has finished.
  setDisabled("#edit-screen input, #edit-screen button", true);

  try {
    const user = await updateUser(id, { name, email });
    STATE.selectedUser = user;
    showUserMenu();
    showMessage("Datos guardados.", false);
  } catch (error) {
    // Keep the form unchanged so the rejected value can be corrected.
    showMessage(translateError(error), true);
  } finally {
    STATE.isBusy = false;
    setDisabled("#edit-screen input, #edit-screen button", false);
  }
}

async function deleteSelectedUser() {
  if (STATE.isBusy || STATE.selectedUser === null) {
    return;
  }

  const user = STATE.selectedUser;
  const confirmed = window.confirm(
    "¿Eliminar al usuario «" +
      user.name +
      "»? Esta acción no se puede deshacer.",
  );

  // Cancelling ends here. Nothing has been deleted yet.
  if (!confirmed) {
    return;
  }

  STATE.isBusy = true;
  showMessage("", false);
  setDisabled("#edit-screen input, #edit-screen button", true);

  try {
    await deleteUser(user.id);
  } catch (error) {
    showMessage(translateError(error), true);
    return;
  } finally {
    STATE.isBusy = false;
    setDisabled("#edit-screen input, #edit-screen button", false);
  }

  // deleteUser returns nothing. Reload the list after confirmed success.
  await loadUserSelection();
}

function navigate(event) {
  const button = event.target.closest("button[data-action]");

  if (button === null || STATE.isBusy) {
    return;
  }

  const action = button.dataset.action;

  // Only these buttons navigate. The disabled notes option has no action.
  if (action === "selection") {
    loadUserSelection();
  }

  if (action === "menu") {
    showUserMenu();
  }

  if (action === "edit") {
    openUserEditor();
  }
}

function initializeClient() {
  // A module script runs after the HTML is available, so these controls exist.
  const selectionForm = document.getElementById("selection-form");
  selectionForm.addEventListener("submit", selectUser);
  const createForm = document.getElementById("create-form");
  createForm.addEventListener("submit", createNewUser);
  const editForm = document.getElementById("edit-form");
  editForm.addEventListener("submit", saveUser);
  const deleteButton = document.getElementById("delete-user");
  deleteButton.addEventListener("click", deleteSelectedUser);
  document.addEventListener("click", navigate);

  loadUserSelection();
}

initializeClient();
