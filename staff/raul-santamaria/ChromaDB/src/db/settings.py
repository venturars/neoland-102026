from pathlib import Path

DB_DIR = Path(__file__).resolve().parent
DB_PATH = DB_DIR / "users.sqlite"
SCHEMA_PATH = DB_DIR / "schema.sql"
