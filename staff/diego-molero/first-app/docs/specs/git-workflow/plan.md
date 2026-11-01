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
