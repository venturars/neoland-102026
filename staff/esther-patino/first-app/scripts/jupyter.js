import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const exe = ".venv/Scripts/jupyter-notebook.exe";
const python = ".venv/Scripts/python.exe";

if (!existsSync(exe)) {
  if (!existsSync(".venv")) {
    const venv = spawnSync("py", ["-3", "-m", "venv", ".venv"], {
      stdio: "inherit",
    });
    if (venv.status !== 0) {
      process.exit(venv.status ?? 1);
    }
  }

  const pip = spawnSync(
    python,
    ["-m", "pip", "install", "notebook==7.6.3"],
    { stdio: "inherit" },
  );
  if (pip.status !== 0) {
    process.exit(pip.status ?? 1);
  }
}

const jupyter = spawnSync(exe, ["clients/jupyter"], { stdio: "inherit" });
process.exit(jupyter.status ?? 1);
