# Cliente Nest de contactos

Issue #1044 · PR #1050, hacia staging.
Autorización conjunta de Miguel del 2026-11-05 para revisar spec, plan y tareas
y ejecutar esta corrección seguida; conserva las reglas de futuras tareas.

## Propósito

Como persona que prueba la aplicación, quiero crear, listar, consultar, modificar
y borrar contactos mediante el cliente Nest, utilizando los mismos datos y reglas.
Como estudiante, quiero reconocer las clases y decoradores de Nest y cómo el
controlador recibe su servicio mediante inyección de dependencias, manteniendo
compartidas las reglas de negocio.

## Comportamiento esperado

- POST /users recibe nombre y email; devuelve el contacto guardado y estado 201.
- GET /users devuelve los contactos por ID y estado 200; una tabla vacía devuelve [].
- GET /users/:id devuelve el contacto y estado 200.
- PATCH /users/:id recibe el ID y los campos que se quieren cambiar; conserva los
  omitidos y devuelve el contacto actualizado con estado 200.
- DELETE /users/:id elimina ese contacto y devuelve estado 204 sin cuerpo.
- Cada contacto contiene exactamente id, name, email, createdAt y updatedAt.
- Las consultas conservan los registros y sus fechas. Una modificación conserva
  el ID y la fecha de creación. Los rechazos por validación conservan los datos.
- Los errores existentes se presentan como JSON con message: Name is empty y
  Email is invalid, 400; Email is already used, 409; User not found, 404.
  Los fallos de operación devuelven 500 con Could not create the user,
  Could not list the users, Could not find the user, Could not update the user
  o Could not delete the user, según la acción.
- Un error lanzado que no sea uno de esos mensajes devuelve 500 con el Could not
  de la acción; no muestra el texto técnico recibido.
- Una ruta desconocida devuelve 404 sin cuerpo. El cliente aplica las reglas
  existentes y conserva separado el servicio de datos.

Ejemplo: crear Ada, cambiar solo su nombre a Ada Lovelace y comprobar que mantiene
su email, ID y fecha de creación. Borrarla y comprobar que desaparece de la lista.

## Alcance

Entrega independiente de Nest. La versión anterior se retira de #1025; sus otros
clientes y mejoras se conservan. Este cliente ofrece únicamente las cinco
operaciones anteriores. Autenticación, notas y resumen por género quedan fuera.

## Comprobación

Con una copia y datos desechables, recorrer las cinco operaciones por HTTP y en
Postman. Comprobar cinco campos, orden, tabla vacía, actualización de cada campo
por separado, errores, conservación de otro contacto y ruta desconocida. Revisar
que Nest inyecte realmente el servicio en el controlador y que sus decoradores
conecten las peticiones con las operaciones compartidas.
