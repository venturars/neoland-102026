# AGENTS.md — ChromaDB

Manual de trabajo para agentes de IA en este proyecto. [CONSTITUTION.md](docs/CONSTITUTION.md) define **qué reglas** se cumplen. [ARCHITECTURE.md](docs/ARCHITECTURE.md) define **cómo está organizado** el código. [STYLE.md](docs/STYLE.md) define **cómo se escribe** Python y cómo usar Black/Ruff.

El flujo git sigue [agents/git-workflow-agent.md](agents/git-workflow-agent.md).

---

## 1. Lectura obligatoria al empezar

1. [docs/CONSTITUTION.md](docs/CONSTITUTION.md)
2. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
3. [docs/STYLE.md](docs/STYLE.md)
4. Este archivo (`AGENTS.md`)
5. Spec activa: `docs/specs/<cambio>/spec.md`, y su `plan.md` / `tasks.md` si existen

Comandos operativos: [docs/COMMANDS.md](docs/COMMANDS.md). Árbol de carpetas: [docs/TREE.md](docs/TREE.md).

Si lo pedido contradice la constitución, **para y avisa** antes de escribir.

---

## 2. Git e intervención humana

- **Crear o aprobar la issue** es el momento humano explícito. La issue debe decir que **hay que implementar** el cambio y que **dos personas** lo revisan (nombres o criterio claro).
- **Con la issue creada:** escribe `docs/specs/<cambio>/spec.md`, `plan.md` y `tasks.md`, avanza con git e implementación **sin** paradas de revisión intermedia.
- **Parada obligatoria antes de pedir revisión:** tras implementar y subir cambios, **para**. No asignes revisores ni quites el draft hasta que la persona lo pida.
- **Llave (contraseña):** solo en **Implementación** (developer/tester). Si la ronda 9 falla, aplica `report.md` y espera la misma contraseña. No sustituye la parada antes de pedir revisión cuando el flujo terminó bien.

Un cambio empieza por el orquestador git (pensar, escribir, empezar, guardar, pedir revisión). **No** crees `docs/specs/<cambio>/` antes del número de issue. `<cambio>` en kebab-case.

---

## 3. SDD automatizable

Tras la issue, genera los tres ficheros en `docs/specs/<cambio>/` a partir de las plantillas (copiar y rellenar):

| Plantilla | Fichero destino |
| --- | --- |
| [templates/specs/specification.md](templates/specs/specification.md) | `spec.md` |
| [templates/specs/architectural-plan.md](templates/specs/architectural-plan.md) | `plan.md` |
| [templates/specs/task-checklist.md](templates/specs/task-checklist.md) | `tasks.md` |

- La spec debe incluir `Issue: #N` al inicio (además de METADATA).
- Specs ya existentes bajo `docs/specs/*` **no** se reescriben al nuevo formato; solo las **nuevas** usan estas plantillas.

---

## 4. Proyecto (resumen)

RAG local sobre la documentación oficial de Python (versión descargada). Consulta vía scripts; skill [skills/python-docs/SKILL.md](skills/python-docs/SKILL.md). CRUD de usuarios en `src/` aparte del RAG. Detalle: [README.md](README.md).

---

## 5. Implementación (developer / tester)

Tú eres el agente principal. No escribes código ni ejecutas comprobaciones: lanzas subagentes con tu mismo modelo. Encargo: leer `agents/developer.md` o `agents/tester.md`. Ellos no lanzan más subagentes.

Solo entras aquí cuando existen issue y `tasks.md`.

- La persona envía la **contraseña** de implementación. No la copies a ficheros.
- Ronda 1 según `tasks.md`. Encargo: rutas y número de ronda solamente.
- Developer: rondas 2–3, 5–6, 8–9 reanudado; 1, 4, 7 nuevo. Tester nunca se reanuda.
- Developer puede editar todo `staff/raul-santamaria/ChromaDB` salvo `docs/specs/`.
- Tester solo si la task toca `src/core` o `src/sdk`.
- Tester reporta ronda, task, veredicto y comprobaciones fallidas. Precisa spec/plan/tasks; no añadas objetivos ni código tú.
- Éxito: todas las comprobaciones de `spec.md` OK → borrar `tasks.md`.
- Fallo ronda 9: `docs/specs/<cambio>/report.md`, borrar `tasks.md`, esperar misma contraseña para reintentar.

Tras implementación y push, **para** antes de pedir revisión.

---

## 6. Definition of done

- [ ] Tasks de `tasks.md` completadas.
- [ ] Comprobaciones de `spec.md` verificadas (tester cuando aplique).
- [ ] En ficheros Python tocados: `python -m black` y `python -m ruff check` (ver [docs/COMMANDS.md](docs/COMMANDS.md)).
- [ ] Servicios locales parados (Chroma en 8000, Jupyter) si se arrancaron.

No hay suite pytest global.

---

## 7. Al terminar una tarea operativa

- Ejecuta el script o comando que demuestre que funciona.
- Para ChromaDash/Chroma server: comprobar puerto 8000 libre (`Get-NetTCPConnection -LocalPort 8000` en Windows).
