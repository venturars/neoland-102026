# Plan — rondas y commits

Issue: #1022 · PR: #1023. Referencia: [spec.md](spec.md).
Autorización conjunta de Miguel el 2026-11-04, descrita en la spec.

## Cambios

1. En agents/git-workflow-agent.md, ajustar Pensar para devolver varias preguntas,
   esperar respuestas y pasar el historial completo cuando no se reanuda el mismo
   subagente. Reconocer issue escrita → Empezar antes de editar, conservando el
   momento solicitado y los pasos de apertura existentes.
2. En agents/help-me-to-think.md, sustituir la restricción de una pregunta por
   rondas con recomendaciones. El principal recibe el resultado y espera.
3. En skills/grill-me/SKILL.md y skills/grill-with-docs/SKILL.md, alinear la salida
   de cada invocación con esas rondas. La lectura del repositorio y el resumen
   final conservan sus responsables actuales.
4. En skills/commit-changes/SKILL.md, pedir un mensaje concreto que nombre archivo
   o función y cambio, manteniendo chore: open #N para la apertura.
5. Actualizar el resumen de arquitectura y el inventario de esta carpeta SDD.

Los cinco textos activos se adaptan a Codex; los scripts y las plantillas siguen
intactos. No se añaden paquetes ni se cambia el código de la aplicación.

## Verificación y entrega

Recorrer varias preguntas, espera, reanudación con historial nuevo, respuestas
ya resueltas, lectura del repo e issue existente antes de editar. Contrastar un
mensaje concreto con update files y la apertura vacía. Registrar los resultados
en tasks.md como comprobaciones documentales, sin crear recursos de prueba.

Ejecutar pnpm format y después pnpm lint; revisar el diff y conservar los archivos
ajenos. Publicar mediante el flujo delegado y verificar #1023 hacia staging, su
enlace con #1022 y las solicitudes a Jimena y Meghan tras el último push.
