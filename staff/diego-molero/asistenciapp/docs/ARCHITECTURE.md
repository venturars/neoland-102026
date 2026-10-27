# Arquitectura de AsistenciApp

## Responsabilidades

La entrada HTTP llama a las acciones. Las acciones piden decisiones al dominio y persistencia al almacén.

```text
app.py y static/ -> asistencia/usecases/ -> asistencia/domain/
                                        -> asistencia/storage/
```

| Parte | Responsabilidad |
| --- | --- |
| `asistencia/domain/` | Códigos, normalización de nombres y validación de sesión. No importa Flask ni SQLite. |
| `asistencia/usecases/attendance.py` | Preparar, abrir, consultar, registrar, cerrar, quitar y exportar. Recibe la ruta y el reloj; coordina reglas y almacenamiento. |
| `asistencia/storage/sqlite.py` | Leer y escribir SQLite. Abre y cierra una conexión por operación, también si ocurre un error. No decide si el código vale o la clase está abierta. |
| `app.py` | Autorizar al profesor, recibir HTTP, llamar a una acción y traducir resultados y errores a las respuestas existentes. |
| `static/` | Pantallas existentes de profesor y alumno. |
| `asistencia/export.py` | Dar formato CSV a filas ya cargadas. |
| `asistencia/tunnel.py` | Publicar el enlace de la aplicación, sin decidir reglas de asistencia. |

## Contratos y datos

Se conserva `create_app(db_path, token=None, now=time.time)` para inyectar un archivo temporal y un reloj en las pruebas. Las rutas, los campos JSON, los estados HTTP y la cabecera del profesor permanecen iguales.

El archivo sigue en `data/asistencia.db`. Las tablas siguen siendo `config`, `sessions` y `checkins`, con las mismas columnas y restricción de duplicados. Esta reorganización no necesita migraciones ni guarda datos nuevos.

Las reglas producen errores propios para sesión inexistente, cerrada o código inválido. La entrada HTTP los traduce a 404, 409 y 422. La validación de nombre conserva 400.

## Documentos y escritura

La [constitución](CONSTITUTION.md) recoge las reglas; el [manual](../AGENTS.md) describe el trabajo diario y cómo documentar las funciones. Cada función pública modificada tiene tipos y explica parámetros, retorno y un ejemplo de uso.

## Límites

Siguen Flask, pytest y la biblioteca estándar. No se incorporan PostgreSQL, SQLAlchemy, Alembic, otra base de datos ni una interfaz para múltiples almacenes. Las pantallas y las reglas de privacidad y seguridad conservan su funcionamiento.
