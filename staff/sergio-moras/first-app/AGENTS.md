# AGENTS.md

El trabajo de git sigue [agents/git-workflow-agent.md](agents/git-workflow-agent.md) de esta carpeta.

Proyecto didáctico: base de datos de usuarios en SQLite, con `node:sqlite`. Las reglas inamovibles están en [docs/CONSTITUTIONS.md](docs/CONSTITUTIONS.md); si algo de este archivo la contradice, manda la constitución.

## Stack
- Node 24 (mínimo 22.5), módulos ESM (`import`/`export`), sin dependencias externas.
- Base de datos: `db/users.sqlite`, tabla `users` (`id`, `name`, `email` único, `created_at`, `updated_at`).

## Estructura
```
terminal/   .txt con los comandos que el usuario ejecuta a mano
logic/      una función por operación: valida datos y llama a queries
queries/    todo el SQL (users.js); no valida nada
db/         connection.js (conexión y creación de la tabla) y users.sqlite
docs/       CONSTITUTIONS.md
```
Flujo: `terminal → logic → queries → db/connection.js`.

## Comandos
Se ejecutan desde la raíz del proyecto (`first-app/`). El flag `--no-warnings` oculta el aviso experimental de `node:sqlite`.
```
node --no-warnings logic/createUser.js "<name>" "<email>"
node --no-warnings logic/findUserByEmail.js "<email>"
node --no-warnings logic/listUsers.js
node --no-warnings logic/updateUser.js <id> "<name>" "<email>"   # "" = no cambiar ese campo
node --no-warnings logic/deleteUser.js <id>
```

## Estilo
- Nombres (archivos, funciones, variables) y mensajes de error/salida: en **inglés**.
- Comentarios: en **español**, solo donde haya algo no evidente, más un comentario inicial por archivo con su responsabilidad.
- Código explícito y legible para un junior: sin expresiones condensadas ni trucos de sintaxis.
- **Plantilla a copiar** para cualquier operación nueva de `logic`: [logic/createUser.js](logic/createUser.js) (comentario inicial, función exportada, bloque `isRunFromTerminal`, errores con `throw new Error`, `process.exit(1)` en la terminal).

## Cómo verificar un cambio
1. Ejecutar los comandos reales de la sección anterior.
2. Probar también los casos de error: datos que faltan, email inválido o repetido, id inexistente o no numérico.
3. Probar con usuarios temporales y borrarlos al terminar. Comprobar con `listUsers.js` que los datos existentes siguen intactos.

## Límites
**Siempre**
- Hacer cambios pequeños, de un archivo cada vez, y enseñar el resultado antes de seguir.
- Mantener el comportamiento actual salvo que se pida lo contrario.

**Preguntar antes**
- Crear, mover o borrar archivos o carpetas.
- Cambiar el esquema de la tabla o añadir una tabla.
- Añadir dependencias.
- Cualquier decisión que estas reglas no cubran.
- Editar `docs/CONSTITUTIONS.md`: solo se modifica si el usuario lo pide de forma explícita. Si el agente detecta una regla desactualizada, la propone pero no la cambia por su cuenta.

**Nunca**
- Escribir SQL fuera de `queries/`.
- Borrar, reiniciar o sobrescribir `db/users.sqlite`, ni dejar usuarios de prueba dentro.
- Refactorizar o "mejorar" código que no se ha pedido tocar.
