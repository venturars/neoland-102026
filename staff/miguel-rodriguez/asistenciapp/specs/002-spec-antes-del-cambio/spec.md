# Spec 002 · Aprobar el cambio antes de hacerlo

Estado: aprobada por Miguel el 2026-10-22.

Tarea: [issue #218](https://github.com/venturars/neoland-102026/issues/218). Depende de la copia original de la issue #212.

## Problema

Las instrucciones heredadas protegen el desarrollo de funcionalidades nuevas, pero no dejan igual de claro que también hay que acordar los cambios de documentación y pruebas. Además, todavía atribuyen la aprobación y el lugar de trabajo al responsable de la aplicación original.

Miguel necesita decidir qué se cambia en su copia antes de que se haga. Tener una tarea registrada o una revisión abierta no sustituye esa decisión.

## Usuarios

- Miguel, que revisa y aprueba los cambios de su aplicación.
- El agente que prepara y ejecuta esos cambios.

## Historias de usuario

- **HU-01:** Como Miguel, quiero revisar qué se va a cambiar antes de que se modifique la aplicación, también cuando el pedido afecte a sus instrucciones o pruebas.
- **HU-02:** Como agente, quiero saber cuándo detenerme y qué aprobación necesito para seguir.
- **HU-03:** Como responsable de esta copia, quiero que las reglas vigentes señalen mi lugar de trabajo y mi aprobación, conservando la evidencia anterior.

## Criterios de aceptación

- **CA-01:** Dado un pedido de cambiar código, pruebas, instrucciones de uso u otra documentación de la aplicación, cuando aún no existe una especificación aprobada que lo cubra, entonces el agente solo redacta esa especificación y no realiza el cambio.
- **CA-02:** Dada una especificación recién redactada, cuando termina su preparación, entonces el agente la muestra y espera el sí explícito de Miguel antes de preparar el plan o las tareas.
- **CA-03:** Dada la aprobación de la especificación, cuando continúa el trabajo, entonces se prepara el plan, después las tareas y finalmente se ejecuta el cambio, con aprobación de Miguel entre esas fases.
- **CA-04:** Dado un pedido que no está cubierto por la especificación activa, cuando se empieza a preparar, entonces se abre otra especificación y no se amplía silenciosamente una ya terminada.
- **CA-05:** Dada una issue, una rama o una PR que describe el pedido, cuando falta la especificación aprobada, entonces esos elementos no autorizan a modificar la aplicación.
- **CA-06:** Dadas las reglas vigentes de esta copia, cuando se identifica dónde se trabaja y quién aprueba, entonces señalan `staff/miguel-rodriguez/asistenciapp/` y a Miguel.
- **CA-07:** Dadas las decisiones, aprobaciones y verificaciones anteriores, cuando se adaptan las reglas vigentes, entonces sus autores, fechas y resultados históricos permanecen intactos.
- **CA-08:** Dada la aplicación de asistencia existente, cuando se actualizan estas reglas, entonces su funcionamiento, privacidad y datos permanecen iguales.

## Fuera de alcance

Corregir los títulos del entorno en las instrucciones de uso; eliminar todas las referencias personales de la documentación; renombrar o mover documentos; reorganizar el código; nuevas funcionalidades; integraciones con Discord o Meet; cambios en herramientas compartidas del repositorio. Esas tareas se abordan por separado.

## Preguntas abiertas

Ninguna decisión de negocio pendiente. La adaptación del responsable y de la carpeta es parte de la tarea autorizada; el plan identificará las enmiendas necesarias en las reglas actuales antes de implementarlas.
