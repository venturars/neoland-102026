# Plan técnico 004 · Quitar las referencias personales a Raúl

> Estado: **Aprobado** (2026-10-26) · Spec: [spec.md](spec.md) v1.0 · Creado: 2026-10-26 · Aprobado: 2026-10-26

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre.

---

## 1. Visión general

Se editan documentos que ya existen. No hay arquitectura nueva, ni modelo de datos, ni rutas de la app, ni pantallas. No se añade ninguna dependencia.

La spec 002 exigía nombrar `staff/raul-santamaria/asistenciapp/` en constitución y manual (su CA-06). La 003 dejó fuera las rutas personales del README. Esta spec, posterior, es la que cubre quitar esas referencias y alinear la 002.

El único fichero nuevo es `tests/test_personal_references.py`.

No se toca nada fuera de esta carpeta de la app.

---

## 2. Decisiones

### 2.1 Los dos `cd` del README nombran un usuario genérico (CA-01, CA-04)

En [README.md](../../README.md), las dos líneas que entran en la carpeta pasan de `cd staff/raul-santamaria/asistenciapp` a `cd staff/<usuario>/asistenciapp`.

`<usuario>` se escribe así, con los ángulos. No se sustituye por el nombre de una persona.

El resto de cada bloque, y el resto del README, no cambia. El diff del README son solo esas dos líneas.

### 2.2 Constitución y manual usan la misma ruta genérica (CA-02, CA-03)

En cada sitio se quita la carpeta personal. El hecho (dónde se trabaja, quién aprueba) se queda.

| Fichero | Ahora | Después |
| --- | --- | --- |
| `AGENT.md` | `Ejecutar desde \`staff/raul-santamaria/asistenciapp/\`:` | `Ejecutar desde \`staff/<usuario>/asistenciapp/\`:` |
| `AGENT.md` | `**Solo se edita dentro de \`staff/raul-santamaria/asistenciapp/\`.**` | `**Solo se edita dentro de \`staff/<usuario>/asistenciapp/\`.**` |
| `docs/CONSTITUTION.md` | `El proyecto vive entero en \`staff/raul-santamaria/asistenciapp/\`. No se tocan archivos fuera de esta carpeta.` | `El proyecto vive entero en \`staff/<usuario>/asistenciapp/\`. No se tocan archivos fuera de esta carpeta.` |
| `docs/CONSTITUTION.md` (historial 2.2) | `§7–§8: carpeta \`staff/raul-santamaria/asistenciapp/\` y aprueba la persona que trabaja en esta carpeta` | `§7–§8: carpeta \`staff/<usuario>/asistenciapp/\` y aprueba la persona que trabaja en esta carpeta` |

No se añade una enmienda nueva de constitución: solo se corrige el texto que aún nombra la carpeta personal. La versión sigue en 2.3.

### 2.3 Las specs cerradas dejan de citar la carpeta personal (CA-02)

| Fichero | Después |
| --- | --- |
| `specs/002-spec-antes-del-cambio/spec.md` (CA-06) | `**CA-06**: **Dado** la constitución y el manual del agente, **entonces** nombran \`staff/<usuario>/asistenciapp/\` y dicen que quien aprueba cada fase es la persona que trabaja en esa carpeta.` |
| `specs/002-spec-antes-del-cambio/plan.md` | `Constitución §7–§8; \`AGENT.md\` §4–§6 y rutas \`staff/<usuario>/asistenciapp/\`` |
| `specs/002-spec-antes-del-cambio/plan.md` | `Solo dentro de \`staff/<usuario>/asistenciapp/\`` |
| `specs/002-spec-antes-del-cambio/tasks.md` | `esos apartados siguen nombrando la puerta, el orden, la carpeta \`staff/<usuario>/asistenciapp/\` y quién aprueba.` |
| `specs/003-activar-el-entorno/tasks.md` | `lanzar \`pytest\` una vez desde \`staff/<usuario>/asistenciapp/\`.` |
| `specs/001-checkin-codigo/tasks.md` | `Rutas \`staff/<usuario>/asistenciapp/\`.` |

Las frases de fuera de alcance de la 003 que hablan de «carpeta personal» sin escribir el nombre no se tocan: ya cumplen CA-02.

### 2.4 El test busca el nombre fuera de esta spec (CA-01, CA-02, CA-03)

`tests/test_personal_references.py` hace tres comprobaciones:

1. En el README, las dos líneas que empiezan por `cd staff/` son exactamente `cd staff/<usuario>/asistenciapp`.
2. En los Markdown de esta carpeta no aparece `raul` ni `raúl`, en cualquier mayúscula. Se saltan `.venv/` y `specs/004-quitar-referencias-personales/`. Esta spec tiene que nombrar la referencia para poder quitarla; el plan y las tareas también. El resto de la documentación, no.
3. Las frases «Después» de las tablas del §2.2 y del §2.3 están en sus ficheros.

La búsqueda de `raul` / `raúl` cubre el nombre y la carpeta `raul-santamaria`. El apartado 1 impide que esa carpeta se cambie por el nombre de otra persona.

No hay notas de la 001 que nombraran a Raúl: no hay una tabla de frases conservadas de ese tipo.

---

## 3. Comprobación

| Criterio | Qué lo cubre |
| --- | --- |
| CA-01 | Test: las dos líneas `cd staff/` del README son `cd staff/<usuario>/asistenciapp` |
| CA-02 | Test: ningún Markdown fuera de esta spec y de `.venv/` contiene `raul` ni `raúl` |
| CA-03 | Test: las frases «Después» de constitución y `AGENT.md` (§2.2) están en sus ficheros |
| CA-04 | El diff del README solo cambia las dos líneas `cd`. `pytest` completo confirma que pasar lista sigue igual |

---

## 4. Comprobación de la constitución (v2.3)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se cambia el registro ni se ata a una plataforma |
| P2 Simplicidad | Sí | Se sustituyen frases en documentos que ya existen. Un solo test nuevo |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia. El test usa `pytest`, ya permitido |
| P4 Privacidad | Sí | Se quita un nombre personal de la documentación. No se guardan datos nuevos |
| P5 Accesible y móvil | Sí | No se tocan pantallas |
| P6 Español | Sí | Las frases nuevas y este plan están en español. El código del test puede ir en inglés |
| §5 Calidad | Sí | CA-01, CA-02 y CA-03 tienen test. CA-04 tiene el diff del README y el `pytest` ya existente |
| §6 Seguridad | Sí | No se tocan códigos, sesiones ni entradas del usuario |
| §7 Alcance | Sí | Solo se edita dentro de esta carpeta de la app; el texto de §7 pasa al usuario genérico |
| §8 Enmiendas | Sí | No se cambia un principio; solo se corrige una ruta personal en el texto |

---

## 5. Decisiones tomadas

1. **Usuario genérico literal** (2026-10-26): README, AGENT, constitución y specs citadas usan `staff/<usuario>/asistenciapp`. No se rellena `<usuario>` con un nombre.
2. **Esta carpeta de spec queda fuera de la búsqueda** (2026-10-26): el spec, el plan y las tareas nombran la referencia que se quita. El test no los lee.
3. **Sin enmienda de versión** (2026-10-26): la constitución sigue en 2.3; solo se limpia la ruta personal del cuerpo y del historial 2.2.
4. **Sin notas de la 001** (2026-10-26): no hay frases «Raúl aceptó / probó…» que limpiar ahí.
