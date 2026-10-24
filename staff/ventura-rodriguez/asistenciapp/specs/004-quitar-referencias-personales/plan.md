# Plan técnico 004 · Quitar las referencias personales a Victor

> Estado: **Aprobado** (2026-10-22) · Spec: [spec.md](spec.md) v1.0 · Creado: 2026-10-22 · Aprobado: 2026-10-22

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre.

---

## 1. Visión general

Se editan documentos que ya existen. No hay arquitectura nueva, ni modelo de datos, ni rutas, ni pantallas. No se añade ninguna dependencia.

La spec 002 dejó el nombre en el historial de la spec 001 (su CA-07) y dejó la carpeta personal fuera de aquel cambio. Esta spec, posterior y aprobada, es la que cubre quitar ese nombre. La fecha y el resultado de cada nota se quedan.

El único fichero nuevo es `tests/test_personal_references.py`.

No se toca nada fuera de esta carpeta de la app.

---

## 2. Decisiones

### 2.1 Los dos `cd` del README nombran un usuario genérico (CA-01, CA-04)

En [README.md](../../README.md), las dos líneas que entran en la carpeta pasan de `cd staff/victor-chang/asistenciapp` a `cd staff/<usuario>/asistenciapp`.

`<usuario>` se escribe así, con los ángulos. No se sustituye por el nombre de una persona.

El resto de cada bloque, y el resto del README, no cambia. El diff del README son solo esas dos líneas.

### 2.2 El nombre sale de las notas y se queda lo comprobado (CA-02, CA-03)

En cada sitio se quita el nombre. La fecha y el hecho se quedan.

| Fichero                             | Ahora                                                                                                                                                                      | Después                                                                                                                                                        |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `specs/001-checkin-codigo/spec.md`  | `Todas resueltas el 2026-10-19: Victor aceptó las propuestas.`                                                                                                             | `Todas resueltas el 2026-10-19: las propuestas quedaron aceptadas.`                                                                                            |
| `specs/001-checkin-codigo/spec.md`  | `Victor detecta que un alumno puede registrar a compañeros ausentes con otros nombres`                                                                                     | `se detecta que un alumno puede registrar a compañeros ausentes con otros nombres`                                                                             |
| `specs/001-checkin-codigo/plan.md`  | `## 8. Decisiones tomadas por Victor`                                                                                                                                      | `## 8. Decisiones tomadas`                                                                                                                                     |
| `specs/001-checkin-codigo/tasks.md` | `Victor, 2026-10-20: registro correcto desde su móvil con datos móviles.`                                                                                                  | `2026-10-20: registro correcto desde un móvil con datos móviles.`                                                                                              |
| `specs/001-checkin-codigo/tasks.md` | `Victor, 2026-10-20: el panel se abre directamente.`                                                                                                                       | `2026-10-20: el panel se abre directamente.`                                                                                                                   |
| `specs/001-checkin-codigo/tasks.md` | `Victor, 2026-10-20: dos columnas y tildes correctas.`                                                                                                                     | `2026-10-20: dos columnas y tildes correctas.`                                                                                                                 |
| `specs/001-checkin-codigo/tasks.md` | `Victor lo prueba con su móvil (registrarse dos veces con nombres distintos → bloqueado) y quita un registro desde el panel. *(Victor, 2026-10-20: pasos 1–5 correctos.)*` | `Prueba en un móvil: registrarse dos veces con nombres distintos queda bloqueado, y se quita un registro desde el panel. *(2026-10-20: pasos 1–5 correctos.)*` |

Las cinco decisiones numeradas de ese plan no se reescriben.

### 2.3 Las menciones de la carpeta personal en specs cerradas también salen (CA-02)

Esas frases decían que un cambio anterior no tocaba la carpeta. Siguen diciendo eso, sin escribir el nombre.

| Fichero                                    | Después                                                                                                                                                           |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `specs/002-spec-antes-del-cambio/spec.md`  | `Las rutas del README que todavía nombran una carpeta personal.`                                                                                                  |
| `specs/002-spec-antes-del-cambio/plan.md`  | `Las menciones a una persona concreta en las reglas vivas (aprobación de cada fase, commits, enmiendas y definición de terminado) pasan a ser esa misma persona.` |
| `specs/002-spec-antes-del-cambio/plan.md`  | `No queda una carpeta personal en esos dos ficheros`                                                                                                              |
| `specs/002-spec-antes-del-cambio/tasks.md` | `esos apartados ya no nombran una carpeta personal ni dejan el ok en manos de otra persona.`                                                                      |
| `specs/003-activar-el-entorno/spec.md`     | `Las rutas del README que todavía nombran una carpeta personal.`                                                                                                  |
| `specs/003-activar-el-entorno/plan.md`     | `La ruta para entrar en la carpeta no se toca. Está fuera de alcance.`                                                                                            |
| `specs/003-activar-el-entorno/plan.md`     | `La ruta para entrar en la carpeta sigue igual`                                                                                                                   |
| `specs/003-activar-el-entorno/tasks.md`    | `La ruta para entrar en la carpeta no se modifica.`                                                                                                               |

### 2.4 El test busca el nombre fuera de esta spec (CA-01, CA-02, CA-03)

`tests/test_personal_references.py` hace tres comprobaciones:

1. En el README, las dos líneas que empiezan por `cd staff/` son exactamente `cd staff/<usuario>/asistenciapp`.
2. En los Markdown de esta carpeta no aparece `victor`, ni en mayúsculas ni en minúsculas. Se saltan `.venv/` y `specs/004-quitar-referencias-personales/`. Esta spec tiene que nombrar la referencia para poder quitarla; el plan y las tareas también. El resto de la documentación, no.
3. Las frases de la tabla del §2.2 están en sus ficheros, con su fecha y su resultado.

La búsqueda de `victor` cubre el nombre y la carpeta `victor-chang`. El apartado 1 impide que esa carpeta se cambie por el nombre de otra persona.

---

## 3. Comprobación

| Criterio | Qué lo cubre                                                                                               |
| -------- | ---------------------------------------------------------------------------------------------------------- |
| CA-01    | Test: las dos líneas `cd staff/` del README son `cd staff/<usuario>/asistenciapp`                          |
| CA-02    | Test: ningún Markdown fuera de esta spec y de `.venv/` contiene `victor`                                   |
| CA-03    | Test: cada frase de la tabla del §2.2 está en su fichero                                                   |
| CA-04    | El diff del README solo cambia las dos líneas `cd`. `pytest` completo confirma que pasar lista sigue igual |

---

## 4. Comprobación de la constitución (v2.2)

| Regla                          | ¿Cumple? | Cómo                                                                                        |
| ------------------------------ | -------- | ------------------------------------------------------------------------------------------- |
| P1 Independiente de plataforma | Sí       | No se cambia el registro ni se ata a una plataforma                                         |
| P2 Simplicidad                 | Sí       | Se sustituyen frases en documentos que ya existen. Un solo test nuevo                       |
| P3 Dependencias mínimas        | Sí       | No se añade ninguna dependencia. El test usa `pytest`, que ya está permitido                |
| P4 Privacidad                  | Sí       | Se quita un nombre personal de la documentación. No se guardan datos nuevos                 |
| P5 Accesible y móvil           | Sí       | No se tocan pantallas                                                                       |
| P6 Español                     | Sí       | Las frases nuevas y este plan están en español. El código del test puede ir en inglés       |
| §5 Calidad                     | Sí       | CA-01, CA-02 y CA-03 tienen test. CA-04 tiene el diff del README y el `pytest` ya existente |
| §6 Seguridad                   | Sí       | No se tocan códigos, sesiones ni entradas del usuario                                       |

---

## 5. Decisiones tomadas

1. **Usuario genérico literal** (2026-10-22): los dos `cd` quedan en `staff/<usuario>/asistenciapp`. No se rellena `<usuario>` con un nombre.
2. **Esta carpeta de spec queda fuera de la búsqueda** (2026-10-22): el spec, el plan y las tareas nombran la referencia que se quita. El test no los lee.
3. **La spec 002 no se deshace** (2026-10-22): su CA-07 pedía no reescribir entonces el historial de la spec 001. Esta spec es la que ahora quita el nombre y deja la fecha y el resultado.
