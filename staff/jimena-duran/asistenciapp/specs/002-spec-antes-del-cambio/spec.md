# Spec 002 · Spec antes de tocar la app

Responsable: Jimena Durán. Issue: #237.
Estado: aprobada por Jimena Durán el 2026-10-22.
Referencia de alcance: tarea 002 de AsistenciApp del repositorio.

## 1. Problema

Las reglas heredadas exigen una especificación para nuevas funcionalidades,
pero no cubren explícitamente todos los cambios de pruebas o documentación.
Además, nombran otra carpeta y otra persona como responsable de aprobación.
Jimena Durán necesita decidir qué se hará antes de modificar su aplicación.
La Issue, la rama y la PR organizan el trabajo, pero no sustituyen esa decisión.

## 2. Usuarios

- Jimena Durán: revisa y aprueba cada fase del cambio en su aplicación.
- Agente: necesita conocer qué puede escribir antes de obtener aprobación.

## 3. Historias de usuario

- HU-01: Como Jimena, quiero aprobar una spec que cubra cualquier cambio de
  código, pruebas o documentación de uso antes de que ese cambio se escriba.
- HU-02: Como Jimena, quiero que el agente prepare primero solo la spec y
  espere mi aprobación antes del plan, las tareas y la implementación.
- HU-03: Como Jimena, quiero una nueva spec si la activa no cubre mi petición.
- HU-04: Como Jimena, quiero que Issue, rama y PR no sustituyan el SDD.
- HU-05: Como Jimena, quiero que las reglas indiquen mi carpeta y mi aprobación.

## 4. Criterios de aceptación

- CA-01 (HU-01): Dado un cambio de código, pruebas, README o documentación
  de uso sin spec aprobada que lo cubra, cuando se inicia el trabajo, entonces
  no se modifica ese archivo y lo primero que se escribe es la spec.
- CA-02 (HU-02): Dada una spec recién redactada, cuando termina su preparación,
  entonces se presenta a Jimena y se espera su aprobación, sin escribir todavía
  plan, tasks ni implementación.
- CA-03 (HU-02): Dada la aprobación de la spec, cuando continúa el trabajo,
  entonces se prepara el plan, se espera su aprobación, se preparan las tareas,
  se espera su aprobación y después se implementa.
- CA-04 (HU-03): Dada una petición no cubierta por la spec activa, cuando se
  prepara el cambio, entonces se abre otra spec sin reutilizar la 001 terminada.
- CA-05 (HU-04): Dada una Issue, rama o PR creada, cuando falta una spec
  aprobada, entonces esos elementos no autorizan a modificar la aplicación.
- CA-06 (HU-05): Dadas la constitución y la guía del agente, cuando se leen,
  entonces señalan staff/jimena-duran/asistenciapp/ como ámbito de trabajo
  y a Jimena Durán como quien aprueba cada fase.
- CA-07: Dado el historial de la spec 001, cuando se actualizan las reglas,
  entonces sus nombres, fechas y comprobaciones históricas quedan intactos.

## 5. Fuera de alcance

Cambios funcionales, nuevas dependencias, comandos de activación del entorno,
rutas o ejemplos del README, eliminación general de referencias personales y
reorganización de arquitectura. Las tareas 003, 004 y 005 tendrán sus propias
Issues, ramas y PR. No se reescribe la historia de la spec 001.

## 6. Preguntas abiertas

Ninguna. Jimena Durán aprobó esta spec el 2026-10-22.

## 7. Historial

- 2026-10-22: propuesta inicial para la aplicación de Jimena Durán; sin aprobación
  ni comprobaciones de implementación todavía.
- 2026-10-22: aprobación explícita de Jimena Durán; autorizada la preparación
  del plan, todavía sin implementación.

## Resultado local de implementación

Implementada la 002 tras aprobar spec, plan y tareas. Suite completa: 93 tests pasan.
Spec 001 intacta. Sin commit ni push; revisión humana final pendiente.
