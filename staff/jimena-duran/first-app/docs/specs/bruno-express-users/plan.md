Issue: #1101

# Plan de reutilización de Bruno para Express

## Base e inventario

La rama parte de `staging`, actualizado al commit
`2e004f3c5c9bb21acf765c36d7ba6a9015ad20fb`. El trabajo de Swagger se conserva
en su rama y checkout separados.

La implementación existente que se revisa es
[`src/clients/http/app.js`](../../../src/clients/http/app.js).
Se reutilizan, sin duplicarlos ni trasladarlos, estos materiales:

- [Colección Bruno](../express-rest-client/bruno/bruno.json).
- [Guía Windows](../express-rest-client/bruno.md).
- [Evidencia anterior](../express-rest-client/verification.md).

La colección contiene 25 peticiones en `01-sql-online` y cinco en
`02-sql-offline`; cada carpeta incluye además su `folder.bru` de metadatos,
que no cuenta como petición. La guía ya prepara una copia temporal de ensayo
sin copiar SQLite personal y reutiliza las dependencias instaladas.

## Contratos que se conservan

Express escucha en `http://127.0.0.1:3001` y delega en las funciones de
`src/logic/`, sin incorporar validaciones ni consultas nuevas:

| Ruta                | Llamada existente             | Respuesta correcta |
| ------------------- | ----------------------------- | ------------------ |
| `POST /users`       | `createUser({ name, email })` | 201, usuario       |
| `GET /users`        | `listUsers()`                 | 200, lista         |
| `GET /users/:id`    | `findUserById(id)`            | 200, usuario       |
| `PATCH /users/:id`  | `updateUser(id, changes)`     | 200, usuario       |
| `DELETE /users/:id` | `deleteUser(id)`              | 204, cuerpo vacío  |

Los usuarios incluyen `id`, `name`, `email`, `createdAt` y `updatedAt`.
PATCH solo incorpora a `changes` los campos enviados. No hay firma nueva
ni SQL nuevo: se conservan las consultas y sus parámetros nombrados.

El JSON de error conserva `{ message }`. Nombre vacío y email inválido
devuelven 400 con `Name is empty` y `Email is invalid`; email duplicado,
409 con `Email is already used`; usuario ausente, 404 con `User not found`.
Los fallos de cada operación devuelven 500 con `Could not create the user`,
`Could not list the users`, `Could not find the user`,
`Could not update the user` o `Could not delete the user`.
Crear sin nombre conserva el 500 actual. Una ruta desconocida devuelve
404 vacío. No se normalizan ni amplían estos contratos.

## Verificación prevista después de las aprobaciones

Contrastar los tests y variables de las 30 peticiones con esos contratos y
seguir la guía Windows en una copia temporal con datos ficticios. El servidor
SQL original permanece en 3000; solo las copias de servidor y queries del
ensayo usan 43100. Express de ensayo conserva 3001. Comprobar primero que
los puertos del ensayo estén libres; no detener procesos personales.

Ejecutar desde el runner de Bruno en VS Code las 25 peticiones online y,
tras detener únicamente el SQL de ensayo, las cinco offline. Registrar
resultados reales por separado de la evidencia histórica y de cualquier
ensayo adicional HTTP. No instalar Bruno CLI ni paquetes de Node.

Si la revisión y ejecución encuentran una carencia concreta, proponer solo
la corrección de la colección o la guía existente y someter ese delta a las
etapas de aprobación. No editar `src/`, manifiesto, lockfile ni los demás
clientes. Una adición o eliminación de archivos en la futura implementación
deberá incluir el impacto en [TREE.md](../../TREE.md) y
[ARCHITECTURE.md](../../ARCHITECTURE.md).

## Comprobación de esta etapa

La revisión actual es estática: se confirmó la API en `staging`, la existencia
de la colección, sus 25 y cinco peticiones y las instrucciones de aislamiento
de la guía. La evidencia anterior declara 30 peticiones pasadas; no se
presenta como una ejecución nueva de esta rama.

Esta entrega solo añade `spec.md` y `plan.md` en esta carpeta. Se comprobarán
sus enlaces relativos y su formato sin ejecutar un formateador global.
No se crea `tasks.md` ni se implementan cambios antes de la revisión humana.
No hay dependencias nuevas o versiones modificadas que revisar con Socket.

## Duda para la revisión humana

La colección y la guía solicitadas ya están integradas en `staging` y cubren
las cinco operaciones. ¿Se aprueba verificar y reutilizar ese material con
el alcance descrito? Si se requiere una modificación adicional, debe quedar
definida por una carencia concreta antes de aprobar las tareas; no se presume
que sea necesario duplicar, trasladar o ampliar lo existente.
