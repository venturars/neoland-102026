# Plan técnico 003 · Instructivo de entorno y arranque en los README

> Estado: **Aprobado** (2026-10-22) · Spec: [spec.md](spec.md) v1.0 · Creado: 2026-10-22 · Aprobado: 2026-10-22

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre. La comprobación es manual en los README; al final se lanza `pytest` una vez para confirmar que no se ha tocado código.

---

## 1. Visión general

Se editan dos README que ya existen y se actualiza la tabla de estado del manual del agente.

| Fichero | Cambio |
| --- | --- |
| [README.md](../../README.md) (app) | Rutas a `staff/sergio-cortes/asistenciapp`; separar «Activar el entorno» y «Arrancar la app»; renumerar secciones posteriores |
| [README.md](../../../../README.md) (personal en `staff/sergio-cortes`) | Nueva sección con el **mismo instructivo** de preparar → activar → arrancar (issue #233) |
| [AGENT.md](../../AGENT.md) §7 | Fila `003-readme-entorno-y-arranque` en estado implementación / terminada al cerrar tasks |

No hay arquitectura nueva, ni modelo de datos, ni rutas, ni código, ni tests nuevos. No se añade ninguna dependencia.

### 1.1 Por qué el instructivo va también en el README personal

La issue #233 y **CA-01** exigen que quien abra `staff/sergio-cortes/README.md` encuentre el paso a paso **sin depender solo de un enlace**. El plan repite el bloque de las tres fases (preparar, activar, arrancar) en una sección nueva antes del cierre. Se puede enlazar al README de la app para el manual completo (pasar lista, problemas, tests), pero los tres bloques mínimos van escritos ahí.

Editar `staff/sergio-cortes/README.md` queda **dentro del alcance de esta spec** (CA-01), aunque el manual del agente diga por defecto «solo se edita dentro de asistenciapp».

---

## 2. Decisiones — README de la app

### 2.1 Rutas de carpeta (CA-03)

Sustituir `staff/victor-chang/asistenciapp` por `staff/sergio-cortes/asistenciapp` en todos los bloques `cd` de las secciones de entorno (preparar y activar).

### 2.2 Separar activar y arrancar (CA-04, CA-05, CA-06)

Igual que en el plan de la spec 003 de referencia del bootcamp:

- La sección 2 pasa a **«2. Activar el entorno»** con la frase de terminal nueva y el bloque `cd` + `source .venv/bin/activate`.
- Nueva **«3. Arrancar la app»** con solo la tabla de los dos comandos y el texto de lo que se ve al arrancar (sin activar el entorno debajo).

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

## 3. Decisiones — README personal (`staff/sergio-cortes`)

### 3.1 Nueva sección antes del cierre (CA-01, CA-02)

Insertar **«6. AsistenciApp — activar el entorno y arrancar la app»** (o título equivalente en español, coherente con la spec) con tres subbloques titulados:

1. Preparar el entorno (solo la primera vez)
2. Activar el entorno
3. Arrancar la app

Contenido alineado con el README de la app (mismos comandos y rutas `staff/sergio-cortes/asistenciapp`). Enlace opcional a [`asistenciapp/README.md`](asistenciapp/README.md) para el resto del manual.

La sección **«6. Cierre»** pasa a ser **«7. Cierre»**.

---

## 4. Comprobación manual

| Criterio | Qué mirar |
| --- | --- |
| CA-01 | `staff/sergio-cortes/README.md`: tres bloques ordenados (preparar, activar, arrancar) con las dos modalidades de arranque |
| CA-02 | Esos bloques tienen títulos distintos; activar no está bajo «Arrancar la app» |
| CA-03 | `asistenciapp/README.md`: todos los `cd` apuntan a `staff/sergio-cortes/asistenciapp` |
| CA-04 | App README: bloque de activar bajo «Activar el entorno» |
| CA-05 | App README: bajo «Arrancar la app» solo tabla de clase online y prueba local |
| CA-06 | App README: no hay `source .venv/bin/activate` bajo «Arrancar la app» |
| CA-07 | Diff del app README: fuera de §1–3 y la remisión de sección, el resto igual |

`pytest` desde `staff/sergio-cortes/asistenciapp/` al terminar las tasks: debe seguir en verde (77 tests).

---

## 5. Comprobación de la constitución (v2.2)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se cambia el registro ni se ata a una plataforma |
| P2 Simplicidad | Sí | Solo documentación; mismos comandos que ya existían |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia |
| P4 Privacidad | Sí | No se guardan datos |
| P5 Accesible y móvil | Sí | No se tocan pantallas |
| P6 Español | Sí | Títulos y texto en español |
| §4 SDD | Sí | Spec aprobada; plan y tasks antes del README |
| §5 Calidad | Sí | Tabla §4; verificación manual; `pytest` de regresión |
| §6 Seguridad | Sí | No se tocan códigos ni sesiones |
| §7 Alcance | Sí | Cambio de uso documentado; la app vive en esta carpeta |
| §8 Enmiendas | Sí | No se enmienda la constitución en esta spec |

---

## 6. Decisiones tomadas

1. **Instructivo duplicado en README personal** (2026-10-22): cumple CA-01 y la issue #233; enlace al README de la app para lo demás.
2. **Rutas concretas** (2026-10-22): `staff/sergio-cortes/asistenciapp`, no placeholder `<usuario>`.
3. **Misma separación de títulos que spec 003 Ventura** (2026-10-22): activar vs arrancar en el README de la app.
4. **Sin test automático del README** (2026-10-22): comprobación manual según §4; `pytest` solo confirma que el código no cambió.
5. **README personal sin editar** (2026-10-22): no se modifica `staff/sergio-cortes/README.md`; CA-01 y CA-02 del README personal quedan fuera de la implementación.
