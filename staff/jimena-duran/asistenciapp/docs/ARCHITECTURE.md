# Arquitectura de AsistenciApp

Responsable: Jimena Durán.

- Reglas: asistencia/domain/ contiene códigos, nombres y validez de sesión.
  No importa HTTP ni almacenamiento.
- Acciones: asistencia/usecases/attendance.py coordina reglas y persistencia;
  devuelve datos y errores de negocio, nunca respuestas Flask.
- Borde: app.py traduce HTTP y autentica al profesor; static/ muestra pantallas.
  asistencia/storage/sqlite.py abre y cierra la conexión de cada operación.
  Solo conserva y consulta datos, no decide validez de una asistencia.

El esquema y el archivo data/asistencia.db no cambian. export.py da formato CSV;
tunnel.py publica la aplicación y no decide asistencia. Las acciones llaman al
almacén concreto: no hay una segunda persistencia ni una interfaz genérica.

No se añaden PostgreSQL, SQLAlchemy, Alembic, una segunda aplicación de consola,
.env, pre-commit ni documentación generada. Solo Flask, pytest y biblioteca estándar.
