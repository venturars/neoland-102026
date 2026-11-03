# Errores

Los fallos se señalan con `throw new Error("...")`, con mensajes en inglés. No hay códigos ni clases propias ni objetos que representen éxito o error.

| Mensaje | Cuándo aparece |
| --- | --- |
| Input is invalid | La entrada no es un objeto admitido o contiene campos desconocidos. |
| Name is invalid | El nombre no es texto; en crear o actualizar también si está vacío. |
| Name is empty | La búsqueda por nombre recibe texto vacío tras recortarlo. |
| Email is invalid | El correo no cumple las reglas de usuarios. |
| Email is already used | Otro usuario tiene el correo normalizado. |
| User ID is invalid | El ID no es un entero positivo seguro. |
| No changes provided | La actualización no contiene campos definidos. |
| User not found | No existe el usuario de una búsqueda individual, cambio o borrado. |
| Could not find the user | Falla la consulta de búsqueda por nombre. |
| Could not classify the users | Falla la lectura, configuración o comunicación del clasificador. |
| Note ID is invalid | El ID de nota no es un entero positivo seguro. |
| Note not found | La nota no existe para el usuario indicado. |
| Note title is invalid | El título no es texto o queda vacío tras recortarlo. |
| Note content is invalid | El contenido no es texto; el texto vacío sí se acepta. |
| Notes schema is incompatible | El esquema existente de notas no cumple el contrato; la preparación hace rollback sin reparar ni borrar datos. |

El plan de cada spec define el orden de validación. Una búsqueda por nombre o un listado sin coincidencias devuelve una lista vacía. Los fallos técnicos de las operaciones actuales se propagan como excepciones; no se sustituyen sus mensajes durante una reorganización.

Los notebooks muestran el mensaje de Node cuando una operación falla. Si no encuentran la aplicación, muestran `No encuentro la app.`. Los fallos de preparación de Jupyter terminan con estado de error.
