# Extensión Chrome con API local de usuarios

Issue: #971.

Quien prueba la app gestiona usuarios desde una extensión de Chrome: crear, listar, ver por id, modificar y borrar. No hay contraseña.

No sustituye el cliente HTTP del puerto 3001 ni el navegador `file://`, la terminal, Jupyter ni Electron. Es un cliente nuevo bajo `src/clients/chrome/`.

Se arranca la base SQL (`pnpm server`, puerto 3000) y la API de este cliente (`pnpm chrome`, `http://127.0.0.1:3002`). El popup solo habla con esa API; la API llama a `src/logic/` sin repetir reglas.

Al crear entran nombre y email. Al listar no entra nada. Al ver uno entra el id. Al modificar entran id y nombre, email o ambos; lo no enviado conserva el valor guardado. Al borrar entra el id.

Se muestra el usuario que devuelve la app: id, nombre, email, `createdAt`, `updatedAt`. La lista está vacía si no hay usuarios. Al borrar no se muestra un usuario como resultado.

Si el nombre queda vacío, se ve `Name is empty`.

Si el email no vale, se ve `Email is invalid`.

Si el email es de otro usuario, se ve `Email is already used`.

Si ese usuario no está, se ve `User not found`.

Si no se llega a la base al crear, se ve `Could not create the user`.

Si no se llega al listar, se ve `Could not list the users`.

Si no se llega al ver uno, se ve `Could not find the user`.

Si no se llega al modificar, se ve `Could not update the user`.

Si no se llega al borrar, se ve `Could not delete the user`.

Queda fuera sustituir `src/clients/http/`, cambiar `logic/` o `queries/`, el servidor SQL, contraseña, autenticación, permisos, contar por género, buscar por nombre o email, reglas o mensajes nuevos, tocar clientes terminal/Jupyter/browser/Electron, y publicar en Chrome Web Store (solo carga sin empaquetar en desarrollo).

La interfaz del popup usa dos pantallas (lista con alta y búsqueda por id; ficha con edición y borrado), no el mismo diseño que otros popups de una sola página con cinco formularios sueltos.
