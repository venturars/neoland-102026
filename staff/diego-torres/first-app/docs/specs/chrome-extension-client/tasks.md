Issue: #965

# Tareas — cliente de usuarios en una extensión de Chrome

1. Abre `package.json`.
   Añade `fastify` en `5.12.8` a `dependencies`, el script `chrome` y `src/clients/chrome/**/*.{js,html,css}` en `format`.
   El resto de dependencias y scripts no cambia.

2. En `first-app`, lanza `pnpm install`.
   `pnpm-lock.yaml` cambia y `fastify` queda en `5.12.8`.
   Las demás dependencias directas siguen en su versión.

3. Compara **todas** las entradas nuevas de `pnpm-lock.yaml` con la tabla del plan.
   Incluye dependencias opcionales y entradas que solo cambian de forma.
   Si una no coincide, para y dilo. Esa versión vuelve a Socket. No se instala otra para hacerla coincidir.

4. En `first-app`, lanza `pnpm audit`.
   Se lee el resultado.
   Si sale algo alto o crítico, para y enséñaselo a Diego antes de seguir.

5. Abre `eslint.config.js`.
   Añade `document` y `fetch` para `src/clients/chrome/popup.js`.
   Lo demás no cambia.

6. Crea `src/clients/chrome/server.js`.
   Las cinco rutas, sus estados y los errores `{ message }` de la tabla del plan. Otra ruta responde 404 sin cuerpo. Escucha en `127.0.0.1:3002`.
   El `onRequest` responde 403 sin cuerpo si el `Host` no vale o si llega un `Origin` que no empieza por `chrome-extension://`.

7. Crea `src/clients/chrome/manifest.json`.
   Manifest V3, la acción abre `index.html` y `host_permissions` solo cubre `http://127.0.0.1:3002/*`.
   El fichero se lee.

8. Crea `src/clients/chrome/index.html` y `styles.css`.
   La lista, los cuatro formularios, el usuario visto, «Confirmar» y «Cancelar» ocultos, y `<p id="message" role="status">`. Sin script en línea. Los campos son `type="text"` y sin `required`.
   El mensaje de error se distingue del resto.

9. Crea `src/clients/chrome/popup.js`.
   Crear, listar, ver, modificar y borrar, como dice «Ventana» en el plan. Modificar solo envía los campos con texto. Borrar no llama a la API hasta pulsar «Confirmar».
   Cada `fetch` va en un `try/catch` y un fallo muestra el `Could not …` de esa acción. Los textos de la base van con `textContent`.

10. Abre `AGENTS.md`, `docs/ARCHITECTURE.md` y `docs/TREE.md`.
    Añade `fastify` a las dependencias, el comando `pnpm chrome`, cómo cargar la extensión, el alcance de `pnpm format`, el cliente en la lista de los que necesitan el servidor, sus filas en «Quién sabe qué» y `clients/chrome/` en el árbol.
    Esas líneas se leen en cada documento.

11. En `first-app`, lanza `pnpm format` y `pnpm lint`.
    `pnpm lint` termina bien.
    `git diff` no muestra cambios de contenido en `src/logic/`, `src/queries/`, `src/db/`, `src/clients/web/` ni `src/clients/electron/`. Si solo cambian finales de línea, se restauran.

12. Con `pnpm start` en marcha, lanza `pnpm chrome` y prueba la API con peticiones, usando usuarios de prueba que se borran al acabar.
    Crear responde 201, listar y ver 200, modificar 200 y borrar 204. Otra ruta responde 404.
    Los errores responden 400, 404 o 409 con su `message`. La base queda como estaba.

13. Prueba la protección de la API con peticiones.
    Un `Host` distinto responde 403. Un `Origin` de una web responde 403. Un `Origin` `chrome-extension://…` o sin `Origin` se atiende.
    Un cuerpo que no es JSON responde 415.

14. Con la base parada, pide a la API cada operación, si Diego puede pararla.
    Cada una responde 500 con su `Could not …`.
    Si no se puede parar, dilo: esta comprobación queda para Diego.

15. Diego carga `src/clients/chrome/` en `chrome://extensions` y abre la extensión.
    Sale la lista. Crea Ada con ada@example.com y aparece.
    Pide ese id y ve sus datos y las dos fechas. Si el `Origin` que envía Chrome no se acepta, para y dilo.

16. Diego modifica a Ada con el nombre Ada Lovelace y el email vacío.
    Se ve el mismo id, el nombre nuevo y el mismo email.
    Prueba `Name is empty` al crear, `Email is invalid`, `Email is already used` y `User not found`.

17. Diego pulsa «Borrar» con el id de Ada y luego «Cancelar».
    Ada sigue en la lista.
    Repite con «Confirmar»: Ada ya no sale en la lista.

18. Diego para `pnpm chrome` con la extensión abierta y repite cada acción.
    Se ve `Could not create the user`, `Could not list the users`, `Could not find the user`, `Could not update the user` y `Could not delete the user`.
