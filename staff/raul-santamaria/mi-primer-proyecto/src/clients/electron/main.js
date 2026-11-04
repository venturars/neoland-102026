import { app, BrowserWindow } from "electron";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const electronDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(electronDirectory, "../../..");

let serverProcess = null;
let mainWindow = null;

function serverScriptPath() {
  return path.join(projectRoot, "src/db/server.js");
}

function waitForServer() {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    async function tryOnce() {
      attempts += 1;
      try {
        const response = await fetch("http://127.0.0.1:3000/execute", {
          method: "OPTIONS",
        });
        if (response.status === 204) {
          resolve();
          return;
        }
      } catch {
        // Server not ready yet.
      }

      if (attempts > 60) {
        reject(new Error("Database server did not start"));
        return;
      }

      setTimeout(tryOnce, 100);
    }

    setTimeout(tryOnce, 200);
  });
}

function startServer() {
  return new Promise((resolve, reject) => {
    const environment = {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
    };

    serverProcess = spawn(process.execPath, [serverScriptPath()], {
      cwd: projectRoot,
      env: environment,
      stdio: "pipe",
    });

    serverProcess.on("error", reject);

    serverProcess.stderr.on("data", (chunk) => {
      process.stderr.write(chunk);
    });

    waitForServer().then(resolve).catch(reject);
  });
}

function stopServer() {
  if (!serverProcess) {
    return;
  }

  serverProcess.kill();
  serverProcess = null;
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 760,
    height: 680,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const pagePath = path.join(electronDirectory, "index.html");
  await mainWindow.loadFile(pagePath);
}

app.whenReady().then(async () => {
  try {
    await startServer();
    await createWindow();
  } catch (error) {
    console.error(error);
    stopServer();
    app.quit();
  }
});

app.on("window-all-closed", () => {
  stopServer();
  app.quit();
});

app.on("before-quit", () => {
  stopServer();
});
