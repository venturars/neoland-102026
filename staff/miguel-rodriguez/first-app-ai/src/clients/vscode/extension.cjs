const vscode = require("vscode");

async function execute(message) {
  const { action, id, name, email, confirmation } = message;
  const operations = {
    list: ["list-users", "listUsers"],
    create: ["create-user", "createUser"],
    name: ["find-user-by-name", "findUserByName"],
    email: ["find-user-by-email", "findUserByEmail"],
    id: ["find-user-by-id", "findUserById"],
    update: ["update-user", "updateUser"],
    delete: ["delete-user", "deleteUser"],
  };
  if (!Object.hasOwn(operations, action)) throw new Error("Unknown action");
  if (["id", "update", "delete"].includes(action) && !Number.isSafeInteger(id))
    throw new Error("Invalid ID");
  if (
    ["create", "update"].includes(action) &&
    (typeof name !== "string" || typeof email !== "string")
  )
    throw new Error("Invalid input");
  if (action === "name" && typeof name !== "string")
    throw new Error("Invalid input");
  if (action === "email" && typeof email !== "string")
    throw new Error("Invalid input");
  if (action === "delete") {
    if (typeof confirmation !== "string")
      throw new Error("Confirm the saved email");
    const { findUserById } = await import("../../logic/find-user-by-id.js");
    const user = await findUserById(id);
    if (confirmation.trim().toLowerCase() !== user.email.trim().toLowerCase())
      throw new Error("Email does not match");
  }
  const [file, exportName] = operations[action];
  const operation = (await import(`../../logic/${file}.js`))[exportName];
  if (action === "list") return operation();
  if (action === "create") return operation({ name, email });
  if (action === "name") return operation(name);
  if (action === "email") return operation(email);
  if (action === "update") return operation(id, { name, email });
  return operation(id);
}

function activate(context) {
  const command = vscode.commands.registerCommand(
    "firstApp.openUsers",
    async () => {
      const panel = vscode.window.createWebviewPanel(
        "firstAppUsers",
        "First App Users",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [context.extensionUri],
        },
      );
      const htmlUri = vscode.Uri.joinPath(context.extensionUri, "panel.html");
      const htmlBytes = await vscode.workspace.fs.readFile(htmlUri);
      const html = Buffer.from(htmlBytes).toString("utf8");
      const script = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, "panel.js"),
      );
      const style = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, "panel.css"),
      );
      panel.webview.html = html
        .replaceAll("{{csp}}", panel.webview.cspSource)
        .replace("{{script}}", script.toString())
        .replace("{{style}}", style.toString());
      panel.webview.onDidReceiveMessage(
        async (message) => {
          try {
            const value = await execute(message);
            await panel.webview.postMessage({
              request: message.request,
              value,
            });
          } catch (error) {
            await panel.webview.postMessage({
              request: message.request,
              error: error.message,
            });
          }
        },
        undefined,
        context.subscriptions,
      );
    },
  );
  context.subscriptions.push(command);
}

module.exports = { activate, execute };
