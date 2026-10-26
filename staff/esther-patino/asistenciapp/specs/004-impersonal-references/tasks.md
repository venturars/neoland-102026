# Tareas 004 · Referencias impersonales

> Estado: **Hechas** · Plan: [plan.md](plan.md) aprobado · Creado: 2026-10-23 · Aplicadas: 2026-10-23

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- No hay test automático: la comprobación es leer el texto, como dice el plan, apartado 3.

---

## Fase A · Reglas vivas

- [x] **T01** · En `CONSTITUTION.md`, quitar el nombre propio de los apartados 4, 7 y 8.
  - Apartado 4, punto 1: quien aprueba antes del plan y antes de modificar los ficheros es quien trabaja en el proyecto.
  - Apartado 7: el proyecto vive entero en la carpeta de este proyecto. No se tocan archivos fuera de esta carpeta.
  - Apartado 8: cualquiera puede proponer un cambio, y lo aprueba quien trabaja en el proyecto.
  - La versión sube de 2.2 a **2.3**. En el historial, fecha 2026-10-23: los apartados 4, 7 y 8 dejan de nombrar a una persona. Motivo: spec 004.
  - P1–P6 no se tocan.
  - *Cubre:* CA-01, CA-02.
  - *Hecha cuando:* esos tres apartados hablan de quien trabaja en el proyecto y de la carpeta de este proyecto, la cabecera dice 2.3 y el historial tiene la fila nueva.
- [x] **T02** · En `AGENT.md`, el ok, los commits, las enmiendas y el visto bueno los da quien trabaja en el proyecto.
  - Los comandos se ejecutan desde la carpeta de este proyecto. Solo se edita dentro de esa carpeta.
  - Al cerrar cada fase, el resumen es para quien trabaja en el proyecto.
  - La tabla de estado deja esta spec en la fase que tenga.
  - *Cubre:* CA-01, CA-02, CA-05.
  - *Hecha cuando:* el manual ya no nombra a una persona concreta ni una ruta con nombre de persona, y la tabla incluye `004-impersonal-references`.
- [x] **T03** · En `README.md`, quitar de los dos bloques de comandos la línea que entra en una carpeta con nombre de persona.
  - El párrafo de cada bloque dice que esos comandos se ejecutan dentro de la carpeta de este proyecto.
  - Los comandos para preparar el entorno y para arrancar la app se quedan igual.
  - *Cubre:* CA-02.
  - *Hecha cuando:* el documento de uso no tiene una ruta con nombre de persona y esos comandos siguen.

## Fase B · Comprobación

- [x] **T04** · Leer la constitución, el manual y el documento de uso con la tabla del plan, apartado 3.
  - Comprobar que el código y los tests no han cambiado.
  - *Cubre:* CA-01, CA-02, CA-04, CA-05.
  - *Hecha cuando:* los tres documentos vivos cumplen CA-01 y CA-02, la tabla de estado cumple CA-05, y las specs anteriores, el código y los tests siguen igual.
