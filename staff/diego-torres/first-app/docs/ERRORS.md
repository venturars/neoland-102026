# Errores

Un fallo es `throw new Error("…")`. No hay clases propias. No se añaden mensajes fuera de esta lista.

## El dato no vale

- `Name is empty` — lo lanza `src/logic/shared.js`
- `Email is invalid` — lo lanza `src/logic/shared.js`
- `Email is already used` — lo lanzan `createUser` y `updateUser`
- `User not found` — lo lanzan las operaciones que reciben un id o un email que no existe. `findUserByName` sin coincidencias devuelve `[]`, no es un fallo

## No se llega a la base

Cada llamada a `src/queries/` va dentro de un `try`. Si falla, la operación lanza su mensaje:

| Operación | Mensaje |
| --- | --- |
| `createUser` | `Could not create the user` |
| `updateUser` | `Could not update the user` |
| `deleteUser` | `Could not delete the user` |
| `listUsers` | `Could not list the users` |
| `findUserById`, `findUserByEmail`, `findUserByName` | `Could not find the user` |
| `usersGenderCount` (también si falla la IA) | `Could not classify the users` |

Los errores de reglas se lanzan fuera de esos `try`, para que no se conviertan en un `Could not …`.
