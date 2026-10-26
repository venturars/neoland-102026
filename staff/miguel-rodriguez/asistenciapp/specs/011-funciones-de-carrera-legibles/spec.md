# Spec 011 · Reglas y resultados de carrera legibles

Estado: aprobada por Miguel el 2026-10-26. Ejecución completa autorizada después por Miguel; implementación verificada, pendiente de revisión de compañeros.
Fecha: 2026-10-26.
Issue: [#363](https://github.com/venturars/neoland-102026/issues/363), asignada a mglnglxx.
PR de trabajo: [#364](https://github.com/venturars/neoland-102026/pull/364), en draft, destino staging. Depende de 010, PR #362. La autorización para completar y publicar el trabajo pendiente no sustituye las revisiones de compañeros ni autoriza su merge.

## Problema

La carrera funciona, pero mezcla funciones con clases propias para devolver resultados y permitir la evaluación de un intento. Los motivos de rechazo también llevan decisiones de respuesta al navegador. Esto dificulta seguir el flujo y contradice las reglas de consistencia acordadas en 010.

Queremos que una persona pueda leer una regla, seguir su resultado y entender cómo se usa sin tener que reconstruir un modelo de objetos. Simplificar la representación no debe alterar la asistencia ni debilitar la protección de los intentos. Las funciones que ya son claras se conservan.

## Usuarios

- Miguel y compañeros del curso: necesitan explicar qué recibe una función, qué decide y qué devuelve.
- Mantenedores y revisores: necesitan distinguir reglas de negocio, coordinación y presentación de resultados.
- Profesor y alumnos: necesitan que la carrera y sus registros sigan funcionando como antes.

## Historias de usuario

- **HU-01:** Como mantenedor, quiero reglas y resultados expresados con funciones y datos sencillos, con un estilo coherente.
- **HU-02:** Como revisor, quiero seguir el recorrido de un intento y reconocer dónde se acepta, rechaza o recupera su resultado.
- **HU-03:** Como alumno, quiero conservar mi presupuesto de intentos y recibir el mismo resultado aunque una respuesta se pierda.
- **HU-04:** Como profesor, quiero conservar registros, clasificación, cierre y exportación al simplificar el código.

## Criterios de aceptación

- **CA-01 · Funciones y datos sencillos:** Dadas las reglas de carrera y sus resultados, cuando se revisa la implementación, entonces se expresan mediante funciones con entradas y resultados explícitos, sin clases propias de entidades, resultados, servicios o permisos internos de ejecución. Las clases que solo identifican errores de negocio siguen permitidas. No se crean jerarquías, formatos de resultado genéricos, proveedores intercambiables ni estado global mutable para sustituir las clases eliminadas. No se modifica una función clara solo para ampliar el cambio.

- **CA-02 · Motivos de negocio separados de la presentación:** Dado un rechazo o resultado de carrera, cuando sale del dominio o del caso de uso, entonces expresa qué ocurrió sin decidir el código de respuesta al navegador. La parte que atiende al navegador realiza esa traducción y conserva las respuestas visibles anteriores. Renombrar un número de respuesta como si fuera un motivo de negocio no cumple el criterio.

- **CA-03 · Lectura humana:** Dada una función creada o modificada, cuando un revisor la lee, entonces puede identificar sus entradas, la decisión o acción principal, el resultado y sus efectos sin descifrar abreviaturas ambiguas ni varias operaciones mezcladas en una expresión. Los comentarios describen decisiones o restricciones reales; la documentación pública e interna sigue 010. El flujo no se dispersa en helpers o capas que solo obliguen a saltar entre archivos.

- **CA-04 · Una evaluación por envío:** Dada una comprobación de código, cuando se reserva su oportunidad, entonces el consumo queda guardado antes de evaluar el código. Solo la invocación que creó y confirmó esa reserva puede realizar la evaluación una vez. Repetir un envío, consultar su estado o reconstruir datos recibidos del alumno nunca concede otro permiso. Si falla o es incierta la confirmación de la reserva, no se evalúa; si falla el resultado posterior, la oportunidad continúa gastada. La sustitución del permiso interno conserva también su rechazo a un segundo uso dentro de la misma ejecución.

- **CA-05 · Presupuesto y recuperación conservados:** Dada una plaza de carrera, cuando se envían códigos o se repite un envío tras perder la respuesta, entonces conserva las tres oportunidades totales, incluida la correcta, y recupera únicamente resultados realmente confirmados. Las repeticiones con otro contenido se rechazan; una reserva sin resultado no se convierte en éxito ni se reanuda para evaluar. Cambiar de navegador, dirección, código o nombre no devuelve oportunidades. Compartir Wi-Fi no mezcla los presupuestos de las plazas.

- **CA-06 · Vigencia y fallos conservados:** Dada una operación cerca de la salida, cierre o caducidad, cuando se ejecuta, espera por otra operación o recupera un resultado, entonces conserva las comprobaciones de vigencia y el orden de validación existentes. Un acceso caducado tampoco recupera un éxito anterior. La contención antes de reservar no gasta una oportunidad; los fallos posteriores a la reserva no la devuelven ni permiten otra evaluación. Los fallos técnicos no se convierten en rechazos de negocio distintos ni ocultan una escritura incierta.

- **CA-07 · Mismo recorrido de carrera:** Dados profesor y participantes, cuando recorren entrada por QR o enlace, elección de nombre, espera, salida, registro y cierre, entonces mantienen las fases, tiempos, permisos y acciones existentes. Se conservan los controles de origen y acceso, los errores en español y las respuestas que consumen las pantallas, incluidos sus campos y códigos de respuesta. Los cambios de representación interna solo requieren adaptar sus consumidores necesarios, sin rediseñar las pantallas.

- **CA-08 · Datos y resultados intactos:** Dadas las clases y asistencias guardadas, cuando se usa la app refactorizada, entonces se conservan los registros, fechas, puestos, retirada de asistencias, exportación y comportamiento de las clases normales. Los puestos se derivan de las asistencias confirmadas como antes; no cambian por el nuevo formato interno de resultados. Los envíos guardados por la versión anterior siguen siendo consultables y recuperables durante su vigencia: éxitos, rechazos y reservas sin resultado conservan sus respuestas y efectos anteriores, aunque incluyan decisiones de respuesta almacenadas con el formato antiguo. Su lectura no vuelve a evaluar códigos, devuelve intentos ni convierte una reserva en éxito. No se migra el esquema, reescriben los envíos anteriores ni renuevan secretos, accesos o presupuestos por este cambio. Solo se admite adaptar su lectura o escritura cuando sea necesario para conservar esa compatibilidad, sin rediseñar el almacenamiento.

- **CA-09 · Evidencia de equivalencia:** Dada la revisión del cambio, cuando se comprueba, entonces las pruebas existentes conservan sus casos y aserciones de comportamiento; solo se adaptan los contratos internos que cambien. Se aportan comprobaciones específicas de la sustitución del permiso de una sola evaluación y de la traducción de motivos a respuestas. La evidencia compara una referencia anterior con la versión refactorizada mediante datos ficticios equivalentes y distingue las mejoras de lectura de las garantías verificadas. Incluye envíos de éxito, rechazo y reserva sin resultado creados con la versión anterior y recuperados con la nueva: se comprueban respuestas, consumos y ausencia de una nueva evaluación. También se comprueba que esa compatibilidad no permite recuperar resultados con accesos caducados. Pasar pruebas no sustituye leer el flujo completo del intento.

## Fuera de alcance

- Trasladar el listado de alumnos, crear administración de clases o cambiar nombres y personajes.
- Separar las consultas en archivos, cambiar el esquema o sustituir el almacenamiento.
- Reestructurar toda la gestión de conexiones o todos los casos de uso; solo se adaptan los consumidores necesarios para las reglas y representaciones cambiadas.
- Cambiar políticas de intentos, caducidad, validación, identidad o recuperación.
- Cambiar diseño, animaciones, instrucciones de uso o funcionalidades del profesor y alumno.
- Añadir dependencias, herramientas, capas o soporte para otras bases de datos.
- Reescribir bibliotecas externas, specs históricas o los proyectos Node.

## Preguntas abiertas

Ninguna para revisar esta propuesta. La representación concreta de resultados, errores y permiso de ejecución, los archivos afectados y las pruebas se decidirán en el plan, tras aprobar esta spec.
