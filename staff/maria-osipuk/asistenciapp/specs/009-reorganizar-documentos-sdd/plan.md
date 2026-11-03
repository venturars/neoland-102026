# Plan técnico 009 · Reorganizar los documentos SDD

> Estado: **Aprobado** (2026-11-02) · Spec aprobada: 2026-11-02 · Issue: #754 · Pull request: #755

Todas las rutas son relativas a la raíz de AsistenciApp.

## 1. Arquitectura y alcance

Es un cambio solo de documentación y de los tests que leen esa documentación. No cambian `app.py`, `asistencia/`, `static/`, `data/` ni `requirements.txt`. No hay rutas, datos ni dependencias nuevas.

La reorganización ya está redactada en local sin commitear, a partir de la versión 3.0. Este plan la toma como base y añade lo que pide la spec y todavía falta: recuperar los criterios concretos de la constitución (CA-09) y añadir la spec como paso obligatorio del orquestador (CA-06, CA-07).

## 2. Documentos (CA-01 a CA-05)

| Archivo | Papel después del cambio |
| --- | --- |
| `docs/CONSTITUTION.md` | Versión 3.1. Propósito, P1–P6, decisiones tecnológicas, SDD, calidad, seguridad, alcance y enmiendas. Enlaza al historial y a las guías. |
| `docs/CONSTITUTION-HISTORY.md` | Nuevo. Tabla de enmiendas 1.0–3.1 con versión, fecha, cambio y motivo. |
| `docs/STYLE.md` | Nuevo. Forma del código, tipos y docstrings de Python, idioma y comentarios educativos, sacados de `AGENTS.md`. |
| `AGENTS.md` | Cinco apartados: alcance y fuentes, flujo Git, SDD por fases, implementación, verificación y cierre. Enlaza a `STYLE.md`. |
| `docs/ARCHITECTURE.md` | Cinco responsabilidades, dependencia real de los casos de uso con el almacenamiento y apartado de entorno (Python 3.13+, `.venv/`, puerto 8000 o `PORT`, `data/asistencia.db`). |

## 3. Criterios concretos que se recuperan (CA-09, CA-10)

La versión redactada en local generalizó tres reglas. Se vuelven a escribir con su criterio comprobable, manteniendo la redacción nueva donde aclara:

| Apartado | Texto que se recupera |
| --- | --- |
| P5 | Las pantallas funcionan en un móvil de unos 400 px de ancho, con HTML semántico, contraste suficiente, formularios con `<label>` y navegación con teclado. |
| §6 | Un mismo alumno no puede registrarse dos veces en la misma sesión. Se conserva la aclaración de que el control por nombre normalizado no acredita la identidad. |
| §7 | El proyecto vive entero en la carpeta de AsistenciApp. No se tocan archivos fuera de esta carpeta. |

Con estas reglas recuperadas, la enmienda solo aclara y reorganiza: no elimina ni contradice un principio. Por eso es la versión menor 3.1. La fila 3.1 del historial lo dice en su motivo.

## 4. La spec como paso obligatorio (CA-06, CA-07, CA-08)

- `AGENTS.md`, apartado 2: el orden de preparación es issue → rama → PR en borrador → spec local, para cualquier cambio de un archivo de la app, incluida la documentación.
- `agents/git-workflow-agent.md`:
  - el objetivo deja de decir «sin parar el avance» y dice que no se salta las paradas SDD de `AGENTS.md`;
  - el paso «Empezar» añade un paso 7: las specs, según el apartado 3 de `AGENTS.md`, sin editar ningún archivo antes de la aprobación de la spec;
  - el procesamiento y los fallos conservan la redacción ya preparada en local.
- `agents/create-pr.md`: una PR existente se reutiliza y conserva su estado de revisión y su enlace.

## 5. Tests (CA-09, CA-06, CA-11)

Primero los tests, después los documentos:

| Test | Comprueba |
| --- | --- |
| `tests/test_docs.py` · nuevo `test_constitution_keeps_concrete_rules` | P5 contiene «400 px» y `<label>`; §6 contiene «dos veces en la misma sesión»; §7 contiene «fuera de esta carpeta». |
| `tests/test_docs.py` · nuevo `test_workflow_requires_spec_before_editing` | El orquestador contiene el paso de specs y no contiene «sin parar el avance». |
| `tests/test_layout.py`, `test_limits.py`, `test_visual_identity.py`, `test_docs.py` | Los ajustes ya redactados en local: buscan el estilo en `STYLE.md`, el historial en `CONSTITUTION-HISTORY.md` y la frase nueva de las specs. |

## 6. Verificación

| CA | Comprobación |
| --- | --- |
| CA-01 a CA-05 | Revisión documental: cada regla anterior tiene un único destino y los enlaces apuntan a archivos existentes. |
| CA-06, CA-07 | `test_workflow_requires_spec_before_editing` y lectura de `AGENTS.md`. |
| CA-08 | Lectura de `agents/create-pr.md`. |
| CA-09 | `test_constitution_keeps_concrete_rules`. |
| CA-10 | `test_limits.py` lee las versiones del historial; se comprueba a mano la fila 3.1. |
| CA-11 | `pytest` pasa y `git status` no muestra cambios fuera de la documentación, los tests y esta spec. |

## 7. Comprobación de la constitución (v3.1)

| Regla | Cumplimiento previsto |
| --- | --- |
| P1 · Independiente de la plataforma | No cambia el registro de asistencia ni sus integraciones. |
| P2 · Simplicidad | No se añaden capas ni mecanismos; se reduce la duplicación entre documentos. |
| P3 · Dependencias mínimas | No se añaden dependencias. |
| P4 · Privacidad mínima | Las reglas de datos y de la dirección de red conservan su contenido. |
| P5 · Accesible y usable en móvil | No cambia la interfaz; el principio recupera sus criterios concretos. |
| P6 · Español | Toda la documentación nueva está en español. |
| §4 · SDD | Spec aprobada; este plan y las tareas esperan su aprobación antes de implementar. |
| §5 · Calidad | Cada CA tiene una comprobación en el apartado 6; `pytest` debe pasar. |
| §6 · Seguridad | No cambian los códigos, el registro único, el cierre de sesiones ni la validación; §6 recupera el registro único. |
| §7 · Alcance | Todos los cambios quedan dentro de AsistenciApp. first-app tiene su propia spec en la misma issue. |
| §8 · Enmiendas | Enmienda 3.1 con fecha y motivo, aprobada por la persona responsable al aprobar esta spec y este plan. |

## 8. Estado de la fase

Plan aprobado e implementado. Las tareas están en `tasks.md`.
