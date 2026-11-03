# Cliente web de contactos

Issue: #760 · PR: #762, hacia staging.
Corrección solicitada y spec aprobada por Miguel el 2026-11-03.
Sustituye la versión de ejemplos guardados en el navegador.

## Propósito

Seleccionar y modificar desde las tres pantallas existentes los mismos contactos
que utilizan Terminal y Jupyter, aprovechando el acceso compartido de #822.

## Comportamiento y aceptación

- **CA-01 · Selección:** al abrir la dirección local de la app, mostrar los
  contactos guardados, ordenados por ID. Elegir uno por su ID abre su menú, sin
  contraseña. Si no hay contactos, mostrar la lista vacía.
- **CA-02 · Navegación:** conservar Volver, Modificar usuario e Ir a notas.
  Notas sigue visible y deshabilitado como opción futura. Volver sin guardar
  conserva los datos anteriores.
- **CA-03 · Edición:** guardar nombre y email mediante las operaciones existentes,
  esperando su resultado antes de anunciar éxito. Mostrar sus errores, incluidos
  nombre vacío y email duplicado. Los cambios se ven también desde Terminal y
  Jupyter y siguen disponibles al recargar o reiniciar el servicio.
- **CA-04 · Correo:** aplicar la normalización y las validaciones de las
  operaciones compartidas, descritas en [la constitución](../../CONSTITUTIONS.md).
  Web, Terminal y Jupyter aceptan los mismos correos. Mostrar los errores de
  email inválido o duplicado junto al campo y permitir corregirlo sin perder
  el nombre escrito.
- **CA-05 · Borrado:** antes de eliminar, pedir escribir el email guardado del
  contacto seleccionado. Compararlo tras quitar espacios de los extremos y
  convertirlo a minúsculas. Un valor vacío o diferente no elimina nada y permite
  corregir o cancelar. Solo volver a la lista actualizada tras confirmar el
  resultado del borrado; conservar los demás contactos.
- **CA-06 · Datos compartidos:** cargar, guardar y borrar usan los contactos del
  servicio existente. Retirar los ejemplos, su restablecimiento y el uso de
  localStorage. Una lectura no cambia registros ni fechas; una edición o borrado
  afecta únicamente al contacto elegido.
- **CA-07 · Fallos:** informar errores de carga, guardado o borrado, sin presentar
  una copia ficticia como datos actuales. Permitir reintentar; conservar los
  campos editados cuando falla el guardado. Si el contacto ya no existe,
  comunicarlo y permitir volver a cargar la lista.
- **CA-08 · Uso:** conservar el diseño, el teclado y la adaptación móvil. Las
  instrucciones explican cómo arrancar el servicio, preparar la tabla por
  separado y abrir la app. Arrancar el servicio no crea la tabla. Repetir la
  preparación conserva los contactos. Las guías reflejan la conexión real.

## Alcance

Usar la lógica y el servicio local existentes, sin nuevas dependencias. Mantener
el esquema, los datos guardados, el clasificador y los clientes Terminal/Jupyter.
No añadir cuentas, creación de contactos, gestión de notas ni despliegue público.
La confirmación por email evita un borrado accidental; no autentica al usuario.

## Comprobación

Usar una copia con contactos ficticios. Recorrer las tres pantallas, probar email
inválido/duplicado, cancelaciones y confirmación por email. Comprobar cambios entre
web, Terminal y Jupyter, persistencia, lista vacía, contacto eliminado desde otro
cliente y servicio detenido. Verificar teclado, móvil, formato y lint, conservando
la base de trabajo.
