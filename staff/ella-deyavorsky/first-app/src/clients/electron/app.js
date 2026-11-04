/* global document, window, confirm */
const SCREEN_IDS = ["screen-list", "screen-menu", "screen-edit"];

// The chosen user (null when there is none)
let currentUser = null;

// Show one screen and hide the others
function show(screenId) {
  for (const id of SCREEN_IDS) {
    document.getElementById(id).classList.toggle("hidden", id !== screenId);
  }
}

// Draw the users of the database
async function renderList() {
  const list = document.getElementById("user-list");
  const listError = document.getElementById("list-error");
  list.innerHTML = "";
  listError.textContent = "";
  let users = [];
  const result = await window.api.listUsers();
  if (result.ok) {
    users = result.value;
  } else {
    listError.textContent = result.error;
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
  show("screen-menu");
}

function fillEditForm() {
  document.getElementById("edit-name").value = currentUser.name;
  document.getElementById("edit-email").value = currentUser.email;
  document.getElementById("edit-error").textContent = "";
  show("screen-edit");
}

// Save through logic: if it fails, show its message
async function saveUser() {
  const name = document.getElementById("edit-name").value;
  const email = document.getElementById("edit-email").value;
  const error = document.getElementById("edit-error");
  const result = await window.api.updateUser({
    id: currentUser.id,
    name,
    email,
  });
  if (!result.ok) {
    error.textContent = result.error;
    return;
  }
  currentUser = result.value;
  openMenu();
}

async function removeUser() {
  if (!confirm("¿Eliminar este usuario?")) {
    return;
  }
  const error = document.getElementById("edit-error");
  const result = await window.api.deleteUser({ id: currentUser.id });
  if (!result.ok) {
    error.textContent = result.error;
    return;
  }
  currentUser = null;
  await renderList();
}

document.getElementById("btn-back").addEventListener("click", renderList);
document.getElementById("btn-edit").addEventListener("click", fillEditForm);
document.getElementById("btn-save").addEventListener("click", saveUser);
document.getElementById("btn-delete").addEventListener("click", removeUser);
document.getElementById("btn-cancel").addEventListener("click", openMenu);

renderList();
