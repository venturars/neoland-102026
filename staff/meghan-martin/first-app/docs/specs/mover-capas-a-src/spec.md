# Spec — mover las capas a src

La app sigue igual: desde la terminal se guardan personas en SQLite. Este cambio no añade ni quita ninguna acción.

Las cuatro capas de la app viven bajo `src/`. Ya no están en la raíz de first-app.

## Few-shot

- `clients`, `db`, `queries` y `logic` están en `src/`.
- Se pega `src/clients/terminal/create-user.txt` con el directorio actual en `first-app`. Guardar a Ada sigue igual.
- `npm run lint` termina bien.
- `docs/TREE.md` y `docs/ARCHITECTURE.md` muestran las cuatro capas bajo `src/`.

Las reglas de cada acción no cambian.
