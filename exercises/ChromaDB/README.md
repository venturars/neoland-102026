# ChromaDB

RAG basado en [ChromaDB](https://www.trychroma.com/) con la documentación de Python 3.15. Sirve para que nuestro agente recupere información de esa versión de Python cuando necesite generar código.

> Estado: en construcción. De momento solo está preparada la instalación de ChromaDB.

## Requisitos

- Python 3.10 o superior.
- `pip`.

## Instalación

Desde la raíz del repositorio:

```bash
cd exercises/ChromaDB
python -m venv .venv
```

Activa el entorno virtual:

- Windows (PowerShell): `.venv\Scripts\Activate.ps1`
- macOS / Linux: `source .venv/bin/activate`

Instala las dependencias:

```bash
pip install -r requirements.txt
```

## Comprobar que funciona

```bash
python -c "import chromadb; print(chromadb.__version__)"
```

Debe imprimir `1.5.9`.

## Ver los datos con ChromaDash

`chromadash/` es [ChromaDash](https://github.com/coffeecodeconverter/ChromaDash), un visor web de ChromaDB, parcheado para la API v2 de Chroma 1.x.

El visor necesita el servidor de Chroma. Arráncalo desde `exercises/ChromaDB`, con el entorno virtual activo:

```bash
chroma run chromadash/chroma-cors.yaml
```

`chromadash/chroma-cors.yaml` abre `./chroma_db` en el puerto 8000 y permite que el navegador se conecte (CORS). Por eso hay que lanzarlo desde `exercises/ChromaDB`.

Después abre `chromadash/index.html` en el navegador y conecta a `http://localhost:8000`.

No arranques el servidor mientras un script escribe en `chroma_db/`. Cuando termines, páralo con `Ctrl+C`.

## Qué viene después

1. Descargar la documentación de Python 3.15.
2. Trocearla e indexarla en una colección de ChromaDB.
3. Consultar la colección para recuperar los fragmentos relacionados con una pregunta.
