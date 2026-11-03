# Plan · Arranque de Jupyter en Linux y Windows

> Estado: **Aprobado** (2026-11-02) · Spec: [spec.md](spec.md) v1.0 · Issue: #746

## 1. Visión

Reemplazar `sh scripts/jupyter.sh` por `node scripts/start-jupyter.js` en [`package.json`](../../package.json). Portar la lógica de [`scripts/jupyter.sh`](../../scripts/jupyter.sh) con `node:child_process` sin shell intermedio.

## 2. Ficheros

| Acción | Fichero |
| --- | --- |
| Crear | `docs/specs/jupyter-cross-platform/spec.md`, `plan.md`, `tasks.md` |
| Crear | `scripts/start-jupyter.js` |
| Tocar | `package.json` → `"jupyter": "node scripts/start-jupyter.js"` |
| Eliminar | `scripts/jupyter.sh` |
| Tocar | `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/TREE.md` |

## 3. Arranque (Node)

- Raíz: directorio padre de `scripts/`.
- Windows: `.venv/Scripts/python.exe`; otros: `.venv/bin/python`.
- Crear venv con candidatos Windows `python`, `py -3`, `python3`; Linux `python3`, `python`.
- Instalar `notebook==7.6.3` si falta (pip / ensurepip como el shell).
- `spawn` con `-m notebook src/clients/jupyter`, `stdio: 'inherit'`, `PYTHONUTF8=1`.

## 4. Comprobación de la constitución

Chore de configuración; sin cambios en `logic/` ni SQL.

## 5. Criterios

| CA | Cómo |
| --- | --- |
| CA-01 | `pnpm jupyter` en PowerShell |
| CA-02 | Nueve `.ipynb` en carpeta |
| CA-03 | Simular sin Python o mensaje observado |
| CA-04 | Revisar `env` en código |
| CA-05 | Lectura de guías |
| CA-06 | WSL/Linux o nota en tasks |

## 6. Validación

`node --check scripts/start-jupyter.js` antes de cerrar.
