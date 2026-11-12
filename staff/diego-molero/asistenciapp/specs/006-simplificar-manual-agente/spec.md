# Spec 006 · Manual del agente claro y documentación organizada

> Estado: **Conformidad final recibida; entrega autorizada** · Versión: 1.2 · Creada, aprobada y aceptada: 2026-10-30
>
> Referencia de revisión: [comentarios sobre el manual de AsistenciApp](https://github.com/venturars/neoland-102026/pull/516#pullrequestreview-5679859525).
>
> Tarea: [#655](https://github.com/venturars/neoland-102026/issues/655).

## 1. Problema

El manual del agente mezcla el procedimiento de trabajo con el árbol de carpetas, las instrucciones de ejecución y las normas de escritura. Algunas reglas se repiten y la introducción describe el propio documento sin ayudar a realizar una tarea.

Queremos que el manual indique con claridad cómo empezar, cuándo pedir aprobación y cuándo detenerse. La estructura, el estilo y las instrucciones de uso deben poder encontrarse desde ese manual sin mantener copias de la misma información en varios lugares.

## 2. Usuarios

| Usuario | Qué necesita |
| --- | --- |
| Persona que mantiene AsistenciApp | Encontrar cada instrucción en su lugar y conservar el control de cada fase. |
| Agente de IA | Leer las reglas necesarias, saber qué puede hacer y detenerse cuando corresponde. |
| Persona que ejecuta la aplicación | Consultar la preparación, el arranque, las comprobaciones y el cierre en las instrucciones de uso. |

## 3. Historias de usuario

- **HU-01**: Como agente, quiero que el manual empiece con instrucciones concretas de lectura y actuación, para saber cómo comenzar sin introducciones repetidas.
- **HU-02**: Como persona que mantiene la aplicación, quiero encontrar por separado el procedimiento, la estructura, el estilo y el uso, para actualizar una instrucción en un solo lugar.
- **HU-03**: Como persona responsable, quiero conservar las aprobaciones entre especificación, plan, tareas e implementación, para dirigir el cambio igual que hasta ahora.
- **HU-04**: Como agente, quiero que los avisos y las referencias sean claros y coherentes, para saber qué comunicar y cuándo esperar una respuesta.
- **HU-05**: Como profesor o alumno, quiero seguir utilizando la aplicación y sus datos con el mismo comportamiento.

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

- **CA-01**: **Dado** el manual, **cuando** se empieza a leer, **entonces** la primera sección explica qué documentos consultar y qué hacer antes de comenzar una tarea; el propio manual es el punto de entrada y enlaza las lecturas posteriores, manteniendo la prioridad de la constitución ante conflictos. No hay una introducción que se limite a describir el propio manual.
- **CA-02**: **Dadas** las instrucciones de estructura y estilo, **cuando** se buscan desde el manual, **entonces** se llega mediante enlaces a sus documentos de referencia y no se mantienen copias completas de esas instrucciones dentro del manual.
- **CA-03**: **Dadas** las instrucciones para preparar el entorno, arrancar, comprobar y cerrar la aplicación, **cuando** se consultan desde el manual, **entonces** se llega al documento de uso y los comandos no se mantienen duplicados en el manual.
- **CA-04**: **Dadas** las aprobaciones actuales, **cuando** se reorganiza la documentación, **entonces** siguen siendo obligatorias y expresas entre especificación, plan, tareas e implementación; una tarea escrita, una rama o una solicitud de revisión no autorizan por sí solas a avanzar. Se conserva también la aprobación del mensaje y los archivos antes de guardar y publicar cambios.
- **CA-05**: **Dadas** las reglas de comportamiento, **cuando** se leen junto al procedimiento de trabajo, **entonces** cada regla tiene una ubicación principal, las referencias llevan a ella y no hay instrucciones duplicadas que se contradigan. Se conservan el alcance de esta copia, la obligación de aclarar dudas y la de cerrar los procesos iniciados.
- **CA-06**: **Dado** un pedido que contradice las reglas del proyecto, **cuando** lo recibe el agente, **entonces** el manual indica que debe explicar qué regla entra en conflicto y esperar la respuesta de la persona responsable antes de modificar archivos. Las referencias a reglas y documentos permiten localizar su contenido sin repetirlo ni depender solo de un número de apartado.
- **CA-07**: **Dadas** las instrucciones de escritura de funciones, **cuando** cambian de documento, **entonces** se conservan las exigencias de tipos, parámetros, resultado y ejemplo de uso. Las comprobaciones existentes verifican la nueva ubicación sin eliminar esas exigencias.
- **CA-08**: **Dada** la documentación reorganizada, **cuando** se siguen los enlaces y se compara con la aplicación, **entonces** los destinos existen, la estructura descrita coincide con esta copia y los textos se leen correctamente en español y UTF-8.
- **CA-09**: **Dados** los datos, las pantallas y las acciones actuales, **cuando** termina la reorganización documental, **entonces** su comportamiento permanece igual. Las decisiones, fechas y verificaciones históricas de las especificaciones anteriores se conservan.

## 5. Fuera de alcance

- Incorporar el flujo de agentes y operaciones de Git de otra copia.
- Sustituir las aprobaciones actuales por los cinco momentos de otro proyecto.
- Cambiar los principios de la constitución o su procedimiento de aprobación.
- Añadir funcionalidades de asistencia, cambiar pantallas, datos, permisos o dependencias.
- Copiar ChromaDB, construir su índice o desarrollar clientes de usuarios y notas.
- Reescribir las especificaciones anteriores o actualizar como verificado el estado histórico de sus entregas.
- Crear una solicitud de revisión, publicar cambios o fusionarlos sin una petición posterior.

## 6. Preguntas abiertas

Ninguna sobre el alcance implementado. La persona que trabaja en esta carpeta aprobó la especificación, el plan y las tareas y autorizó la implementación el 2026-10-30. Después dio su conformidad final al resultado y autorizó completar la entrega sin más pausas. Las comprobaciones del agente están registradas en [tasks.md](tasks.md). La revisión de compañeros y el merge siguen pendientes.

## 7. Historial

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-30 | Borrador inicial | Revisar el manual y separar sus responsabilidades conservando las aprobaciones y el funcionamiento de la aplicación. |
| 1.0 | 2026-10-30 | Especificación aprobada | Aprobación expresa en el chat para preparar el plan técnico; las tareas y la implementación siguen pendientes. |
| 1.1 | 2026-10-30 | Implementación comprobada por el agente | Documentación separada; 13 pruebas de arquitectura y 93 de la suite superadas. Conformidad final de Diego y entrega pendientes. |
| 1.2 | 2026-10-30 | Conformidad final y entrega autorizada | Diego acepta la reorganización y autoriza completar la entrega de la tarea #655. Revisión de compañeros y merge pendientes. |
