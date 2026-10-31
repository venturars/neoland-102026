# Spec 008 · Flujo de trabajo compartido

> Estado: **Borrador, pendiente de aprobación** · Issue: #692 · Pull request: #693

## 1. Problema

Las instrucciones de AsistenciApp remiten a documentos del flujo de trabajo que ya no están disponibles. Además, la aplicación no incluye el conjunto compartido del curso para registrar una tarea, preparar sus cambios y solicitar revisión.

Esto dificulta seguir un proceso completo y coherente. Al incorporar el flujo compartido también hay que conservar el desarrollo guiado por especificaciones propio de AsistenciApp: cada fase necesita una aprobación expresa antes de pasar a la siguiente.

## 2. Usuarios

| Rol | Qué necesita |
| --- | --- |
| Persona responsable del cambio | Registrar una tarea, preparar su revisión y saber qué está autorizado en cada momento. |
| Agente de desarrollo | Seguir instrucciones vigentes, completas y compatibles con las reglas de la aplicación. |
| Persona revisora | Encontrar el motivo, el alcance, las comprobaciones y la relación entre la tarea y sus cambios. |

## 3. Historias de usuario

- **HU-01**: Como persona responsable, quiero que cada tarea tenga un registro y una propuesta de cambios relacionados, para seguir su evolución hasta la revisión.
- **HU-02**: Como agente, quiero disponer del flujo compartido completo y de las plantillas adecuadas para cada tipo de tarea, para preparar los cambios con criterios consistentes.
- **HU-03**: Como persona responsable, quiero aprobar cada fase de la especificación por separado, para conservar el control sobre lo que se define y se implementa.
- **HU-04**: Como agente, quiero instrucciones actuales, generales y utilizables desde este proyecto, para trabajar sin referencias obsoletas ni depender de otras copias de aplicaciones.
- **HU-05**: Como persona revisora, quiero conocer las comprobaciones realizadas y los límites de lo comprobado, para evaluar el resultado con información suficiente.

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Preparación y seguimiento de una tarea (HU-01, HU-02)

- **CA-01**: **Dada** una tarea nueva autorizada, **cuando** se prepara, **entonces** cuenta con una issue asignada a la persona responsable, una rama propia desde la base compartida y una pull request en borrador hacia la base de integración. La preparación permite revisar el alcance antes de implementar.
- **CA-02**: **Dado** el tipo de tarea, **cuando** se redactan su issue y su pull request, **entonces** se utiliza la plantilla correspondiente a funcionalidad, corrección, documentación, reorganización, pruebas o mantenimiento. El título y el tipo de rama siguen la plantilla elegida o la opción más cercana, sin reglas duplicadas que la contradigan.
- **CA-03**: **Dado** el flujo compartido del curso, **cuando** se incorpora a AsistenciApp, **entonces** está disponible su conjunto completo de instrucciones, responsabilidades, operaciones y plantillas. Cada operación remite a un recurso existente y adecuado a la ubicación de esta aplicación.
- **CA-04**: **Dada** una propuesta de cambios, **cuando** se prepara para revisión, **entonces** queda relacionada con su issue, indica qué cambia y cómo comprobarlo, y permite identificar las responsabilidades de autoría y revisión. La relación permite el cierre automático de la issue al fusionar en la rama por defecto; abrir el borrador no cierra la issue ni da el trabajo por terminado.

### Aprobaciones propias de AsistenciApp (HU-03)

- **CA-05**: **Dada** cualquier tarea de esta aplicación, **cuando** se desarrolla, **entonces** sigue el orden spec, aprobación, plan, aprobación, tareas, aprobación e implementación. Cada documento se presenta antes de redactar el de la fase siguiente. La creación de una issue, una rama o una pull request no autoriza a saltarse una fase.
- **CA-06**: **Dada** una aprobación, **cuando** se determina su alcance, **entonces** solo autoriza la fase y los cambios que cubre. Las aprobaciones de otras aplicaciones no autorizan cambios en AsistenciApp, y las reglas compartidas se utilizan respetando la constitución local.

### Instrucciones y comprobaciones (HU-04, HU-05)

- **CA-07**: **Dadas** las instrucciones de trabajo, arquitectura y uso, **cuando** se consultan tras la actualización, **entonces** describen el flujo instalado y permiten encontrar sus recursos. Las referencias obsoletas se sustituyen por referencias existentes, sin duplicar reglas que ya tengan una fuente definida.
- **CA-08**: **Dada** la documentación nueva o modificada, **cuando** se lee, **entonces** utiliza roles generales y rutas relativas al proyecto. No contiene nombres personales, comparaciones con carpetas de otras personas ni apartados de punto de partida basados en ramas o commits concretos. Las rutas de las operaciones permiten ejecutarlas desde el contexto indicado.
- **CA-09**: **Dada** una operación que necesita una configuración externa, **cuando** se consulta su guía, **entonces** se explica lo necesario para prepararla sin publicar credenciales ni sustituir una configuración personal existente. El resultado de la verificación distingue lo comprobado de lo que requiera una configuración externa que no se haya utilizado.
- **CA-10**: **Dada** la actualización del flujo de trabajo, **cuando** se revisa su resultado, **entonces** se registran las comprobaciones y sus resultados. Se conservan el comportamiento de asistencia, las pantallas, los datos, las reglas de privacidad y seguridad y las dependencias de la aplicación.

## 5. Fuera de alcance

- Desarrollar funcionalidades nuevas de asistencia o modificar las pantallas.
- Corregir las incidencias de validación ya documentadas.
- Cambiar los datos almacenados, las reglas de acceso, privacidad o seguridad, o las dependencias de la aplicación.
- Modificar la constitución, otras aplicaciones o la plantilla compartida del curso.
- Reescribir especificaciones históricas o trasladar decisiones de otras aplicaciones.
- Instalar credenciales, modificar configuraciones personales o dar por comprobada una conexión externa que no se haya utilizado.
- Redactar el plan, las tareas o la implementación antes de la aprobación de su fase anterior.

## 6. Preguntas abiertas

Ninguna. El alcance es incorporar el flujo compartido completo y actualizar sus instrucciones, conservando las aprobaciones y los límites propios de AsistenciApp.
