# Plan 005 · Arquitectura y documentos

Estado: aprobado el 2026-10-25. Autorizada la preparación de las tareas.
Spec: [spec.md](spec.md), aprobada el 2026-10-25.

Este documento explica cómo se separan los documentos y el código de pasar lista en tres capas, sin copiar el ejemplo. Cubre CA-01 a CA-05.

## 1. Qué se toca

Documentos:

- `CONSTITUTION.md` pasa a `docs/CONSTITUTION.md`. El texto no cambia.
- Se crea `docs/ARCHITECTURE.md`. Dice que hay tres capas y nombra lo que no se trae del ejemplo: base de datos de servidor, migrador, aplicación de consola, aplicación en memoria y documentación generada.
- `AGENT.md` pasa a llamarse `AGENTS.md`. El manual sigue en la raíz. Dentro, los enlaces y el árbol de carpetas señalan `docs/CONSTITUTION.md` y `AGENTS.md`. El orden spec, plan, tareas e implementación se queda.
- En `README.md` solo se actualizan los dos enlaces a esos archivos, para que no queden rotos.

Código. Tres capas, y nada más:

- Reglas, en `asistencia/reglas/`: lo que hoy está en `codes.py` y `names.py`. No importa Flask ni SQLite.
- Acciones, en `asistencia/acciones.py`: abrir una clase, registrarse, ver la lista, quitar un registro, cerrar la clase y descargar la lista. Reciben el guardado ya abierto. No conocen la web.
- Bordes: `app.py` sigue siendo la web y el arranque. `db.py` sigue siendo el guardado en SQLite. `export.py` sigue siendo el CSV. `tunnel.py` sigue siendo el túnel. `app.py` deja de decidir la regla: llama a las acciones.

No se crean interfaces, presentadores ni un archivo por cada acción. No se añaden dependencias. Las pantallas de `static/` no cambian. Las specs 001 a 004 no se reescriben.

Los tests siguen cubriendo los mismos casos. Si una función cambia de módulo, el import del test cambia con ella.

## 2. Comprobación de la constitución

- P1. No cambia el registro de asistencia ni lo ata a una plataforma.
- P2. El cambio es la separación mínima: dos módulos de reglas, un módulo de acciones y los bordes que ya existen. No se copia la estructura del ejemplo.
- P3. No se añade ninguna dependencia. Siguen Flask y pytest.
- P4. No se guardan datos nuevos. Sigue siendo el nombre y la hora, en local.
- P5. No se cambian pantallas.
- P6. `ARCHITECTURE.md` y el manual quedan en español. Los nombres de código pueden seguir en inglés.
- §5. CA-01 y CA-03 se comprueban mirando los archivos. CA-02 se comprueba leyendo `docs/ARCHITECTURE.md`. CA-04 se comprueba con `pytest`. CA-05 se comprueba viendo que `requirements.txt` no gana líneas.
- §6. No cambia cómo se valida el código, la sesión ni el nombre. Solo cambia el archivo donde vive esa validación.

## 3. Fuera de este plan

La redacción y el movimiento de archivos esperan la aprobación de las tareas.
