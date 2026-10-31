Issue: #702

# Tareas del cliente de usuarios

- [ ] Revisión explícita de `spec.md`, `plan.md` y `tasks.md` pendiente antes de modificar código.

## 1. Conectar las operaciones al servidor local

Crear el cliente de `src/clients/http/` con una función por archivo y añadir `pnpm start`.
Dejar las cuatro rutas de usuarios conectadas a lógica existente y servir únicamente los archivos públicos declarados.

## 2. Comprobar las peticiones HTTP

Crear `tests/http-client.test.js` y activar `node --test` en `package.json`.
Dejar comprobados usuarios, validación, persistencia, errores y archivos privados con servidor y base temporales; cerrar los recursos.

## 3. Construir la selección de usuario

Crear `index.html`, `styles.css` y las funciones correspondientes en `src/clients/web/`.
Dejar una lista con id, nombre y email, selección sin contraseña y estados vacíos y de error, sin frameworks.

## 4. Construir el menú y la navegación

Añadir el menú del usuario seleccionado y los botones de volver, modificar e «Ir a notas».
Dejar navegación entre las tres pantallas y «Ir a notas» visible y deshabilitada, sin pantalla ni petición asociada.

## 5. Añadir la edición y el borrado de usuario

Crear las funciones del formulario para guardar nombre y email y confirmar el borrado del usuario.
Dejar cancelaciones sin cambios, errores que conserven los campos y bloqueo de envíos duplicados, con comentarios en inglés sencillo.

## 6. Revisar las pantallas y los clientes existentes

Recorrer los casos de la spec en navegador con teclado y ancho móvil, usando datos temporales.
Comprobar terminal y Jupyter desde una copia temporal, sin modificar su catálogo ni la base real.

## 7. Actualizar las guías del comportamiento implementado

Añadir el arranque y uso en `README.md` y actualizar árbol y arquitectura en `docs/`.
Ajustar alcance y recorrido de la constitución al cliente de navegador, manteniendo sus reglas de trabajo y el almacenamiento actual.

## 8. Comprobar y guardar el resultado

Ejecutar `pnpm test`, `pnpm format` y `pnpm lint`; revisar comentarios, alcance y archivos modificados.
Registrar los resultados reales en estas tareas y en el PR, y guardar únicamente los cambios de este pedido.
