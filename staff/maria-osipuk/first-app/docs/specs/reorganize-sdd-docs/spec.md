# Reorganizar los documentos SDD

Issue: #754.

Estado: implementado y comprobado, tras la autorización expresa.

## Qué se pide

Que cada documento de trabajo de `first-app` tenga un solo papel. La constitución recoge el propósito, el alcance y los principios. El manual de trabajo recoge el proceso y las aprobaciones. Las reglas técnicas que hoy viven en la constitución pasan a las guías que ya existen, sin crear un documento nuevo.

También se pide que la spec sea un paso obligatorio para cualquier cambio de la app. Hoy el manual solo la exige para una funcionalidad o una forma de trabajar, así que un cambio de documentación podía hacerse sin ella.

## A quién obliga

A las personas y agentes que trabajan en `first-app`, y a quien revisa sus cambios.

## La regla

- La constitución contiene el propósito, el alcance actual, los principios de diseño, las decisiones tecnológicas, la seguridad y el gobierno del proyecto. Enlaza a las guías y no repite sus detalles.
- El alcance dice lo que la app hace hoy y lo que queda fuera: autenticación, alta desde la web y notas.
- No se crea una guía nueva. Cada regla técnica va a un documento que ya existe:
  - pnpm y la revisión de paquetes con Socket van al manual de trabajo, en un apartado de paquetes;
  - la firma, los pasos, la actualización parcial y la respuesta de una función de negocio van a la guía de estilo;
  - la tabla de qué documento se actualiza según lo que cambie va al cierre del manual de trabajo.
- La revisión con Socket conserva cada dato con su herramienta: `depscore` para las puntuaciones, `alerts` con el `org_slug` de `organizations` y `threat_feed` para la campaña, y dice el motivo cuando una herramienta no contesta.
- El manual de trabajo dice qué documento consultar, el flujo de Git y sus autorizaciones, el SDD de la app, los paquetes, la implementación y el cierre.
- Cualquier cambio de un archivo de la app, también uno solo documental, sigue este orden: issue, rama, pull request en borrador y `docs/specs/<nombre>/`. Ningún archivo se edita antes de que la persona responsable confirme que revisó `spec.md`, `plan.md` y `tasks.md`.
- El orquestador de Git, al terminar el paso de empezar, remite a ese SDD. No encadena la edición de archivos.
- Si la pull request de la rama ya existe, se reutiliza y conserva su estado de revisión y su enlace con la issue.
- La arquitectura describe las llamadas entre clientes, lógica y consultas sin presentar los archivos SQL como una capa.

## Ejemplo correcto

La persona responsable pide corregir una frase de la arquitectura. Se crea la issue, la rama y la pull request en borrador. Se escriben `spec.md`, `plan.md` y `tasks.md` en `docs/specs/<nombre>/`. Después de la confirmación de la persona responsable, se corrige la frase.

## Ejemplo que no se sigue

Se edita la arquitectura directamente porque «solo es documentación», o el orquestador abre la pull request y sigue editando archivos sin spec. También falla perder la regla de `threat_feed` al mover la sección de paquetes, o crear un documento nuevo para reglas que caben en una guía existente.

## Cómo se comprueba

- La constitución solo contiene los apartados de la regla y enlaza a las guías.
- El manual de trabajo y la guía de estilo contienen las reglas técnicas que salen de la constitución, sin perder ninguna.
- El manual de trabajo y el orquestador exigen la spec para cualquier cambio, incluido uno documental.
- `docs/` no tiene documentos nuevos, el árbol incluye esta spec y los enlaces entre documentos funcionan.
- `pnpm format` no cambia archivos ajenos a la tarea.

## Queda fuera

Cambiar el código, las consultas, la base de datos, los clientes o las dependencias. Modificar AsistenciApp (tiene su propia spec en la misma issue), otras aplicaciones o la plantilla compartida del curso. Reescribir specs históricas.
