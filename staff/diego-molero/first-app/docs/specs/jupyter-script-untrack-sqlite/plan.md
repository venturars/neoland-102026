# Plan — script de jupyter y archivos locales

Añadir `scripts/jupyter.sh` y la entrada `jupyter` de package.json que lo ejecuta mediante sh. Reenviar argumentos de Notebook para poder probarlo sin abrir navegador.

Revisar .gitignore para SQLite, su journal, .venv y .ipynb_checkpoints. La base ya está excluida de Git: no se elimina ni se abre durante la verificación del código. La instalación utiliza la versión de pnpm declarada por el proyecto.

Comprobar exclusiones, ausencia de un lanzador alternativo y hash de la base personal antes y después de las verificaciones.
