# Git en el Mac

Los pasos automáticos de first-app viven en esta carpeta. La terminal es la del Mac. Cada momento está en `agents/`. El que elige el momento es `agents/git-workflow-agent.md`.

Los scripts están en `tools/`. Se lanzan desde la raíz del repositorio:

`staff/meghan-martin/first-app/tools/check-status.sh`

También desde `first-app`:

`tools/check-status.sh`

El script busca la raíz del repositorio. No importa en cuál de los dos sitios estés.

La rama sale de `staging` y se llama `número-tipo-descripcion`. La pull request se abre en draft contra `staging`. Enlazar la issue escribe `Related to #N`. Ese enlace no cierra la issue.

No se hace commit ni push en `main` ni en `staging`. No se fuerza el push.
