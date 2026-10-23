# Tareas 003 · Aclarar las instrucciones de arranque

> Estado: **Terminado** (2026-10-23) · Plan: [plan.md](plan.md) · Creado: 2026-10-23

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- La spec, el plan y esta lista ya están escritos. Las tareas de abajo son el cambio del README.

---

## Fase A · Títulos y organización

- [x] **T01** · Partir el apartado 2 del README en activar y arrancar.
  - El apartado 1 se queda igual, título y cuerpo.
  - El apartado 2 pasa a titularse «Activar el entorno (en cada terminal nueva)» y se lleva la frase y los comandos que ya activan el entorno.
  - El apartado 3 se titula «Arrancar la app» y se queda con la tabla de clase online y de uso en local, y con el texto de lo que se ve al arrancar.
  - No se añaden frases ni se cambian comandos ni rutas.
  - *Cubre:* CA-01, CA-02, CA-03.
  - *Hecha cuando:* preparar, activar y arrancar son tres apartados, y el de activar no incluye `python app.py`.

- [x] **T02** · Renumerar los apartados que vienen detrás.
  - Pasar lista pasa a 4, cerrar a 5, problemas frecuentes a 6, tests a 7 y privacidad a 8.
  - En problemas frecuentes, «ciérrala (sección 4)» pasa a «ciérrala (sección 5)».
  - El resto del texto de esos apartados no cambia.
  - *Cubre:* CA-04.
  - *Hecha cuando:* los números siguen en orden y la remisión apunta a «Cerrar la app».

## Fase B · Comprobar lo que no se toca

- [x] **T03** · Comprobar el diff del README y que el resto de la app no ha cambiado.
  - Las rutas `staff/victor-chang/asistenciapp` siguen igual.
  - Los comandos y sus comentarios siguen igual.
  - No hay diff fuera del README y de esta carpeta de spec.
  - *Cubre:* CA-04.
  - *Hecha cuando:* el diff cumple esas tres cosas.
