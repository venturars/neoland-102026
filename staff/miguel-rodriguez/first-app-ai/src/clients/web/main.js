const selection = document.querySelector("#selection");
const menu = document.querySelector("#menu");
const editor = document.querySelector("#editor");
const message = document.querySelector("#message");
const users = document.querySelector("#users");
const form = document.querySelector("#user-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
let selectedUser = null;
let busy = false;

const ERROR_MESSAGES = new Map([
  ["User not found", "Ese usuario ya no existe. Elige otro."],
  ["Name is empty", "Escribe un nombre."],
  ["Email is empty", "Escribe un email."],
  ["Email is invalid", "El email no es válido."],
  ["Email is already used", "Ese email ya pertenece a otro usuario."],
]);

function showMessage(text = "", isError = false) {
  message.textContent = text;
  message.dataset.error = String(isError);
}

function showScreen(screen) {
  selection.hidden = screen !== selection;
  menu.hidden = screen !== menu;
  editor.hidden = screen !== editor;
  const heading = screen.querySelector("h2");
  heading.tabIndex = -1;
  heading.focus();
}

function setBusy(value) {
  busy = value;
  document
    .querySelectorAll("button:not([data-future]), input")
    .forEach((element) => {
      element.disabled = value;
    });
  form.setAttribute("aria-busy", String(value));
}

async function requestUser(path, options) {
  let response;
  try {
    response = await fetch(path, options);
  } catch {
    throw new Error(
      "No se pudo conectar. Comprueba que el servidor sigue abierto.",
    );
  }
  if (response.status === 204) return;
  const data = await response.json();
  if (!response.ok) {
    const text = ERROR_MESSAGES.get(data.error);
    const error = new Error(
      text ?? "No se pudo completar la operación. Vuelve a intentarlo.",
    );
    error.status = response.status;
    throw error;
  }
  return data;
}

function showMenu(user) {
  selectedUser = user;
  document.querySelector("#menu-title").textContent =
    `${user.name} · ID ${user.id}`;
  document.querySelector("#selected-email").textContent = user.email;
  showScreen(menu);
}

async function loadUsers(preserveMessage = false) {
  selectedUser = null;
  showScreen(selection);
  if (!preserveMessage) showMessage("Cargando contactos…");
  users.replaceChildren();
  setBusy(true);
  try {
    const contacts = await requestUser("/api/users");
    if (!preserveMessage)
      showMessage(
        contacts.length
          ? ""
          : "Todavía no hay contactos. Crea uno desde Terminal o Jupyter.",
      );
    for (const user of contacts) {
      const item = document.createElement("li");
      const button = document.createElement("button");
      const detail = document.createElement("span");
      button.type = "button";
      button.className = "user";
      button.append(document.createTextNode(`${user.name} · ID ${user.id}`));
      detail.textContent = user.email;
      button.append(detail);
      button.addEventListener("click", () => selectUser(user.id));
      item.append(button);
      users.append(item);
    }
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    setBusy(false);
  }
}

async function selectUser(id) {
  if (busy) return;
  setBusy(true);
  showMessage();
  try {
    const user = await requestUser(`/api/users/${id}`);
    showMenu(user);
  } catch (error) {
    showMessage(error.message, true);
    if (error.status === 404) await loadUsers(true);
  } finally {
    setBusy(false);
  }
}

async function openEditor() {
  if (!selectedUser || busy) return;
  setBusy(true);
  showMessage();
  try {
    selectedUser = await requestUser(`/api/users/${selectedUser.id}`);
    nameInput.value = selectedUser.name;
    emailInput.value = selectedUser.email;
    showScreen(editor);
  } catch (error) {
    showMessage(error.message, true);
    if (error.status === 404) await loadUsers(true);
  } finally {
    setBusy(false);
    if (!editor.hidden) nameInput.focus();
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!selectedUser || busy) return;
  setBusy(true);
  showMessage();
  try {
    const changes = { name: nameInput.value, email: emailInput.value };
    const user = await requestUser(`/api/users/${selectedUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
    showMenu(user);
    showMessage("Cambios guardados.");
  } catch (error) {
    showMessage(error.message, true);
    if (error.status === 404) await loadUsers(true);
  } finally {
    setBusy(false);
  }
});

document.querySelector("#delete").addEventListener("click", async () => {
  if (!selectedUser || busy) return;
  const confirmed = window.confirm(
    `¿Eliminar a ${selectedUser.name}? No se puede deshacer.`,
  );
  if (!confirmed) return;
  setBusy(true);
  showMessage();
  try {
    await requestUser(`/api/users/${selectedUser.id}`, { method: "DELETE" });
    showMessage("Usuario eliminado.");
    await loadUsers(true);
  } catch (error) {
    showMessage(error.message, true);
    if (error.status === 404) await loadUsers(true);
  } finally {
    setBusy(false);
  }
});

document.querySelector("#back").addEventListener("click", () => loadUsers());
document.querySelector("#reload").addEventListener("click", () => loadUsers());
document.querySelector("#edit").addEventListener("click", openEditor);
document.querySelector("#cancel").addEventListener("click", () => {
  showMessage();
  showMenu(selectedUser);
});
loadUsers();
