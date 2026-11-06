const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("firstApp", {
  countGenders: () => ipcRenderer.invoke("gender-count"),
});
