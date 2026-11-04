# Plan — script de jupyter y archivos locales

> Ubicaciones vigentes desde el 2026-10-30: las capas citadas en esta iteración se han trasladado a `src/`. Los contratos se conservan; las rutas actuales están en [TREE](../../TREE.md), [arquitectura](../../ARCHITECTURE.md) y el [plan de traslado](../move-layers-under-src/plan.md). El contenido y la evidencia de esta iteración se mantienen como registro.

Añadir `scripts/jupyter.sh` y la entrada `jupyter` de package.json que lo ejecuta mediante sh. Reenviar argumentos de Notebook para poder probarlo sin abrir navegador.

Revisar .gitignore para SQLite, su journal, .venv y .ipynb_checkpoints. La base ya está excluida de Git: no se elimina ni se abre durante la verificación del código. La instalación utiliza la versión de pnpm declarada por el proyecto.

Comprobar exclusiones, ausencia de un lanzador alternativo y hash de la base personal antes y después de las verificaciones.
