# Plan técnico 004 · Quitar las referencias personales a otro usuario

> Estado: **Implementado (2026-10-26)** · Spec: [spec.md](spec.md) v1.1 · Creado: 2026-10-26 · Aprobado: 2026-10-26

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre. La comprobación de CA-01 y CA-02 es un test nuevo; el resto es manual: el cambio es documentación, no una pantalla ni un comportamiento de la app.

---

## 1. Visión general

Se editan ficheros de texto (`.md`) que ya existen y se añade un único fichero de tests. No hay arquitectura nueva, ni modelo de datos, ni rutas, ni código de la app. No se añade ninguna dependencia.

Hay tres tipos de cambio:

- **La ruta** del README pasa a ser la de esta carpeta.
- **Las frases** de las specs 001 y 002 que atribuyen algo a una persona se reescriben sin nombrarla. El contenido (qué se decidió, qué se probó, qué fecha) se queda igual.
- **Un test nuevo** comprueba CA-01 y CA-02 para que la referencia no vuelva.

`CONSTITUTION.md`, `AGENT.md`, el código y los tests ya no nombran a esa persona. Solo se toca `AGENT.md` para listar esta spec en su tabla de estado (§7), como se hizo con la 003.

---

## 2. Decisiones

### 2.1 La ruta del README (CA-01)

Las dos líneas `cd` de las secciones «Preparar el entorno» y «Activar el entorno» pasan a `cd staff/ella-deyavorsky/asistenciapp`. El resto del bloque no cambia.

### 2.2 Notas de prueba de la spec 001 (CA-02, CA-03)

Las cuatro notas de `tasks.md` con el nombre entre paréntesis pasan a una forma impersonal. La fecha y el resultado se conservan.

| Fichero | Antes (forma) | Después |
| --- | --- | --- |
| `001/tasks.md` CA-19 | nota «(nombre, 2026-10-20: …)» | `*(Prueba del 2026-10-20: registro correcto desde un móvil con datos móviles.)*` |
| `001/tasks.md` CA-20 | ídem | `*(Prueba del 2026-10-20: el panel se abre directamente.)*` |
| `001/tasks.md` CSV | ídem | `*(Prueba del 2026-10-20: dos columnas y tildes correctas.)*` |
| `001/tasks.md` prueba con el móvil | «<nombre> lo prueba con su móvil…» y nota ídem | «Se prueba con un móvil (…) y se quita un registro desde el panel. *(Prueba del 2026-10-20: pasos 1–5 correctos.)*» |

### 2.3 Decisiones y aprobaciones de la spec 001 (CA-02, CA-03)

| Fichero | Antes (forma) | Después |
| --- | --- | --- |
| `001/plan.md` §8 | título «Decisiones tomadas por <nombre>» | «Decisiones tomadas» |
| `001/spec.md` §6 | «<nombre> aceptó las propuestas» | «Se aceptaron las propuestas» |
| `001/spec.md` historial v1.2 | «<nombre> detecta que un alumno puede registrar…» | «Se detecta que un alumno puede registrar…» |

### 2.4 Referencias dentro de la spec 002 (CA-02, CA-03)

La spec 002 comprobaba que la constitución no nombrara a esa persona. Esa comprobación se conserva, pero sin escribir el nombre.

| Fichero | Cambio |
| --- | --- |
| `002/tasks.md` (tarea del §4) | «y no nombra a <nombre>» → «y no nombra a ninguna persona» |
| `002/tasks.md` (comprobación) | el comando `grep -n -i "<nombre>"` se reformula como «Buscar el nombre de una persona en `CONSTITUTION.md` y `AGENT.md`: no debe encontrarse ninguno» |
| `002/spec.md` historial v1.1 | «`grep` de «<nombre>» vacío» → «búsqueda de nombres de personas vacía» |

### 2.5 Listar la spec 004 (CA-04)

En `AGENT.md` §7 se añade una fila `004-quitar-referencias-personales` con su fase. La fila de la 003 y las demás no cambian. La tabla se actualiza al aprobar y al terminar.

### 2.6 El test nuevo (CA-01, CA-02, CA-05)

Se crea `tests/test_personal_references.py`, con el mismo estilo que los tests que ya hay (docstring con los criterios y funciones `test_…` con `assert`). Usa solo la biblioteca estándar y `pytest`, que ya está instalado. Tiene dos tests:

- **Las rutas `cd` del README** (CA-01): lee `README.md`, busca las líneas que empiezan por `cd ` y comprueba que todas valen `cd staff/ella-deyavorsky/asistenciapp` y que hay al menos una.
- **Ningún Markdown con el nombre** (CA-02): recorre todos los `.md` de la carpeta de la app, salvo los de `.venv` y `__pycache__`, y comprueba que ninguno contiene el nombre, sin distinguir mayúsculas. Si falla, el mensaje dice en qué ficheros está.

El test es un `.py`, así que el nombre que busca no incumple CA-02, que solo mira ficheros Markdown. Se escribe **antes** de los cambios en los `.md` y debe fallar; después pasa.

### 2.7 Lo que no se toca (CA-04, CA-05)

Ni el código (`app.py`, `asistencia/`, `static/`), ni los tests que ya existen, ni `requirements.txt`, ni `pytest.ini`, ni el resto de frases de las specs. `.venv` queda fuera: los nombres de otras personas que vienen en las herramientas instaladas no se tocan.

---

## 3. Comprobación

| Criterio | Qué mirar |
| --- | --- |
| CA-01 | Test de las rutas `cd` en verde; además, a ojo, las dos rutas del README son `staff/ella-deyavorsky/asistenciapp` |
| CA-02 | Test de los `.md` en verde (falla antes de los cambios); además, una búsqueda del nombre sin distinguir mayúsculas, sin `.venv` ni `__pycache__`, no encuentra nada |
| CA-03 | Cada frase reescrita conserva la fecha, el resultado y la decisión de la frase original |
| CA-04 | El diff solo cambia las frases y la ruta de §2 y la fila nueva de `AGENT.md`: ni requisitos, ni criterios, ni fechas, ni estados de las specs 001 y 002 |
| CA-05 | `git diff --stat` solo añade `tests/test_personal_references.py` como fichero `.py`; no cambia ningún `.py` ni `.js` ni test existente; `pytest` termina en verde |

---

## 4. Comprobación de la constitución (v2.2)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se cambia el registro ni se ata a una plataforma |
| P2 Simplicidad | Sí | Solo se reescriben frases. No hay un mecanismo nuevo |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia |
| P4 Privacidad | Sí | No se guardan datos. Se quita un nombre de persona de la documentación |
| P5 Accesible y móvil | Sí | No se tocan pantallas |
| P6 Español | Sí | Todo el texto nuevo está en español |
| §3 Stack | Sí | El stack no cambia |
| §4 SDD | Sí | Esta spec existe antes de tocar el README y las specs; la issue #351 y la PR no la sustituyen |
| §5 Calidad | Sí | Cada criterio tiene una comprobación en §3 |
| §6 Seguridad | Sí | No se tocan códigos, sesiones ni entradas del usuario |
| §7 Alcance | Sí | Todo queda en `staff/ella-deyavorsky/asistenciapp/` |
| §8 Enmiendas | Sí | No se enmienda la constitución |

---

## 5. Decisiones tomadas

1. **Ruta con la carpeta real** (2026-10-26): `staff/ella-deyavorsky/asistenciapp`, no una ruta genérica.
2. **Forma impersonal** (2026-10-26): las specs 001 y 002 se reescriben sin nombre y con el mismo contenido, en vez de dejarlas como registro histórico.
3. **Un test automático** (2026-10-26): `tests/test_personal_references.py` comprueba CA-01 y CA-02. El resto se comprueba leyendo el diff.
4. **`.venv` fuera** (2026-10-26): no se buscan ni se tocan los nombres de otras personas dentro de las herramientas instaladas.
