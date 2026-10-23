# Plan técnico 003 · Instructivo de entorno y arranque en el README de la app

> Estado: **Aprobado** (2026-10-22) · Spec: [spec.md](spec.md) v1.3 · Creado: 2026-10-22 · Aprobado: 2026-10-22

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre. La comprobación es manual en el README; al final se lanza `pytest` una vez para confirmar que no se ha tocado código.

---

## 1. Visión general

Se edita un README que ya existe y se actualiza la tabla de estado del manual del agente.

| Fichero | Cambio |
| --- | --- |
| [README.md](../../README.md) (app) | Rutas a `staff/sergio-cortes/asistenciapp`; separar «Activar el entorno» y «Arrancar la app»; renumerar secciones posteriores |
| [AGENTS.md](../../AGENTS.md) §7 | Fila `003-readme-entorno-y-arranque` |

No se modifica `staff/sergio-cortes/README.md`. No hay arquitectura nueva, ni modelo de datos, ni rutas, ni código, ni tests nuevos. No se añade ninguna dependencia.

La issue #233 pide el instructivo en `staff/sergio-cortes/asistenciapp/README.md`, igual que el patrón del bootcamp en `staff/ventura-rodriguez/asistenciapp/README.md` (sin duplicar setup en el README personal).

---

## 2. Decisiones — README de la app

### 2.1 Rutas de carpeta (CA-03)

Usar `staff/sergio-cortes/asistenciapp` en todos los bloques `cd` de las secciones de entorno (preparar y activar).

### 2.2 Separar activar y arrancar (CA-04, CA-05, CA-06)

Igual que en la spec 003 de referencia en `staff/ventura-rodriguez/asistenciapp`:

- La sección 2 pasa a **«2. Activar el entorno»** con la frase de terminal nueva y el bloque `cd` + `source .venv/bin/activate`.
- Nueva **«3. Arrancar la app»** con solo la tabla de los dos comandos y el texto de lo que se ve al arrancar (sin activar el entorno debajo).

Las secciones **1–3** cubren **CA-01** y **CA-02** (preparar → activar → arrancar, con títulos distintos).

### 2.3 Renumerar y una remisión (CA-07)

| Antes | Después |
| --- | --- |
| 3. Pasar lista, paso a paso | 4. Pasar lista, paso a paso |
| 4. Cerrar la app | 5. Cerrar la app |
| 5. Problemas frecuentes | 6. Problemas frecuentes |
| 6. Tests | 7. Tests |
| 7. Privacidad | 8. Privacidad |

En problemas frecuentes, «ciérrala (sección 4)» pasa a «ciérrala (sección 5)». Es el único ajuste de texto fuera de títulos, rutas y la nueva sección 3.

El cuerpo de pasar lista, cerrar, problemas (salvo ese número), tests y privacidad no cambia.

---

## 3. Comprobación manual

| Criterio | Qué mirar |
| --- | --- |
| CA-01 | `asistenciapp/README.md`: tres bloques ordenados (preparar, activar, arrancar) con las dos modalidades de arranque |
| CA-02 | Esos bloques tienen títulos distintos; activar no está bajo «Arrancar la app» |
| CA-03 | `asistenciapp/README.md`: todos los `cd` apuntan a `staff/sergio-cortes/asistenciapp` |
| CA-04 | Bloque de activar bajo «Activar el entorno» |
| CA-05 | Bajo «Arrancar la app» solo tabla de clase online y prueba local |
| CA-06 | No hay `source .venv/bin/activate` bajo «Arrancar la app» |
| CA-07 | Diff del README: fuera de §1–3 y la remisión de sección, el resto igual |

`pytest` desde `staff/sergio-cortes/asistenciapp/` al terminar las tasks: debe seguir en verde (77 tests).

---

## 4. Comprobación de la constitución (v2.2)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se cambia el registro ni se ata a una plataforma |
| P2 Simplicidad | Sí | Solo documentación; mismos comandos que ya existían |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia |
| P4 Privacidad | Sí | No se guardan datos |
| P5 Accesible y móvil | Sí | No se tocan pantallas |
| P6 Español | Sí | Títulos y texto en español |
| §4 SDD | Sí | Spec aprobada; plan y tasks antes del README |
| §5 Calidad | Sí | Tabla §3; verificación manual; `pytest` de regresión |
| §6 Seguridad | Sí | No se tocan códigos ni sesiones |
| §7 Alcance | Sí | Cambio de uso documentado; la app vive en esta carpeta |
| §8 Enmiendas | Sí | No se enmienda la constitución en esta spec |

---

## 5. Decisiones tomadas

1. **Instructivo solo en README de la app** (2026-10-23): cumple la issue #233 y **CA-01**; no se edita `staff/sergio-cortes/README.md`.
2. **Rutas concretas** (2026-10-22): `staff/sergio-cortes/asistenciapp`, no placeholder `<usuario>`.
3. **Misma separación de títulos que spec 003 Ventura** (2026-10-22): activar vs arrancar.
4. **Sin test automático del README** (2026-10-22): comprobación manual según §3; `pytest` solo confirma que el código no cambió.
5. **Constitución y manual** (2026-10-23): fuera del alcance de la issue #233 y de esta spec; no requiere spec aparte en este caso.
