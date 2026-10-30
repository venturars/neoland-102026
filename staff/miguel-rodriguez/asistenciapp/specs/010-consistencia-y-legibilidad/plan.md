# Plan 010 · Reglas de código consistente y legible

Estado: aprobado por Miguel el 2026-10-26.
Fecha: 2026-10-26. La [spec](spec.md) está aprobada; tareas aprobadas por Miguel el 2026-10-26; implementación documental verificada y revisión final aprobada por Miguel el 2026-10-26.

Publicación: [issue #361](https://github.com/venturars/neoland-102026/issues/361), asignada a mglnglxx; [PR #362](https://github.com/venturars/neoland-102026/pull/362), destino staging.

## 1. Alcance

Actualizar únicamente el manual y la documentación de arquitectura, además de los documentos de seguimiento de 010. Las reglas se basan en la revisión de Ventura del 26 de octubre y en problemas observados en nuestra app, no en un nuevo modelo de programación.

Referencia local revisada: código publicado de 009, commit `ca8684e`. Este dato identifica los ejemplos; no afirma que esa versión esté integrada en staging. Los archivos locales ajenos a 010 se conservan intactos.

No cambian código ejecutable, pruebas, consultas, esquema, datos, rutas, respuestas, dependencias ni pantallas. No se crean capas, herramientas ni mecanismos de base de datos. No se necesita enmendar la constitución: sus principios ya exigen simplicidad y permiten concretar estas reglas en el manual.

## 2. Cambios documentales

### AGENTS.md · CA-01–CA-04, CA-06–CA-08

- Incluir `docs/ARCHITECTURE.md` en la lectura inicial después de la constitución. Conservar las fases y aprobaciones actuales.
- Sustituir el árbol de carpetas de §3 por un enlace al árbol de arquitectura. Conservar la convención de nombres de specs.
- Reescribir §8 con reglas breves y solo dos ejemplos reutilizables: una función pública con tipos, parámetros, resultado y uso; y una operación con pasos y nombres claros. Explicar en las reglas la diferencia entre dominio y coordinación de los casos de uso. Prohibir clases propias para entidades, resultados, servicios y permisos internos; permitir errores de negocio sin estado HTTP ni lógica adicional. No extender esta regla a clases externas. El diagnóstico de funciones concretas queda en la evidencia de 010, no en el manual.
- Pedir nombres descriptivos, pasos visibles y una responsabilidad por función. No imponer un número arbitrario de líneas ni eliminar expresiones sencillas por ser compactas.
- Mantener tipos y, en funciones públicas, `:param`, `:return`, `:rtype` y `Usage::`. Para funciones internas, sustituir la exigencia universal de esa plantilla por una explicación breve de propósito y restricciones. Es una modificación explícita de la regla actual, no una obligación añadida encima de ella. Los nombres con `_` indican uso interno al módulo, no privacidad impuesta por el lenguaje.
- Explicar que un helper se justifica cuando evita repetición o errores reales y deja claro el flujo. No crear repositorios genéricos, proveedores intercambiables ni fábricas para distintos motores. Un argumento `db_path` para utilizar datos temporales en pruebas y un cierre garantizado de conexión pueden ser soluciones concretas y sencillas.
- Enlazar las reglas de seguridad de la constitución y resumir la obligación de conservarlas al refactorizar, sin copiar sus umbrales ni mantener una segunda versión de la política.
- Añadir el estado real de 010 a §7. No actualizar estados de otras specs ni afirmar que los problemas del código ya están corregidos.

### docs/ARCHITECTURE.md · CA-05, CA-07–CA-08

- Alojar el único árbol de carpetas vigente, trasladando el contenido pertinente del manual y contrastándolo con la app. Mostrar responsabilidades, no enumerar cada activo ni cada archivo de pruebas.
- Conservar el sentido de las dependencias: dominio sin persistencia o HTTP, almacenamiento concreto, casos de uso que coordinan y adaptador HTTP que traduce respuestas.
- Añadir una sección breve de cambios pendientes: datos concretos de alumnos fuera del dominio, texto SQL en archivos separados y códigos HTTP fuera de los errores de dominio. Señalar que todavía existen `domain/roster.py`, consultas SQL embebidas y `RaceError.status`; no presentar una arquitectura futura como implementada.
- Dejar la sintaxis y ejemplos de estilo en AGENTS.md. Las futuras ubicaciones de datos y consultas se decidirán en sus propias specs y planes; no crear aquí carpetas vacías ni diseñar un cargador genérico de SQL.
- Conservar las explicaciones de las garantías existentes de reserva, confirmación, caducidad y cierre. No modificar ni simplificar sus algoritmos en esta tarea.

El README y la constitución ya enlazan estos documentos y no necesitan cambios. Las specs históricas permanecen intactas. Los resultados de comprobación de 010 se registrarán en sus tareas cuando existan.

## 3. Ejemplos del manual y casos para la evidencia · CA-01–CA-06, CA-09

Los dos ejemplos del manual serán ilustrativos, sin depender de nombres de funciones que vayan a refactorizarse. Pueden compartir el mismo caso sencillo; no añaden una API, una abstracción ni una implementación nueva.

Los seis casos siguientes se usarán para revisar las reglas. Su resultado se registrará en la sección de evidencia de tasks.md de 010, junto con la referencia de código examinada. No se copiará esta tabla a AGENTS.md ni se creará otro documento de diagnóstico:

| Caso observado | Qué debe permitir decidir la regla |
| --- | --- |
| `storage/races.py:ranking` ejecuta una consulta y convierte filas dentro del return. | Reconocer consulta, ejecución, conversión y devolución como pasos; el texto SQL estará separado cuando se implemente su tarea. No extraer un helper por cada paso. |
| `domain/race.py:Outcome` representa datos mediante una clase. | Pedir datos ordinarios devueltos por funciones en su futura refactorización, sin una nueva jerarquía o formato de respuesta genérico. |
| `usecases/races.py:_Execution` representa un permiso de ejecución de un intento. | Aplicar también la regla a los casos de uso, pero conservar que solo quien reservó el intento pueda evaluarlo una vez. La sustitución concreta se diseñará y probará en la tarea de código. |
| `domain/race.py:RaceError.status` transporta un estado HTTP. | Separar el motivo de negocio de su traducción HTTP; no renombrar el atributo para ocultar la misma dependencia. |
| `storage/races.py:count_operations` describe el resultado como «contador o identificador guardado». | Exigir una descripción precisa: devuelve el número de operaciones guardadas para esa plaza, no un identificador. No editar todavía su docstring. |
| `usecases/races.py:_reading_connection(db)` recibe una ubicación de datos y garantiza cierre. | No confundir ese argumento y el cierre de recursos con soporte para otros motores. Evaluar la utilidad real del helper antes de sustituirlo. |

El ejemplo de pasos del manual puede expresar el flujo con nombres como `query`, `rows` y `checkins`; no necesita ejecutar una consulta ni abrir datos reales. No se incluye una sustitución ilustrativa del permiso de intento que parezca segura sin haberse probado. La arquitectura conserva únicamente la explicación breve de límites pendientes indicada en §2, sin duplicar los seis casos de revisión.

## 4. Verificación · CA-01–CA-09

Verificación documental, sin añadir tests que busquen frases exactas en Markdown:

| Criterio | Comprobación y evidencia a registrar |
| --- | --- |
| CA-01 | Leer la regla y contrastarla con Outcome, _Execution y los errores existentes. Registrar que cubre dominio y casos de uso, la excepción y la conservación de garantías. |
| CA-02–CA-03 | Revisar el ejemplo genérico de pasos del manual y contrastarlo con ranking en la evidencia: pasos y nombres identificables, sin funciones auxiliares innecesarias ni límites mecánicos de longitud. |
| CA-04 | Confirmar una sola política vigente de docstrings; ejemplos públicos completos e internos breves. Revisar la corrección propuesta del comentario de count_operations. |
| CA-05 | Confirmar los tres límites: datos del alumnado, texto SQL separado y traducción HTTP. Comprobar que la arquitectura los identifica como pendientes en el código. |
| CA-06 | Contrastar la regla con _reading_connection y db_path: permite pruebas aisladas y cierre garantizado, rechaza proveedores hipotéticos. |
| CA-07 | Comprobar un único árbol de carpetas, enlaces locales válidos y estilo definido en el manual. Las specs históricas y la constitución no cambian. |
| CA-08 | Leer las instrucciones junto a constitución §6 y arquitectura 008: no autorizan devolver intentos, reevaluar operaciones ni debilitar caducidad o transacciones. |
| CA-09 | Registrar en la evidencia de tasks.md la ubicación final de cada regla y el resultado de los seis casos anteriores. Confirmar que el manual contiene solo dos ejemplos reutilizables y no el diagnóstico. Distinguir la revisión de instrucciones de una corrección de código. |

Al cerrar la implementación documental, revisar el diff y los archivos nuevos: solo AGENTS.md, docs/ARCHITECTURE.md y specs/010-consistencia-y-legibilidad/ pueden formar parte de esta tarea. No incluir archivos ajenos ya presentes, cachés, entornos ni datos. No se necesitan manifiestos de hashes ni copias completas para dos documentos.

Ejecutar una vez `python -m pytest -q` con el entorno existente para cumplir el cierre del proyecto; anotar comando, resultado real y cualquier bloqueo. No instalar dependencias ni cambiar pruebas para este cambio documental. Las pruebas no demuestran que una sesión futura de IA siga las instrucciones ni sustituyen la revisión de los criterios. No arrancar app, túnel o servidor de pruebas manual.

## 5. Comprobación de la constitución

- **P1:** no cambian plataformas ni integraciones.
- **P2:** operaciones concretas y reglas breves; sin abstracciones hipotéticas, fragmentación mecánica ni infraestructura de verificación nueva.
- **P3 y §3:** stack y dependencias intactos; no se introduce herramienta de formato.
- **P4:** no se abren datos reales ni se añaden datos personales; los ejemplos no incluyen secretos.
- **P5:** pantallas y accesibilidad intactas.
- **P6:** instrucciones y explicaciones en español; nombres de código en inglés.
- **§4:** spec y plan aprobados; la implementación espera aprobación separada de las tareas.
- **§5:** procedimiento documental y evidencia por criterio; regresión existente sin tests de texto que reflejen la implementación.
- **§6:** mismas reglas de asistencia y seguridad; no se altera la reserva previa a comprobar el código ni su confirmación, recuperación y caducidad.
- **§7–§8:** cambios solo dentro de la app; sin enmienda constitucional.

## 6. Límites de la siguiente fase

Después de aprobar este plan se preparará tasks.md para revisión separada. Esta tarea deja instrucciones comprobables, no código ya refactorizado. Las conversiones a funciones, el almacenamiento de alumnos y clases y la simplificación de almacenamiento/casos de uso tendrán sus propias specs y verificaciones de comportamiento. La publicación de 010 seguirá el flujo del repositorio y tendrá destino staging; este plan no crea una issue, rama, commit o PR ni cambia las existentes.
