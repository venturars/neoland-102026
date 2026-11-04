const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const NO_MATCH = "No people match.";
const EMPTY_LIST = "There are no people yet.";
const CONFIRM_EMAIL = "Type the saved email.";

function logicUrl(name) {
  return pathToFileURL(path.join(__dirname, "..", "..", "logic", name)).href;
}

function loadLogic() {
  return Promise.all([
    import(logicUrl("list-users.js")),
    import(logicUrl("find-user-by-email.js")),
    import(logicUrl("find-user-by-id.js")),
    import(logicUrl("create-user.js")),
    import(logicUrl("update-user.js")),
    import(logicUrl("delete-user.js")),
  ]).then(function (modules) {
    return {
      listUsers: modules[0].listUsers,
      findUserByEmail: modules[1].findUserByEmail,
      findUserById: modules[2].findUserById,
      createUser: modules[3].createUser,
      updateUser: modules[4].updateUser,
      deleteUser: modules[5].deleteUser,
    };
  });
}

function readId(text) {
  if (!/^[1-9]\d*$/.test(text)) {
    return null;
  }
  const id = Number(text);
  if (!Number.isSafeInteger(id)) {
    return null;
  }
  return id;
}

function hasLetters(text) {
  return /\p{L}/u.test(text);
}

function sameEmail(typed, saved) {
  return typed.trim().toLowerCase() === String(saved).trim().toLowerCase();
}

function peopleResult(people, notice) {
  return {
    ok: true,
    mode: "list",
    people: people,
    notice: notice || "",
  };
}

function personResult(person) {
  return {
    ok: true,
    mode: "person",
    person: person,
  };
}

function failure(error) {
  return {
    ok: false,
    error: error.message,
  };
}

async function searchPeople(logic, text) {
  const query = text.trim();
  if (query === "") {
    return peopleResult(await logic.listUsers(), "");
  }
  if (query.includes("@")) {
    try {
      const person = await logic.findUserByEmail(query);
      return peopleResult([person], "");
    } catch (error) {
      if (error.message === "User not found") {
        return peopleResult([], NO_MATCH);
      }
      return failure(error);
    }
  }
  if (!hasLetters(query)) {
    const id = readId(query);
    if (id === null) {
      return failure(new Error("Invalid id"));
    }
    try {
      const person = await logic.findUserById(id);
      return peopleResult([person], "");
    } catch (error) {
      if (error.message === "User not found") {
        return peopleResult([], NO_MATCH);
      }
      return failure(error);
    }
  }
  const people = await logic.listUsers();
  const matches = people.filter(function (person) {
    return person.name === query;
  });
  if (matches.length === 0) {
    return peopleResult([], NO_MATCH);
  }
  return peopleResult(matches, "");
}

async function handleMessage(logic, message) {
  try {
    if (message.type === "list") {
      const people = await logic.listUsers();
      return peopleResult(people, people.length === 0 ? EMPTY_LIST : "");
    }
    if (message.type === "search") {
      return searchPeople(logic, String(message.text ?? ""));
    }
    if (message.type === "create") {
      const person = await logic.createUser({
        name: message.name,
        email: message.email,
      });
      const people = await logic.listUsers();
      return {
        ok: true,
        mode: "list",
        people: people,
        person: person,
        notice: people.length === 0 ? EMPTY_LIST : "",
        clearCreate: true,
      };
    }
    if (message.type === "open") {
      const person = await logic.findUserById(message.id);
      return personResult(person);
    }
    if (message.type === "update") {
      const current = await logic.findUserById(message.id);
      const changes = {};
      if (message.name !== current.name) {
        changes.name = message.name;
      }
      if (message.email !== current.email) {
        changes.email = message.email;
      }
      if (changes.name === undefined && changes.email === undefined) {
        return personResult(current);
      }
      const saved = await logic.updateUser(current.id, changes);
      return personResult(saved);
    }
    if (message.type === "delete") {
      const current = await logic.findUserById(message.id);
      if (!sameEmail(String(message.email ?? ""), current.email)) {
        return failure(new Error(CONFIRM_EMAIL));
      }
      await logic.deleteUser(current.id);
      const people = await logic.listUsers();
      return peopleResult(people, people.length === 0 ? EMPTY_LIST : "");
    }
    return failure(new Error("Invalid request."));
  } catch (error) {
    return failure(error);
  }
}

function panelHtml(webview, extensionPath) {
  const nonce = String(Math.random()).slice(2);
  const scriptUri = webview.asWebviewUri(
    require("vscode").Uri.file(path.join(extensionPath, "panel.js")),
  );
  const styleUri = webview.asWebviewUri(
    require("vscode").Uri.file(path.join(extensionPath, "panel.css")),
  );
  const html = fs.readFileSync(path.join(extensionPath, "panel.html"), "utf8");
  return html
    .replaceAll("{{cspSource}}", webview.cspSource)
    .replaceAll("{{nonce}}", nonce)
    .replaceAll("{{style}}", String(styleUri))
    .replaceAll("{{script}}", String(scriptUri));
}

function activate(context) {
  const vscode = require("vscode");
  const disposable = vscode.commands.registerCommand(
    "firstApp.openPeople",
    function () {
      const opened = vscode.window.createWebviewPanel(
        "firstAppPeople",
        "People",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [vscode.Uri.file(context.extensionPath)],
        },
      );
      opened.webview.html = panelHtml(opened.webview, context.extensionPath);
      const logicPromise = loadLogic();
      opened.webview.onDidReceiveMessage(async function (message) {
        const logic = await logicPromise;
        const result = await handleMessage(logic, message);
        opened.webview.postMessage(result);
      });
    },
  );
  context.subscriptions.push(disposable);
}

module.exports = {
  activate,
  loadLogic,
  handleMessage,
};
