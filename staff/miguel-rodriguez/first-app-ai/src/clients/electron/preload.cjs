const { contextBridge, ipcRenderer } = require("electron");

const OPERATIONS = [
  "create",
  "list",
  "find",
  "update",
  "delete",
  "genderCount",
];

contextBridge.exposeInMainWorld("firstApp", {
  call: async (operation, args = []) => {
    const operationIsAllowed = OPERATIONS.includes(operation);
    if (!operationIsAllowed) {
      throw new Error("Unknown operation");
    }
    const result = await ipcRenderer.invoke("users:call", operation, args);
    const message = result.error;
    if (message) {
      throw new Error(message);
    }
    return result.data;
  },
});
