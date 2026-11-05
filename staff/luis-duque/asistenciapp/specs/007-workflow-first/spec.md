# Spec 007 · El pedido entra por el flujo

Estado: aceptada el 2026-11-05. Plan aceptado el 2026-11-05.
Issue: #1038.
Ámbito: `staff/luis-duque/asistenciapp/`.

## 1. Problema

Un pedido que cambia la app se lee como escribir la spec, y el flujo de git no llega a arrancar. Quien pide el cambio necesita que la primera respuesta sea ese flujo: pensar una tarea, dejarla escrita, empezar, guardar un trozo o pedir revisión.

Si el pedido ya nombra el momento, se usa ese. Si la tarea ya está en curso, el pedido sigue en su momento o en su fase. Se piensa la tarea solo si es nueva. Una pregunta sobre el proyecto, o un mensaje que no provoque un cambio, se responde y no abre el flujo.

Pedir el cambio no escribe la spec como primera respuesta. Con la rama ya abierta, la fase siguiente es la spec, y se para. Luego el plan, y se para. Luego las tareas, y se para. La spec no espera a pedir revisión. Las paradas de especificar, planificar, desglosar e implementar siguen. La spec 006 deja el flujo instalado y no cubre este pedido.

## 2. Usuarios

- Quien pide un cambio: quiere que el flujo de git arranque antes de la spec.
- Quien pregunta por la app, o manda un mensaje que no la cambia: quiere la respuesta, sin que se abra una tarea.
- Quien aprueba: quiere seguir parando en la spec, en el plan, en las tareas y en la implementación.
- Quien pasa lista: no nota ningún cambio.

## 3. Historias de usuario

- HU-01: Como quien pide un cambio, quiero que la primera respuesta sea un momento del flujo de git y no la spec.
- HU-02: Como quien pide un cambio nuevo sin nombrar el momento, quiero que se piense la tarea antes de escribir nada. Si la tarea ya está en curso, quiero que el pedido siga en su fase.
- HU-03: Como quien pregunta por la app, quiero la respuesta sin que se abra el flujo ni se cree una spec.
- HU-04: Como quien manda un mensaje que no cambia la app, quiero lo mismo que en una pregunta.
- HU-05: Como quien aprueba, quiero que la spec, el plan, las tareas y la implementación sigan siendo paradas.
- HU-06: Como quien pasa lista, quiero que la aplicación siga igual.

## 4. Criterios de aceptación

- CA-01 (HU-01): Dado un pedido que cambia asistenciapp, cuando llega, entonces la primera respuesta es un momento del flujo de git y no se crea `spec.md`.
- CA-02 (HU-02): Dado un pedido de cambio nuevo que no nombra el momento, cuando llega, entonces se piensa la tarea y no se escribe la spec como primera respuesta. Dada una tarea ya en curso, cuando el pedido no nombra un momento, entonces sigue en su fase. Con la rama abierta, la fase siguiente es la spec, luego el plan y luego las tareas. No se abre otra entrevista. La spec no espera a pedir revisión.
- CA-03 (HU-03): Dada una pregunta sobre el proyecto, cuando se responde, entonces no arranca el flujo y no se crea `spec.md`.
- CA-04 (HU-04): Dado un mensaje que no provoca un cambio en el proyecto, cuando se responde, entonces no arranca el flujo y no se crea `spec.md`.
- CA-05 (HU-05): Dado el manual y el orquestador, cuando se leen, entonces un cambio entra por el flujo de git y las paradas de spec, plan, tareas e implementación siguen.
- CA-06 (HU-06): Dado el paso de lista ya existente, cuando se aplica este cambio, entonces no cambia el comportamiento de la aplicación ni se añade ninguna dependencia. La constitución no se enmienda.

## 5. Fuera de alcance

- Cambiar lo que hace la aplicación al pasar lista.
- Enmendar la constitución.
- Tocar `app.py`, `asistencia/`, `static/`, `tests/` o `requirements.txt`.
- Pasar el trabajo a `staging`.
- Reescribir la spec 006.

## 6. Preguntas abiertas

Ninguna.
