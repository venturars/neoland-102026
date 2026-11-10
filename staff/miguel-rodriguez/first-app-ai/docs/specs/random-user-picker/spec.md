# Elegir un contacto al azar

Issue: [#1174](https://github.com/venturars/neoland-102026/issues/1174).
Estado: aprobada por Miguel el 2026-11-09.

## Propósito

Quien usa first-app-ai quiere elegir al azar un contacto guardado para decidir
quién empieza un ejercicio. Puede hacerlo desde la web o mediante un ejemplo
copiable de terminal.

## Entrada y resultado

El sorteo no recibe parámetros. Cada solicitud obtiene los contactos guardados
para ese sorteo y elige uno, dando la misma probabilidad a cada contacto,
identificado por su ID. Dos contactos con el mismo nombre participan por separado.

Los sorteos son independientes: un contacto puede salir varias veces seguidas.
Con un único contacto, siempre sale ese contacto.

Cuando hay un elegido, el resultado es un objeto ordinario nuevo con exactamente
`id`, `name`, `email`, `createdAt` y `updatedAt`, conservando sus valores guardados.
Con una tabla inicializada y vacía, el resultado es `null`: no hay nadie disponible.

El sorteo conserva los registros y sus fechas, tanto si termina correctamente
como si falla.

## Comportamiento visible

El cliente web ofrece una acción «Elegir al azar». Muestra el nombre, email e ID
del elegido en un resultado separado de la selección de usuario. Sortear no
cambia la identidad seleccionada para editar ni abre su formulario.

Al empezar otro sorteo, la web retira el resultado anterior. Al terminar muestra
el contacto elegido, el estado vacío o el fallo correspondiente.

El ejemplo de terminal espera la misma operación compartida y muestra el contacto,
un mensaje de que no hay contactos o el error, según el resultado.

## Fallos

Si no se pueden recuperar los contactos, la operación falla con
`Could not pick a user`. La web comunica el fallo y el terminal muestra ese error.
No se presenta un contacto como resultado de esa solicitud.

Una tabla sin inicializar y un servicio de datos detenido son fallos de
recuperación; se distinguen de una tabla inicializada sin contactos.

## Criterios de aceptación

- **CA-01 · Selección:** con varios contactos, incluidos IDs discontinuos, se
  elige un contacto de la lista recuperada, con igual probabilidad por contacto.
  Los cinco campos devueltos coinciden con los del contacto guardado.
- **CA-02 · Repeticiones:** cada solicitud realiza un sorteo independiente.
  El resultado anterior no excluye a nadie del siguiente.
- **CA-03 · Un contacto:** web y terminal eligen siempre al único contacto.
- **CA-04 · Lista vacía:** con la tabla inicializada y vacía, el resultado es
  `null`; ambos clientes comunican que no hay contactos y la web conserva vacío
  el espacio del resultado.
- **CA-05 · Datos actuales:** si después de un sorteo se cambian los contactos
  guardados para dejar solo uno, la siguiente solicitud elige ese contacto.
- **CA-06 · Recuperación fallida:** con tabla sin inicializar o servicio detenido,
  ambos clientes comunican el fallo. La web retira cualquier resultado anterior.
- **CA-07 · Identidad y datos:** los sorteos conservan registros, fechas y la
  identidad seleccionada para editar. Las operaciones existentes mantienen sus
  contratos.
- **CA-08 · Uso y documentación:** web y terminal usan la misma operación
  compartida. Las instrucciones permiten ejecutar ambos clientes; las guías de
  comportamiento, errores, arquitectura e inventario reflejan la incorporación.

## Alcance

Esta entrega cubre la operación compartida, el control web y el ejemplo de
terminal. Otros clientes, historial de sorteos y exclusión de ganadores quedan
para tareas independientes.
