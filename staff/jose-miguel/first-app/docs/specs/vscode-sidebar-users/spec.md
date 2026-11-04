# Extensión VS Code · panel lateral de usuarios

Issue: #986.

Como quien prueba la app desde el editor, quiero un panel lateral en VS Code para dar de alta usuarios, ver la lista ordenada por id, localizarlos por nombre, email o id, editar datos y borrar con confirmación, para no depender del popup de Chrome ni del HTTP del puerto 3001.

La extensión vive en `src/clients/vscode/`. El proceso de la extensión llama a `src/logic/`; la interfaz muestra errores de negocio en inglés tal como los define la app. Etiquetas, botones y estados vacíos van en español. No se arranca el servidor SQL desde la extensión.

Búsqueda por nombre: coincidencia exacta respetando mayúsculas. Por email: coincidencia exacta tras quitar espacios en los extremos, sin distinguir mayúsculas en el email. Por id: reglas ya existentes en la logic. Borrar solo tras escribir el email guardado (misma comparación que arriba en el email). Si la confirmación no coincide, la UI muestra un aviso en español sin llamar a `deleteUser`.

Queda fuera Marketplace, VS Code Web o remotos, API REST como sustituto de logic, puerto o paquete nuevo en el `package.json` raíz de first-app, reutilizar el HTML del browser, arrancar `pnpm server` automáticamente, contar por género, auth, mensajes o reglas nuevos en logic, y cambiar logic, queries, db u otros clientes.

Si el nombre queda vacío al crear o editar, se ve `Name is empty`.

Si el email no vale, se ve `Email is invalid`.

Si el email es de otro usuario, se ve `Email is already used`.

Si ese usuario no está, se ve `User not found`.

Si no se llega a la base al crear, se ve `Could not create the user`.

Si no se llega al listar, se ve `Could not list the users`.

Si no se llega al ver uno, se ve `Could not find the user`.

Si no se llega al modificar, se ve `Could not update the user`.

Si no se llega al borrar, se ve `Could not delete the user`.

Con la base parada, el panel muestra un aviso en español y un control para reintentar la última acción.

La vista debe ser usable con teclado (focus visible, formularios nativos).
