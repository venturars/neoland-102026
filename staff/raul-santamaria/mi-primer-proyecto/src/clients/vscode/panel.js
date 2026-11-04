const vscode = acquireVsCodeApi();
const $ = (id) => document.getElementById(id);
const pending = new Map();
let sequence = 0;
let selected = null;
let deleteTarget = null;
let busy = false;
let viewVersion = 0;
function call(action, values = {}) {
  const request = ++sequence;
  return new Promise((resolve, reject) => {
    pending.set(request, { resolve, reject });
    vscode.postMessage({ action, request, ...values });
  });
}

window.addEventListener("message", ({ data }) => {
  const item = pending.get(data.request);
  if (!item) {
    return;
  }
  pending.delete(data.request);
  if (data.error) {
    item.reject(new Error(data.error));
  } else {
    item.resolve(data.value);
  }
});

function setBusy(value) {
  busy = value;
  for (const control of document.querySelectorAll("button, input, select")) {
    control.disabled = value;
  }
}

function status(message) {
  $("status").textContent = message;
}

function showUsers(users, options = {}) {
  const { fromSearch = false } = options;
  const list = $("users");
  list.replaceChildren();
  $("empty").hidden = true;
  $("empty-search").hidden = true;

  if (users.length === 0) {
    if (fromSearch) {
      $("empty-search").hidden = false;
    } else {
      $("empty").hidden = false;
    }
    return;
  }

  const sorted = [...users].sort((a, b) => a.id - b.id);
  for (const user of sorted) {
    const item = document.createElement("li");
    const label = document.createElement("span");
    label.className = "user-label";
    label.textContent = `${user.id}. ${user.name} (${user.email})`;
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.disabled = busy;
    editButton.textContent = "Editar";
    editButton.setAttribute("aria-label", `Editar ${user.name}, id ${user.id}`);
    editButton.addEventListener("click", () => {
      selectUser(user);
    });
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.disabled = busy;
    deleteButton.textContent = "Borrar";
    deleteButton.setAttribute(
      "aria-label",
      `Borrar ${user.name}, id ${user.id}`,
    );
    deleteButton.addEventListener("click", () => {
      if (busy) {
        return;
      }
      deleteTarget = user;
      $("delete-section").hidden = false;
      $("confirmation").value = "";
      $("confirmation").focus();
    });
    item.append(label, editButton, deleteButton);
    list.append(item);
  }
}

function selectUser(user) {
  if (busy) {
    return;
  }
  selected = user;
  $("name").value = user.name;
  $("email").value = user.email;
  $("form-title").textContent = `Editar usuario ${user.id}`;
  $("save").textContent = "Guardar";
  $("cancel").hidden = false;
  $("delete-section").hidden = true;
  deleteTarget = null;
  $("name").focus();
}

function resetForm() {
  selected = null;
  $("user-form").reset();
  $("form-title").textContent = "Crear usuario";
  $("save").textContent = "Crear";
  $("cancel").hidden = true;
  $("delete-section").hidden = true;
  deleteTarget = null;
}

async function refresh() {
  const version = ++viewVersion;
  try {
    const users = await call("list");
    if (version !== viewVersion) {
      return false;
    }
    showUsers(users, { fromSearch: false });
    return true;
  } catch (error) {
    if (version !== viewVersion) {
      return false;
    }
    throw error;
  }
}

async function reload(message) {
  try {
    if (await refresh()) {
      status(message);
    }
  } catch (error) {
    status(`${message} No se pudo actualizar la lista: ${error.message}`);
  }
}

$("refresh").addEventListener("click", async () => {
  if (busy) {
    return;
  }
  try {
    if (await refresh()) {
      status("");
    }
  } catch (error) {
    status(error.message);
  }
});

$("search").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) {
    return;
  }
  const version = ++viewVersion;
  const action = $("search-type").value;
  const rawValue = $("search-value").value;
  let payload;

  if (action === "searchId") {
    const trimmed = rawValue.trim();
    if (!/^-?\d+$/.test(trimmed) || !Number.isSafeInteger(Number(trimmed))) {
      status("Introduce un id entero válido.");
      return;
    }
    payload = { id: Number(trimmed) };
  } else if (action === "searchName") {
    payload = { name: rawValue };
  } else {
    payload = { email: rawValue };
  }

  try {
    const result = await call(action, payload);
    if (version !== viewVersion) {
      return;
    }
    showUsers(Array.isArray(result) ? result : [result], { fromSearch: true });
    status("");
  } catch (error) {
    if (version !== viewVersion) {
      return;
    }
    if (
      error.message === "No user exists with that id" ||
      error.message === "Could not find the user"
    ) {
      showUsers([], { fromSearch: true });
      status("");
    } else {
      status(error.message);
    }
  }
});

$("user-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) {
    return;
  }
  setBusy(true);
  viewVersion += 1;
  const user = selected;
  try {
    if (user) {
      await call("update", {
        id: user.id,
        name: $("name").value,
        email: $("email").value,
      });
      resetForm();
      await reload("Usuario guardado.");
    } else {
      await call("create", {
        name: $("name").value,
        email: $("email").value,
      });
      resetForm();
      await reload("Usuario creado.");
    }
  } catch (error) {
    status(error.message);
  } finally {
    setBusy(false);
  }
});

$("cancel").addEventListener("click", () => {
  if (!busy) {
    resetForm();
  }
});

$("cancel-delete").addEventListener("click", () => {
  if (busy) {
    return;
  }
  $("delete-section").hidden = true;
  deleteTarget = null;
  $("confirmation").value = "";
});

$("delete-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy || !deleteTarget) {
    return;
  }
  setBusy(true);
  viewVersion += 1;
  try {
    await call("delete", {
      id: deleteTarget.id,
      confirmation: $("confirmation").value,
    });
    resetForm();
    await reload("Usuario borrado.");
  } catch (error) {
    status(error.message);
  } finally {
    setBusy(false);
  }
});

refresh().catch((error) => {
  status(error.message);
});
