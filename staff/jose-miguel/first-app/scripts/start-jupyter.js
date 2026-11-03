import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const notebookVersion = "7.6.3";
const python3Check =
  "import sys; sys.exit(0 if sys.version_info.major == 3 else 1)";

const scriptFile = fileURLToPath(import.meta.url);
const appRoot = join(dirname(scriptFile), "..");

function isWindowsPlatform() {
  return process.platform === "win32";
}

// Windows usa Scripts; Linux y macOS usan bin.
function venvPythonPath() {
  if (isWindowsPlatform()) {
    return join(appRoot, ".venv", "Scripts", "python.exe");
  }

  return join(appRoot, ".venv", "bin", "python");
}

function runSync(command, args) {
  const result = spawnSync(command, args, {
    cwd: appRoot,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  const exitCode = result.status;

  if (exitCode === null) {
    return 1;
  }

  return exitCode;
}

function canRunPython3(command, commandArgs) {
  const args = [...commandArgs, "-c", python3Check];
  const result = spawnSync(command, args, {
    cwd: appRoot,
    stdio: "ignore",
  });

  return result.status === 0;
}

function createVirtualEnvironment() {
  let created = false;

  if (isWindowsPlatform()) {
    if (canRunPython3("python", [])) {
      const status = runSync("python", ["-m", "venv", ".venv"]);
      if (status !== 0) {
        process.exit(status);
      }
      created = true;
    } else if (canRunPython3("py", ["-3"])) {
      const status = runSync("py", ["-3", "-m", "venv", ".venv"]);
      if (status !== 0) {
        process.exit(status);
      }
      created = true;
    } else if (canRunPython3("python3", [])) {
      const status = runSync("python3", ["-m", "venv", ".venv"]);
      if (status !== 0) {
        process.exit(status);
      }
      created = true;
    }
  } else if (canRunPython3("python3", [])) {
    const status = runSync("python3", ["-m", "venv", ".venv"]);
    if (status !== 0) {
      process.exit(status);
    }
    created = true;
  } else if (canRunPython3("python", [])) {
    const status = runSync("python", ["-m", "venv", ".venv"]);
    if (status !== 0) {
      process.exit(status);
    }
    created = true;
  }

  if (!created) {
    console.error("Python 3 is required to start Jupyter.");
    process.exit(1);
  }
}

function notebookIsInstalled(pythonPath) {
  const notebookCheck = `import sys; from importlib.metadata import version; sys.exit(0 if version('notebook') == '${notebookVersion}' else 1)`;
  const result = spawnSync(pythonPath, ["-c", notebookCheck], {
    cwd: appRoot,
    stdio: "ignore",
  });

  return result.status === 0;
}

function ensureNotebook(pythonPath) {
  const alreadyInstalled = notebookIsInstalled(pythonPath);

  if (alreadyInstalled) {
    return;
  }

  const pipVersion = spawnSync(pythonPath, ["-m", "pip", "--version"], {
    cwd: appRoot,
    stdio: "ignore",
  });

  if (pipVersion.status !== 0) {
    const ensureStatus = runSync(pythonPath, ["-m", "ensurepip", "--upgrade"]);
    if (ensureStatus !== 0) {
      process.exit(ensureStatus);
    }
  }

  const installStatus = runSync(pythonPath, [
    "-m",
    "pip",
    "install",
    "--trusted-host",
    "pypi.org",
    "--trusted-host",
    "files.pythonhosted.org",
    `notebook==${notebookVersion}`,
  ]);

  if (installStatus !== 0) {
    process.exit(installStatus);
  }
}

function startNotebook(pythonPath) {
  const environment = { ...process.env, PYTHONUTF8: "1" };
  const notebookProcess = spawn(
    pythonPath,
    ["-m", "notebook", "src/clients/jupyter"],
    {
      cwd: appRoot,
      stdio: "inherit",
      env: environment,
    },
  );

  notebookProcess.on("exit", (code) => {
    if (code === null) {
      process.exit(1);
    }

    process.exit(code);
  });
}

function main() {
  let pythonPath = venvPythonPath();

  if (!existsSync(pythonPath)) {
    createVirtualEnvironment();
    pythonPath = venvPythonPath();
  }

  ensureNotebook(pythonPath);
  startNotebook(pythonPath);
}

main();
