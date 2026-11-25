"""Genera logs de ejemplo y dos configuraciones: una válida (con un fichero lento) y otra con logs que faltan."""
import random
from pathlib import Path

DIR = Path(__file__).parent / "datos"
DIR.mkdir(exist_ok=True)
random.seed(28)
RUTAS = ["/", "/login", "/api/items", "/api/items/42", "/static/app.js", "/health"]
ESTADOS = ["200"] * 16 + ["304", "404", "500"]

for nombre, n in [("web1.log", 400), ("web2.log", 250), ("lento.log", 100)]:
    lineas = []
    for _ in range(n):
        ip = f"10.0.0.{random.randint(1, 50)}"
        metodo = random.choice(["GET", "GET", "GET", "POST"])
        ms = round(random.lognormvariate(3.5, 0.6), 1)
        lineas.append(f'{ip} "{metodo} {random.choice(RUTAS)}" {random.choice(ESTADOS)} {ms}ms')
    lineas.insert(10, "esto no es una línea de log")
    (DIR / nombre).write_text("\n".join(lineas) + "\n", encoding="utf-8")

(DIR / "config.toml").write_text(
    'timeout_s = 0.5\ntop_rutas = 3\n\n'
    '[[logs]]\nruta = "web1.log"\n\n'
    '[[logs]]\nruta = "web2.log"\n\n'
    '[[logs]]\nruta = "lento.log"\nretardo_s = 2.0\n',
    encoding="utf-8",
)
(DIR / "config_rota.toml").write_text(
    'timeout_s = 0.5\n\n[[logs]]\nruta = "web1.log"\n\n[[logs]]\nruta = "no_existe.log"\n\n'
    '[[logs]]\nruta = "tampoco.log"\n',
    encoding="utf-8",
)
print("datos en", DIR)
