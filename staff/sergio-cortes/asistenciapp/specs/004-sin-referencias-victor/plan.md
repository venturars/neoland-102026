# Plan técnico 004 · Sin referencias personales a Victor

> Estado: **Aprobado** (2026-10-22) · Spec: [spec.md](spec.md) v1.0 · Creado: 2026-10-22 · Aprobado: 2026-10-22

Este documento explica **cómo** se cumple la spec. Solo documentación bajo `staff/sergio-cortes/asistenciapp`; no hay cambios de arquitectura, modelo de datos, rutas, código ni dependencias nuevas.

---

## 1. Visión general

Inventario actual (búsqueda en el árbol, 2026-10-22):

| Fichero | Qué contiene |
| --- | --- |
| `specs/001-checkin-codigo/spec.md` | Historial y preguntas abiertas con nombre personal |
| `specs/001-checkin-codigo/plan.md` | Título de sección «Decisiones tomadas por …» |
| `specs/001-checkin-codigo/tasks.md` | Notas de verificación manual con nombre y fecha |
| `specs/002-spec-antes-del-cambio/plan.md` | Texto descriptivo de la enmienda (nombre y ruta ajena) |
| `specs/002-spec-antes-del-cambio/tasks.md` | Criterio «hecha cuando» con nombre y slug ajeno |
| `specs/003-readme-entorno-y-arranque/plan.md` | Instrucción histórica con ruta `staff/…/asistenciapp` ajena |
| `specs/003-readme-entorno-y-arranque/tasks.md` | T01 descrita con la misma ruta ajena |

`README.md`, `docs/CONSTITUTIONS.md` y `AGENTS.md` **no** contienen esas cadenas hoy (CA-03 ya cumplido en documentación viva; se vuelve a comprobar al cerrar).

No se edita código en `app.py`, `asistencia/`, `static/` ni `tests/` salvo que una búsquica previa encuentre coincidencias (hoy no hay).

### 1.1 Relación con la spec 002

La spec `002-spec-antes-del-cambio` dejó el historial de `001-checkin-codigo` intacto **en su momento**. Esta spec **004** (issue #245) autoriza neutralizar solo referencias personales y rutas ajenas en `001`, sin cambiar identificadores `CA-xx`/`HU-xx` ni el sentido de las decisiones (**CA-05**).

---

## 2. Criterio de redacción (CA-04, CA-05)

Sustituir nombres personales y rutas de otra copia por formulaciones neutras, **manteniendo fechas y hechos**:

| Antes (ejemplo) | Después (ejemplo) |
| --- | --- |
| «Victor aceptó las propuestas» | «Las propuestas quedaron aceptadas» |
| «Victor detecta que…» | «En pruebas se detecta que…» |
| «*(Victor, 2026-10-20: …)*» | «*(2026-10-20: …)*» o «*(Verificado 2026-10-20: …)*» |
| «Victor lo prueba con su móvil…» | «Prueba manual con móvil…» |
| «Decisiones tomadas por Victor» | «Decisiones tomadas» |
| «sustituir `staff/victor-chang/asistenciapp` por…» | «usar `staff/sergio-cortes/asistenciapp` en…» |
| «no nombran Victor ni `victor-chang`» | «no nombran personas concretas ni rutas de otra copia bajo `staff/`» |

No se reescriben tablas de decisiones funcionales ni se borran filas del historial; solo se quita la atribución personal.

---

## 3. Ficheros a tocar (por spec histórica)

### 3.1 `001-checkin-codigo` (CA-04, CA-05)

- `spec.md`: §7 preguntas abiertas e historial v1.2.
- `plan.md`: §8 título de sección.
- `tasks.md`: notas en T20 y T25 (CA-19, CA-20, CSV, prueba móvil v1.2).

### 3.2 `002-spec-antes-del-cambio` (CA-04)

- `plan.md`: §2.2 viñeta sobre reglas vivas; §5 decisión «Quién aprueba».
- `tasks.md`: criterio «hecha cuando» de la tarea que actualizó el manual.

### 3.3 `003-readme-entorno-y-arranque` (CA-04)

- `plan.md`: §2.1 rutas de carpeta (redacción sin ruta ajena).
- `tasks.md`: descripción de T01 alineada con el plan.

### 3.4 Cierre de esta spec (CA-08 y CA-01)

- `AGENTS.md` §7: nueva fila `004-sin-referencias-victor` (fase según avance).
- `specs/004-sin-referencias-victor/spec.md`: tras el resto de edits, reescribir apartados que aún contengan el nombre o el slug buscables, para que **CA-01** y **CA-02** pasen en todo el árbol (la spec puede seguir citando la issue #245).

---

## 4. Comprobación manual

| Criterio | Qué mirar |
| --- | --- |
| CA-01 | Desde la raíz de la app: `rg -i victor` (o búsqueda equivalente) → sin coincidencias |
| CA-02 | `rg victor-chang` y `rg 'staff/victor-chang'` → sin coincidencias |
| CA-03 | Leer `README.md`, `docs/CONSTITUTIONS.md`, `AGENTS.md` |
| CA-04 | Releer los `spec/plan/tasks` editados: fechas y hechos conservados, sin nombres ajenos |
| CA-05 | En `001-checkin-codigo`: mismos `CA-xx`/`HU-xx`; diff sin cambios en código |
| CA-06 | `git diff` sin cambios bajo `app.py`, `asistencia/`, `static/`, `tests/` |
| CA-07 | `pytest` en la carpeta de la app → verde (mismo número de tests que antes) |
| CA-08 | Tabla §7 de `AGENTS.md` con fila 004 |

---

## 5. Comprobación de la constitución (v2.2)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se toca el registro ni plataformas |
| P2 Simplicidad | Sí | Solo texto en markdown ya existente |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia |
| P4 Privacidad | Sí | No se guardan datos nuevos |
| P5 Accesible y móvil | Sí | No se tocan pantallas |
| P6 Español | Sí | Sustituciones en español neutro |
| §4 SDD | Sí | Spec aprobada; plan y tasks antes de editar historiales |
| §5 Calidad | Sí | Tabla §4; `pytest` de regresión |
| §6 Seguridad | Sí | No se tocan códigos ni sesiones |
| §7 Alcance | Sí | Solo `staff/sergio-cortes/asistenciapp` |
| §8 Enmiendas | Sí | No se enmienda la constitución |

---

## 6. Decisiones tomadas

1. **Sin tocar código** (2026-10-22): búsqueda previa sin coincidencias fuera de `specs/`; si apareciera alguna en implementación, una task puntual en `tasks.md`.
2. **001 sí entra en alcance** (2026-10-22): issue #245 y **CA-05**; solo neutralizar atribuciones, no decisiones.
3. **Spec 004 al final** (2026-10-22): el borrador de `spec.md` nombra a la persona para explicar el problema; la última pasada de implementación neutraliza esas cadenas para cumplir **CA-01**/**CA-02**.
4. **Verificación issue #245** (2026-10-22): misma búsqueda que en la issue de GitHub (nombre, slug, ruta ajena).
