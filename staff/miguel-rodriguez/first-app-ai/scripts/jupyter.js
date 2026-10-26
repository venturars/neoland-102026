import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const app = dirname(dirname(fileURLToPath(import.meta.url)));
const environment = join(app, '.venv');
const windows = process.platform === 'win32';
const python = join(environment, windows ? 'Scripts/python.exe' : 'bin/python');

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: app, stdio: 'inherit', ...options });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!existsSync(join(app, 'node_modules/cli-table3')) || !existsSync(join(app, 'node_modules/openai'))) {
  if (!process.env.npm_execpath) {
    console.error('Ejecuta pnpm install y después pnpm jupyter.');
    process.exit(1);
  }
  run(process.execPath, [process.env.npm_execpath, 'install', '--frozen-lockfile']);
}

if (!existsSync(python)) {
  console.log('Preparando el entorno local de Jupyter…');
  run(windows ? 'py' : 'python3', [...(windows ? ['-3'] : []), '-m', 'venv', environment]);
}

const jupyter = spawnSync(python, [
  '-c',
  'import ipykernel; from importlib.metadata import version; assert version("notebook") == "7.6.3" and version("ipykernel") == "7.1.0"',
], { stdio: 'ignore' });
if (jupyter.status !== 0) {
  run(python, ['-m', 'pip', 'install', '-r', join(app, 'requirements-jupyter.txt')]);
}

run(python, ['-m', 'ipykernel', 'install', '--prefix', environment,
  '--name', 'first-app-ai', '--display-name', 'First app AI']);

console.log('Abriendo los nueve documentos. Ctrl+C para detener Jupyter.');
run(python, ['-m', 'notebook',
  `--ServerApp.root_dir=${join(app, 'clients/jupyter')}`,
  '--ServerApp.open_browser=True',
  ...process.argv.slice(2),
  '--ServerApp.ip=127.0.0.1',
], {
  env: {
    ...process.env,
    PATH: `${dirname(process.execPath)}${windows ? ';' : ':'}${process.env.PATH}`,
    JUPYTER_RUNTIME_DIR: join(environment, 'jupyter-runtime'),
  },
});
