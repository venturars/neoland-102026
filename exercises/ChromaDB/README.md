# ChromaDB

RAG basado en [ChromaDB](https://www.trychroma.com/) con la documentación oficial de Python 3.15. Sirve para que un agente consulte esa documentación cuando genera código, en vez de fiarse de lo que recuerda de versiones anteriores.

Todo corre en tu equipo: ChromaDB guarda el índice en `chroma_db/` y [Ollama](https://ollama.com/) convierte los textos en vectores con el modelo `qwen3-embedding:0.6b`.

## Cómo funciona

```
python-docs-md/  ── build_index.py ──►  chroma_db/   (una vez, en tu equipo)
                                            │
agente ── search.py "pregunta" ─────────────┤  busca por significado
agente ── get_doc.py pathlib.Path.open ─────┘  busca por nombre exacto
```

- `python-docs-md/` es la documentación de Python 3.15 en Markdown. Va en el repositorio, así que no tienes que descargar nada.
- `build_index.py` la trocea en unos 11.000 fragmentos, calcula sus vectores con Ollama y los guarda en `chroma_db/`.
- `search.py` y `get_doc.py` son los comandos que usa el agente. `SKILL.md` le explica cómo.

## Requisitos

- Python 3.10 o superior.
- [Ollama](https://ollama.com/download) instalado y arrancado.
- Unos 2 GB libres: 640 MB del modelo, las dependencias y el índice.
- GPU opcional. Sin GPU, Ollama usa el procesador y el indexado tarda más.

## Instalación

Desde la raíz del repositorio:

```bash
cd exercises/ChromaDB
python -m venv .venv
```

Activa el entorno virtual:

- Windows (PowerShell): `.venv\Scripts\Activate.ps1`
- macOS / Linux: `source .venv/bin/activate`

Instala las dependencias y descarga el modelo:

```bash
pip install -r requirements.txt
ollama pull qwen3-embedding:0.6b
```

## Construir el índice

```bash
python scripts/build_index.py
```

Borra el índice anterior, si lo hay, y lo crea de nuevo. Con una GPU NVIDIA RTX 4070 Laptop tarda unos 5 minutos; sin GPU, bastante más. Al terminar imprime cuántos fragmentos hay por área.

Antes de indexar puedes revisar el troceado, que tarda unos segundos y no usa Ollama:

```bash
python scripts/count_chunks.py
```

Vuelve a construir el índice si cambia `python-docs-md/` o si cambias el modelo o los tamaños de `scripts/settings.py`.

## Consultar

Buscar por significado:

```bash
python scripts/search.py "read the contents of a text file"
python scripts/search.py "lazy imports" --kind whatsnew
python scripts/search.py "write json to a file" --module json -n 3
```

Buscar por nombre exacto:

```bash
python scripts/get_doc.py pathlib.Path.read_text
```

Si el nombre no existe en Python 3.15, responde `not found in Python 3.15 docs`.

## Usarlo desde un agente

`SKILL.md` es la skill `python-3-15-docs`. Le dice al agente cuándo consultar, qué comando usar y cómo citar la fuente. Se instala como las demás skills del repositorio: los pasos están en el `README.md` de la raíz.

## Ver los datos con ChromaDash

`chromadash/` es [ChromaDash](https://github.com/coffeecodeconverter/ChromaDash), un visor web de ChromaDB, parcheado para la API v2 de Chroma 1.x.

El visor necesita el servidor de Chroma. Arráncalo desde `exercises/ChromaDB`, con el entorno virtual activo:

```bash
chroma run chromadash/chroma-cors.yaml
```

`chromadash/chroma-cors.yaml` abre `./chroma_db` en el puerto 8000 y permite que el navegador se conecte (CORS). Por eso hay que lanzarlo desde `exercises/ChromaDB`.

Después abre `chromadash/index.html` en el navegador y conecta a `http://localhost:8000`.

No arranques el servidor mientras un script escribe en `chroma_db/`. Cuando termines, páralo con `Ctrl+C`.

## Regenerar el Markdown

Solo hace falta cuando sale una versión nueva de la documentación. Lo hace una persona y sube el resultado.

1. Descarga la documentación de Python 3.15 en HTML desde [docs.python.org/3.15/download.html](https://docs.python.org/3.15/download.html).
2. Descomprímela en `python-docs/python-3.15-docs-html/`. Esa carpeta no va a git.
3. Ejecuta:

   ```bash
   python scripts/convert_docs.py
   ```

   Borra `python-docs-md/` y la crea de nuevo. Convertir dos veces la misma documentación da los mismos ficheros.

4. Revisa el diff y haz commit de `python-docs-md/`.

`python-docs-md/LICENSE.md` lleva el aviso de copyright y la licencia de la documentación de Python.
