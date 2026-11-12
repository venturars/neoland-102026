const vscode = require("vscode");

async function execute(message) {
  const { action, id, name, email, confirmation } = message;

  if (action === "list") {
    const { listUsers } = await import("../../logic/list-users.js");
    return listUsers();
  }

  if (action === "create") {
    if (typeof name !== "string" || typeof email !== "string") {
      throw new Error("Invalid input");
    }
    const { createUser } = await import("../../logic/create-user.js");
    return createUser({ name, email });
  }

  if (action === "searchName") {
    if (typeof name !== "string") {
      throw new Error("Invalid input");
    }
    const { listUsers } = await import("../../logic/list-users.js");
    const users = await listUsers();
    return users.filter((user) => user.name === name);
  }

  if (action === "searchEmail") {
    if (typeof email !== "string") {
      throw new Error("Invalid input");
    }
    const needle = email.trim().toLowerCase();
    const { listUsers } = await import("../../logic/list-users.js");
    const users = await listUsers();
    return users.filter((user) => user.email.trim().toLowerCase() === needle);
  }

  if (action === "searchId") {
    if (!Number.isSafeInteger(id)) {
      throw new Error("User id is not valid");
    }
    const { findUserById } = await import("../../logic/find-user-by-id.js");
    const user = await findUserById(id);
    return [user];
  }

  if (action === "update") {
    if (!Number.isSafeInteger(id)) {
      throw new Error("User id is not valid");
    }
    if (typeof name !== "string" || typeof email !== "string") {
      throw new Error("Invalid input");
    }
    const { updateUser } = await import("../../logic/update-user.js");
    return updateUser({ id, name, email });
  }

  if (action === "delete") {
    if (!Number.isSafeInteger(id)) {
      throw new Error("User id is not valid");
    }
    if (typeof confirmation !== "string") {
      throw new Error("Confirm the saved email");
    }
    const { findUserById } = await import("../../logic/find-user-by-id.js");
    const user = await findUserById(id);
    if (confirmation.trim().toLowerCase() !== user.email.trim().toLowerCase()) {
      throw new Error("El email no coincide con el guardado.");
    }
    const { deleteUser } = await import("../../logic/delete-user.js");
    await deleteUser({ id });
    return null;
  }

  throw new Error("Unknown action");
}

class UsersViewProvider {
  constructor(extensionUri) {
    this.extensionUri = extensionUri;
  }

  resolveWebviewView(webviewView) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    void this.setHtml(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (message) => {
      try {
        const value = await execute(message);
        await webviewView.webview.postMessage({
          request: message.request,
          value,
        });
      } catch (error) {
        await webviewView.webview.postMessage({
          request: message.request,
          error: error.message,
        });
      }
    });
  }

  async setHtml(webview) {
    const htmlUri = vscode.Uri.joinPath(this.extensionUri, "panel.html");
    const htmlBytes = await vscode.workspace.fs.readFile(htmlUri);
    const html = Buffer.from(htmlBytes).toString("utf8");
    const script = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "panel.js"),
    );
    const style = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "panel.css"),
    );
    webview.html = html
      .replaceAll("{{csp}}", webview.cspSource)
      .replace("{{script}}", script.toString())
      .replace("{{style}}", style.toString());
  }
}

function activate(context) {
  const provider = new UsersViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "miPrimerProyecto.usersView",
      provider,
      { webviewOptions: { retainContextWhenHidden: true } },
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("miPrimerProyecto.focusUsers", async () => {
      await vscode.commands.executeCommand(
        "workbench.view.extension.miPrimerProyectoUsers",
      );
    }),
  );
}

function deactivate() {}

module.exports = { activate, deactivate, execute };
