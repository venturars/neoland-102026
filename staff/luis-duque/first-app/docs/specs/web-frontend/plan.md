# Plan — diseño del frontend web

Cumple `docs/specs/web-frontend/spec.md`. Issue: #863.

No hay operación nueva, ni función nueva, ni SQL. No hay paquete nuevo ni cambio de versión, así que no entra Socket. No se añade un marco de interfaz ni una biblioteca de estilos. Jupyter y la terminal se quedan. `src/logic`, `src/queries` y `src/db` no se tocan.

La skill Frontend Design no se escribe en esta fase. Se escribe al terminarla, en las tareas: `skills/frontend-design/SKILL.md` y su `LICENSE.txt`, desde https://agenticskills.io/skills/frontend-design. Se tiene en cuenta solo cuando el trabajo es un diseño web, salvo que el desarrollo diga otra cosa. Este plan no la usa. Se usa cuando se escriba la dirección, antes de cambiar el aspecto.

## Dirección

La dirección es un texto corto: una paleta de 4 a 6 colores, las tipografías y el papel de cada una, la composición y los principios. Se elige para esta aplicación de usuarios. No se copia de una plantilla.

Se escribe con esa skill y se revisa. Este plan no elige colores ni tipografías. Hasta que esa dirección esté aceptada no se toca el aspecto.

## Cliente web

El aspecto se aplica a todo el cliente web, no a una vista suelta. Ese cliente está en el desarrollo que aún no está mergeado, así que este plan no nombra sus ficheros. El cambio en ellos queda para el merge de esta issue.

No se crea otra vista. No se crea un usuario desde la web. No se cuenta el género. `package.json` no gana dependencias. `pnpm-lock.yaml` no se toca. El recorrido se queda. Sigue llamando solo a `listUsers`, `updateUser` y `deleteUser`. Los mensajes no cambian.

No se tocan `src/clients/terminal` ni `src/clients/jupyter`.

Se ve una vista cada vez: lista, menú, modificar y notas.

La lista muestra el id, el nombre y el email. Si no hay ninguno, queda vacía. Elegir un id que no es un entero positivo muestra `User id must be a positive integer` y se sigue en la lista. Un entero positivo que no está en esa lista muestra `User ${id} was not found` y no abre el menú.

El menú muestra el nombre y el id. Volver regresa a la lista, ya leída de nuevo. Modificar muestra el nombre y el email que ya tiene. Guardar llama a `updateUser(id, { name, email })`. Eliminar llama a `deleteUser(id)`. Si la llamada termina, se vuelve a la lista actualizada. Si lanza, se queda en modificar y se ve `error.message`. Volver desde modificar regresa al menú sin guardar.

Las notas dicen `Esta pantalla no tiene utilidad.` Volver regresa al menú. No leen, no guardan y no borran.

Si `listUsers` lanza, la lista queda vacía y se ve `error.message`.

En una ventana estrecha el contenido cabe. El foco del teclado se ve. Si el sistema pide menos movimiento, la página no anima.

## Documentación

Esos ficheros se tocan al ejecutar las tareas, no antes. Ahí se crea `skills/frontend-design/`. `docs/STYLE.md` deja escrita la dirección ya aceptada. `docs/CONSTITUTIONS.MD` pasa el desarrollo abierto a `docs/specs/web-frontend/`. `docs/TREE.md` incluye `skills/frontend-design/`. `AGENTS.MD` dice que esa skill se tiene en cuenta solo en un diseño web, salvo que el desarrollo diga otra cosa. No se tocan `docs/ARCHITECTURE.md`, `docs/DATABASE.md` ni `docs/ERRORS.md`: el recorrido y los fallos no cambian.

## Pregunta

La constitución, `AGENTS.MD` y el código de esta rama dicen que no hay pantalla ni otro cliente. `src/db/connection.js` abre `users.sqlite` y no ejecuta SQL. Cada consulta es un `.sql` que lee y ejecuta `src/queries/users.js`. El desarrollo abierto es `docs/specs/find-user-by-name/`.

La spec diseña el cliente web que ya lista, elige, modifica, elimina y muestra notas. Ese cliente está en el desarrollo que aún no está mergeado. Sus ficheros no se nombran aquí.
