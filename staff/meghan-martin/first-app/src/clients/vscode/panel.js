const vscode = acquireVsCodeApi();

const listScreen = document.querySelector("#list-screen");
const personScreen = document.querySelector("#person-screen");
const listError = document.querySelector("#list-error");
const listNotice = document.querySelector("#list-notice");
const personError = document.querySelector("#person-error");
const userList = document.querySelector("#user-list");
const createForm = document.querySelector("#create-form");
const searchForm = document.querySelector("#search-form");
const searchText = document.querySelector("#search-text");
const updateForm = document.querySelector("#update-form");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const confirmEmail = document.querySelector("#confirm-email");

let current = null;

function showPerson(person) {
  current = person;
  document.querySelector("#person-id").textContent = String(person.id);
  document.querySelector("#person-name").textContent = person.name;
  document.querySelector("#person-email").textContent = person.email;
  document.querySelector("#person-created").textContent = person.createdAt;
  document.querySelector("#person-updated").textContent = person.updatedAt;
  nameInput.value = person.name;
  emailInput.value = person.email;
  confirmEmail.value = "";
  personError.textContent = "";
  listScreen.hidden = true;
  personScreen.hidden = false;
}

function showList(people, notice) {
  current = null;
  listScreen.hidden = false;
  personScreen.hidden = true;
  listNotice.textContent = notice || "";
  userList.replaceChildren();
  for (const person of people) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "row";
    const id = document.createElement("span");
    const name = document.createElement("span");
    const email = document.createElement("span");
    id.textContent = String(person.id);
    name.textContent = person.name;
    email.textContent = person.email;
    button.append(id, name, email);
    button.addEventListener("click", function () {
      vscode.postMessage({ type: "open", id: person.id });
    });
    userList.append(button);
  }
}

window.addEventListener("message", function (event) {
  const result = event.data;
  if (!result.ok) {
    if (personScreen.hidden) {
      listError.textContent = result.error;
    } else {
      personError.textContent = result.error;
    }
    return;
  }
  listError.textContent = "";
  personError.textContent = "";
  if (result.clearCreate) {
    createForm.reset();
  }
  if (result.mode === "person") {
    showPerson(result.person);
    return;
  }
  showList(result.people, result.notice);
});

createForm.addEventListener("submit", function (event) {
  event.preventDefault();
  listError.textContent = "";
  const data = new FormData(createForm);
  vscode.postMessage({
    type: "create",
    name: data.get("name"),
    email: data.get("email"),
  });
});

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  listError.textContent = "";
  vscode.postMessage({
    type: "search",
    text: searchText.value,
  });
});

document.querySelector("#clear-search").addEventListener("click", function () {
  searchText.value = "";
  listError.textContent = "";
  vscode.postMessage({ type: "list" });
});

updateForm.addEventListener("submit", function (event) {
  event.preventDefault();
  personError.textContent = "";
  vscode.postMessage({
    type: "update",
    id: current.id,
    name: nameInput.value,
    email: emailInput.value,
  });
});

document.querySelector("#cancel-button").addEventListener("click", function () {
  nameInput.value = current.name;
  emailInput.value = current.email;
  personError.textContent = "";
});

document
  .querySelector("#delete-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    personError.textContent = "";
    vscode.postMessage({
      type: "delete",
      id: current.id,
      email: confirmEmail.value,
    });
  });

document.querySelector("#back-button").addEventListener("click", function () {
  personError.textContent = "";
  vscode.postMessage({ type: "list" });
});

vscode.postMessage({ type: "list" });
