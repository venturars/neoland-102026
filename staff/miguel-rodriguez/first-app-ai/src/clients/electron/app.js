const users = document.querySelector("#users");
const editor = document.querySelector("#editor");
const createForm = document.querySelector("#create-form");
const editForm = document.querySelector("#edit-form");
const deleteForm = document.querySelector("#delete-form");
const message = document.querySelector("#message");
const summary = document.querySelector("#summary");
let selectedUser;
let busy = false;

async function call(operation, args = []) {
  return await window.firstApp.call(operation, args);
}

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
  const contacts = await call("list");
  users.replaceChildren();
  const placeholder = document.createElement("option");
  placeholder.value = "";
  const hasContacts = contacts.length > 0;
  placeholder.textContent = hasContacts ? "Elige un contacto" : "Sin contactos";
  users.append(placeholder);
  for (const user of contacts) {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = `${user.name} · ID ${user.id}`;
    users.append(option);
  }
  selectedUser = undefined;
  editor.hidden = true;
  summary.textContent = "";
}

function showUser(user) {
  selectedUser = user;
  users.value = user.id;
  document.querySelector("#user-title").textContent =
    `${user.name} · ID ${user.id}`;
  document.querySelector("#edit-name").value = user.name;
  document.querySelector("#edit-email").value = user.email;
  deleteForm.reset();
  createForm.hidden = true;
  editor.hidden = false;
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
  const value = users.value;
  selectedUser = undefined;
  editor.hidden = true;
  if (!value) {
    return;
  }
  run(async () => {
    const id = Number(value);
    const user = await call("find", [id]);
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
    const user = await call("find", [id]);
    showUser(user);
  });
});

createForm.addEventListener("submit", (event) => {
  event.preventDefault();
  run(async () => {
    const name = document.querySelector("#create-name").value;
    const email = document.querySelector("#create-email").value;
    const user = await call("create", [{ name, email }]);
    await refreshUsers();
    createForm.reset();
    showUser(user);
    message.textContent = "Contacto creado";
  });
});

editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  run(async () => {
    const name = document.querySelector("#edit-name").value;
    const email = document.querySelector("#edit-email").value;
    const id = selectedUser.id;
    const user = await call("update", [id, { name, email }]);
    await refreshUsers();
    showUser(user);
    message.textContent = "Contacto guardado";
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
    await call("delete", [id]);
    await refreshUsers();
    message.textContent = "Contacto eliminado";
  });
});

document.querySelector("#gender-count").addEventListener("click", () => {
  run(async () => {
    summary.textContent = "Consultando…";
    try {
      const counts = await call("genderCount");
      summary.textContent = `Mujeres: ${counts.women} · Hombres: ${counts.men} · Sin definir: ${counts.genderUndefined}`;
    } catch (error) {
      summary.textContent = "";
      throw error;
    }
  });
});

run(refreshUsers);
