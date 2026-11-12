# Spec 010 · Reglas de código consistente y legible

Estado: spec y plan aprobados por Miguel el 2026-10-26. Tareas aprobadas por Miguel el 2026-10-26; implementación documental verificada y revisión final aprobada por Miguel el 2026-10-26.
Fecha: 2026-10-26.

Publicación: [issue #361](https://github.com/venturars/neoland-102026/issues/361), asignada a mglnglxx; [PR #362](https://github.com/venturars/neoland-102026/pull/362), destino staging.

## Problema

La carrera se pudo utilizar en clase, pero revisar cómo funciona resultó difícil. La revisión de Ventura del 26 de octubre señaló estilos distintos dentro del dominio, expresiones que concentran varios pasos, nombres demasiado abreviados y comentarios que no explican lo que ocurre.

Las instrucciones actuales piden funciones con una responsabilidad, pero no concretan el estilo funcional ni cómo distinguir una simplificación útil de otra que elimina una garantía necesaria. También repiten la estructura de carpetas en más de un documento.

Necesitamos reglas que permitan leer y mantener la aplicación sin depender de que una IA traduzca su código. Esta tarea establece esas reglas; aplicarlas al código existente será trabajo posterior con su propia especificación.

## Usuarios

- Miguel y compañeros del curso: necesitan seguir una operación y explicar sus decisiones.
- Personas que revisan o mantienen la app: necesitan distinguir reglas de negocio, almacenamiento y presentación.
- Agentes que modifican la app: necesitan instrucciones concretas y coherentes.

## Historias de usuario

- **HU-01:** Como alumno, quiero seguir los pasos de una función y reconocer sus entradas, resultado y efectos.
- **HU-02:** Como revisor, quiero encontrar las mismas convenciones en operaciones equivalentes.
- **HU-03:** Como mantenedor, quiero simplificar el código conservando las reglas de asistencia y seguridad.
- **HU-04:** Como agente, quiero consultar una única referencia para cada tipo de instrucción.

## Criterios de aceptación

- **CA-01 · Estilo funcional:** Dada una modificación del dominio o de los casos de uso, cuando se consultan las instrucciones de escritura, entonces exigen funciones con entradas y resultados explícitos, sin clases propias para representar entidades, resultados, servicios o permisos internos de ejecución, ni estado global mutable para coordinar una operación. El dominio calcula reglas; los casos de uso coordinan sus efectos y el almacenamiento. Las clases que únicamente identifican errores de negocio son una excepción permitida: no contienen lógica de negocio ni deciden cómo responder al navegador. No se reescriben las clases de bibliotecas externas. Sustituir una clase interna nunca permite perder la garantía que justificaba su existencia.

- **CA-02 · Pasos comprensibles:** Dada una operación que obtiene datos, los transforma y devuelve un resultado, cuando se aplican las reglas, entonces esos pasos se pueden reconocer por separado. Se evitan instrucciones que mezclan consultas, conversiones y construcción de respuestas. Una expresión breve y clara puede conservarse; no se exige una variable por cada operador ni una función por cada línea.

- **CA-03 · Nombres y responsabilidades:** Dada una función nueva o modificada, cuando se revisa, entonces su nombre expresa una acción y sus parámetros identifican los datos que recibe. Las abreviaturas ambiguas se sustituyen por nombres comprensibles. Cada función tiene una responsabilidad reconocible; extraer ayudantes no debe obligar a recorrer numerosos archivos para entender una operación sencilla.

- **CA-04 · Documentación útil:** Dadas las instrucciones para documentar funciones, cuando se siguen, entonces las funciones públicas describen entradas, resultado y un ejemplo breve; las internas explican su propósito y cualquier restricción no evidente sin repetir plantillas vacías. Se considera pública una función destinada a llamarse desde otro módulo; el prefijo de las funciones internas es una convención, no un control de acceso. Los tipos siguen siendo explícitos. Los comentarios explican decisiones, efectos o restricciones reales en español claro, sin repetir cada instrucción ni usar frases que no permitan entender su comportamiento.

- **CA-05 · Responsabilidades separadas:** Dada una decisión sobre dónde colocar código o información, cuando se consultan las reglas, entonces distinguen las reglas de negocio de los datos concretos de alumnos y clases, del almacenamiento y de la presentación. El dominio no contiene listas de personas concretas ni decide respuestas de transporte, incluidos sus códigos de estado. Las futuras consultas se guardan en archivos separados de las funciones que las ejecutan; moverlas de un caso de uso a una función de almacenamiento no basta. La separación no añade un sistema genérico de consultas o persistencia.

- **CA-06 · Complejidad justificada:** Dada una operación de la app, cuando se revisa su diseño, entonces se puede seguir desde su entrada hasta su resultado mediante funciones concretas para la base de datos local existente. No se crean proveedores intercambiables, repositorios genéricos, fábricas de conexiones para distintos motores ni capas para usos hipotéticos. Recibir la ubicación de los datos para poder probar con una copia aislada no implica admitir otros proveedores. Un ayudante o mecanismo de gestión de recursos solo se conserva o introduce si reduce repetición o errores reales y permite identificar quién abre, confirma, revierte y cierra la operación. No se elimina por su nombre ni se sustituye por más código sin una mejora concreta de comprensión. El plan posterior debe justificar cada abstracción nueva con su necesidad actual y un recorrido legible de la operación que resuelve.

- **CA-07 · Una referencia por responsabilidad:** Dadas las instrucciones del proyecto, cuando se busca el estilo de código y el proceso, entonces se encuentran en el manual del agente; las responsabilidades y estructura de carpetas se encuentran en el documento de arquitectura; y los principios y reglas de seguridad permanecen en la constitución. Las referencias entre documentos sustituyen las descripciones duplicadas. Las evidencias y especificaciones históricas no se reescriben.

- **CA-08 · Garantías conservadas:** Dada una futura simplificación, cuando se decide su alcance, entonces las instrucciones exigen mantener los datos guardados, los resultados visibles y las garantías de seguridad. En particular, no permiten devolver oportunidades gastadas, evaluar de nuevo un envío repetido, confirmar asistencia sin resultado válido, compartir el presupuesto de intentos entre alumnos de una carrera ni prolongar accesos caducados. La claridad del código no justifica quitar transacciones, validaciones o controles necesarios.

- **CA-09 · Verificación concreta:** Dada la revisión documental de esta tarea, cuando se comprueba cada criterio, entonces se registra dónde quedó su regla. Se contrasta su aplicación con ejemplos reales: una consulta con varios pasos mezclados, un resultado de negocio y un permiso interno representados mediante clases, un error de dominio que lleva un código de respuesta y un comentario de carrera difícil de entender. La revisión comprueba además que recibir una ubicación de datos para pruebas no se prohíbe como si fuera un sistema de proveedores intercambiables. Distingue entre disponer de la regla y haber corregido el código; no atribuye una refactorización ni una mejora de comportamiento a esta tarea documental.

## Fuera de alcance

- Cambiar funciones, pruebas, mensajes, pantallas, animaciones o datos existentes.
- Convertir las clases actuales en funciones o trasladar el listado de alumnos al almacenamiento en esta tarea.
- Crear tablas, administrar clases o alumnos, mover consultas o cambiar la gestión de conexiones.
- Quitar controles de seguridad o alterar tiempos, presupuestos, orden de llegada o recuperación de resultados.
- Añadir dependencias, herramientas de formato, capas o funcionalidades.
- Cambiar las reglas de aprobación, el flujo de trabajo o el destino de las PRs.
- El cliente Jupyter y los proyectos Node del curso.

## Preguntas abiertas

Ninguna. La aprobación de Miguel incluye la excepción limitada para clases de error. Las reglas todavía no se han aplicado a las instrucciones ni al código.
