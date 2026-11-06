# Spec · El flujo de git en ChromaDB

Issue #752.

Esta copia vive en `staff/sergio-cortes/ChromaDB/`. Ya tiene `agents/developer.md`, `agents/tester.md` y el ciclo de rondas. El flujo de git vive en `exercises/git-workflow-agent-template`. Hay que traerlo a esta carpeta. El orquestador parte del texto de esa plantilla. El de `exercises/ChromaDB` habla de `concept_developer` y `code_developer`, y esta copia no los tiene.

## Qué hay que hacer

Entra el flujo de la plantilla: los agentes de git, las skills, los tools, las plantillas por tipo y `MCPS/github-mcp-server/mcp.txt`. `developer.md` y `tester.md` se quedan. `skills/python-docs/` se queda.

Los scripts se lanzan desde la raíz del repositorio git. En las siete skills de terminal, cada `./tools/` pasa a `staff/sergio-cortes/ChromaDB/tools/`. El resto de cada skill es el de la plantilla.

El humano solo interviene al crear la issue. Crear la issue basta para arrancar. Desde esa issue se implementa con `spec.md`, `plan.md`, `tasks.md` y las rondas de `developer` y `tester`. La rama sale de `staging`. Al terminar, la pull request queda abierta y lista para revisión, asignada a las dos personas que nombre la issue. Si la issue no nombra a esas dos personas, el ciclo se para antes de pedir la revisión. La contraseña solo corta el ciclo si, al implementar, aparece una llave, como el fallo de la ronda 9.

`agents/git-workflow-agent.md` de esta carpeta describe ese mismo ciclo. Los nombres de quien revisa salen de la issue. No se inventan.

Las rondas siguen: el developer de las rondas 2 y 3, 5 y 6, y 8 y 9 es el mismo; el tester no se reanuda; el tester solo entra si la task toca `src/core` o `src/sdk`; a la ronda 9 fallida se escribe el reporte y otra pasada solo arranca con la contraseña.

Al pasar las comprobaciones se borra `tasks.md`. `spec.md` y `plan.md` se quedan en `docs/specs/adapt-git-workflow/`.

## Comprobaciones

1. `staff/sergio-cortes/ChromaDB` tiene los agentes, las skills, los tools, las plantillas por tipo y `MCPS/github-mcp-server/mcp.txt` de la plantilla. `agents/developer.md` y `agents/tester.md` siguen. `skills/python-docs/SKILL.md` sigue.
2. Las siete skills que lanzan un script apuntan a `staff/sergio-cortes/ChromaDB/tools/` y no a `./tools/`. El resto de cada skill es el de la plantilla.
3. `AGENTS.md` y `agents/git-workflow-agent.md` describen el ciclo de arriba, con `developer` y `tester`. En `AGENTS.md`, «Ciclo de un cambio» remite a `agents/git-workflow-agent.md`. El humano solo crea la issue y eso basta para arrancar. Desde ella se escriben spec, plan y tasks y se lanza la ronda 1. La rama sale de `staging`. Al terminar, la pull request queda abierta para las dos personas de la issue. Si no las nombra, se para antes de la revisión. La contraseña solo corta el ciclo si al implementar aparece una llave, como el fallo de la ronda 9. «Proyecto», «Comandos» y «Al terminar una tarea» siguen como están. El orquestador, después de la issue, sigue sin esperar: adelantar `staging`, rama desde `staging`, commit vacío, push, pull request en draft, enlace con la issue, la implementación, commit del trozo y push, y la revisión solo si la issue nombra a dos personas. Esos dos ficheros no nombran `concept_developer`, `code_developer`, `code_tester` ni `concept_tester`.
4. `exercises/git-workflow-agent-template` no cambia. No cambian `README.md`, `docs/CONSTITUTION.md`, `scripts/` ni `src/`.
5. Desde la raíz del repositorio, `staff/sergio-cortes/ChromaDB/tools/check-status.sh` termina con código 0.

## Fuera de alcance

- El RAG, los scripts de consulta, el índice y el CRUD de usuarios.
- `docs/CONSTITUTION.md`, `README.md`, `scripts/` y `src/`.
- Una pareja fija de revisores.
- Pedir la contraseña para arrancar.
- Merge a `staging`.
- El orquestador de `exercises/ChromaDB`.
- La plantilla `exercises/git-workflow-agent-template`.
