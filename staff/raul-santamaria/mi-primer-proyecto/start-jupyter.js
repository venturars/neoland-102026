import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const isWindows = process.platform === "win32";
const binDir = isWindows ? "Scripts" : "bin";
const notebookMarker = isWindows
  ? "jupyter-notebook.exe"
  : "jupyter-notebook";
const jupyterName = isWindows ? "jupyter.exe" : "jupyter";
const pipName = isWindows ? "pip.exe" : "pip";
const pythonName = isWindows ? "python" : "python3";

const notebookMarkerPath = join(".venv", binDir, notebookMarker);
const jupyterPath = join(".venv", binDir, jupyterName);
const pipPath = join(".venv", binDir, pipName);

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: isWindows,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!existsSync(notebookMarkerPath)) {
  if (!existsSync(".venv")) {
    run(pythonName, ["-m", "venv", ".venv"]);
  }

  run(pipPath, ["install", "notebook==7.6.3"]);
}

run(jupyterPath, ["notebook", "clients/jupyter"]);
