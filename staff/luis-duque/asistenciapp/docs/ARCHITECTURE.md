# Arquitectura de AsistenciApp

Este archivo dice cómo se parte el código. La constitución dice qué no se negocia. El manual `AGENTS.md` dice cómo se trabaja.

## Tres capas

- **Reglas.** Qué es válido en una clase y en un registro: el código que rota y el nombre del alumno. Viven en `asistencia/reglas/`. No conocen la web ni el guardado.
- **Acciones.** Lo que se hace al pasar lista: abrir una clase, registrarse, ver la lista, quitar un registro, cerrar la clase y descargar la lista. Viven en `asistencia/acciones.py`. Reciben el guardado ya abierto y no conocen la web.
- **Bordes.** Por donde entra y sale el mundo: la web y el arranque en `app.py`, el guardado en `asistencia/db.py`, el CSV en `asistencia/export.py` y el túnel en `asistencia/tunnel.py`. La web llama a las acciones y no decide la regla.

## Qué no se trae

La idea de separar reglas, acciones y bordes sale de un ejemplo de arquitectura limpia. De ese ejemplo no se trae:

- la base de datos de servidor
- el migrador
- la aplicación de consola
- la aplicación en memoria
- la documentación generada

Tampoco se crean interfaces, presentadores ni un archivo por cada acción. No se añaden dependencias.
