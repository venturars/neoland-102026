Issue: #702

# Tareas del cliente de usuarios y notas

- [ ] Revisión explícita de `spec.md`, `plan.md` y `tasks.md` pendiente antes de modificar código o esquema.

## 1. Preparar las consultas de notas

Crear los seis SQL de `src/queries/queries/notes-*.sql` y sus funciones en `src/queries/notes/`, una por archivo.
Dejar alta, lectura, listado, modificación y borrado limitados por usuario, con fechas de SQLite y preparación idempotente.

## 2. Asegurar la relación con usuarios

Abrir `src/db/connection.js` y hacer explícitas las claves foráneas.
Dejar el borrado en cascada definido por la tabla de notas, conservando la tabla y los datos de usuarios.

## 3. Crear las funciones de negocio de notas

Crear las cinco funciones de `src/logic/` indicadas en el plan, una por archivo.
Dejar validación, pertenencia, respuestas saneadas y errores comprensibles, con comentarios educativos en inglés sencillo.

## 4. Añadir los ejemplos de terminal

Crear un `.txt` por operación de notas en `src/clients/terminal/`.
Dejar una sola línea correcta en cada archivo y comprobar los ejemplos con usuarios y notas de una base temporal.

## 5. Comprobar el negocio con datos temporales

Crear `tests/notes.test.js` y activar `node --test` en `package.json`.
Dejar comprobados CRUD, errores, aislamiento, persistencia, cascada y regresión de usuarios sin tocar la base real.

## 6. Conectar las operaciones al servidor local

Crear el cliente de `src/clients/http/` con una función por archivo y añadir `pnpm start`.
Dejar las rutas del plan conectadas a lógica y servir exclusivamente los archivos públicos declarados.

## 7. Comprobar las peticiones HTTP

Crear `tests/http-client.test.js` con servidor y base temporales.
Dejar comprobados respuestas, entradas inválidas, errores y rechazo de archivos privados; cerrar todos los recursos.

## 8. Construir selección, menú y edición de usuario

Crear `index.html`, `styles.css` y las funciones correspondientes en `src/clients/web/`.
Dejar selección por id, navegación, guardado, confirmación de borrado y mensajes en español, sin frameworks.

## 9. Completar las notas y la navegación

Añadir las funciones del cliente web para listar, crear, editar y confirmar el borrado de notas.
Dejar cancelaciones seguras, contexto del usuario, estados vacíos y errores que permitan corregir o reintentar.

## 10. Revisar las pantallas y los clientes existentes

Recorrer los casos de la spec en navegador con teclado y ancho móvil, usando datos temporales.
Comprobar terminal y Jupyter desde una copia temporal, sin modificar su catálogo ni la base real.

## 11. Actualizar las guías del comportamiento implementado

Añadir el arranque y uso en `README.md`; actualizar árbol, arquitectura, base de datos y errores en `docs/`.
Ajustar alcance y recorrido de la constitución a lo implementado, manteniendo sus reglas de trabajo.

## 12. Comprobar y guardar el resultado

Ejecutar `pnpm test`, `pnpm format` y `pnpm lint`; revisar comentarios, alcance y archivos modificados.
Registrar los resultados reales en estas tareas y en el PR, y guardar únicamente los cambios de este pedido.
