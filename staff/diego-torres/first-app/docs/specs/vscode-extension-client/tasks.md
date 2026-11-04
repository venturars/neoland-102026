Issue: #1002

# Tareas — cliente de usuarios en una extensión de VS Code

1. Abre `package.json`.
   Añade el script `vscode` y `src/clients/vscode/**/*.{js,html,css}` en `format`.
   Las dependencias no cambian y `pnpm-lock.yaml` tampoco.

2. Abre `eslint.config.js`.
   Añade `document`, `window` y `acquireVsCodeApi` para `src/clients/vscode/panel.js`.
   Lo demás no cambia.

3. Crea `src/clients/vscode/package.json`.
   Manifiesto con `"type": "module"`, `engines.vscode` en `^1.100.0` y la vista `firstApp.users`.
   Sin dependencias.

4. Crea `src/clients/vscode/index.html` y `styles.css`.
   La lista, los cuatro formularios, el usuario visto, «Confirmar» y «Cancelar» ocultos, y `<p id="message" role="status">`. Tiene su política de contenido. Los campos son `type="text"` y sin `required`.
   Usa los colores del tema. El mensaje de error se distingue del resto.

5. Crea `src/clients/vscode/extension.js`.
   Registra la vista, carga el HTML y atiende los cinco mensajes de la tabla del plan.
   Un fallo responde `{ error }` con el mensaje tal como llega.

6. Crea `src/clients/vscode/panel.js`.
   Envía cada acción y pinta las respuestas con `textContent`. Modificar solo envía los campos con texto. Borrar no envía nada hasta pulsar «Confirmar».
   Si un formulario falla, lo escrito se queda.

7. Crea `scripts/vscode.js`.
   Abre el editor en modo desarrollo con rutas absolutas.
   Avisa si no encuentra `code`.

8. Abre `AGENTS.md`, `docs/ARCHITECTURE.md` y `docs/TREE.md`.
   Añade el comando `pnpm vscode`, el alcance de `pnpm format`, el cliente en la lista de los que necesitan el servidor, sus filas en «Quién sabe qué», los sitios donde se ejecuta `logic` y el árbol.
   Esas líneas se leen en cada documento.

9. En `first-app`, lanza `pnpm format` y `pnpm lint`.
   `pnpm lint` termina bien.
   `git diff` no muestra cambios de contenido fuera de lo que toca esta tarea. Si solo cambian finales de línea, se restauran.

10. Prueba `extension.js` y `panel.js` juntos, sin el editor, con un sustituto del módulo `vscode` fuera del repositorio y usuarios de prueba.
    Crear, ver, modificar, borrar con «Cancelar» y «Confirmar», y los cuatro errores de datos funcionan.
    La base queda como estaba.

11. Diego lanza `pnpm start` y `pnpm vscode`, y abre la vista Usuarios.
    Sale la lista. Si la extensión no carga, para y di el error.

12. Diego crea a Ada con ada@example.com, pide su id y la modifica con el nombre Ada Lovelace y el email vacío.
    Se ve el mismo id, el nombre nuevo y el mismo email.
    Prueba `Name is empty`, `Email is invalid`, `Email is already used` y `User not found`.

13. Diego pulsa «Borrar» con el id de Ada y luego «Cancelar».
    Ada sigue en la lista.
    Repite con «Confirmar»: Ada ya no sale.

14. Diego para `pnpm start` con la vista abierta y repite cada acción.
    Se ve `Could not create the user`, `Could not list the users`, `Could not find the user`, `Could not update the user` y `Could not delete the user`.
