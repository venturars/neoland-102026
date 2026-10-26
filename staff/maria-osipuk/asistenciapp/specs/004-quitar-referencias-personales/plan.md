# Plan técnico 004 · Quitar las referencias personales a Víctor

> Estado: **Aprobado** (2026-10-23) · Spec: [spec.md](spec.md) v1.0 · Creado: 2026-10-23

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre. No se crea arquitectura nueva ni se cambia el comportamiento al pasar lista.

---

## 1. Visión general

Se quita el nombre de Víctor y la carpeta `staff/victor-chang/asistenciapp` de la documentación que ya existe. Las instrucciones de uso pasan a un usuario genérico. Las notas conservan la fecha y el resultado, en impersonal.

Las reglas del agente ya identifican `staff/maria-osipuk/asistenciapp/` y ya limitan la búsqueda de specs a `staff/maria-osipuk/asistenciapp/specs/`. No se reescriben para nombrar a otra persona. En la implementación solo se añade la fila de esta spec en la tabla de estado.

Esta spec tiene que nombrar lo que quita. La búsqueda del nombre y de la carpeta no la incluye.

No se tocan el código de la aplicación, las pantallas ni la constitución.

---

## 2. Decisiones

### 2.1 Instrucciones de uso genéricas (CA-01)

En [README.md](../../README.md), los dos `cd` pasan de `staff/victor-chang/asistenciapp` a `staff/<usuario>/asistenciapp`.

`<usuario>` no es el nombre de una persona. No se sustituye por `maria-osipuk`. El resto del README no cambia.

### 2.2 El resto de la documentación (CA-02, CA-04)

Se quita el nombre y la carpeta. La fecha y el resultado se quedan. La frase pasa a impersonal: no dice que quien trabaja en esta carpeta haya hecho la comprobación.

| Fichero | Cómo queda |
| --- | --- |
| `specs/001-checkin-codigo/tasks.md` | Las cuatro notas del 2026-10-20 pierden el nombre. Siguen la fecha y el resultado: registro desde un móvil con datos móviles, panel que se abre directamente, CSV con dos columnas y tildes correctas, y los pasos 1–5 correctos. «Su móvil» pasa a «un móvil». |
| `specs/001-checkin-codigo/spec.md` | «Se aceptaron las propuestas» el 2026-10-19. En el historial, el 2026-10-20 se detecta el mismo problema: un alumno puede registrar a compañeros ausentes con otros nombres. |
| `specs/001-checkin-codigo/plan.md` | El apartado pasa a llamarse «Decisiones tomadas». Las cinco decisiones, sus fechas y sus resultados no cambian. |
| `specs/002-spec-antes-del-cambio/tasks.md` | La tarea queda hecha cuando esos apartados ya no nombran a una persona ni a su carpeta, y las specs se buscan solo en esta carpeta. |
| `specs/002-spec-antes-del-cambio/plan.md` | Las menciones personales de las reglas vivas pasan a ser quien trabaja en esta carpeta. Quien aprueba es la persona que trabaja en `staff/maria-osipuk/asistenciapp/`, no otra persona ni otra carpeta del repositorio. La fecha 2026-10-23 se queda. |
| `specs/003-aclarar-instrucciones-arranque/plan.md` y `tasks.md` | Sigue constando que aquel cambio no tocó las rutas personales de las instrucciones de uso. Desaparece la carpeta concreta. |

### 2.3 Reglas del agente (CA-03)

`AGENTS.md` y `CONSTITUTION.md` ya dicen que esta aplicación es `staff/maria-osipuk/asistenciapp/` y que las specs se buscan únicamente en su carpeta `specs/`. Eso no se vuelve a redactar.

Al implementar, la tabla de estado de `AGENTS.md` gana la fila de `004-quitar-referencias-personales`. No se cambia ninguna otra frase de esas reglas.

### 2.4 Qué no cambia (CA-05)

No se editan `app.py`, `asistencia/`, `static/`, `requirements.txt` ni `CONSTITUTION.md`. No se mueven carpetas ni se cambia cómo se pasa lista.

### 2.5 Cómo se comprueba la búsqueda (CA-02)

Un test nuevo recorre los `.md` de esta aplicación, salvo `specs/004-quitar-referencias-personales/` y salvo `.venv/`. Falla si aparece `Victor`, `Víctor` o `victor-chang`.

El mismo test lee los dos `cd` del README y comprueba que son `staff/<usuario>/asistenciapp`. También comprueba que `AGENTS.md` limita la búsqueda a `staff/maria-osipuk/asistenciapp/specs/`.

---

## 3. Comprobación

| Criterio | Qué mirar |
| --- | --- |
| CA-01 | Los dos `cd` del README son `staff/<usuario>/asistenciapp`. No aparece `maria-osipuk` en su lugar. Lo cubre el test nuevo |
| CA-02 | El test nuevo no encuentra `Victor`, `Víctor` ni `victor-chang` fuera de esta spec |
| CA-03 | `AGENTS.md` identifica `staff/maria-osipuk/asistenciapp/` y dice que las specs se buscan únicamente en su carpeta `specs/`. Lo cubre el test nuevo |
| CA-04 | Lectura de las notas de la tabla del §2.2: cada una conserva su fecha y su resultado, y no atribuye la comprobación a quien trabaja en esta carpeta |
| CA-05 | `git diff` no toca `app.py`, `asistencia/`, `static/` ni `CONSTITUTION.md` |

---

## 4. Comprobación de la constitución (v2.2)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se añade una plataforma ni se cambia el registro |
| P2 Simplicidad | Sí | Se sustituyen palabras que ya están. No hay un mecanismo nuevo |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia |
| P4 Privacidad | Sí | No se guardan datos nuevos. Se quitan referencias personales de la documentación |
| P5 Accesible y móvil | Sí | No se tocan pantallas |
| P6 Español | Sí | La spec, este plan y los textos que se reescriben están en español |
| §3 Stack | Sí | El stack no cambia |
| §4 SDD | Sí | El spec está aprobado. Este plan espera el ok antes de las tasks y del cambio |
| §5 Calidad | Sí | CA-01, CA-02 y CA-03 tienen test. CA-04 y CA-05 tienen un paso manual en §3 |
| §6 Seguridad | Sí | No se toca el registro ni los códigos |
| §7 Alcance | Sí | Todo queda dentro de `staff/maria-osipuk/asistenciapp/` |
| §8 Enmiendas | Sí | No se enmienda la constitución |

---

## 5. Decisiones tomadas

1. **Usuario genérico** (2026-10-23): las instrucciones dicen `staff/<usuario>/asistenciapp`, no la carpeta de quien trabaja aquí.
2. **Notas en impersonal** (2026-10-23): se conserva la fecha y el resultado. No se reescriben como comprobaciones de quien trabaja en esta carpeta.
3. **Reglas ya identifican esta aplicación** (2026-10-23): no se redactan de nuevo. Solo se añade la fila de estado de esta spec.
4. **Esta spec conserva el nombre** (2026-10-23): tiene que decir qué referencia quita. El test no la recorre.
5. **Un test de documentación** (2026-10-23): la búsqueda y los dos `cd` se comprueban solos. El comportamiento de pasar lista no se prueba otra vez.
