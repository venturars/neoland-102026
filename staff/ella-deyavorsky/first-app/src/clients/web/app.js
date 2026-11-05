/* global document, confirm */
import { listUsers } from "../../logic/list-users.js";
import { listGmailUsers } from "../../logic/list-gmail-users.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

const SCREEN_IDS = ["screen-list", "screen-menu", "screen-edit"];

// Usuario elegido (null si no hay ninguno)
let currentUser = null;

// true: la lista solo muestra los usuarios de Gmail
let onlyGmail = false;

// Muestra una pantalla y oculta las otras
function show(screenId) {
  for (const id of SCREEN_IDS) {
    document.getElementById(id).classList.toggle("hidden", id !== screenId);
  }
}

// Pinta la lista de usuarios de la base de datos
async function renderList() {
  const list = document.getElementById("user-list");
  const listError = document.getElementById("list-error");
  list.innerHTML = "";
  listError.textContent = "";
  let users = [];
  try {
    users = onlyGmail ? await listGmailUsers() : await listUsers();
  } catch (error) {
    // Mensaje de la app (por ejemplo "The database failed.")
    listError.textContent = error.message;
  }
  for (const user of users) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = user.id + " - " + user.name;
    button.addEventListener("click", () => chooseUser(user));
    item.appendChild(button);
    list.appendChild(item);
  }
  document
    .getElementById("list-empty")
    .classList.toggle(
      "hidden",
      users.length > 0 || listError.textContent !== "",
    );
  show("screen-list");
}

function chooseUser(user) {
  currentUser = user;
  openMenu();
}

function openMenu() {
  document.getElementById("menu-title").textContent = currentUser.name;
  document.getElementById("menu-notice").textContent = "";
  show("screen-menu");
}

function fillEditForm() {
  document.getElementById("edit-name").value = currentUser.name;
  document.getElementById("edit-email").value = currentUser.email;
  document.getElementById("edit-error").textContent = "";
  show("screen-edit");
}

// Guarda con las reglas de logic: si falla, se muestra su mensaje
async function saveUser() {
  const name = document.getElementById("edit-name").value;
  const email = document.getElementById("edit-email").value;
  const error = document.getElementById("edit-error");
  try {
    currentUser = await updateUser({ id: currentUser.id, name, email });
  } catch (thrown) {
    error.textContent = thrown.message;
    return;
  }
  openMenu();
}

async function removeUser() {
  if (!confirm("¿Eliminar este usuario?")) {
    return;
  }
  const error = document.getElementById("edit-error");
  try {
    await deleteUser({ id: currentUser.id });
  } catch (thrown) {
    error.textContent = thrown.message;
    return;
  }
  currentUser = null;
  await renderList();
}

document.getElementById("btn-back").addEventListener("click", renderList);
document.getElementById("btn-only-gmail").addEventListener("click", () => {
  onlyGmail = true;
  renderList();
});
document.getElementById("btn-show-all").addEventListener("click", () => {
  onlyGmail = false;
  renderList();
});
document.getElementById("btn-edit").addEventListener("click", fillEditForm);
document.getElementById("btn-notes").addEventListener("click", () => {
  document.getElementById("menu-notice").textContent = "Notas: próximamente.";
});
document.getElementById("btn-save").addEventListener("click", saveUser);
document.getElementById("btn-delete").addEventListener("click", removeUser);
document.getElementById("btn-cancel").addEventListener("click", openMenu);

renderList();
