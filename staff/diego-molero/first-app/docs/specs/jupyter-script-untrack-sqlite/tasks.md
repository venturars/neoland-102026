# Tareas — script de jupyter y archivos locales

- [x] Configurar el script único y el comando de arranque.
- [x] Excluir el entorno, las bases y los checkpoints locales.
- [x] Verificar que no se versionan datos ni resultados de notebooks.

## Comprobación

El 27 de octubre de 2026 se comprobó el arranque mediante scripts/jupyter.sh y package.json. La base personal conservó su hash. Git excluye la base, sus auxiliares, .venv y checkpoints; los nueve notebooks no contienen resultados guardados. .gitattributes conserva LF en el script de shell.
