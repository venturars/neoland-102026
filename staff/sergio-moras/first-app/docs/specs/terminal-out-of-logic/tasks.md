# Tasks: Sacar la terminal de `logic/`

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden**.

## Reglas de ejecución
- Una tarea cada vez. Al terminar cada una se enseña el resultado y se espera el sí antes de seguir.
- No se tocan `queries/` ni `db/`.
- Los usuarios de prueba usan `tmp-638-<n>@example.com` y se borran siempre al terminar. Nunca se borra ni se reinicia `db/users.sqlite`.
- Si el plan no cubre un caso, no se improvisa: se para y se pregunta.

## T1. Foto inicial
- [x] Guardar la salida de `node --no-warnings logic/listUsers.js`.
- [x] Con los comandos actuales y un usuario temporal, guardar la salida de crear, buscar, actualizar, borrar y clasificar, y de cada caso de error de la spec.

## T2. `listUsers` y `findUserByEmail`
- [x] Quitar el bloque de terminal de `logic/listUsers.js` y `logic/findUserByEmail.js`.
- [x] Reescribir `terminal/listUsers.txt` y `terminal/findUserByEmail.txt` con la forma del plan: comando en varias líneas, código sangrado y solo comillas simples dentro.
- [x] Probar en PowerShell y en Git Bash y comparar con la foto de T1.

## T3. `createUser`, `updateUser` y `deleteUser`
- [x] Quitar el bloque de terminal de los tres archivos de `logic/`.
- [x] Reescribir sus tres `.txt` con la forma del plan.
- [x] Probar en PowerShell y en Git Bash con un usuario temporal, incluidos los casos de error, y comparar con la foto de T1.

## T4. `classifyGender`
- [x] Quitar el bloque de terminal de `logic/classifyGender.js`.
- [x] Reescribir `terminal/classifyGender.txt` con la forma del plan.
- [x] Probar en PowerShell y en Git Bash con Ollama en marcha, y con Ollama apagado.

## T5. Importar sin efectos
- [x] Importar cada función desde un `node -e` que solo hace `import` y comprobar que no imprime nada y termina con código 0.

## T6. `AGENTS.md` y constitución
- [x] Actualizar en `AGENTS.md` la sección Comandos y la plantilla.
- [x] Con el permiso del usuario, cambiar la regla de §2 de `docs/CONSTITUTIONS.md`, la versión y la fecha.

## T7. Comprobación final
- [x] `listUsers` coincide con la foto inicial de T1.
- [x] No queda ningún usuario `tmp-638-*`.
- [x] Ningún archivo de `logic/` contiene `process.argv`, `console.` ni `process.exit`.
- [x] Enseñar un resumen con los archivos cambiados y lo probado.
