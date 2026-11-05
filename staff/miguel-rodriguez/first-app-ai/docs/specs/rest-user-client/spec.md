# Cliente REST de usuarios

Issue: [#909](https://github.com/venturars/neoland-102026/issues/909) ·
PR: [#912](https://github.com/venturars/neoland-102026/pull/912).
Estado: aprobada por Miguel el 2026-11-04.

## Propósito

Quien prueba first-app-ai necesita crear, listar, consultar, modificar y eliminar
usuarios por HTTP desde Postman, utilizando los mismos datos y reglas que los
clientes existentes.

## Comportamiento

El cliente REST y el servicio de datos se arrancan por separado. Las peticiones
operan sobre la base compartida de la app.

| Operación | Entrada | Resultado |
| --- | --- | --- |
| Crear | Nombre y email | Usuario creado. |
| Listar | Ninguna | Usuarios ordenados por ID ascendente; [] si la tabla está vacía. |
| Consultar | ID del usuario | Usuario guardado. |
| Modificar | ID y nombre, email o ambos | Usuario actualizado; los campos omitidos conservan su valor. |
| Eliminar | ID del usuario | Confirmación mediante estado HTTP y cuerpo vacío. |

Cada usuario devuelto contiene exactamente id, name, email, createdAt y updatedAt.
Las respuestas de creación, consulta, modificación y listado son JSON. Los estados
HTTP distinguen creación, éxito, datos inválidos, conflicto de email, usuario
inexistente y fallo del servicio; sus valores se concretarán en el plan.

Las operaciones mantienen la normalización y validación existentes. Eliminar
recibe únicamente el ID: la confirmación por email del cliente web pertenece a
su interfaz. Las consultas conservan registros y fechas; modificar y eliminar
solo afectan al usuario solicitado. Los cambios se ven desde los otros clientes.

## Errores visibles

| Situación | Mensaje |
| --- | --- |
| Nombre vacío tras quitar espacios | Name is empty |
| Email inválido según las reglas actuales | Email is invalid |
| Email utilizado por otro usuario | Email is already used |
| ID sin usuario guardado | User not found |
| Fallo de acceso a datos al crear | Could not create the user |
| Fallo de acceso a datos al listar | Could not list the users |
| Fallo de acceso a datos al consultar | Could not find the user |
| Fallo de acceso a datos al modificar | Could not update the user |
| Fallo de acceso a datos al eliminar | Could not delete the user |

Un fallo devuelve el mensaje correspondiente en JSON y el estado HTTP adecuado.
Se conserva el orden de validación de las operaciones actuales; por ejemplo,
modificar un usuario inexistente informa de ello antes de validar sus campos.

## Ejemplo y aceptación

En una copia y base desechables, preparar la tabla y arrancar ambos servicios.
Desde Postman:

1. Listar la tabla vacía devuelve []. Crear Ada con ada@example.com devuelve
   sus cinco campos; utilizar el ID recibido para las peticiones siguientes.
2. Listar y consultar ese ID devuelven el usuario guardado.
3. Cambiar solo el nombre a Ada Lovelace conserva el email. Cambiar después
   el email se refleja al consultar de nuevo y desde los demás clientes.
4. Crear otro usuario y probar un email duplicado. Probar también nombre vacío,
   email inválido e ID inexistente: se ven los errores y estados correspondientes.
5. Eliminar Ada devuelve un cuerpo vacío. Desaparece del listado y consultar su
   ID informa User not found; el otro usuario permanece intacto.
6. Detener el servicio de datos produce el error de acceso correspondiente a
   cada operación. Al reiniciarlo se recupera el acceso a los datos guardados.

Registrar métodos, direcciones, estados, cuerpos y resultados reales de Postman.
La entrega incluye instrucciones de uso, inventario y responsabilidades actualizados,
y las comprobaciones de formato y lint del proyecto.

## Alcance

Las cinco operaciones descritas. Se conservan las reglas de negocio, el servicio
de datos y los clientes actuales. Autenticación, permisos, notas, búsqueda por
nombre o email y clasificación por género quedan para otros desarrollos.

Fuentes revisadas el 2026-11-04: issue #909, constitución, guía de errores y
operaciones actuales de first-app-ai; spec del cliente REST de clase en staging
a8abec19b4ed152c084a14ee3665c8dcb2f566be.
