Issue: #1101

# Probar usuarios con Bruno en Windows

La persona que usa la aplicación necesita comprobar en Bruno las cinco
operaciones de usuarios de la API Express existente desde Windows y VS Code.
Se reutilizan la colección y la guía disponibles, conservando su cobertura.

## Resultado esperado

Con datos ficticios y una lista inicialmente vacía, crear a Ada con nombre
`Ada` y email `ada@example.com` devuelve 201 y su identificador, nombre,
email y fechas de creación y modificación. Listar, consultar y modificar
devuelven 200; borrar devuelve 204 sin contenido.

Modificar solo el nombre conserva el email; modificar solo el email
conserva el nombre. También se comprueban ambos campos, campos omitidos,
la conservación del identificador y la fecha de creación, y la conservación
de Grace después de modificar o borrar a Ada.

Los errores visibles conservan los mensajes actuales:

| Caso                                                 | Estado y mensaje                |
| ---------------------------------------------------- | ------------------------------- |
| Nombre vacío                                         | 400 `Name is empty`             |
| Email inválido                                       | 400 `Email is invalid`          |
| Email usado por otro usuario                         | 409 `Email is already used`     |
| Usuario inexistente al consultar, modificar o borrar | 404 `User not found`            |
| Crear sin nombre                                     | 500 `Could not create the user` |
| Servicio de datos detenido al crear                  | 500 `Could not create the user` |
| Servicio de datos detenido al listar                 | 500 `Could not list the users`  |
| Servicio de datos detenido al consultar              | 500 `Could not find the user`   |
| Servicio de datos detenido al modificar              | 500 `Could not update the user` |
| Servicio de datos detenido al borrar                 | 500 `Could not delete the user` |

Una dirección desconocida devuelve 404 sin contenido. Los errores no
modifican los usuarios. Al terminar se eliminan únicamente los dos usuarios
ficticios y la lista vuelve a quedar vacía.

## Comprobación y límites

La guía permite preparar un ensayo aislado desde PowerShell, abrir la
colección en Bruno dentro de VS Code, ejecutar 25 peticiones con el servicio
de datos disponible y después cinco con ese servicio detenido. Las 30 deben
pasar sus comprobaciones. No se utilizan datos personales ni se detienen
procesos ajenos al ensayo.

Se conserva el comportamiento de la API y de los clientes existentes.
No se incorporan operaciones, dependencias ni herramientas nuevas. Si una
corrección futura añade o elimina archivos, deberá contemplar la actualización
del árbol del proyecto y su documentación de arquitectura.

Esta etapa prepara la revisión de spec y plan. Las tareas y la implementación
requieren las aprobaciones posteriores del workflow.
