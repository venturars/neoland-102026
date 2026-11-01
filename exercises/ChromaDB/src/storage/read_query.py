from pathlib import Path

QUERIES_DIR = Path(__file__).resolve().parent / "queries"


def read_query(name: str) -> str:
    path = QUERIES_DIR / f"{name}.sql"
    if not path.exists():
        raise RuntimeError(f"Query not found: {path}")

    return path.read_text(encoding="utf-8")
