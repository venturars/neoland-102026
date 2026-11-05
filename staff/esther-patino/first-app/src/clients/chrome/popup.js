/* global document, fetch */
const ORIGIN = "http://127.0.0.1:3002";
const COULD_NOT_CREATE_THE_USER = "Could not create the user";
const COULD_NOT_LIST_THE_USERS = "Could not list the users";
const COULD_NOT_FIND_THE_USER = "Could not find the user";
const COULD_NOT_UPDATE_THE_USER = "Could not update the user";
const COULD_NOT_DELETE_THE_USER = "Could not delete the user";
const COULD_NOT_CLASSIFY_THE_USERS = "Could not classify the users";

const STATE = {
  selectedUser: null,
  isBusy: false,
};

function showMessage(text, isError) {
  const message = document.getElementById("message");

  message.textContent = text;
  message.hidden = text === "";
  message.classList.toggle("message-error", isError);
}

async function readErrorMessage(response, fallback) {
  const body = await response.json();
  const message = body.message;

  if (message === undefined) {
    return fallback;
  }

  return message;
}

function showUsers(users) {
  const list = document.getElementById("user-list");
  list.replaceChildren();

  for (const user of users) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "user-item";
    button.textContent = "#" + user.id + " · " + user.name + " — " + user.email;
    button.addEventListener("click", function () {
      viewUser(user.id);
    });
    item.append(button);
    list.append(item);
  }
}

function fillForm(user) {
  const name = document.getElementById("user-name");
  const email = document.getElementById("user-email");

  if (user === null) {
    name.value = "";
    email.value = "";
    return;
  }

  name.value = user.name;
  email.value = user.email;
}

async function listUsers() {
  if (STATE.isBusy) {
    return;
  }

  STATE.isBusy = true;
  showMessage("", false);

  try {
    const response = await fetch(ORIGIN + "/users");

    if (!response.ok) {
      const message = await readErrorMessage(
        response,
        COULD_NOT_LIST_THE_USERS,
      );
      showMessage(message, true);
      return;
    }

    const users = await response.json();
    showUsers(users);
  } catch (error) {
    showMessage(COULD_NOT_LIST_THE_USERS, true);
  } finally {
    STATE.isBusy = false;
  }
}

async function viewUser(id) {
  if (STATE.isBusy) {
    return;
  }

  STATE.isBusy = true;
  showMessage("", false);

  try {
    const response = await fetch(ORIGIN + "/users/" + id);

    if (!response.ok) {
      const message = await readErrorMessage(response, COULD_NOT_FIND_THE_USER);
      showMessage(message, true);
      return;
    }

    const user = await response.json();
    STATE.selectedUser = user;
    fillForm(user);
  } catch (error) {
    showMessage(COULD_NOT_FIND_THE_USER, true);
  } finally {
    STATE.isBusy = false;
  }
}

async function createUser() {
  if (STATE.isBusy) {
    return;
  }

  const nameInput = document.getElementById("user-name");
  const emailInput = document.getElementById("user-email");
  const name = nameInput.value;
  const email = emailInput.value;
  STATE.isBusy = true;
  showMessage("", false);

  try {
    const payload = JSON.stringify({ name, email });
    const response = await fetch(ORIGIN + "/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
    });

    if (!response.ok) {
      const message = await readErrorMessage(
        response,
        COULD_NOT_CREATE_THE_USER,
      );
      showMessage(message, true);
      return;
    }

    STATE.selectedUser = null;
    fillForm(null);
    STATE.isBusy = false;
    await listUsers();
  } catch (error) {
    showMessage(COULD_NOT_CREATE_THE_USER, true);
  } finally {
    STATE.isBusy = false;
  }
}

async function saveUser(event) {
  event.preventDefault();

  if (STATE.isBusy) {
    return;
  }

  if (STATE.selectedUser === null) {
    return;
  }

  const nameInput = document.getElementById("user-name");
  const emailInput = document.getElementById("user-email");
  const name = nameInput.value;
  const email = emailInput.value;
  const id = STATE.selectedUser.id;
  STATE.isBusy = true;
  showMessage("", false);

  try {
    const payload = JSON.stringify({ name, email });
    const response = await fetch(ORIGIN + "/users/" + id, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: payload,
    });

    if (!response.ok) {
      const message = await readErrorMessage(
        response,
        COULD_NOT_UPDATE_THE_USER,
      );
      showMessage(message, true);
      return;
    }

    const user = await response.json();
    STATE.selectedUser = user;
    fillForm(user);
    STATE.isBusy = false;
    await listUsers();
  } catch (error) {
    showMessage(COULD_NOT_UPDATE_THE_USER, true);
  } finally {
    STATE.isBusy = false;
  }
}

async function deleteUser() {
  if (STATE.isBusy) {
    return;
  }

  if (STATE.selectedUser === null) {
    return;
  }

  const id = STATE.selectedUser.id;
  STATE.isBusy = true;
  showMessage("", false);

  try {
    const response = await fetch(ORIGIN + "/users/" + id, {
      method: "DELETE",
    });

    if (!response.ok) {
      const message = await readErrorMessage(
        response,
        COULD_NOT_DELETE_THE_USER,
      );
      showMessage(message, true);
      return;
    }

    STATE.selectedUser = null;
    fillForm(null);
    STATE.isBusy = false;
    await listUsers();
  } catch (error) {
    showMessage(COULD_NOT_DELETE_THE_USER, true);
  } finally {
    STATE.isBusy = false;
  }
}

function showUsersSection() {
  const usersSection = document.getElementById("users-section");
  const countSection = document.getElementById("count-section");
  const usersTab = document.getElementById("show-users");
  const countTab = document.getElementById("show-count");

  usersSection.hidden = false;
  countSection.hidden = true;
  usersTab.classList.add("tab-selected");
  countTab.classList.remove("tab-selected");
}

function showCountSection() {
  const usersSection = document.getElementById("users-section");
  const countSection = document.getElementById("count-section");
  const usersTab = document.getElementById("show-users");
  const countTab = document.getElementById("show-count");

  usersSection.hidden = true;
  countSection.hidden = false;
  usersTab.classList.remove("tab-selected");
  countTab.classList.add("tab-selected");
}

function showGenderCount(count) {
  const women = document.getElementById("count-women");
  const men = document.getElementById("count-men");
  const undefinedUser = document.getElementById("count-undefined");

  women.textContent = "women " + count.women;
  men.textContent = "men " + count.men;
  undefinedUser.textContent = "undefinedUser " + count.undefinedUser;
  women.hidden = false;
  men.hidden = false;
  undefinedUser.hidden = false;
}

async function countUsers() {
  if (STATE.isBusy) {
    return;
  }

  STATE.isBusy = true;
  showMessage("", false);

  try {
    const response = await fetch(ORIGIN + "/users/gender-count");

    if (!response.ok) {
      const message = await readErrorMessage(
        response,
        COULD_NOT_CLASSIFY_THE_USERS,
      );
      showMessage(message, true);
      return;
    }

    const count = await response.json();
    showGenderCount(count);
  } catch (error) {
    showMessage(COULD_NOT_CLASSIFY_THE_USERS, true);
  } finally {
    STATE.isBusy = false;
  }
}

function initializeClient() {
  const form = document.getElementById("user-form");
  form.addEventListener("submit", saveUser);
  const createButton = document.getElementById("create-user");
  createButton.addEventListener("click", createUser);
  const deleteButton = document.getElementById("delete-user");
  deleteButton.addEventListener("click", deleteUser);
  const usersTab = document.getElementById("show-users");
  usersTab.addEventListener("click", showUsersSection);
  const countTab = document.getElementById("show-count");
  countTab.addEventListener("click", showCountSection);
  const countButton = document.getElementById("count-users");
  countButton.addEventListener("click", countUsers);
  listUsers();
}

initializeClient();
