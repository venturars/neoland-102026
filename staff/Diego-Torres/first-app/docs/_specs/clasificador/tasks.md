# Tareas — clasificador de género

1. Abre `docs/CONSTITUCION.md`, en la tabla de quién sabe qué.
   Añade `logic/clasificador.js` y la operación `contarUsuariosPorGenero(almacen)`.
   En «Errores», escribe `No se han podido clasificar los usuarios` y que lo lanza ese fichero.
   Esas frases se leen en el documento.

2. Abre `AGENTS.md`.
   Deja los scripts con pnpm y admite la dependencia `openai`.
   Esa frase se lee en la guía.

3. En `first-app`, ejecuta `pnpm add openai`.
   `package.json` lista `openai`.
   No se añade otra dependencia.

4. Abre `logic/clasificador.js`.
   La constante `MODEL` vale `llama3.2` una sola vez.
   Los ejemplos, en este orden, son Carmen `women`, Lucia `women`, Javier `men`, Pablo `men` y Kim `undefined`.
   El lote es un mensaje `user` con un nombre por línea. `response_format` es `json_schema` y el esquema es `{ genders }`.

5. En ese fichero, `contarUsuariosPorGenero(almacen)` llama a `listar`.
   No importa `db` ni `queries`. El email no sale del fichero.
   `women` y `men` suman en su campo. Cualquier otro valor suma en `genderUndefined`.
   Si no hay mensaje, el JSON no se lee, o `genders` no coincide, ese lote suma en `genderUndefined` y sigue. Si la llamada falla, lanza `No se han podido clasificar los usuarios`.

6. Abre `test/usuarios.test.js`.
   Un caso con el almacén en memoria devuelve `{ women, men, genderUndefined }`.
   La suma de los tres números es el número de usuarios listados.
   Si no hay usuarios, los tres números son 0 y no se llama a la IA.

7. Abre `ejemplo.js`.
   Importa `contarUsuariosPorGenero`, le pasa el almacén SQLite y hace `console.log`.
   Ejecuta `pnpm test` y `pnpm run ejemplo`.
   `pnpm test` pasa. El ejemplo imprime solo `{ women, men, genderUndefined }`.
