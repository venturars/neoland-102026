const vscode = acquireVsCodeApi();

const connectionBanner = document.querySelector("#connection-banner");
const connectionText = document.querySelector("#connection-text");
const retryButton = document.querySelector("#retry-button");
const status = document.querySelector("#status");
const searchForm = document.querySelector("#search-form");
const searchMode = document.querySelector("#search-mode");
const searchValue = document.querySelector("#search-value");
const listAllButton = document.querySelector("#list-all-button");
const createForm = document.querySelector("#create-form");
const createName = document.querySelector("#create-name");
const createEmail = document.querySelector("#create-email");
const emptyList = document.querySelector("#empty-list");
const userList = document.querySelector("#user-list");
const detailSection = document.querySelector("#detail-section");
const detailId = document.querySelector("#detail-id");
const detailCreated = document.querySelector("#detail-created");
const detailUpdated = document.querySelector("#detail-updated");
const editForm = document.querySelector("#edit-form");
const editName = document.querySelector("#edit-name");
const editEmail = document.querySelector("#edit-email");
const deleteForm = document.querySelector("#delete-form");
const deleteConfirm = document.querySelector("#delete-confirm");
const deleteCancel = document.querySelector("#delete-cancel");

let sequence = 0;
const pending = new Map();
let selectedUser = null;
let lastRetry = { action: "list", fields: {} };

function isConnectionError(message) {
  if (message.startsWith("Could not ")) {
    return true;
  }
  return false;
}

function showConnectionBanner(message) {
  connectionText.textContent = message;
  connectionBanner.hidden = false;
}

function hideConnectionBanner() {
  connectionBanner.hidden = true;
}

function setStatus(message) {
  status.textContent = message;
}

function call(action, fields) {
  const request = sequence + 1;
  sequence = request;
  lastRetry = { action, fields: fields || {} };
  const payload = { action, request };
  if (fields) {
    const keys = Object.keys(fields);
    for (const key of keys) {
      payload[key] = fields[key];
    }
  }
  return new Promise((resolve, reject) => {
    pending.set(request, { resolve, reject });
    vscode.postMessage(payload);
  });
}

window.addEventListener("message", (event) => {
  const data = event.data;
  const request = data.request;
  const item = pending.get(request);
  if (!item) {
    return;
  }
  pending.delete(request);
  if (data.message) {
    item.reject(new Error(data.message));
    return;
  }
  item.resolve(data);
});

function clearDetail() {
  selectedUser = null;
  detailSection.hidden = true;
  editForm.reset();
  deleteForm.reset();
}

function showDetail(user) {
  selectedUser = user;
  detailSection.hidden = false;
  detailId.textContent = String(user.id);
  detailCreated.textContent = user.createdAt;
  detailUpdated.textContent = user.updatedAt;
  editName.value = user.name;
  editEmail.value = user.email;
  deleteConfirm.value = "";
}

function renderList(users) {
  userList.replaceChildren();
  if (users.length === 0) {
    emptyList.hidden = false;
    emptyList.textContent = "No hay usuarios que mostrar.";
    return;
  }
  emptyList.hidden = true;
  for (const user of users) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "list-item";
    button.textContent = `${user.id} · ${user.name} · ${user.email}`;
    button.addEventListener("click", () => {
      showDetail(user);
      setStatus("");
    });
    item.append(button);
    userList.append(item);
  }
}

async function runAction(action, fields) {
  hideConnectionBanner();
  setStatus("");
  try {
    const data = await call(action, fields);
    return data;
  } catch (error) {
    const message = error.message;
    setStatus(message);
    if (isConnectionError(message)) {
      showConnectionBanner(
        "No se puede contactar con la base. Comprueba que pnpm server esté en marcha.",
      );
    }
    throw error;
  }
}

async function loadList() {
  try {
    const data = await runAction("list");
    renderList(data.users);
  } catch {
    userList.replaceChildren();
    emptyList.hidden = false;
    emptyList.textContent = "No se pudo cargar la lista.";
  }
}

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const mode = searchMode.value;
  const value = searchValue.value;
  const fields = { name: value, email: value, id: value };
  try {
    const data = await runAction(mode, fields);
    renderList(data.users);
    if (data.users.length === 0) {
      emptyList.hidden = false;
      emptyList.textContent = "Ningún resultado para esa búsqueda.";
    }
  } catch {
    /* status already set */
  }
});

listAllButton.addEventListener("click", () => {
  loadList();
});

createForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = createName.value;
  const email = createEmail.value;
  try {
    await runAction("create", { name, email });
    createForm.reset();
    await loadList();
    setStatus("Usuario creado.");
  } catch {
    /* fields kept */
  }
});

editForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!selectedUser) {
    return;
  }
  const name = editName.value;
  const email = editEmail.value;
  const changes = { name, email };
  try {
    const data = await runAction("update", {
      id: selectedUser.id,
      changes,
    });
    showDetail(data.user);
    await loadList();
    setStatus("Cambios guardados.");
  } catch {
    /* fields kept */
  }
});

deleteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!selectedUser) {
    return;
  }
  const confirmation = deleteConfirm.value;
  try {
    await runAction("delete", {
      id: selectedUser.id,
      confirmation,
    });
    clearDetail();
    await loadList();
    setStatus("Usuario borrado.");
  } catch {
    /* confirmation kept */
  }
});

deleteCancel.addEventListener("click", () => {
  deleteConfirm.value = "";
  setStatus("");
});

retryButton.addEventListener("click", async () => {
  const retryAction = lastRetry.action;
  const retryFields = lastRetry.fields;
  try {
    const data = await runAction(retryAction, retryFields);
    hideConnectionBanner();
    if (data.users) {
      renderList(data.users);
    }
    if (data.user) {
      showDetail(data.user);
    }
    if (data.deleted) {
      clearDetail();
      await loadList();
    }
    setStatus("");
  } catch {
    /* status already set */
  }
});

loadList();
