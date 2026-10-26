# Tareas 003 · Títulos de las instrucciones de arranque

> Estado: **Hechas** · Plan: [plan.md](plan.md) aprobado · Creado: 2026-10-23 · Aplicadas: 2026-10-23

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- No hay test automático: la comprobación es leer el texto, como dice el plan, apartado 3.

---

## Fase A · Documento de uso

- [x] **T01** · En `README.md`, cambiar el título `## 2. Arrancar la app` por `## 2. Activar el entorno`.
  - El párrafo «En cada terminal nueva, primero activa el entorno» y el bloque de comandos no se tocan.
  - La ruta `staff/victor-chang/asistenciapp` se queda igual.
  - *Cubre:* CA-01, CA-03.
  - *Hecha cuando:* ese bloque se titula «Activar el entorno» y ya no se titula «Arrancar la app».
- [x] **T02** · En `README.md`, añadir `### Arrancar la app` justo antes de la tabla de pasos que ejecutan la aplicación.
  - La tabla, el ejemplo de salida y los apartados 3 a 7 no se reescriben ni se renumeran.
  - *Cubre:* CA-02, CA-03.
  - *Hecha cuando:* los dos pasos de esa tabla están bajo el título «Arrancar la app».

## Fase B · Comprobación

- [x] **T03** · Leer `README.md` y el diff con la tabla del plan, apartado 3.
  - *Cubre:* CA-01, CA-02, CA-03.
  - *Hecha cuando:* solo cambian esos dos títulos. Comandos, rutas, formato y el resto del documento siguen igual, y ningún otro archivo cambia.
