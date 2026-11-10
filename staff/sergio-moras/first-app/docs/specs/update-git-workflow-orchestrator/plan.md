# Plan: Actualizar el orquestador del flujo de git

Implementa [spec.md](spec.md). Respeta [CONSTITUTIONS.md](../../CONSTITUTIONS.md). Solo cambia documentación: sin código, sin paquetes y sin cambios en la tabla.

## Fichero
```
agents/git-workflow-agent.md   tres puntos del flujo
```

## Cambios
Se reescriben tres líneas de `agents/git-workflow-agent.md`. El resto del fichero no cambia.

| Sección | Hoy | Queda |
|---|---|---|
| 2. Contexto y Alcance, «Cuándo actuar» | Cuándo actúa el orquestador | Lo mismo, y una frase más: todo cambio en el proyecto va en una rama nueva, con una pull request nueva en draft |
| 3. Flujo, «Validación» | Elige un momento y pide los datos que falten | Elige el momento por el estado real de la tarea, no por cómo está escrita la petición. Antes de crear la issue, dos casos en sublista: está clara (se crea y se explica en una frase) o tiene dudas o contradicciones (se piensa con `agents/help-me-to-think.md`, sin repetir lo resuelto salvo novedades). En los demás pasos pide lo que falte, como hoy |
| 3. Flujo, «Empezar» | `Empezar, en este orden:` | Empezar, con la issue ya escrita y la rama nueva desde `staging` antes de cualquier cambio, en este orden |

## Decisiones
| Tema | Decisión | Motivo |
|---|---|---|
| Qué es «clara» | Están el problema, el resultado esperado, el alcance y cómo comprobarlo, y encajan con el proyecto | Son los cuatro datos que piden las plantillas de issue |
| Texto | Escrito para first-app, con los nombres de sus agentes y skills | El flujo es el del curso; el texto es de este proyecto |
| Pasos de «Empezar» | No cambian | Ya siguen el flujo del curso |

## Cómo se prueba
- Leer las tres secciones y compararlas con la spec.
- `git diff` solo muestra esas tres partes de `agents/git-workflow-agent.md`.
- Los enlaces a `agents/help-me-to-think.md` y al resto de agentes y skills siguen apuntando a ficheros que existen.
