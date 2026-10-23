# Plan — gestión de usuarios

Aplican las reglas de la [constitución](../../CONSTITUTIONS.md).
Esta iteración cambia los resultados de validación por excepciones y devuelve
los datos directamente, conservando las validaciones y su orden.

## Almacenamiento y consultas

- `db/connection.js` exporta el singleton db y abre users.sqlite junto al módulo.
  Importar no crea la tabla.
- `queries/queries/create-users-table.sql` usa CREATE TABLE IF NOT EXISTS.
  `queries/users.js` expone `createUsersTable()`, sin datos de salida. No modifica
  tablas existentes ni sustituye migraciones.
- Esquema: id INTEGER PRIMARY KEY AUTOINCREMENT; name TEXT NOT NULL;
  email TEXT NOT NULL UNIQUE; createdAt y updatedAt TEXT NOT NULL, con valor por
  defecto strftime('%Y-%m-%dT%H:%M:%fZ', 'now'). Las fechas son UTC ISO 8601.
- El resto del SQL vive en find-all, find-by-email, find-by-id, insert, update
  y remove, cada uno en su .sql con parámetros con nombre.
- `queries/users.js` carga los SQL una vez, usa db.prepare y convierte filas en
  objetos normales. Traduce el conflicto UNIQUE de correo a una excepción con
  el mensaje Email is already used, conservando el error del motor como causa.

## Operaciones

Las seis operaciones de `logic/` importan directamente las consultas y son síncronas.

| Firma | Devuelve | Mensajes de validación |
|---|---|---|
| createUser(input) | Usuario | Input is invalid; Name is invalid; Email is invalid; Email is already used |
| updateUser(id, changes) | Usuario | User ID is invalid; Input is invalid; No changes provided; User not found; Name is invalid; Email is invalid; Email is already used |
| deleteUser(id) | Nada | User ID is invalid; User not found |
| listUsers() | Lista de usuarios | Ninguno |
| findUserByEmail(input) | Usuario | Email is invalid; User not found |
| findUserById(id) | Usuario | User ID is invalid; User not found |

Los mensajes se lanzan con `throw new Error("...")`. El usuario devuelto contiene
id, name, email, createdAt y updatedAt. El listado contiene esos mismos campos.
No se añaden indicadores de éxito ni códigos propios. Los fallos técnicos se propagan.

La entrada de creación y changes solo admiten name y email. Crear valida objeto,
nombre, correo y unicidad. Actualizar valida ID, objeto, presencia de cambios,
existencia del usuario, nombre, correo y unicidad. undefined se considera omitido.

## Clientes

La preparación y todos los comandos están en
[ejecución](../../CONSTITUTIONS.md#ejecución). Los siete ejemplos de usuarios
permanecen en `clients/terminal/`, con importación, llamada y console.log.
Eliminar llama a la operación y muestra User deleted al terminar correctamente.
No hay menú interactivo; se editan los datos del ejemplo cuando sea necesario.

## Comprobación manual

En una copia temporal sin la base personal, observar altas, búsquedas, cambios,
listado y borrado. Comprobar que las validaciones lanzan Error, que no modifican
usuarios y que no se devuelven envoltorios. Repetir la inicialización para comprobar
que conserva los datos. Registrar los resultados en [tareas](tasks.md).
