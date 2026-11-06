Issue: #1058

# Tareas — contar por género desde Chrome, VS Code y la API de Nest

Todos los comentarios son frases sencillas, fáciles de leer y sin palabras técnicas sin explicar. Van por bloques y también encima de cada import.

1. Abre `src/clients/nest/users.service.js`.
   Importa `usersGenderCount` desde `src/logic/users-gender-count.js`, no desde `logic/index.js`, y añade un método que lo llama.

2. Abre `src/clients/nest/users.controller.js`.
   Añade `GET /users/gender-count` **antes** de `GET /users/:id`, con un comentario que explique por qué va antes.

3. Abre `src/clients/nest/logic-exception.filter.js`.
   Añade `"Could not classify the users": 500` a `ESTADOS`. `elegirFallo` devuelve ese mensaje si `request.path` es `/users/gender-count`.

4. Abre `src/clients/chrome/server.js`.
   Importa `usersGenderCount` desde su fichero y añade `GET /users/gender-count` antes de `GET /users/:id`, con `responderError` y `Could not classify the users`.

5. Con `pnpm start`, Ollama, `pnpm chrome` y `pnpm nest` en marcha, pide `GET /users/gender-count` en 3002 y 3003.
   Responden 200, y los tres números suman el total de usuarios.
   `Host` ajeno y `Origin` no permitido dan 403. `GET /users/1` y `GET /users` responden como antes.

6. Abre `src/clients/chrome/index.html`.
   Añade el botón «Contar por género», de tipo `button`, y una línea oculta para el resultado, con las clases que ya usa el usuario visto.

7. Abre `src/clients/chrome/popup.js`.
   Al pulsar: vacía los mensajes, desactiva el botón, muestra «Contando…» y llama a `callApi` con `Could not classify the users`.
   Si sale bien, quita el aviso y escribe la línea con `textContent`. Si falla, muestra el error. En los dos casos vuelve a activar el botón.

8. Abre `src/clients/vscode/extension.js`.
   Importa `usersGenderCount` desde su fichero y añade la acción `gender-count` a `runAction`. No entra en `CAMBIAN_DATOS`.

9. Abre `src/clients/vscode/index.html`.
   Añade el mismo botón y la misma línea oculta.

10. Abre `src/clients/vscode/panel.js`.
    Al pulsar: envía la acción, desactiva el botón y muestra «Contando…».
    `handleReply` escribe la línea con `textContent`, quita el aviso y vuelve a activar el botón, también si llega un error.

11. Para Ollama y pide `GET /users/gender-count` en 3002 y 3003.
    Dan 500 con `Could not classify the users`. Vuelve a lanzar Ollama si estaba en marcha.

12. Con el servidor de datos parado de verdad, repite la petición.
    Dan 500 con el mismo mensaje. Si Diego lo tiene en marcha, avísale antes de pararlo y déjalo como estaba.

13. Abre `AGENTS.md` y `docs/ARCHITECTURE.md`.
    Este recuento necesita Ollama con `llama3.2`, y `openai` también lo usan Chrome, VS Code y Nest. Los tres clientes también cuentan por género.

14. En `first-app`, lanza `pnpm format` y `pnpm lint`.
    `lint` termina bien. Restaura los saltos de línea que `format` cambie en ficheros ajenos, solo si `git diff --ignore-cr-at-eol` no muestra cambios en ellos.

15. Relee los comentarios nuevos.
    Cada uno es una frase sencilla y se entiende sin saber Nest ni Fastify.

16. Diego abre la ventana de Chrome y pulsa «Contar por género».
    Ve «Contando…», el botón desactivado y después `Mujeres: … · Hombres: … · No definidos: …`. Con la API de Chrome parada, ve `Could not classify the users`.

17. Diego lanza `pnpm vscode` y pulsa «Contar por género» en la vista Usuarios.
    Ve lo mismo que en Chrome. Si la extensión no arranca o no carga `openai`, para y dilo.
    Con Ollama parado, ve `Could not classify the users`.
