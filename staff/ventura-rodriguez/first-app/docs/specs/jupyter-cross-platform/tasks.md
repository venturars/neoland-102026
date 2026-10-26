# Tareas — arranque de Jupyter en Linux y Windows

1. Revisar `package.json` y el arranque de `docs/specs/jupyter-client/plan.md`.
   Identificar los comandos de shell y las rutas que dependen de Linux.

2. Crear `scripts/start-jupyter.js`.
   Resolver la raíz y seleccionar el Python del entorno según el sistema.
   Añadir un comentario corto que explique esa selección.

3. Añadir al lanzador la preparación del entorno y de Notebook según el plan.
   Reutilizar la instalación cuando ya tenga `notebook==7.6.3`.
   Mostrar los errores y terminar si falla cualquier preparación.

4. Añadir el arranque de Notebook con el Python del entorno local.
   Conectar la entrada y la salida a la terminal y propagar el código de salida.

5. Cambiar `scripts.jupyter` de `package.json` al lanzador Node.
   Actualizar el arranque en el plan y las tareas 2, 13 y 14 de `jupyter-client`.

6. Ejecutar `pnpm jupyter` en Windows y comprobar los nueve notebooks.
   Comprobar la primera preparación en una copia temporal de la app.
   Comprobar que una segunda ejecución reutiliza el entorno.

7. Comprobar Linux real si está disponible, o las rutas y procesos simulados.
   Comprobar los fallos de Python ausente, preparación y arranque.
   Registrar qué sistemas se han ejecutado realmente.

## Comprobaciones realizadas

- Windows: `pnpm jupyter` arranca con el entorno existente y expone los nueve
  notebooks por la API de contenidos.
- Windows: primera instalación real en una copia temporal con espacios en la
  ruta; prepara el entorno y Notebook y expone los nueve documentos.
- Windows: segunda ejecución de esa copia; abre los nueve notebooks sin
  reinstalar paquetes. Los servidores de prueba se detuvieron después.
- Once escenarios con procesos simulados: Windows y Linux, primera preparación,
  reutilización, alternativa `py -3`, Python ausente, pip ausente y fallos de
  creación del entorno, preparación de pip, instalación, arranque y ejecución.
- `node --check scripts/start-jupyter.js` y `git diff --check` pasan.
- Linux real queda pendiente: WSL no está instalado en este equipo.
- Jupyter emite un aviso interno de Yarn al arrancar desde este proyecto ESM;
  el servidor continúa y la API devuelve los nueve notebooks.
