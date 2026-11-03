# Cliente web de usuarios y notas

Issue: #778 (documentación) y #788 (implementación). Fecha: 2026-11-03.

Estado: la propuesta documental original precede a la autorización de implementación registrada al final. Las comprobaciones reales se anotan en tareas.

## Problema y personas

Quien usa first-app necesita gestionar su usuario y sus notas desde pantallas sencillas, sin editar ejemplos de terminal. Selecciona quién es en una lista, sin contraseña, y navega por sus opciones.

## Recorrido

1. Selección: lista de usuarios con ID y nombre; elegir uno abre su menú.
2. Menú: muestra al usuario elegido y permite volver a selección, modificar usuario o ir a notas.
3. Edición de usuario: modificar nombre y correo, guardar, volver sin guardar o eliminar. Borrar solicita confirmar que se perderán también todas sus notas; cancelar conserva todo y confirmar vuelve a selección.
4. Notas: listado del usuario, estado vacío, crear y abrir una nota, y volver al menú.
5. Consulta y edición: mostrar una nota completa, editar título/contenido, guardar, volver al listado o eliminar con confirmación. Crear ofrece los mismos campos; cancelar no escribe.

## Criterios de aceptación

- **W-01:** Al abrir la aplicación aparece la lista con ID y nombre; seleccionar un usuario existente abre su menú sin credenciales. Si no hay usuarios se explica cómo prepararlos con los clientes existentes.
- **W-02:** El menú ofrece volver, modificar usuario y notas, e identifica al usuario activo. Volver a selección descarta esa selección.
- **W-03:** Editar muestra nombre y correo guardados; guardar datos válidos actualiza lo visible y lo persistido. Los datos inválidos muestran un mensaje y conservan lo escrito para corregirlo.
- **W-04:** Cancelar la eliminación del usuario conserva usuario y notas; confirmarla los elimina y vuelve a selección. Otros usuarios permanecen.
- **W-05:** La pantalla de notas lista únicamente las del usuario activo y ofrece crear; sin notas se muestra un estado vacío útil.
- **W-06:** Crear y guardar una nota válida permite verla en la lista y consultar todo su contenido; se mantiene tras cerrar y abrir la aplicación.
- **W-07:** Guardar cambios de una nota actualiza sus datos; volver o cancelar sin guardar no escribe los cambios locales.
- **W-08:** Cancelar el borrado de una nota conserva su contenido; confirmar la elimina y actualiza el listado.
- **W-09:** Un usuario o nota que ha desaparecido produce un mensaje claro y una salida a selección o listado, respectivamente. Los errores de comunicación conservan los formularios y permiten reintentar sin anunciar éxito.
- **W-10:** Títulos y contenidos se muestran como texto, incluidos caracteres con aspecto de código. La combinación de IDs de usuarios distintos no recupera ni modifica notas ajenas.
- **W-11:** Las pantallas son utilizables con teclado y a 390 px de ancho, con etiquetas, foco visible, mensajes accesibles y sin desplazamiento horizontal de página.
- **W-12:** Recargar vuelve a la selección; los datos guardados permanecen. La aplicación muestra los estados de carga y evita dobles envíos mientras una operación está pendiente.

## Límites y decisiones

La selección representa el contexto de trabajo, no introduce una cuenta autenticada. No se crean usuarios desde esta interfaz inicial: se reutilizan los existentes. No se incluye el clasificador, contraseñas, registro de cuentas, sincronización, edición enriquecida ni un despliegue público. Solo hay navegación interna; los botones de volver no dependen del historial del navegador. Volver/cancelar descarta cambios sin confirmación adicional; las eliminaciones sí requieren confirmación.

Depende de [notas](../notes/spec.md) y del contrato existente de [usuarios](../users/spec.md). [Plan](plan.md) y [tareas](tasks.md). No hay preguntas pendientes para esta propuesta.

## Implementación autorizada · 2026-11-03 · Issue #788

Diego pidió continuar con el cliente web después de la entrega de notas. Esta autorización cubre implementación, comprobación y entrega de HTTP y pantallas vanilla; no atribuye una revisión individual de los documentos. La rama de implementación parte de la de notas de la PR #787, que depende de la propuesta documental de la PR #781. La aplicación usa una copia temporal para las comprobaciones, sin migrar la base personal.
