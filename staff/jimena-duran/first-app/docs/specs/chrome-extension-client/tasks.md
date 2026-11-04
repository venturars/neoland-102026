Issue: #945

# Tareas de la extensión de Chrome

Estado: tareas aprobadas, implementadas y comprobadas.
Prueba manual confirmada; se continúa el workflow de publicación en draft, sin merge.
Rama: `945-feat-chrome-extension-client`.
Las rutas parten de `staff/jimena-duran/first-app`.
La evidencia Socket y la aceptación de alertas y del límite de campañas se conservan en el plan.

1. Ajustar `package.json` para incorporar el cliente.
   Añadir `fastify` exacto `5.12.8` a `dependencies` y `chrome: node src/clients/chrome/server.js` a scripts.
   Incluir `src/clients/chrome/**/*.js` en `format`.
   Conservar las demás dependencias y comandos.

2. Resolver la instalación con `corepack pnpm install` desde `first-app`.
   El resultado queda registrado en `pnpm-lock.yaml`.
   Fastify se mantiene en `5.12.8` y se conservan las versiones existentes.

3. Contrastar las versiones resueltas de Fastify y sus dependencias hasta tres capas con el inventario del plan.
   Si alguna difiere, detener el avance y señalar la diferencia.
   No forzar el lockfile ni sustituir versiones para hacerlas coincidir.

4. Incorporar el cliente a `docs/TREE.md`.
   Bajo `src/clients/chrome/` deben figurar `server.js`, `manifest.json`, `index.html`, `popup.js` y `styles.css`.
   Conservar las demás entradas del árbol.

5. Documentar el flujo del cliente en `docs/ARCHITECTURE.md`.
   La extensión consume su API Fastify en 3002; la API llama a la lógica existente sin repetir reglas.
   El servidor SQL de 3000 y el cliente HTTP de 3001 conservan su función.

6. Crear `src/clients/chrome/server.js` con las cinco operaciones existentes de `../../logic/`, mediante imports `.js`.
   Usar Fastify, `ORIGIN = "http://127.0.0.1:3002"`, JSON integrado y las cinco rutas del plan; declarar `console` y `URL`.
   Responder 201/200/200/200/204 en crear/listar/consultar/modificar/borrar; PATCH conserva campos omitidos y 204 no lleva cuerpo.
   Traducir errores según la tabla del plan, usar el `Could not ...` de la acción ante excepciones inesperadas y devolver 404 vacío para rutas desconocidas.

7. Crear `src/clients/chrome/manifest.json`.
   Declarar Manifest V3, nombre `Usuarios`, versión `0.0.0` y acción con `default_popup: index.html`.
   El único permiso de host es `http://127.0.0.1:3002/*`, sin content scripts.

8. Crear `src/clients/chrome/index.html` con una sola pantalla en español.
   Incluir formularios para crear, consultar, modificar y borrar, junto con la lista y el espacio de mensajes.
   Cargar `./styles.css` y el módulo `./popup.js`.

9. Crear `src/clients/chrome/styles.css` para presentar el popup.
   El archivo da estilo a la pantalla sin alterar sus textos ni acciones.

10. Crear `src/clients/chrome/popup.js` con `fetch` a 3002 y escritura mediante `textContent`, sin imports de lógica u otros clientes; declarar `document` y `fetch`.
    Mostrar `id`, `name`, `email`, `createdAt` y `updatedAt` al listar o consultar, y los mensajes recibidos en `message`.
    Crear envía nombre y email incluso vacíos; modificar solo envía campos con texto; crear y modificar muestran el usuario y refrescan la lista.
    Borrar trata 204 sin leer JSON, limpia el usuario mostrado y vuelve a cargar la lista; cargar la lista al abrir.

11. Crear `README.md` con instrucciones de uso en PowerShell.
    Desde la raíz, indicar `Set-Location staff/jimena-duran/first-app`; mantener `corepack pnpm server` y `corepack pnpm chrome` en terminales separadas.
    Indicar las direcciones de la base en 3000 y de la API en 3002.
    Explicar modo desarrollador en `chrome://extensions`, cargar sin empaquetar `src/clients/chrome` y abrir el icono Usuarios.

12. Ejecutar `corepack pnpm format` y `corepack pnpm lint` en `first-app`.
    El formato incluye el JavaScript de Chrome y lint termina correctamente.
    Comprobar que no se modificaron lógica, consultas ni cliente HTTP.

13. Arrancar la base y la API con los comandos documentados.
    La base permanece en 3000 y la API anuncia `http://127.0.0.1:3002`.
    `GET /no-existe` devuelve 404 y cuerpo vacío.

14. Comprobar la creación mediante `POST /users` con Ada y `ada@example.com`.
    Responde 201 con id, nombre, email y ambas fechas.
    `GET /users` incluye ese usuario.

15. Consultar el id creado y cambiar únicamente su nombre a Ada Lovelace mediante PATCH.
    GET y PATCH responden 200 con el usuario.
    El cambio conserva el id y `ada@example.com`.

16. Comprobar los errores de validación y de usuario inexistente en la API.
    Crear con nombre vacío, email inválido y email ocupado devuelve 400 `Name is empty`, 400 `Email is invalid` y 409 `Email is already used`, sin altas nuevas.
    GET, PATCH y DELETE de un id inexistente devuelven 404 `User not found`.

17. Comprobar el borrado de Ada mediante DELETE.
    Responde 204 sin cuerpo y el usuario desaparece de GET /users.
    Si no quedan usuarios, la lista es vacía.

18. Detener la base y comprobar las cinco operaciones de la API.
    Cada una responde 500 con su mensaje `Could not ...` exacto de la tabla del plan.

19. Restaurar la base y enviar un POST con JSON sin nombre.
    Responde 500 `Could not create the user`, sin añadir validación ni mensajes nuevos.

20. Cargar manualmente la extensión en Chrome con la base y la API abiertas.
    Al abrir se ve la lista; si no hay usuarios, está vacía.
    Crear Ada con `ada@example.com` muestra sus cinco datos y actualiza la lista.

21. Consultar a Ada por su id desde la extensión y modificar solo el nombre a Ada Lovelace.
    La consulta muestra los mismos cinco datos.
    Dejando el email vacío, el cambio conserva el id y `ada@example.com`.

22. Borrar a Ada desde la extensión.
    Se limpia el usuario mostrado y la lista deja de incluirlo.
    Las solicitudes del popup se dirigen únicamente a `http://127.0.0.1:3002`.

23. Comprobar los errores visibles en la extensión.
    Crear con nombre vacío, email inválido y email ocupado muestra los tres mensajes de validación del plan.
    Consultar, modificar o borrar un id inexistente muestra `User not found` sin modificar al usuario existente.

24. Detener la base con la API abierta y comprobar los errores desde la extensión.
    Crear, listar, consultar, modificar y borrar muestran su mensaje `Could not ...` correspondiente.
