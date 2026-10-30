// Abre Jupyter con los notebooks de src/clients/jupyter, en Linux y Windows.
// La primera vez crea .venv e instala notebook; las siguientes lo reutiliza.

import { spawnSync } from "node:child_process";
import console from "node:console";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const NOTEBOOK_VERSION = "7.6.3";

const app = join(dirname(fileURLToPath(import.meta.url)), "..");
const isWindows = process.platform === "win32";

// Windows guarda Python en Scripts; Linux lo guarda en bin.
const envPython = isWindows
  ? join(app, ".venv", "Scripts", "python.exe")
  : join(app, ".venv", "bin", "python");

function run(command, args, options = {}) {
  return spawnSync(command, args, { cwd: app, stdio: "inherit", ...options });
}

function isPython3(command, args) {
  const result = spawnSync(
    command,
    [
      ...args,
      "-c",
      "import sys; sys.exit(0 if sys.version_info.major == 3 else 1)",
    ],
    { stdio: "ignore" },
  );
  return result.status === 0;
}

function findPython3() {
  const candidates = isWindows
    ? [
        ["python", []],
        ["py", ["-3"]],
        ["python3", []],
      ]
    : [
        ["python3", []],
        ["python", []],
      ];
  return candidates.find(([command, args]) => isPython3(command, args));
}

function exitOnFailure(result) {
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!existsSync(envPython)) {
  const python = findPython3();
  if (!python) {
    console.error("Python 3 is required to start Jupyter.");
    process.exit(1);
  }
  const [command, args] = python;
  exitOnFailure(run(command, [...args, "-m", "venv", ".venv"]));
}

const hasNotebook = spawnSync(
  envPython,
  [
    "-c",
    `import sys; from importlib.metadata import version; sys.exit(0 if version('notebook') == '${NOTEBOOK_VERSION}' else 1)`,
  ],
  { stdio: "ignore" },
);

if (hasNotebook.status !== 0) {
  exitOnFailure(
    run(envPython, ["-m", "pip", "install", `notebook==${NOTEBOOK_VERSION}`]),
  );
}

// Los kernels heredan UTF-8 para leer la salida de Node también en Windows.
exitOnFailure(
  run(envPython, ["-m", "notebook", "src/clients/jupyter"], {
    env: { ...process.env, PYTHONUTF8: "1" },
  }),
);
