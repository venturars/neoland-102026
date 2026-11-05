const origin = "http://127.0.0.1:3002";

const message = document.querySelector("#message");
const userList = document.querySelector("#user-list");
const createForm = document.querySelector("#create-form");
const createName = document.querySelector("#create-name");
const createEmail = document.querySelector("#create-email");
const openForm = document.querySelector("#open-form");
const openId = document.querySelector("#open-id");
const personCard = document.querySelector("#person-card");
const openedPerson = document.querySelector("#opened-person");
const saveForm = document.querySelector("#save-form");
const saveName = document.querySelector("#save-name");
const saveEmail = document.querySelector("#save-email");
const deletePerson = document.querySelector("#delete-person");

let openedId = "";

function showError(text) {
  message.textContent = text;
}

function clearMessage() {
  message.textContent = "";
}

async function readResult(response) {
  const result = await response.json();
  if (result.error) {
    showError(result.error);
    return null;
  }
  return result;
}

function writeCard(user) {
  openedId = String(user.id);
  personCard.hidden = false;
  openedPerson.textContent =
    String(user.id) +
    ". " +
    user.name +
    " (" +
    user.email +
    ") " +
    user.createdAt +
    " " +
    user.updatedAt;
  saveName.value = user.name;
  saveEmail.value = user.email;
}

async function showUsers() {
  const response = await fetch(origin + "/users");
  const users = await readResult(response);
  userList.replaceChildren();
  if (!users) {
    return;
  }
  for (const user of users) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent =
      String(user.id) + ". " + user.name + " (" + user.email + ")";
    button.addEventListener("click", function () {
      openPerson(String(user.id));
    });
    item.append(button);
    userList.append(item);
  }
}

async function openPerson(id) {
  clearMessage();
  const response = await fetch(origin + "/users/" + id);
  const user = await readResult(response);
  if (!user) {
    return;
  }
  writeCard(user);
}

createForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  clearMessage();
  const response = await fetch(origin + "/users", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: createName.value,
      email: createEmail.value,
    }),
  });
  const user = await readResult(response);
  if (!user) {
    return;
  }
  createName.value = "";
  createEmail.value = "";
  await showUsers();
});

openForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  await openPerson(openId.value);
});

saveForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  clearMessage();
  const changes = {
    name: saveName.value,
    email: saveEmail.value,
  };
  const response = await fetch(origin + "/users/" + openedId, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(changes),
  });
  const user = await readResult(response);
  if (!user) {
    return;
  }
  writeCard(user);
  await showUsers();
});

deletePerson.addEventListener("click", async function () {
  clearMessage();
  const response = await fetch(origin + "/users/" + openedId, {
    method: "DELETE",
  });
  const result = await readResult(response);
  if (!result) {
    return;
  }
  openedId = "";
  personCard.hidden = true;
  openedPerson.textContent = "";
  await showUsers();
});

showUsers();
