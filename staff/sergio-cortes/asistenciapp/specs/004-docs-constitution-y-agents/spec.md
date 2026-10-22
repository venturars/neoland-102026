# Spec 004 · Constitución en `docs` y manual `AGENTS.md`

> Estado: **Implementada** (2026-10-22) · Creada: 2026-10-22 · Aprobada: 2026-10-22

---

## 1. Problema

La issue #235 pide alinear la documentación de gobierno del proyecto con la convención usada en otras copias del bootcamp: la constitución vive en `docs` con nombre en plural y el manual para agentes se llama `AGENTS.md`.

Hoy la constitución está en la raíz como `CONSTITUTION.md` y el manual como `AGENT.md`. Quien abre el README o sigue enlaces desde specs antiguas puede ir a rutas que ya no serán las canónicas. La spec 003 dejó estos renombres fuera de alcance a propósito; ahora toca hacerlos con su propio spec (spec 002).

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien trabaja en `staff/sergio-cortes/asistenciapp` (issue #235)** | Cumplir la issue sin romper el flujo spec → plan → tasks. |
| **Quien abre el README de la app** | Enlaces que lleven al sitio correcto de la constitución y del manual. |
| **Un agente de IA que arranca una tarea** | Rutas coherentes en la lectura obligatoria y en el diagrama de carpetas del manual. |
| **Un compañero que revisa la pull request** | Comprobar la issue con búsqueda de referencias obsoletas. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que cumple la issue #235, quiero la constitución en `docs/CONSTITUTIONS.md`, para seguir la convención acordada.
- **HU-02**: Como persona que cumple la issue #235, quiero el manual renombrado a `AGENTS.md`, para alinearlo con el resto del repositorio.
- **HU-03**: Como quien lee documentación dentro de esta app, quiero que los enlaces y menciones apunten a los nombres nuevos, para no abrir ficheros que ya no existen.
- **HU-04**: Como quien trabaja en esta carpeta, quiero que el manual siga describiendo la estructura real de ficheros tras el cambio, para que agentes y humanos no se pierdan.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Ubicación y nombres (HU-01, HU-02)

- **CA-01**: **Dado** la carpeta `staff/sergio-cortes/asistenciapp`, **cuando** alguien busca la constitución vigente, **entonces** está en `docs/CONSTITUTIONS.md` y no existe `CONSTITUTION.md` en la raíz de la app.
- **CA-02**: **Dado** la misma carpeta, **cuando** alguien busca el manual para agentes, **entonces** existe `AGENTS.md` en la raíz y no existe `AGENT.md`.

### Referencias (HU-03)

- **CA-03**: **Dado** el README de la app, **cuando** enlaza a la constitución o al manual, **entonces** usa `docs/CONSTITUTIONS.md` y `AGENTS.md`.
- **CA-04**: **Dado** el manual (`AGENTS.md`), **cuando** describe la lectura obligatoria o el árbol de carpetas, **entonces** nombra `docs/CONSTITUTIONS.md` y `AGENTS.md` (no los nombres ni rutas antiguos).
- **CA-05**: **Dado** cualquier fichero bajo `staff/sergio-cortes/asistenciapp`, **cuando** un compañero busca referencias a `CONSTITUTION.md` o `AGENT.md` como rutas vivas, **entonces** no quedan enlaces rotos hacia esos nombres en la raíz (salvo menciones históricas en texto de specs ya cerradas, si se decide dejarlas; ver §6).

### Manual de estado (HU-04)

- **CA-06**: **Dado** el manual, **cuando** se cierra la implementación de esta spec, **entonces** la tabla de estado (§7) incluye una fila para `004-docs-constitution-y-agents` con fase coherente con el avance.

### Sin cambiar reglas (HU-01, HU-02)

- **CA-07**: **Dado** el contenido de la constitución antes del cambio, **cuando** se mueve y renombra el fichero, **entonces** el texto de las reglas no negociables permanece igual salvo ajustes mínimos de rutas internas si las hubiera.

---

## 5. Fuera de alcance

- Cambiar el contenido de los principios P1–P6 o enmendar la constitución por motivo distinto al traslado.
- Tocar `exercises/asistenciapp` u otras carpetas `staff/` distintas de `sergio-cortes/asistenciapp`.
- Cambiar código de la app, tests funcionales o comportamiento en runtime.
- Reescribir specs 001–003 cerradas; solo actualizar referencias en ficheros que sigan siendo guía viva (README, manual, plan/tasks de esta spec).

---

## 6. Preguntas abiertas

Ninguna. **PA-01** (2026-10-22): en specs 001–003 se mantiene el texto histórico; solo se corrigen **enlaces relativos** en `plan.md` / `tasks.md` que apuntarían a ficheros eliminados. README, manual y documentos de la spec 004 usan siempre los nombres nuevos.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-22 | Borrador inicial | Issue #235; base rama PR #234 |
| 1.0 | 2026-10-22 | Aprobada | Ok de quien trabaja en esta carpeta; PA-01 cerrada |
| 1.1 | 2026-10-22 | Implementada | T01–T08; pytest en verde |
