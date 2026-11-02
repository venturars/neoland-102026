const list = document.querySelector("#user-list");
const enter = document.querySelector("#enter");
const message = document.querySelector("#message");
const name = document.querySelector("#name");
const email = document.querySelector("#email");
const listView = document.querySelector("#list-view");
const menuView = document.querySelector("#menu-view");
const editView = document.querySelector("#edit-view");
let selectedUser;
let busy = false;

async function requestUser(url, options, failure) {
  let response;
  let body;
  try {
    response = await fetch(url, options);
    body = await response.text();
  } catch {
    throw new Error(failure);
  }
  if (!response.ok) {
    throw new Error(body || failure);
  }
  if (response.status !== 204) {
    try {
      return JSON.parse(body);
    } catch {
      throw new Error(failure);
    }
  }
}

function showView(view) {
  listView.hidden = view !== listView;
  menuView.hidden = view !== menuView;
  editView.hidden = view !== editView;
  message.textContent = "";
  const heading = view.querySelector("h2");
  heading.focus();
}

function showMenu() {
  document.querySelector("#menu-id").textContent = selectedUser.id;
  document.querySelector("#menu-name").textContent = selectedUser.name;
  document.querySelector("#menu-email").textContent = selectedUser.email;
  showView(menuView);
}

async function loadUsers() {
  list.replaceChildren(new Option("Selecciona un ID", ""));
  enter.disabled = true;
  const users = await requestUser("/api/users", {}, "Could not list the users");
  for (const user of users) {
    list.add(new Option(`${user.id} · ${user.name}`, String(user.id)));
  }
  if (users.length === 0) {
    message.textContent = "No hay usuarios disponibles.";
  }
}

async function runAction(action) {
  if (busy) {
    return;
  }
  busy = true;
  message.textContent = "";
  const buttons = document.querySelectorAll("button");
  for (const button of buttons) {
    button.disabled = true;
  }
  try {
    await action();
  } catch (error) {
    message.textContent = error.message;
  } finally {
    busy = false;
    for (const button of buttons) {
      button.disabled = false;
    }
    enter.disabled = !list.value;
  }
}

list.addEventListener("change", () => {
  enter.disabled = busy || !list.value;
});
document
  .querySelector("#selection-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    if (!list.value) {
      return;
    }
    runAction(async () => {
      selectedUser = await requestUser(
        `/api/users/${list.value}`,
        {},
        "Could not find the user",
      );
      showMenu();
    });
  });
document.querySelector("#back-list").addEventListener("click", () => {
  showView(listView);
});
document.querySelector("#edit").addEventListener("click", () => {
  document.querySelector("#edit-id").textContent = selectedUser.id;
  name.value = selectedUser.name;
  email.value = selectedUser.email;
  showView(editView);
});
document.querySelector("#back-menu").addEventListener("click", showMenu);
document.querySelector("#edit-form").addEventListener("submit", (event) => {
  event.preventDefault();
  runAction(async () => {
    selectedUser = await requestUser(
      `/api/users/${selectedUser.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.value, email: email.value }),
      },
      "Could not update the user",
    );
    const option = list.querySelector(`option[value="${selectedUser.id}"]`);
    option.textContent = `${selectedUser.id} · ${selectedUser.name}`;
    showMenu();
  });
});
document.querySelector("#delete").addEventListener("click", () => {
  if (!window.confirm(`¿Eliminar al usuario ${selectedUser.id}?`)) {
    return;
  }
  runAction(async () => {
    await requestUser(
      `/api/users/${selectedUser.id}`,
      { method: "DELETE" },
      "Could not delete the user",
    );
    selectedUser = undefined;
    showView(listView);
    await loadUsers();
  });
});
runAction(loadUsers);
