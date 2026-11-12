Issue: #1066

# Tareas — buscar un usuario por email desde Chrome, VS Code y la API de Nest

Todos los comentarios son frases sencillas, fáciles de leer y sin palabras técnicas sin explicar. Van por bloques y también encima de cada import.

1. Abre `src/clients/nest/users.service.js`.
   Importa `findUserByEmail` desde `src/logic/find-user-by-email.js`, no desde `logic/index.js`, y añade un método que lo llama.

2. Abre `src/clients/nest/users.controller.js`.
   Importa `Query` y añade `GET /users/by-email` **antes** de `GET /users/:id`, con `@Bind(Query("email"))`. Un comentario explica por qué va antes.

3. Abre `src/clients/nest/logic-exception.filter.js`.
   `elegirFallo` devuelve `Could not find the user` si `request.path` es `/users/by-email`.

4. Abre `src/clients/chrome/server.js`.
   Importa `findUserByEmail` desde su fichero y añade `GET /users/by-email` antes de `GET /users/:id`, con `request.query.email`, `responderError` y `Could not find the user`.

5. Con `pnpm start`, `pnpm chrome` y `pnpm nest` en marcha, prueba en 3002 y 3003:
   `ana@ejemplo.com` da 200 y su usuario. `ANA@ejemplo.com` y con espacios alrededor lo encuentran igual.
   `nadie@ejemplo.com` da 404 con `User not found`. Sin `email`, vacío y `ana` dan 400 con `Email is invalid`.

6. Crea un usuario de prueba con `+` en el email y búscalo.
   Lo encuentra. Bórralo al terminar: no queda en la base.

7. Prueba las peticiones que no se atienden y las demás rutas.
   `Host` ajeno y `Origin` no permitido dan 403. `GET /users/1` y `GET /users` responden como antes.

8. Abre `src/clients/chrome/index.html`.
   Añade el formulario «Buscar por email», con un campo de tipo `text` sin `required`.

9. Abre `src/clients/chrome/popup.js`.
   Al enviar: vacía mensajes y usuario anterior, y llama a `callApi` con el texto pasado por `encodeURIComponent`.
   Muestra el usuario con `showViewedUser`. Si falla, muestra el error y lo escrito se queda.

10. Abre `src/clients/vscode/extension.js`.
    Importa `findUserByEmail` desde su fichero y añade la acción `find-by-email` a `runAction`, que devuelve `user`. No entra en `CAMBIAN_DATOS`.

11. Abre `src/clients/vscode/index.html`.
    Añade el mismo formulario.

12. Abre `src/clients/vscode/panel.js`.
    Al enviar, manda la acción con `send`. `handleReply` no cambia: ya muestra `user`.

13. Con el servidor de datos parado de verdad, pide `GET /users/by-email?email=ana@ejemplo.com` en 3002 y 3003.
    Dan 500 con `Could not find the user`. Si Diego lo tiene en marcha, avísale antes de pararlo y déjalo como estaba.

14. Abre `docs/ARCHITECTURE.md`.
    Los tres clientes también buscan por email.

15. En `first-app`, lanza `pnpm format` y `pnpm lint`.
    `lint` termina bien. Restaura los saltos de línea que `format` cambie en ficheros ajenos, solo si `git diff --ignore-cr-at-eol` no muestra cambios en ellos.

16. Relee los comentarios nuevos.
    Cada uno es una frase sencilla y se entiende sin saber Nest ni Fastify.

17. Diego abre la ventana de Chrome y prueba «Buscar por email».
    Un email guardado, uno que no está y uno que no vale. Con la API de Chrome parada, ve `Could not find the user`.

18. Diego lanza `pnpm vscode` y prueba lo mismo en la vista Usuarios.
    Ve lo mismo que en Chrome. Con el servidor de datos parado, ve `Could not find the user`.
