# Cliente Jupyter para las operaciones de contactos

Estado: alcance revisado. Miguel autorizó completar la tarea y dejar la PR lista para revisión el 2026-10-26; esa autorización conjunta sustituye las pausas intermedias para esta entrega.
Fecha: 2026-10-26.
Issue: [#370](https://github.com/venturars/neoland-102026/issues/370), asignada a mglnglxx.
PR de entrega: [#371](https://github.com/venturars/neoland-102026/pull/371), destino staging; pendiente de revisión de compañeros.
Referencia del ejercicio: [PR #358](https://github.com/venturars/neoland-102026/pull/358) y clase del 26 de octubre. Desarrollo propio para first-app-ai; las tareas de AsistenciApp siguen independientes.

## Propósito y usuarios

Hoy comprobamos las operaciones copiando ejemplos en la terminal. Queremos documentos que expliquen cada operación y permitan ejecutarla desde el navegador. Miguel, sus compañeros y una persona de negocio deben poder entender qué hace la aplicación y validar sus resultados sin escribir lógica nueva ni construir un frontend.

El cliente muestra nuestras operaciones actuales. No copia la implementación de Ventura ni cambia sus reglas para que coincidan con una explicación de plantilla.

## Experiencia y entradas

El usuario arranca el cliente con un comando documentado del proyecto. Se abre Jupyter Notebook en el navegador, con un documento por operación. La primera ejecución prepara el entorno local necesario; las siguientes lo reutilizan. No depende de un Jupyter global ni abre JupyterLab.

Cada documento presenta, en este orden: título, qué hace, qué cambia en los datos, qué acción de la app utiliza, anotaciones, bloque ejecutable y resultado. Los datos del ejemplo que se pueden cambiar están identificados; modificarlos no exige editar la lógica que ejecuta la acción. Las anotaciones sirven también para entender las particularidades reales de nuestra app.

## Operaciones y resultados

| Documento | Entrada del usuario y resultado esperado |
| --- | --- |
| Preparar la tabla de usuarios | Acción explícita sin datos de contacto. Confirma que la tabla está disponible; repetirla conserva registros. |
| Crear un contacto | Nombre y email de ejemplo. Muestra el contacto creado. |
| Listar contactos | Sin parámetros. Muestra todos los contactos en el orden actual o una tabla vacía. |
| Buscar por email | Email de ejemplo. Muestra el contacto o el error existente. |
| Buscar por ID | ID de un contacto real del ejemplo. Muestra el contacto o el error existente. |
| Buscar por nombre | Nombre de ejemplo. Muestra todas las coincidencias exactas, respetando mayúsculas y quitando espacios de los extremos, o una tabla vacía. |
| Actualizar un contacto | ID y cambios de ejemplo. Muestra el contacto actualizado y explica cómo conservar los campos no suministrados. |
| Eliminar un contacto | ID de un contacto desechable. Confirma el éxito, indicando que la operación no devuelve datos; explica que el borrado es permanente. |
| Contar categorías estimadas por nombre | Sin parámetros. Muestra los tres recuentos actuales y explica que son estimaciones del modelo, no identidades verificadas. |

Los contactos conservan los cinco campos de la app: id, name, email, createdAt y updatedAt. El recuento conserva women, men y genderUndefined, sin renombrar los campos que devuelve la operación.

## Criterios de aceptación

- **CA-01 · Nueve documentos:** Dado el cliente de terminal actual de first-app-ai, cuando se abre la lista de notebooks, entonces se encuentra un documento por cada una de las nueve operaciones anteriores, sin añadir operaciones de negocio ni eliminar el cliente de terminal.

- **CA-02 · Arranque propio del proyecto:** Dado un equipo con los requisitos documentados, cuando se usa el comando del proyecto, entonces se prepara o reutiliza su entorno local y abre Notebook en el navegador, mostrando estos documentos. No necesita el Jupyter global ni abre Lab. Cerrar el servidor termina esa sesión local; no se publica el cliente en Internet.

- **CA-03 · Explicaciones correctas:** Dado cualquier documento, cuando se lee, entonces tiene las secciones y orden descritos y explica el contrato real de nuestra operación. Se distinguen creación y actualización, conservación de campos omitidos, búsquedas sin coincidencias, borrado permanente y requisitos de clasificación. No se atribuyen validaciones ni resultados que nuestra app no tiene.

- **CA-04 · Ejecución comprensible e independiente:** Dado un notebook abierto tras reiniciar su sesión de ejecución, cuando el usuario ajusta los valores identificados y ejecuta el bloque, entonces llama a nuestra operación sin depender de variables creadas en otro documento. Explica las acciones previas necesarias sobre los datos: preparar la tabla, crear un contacto y usar el ID realmente obtenido cuando corresponda. Los ejemplos no suponen que el contacto tenga ID 1 ni inicializan o crean contactos de forma oculta.

- **CA-05 · Resultados legibles:** Dada una ejecución correcta, cuando se presenta su resultado, entonces los contactos y recuentos aparecen en tablas con encabezados claros y encabezado en color, sin alterar valores, orden o campos. Una lista vacía muestra sus encabezados sin filas. Una operación que no devuelve datos muestra una confirmación comprensible, sin inventar un contacto, recuento o dato devuelto por la lógica. El cliente de terminal conserva su salida anterior.

- **CA-06 · Fallos fieles:** Dada una operación que falla, cuando se ejecuta desde el documento, entonces muestra el mensaje existente de la operación, sin tabla de éxito ni resultado parcial. Ejemplos: Name is empty, Email is invalid, Email is already used, User not found y los mensajes Could not… correspondientes. Si no puede localizar nuestra app, se detiene con «No encuentro la app.»; no ejecuta otra copia ni una acción alternativa.

- **CA-07 · Clasificación real:** Dado el documento de recuento, cuando se ejecuta, entonces espera el resultado real de nuestra operación y conserva sus requisitos locales de modelo. Con tabla vacía muestra los tres ceros sin necesitar al modelo. Con contactos y el servicio del modelo no disponible muestra Could not classify the users, sin inventar recuentos ni sustituirlo por otra clasificación. Describe qué hace falta para el ejemplo no vacío.

- **CA-08 · Datos y comportamiento conservados:** Dado el cliente ejecutándose desde su lista de documentos, cuando usa una operación, entonces trabaja con la app first-app-ai y su ubicación actual de datos, sin abrir por error first-app, first-app-ssd o la copia de Ventura. La descripción indica dónde se guardan los cambios antes de ejecutar acciones de escritura. Solo las acciones solicitadas de preparación, creación, actualización y borrado modifican datos según sus contratos actuales; listar, buscar y clasificar conservan registros y fechas. No cambia la lógica de negocio, el esquema ni las reglas del cliente de terminal.

- **CA-09 · Verificación y entrega:** Dada la revisión del cliente, cuando se comprueba, entonces se registra la ejecución de los nueve documentos con datos ficticios en una copia desechable, incluyendo funcionamiento normal, vacío, acciones sin datos y errores pertinentes. Se comprueban arranque inicial y reutilización, y ejecución tras reiniciar la sesión. La verificación del modelo distingue la prueba real no vacía de cualquier comprobación simulada y declara sus bloqueos. Los notebooks se entregan sin salidas personales ni contadores de ejecución guardados; no se incluyen datos reales ni el entorno local. Los documentos SDD conservan el alcance completo y registran cambios aprobados, sin borrar los requisitos anteriores al corregir el arranque.

## Ejemplos de uso

1. Preparar explícitamente la tabla, crear a Ada con un email de prueba, anotar el ID devuelto y usarlo para consultar, actualizar y eliminar ese contacto. Listar después confirma el cambio.
2. Buscar un nombre que no existe muestra una tabla sin filas. Buscar por un ID inexistente muestra User not found: no se uniforman dos contratos distintos.
3. Repetir un email al crear muestra Email is already used y no añade otro contacto. Un recuento fallido no muestra como resultado tres ceros.

## Fuera de alcance

- Cambiar operaciones de negocio, validaciones, esquema, mensajes o el prompt de clasificación.
- Completar funcionalidades ausentes en otras variantes de first-app o copiar sus datos.
- Crear un frontend web propio, formularios adicionales, cuentas, acceso remoto o despliegue público de Notebook.
- Eliminar el cliente de terminal o modificar AsistenciApp y su refactorización 011.
- Instalar herramientas globales, cambiar dependencias ajenas a esta tarea o incluir datos reales en la entrega.

## Preguntas abiertas

Ninguna para revisar el alcance. El mecanismo de ejecución, las dependencias oficiales y versiones exactas y el comando de arranque se justificarán en el plan antes de instalar o implementar.
