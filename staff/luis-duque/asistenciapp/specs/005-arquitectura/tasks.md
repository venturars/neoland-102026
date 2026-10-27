# Tareas 005 · Arquitectura y documentos

Estado: aprobadas el 2026-10-25.
Plan: [plan.md](plan.md), aprobado el 2026-10-25.
Spec: [spec.md](spec.md), aprobada el 2026-10-25.

- [x] **T01** · Mover `CONSTITUTION.md` a `docs/CONSTITUTION.md` sin cambiar el texto. Cubre CA-01.
- [x] **T02** · Crear `docs/ARCHITECTURE.md`. Debe decir que el código se parte en reglas, acciones y bordes, y que no se traen la base de datos de servidor, el migrador, la aplicación de consola, la aplicación en memoria ni la documentación generada del ejemplo. Cubre CA-02.
- [x] **T03** · Renombrar `AGENT.md` a `AGENTS.md`. Actualizar dentro los enlaces y el árbol para que señalen `docs/CONSTITUTION.md` y `AGENTS.md`. El orden spec, plan, tareas e implementación se queda. Cubre CA-03.
- [x] **T04** · En `README.md`, actualizar solo los enlaces a la constitución y al manual. Cubre CA-01 y CA-03.
- [x] **T05** · Mover `asistencia/codes.py` y `asistencia/names.py` a `asistencia/reglas/`. Esos módulos no importan Flask ni SQLite. Actualizar los imports de los tests. Cubre CA-04 y CA-05.
- [x] **T06** · Crear `asistencia/acciones.py` con abrir una clase, registrarse, ver la lista, quitar un registro, cerrar la clase y descargar la lista. Reciben el guardado ya abierto y no conocen la web. Cubre CA-04.
- [x] **T07** · Dejar `app.py` como borde web: las rutas llaman a las acciones y dejan de decidir la regla. `db.py`, `export.py` y `tunnel.py` siguen en su sitio. Cubre CA-04 y CA-05.
- [x] **T08** · Ejecutar `pytest` y comprobar que `requirements.txt` no gana líneas y que las specs 001 a 004 no se han reescrito. Cubre CA-04 y CA-05.

La redacción y el movimiento de archivos están hechos.
