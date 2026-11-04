# Tareas — cliente del navegador

1. Abre `docs/TREE.md`, en `src/clients/`.
   Añade `browser/` con `index.html`, `app.js` y `styles.css`.
   El resto del árbol no cambia.
   Esas líneas se leen en el árbol.

2. Abre `docs/ARCHITECTURE.md`, junto a los otros clientes.
   `src/clients/browser/` llama a `src/logic/` y no repite sus reglas.
   La página no se sirve.
   Esas líneas se leen en la arquitectura.

3. Crea `src/clients/browser/index.html`.
   Tres pantallas: la lista, el menú y modificar o eliminar. El texto visible está en español.
   El menú tiene volver, modificar usuario y notas. Notas está desactivado.
   El estilo es `./styles.css` y el script es `type="module"` hacia `./app.js`.

4. Crea `src/clients/browser/styles.css`.
   Da aspecto a las tres pantallas.
   El botón desactivado se distingue de los otros.
   El fichero se lee.

5. Crea `src/clients/browser/app.js`.
   Importa `listUsers`, `updateUser` y `deleteUser` desde `../../logic/`, con la extensión `.js`. No importa `users-gender-count.js`.
   La lista muestra id, nombre y email. Elegir uno guarda ese id en la página y abre el menú. El formulario sale de esa fila.
   Volver muestra la lista. Guardar llama a `updateUser`. Eliminar llama a `deleteUser`. Notas no tiene acción.

6. Arranca la base con el comando que ya existe y abre `index.html` en el navegador.
   Se ve la lista, con id, nombre y email, y no se pide contraseña.
   Si no hay usuarios, la lista está vacía.
   Elegir uno abre el menú de ese id.

7. En el menú, pulsa notas y pulsa volver.
   Notas no se puede pulsar y no abre otra pantalla.
   Volver muestra otra vez la lista.
   Al abrir de nuevo la página, también se ve la lista.

8. Entra en modificar, cambia el nombre a Ada Lovelace y guarda.
   Se ve el mismo id, el nombre Ada Lovelace y el email que ya tenía.
   El mensaje de error no aparece.
   Volver al menú sigue mostrando a ese usuario.

9. Guarda un nombre vacío, un email que no vale y un email de otro usuario.
   Se ven `Name is empty`, `Email is invalid` y `Email is already used`.
   El usuario guardado no cambia en esos tres fallos.
   Borra ese usuario por otra vía y, sin volver a la lista, guarda: se ve `User not found`.

10. Elimina al usuario desde la tercera pantalla.
    Ese usuario ya no sale en la lista.
    No se pide contraseña.
    La página sigue sin servirse.

11. Para la base y abre la lista.
    Se ve `Could not list the users`.
    Con la lista ya cargada y la base parada, guardar muestra `Could not update the user`.
    Eliminar muestra `Could not delete the user`.
