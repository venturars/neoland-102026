# Tareas — buscar usuarios por nombre

1. Abre [docs/CONSTITUTIONS.md](../../CONSTITUTIONS.md). En el árbol, añade `find-user-by-name.js` en `logic/` y `find-user-by-name.txt` en `clients/terminal/`. En «Un fichero logic», añade `findUserByName(name)`.

2. Crea `queries/queries/find-by-name.sql` con el SQL del plan. Abre el fichero: la sentencia usa `:name` y ordena por `id`.

3. Abre [queries/user.js](../../../queries/user.js). Lee `find-by-name.sql` como las otras queries. Exporta `findByName(name)` con `.all({ name })`, junto a `findByEmail`.

4. Crea `logic/find-user-by-name.js`. Exporta `findUserByName(name)`. Recorta el nombre; si queda vacío, lanza `Name is empty`. Llama a `findByName`; si SQLite falla, lanza `Could not find the user`. Devuelve la lista saneada; si no hay filas, `[]`.

5. Crea `clients/terminal/find-user-by-name.txt`. Importa `findUserByName` y hace `console.log` de `findUserByName("Ada")`. El comentario indica pegar con el directorio en `first-app`.

6. Con el directorio en `first-app`, pega el cliente. La salida es una lista; cada elemento tiene `id`, `name`, `email`, `createdAt` y `updatedAt`.

7. En la terminal, llama a `findUserByName("")`. Se ve `Name is empty`. No se imprime una lista.

8. En la terminal, llama con un nombre que no está guardado. La salida es `[]`. No se ve `User not found`.
