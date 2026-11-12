const ORIGIN = "http://127.0.0.1:3002";

const usersScreen = document.querySelector("#users-screen");
const userScreen = document.querySelector("#user-screen");
const errorMessage = document.querySelector("#error-message");
const usersList = document.querySelector("#users-list");
const createForm = document.querySelector("#create-form");
const createName = document.querySelector("#create-name");
const createEmail = document.querySelector("#create-email");
const findForm = document.querySelector("#find-form");
const findId = document.querySelector("#find-id");
const updateForm = document.querySelector("#update-form");
const updateName = document.querySelector("#update-name");
const updateEmail = document.querySelector("#update-email");
const deleteButton = document.querySelector("#delete-user");
const backButton = document.querySelector("#back-to-list");

let selectedId;

function showUser(user) {
  selectedId = user.id;
  document.querySelector("#user-id").textContent = user.id;
  document.querySelector("#user-name").textContent = user.name;
  document.querySelector("#user-email").textContent = user.email;
  document.querySelector("#user-created").textContent = user.createdAt;
  document.querySelector("#user-updated").textContent = user.updatedAt;
  updateName.value = user.name;
  updateEmail.value = user.email;
  usersScreen.hidden = true;
  userScreen.hidden = false;
}

async function readJson(response) {
  const text = await response.text();
  if (text === "") {
    return null;
  }
  return JSON.parse(text);
}

async function openUser(id) {
  errorMessage.textContent = "";
  const url = `${ORIGIN}/users/${id}`;
  const response = await fetch(url);
  const result = await readJson(response);
  if (result && result.message) {
    errorMessage.textContent = result.message;
    return;
  }
  if (!response.ok) {
    errorMessage.textContent = "Could not find the user";
    return;
  }
  showUser(result);
}

async function showUsers() {
  errorMessage.textContent = "";
  usersScreen.hidden = false;
  userScreen.hidden = true;
  usersList.replaceChildren();
  const url = `${ORIGIN}/users`;
  const response = await fetch(url);
  const result = await readJson(response);
  if (result && result.message) {
    errorMessage.textContent = result.message;
    return;
  }
  if (!Array.isArray(result)) {
    errorMessage.textContent = "Could not list the users";
    return;
  }
  for (const user of result) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${user.id} · ${user.name} · ${user.email}`;
    button.addEventListener("click", () => {
      openUser(user.id);
    });
    item.append(button);
    usersList.append(item);
  }
}

createForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.textContent = "";
  const name = createName.value;
  const email = createEmail.value;
  const url = `${ORIGIN}/users`;
  const body = JSON.stringify({ name, email });
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
  const result = await readJson(response);
  if (result && result.message) {
    errorMessage.textContent = result.message;
    return;
  }
  if (!response.ok) {
    errorMessage.textContent = "Could not create the user";
    return;
  }
  createForm.reset();
  errorMessage.textContent = `${result.id} · ${result.name} · ${result.email}`;
  await showUsers();
});

findForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = findId.value;
  await openUser(id);
});

updateForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.textContent = "";
  const name = updateName.value;
  const email = updateEmail.value;
  const url = `${ORIGIN}/users/${selectedId}`;
  const body = JSON.stringify({ name, email });
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body,
  });
  const result = await readJson(response);
  if (result && result.message) {
    errorMessage.textContent = result.message;
    return;
  }
  if (!response.ok) {
    errorMessage.textContent = "Could not update the user";
    return;
  }
  showUser(result);
});

deleteButton.addEventListener("click", async () => {
  errorMessage.textContent = "";
  const url = `${ORIGIN}/users/${selectedId}`;
  const response = await fetch(url, { method: "DELETE" });
  if (response.status === 204) {
    await showUsers();
    return;
  }
  const result = await readJson(response);
  if (result && result.message) {
    errorMessage.textContent = result.message;
    return;
  }
  errorMessage.textContent = "Could not delete the user";
});

backButton.addEventListener("click", showUsers);
showUsers();
