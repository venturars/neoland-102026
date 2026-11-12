# Spec 005 · Separar reglas, almacén y pantalla

> Estado: **Aprobada** (2026-10-23) · Creada: 2026-10-23 · Aprobada: 2026-10-23

---

## 1. Problema

La constitución y el manual están en la raíz, al lado del código. Las reglas del código, el guardado y la página están mezclados: `app.py` abre la base y también responde al navegador. Quien entra en la carpeta no ve, de un vistazo, qué parte decide y qué parte solo guarda.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien trabaja en esta carpeta** | Encontrar las reglas, el almacén y la página en sitios distintos, y que pasar lista siga igual. |

---

## 3. Historias de usuario

- **HU-01**: Quiero la constitución en `docs/` y el manual con el nombre `AGENTS.md`.
- **HU-02**: Quiero un documento que diga cómo se reparte el código.
- **HU-03**: Quiero que las reglas, las acciones y el almacén vivan en carpetas distintas, y que la página no abra la base.
- **HU-04**: Quiero que una función pública diga qué recibe, qué devuelve y un ejemplo corto.

---

## 4. Criterios de aceptación

- **CA-01**: **Dado** la carpeta, **cuando** busco la constitución, **entonces** está en `docs/CONSTITUTION.md` y ya no está en la raíz.
- **CA-02**: **Dado** la carpeta, **cuando** busco el manual, **entonces** se llama `AGENTS.md` y explica cómo se escribe una función.
- **CA-03**: **Dado** `docs/ARCHITECTURE.md`, **cuando** lo leo, **entonces** nombra las reglas, las acciones y el almacén, y dice que `app.py` no abre la base.
- **CA-04**: **Dado** una petición de pasar lista, **cuando** la app responde, **entonces** el resultado es el mismo que antes: mismos avisos y mismos datos.
- **CA-05**: **Dado** `pytest`, **cuando** termina, **entonces** pasa.

---

## 5. Fuera de alcance

- El bot de Discord y la asistencia automática de Meet.
- Reescribir las specs ya cerradas.
- Cambiar lo que ve el profesor o el alumno.

---

## 6. Preguntas abiertas

Ninguna.
