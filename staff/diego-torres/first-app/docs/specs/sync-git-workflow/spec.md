Issue: #993

# Actualizar el flujo de git con la plantilla del curso

Quien trabaja en first-app con el agente sigue un flujo de git. Ese flujo se ha quedado por detrás de la plantilla del curso. Este cambio lo pone al día, para que funcione igual que el del resto del curso.

Lo usa el alumno al pensar una tarea, dejarla escrita, empezarla, guardarla y pedir revisión.

## Qué cambia

- **Pull request:** se abre en draft y asignada a quien está autenticado en un solo paso, en lugar de en tres.
- **Entrevista:** en cada ronda se pueden hacer varias preguntas, cada una con su respuesta recomendada. El agente espera las respuestas del alumno y sigue cuando las tiene.
- **Empezar:** si la issue ya está escrita y lo siguiente hace cambios, se pasa directamente a empezar.
- **Cada paso:** se confirma que un paso ha salido bien antes de lanzar el siguiente.
- **Mensaje de commit:** nombra el fichero o la función y el cambio, en una línea. No vale un verbo suelto, como `update files`. El commit vacío sigue siendo `chore: open #N`.

## Qué sigue igual

Las rutas propias de esta carpeta, la comprobación de paquetes con Socket, el orden de spec, plan y tasks, las paradas para revisar y la regla de no hacer merge a `staging`.

## Ejemplo

El alumno tiene una issue escrita y pide empezar. El agente adelanta `staging`, crea la rama, hace el commit vacío y lo sube. Abre la pull request, que ya sale en draft y asignada al alumno, y la enlaza con la issue.

## Errores

Si un paso falla, el agente dice qué ha fallado y sigue cuando se resuelve. Si la herramienta no devuelve la dirección de la pull request, lo dice y no se inventa el enlace.

## Qué queda fuera

La app y su código, `asistenciapp`, las carpetas de otras personas y cualquier cambio en la plantilla del curso.
