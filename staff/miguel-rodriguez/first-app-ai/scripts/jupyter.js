import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const modulePath = fileURLToPath(import.meta.url);
const scriptDirectory = dirname(modulePath);
const app = dirname(scriptDirectory);
const environment = join(app, ".venv");
const platform = process.platform;
const windows = platform === "win32";
const pythonLocation = windows ? "Scripts/python.exe" : "bin/python";
const python = join(environment, pythonLocation);

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: app,
    stdio: "inherit",
    ...options,
  });
  const launchError = result.error;
  const launchFailed = Boolean(launchError);
  if (launchFailed) {
    const message = launchError.message;
    console.error(message);
    process.exit(1);
  }
  const status = result.status;
  const commandFailed = status !== 0;
  if (commandFailed) {
    const exitCode = status ?? 1;
    process.exit(exitCode);
  }
}

const tablePackagePath = join(app, "node_modules/cli-table3");
const tablePackageExists = existsSync(tablePackagePath);
let dependenciesAreMissing = !tablePackageExists;
const tablePackageIsPresent = !dependenciesAreMissing;
if (tablePackageIsPresent) {
  const openaiPackagePath = join(app, "node_modules/openai");
  const openaiPackageExists = existsSync(openaiPackagePath);
  dependenciesAreMissing = !openaiPackageExists;
}
if (dependenciesAreMissing) {
  const packageManager = process.env.npm_execpath;
  const packageManagerIsMissing = !packageManager;
  if (packageManagerIsMissing) {
    console.error("Ejecuta pnpm install y después pnpm jupyter.");
    process.exit(1);
  }
  const node = process.execPath;
  const installArguments = [packageManager, "install", "--frozen-lockfile"];
  run(node, installArguments);
}

const pythonExists = existsSync(python);
const pythonIsMissing = !pythonExists;
if (pythonIsMissing) {
  console.log("Preparando el entorno local de Jupyter…");
  const pythonLauncher = windows ? "py" : "python3";
  const pythonVersionArguments = windows ? ["-3"] : [];
  const environmentArguments = [
    ...pythonVersionArguments,
    "-m",
    "venv",
    environment,
  ];
  run(pythonLauncher, environmentArguments);
}

const versionArguments = [
  "-c",
  'import ipykernel; from importlib.metadata import version; assert version("notebook") == "7.6.3" and version("ipykernel") == "7.1.0"',
];
const jupyter = spawnSync(python, versionArguments, { stdio: "ignore" });
const versionStatus = jupyter.status;
const versionsAreMissing = versionStatus !== 0;
if (versionsAreMissing) {
  const requirementsPath = join(app, "requirements-jupyter.txt");
  const installArguments = ["-m", "pip", "install", "-r", requirementsPath];
  run(python, installArguments);
}

const kernelArguments = [
  "-m",
  "ipykernel",
  "install",
  "--prefix",
  environment,
  "--name",
  "first-app-ai",
  "--display-name",
  "First app AI",
];
run(python, kernelArguments);

console.log("Abriendo los nueve documentos. Ctrl+C para detener Jupyter.");
const notebookDirectory = join(app, "clients/jupyter");
const suppliedArguments = process.argv.slice(2);
const notebookArguments = [
  "-m",
  "notebook",
  `--ServerApp.root_dir=${notebookDirectory}`,
  "--ServerApp.open_browser=True",
  ...suppliedArguments,
  "--ServerApp.ip=127.0.0.1",
];
const node = process.execPath;
const nodeDirectory = dirname(node);
const pathSeparator = windows ? ";" : ":";
const existingPath = process.env.PATH;
const commandPath = `${nodeDirectory}${pathSeparator}${existingPath}`;
const runtimeDirectory = join(environment, "jupyter-runtime");
const notebookEnvironment = {
  ...process.env,
  PATH: commandPath,
  JUPYTER_RUNTIME_DIR: runtimeDirectory,
};
const notebookOptions = { env: notebookEnvironment };
run(python, notebookArguments, notebookOptions);
