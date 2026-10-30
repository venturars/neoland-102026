## Qué ha cambiado

Automatiza el flujo Git de first-app para Windows, PowerShell, VS Code y Codex con agentes, skills, scripts y pausas humanas SDD. Conserva datos locales y bloqueos ante cambios versionados, colisiones y conflictos. La revisión documental usa `Closes #N`, verifica Development por separado y mantiene staging como base. La configuración personal del MCP queda fuera de Git.

## Cómo probarlo

1. Desde `staff/jimena-duran/first-app`, revisar `agents/git-workflow-agent.md`, `skills/link-pr-to-issue/SKILL.md` y la plantilla de PR: confirmar las dos pausas SDD, base staging y cierre separado del vínculo Development.
2. Desde la raíz, ejecutar `git diff --check` y comprobar que los enlaces locales de la documentación existen.
3. Comprobar en GitHub que #600 sigue en draft contra staging, contiene una única referencia de cierre a #588 y muestra su vínculo Development por separado. La issue debe seguir abierta.

## Validación realizada

- Revisión del Markdown UTF-8 real, enlaces locales y rutas de comandos; dos manifiestos modificados validados con `quick_validate.py`; `git diff --check` correcto.
- Comparación con el commit de Ventura `30149d6118c3f42362deff9ecec73bf92f14412f`: adaptación de Closes y MCP, conservando las pausas SDD y staging.
- Lectura autenticada con identidad `jiji-mena`; PR abierta en draft contra staging e issue abierta. Development se comprueba y establece por separado después de esta actualización.
- Historial, sin repetir suites por estos cambios documentales: 39 comprobaciones generales de Git, 23 de seguridad, 19 de archivos sin seguimiento más una puntual; lógica, 9 clientes, 9 notebooks, Ollama, formato y lint. HTTP 200 de inicialización MCP solo acredita conexión; la actualización real mediante gh CLI comprueba la escritura alternativa tras el 403 del MCP.

Documentación SDD: [spec, plan, tareas y verificación](https://github.com/venturars/neoland-102026/tree/jimena-duran-291020262/staff/jimena-duran/first-app/docs/specs/automate-git-workflow).

## Issue

Closes #588
