# Plan — arranque de Jupyter en Linux y Windows

Issue: #382. Este desarrollo actualiza el arranque descrito en
`docs/specs/jupyter-client/plan.md` para admitir ambos sistemas.

## Ficheros

- Crear `scripts/start-jupyter.js` como lanzador de Node con módulos ES.
- Cambiar únicamente `scripts.jupyter` de `package.json` a
  `node scripts/start-jupyter.js`.
- Actualizar el apartado de arranque de `docs/specs/jupyter-client/plan.md` y
  las tareas 2, 13 y 14 de su `tasks.md` para describir el comando compatible.

## Arranque

El lanzador obtiene la raíz de la app a partir de su propia ubicación.
Usa `node:path` para las rutas y `node:child_process` para ejecutar programas
con argumentos separados y sin comandos de shell.

En Windows utiliza `.venv/Scripts/python.exe`; en Linux, `.venv/bin/python`.
Si no existe ese intérprete, busca Python 3: `python`, `py -3`, `python3` en
Windows; `python3`, `python` en Linux. Comprueba que el candidato ejecuta
Python 3 antes de crear el entorno con `-m venv .venv`.

Con el Python del entorno comprueba si está instalado `notebook==7.6.3`.
Si falta o tiene otra versión, comprueba pip, lo prepara con `ensurepip` si
falta e instala `notebook==7.6.3` con `-m pip install`.
Si ya está esa versión, no instala nada.

Arranca ese mismo Python con `-m notebook clients/jupyter`, desde la raíz de
la app y con entrada y salida conectadas a la terminal. Conserva la apertura
del navegador y la interfaz Notebook. Propaga los fallos de los procesos.
El proceso recibe `PYTHONUTF8=1`, que heredan sus kernels: así pueden leer
las tablas UTF-8 que devuelve Node en Windows, sin intentar decodificarlas
como CP1252.

El código y los textos se guardan en UTF-8. Un comentario corto explica la
selección de rutas por sistema operativo.

## Contrato

Es un cambio de configuración. No hay función nueva de `logic/`, firma pública
ni SQL nuevo. La referencia es el arranque existente, no una acción de negocio.

Los errores de preparación pertenecen al lanzador. Si no encuentra Python 3,
muestra `Python 3 is required to start Jupyter.`. Los demás fallos muestran el
error del proceso y devuelven un código distinto de cero.

## Comprobación

Comprobar el arranque real en Windows y la respuesta de la interfaz con los
nueve notebooks. Comprobar también una preparación inicial en una copia
temporal, sin sustituir el entorno local existente.

Comprobar en Linux con un entorno disponible. Si no hay Linux ejecutable,
comprobar la selección de rutas y comandos con procesos simulados y dejar
expresamente pendiente la validación real en Linux.
