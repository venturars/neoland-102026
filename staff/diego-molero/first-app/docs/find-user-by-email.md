# Buscar un usuario por correo

## Especificación

Añadir la operación `findUserByEmail` tomando como referencia la
[PR #139](https://github.com/venturars/neoland-102026/pull/139), revisada en el
commit `e50b7cd850c2a98ea0c477f6e7348ddbfa353531`.

La operación pertenece a `logic/`, recibe el repositorio y un correo como texto,
y se expone al cliente como `app.findUserByEmail(email)`. Conserva los formatos de
resultado actuales del proyecto; los fallos técnicos inesperados se propagan.

### Criterios de aceptación

- **CA-01:** si el usuario existe, devolver `{ ok: true, user }`. `user` será un
  objeto normal con solo `id`, `name`, `email`, `createdAt` y `updatedAt`.
- **CA-02:** recortar el correo y pasarlo a minúsculas antes de buscar. Crear,
  actualizar y buscar deben utilizar la misma validación de correo.
- **CA-03:** devolver `{ ok: false, error: "INVALID_EMAIL" }` para entradas que no
  sean texto o incumplan el formato actual: un único `@`, contenido a ambos lados,
  ningún espacio interior y un máximo de 64 caracteres tras normalizar. No
  consultar el repositorio si la entrada es inválida.
- **CA-04:** si el correo es válido pero no existe, devolver
  `{ ok: false, error: "USER_NOT_FOUND" }`.
- **CA-05:** la búsqueda no crea, modifica ni elimina usuarios. Modificar el
  objeto devuelto tampoco modifica los datos guardados.
- **CA-06:** un fallo técnico del repositorio se propaga como excepción, sin
  convertirlo en usuario inexistente ni en respuesta correcta.
- **CA-07:** disponer de ejemplos de búsqueda en la demo de terminal y conservar
  el comportamiento de crear, listar, actualizar y eliminar.

### Ejemplos

Con un usuario registrado como `lucia@example.com`:

| Entrada | Resultado |
| --- | --- |
| `"lucia@example.com"` | Usuario encontrado. |
| `"  LUCIA@EXAMPLE.COM  "` | El mismo usuario. |
| `"nadie@example.com"` | `USER_NOT_FOUND`. |
| `"sin-arroba"` o `null` | `INVALID_EMAIL`. |

No se añaden búsquedas parciales, autenticación, API, frontend ni cambios de
esquema. La consulta `findByEmail` ya existe en el repositorio.

## Plan

1. Extraer `validateEmail` dentro de `logic/validate-user.js` y reutilizarla desde
   `validateUser`, manteniendo las reglas actuales.
2. Crear `logic/find-user-by-email.js`, usar `findByEmail` y seleccionar
   explícitamente los cinco campos públicos del usuario.
3. Conectar la operación en `app.js` y mostrar éxito, correo inválido y usuario
   inexistente en la demo, usando SQLite en memoria.
4. Probar las reglas sin SQLite y la integración con SQLite real, incluyendo
   búsquedas tras actualizar, eliminar y volver a abrir una base de archivo.
5. Actualizar README, constitución y AGENTS sin cambiar la arquitectura.

## Tareas y verificación

- [x] Compartir la validación y añadir la operación (CA-01 a CA-06).
- [x] Exponer la operación y ampliar la demo (CA-07).
- [x] Añadir pruebas de negocio e integración (CA-01 a CA-07).
- [x] Actualizar README, constitución y AGENTS.
- [x] Ejecutar `npm test` y `npm run demo`.
- [x] Revisar UTF-8 y el diff.

Resultados verificados el 2026-10-19 con Node.js 24.14.1:

- `npm test`: 81 pruebas correctas, sin fallos. Incluye 21 pruebas específicas de
  búsqueda sin SQLite, un nuevo escenario de integración y búsquedas en la prueba
  existente de persistencia entre aperturas.
- `npm run demo`: muestra el usuario encontrado con correo normalizado,
  `INVALID_EMAIL` y `USER_NOT_FOUND`, además de las operaciones existentes.
- Las pruebas y la demo utilizan bases aisladas. No se ha cambiado el esquema ni
  se ha utilizado la base persistente de trabajo para estas comprobaciones.
- Codificación UTF-8 y formato revisados en los 22 archivos de texto del proyecto.
