# Plan — búsqueda por nombre exacto

Plan aprobado por Miguel el 2026-10-22.

Referencias: [spec aprobada](spec.md), [constitución](../../CONSTITUTIONS.md) e [issue #208](https://github.com/venturars/neoland-102026/issues/208).

## Alcance y archivos

Crear únicamente:

- `queries/queries/find-by-name.sql`.
- `logic/find-user-by-name.js`.
- `clients/terminal/find-user-by-name.txt`.

Modificar `queries/users.js` para incorporar la consulta y `docs/CONSTITUTIONS.md` para registrar el contrato nuevo. No cambiar otras operaciones, dependencias, esquema ni conexión.

## Consulta

El archivo SQL contiene:

```sql
SELECT * FROM users WHERE name = :name ORDER BY id
```

La columna actual usa la comparación sensible a mayúsculas de SQLite; no añadir `LIKE`, normalización de mayúsculas ni una colación distinta.

En `queries/users.js`, leer el archivo una sola vez al cargar el módulo con el patrón existente de `readFileSync`, UTF-8 y ruta relativa al módulo. Exportar `findByName(name)`, que prepara la sentencia y devuelve `.all({ name })`. Sin reglas de negocio ni impresión.

## Operación pública

Exportar `findUserByName(name)` desde su propio archivo, con import de `findByName` desde `../queries/users.js`.

Seguir la validación y captura de errores del lookup existente por email, y la construcción de listas de `listUsers()`, sin copiar código de otras aplicaciones:

1. Recortar el nombre con `.trim()`. Si queda vacío, lanzar `Error("Name is empty")`, fuera de la captura de la consulta.
2. Llamar a `findByName` con el nombre recortado dentro de `try/catch`. Si falla, lanzar `Error("Could not find the user")`.
3. Devolver un array de objetos ordinarios nuevos, cada uno con exactamente `id`, `name`, `email`, `createdAt` y `updatedAt`. Conservar valores y orden. Sin filas, devolver `[]`.

El llamador proporciona un string. No añadir validación de tipos, helpers, wrappers, errores propios, impresión ni gestión de la conexión.

## Cliente de terminal

Un heredoc copiable `node --input-type=module`, ejecutado desde `first-app-ai`, importa la operación, busca `Ada` y muestra el array con `console.log`. Los comentarios indican que la tabla y los contactos se crean por separado. El cliente no inicializa ni escribe datos.

## Constitución durante la implementación

Actualizar el árbol de archivos, las tablas de consultas y operaciones públicas, la suposición de entrada string, las condiciones de `Name is empty` y `Could not find the user`, y la descripción de lecturas sin escrituras. Registrar que no encontrar nombres devuelve `[]`; no añadir `User not found` a esta operación. Conservar todos los contratos anteriores.

## Verificación prevista

Usar una versión disponible de Node compatible con `node:sqlite` y copias desechables sin la base de datos del proyecto. Ejecutar los clientes reales de inicialización, creación y nueva búsqueda; crear por separado una segunda Ada y Ada Lovelace.

Comprobar dos coincidencias exactas ordenadas por ID, cinco campos, objetos ordinarios y valores almacenados. Probar espacios exteriores, diferencias de mayúsculas, fragmentos, nombre inexistente, tabla vacía, entrada vacía y solo espacios. Confirmar el error genérico con una tabla sin inicializar y la conservación de registros y fechas antes y después de consultas correctas y fallidas.

Comprobar regresiones de creación, listado, actualización, eliminación y búsquedas por email e ID en la copia. No cambiar ni invocar el modelo para esta tarea. Eliminar las copias y comunicar comandos, versión de Node y resultados reales. No crear tests persistentes ni ejecutar Git.

## Conflictos y decisiones pendientes

No se identifican conflictos con la constitución ni decisiones pendientes para este alcance. La ampliación de su inventario durante la implementación documentará la nueva operación sin cambiar las anteriores.
