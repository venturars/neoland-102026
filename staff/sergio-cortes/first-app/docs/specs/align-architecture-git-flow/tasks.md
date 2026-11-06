Issue: #1147.

# Tareas — alinear la arquitectura con el flujo de git

Pasos en el orden en que los haría una persona. Solo se toca `docs/ARCHITECTURE.md`. Ningún paso cambia código, paquetes, SQL ni `src/logic/`.

1. Leer `docs/ARCHITECTURE.md` y localizar el bloque del flujo de git. Resultado: anotadas las tres frases que hay que cambiar: la de `templates/issues/`, la de `templates/pull-request/` y la de `skills/commit-changes/SKILL.md`.

2. Sustituir en `templates/issues/` «seis plantillas» por «siete plantillas» y añadir `knowledge` a la lista de tipos. Resultado: la frase dice siete y lista `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `knowledge`.

3. Sustituir en `templates/pull-request/` «seis plantillas» por «siete plantillas». Resultado: la frase dice siete y el resto de la frase queda igual.

4. Sustituir en `skills/commit-changes/SKILL.md` la frase del mensaje por la nueva regla: la primera línea dice qué cambió, sin rutas de fichero, y el cuerpo nombra las funciones o ficheros implicados. Resultado: la frase coincide con el plan.

5. Contar las plantillas. Resultado: `ls templates/issues | wc -l` y `ls templates/pull-request | wc -l` dan 7 cada uno, y los nombres coinciden con los del ejercicio en `exercises/git-workflow-agent-template/templates/`.

6. Comparar la regla del mensaje con `skills/commit-changes/SKILL.md` del ejercicio. Resultado: la misma regla en las dos.

7. Revisar el bloque completo. Resultado: no queda «seis» en las frases del flujo de git de `docs/ARCHITECTURE.md`, y el resto del fichero no cambia.

8. Comprobar el alcance. Resultado: `git diff --stat` solo muestra `docs/ARCHITECTURE.md` y la carpeta `docs/specs/align-architecture-git-flow/`.

No hay paso de lint, formato ni tests: el cambio es Markdown sin código.
