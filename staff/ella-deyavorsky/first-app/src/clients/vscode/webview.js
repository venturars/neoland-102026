/* global acquireVsCodeApi, document, window */

// VS Code asks to keep this object out of the global scope, and a module-less
// script would put it there, so everything lives inside this function.
function startScreen() {
  const vscode = acquireVsCodeApi();
  const errorText = document.getElementById("error");
  const userList = document.getElementById("user-list");
  const listEmpty = document.getElementById("list-empty");
  const result = document.getElementById("result");

  function setButtonsOff(isOff) {
    const buttons = document.querySelectorAll("button");
    for (const button of buttons) {
      button.disabled = isOff;
    }
  }

  // The buttons stay off until the reply, so nothing is sent twice.
  function send(message) {
    setButtonsOff(true);
    errorText.textContent = "";
    result.textContent = "";
    vscode.postMessage(message);
  }

  function readBox(id) {
    const box = document.getElementById(id);
    return box.value;
  }

  // textContent keeps a name with HTML as text.
  function drawUsers(users) {
    userList.textContent = "";
    const isEmpty = users.length === 0;
    listEmpty.classList.toggle("hidden", isEmpty === false);
    for (const user of users) {
      const row = document.createElement("li");
      row.textContent = user.id + " - " + user.name + " - " + user.email;
      userList.appendChild(row);
    }
  }

  function addResultLine(label, value) {
    const line = document.createElement("li");
    line.textContent = label + ": " + value;
    result.appendChild(line);
  }

  function drawUser(user) {
    addResultLine("Id", user.id);
    addResultLine("Nombre", user.name);
    addResultLine("Email", user.email);
    addResultLine("Creado", user.createdAt);
    addResultLine("Actualizado", user.updatedAt);
  }

  // Every reply frees the screen, even an empty one.
  function handleReply(event) {
    const reply = event.data;
    setButtonsOff(false);
    // The forms are at the bottom and the answer at the top, so go up to show it.
    // An empty reply (a cancelled delete) has nothing to show, so the view stays still.
    if (reply.users !== undefined) {
      drawUsers(reply.users);
      window.scrollTo(0, 0);
    }
    if (reply.user !== undefined) {
      drawUser(reply.user);
      window.scrollTo(0, 0);
    }
    if (reply.error !== undefined) {
      errorText.textContent = reply.error;
      window.scrollTo(0, 0);
    }
  }

  function addClick(id, action) {
    const button = document.getElementById(id);
    button.addEventListener("click", action);
  }

  addClick("reload-button", () => {
    send({ action: "list" });
  });
  addClick("gmail-button", () => {
    send({ action: "list-gmail" });
  });
  addClick("create-button", () => {
    const name = readBox("create-name");
    const email = readBox("create-email");
    send({ action: "create", name, email });
  });
  addClick("view-button", () => {
    const id = readBox("view-id");
    send({ action: "view", id });
  });
  addClick("update-button", () => {
    const id = readBox("update-id");
    const name = readBox("update-name");
    const email = readBox("update-email");
    send({ action: "update", id, name, email });
  });
  addClick("delete-button", () => {
    const id = readBox("delete-id");
    send({ action: "delete", id });
  });

  window.addEventListener("message", handleReply);

  // Also runs when the person comes back to the view, because the screen loads again.
  send({ action: "list" });
}

startScreen();
