# Spec 006 · Flujo de git del curso en AsistenciApp

Estado: aprobada el 2026-11-03. Plan y tareas aprobados. Implementación T01–T10 hecha; pendiente de prueba/ok final.
Issue: #777.
Ámbito: `staff/luis-duque/asistenciapp/`.

## 1. Problema

El flujo de git del curso vive en `exercises/git-workflow-agent-template`. En AsistenciApp ya hay una copia parcial de agentes, skills, tools, plantillas y MCP, con rutas apuntando a esta app. El manual de trabajo (`AGENTS.md`) y el orquestador aún no tratan ese flujo como el de la app: pensar una tarea, dejarla escrita, empezar, guardar un trozo y pedir revisión. Quien trabaja aquí no tiene un solo sitio que diga cómo encajan ese flujo y las paradas de spec → plan → tasks → implementación.

Las specs 001 a 005 están hechas y no cubren este pedido.

## 2. Usuarios

- Quien escribe o aprueba el cambio: quiere el flujo de git del curso dentro de esta carpeta, con rutas de esta app.
- Quien trabaja con el agente: necesita que `AGENTS.md` diga que el flujo de git es el orquestador de esta carpeta, sin quitar las paradas SDD.
- Quien usa la aplicación (profesor y alumno): no nota ningún cambio al pasar lista.

## 3. Historias de usuario

- HU-01: Como quien trabaja en la app, quiero en esta carpeta la copia completa del flujo de la plantilla (`agents/`, `skills/`, `tools/`, `templates/`, `MCPS/`).
- HU-02: Como quien lanza un script del flujo, quiero que las skills apunten a `staff/luis-duque/asistenciapp/tools/` y no a `./tools/`.
- HU-03: Como quien sigue el manual, quiero que `AGENTS.md` diga que el flujo de git de esta app es `agents/git-workflow-agent.md` (pensar, dejar escrita, empezar, guardar un trozo, pedir revisión) y que eso no quita las paradas de especificar, planificar, desglosar e implementar.
- HU-04: Como orquestador, quiero que `agents/git-workflow-agent.md` deje claro que no se salta la parada de la spec, la del plan ni la de las tareas, y que sigue sin pasar el trabajo a `staging`.
- HU-05: Como profesor o alumno, quiero seguir pasando lista igual que ahora.

## 4. Criterios de aceptación

- CA-01 (HU-01): Dada la carpeta de AsistenciApp, cuando se revisan `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`, entonces están los mismos ficheros relativos que en la plantilla y se pueden leer.
- CA-02 (HU-02): Dadas las skills que lanzan un script, cuando se lee el comando, entonces apunta a `./staff/luis-duque/asistenciapp/tools/…` y el resto del texto coincide con la plantilla salvo esa ruta.
- CA-03 (HU-03): Dado `AGENTS.md`, cuando se lee el inicio del manual, entonces indica que el flujo de git es `agents/git-workflow-agent.md` entero (pensar, dejar escrita, empezar, guardar un trozo, pedir revisión) y que ese flujo no quita las paradas del flujo SDD.
- CA-04 (HU-04): Dado `agents/git-workflow-agent.md` de esta carpeta, cuando se leen los límites, entonces dice que no se salta la parada de la spec, la del plan ni la de las tareas, y que no hace merge a `staging`.
- CA-05 (HU-05): Dado el paso de lista ya existente, cuando se aplica este cambio, entonces no cambia el comportamiento de la aplicación ni se añade ninguna dependencia.

## 5. Fuera de alcance

- Cambiar lo que hace la aplicación al pasar lista.
- Enmendar los principios de la constitución (salvo, si hace falta en el plan, alinear la ruta del §7 con `staff/luis-duque/asistenciapp/` como corrección de alcance del repo).
- Tocar `app.py`, `asistencia/`, `static/`, `tests/` o `requirements.txt`.
- Hacer merge a `staging`.
- Configurar el token de GitHub en la máquina (queda fuera del cambio de ficheros de la app).

## 6. Preguntas abiertas

Ninguna pendiente.

Decisiones (2026-11-03):
- Se crea primero la issue en GitHub; después se aprueba esta spec y se sigue el plan.
- Se sustituye por completo `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/` con la plantilla, y después se reajustan las rutas de las skills a `./staff/luis-duque/asistenciapp/tools/`.
