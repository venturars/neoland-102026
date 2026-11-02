# Arquitectura de AsistenciApp

Responsable: Jimena Durán.

- Reglas: asistencia/domain/ contiene códigos, nombres y validez de sesión.
  No importa HTTP ni almacenamiento.
  asistencia/domain/attempts.py decide si los recuentos superan sus máximos y
  define el error de bloqueo; no abre SQLite ni conoce HTTP.
- Acciones: asistencia/usecases/attendance.py coordina reglas y persistencia;
  devuelve datos y errores de negocio, nunca respuestas Flask.
- Borde: app.py traduce HTTP y autentica al profesor; static/ muestra pantallas.
  asistencia/storage/sqlite.py abre y cierra la conexión de cada operación.
  Solo conserva y consulta datos, no decide validez de una asistencia.

El archivo data/asistencia.db mantiene las tablas anteriores. La spec 006 añade
registration_attempts (dirección e instante) y blocked_ips (dirección y fecha de
bloqueo), separadas de checkins. Las acciones coordinan consulta de bloqueo,
anotación, poda y recuento; aplican la regla y conservan el bloqueo permanente.
app.py obtiene request.remote_addr, sin sustituirlo por cabeceras de identidad,
y traduce el bloqueo a HTTP 429. Tras el túnel puede identificar al proxy y
compartir los límites entre alumnos. El control solo cubre intentos de registro.
export.py da formato CSV;
tunnel.py publica la aplicación y no decide asistencia. Las acciones llaman al
almacén concreto: no hay una segunda persistencia ni una interfaz genérica.

No se añaden PostgreSQL, SQLAlchemy, Alembic, una segunda aplicación de consola,
.env, pre-commit ni documentación generada. Solo Flask, pytest y biblioteca estándar.

## Automatización del trabajo

```text
asistenciapp/
  agents/
  skills/
  tools/
  templates/
  MCPS/
  docs/
  specs/
```

Estas carpetas contienen el flujo original de desarrollo, separado de app.py, asistencia/, static/ y data/. El orquestador llama al subagente o skill del momento solicitado. Los siete scripts Bash se conservan sin cambios; no acceden al almacenamiento de asistencia.

Las doce plantillas originales son la fuente editorial de issues y PR. MCP y la alternativa gh se describen en [GIT-AUTOMATION.md](GIT-AUTOMATION.md), junto con la ejecución desde Git Bash y los límites de la copia.

El SDD local definido en AGENTS.md y CONSTITUTION.md prevalece sobre las indicaciones de continuar automáticamente del template. La integración no incorpora ensayos propios permanentes en tools/tests/; las comprobaciones de la entrega se realizan en repositorios desechables con remoto local y resultados separados.
