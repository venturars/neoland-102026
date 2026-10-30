import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const JUPYTER_EXE = ".venv/Scripts/jupyter-notebook.exe";
const PYTHON_EXE = ".venv/Scripts/python.exe";
const VENV_DIRECTORY = ".venv";
const PYTHON_LAUNCHER = "py";
const PYTHON_VERSION_ARG = "-3";
const MODULE_FLAG = "-m";
const VENV_MODULE = "venv";
const PIP_MODULE = "pip";
const PIP_INSTALL = "install";
const NOTEBOOK_PACKAGE = "notebook==7.6.3";
const JUPYTER_DIRECTORY = "src/clients/jupyter";
const STDIO_INHERIT = "inherit";
const EMPTY_EXIT_CODE = 1;

if (!existsSync(JUPYTER_EXE)) {
  if (!existsSync(VENV_DIRECTORY)) {
    const venv = spawnSync(
      PYTHON_LAUNCHER,
      [PYTHON_VERSION_ARG, MODULE_FLAG, VENV_MODULE, VENV_DIRECTORY],
      { stdio: STDIO_INHERIT },
    );
    if (venv.status !== 0) {
      let venvExit = venv.status;
      if (venvExit === undefined || venvExit === null) {
        venvExit = EMPTY_EXIT_CODE;
      }
      process.exit(venvExit);
    }
  }

  const pip = spawnSync(
    PYTHON_EXE,
    [MODULE_FLAG, PIP_MODULE, PIP_INSTALL, NOTEBOOK_PACKAGE],
    { stdio: STDIO_INHERIT },
  );
  if (pip.status !== 0) {
    let pipExit = pip.status;
    if (pipExit === undefined || pipExit === null) {
      pipExit = EMPTY_EXIT_CODE;
    }
    process.exit(pipExit);
  }
}

const jupyter = spawnSync(JUPYTER_EXE, [JUPYTER_DIRECTORY], {
  stdio: STDIO_INHERIT,
});
let jupyterExit = jupyter.status;
if (jupyterExit === undefined || jupyterExit === null) {
  jupyterExit = EMPTY_EXIT_CODE;
}
process.exit(jupyterExit);
