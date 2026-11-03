/* global document, localStorage, confirm */

// Clave con la que se guarda la lista en localStorage
const STORAGE_KEY = "first-app-users";

// Usuarios de ejemplo para la primera vez
const EXAMPLE_USERS = [
  { id: 1, name: "Ana Pérez", email: "ana@example.com" },
  { id: 2, name: "Luis Gómez", email: "luis@example.com" },
  { id: 3, name: "Marta Ruiz", email: "marta@example.com" },
];

const SCREEN_IDS = ["screen-list", "screen-menu", "screen-edit"];

// Id del usuario elegido
let currentId = null;

// Muestra una pantalla y oculta las otras
function show(screenId) {
  for (const id of SCREEN_IDS) {
    document.getElementById(id).classList.toggle("hidden", id !== screenId);
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// Lee la lista; si no hay o no es válida, usa los ejemplos
function loadUsers() {
  const text = localStorage.getItem(STORAGE_KEY);
  try {
    const users = JSON.parse(text);
    if (Array.isArray(users)) {
      return users;
    }
  } catch {
    // texto no válido: se usan los ejemplos
  }
  saveUsers(EXAMPLE_USERS);
  return EXAMPLE_USERS;
}

function findCurrentUser() {
  const users = loadUsers();
  return users.find((user) => user.id === currentId);
}

// Pinta la lista de usuarios
function renderList() {
  const users = loadUsers();
  const list = document.getElementById("user-list");
  list.innerHTML = "";
  for (const user of users) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = user.id + " - " + user.name;
    button.addEventListener("click", () => chooseUser(user.id));
    item.appendChild(button);
    list.appendChild(item);
  }
  document
    .getElementById("list-empty")
    .classList.toggle("hidden", users.length > 0);
  show("screen-list");
}

function chooseUser(id) {
  currentId = id;
  openMenu();
}

function openMenu() {
  const user = findCurrentUser();
  document.getElementById("menu-title").textContent = user.name;
  document.getElementById("menu-notice").textContent = "";
  show("screen-menu");
}

function fillEditForm() {
  const user = findCurrentUser();
  document.getElementById("edit-name").value = user.name;
  document.getElementById("edit-email").value = user.email;
  document.getElementById("edit-error").textContent = "";
  show("screen-edit");
}

function saveUser() {
  const name = document.getElementById("edit-name").value.trim();
  const email = document.getElementById("edit-email").value.trim();
  const error = document.getElementById("edit-error");
  if (name === "") {
    error.textContent = "El nombre no puede estar vacío.";
    return;
  }
  if (!email.includes("@")) {
    error.textContent = "El email debe tener @.";
    return;
  }
  const users = loadUsers();
  const user = users.find((item) => item.id === currentId);
  user.name = name;
  user.email = email;
  saveUsers(users);
  openMenu();
}

function deleteUser() {
  if (!confirm("¿Eliminar este usuario?")) {
    return;
  }
  const users = loadUsers();
  const rest = users.filter((user) => user.id !== currentId);
  saveUsers(rest);
  currentId = null;
  renderList();
}

document.getElementById("btn-back").addEventListener("click", renderList);
document.getElementById("btn-edit").addEventListener("click", fillEditForm);
document.getElementById("btn-notes").addEventListener("click", () => {
  document.getElementById("menu-notice").textContent = "Notas: próximamente.";
});
document.getElementById("btn-save").addEventListener("click", saveUser);
document.getElementById("btn-delete").addEventListener("click", deleteUser);
document.getElementById("btn-cancel").addEventListener("click", openMenu);

renderList();
