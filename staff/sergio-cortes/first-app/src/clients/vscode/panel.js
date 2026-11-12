const vscode = acquireVsCodeApi();

const STATE = {
  selectedUser: null,
  isBusy: false,
};

let requestSequence = 0;
const pendingRequests = new Map();

function callExtension(action, fields) {
  const request = requestSequence + 1;
  requestSequence = request;
  const message = { request, action };

  if (fields !== undefined) {
    const keys = Object.keys(fields);

    for (const key of keys) {
      message[key] = fields[key];
    }
  }

  return new Promise((resolve, reject) => {
    pendingRequests.set(request, { resolve, reject });
    vscode.postMessage(message);
  });
}

window.addEventListener("message", (event) => {
  const data = event.data;
  const request = data.request;
  const item = pendingRequests.get(request);

  if (item === undefined) {
    return;
  }

  pendingRequests.delete(request);

  if (data.error !== undefined) {
    item.reject(new Error(data.error));
    return;
  }

  item.resolve(data);
});

function getDeletePopover() {
  return document.getElementById("delete-popover");
}

function showMessage(text, isError) {
  const message = document.getElementById("message");

  message.textContent = text;
  message.hidden = text === "";
  message.classList.toggle("message-error", isError);
}

function deleteEmailMatches() {
  if (STATE.selectedUser === null) {
    return false;
  }

  const input = document.getElementById("delete-confirm-email");
  const typed = input.value;
  const trimmed = typed.trim();
  const stored = STATE.selectedUser.email;
  const storedTrimmed = stored.trim();
  const typedLower = trimmed.toLowerCase();
  const storedLower = storedTrimmed.toLowerCase();
  const matches = typedLower === storedLower;

  return matches;
}

function syncDeleteConfirmButton() {
  const button = document.getElementById("delete-confirm-yes");
  const matches = deleteEmailMatches();
  button.disabled = !matches;
}

function resetDeleteConfirm() {
  const input = document.getElementById("delete-confirm-email");
  input.value = "";
  syncDeleteConfirmButton();
  const popover = getDeletePopover();

  if (popover.open) {
    popover.close();
  }
}

function showScreen(screenName) {
  const screens = document.querySelectorAll("[data-screen]");

  for (const screen of screens) {
    screen.hidden = screen.id !== screenName + "-screen";
  }

  if (screenName !== "edit") {
    resetDeleteConfirm();
  }

  showMessage("", false);
}

function rememberSelectedUser(user) {
  STATE.selectedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
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
  resetDeleteConfirm();
  showScreen("edit");
}

function fillUserSelect(users, statusText) {
  const select = document.getElementById("user-select");
  const submit = document.getElementById("select-user");
  const status = document.getElementById("selection-status");
  select.replaceChildren();

  if (users.length === 0) {
    select.disabled = true;
    submit.disabled = true;
    status.textContent = statusText;
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
    option.textContent = "#" + user.id + " · " + user.name + " — " + user.email;
    select.append(option);
  }

  select.disabled = false;
  submit.disabled = false;
  status.textContent = statusText;
}

async function loadUserSelection() {
  STATE.selectedUser = null;
  STATE.isBusy = true;
  showScreen("selection");

  const reload = document.getElementById("reload-users");
  const status = document.getElementById("selection-status");
  reload.disabled = true;
  status.textContent = "Cargando la lista…";

  try {
    const data = await callExtension("list");
    const users = data.users;
    fillUserSelect(
      users,
      "Selecciona el usuario con el que quieres continuar.",
    );

    if (users.length === 0) {
      status.textContent = "No hay usuarios disponibles.";
    }
  } catch (error) {
    status.textContent = "Actualiza la lista para volver a intentarlo.";

    if (error instanceof Error) {
      showMessage(error.message, true);
    } else {
      showMessage(
        "No se ha podido cargar la lista. Comprueba la conexión con la aplicación.",
        true,
      );
    }
  } finally {
    STATE.isBusy = false;
    reload.disabled = false;
  }
}

async function searchUsers(event) {
  event.preventDefault();

  if (STATE.isBusy) {
    return;
  }

  const criterion = document.getElementById("search-criterion").value;
  const valueInput = document.getElementById("search-value");
  const value = valueInput.value;
  const controls = document.querySelectorAll(
    "#search-form select, #search-form input, #search-form button",
  );
  STATE.isBusy = true;
  showMessage("", false);

  for (const control of controls) {
    control.disabled = true;
  }

  try {
    let data;

    if (criterion === "name") {
      data = await callExtension("searchName", { name: value });
    }

    if (criterion === "email") {
      data = await callExtension("searchEmail", { email: value });
    }

    if (criterion === "id") {
      data = await callExtension("searchId", { rawId: value });
    }

    const users = data.users;

    if (users.length === 0) {
      fillUserSelect(users, "No hay usuarios disponibles.");
      const status = document.getElementById("selection-status");
      status.textContent = "No hay usuarios disponibles.";
      return;
    }

    if (users.length === 1) {
      const user = users[0];
      rememberSelectedUser(user);
      showUserMenu();
      return;
    }

    fillUserSelect(
      users,
      "Varios usuarios coinciden. Elige uno y pulsa Continuar.",
    );
    showMessage(
      "Varios usuarios coinciden. Elige uno en la lista y pulsa Continuar.",
      false,
    );
  } catch (error) {
    if (error instanceof Error) {
      showMessage(error.message, true);
    } else {
      showMessage(
        "No se ha podido buscar. Comprueba la conexión y vuelve a intentarlo.",
        true,
      );
    }
  } finally {
    STATE.isBusy = false;

    for (const control of controls) {
      control.disabled = false;
    }
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
    const data = await callExtension("findUserById", { rawId });
    const user = data.user;
    rememberSelectedUser(user);
    showUserMenu();
  } catch (error) {
    if (error instanceof Error) {
      showMessage(error.message, true);
    } else {
      showMessage(
        "No se ha podido obtener el usuario. Vuelve a intentarlo.",
        true,
      );
    }
  } finally {
    STATE.isBusy = false;

    for (const control of controls) {
      control.disabled = false;
    }
  }
}

async function createNewUser(event) {
  event.preventDefault();

  if (STATE.isBusy) {
    return;
  }

  const nameInput = document.getElementById("create-user-name");
  const name = nameInput.value;
  const emailInput = document.getElementById("create-user-email");
  const email = emailInput.value;
  const controls = document.querySelectorAll(
    "#create-user-form input, #create-user-form button",
  );
  STATE.isBusy = true;
  showMessage("", false);

  for (const control of controls) {
    control.disabled = true;
  }

  try {
    await callExtension("create", { name, email });
    nameInput.value = "";
    emailInput.value = "";
    await loadUserSelection();
  } catch (error) {
    if (error instanceof Error) {
      showMessage(error.message, true);
    } else {
      showMessage(
        "No se ha podido crear el usuario. Comprueba la conexión y vuelve a intentarlo.",
        true,
      );
    }
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
    const data = await callExtension("update", { id, name, email });
    const user = data.user;
    STATE.selectedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    showUserMenu();
    showMessage("Datos guardados.", false);
  } catch (error) {
    if (error instanceof Error) {
      showMessage(error.message, true);
    } else {
      showMessage(
        "No se ha podido guardar el usuario. Comprueba la conexión y vuelve a intentarlo.",
        true,
      );
    }
  } finally {
    STATE.isBusy = false;

    for (const control of controls) {
      control.disabled = false;
    }
  }
}

function showDeleteConfirm() {
  if (STATE.isBusy || STATE.selectedUser === null) {
    return;
  }

  const user = STATE.selectedUser;
  const text = document.getElementById("delete-popover-text");
  text.textContent =
    "¿Eliminar al usuario «" +
    user.name +
    "»? Esta acción no se puede deshacer.";
  const input = document.getElementById("delete-confirm-email");
  input.value = "";
  syncDeleteConfirmButton();
  getDeletePopover().showModal();
}

function cancelDeleteConfirm() {
  resetDeleteConfirm();
}

async function confirmDeleteSelectedUser() {
  if (STATE.isBusy || STATE.selectedUser === null) {
    return;
  }

  const matches = deleteEmailMatches();

  if (!matches) {
    return;
  }

  const user = STATE.selectedUser;
  const popover = document.getElementById("delete-popover");
  const controls = document.querySelectorAll(
    "#edit-screen input, #edit-screen button, #delete-popover input, #delete-popover button",
  );
  STATE.isBusy = true;
  showMessage("", false);

  for (const control of controls) {
    control.disabled = true;
  }

  try {
    await callExtension("delete", { id: user.id });
    resetDeleteConfirm();
    await loadUserSelection();
  } catch (error) {
    if (error instanceof Error) {
      showMessage(error.message, true);
    } else {
      showMessage(
        "No se ha podido eliminar el usuario. Comprueba la conexión y vuelve a intentarlo.",
        true,
      );
    }

    resetDeleteConfirm();
  } finally {
    STATE.isBusy = false;

    for (const control of controls) {
      control.disabled = false;
    }

    if (popover.open) {
      popover.close();
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

const GENDER_COUNT_PLACEHOLDER =
  "Pulsa «Contar género usuarios» para ver el recuento.";
let LAST_GENDER_COUNT = null;

function showGenderCount(count) {
  const result = document.getElementById("gender-count-result");
  const lines = [
    `Mujer: ${count.woman}`,
    `Hombre: ${count.man}`,
    `Sin clasificar: ${count.genderUndefined}`,
  ];

  result.replaceChildren();

  for (const line of lines) {
    const paragraph = document.createElement("p");
    paragraph.textContent = line;
    result.append(paragraph);
  }
}

function restoreGenderCount() {
  const result = document.getElementById("gender-count-result");

  if (LAST_GENDER_COUNT === null) {
    result.textContent = GENDER_COUNT_PLACEHOLDER;
    return;
  }

  showGenderCount(LAST_GENDER_COUNT);
}

async function countGenders() {
  const button = document.getElementById("gender-count-button");
  const result = document.getElementById("gender-count-result");

  button.disabled = true;
  showMessage("", false);
  result.textContent = "Cargando…";

  try {
    const data = await callExtension("genderCount");
    LAST_GENDER_COUNT = data.count;
    showGenderCount(data.count);
  } catch {
    showMessage("Could not classify the users", true);
    restoreGenderCount();
  } finally {
    button.disabled = false;
  }
}

function initializeClient() {
  const selectionForm = document.getElementById("selection-form");
  selectionForm.addEventListener("submit", selectUser);
  const searchForm = document.getElementById("search-form");
  searchForm.addEventListener("submit", searchUsers);
  const createForm = document.getElementById("create-user-form");
  createForm.addEventListener("submit", createNewUser);
  const editForm = document.getElementById("edit-form");
  editForm.addEventListener("submit", saveUser);
  const deleteButton = document.getElementById("delete-user");
  deleteButton.addEventListener("click", showDeleteConfirm);
  const deleteConfirmYes = document.getElementById("delete-confirm-yes");
  deleteConfirmYes.addEventListener("click", confirmDeleteSelectedUser);
  const deleteConfirmNo = document.getElementById("delete-confirm-no");
  deleteConfirmNo.addEventListener("click", cancelDeleteConfirm);
  const deleteConfirmEmail = document.getElementById("delete-confirm-email");
  deleteConfirmEmail.addEventListener("input", syncDeleteConfirmButton);
  const deletePopover = getDeletePopover();
  deletePopover.addEventListener("cancel", cancelDeleteConfirm);
  deletePopover.addEventListener("click", (event) => {
    if (event.target === deletePopover) {
      cancelDeleteConfirm();
    }
  });
  document.addEventListener("click", navigate);
  const genderCountButton = document.getElementById("gender-count-button");
  genderCountButton.addEventListener("click", countGenders);

  loadUserSelection();
}

initializeClient();
