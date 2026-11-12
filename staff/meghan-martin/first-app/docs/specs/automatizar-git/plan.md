# Plan — automatizar git en el Mac

Cumple `docs/specs/automatizar-git/spec.md`. Los comandos son de shell, para zsh en el Mac.

## Tocar

- `agents/`: una nota por momento, y `agents/git-workflow-agent.md` para elegir el momento. Si este chat no puede llamar a otro agente, lo dice y para. No finge que lo llamó.
- `skills/`: un paso de git por carpeta. Se leen por su ruta.
- `tools/`: scripts de shell. Encuentran la raíz con git. Valen lanzados desde la raíz del repositorio o desde `first-app`.
- `templates/`: la issue y la pull request. Título en inglés. El enlace es `Related to #N`. No cierra la issue.
- Al empezar, la pull request pide revisión a Miguel (`mglnglxx`) y a Jimena (`jiji-mena`) y sale de draft.
- `MCPS/`: la dirección del servidor de GitHub.
- `docs/GIT-AUTOMATION.md`: cómo se lanza en el Mac.
- `docs/TREE.md` y `docs/ARCHITECTURE.md`: una línea por las carpetas nuevas.
- `AGENTS.md`: al principio, el trabajo de git sigue `agents/git-workflow-agent.md`. Se quedan la spec antes del código, y `npm run format` con `npm run lint`.

## No tocar

- `logic/`, `queries/`, `db/`, `clients/` y `package.json`.
- No hay paquete de Node nuevo. No hace falta Socket.
- Nada de PowerShell, VS Code ni Codex.

## Seguridad de los scripts

- No hay commit ni push en `main` ni en `staging`.
- `staging` solo se adelanta en fast-forward. La rama actual se queda.
- Una rama nueva desde `staging` no queda siguiendo a `staging`.
- El commit solo incluye los ficheros nombrados.
- No hay stash, `reset --hard`, `clean` ni force push.
- Si hay un merge a medias, no se crea la rama. Los ficheros sin seguimiento se quedan.
- Si un hook de git de verdad (no un `.sample`) podría cambiar el commit, se para.
- Al cambiar de rama, un fichero ignorado que la otra rama tiene se conserva.
