# ChromaDB

RAG basado en [ChromaDB](https://www.trychroma.com/) con la documentación oficial de Python. Sirve para que un agente consulte esa documentación cuando genera código, en vez de fiarse de lo que recuerda de otras versiones. La versión la eliges tú al descargarla: `3.15`, `3.14`, `3.13`…

Todo corre en tu equipo: ChromaDB guarda el índice en `chroma_db/` y [Ollama](https://ollama.com/) convierte los textos en vectores con el modelo `qwen3-embedding:0.6b`.

Los comandos de más abajo se ejecutan desde `staff/raul-santamaria/ChromaDB`. Crear y activar el entorno virtual cambia entre macOS y Windows. Con el entorno activo, los comandos que siguen son los mismos en los dos sistemas. El prompt muestra `(.venv)` al principio de la línea.

## Cómo funciona

```
python-docs-md/  ── build_index.py ──►  chroma_db/   (una vez, en tu equipo)
                                            │
agente ── search.py "pregunta" ─────────────┤  busca por significado
agente ── get_doc.py pathlib.Path.open ─────┘  busca por nombre exacto
```

- `python-docs-md/` es esa documentación en Markdown. No viene en el repositorio: se genera en tu equipo a partir del HTML oficial.
- `build_index.py` la trocea en unos 11.000 fragmentos, calcula sus vectores con Ollama y los guarda en `chroma_db/`.
- `search.py` y `get_doc.py` son los comandos que usa el agente. `skills/python-docs/SKILL.md` le explica cómo.

El CRUD de usuarios con Jupyter, más abajo, es otro ejercicio: guarda los usuarios en SQLite.

## Requisitos

- Python 3.10 o superior.
- [Ollama](https://ollama.com/download) instalado y en marcha.
- Unos 2 GB libres: 640 MB del modelo, las dependencias y el índice.
- GPU opcional. En un Mac con chip Apple, Ollama usa esa GPU. En Windows, usa una NVIDIA si los drivers están instalados. Sin GPU, usa el procesador y el indexado tarda más.

Comprueba Python antes de seguir:

macOS, en Terminal:

```bash
python3 --version
```

Windows, en PowerShell:

```powershell
py -3 --version
```

Tiene que salir `3.10` o más. En macOS el comando es `python3`. En Windows usa `py -3`, el lanzador que instala Python desde [python.org](https://www.python.org/downloads/). Si `py` no se reconoce y `python --version` muestra 3.10 o más, crea el entorno con `python -m venv .venv`. Si `python` abre la Microsoft Store, instálalo desde python.org, marca **Add python.exe to PATH** y abre una terminal nueva.

Ollama, después de instalarlo:

- macOS: queda un icono en la barra de menú. Si no está, abre la app Ollama.
- Windows: queda un icono en la bandeja del sistema, junto al reloj. Si no está, ábrelo desde el menú Inicio.

Cierra la terminal en la que instalaste Ollama y abre otra. El instalador cambia el PATH y la terminal vieja no lo ve. Comprueba:

```bash
ollama --version
```

## Instalación

Desde la raíz del repositorio:

```bash
cd staff/raul-santamaria/ChromaDB
```

Ese `cd` vale en Terminal, PowerShell y el Símbolo del sistema.

### macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Windows (PowerShell)

```powershell
py -3 -m venv .venv
.venv\Scripts\Activate.ps1
```

Si PowerShell dice que la ejecución de scripts está deshabilitada, permite el script en esa ventana y actívalo otra vez. El permiso dura solo mientras la ventana siga abierta:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.venv\Scripts\Activate.ps1
```

En el Símbolo del sistema (cmd) los dos comandos son estos:

```bat
py -3 -m venv .venv
.venv\Scripts\activate.bat
```

### Dependencias y modelo

Con `(.venv)` visible en el prompt, en macOS y en Windows:

```bash
python -m pip install -r requirements.txt
ollama pull qwen3-embedding:0.6b
```

`ollama list` tiene que mostrar `qwen3-embedding:0.6b`.

### Cada terminal nueva

El entorno y el modelo se quedan instalados. En cada terminal hace falta entrar en la carpeta y activar el entorno otra vez. Ollama tiene que seguir en marcha (icono en la barra de menú o en la bandeja).

macOS:

```bash
cd staff/raul-santamaria/ChromaDB
source .venv/bin/activate
```

Windows (PowerShell):

```powershell
cd staff/raul-santamaria/ChromaDB
.venv\Scripts\Activate.ps1
```

Si esa ventana también bloquea el script, ejecuta antes el `Set-ExecutionPolicy` de la instalación.

## Descargar la documentación

`python-docs-md/` se crea aquí, en tu equipo. Los dos comandos son iguales en macOS y en Windows, con el entorno activo. `3.15` es un ejemplo: pon la versión que quieras.

```bash
python scripts/download_docs.py 3.15
python scripts/convert_docs.py
```

La versión es la de la documentación, como en `docs.python.org/3.15/`. También vale `3.14` o `3.13`. El parche no se escribe: `3.15.2` no existe como archivo; la web publica un zip por versión (`3.15`).

`download_docs.py` baja el HTML oficial y lo deja en `python-docs/`. `convert_docs.py` borra `python-docs-md/` si ya existía y la crea de nuevo. Las dos carpetas se quedan en tu equipo y no van a git. Al terminar, `convert_docs.py` imprime cuántas páginas convirtió. `python-docs-md/LICENSE.md` lleva el aviso de copyright y la licencia de la documentación de Python.

Para usar otra versión, vuelve a lanzar los dos comandos con el número nuevo y después reconstruye el índice.

## Construir el índice

Con el entorno activo y Ollama en marcha:

```bash
python scripts/build_index.py
```

Borra el índice anterior, si lo hay, y lo crea de nuevo. Con GPU tarda unos minutos (en una NVIDIA RTX 4070 Laptop, unos 5). Sin GPU, bastante más. Al terminar imprime cuántos fragmentos hay por área y una línea `Collection python_3_15_docs: ... chunks`. El nombre lleva la versión: con `3.14` sería `python_3_14_docs`.

Antes de indexar puedes revisar el troceado. Tarda unos segundos y solo lee los Markdown:

```bash
python scripts/count_chunks.py
```

Vuelve a construir el índice si descargas otra versión o si cambias el modelo o los tamaños de `scripts/settings.py`.

Si el comando termina con un error:

- `Ollama is not running` — abre la app de Ollama y espera a que aparezca el icono. Vuelve a lanzar el script.
- `Model qwen3-embedding:0.6b not found` — ejecuta otra vez `ollama pull qwen3-embedding:0.6b`.

## Consultar

Buscar por significado. Hace falta Ollama en marcha, porque la pregunta se convierte en un vector:

```bash
python scripts/search.py "read the contents of a text file"
python scripts/search.py "lazy imports" --kind whatsnew
python scripts/search.py "write json to a file" --module json -n 3
```

Buscar por nombre exacto. Este comando lee el índice en local:

```bash
python scripts/get_doc.py pathlib.Path.read_text
```

Si el nombre no existe en la versión descargada, responde `not found in Python 3.15 docs` (con el número de esa versión).

Si cualquiera de los dos dice `Index not found`, el índice aún no está construido: ejecuta `python scripts/build_index.py`.

Las comillas dobles de estos ejemplos valen igual en Terminal y en PowerShell.

## Usarlo desde un agente

`skills/python-docs/SKILL.md` es la skill `python-docs`. Le dice al agente cuándo consultar, qué comando usar y cómo citar la fuente. El fichero empieza por el frontmatter: el `name` es `python-docs`.

`agents/developer.md` le dice al agente que siga esa skill. Hace falta el índice construido y, para las búsquedas por significado, Ollama en marcha.

Para usarla fuera de este proyecto, copia la carpeta `skills/python-docs/` a `.cursor/skills/python-docs/`. El nombre de la carpeta tiene que coincidir con el `name` del frontmatter.

## Ver los datos con ChromaDash

`chromadash/` es [ChromaDash](https://github.com/coffeecodeconverter/ChromaDash), un visor web de ChromaDB, parcheado para la API v2 de Chroma 1.x. Sirve para mirar el índice en el navegador. Las consultas de la sección anterior siguen igual sin él.

El visor necesita el servidor de Chroma. Arráncalo desde `staff/raul-santamaria/ChromaDB`, con el entorno virtual activo:

```bash
chroma run chromadash/chroma-cors.yaml
```

`chromadash/chroma-cors.yaml` abre `./chroma_db` en el puerto 8000 y permite que el navegador se conecte (CORS). El servidor usa esa ruta relativa, por eso el comando se lanza desde `staff/raul-santamaria/ChromaDB`.

Abre `chromadash/index.html` en el navegador (doble clic en el fichero) y conecta a `http://localhost:8000`. Desde la terminal, con el servidor ya arrancado en otra ventana:

macOS:

```bash
open chromadash/index.html
```

Windows (PowerShell):

```powershell
Start-Process chromadash/index.html
```

Para el servidor antes de lanzar un script que escriba en `chroma_db/`, por ejemplo `build_index.py`. Cuando termines de mirar los datos, páralo con `Ctrl+C` en la terminal donde está corriendo. `Ctrl+C` es igual en macOS y en Windows.

## CRUD de usuarios con Jupyter

`src/` tiene un CRUD de usuarios (nombre, email, edad y género) sobre SQLite. Es aparte del RAG: no usa ChromaDB ni Ollama. Las capas se explican en `docs/CONSTITUTION.md`.

Desde `staff/raul-santamaria/ChromaDB`, con el entorno virtual activo:

```bash
python -m jupyter notebook src/clients/jupyter
```

Esa carpeta importa: los notebooks suben dos niveles desde ahí hasta `src/` para encontrar el código. Ábrelos desde la lista que muestra Jupyter.

`python -m jupyter` usa el Jupyter del entorno virtual, el mismo en macOS y en Windows.

Hay un notebook por acción: `create_user`, `read_users`, `update_user` y `delete_user`. Cada uno tiene pasos numerados: primero se ejecuta la celda «1. Prepara el notebook» y después, en la celda de la acción, se cambian los datos y se ejecuta. `gender` admite `male`, `female` y `undefined`.

La base de datos se crea sola la primera vez, en `src/db/users.sqlite`. No va a git. Para empezar de cero, para Jupyter y borra ese fichero.

macOS:

```bash
rm src/db/users.sqlite
```

Windows (PowerShell):

```powershell
Remove-Item src/db/users.sqlite
```

Cuando termines, para Jupyter con `Ctrl+C` en la terminal.
