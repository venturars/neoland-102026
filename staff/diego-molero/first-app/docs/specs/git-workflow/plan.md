# Plan del flujo de trabajo de Git

Issue: #663. Fecha: 2026-10-30. Autorizado anticipadamente por Diego; no se atribuye lectura o aprobación individual de estos archivos.

## Archivos y responsabilidades

Copiar `exercises/git-workflow-agent-template/{agents,skills,tools,templates,MCPS/github-mcp-server}` dentro de esta aplicación. Son siete agentes, quince procedimientos, siete scripts, dos plantillas y una referencia de acceso. No se modifica la fuente compartida.

- `agents/git-workflow-agent.md` coordina momentos y delegación real. Los roles se ejecutan con la herramienta del cliente: Task/generalPurpose cuando exista en Cursor o la herramienta de subagentes disponible en Codex, heredando por defecto el modelo. Se pasan instrucciones, alcance y resultado esperado; se espera el resultado. Si la herramienta no existe, se comunica y se acuerda la ejecución por el principal, sin fingir delegación.
- Los archivos de `skills/` se leen por las referencias de los agentes. No se promete autodescubrimiento ni se crean `.agents/` o registros globales.
- Las rutas de scripts en las skills serán `staff/diego-molero/first-app/tools/...`, lanzadas desde la raíz del repositorio. Los scripts reciben datos por argumentos separados y los mensajes se preparan sin interpolación insegura.
- Las ramas nuevas usan `codex/NUMERO-TIPO-DESCRIPCION`, salvo un nombre expresamente elegido por la persona. Los scripts de esta copia generan ese nombre por defecto.
- La referencia GitHub explica identidad, lectura previa, MCP y alternativa `gh` con el mismo repositorio y cuenta. Un formulario abierto o una respuesta vacía no acredita una escritura; se consulta el estado antes de reintentar. No se editan tokens ni configuración personal. Los cuerpos multilínea se pasan a `gh` con `--body-file`.
- El enlazado conserva `Closes #N`, explica la condición de la rama predeterminada y no cierra la issue directamente. La ausencia de acceso al enlace Development se comunica sin inventarlo.

La integración de referencias y fases en AGENTS, constitución, arquitectura y árbol la realiza el principal del trabajo. Esta implementación no modifica esos archivos compartidos.

## Riesgos concretos de los scripts fuente

- El estado de un repositorio sin commits falla al consultar HEAD antes de la comprobación existente: consultar primero el nombre simbólico de rama y conservar la salida sin commits.
- Los argumentos de `git add` interpretan patrones aunque se use `--`: usar rutas literales y rechazar directorios para que el commit solo incluya los archivos nombrados. Mantener el índice temporal y el trabajo preparado ajeno.
- Verificar una rama remota requiere refrescar las referencias de origin antes de decidir si existe. Conservar siempre la base staging o la base explícita; no inventar otra rama si la solicitada existe.
- Antes de cambiar de rama, rechazar cambios locales pendientes que podrían trasladarse a otro contexto. Se puede permanecer en una rama de trabajo ya actual sin cambiar su contenido.
- El push debe exigir una rama de trabajo: rechazar HEAD separado y las ramas main/staging, además de los argumentos de force que ya rechaza la fuente.

Conservar el resto de operaciones pequeñas de la plantilla: fast-forward de staging, ningún merge de PR, commit vacío sin archivos del índice real y ausencia de force push. No introducir un framework ni helpers genéricos.

## Comprobaciones previstas

1. Revisar sintaxis de los siete scripts con el Bash de Git for Windows disponible; validar UTF-8, rutas, enlaces locales y ausencia de referencias a otra carpeta staff, autodescubrimiento o herramientas inexistentes.
2. Crear un directorio nuevo bajo `.venv/` de esta aplicación y comprobar su ruta absoluta antes de cualquier operación. Allí se crean repositorios Git independientes y un remoto bare local. Cada comando mutador de prueba utiliza explícitamente uno de esos directorios; nunca el checkout real.
3. Ejercitar estado sin commits, ramas nuevas/reutilizadas, rama desde otra base, apertura vacía con trabajo ajeno preparado, commit con archivo con espacios y ruta literal, rechazo de directorios, conservación del índice ajeno, push y upstream, rechazo de force/protegidas y actualización fast-forward sin cambiar rama. Provocar divergencia para comprobar rechazo sin mover staging.
4. Usar únicamente protocolo local en los remotos de las pruebas. No crear issues ni PR reales para verificar la documentación. Diferenciar CLI/MCP documentados de operaciones remotas realmente observadas por el principal.
5. Registrar comandos y resultados en tasks, sin atribuirlos a Diego. El directorio temporal queda ignorado; no se elimina recursivamente un destino calculado ni se añaden herramientas o paquetes.

## Constitución y alcance

Se conservan contratos de usuarios, una operación por fichero, datos ordinarios y errores Error; ninguna parte de esta tarea toca esos contratos. Las bases y credenciales siguen fuera de Git. Se escriben los documentos antes de cambiar el comportamiento de automatización; la autorización anticipada permite continuar sin nuevas paradas, conservando el historial. No se añaden paquetes, capas de aplicación ni suite de tests. Código, comentarios y textos en UTF-8; comentarios y documentación en español.

## Iteración del 3 de noviembre de 2026 · Issue #774

Autorización explícita de Diego para completar el plan, implementación, comprobación y entrega. Se parte del staging que ya integra la PR #671.

1. Incorporar las doce plantillas de exercises/git-workflow-agent-template/templates y adaptar solo su comentario de rama al prefijo codex/.
2. Eliminar las dos plantillas básicas y concretar la selección por tipo en create-issue, create-pr y sus skills. Mantener las comprobaciones previas, fallback gh y delegación real; link-pr-to-issue conserva su responsabilidad y referencia genérica a la plantilla elegida.
3. Actualizar TREE y ARCHITECTURE. Los siete scripts y el resto del flujo no se reemplazan por versiones de la fuente.
4. Comparar las doce plantillas con la fuente tras normalizar únicamente el prefijo de rama; buscar referencias obsoletas, comprobar UTF-8, enlaces y git diff --check. Cotejar scripts contra staging.
5. Ejecutar el comprobador local existente con un destino temporal nuevo bajo .venv: siete sintaxis y 14 recorridos en repositorios con remoto bare local. Registrar límites de plataforma y resultados en tasks, sin añadir suite ni dependencias.
6. Entregar en codex/774-chore-update-git-templates mediante una PR en borrador contra staging, asignada a la cuenta autenticada y con Closes #774 añadido por el orquestador. No asignar revisores ni fusionar.

La constitución se cumple: cambio exclusivo de automatización y documentación, UTF-8, comentarios explicativos, datos privados fuera de Git y conservación de contratos y dependencias.

## Iteración del 4 de noviembre de 2026 · Issue #855

Comparar agentes y skills de `exercises/git-workflow-agent-template` en el `staging` actualizado. Incorporar la validación de una issue lista y la regla explícita de crear rama y PR en borrador antes de cambiar un proyecto. Conservar las diferencias locales justificadas: delegación real, autorizaciones ya dadas, comentarios y cuerpo en español, títulos cortos en inglés, selección de las doce plantillas, alternativa `gh`, ausencia de cambios automáticos de credenciales y scripts seguros. Revisar sintaxis, referencias, UTF-8 y recorridos aislados en repositorios temporales; registrar resultados en tareas.
