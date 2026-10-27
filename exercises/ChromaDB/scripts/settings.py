from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent
HTML_DIR = PROJECT_DIR / "python-docs" / "python-3.15-docs-html"
MD_DIR = PROJECT_DIR / "python-docs-md"
DB_DIR = PROJECT_DIR / "chroma_db"

COLLECTION = "python_3_15_docs"
MODEL = "qwen3-embedding:0.6b"
VERSION = "3.15"

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
EXTRA_PAGES = [
    "glossary.html",
    "whatsnew/3.15.html",
]
CHANGELOG_PAGE = "whatsnew/changelog.html"
# Del changelog solo entran las releases cuyo título empieza así
CHANGELOG_RELEASES = ["Python next", "Python 3.15"]
LICENSE_PAGES = ["copyright.html", "license.html"]

# Tamaños de los fragmentos, en caracteres
MERGE_BELOW = 400
MERGE_MAX = 2000
SPLIT_ABOVE = 3200

BATCH_SIZE = 32

# Qwen3-Embedding pide una instrucción delante de las preguntas, no de los documentos
QUERY_INSTRUCTION = "Given a question about Python 3.15, retrieve the documentation passages that answer it"
