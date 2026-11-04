const { contextBridge, ipcRenderer } = require("electron");

// One function per action. The page never gets ipcRenderer itself.
contextBridge.exposeInMainWorld("api", {
  listUsers: () => ipcRenderer.invoke("list-users"),
  updateUser: (input) => ipcRenderer.invoke("update-user", input),
  deleteUser: (input) => ipcRenderer.invoke("delete-user", input),
});
