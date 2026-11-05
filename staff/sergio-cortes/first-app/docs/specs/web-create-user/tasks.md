# Tareas — alta de usuario en el cliente de navegador

Issue: #962.

1. Abrir `src/clients/web/index.html`.
   Dentro de `#selection-screen`, después del formulario de lista, añadir un `div` con título, descripción y un formulario de nombre y email (`create-user-form`, `create-user-name`, `create-user-email`).
   No se reutilizan los `id` de edición. El menú y la edición no cambian.

2. Abrir `src/clients/web/styles.css`.
   El recuadro de alta queda aparte del desplegable: margen, padding y borde con las variables ya usadas.
   No se cambia la paleta ni los estilos de menú, edición o popover.

3. Abrir `src/clients/web/app.js`.
   Importar `createUser`. El envío del formulario llama a `createUser({ name, email })` como `saveUser` llama a `updateUser`.
   Si falla, se muestra el mensaje de `src/logic/`, sin traducirlo. Si acierta, se vacían los campos y se vuelve a pedir la lista.
   Enlazar el formulario en `initializeClient`. No se importa `user-gender-count.js`.

4. Abrir `docs/ARCHITECTURE.md`.
   En `src/clients/web/`, la pantalla de selección incluye el recuadro de alta y `app.js` llama a `createUser`.
   No se toca `docs/TREE.md`. No se copian los cambios a electron ni a Chrome.

5. `pnpm run format` y `pnpm run lint` sobre lo tocado.
   No cambia `src/logic/`, `src/queries/`, `src/db/` ni los otros clientes.

6. Desde `first-app`, `pnpm server` y `pnpm web`.
   En la pantalla inicial hay dos recuadros: lista y alta.
   Crear un usuario válido: sale en el desplegable. Nombre vacío: `Name is empty`. Email inválido: `Email is invalid`. Email repetido: `Email is already used`.
