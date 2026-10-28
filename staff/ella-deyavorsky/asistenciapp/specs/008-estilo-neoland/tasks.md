# Tareas 008 · Aspecto de Neoland

> Estado: **Aprobado v1.0 (2026-10-28)** · Plan: [plan.md](plan.md) v1.1 · Spec: [spec.md](spec.md) v1.0 · Creado: 2026-10-28

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Primero el test y luego el código cuando se puede (el contraste, T03). El resto es aspecto: se comprueba en el navegador, con capturas.
- Tras cada tarea, `pytest` en verde. Los tests que ya existen no se modifican.
- `profesor.js`, `alumno.js`, `app.py` y `asistencia/` no se tocan: `git diff --stat -- '*.js' '*.py'` solo puede mostrar `tests/test_contrast.py`.
- No se hace commit de nada de `staff/ella-deyavorsky/first-app/`. No hay commits ni pushes sin que lo pidas.

---

## Fase A · Tipografías

- [x] **T01** · Descargar a `static/fonts/` los 6 archivos de plan §2.3 (4 tipografías `.woff2` y 2 licencias OFL) desde `@fontsource/*@5.3.0` en cdn.jsdelivr.net. **Se para y se espera tu sí** con el nombre, el origen y el tamaño de cada uno antes de descargarlos.
  - *Cubre:* RF-2, RF-10.
  - *Hecha cuando:* los 6 archivos están en `static/fonts/` y pesan lo que dice la tabla del plan.
- [x] **T02** · `@font-face` al principio de `styles.css` (Montserrat 800; Roboto 400, 500 y 700; `font-display: swap`) y variables `--font-heading` y `--font-body`; `body`, `h1` y `h2` las usan.
  - *Cubre:* CA-06.
  - *Hecha cuando:* en el navegador, `document.fonts` da las cuatro como cargadas y todas las peticiones van a `localhost`.

- **Checkpoint:** `pytest` completo en verde; luego se propone un commit solo de esta fase (mensaje en inglés y lista de archivos) y se espera tu sí. Nunca `git add .` y nunca archivos de base de datos.

## Fase B · Colores y contraste

- [ ] **T03** · Test primero: nuevo `tests/test_contrast.py`. Lee `static/styles.css`, saca las variables del `:root` claro y del oscuro (`@media (prefers-color-scheme: dark)`) y comprueba el contraste de cada par en los dos modos:
  - 4,5:1: `--text` y `--muted` sobre `--bg` y `--surface`; `--heading` sobre `--surface`; `--accent-ink` sobre `--bg` y `--surface`; `--accent-text` sobre `--accent-ink`; blanco y `--accent-on-dark` sobre `--charcoal`; `--ok-text`, `--warn-text` y `--error-text` sobre su fondo.
  - 3:1: `--accent-text` sobre `--accent` (texto de 18 px en negrita).
  - *Cubre:* CA-04.
  - *Hecha cuando:* el test falla porque faltan las variables nuevas, y los tests de hoy siguen pasando. Se para a esperar tu ok.
- [ ] **T04** · Variables de plan §2.1 en el `:root` y en el modo oscuro de `styles.css`.
  - *Cubre:* RF-1, RF-7, CA-04.
  - *Hecha cuando:* `pytest` completo en verde, incluido `test_contrast.py`.

- **Checkpoint:** `pytest` completo en verde; luego se propone un commit solo de esta fase y se espera tu sí.

## Fase C · Reglas y clases

- [ ] **T05** · Reglas base de plan §2.2: títulos, tarjetas, campos, botones (principal, `.secondary`, `.danger`, `.danger-solid`, `.small`), foco, `.badge` y `.message`.
  - *Cubre:* RF-2, RF-3, RF-6, CA-02, CA-03.
  - *Hecha cuando:* capturas del panel y de «Editar grupo», en claro y oscuro, comparadas con neoland.es.
- [ ] **T06** · Banda del código y etiquetas (plan §2.2 y §2.4): `.card.dark`, `.code`, `.countdown`, `.link-box` y botones dentro de la banda; clase `.eyebrow`. En `profesor.html`, `#code-card` pasa a `card dark` y «Código para pasar lista» a `eyebrow`. En `alumno.html`, «Pasar lista» pasa a `eyebrow` y el `style` de «Escribe tu nombre» pasa a una clase. Ningún texto cambia.
  - *Cubre:* RF-4, RF-5, CA-02.
  - *Hecha cuando:* capturas de una sesión abierta con grupo y de la página del alumno, en claro y oscuro.
- [ ] **T07** · Lista del alumno (`.roster`), casillas (`.boxes`, con «Repetido») y móvil (menos de 480 px: radio de tarjeta 20 px y `h1` más pequeño).
  - *Cubre:* RF-3, RF-6, RF-11, CA-02, CA-05.
  - *Hecha cuando:* capturas a 400 px de todas las pantallas sin desplazamiento lateral.

- **Checkpoint:** `pytest` completo en verde; luego se propone un commit solo de esta fase y se espera tu sí.

## Fase D · Verificación y documentación

- [ ] **T08** · Verificación completa (plan §4), con la app de esta carpeta en un puerto libre:
  - recorrido de CA-01: crear y editar un grupo, sesión rápida y con grupo, registrarse, liberar, cerrar, decidir sobre un nuevo y descargar;
  - capturas de CA-02, CA-03 y CA-05: inicio, panel, «Nuevo grupo», «Editar grupo» (con «Repetido» y «Subir igualmente»), sesión abierta y cerrada, sesión rápida, y página del alumno (formulario rápido, código y lista), en un ordenador y a 400 px, en claro y oscuro;
  - CA-05 con el teclado: Tab e Intro con el foco visible;
  - CA-06: tipografías cargadas y solo peticiones a `localhost`.
  - Al acabar, se para la app y `lsof -nP -iTCP:<puerto> -sTCP:LISTEN` no muestra nada.
  - *Cubre:* CA-01 a CA-06.
  - *Hecha cuando:* todo funciona como antes, se parece a neoland.es y el puerto queda libre.
- [ ] **T09** · Documentación: en `README.md`, una línea con el aspecto de Neoland y que las tipografías están en `static/fonts/` con su licencia. En `AGENTS.md`, `fonts/` en el árbol de §3 y la fila de la spec 008 en §8.
  - *Hecha cuando:* `pytest` completo en verde y la documentación describe la app.

- **Checkpoint:** `pytest` completo en verde; luego se propone un commit solo de esta fase y se espera tu sí.

---

## Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-28 | Borrador inicial | Plan 008 v1.1 |
| 1.0 | 2026-10-28 | Aprobadas | Ok de la persona que trabaja en esta carpeta |
