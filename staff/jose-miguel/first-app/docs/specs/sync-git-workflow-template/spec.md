# Sincronizar flujo git con la plantilla del curso

Issue: #858.

Quien construye esta app con IA debe seguir el mismo orquestador y herramientas que `exercises/git-workflow-agent-template` en el commit `665b92a5` de `staging`. Los scripts se invocan desde la raíz del monorepo con rutas `staff/jose-miguel/first-app/tools/`.

## Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien construye con IA** | Reglas actuales del curso (rama + PR draft antes de cambiar código; issue clara antes de crearla). |
| **Quien revisa** | Ver que la copia local no se quedó atrás de la plantilla compartida. |

## Historias de usuario

- **HU-01**: Como quien construye, quiero que `agents/git-workflow-agent.md` coincida con la plantilla, para aplicar las mismas reglas de momento y validación.
- **HU-02**: Como quien construye, quiero que las skills sigan apuntando a `staff/jose-miguel/first-app/tools/`, para ejecutar los scripts desde la raíz del repositorio.
- **HU-03**: Como quien clona, quiero que el código de la app no cambie en este mantenimiento.

## Criterios de aceptación

- **CA-01**: **Dado** la plantilla en `665b92a5`, **cuando** se compara `agents/git-workflow-agent.md`, **entonces** el texto es idéntico al de la plantilla.
- **CA-02**: **Dado** los siete scripts en `tools/`, **cuando** se comparan con la plantilla, **entonces** el contenido es idéntico.
- **CA-03**: **Dado** las skills que llaman a `tools/`, **cuando** se leen, **entonces** el comando usa `staff/jose-miguel/first-app/tools/` y el resto coincide con la plantilla.
- **CA-04**: **Dado** `templates/`, **cuando** se revisa el diff de esta tarea, **entonces** no cambia.
- **CA-05**: **Dado** `src/`, `package.json` y `scripts/` de arranque, **cuando** se revisa el diff, **entonces** no cambian.
- **CA-06**: **Dado** `MCPS/socket-mcp/`, **cuando** se revisa el diff, **entonces** sigue intacto.

## Fuera de alcance

- Editar `exercises/git-workflow-agent-template`.
- Añadir `tools/tests/` de otras apps.
- Reescribir specs históricas (`adapt-git-workflow`, etc.).
