# Spec · Formato y lint

> Estado: **Aprobada** (2026-10-27) · Issue: #507 · Relacionada: #410

---

## 1. Problema

Al terminar una tarea hace falta formatear el JavaScript y comprobar errores de código y de sintaxis. Ahora no hay comandos `format` ni `lint` en esta first-app.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien construye la app con IA** | Lanzar formato y lint antes de cerrar una tarea. |

---

## 3. Historias de usuario

- **HU-01**: Como quien termina una tarea, quiero `pnpm format` con Prettier (formato estándar, sin `.prettierrc`), para dejar el JS de `db/`, `queries/` y `logic/` formateado.
- **HU-02**: Como quien termina una tarea, quiero `pnpm lint` con ESLint, para ver errores de código y de sintaxis.
- **HU-03**: Como quien sigue `AGENTS.md`, quiero que «Al terminar una tarea» exija lanzar formato y lint.

---

## 4. Criterios de aceptación

- **CA-01**: **Dado** `package.json`, **cuando** se mira scripts, **entonces** existe `format` y lanza Prettier sobre el JavaScript de `db/`, `queries/` y `logic/`.
- **CA-02**: **Dado** `package.json`, **cuando** se mira scripts, **entonces** existe `lint` y lanza ESLint.
- **CA-03**: **Dado** `AGENTS.md`, **cuando** se lee «Al terminar una tarea» y «Comandos», **entonces** figuran `pnpm format` y `pnpm lint`.
- **CA-04**: **Dado** first-app, **cuando** se ejecutan `pnpm format` y `pnpm lint`, **entonces** terminan bien.
- **CA-05**: **Dado** paquetes nuevos, **cuando** se acepta el plan, **entonces** hay validación Socket en el plan según `AGENTS.md`.

---

## 5. Fuera de alcance

- Cambiar reglas de negocio.
- Reescribir el código viejo para una acción por línea.
- Formatear el entorno Python (`.venv`).
- Dar una configuración propia a Prettier (`.prettierrc`).

---

## 6. Preguntas abiertas

Ninguna.

---

## 7. Historial

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 1.0 | 2026-10-27 | Aprobada (issue #507) |
