# AGENTS.md

El trabajo de git sigue [agents/git-workflow-agent.md](agents/git-workflow-agent.md) de esta carpeta.

Proyecto didáctico: base de datos de usuarios en SQLite, con `node:sqlite`. Las reglas inamovibles están en [docs/CONSTITUTIONS.md](docs/CONSTITUTIONS.md); si algo de este archivo la contradice, manda la constitución.

## Stack
- Node 24 (mínimo 22.5), módulos ESM (`import`/`export`), dependencias en `package.json`, con versión fija e instaladas con pnpm.
- Base de datos: `db/users.sqlite`, tabla `users` (`id`, `name`, `email` único, `created_at`, `updated_at`).

## Estructura
```
clients/terminal/   .txt con los comandos que el usuario ejecuta a mano
logic/      una función por operación: valida datos y llama a queries
queries/    todo el SQL (users.js); no valida nada
db/         connection.js (conexión y creación de la tabla) y users.sqlite
docs/       CONSTITUTIONS.md
```
Flujo: `terminal → logic → queries → db/connection.js`.

## Comandos
Están en `clients/terminal/`, un `.txt` por operación. Se copian y se pegan en la terminal (PowerShell o Git Bash) desde la raíz del proyecto (`first-app/`). Cada uno importa la función de `logic/`, la llama con valores de ejemplo y muestra el resultado o `Error: <mensaje>`. Los valores se cambian editando el comando. El flag `--no-warnings` oculta el aviso experimental de `node:sqlite`.
```
clients/terminal/createUser.txt
clients/terminal/findUserByEmail.txt
clients/terminal/listUsers.txt
clients/terminal/updateUser.txt       # '' = no cambiar ese campo
clients/terminal/deleteUser.txt
clients/terminal/classifyGender.txt   # necesita Ollama en marcha
```
Forma de cada comando: `-e "` en la primera línea, el código sangrado debajo y `"` sola en la última. Dentro del código, solo comillas simples y sin `${...}`.

Formato y revisión del JavaScript de la app, desde `first-app/`:
```
pnpm format   # Prettier sobre los .js de logic/, queries/ y db/, y eslint.config.js
pnpm lint     # ESLint con las reglas recomendadas
```

## Estilo
- Nombres (archivos, funciones, variables) y mensajes de error/salida: en **inglés**.
- Comentarios: en **español**, solo donde haya algo no evidente, más un comentario inicial por archivo con su responsabilidad.
- Código explícito y legible para un junior: sin expresiones condensadas ni trucos de sintaxis.
- **Plantilla a copiar** para cualquier operación nueva de `logic`: [logic/createUser.js](logic/createUser.js) (comentario inicial, función exportada, errores con `throw new Error`). `logic/` no lee `process.argv`, no imprime y no llama a `process.exit`: eso lo hace el `.txt` de `clients/terminal/`, con [clients/terminal/createUser.txt](clients/terminal/createUser.txt) como plantilla.

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
- Escribir SQL fuera de `queries/`.
- Borrar, reiniciar o sobrescribir `db/users.sqlite`, ni dejar usuarios de prueba dentro.
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
