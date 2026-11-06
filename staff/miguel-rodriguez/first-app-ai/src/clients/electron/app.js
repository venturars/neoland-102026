import { createUser } from "../../logic/create-user.js";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { usersGenderCount } from "../../logic/users-gender-count.js";

const users = document.querySelector("#users");
const editor = document.querySelector("#editor");
const createForm = document.querySelector("#create-form");
const editForm = document.querySelector("#edit-form");
const deleteForm = document.querySelector("#delete-form");
const message = document.querySelector("#message");
const summary = document.querySelector("#summary");
let selectedUser;
let busy = false;

async function run(action) {
  if (busy) {
    return;
  }
  busy = true;
  message.textContent = "";
  message.dataset.error = "false";
  const controls = document.querySelectorAll("button, input, select");
  for (const control of controls) {
    control.disabled = true;
  }
  try {
    await action();
  } catch (error) {
    message.textContent = error.message;
    message.dataset.error = "true";
  } finally {
    busy = false;
    for (const control of controls) {
      control.disabled = false;
    }
  }
}

async function refreshUsers() {
  const contacts = await listUsers();
  users.replaceChildren();
  const placeholder = document.createElement("option");
  placeholder.value = "";
  const hasContacts = contacts.length > 0;
  placeholder.textContent = hasContacts ? "Elige un contacto" : "Sin contactos";
  users.append(placeholder);
  for (const user of contacts) {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = `${user.id} · ${user.name} · ${user.email}`;
    users.append(option);
  }
  selectedUser = undefined;
  editor.hidden = true;
  summary.textContent = "";
  return contacts;
}

function showUser(user) {
  selectedUser = user;
  const id = String(user.id);
  const options = Array.from(users.options);
  let choice = options.find((option) => option.value === id);
  if (!choice) {
    choice = document.createElement("option");
    choice.value = id;
    users.append(choice);
  }
  choice.textContent = `${user.id} · ${user.name} · ${user.email}`;
  users.options[0].textContent = "Elige un contacto";
  users.value = id;
  document.querySelector("#user-title").textContent =
    `${user.name} · ID ${user.id}`;
  document.querySelector("#user-email").textContent = user.email;
  editForm.reset();
  document.querySelector("#created-at").textContent = user.createdAt;
  document.querySelector("#updated-at").textContent = user.updatedAt;
  deleteForm.reset();
  createForm.hidden = true;
  editor.hidden = false;
}

async function refreshAfterChange(text) {
  const id = selectedUser?.id;
  message.textContent = text;
  summary.textContent = "";
  try {
    const contacts = await refreshUsers();
    const user = contacts.find((contact) => contact.id === id);
    if (user) {
      showUser(user);
    }
  } catch {
    message.textContent = `${text}. No se pudo actualizar la lista. Pulsa Actualizar.`;
  }
}

document.querySelector("#refresh").addEventListener("click", () => {
  run(refreshUsers);
});

document.querySelector("#new-user").addEventListener("click", () => {
  selectedUser = undefined;
  users.value = "";
  editor.hidden = true;
  createForm.hidden = false;
  document.querySelector("#create-name").focus();
});

users.addEventListener("change", () => {
  if (busy) {
    return;
  }
  const value = users.value;
  selectedUser = undefined;
  editor.hidden = true;
  if (!value) {
    return;
  }
  run(async () => {
    const id = Number(value);
    const user = await findUserById(id);
    showUser(user);
  });
});

document.querySelector("#find-form").addEventListener("submit", (event) => {
  event.preventDefault();
  run(async () => {
    const input = document.querySelector("#find-id");
    const id = Number(input.value);
    const validId = Number.isSafeInteger(id) && id > 0;
    if (!validId) {
      throw new Error("El ID debe ser un entero positivo");
    }
    const user = await findUserById(id);
    showUser(user);
  });
});

createForm.addEventListener("submit", (event) => {
  event.preventDefault();
  run(async () => {
    const name = document.querySelector("#create-name").value;
    const email = document.querySelector("#create-email").value;
    const user = await createUser({ name, email });
    createForm.reset();
    showUser(user);
    await refreshAfterChange("Contacto creado");
  });
});

editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  run(async () => {
    const name = document.querySelector("#edit-name").value;
    const email = document.querySelector("#edit-email").value;
    const changes = {};
    if (name !== "") {
      changes.name = name;
    }
    if (email !== "") {
      changes.email = email;
    }
    const id = selectedUser.id;
    const user = await updateUser(id, changes);
    showUser(user);
    await refreshAfterChange("Contacto guardado");
  });
});

deleteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  run(async () => {
    const input = document.querySelector("#delete-email").value;
    const trimmedEmail = input.trim();
    const email = trimmedEmail.toLowerCase();
    const matchesEmail = email === selectedUser.email;
    if (!matchesEmail) {
      throw new Error("El email no coincide con el contacto guardado");
    }
    const id = selectedUser.id;
    await deleteUser(id);
    selectedUser = undefined;
    editor.hidden = true;
    editForm.reset();
    deleteForm.reset();
    document.querySelector("#created-at").textContent = "";
    document.querySelector("#updated-at").textContent = "";
    const options = Array.from(users.options);
    const choice = options.find((option) => option.value === String(id));
    if (choice) {
      choice.remove();
    }
    users.value = "";
    const listIsEmpty = users.options.length === 1;
    if (listIsEmpty) {
      users.options[0].textContent = "Sin contactos";
    }
    await refreshAfterChange("Contacto eliminado");
  });
});

document.querySelector("#gender-count").addEventListener("click", () => {
  run(async () => {
    summary.textContent = "Consultando…";
    try {
      const counts = await usersGenderCount();
      summary.textContent = `Mujeres: ${counts.women} · Hombres: ${counts.men} · Sin definir: ${counts.genderUndefined}`;
    } catch (error) {
      summary.textContent = "";
      throw error;
    }
  });
});

run(refreshUsers);
