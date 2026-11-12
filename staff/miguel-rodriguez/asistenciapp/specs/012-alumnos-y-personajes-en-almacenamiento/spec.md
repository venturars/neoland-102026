# Spec 012 · Alumnos y personajes como datos guardados

Estado: aprobada por Miguel el 2026-10-27.
Fecha: 2026-10-27.
Issue: [#524](https://github.com/venturars/neoland-102026/issues/524), asignada a mglnglxx.
PR: [#525](https://github.com/venturars/neoland-102026/pull/525), en draft y dirigida a `staging`.

## Problema

Los alumnos y sus personajes están definidos como una lista fija junto a las reglas del dominio. Esto mezcla quién forma el grupo con cómo funciona la asistencia y obliga a modificar código de negocio para cambiar los datos concretos del alumnado.

Ventura señaló que el dominio debe contener las reglas y que los alumnos y las clases son datos relacionados. Esta iteración aborda el traslado del catálogo actual de alumnos y personajes al almacenamiento, conservando el grupo existente y el funcionamiento de las carreras. La administración de varios grupos queda fuera de esta entrega.

El profesor y los alumnos deben poder seguir usando la carrera con sus nombres y personajes habituales, sin volver a configurar el grupo en cada arranque ni perder lo que ya se ha registrado.

## Usuarios

- Profesor: prepara carreras y consulta asistencias y resultados sin volver a introducir el grupo existente.
- Alumnos: entran con su nombre y mantienen su personaje, su plaza y sus oportunidades de registro.
- Personas que mantienen o revisan la aplicación: necesitan distinguir los datos del alumnado de las reglas de asistencia y seguridad.

## Historias de usuario

- **HU-01:** Como profesor, quiero que la carrera obtenga los alumnos y personajes de los datos guardados, sin una lista concreta incrustada en las reglas de negocio.
- **HU-02:** Como profesor, quiero conservar el grupo actual al empezar a usar esta versión y no configurarlo cada vez que arranco la aplicación.
- **HU-03:** Como alumno, quiero conservar mi nombre, personaje y participación al actualizar la aplicación.
- **HU-04:** Como profesor, quiero que las carreras anteriores y en curso mantengan sus asistencias, resultados y protecciones.
- **HU-05:** Como mantenedor, quiero que cambiar datos del catálogo no requiera modificar las reglas de la carrera.

## Criterios de aceptación

- **CA-01 · Datos separados de las reglas:** Dado el catálogo de alumnos y personajes guardado en la aplicación, cuando se consulta el grupo o se prepara una carrera nueva, entonces se utilizan esos datos y el dominio no contiene una lista fija de personas concretas ni accede al almacenamiento. Las reglas de nombres y carrera siguen siendo independientes de los datos concretos del grupo.

- **CA-02 · Primera preparación del catálogo:** Dada una instalación que nunca ha completado la preparación del catálogo, incluida una instalación anterior a este cambio, cuando esa primera preparación termina correctamente, entonces incorpora una sola vez el grupo actual de quince alumnos con sus mismas correspondencias de nombre y personaje y el mismo orden visible. Si la preparación falla, no queda presentada como completada ni deja un grupo parcialmente incorporado. Disponer del catálogo no marca a nadie como presente, no ocupa plazas y no crea asistencias por sí solo.

- **CA-03 · Persistencia e inicialización repetible:** Dada una instalación cuya preparación del catálogo ya se completó, cuando se reinicia o se repite la preparación de la aplicación, entonces conserva sus datos sin duplicarlos, sobrescribirlos ni restaurar automáticamente la lista inicial. Esto también se cumple si el catálogo queda vacío: la ausencia de alumnos no convierte una instalación ya preparada en una instalación nueva. El profesor no vuelve a introducir los mismos alumnos y personajes en cada arranque.

- **CA-04 · La carrera consume los datos guardados:** Dados datos válidos del catálogo preparados en un entorno de prueba, cuando se consulta el grupo y se prepara una carrera nueva, entonces los nombres y personajes utilizados corresponden a esos datos sin cambiar las reglas del dominio. No basta con mover la misma lista fija a otro módulo y seguir utilizándola como fuente de cada consulta.

- **CA-05 · Identidad de plaza conservada:** Dadas las formas de nombre o referencia que la aplicación ya acepta para un alumno, cuando se usan después del traslado, entonces siguen resolviendo a la misma plaza de su carrera. No se crean plazas adicionales de una persona ni presupuestos distintos por cambiar mayúsculas, acentos o la forma de presentar su nombre. La emisión, sustitución y caducidad de accesos conservan sus reglas actuales.

- **CA-06 · Carreras y datos anteriores conservados:** Dadas carreras preparadas, en curso, cerradas o canceladas antes del cambio, cuando se actualiza y se consultan o continúan según su estado, entonces conservan sus participantes, correspondencias de personaje, asistencias, orden de llegada, resultados, fechas y estado de cierre. El traslado no elimina registros duraderos ni reconstruye carreras como si fueran nuevas. La limpieza de datos temporales caducados sigue las reglas vigentes. Los cambios posteriores del catálogo destinados a carreras nuevas no reinterpretan ni modifican la participación ya fijada en una carrera existente.

- **CA-07 · Intentos y accesos conservados:** Dadas plazas con accesos, oportunidades gastadas, envíos reservados o resultados ya confirmados, cuando se actualiza, se reinicia o se repite un envío después del traslado, entonces se conservan las mismas restricciones. No se devuelven oportunidades, no se evalúa dos veces un envío, no se prolongan accesos caducados y el agotamiento de una plaza no bloquea a los demás alumnos. Se conservan los límites y bloqueos de las clases normales y la validación del origen fiable.

- **CA-08 · Mismo recorrido visible:** Dado el grupo actual y una carrera disponible, cuando el profesor la prepara y los alumnos entran, se registran y consultan el resultado, entonces conservan sus nombres y personajes, el recorrido de entrada, las reglas de inicio y cierre, la presentación de la carrera y el podio. El traslado no exige cuentas, invitaciones privadas, confirmaciones individuales del profesor ni una nueva configuración del grupo en la interfaz.

- **CA-09 · Fallos y catálogo vacío sin reinicio:** Dado un fallo al preparar o recuperar los datos del catálogo, cuando la aplicación necesita esos datos para una carrera nueva, entonces comunica al profesor que no puede completar la acción. No presenta el fallo como un grupo vacío válido, no lo interpreta como una primera preparación y no reconstruye silenciosamente el grupo inicial. Si se recupera correctamente un catálogo ya preparado pero vacío, informa de que no hay alumnos disponibles y no prepara una carrera sin participantes ni repuebla el catálogo. La aplicación distingue la primera preparación, un catálogo preparado vacío y un fallo de recuperación; si no puede determinar ese estado, rechaza la acción sin reponer datos. Los registros y presupuestos existentes permanecen intactos y ninguna asistencia se confirma por estas situaciones.

- **CA-10 · Privacidad conservada:** Dados los datos necesarios para identificar el nombre y personaje del grupo, cuando se guardan y se usan, entonces permanecen locales y no añaden emails, datos de dispositivo ni asociaciones entre alumnos y direcciones de seguridad. Que un nombre esté en el catálogo no demuestra presencia ni verifica por sí solo la identidad de quien lo selecciona; se mantiene la limitación aceptada del juego.

- **CA-11 · Verificación y documentación coherentes:** Dada la entrega, cuando se revisa, entonces cada criterio tiene una comprobación automatizada identificada, las pruebas existentes siguen pasando y se acredita la conservación con datos sintéticos anteriores al cambio. La documentación explica la procedencia del catálogo, su preparación y los límites de esta iteración, sin atribuir una administración de grupos que no existe. La comprobación y cualquier preparación de datos se realizan en copias desechables, sin abrir ni modificar bases locales de trabajo.

## Fuera de alcance

- Crear una pantalla de administración, edición de alumnos o personajes, importaciones o selección y gestión de varios grupos.
- Añadir altas públicas, cuentas, autenticación del alumnado o cambiar la admisión automática de las carreras.
- Cambiar las reglas de registro, los presupuestos, las caducidades, la clasificación, el cierre, la exportación, las animaciones o el podio.
- Añadir datos personales que la aplicación no necesita, conexiones con plataformas externas o sincronización de datos.
- Reorganizar todas las consultas existentes, sustituir el almacenamiento de la aplicación o introducir capas genéricas.
- Hacer un refactor general de módulos ajenos al traslado, reescribir specs históricas o modificar otros proyectos del curso.

## Preguntas abiertas

Ninguna decisión de producto pendiente dentro del alcance de #524. El plan concretará cómo preparar el catálogo inicial y conservar los datos y participaciones anteriores, con una solución local mínima y sin introducir una gestión completa de clases.
