/* global document, fetch */

// The popup talks only to its own program, never to the database program.
const SERVER_URL = "http://127.0.0.1:3002";
// Shown when fetch cannot connect, because the program is not running.
const NOT_RUNNING_SENTENCE = "The extension server is not running.";

const userList = document.getElementById("user-list");
const emptyList = document.getElementById("empty-list");
const userForm = document.getElementById("user-form");
const formTitle = document.getElementById("form-title");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const createButton = document.getElementById("create-button");
const saveButton = document.getElementById("save-button");
const deleteButton = document.getElementById("delete-button");
const newButton = document.getElementById("new-button");
const confirmDelete = document.getElementById("confirm-delete");
const confirmNameInput = document.getElementById("confirm-name");
const confirmButton = document.getElementById("confirm-button");
const cancelButton = document.getElementById("cancel-button");
const errorText = document.getElementById("error");

// The user loaded in the form, with the name as it is saved. null means the form creates a user.
let loadedUser = null;

// Empties the form and shows the create mode.
function showCreateMode() {
  loadedUser = null;
  nameInput.value = "";
  emailInput.value = "";
  formTitle.textContent = "Nuevo usuario";
  createButton.hidden = false;
  saveButton.hidden = true;
  deleteButton.hidden = true;
  newButton.hidden = true;
  confirmDelete.hidden = true;
  confirmNameInput.value = "";
}

// Fills the form with a user and shows the edit mode.
function showEditMode(user) {
  loadedUser = user;
  nameInput.value = user.name;
  emailInput.value = user.email;
  formTitle.textContent = "Usuario " + user.id;
  createButton.hidden = true;
  saveButton.hidden = false;
  deleteButton.hidden = false;
  newButton.hidden = false;
  confirmDelete.hidden = true;
  confirmNameInput.value = "";
}

// Asks for the users and draws the list.
async function drawList() {
  let response;
  try {
    response = await fetch(SERVER_URL + "/users");
  } catch {
    errorText.textContent = NOT_RUNNING_SENTENCE;
    return;
  }

  const answer = await response.json();
  if (response.ok === false) {
    errorText.textContent = answer.error;
    return;
  }

  userList.textContent = "";
  emptyList.hidden = answer.length > 0;
  for (const user of answer) {
    const item = document.createElement("li");
    item.textContent = user.name;
    const email = document.createElement("small");
    email.textContent = user.email;
    item.appendChild(email);
    if (loadedUser !== null && loadedUser.id === user.id) {
      item.className = "selected";
    }
    item.addEventListener("click", () => chooseUser(user.id));
    userList.appendChild(item);
  }
}

// Loads one user in the form.
async function chooseUser(id) {
  errorText.textContent = "";

  let response;
  try {
    response = await fetch(SERVER_URL + "/users/" + id);
  } catch {
    errorText.textContent = NOT_RUNNING_SENTENCE;
    return;
  }

  const answer = await response.json();
  if (response.ok === false) {
    errorText.textContent = answer.error;
    // The user may be gone, so the list is drawn again.
    await drawList();
    return;
  }

  showEditMode(answer);
  await drawList();
}

async function createUser() {
  errorText.textContent = "";

  let response;
  try {
    response = await fetch(SERVER_URL + "/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameInput.value,
        email: emailInput.value,
      }),
    });
  } catch {
    errorText.textContent = NOT_RUNNING_SENTENCE;
    return;
  }

  const answer = await response.json();
  if (response.ok === false) {
    errorText.textContent = answer.error;
    return;
  }

  showCreateMode();
  await drawList();
}

async function saveUser() {
  errorText.textContent = "";

  let response;
  try {
    response = await fetch(SERVER_URL + "/users/" + loadedUser.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameInput.value,
        email: emailInput.value,
      }),
    });
  } catch {
    errorText.textContent = NOT_RUNNING_SENTENCE;
    return;
  }

  const answer = await response.json();
  if (response.ok === false) {
    errorText.textContent = answer.error;
    return;
  }

  // The name saved now is the one that Delete asks for.
  showEditMode(answer);
  await drawList();
}

async function deleteUser() {
  errorText.textContent = "";

  // The text must be the saved name, letter by letter. It is not trimmed.
  if (confirmNameInput.value !== loadedUser.name) {
    errorText.textContent = "El nombre no coincide";
    return;
  }

  let response;
  try {
    response = await fetch(SERVER_URL + "/users/" + loadedUser.id, {
      method: "DELETE",
    });
  } catch {
    errorText.textContent = NOT_RUNNING_SENTENCE;
    return;
  }

  if (response.ok === false) {
    const answer = await response.json();
    errorText.textContent = answer.error;
    return;
  }

  showCreateMode();
  await drawList();
}

// Enter in the form creates, or saves if a user is loaded.
userForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (loadedUser === null) {
    createUser();
    return;
  }
  saveUser();
});

saveButton.addEventListener("click", saveUser);

newButton.addEventListener("click", () => {
  errorText.textContent = "";
  showCreateMode();
  drawList();
});

// Borrar only opens the field. Nothing is deleted until the name is confirmed.
deleteButton.addEventListener("click", () => {
  errorText.textContent = "";
  confirmDelete.hidden = false;
  confirmNameInput.value = "";
  confirmNameInput.focus();
});

confirmButton.addEventListener("click", deleteUser);

cancelButton.addEventListener("click", () => {
  errorText.textContent = "";
  confirmDelete.hidden = true;
  confirmNameInput.value = "";
});

showCreateMode();
drawList();
