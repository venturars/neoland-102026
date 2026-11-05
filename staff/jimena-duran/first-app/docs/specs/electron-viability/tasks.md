# Tareas del cliente Electron

Issue: #915.

Estas tareas desarrollan `spec.md` y `plan.md` aprobados.
La persona revisó las tareas y autorizó su implementación.

1. Modificar `package.json`: añadir `electron: "45.2.2"` en `devDependencies`, el script `electron: "electron src/clients/electron/main.js"` y el glob `"src/clients/electron/**/*.js"` en `format`.
   Comprobar que `main`, los otros scripts y las versiones existentes se conservan.

2. Ejecutar `pnpm install` desde `staff/jimena-duran/first-app` para actualizar `pnpm-lock.yaml`.
   Comprobar que Electron queda en 45.2.2 sin copiar el lock de referencia, crear `.npmrc` ni cambiar el linker.

3. Contrastar las versiones resueltas hasta tres capas, incluidas las opcionales, con el inventario Socket del plan.
   Si alguna difiere, detener el avance y consultar esa versión con Socket, documentando campañas, alertas y puntuaciones inferiores a 50 para revisión humana.

4. Añadir en `docs/TREE.md` el directorio `src/clients/electron/` con `main.js`, `index.html`, `app.js` y `styles.css`.
   Comprobar que conserva el formato local y el resto del árbol.

5. Añadir en `docs/ARCHITECTURE.md` que Electron abre su propia ventana y llama a `src/logic/`.
   Comprobar que explicita que no reutiliza browser ni sustituye al servidor SQL.

6. Crear `src/clients/electron/main.js` como módulo ES con `app` y `BrowserWindow`: ventana de 800 por 600 y HTML contiguo resuelto desde el módulo.
   Incluir salida al cerrar todas las ventanas salvo en `darwin` y reapertura al activar sin ventanas; sin preload, IPC ni Node habilitado en la página.

7. Crear `src/clients/electron/index.html` con lista, alta y consulta por id, y una ficha con edición, borrado y vuelta.
   Comprobar los textos en español, id/nombre/email y ambas fechas, `./styles.css` y `./app.js` con `type="module"`.

8. Crear `src/clients/electron/styles.css` para las dos pantallas y distinguir visualmente los errores.
   Comprobar que el HTML carga el estilo local.

9. Crear `src/clients/electron/app.js` importando las cinco operaciones indicadas en el plan desde `../../logic/`, con extensión `.js`.
   Comprobar que no importa browser, clasificador ni búsquedas por nombre o email, y no incorpora reglas de negocio.

10. Implementar en `app.js` la carga inicial de la lista y el alta mediante `listUsers` y `createUser({ name, email })`.
    Comprobar botones con id/nombre/email y que crear limpia el alta y recarga la lista sin abrir la ficha.

11. Implementar la apertura de ficha desde la selección y desde el id con `findUserById(id)`.
    Comprobar que presenta los datos y ambas fechas, con nombre y email precargados.

12. Implementar guardar con `updateUser(id, changes)`, enviando los valores de nombre y email de la ficha.
    Comprobar que guardar refresca la ficha y editar solo un campo conserva el otro.

13. Implementar eliminar con `deleteUser(id)` y volver desde la ficha; ambas acciones recargan la lista.
    Comprobar que los fallos de las cinco operaciones muestran `error.message` en la ventana.

14. Ejecutar `pnpm format` desde first-app.
    Comprobar que incluye el JavaScript de Electron y que no altera `src/logic/` ni `src/queries/`.

15. Ejecutar `pnpm lint` desde first-app.
    Comprobar que termina correctamente sin cambiar la configuración existente ni añadir dependencias.

16. Arrancar la base con `pnpm server` y abrir el cliente con `pnpm electron` desde first-app.
    Comprobar ventana propia y lista vacía cuando no haya usuarios; en Windows verificar apertura/cierre y revisar las ramas `darwin` si no hay macOS disponible.

17. Crear Ada con ada@example.com y abrir su ficha por id y por selección.
    Comprobar el mismo id, nombre y email en lista y ficha, ambas fechas y actualización de la lista al volver.

18. Cambiar el nombre a Ada Lovelace, guardar y después cambiar solo el email y guardar.
    Comprobar que cada guardado conserva el otro campo y el id; borrar y comprobar que vuelve a la lista sin ese usuario.

19. Comprobar nombre vacío, email inválido, email de otro usuario e id inexistente en las acciones correspondientes.
    Verificar `Name is empty`, `Email is invalid`, `Email is already used` y `User not found`, sin nuevos mensajes.

20. Con la base parada, probar crear, listar, consultar, modificar y borrar desde la ventana.
    Verificar respectivamente `Could not create the user`, `Could not list the users`, `Could not find the user`, `Could not update the user` y `Could not delete the user`.

21. Revisar el cambio completo frente a spec, plan y PR #902.
    Comprobar que solo afecta a los archivos previstos, conserva los otros clientes y no añade instaladores, funcionalidades, archivos ni dependencias directas adicionales.
