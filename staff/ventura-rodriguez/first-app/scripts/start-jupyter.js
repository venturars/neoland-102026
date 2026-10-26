import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const APP_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const NOTEBOOK_VERSION = "7.6.3";
const IS_WINDOWS = process.platform === "win32";
// Windows guarda Python en Scripts; Linux lo guarda en bin.
const ENV_PYTHON = IS_WINDOWS
  ? join(APP_ROOT, ".venv", "Scripts", "python.exe")
  : join(APP_ROOT, ".venv", "bin", "python");

try {
  if (!existsSync(ENV_PYTHON)) {
    const candidates = IS_WINDOWS
      ? [["python"], ["py", "-3"], ["python3"]]
      : [["python3"], ["python"]];
    let python;

    for (const candidate of candidates) {
      const check = spawnSync(
        candidate[0],
        [
          ...candidate.slice(1),
          "-c",
          "import sys; sys.exit(0 if sys.version_info.major == 3 else 1)",
        ],
        { cwd: APP_ROOT, stdio: "ignore" },
      );
      if (!check.error && check.status === 0) {
        python = candidate;
        break;
      }
    }

    if (!python) {
      throw new Error("Python 3 is required to start Jupyter.");
    }

    const environment = spawnSync(
      python[0],
      [...python.slice(1), "-m", "venv", ".venv"],
      { cwd: APP_ROOT, stdio: "inherit" },
    );
    if (environment.error) throw environment.error;
    if (environment.status !== 0) process.exit(environment.status ?? 1);
  }

  const notebook = spawnSync(
    ENV_PYTHON,
    [
      "-c",
      "import sys; from importlib.metadata import version; " +
        `sys.exit(0 if version('notebook') == '${NOTEBOOK_VERSION}' else 1)`,
    ],
    { cwd: APP_ROOT, stdio: "ignore" },
  );
  if (notebook.error) throw notebook.error;

  if (notebook.status !== 0) {
    const pip = spawnSync(ENV_PYTHON, ["-m", "pip", "--version"], {
      cwd: APP_ROOT,
      stdio: "ignore",
    });
    if (pip.error) throw pip.error;

    if (pip.status !== 0) {
      const bootstrap = spawnSync(
        ENV_PYTHON,
        ["-m", "ensurepip", "--upgrade"],
        { cwd: APP_ROOT, stdio: "inherit" },
      );
      if (bootstrap.error) throw bootstrap.error;
      if (bootstrap.status !== 0) process.exit(bootstrap.status ?? 1);
    }

    const install = spawnSync(
      ENV_PYTHON,
      ["-m", "pip", "install", `notebook==${NOTEBOOK_VERSION}`],
      { cwd: APP_ROOT, stdio: "inherit" },
    );
    if (install.error) throw install.error;
    if (install.status !== 0) process.exit(install.status ?? 1);
  }

  const server = spawnSync(
    ENV_PYTHON,
    ["-m", "notebook", "clients/jupyter"],
    { cwd: APP_ROOT, stdio: "inherit" },
  );
  if (server.error) throw server.error;
  process.exit(server.status ?? 1);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
