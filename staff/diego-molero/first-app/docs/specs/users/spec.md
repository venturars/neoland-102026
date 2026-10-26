# Gestión de usuarios

**Estado:** contrato actualizado el 21 de octubre de 2026.
Las operaciones devuelven los datos directamente y señalan los fallos con Error.

## Objetivo y alcance

Crear, actualizar, eliminar, listar y buscar usuarios por correo o identificador.
Preparar el almacenamiento de forma explícita sin perder datos existentes.
No incluye autenticación, contraseñas, interfaz web ni clasificación de nombres.
La clasificación tiene su [propia especificación](../classifier/spec.md).

## Datos y reglas

- Cada usuario tiene identificador, nombre, correo, fecha de creación y fecha
  de actualización. No se aceptan campos de entrada distintos de nombre y correo.
- El nombre es texto obligatorio; se eliminan los espacios de los extremos.
- El correo es texto obligatorio, se recorta y pasa a minúsculas. Tiene un único
  @, contenido a ambos lados, ningún espacio interior y como máximo 64 caracteres.
  Esta comprobación no verifica que exista el buzón.
- El correo normalizado es único. Un conflicto no modifica al usuario que ya lo usa.
- Los identificadores de entrada son enteros positivos seguros.
- Actualizar admite nombre, correo o ambos. Conserva campos omitidos o undefined,
  rechaza null y exige al menos un campo definido. Puede conservar el correo del
  propio usuario. Mantiene la fecha de creación y actualiza la de modificación.
- Eliminar es definitivo. Actualizar, eliminar o buscar un usuario inexistente
  comunica que no se ha encontrado.
- Listar devuelve los usuarios ordenados por identificador y una lista vacía
  cuando no hay usuarios. Las búsquedas y el listado no modifican datos.
- Las respuestas de usuario incluyen solo los cinco campos públicos indicados.
- Una validación fallida o un usuario inexistente lanza una excepción con un
  mensaje claro. Crear, actualizar y buscar devuelven el usuario; listar devuelve
  la lista y eliminar no devuelve datos.
- Preparar el almacenamiento varias veces conserva los usuarios y sus fechas.
  Una operación fallida por validación no crea ni modifica usuarios.

## Criterios de aceptación

- **US-01:** crear un usuario válido devuelve sus datos normalizados e identificador.
- **US-02:** rechazar entradas, nombres, correos e identificadores inválidos.
- **US-03:** rechazar correos duplicados al crear y al actualizar.
- **US-04:** actualizar parcialmente conserva campos omitidos y fecha de creación.
- **US-05:** buscar por ID o correo normalizado devuelve el usuario o informa de su ausencia.
- **US-06:** listar devuelve todos los usuarios en orden, o una lista vacía.
- **US-07:** eliminar impide encontrar después a ese usuario; repetir el borrado
  informa de su ausencia.
- **US-08:** preparar el almacenamiento de forma explícita y repetible conserva datos.

Las decisiones técnicas están en el [plan](plan.md); el estado y las comprobaciones
se registran en [tareas](tasks.md). Los criterios describen el comportamiento
esperado, sin implicar que todas sus variantes se hayan comprobado manualmente.
