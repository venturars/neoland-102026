# Spec 004 · Retirar referencias personales heredadas

Estado: aprobada por Miguel el 2026-10-23. Creada el 2026-10-23.

Tarea: [issue #251](https://github.com/venturars/neoland-102026/issues/251). Revisión: [PR #252](https://github.com/venturars/neoland-102026/pull/252). Reglas vigentes: [constitución](../../CONSTITUTION.md) y [manual del agente](../../AGENT.md).

## Problema

Las instrucciones y notas heredadas todavía nombran a Víctor y su carpeta personal. Quien consulta esta copia necesita instrucciones generales para entrar en el proyecto y notas que conserven las decisiones y comprobaciones anteriores sin esa atribución personal.

## Usuarios

- Quien sigue el README para preparar y utilizar AsistenciApp.
- Quien consulta sus instrucciones y las decisiones o resultados anteriores.
- Miguel, responsable de las aprobaciones de esta copia.

## Historias de usuario

- **HU-01:** Como lector del README, quiero que las instrucciones de carpeta usen un usuario genérico para reconocer dónde debo entrar sin depender del nombre de otra persona.
- **HU-02:** Como lector de la documentación, quiero que desaparezcan las referencias heredadas a Víctor sin atribuir sus decisiones o pruebas a otra persona.
- **HU-03:** Como lector de las notas anteriores, quiero conservar sus fechas y lo que se decidió o comprobó.

## Criterios de aceptación

- **CA-01:** Dadas las dos instrucciones del README que cambian de carpeta, cuando se leen, entonces ambas muestran `staff/<usuario>/asistenciapp`; `<usuario>` representa un usuario genérico y no se sustituye por un nombre personal en el documento.
- **CA-02:** Dada la documentación de esta aplicación, cuando se revisa fuera de los documentos de la propia tarea 004, entonces no quedan referencias heredadas a Víctor, Victor o `victor-chang`, con independencia de mayúsculas o acentos. La documentación de 004 puede nombrarlas para explicar y verificar su retirada.
- **CA-03:** Dadas las notas históricas afectadas, cuando se elimina la atribución personal, entonces se conservan las fechas, decisiones y resultados registrados, sin atribuirlos a Miguel u otra persona ni presentarlos como verificaciones nuevas.
- **CA-04:** Dadas las reglas vigentes de esta copia, cuando se retiran las referencias heredadas, entonces Miguel conserva su responsabilidad y autoridad de aprobación y el ámbito de trabajo sigue siendo su carpeta actual.
- **CA-05:** Dado el resto de las instrucciones y de la aplicación, cuando finaliza esta tarea, entonces las indicaciones ajenas a esta retirada, el funcionamiento y los datos permanecen iguales.

## Relación con las decisiones anteriores

La tarea 002 exigió conservar intactas las atribuciones históricas durante aquel cambio. Esta nueva tarea permite retirar únicamente la atribución personal heredada; mantiene los hechos, fechas y resultados protegidos por aquella decisión. Los resultados de verificación de 002 y 003 siguen describiendo sus ejecuciones originales, sin reescribirlos como resultados de 004.

## Fuera de alcance

Eliminar los nombres de todas las personas; cambiar las reglas actuales de Miguel; alterar decisiones o resultados históricos; modificar código, pruebas existentes, datos, dependencias o el comportamiento de asistencia; reorganizar archivos o arquitectura; modificar otras aplicaciones o herramientas instaladas. El paso 005 se aborda por separado.

## Preguntas abiertas

Ninguna decisión de negocio pendiente. El plan concretará qué documentos y pasajes requieren la retirada y cómo comprobar su conservación.

## Estado de implementación

Implementada y verificada el 2026-10-23 tras la aprobación de las tareas por Miguel. Evidencia por criterio en [tasks.md](tasks.md). Revisión final aprobada por Miguel el 2026-10-23.
