# Rondas de preguntas y cambios reconocibles

Issue: #1028 · PR: #1031.
Autorización conjunta de Miguel del 2026-11-04: «termina todo, todo aprobado,
hasta PR en review de todo lo que falta». Cubre preparar los documentos,
implementar y publicar esta entrega; no atribuye revisiones individuales.

## Problema

El flujo actual obliga a resolver una sola pregunta por turno y puede perder lo
respondido al cambiar de agente. Quien revisa un cambio también necesita reconocer
su propósito en el mensaje que lo guarda.

## Usuarios

Miguel y los agentes que aclaran, preparan y publican tareas de AsistenciApp.

## Historias de usuario

- Como Miguel, quiero responder juntas las preguntas necesarias y conservar mis
  respuestas para avanzar sin repetir decisiones.
- Como quien revisa, quiero que cada cambio guardado identifique qué parte cambió
  y de qué manera.

## Criterios de aceptación

- **CA-01:** Dada una tarea ambigua, cuando se aclara, entonces se presentan las
  preguntas necesarias con una recomendación por pregunta y se espera la respuesta.
- **CA-02:** Dada una entrevista reanudada, cuando cambia el agente o quedan
  respuestas pendientes, entonces se conserva todo el historial y solo se
  consultan decisiones pendientes o nuevas.
- **CA-03:** Dada una tarea, cuando su problema, resultado, alcance y comprobación
  están definidos y son coherentes con el proyecto, entonces se usa ese contexto
  para escribirla sin repetir una entrevista resuelta.
- **CA-04:** Dada una tarea escrita que requiere editar el proyecto, cuando empieza
  el trabajo, entonces se prepara o reanuda su apertura antes de editar y se
  mantienen los cinco momentos propios de la aplicación.
- **CA-05:** Dado un cambio que se guarda, cuando se describe, entonces el mensaje
  identifica el archivo o función y el cambio concreto; la apertura vacía conserva
  su mensaje establecido.
- **CA-06:** Dado este mantenimiento, cuando se verifica la entrega, entonces se
  conservan las responsabilidades, confirmaciones y protecciones de publicación,
  la aplicación y sus datos, dependencias, seguridad e historial documental.

## Fuera de alcance

Modificar el producto, las herramientas ejecutables o el proceso documental de
otras aplicaciones; cambiar las reglas de asistencia o las dependencias.

## Preguntas abiertas

Ninguna para esta actualización.
