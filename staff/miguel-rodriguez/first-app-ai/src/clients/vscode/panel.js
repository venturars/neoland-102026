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
  if (!item) return;
  pending.delete(data.request);
  if (data.error) item.reject(new Error(data.error));
  else item.resolve(data.value);
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
function showUsers(users) {
  const list = $("users");
  list.replaceChildren();
  $("empty").hidden = users.length !== 0;
  for (const user of users) {
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = `${user.id}: ${user.name} — ${user.email} — ${user.createdAt} — ${user.updatedAt}`;
    const edit = document.createElement("button");
    edit.type = "button";
    edit.disabled = busy;
    edit.textContent = "Edit";
    edit.setAttribute("aria-label", `Edit ${user.name}, ID ${user.id}`);
    edit.addEventListener("click", () => selectUser(user));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.disabled = busy;
    remove.textContent = "Delete";
    remove.setAttribute("aria-label", `Delete ${user.name}, ID ${user.id}`);
    remove.addEventListener("click", () => {
      if (busy) return;
      deleteTarget = user;
      $("delete-section").hidden = false;
      $("confirmation").value = "";
      $("confirmation").focus();
    });
    li.append(label, edit, remove);
    list.append(li);
  }
}
function selectUser(user) {
  if (busy) return;
  selected = user;
  $("name").value = "";
  $("email").value = "";
  $("form-title").textContent = `Edit user ${user.id}`;
  $("save").textContent = "Save";
  $("cancel").hidden = false;
  $("delete-section").hidden = true;
  $("name").focus();
}
function resetForm() {
  selected = null;
  $("user-form").reset();
  $("form-title").textContent = "Create user";
  $("save").textContent = "Create";
  $("cancel").hidden = true;
  $("delete-section").hidden = true;
  deleteTarget = null;
}
async function refresh() {
  const version = ++viewVersion;
  try {
    const users = await call("list");
    if (version !== viewVersion) return false;
    showUsers(users);
    return true;
  } catch (error) {
    if (version !== viewVersion) return false;
    throw error;
  }
}
async function reload(message) {
  try {
    if (await refresh()) status(message);
  } catch (error) {
    status(`${message} Could not refresh users: ${error.message}`);
  }
}
$("refresh").addEventListener("click", async () => {
  if (busy) return;
  try {
    if (await refresh()) status("");
  } catch (error) {
    status(error.message);
  }
});
$("search").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) return;
  const version = ++viewVersion;
  const action = $("search-type").value;
  const value = $("search-value").value;
  let values;
  if (action === "id") {
    if (!/^-?\d+$/.test(value.trim()) || !Number.isSafeInteger(Number(value))) {
      status("Enter a safe integer ID.");
      return;
    }
    values = { id: Number(value) };
  } else values = { [action]: value };
  try {
    const result = await call(action, values);
    if (version !== viewVersion) return;
    showUsers(Array.isArray(result) ? result : [result]);
    status("");
  } catch (error) {
    if (version !== viewVersion) return;
    if (error.message === "User not found") {
      showUsers([]);
      status("");
    } else status(error.message);
  }
});
$("user-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy) return;
  setBusy(true);
  ++viewVersion;
  const user = selected;
  try {
    await call(user ? "update" : "create", {
      id: user?.id,
      name: user && $("name").value === "" ? undefined : $("name").value,
      email: user && $("email").value === "" ? undefined : $("email").value,
    });
    resetForm();
    await reload(user ? "User saved." : "User created.");
  } catch (error) {
    status(error.message);
  } finally {
    setBusy(false);
  }
});
$("cancel").addEventListener("click", () => {
  if (!busy) resetForm();
});
$("cancel-delete").addEventListener("click", () => {
  if (busy) return;
  $("delete-section").hidden = true;
  deleteTarget = null;
});
$("delete-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy || !deleteTarget) return;
  setBusy(true);
  ++viewVersion;
  try {
    await call("delete", {
      id: deleteTarget.id,
      confirmation: $("confirmation").value,
    });
    resetForm();
    await reload("User deleted.");
  } catch (error) {
    status(error.message);
  } finally {
    setBusy(false);
  }
});
refresh().catch((error) => status(error.message));

$("gender-count").addEventListener("click", async () => {
  if (busy) return;
  setBusy(true);
  $("gender-result").textContent = "Calculating…";
  try {
    const counts = await call("genderCount");
    $("gender-result").textContent =
      `Name-based estimate: women ${counts.women}, men ${counts.men}, undefined ${counts.genderUndefined}.`;
  } catch (error) {
    $("gender-result").textContent = error.message;
  } finally {
    setBusy(false);
  }
});
