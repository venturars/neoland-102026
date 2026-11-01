# Spec · El flujo de git en ChromaDB

Issue #675.

ChromaDB ya tiene `agents/developer.md`, `agents/tester.md` y el ciclo de rondas. El flujo de git vive en `exercises/git-workflow-agent-template`. Hay que traerlo a esta carpeta y dejar el ciclo de un cambio como lo dice la issue.

## Qué hay que hacer

Entra el flujo entero de la plantilla: `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`. `developer` y `tester` se quedan. `skills/python-docs/` se queda.

Los scripts se lanzan desde la raíz del repositorio git. En las skills, cada `./tools/` pasa a `exercises/ChromaDB/tools/`.

El humano solo interviene al crear la issue. Crear la issue basta para arrancar. Desde esa issue se implementa con `spec.md`, `plan.md`, `tasks.md` y las rondas de developer y tester. La rama sale de `staging`. Al terminar, la pull request queda abierta y lista para revisión, asignada a las dos personas que nombre la issue. Si la issue no nombra a esas dos personas, el ciclo se para antes de pedir la revisión. La contraseña solo corta el ciclo si, al implementar, aparece una llave, como el fallo de la ronda 9.

`agents/git-workflow-agent.md` de esta carpeta describe ese mismo ciclo. No se queda en el draft a la espera de que alguien nombre revisores. Los nombres salen de la issue. No se inventan.

Las rondas siguen: el developer de las rondas 2 y 3, 5 y 6, y 8 y 9 es el mismo; el tester no se reanuda; el tester solo entra si la task toca `src/core` o `src/sdk`; a la ronda 9 fallida se escribe el reporte y otra pasada solo arranca con la contraseña.

## Comprobaciones

1. `exercises/ChromaDB` tiene los agentes, las skills, los tools, las plantillas y `MCPS/github-mcp-server/mcp.txt` de la plantilla. `agents/developer.md` y `agents/tester.md` siguen. `skills/python-docs/SKILL.md` sigue.
2. Las skills que lanzan un script apuntan a `exercises/ChromaDB/tools/` y no a `./tools/`. El resto de cada skill es el de la plantilla.
3. `AGENTS.md` dice que el humano solo crea la issue; que crear la issue basta para arrancar; que a partir de ella se implementa con spec, plan, tasks y las rondas; que la pull request queda abierta para las dos personas nombradas en la issue; que si no las nombra se para antes de pedir la revisión; y que la contraseña solo corta el ciclo si al implementar aparece una llave, como el fallo de la ronda 9.
4. `agents/git-workflow-agent.md` describe ese mismo ciclo. Después de la issue sigue sin esperar: adelantar `staging`, rama desde `staging`, commit vacío, push, pull request en draft, enlace con la issue, implementación, y la revisión solo si la issue nombra a dos personas. Si no las nombra, se para antes de pedir la revisión.
5. No cambian `README.md`, `docs/CONSTITUTION.md`, `scripts/` ni `src/`.

## Fuera de alcance

- El RAG, los scripts de consulta, el índice y el CRUD de usuarios.
- `docs/CONSTITUTION.md` y `README.md`.
- Una pareja fija de revisores.
- Pedir la contraseña para arrancar.
