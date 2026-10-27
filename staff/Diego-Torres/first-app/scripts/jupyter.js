import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { platform } from "node:os";

const windows = platform() === "win32";
const python = windows ? ".venv\\Scripts\\python.exe" : ".venv/bin/python";
const pip = windows ? ".venv\\Scripts\\pip.exe" : ".venv/bin/pip";
const jupyter = windows ? ".venv\\Scripts\\jupyter.exe" : ".venv/bin/jupyter";

if (!existsSync(jupyter)) {
  if (!existsSync(python)) {
    const creado = spawnSync("py", ["-3", "-m", "venv", ".venv"], {
      stdio: "inherit",
      shell: windows,
    });
    if (creado.status !== 0) {
      console.error("Hace falta Python 3. En Windows, el lanzador py.");
      process.exit(creado.status ?? 1);
    }
  }

  const instalado = spawnSync(pip, ["install", "notebook==7.6.3"], {
    stdio: "inherit",
  });
  if (instalado.status !== 0) {
    process.exit(instalado.status ?? 1);
  }
}

const abierto = spawnSync(jupyter, ["notebook", "clients/jupyter"], {
  stdio: "inherit",
});
process.exit(abierto.status ?? 1);
