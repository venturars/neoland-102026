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

Estas carpetas contienen el flujo de desarrollo, separado de app.py, asistencia/, static/ y data/. El orquestador reconoce el momento autorizado, coordina agentes reales y lee las skills por ruta. Las herramientas PowerShell calculan la raíz del repositorio y comprueban estado, permisos y resultados nativos; no acceden al almacenamiento de asistencia.

Las doce plantillas por tipo son la fuente editorial de issues y PR. El agente de PR prepara el borrador contra staging sin marcador de cierre; el orquestador enlaza después la issue y verifica Development por separado. MCP es la vía preferida cuando su identidad y capacidades corresponden; gh autenticado es la alternativa. Las conexiones existentes no se modifican.

Los cinco momentos y sus pausas se definen en CONSTITUTION.md y AGENTS.md. La guía [GIT-AUTOMATION.md](GIT-AUTOMATION.md) explica las invocaciones y los límites. Los ensayos viven en tools/tests/ y usan repositorios desechables con remoto local; no reutilizan las bases ni los recursos de la aplicación.
