# Cliente web de contactos

Issue: #760.
Preparación y ejecución delegadas por Miguel el 2026-11-02 para completar el encargo.
No se atribuyen aprobaciones individuales de documentos que no se han solicitado.

## Propósito

Una persona necesita seleccionar quién es de una lista de contactos guardados y
modificar o eliminar ese contacto desde el navegador, sin contraseña.

## Entradas y resultados

La selección se realiza por ID visible junto al nombre y email. Elegir un contacto
abre un menú con Volver, Modificar usuario e Ir a notas. Volver devuelve a la lista.
Modificar muestra nombre y email actuales; Guardar aplica las reglas existentes y
regresa al menú. Eliminar pide confirmación y vuelve a una lista actualizada.
Cancelar un borrado o volver sin guardar conserva los datos.
Notas aparece como opción futura, sin gestión ni almacenamiento de notas: el
encargo del 30 de octubre excluye desarrollar esa parte.

## Criterios de aceptación

- CA-01: La lista muestra los contactos guardados en orden de ID y permite elegir
  uno sin contraseña. Lista vacía y fallo de carga se explican y permiten reintentar.
- CA-02: El menú identifica el contacto y permite volver a la lista o abrir el
  editor. Notas queda visible como funcionalidad pendiente, sin éxito ficticio.
- CA-03: Guardar modifica solo el contacto elegido, normaliza como las operaciones
  actuales y muestra errores de datos o email duplicado sin perder el formulario.
- CA-04: Eliminar exige confirmación; cancelar no borra. Confirmar borra solo al
  elegido y refresca la lista. Si otro cliente ya lo eliminó, se informa y vuelve
  a la selección sin dejar activo un contacto inexistente.
- CA-05: Navegar y consultar no modifica datos o fechas. Los clientes existentes,
  contratos, clasificador, esquema y datos ajenos permanecen iguales.
- CA-06: La interfaz funciona con teclado y móvil, usa etiquetas y estados
  accesibles y muestra datos guardados como texto, sin interpretar contenido.
- CA-07: El arranque local funciona con la tabla vacía, no añade contactos y está
  documentado junto a las verificaciones y límites de la aplicación local.

## Fuera de alcance

Cuentas, contraseñas, permisos, creación de usuarios desde la web, notas CRUD,
clasificador web, despliegue público, cambios de negocio o dependencias nuevas.

## Revisión

Revisada contra el encargo y las operaciones actuales antes del plan. Sin dudas
pendientes: Notas se presenta como futura y el proyecto continúa siendo local.
