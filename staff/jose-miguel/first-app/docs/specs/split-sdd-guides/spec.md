# Spec · Guías SDD en ficheros separados

> Estado: **Aprobada** (2026-10-27) · Issue: #504 · Relacionada: #402

---

## 1. Problema

Arquitectura, árbol, base de datos, errores y estilo viven mezclados en pocas guías. Quien construye o revisa un desarrollo necesita cada tema en su propio sitio, sin reescribir el código.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien escribe un desarrollo** | Leer un tema por fichero y saber qué actualizar si añade o quita un fichero. |
| **Quien acepta el plan** | Comprobar que el cambio cabe en las guías sin buscar el mismo texto en dos sitios. |

---

## 3. Historias de usuario

- **HU-01**: Como quien escribe un desarrollo, quiero una guía por tema (arquitectura, árbol, base de datos, errores, estilo), para no mezclar responsabilidades.
- **HU-02**: Como quien acepta el plan, quiero que la constitución conserve specs, paquetes y los cuatro pasos de `logic/`, y enlace al resto, para no duplicar lo movido.
- **HU-03**: Como quien escribe código nuevo, quiero la regla de una acción por línea en la guía de estilo, sabiendo que el JS ya existente no se reescribe en este desarrollo.

---

## 4. Criterios de aceptación

- **CA-01**: **Dado** `docs/`, **cuando** se abren las guías nuevas, **entonces** existen `ARCHITECTURE.md`, `TREE.md`, `DATABASE.md`, `ERRORS.md` y `STYLE.md`, cada una solo con su tema.
- **CA-02**: **Dado** el árbol y la arquitectura, **cuando** se leen, **entonces** listan esos cinco ficheros y solo el código real de esta first-app (sin inventar ficheros de otras apps).
- **CA-03**: **Dado** `CONSTITUTIONS.md`, **cuando** se lee, **entonces** conserva specs, paquetes y los cuatro pasos de `logic/`, enlaza a las guías nuevas y no repite árbol, DB, errores, constantes ni la regla de la línea.
- **CA-04**: **Dado** `AGENTS.md`, **cuando** se lee, **entonces** conserva SDD, comandos y cierre de tarea; enlaza a `docs/STYLE.md`; apunta a desarrollos en `docs/specs/<nombre>/`; dice que añadir o quitar un fichero actualiza `TREE.md` y `ARCHITECTURE.md`; y que un spec nuevo no se para porque el código viejo no cumpla la forma de línea.
- **CA-04b**: **Dado** las specs, **cuando** se mira el árbol, **entonces** viven en `docs/specs/` (ya no en la raíz de first-app).
- **CA-05**: **Dado** textos movidos, **cuando** se buscan en el origen, **entonces** ya no están duplicados ahí.
- **CA-06**: **Dado** este desarrollo, **cuando** se mira el código, **entonces** no se ha reescrito JavaScript ni SQL.

---

## 5. Fuera de alcance

- Reescribir o alinear el JavaScript y el SQL existentes.
- Cambiar los cuatro pasos del cuerpo de `logic/`.
- Cambiar las reglas de paquetes Socket.
- Añadir ESLint u otros ficheros que esta app no tiene.

---

## 6. Preguntas abiertas

Ninguna.

---

## 7. Historial

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 1.0 | 2026-10-27 | Aprobada (issue #504) |
| 1.1 | 2026-10-27 | Specs viven en `docs/specs/` |
