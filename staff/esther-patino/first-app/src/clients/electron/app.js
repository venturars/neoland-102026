/* global document, desktop */
const NAME_IS_EMPTY = "Name is empty";
const EMAIL_IS_INVALID = "Email is invalid";
const EMAIL_IS_ALREADY_USED = "Email is already used";
const USER_NOT_FOUND = "User not found";
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

function shownMessage(error, fallback) {
  if (error instanceof Error) {
    const message = error.message;
    if (message.includes(NAME_IS_EMPTY)) {
      return NAME_IS_EMPTY;
    }
    if (message.includes(EMAIL_IS_INVALID)) {
      return EMAIL_IS_INVALID;
    }
    if (message.includes(EMAIL_IS_ALREADY_USED)) {
      return EMAIL_IS_ALREADY_USED;
    }
    if (message.includes(USER_NOT_FOUND)) {
      return USER_NOT_FOUND;
    }
    if (message.includes(COULD_NOT_CREATE_THE_USER)) {
      return COULD_NOT_CREATE_THE_USER;
    }
    if (message.includes(COULD_NOT_LIST_THE_USERS)) {
      return COULD_NOT_LIST_THE_USERS;
    }
    if (message.includes(COULD_NOT_FIND_THE_USER)) {
      return COULD_NOT_FIND_THE_USER;
    }
    if (message.includes(COULD_NOT_UPDATE_THE_USER)) {
      return COULD_NOT_UPDATE_THE_USER;
    }
    if (message.includes(COULD_NOT_DELETE_THE_USER)) {
      return COULD_NOT_DELETE_THE_USER;
    }
    if (message.includes(COULD_NOT_CLASSIFY_THE_USERS)) {
      return COULD_NOT_CLASSIFY_THE_USERS;
    }
  }

  return fallback;
}

function showMessage(text, isError) {
  const message = document.getElementById("message");

  message.textContent = text;
  message.hidden = text === "";
  message.classList.toggle("message-error", isError);
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

function showCard(user) {
  const card = document.getElementById("user-card");

  if (user === null) {
    card.hidden = true;
    return;
  }

  const id = document.getElementById("card-id");
  id.textContent = "Id: " + user.id;
  const name = document.getElementById("card-name");
  name.textContent = "Nombre: " + user.name;
  const email = document.getElementById("card-email");
  email.textContent = "Email: " + user.email;
  const created = document.getElementById("card-created");
  created.textContent = "Creado: " + user.createdAt;
  const updated = document.getElementById("card-updated");
  updated.textContent = "Actualizado: " + user.updatedAt;
  card.hidden = false;
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
    const users = await desktop.listUsers();
    showUsers(users);
  } catch (error) {
    showMessage(shownMessage(error, COULD_NOT_LIST_THE_USERS), true);
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
    const user = await desktop.findUserById(id);
    STATE.selectedUser = user;
    fillForm(user);
    showCard(user);
  } catch (error) {
    showMessage(shownMessage(error, COULD_NOT_FIND_THE_USER), true);
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
    await desktop.createUser({ name, email });
    STATE.selectedUser = null;
    fillForm(null);
    showCard(null);
    STATE.isBusy = false;
    await listUsers();
  } catch (error) {
    showMessage(shownMessage(error, COULD_NOT_CREATE_THE_USER), true);
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
    const changes = {};
    if (name !== STATE.selectedUser.name) {
      changes.name = name;
    }
    if (email !== STATE.selectedUser.email) {
      changes.email = email;
    }
    const user = await desktop.updateUser(id, changes);
    STATE.selectedUser = user;
    fillForm(user);
    showCard(user);
    STATE.isBusy = false;
    await listUsers();
  } catch (error) {
    showMessage(shownMessage(error, COULD_NOT_UPDATE_THE_USER), true);
  } finally {
    STATE.isBusy = false;
  }
}

async function removeUser() {
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
    await desktop.deleteUser(id);
    STATE.selectedUser = null;
    fillForm(null);
    showCard(null);
    STATE.isBusy = false;
    await listUsers();
  } catch (error) {
    showMessage(shownMessage(error, COULD_NOT_DELETE_THE_USER), true);
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
    const count = await desktop.usersGenderCount();
    showGenderCount(count);
  } catch (error) {
    showMessage(shownMessage(error, COULD_NOT_CLASSIFY_THE_USERS), true);
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
  deleteButton.addEventListener("click", removeUser);
  const usersTab = document.getElementById("show-users");
  usersTab.addEventListener("click", showUsersSection);
  const countTab = document.getElementById("show-count");
  countTab.addEventListener("click", showCountSection);
  const countButton = document.getElementById("count-users");
  countButton.addEventListener("click", countUsers);
  listUsers();
}

initializeClient();
