# Búsqueda de usuarios en web, Electron y Chrome

Issue: #1029.

## Qué se pide

Quien usa first-app en el navegador (`pnpm web`), en la ventana de escritorio (`pnpm electron`) o en la extensión de Chrome (`pnpm chrome`) debe poder buscar usuarios desde la primera pantalla, con el mismo comportamiento que el cliente de VS Code (#1018).

En la pantalla de selección aparece un bloque «Buscar usuario» junto a la lista y al alta. La búsqueda pide un criterio (nombre, email o id) y el valor exacto. Para nombre y email, la comparación no distingue mayúsculas ni minúsculas (queries `find-by-name.sql` y `find-by-email.sql`). No se adivina el criterio ni se busca un trozo del nombre.

Si la búsqueda devuelve un solo usuario, se abre la pantalla de menú de ese usuario. Si devuelve varios (solo puede pasar por nombre), el desplegable muestra esos resultados y hay que elegir uno y pulsar Continuar. Si no hay coincidencias, el desplegable se ve vacío. Actualizar la lista, crear, guardar o borrar vuelven a la pantalla de selección con todos los usuarios.

El aspecto sigue la paleta y el layout actuales de cada cliente (crema/teal, tres pantallas, textos en español). Web y Electron comparten la misma estructura de pantallas que ya tienen; Chrome comparte el HTML/CSS del popup con web, salvo lo que exija el tamaño del popup.

Los tres clientes usan las operaciones de búsqueda que ya existen en `src/logic/` (`findUserByName`, `findUserByEmail`, `findUserById`). No se añaden operaciones ni errores nuevos. Chrome sigue hablando con su API Fastify en el puerto 3002; si hace falta exponer la búsqueda por HTTP, se hace en ese servidor existente, sin puerto nuevo.

Este cambio no modifica el cliente VS Code, Express, terminal, Jupyter ni la capa de lógica.

## Quién lo usa

Quien ya gestiona usuarios desde web, Electron o Chrome y quiere localizar uno por nombre, email o id sin recorrer toda la lista.

## Entrada

Al buscar: criterio (nombre, email o id) y valor exacto; id tal cual; nombre y email sin distinguir mayúsculas, igual que en VS Code.

Al elegir en el desplegable tras una búsqueda con varios resultados: el id del usuario, como en la selección normal.

## Salida

El mismo resultado que ya devuelven listar y buscar en lógica, mostrado en pantalla. Tras un solo resultado, el menú muestra id, nombre y email de ese usuario.

Ejemplo. Están Ada, ada@example.com, id 1, y Grace, grace@example.com, id 2. En web se elige criterio nombre y se busca Ada: se abre el menú de Ada. Buscar ada abre el mismo menú. Criterio email y ada@example.com o ADA@example.com: mismo menú. Criterio id y 1: mismo menú. Si se busca un nombre inexistente, el desplegable queda vacío. En Electron y Chrome el flujo es el mismo con los mismos datos.

## Fallo

Los mismos mensajes que ya define la lógica y los clientes actuales (`Name is empty`, `Email is invalid`, `Id is invalid`, `User not found`, `Could not find the user`, etc.). Un fallo se muestra con el mensaje de Errores, sin traducir.

Si no hay coincidencias en una búsqueda por nombre, la lista se ve vacía. No es un fallo.

## Fuera

Cliente VS Code (ya implementado). Cliente HTTP Express. Terminal y Jupyter. Notas. Búsqueda parcial o criterio automático. Nuevos puertos. Cambios en `src/logic/`, queries o reglas de usuarios. Traducir mensajes de error.
