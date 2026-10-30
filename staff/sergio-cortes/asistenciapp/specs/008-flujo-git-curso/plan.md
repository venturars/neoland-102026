# Plan técnico 008 · Flujo de git del curso

> Estado: **Implementado** (2026-10-30) · Spec: [spec.md](spec.md) v1.1 · Creado: 2026-10-30 · Aprobado: 2026-10-30

Issue: #688.

Este documento explica **cómo** se cumple la spec. No hay modelo de datos nuevo ni rutas nuevas. No se añaden paquetes: no hay sección de Socket. La comprobación es manual, más `pytest` para ver que el pasar lista no se ha movido.

---

## 1. Visión general

Se copia el flujo de git de `exercises/git-workflow-agent-template` dentro de `staff/sergio-cortes/asistenciapp/`. La plantilla no se edita. El único cambio dentro de la copia es la ruta de las siete skills de terminal.

Luego se enmiendan el manual, la constitución y la arquitectura para que ese flujo conviva con las tres paradas (ok tras el spec, tras el plan y tras las tasks). El pasar lista no se toca.

---

## 2. Decisiones

### 2.1 Copia del flujo (CA-03, CA-04, CA-05)

Se copian, con el mismo texto, estas carpetas:

- `agents/` (siete ficheros, incluido `git-workflow-agent.md`)
- `skills/` (dieciséis skills)
- `tools/` (siete scripts)
- `templates/issues/` y `templates/pull-request/` (feat, fix, chore, docs, refactor, test)
- `MCPS/github-mcp-server/mcp.txt`

No se crea una plantilla mínima. No se reescribe el orquestador. No se cambia el enlace a `Related to #N`.

En estas skills, `./tools/` pasa a `staff/sergio-cortes/asistenciapp/tools/`:

- `skills/check-status/SKILL.md`
- `skills/pull-changes/SKILL.md`
- `skills/create-branch-from-staging/SKILL.md`
- `skills/create-branch/SKILL.md`
- `skills/create-empty-commit/SKILL.md`
- `skills/commit-changes/SKILL.md`
- `skills/launch-push/SKILL.md`

Los siete scripts quedan ejecutables. En el resto de ficheros copiados, el diff contra la plantilla queda vacío.

`skills/link-pr-to-issue/SKILL.md` se copia igual. Puede nombrar `Related to #N` solo como la línea que hay que sustituir por `Closes #N`. Esa frase no se borra: quitarla sería editar la plantilla. La fórmula de esta app sigue siendo `Closes #N`, y la skill no llama a la API para cerrar la issue.

No se escribe el dueño ni el nombre del repositorio dentro de las skills. No se toca el `mcp.json` del editor.

### 2.2 Manual (CA-01, CA-02, CA-06)

`AGENTS.md` remite, al principio, a `agents/git-workflow-agent.md` de esta carpeta. El agente elige un solo momento de ese flujo y no lo encadena con el siguiente.

El §2 deja las cuatro fases y las tres paradas. Cambia la puerta de entrada:

- No se abre `specs/NNN-nombre/` sin número de issue.
- Cuando se piden las specs, el primer fichero nuevo de esa carpeta es `spec.md`. Abre con `Issue: #N`. Ahí se para.
- Tras el ok, el plan. Tras el ok del plan, las tasks. Tras el ok de las tasks, la implementación.
- Una issue, una rama o una pull request no autorizan el código.

El momento «empezar», cuando se pide, hace lo que ya dice la plantilla: adelantar `staging`, rama desde `staging`, commit vacío `chore: open #N`, push, pull request en draft contra `staging` y `Closes #N`. No escribe specs.

El §5 deja de prohibir todo commit. Commit y push solo en ese momento de empezar, y más tarde cuando se pide guardar un trozo o actuar sobre la pull request. No se fusiona a `staging`.

La tabla §7 gana la fila `008-flujo-git-curso`. Al cerrar la implementación, la fase es implementada.

El §2.1 a §2.4 (forma del spec, del plan, de las tasks y de la implementación) se quedan. Se añade que la carpeta de la spec no se abre sin número de issue.

### 2.3 Constitución 2.5 (CA-02)

La cabecera dice hoy versión 2.3 y última enmienda 2026-10-22. El historial ya tiene la fila 2.4 (2026-10-23, spec 006). Esta enmienda no reescribe esa fila. Publica **2.5** y pone la cabecera en 2.5, última enmienda 2026-10-30.

Es un añadido, no una contradicción de un principio: P1–P6 no cambian. §3, §5, §6 y §7 no cambian.

El §4.1 pasa a decir:

- Ningún fichero de la app se modifica sin un spec aprobado que cubra ese cambio. Entran el código, los tests, el README y el resto de la documentación de uso.
- Antes de abrir `specs/NNN-nombre/` existe la issue, con qué hay que hacer y cómo probarlo. Si el pedido no cabe en la spec activa, se abre otra.
- Una issue, una rama o una pull request no sustituyen al spec y no autorizan el código.
- Quien aprueba cada fase es la persona que trabaja en `staff/sergio-cortes/asistenciapp/`.

El §4.2 pasa a decir:

- El orden siempre es spec, plan, tasks e implementación. No se salta ningún paso.
- Al terminar el spec, el agente lo enseña y espera el ok. No escribe el plan, las tasks ni el cambio hasta entonces.
- Al terminar el plan, espera el ok antes de las tasks. Al terminar las tasks, espera el ok antes de la implementación.

Fila nueva del historial:

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 2.5 | 2026-10-30 | §4: la issue existe antes de `specs/NNN-nombre/`. Siguen spec, plan, tasks e implementación, con ok entre ellos. Issue, rama y pull request no autorizan el código. P1–P6 no cambian. La cabecera pasa a 2.5. | Issue #688 / spec 008. El flujo de git del curso entra sin quitar las paradas. La cabecera estaba en 2.3 aunque el historial ya tenía 2.4 |

### 2.4 Arquitectura (CA-07)

`docs/ARCHITECTURE.md` sube a **1.6** (2026-10-30). La cabecera dice hoy 1.5 y el historial termina en 1.4. No se inventa la fila 1.5. Esta publicación es 1.6.

En el árbol de §2, antes de `docs/`, entran estas líneas, sin los ficheros de dentro:

```
├── agents/                # orquestador y subagentes del flujo de git
├── skills/                # skills de ese flujo
├── tools/                 # scripts de terminal
├── templates/             # plantillas de issue y de pull request
├── MCPS/                  # nota del servidor de GitHub
```

El §2.1 gana una fila: `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/` son el flujo de git del curso. No se importan en tiempo de ejecución. El orquestador `agents/git-workflow-agent.md` reconoce el momento y llama al subagente o a la skill que toca.

El §1 (reglas, acciones, borde) no cambia. El historial gana la fila 1.6.

### 2.5 Lo que no se edita (CA-08)

No se modifican `app.py`, `asistencia/`, `static/`, `tests/`, `requirements.txt` ni `README.md`. No entran `test.py` ni `contextlibtest.py`. No se edita `exercises/git-workflow-agent-template`.

---

## 3. Comprobación manual

| Criterio | Qué mirar |
| --- | --- |
| CA-01, CA-02 | `AGENTS.md` y `docs/CONSTITUTIONS.md` §4: issue antes de `specs/NNN-nombre/`, orden spec → plan → tasks → implementación, ok entre ellos, issue/rama/pull request sin autorizar el código. Cabecera 2.5 y fila 2.5. P1–P6 iguales a la versión anterior |
| CA-03 | Las cinco carpetas existen. `git diff` de `exercises/git-workflow-agent-template` vacío. Diff de cada fichero copiado vacío, salvo las siete skills, cuya única diferencia es la ruta `staff/sergio-cortes/asistenciapp/tools/`. Desde la raíz del monorepo, `staff/sergio-cortes/asistenciapp/tools/check-status.sh` termina con código 0 |
| CA-04 | `templates/issues/` y `templates/pull-request/` tienen feat, fix, chore, docs, refactor y test. No hay una plantilla única `basic_*` en su lugar |
| CA-05 | `skills/link-pr-to-issue/SKILL.md` y las plantillas de pull request piden `Closes #N` y no llaman a cerrar la issue. El texto es el de la plantilla |
| CA-06 | `AGENTS.md` remite a `agents/git-workflow-agent.md`, pide `Issue: #N` al abrir el spec y mantiene las tres paradas. La tabla §7 incluye `008-flujo-git-curso` |
| CA-07 | Árbol y §2.1 de `docs/ARCHITECTURE.md`, versión 1.6 |
| CA-08 | `pytest` pasa. Sin diff en `app.py`, `asistencia/`, `static/`, `tests/`, `requirements.txt` ni `README.md` |

---

## 4. Comprobación de la constitución (v2.5)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se añade una plataforma ni se cambia el registro |
| P2 Simplicidad | Sí | Se copia un flujo que ya existe. No se reescribe |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia. `requirements.txt` no cambia |
| P4 Privacidad | Sí | No se guardan datos nuevos |
| P5 Accesible y móvil | Sí | No se tocan pantallas |
| P6 Español | Sí | Spec, plan, manual y enmienda están en español. El texto copiado del flujo ya está en español |
| §3 Stack | Sí | El stack no cambia. §3.1 sigue apuntando a `docs/ARCHITECTURE.md` |
| §4 SDD | Sí | Esta enmienda es el §4 nuevo: la issue va antes de la carpeta de la spec, y el ok entre spec, plan y tasks se queda |
| §5 Calidad | Sí | Cada criterio tiene un paso en §3. `pytest` comprueba que la app no se ha movido. No hay criterio visual de pantalla |
| §6 Seguridad | Sí | No se toca el registro, los códigos ni el límite por conexión |
| §7 Alcance | Sí | Todo queda en `staff/sergio-cortes/asistenciapp/`. La plantilla del ejercicio no se edita |
| §8 Enmiendas | Sí | La pide quien trabaja en esta carpeta. Queda en el historial como 2.5. No elimina ni contradice un principio, así que no es un salto a 3.0 |

---

## 5. Decisiones tomadas

1. **Copia fiel** (2026-10-30): el texto del flujo es el de la plantilla de hoy. La adaptación de `first-app` (`Related to #N`, plantilla mínima) no se copia.
2. **Paradas que se quedan** (2026-10-30): no se juntan spec, plan y tasks en un solo pase.
3. **Versión 2.5** (2026-10-30): la cabecera estaba atrasada en 2.3. El historial 2.4 se conserva. La enmienda nueva es 2.5.
4. **Arquitectura 1.6** (2026-10-30): no se reconstruye una fila 1.5 que el historial no tiene.
