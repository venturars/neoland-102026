Issue: #996

# Tareas del cliente de VS Code

Rama de trabajo: `996-feat-vscode-extension-client`.
Las rutas parten de `staff/jimena-duran/first-app/`.
La ejecución comienza tras la aprobación de estas tareas y la autorización de implementar.

1. Añadir el script `vscode` en `package.json` con el comando PowerShell del plan.
   Usar rutas absolutas para la extensión y la carpeta de la aplicación.
   El script queda definido sin cambiar los demás comandos ni las dependencias.

2. Ampliar `format` en `package.json` con `src/clients/vscode/**/*.js`.
   El nuevo glob queda incluido junto a los existentes.

3. Actualizar `docs/TREE.md` con `src/clients/vscode/`.
   Enumerar `package.json`, `extension.js`, `index.html`, `panel.js` y `styles.css`.
   El árbol muestra exactamente esos cinco archivos para el cliente.

4. Actualizar `docs/ARCHITECTURE.md` con el flujo del cliente.
   El proceso de extensión llama a la lógica y la vista presenta el resultado.
   La descripción conserva los servidores existentes sin incorporar API ni puerto.

5. Crear `src/clients/vscode/package.json` con los valores del manifiesto del plan.
   Declarar ESM, `./extension.js`, `^1.100.0` y `onView:firstApp.users`.
   La contribución es `firstApp.users`, tipo `webview`, nombre Usuarios, en `explorer`, sin dependencias.

6. Crear `src/clients/vscode/index.html` con los formularios, lista y mensaje del plan.
   Conservar todos sus ids, los textos en español y una sola pantalla.
   Cargar `./styles.css` y `./panel.js` como script clásico.

7. Crear `src/clients/vscode/styles.css` para presentar esa pantalla.
   El estilo cubre los elementos del HTML sin incorporar acciones ni textos nuevos.

8. Crear `src/clients/vscode/extension.js` con `activate` y el proveedor objeto.
   Importar `vscode`, `readFileSync` de `node:fs` y las cinco operaciones de lógica con `.js`.
   Resolver la vista con scripts habilitados, raíz local de la extensión y HTML con `asWebviewUri`.
   Atender los cinco mensajes con las respuestas del plan y `error.message`, sin clases ni `this`.

9. Crear `src/clients/vscode/panel.js` sin imports y con los globales del plan.
   Mantener la acción pendiente; enviar los ids como texto y escribir con `textContent`.
   Pedir la lista al abrir y tras crear, modificar o borrar; mostrar los cinco datos y los errores.
   Enviar nombre/email vacíos al crear y solo campos con texto al modificar; borrar no muestra usuario.

10. Ejecutar `corepack pnpm format` desde la aplicación.
    El formato incluye el JavaScript del nuevo cliente y termina correctamente.

11. Ejecutar `corepack pnpm lint` desde la aplicación.
    La revisión de JavaScript termina correctamente.

12. Iniciar la base con `corepack pnpm server` y ejecutar `corepack pnpm vscode` en PowerShell.
    La ventana de desarrollo abre la aplicación y la barra lateral contiene Usuarios.
    Una lista sin usuarios queda vacía.

13. Crear Ada con `ada@example.com` y consultar el id devuelto.
    Crear y consultar muestran id, nombre, email y ambas fechas; la lista incluye a Ada.

14. Modificar ese id enviando solo el nombre Ada Lovelace y dejando el email vacío.
    El resultado y la lista muestran el nombre nuevo, conservando el id y el email.

15. Intentar crear con nombre vacío, email inválido y email ocupado.
    Se muestran `Name is empty`, `Email is invalid` y `Email is already used`, respectivamente.

16. Consultar, modificar y borrar un id inexistente.
    Las tres operaciones muestran `User not found`.

17. Borrar el id de Ada.
    No se muestra un usuario como resultado y Ada desaparece de la lista.
    Si no quedan usuarios, la lista queda vacía.

18. Detener la base y ejecutar las cinco acciones desde la vista.
    Crear y listar muestran `Could not create the user` y `Could not list the users`.
    Consultar y modificar muestran `Could not find the user` y `Could not update the user`.
    Borrar muestra `Could not delete the user`.

19. Revisar que la entrega contiene únicamente los archivos y cambios del plan.
    No cambian lógica, consultas, base, otros clientes, dependencias ni lockfile.
    No aparecen README nuevo, `.vscode/`, API, puerto, instalador ni publicación.
