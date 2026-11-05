# Notas por usuario

Issue: #778. Fecha: 2026-11-03.

Estado actual: persistencia y lógica implementadas y comprobadas por el agente el 2026-11-03, issue #782. Revisión de la PR y merge pendientes; no se atribuye conformidad final a Diego. La propuesta documental original se entregó en la issue #778 antes de la autorización de implementación.

## Necesidad y personas

Quien utiliza first-app necesita guardar y recuperar sus notas, diferenciándolas de las de los demás usuarios. La persona selecciona un usuario y gestiona las notas asociadas a él.

## Historias de usuario

- Como usuario, quiero crear una nota con título y contenido para conservar información.
- Quiero listar y consultar mis notas, modificarlas y eliminarlas cuando dejen de ser útiles.
- Quiero que borrar mi usuario elimine también sus notas, después de una confirmación explícita en la pantalla.

## Reglas

Cada nota tiene identificador, usuario asociado, título, contenido y fechas de creación y modificación. El título se recorta en los extremos y no puede quedar vacío. El contenido es texto, admite estar vacío y conserva sus espacios y saltos de línea. No se interpreta como formato enriquecido.

Crear recibe título y contenido. Actualizar admite uno o ambos campos; conserva los omitidos, exige algún cambio definido y no admite otros campos ni valores nulos. Una nota no se transfiere a otro usuario. Los IDs son enteros positivos seguros. Listar ordena por ID ascendente.

Cada operación exige que exista el usuario. Consultar, modificar o eliminar una nota exige que pertenezca al usuario indicado. El borrado de un usuario elimina definitivamente sus notas; las de otros usuarios permanecen. La confirmación pertenece a la interfaz: los clientes de terminal siguen realizando las operaciones expresamente invocadas.

## Criterios de aceptación

- **N-01:** Dado un usuario existente, al crear una nota válida se devuelven sus datos e identificador y queda asociada a ese usuario.
- **N-02:** Dado un usuario con notas, al listarlas se devuelven únicamente las suyas en orden; sin notas, se devuelve una lista vacía.
- **N-03:** Dada una nota del usuario indicado, al consultarla se recuperan todos sus campos sin modificarla.
- **N-04:** Al actualizar título, contenido o ambos, se conservan los campos omitidos y la fecha de creación, y se renueva la de modificación.
- **N-05:** Al borrar una nota del usuario indicado, deja de estar disponible; repetir el borrado comunica su ausencia.
- **N-06:** IDs, objetos o campos inválidos se rechazan con mensajes claros y sin escribir datos.
- **N-07:** Un usuario inexistente se comunica como tal; una nota inexistente o perteneciente a otro usuario se comunica como nota no encontrada.
- **N-08:** Al preparar el almacenamiento nuevo o existente de forma explícita y repetida, se conservan usuarios, notas y fechas ya guardados. Cerrar y abrir la aplicación conserva los datos.
- **N-09:** Al eliminar un usuario se eliminan sus notas en la misma operación; un fallo no deja un borrado parcial y los demás usuarios y notas permanecen.
- **N-10:** Los títulos y contenidos con tildes, emojis, saltos de línea o aspecto de código se conservan como texto.

## Fuera de alcance

Compartir notas, búsqueda, etiquetas, adjuntos, papelera, formato enriquecido, contraseñas y sincronización externa. Las pantallas y su confirmación se definen en [cliente web](../vanilla-web-client/spec.md).

## Seguimiento

Decisiones de partida: título obligatorio y contenido que admite vacío; sin límites arbitrarios de longitud en las reglas de negocio. No hay preguntas de alcance pendientes para esta propuesta. [Plan](plan.md) y [tareas](tasks.md).

## Implementación autorizada · 2026-11-03 · Issue #782

Diego solicitó continuar con la persistencia y lógica de notas tras recibir los documentos. Autoriza implementar, comprobar y entregar este bloque con sus clientes de terminal y el notebook de preparación. Se conserva el registro documental previo; no se atribuye una revisión individual distinta de esa autorización. El cliente web sigue fuera de este bloque. La PR de implementación depende de las specs de la PR #781 mientras no estén integradas.
