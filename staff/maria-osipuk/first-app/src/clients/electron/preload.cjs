const { contextBridge, ipcRenderer } = require("electron");

// The preload is the only bridge between the page and the main process.
// It has to be .cjs: the window is sandboxed, and a sandboxed preload cannot
// use import, while package.json makes every .js file an ES module.
// It publishes six functions and not ipcRenderer itself, so the page can
// only ask for these actions.
contextBridge.exposeInMainWorld("users", {
  list() {
    return ipcRenderer.invoke("users:list");
  },
  count() {
    return ipcRenderer.invoke("users:count");
  },
  find(id) {
    return ipcRenderer.invoke("users:find", id);
  },
  create(name, email) {
    return ipcRenderer.invoke("users:create", name, email);
  },
  update(id, changes) {
    return ipcRenderer.invoke("users:update", id, changes);
  },
  remove(id) {
    return ipcRenderer.invoke("users:delete", id);
  },
});
