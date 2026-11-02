# Arquitectura

La aplicación usa Node.js con módulos ES (`"type": "module"`) y una base SQLite gestionada por `node:sqlite`.

Las cuatro capas viven bajo `src/`. `src/db/` solo abre la base; su conexión conserva `users.sqlite` junto al módulo y fuera de Git. El SQL permanece en `src/queries/queries/`; `src/queries/users.js` lo lee y lo ejecuta, sin reglas de negocio. Las decisiones de negocio viven en `src/logic/`. Los clientes de `src/clients/terminal/` invocan esa capa desde first-app y muestran su resultado; los notebooks están en `src/clients/jupyter/`.

`src/logic/` es el núcleo estable de la aplicación. No se reemplaza por adaptadores, plugins o implementaciones intercambiables, y sus reglas no se trasladan a `src/queries/` ni a `src/clients/`. Cada operación tiene su propio archivo; una operación nueva no modifica otro archivo para reutilizarlo.

Los contratos de funciones siguen [STYLE.md](STYLE.md); las salidas y los errores se definen en [ERRORS.md](ERRORS.md).

`eslint.config.js` configura la revisión del JavaScript con las reglas
recomendadas de ESLint y excluye `.venv` y `node_modules`.

## Automatización del trabajo

La automatización de Git vive en agents/, skills/, tools/, templates/ y MCPS/, separada de src/ y de los datos de usuarios. Los siete scripts Bash de tools/ conservan el código original de la fuente fijada; no se mantienen herramientas ni ensayos PowerShell propios.

Los agentes y skills mantienen su estructura original. Solo se adaptan las siete rutas de comandos para ejecutarlos desde la raíz Git y se añade al orquestador la referencia al SDD local. AGENTS.md conserva las revisiones separadas de spec/plan y tareas antes de implementar; ese SDD prevalece sobre la continuación automática del template.

Las doce plantillas originales son la fuente editorial de issues y PR. MCPS contiene la referencia original, sin ejecutar su configuración. La guía [GIT-AUTOMATION.md](GIT-AUTOMATION.md) explica uso con Git Bash, MCP y alternativa gh, así como los límites de esta copia. Los ensayos autorizados usan repositorios desechables con remoto local y evidencia separada de los resultados históricos.
