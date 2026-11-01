# AGENTS.md

El trabajo de git sigue [agents/git-workflow-agent.md](agents/git-workflow-agent.md) de esta carpeta.

Proyecto didáctico: base de datos de usuarios en SQLite, con `node:sqlite` y Node 24 (mínimo 22.5). Las reglas inamovibles están en [docs/CONSTITUTIONS.md](docs/CONSTITUTIONS.md); si algo de este archivo la contradice, manda la constitución.

Antes de tocar código se leen la constitución y la guía del tema:
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): capas, ficheros, operaciones y clientes.
- [docs/TREE.md](docs/TREE.md): el árbol de ficheros.
- [docs/DATABASE.md](docs/DATABASE.md): la tabla y el SQL.
- [docs/ERRORS.md](docs/ERRORS.md): los mensajes de error.
- [docs/STYLE.md](docs/STYLE.md): nombres, líneas y formato.

## Comandos
Los comandos de la app están en `clients/terminal/`, un `.txt` por operación. Se copian y se pegan en la terminal (PowerShell o Git Bash) desde la raíz del proyecto (`first-app/`). Los valores de ejemplo se cambian editando el comando. El flag `--no-warnings` oculta el aviso experimental de `node:sqlite`.
```
clients/terminal/createUser.txt
clients/terminal/findUserByEmail.txt
clients/terminal/listUsers.txt
clients/terminal/updateUser.txt       # '' = no cambiar ese campo
clients/terminal/deleteUser.txt
clients/terminal/classifyGender.txt   # necesita Ollama en marcha
```

Formato y revisión del JavaScript de la app, desde `first-app/`:
```
pnpm format   # Prettier sobre los .js de logic/, queries/ y db/, y eslint.config.js
pnpm lint     # ESLint con las reglas recomendadas
```

## Cómo verificar un cambio
1. Ejecutar los comandos reales de la sección anterior.
2. Probar también los casos de error: datos que faltan, email inválido o repetido, id inexistente o no numérico.
3. Probar con usuarios temporales y borrarlos al terminar. Comprobar con `clients/terminal/listUsers.txt` que los datos existentes siguen intactos.
4. Lanzar `pnpm format` y `pnpm lint`. `pnpm lint` no da errores.

## Límites
**Siempre**
- Antes del código, enseñar `spec.md`, `plan.md` y `tasks.md` y esperar el visto bueno. Después, ejecutar `tasks.md` entero y enseñar el resultado al final.
- Mantener el comportamiento actual salvo que se pida lo contrario.

**Preguntar antes**
- Lo que está en un `tasks.md` aprobado ya está pedido. Lo demás de esta lista necesita permiso.
- Crear, mover o borrar archivos o carpetas.
- Cambiar el esquema de la tabla o añadir una tabla.
- Añadir dependencias.
- Cualquier decisión que estas reglas no cubran.
- Editar `docs/CONSTITUTIONS.md`: solo se modifica si el usuario lo pide de forma explícita. Si el agente detecta una regla desactualizada, la propone pero no la cambia por su cuenta.

**Nunca**
- Saltarse las reglas de la base de datos de [docs/DATABASE.md](docs/DATABASE.md) y del principio 4 de la constitución.
- Refactorizar o "mejorar" código que no se ha pedido tocar.

## Paquetes
Al añadir un paquete de Node o cambiar su versión, se comprueba con Socket antes de aceptar el plan. La referencia está en [MCPS/socket-mcp/mcp.txt](MCPS/socket-mcp/mcp.txt).
- Entran el paquete, su versión exacta y sus dependencias hasta 3 capas. Las dependencias salen de `npm view`.
- Las puntuaciones salen de `depscore`. Una por debajo de 50 se escribe.
- Las alertas salen de `alerts`, con el `org_slug` de `organizations`. Una lista vacía es la lista de la organización: el resumen lo dice así y no escribe que esa versión no tenga alertas.
- Las campañas salen de `threat_feed`. Si responde `403 threat_feed_not_entitled`, el resumen dice que la cuenta no tiene esa fuente.
- Si una herramienta no contesta, el resumen dice el motivo. No deja el dato en blanco.
- El resumen va en el plan. Quien acepta el plan decide si acepta las alertas.
- Queda fuera: paquetes que no son de Node, un paquete cuya versión no cambia y más de 3 capas.
