# Spec: Alinear el código con las guías

Issue: #710.

## Qué queremos conseguir
Que el código cumpla lo que dicen `docs/STYLE.md`, `docs/DATABASE.md` y `docs/ARCHITECTURE.md`, y que las guías dejen de tener cosas pendientes. La app hace lo mismo.

## Qué cambia
- Los ficheros de `logic/`, `clients/terminal/` y `clients/jupyter/` se llaman en kebab-case: `create-user.js`, `create-user.txt`, `create-user.ipynb`. Las funciones no cambian de nombre.
- Lo que devuelven `createUser`, `findUserByEmail`, `listUsers` y `updateUser` tiene los campos `id`, `name`, `email`, `createdAt` y `updatedAt`. La tabla sigue con `created_at` y `updated_at`.
- Cada línea hace una sola acción, en todos los ficheros de `logic/`, también en `classify-gender.js`. No se usa `?.`: se comprueba con un `if`.
- Un `.gitattributes` fija los finales de línea de los `.js` en LF, para que `pnpm format` no marque ficheros como modificados en Windows.
- Las guías y `AGENTS.md` usan los nombres nuevos y ya no tienen apartados pendientes.

## Qué ve quien usa la app
- Los mismos resultados y los mismos mensajes de error.
- En la terminal, los usuarios salen con `createdAt` y `updatedAt`, y ya no se ve `[Object: null prototype]` delante.
- En los notebooks, las columnas de fecha se llaman `createdAt` y `updatedAt`.
- Los comandos y los notebooks tienen el nombre nuevo.

## Ejemplo
Antes: `User created: [Object: null prototype] { id: 15, name: 'Pedro', email: 'pedro@gmail.com', created_at: '...', updated_at: '...' }`.
Después: `User created: { id: 15, name: 'Pedro', email: 'pedro@gmail.com', createdAt: '...', updatedAt: '...' }`.

## Casos a cubrir
- Cada comando de la terminal con datos correctos y con cada error de `docs/ERRORS.md`.
- `classifyGender` con Ollama encendido y apagado.
- Cada notebook, con su resultado guardado.
- `pnpm format` sin cambios la segunda vez y sin ficheros marcados como modificados, y `pnpm lint` sin errores.

## Fuera de alcance
- Mover carpetas a `src/`: es la tarea siguiente.
- Cambiar la tabla, los mensajes de error o lo que hace cada operación.
- Pasar el SQL a ficheros `.sql`.
- Cambiar `db/` o `queries/` más allá de lo que pida una acción por línea.
