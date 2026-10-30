## Qué ha cambiado

Automatiza el flujo Git de first-app para Windows, PowerShell, VS Code y Codex con agentes, skills, scripts y pausas humanas SDD. Conserva datos locales y bloqueos ante cambios versionados, colisiones y conflictos. La revisión documental usa `Closes #N`, verifica Development por separado y mantiene staging como base. La configuración personal del MCP queda fuera de Git.

## Cómo probarlo

1. Desde `staff/jimena-duran/first-app`, revisar `agents/git-workflow-agent.md`, `skills/link-pr-to-issue/SKILL.md` y la plantilla de PR: confirmar las dos pausas SDD, base staging y cierre separado del vínculo Development.
2. Desde la raíz, ejecutar `git diff --check` y comprobar que los enlaces locales de la documentación existen.
3. Comprobar en GitHub que #600 sigue en draft contra staging, contiene una única referencia de cierre a #588 y muestra su vínculo Development por separado. La issue debe seguir abierta.

## Validación realizada

- Revisión del Markdown UTF-8 real, enlaces locales y rutas de comandos; dos manifiestos modificados validados con `quick_validate.py`; `git diff --check` correcto.
- Comparación con el commit de Ventura `30149d6118c3f42362deff9ecec73bf92f14412f`: adaptación de Closes y MCP, conservando las pausas SDD y staging.
- Publicados `fa1ab9de747dafb99e429a40edbc3c9c1f4cefe1` y `babacfc1bc650b29b022c62cd3fb143e0d43e0d9`. `gh pr edit` aplicó la descripción y su relectura confirmó el cuerpo exacto. PR abierta en draft contra staging e issue abierta; Development confirmado en ambos sentidos entre #600 y #588. La rama predeterminada actual es staging: `Closes #588` produjo el vínculo, sin mutación manual.
- Historial, sin repetir suites por estos cambios documentales: 39 comprobaciones generales de Git, 23 de seguridad, 19 de archivos sin seguimiento más una puntual; lógica, 9 clientes, 9 notebooks, Ollama, formato y lint. La actualización mediante gh CLI valida la alternativa autorizada. El MCP falló con `403: Resource not accessible by integration` y su escritura sigue sin validar; el HTTP 200 histórico solo acredita inicialización.

Documentación SDD: [spec, plan, tareas y verificación](https://github.com/venturars/neoland-102026/tree/jimena-duran-291020262/staff/jimena-duran/first-app/docs/specs/automate-git-workflow).

## Issue

Closes #588
