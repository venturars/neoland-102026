from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent
MD_DIR = PROJECT_DIR / "python-docs-md"
DB_DIR = PROJECT_DIR / "chroma_db"

# La escribe download_docs.py. Sin este fichero aún no hay documentación descargada.
VERSION_FILE = PROJECT_DIR / "python-docs" / "version.txt"
VERSION = ""
if VERSION_FILE.is_file():
    VERSION = VERSION_FILE.read_text(encoding="utf-8").strip()

HTML_DIR = PROJECT_DIR / "python-docs" / f"python-{VERSION}-docs-html"
COLLECTION = "python_docs"
if VERSION != "":
    COLLECTION = "python_" + VERSION.replace(".", "_") + "_docs"
MODEL = "qwen3-embedding:0.6b"

# Carpetas de la documentación que entran enteras (menos su index.html)
AREAS = [
    "builtins",
    "c-api",
    "deprecations",
    "distributing",
    "extending",
    "faq",
    "howto",
    "installing",
    "library",
    "reference",
    "tutorial",
    "using",
]
# Páginas sueltas que también entran
EXTRA_PAGES = ["glossary.html"]
if VERSION != "":
    EXTRA_PAGES.append(f"whatsnew/{VERSION}.html")
CHANGELOG_PAGE = "whatsnew/changelog.html"
# Del changelog solo entran las releases cuyo título empieza así
CHANGELOG_RELEASES = ["Python next"]
if VERSION != "":
    CHANGELOG_RELEASES.append(f"Python {VERSION}")
LICENSE_PAGES = ["copyright.html", "license.html"]

# Tamaños de los fragmentos, en caracteres
MERGE_BELOW = 400
MERGE_MAX = 2000
SPLIT_ABOVE = 3200

BATCH_SIZE = 32
# Tokens que Ollama deja leer al modelo. El fragmento más grande tiene unos 5.700.
# Más contexto gasta más memoria; menos haría fallar los fragmentos grandes.
NUM_CTX = 8192
# Reintentos si Ollama se cae a mitad de un lote, y segundos de pausa entre ellos
EMBED_RETRIES = 3
EMBED_PAUSE = 5

# Qwen3-Embedding pide una instrucción delante de las preguntas, no de los documentos
QUERY_INSTRUCTION = "Given a question about Python, retrieve the documentation passages that answer it"
if VERSION != "":
    QUERY_INSTRUCTION = f"Given a question about Python {VERSION}, retrieve the documentation passages that answer it"
