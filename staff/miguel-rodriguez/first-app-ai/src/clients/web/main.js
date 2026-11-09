import { pickRandomUser } from "../../logic/pick-random-user.js";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { usersGenderCount } from "../../logic/users-gender-count.js";

const selection = document.querySelector("#selection");
const menu = document.querySelector("#menu");
const editor = document.querySelector("#editor");
const message = document.querySelector("#message");
const users = document.querySelector("#users");
const form = document.querySelector("#user-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const confirmation = document.querySelector("#confirmation");
const deleteForm = document.querySelector("#delete-form");
const confirmationInput = document.querySelector("#confirmation-email");
let selectedUser = null;
let busy = false;

function showMessage(text = "", isError = false) {
  message.textContent = text;
  message.dataset.error = String(isError);
}

function setBusy(value) {
  busy = value;
  document.querySelector("main").setAttribute("aria-busy", String(value));
  const controls = document.querySelectorAll("button, input");
  for (const control of controls) {
    const futureOption = control.hasAttribute("data-future");
    control.disabled = value || futureOption;
  }
}

function showScreen(screen) {
  selection.hidden = screen !== selection;
  menu.hidden = screen !== menu;
  editor.hidden = screen !== editor;
  const heading = screen.querySelector("h2");
  heading.tabIndex = -1;
  heading.focus();
}

function clearErrors() {
  showMessage();
  for (const input of [nameInput, emailInput, confirmationInput]) {
    input.removeAttribute("aria-invalid");
    const errorId = input.getAttribute("aria-describedby");
    document.getElementById(errorId).textContent = "";
  }
}

function fieldError(input, text) {
  input.setAttribute("aria-invalid", "true");
  const errorId = input.getAttribute("aria-describedby");
  document.getElementById(errorId).textContent = text;
  setBusy(false);
  input.focus();
}

function showFailure(error) {
  const missing = error.message === "User not found";
  if (missing) {
    selectedUser = null;
    users.replaceChildren();
    showScreen(selection);
    showMessage("Ese usuario ya no existe. Vuelve a cargar la lista.", true);
    return;
  }
  showMessage("No se pudo completar la operación. Vuelve a intentarlo.", true);
}

function showMenu(user) {
  selectedUser = user;
  confirmation.hidden = true;
  document.querySelector("#menu-title").textContent =
    `${user.name} · ID ${user.id}`;
  document.querySelector("#selected-email").textContent = user.email;
  showScreen(menu);
}

async function selectUser(id) {
  if (busy) return;
  clearErrors();
  showMessage("Cargando…");
  setBusy(true);
  try {
    const user = await findUserById(id);
    showMenu(user);
    showMessage();
  } catch (error) {
    showFailure(error);
  } finally {
    setBusy(false);
  }
}

async function loadContacts() {
  if (busy) return;
  clearErrors();
  selectedUser = null;
  users.replaceChildren();
  showScreen(selection);
  showMessage("Cargando…");
  setBusy(true);
  try {
    const contacts = await listUsers();
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
    const empty = contacts.length === 0;
    showMessage(empty ? "No hay contactos guardados." : "");
    return true;
  } catch (error) {
    showFailure(error);
    return false;
  } finally {
    setBusy(false);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy || !selectedUser) return;
  clearErrors();
  setBusy(true);
  showMessage("Guardando…");
  try {
    const name = nameInput.value;
    const email = emailInput.value;
    const user = await updateUser(selectedUser.id, { name, email });
    showMenu(user);
    showMessage("Cambios guardados.");
  } catch (error) {
    showMessage();
    const invalidName = error.message === "Name is empty";
    const invalidEmail = error.message === "Email is invalid";
    const duplicateEmail = error.message === "Email is already used";
    if (invalidName) {
      fieldError(nameInput, "Escribe un nombre.");
    } else if (invalidEmail) {
      fieldError(
        emailInput,
        "Revisa el email: debe tener una sola @, ambas partes y hasta 64 caracteres.",
      );
    } else if (duplicateEmail) {
      fieldError(emailInput, "Ese email ya pertenece a otro usuario.");
    } else {
      showFailure(error);
    }
  } finally {
    setBusy(false);
  }
});

document.querySelector("#edit").addEventListener("click", () => {
  if (busy || !selectedUser) return;
  clearErrors();
  nameInput.value = selectedUser.name;
  emailInput.value = selectedUser.email;
  confirmation.hidden = true;
  showScreen(editor);
  nameInput.focus();
});

document.querySelector("#delete").addEventListener("click", () => {
  if (busy || !selectedUser) return;
  clearErrors();
  document.querySelector("#delete-email").textContent = selectedUser.email;
  confirmationInput.value = "";
  confirmation.hidden = false;
  confirmationInput.focus();
});

deleteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy || !selectedUser) return;
  clearErrors();
  const typedEmail = confirmationInput.value;
  const trimmedEmail = typedEmail.trim();
  const email = trimmedEmail.toLowerCase();
  const storedEmail = selectedUser.email.trim().toLowerCase();
  const matches = email.length > 0 && email === storedEmail;
  if (!matches) {
    fieldError(confirmationInput, "Escribe el email mostrado para confirmar.");
    return;
  }
  setBusy(true);
  showMessage("Eliminando…");
  try {
    await deleteUser(selectedUser.id);
  } catch (error) {
    showFailure(error);
    setBusy(false);
    return;
  }
  confirmation.hidden = true;
  setBusy(false);
  const loaded = await loadContacts();
  if (!loaded) {
    showMessage(
      "Usuario eliminado. No se pudo cargar la lista; vuelve a cargarla.",
      true,
    );
  }
});

document.querySelector("#cancel-delete").addEventListener("click", () => {
  clearErrors();
  confirmation.hidden = true;
  document.querySelector("#delete").focus();
});
document.querySelector("#back").addEventListener("click", loadContacts);
document.querySelector("#reload").addEventListener("click", loadContacts);
document.querySelector("#cancel").addEventListener("click", () => {
  if (busy || !selectedUser) return;
  clearErrors();
  showMenu(selectedUser);
});
loadContacts();

document.querySelector("#gender-count").addEventListener("click", async () => {
  if (busy) return;
  setBusy(true);
  const result = document.querySelector("#gender-result");
  result.textContent = "Calculando…";
  try {
    const counts = await usersGenderCount();
    result.textContent = `Estimación por nombre: mujeres ${counts.women}, hombres ${counts.men}, sin determinar ${counts.genderUndefined}.`;
  } catch {
    result.textContent = "Could not classify the users";
  } finally {
    setBusy(false);
  }
});

document.querySelector("#random-pick").addEventListener("click", async () => {
  if (busy) return;
  const result = document.querySelector("#random-result");
  result.textContent = "";
  setBusy(true);
  try {
    const user = await pickRandomUser();
    const empty = user === null;
    if (empty) {
      result.textContent = "No hay contactos guardados.";
    } else {
      result.textContent = `${user.name} · ID ${user.id} · ${user.email}`;
    }
  } catch {
    result.textContent = "No se pudo elegir un contacto. Vuelve a intentarlo.";
  } finally {
    setBusy(false);
  }
});
