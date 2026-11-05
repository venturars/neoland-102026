Issue: #1110

# Usuarios por HTTP nativo y cinco notebooks

Quien prueba la aplicación necesita crear, listar, consultar, modificar y
borrar usuarios desde un cliente HTTP adicional en `http://127.0.0.1:3004`.
Cinco documentos de Jupyter Notebook permiten probar una operación por
documento desde Windows, conservando el cliente Jupyter actual.

## Comportamiento

Crear recibe nombre y email; devuelve 201 y el usuario con identificador,
nombre, email y fechas de creación y modificación. Listar devuelve 200 y
los usuarios, o una lista vacía. Consultar recibe un identificador y
devuelve 200 y ese usuario. Modificar recibe el identificador y nombre,
email o ambos; devuelve 200 y conserva los campos omitidos. Borrar recibe
el identificador y devuelve 204 sin contenido.

Ejemplo: crear Ada con `ada@example.com`, mostrarla en la lista, consultarla
por su identificador real, cambiar su nombre a Ada Lovelace conservando
el email y borrarla. La lista vuelve a quedar vacía.

Los cinco documentos muestran los resultados del recorrido y explican sus
casos de error, incluyendo el servicio de datos disponible y detenido.
Se utilizan usuarios ficticios en una copia de ensayo, sin datos personales.

## Errores visibles

| Caso                                                 | Estado y mensaje                |
| ---------------------------------------------------- | ------------------------------- |
| Nombre vacío al crear o modificar                    | 400 `Name is empty`             |
| Email inválido al crear o modificar                  | 400 `Email is invalid`          |
| Email usado por otro usuario                         | 409 `Email is already used`     |
| Usuario inexistente al consultar, modificar o borrar | 404 `User not found`            |
| Crear sin nombre                                     | 500 `Could not create the user` |
| Servicio de datos detenido al crear                  | 500 `Could not create the user` |
| Servicio de datos detenido al listar                 | 500 `Could not list the users`  |
| Servicio de datos detenido al consultar              | 500 `Could not find the user`   |
| Servicio de datos detenido al modificar              | 500 `Could not update the user` |
| Servicio de datos detenido al borrar                 | 500 `Could not delete the user` |

Los errores devuelven un objeto con `message` y el texto indicado. Una
dirección desconocida devuelve 404 sin contenido. Se conserva el
comportamiento existente, incluida la diferencia entre nombre vacío y
nombre omitido al crear.

## Límites

No hay reglas de negocio nuevas, autenticación ni operaciones adicionales.
Se conservan los demás clientes, sus comandos y las dependencias actuales.
La incorporación contempla actualizar el árbol y la arquitectura del
proyecto. Esta etapa prepara únicamente spec y plan para revisión humana;
las tareas y la implementación requieren sus aprobaciones posteriores.
