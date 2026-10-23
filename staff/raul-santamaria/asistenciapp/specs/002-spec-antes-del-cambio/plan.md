# Plan técnico 002 · Spec antes del cambio

> Estado: **Aprobado** · Spec: [spec.md](spec.md) v1.0 (aprobada 2026-10-23) · Aprobado: 2026-10-23

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios (`CA-xx`) cubre. La comprobación es manual: el cambio es de reglas escritas, no de pantallas.

---

## 1. Visión general

Gran parte de la puerta ya está en `docs/CONSTITUTION.md` (v2.2) y en `AGENT.md`. Este plan no reescribe la app: completa el hueco de CA-05, deja constancia de la 002 en el estado del agente y comprueba que el resto de criterios ya se cumplen.

Ficheros que se tocan:

- [`docs/CONSTITUTION.md`](../../docs/CONSTITUTION.md) — enmienda menor a §4 (versión 2.3).
- [`AGENT.md`](../../AGENT.md) — tabla §7 y, si hace falta, una frase en §2 que alinee CA-05.

No se crea código. No se toca el README ni `specs/001-checkin-codigo/`.

---

## 2. Decisiones

### 2.1 Lo que ya cumple (CA-01, CA-02, CA-03, CA-04, CA-06)

Se **verifica** y no se deshace:

| Criterio | Dónde está hoy |
| --- | --- |
| CA-01, CA-02, CA-03 | Constitución §4 puntos 1–2; `AGENT.md` §2 y §2.4 |
| CA-04 | `AGENT.md` §2.1: si no cabe en la activa, se abre otra spec |
| CA-06 | Constitución §7–§8; `AGENT.md` §4–§6 y rutas `staff/raul-santamaria/asistenciapp/` |

### 2.2 Issue, rama y PR no autorizan (CA-05)

En constitución §4 se añade, en la misma lista numerada, que una **issue**, una **rama** o una **pull request** del bootcamp **no sustituyen** al spec de la app y **no autorizan** a modificar ficheros sin spec aprobado.

La versión de la constitución pasa de **2.2 a 2.3**. Se anota una fila en el historial de enmiendas (fecha 2026-10-23, motivo: CA-05 de esta spec). No se elimina ningún principio.

En `AGENT.md` §2 (o §2.4) se añade una frase equivalente para el día a día del agente.

### 2.3 Estado actual (CA-04)

En `AGENT.md` §7 se añade la fila de `002-spec-antes-del-cambio`. El bot de Discord sigue como idea futura **sin número**. `001-checkin-codigo` permanece terminada en su fila.

### 2.4 Lo que no se edita (CA-07)

No se modifica `specs/001-checkin-codigo/`. Su historial y quienes figuran ahí se quedan igual. Tampoco se modifica el README en esta spec.

---

## 3. Comprobación manual

| Criterio | Qué mirar |
| --- | --- |
| CA-01, CA-02, CA-03 | Constitución §4; `AGENT.md` §2 y §2.4 |
| CA-04 | `AGENT.md` §2.1 y tabla §7: 001 terminada; 002 con su propia fila |
| CA-05 | Constitución §4 (texto nuevo) y la frase en `AGENT.md` |
| CA-06 | Constitución §7–§8; rutas en `AGENT.md` §4–§5 |
| CA-07 | `git diff` de `specs/001-checkin-codigo/` vacío; README sin cambios por esta spec |

---

## 4. Comprobación de la constitución (tras v2.3)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se añade plataforma ni se cambia el registro |
| P2 Simplicidad | Sí | Un matiz en §4 y una fila en el estado del agente |
| P3 Dependencias mínimas | Sí | Sin dependencias nuevas |
| P4 Privacidad | Sí | Sin datos nuevos |
| P5 Accesible y móvil | Sí | Sin pantallas |
| P6 Español | Sí | Spec, plan, tasks y enmienda en español |
| §3 Stack | Sí | Sin cambio de stack |
| §4 SDD | Sí | Se refuerza §4 con CA-05; el orden spec→plan→tasks→cambio se mantiene |
| §5 Calidad | Sí | Criterios con comprobación manual en §3 de este plan |
| §6 Seguridad | Sí | No se toca el registro ni los códigos |
| §7 Alcance | Sí | Solo dentro de `staff/raul-santamaria/asistenciapp/` |
| §8 Enmiendas | Sí | La aprueba quien trabaja en esta carpeta; queda en el historial |

---

## 5. Decisiones tomadas

1. **No rehacer v2.2**: la puerta amplia (cualquier fichero) ya está; solo se completa CA-05.
2. **Versión 2.3** (2026-10-23): issue / rama / PR no autorizan sin spec.
3. **Número 002**: lo usa esta spec; Discord sigue sin número.
