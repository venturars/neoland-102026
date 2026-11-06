# Plan de actualización del flujo

Issue: #1028 · PR: #1031. Referencia: [spec](spec.md).
Autorización conjunta del 2026-11-04 registrada en la spec.

## Fuente y cambios

Contrastar `exercises/git-workflow-agent-template` en staging
`2c727db4549bbf93458f1aaf3b1fcb1f26942346` con la copia de AsistenciApp.
Adaptar las novedades de entrevistas, Empezar y mensajes técnicos, conservando
la delegación nativa de Codex y los cinco momentos de esta aplicación.

- `agents/git-workflow-agent.md`: comprobar definición y coherencia; mostrar las
  preguntas y esperar; pasar el historial completo al reanudar. Una issue existente
  que requiere ediciones prepara o reutiliza el momento draft antes de editar.
- `agents/help-me-to-think.md`: devolver preguntas con recomendaciones y terminar
  la invocación. El principal recibe las respuestas y vuelve a llamar con historial.
- `skills/grill-me/SKILL.md` y `skills/grill-with-docs/SKILL.md`: mismo protocolo de
  rondas. La segunda consulta primero las respuestas disponibles en el repositorio.
- `skills/commit-changes/SKILL.md`: mensaje convencional en inglés, una línea,
  archivo o función y cambio concreto; conservar `chore: open #N` para la apertura.
- `AGENTS.md`: añadir el estado de 014. `docs/ARCHITECTURE.md`: describir el recorrido
  y enlazar los tres documentos nuevos de `specs/014-rondas-y-commits/`.

No hay modelo de datos, rutas ni dependencias nuevas. Los scripts y las specs
001–013 conservan su contenido. La constitución 4.2 ya permite ejecutar varios
momentos expresamente autorizados; no requiere enmienda.

## Comprobación de la constitución

| Regla | Aplicación |
| --- | --- |
| P1 | El mantenimiento no añade integraciones del registro. |
| P2 | Cinco instrucciones activas, sin herramientas ni abstracciones nuevas. |
| P3 y §3 | Sin paquetes ni cambios de stack. |
| P4 | Sin lecturas ni cambios de datos personales, secretos o credenciales. |
| P5 | Pantallas y accesibilidad permanecen iguales. |
| P6 | Documentos en español; los mensajes convencionales siguen el inglés del template. |
| §4 | Spec, plan y tareas se preparan antes de implementar, bajo la autorización conjunta. |
| §5 | Cada criterio tiene un recorrido documental; se conserva la regresión existente. |
| §6 | Código, límites, reservas, permisos y pruebas de seguridad permanecen idénticos. |
| §7–§8 | Solo cambia esta carpeta; constitución e historial de enmiendas intactos. |

## Comprobaciones

Leer los documentos finales y registrar entrada, decisión esperada y resultado
observado para nueve recorridos: tarea definida; ronda ambigua; respuestas
parciales; cambio de subagente; cambio de alcance; issue sin draft; reanudación
con draft; mensajes de commit; confirmación inaccesible y conservación de límites.

Comparar el diff y los archivos protegidos con la base staging: `app.py`,
`asistencia/`, `static/`, `tests/`, requisitos, constitución, scripts y specs
anteriores. Usar hashes para acreditar que la regresión ejecutada sobre la base
sigue correspondiendo al mismo código. Registrar resultados existentes de pytest
y Node, con su procedencia y límites. No atribuir a una lectura documental la
prueba de una nueva sesión de IA. `git diff --check` debe terminar sin errores.
