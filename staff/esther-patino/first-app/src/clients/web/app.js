import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

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

function showScreen(screenName) {
  const screens = document.querySelectorAll("[data-screen]");

  for (const screen of screens) {
    screen.hidden = screen.id !== screenName + "-screen";
  }

  showMessage("", false);
}

function showUserMenu() {
  const user = STATE.selectedUser;

  if (user === null) {
    return;
  }

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

  const name = document.getElementById("user-name");
  name.value = user.name;
  const email = document.getElementById("user-email");
  email.value = user.email;
  showScreen("edit");
}

function isLogicError(error) {
  const message = error instanceof Error ? error.message : "";

  if (message === "Name is empty") {
    return true;
  }

  if (message === "Email is invalid") {
    return true;
  }

  if (message === "Email is already used") {
    return true;
  }

  if (message === "Invalid id") {
    return true;
  }

  if (message === "User not found") {
    return true;
  }

  return false;
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
      status.textContent = "No hay usuarios disponibles.";
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
    status.textContent = "Actualiza la lista para volver a intentarlo.";

    if (isLogicError(error)) {
      showMessage(error.message, true);
      return;
    }

    showMessage(
      "No se ha podido cargar la lista. Comprueba la conexión con la aplicación.",
      true,
    );
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

  STATE.isBusy = true;
  const controls = document.querySelectorAll(
    "#selection-screen select, #selection-screen button",
  );

  for (const control of controls) {
    control.disabled = true;
  }

  try {
    const id = Number(rawId);
    const user = await findUserById(id);
    STATE.selectedUser = user;
    showUserMenu();
  } catch (error) {
    if (isLogicError(error)) {
      showMessage(error.message, true);
      return;
    }

    showMessage(
      "No se ha podido obtener el usuario. Vuelve a intentarlo.",
      true,
    );
  } finally {
    STATE.isBusy = false;

    for (const control of controls) {
      control.disabled = false;
    }
  }
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
  const controls = document.querySelectorAll(
    "#edit-screen input, #edit-screen button",
  );
  STATE.isBusy = true;
  showMessage("", false);

  for (const control of controls) {
    control.disabled = true;
  }

  try {
    const user = await updateUser(id, { name: name, email: email });
    STATE.selectedUser = user;
    showUserMenu();
    showMessage("Datos guardados.", false);
  } catch (error) {
    if (isLogicError(error)) {
      showMessage(error.message, true);
      return;
    }

    showMessage(
      "No se ha podido guardar el usuario. Comprueba la conexión y vuelve a intentarlo.",
      true,
    );
  } finally {
    STATE.isBusy = false;

    for (const control of controls) {
      control.disabled = false;
    }
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

  if (!confirmed) {
    return;
  }

  const controls = document.querySelectorAll(
    "#edit-screen input, #edit-screen button",
  );
  STATE.isBusy = true;
  showMessage("", false);

  for (const control of controls) {
    control.disabled = true;
  }

  try {
    await deleteUser(user.id);
    await loadUserSelection();
  } catch (error) {
    if (isLogicError(error)) {
      showMessage(error.message, true);
      return;
    }

    showMessage(
      "No se ha podido eliminar el usuario. Comprueba la conexión y vuelve a intentarlo.",
      true,
    );
  } finally {
    STATE.isBusy = false;

    for (const control of controls) {
      control.disabled = false;
    }
  }
}

function navigate(event) {
  const button = event.target.closest("button[data-action]");

  if (button === null || STATE.isBusy) {
    return;
  }

  const action = button.dataset.action;

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
  const selectionForm = document.getElementById("selection-form");
  selectionForm.addEventListener("submit", selectUser);
  const editForm = document.getElementById("edit-form");
  editForm.addEventListener("submit", saveUser);
  const deleteButton = document.getElementById("delete-user");
  deleteButton.addEventListener("click", deleteSelectedUser);
  document.addEventListener("click", navigate);

  loadUserSelection();
}

initializeClient();
