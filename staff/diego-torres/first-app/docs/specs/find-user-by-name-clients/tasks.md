Issue: #1064

# Tareas — buscar usuarios por nombre desde Chrome, VS Code y la API de Nest

Todos los comentarios son frases sencillas, fáciles de leer y sin palabras técnicas sin explicar. Van por bloques y también encima de cada import.

1. Abre `src/clients/nest/users.service.js`.
   Importa `findUserByName` desde `src/logic/find-user-by-name.js`, no desde `logic/index.js`, y añade un método que lo llama.

2. Abre `src/clients/nest/users.controller.js`.
   Importa `Query` y añade `GET /users/by-name` **antes** de `GET /users/:id`, con `@Bind(Query("name"))`. Un comentario explica por qué va antes.

3. Abre `src/clients/nest/logic-exception.filter.js`.
   `elegirFallo` devuelve `Could not find the user` si `request.path` es `/users/by-name`.

4. Abre `src/clients/chrome/server.js`.
   Importa `findUserByName` desde su fichero y añade `GET /users/by-name` antes de `GET /users/:id`, con `request.query.name`, `responderError` y `Could not find the user`.

5. Con `pnpm start`, `pnpm chrome` y `pnpm nest` en marcha, prueba en 3002 y 3003:
   `Ana García` da 200 y su usuario. `Ana` da 200 y lista vacía. Con espacios alrededor lo encuentra igual.
   Sin `name` y con `name` vacío dan 400 con `Name is empty`.

6. Crea dos usuarios con el mismo nombre y emails únicos, y busca ese nombre.
   Salen los dos. Bórralos al terminar: no quedan en la base.

7. Prueba las peticiones que no se atienden y las demás rutas.
   `Host` ajeno y `Origin` no permitido dan 403. `GET /users/1` y `GET /users` responden como antes.

8. Abre `src/clients/chrome/index.html`.
   Añade el formulario «Buscar por nombre», con un campo de tipo `text` sin `required`, y una lista `found-users` con la clase `user-list`.

9. Abre `src/clients/chrome/popup.js`.
   Al enviar: vacía mensajes y resultados, y llama a `callApi` con el texto pasado por `encodeURIComponent`.
   Pinta cada usuario con `userText` y `textContent`. Si no hay ninguno, muestra «No hay usuarios con ese nombre». `showViewedUser` vacía los resultados anteriores.

10. Abre `src/clients/vscode/extension.js`.
    Importa `findUserByName` desde su fichero y añade la acción `find-by-name` a `runAction`, que devuelve `foundUsers`. No entra en `CAMBIAN_DATOS`.

11. Abre `src/clients/vscode/index.html`.
    Añade el mismo formulario y la misma lista.

12. Abre `src/clients/vscode/panel.js`.
    Al enviar, manda la acción. `handleReply` pinta `foundUsers` con `textContent`, o muestra el aviso si la lista está vacía. `showViewedUser` vacía los resultados anteriores.

13. Con el servidor de datos parado de verdad, pide `GET /users/by-name?name=Ana` en 3002 y 3003.
    Dan 500 con `Could not find the user`. Si Diego lo tiene en marcha, avísale antes de pararlo y déjalo como estaba.

14. Abre `docs/ARCHITECTURE.md`.
    Los tres clientes también buscan por nombre.

15. En `first-app`, lanza `pnpm format` y `pnpm lint`.
    `lint` termina bien. Restaura los saltos de línea que `format` cambie en ficheros ajenos, solo si `git diff --ignore-cr-at-eol` no muestra cambios en ellos.

16. Relee los comentarios nuevos.
    Cada uno es una frase sencilla y se entiende sin saber Nest ni Fastify.

17. Diego abre la ventana de Chrome y prueba «Buscar por nombre».
    Una búsqueda con resultado, una sin resultado y el campo vacío. Los resultados desaparecen al hacer otra acción. Con la API de Chrome parada, ve `Could not find the user`.

18. Diego lanza `pnpm vscode` y prueba lo mismo en la vista Usuarios.
    Ve lo mismo que en Chrome. Con el servidor de datos parado, ve `Could not find the user`.
