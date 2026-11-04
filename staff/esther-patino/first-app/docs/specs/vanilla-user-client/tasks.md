# Tareas — cliente de navegador

1. Abre `docs/CONSTITUTIONS.md`, en la frase que dice que la app no es una web.
   Esa frase dice también que se elige, se cambia y se borra un usuario desde el navegador, en tres pantallas.
   La terminal y Jupyter siguen igual.
   La frase se lee.

2. Abre `docs/CONSTITUTIONS.md`, en el apartado 7.
   El cliente de una funcionalidad nueva sigue siendo el `.txt` de terminal.
   Este cambio añade el cliente de navegador y no añade un `.txt`.
   El apartado se lee.

3. Abre `AGENTS.md`, en la frase que dice que no es una web.
   Esa frase dice también que se usa desde el navegador con `pnpm start`.
   El resto de la guía no cambia.
   La frase se lee.

4. Abre `docs/style.md`, en Comandos.
   Ejecutar pasa a ser `pnpm start` desde `first-app`.
   El servidor escucha en `127.0.0.1:3000`.
   La línea se lee.

5. Abre `docs/ARCHITECTURE.md`, en `src/clients/`.
   Añade `src/clients/http/` y `src/clients/web/` con los ficheros del plan.
   El navegador entra por ese servidor y el servidor llama a `src/logic/`.
   Esas líneas se leen.

6. Abre `docs/tree.md`, en `clients/`.
   Añade `http/` y `web/` con los ficheros del plan.
   El resto del árbol no cambia.
   Esas líneas se leen.

7. Abre `package.json`.
   El script `start` arranca `src/clients/http/start-http-server.js`.
   No se añaden dependencias.
   Se lee `pnpm start` en los scripts.

8. Abre `src/clients/http/send-json.js`.
   `sendJson(response, statusCode, value)` envía el valor en JSON y sin caché.
   El tipo es `application/json; charset=utf-8`.
   No hay otra función en el archivo.

9. Abre `src/clients/http/send-http-error.js`.
   Un error conocido responde con su mensaje en inglés, el de `src/logic/`.
   `Name is empty`, `Email is invalid` e `Invalid id` usan 400.
   `User not found` usa 404 y `Email is already used` usa 409.

10. Abre `src/clients/http/read-json-body.js`.
    Lee el cuerpo y solo acepta un objeto JSON.
    Si el cuerpo no es JSON o no es un objeto, no sigue.
    No hay otra función en el archivo.

11. Abre `src/clients/http/handle-users.js`.
    `GET /api/users` llama a `listUsers()` y devuelve `id`, `name` y `email`.
    `GET`, `PATCH` y `DELETE` de `/api/users/1` llaman a `findUserById`, `updateUser` y `deleteUser`.
    `1abc` y `1.5` no eligen otro usuario: el fallo es `Invalid id`.

12. Abre `src/clients/http/serve-public-file.js`.
    Sirve solo los archivos de `src/clients/web/` que están en una lista cerrada.
    Una ruta pedida no se convierte en una ruta del disco.
    La base y el código del servidor no se descargan.

13. Abre `src/clients/http/handle-request.js`.
    Una ruta de usuarios llama a `handle-users.js`.
    El resto llama a `serve-public-file.js`.
    Un fallo acaba en `send-http-error.js`.

14. Abre `src/clients/http/start-http-server.js`.
    Escucha solo en `127.0.0.1:3000`.
    Al arrancar escribe la dirección.
    No crea usuarios de ejemplo.

15. Abre `src/clients/web/index.html`.
    Hay tres pantallas: lista, menú del usuario y modificación.
    La lista muestra id, nombre y email. El menú tiene volver, modificar e ir a notas.
    Ir a notas se ve y no tiene pantalla. Los textos están en español.

16. Abre `src/clients/web/styles.css`.
    Las tres pantallas comparten esta hoja.
    No hay framework.
    Los textos siguen en el HTML.

17. Abre `src/clients/web/state.js`.
    Guarda el usuario elegido y si hay una operación en curso.
    Al recargar, la elección se pierde y se vuelve a la lista.
    Los datos guardados siguen en la base.

18. Abre `src/clients/web/show-screen.js`.
    Muestra una pantalla y oculta las otras dos.
    Limpia el mensaje anterior.
    No descarga otra página.

19. Abre `src/clients/web/show-message.js`.
    Muestra el texto del fallo o del resultado.
    El texto no se interpreta como HTML.
    Un mensaje vacío no se ve.

20. Abre `src/clients/web/load-user-selection.js`.
    Pide `GET /api/users` y crea una opción por usuario.
    Si la lista llega vacía, dice que no hay usuarios.
    Si la petición falla, el mensaje es distinto de la lista vacía.

21. Abre `src/clients/web/select-user.js`.
    Lee el id elegido y pide ese usuario otra vez.
    No pide contraseña.
    Si existe, guarda la elección y muestra el menú.

22. Abre `src/clients/web/show-user-menu.js`.
    Muestra el id, el nombre y el email guardados.
    No muestra lo que haya a medias en el formulario.
    Deja ver volver, modificar e ir a notas.

23. Abre `src/clients/web/open-user-editor.js`.
    Rellena nombre y email con los datos guardados.
    Muestra la pantalla de modificación.
    Abrirlo de nuevo no recupera un borrador sin guardar.

24. Abre `src/clients/web/navigate.js`.
    Volver carga la lista. Modificar abre el formulario.
    Ir a notas no tiene acción ni petición.
    No navega mientras hay una operación en curso.

25. Abre `src/clients/web/save-user.js`.
    Envía el nombre y el email con `PATCH`.
    Si se guarda, el menú muestra los datos nuevos.
    Si falla, se ve el mensaje de `src/logic/` y los campos no se borran.

26. Abre `src/clients/web/delete-selected-user.js`.
    Pide confirmación antes de enviar `DELETE`.
    Cancelar no envía la petición y el usuario sigue.
    Confirmar borra, vuelve a la lista y conserva a los demás.

27. Abre `src/clients/web/main.js`.
    Conecta la lista, guardar, borrar y la navegación con sus funciones.
    Al abrir, carga la lista.
    No hay otra función de pantallas en este archivo.

28. Lanza `pnpm start` desde `first-app`.
    En `http://127.0.0.1:3000` se elige un usuario, se cambia y se borra, como dice la spec.
    Ir a notas no abre otra pantalla.
    Después se lanzan `pnpm format` y `pnpm lint`.
